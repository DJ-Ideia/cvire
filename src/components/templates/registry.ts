import React from 'react';
import type { TemplateManifest, TemplateProps } from '../../types/template';
import { ModernTechTemplate } from './ModernTech/ModernTechTemplate';
import { ExecutiveClassicTemplate } from './ExecutiveClassic/ExecutiveClassicTemplate';
import { MinimalistCleanTemplate } from './MinimalistClean/MinimalistCleanTemplate';
import { CreativeAccentTemplate } from './CreativeAccent/CreativeAccentTemplate';
import { CompactSingleTemplate } from './CompactSingle/CompactSingleTemplate';

export const templateRegistry: Record<string, TemplateManifest> = {
  'modern-tech': {
    id: 'modern-tech',
    name: 'Modern Tech',
    description: '2-column responsive layout optimized for software engineers and tech roles.',
    version: '1.0.0',
    author: 'cvire Core Team',
    thumbnailUrl: '/templates/modern-tech.png',
    layoutType: 'two-column-left',
    supportedSections: ['experience', 'education', 'skills', 'projects', 'languages', 'certifications', 'custom'],
    defaultTheme: { primaryColor: '#2563eb', fontFamily: 'Inter' },
    Component: ModernTechTemplate,
  },
  'executive-classic': {
    id: 'executive-classic',
    name: 'Executive Classic',
    description: '1-column traditional layout with elegant typography for management & leadership.',
    version: '1.0.0',
    author: 'cvire Core Team',
    thumbnailUrl: '/templates/executive-classic.png',
    layoutType: 'single-column',
    supportedSections: ['experience', 'education', 'skills', 'projects', 'languages', 'certifications', 'custom'],
    defaultTheme: { primaryColor: '#1e3a8a', fontFamily: 'Merriweather' },
    Component: ExecutiveClassicTemplate,
  },
  'minimalist-clean': {
    id: 'minimalist-clean',
    name: 'Minimalist Clean',
    description: 'Ultra-clean layout prioritizing whitespace and readability.',
    version: '1.0.0',
    author: 'cvire Core Team',
    thumbnailUrl: '/templates/minimalist-clean.png',
    layoutType: 'single-column',
    supportedSections: ['experience', 'education', 'skills', 'projects', 'languages', 'certifications', 'custom'],
    defaultTheme: { primaryColor: '#0f172a', fontFamily: 'Inter' },
    Component: MinimalistCleanTemplate,
  },
  'creative-accent': {
    id: 'creative-accent',
    name: 'Creative Accent',
    description: 'Vibrant top header banner layout designed for designers and creative roles.',
    version: '1.0.0',
    author: 'cvire Core Team',
    thumbnailUrl: '/templates/creative-accent.png',
    layoutType: 'header-banner',
    supportedSections: ['experience', 'education', 'skills', 'projects', 'languages', 'certifications', 'custom'],
    defaultTheme: { primaryColor: '#7c3aed', fontFamily: 'Outfit' },
    Component: CreativeAccentTemplate,
  },
  'compact-single': {
    id: 'compact-single',
    name: 'Compact Single-Page',
    description: 'High-density compact layout engineered to compress extensive content into 1 page.',
    version: '1.0.0',
    author: 'cvire Core Team',
    thumbnailUrl: '/templates/compact-single.png',
    layoutType: 'single-column',
    supportedSections: ['experience', 'education', 'skills', 'projects', 'languages', 'certifications', 'custom'],
    defaultTheme: { primaryColor: '#0f172a', fontFamily: 'Inter' },
    Component: CompactSingleTemplate,
  },
};

export function getTemplateRenderer(templateId: string): React.ComponentType<TemplateProps> {
  const found = templateRegistry[templateId];
  return found ? found.Component : ModernTechTemplate;
}
