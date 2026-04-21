import React from "react";
import { ShieldAlert, BookOpen } from "lucide-react";

export default function PolicyTemplate({ title, lastUpdated, content }) {
  return (
    <div className="min-h-screen w-full relative pt-24 px-6 md:px-10 pb-20 max-w-4xl mx-auto">
      <div className="absolute top-[10%] left-[20%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{title}</h1>
          <p className="text-sm text-slate-400 font-medium">Last updated: {lastUpdated}</p>
        </div>
      </div>

      <div className="glass p-8 md:p-12 rounded-3xl border border-slate-700/50 prose prose-invert max-w-none text-slate-300">
        {content}
      </div>
    </div>
  );
}
