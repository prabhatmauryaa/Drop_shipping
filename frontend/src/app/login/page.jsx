"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Mail, Lock, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import * as YupValidation from "yup"; // fixing the typo

// Validation Schema using Yup 
const LoginSchema = YupValidation.object().shape({
  email: YupValidation.string().email("Invalid email").required("Email is required"),
  password: YupValidation.string().min(6, "Must be at least 6 characters").required("Password is required"),
});

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email: values.email,
        password: values.password
      });

      toast.success("Welcome back to Vastra culture!", { duration: 3000 });
      
      localStorage.setItem("dropsync_token", response.data.token);
      localStorage.setItem("dropsync_user", JSON.stringify(response.data.user));
      
      setTimeout(() => {
        const role = response.data.user.role;
        if (role === 'admin') router.push('/admin/dashboard');
        else if (role === 'seller') router.push('/seller/dashboard');
        else if (role === 'supplier') router.push('/supplier/dashboard');
        else router.push('/dashboard');
      }, 1500);

    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-950 text-slate-200">
      <Toaster position="top-right" />
      
      {/* Left side: Beautiful Artistic Branding View */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-slate-900 border-r border-slate-800 flex-col items-center justify-center p-12">
         {/* Complex Gradients */}
         <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
         
         <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="z-10 text-center max-w-lg">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500/10 rounded-3xl border border-blue-500/20 mb-8 shadow-2xl shadow-blue-500/10">
              <ShieldCheck className="w-10 h-10 text-blue-500" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-black mb-6 tracking-tight text-white leading-tight">
               Your Gateway to <br/> <span className="text-gradient">Zero-Risk Commerce</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
               Vastra culture is not just a marketplace. It's an entire ecosystem of verified suppliers, ambitious sellers, and seamless local logistics.
            </p>
         </motion.div>
         
         {/* Floating Elements visual purely aesthetic */}
         <div className="absolute top-[30%] left-[15%] w-16 h-16 bg-slate-800/80 rounded-2xl border border-slate-700/50 backdrop-blur-md flex items-center justify-center -rotate-12 animate-[bounce_8s_infinite] shadow-xl"><ShieldCheck className="w-8 h-8 text-green-500/50" /></div>
         <div className="absolute bottom-[35%] right-[20%] w-20 h-20 bg-slate-800/80 rounded-2xl border border-slate-700/50 backdrop-blur-md flex items-center justify-center rotate-12 animate-[bounce_5s_infinite] shadow-xl"><Mail className="w-10 h-10 text-blue-500/50" /></div>
      </div>

      {/* Right side: Modern Minimalist Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute top-8 right-8"><Link href="/" className="text-sm font-bold text-slate-500 hover:text-white transition-colors">Return Home</Link></div>
        
        <div className="w-full max-w-md">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-3xl font-black text-white mb-2">Welcome Back</h2>
            <p className="text-slate-400 mb-8">Login to your Vastra culture account to continue.</p>

            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={LoginSchema}
              onSubmit={handleLogin}
            >
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
                        className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-slate-600 focus:border-blue-500/50 focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all shadow-sm" 
                      />
                    </div>
                    <ErrorMessage name="email" component="p" className="text-error text-xs mt-1.5 font-medium" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5 flex justify-between">
                       <span>Password <span className="text-red-500">*</span></span>
                       <Link href="/forgot-password" className="text-blue-500 hover:text-blue-400 transition-colors font-medium">Forgot?</Link>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                        <Lock className="h-5 w-5" />
                      </div>
                      <Field 
                        name="password" 
                        type="password" 
                        placeholder="••••••••" 
                        className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-slate-600 focus:border-blue-500/50 focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all shadow-sm" 
                      />
                    </div>
                    <ErrorMessage name="password" component="p" className="text-error text-xs mt-1.5 font-medium" />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full mt-6 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 group active:scale-[0.98]"
                  >
                    {isSubmitting ? "Authenticating..." : "Sign In to Vastra culture"}
                    {!isSubmitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                  </button>
                  
                  <div className="relative py-4 my-2">
                     <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
                     <div className="relative flex justify-center text-xs"><span className="bg-slate-950 px-4 text-slate-500 font-medium">OR CONTINUE WITH</span></div>
                  </div>

                  <button type="button" className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-3">
                     <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path></svg> GitHub
                  </button>

                </Form>
              )}
            </Formik>

            <p className="mt-8 text-center text-sm text-slate-400 font-medium">
              Don't have an account? <Link href="/signup" className="text-blue-400 font-bold hover:underline transition-all">Create an account</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
