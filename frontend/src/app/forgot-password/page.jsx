"use client";

import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Mail, Lock, ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import * as YupValidation from "yup";

const Step1Schema = YupValidation.object().shape({
  email: YupValidation.string().email("Invalid email").required("Email is required"),
});

const Step2Schema = YupValidation.object().shape({
  otp: YupValidation.string().length(6, "OTP must be exactly 6 digits").required("OTP is required"),
});

const Step3Schema = YupValidation.object().shape({
  newPassword: YupValidation.string().min(6, "Must be at least 6 characters").required("New Password is required"),
});

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");

  const handleRequestOtp = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/forgot-password", { email: values.email });
      setEmail(values.email);
      setStep(2);
      
      if (response.data.otp_demo) {
          toast.success(`[DEV] OTP Code auto-generated: ${response.data.otp_demo}`, { duration: 6000 });
      } else {
          toast.success("Secure OTP code sent to your email!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "User profile not found.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async (values, { setSubmitting }) => {
    try {
      await axios.post("http://localhost:5000/api/auth/verify-otp", { email, otp: values.otp });
      setOtpCode(values.otp);
      setStep(3);
      toast.success("OTP Verified! Proceed to create password.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (values, { setSubmitting }) => {
    try {
      await axios.post("http://localhost:5000/api/auth/reset-password", { 
          email, 
          otp: otpCode, 
          newPassword: values.newPassword 
      });
      toast.success("Password secured! Redirecting to login...", { duration: 3000 });
      setTimeout(() => router.push("/login"), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Password execution failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-950 text-slate-200">
      <Toaster position="top-right" />
      
      {/* Left side: Beautiful Artistic Branding View */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-slate-900 border-r border-slate-800 flex-col items-center justify-center p-12">
         <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
         
         <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="z-10 text-center max-w-lg">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500/10 rounded-3xl border border-blue-500/20 mb-8 shadow-2xl shadow-blue-500/10">
              <ShieldCheck className="w-10 h-10 text-blue-500" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-black mb-6 tracking-tight text-white leading-tight">
               Secure Account <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Recovery</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
               Vastra culture implements high-end OTP verification protocols strictly tied to your authenticated registry, keeping supply chains absolutely impenetrable.
            </p>
         </motion.div>
      </div>

      {/* Right side: Modern Minimalist Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
        <div className="absolute top-8 left-8">
            <button onClick={() => router.back()} className="text-sm font-bold text-slate-500 hover:text-white transition-colors flex items-center gap-2">
                <ArrowLeft className="w-4 h-4"/> Back
            </button>
        </div>
        
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
              {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h2 className="text-3xl font-black text-white mb-2">Forgot Password</h2>
                    <p className="text-slate-400 mb-8">Enter your registered email below to receive a fast multi-digit verification sequence.</p>

                    <Formik initialValues={{ email: "" }} validationSchema={Step1Schema} onSubmit={handleRequestOtp}>
                      {({ isSubmitting }) => (
                        <Form className="space-y-5">
                          <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-1.5 flex justify-between">
                               <span>Email <span className="text-red-500">*</span></span>
                            </label>
                            <div className="relative group">
                              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                                <Mail className="h-5 w-5" />
                              </div>
                              <Field 
                                name="email" 
                                type="email" 
                                placeholder="you@example.com" 
                                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-slate-600 focus:border-blue-500/50 focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm" 
                              />
                            </div>
                            <ErrorMessage name="email" component="p" className="text-red-400 text-xs mt-1.5 font-medium" />
                          </div>

                          <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full mt-6 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group"
                          >
                            {isSubmitting ? "Generating..." : "Transmit Verification Code"}
                            {!isSubmitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                          </button>
                        </Form>
                      )}
                    </Formik>
                  </motion.div>
              )}

              {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h2 className="text-3xl font-black text-white mb-2">Enter OTP</h2>
                    <p className="text-slate-400 mb-8">We wired a 6-digit confirmation protocol securely to <span className="text-blue-400 font-bold">{email}</span></p>

                    <Formik initialValues={{ otp: "" }} validationSchema={Step2Schema} onSubmit={handleVerifyOtp}>
                      {({ isSubmitting }) => (
                        <Form className="space-y-5">
                          <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-1.5">6-Digit Code</label>
                            <div className="relative group">
                              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                                <ShieldCheck className="h-5 w-5" />
                              </div>
                              <Field 
                                name="otp" 
                                type="text" 
                                maxLength="6"
                                placeholder="000000" 
                                className="w-full tracking-widest text-center text-xl bg-slate-900/50 border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-slate-600 focus:border-blue-500/50 focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm" 
                              />
                            </div>
                            <ErrorMessage name="otp" component="p" className="text-red-400 text-xs mt-1.5 font-medium" />
                          </div>

                          <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full mt-6 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                          >
                            {isSubmitting ? "Scanning..." : "Verify Ownership"}
                          </button>
                        </Form>
                      )}
                    </Formik>
                  </motion.div>
              )}

              {step === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h2 className="text-3xl font-black text-white mb-2">New Password</h2>
                    <p className="text-slate-400 mb-8">Set your heavily hashed encryption layer to officially lock the account.</p>

                    <Formik initialValues={{ newPassword: "" }} validationSchema={Step3Schema} onSubmit={handleResetPassword}>
                      {({ isSubmitting }) => (
                        <Form className="space-y-5">
                          <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-1.5">New Password</label>
                            <div className="relative group">
                              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                                <Lock className="h-5 w-5" />
                              </div>
                              <Field 
                                name="newPassword" 
                                type="password" 
                                placeholder="••••••••" 
                                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-slate-600 focus:border-blue-500/50 focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm" 
                              />
                            </div>
                            <ErrorMessage name="newPassword" component="p" className="text-red-400 text-xs mt-1.5 font-medium" />
                          </div>

                          <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full mt-6 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                          >
                            {isSubmitting ? "Encrypting..." : "Finalize & Sign In"}
                            <Lock className="w-5 h-5" />
                          </button>
                        </Form>
                      )}
                    </Formik>
                  </motion.div>
              )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
