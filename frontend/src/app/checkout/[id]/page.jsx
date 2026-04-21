"use client";

import React, { useEffect, useState, use, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, ShieldCheck, Truck, DollarSign, Home, Box, MapPin, ArrowLeft } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import Script from "next/script";

function CheckoutContent({ params }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qty = parseInt(searchParams.get("qty") || "1", 10);
  
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [address, setAddress] = useState({
    street: "",
    city: "",
    postalCode: "",
    country: "India"
  });
  
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        const found = res.data.find(p => p._id === id);
        if (found) setProduct(found);
        else toast.error("Product not found");
      } catch (err) {
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

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
    const totalPrice = product.price * qty;

    const orderData = {
      orderItems: [{ 
        product: product._id, 
        name: product.title, 
        qty: qty, 
        price: product.price, 
        supplier: product.supplier?._id || product.supplier || product.seller?._id || product.seller || "000000000000000000000000"
      }],
      shippingAddress: { 
        address: address.street, 
        city: address.city, 
        postalCode: address.postalCode, 
        country: address.country 
      },
      paymentMethod,
      itemsPrice: totalPrice,
      totalPrice: totalPrice,
    };

    try {
      if (paymentMethod === "COD") {
        await axios.post("http://localhost:5000/api/orders", orderData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Order Placed Successfully via COD!");
        setTimeout(() => window.location.href = "/dashboard", 1500);
      } 
      else if (paymentMethod === "Razorpay") {
        toast.loading("Initializing Secure Payment...", { id: "payment" });
        const orderRes = await axios.post("http://localhost:5000/api/payments/create-order", 
          { amount: totalPrice }, 
          { headers: { Authorization: `Bearer ${token}` }}
        );
        
        const options = {
          key: "rzp_test_dummykey12345", 
          amount: orderRes.data.amount,
          currency: "INR",
          name: "Vastra culture Marketplace",
          description: `Secure purchase of ${product.title}`,
          order_id: orderRes.data.id, 
          handler: async function (response) {
              toast.loading("Verifying Payment...", { id: "payment" });
              try {
                await axios.post("http://localhost:5000/api/payments/verify", response, { headers: { Authorization: `Bearer ${token}` }});
                await axios.post("http://localhost:5000/api/orders", orderData, { headers: { Authorization: `Bearer ${token}` }});
                toast.success("Payment Successful! Order Confirmed.", { id: "payment" });
                setTimeout(() => window.location.href = "/dashboard", 1500);
              } catch (err) {
                toast.error("Payment Verification Failed", { id: "payment" });
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
      toast.error(error.response?.data?.message || "Failed to complete checkout process");
      setIsProcessing(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent flex rounded-full animate-spin"></div></div>;

  if (!product) return null;

  return (
    <div className="min-h-screen w-full relative pt-24 px-4 pb-20 max-w-5xl mx-auto flex flex-col">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
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
        
        {/* Left Form Side */}
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
                    placeholder="Metropolis" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Postal Code</label>
                  <input 
                    type="text" 
                    value={address.postalCode} 
                    onChange={(e) => setAddress({...address, postalCode: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" 
                    placeholder="100001" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Country</label>
                <input 
                  type="text" 
                  value={address.country} 
                  disabled
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-400 cursor-not-allowed" 
                />
              </div>
            </div>
          </div>

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

        {/* Right Summary Side */}
        <div className="w-full lg:w-1/3">
          <div className="glass rounded-2xl border border-slate-700/50 p-6 shadow-xl sticky top-24">
            <h2 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-3">Order Summary</h2>
            
            <div className="flex gap-4 items-center mb-6">
              <div className="w-16 h-16 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden flex-shrink-0">
                {product.imageUrl ? <img src={product.imageUrl} className="w-full h-full object-cover" /> : <Box className="w-8 h-8 m-4 text-slate-500" />}
              </div>
              <div className="flex-1">
                <p className="font-bold text-white line-clamp-1">{product.title}</p>
                <p className="text-sm text-slate-400">Qty: {qty}</p>
                <p className="font-bold text-green-400">₹{product.price.toFixed(2)}</p>
              </div>
            </div>

            <div className="space-y-3 mb-6 pb-6 border-b border-slate-800 text-sm">
              <div className="flex justify-between text-slate-300"><span>Subtotal</span><span>₹{(product.price * qty).toFixed(2)}</span></div>
              <div className="flex justify-between text-slate-300"><span>Shipping</span><span className="text-green-400">Free</span></div>
              <div className="flex justify-between font-bold text-lg text-white pt-2 border-t border-slate-800 mt-2">
                <span>Total</span>
                <span className="text-green-400">₹{(product.price * qty).toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={placeOrder}
              disabled={isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isProcessing ? "Processing..." : `Complete Order (₹${(product.price * qty).toFixed(2)})`}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function CheckoutPage({ params }) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent flex rounded-full animate-spin"></div></div>}>
      <CheckoutContent params={params} />
    </Suspense>
  );
}
