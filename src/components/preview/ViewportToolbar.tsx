import React from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Eye, Sliders, Download, Flame, ShieldAlert, FileCode } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { useTranslation } from 'react-i18next';

interface ViewportToolbarProps {
  onExportPDF: () => void;
}

export const ViewportToolbar: React.FC<ViewportToolbarProps> = ({ onExportPDF }) => {
  const { t } = useTranslation();
  const {
    viewMode,
    setViewMode,
    zoomLevel,
    setZoomLevel,
    isHeatmapActive,
    toggleHeatmap,
    openModal,
  } = useUIStore();

  return (
    <div className="bg-[#131b2e] border-b border-[#222f47] px-4 py-2.5 flex items-center justify-between gap-4 text-xs">
      {/* View Mode Switches */}
      <div className="flex items-center gap-1 bg-[#0d1322] p-1 rounded-xl border border-[#222f47]">
        <button
          onClick={() => setViewMode('edit')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            viewMode === 'edit' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t('preview.editMode')}
        </button>

        <button
          onClick={() => setViewMode('split')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            viewMode === 'split' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t('preview.splitMode')}
        </button>

        <button
          onClick={() => setViewMode('preview')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            viewMode === 'preview' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t('preview.previewMode')}
        </button>
      </div>

      {/* Zoom Controls */}
      <div className="flex items-center gap-2 bg-[#0d1322] px-3 py-1.5 rounded-xl border border-[#222f47] text-slate-300">
        <button
          onClick={() => setZoomLevel(zoomLevel - 0.1)}
          className="p-1 hover:text-blue-400 transition-colors"
          title={t('preview.zoomOut')}
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <span className="font-mono text-[11px] font-bold min-w-[3rem] text-center">
          {Math.round(zoomLevel * 100)}%
        </span>

        <button
          onClick={() => setZoomLevel(zoomLevel + 0.1)}
          className="p-1 hover:text-blue-400 transition-colors"
          title={t('preview.zoomIn')}
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setZoomLevel(1.0)}
          className="p-1 hover:text-amber-400 border-l border-[#222f47] ml-1 pl-2 transition-colors"
          title={t('preview.resetZoom')}
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Tools & Export */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => openModal('ats-linter')}
          className="px-3 py-1.5 rounded-xl bg-[#0d1322] border border-[#222f47] hover:border-amber-500 text-amber-400 font-semibold flex items-center gap-1.5 transition-all"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>ATS Score</span>
        </button>

        <button
          onClick={() => openModal('ats-preview')}
          className="px-3 py-1.5 rounded-xl bg-[#0d1322] border border-[#222f47] hover:border-indigo-500 text-indigo-400 font-semibold flex items-center gap-1.5 transition-all"
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>ATS View</span>
        </button>

        <button
          onClick={toggleHeatmap}
          className={`px-3 py-1.5 rounded-xl border font-semibold flex items-center gap-1.5 transition-all ${
            isHeatmapActive
              ? 'bg-rose-500/20 border-rose-500 text-rose-400'
              : 'bg-[#0d1322] border-[#222f47] text-slate-300 hover:border-rose-500'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Heatmap</span>
        </button>

        <button
          onClick={onExportPDF}
          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-blue-600/20 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{t('preview.exportPdf')}</span>
        </button>
      </div>
    </div>
  );
};
