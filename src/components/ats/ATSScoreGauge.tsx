import React from 'react';
import { X, ShieldAlert, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { useCVStore } from '../../store/useCVStore';
import { useUIStore } from '../../store/useUIStore';
import { calculateATSScore } from '../../services/atsEngine';

export const ATSScoreGauge: React.FC = () => {
  const { activeProfile } = useCVStore();
  const { activeModal, closeModal } = useUIStore();

  if (activeModal !== 'ats-linter' || !activeProfile) return null;

  const { breakdown, diagnostics } = calculateATSScore(activeProfile);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 60) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#131b2e] border border-[#222f47] rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[#222f47] pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">ATS Score & Resume Linter</h2>
              <p className="text-xs text-slate-400">Real-time ATS parsing score and optimization rules</p>
            </div>
          </div>

          <button
            onClick={closeModal}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-[#0d1322] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overall Score Header */}
        <div className="flex items-center justify-between bg-[#0d1322] border border-[#222f47] p-5 rounded-2xl mb-6">
          <div>
            <h3 className="text-sm font-bold text-slate-200">Overall ATS Score</h3>
            <p className="text-xs text-slate-400">Calculated based on 6 weighted ATS parsing benchmarks.</p>
          </div>
          <div className={`px-5 py-3 rounded-2xl border font-mono font-extrabold text-2xl ${getScoreColor(breakdown.totalScore)}`}>
            {breakdown.totalScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
          </div>
        </div>

        {/* Category Breakdown Progress Bars */}
        <div className="space-y-3 mb-6 bg-[#0d1322] border border-[#222f47] p-4 rounded-2xl">
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium text-slate-300">
              <span>Structure & Format (20%)</span>
              <span>{breakdown.structureScore}%</span>
            </div>
            <div className="w-full bg-[#131b2e] h-2 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full transition-all" style={{ width: `${breakdown.structureScore}%` }} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium text-slate-300">
              <span>Metrics & Quantification (20%)</span>
              <span>{breakdown.metricsScore}%</span>
            </div>
            <div className="w-full bg-[#131b2e] h-2 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full transition-all" style={{ width: `${breakdown.metricsScore}%` }} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium text-slate-300">
              <span>Action Verbs (15%)</span>
              <span>{breakdown.actionVerbsScore}%</span>
            </div>
            <div className="w-full bg-[#131b2e] h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full transition-all" style={{ width: `${breakdown.actionVerbsScore}%` }} />
            </div>
          </div>
        </div>

        {/* Diagnostics List */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Linter Recommendations ({diagnostics.length})
          </h4>

          {diagnostics.length > 0 ? (
            <div className="space-y-3">
              {diagnostics.map((d) => (
                <div key={d.id} className="bg-[#0d1322] border border-[#222f47] p-4 rounded-xl flex items-start gap-3">
                  {d.severity === 'error' && <ShieldAlert className="w-4 h-4 text-rose-400 mt-0.5" />}
                  {d.severity === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5" />}
                  {d.severity === 'info' && <Info className="w-4 h-4 text-blue-400 mt-0.5" />}

                  <div>
                    <h5 className="text-xs font-bold text-slate-200">{d.title}</h5>
                    <p className="text-xs text-slate-400 mt-0.5">{d.message}</p>
                    {d.suggestion && (
                      <p className="text-[11px] text-blue-400 font-medium mt-1">Tip: {d.suggestion}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Great job! No ATS anti-patterns detected.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
