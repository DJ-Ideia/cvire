import React, { useState } from 'react';
import { Plus, Eye, EyeOff, Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { useCVStore } from '../../store/useCVStore';
import { useTranslation } from 'react-i18next';

export const SectionsList: React.FC = () => {
  const { t } = useTranslation();
  const {
    activeProfile,
    toggleSectionVisibility,
    deleteSection,
    addSection,
    addSectionItem,
    deleteSectionItem,
    updateSectionTitle,
  } = useCVStore();

  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [isAddingSection, setIsAddingSection] = useState(false);

  if (!activeProfile) return null;

  const sectionsList = activeProfile.sectionsOrder
    .map((id) => activeProfile.sections[id])
    .filter(Boolean);

  const handleCreateSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionTitle.trim()) return;
    addSection('custom', newSectionTitle.trim());
    setNewSectionTitle('');
    setIsAddingSection(false);
  };

  const handleAddItem = (secId: string) => {
    addSectionItem(secId, {
      title: 'New Position / Project',
      subtitle: 'Organization',
      startDate: 'Jan 2024',
      endDate: 'Present',
      bulletItems: [
        { id: `b-${Date.now()}`, text: 'Led key initiative improving metrics by 25%.', enabled: true },
      ],
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-100">{t('editor.sections')}</h2>
        <button
          onClick={() => setIsAddingSection(true)}
          className="px-3 py-1.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t('editor.addSection')}</span>
        </button>
      </div>

      {/* Add Custom Section Form */}
      {isAddingSection && (
        <form onSubmit={handleCreateSection} className="bg-[#131b2e] border border-blue-500/50 p-4 rounded-2xl flex gap-3">
          <input
            type="text"
            placeholder="Section Title (e.g. Certifications, Projects)"
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
            className="flex-1 bg-[#0d1322] border border-[#222f47] rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
            autoFocus
          />
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl">
            Save
          </button>
          <button
            type="button"
            onClick={() => setIsAddingSection(false)}
            className="px-3 py-2 bg-slate-800 text-slate-400 text-xs rounded-xl"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Section List */}
      <div className="space-y-3">
        {sectionsList.map((sec) => {
          const isExpanded = expandedSection === sec.id;

          return (
            <div
              key={sec.id}
              className={`bg-[#131b2e] border rounded-2xl transition-all overflow-hidden ${
                sec.visible ? 'border-[#222f47]' : 'border-[#222f47]/50 opacity-60'
              }`}
            >
              {/* Header */}
              <div className="p-4 flex items-center justify-between gap-3 bg-[#131b2e]">
                <div className="flex items-center gap-3 flex-1">
                  <GripVertical className="w-4 h-4 text-slate-600 cursor-grab" />
                  <input
                    type="text"
                    value={sec.title}
                    onChange={(e) => updateSectionTitle(sec.id, e.target.value)}
                    className="bg-transparent font-bold text-sm text-slate-100 outline-none border-b border-transparent focus:border-blue-500 px-1"
                  />
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#0d1322] text-slate-400 border border-[#222f47]">
                    {sec.column}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleSectionVisibility(sec.id)}
                    className="p-1.5 text-slate-400 hover:text-slate-200"
                    title="Toggle Visibility"
                  >
                    {sec.visible ? <Eye className="w-4 h-4 text-blue-400" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => deleteSection(sec.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400"
                    title="Delete Section"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setExpandedSection(isExpanded ? null : sec.id)}
                    className="p-1.5 text-slate-400 hover:text-slate-200"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Items Expanded Body */}
              {isExpanded && (
                <div className="p-4 border-t border-[#222f47] bg-[#0d1322]/50 space-y-3">
                  {sec.items.map((item) => (
                    <div key={item.id} className="bg-[#131b2e] border border-[#222f47] p-3.5 rounded-xl space-y-2 text-xs">
                      <div className="flex justify-between items-start gap-2">
                        <div className="font-semibold text-slate-200">{item.title}</div>
                        <button
                          onClick={() => deleteSectionItem(sec.id, item.id)}
                          className="text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-slate-400 text-[11px]">{item.subtitle} • {item.startDate} - {item.endDate}</div>

                      {/* Bullets count */}
                      <div className="text-[11px] text-blue-400 font-mono">
                        {item.bulletItems ? item.bulletItems.length : 0} bullet points
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => handleAddItem(sec.id)}
                    className="w-full py-2 border border-dashed border-[#222f47] hover:border-blue-500 text-slate-400 hover:text-blue-400 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t('editor.addItem')}</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
