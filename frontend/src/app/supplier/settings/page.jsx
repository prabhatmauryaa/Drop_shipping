"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "../../../components/AdminLayout";
import { Settings, User, Lock, Bell, Save, Globe, Smartphone, Mail } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function SupplierSettingsPage() {
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
      setProfileData({ name: parsedUser.name || "", email: parsedUser.email || "" });
    }
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (user) {
        const updated = { ...user, name: profileData.name };
        localStorage.setItem("dropsync_user", JSON.stringify(updated));
        setUser(updated);
      }
      toast.success("Profile updated successfully!");
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
      toast.success("Password changed successfully!");
      setPasswordData({ current: "", new: "", confirm: "" });
    } catch (error) {
      toast.error("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleNotification = (id, name) => {
    setNotifications((prev) => {
      const newState = { ...prev, [id]: !prev[id] };
      toast.success(`${name} ${newState[id] ? "enabled" : "disabled"}`);
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
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 rounded-2xl border border-indigo-100 text-indigo-600">
            <Settings className="w-7 h-7" />
          </div>
          Account Settings
        </h1>
        <p className="text-slate-500 mt-1 text-sm">Manage your supplier credentials, security, and alert preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 shrink-0 space-y-1.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-xs ${
                activeTab === tab.id
                  ? "bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm min-h-[450px]">
            {activeTab === "profile" && (
              <form onSubmit={handleProfileUpdate} className="max-w-lg space-y-5">
                <div className="border-b border-slate-100 pb-4 mb-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <User className="text-indigo-600 w-5 h-5" /> Public Merchant Profile
                  </h3>
                  <p className="text-xs text-slate-500">Your supplier name displayed to customers and marketplace admin.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed"
                  />
                  <p className="text-[11px] text-slate-400 mt-1.5">Registered account email cannot be modified directly.</p>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm text-xs"
                >
                  <Save className="w-4 h-4" /> Save Profile Changes
                </button>
              </form>
            )}

            {activeTab === "security" && (
              <form onSubmit={handlePasswordUpdate} className="max-w-lg space-y-5">
                <div className="border-b border-slate-100 pb-4 mb-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Lock className="text-indigo-600 w-5 h-5" /> Security & Password
                  </h3>
                  <p className="text-xs text-slate-500">Update your access password to keep your supplier account secure.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Current Password</label>
                  <input
                    type="password"
                    value={passwordData.current}
                    onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">New Password</label>
                  <input
                    type="password"
                    value={passwordData.new}
                    onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm text-xs"
                >
                  Update Password
                </button>
              </form>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-5">
                <div className="border-b border-slate-100 pb-4 mb-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Bell className="text-amber-500 w-5 h-5" /> Notification Preferences
                  </h3>
                  <p className="text-xs text-slate-500">Choose when and how you want to be alerted on new activity.</p>
                </div>

                <div className="space-y-3">
                  {[
                    { id: "orders", name: "Order Notifications", desc: "Get notified immediately when a new customer order is placed.", icon: <Mail className="w-4 h-4 text-indigo-600" /> },
                    { id: "returns", name: "Return & Refund Alerts", desc: "Receive alerts for incoming buyer return claims.", icon: <Smartphone className="w-4 h-4 text-rose-600" /> },
                    { id: "system", name: "System Updates", desc: "Stay informed about platform changes and catalog guidelines.", icon: <Globe className="w-4 h-4 text-blue-600" /> },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-white rounded-xl border border-slate-200 mt-0.5">{item.icon}</div>
                        <div>
                          <p className="font-bold text-slate-900 text-xs">{item.name}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                        checked={notifications[item.id]}
                        onChange={() => handleToggleNotification(item.id, item.name)}
                      />
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
