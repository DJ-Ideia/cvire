/**
 * CV Builder Pro (`cvire`) ATS Engine & Diagnostic Types
 */

export interface ATSScoreBreakdown {
  structureScore: number;    // Weight: 20%
  keywordsScore: number;     // Weight: 25%
  metricsScore: number;      // Weight: 20%
  actionVerbsScore: number;  // Weight: 15%
  lengthScore: number;       // Weight: 10%
  contactScore: number;      // Weight: 10%
  totalScore: number;        // Overall 0-100 score
}

export type DiagnosticSeverity = 'error' | 'warning' | 'info';

export interface LinterDiagnostic {
  id: string;
  ruleId: string;
  severity: DiagnosticSeverity;
  title: string;
  message: string;
  sectionId?: string;
  itemId?: string;
  suggestion?: string;
}

export interface KeywordMatch {
  keyword: string;
  countInJob: number;
  countInCV: number;
  status: 'matched' | 'missing' | 'overused';
}

export interface JobMatchResult {
  matchPercentage: number;
  matchedKeywordsCount: number;
  missingKeywordsCount: number;
  keywords: KeywordMatch[];
  aiRecommendations?: string[];
}
