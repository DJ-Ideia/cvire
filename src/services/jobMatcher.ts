import { CVProfile } from '../types/cv';
import { JobMatchResult, KeywordMatch } from '../types/ats';

const BILINGUAL_STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
  'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were', 'will',
  'with', 'this', 'but', 'they', 'have', 'had', 'what', 'when', 'where', 'who',
  'de', 'em', 'para', 'com', 'um', 'uma', 'os', 'as', 'por', 'como', 'do', 'da',
  'dos', 'das', 'nos', 'nas', 'no', 'na', 'que', 'se', 'ou', 'mais', 'menos',
  'requisitos', 'experiencia', 'conhecimento', 'atuar', 'vaga', 'trabalhar',
  'empresa', 'responsabilidades', 'diferencial', 'desejavel', 'obrigatorio',
  'area', 'equipe', 'time', 'projetos', 'solucoes', 'ferramentas', 'processos',
  'work', 'experience', 'ability', 'required', 'preferred', 'skills', 'job',
  'role', 'team', 'company', 'looking', 'seeking', 'responsibilities', 'qualifications'
]);

// Known Tech Stack & Skill Phrase Dictionary (Supports Multi-word N-Grams)
const KNOWN_TECH_PHRASES = [
  'data engineering', 'data engineer', 'data analyst', 'data science', 'data scientist',
  'machine learning', 'apache spark', 'spark', 'bigquery', 'looker studio', 'power bi',
  'streamlit', 'pandas', 'postgresql', 'postgres', 'sql', 'python', 'gcp', 'aws',
  'databricks', 'docker', 'kubernetes', 'web scraping', 'etl', 'elt', 'data modeling',
  'software engineering', 'software engineer', 'react', 'typescript', 'javascript',
  'node.js', 'nodejs', 'next.js', 'nextjs', 'dax', 'm code', 'kanban', 'trello',
  'git', 'github', 'ci/cd', 'agile', 'scrum', 'business intelligence'
];

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function calculateJobMatch(cv: CVProfile, jobDescription: string): JobMatchResult {
  if (!jobDescription || !jobDescription.trim()) {
    return {
      matchPercentage: 0,
      matchedKeywordsCount: 0,
      missingKeywordsCount: 0,
      keywords: [],
    };
  }

  const normJob = normalizeText(jobDescription);
  const normCV = normalizeText(JSON.stringify(cv));

  const keywordCounts = new Map<string, number>();

  // 1. Check known multi-word tech phrases in job description
  KNOWN_TECH_PHRASES.forEach((phrase) => {
    const regex = new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matches = normJob.match(regex);
    if (matches && matches.length > 0) {
      keywordCounts.set(phrase, matches.length);
    }
  });

  // 2. Extract individual single words > 2 chars excluding stopwords
  const singleWords = normJob
    .replace(/[^a-z0-9#+-\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !BILINGUAL_STOP_WORDS.has(w));

  const wordFreq: Record<string, number> = {};
  singleWords.forEach((w) => {
    wordFreq[w] = (wordFreq[w] || 0) + 1;
  });

  // Add top single words to keyword list if not already captured by multi-word phrase
  Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .forEach(([word, count]) => {
      const isAlreadyCaptured = Array.from(keywordCounts.keys()).some((p) => p.includes(word));
      if (!isAlreadyCaptured) {
        keywordCounts.set(word, count);
      }
    });

  // Convert to sorted target list
  const targetKeywords = Array.from(keywordCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);

  const keywordsList: KeywordMatch[] = [];
  let matchedCount = 0;
  let missingCount = 0;

  targetKeywords.forEach(([kw, countInJob]) => {
    const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matches = normCV.match(regex);
    const countInCV = matches ? matches.length : 0;

    let status: KeywordMatch['status'] = 'missing';
    if (countInCV > 0) {
      status = countInCV > 10 ? 'overused' : 'matched';
      matchedCount++;
    } else {
      missingCount++;
    }

    // Capitalize for display
    const displayKeyword = kw
      .split(' ')
      .map((w) => (w.length <= 3 && !['sql', 'gcp', 'aws', 'etl', 'elt', 'bi', 'dax', 'ml'].includes(w) ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1)))
      .join(' ');

    keywordsList.push({
      keyword: displayKeyword,
      countInJob,
      countInCV,
      status,
    });
  });

  const total = targetKeywords.length;
  const matchPercentage = total > 0 ? Math.round((matchedCount / total) * 100) : 0;

  return {
    matchPercentage,
    matchedKeywordsCount: matchedCount,
    missingKeywordsCount: missingCount,
    keywords: keywordsList,
  };
}
