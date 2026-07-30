import React from 'react';
import { X, FileCode } from 'lucide-react';
import { useCVStore } from '../../store/useCVStore';
import { useUIStore } from '../../store/useUIStore';

export const ATSPlainPreviewModal: React.FC = () => {
  const { activeProfile } = useCVStore();
  const { activeModal, closeModal } = useUIStore();

  if (activeModal !== 'ats-preview' || !activeProfile) return null;

  const p = activeProfile.personal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#131b2e] border border-[#222f47] rounded-3xl max-w-3xl w-full p-6 shadow-2xl relative max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-[#222f47] pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">ATS Robot Text View</h2>
              <p className="text-xs text-slate-400">
                Raw unstyled text extracted by automated scanners (Workday, Taleo, Greenhouse)
              </p>
            </div>
          </div>

          <button
            onClick={closeModal}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-[#0d1322] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Monospace Raw Parser Output */}
        <div className="flex-1 overflow-y-auto bg-[#0d1322] border border-[#222f47] rounded-2xl p-5 font-mono text-xs text-slate-300 leading-relaxed space-y-4 select-all">
          <div>
            <div className="text-emerald-400 font-bold">=== PERSONAL INFORMATION ===</div>
            <div>Name: {p.fullName || 'N/A'}</div>
            <div>Title: {p.jobTitle || 'N/A'}</div>
            <div>Email: {p.email || 'N/A'}</div>
            <div>Phone: {p.phone || 'N/A'}</div>
            <div>Location: {p.location || 'N/A'}</div>
          </div>

          {activeProfile.summary && (
            <div>
              <div className="text-emerald-400 font-bold">=== SUMMARY ===</div>
              <div>{activeProfile.summary}</div>
            </div>
          )}

          {activeProfile.sectionsOrder.map((secId) => {
            const sec = activeProfile.sections[secId];
            if (!sec || !sec.visible) return null;

            return (
              <div key={sec.id} className="space-y-2">
                <div className="text-emerald-400 font-bold uppercase">=== SECTION: {sec.title} ===</div>
                {sec.items.map((item) => (
                  <div key={item.id} className="pl-3 border-l-2 border-slate-700 space-y-1">
                    <div className="text-slate-100 font-semibold">{item.title} | {item.subtitle}</div>
                    <div className="text-slate-400 text-[11px]">{item.startDate} - {item.endDate}</div>
                    {item.bulletItems.filter((b) => b.enabled).map((b) => (
                      <div key={b.id}>- {b.text}</div>
                    ))}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
