import React, { useState } from 'react';
import { Star, Archive, Layers, Plus } from 'lucide-react';
import { useCVStore } from '../../store/useCVStore';
import { ProfileCard } from './ProfileCard';
import { useTranslation } from 'react-i18next';

interface ProfileGridProps {
  searchQuery: string;
  onSelectProfile: (id: string) => void;
}

export const ProfileGrid: React.FC<ProfileGridProps> = ({ searchQuery, onSelectProfile }) => {
  const { t } = useTranslation();
  const { profiles, createProfile } = useCVStore();
  const [tab, setTab] = useState<'all' | 'favorites' | 'archived'>('all');

  const filteredProfiles = profiles.filter((p) => {
    // Search query filter
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      p.title.toLowerCase().includes(q) ||
      p.personal.fullName.toLowerCase().includes(q) ||
      p.personal.jobTitle.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    // Tab filter
    if (tab === 'favorites') return p.isFavorite && !p.isArchived;
    if (tab === 'archived') return p.isArchived;
    return !p.isArchived;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#222f47]">
        <div className="flex items-center gap-2 bg-[#0d1322] p-1 rounded-xl border border-[#222f47]">
          <button
            onClick={() => setTab('all')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              tab === 'all'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{t('dashboard.myResumes')} ({profiles.filter((p) => !p.isArchived).length})</span>
          </button>

          <button
            onClick={() => setTab('favorites')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              tab === 'favorites'
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>{t('dashboard.favorite')} ({profiles.filter((p) => p.isFavorite && !p.isArchived).length})</span>
          </button>

          <button
            onClick={() => setTab('archived')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              tab === 'archived'
                ? 'bg-slate-700 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Archive className="w-3.5 h-3.5" />
            <span>{t('dashboard.archived')} ({profiles.filter((p) => p.isArchived).length})</span>
          </button>
        </div>
      </div>

      {/* Profile Cards Grid */}
      {filteredProfiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((p) => (
            <ProfileCard key={p.id} profile={p} onSelect={onSelectProfile} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 bg-[#131b2e]/50 border border-dashed border-[#222f47] rounded-3xl p-8 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-4">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-200 mb-1">No Resumes Found</h3>
          <p className="text-xs text-slate-400 mb-6">
            Get started by creating a new custom resume or loading sample demo data.
          </p>
          <button
            onClick={() => createProfile()}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold inline-flex items-center gap-2 transition-all shadow-lg shadow-blue-600/30 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Resume</span>
          </button>
        </div>
      )}
    </div>
  );
};
