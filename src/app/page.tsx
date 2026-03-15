"use client";

import React, { useState, useEffect } from 'react';
import { Sparkles, LayoutDashboard, PenLine, Settings, Fingerprint, LogOut, ChevronRight, Zap, Target, BookOpen, User } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { supabase } from '@/lib/supabase';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('brand');
  const [isGenerating, setIsGenerating] = useState(false);
  const [profile, setProfile] = useState({
    company_name: '',
    founder_name: '',
    origin_story: '',
    dirty_secret: '',
    contrarian_belief: '',
    enemy: '',
    biggest_win: '',
    secret_sauce: '',
    data_dump: '',
    core_tone: 'Contrarian & Provocative',
    words_to_kill: 'Delve, Tapestry, Unleash, Synergize',
    primary_audience: ''
  });
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // 1. Fetch existing profile on load
  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('brand_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) setProfile(data);
    }
    loadProfile();
  }, []);

  const handleUpdateProfile = async () => {
    setSaving(true);
    setSaveMessage('');
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setSaveMessage('Error: Not authenticated');
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from('brand_profiles')
      .upsert({ 
        user_id: user.id,
        ...profile,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

    if (error) {
      setSaveMessage(`Error: ${error.message}`);
    } else {
      setSaveMessage('ENGINE CALIBRATED SUCCESSFULLY');
    }
    setSaving(false);
  };

  return (
    <div className="flex h-screen bg-[#FDFDFD]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-100 flex flex-col bg-white">
        <div className="p-8 pb-12">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
              <Sparkles className="text-white w-4 h-4" />
            </div>
            <h1 className="text-lg font-bold tracking-tight">CONTENT SAAS</h1>
          </div>
          <p className="text-xs text-gray-400 font-medium tracking-wide">STRATEGY ENGINE</p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <NavItem 
            icon={<LayoutDashboard size={18} />} 
            label="Generate" 
            isActive={activeTab === 'generate'} 
            onClick={() => setActiveTab('generate')}
          />
          <NavItem 
            icon={<PenTool size={18} />} 
            label="Brand Profile" 
            isActive={activeTab === 'brand'} 
            onClick={() => setActiveTab('brand')}
          />
          <NavItem 
            icon={<ImageIcon size={18} />} 
            label="Visual Gallery" 
            isActive={activeTab === 'history'} 
            onClick={() => setActiveTab('history')}
          />
        </nav>

        <div className="p-6 border-t border-gray-50 mt-auto">
          <button className="flex items-center gap-3 text-gray-500 hover:text-black transition-colors w-full text-sm font-medium">
            <Settings size={18} />
            Settings
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 border-b border-gray-50 flex items-center justify-between px-12 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>Dashboard</span>
            <ChevronRight size={14} />
            <span className="text-black font-medium leading-none mb-0.5">
              {activeTab === 'generate' ? 'Generate Content' : activeTab === 'brand' ? 'Brand Profile' : 'Gallery'}
            </span>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right">
                <p className="text-sm font-bold text-black leading-none">Nitish Ranjan</p>
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Free Plan</p>
             </div>
             <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200" />
          </div>
        </header>

        <div className="max-w-4xl mx-auto p-12">
          {activeTab === 'generate' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <section className="space-y-1">
                <h2 className="text-3xl font-black tracking-tight">CREATE CONTENT</h2>
                <p className="text-gray-400 text-lg">Turn your curated strategy into LinkedIn posts.</p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow group cursor-pointer border-l-4 border-l-black">
                   <h3 className="font-bold flex items-center gap-2 mb-2">
                     <Sparkles size={16} />
                     Strategic Batch
                   </h3>
                   <p className="text-sm text-gray-500 mb-4">Generate 5 posts using the full Strategic Lens logic.</p>
                   <button 
                    onClick={() => setIsGenerating(true)}
                    disabled={isGenerating}
                    className="w-full bg-black text-white text-sm font-bold py-3 rounded hover:bg-gray-900 transition-colors disabled:bg-gray-100 disabled:text-gray-400"
                   >
                     {isGenerating ? 'ANALYZING LENSES...' : 'GENERATE BATCH'}
                   </button>
                </div>

                <div className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm space-y-4">
                  <label className="text-sm font-bold uppercase tracking-wider text-gray-400">Quick Prompt</label>
                  <textarea 
                    className="w-full h-24 p-3 bg-gray-50 border border-transparent rounded focus:border-black text-sm resize-none"
                    placeholder="Focus on specific win from last week..."
                  />
                </div>
              </div>

              {/* Status Section */}
              {isGenerating && (
                <div className="p-8 border border-dashed border-gray-200 rounded-xl bg-gray-50/50 flex flex-col items-center justify-center py-16 space-y-4">
                  <div className="relative">
                    <div className="w-12 h-12 border-2 border-gray-100 border-t-black rounded-full animate-spin" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-black">GENERATING POSTS</p>
                    <p className="text-sm text-gray-400">GPT-5.4 is identifying the best hooks...</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'brand' && (
            <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <section className="space-y-2">
                <h2 className="text-4xl font-black tracking-tighter">THE DISCOVERY SESSION</h2>
                <p className="text-gray-400 text-xl font-medium">To write like you, the engine needs to think like you.</p>
              </section>

              <div className="space-y-16 pb-20">
                {/* TIER 1: IDENTITY & AUTHORITY */}
                <div className="p-10 bg-white border border-gray-100 rounded-3xl shadow-sm space-y-10">
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-black text-xs">01</span>
                    <h3 className="font-black text-xs uppercase tracking-[0.2em] text-black">Identity & Foundation</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">Company / Product Name</label>
                      <input 
                        className="w-full border-b border-gray-200 py-3 text-xl font-medium focus:border-black bg-transparent outline-none" 
                        placeholder="e.g. Youthfluence" 
                        value={profile.company_name}
                        onChange={(e) => setProfile({...profile, company_name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">Founder / Author Name</label>
                      <input 
                        className="w-full border-b border-gray-200 py-3 text-xl font-medium focus:border-black bg-transparent outline-none" 
                        placeholder="Nitish Ranjan" 
                        value={profile.founder_name}
                        onChange={(e) => setProfile({...profile, founder_name: e.target.value})}
                      />
                    </div>
                  </div>

                   <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">The "Why" (The Origin Story)</label>
                    <p className="text-[12px] text-gray-400 leading-tight">Why does this company exist beyond making money? What gap did you see in the market?</p>
                    <textarea 
                      className="w-full h-24 p-5 bg-gray-50 border border-transparent rounded-2xl focus:border-black text-sm outline-none" 
                      placeholder="e.g. I saw that brands were burning budgets..." 
                      value={profile.origin_story}
                      onChange={(e) => setProfile({...profile, origin_story: e.target.value})}
                    />
                  </div>
                </div>

                {/* TIER 2: THE CONTRARIAN TRUTHS */}
                <div className="p-10 bg-white border border-gray-100 rounded-3xl shadow-sm space-y-10">
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-black text-xs">02</span>
                    <h3 className="font-black text-xs uppercase tracking-[0.2em] text-black">Strategic POV & The Status Quo</h3>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">The "Dirty Secret" of your Industry</label>
                    <p className="text-[12px] text-gray-400 leading-tight">What is something everyone knows but no one says out loud?</p>
                    <textarea 
                      className="w-full h-24 p-5 bg-gray-50 border border-transparent rounded-2xl focus:border-black text-sm outline-none" 
                      placeholder="e.g. Most campus reach numbers are inflated." 
                      value={profile.dirty_secret}
                      onChange={(e) => setProfile({...profile, dirty_secret: e.target.value})}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">The Contrarian Belief</label>
                    <p className="text-[12px] text-gray-400 leading-tight">What is one industry 'best practice' that you actually hate or disagree with?</p>
                    <textarea 
                      className="w-full h-24 p-5 bg-gray-50 border border-transparent rounded-2xl focus:border-black text-sm outline-none" 
                      placeholder="e.g. I hate automated email blasts." 
                      value={profile.contrarian_belief}
                      onChange={(e) => setProfile({...profile, contrarian_belief: e.target.value})}
                    />
                  </div>

                   <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">The Enemy (The Status Quo)</label>
                    <p className="text-[12px] text-gray-400 leading-tight">Who or what are we fighting? Describe the 'lazy way' things are currently done.</p>
                    <input 
                      className="w-full border-b border-gray-200 py-3 text-sm font-medium focus:border-black bg-transparent outline-none" 
                      placeholder="e.g. Corporate agencies that treat Gen Z like a spreadsheet." 
                      value={profile.enemy}
                      onChange={(e) => setProfile({...profile, enemy: e.target.value})}
                    />
                  </div>
                </div>

                {/* TIER 3: THE PROOF LAB */}
                <div className="p-10 bg-white border border-gray-100 rounded-3xl shadow-sm space-y-10">
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-black text-xs">03</span>
                    <h3 className="font-black text-xs uppercase tracking-[0.2em] text-black">Evidence & Case Study Lab</h3>
                  </div>

                  <p className="text-[12px] text-gray-400 bg-gray-50 p-4 rounded-xl border-l-4 border-black font-medium leading-relaxed">
                    AI needs numbers to be believable. Add your best results here.
                  </p>

                  <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">Biggest Win (Client/Outcome)</label>
                      <input 
                        className="w-full border-b border-gray-200 py-3 text-sm font-medium focus:border-black bg-transparent outline-none" 
                        placeholder="e.g. Unacademy / 8,000 Signups" 
                        value={profile.biggest_win}
                        onChange={(e) => setProfile({...profile, biggest_win: e.target.value})}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">The "How" (Secret Sauce)</label>
                      <input 
                        className="w-full border-b border-gray-200 py-3 text-sm font-medium focus:border-black bg-transparent outline-none" 
                        placeholder="e.g. Student network triggered FOMO." 
                        value={profile.secret_sauce}
                        onChange={(e) => setProfile({...profile, secret_sauce: e.target.value})}
                      />
                    </div>
                  </div>

                   <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">The Data Dump</label>
                    <p className="text-[12px] text-gray-400 leading-tight">Raw numbers: Colleges covered, impressions, ROI...</p>
                    <textarea 
                      className="w-full h-32 p-5 bg-gray-50 border border-transparent rounded-2xl focus:border-black text-sm font-mono outline-none" 
                      placeholder="5000+ colleges, 75k ambassadors..." 
                      value={profile.data_dump}
                      onChange={(e) => setProfile({...profile, data_dump: e.target.value})}
                    />
                  </div>
                </div>

                {/* TIER 4: VOICE CONSTRAINTS */}
                <div className="p-10 bg-white border border-gray-100 rounded-3xl shadow-sm space-y-10">
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-black text-xs">04</span>
                    <h3 className="font-black text-xs uppercase tracking-[0.2em] text-black">Voice & Constraints</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">Core Tone</label>
                        <select 
                          className="w-full border-b border-gray-200 py-3 text-sm font-bold bg-transparent focus:border-black outline-none"
                          value={profile.core_tone}
                          onChange={(e) => setProfile({...profile, core_tone: e.target.value})}
                        >
                          <option>Contrarian & Provocative</option>
                          <option>Deep Analytical & Data-Heavy</option>
                          <option>Empathetic Storyteller</option>
                          <option>Short, Punchy & Minimalist</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-6">
                       <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">Words to Kill</label>
                        <input 
                          className="w-full border-b border-gray-200 py-3 text-sm font-medium focus:border-black bg-transparent outline-none" 
                          placeholder="e.g. Delve, Tapestry" 
                          value={profile.words_to_kill}
                          onChange={(e) => setProfile({...profile, words_to_kill: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-4 pt-8">
                  <button 
                    onClick={handleUpdateProfile}
                    disabled={saving}
                    className="bg-black text-white px-20 py-6 rounded-3xl font-black text-sm tracking-[0.3em] hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 shadow-xl disabled:opacity-50"
                  >
                    {saving ? 'CALIBRATING...' : 'CALIBRATE ENGINE'}
                  </button>
                  {saveMessage && <p className="text-xs font-bold uppercase tracking-widest text-green-500">{saveMessage}</p>}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive?: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 w-full",
        isActive 
          ? "bg-black text-white shadow-sm" 
          : "text-gray-500 hover:bg-gray-50 hover:text-black"
      )}
    >
      {icon}
      {label}
    </button>
  );
}
