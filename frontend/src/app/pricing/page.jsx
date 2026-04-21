import React from "react";
import { Check } from "lucide-react";

export default function PricingPage() {
  const plans = [
    { name: "Starter", price: "Free", desc: "Perfect for new customers exploring the marketplace.", list: ["Buy products", "Track orders", "Instant Support", "Standard Delivery"] },
    { name: "Pro Dropshipper", price: "₹2499", desc: "For sellers ready to scale their business.", list: ["Add up to 500 products", "Auto-forward orders", "Access premium suppliers", "Analytics Dashboard"], popular: true },
    { name: "Enterprise Supplier", price: "₹8499", desc: "For bulk suppliers and large inventory holders.", list: ["Unlimited products", "Priority order routing", "API access for inventory sync", "Dedicated account manager"] }
  ];

  return (
    <div className="min-h-screen w-full relative pt-24 px-6 mb-20 flex flex-col justify-center items-center">
      <div className="absolute top-[10%] right-[20%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Simple, Transparent <span className="text-gradient">Pricing</span></h1>
        <p className="text-lg text-slate-400">Choose the plan that fits your role in the ecosystem. No hidden fees.</p>
      </div>

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <div key={i} className={`glass p-8 rounded-3xl border ${plan.popular ? 'border-blue-500 shadow-2xl shadow-blue-500/10' : 'border-slate-700'} relative flex flex-col`}>
             {plan.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-primary text-white text-xs font-bold px-4 py-1.5 rounded-full">MOST POPULAR</div>}
             <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
             <p className="text-slate-400 text-sm mb-6 h-10">{plan.desc}</p>
             <div className="text-4xl font-black text-white mb-8">{plan.price}<span className="text-lg text-slate-500 font-medium">{plan.price !== 'Free' ? '/mo' : ''}</span></div>
             
             <ul className="mb-8 space-y-4 flex-1">
               {plan.list.map((item, j) => (
                 <li key={j} className="flex items-center gap-3 text-slate-300 text-sm">
                   <div className="p-1 rounded-full bg-green-500/20"><Check className="w-4 h-4 text-green-400" /></div>
                   {item}
                 </li>
               ))}
             </ul>

             <button className={`w-full py-4 rounded-xl font-bold transition-all ${plan.popular ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'}`}>
               Get Started
             </button>
          </div>
        ))}
      </div>
    </div>
  );
}
