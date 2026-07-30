import React from 'react';
import type { CVProfile, SectionType, TemplateId, ThemeSettings } from './cv';

export interface TemplateProps {
  profile: CVProfile;
  previewRef?: React.RefObject<HTMLDivElement | null>;
}

export interface TemplateManifest {
  id: TemplateId;
  name: string;
  description: string;
  version: string;
  author: string;
  thumbnailUrl: string;
  layoutType: 'single-column' | 'two-column-left' | 'two-column-right' | 'header-banner';
  supportedSections: SectionType[];
  defaultTheme: Partial<ThemeSettings>;
  Component: React.ComponentType<TemplateProps>;
}
