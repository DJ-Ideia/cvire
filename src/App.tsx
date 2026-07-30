import React, { useEffect, useState } from 'react';
import { useCVStore } from './store/useCVStore';
import { useUIStore } from './store/useUIStore';
import { DashboardHeader } from './components/dashboard/DashboardHeader';
import { ProfileGrid } from './components/dashboard/ProfileGrid';
import { EditorShell } from './components/editor/EditorShell';
import { A4PaperCanvas } from './components/preview/A4PaperCanvas';
import { ViewportToolbar } from './components/preview/ViewportToolbar';
import { ATSScoreGauge } from './components/ats/ATSScoreGauge';
import { ATSPlainPreviewModal } from './components/ats/ATSPlainPreviewModal';
import { JobMatcherDrawer } from './components/ai/JobMatcherDrawer';
import { APIKeyModal } from './components/ai/APIKeyModal';
import { DemoTemplateModal } from './components/dashboard/DemoTemplateModal';
import { TemplatePickerModal } from './components/templates/TemplatePickerModal';
import { ThemeCustomizerDrawer } from './components/editor/ThemeCustomizerDrawer';
import { exportResumeToPDF } from './services/exportService';
import { ArrowLeft, LayoutTemplate, Palette } from 'lucide-react';

export const App: React.FC = () => {
  const { initStore, activeProfile, selectProfile, isLoading } = useCVStore();
  const { viewMode, openModal } = useUIStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'editor'>('dashboard');

  useEffect(() => {
    initStore();
  }, [initStore]);

  const handleSelectProfile = (id: string) => {
    selectProfile(id);
    setCurrentView('editor');
  };

  const handleExportPDF = () => {
    const filename = activeProfile
      ? `${activeProfile.title.toLowerCase().replace(/\s+/g, '-')}.pdf`
      : 'resume.pdf';
    exportResumeToPDF(filename);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center text-slate-400 font-mono text-sm">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span>Initializing cvire local database...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans antialiased selection:bg-blue-500 selection:text-white">
      {currentView === 'dashboard' ? (
        /* Dashboard View */
        <div className="min-h-screen flex flex-col">
          <DashboardHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onOpenDemoModal={() => setIsDemoModalOpen(true)}
          />
          <main className="flex-1">
            <ProfileGrid searchQuery={searchQuery} onSelectProfile={handleSelectProfile} />
          </main>
        </div>
      ) : (
        /* Editor & Preview Split View */
        <div className="min-h-screen flex flex-col">
          {/* Top Bar Navigation */}
          <div className="bg-[#131b2e] border-b border-[#222f47] px-6 py-3 flex items-center justify-between">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="px-3 py-1.5 rounded-xl bg-[#0d1322] border border-[#222f47] hover:border-slate-500 text-slate-300 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>

            <div className="text-center">
              <h2 className="text-sm font-bold text-slate-100">{activeProfile?.title}</h2>
              <p className="text-[11px] text-slate-400">Auto-saved to IndexedDB</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => openModal('template-picker')}
                className="px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold hover:bg-blue-500/20 transition-all flex items-center gap-1.5"
              >
                <LayoutTemplate className="w-3.5 h-3.5" />
                <span>Templates</span>
              </button>

              <button
                onClick={() => openModal('theme-customizer')}
                className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold hover:bg-purple-500/20 transition-all flex items-center gap-1.5"
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Theme</span>
              </button>

              <button
                onClick={() => openModal('job-matcher')}
                className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-all"
              >
                Match Job
              </button>

              <button
                onClick={() => openModal('api-key-byok')}
                className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-all"
              >
                BYOK Key
              </button>
            </div>
          </div>

          {/* Viewport Toolbar */}
          <ViewportToolbar onExportPDF={handleExportPDF} />

          {/* Split Body */}
          <div className="flex-1 flex overflow-hidden">
            {(viewMode === 'edit' || viewMode === 'split') && (
              <div className={viewMode === 'split' ? 'w-1/2 border-r border-[#222f47] overflow-y-auto' : 'w-full overflow-y-auto flex justify-center'}>
                <EditorShell />
              </div>
            )}

            {(viewMode === 'preview' || viewMode === 'split') && (
              <div className={viewMode === 'split' ? 'w-1/2 overflow-y-auto' : 'w-full overflow-y-auto'}>
                <A4PaperCanvas />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Global Modals */}
      <TemplatePickerModal />
      <ThemeCustomizerDrawer />
      <ATSScoreGauge />
      <ATSPlainPreviewModal />
      <JobMatcherDrawer />
      <APIKeyModal />
      <DemoTemplateModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onSelect={handleSelectProfile}
      />
    </div>
  );
};
