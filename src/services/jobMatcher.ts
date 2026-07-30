import { CVProfile } from '../types/cv';
import { JobMatchResult, KeywordMatch } from '../types/ats';

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
  'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were', 'will',
  'with', 'the', 'this', 'but', 'they', 'have', 'had', 'what', 'when', 'where', 'who',
  'de', 'em', 'para', 'com', 'um', 'uma', 'os', 'as', 'por', 'como', 'do', 'da'
]);

export function calculateJobMatch(cv: CVProfile, jobDescription: string): JobMatchResult {
  if (!jobDescription.trim()) {
    return {
      matchPercentage: 0,
      matchedKeywordsCount: 0,
      missingKeywordsCount: 0,
      keywords: [],
    };
  }

  // Extract N-grams / words from Job Description
  const rawWords = jobDescription
    .toLowerCase()
    .replace(/[^a-z0-9#+-\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

  // Count word frequencies in job
  const jobFreq: Record<string, number> = {};
  rawWords.forEach((w) => {
    jobFreq[w] = (jobFreq[w] || 0) + 1;
  });

  // Extract words from CV
  const cvText = JSON.stringify(cv).toLowerCase();
  const keywordsList: KeywordMatch[] = [];

  let matchedCount = 0;
  let missingCount = 0;

  // Filter top target keywords from Job
  const targetKeywords = Object.entries(jobFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25);

  targetKeywords.forEach(([kw, countInJob]) => {
    const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matches = cvText.match(regex);
    const countInCV = matches ? matches.length : 0;

    let status: KeywordMatch['status'] = 'missing';
    if (countInCV > 0) {
      status = countInCV > 6 ? 'overused' : 'matched';
      matchedCount++;
    } else {
      missingCount++;
    }

    keywordsList.push({
      keyword: kw,
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
