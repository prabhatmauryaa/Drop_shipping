"use client";

import React, { useState, useEffect } from "react";

import AdminLayout from "../../../components/AdminLayout";
import { Settings, User, Lock, Bell, Shield, Save, Globe, Smartphone, Mail } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios"; 

export default function SettingsPage() {
    const role = 'supplier';
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState("profile");
    const [loading, setLoading] = useState(false);

    // Form states
    const [profileData, setProfileData] = useState({ name: "", email: "" });
    const [passwordData, setPasswordData] = useState({ current: "", new: "", confirm: "" });
    const [notifications, setNotifications] = useState({
        orders: true,
        returns: true,
        system: true
    });

    useEffect(() => {
        const storedUser = localStorage.getItem("dropsync_user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setProfileData({ name: parsedUser.name, email: parsedUser.email });
        }
    }, []);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Placeholder for API call
            toast.success("Profile updated successfully (Simulator)");
            // In a real app: await axios.put('/api/users/profile', profileData);
        } catch (error) {
            toast.error("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwordData.new !== passwordData.confirm) {
            toast.error("New passwords do not match");
            return;
        }
        setLoading(true);
        try {
            toast.success("Password changed successfully (Simulator)");
            setPasswordData({ current: "", new: "", confirm: "" });
        } catch (error) {
            toast.error("Failed to update password");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleNotification = (id, name) => {
        setNotifications(prev => {
            const newState = { ...prev, [id]: !prev[id] };
            toast.success(`${name} ${newState[id] ? 'enabled' : 'disabled'}`, {
                icon: newState[id] ? "🔔" : "🔕",
                style: {
                    borderRadius: '10px',
                    background: '#1e293b',
                    color: '#fff',
                    border: '1px solid #334155'
                },
            });
            return newState;
        });
    };

    if (!user) return null;

    const tabs = [
        { id: "profile", name: "Profile Settings", icon: <User className="w-4 h-4" /> },
        { id: "security", name: "Security", icon: <Lock className="w-4 h-4" /> },
        { id: "notifications", name: "Notifications", icon: <Bell className="w-4 h-4" /> },
    ];

    return (
        <AdminLayout>
            <Toaster position="top-right" />
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Settings className="w-8 h-8 text-blue-500" /> Account Settings
                </h1>
                <p className="text-slate-400 mt-1">Manage your {role} profile and preferences.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Tabs */}
                <div className="w-full lg:w-64 shrink-0 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                                activeTab === tab.id
                                    ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-sm"
                                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                            }`}
                        >
                            {tab.icon}
                            {tab.name}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    <div className="glass rounded-3xl border border-slate-700/50 p-8 shadow-xl shadow-blue-500/5 min-h-[500px]">
                        {activeTab === "profile" && (
                            <form onSubmit={handleProfileUpdate} className="max-w-xl space-y-6">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <User className="text-blue-400" /> Public Profile
                                </h3>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                                    <input 
                                        type="text" 
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
                                    <input 
                                        type="email" 
                                        value={profileData.email}
                                        disabled
                                        className="w-full bg-slate-800/30 border border-slate-800 rounded-xl px-4 py-3 text-slate-500 cursor-not-allowed"
                                    />
                                    <p className="text-[10px] text-slate-500 mt-2 italic">Email is used for primary authentication and cannot be changed.</p>
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20"
                                >
                                    <Save className="w-4 h-4" /> Save Profile Changes
                                </button>
                            </form>
                        )}

                        {activeTab === "security" && (
                            <form onSubmit={handlePasswordUpdate} className="max-w-xl space-y-6">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Lock className="text-red-400" /> Security & Password
                                </h3>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Current Password</label>
                                    <input 
                                        type="password" 
                                        value={passwordData.current}
                                        onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">New Password</label>
                                    <input 
                                        type="password" 
                                        value={passwordData.new}
                                        onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Confirm New Password</label>
                                    <input 
                                        type="password" 
                                        value={passwordData.confirm}
                                        onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all"
                                >
                                    Update Password
                                </button>
                            </form>
                        )}

                        {activeTab === "notifications" && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Bell className="text-yellow-400" /> Notification Preferences
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { id: "orders", name: "Order Notifications", desc: "Get notified when a new order is placed or updated.", icon: <Mail /> },
                                        { id: "returns", name: "Return Alerts", desc: "Receive alerts for new return and refund requests.", icon: <Smartphone /> },
                                        { id: "system", name: "System Updates", desc: "Stay informed about platform maintenance and new features.", icon: <Globe /> },
                                    ].map((item) => (
                                        <div key={item.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
                                            <div>
                                                <p className="font-bold text-white text-sm">{item.name}</p>
                                                <p className="text-xs text-slate-500">{item.desc}</p>
                                            </div>
                                            <div className="relative inline-flex items-center cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    className="sr-only peer" 
                                                    checked={notifications[item.id]} 
                                                    onChange={() => handleToggleNotification(item.id, item.name)}
                                                />
                                                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}


                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
