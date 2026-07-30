import React from 'react';
import type { TemplateProps } from '../../../types/template';

export const CreativeAccentTemplate: React.FC<TemplateProps> = ({ profile, previewRef }) => {
  const { personal, summary, sections, theme } = profile;
  const primaryColor = theme.primaryColor || '#7c3aed';

  const visibleSections = profile.sectionsOrder
    .map((id) => sections[id])
    .filter((sec) => sec && sec.visible);

  return (
    <div
      ref={previewRef}
      className="a4-paper flex flex-col justify-between text-slate-800 text-sm leading-relaxed overflow-hidden"
      style={{
        fontFamily: theme.fontFamily || 'Outfit',
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
      }}
    >
      {/* Bold Top Banner */}
      <header className="p-8 text-white flex justify-between items-center" style={{ backgroundColor: primaryColor }}>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">{personal.fullName || 'Your Name'}</h1>
          <p className="text-sm font-medium opacity-90 mt-1">{personal.jobTitle || 'Professional Title'}</p>
        </div>

        <div className="text-right text-xs opacity-90 space-y-1 font-medium">
          {personal.email && <div>{personal.email}</div>}
          {personal.phone && <div>{personal.phone}</div>}
          {personal.location && <div>{personal.location}</div>}
        </div>
      </header>

      {/* Body Content */}
      <div className="p-8 flex-1 space-y-6">
        {summary && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs italic text-slate-700">
            {summary}
          </div>
        )}

        <div className="space-y-6">
          {visibleSections.map((sec) => (
            <div key={sec.id} className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-6 rounded-r" style={{ backgroundColor: primaryColor }} />
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">{sec.title}</h2>
              </div>

              <div className="space-y-4 pl-4">
                {sec.items.map((item) => (
                  <div key={item.id} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-slate-900 text-xs">{item.title}</h3>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {item.startDate} {item.startDate && item.endDate ? '-' : ''} {item.endDate}
                      </span>
                    </div>

                    {item.subtitle && <p className="text-xs font-medium text-purple-700">{item.subtitle}</p>}

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
    </div>
  );
};
