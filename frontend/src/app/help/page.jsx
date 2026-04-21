import React from "react";
import { HelpCircle, ChevronDown, MessageCircle } from "lucide-react";

export default function HelpPage() {
  const faqs = [
    { q: "How does the drop-shipping automated forwarding work?", a: "Whenever an order is placed, our system instantly checks inventory and forwards the purchase order to the relevant supplier. You just sit back and watch it fulfill." },
    { q: "Can I change my doorstep address after placing an order?", a: "Yes, you can edit your shipping address before the item marks as 'Dispatched'. Once dispatched, logistics hold the package." },
    { q: "What is your return policy?", a: "We offer a 7-day hassle-free return policy if the product delivered is damaged or inaccurate. Suppliers handle refunds securely." },
    { q: "How long does the payment verification take?", a: "Using our Razorpay Gateway, payments are verified instantaneously. In case of network errors, it resolves within 24 hours." }
  ];

  return (
    <div className="min-h-[80vh] w-full pt-28 px-4 md:px-10 max-w-4xl mx-auto mb-20">
      <div className="text-center mb-16">
        <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <HelpCircle className="w-8 h-8 text-blue-500" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">How can we <span className="text-gradient">help you?</span></h1>
        <p className="text-slate-400">Search our knowledge base or browse frequently asked questions.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="glass p-6 rounded-2xl border border-slate-700/50 hover:border-blue-500/30 transition-colors group cursor-pointer">
            <h3 className="text-lg font-bold text-white flex justify-between items-center">
              {faq.q} <ChevronDown className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transition-colors" />
            </h3>
            <p className="text-slate-400 mt-4 leading-relaxed tracking-wide text-sm">{faq.a}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 glass p-8 rounded-3xl text-center border border-slate-700">
         <h2 className="text-2xl font-bold text-white mb-2">Still need help?</h2>
         <p className="text-slate-400 mb-6">Our standard support team guarantees a 2 hour response time.</p>
         <button className="bg-white text-slate-900 font-bold px-8 py-3 rounded-xl hover:bg-slate-200 transition-colors inline-flex items-center gap-2">
           <MessageCircle className="w-5 h-5" /> Chat with Support
         </button>
      </div>
    </div>
  );
}
