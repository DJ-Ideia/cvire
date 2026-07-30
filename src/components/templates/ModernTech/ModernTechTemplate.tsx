import React from 'react';
import { TemplateProps } from '../../../types/template';

export const ModernTechTemplate: React.FC<TemplateProps> = ({ profile, previewRef }) => {
  const { personal, summary, sections, theme } = profile;

  const primaryColor = theme.primaryColor || '#2563eb';
  const mainSections = profile.sectionsOrder
    .map((id) => sections[id])
    .filter((sec) => sec && sec.visible && sec.column !== 'sidebar');

  const sidebarSections = profile.sectionsOrder
    .map((id) => sections[id])
    .filter((sec) => sec && sec.visible && sec.column === 'sidebar');

  return (
    <div
      ref={previewRef}
      className="a4-paper p-8 flex flex-col justify-between text-slate-800 text-sm leading-relaxed"
      style={{
        fontFamily: theme.fontFamily,
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
      }}
    >
      {/* Header Banner */}
      <header className="border-b-2 pb-5 mb-6 flex justify-between items-end" style={{ borderColor: primaryColor }}>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: primaryColor }}>
            {personal.fullName || 'Your Name'}
          </h1>
          <p className="text-base font-semibold text-slate-600 mt-1">{personal.jobTitle || 'Professional Title'}</p>
        </div>

        <div className="text-right text-xs text-slate-600 space-y-1">
          {personal.email && <div>{personal.email}</div>}
          {personal.phone && <div>{personal.phone}</div>}
          {personal.location && <div>{personal.location}</div>}
          {personal.linkedinUrl && <div className="text-blue-600 truncate">{personal.linkedinUrl}</div>}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <div className="mb-6">
          <p className="text-xs text-slate-700 leading-relaxed italic">{summary}</p>
        </div>
      )}

      {/* 2-Column Body Grid */}
      <div className="grid grid-cols-3 gap-6 flex-1">
        {/* Main Column (2/3 width) */}
        <div className="col-span-2 space-y-6">
          {mainSections.map((sec) => (
            <div key={sec.id} className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider border-b pb-1" style={{ color: primaryColor, borderColor: `${primaryColor}40` }}>
                {sec.title}
              </h2>

              <div className="space-y-4">
                {sec.items.map((item) => (
                  <div key={item.id} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-slate-900">{item.title}</h3>
                      <span className="text-xs font-medium text-slate-500">
                        {item.startDate} {item.startDate && item.endDate ? '-' : ''} {item.endDate}
                      </span>
                    </div>

                    {item.subtitle && <p className="text-xs font-semibold text-slate-600">{item.subtitle}</p>}

                    {/* Bullet Points */}
                    {item.bulletItems && item.bulletItems.length > 0 && (
                      <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 mt-1">
                        {item.bulletItems
                          .filter((b) => b.enabled)
                          .map((b) => (
                            <li key={b.id} className={b.isMetricHighlighted ? 'font-medium text-slate-900' : ''}>
                              {b.text}
                            </li>
                          ))}
                      </ul>
                    )}

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded font-medium"
                            style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Column (1/3 width) */}
        <div className="col-span-1 space-y-6 border-l pl-5 border-slate-200">
          {sidebarSections.map((sec) => (
            <div key={sec.id} className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-1" style={{ color: primaryColor, borderColor: `${primaryColor}40` }}>
                {sec.title}
              </h2>

              <div className="space-y-3">
                {sec.items.map((item) => (
                  <div key={item.id}>
                    <h3 className="font-semibold text-xs text-slate-900">{item.title}</h3>
                    {item.subtitle && <p className="text-[11px] text-slate-500">{item.subtitle}</p>}
                    {item.bulletItems && item.bulletItems.length > 0 && (
                      <ul className="mt-1 space-y-1 text-[11px] text-slate-600">
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
