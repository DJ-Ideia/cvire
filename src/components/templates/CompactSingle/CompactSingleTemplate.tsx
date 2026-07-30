import React from 'react';
import type { TemplateProps } from '../../../types/template';

export const CompactSingleTemplate: React.FC<TemplateProps> = ({ profile, previewRef }) => {
  const { personal, summary, sections, theme } = profile;
  const primaryColor = theme.primaryColor || '#0f172a';

  const visibleSections = profile.sectionsOrder
    .map((id) => sections[id])
    .filter((sec) => sec && sec.visible);

  return (
    <div
      ref={previewRef}
      className="a4-paper p-6 flex flex-col justify-between text-slate-800 text-[11px] leading-tight"
      style={{
        fontFamily: theme.fontFamily || 'Inter',
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
      }}
    >
      {/* Ultra Compact Header */}
      <header className="border-b pb-3 mb-4 flex justify-between items-center border-slate-300">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight" style={{ color: primaryColor }}>
            {personal.fullName || 'Your Name'}
          </h1>
          <p className="text-xs font-semibold text-slate-600">{personal.jobTitle || 'Professional Title'}</p>
        </div>

        <div className="text-right text-[10px] text-slate-600 space-y-0.5 font-medium">
          <div>{personal.email} • {personal.phone}</div>
          <div>{personal.location} • {personal.linkedinUrl}</div>
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <div className="mb-4">
          <p className="text-[10.5px] text-slate-700 leading-snug">{summary}</p>
        </div>
      )}

      {/* Sections */}
      <div className="space-y-4 flex-1">
        {visibleSections.map((sec) => (
          <div key={sec.id} className="space-y-2">
            <h2 className="text-[11px] font-bold uppercase tracking-wider border-b pb-0.5" style={{ color: primaryColor, borderColor: primaryColor }}>
              {sec.title}
            </h2>

            <div className="space-y-2">
              {sec.items.map((item) => (
                <div key={item.id} className="space-y-0.5">
                  <div className="flex justify-between items-baseline font-bold text-slate-900 text-[11px]">
                    <span>{item.title} <span className="font-medium text-slate-600">({item.subtitle})</span></span>
                    <span className="text-[10px] font-normal text-slate-500">{item.startDate} - {item.endDate}</span>
                  </div>

                  {item.bulletItems && item.bulletItems.length > 0 && (
                    <ul className="list-disc list-inside space-y-0.5 text-[10.5px] text-slate-700">
                      {item.bulletItems
                        .filter((b) => b.enabled)
                        .map((b) => (
                          <li key={b.id}>{b.text}</li>
                        ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
