"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { User, Mail, Lock, Phone, ArrowRight, PackageOpen } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

// Form Validation Schema using Yup 
const SignupSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Must be at least 6 characters").required("Password is required"),
  phone: Yup.string().required("Phone is required"),
  role: Yup.string().oneOf(['customer', 'supplier'], 'Invalid Role').required('Role is required'),
});

export default function SignupPage() {
  const router = useRouter();

  const handleSignup = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", values);
      toast.success("Account created successfully. Logging you in...", { duration: 3000 });
      
      localStorage.setItem("dropsync_token", response.data.token);
      localStorage.setItem("dropsync_user", JSON.stringify(response.data.user));
      
      setTimeout(() => {
        const role = response.data.user.role;
        if (role === 'admin' || role === 'supplier') {
          router.push('/admin/dashboard');
        } else {
          router.push('/dashboard');
        }
      }, 1500);
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-950 text-slate-200 flex-row-reverse">
      <Toaster position="top-right" />
      
      {/* Right side: Beautiful Artistic Branding View */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-slate-900 border-l border-slate-800 flex-col items-center justify-center p-12">
         {/* Complex Gradients */}
         <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
         
         <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="z-10 text-center max-w-lg">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-500/10 rounded-3xl border border-purple-500/20 mb-8 shadow-2xl shadow-purple-500/10">
              <PackageOpen className="w-10 h-10 text-purple-500" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-black mb-6 tracking-tight text-white leading-tight">
               Build Your <br/> <span className="text-gradient">Empire Today</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
               Join dropship thousands of sellers who are automating their success. Connect with ultimate API-driven suppliers everywhere.
            </p>
         </motion.div>
      </div>

      {/* Left side: Modern Minimalist Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
        <div className="absolute top-8 left-8"><Link href="/" className="text-sm font-bold text-slate-500 hover:text-white transition-colors">Return Home</Link></div>
        
        <div className="w-full max-w-md py-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-3xl font-black text-white mb-2">Create Account</h2>
            <p className="text-slate-400 mb-8">Join the Vastra culture network and explore zero-inventory commerce.</p>

            <Formik
              initialValues={{ name: "", email: "", password: "", phone: "", role: "customer" }}
              validationSchema={SignupSchema}
              onSubmit={handleSignup}
            >
              {({ isSubmitting, values, setFieldValue }) => (
                <Form className="space-y-5">
                  
                  {/* Unified Role Selector */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-slate-300 mb-2">I want to join as <span className="text-red-500">*</span></label>
                    <div className="grid grid-cols-2 gap-3">
                      {['customer', 'supplier'].map((r) => (
                        <div 
                          key={r}
                          onClick={() => setFieldValue('role', r)}
                          className={`cursor-pointer px-4 py-3 rounded-xl border text-center text-sm font-bold transition-all ${
                            values.role === r 
                              ? 'bg-blue-600/10 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)] ring-2 ring-blue-500/20' 
                              : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          {r.charAt(0).toUpperCase() + r.slice(1)}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-1.5 flex justify-between">
                         <span>Full Name <span className="text-red-500">*</span></span>
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                          <User className="h-5 w-5" />
                        </div>
                        <Field name="name" type="text" placeholder="Jane Doe" className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-slate-600 focus:border-blue-500/50 focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all shadow-sm" />
                      </div>
                      <ErrorMessage name="name" component="p" className="text-error text-xs mt-1.5 font-medium" />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-1.5 flex justify-between">
                         <span>Phone Num <span className="text-red-500">*</span></span>
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                          <Phone className="h-5 w-5" />
                        </div>
                        <Field name="phone" type="text" placeholder="1234567890" className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-slate-600 focus:border-blue-500/50 focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all shadow-sm" />
                      </div>
                      <ErrorMessage name="phone" component="p" className="text-error text-xs mt-1.5 font-medium" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5 flex justify-between">
                       <span>Email <span className="text-red-500">*</span></span>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                        <Mail className="h-5 w-5" />
                      </div>
                      <Field name="email" type="email" placeholder="you@example.com" className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-slate-600 focus:border-blue-500/50 focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all shadow-sm" />
                    </div>
                    <ErrorMessage name="email" component="p" className="text-error text-xs mt-1.5 font-medium" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5 flex justify-between">
                       <span>Password <span className="text-red-500">*</span></span>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                        <Lock className="h-5 w-5" />
                      </div>
                      <Field name="password" type="password" placeholder="••••••••" className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-slate-600 focus:border-blue-500/50 focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all shadow-sm" />
                    </div>
                    <ErrorMessage name="password" component="p" className="text-error text-xs mt-1.5 font-medium" />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full mt-6 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 group active:scale-[0.98]"
                  >
                    {isSubmitting ? "Creating Account..." : "Create Free Account"}
                    {!isSubmitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                  </button>

                </Form>
              )}
            </Formik>

            <p className="mt-8 text-center text-sm text-slate-400 font-medium">
              Already have an account? <Link href="/login" className="text-blue-400 font-bold hover:underline transition-all">Log in here</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
