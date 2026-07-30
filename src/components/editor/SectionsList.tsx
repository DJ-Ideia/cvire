import React, { useState } from 'react';
import { Plus, Eye, EyeOff, Trash2, GripVertical, ChevronDown, ChevronUp, CheckSquare, Square, Tag, Briefcase, ListFilter, AlignLeft, Award, FolderGit2, GraduationCap, Languages as LangIcon, Wrench } from 'lucide-react';
import { useCVStore } from '../../store/useCVStore';
import { useTranslation } from 'react-i18next';
import { SectionItem, BulletItem, SectionType } from '../../types/cv';

export const SectionsList: React.FC = () => {
  const { t } = useTranslation();
  const {
    activeProfile,
    toggleSectionVisibility,
    deleteSection,
    addSection,
    addSectionItem,
    updateSectionItem,
    deleteSectionItem,
    updateSectionTitle,
  } = useCVStore();

  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [tagInputs, setTagInputs] = useState<Record<string, string>>({});
  const [skillDisplayMode, setSkillDisplayMode] = useState<Record<string, 'tags' | 'bullets'>>({});
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [customTitleInput, setCustomTitleInput] = useState('');

  if (!activeProfile) return null;

  const sectionsList = activeProfile.sectionsOrder
    .map((id) => activeProfile.sections[id])
    .filter(Boolean);

  const toggleItemExpanded = (itemId: string) => {
    setExpandedItems((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const handleAddPresetSection = (type: SectionType, defaultTitle: string) => {
    addSection(type, defaultTitle);
    setIsAddingSection(false);
    setCustomTitleInput('');
  };

  const handleAddItem = (secId: string, secType: string) => {
    const newItemId = `item-${Date.now()}`;
    let baseItem: Partial<SectionItem> = {
      title: 'New Item',
      subtitle: '',
      startDate: '',
      endDate: '',
      bulletItems: [],
      tags: [],
    };

    if (secType === 'certifications') {
      baseItem = {
        title: 'AWS Certified Solutions Architect',
        subtitle: 'Amazon Web Services',
        startDate: '2025',
        linkUrl: 'https://credly.com',
      };
    } else if (secType === 'projects') {
      baseItem = {
        title: 'Full-Stack Data Tool',
        subtitle: 'Lead Developer • Streamlit, Python, PostgreSQL',
        startDate: 'Jan 2025',
        endDate: 'Present',
        current: true,
        linkUrl: 'https://github.com',
        tags: ['Python', 'Streamlit', 'PostgreSQL'],
        bulletItems: [
          { id: `b-${Date.now()}`, text: 'Built scalable internal data platform reducing processing time by 50%.', enabled: true },
        ],
      };
    } else if (secType === 'languages') {
      baseItem = {
        title: 'Language Name',
        subtitle: 'Proficiency Level (e.g. Native / B2)',
      };
    } else if (secType === 'education') {
      baseItem = {
        title: 'Degree / Course Name',
        subtitle: 'University / Institution',
        startDate: 'Jan 2022',
        endDate: 'Dec 2025',
      };
    } else if (secType === 'skills') {
      baseItem = {
        title: 'Skill Category',
        tags: ['Python', 'SQL', 'GCP'],
      };
    } else {
      baseItem = {
        title: 'Position / Role Title',
        subtitle: 'Company / Organization',
        startDate: 'Jan 2024',
        endDate: 'Present',
        current: true,
        bulletItems: [
          { id: `b-${Date.now()}`, text: 'Key accomplishment or responsibility using quantifiable metrics.', enabled: true },
        ],
      };
    }

    addSectionItem(secId, baseItem);
    setExpandedItems((prev) => ({ ...prev, [newItemId]: true }));
  };

  // Bullet Points Helper Mutations
  const handleUpdateBullet = (secId: string, item: SectionItem, bulletId: string, partial: Partial<BulletItem>) => {
    const updatedBullets = (item.bulletItems || []).map((b) =>
      b.id === bulletId ? { ...b, ...partial } : b
    );
    updateSectionItem(secId, item.id, { bulletItems: updatedBullets });
  };

  const handleAddBullet = (secId: string, item: SectionItem) => {
    const newBullet: BulletItem = {
      id: `b-${Date.now()}`,
      text: '',
      enabled: true,
    };
    const updatedBullets = [...(item.bulletItems || []), newBullet];
    updateSectionItem(secId, item.id, { bulletItems: updatedBullets });
  };

  const handleDeleteBullet = (secId: string, item: SectionItem, bulletId: string) => {
    const updatedBullets = (item.bulletItems || []).filter((b) => b.id !== bulletId);
    updateSectionItem(secId, item.id, { bulletItems: updatedBullets });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-100">{t('editor.sections')}</h2>
        <button
          onClick={() => setIsAddingSection(!isAddingSection)}
          className="px-3 py-1.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t('editor.addSection')}</span>
        </button>
      </div>

      {/* Add Section Quick Selector Panel */}
      {isAddingSection && (
        <div className="bg-[#131b2e] border border-blue-500/50 p-4 rounded-2xl space-y-3 animate-fade-in">
          <h3 className="text-xs font-bold text-slate-200 flex items-center justify-between">
            <span>{t('editor.selectSectionType')}</span>
            <button
              onClick={() => setIsAddingSection(false)}
              className="text-slate-400 hover:text-slate-200 text-xs"
            >
              {t('common.cancel')}
            </button>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleAddPresetSection('certifications', 'Certifications')}
              className="p-3 bg-[#0d1322] border border-[#222f47] hover:border-amber-500 hover:text-amber-400 rounded-xl text-xs font-semibold text-slate-300 flex flex-col items-center gap-1.5 transition-all cursor-pointer"
            >
              <Award className="w-5 h-5 text-amber-400" />
              <span>Certifications</span>
            </button>

            <button
              type="button"
              onClick={() => handleAddPresetSection('projects', 'Featured Projects')}
              className="p-3 bg-[#0d1322] border border-[#222f47] hover:border-purple-500 hover:text-purple-400 rounded-xl text-xs font-semibold text-slate-300 flex flex-col items-center gap-1.5 transition-all cursor-pointer"
            >
              <FolderGit2 className="w-5 h-5 text-purple-400" />
              <span>Projects</span>
            </button>

            <button
              type="button"
              onClick={() => handleAddPresetSection('skills', 'Technical Skills')}
              className="p-3 bg-[#0d1322] border border-[#222f47] hover:border-blue-500 hover:text-blue-400 rounded-xl text-xs font-semibold text-slate-300 flex flex-col items-center gap-1.5 transition-all cursor-pointer"
            >
              <Wrench className="w-5 h-5 text-blue-400" />
              <span>Technical Skills</span>
            </button>

            <button
              type="button"
              onClick={() => handleAddPresetSection('education', 'Education')}
              className="p-3 bg-[#0d1322] border border-[#222f47] hover:border-emerald-500 hover:text-emerald-400 rounded-xl text-xs font-semibold text-slate-300 flex flex-col items-center gap-1.5 transition-all cursor-pointer"
            >
              <GraduationCap className="w-5 h-5 text-emerald-400" />
              <span>Education</span>
            </button>

            <button
              type="button"
              onClick={() => handleAddPresetSection('languages', 'Languages')}
              className="p-3 bg-[#0d1322] border border-[#222f47] hover:border-indigo-500 hover:text-indigo-400 rounded-xl text-xs font-semibold text-slate-300 flex flex-col items-center gap-1.5 transition-all cursor-pointer"
            >
              <LangIcon className="w-5 h-5 text-indigo-400" />
              <span>Languages</span>
            </button>

            <button
              type="button"
              onClick={() => handleAddPresetSection('experience', 'Professional Experience')}
              className="p-3 bg-[#0d1322] border border-[#222f47] hover:border-sky-500 hover:text-sky-400 rounded-xl text-xs font-semibold text-slate-300 flex flex-col items-center gap-1.5 transition-all cursor-pointer"
            >
              <Briefcase className="w-5 h-5 text-sky-400" />
              <span>Work Experience</span>
            </button>
          </div>

          {/* Custom Title Input Option */}
          <div className="pt-2 border-t border-[#222f47] flex gap-2">
            <input
              type="text"
              placeholder="Or type a Custom Section Title..."
              value={customTitleInput}
              onChange={(e) => setCustomTitleInput(e.target.value)}
              className="flex-1 bg-[#0d1322] border border-[#222f47] rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => {
                if (customTitleInput.trim()) {
                  handleAddPresetSection('custom', customTitleInput.trim());
                }
              }}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl cursor-pointer"
            >
              {t('common.add')}
            </button>
          </div>
        </div>
      )}

      {/* Section List */}
      <div className="space-y-3">
        {sectionsList.map((sec) => {
          const isSectionExpanded = expandedSection === sec.id || expandedSection === null;
          const secType = sec.type || 'custom';

          return (
            <div
              key={sec.id}
              className={`bg-[#131b2e] border rounded-2xl transition-all overflow-hidden ${
                sec.visible ? 'border-[#222f47]' : 'border-[#222f47]/50 opacity-60'
              }`}
            >
              {/* Section Header */}
              <div className="p-4 flex items-center justify-between gap-3 bg-[#131b2e]">
                <div className="flex items-center gap-3 flex-1">
                  <GripVertical className="w-4 h-4 text-slate-600 cursor-grab" />
                  <input
                    type="text"
                    value={sec.title}
                    onChange={(e) => updateSectionTitle(sec.id, e.target.value)}
                    className="bg-transparent font-bold text-sm text-slate-100 outline-none border-b border-transparent focus:border-blue-500 px-1 transition-all"
                  />
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#0d1322] text-slate-400 border border-[#222f47]">
                    {sec.column}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleSectionVisibility(sec.id)}
                    className="p-1.5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                    title="Toggle Visibility"
                  >
                    {sec.visible ? <Eye className="w-4 h-4 text-blue-400" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => deleteSection(sec.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Delete Section"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setExpandedSection(isSectionExpanded ? 'none' : sec.id)}
                    className="p-1.5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    {isSectionExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Items Expanded Body */}
              {isSectionExpanded && (
                <div className="p-4 border-t border-[#222f47] bg-[#0d1322]/50 space-y-4">
                  {sec.items.map((item) => {
                    const isItemExpanded = expandedItems[item.id] ?? true;

                    return (
                      <div key={item.id} className="bg-[#131b2e] border border-[#222f47] rounded-xl p-4 space-y-3">
                        {/* Item Card Header */}
                        <div className="flex items-center justify-between gap-2 border-b border-[#222f47]/60 pb-2">
                          <div
                            onClick={() => toggleItemExpanded(item.id)}
                            className="flex items-center gap-2 cursor-pointer flex-1"
                          >
                            <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                            <span className="font-semibold text-xs text-slate-200">
                              {item.title || 'Untitled Item'}
                            </span>
                            {item.subtitle && (
                              <span className="text-[11px] text-slate-400 font-normal">
                                • {item.subtitle}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => deleteSectionItem(sec.id, item.id)}
                              className="p-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                              title="Delete Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => toggleItemExpanded(item.id)}
                              className="p-1 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                            >
                              {isItemExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        {/* Item Expanded Form */}
                        {isItemExpanded && (
                          <div className="space-y-3 pt-1">
                            {/* CERTIFICATIONS SECTION EDITOR */}
                            {secType === 'certifications' ? (
                              <div className="space-y-3 text-xs">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-[11px] text-slate-400 font-medium mb-1">
                                      {t('editor.certName')}
                                    </label>
                                    <input
                                      type="text"
                                      value={item.title}
                                      onChange={(e) => updateSectionItem(sec.id, item.id, { title: e.target.value })}
                                      placeholder="e.g. AWS Certified Solutions Architect"
                                      className="w-full bg-[#0d1322] border border-[#222f47] focus:border-blue-500 rounded-lg px-3 py-1.5 text-slate-200 outline-none transition-all"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[11px] text-slate-400 font-medium mb-1">
                                      {t('editor.certProvider')}
                                    </label>
                                    <input
                                      type="text"
                                      value={item.subtitle || ''}
                                      onChange={(e) => updateSectionItem(sec.id, item.id, { subtitle: e.target.value })}
                                      placeholder="e.g. Amazon Web Services"
                                      className="w-full bg-[#0d1322] border border-[#222f47] focus:border-blue-500 rounded-lg px-3 py-1.5 text-slate-200 outline-none transition-all"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-[11px] text-slate-400 font-medium mb-1">
                                      {t('editor.certDate')}
                                    </label>
                                    <input
                                      type="text"
                                      value={item.startDate || ''}
                                      onChange={(e) => updateSectionItem(sec.id, item.id, { startDate: e.target.value })}
                                      placeholder="e.g. 2025"
                                      className="w-full bg-[#0d1322] border border-[#222f47] focus:border-blue-500 rounded-lg px-3 py-1.5 text-slate-200 outline-none transition-all"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-[11px] text-slate-400 font-medium mb-1">
                                      {t('editor.linkUrl')}
                                    </label>
                                    <input
                                      type="text"
                                      value={item.linkUrl || ''}
                                      onChange={(e) => updateSectionItem(sec.id, item.id, { linkUrl: e.target.value })}
                                      placeholder="e.g. credly.com/org/..."
                                      className="w-full bg-[#0d1322] border border-[#222f47] focus:border-blue-500 rounded-lg px-3 py-1.5 text-slate-200 outline-none transition-all"
                                    />
                                  </div>
                                </div>
                              </div>
                            ) : secType === 'projects' ? (
                              /* PROJECTS SECTION EDITOR */
                              <div className="space-y-3 text-xs">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-[11px] text-slate-400 font-medium mb-1">
                                      {t('editor.projName')}
                                    </label>
                                    <input
                                      type="text"
                                      value={item.title}
                                      onChange={(e) => updateSectionItem(sec.id, item.id, { title: e.target.value })}
                                      placeholder="e.g. Full-Stack Data Tool"
                                      className="w-full bg-[#0d1322] border border-[#222f47] focus:border-blue-500 rounded-lg px-3 py-1.5 text-slate-200 outline-none transition-all"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[11px] text-slate-400 font-medium mb-1">
                                      {t('editor.projRole')}
                                    </label>
                                    <input
                                      type="text"
                                      value={item.subtitle || ''}
                                      onChange={(e) => updateSectionItem(sec.id, item.id, { subtitle: e.target.value })}
                                      placeholder="e.g. Lead Developer • Python, PostgreSQL"
                                      className="w-full bg-[#0d1322] border border-[#222f47] focus:border-blue-500 rounded-lg px-3 py-1.5 text-slate-200 outline-none transition-all"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                  <div>
                                    <label className="block text-[11px] text-slate-400 font-medium mb-1">
                                      {t('editor.startDate')}
                                    </label>
                                    <input
                                      type="text"
                                      value={item.startDate || ''}
                                      onChange={(e) => updateSectionItem(sec.id, item.id, { startDate: e.target.value })}
                                      placeholder="Jan 2025"
                                      className="w-full bg-[#0d1322] border border-[#222f47] focus:border-blue-500 rounded-lg px-3 py-1.5 text-slate-200 outline-none transition-all"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-[11px] text-slate-400 font-medium mb-1">
                                      {t('editor.endDate')}
                                    </label>
                                    <input
                                      type="text"
                                      value={item.current ? t('editor.present') : item.endDate || ''}
                                      onChange={(e) => updateSectionItem(sec.id, item.id, { endDate: e.target.value })}
                                      disabled={item.current}
                                      placeholder="Present"
                                      className={`w-full bg-[#0d1322] border border-[#222f47] focus:border-blue-500 rounded-lg px-3 py-1.5 text-slate-200 outline-none transition-all ${
                                        item.current ? 'opacity-60 cursor-not-allowed' : ''
                                      }`}
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-[11px] text-slate-400 font-medium mb-1">
                                      {t('editor.linkUrl')}
                                    </label>
                                    <input
                                      type="text"
                                      value={item.linkUrl || ''}
                                      onChange={(e) => updateSectionItem(sec.id, item.id, { linkUrl: e.target.value })}
                                      placeholder="github.com/org/repo"
                                      className="w-full bg-[#0d1322] border border-[#222f47] focus:border-blue-500 rounded-lg px-3 py-1.5 text-slate-200 outline-none transition-all"
                                    />
                                  </div>
                                </div>

                                {/* Tech Stack Tags */}
                                <div>
                                  <label className="block text-[11px] text-slate-400 font-medium mb-1 flex items-center gap-1.5">
                                    <Tag className="w-3 h-3 text-blue-400" />
                                    <span>{t('editor.tags')}</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={
                                      tagInputs[item.id] !== undefined
                                        ? tagInputs[item.id]
                                        : (item.tags || []).join(', ')
                                    }
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setTagInputs((prev) => ({ ...prev, [item.id]: val }));
                                      const parsed = val
                                        .split(',')
                                        .map((s) => s.trim())
                                        .filter(Boolean);
                                      updateSectionItem(sec.id, item.id, { tags: parsed });
                                    }}
                                    onBlur={() => {
                                      setTagInputs((prev) => {
                                        const copy = { ...prev };
                                        delete copy[item.id];
                                        return copy;
                                      });
                                    }}
                                    placeholder={t('editor.tagsPlaceholder')}
                                    className="w-full bg-[#0d1322] border border-[#222f47] focus:border-blue-500 rounded-lg px-3 py-1.5 text-slate-200 outline-none text-xs transition-all"
                                  />
                                </div>

                                {/* Bullet Points Editor */}
                                <div className="space-y-2 pt-2 border-t border-[#222f47]/50">
                                  <div className="flex items-center justify-between">
                                    <label className="text-[11px] font-bold text-slate-300">
                                      {t('editor.bulletPoints')} ({(item.bulletItems || []).length})
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() => handleAddBullet(sec.id, item)}
                                      className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                      <span>{t('editor.addBullet')}</span>
                                    </button>
                                  </div>

                                  <div className="space-y-2">
                                    {(item.bulletItems || []).map((bullet, bIdx) => (
                                      <div key={bullet.id || bIdx} className="flex items-start gap-2 bg-[#0d1322] border border-[#222f47] p-2 rounded-lg">
                                        <button
                                          type="button"
                                          onClick={() => handleUpdateBullet(sec.id, item, bullet.id, { enabled: !bullet.enabled })}
                                          className="mt-1 text-slate-400 hover:text-blue-400 cursor-pointer"
                                          title={bullet.enabled ? 'Disable Bullet' : 'Enable Bullet'}
                                        >
                                          {bullet.enabled ? (
                                            <CheckSquare className="w-3.5 h-3.5 text-blue-400" />
                                          ) : (
                                            <Square className="w-3.5 h-3.5" />
                                          )}
                                        </button>

                                        <textarea
                                          rows={2}
                                          value={bullet.text}
                                          onChange={(e) => handleUpdateBullet(sec.id, item, bullet.id, { text: e.target.value })}
                                          placeholder="Describe project highlights or architecture..."
                                          className={`flex-1 bg-transparent text-xs text-slate-200 outline-none resize-y leading-relaxed ${
                                            !bullet.enabled ? 'line-through opacity-50' : ''
                                          }`}
                                        />

                                        <button
                                          type="button"
                                          onClick={() => handleDeleteBullet(sec.id, item, bullet.id)}
                                          className="mt-1 text-slate-500 hover:text-rose-400 cursor-pointer transition-colors"
                                          title="Delete Bullet"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ) : secType === 'languages' ? (
                              /* LANGUAGES SECTION EDITOR */
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                <div>
                                  <label className="block text-[11px] text-slate-400 font-medium mb-1">
                                    Language
                                  </label>
                                  <input
                                    type="text"
                                    value={item.title}
                                    onChange={(e) => updateSectionItem(sec.id, item.id, { title: e.target.value })}
                                    placeholder="e.g. English"
                                    className="w-full bg-[#0d1322] border border-[#222f47] focus:border-blue-500 rounded-lg px-3 py-1.5 text-slate-200 outline-none transition-all"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] text-slate-400 font-medium mb-1">
                                    Proficiency
                                  </label>
                                  <input
                                    type="text"
                                    value={item.subtitle || ''}
                                    onChange={(e) => updateSectionItem(sec.id, item.id, { subtitle: e.target.value })}
                                    placeholder="e.g. Native / CEFR B2"
                                    className="w-full bg-[#0d1322] border border-[#222f47] focus:border-blue-500 rounded-lg px-3 py-1.5 text-slate-200 outline-none transition-all"
                                  />
                                </div>
                              </div>
                            ) : secType === 'education' ? (
                              /* EDUCATION SECTION EDITOR */
                              <div className="space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                  <div>
                                    <label className="block text-[11px] text-slate-400 font-medium mb-1">
                                      Degree / Course Title
                                    </label>
                                    <input
                                      type="text"
                                      value={item.title}
                                      onChange={(e) => updateSectionItem(sec.id, item.id, { title: e.target.value })}
                                      placeholder="e.g. Bachelor's in Computer Science"
                                      className="w-full bg-[#0d1322] border border-[#222f47] focus:border-blue-500 rounded-lg px-3 py-1.5 text-slate-200 outline-none transition-all"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[11px] text-slate-400 font-medium mb-1">
                                      Institution / University
                                    </label>
                                    <input
                                      type="text"
                                      value={item.subtitle || ''}
                                      onChange={(e) => updateSectionItem(sec.id, item.id, { subtitle: e.target.value })}
                                      placeholder="e.g. Universidade Tiradentes"
                                      className="w-full bg-[#0d1322] border border-[#222f47] focus:border-blue-500 rounded-lg px-3 py-1.5 text-slate-200 outline-none transition-all"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                  <div>
                                    <label className="block text-[11px] text-slate-400 font-medium mb-1">
                                      {t('editor.startDate')}
                                    </label>
                                    <input
                                      type="text"
                                      value={item.startDate || ''}
                                      onChange={(e) => updateSectionItem(sec.id, item.id, { startDate: e.target.value })}
                                      placeholder="Jan 2019"
                                      className="w-full bg-[#0d1322] border border-[#222f47] focus:border-blue-500 rounded-lg px-3 py-1.5 text-slate-200 outline-none transition-all"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[11px] text-slate-400 font-medium mb-1">
                                      {t('editor.endDate')}
                                    </label>
                                    <input
                                      type="text"
                                      value={item.endDate || ''}
                                      onChange={(e) => updateSectionItem(sec.id, item.id, { endDate: e.target.value })}
                                      placeholder="Dec 2023"
                                      className="w-full bg-[#0d1322] border border-[#222f47] focus:border-blue-500 rounded-lg px-3 py-1.5 text-slate-200 outline-none transition-all"
                                    />
                                  </div>
                                </div>
                              </div>
                            ) : secType === 'skills' ? (
                              /* TECHNICAL SKILLS SECTION EDITOR */
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-[11px] text-slate-400 font-medium mb-1">
                                    Skill Category Title
                                  </label>
                                  <input
                                    type="text"
                                    value={item.title}
                                    onChange={(e) => updateSectionItem(sec.id, item.id, { title: e.target.value })}
                                    placeholder="e.g. Programming & Databases"
                                    className="w-full bg-[#0d1322] border border-[#222f47] focus:border-blue-500 rounded-lg px-3 py-1.5 text-slate-200 outline-none transition-all text-xs"
                                  />
                                </div>

                                {/* Mode Switcher Buttons */}
                                <div className="space-y-2 pt-2 border-t border-[#222f47]/50">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold text-slate-300">
                                      {t('editor.skillModeLabel')}
                                    </span>

                                    <div className="flex items-center gap-1 bg-[#0d1322] p-1 rounded-lg border border-[#222f47]">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setSkillDisplayMode((prev) => ({ ...prev, [item.id]: 'tags' }))
                                        }
                                        className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer ${
                                          (skillDisplayMode[item.id] || (item.tags && item.tags.length > 0 ? 'tags' : 'bullets')) === 'tags'
                                            ? 'bg-blue-600 text-white shadow'
                                            : 'text-slate-400 hover:text-slate-200'
                                        }`}
                                      >
                                        <AlignLeft className="w-3 h-3" />
                                        <span>{t('editor.skillFormatTags')}</span>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          setSkillDisplayMode((prev) => ({ ...prev, [item.id]: 'bullets' }))
                                        }
                                        className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer ${
                                          (skillDisplayMode[item.id] || (item.tags && item.tags.length > 0 ? 'tags' : 'bullets')) === 'bullets'
                                            ? 'bg-blue-600 text-white shadow'
                                            : 'text-slate-400 hover:text-slate-200'
                                        }`}
                                      >
                                        <ListFilter className="w-3 h-3" />
                                        <span>{t('editor.skillFormatBullets')}</span>
                                      </button>
                                    </div>
                                  </div>

                                  {/* Tags Format View (Comma Separated) */}
                                  {(skillDisplayMode[item.id] || (item.tags && item.tags.length > 0 ? 'tags' : 'bullets')) === 'tags' ? (
                                    <div>
                                      <label className="block text-[11px] text-slate-400 font-medium mb-1 flex items-center gap-1.5">
                                        <Tag className="w-3 h-3 text-blue-400" />
                                        <span>{t('editor.tags')}</span>
                                      </label>
                                      <input
                                        type="text"
                                        value={
                                          tagInputs[item.id] !== undefined
                                            ? tagInputs[item.id]
                                            : (item.tags || []).join(', ')
                                        }
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          setTagInputs((prev) => ({ ...prev, [item.id]: val }));
                                          const parsed = val
                                            .split(',')
                                            .map((s) => s.trim())
                                            .filter(Boolean);
                                          updateSectionItem(sec.id, item.id, { tags: parsed });
                                        }}
                                        onBlur={() => {
                                          setTagInputs((prev) => {
                                            const copy = { ...prev };
                                            delete copy[item.id];
                                            return copy;
                                          });
                                        }}
                                        placeholder={t('editor.tagsPlaceholder')}
                                        className="w-full bg-[#0d1322] border border-[#222f47] focus:border-blue-500 rounded-lg px-3 py-1.5 text-slate-200 outline-none text-xs transition-all"
                                      />
                                    </div>
                                  ) : (
                                    /* Bullets Format View (One Below Another) */
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between">
                                        <label className="text-[11px] font-bold text-slate-300">
                                          {t('editor.bulletPoints')} ({(item.bulletItems || []).length})
                                        </label>
                                        <button
                                          type="button"
                                          onClick={() => handleAddBullet(sec.id, item)}
                                          className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                                        >
                                          <Plus className="w-3.5 h-3.5" />
                                          <span>{t('editor.addBullet')}</span>
                                        </button>
                                      </div>

                                      <div className="space-y-2">
                                        {(item.bulletItems || []).map((bullet, bIdx) => (
                                          <div key={bullet.id || bIdx} className="flex items-start gap-2 bg-[#0d1322] border border-[#222f47] p-2 rounded-lg">
                                            <button
                                              type="button"
                                              onClick={() => handleUpdateBullet(sec.id, item, bullet.id, { enabled: !bullet.enabled })}
                                              className="mt-1 text-slate-400 hover:text-blue-400 cursor-pointer"
                                              title={bullet.enabled ? 'Disable Bullet' : 'Enable Bullet'}
                                            >
                                              {bullet.enabled ? (
                                                <CheckSquare className="w-3.5 h-3.5 text-blue-400" />
                                              ) : (
                                                <Square className="w-3.5 h-3.5" />
                                              )}
                                            </button>

                                            <input
                                              type="text"
                                              value={bullet.text}
                                              onChange={(e) => handleUpdateBullet(sec.id, item, bullet.id, { text: e.target.value })}
                                              placeholder="Skill item..."
                                              className={`flex-1 bg-transparent text-xs text-slate-200 outline-none ${
                                                !bullet.enabled ? 'line-through opacity-50' : ''
                                              }`}
                                            />

                                            <button
                                              type="button"
                                              onClick={() => handleDeleteBullet(sec.id, item, bullet.id)}
                                              className="mt-1 text-slate-500 hover:text-rose-400 cursor-pointer transition-colors"
                                              title="Delete Bullet"
                                            >
                                              <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ) : (
                              /* STANDARD / EXPERIENCE / CUSTOM SECTION EDITOR */
                              <div className="space-y-3">
                                {/* Title & Subtitle */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                  <div>
                                    <label className="block text-[11px] text-slate-400 font-medium mb-1">
                                      {t('editor.itemTitle')}
                                    </label>
                                    <input
                                      type="text"
                                      value={item.title}
                                      onChange={(e) => updateSectionItem(sec.id, item.id, { title: e.target.value })}
                                      placeholder="e.g. Senior Data Engineer"
                                      className="w-full bg-[#0d1322] border border-[#222f47] focus:border-blue-500 rounded-lg px-3 py-1.5 text-slate-200 outline-none transition-all"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-[11px] text-slate-400 font-medium mb-1">
                                      {t('editor.itemSubtitle')}
                                    </label>
                                    <input
                                      type="text"
                                      value={item.subtitle || ''}
                                      onChange={(e) => updateSectionItem(sec.id, item.id, { subtitle: e.target.value })}
                                      placeholder="e.g. Global Automotive"
                                      className="w-full bg-[#0d1322] border border-[#222f47] focus:border-blue-500 rounded-lg px-3 py-1.5 text-slate-200 outline-none transition-all"
                                    />
                                  </div>
                                </div>

                                {/* Dates & Location */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                  <div>
                                    <label className="block text-[11px] text-slate-400 font-medium mb-1">
                                      {t('editor.startDate')}
                                    </label>
                                    <input
                                      type="text"
                                      value={item.startDate || ''}
                                      onChange={(e) => updateSectionItem(sec.id, item.id, { startDate: e.target.value })}
                                      placeholder="May 2025"
                                      className="w-full bg-[#0d1322] border border-[#222f47] focus:border-blue-500 rounded-lg px-3 py-1.5 text-slate-200 outline-none transition-all"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-[11px] text-slate-400 font-medium mb-1">
                                      {t('editor.endDate')}
                                    </label>
                                    <input
                                      type="text"
                                      value={item.current ? t('editor.present') : item.endDate || ''}
                                      onChange={(e) => updateSectionItem(sec.id, item.id, { endDate: e.target.value })}
                                      disabled={item.current}
                                      placeholder="Present"
                                      className={`w-full bg-[#0d1322] border border-[#222f47] focus:border-blue-500 rounded-lg px-3 py-1.5 text-slate-200 outline-none transition-all ${
                                        item.current ? 'opacity-60 cursor-not-allowed' : ''
                                      }`}
                                    />
                                  </div>

                                  <div className="flex items-end pb-1.5">
                                    <label className="flex items-center gap-2 text-slate-300 text-xs cursor-pointer select-none">
                                      <input
                                        type="checkbox"
                                        checked={item.current || false}
                                        onChange={(e) =>
                                          updateSectionItem(sec.id, item.id, {
                                            current: e.target.checked,
                                            endDate: e.target.checked ? 'Present' : item.endDate,
                                          })
                                        }
                                        className="rounded border-[#222f47] text-blue-600 focus:ring-0 cursor-pointer"
                                      />
                                      <span>{t('editor.currentRole')}</span>
                                    </label>
                                  </div>
                                </div>

                                {/* Tags Input */}
                                <div>
                                  <label className="block text-[11px] text-slate-400 font-medium mb-1 flex items-center gap-1.5">
                                    <Tag className="w-3 h-3 text-blue-400" />
                                    <span>{t('editor.tags')}</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={
                                      tagInputs[item.id] !== undefined
                                        ? tagInputs[item.id]
                                        : (item.tags || []).join(', ')
                                    }
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setTagInputs((prev) => ({ ...prev, [item.id]: val }));
                                      const parsed = val
                                        .split(',')
                                        .map((s) => s.trim())
                                        .filter(Boolean);
                                      updateSectionItem(sec.id, item.id, { tags: parsed });
                                    }}
                                    onBlur={() => {
                                      setTagInputs((prev) => {
                                        const copy = { ...prev };
                                        delete copy[item.id];
                                        return copy;
                                      });
                                    }}
                                    placeholder={t('editor.tagsPlaceholder')}
                                    className="w-full bg-[#0d1322] border border-[#222f47] focus:border-blue-500 rounded-lg px-3 py-1.5 text-slate-200 outline-none text-xs transition-all"
                                  />
                                </div>

                                {/* Bullet Points Editor */}
                                <div className="space-y-2 pt-2 border-t border-[#222f47]/50">
                                  <div className="flex items-center justify-between">
                                    <label className="text-[11px] font-bold text-slate-300">
                                      {t('editor.bulletPoints')} ({(item.bulletItems || []).length})
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() => handleAddBullet(sec.id, item)}
                                      className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                      <span>{t('editor.addBullet')}</span>
                                    </button>
                                  </div>

                                  <div className="space-y-2">
                                    {(item.bulletItems || []).map((bullet, bIdx) => (
                                      <div key={bullet.id || bIdx} className="flex items-start gap-2 bg-[#0d1322] border border-[#222f47] p-2 rounded-lg">
                                        <button
                                          type="button"
                                          onClick={() => handleUpdateBullet(sec.id, item, bullet.id, { enabled: !bullet.enabled })}
                                          className="mt-1 text-slate-400 hover:text-blue-400 cursor-pointer"
                                          title={bullet.enabled ? 'Disable Bullet' : 'Enable Bullet'}
                                        >
                                          {bullet.enabled ? (
                                            <CheckSquare className="w-3.5 h-3.5 text-blue-400" />
                                          ) : (
                                            <Square className="w-3.5 h-3.5" />
                                          )}
                                        </button>

                                        <textarea
                                          rows={2}
                                          value={bullet.text}
                                          onChange={(e) => handleUpdateBullet(sec.id, item, bullet.id, { text: e.target.value })}
                                          placeholder="Describe your achievement, metric, or responsibility..."
                                          className={`flex-1 bg-transparent text-xs text-slate-200 outline-none resize-y leading-relaxed ${
                                            !bullet.enabled ? 'line-through opacity-50' : ''
                                          }`}
                                        />

                                        <button
                                          type="button"
                                          onClick={() => handleDeleteBullet(sec.id, item, bullet.id)}
                                          className="mt-1 text-slate-500 hover:text-rose-400 cursor-pointer transition-colors"
                                          title="Delete Bullet"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <button
                    onClick={() => handleAddItem(sec.id, secType)}
                    className="w-full py-2.5 border border-dashed border-[#222f47] hover:border-blue-500 text-slate-400 hover:text-blue-400 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
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
