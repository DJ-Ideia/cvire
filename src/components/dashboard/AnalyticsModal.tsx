import React from 'react';
import { X, BarChart3, Clock, Zap, Percent, Hash } from 'lucide-react';
import { useCVStore } from '../../store/useCVStore';
import { useUIStore } from '../../store/useUIStore';
import { calculateResumeAnalytics } from '../../services/analyticsService';

export const AnalyticsModal: React.FC = () => {
  const { activeProfile } = useCVStore();
  const { activeModal, closeModal } = useUIStore();

  if (activeModal !== 'analytics' || !activeProfile) return null;

  const stats = calculateResumeAnalytics(activeProfile);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#131b2e] border border-[#222f47] rounded-3xl max-w-xl w-full p-6 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-[#222f47] pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Resume Analytics</h2>
              <p className="text-xs text-slate-400">Content metrics & recruiter reading time</p>
            </div>
          </div>

          <button
            onClick={closeModal}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-[#0d1322] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#0d1322] border border-[#222f47] p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>Est. Reading Time</span>
            </div>
            <div className="text-2xl font-bold font-mono text-slate-100">
              {stats.readingTimeSeconds} <span className="text-xs text-slate-400 font-normal">sec</span>
            </div>
          </div>

          <div className="bg-[#0d1322] border border-[#222f47] p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Hash className="w-4 h-4 text-purple-400" />
              <span>Word Count</span>
            </div>
            <div className="text-2xl font-bold font-mono text-slate-100">
              {stats.wordCount} <span className="text-xs text-slate-400 font-normal">words</span>
            </div>
          </div>

          <div className="bg-[#0d1322] border border-[#222f47] p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Action Verbs</span>
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-400">
              {stats.actionVerbRatio}%
            </div>
          </div>

          <div className="bg-[#0d1322] border border-[#222f47] p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Percent className="w-4 h-4 text-amber-400" />
              <span>Metric Density</span>
            </div>
            <div className="text-2xl font-bold font-mono text-amber-400">
              {stats.metricDensityRatio}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
