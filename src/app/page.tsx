"use client";

import React, { useState, useEffect } from 'react';
import { Sparkles, LayoutDashboard, PenLine, Settings, Fingerprint, LogOut, ChevronRight, Zap, Target, BookOpen, User, Layers } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { supabase } from '@/lib/supabase';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('brand');
  const [isGenerating, setIsGenerating] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [authLoading, setAuthLoading] = useState(true);
  const [profile, setProfile] = useState({
    company_name: '',
    industry: '',
    company_description: '',
    business_size: '',
    markets: '',
    target_audience: '',
    decision_makers: '',
    products_services: '',
    marketing_channels: '',
    campaign_example: '',
    campaign_outcome: '',
    industry_mistakes: '',
    what_works: '',
    unique_perspective: '',
    misunderstood: '',
    ai_guardrails: '',
    brand_philosophy: '',
    content_tone: '',
    content_inspiration: '',
    competitive_advantage: '',
    // Legacy fields kept for backend compatibility
    founder_name: '',
    origin_story: '',
    dirty_secret: '',
    contrarian_belief: '',
    enemy: '',
    biggest_win: '',
    secret_sauce: '',
    data_dump: '',
    core_tone: '',
    words_to_kill: '',
    primary_audience: '',
  });
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [generatedPosts, setGeneratedPosts] = useState<any[]>([]);

  // 1. Check Auth & Fetch Profile
  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        const { data } = await supabase
          .from('brand_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (data) setProfile(data);
      }
      setAuthLoading(false);
    }
    init();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin }
    });
    if (error) setSaveMessage(error.message);
    else setSaveMessage('Check your email for the login link!');
    setSaving(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const handleUpdateProfile = async () => {
    setSaving(true);
    setSaveMessage('');
    
    try {
      if (!user) {
        throw new Error('Not authenticated');
      }

      // We remove id and updated_at to let Supabase handle the upsert via user_id correctly
      const { id, updated_at, ...profileData } = profile as any;

      const { error } = await supabase
        .from('brand_profiles')
        .upsert({ 
          user_id: user.id,
          ...profileData,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (error) throw error;
      setSaveMessage('ENGINE CALIBRATED SUCCESSFULLY');
    } catch (error: any) {
      console.error('Save error:', error);
      setSaveMessage(`Error: ${error.message || 'Failed to save'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: profile,
          count: 5
        })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Generation failed');
      
      setGeneratedPosts(data.posts || []);
      setSaveMessage('CONTENT GENERATED SUCCESSFULLY');
    } catch (err: any) {
      console.error(err);
      setSaveMessage(`Generation Error: ${err.message || 'Check API connection'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  if (authLoading) return (
    <div className="h-screen w-screen flex items-center justify-center bg-white">
      <div className="w-8 h-8 border-4 border-gray-100 border-t-black rounded-full animate-spin" />
    </div>
  );

  if (!user) return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#FDFDFD] p-6 selection:bg-black selection:text-white">
      <div className="max-w-md w-full space-y-12 text-center animate-in fade-in zoom-in duration-1000">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-black rounded-3xl flex items-center justify-center shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
            <Sparkles className="text-white w-8 h-8" />
          </div>
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-black tracking-tighter uppercase">Content SaaS</h1>
          <p className="text-gray-400 font-medium text-lg">Strategic Command Center Login</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6 pt-4">
          <input 
            type="email" 
            placeholder="Enter your email" 
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            className="w-full p-6 bg-white border border-gray-100 rounded-2xl shadow-sm focus:border-black outline-none text-center font-bold text-lg transition-all"
            required
          />
          <button 
            type="submit"
            disabled={saving}
            className="w-full bg-black text-white py-6 rounded-2xl font-black text-xs tracking-[0.3em] uppercase shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            {saving ? 'TRANSMITTING...' : 'REQUEST ACCESS'}
          </button>
        </form>
        {saveMessage && <p className="text-[10px] font-black text-black uppercase tracking-[0.2em] animate-pulse">{saveMessage}</p>}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#FDFDFD] text-black overflow-hidden font-sans selection:bg-black selection:text-white">
      {/* Sidebar - High Authority Minimalist */}
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col z-50">
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 mb-10 group cursor-default">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-2xl group-hover:rotate-[10deg] transition-transform duration-500">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tighter uppercase leading-none">Content SaaS</h1>
              <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Strategist v1.0</span>
            </div>
          </div>

          <nav className="space-y-1.5">
            {[
              { id: 'generate', label: 'Command Center', icon: Zap },
              { id: 'brand', label: 'Brand DNA', icon: Fingerprint },
              { id: 'gallery', label: 'Asset Gallery', icon: Layers },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-[11px] font-black tracking-tight transition-all duration-300 group",
                  activeTab === item.id 
                    ? "bg-black text-white shadow-2xl shadow-black/20 scale-[1.02] translate-x-1" 
                    : "text-gray-400 hover:bg-gray-50 hover:text-black hover:translate-x-1"
                )}
              >
                <item.icon className={cn("w-4 h-4 transition-transform duration-500 group-hover:scale-125", activeTab === item.id ? "text-white" : "text-gray-300 group-hover:text-black")} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-4">
          <div className="p-5 bg-gray-50/50 rounded-3xl border border-gray-100 backdrop-blur-sm">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">System Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
              <span className="text-[11px] font-black">LMM Engine Active</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-red-500 transition-all duration-300"
          >
            <LogOut className="w-3 h-3" />
            Terminate
          </button>
        </div>
      </aside>

      {/* Main Command Center */}
      <main className="flex-1 overflow-y-auto bg-[#FDFDFD] relative scroll-smooth overflow-x-hidden">
        {/* Dynamic Background Accents */}
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-50/40 blur-[130px] rounded-full -z-10 animate-pulse pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-gray-100/60 blur-[130px] rounded-full -z-10 pointer-events-none" />

        <div className="max-w-5xl mx-auto p-16 pb-32">
          {activeTab === 'brand' && (
            <div className="space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out">
              <header className="space-y-3">
                <div className="inline-flex items-center px-3 py-1 bg-black text-white rounded-full text-[9px] font-black tracking-[0.2em] uppercase mb-4 shadow-xl">Phase 01: Calibration</div>
                <h2 className="text-5xl font-black tracking-tighter leading-[0.9] uppercase">The Discovery<br/>Session</h2>
                <p className="text-gray-400 font-medium text-lg max-w-xl leading-relaxed">To generate authority-building content, the engine needs to absorb your complete strategic worldview. Answer every question to maximise output quality.</p>
              </header>

              <div className="space-y-14">

                {/* Section 1 — Company Overview */}
                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-black flex items-center justify-center text-xs font-black italic text-white">01</div>
                    <h3 className="text-xs font-black tracking-[0.3em] uppercase text-black/80">Company Overview</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="1. What is your company or brand name?" placeholder="Example: Nike, Unacademy, Zomato, HubSpot" value={profile.company_name} onChange={(val) => setProfile({...profile, company_name: val})} />
                    <InputField label="2. What industry does your company operate in?" placeholder="Example: EdTech, SaaS, FMCG, D2C, Fintech, Healthcare" value={profile.industry} onChange={(val) => setProfile({...profile, industry: val})} />
                  </div>
                  <TextAreaField label="3. Briefly describe what your company does" placeholder="Example: We build software that helps companies manage customer support conversations across multiple channels." value={profile.company_description} onChange={(val) => setProfile({...profile, company_description: val})} />
                </section>

                {/* Section 2 — Business Scale */}
                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-black flex items-center justify-center text-xs font-black italic text-white">02</div>
                    <h3 className="text-xs font-black tracking-[0.3em] uppercase text-black/80">Business Scale</h3>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-[11px] font-black tracking-widest uppercase text-gray-500">4. What is the approximate size of your business?</label>
                    <div className="flex flex-wrap gap-3">
                      {['Early-stage startup', 'Growing startup', 'Mid-sized company', 'Enterprise'].map((opt) => (
                        <button key={opt} onClick={() => setProfile({...profile, business_size: opt})}
                          className={`px-5 py-2.5 rounded-2xl text-[11px] font-black tracking-wide transition-all duration-200 border-2 ${profile.business_size === opt ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300 hover:text-black'}`}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                  <TextAreaField label="5. Which markets or regions do you operate in?" placeholder="Example: India, Southeast Asia, United States, Europe" value={profile.markets} onChange={(val) => setProfile({...profile, markets: val})} />
                </section>

                {/* Section 3 — Target Audience */}
                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-black flex items-center justify-center text-xs font-black italic text-white">03</div>
                    <h3 className="text-xs font-black tracking-[0.3em] uppercase text-black/80">Target Audience</h3>
                  </div>
                  <TextAreaField label="6. Who is your primary target audience?" placeholder={"Example:\nStartup founders\nMarketing leaders\nCollege students\nYoung professionals"} value={profile.target_audience} onChange={(val) => setProfile({...profile, target_audience: val})} />
                  <InputField label="7. What type of decision makers usually buy from you?" placeholder="Example: Brand managers, marketing heads, founders, CTOs" value={profile.decision_makers} onChange={(val) => setProfile({...profile, decision_makers: val})} />
                </section>

                {/* Section 4 — Products or Services */}
                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-black flex items-center justify-center text-xs font-black italic text-white">04</div>
                    <h3 className="text-xs font-black tracking-[0.3em] uppercase text-black/80">Products or Services</h3>
                  </div>
                  <TextAreaField label="8. What are your main products or services?" placeholder={"Example:\nCRM software\nProtein supplements\nCampus marketing campaigns\nOnline courses"} value={profile.products_services} onChange={(val) => setProfile({...profile, products_services: val})} />
                </section>

                {/* Section 5 — Marketing Experience */}
                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-black flex items-center justify-center text-xs font-black italic text-white">05</div>
                    <h3 className="text-xs font-black tracking-[0.3em] uppercase text-black/80">Marketing Experience</h3>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-[11px] font-black tracking-widest uppercase text-gray-500">9. What types of marketing have you used so far? (select all that apply)</label>
                    <div className="flex flex-wrap gap-3">
                      {['Social media marketing', 'Influencer marketing', 'Paid advertising', 'Content marketing', 'Community marketing', 'Events / activations', 'Partnerships', 'Other'].map((opt) => {
                        const selected = (profile.marketing_channels || '').split(',').map((s: string) => s.trim()).filter(Boolean).includes(opt);
                        return (
                          <button key={opt} onClick={() => {
                            const current = (profile.marketing_channels || '').split(',').map((s: string) => s.trim()).filter(Boolean);
                            const updated = selected ? current.filter((c: string) => c !== opt) : [...current, opt];
                            setProfile({...profile, marketing_channels: updated.join(', ')});
                          }}
                            className={`px-5 py-2.5 rounded-2xl text-[11px] font-black tracking-wide transition-all duration-200 border-2 ${selected ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300 hover:text-black'}`}>
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </section>

                {/* Section 6 — Campaign Examples */}
                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-black flex items-center justify-center text-xs font-black italic text-white">06</div>
                    <h3 className="text-xs font-black tracking-[0.3em] uppercase text-black/80">Campaign Examples</h3>
                  </div>
                  <TextAreaField label="10. Share an example of a marketing campaign you have run" placeholder={"Example:\nWe ran a campaign targeting university students across multiple cities with a student ambassador program and on-campus activations."} value={profile.campaign_example} onChange={(val) => setProfile({...profile, campaign_example: val})} />
                  <TextAreaField label="11. What was the outcome of that campaign?" placeholder={"Example:\nGenerated 8,000 registrations and increased brand awareness significantly."} value={profile.campaign_outcome} onChange={(val) => setProfile({...profile, campaign_outcome: val})} />
                </section>

                {/* Section 7 — Observed Industry Mistakes */}
                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-black flex items-center justify-center text-xs font-black italic text-white">07</div>
                    <h3 className="text-xs font-black tracking-[0.3em] uppercase text-black/80">Observed Industry Mistakes</h3>
                  </div>
                  <TextAreaField label="12. What are some common mistakes you see companies make in your industry?" placeholder={"Example:\nCompanies focus too much on ads and ignore community engagement."} value={profile.industry_mistakes} onChange={(val) => setProfile({...profile, industry_mistakes: val})} />
                </section>

                {/* Section 8 — What Actually Works */}
                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-black flex items-center justify-center text-xs font-black italic text-white">08</div>
                    <h3 className="text-xs font-black tracking-[0.3em] uppercase text-black/80">What Actually Works</h3>
                  </div>
                  <TextAreaField label="13. From your experience, what strategies or tactics actually work well in your market?" placeholder={"Example:\nWord-of-mouth marketing and community engagement drive better long-term results than pure paid advertising."} value={profile.what_works} onChange={(val) => setProfile({...profile, what_works: val})} />
                </section>

                {/* Section 9 — Unique Perspective */}
                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-black flex items-center justify-center text-xs font-black italic text-white">09</div>
                    <h3 className="text-xs font-black tracking-[0.3em] uppercase text-black/80">Unique Perspective</h3>
                  </div>
                  <TextAreaField label="14. What does your company believe differently compared to others in your industry?" placeholder={"Example:\nMost brands focus on reach. We focus on credibility and community trust."} value={profile.unique_perspective} onChange={(val) => setProfile({...profile, unique_perspective: val})} />
                </section>

                {/* Section 10 — Founder Perspective */}
                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-black flex items-center justify-center text-xs font-black italic text-white">10</div>
                    <h3 className="text-xs font-black tracking-[0.3em] uppercase text-black/80">Founder or Brand Perspective</h3>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[11px] font-black tracking-widest uppercase text-gray-500">15. Complete this sentence: "Most people misunderstand our industry because ______."</label>
                    <textarea
                      className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-medium text-black placeholder-gray-300 focus:outline-none focus:border-black/20 focus:bg-white transition-all resize-none"
                      rows={3}
                      placeholder="Example: they assume success depends only on advertising instead of distribution and trust."
                      value={profile.misunderstood}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setProfile({...profile, misunderstood: e.target.value})}
                    />
                  </div>
                </section>

                {/* Section 11 — AI Guardrails */}
                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-black flex items-center justify-center text-xs font-black italic text-white">11</div>
                    <h3 className="text-xs font-black tracking-[0.3em] uppercase text-black/80">AI Guardrails</h3>
                  </div>
                  <TextAreaField label="16. What should the AI NEVER say about your company?" placeholder={"Example:\nDo not fabricate statistics\nDo not sound overly promotional\nAvoid generic marketing clichés"} value={profile.ai_guardrails} onChange={(val) => setProfile({...profile, ai_guardrails: val})} />
                </section>

                {/* Section 12 — Core Brand Idea */}
                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-black flex items-center justify-center text-xs font-black italic text-white">12</div>
                    <h3 className="text-xs font-black tracking-[0.3em] uppercase text-black/80">Core Brand Idea</h3>
                  </div>
                  <InputField label="17. If you had to summarize your brand philosophy in one sentence, what would it be?" placeholder="Example: The best marketing spreads through communities, not ads." value={profile.brand_philosophy} onChange={(val) => setProfile({...profile, brand_philosophy: val})} />
                </section>

                {/* Section 13 — Content Tone */}
                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-black flex items-center justify-center text-xs font-black italic text-white">13</div>
                    <h3 className="text-xs font-black tracking-[0.3em] uppercase text-black/80">Content Tone</h3>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-[11px] font-black tracking-widest uppercase text-gray-500">18. How should your LinkedIn content sound? (select all that apply)</label>
                    <div className="flex flex-wrap gap-3">
                      {['Insightful', 'Educational', 'Contrarian', 'Storytelling', 'Tactical', 'Opinionated', 'Humorous'].map((opt) => {
                        const selected = (profile.content_tone || '').split(',').map((s: string) => s.trim()).filter(Boolean).includes(opt);
                        return (
                          <button key={opt} onClick={() => {
                            const current = (profile.content_tone || '').split(',').map((s: string) => s.trim()).filter(Boolean);
                            const updated = selected ? current.filter((c: string) => c !== opt) : [...current, opt];
                            setProfile({...profile, content_tone: updated.join(', ')});
                          }}
                            className={`px-5 py-2.5 rounded-2xl text-[11px] font-black tracking-wide transition-all duration-200 border-2 ${selected ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300 hover:text-black'}`}>
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </section>

                {/* Section 14 — Content Inspiration */}
                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-black flex items-center justify-center text-xs font-black italic text-white">14</div>
                    <h3 className="text-xs font-black tracking-[0.3em] uppercase text-black/80">Content Inspiration</h3>
                  </div>
                  <InputField label="19. Are there any creators, founders, or companies whose content style you admire?" placeholder="Example: marketing creators, startup founders, SaaS leaders" value={profile.content_inspiration} onChange={(val) => setProfile({...profile, content_inspiration: val})} />
                </section>

                {/* Section 15 — Competitive Advantage */}
                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-black flex items-center justify-center text-xs font-black italic text-white">15</div>
                    <h3 className="text-xs font-black tracking-[0.3em] uppercase text-black/80">Competitive Advantage</h3>
                  </div>
                  <TextAreaField label="20. What is your biggest competitive advantage?" placeholder={"Example:\nA strong community network\nProprietary technology\nDeep industry expertise"} value={profile.competitive_advantage} onChange={(val) => setProfile({...profile, competitive_advantage: val})} />
                </section>

              </div>

              {/* Action Bar */}
              <div className="fixed bottom-10 left-[calc(50%+144px)] -translate-x-1/2 z-50 w-full max-w-sm px-6">
                <div className="bg-white/70 backdrop-blur-2xl border border-white/40 p-3 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center justify-between gap-4">
                  <p className="text-[9px] font-black tracking-[0.2em] uppercase text-gray-400 ml-6 flex-1">
                    {saving ? 'SYNCING...' : saveMessage || 'SYSTEM READY'}
                  </p>
                  <button 
                    onClick={handleUpdateProfile}
                    className="bg-black text-white px-8 py-4 rounded-[1.8rem] font-black text-[10px] tracking-widest uppercase hover:scale-[1.05] active:scale-95 transition-all shadow-xl flex items-center gap-2 group"
                  >
                    {saving ? 'SAVING' : 'GENERATE MY CONTENT STRATEGY'}
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'generate' && (
            <div className="space-y-16 animate-in fade-in zoom-in-[0.98] duration-1000 ease-out">
              <header className="flex items-end justify-between border-b border-gray-100 pb-12">
                <div className="space-y-4">
                  <div className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-[9px] font-black tracking-[0.2em] uppercase shadow-sm">Command Center</div>
                  <h2 className="text-5xl font-black tracking-tighter uppercase leading-[0.9]">Strategic<br/>Asset Forge</h2>
                  <p className="text-gray-400 font-medium text-lg">Convert your Brand DNA into authority-building content nodes.</p>
                </div>
                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="bg-black text-white px-10 py-6 rounded-[2rem] font-black text-xs tracking-[0.2em] uppercase shadow-[0_20px_40px_rgba(0,0,0,0.15)] hover:bg-[#111] hover:scale-105 active:scale-95 transition-all disabled:opacity-30 flex items-center gap-4 group"
                >
                  {isGenerating ? 'FORGING...' : 'IGNITE ENGINE'}
                  <Zap className={cn("w-5 h-5 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-125", isGenerating && "animate-pulse")} />
                </button>
              </header>

              {isGenerating ? (
                <div className="py-40 text-center space-y-8 animate-pulse">
                  <div className="flex justify-center">
                    <div className="w-20 h-20 border-4 border-gray-50 border-t-black rounded-3xl animate-spin" />
                  </div>
                  <div className="space-y-3">
                    <p className="text-[10px] font-black tracking-[0.5em] uppercase text-black">The Engine is Reasoning</p>
                    <p className="text-sm text-gray-400 font-medium italic">Lining up specific POVs from your DNA profile...</p>
                  </div>
                </div>
              ) : generatedPosts.length > 0 ? (
                <div className="grid grid-cols-1 gap-10">
                  {generatedPosts.filter((post: any) => post.content && post.content.trim().length > 30).map((post: any, i: number) => (
                    <div 
                      key={i} 
                      className="group bg-white border border-gray-100 p-12 rounded-[3.5rem] shadow-sm hover:shadow-2xl hover:border-black/5 transition-all duration-700 animate-in fade-in slide-in-from-bottom-12"
                      style={{ animationDelay: `${i * 150}ms` }}
                    >
                      <div className="flex items-center justify-between mb-10 pb-4 border-b border-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-black/5 flex items-center justify-center text-[11px] font-black italic">#{i+1}</div>
                          <span className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-300">AUTHORITY ASSET</span>
                        </div>
                        <button className="text-[9px] font-black uppercase tracking-widest text-gray-300 hover:text-black hover:tracking-[0.3em] transition-all">Copy Node</button>
                      </div>
                      <div className="space-y-6">
                        {post.content.split('\n').map((para: string, idx: number) => (
                          <p key={idx} className="text-gray-800 text-lg leading-relaxed font-medium">{para}</p>
                        ))}
                      </div>
                      <div className="mt-12 pt-8 flex items-center gap-6">
                        <div className="h-px flex-1 bg-gray-50" />
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-200">Format: LinkedIn Text</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-40 border-4 border-dashed border-gray-50 rounded-[4rem] text-center space-y-6 group hover:border-gray-100 transition-colors">
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-200 group-hover:scale-110 group-hover:text-black transition-all duration-700">
                      <Zap className="w-10 h-10" />
                    </div>
                  </div>
                  <p className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-300">Zero nodes in sequence</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="animate-in fade-in zoom-in-95 duration-1000 text-center py-40">
              <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8">
                <Layers className="w-10 h-10 text-gray-200" />
              </div>
              <h2 className="text-2xl font-black tracking-tighter uppercase mb-4">Laboratory: Coming Soon</h2>
              <p className="text-gray-400 font-medium text-lg max-w-sm mx-auto">Automated quote cards and carousel slide generation is currently being calibrated in our labs.</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-16 animate-in fade-in slide-in-from-right-8 duration-1000">
              <header className="space-y-4">
                <div className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-[9px] font-black tracking-[0.2em] uppercase">Control Panel</div>
                <h2 className="text-5xl font-black tracking-tighter uppercase">Engine Calibrations</h2>
              </header>

              <div className="max-w-xl space-y-10">
                <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Strategic Persona</label>
                    <select 
                      className="w-full p-5 bg-gray-50/50 border border-gray-100 rounded-[1.5rem] focus:border-black font-black text-xs appearance-none cursor-pointer outline-none"
                      value={profile.core_tone}
                      onChange={(e) => setProfile({...profile, core_tone: e.target.value})}
                    >
                      <option>Contrarian & Provocative</option>
                      <option>Empathetic & Warm</option>
                      <option>Authoritative & Professional</option>
                      <option>Direct & Brutalist</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">LMM Filters (Words to Kill)</label>
                    <textarea 
                      className="w-full p-5 bg-gray-50/50 border border-gray-100 rounded-[1.5rem] focus:border-black font-medium text-sm h-32 resize-none outline-none" 
                      placeholder="Comma separated blacklist..."
                      value={profile.words_to_kill}
                      onChange={(e) => setProfile({...profile, words_to_kill: e.target.value})}
                    />
                  </div>
                  
                  <div className="pt-6">
                    <button 
                      onClick={handleUpdateProfile}
                      className="w-full bg-black text-white px-8 py-5 rounded-[1.5rem] font-black text-[11px] tracking-[0.2em] uppercase hover:shadow-2xl transition-all"
                    >
                      Update Engine
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

{/* Refined Input Components */}
function InputField({ label, placeholder, value, onChange }: { label: string, placeholder: string, value: string, onChange: (val: string) => void }) {
  return (
    <div className="space-y-3">
      <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">{label}</label>
      <input 
        className="w-full px-6 py-5 bg-white border border-gray-100 rounded-[1.5rem] shadow-sm focus:border-black focus:ring-4 focus:ring-black/5 outline-none font-medium transition-all hover:border-gray-200" 
        placeholder={placeholder}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      />
    </div>
  );
}

function TextAreaField({ label, placeholder, value, onChange }: { label: string, placeholder: string, value: string, onChange: (val: string) => void }) {
  return (
    <div className="space-y-3">
      <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">{label}</label>
      <textarea 
        className="w-full px-6 py-5 bg-white border border-gray-100 rounded-[2rem] shadow-sm focus:border-black focus:ring-4 focus:ring-black/5 outline-none font-medium h-36 resize-none transition-all hover:border-gray-200 leading-relaxed" 
        placeholder={placeholder}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
      />
    </div>
  );
}
