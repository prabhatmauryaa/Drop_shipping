"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, ShieldCheck, Truck, DollarSign, MapPin, ArrowLeft, Trash2, Zap } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Script from "next/script";
import api, { getImageUrl } from "@/lib/api";
import { useCart } from "@/context/CartContext";

function CheckoutContent() {
    const router = useRouter();
    const { clearCart } = useCart();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    const [address, setAddress] = useState({
        street: "",
        city: "",
        postalCode: "",
        state: "",
        country: "India"
    });

    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [isFastDelivery, setIsFastDelivery] = useState(false);
    const [isEligibleForFast, setIsEligibleForFast] = useState(false);
    const [userCoords, setUserCoords] = useState(null);

    // Haversine formula to calculate distance in km
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const [isCheckingFast, setIsCheckingFast] = useState(false);

    useEffect(() => {

        const ustr = localStorage.getItem("dropsync_user");
        if (ustr) {
            try {
                const user = JSON.parse(ustr);
                if (user.role === 'admin' || user.role === 'supplier') {
                    toast.error("Suppliers and Admins are not allowed to place orders.");
                    router.push("/");
                    return;
                }
            } catch (e) {
                console.error(e);
            }
        }

        try {
            const savedCart = localStorage.getItem("dropsync_checkout_cart");

            if (savedCart) {
                const items = JSON.parse(savedCart);
                setCartItems(items);
                // Safe check: Only query location automatically if user has ALREADY granted permission previously
                if (typeof window !== "undefined" && navigator?.permissions?.query) {
                    navigator.permissions.query({ name: "geolocation" }).then((status) => {
                        if (status.state === "granted") {
                            checkQuickDeliveryEligibility(items, false);
                        }
                    }).catch(() => {});
                }
            } else {
                toast.error("No items in cart");
                setTimeout(() => router.push("/cart"), 1500);
            }
        } catch (err) {
            toast.error("Failed to load cart");
            router.push("/cart");
        } finally {
            setLoading(false);
        }
    }, []);

    const checkQuickDeliveryEligibility = async (items, isUserInitiated = false) => {
        if (!navigator.geolocation) {
            if (isUserInitiated) toast.error("Geolocation is not supported by your browser");
            return;
        }

        if (isUserInitiated) setIsCheckingFast(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setUserCoords({ lat: latitude, lng: longitude });

                try {
                    const supplierIds = [...new Set(items.map(item => item.supplier).filter(id => id && id !== "000000000000000000000000"))];

                    if (supplierIds.length === 0) return;

                    const res = await api.post("/users/locations", { ids: supplierIds });

                    const supplierLocations = res.data;
                    let allWithinRange = true;

                    for (const supplier of supplierLocations) {
                        if (supplier.location?.lat && supplier.location?.lng) {
                            const distance = calculateDistance(latitude, longitude, supplier.location.lat, supplier.location.lng);
                            if (distance > 5) {
                                allWithinRange = false;
                                break;
                            }
                        } else {
                            allWithinRange = false;
                            break;
                        }
                    }

                    setIsEligibleForFast(allWithinRange);
                    if (allWithinRange) {
                        toast.success("You are eligible for Quick Delivery! (Under 5km range)", { icon: '⚡' });
                    } else if (isUserInitiated) {
                        toast("Suppliers are farther than 5km. Standard express shipping will be used.", { icon: '📦' });
                    }
                } catch (err) {
                    console.error("Error checking eligibility:", err);
                } finally {
                    if (isUserInitiated) setIsCheckingFast(false);
                }
            },
            (error) => {
                if (isUserInitiated) {
                    toast.error("Location permission denied. Continuing with standard delivery.");
                    setIsCheckingFast(false);
                }
            },
            { timeout: 8000 }
        );
    };

    const placeOrder = async () => {
        if (!address.street || !address.city || !address.postalCode) {
            toast.error("Please fill in all address fields");
            return;
        }

        const token = localStorage.getItem("dropsync_token");
        if (!token) {
            toast.error("Please login to checkout");
            setTimeout(() => router.push("/login"), 1500);
            return;
        }

        setIsProcessing(true);

        const orderItems = cartItems.map(item => ({
            product: item._id,
            name: item.title,
            qty: item.qty,
            price: item.price,
            size: item.size || null,
            supplier: item.supplier || "000000000000000000000000"
        }));

        const itemsPrice = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
        const totalPrice = itemsPrice;

        const orderData = {
            orderItems,
            shippingAddress: {
                address: address.street,
                city: address.city,
                state: address.state,
                postalCode: address.postalCode,
                country: address.country
            },
            paymentMethod,
            itemsPrice,
            totalPrice,
            isFastDelivery: isEligibleForFast && isFastDelivery
        };

        try {
            if (paymentMethod === "COD") {
                await api.post("/orders", orderData);

                clearCart();
                localStorage.removeItem("dropsync_checkout_cart");

                toast.success("Order Placed Successfully!");
                setTimeout(() => window.location.href = "/dashboard", 1500);
            }
            else if (paymentMethod === "Razorpay") {
                toast.loading("Initializing Secure Payment...", { id: "payment" });
                const keyRes = await api.get("/payments/key");

                const orderRes = await api.post("/payments/create-order", { amount: totalPrice });

                const options = {
                    key: keyRes.data.key,
                    amount: orderRes.data.amount,
                    currency: "INR",
                    name: "Vastra culture Marketplace",
                    description: `Secure purchase of ${cartItems.length} items`,
                    order_id: orderRes.data.id,
                    handler: async function (response) {
                        toast.loading("Verifying Payment...", { id: "payment" });
                        try {
                            await api.post("/payments/verify", response);
                            await api.post("/orders", orderData);

                            clearCart();
                            localStorage.removeItem("dropsync_checkout_cart");

                            toast.success("Payment Successful! Order Confirmed.", { id: "payment" });
                            setTimeout(() => window.location.href = "/dashboard", 1500);
                        } catch (err) {
                            toast.error(
                                err.response?.data?.message || "Payment Verification Failed",
                                { id: "payment" }
                            );
                            if (err.response?.status === 401) {
                                setTimeout(() => router.push("/login"), 1200);
                            }
                            setIsProcessing(false);
                        }
                    },
                    theme: { color: "#3b82f6" }
                };

                const rzp = new window.Razorpay(options);
                toast.dismiss("payment");
                rzp.open();

                rzp.on('payment.failed', function (response){
                    toast.error("Payment Failed: " + response.error.description);
                    setIsProcessing(false);
                });
            }
        } catch (error) {
            const message = error.response?.data?.message || "Failed to complete checkout process";
            toast.error(message);
            if (error.response?.status === 401) {
                setTimeout(() => router.push("/login"), 1200);
            }
            setIsProcessing(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent flex rounded-full animate-spin"></div></div>;

    if (cartItems.length === 0) return null;

    const itemsTotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

    return (
        <div className="min-h-screen w-full relative pt-24 px-4 pb-20 max-w-5xl mx-auto flex flex-col">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
            <Toaster position="top-center" />

            <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

            <div className="w-full flex items-center mb-8">
                <button
                    onClick={() => router.back()}
                    className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" /> Back
                </button>
            </div>

            <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-500" /> Secure Checkout
            </h1>

            <div className="flex flex-col lg:flex-row gap-8">

                <div className="w-full lg:w-2/3 space-y-6">
                    <div className="glass rounded-2xl border border-slate-700/50 p-6 shadow-xl">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-800 pb-3">
                            <MapPin className="w-5 h-5 text-blue-400" /> Shipping Address
                        </h2>
                        <div className="space-y-4 pt-2">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Street Address</label>
                                <input
                                    type="text"
                                    value={address.street}
                                    onChange={(e) => setAddress({...address, street: e.target.value})}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                                    placeholder="123 Example Street, Apt 4B"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">City</label>
                                    <input
                                        type="text"
                                        value={address.city}
                                        onChange={(e) => setAddress({...address, city: e.target.value})}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                                        placeholder="Mumbai"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">State</label>
                                    <input
                                        type="text"
                                        value={address.state}
                                        onChange={(e) => setAddress({...address, state: e.target.value})}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                                        placeholder="Maharashtra"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Postal Code</label>
                                <input
                                    type="text"
                                    value={address.postalCode}
                                    onChange={(e) => setAddress({...address, postalCode: e.target.value})}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                                    placeholder="400001"
                                />
                            </div>
                        </div>
                    </div>

                    {isEligibleForFast ? (
                        <div className="glass rounded-2xl border border-yellow-500/30 p-6 shadow-xl bg-yellow-500/5">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0 border border-yellow-500/30">
                                    <Zap className="w-6 h-6 text-yellow-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white mb-1">Quick Delivery Eligible!</h3>
                                    <p className="text-sm text-slate-400 mb-4">All items are within 5km range. Choose Quick Delivery for prioritized handling.</p>
                                    <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${isFastDelivery ? 'bg-yellow-500/20 border-yellow-500 shadow-md' : 'bg-slate-900 border-slate-700 hover:bg-slate-800'}`}>
                                        <input type="checkbox" checked={isFastDelivery} onChange={() => setIsFastDelivery(!isFastDelivery)} className="w-5 h-5 accent-yellow-500" />
                                        <span className="font-bold text-white">Enable Quick Delivery (Free)</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="glass rounded-2xl border border-slate-700/40 p-5 shadow-lg bg-slate-900/30">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center flex-shrink-0 border border-yellow-500/20">
                                        <Zap className="w-5 h-5 text-yellow-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-white">Want Quick Delivery (Under 5km)?</h4>
                                        <p className="text-xs text-slate-400">Check if your delivery location is within 5km of our suppliers.</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => checkQuickDeliveryEligibility(cartItems, true)}
                                    disabled={isCheckingFast}
                                    className="px-4 py-2.5 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isCheckingFast ? "Checking..." : "⚡ Check Quick Delivery"}
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="glass rounded-2xl border border-slate-700/50 p-6 shadow-xl">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-800 pb-3">
                            <DollarSign className="w-5 h-5 text-green-400" /> Payment Method
                        </h2>
                        <div className="space-y-3 pt-2">
                            <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'COD' ? 'bg-blue-600/10 border-blue-500 shadow-md' : 'bg-slate-900 border-slate-700 hover:bg-slate-800'}`}>
                                <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="w-5 h-5 accent-blue-500" />
                                <div className="flex-1">
                                    <p className="font-bold text-white flex items-center gap-2"><Truck className="w-5 h-5 text-blue-400" /> Cash on Delivery (COD)</p>
                                    <p className="text-sm text-slate-400 mt-1">Pay with cash when your package arrives safely.</p>
                                </div>
                            </label>

                            <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'Razorpay' ? 'bg-purple-600/10 border-purple-500 shadow-md' : 'bg-slate-900 border-slate-700 hover:bg-slate-800'}`}>
                                <input type="radio" name="payment" value="Razorpay" checked={paymentMethod === 'Razorpay'} onChange={() => setPaymentMethod('Razorpay')} className="w-5 h-5 accent-purple-500" />
                                <div className="flex-1">
                                    <p className="font-bold text-white flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-purple-400" /> Online Payment (Razorpay)</p>
                                    <p className="text-sm text-slate-400 mt-1">Pay instantly and securely using card or UPI.</p>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-1/3">
                    <div className="glass rounded-2xl border border-slate-700/50 p-6 shadow-xl sticky top-24">
                        <h2 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-3">Order Summary</h2>

                        <div className="space-y-3 max-h-64 overflow-y-auto mb-6 pb-6 border-b border-slate-800">
                            {cartItems.map((item) => (
                                <div key={item._id} className="flex gap-3 items-center bg-slate-900/40 p-3 rounded-lg">
                                    <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden flex-shrink-0">
                                        {item.imageUrl ? (
                                            <img
                                                src={getImageUrl(item.imageUrl)}
                                                alt={item.title}
                                                onError={(e) => { e.target.src = "/placeholder-product.svg"; }}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-slate-700"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-white text-sm line-clamp-1">{item.title}</p>
                                        <p className="text-xs text-slate-400">Qty: {item.qty} {item.size ? `| Size: ${item.size}` : ""}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="font-bold text-green-400 text-sm">₹{(item.price * item.qty).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3 mb-6 pb-6 border-b border-slate-800 text-sm">
                            <div className="flex justify-between text-slate-300"><span>Subtotal</span><span>₹{itemsTotal.toFixed(2)}</span></div>
                            <div className="flex justify-between text-slate-300"><span>Shipping</span><span className="text-green-400">Free</span></div>
                            {isFastDelivery && <div className="flex justify-between text-yellow-400"><span>Quick Delivery</span><span>⚡ Applied</span></div>}
                            <div className="flex justify-between font-bold text-lg text-white pt-2 border-t border-slate-800 mt-2">
                                <span>Total</span>
                                <span className="text-green-400">₹{itemsTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={placeOrder}
                            disabled={isProcessing}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isProcessing ? "Processing..." : `Complete Order (₹${itemsTotal.toFixed(2)})`}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent flex rounded-full animate-spin"></div></div>}>
            <CheckoutContent />
        </Suspense>
    );
}
