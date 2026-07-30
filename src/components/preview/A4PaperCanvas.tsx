import React, { useEffect, useRef, useState } from 'react';
import { useCVStore } from '../../store/useCVStore';
import { useUIStore } from '../../store/useUIStore';
import { getTemplateRenderer } from '../templates/registry';

export const A4PaperCanvas: React.FC = () => {
  const { activeProfile } = useCVStore();
  const { zoomLevel } = useUIStore();
  const paperRef = useRef<HTMLDivElement>(null);
  const [pageBreaks, setPageBreaks] = useState<number[]>([]);
  const [effectiveScale, setEffectiveScale] = useState<number>(zoomLevel);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 820) {
        // Automatically fit A4 paper width to mobile screen
        const mobileScale = Math.min(zoomLevel, (screenWidth - 32) / 794);
        setEffectiveScale(mobileScale);
      } else {
        setEffectiveScale(zoomLevel);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [zoomLevel]);

  useEffect(() => {
    if (!paperRef.current) return;

    const observer = new ResizeObserver(() => {
      if (!paperRef.current) return;
      const totalHeight = paperRef.current.scrollHeight;
      const a4PageHeight = 1123; // Standard A4 height at 96 DPI

      const breaks: number[] = [];
      let currentHeight = a4PageHeight;

      while (currentHeight < totalHeight) {
        breaks.push(currentHeight);
        currentHeight += a4PageHeight;
      }

      setPageBreaks(breaks);
    });

    observer.observe(paperRef.current);
    return () => observer.disconnect();
  }, [activeProfile]);

  if (!activeProfile) return null;

  const TemplateComponent = getTemplateRenderer(activeProfile.templateId);

  return (
    <div className="flex-1 overflow-auto bg-[#090d16] p-4 sm:p-8 flex justify-center items-start min-h-screen">
      <div
        className="transition-transform origin-top duration-200"
        style={{ transform: `scale(${effectiveScale})` }}
      >
        <div className="relative">
          {/* Render Active Template */}
          <TemplateComponent profile={activeProfile} previewRef={paperRef} />

          {/* Dynamic Visual Page Cut Lines */}
          {pageBreaks.map((breakY, index) => (
            <div key={index} className="page-break-line" style={{ top: `${breakY}px` }}>
              <span className="page-break-label">A4 Page {index + 2} Split</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
