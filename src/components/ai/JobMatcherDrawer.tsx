import React, { useState } from 'react';
import { X, Target, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { useCVStore } from '../../store/useCVStore';
import { useUIStore } from '../../store/useUIStore';
import { calculateJobMatch } from '../../services/jobMatcher';
import { JobMatchResult } from '../../types/ats';

export const JobMatcherDrawer: React.FC = () => {
  const { activeProfile } = useCVStore();
  const { activeModal, closeModal } = useUIStore();
  const [jobText, setJobText] = useState('');
  const [matchResult, setMatchResult] = useState<JobMatchResult | null>(null);

  if (activeModal !== 'job-matcher' || !activeProfile) return null;

  const handleAnalyze = () => {
    const res = calculateJobMatch(activeProfile, jobText);
    setMatchResult(res);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#131b2e] border border-[#222f47] rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[#222f47] pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Job Description Matcher</h2>
              <p className="text-xs text-slate-400">Compare your CV against target job requirements</p>
            </div>
          </div>

          <button
            onClick={closeModal}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-[#0d1322] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Textarea */}
        <div className="space-y-3 mb-6">
          <label className="block text-xs font-semibold text-slate-300">
            Paste Job Description / Requirements
          </label>
          <textarea
            rows={5}
            value={jobText}
            onChange={(e) => setJobText(e.target.value)}
            placeholder="Paste the job posting requirements here..."
            className="w-full bg-[#0d1322] border border-[#222f47] focus:border-purple-500 rounded-xl p-3 text-xs text-slate-200 outline-none leading-relaxed"
          />

          <button
            onClick={handleAnalyze}
            className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Analyze Match %</span>
          </button>
        </div>

        {/* Match Result Display */}
        {matchResult && (
          <div className="space-y-4 bg-[#0d1322] border border-[#222f47] p-5 rounded-2xl">
            <div className="flex items-center justify-between border-b border-[#222f47] pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-200">Match Compatibility</h3>
                <p className="text-xs text-slate-400">
                  {matchResult.matchedKeywordsCount} matched / {matchResult.missingKeywordsCount} missing keywords
                </p>
              </div>
              <div className="text-2xl font-extrabold font-mono text-purple-400">
                {matchResult.matchPercentage}%
              </div>
            </div>

            {/* Keyword Chips */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Extracted Keyword Match Status
              </h4>
              <div className="flex flex-wrap gap-2">
                {matchResult.keywords.map((kw, i) => (
                  <span
                    key={i}
                    className={`text-xs px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1.5 ${
                      kw.status === 'matched' || kw.status === 'overused'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                    }`}
                  >
                    {kw.status === 'matched' ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5" />
                    )}
                    <span>{kw.keyword}</span>
                    <span className="text-[10px] opacity-70">({kw.countInCV}/{kw.countInJob})</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
