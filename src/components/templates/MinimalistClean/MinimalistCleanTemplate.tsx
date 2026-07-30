import React from 'react';
import { TemplateProps } from '../../../types/template';

export const MinimalistCleanTemplate: React.FC<TemplateProps> = ({ profile, previewRef }) => {
  const { personal, summary, sections, theme } = profile;
  const primaryColor = theme.primaryColor || '#0f172a';

  const visibleSections = profile.sectionsOrder
    .map((id) => sections[id])
    .filter((sec) => sec && sec.visible);

  return (
    <div
      ref={previewRef}
      className="a4-paper p-10 flex flex-col justify-between text-slate-800 text-sm leading-relaxed"
      style={{
        fontFamily: theme.fontFamily || 'Inter',
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
      }}
    >
      {/* Clean Minimal Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-light tracking-tight text-slate-900">
          {personal.fullName || 'Your Name'}
        </h1>
        <p className="text-sm font-medium text-slate-500 mt-1">{personal.jobTitle || 'Professional Title'}</p>

        <div className="flex flex-wrap gap-4 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.linkedinUrl && <span className="text-slate-700 underline">{personal.linkedinUrl}</span>}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <div className="mb-8">
          <p className="text-xs text-slate-600 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Sections */}
      <div className="space-y-8 flex-1">
        {visibleSections.map((sec) => (
          <div key={sec.id} className="grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{sec.title}</h2>
            </div>

            <div className="col-span-3 space-y-4">
              {sec.items.map((item) => (
                <div key={item.id} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-slate-900 text-xs">{item.title}</h3>
                    <span className="text-[11px] text-slate-400 font-normal">
                      {item.startDate} {item.startDate && item.endDate ? '-' : ''} {item.endDate}
                    </span>
                  </div>

                  {item.subtitle && <p className="text-xs text-slate-500">{item.subtitle}</p>}

                  {/* Bullet Points */}
                  {item.bulletItems && item.bulletItems.length > 0 && (
                    <ul className="space-y-1 text-xs text-slate-600 mt-1">
                      {item.bulletItems
                        .filter((b) => b.enabled)
                        .map((b) => (
                          <li key={b.id}>• {b.text}</li>
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
