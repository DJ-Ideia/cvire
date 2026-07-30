import React from 'react';
import { X, LayoutTemplate, Check } from 'lucide-react';
import { useCVStore } from '../../store/useCVStore';
import { useUIStore } from '../../store/useUIStore';
import { templateRegistry } from './registry';

export const TemplatePickerModal: React.FC = () => {
  const { activeProfile, setTemplateId } = useCVStore();
  const { activeModal, closeModal } = useUIStore();

  if (activeModal !== 'template-picker' || !activeProfile) return null;

  const currentTemplateId = activeProfile.templateId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#131b2e] border border-[#222f47] rounded-3xl max-w-3xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#222f47] pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Select Template</h2>
              <p className="text-xs text-slate-400">Choose a professional visual layout for your resume</p>
            </div>
          </div>

          <button
            onClick={closeModal}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-[#0d1322] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {Object.values(templateRegistry).map((manifest) => {
            const isSelected = currentTemplateId === manifest.id;

            return (
              <div
                key={manifest.id}
                onClick={() => {
                  setTemplateId(manifest.id);
                  closeModal();
                }}
                className={`group bg-[#0d1322] border rounded-2xl p-4 cursor-pointer transition-all duration-200 relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-500/30 shadow-lg shadow-blue-500/20'
                    : 'border-[#222f47] hover:border-slate-500'
                }`}
              >
                {/* Active Badge */}
                {isSelected && (
                  <div className="absolute top-3 right-3 bg-blue-600 text-white rounded-full p-1 shadow-md">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}

                <div>
                  <div className="w-full h-32 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 mb-4 flex items-center justify-center text-slate-500 group-hover:scale-[1.02] transition-transform overflow-hidden relative">
                    <div className="p-3 text-center">
                      <LayoutTemplate className="w-8 h-8 mx-auto mb-1 text-blue-400/80" />
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                        {manifest.layoutType}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
                    {manifest.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {manifest.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#222f47] flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-mono">v{manifest.version}</span>
                  <span className={`font-semibold ${isSelected ? 'text-blue-400' : 'text-slate-400'}`}>
                    {isSelected ? 'Active' : 'Select'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
