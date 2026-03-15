"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Sparkles, ArrowRight, Github } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Check your email for the magic link!');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-6 shadow-xl">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter">CONTENT SAAS</h1>
          <p className="text-gray-400 mt-2 font-medium">Step into the intelligence layer.</p>
        </div>

        <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm space-y-6">
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</label>
              <input 
                type="email" 
                placeholder="you@company.com"
                className="w-full border-b border-gray-200 py-3 text-lg focus:border-black transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-900 transition-all group"
            >
              {loading ? 'SENDING...' : 'GET MAGIC LINK'}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {message && (
            <p className={cn("text-sm font-medium", message.includes('Check') ? "text-green-500" : "text-red-500")}>
              {message}
            </p>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100" /></div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold text-gray-300">
              <span className="bg-white px-4 tracking-tighter">Trust the engine</span>
            </div>
          </div>

          <p className="text-[11px] text-gray-400 leading-relaxed px-4">
            By signing in, you agree to transform your LinkedIn presence with structured intelligence.
          </p>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
