/**
 * CV Builder Pro (`cvire`) Core Domain Schemas & Types
 */

export type SectionType = 
  | 'personal'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'languages'
  | 'certifications'
  | 'custom';

export type TemplateId = 
  | 'modern-tech'
  | 'executive-classic'
  | 'minimalist-clean'
  | 'creative-accent'
  | 'compact-single'
  | string;

export type DisplayMode = 'tags' | 'bullets' | 'compact' | 'detailed';

export interface SectionLayoutConfig {
  displayMode?: DisplayMode;
  chipStyle?: 'dots' | 'pills' | 'bordered';
  showDates?: boolean;
  showSubtitle?: boolean;
}

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  photoUrl?: string;
  photoFormat: 'circle' | 'rounded' | 'square' | 'hidden';
}

export interface BulletItem {
  id: string;
  text: string;
  enabled: boolean;
  isMetricHighlighted?: boolean;
}

export interface SectionItem {
  id: string;
  title: string;           // Job title, Degree name, or Skill category
  subtitle?: string;        // Company name, Institution, or Level
  location?: string;        // Location (e.g. "San Francisco, CA")
  startDate?: string;       // Start date (e.g. "Jan 2022")
  endDate?: string;         // End date (e.g. "Present")
  current?: boolean;
  bulletItems: BulletItem[]; // Array of bullets for granular DnD & AI re-writing
  tags?: string[];          // E.g. ["React", "TypeScript", "GraphQL"]
  linkUrl?: string;
}

export interface CVSection {
  id: string;
  type: SectionType;
  title: string;            // Section header title (e.g. "Work Experience")
  column: 'main' | 'sidebar';
  visible: boolean;
  displayMode?: DisplayMode; // Section-level rendering mode
  layout?: SectionLayoutConfig; // Extensible presentation config
  items: SectionItem[];
}

export const getEffectiveDisplayMode = (sec: CVSection): DisplayMode => {
  if (sec.displayMode) return sec.displayMode;
  if (sec.layout?.displayMode) return sec.layout.displayMode;

  // Fallback defaults for legacy JSON compatibility
  if (sec.type === 'skills') {
    const hasTags = sec.items.some((item) => item.tags && item.tags.length > 0);
    return hasTags ? 'tags' : 'bullets';
  }
  if (sec.type === 'languages' || sec.type === 'education' || sec.type === 'certifications') {
    return 'compact';
  }
  return 'bullets';
};

export interface ThemeSettings {
  primaryColor: string;     // Hex code (e.g. "#3b82f6")
  accentColor: string;      // Secondary accent (e.g. "#1e40af")
  textColor: string;        // Body text color
  backgroundColor: string;  // Paper background
  fontFamily: 'Inter' | 'Roboto' | 'Merriweather' | 'Fira Code' | 'Outfit' | 'Poppins';
  fontSizeScale: 'sm' | 'md' | 'lg';
  lineHeight: number;       // Range 1.15 to 1.75
  columnGap: number;        // Range 12px to 48px
  sectionSpacing: 'compact' | 'normal' | 'spacious';
  pageMargins: 'compact' | 'normal' | 'spacious';
  borderRadius: number;     // Range 0px to 16px
  headerStyle: 'classic' | 'centered' | 'banner' | 'minimal-sidebar' | 'split-card';
  dividerStyle: 'solid' | 'dashed' | 'double' | 'subtle' | 'none';
  bulletStyle: 'disc' | 'square' | 'arrow' | 'check' | 'none';
  textAlignment: 'left' | 'justify';
}

export interface CVVersion {
  versionId: string;
  timestamp: number;
  commitNote?: string;
  dataSnapshot: Omit<CVProfile, 'versionHistory'>;
}

export interface CVProfile {
  id: string;               // UUID
  title: string;            // E.g. "CV Frontend Engineer - US Remote"
  language: 'pt-BR' | 'en-US';
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: number;
  updatedAt: number;
  templateId: TemplateId;
  personal: PersonalInfo;
  summary: string;
  sectionsOrder: string[]; // Section IDs order
  sections: Record<string, CVSection>;
  theme: ThemeSettings;
  versionHistory?: CVVersion[];
}
