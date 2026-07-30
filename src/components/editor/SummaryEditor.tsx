import React from 'react';
import { FileText } from 'lucide-react';
import { useCVStore } from '../../store/useCVStore';
import { useTranslation } from 'react-i18next';

export const SummaryEditor: React.FC = () => {
  const { t } = useTranslation();
  const { activeProfile, updateSummary } = useCVStore();

  if (!activeProfile) return null;

  return (
    <div className="bg-[#131b2e] border border-[#222f47] rounded-2xl p-5 mb-6 space-y-3">
      <div className="flex items-center justify-between border-b border-[#222f47] pb-3">
        <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-400" />
          <span>{t('editor.summary')}</span>
        </h2>
        <span className="text-[11px] text-slate-500 font-mono">
          {activeProfile.summary.split(/\s+/).filter(Boolean).length} words
        </span>
      </div>

      <textarea
        rows={4}
        value={activeProfile.summary}
        onChange={(e) => updateSummary(e.target.value)}
        placeholder="Write a compelling professional summary highlighting your key achievements, skills, and value..."
        className="w-full bg-[#0d1322] border border-[#222f47] focus:border-blue-500 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 outline-none leading-relaxed resize-y transition-all"
      />
    </div>
  );
};
