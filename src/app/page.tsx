"use client";

import { useState } from "react";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 font-sans p-6 md:p-12">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 mb-4">
            AI Resume ATS Checker
          </h1>
          <p className="text-slate-400 text-lg">
            Upload your resume and get instant feedback and compatibility scoring powered by Gemini AI.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Form Column */}
          <div className="bg-slate-800/50 p-6 md:p-8 rounded-2xl border border-slate-700/50 backdrop-blur-xl shadow-2xl">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-300">Target Job Description (Optional but recommended)</label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                  className="w-full h-32 bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-300">Upload Resume (PDF only)</label>
                <div className="relative group border-2 border-dashed border-slate-600 rounded-xl hover:border-indigo-500 transition-colors p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-900/30">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="file-upload"
                  />
                  {file ? (
                    <div className="text-center">
                      <p className="text-indigo-400 font-medium truncate max-w-[200px]">{file.name}</p>
                      <p className="text-xs text-slate-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <div className="text-center text-slate-400">
                      <p className="font-medium text-slate-300">Drop PDF here or click to browse</p>
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !file}
                className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-indigo-500/25"
              >
                {loading ? "Analyzing Resume..." : "Score My Resume"}
              </button>
            </form>
          </div>

          {/* Results Column */}
          <div className="bg-slate-800/50 p-6 md:p-8 rounded-2xl border border-slate-700/50 backdrop-blur-xl shadow-2xl flex flex-col">

            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                <p className="animate-pulse">Gemini is analyzing...</p>
              </div>
            ) : result ? (
              <div className="flex-1 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Score Header */}
                <div className="flex flex-col items-center text-center pb-6 border-b border-slate-700">
                  <div className="relative flex items-center justify-center mb-4">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle cx="64" cy="64" r="56" className="stroke-slate-700 fill-none" strokeWidth="12" />
                      <circle
                        cx="64" cy="64" r="56"
                        className={"fill-none " + (result.score >= 80 ? "stroke-green-500" : result.score >= 50 ? "stroke-yellow-500" : "stroke-red-500")}
                        strokeWidth="12"
                        strokeDasharray="351"
                        strokeDashoffset={351 - (351 * result.score) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center text-3xl font-bold">
                      {result.score}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold">ATS Compatibility Score</h3>
                </div>

                {/* Feedback Sections */}
                <div className="flex flex-col gap-4">
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                    <h4 className="text-sm font-bold text-indigo-400 mb-2 uppercase tracking-wider">Overall Feedback</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">{result.feedback}</p>
                  </div>

                  <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                    <h4 className="text-sm font-bold text-emerald-400 mb-2 uppercase tracking-wider">Format Review</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">{result.formatFeedback}</p>
                  </div>

                  {result.keywordMatches && result.keywordMatches.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Matched Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.keywordMatches.map((kw: string, i: number) => (
                          <span key={i} className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-medium">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.missingKeywords && result.missingKeywords.length > 0 && (
                    <div className="flex flex-col gap-2 mt-2">
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Missing Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.missingKeywords.map((kw: string, i: number) => (
                          <span key={i} className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-xs font-medium">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-center p-6">
                <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>Upload a resume and optional job description to see your ATS analysis.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
