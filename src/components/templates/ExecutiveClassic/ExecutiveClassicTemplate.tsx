import React from 'react';
import { TemplateProps } from '../../../types/template';

export const ExecutiveClassicTemplate: React.FC<TemplateProps> = ({ profile, previewRef }) => {
  const { personal, summary, sections, theme } = profile;
  const primaryColor = theme.primaryColor || '#1e3a8a';

  const visibleSections = profile.sectionsOrder
    .map((id) => sections[id])
    .filter((sec) => sec && sec.visible);

  return (
    <div
      ref={previewRef}
      className="a4-paper p-10 flex flex-col justify-between text-slate-800 text-sm leading-relaxed"
      style={{
        fontFamily: theme.fontFamily || 'Merriweather',
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
      }}
    >
      {/* Centered Executive Header */}
      <header className="text-center border-b pb-6 mb-6 border-slate-300">
        <h1 className="text-3xl font-bold uppercase tracking-wide" style={{ color: primaryColor }}>
          {personal.fullName || 'Your Name'}
        </h1>
        <p className="text-sm font-medium text-slate-600 mt-1 italic">{personal.jobTitle || 'Professional Title'}</p>

        <div className="flex flex-wrap justify-center items-center gap-3 text-xs text-slate-600 mt-3">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>• {personal.phone}</span>}
          {personal.location && <span>• {personal.location}</span>}
          {personal.linkedinUrl && <span>• {personal.linkedinUrl}</span>}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <div className="mb-6 border-b pb-4 border-slate-200">
          <p className="text-xs text-slate-700 leading-relaxed text-center italic">{summary}</p>
        </div>
      )}

      {/* 1-Column Sequential Sections */}
      <div className="space-y-6 flex-1">
        {visibleSections.map((sec) => (
          <div key={sec.id} className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest border-b pb-1 text-center" style={{ color: primaryColor, borderColor: primaryColor }}>
              {sec.title}
            </h2>

            <div className="space-y-4">
              {sec.items.map((item) => (
                <div key={item.id} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                    <span className="text-xs text-slate-500 font-medium">
                      {item.startDate} {item.startDate && item.endDate ? '-' : ''} {item.endDate}
                    </span>
                  </div>

                  {item.subtitle && <p className="text-xs font-semibold italic text-slate-600">{item.subtitle}</p>}

                  {/* Bullet Points */}
                  {item.bulletItems && item.bulletItems.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 mt-1">
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
