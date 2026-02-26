"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a PDF resume to upload.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("resume", file);
    if (jobDescription) {
      formData.append("jobDescription", jobDescription);
    }

    try {
      const response = await fetch("/api/score", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze resume");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0D0D0D] text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 p-6 flex flex-col gap-8 hidden md:flex">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#D1FF00] flex items-center justify-center">
            <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
          </div>
          <span className="font-bold text-xl tracking-tight">Vibe ATS</span>
        </div>

        <nav className="flex flex-col gap-2">
          <div className="px-4 py-2 rounded-lg bg-white/5 text-[#D1FF00] font-medium flex items-center gap-3 cursor-pointer">
            <svg className="w-5 h-5 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            Dashboard
          </div>
          <div className="px-4 py-2 rounded-lg text-white/50 hover:bg-white/5 hover:text-white transition-all flex items-center gap-3 cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2" /></svg>
            Analytics
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 relative">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D1FF00]/10 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />

        <div className="max-w-6xl mx-auto">
          <header className="mb-10 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-1">AI ATS Analysis</h1>
              <p className="text-white/50">Upload and optimize your resume for maximum impact.</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-medium">History</button>
              <button className="px-4 py-2 rounded-lg bg-[#D1FF00] text-black font-bold text-sm hover:opacity-90 transition-all shadow-[0_0_20px_rgba(209,255,0,0.3)]">New Scan</button>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Form Card */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <form onSubmit={handleSubmit} className="glass p-6 rounded-2xl flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-white/70 uppercase tracking-widest">Target Job</label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste job description..."
                    className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-sm focus:border-[#D1FF00] outline-none transition-all resize-none placeholder:text-white/20"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-white/70 uppercase tracking-widest">Resume (PDF)</label>
                  <div className="relative border-2 border-dashed border-white/10 rounded-xl hover:border-[#D1FF00]/50 transition-all p-8 flex flex-col items-center justify-center cursor-pointer bg-black/20 group">
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {file ? (
                      <div className="text-center">
                        <p className="text-[#D1FF00] font-medium">{file.name}</p>
                        <p className="text-xs text-white/30 truncate">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                          <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
                        </div>
                        <p className="text-sm text-white/40">Drop resume here</p>
                      </div>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !file}
                  className="w-full py-4 rounded-xl font-bold text-black bg-[#D1FF00] disabled:bg-white/10 disabled:text-white/30 transition-all shadow-[0_0_20px_rgba(209,255,0,0.2)]"
                >
                  {loading ? "Analyzing..." : "Analyze Profile"}
                </button>
              </form>
            </div>

            {/* Dashboard Results */}
            <div className="lg:col-span-8">
              {loading ? (
                <div className="h-[500px] glass rounded-3xl flex flex-col items-center justify-center gap-4">
                  <div className="w-12 h-12 border-2 border-[#D1FF00]/20 border-t-[#D1FF00] rounded-full animate-spin" />
                  <p className="text-white/50 animate-pulse font-medium">Generating Deep Analysis...</p>
                </div>
              ) : result ? (
                <div className="flex flex-col gap-6 animate-in fade-in duration-700">
                  {/* Top Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                      <div className="text-5xl font-black text-[#D1FF00] mb-2">{result.score}%</div>
                      <div className="text-xs font-bold uppercase tracking-widest text-white/40">Match Score</div>
                    </div>
                    <div className="glass p-6 rounded-2xl md:col-span-2">
                      <p className="text-sm text-white/70 italic leading-relaxed">"{result.summary}"</p>
                    </div>
                  </div>

                  {/* Skills Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass p-6 rounded-2xl">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-[#D1FF00] mb-4">Matched Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {result.skills?.matched?.map((s: string, i: number) => (
                          <span key={i} className="px-3 py-1 bg-[#D1FF00]/10 text-[#D1FF00] border border-[#D1FF00]/20 rounded-full text-xs font-medium">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div className="glass p-6 rounded-2xl">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-red-400 mb-4">Missing Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {result.skills?.missing?.map((s: string, i: number) => (
                          <span key={i} className="px-3 py-1 bg-red-400/10 text-red-400 border border-red-400/20 rounded-full text-xs font-medium">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Analysis Breakdown */}
                  <div className="glass p-8 rounded-3xl flex flex-col gap-8">
                    <div className="flex flex-col gap-2">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-white/60">Experience Deep Dive</h3>
                      <p className="text-sm text-white/80 leading-relaxed">{result.experience_analysis}</p>
                    </div>
                    <div className="w-full h-px bg-white/5" />
                    <div className="flex flex-col gap-2">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-white/60">Education & Growth</h3>
                      <p className="text-sm text-white/80 leading-relaxed">{result.education_analysis}</p>
                    </div>
                  </div>

                  {/* Action Items */}
                  <div className="glass p-8 border-l-4 border-l-[#D1FF00] rounded-2xl">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      Optimize for Success
                      <span className="text-[10px] bg-[#D1FF00] text-black px-2 py-0.5 rounded-full uppercase">Priority</span>
                    </h3>
                    <ul className="flex flex-col gap-4">
                      {result.action_items?.map((item: string, i: number) => (
                        <li key={i} className="text-sm text-white/80 flex items-start gap-3">
                          <span className="w-5 h-5 rounded-full bg-white/5 flex-shrink-0 flex items-center justify-center text-[10px] text-[#D1FF00] font-bold">{i + 1}</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              ) : (
                <div className="h-[500px] border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center p-12 text-center opacity-40">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Ready for Scan</h2>
                  <p className="max-w-xs text-sm">Upload your resume to see the deep vertical analysis and compatibility score.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
