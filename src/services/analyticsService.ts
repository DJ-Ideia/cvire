import { CVProfile } from '../types/cv';

export interface ResumeAnalytics {
  wordCount: number;
  characterCount: number;
  readingTimeSeconds: number;
  actionVerbRatio: number;
  metricDensityRatio: number;
  totalBullets: number;
  metricBullets: number;
}

const ACTION_VERBS = new Set([
  'architected', 'built', 'created', 'designed', 'developed', 'engineered',
  'implemented', 'launched', 'led', 'managed', 'migrated', 'optimized',
  'orchestrated', 'pioneered', 'reduced', 'scaled', 'spearheaded', 'transformed'
]);

export function calculateResumeAnalytics(profile: CVProfile): ResumeAnalytics {
  const jsonString = JSON.stringify([
    profile.personal.fullName,
    profile.personal.jobTitle,
    profile.summary,
    ...Object.values(profile.sections).flatMap((sec) =>
      sec.items.flatMap((item) => [item.title, item.subtitle, ...item.bulletItems.map((b) => b.text)])
    ),
  ]);

  const cleanWords = jsonString.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
  const wordCount = cleanWords.length;
  const characterCount = jsonString.length;

  // Average reading speed = 200 words per minute (3.33 words per second)
  const readingTimeSeconds = Math.max(Math.round((wordCount / 200) * 60), 15);

  let totalBullets = 0;
  let metricBullets = 0;
  let actionVerbBullets = 0;

  Object.values(profile.sections).forEach((sec) => {
    sec.items.forEach((item) => {
      item.bulletItems.forEach((b) => {
        if (!b.enabled) return;
        totalBullets++;

        // Metric check
        if (/\d+%|\$\d+|\d+\+|\d+ (users|teams|projects|clients|fps|ms)/i.test(b.text)) {
          metricBullets++;
        }

        // Action verb check
        const firstWord = b.text.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '');
        if (firstWord && ACTION_VERBS.has(firstWord)) {
          actionVerbBullets++;
        }
      });
    });
  });

  const actionVerbRatio = totalBullets > 0 ? Math.round((actionVerbBullets / totalBullets) * 100) : 0;
  const metricDensityRatio = totalBullets > 0 ? Math.round((metricBullets / totalBullets) * 100) : 0;

  return {
    wordCount,
    characterCount,
    readingTimeSeconds,
    actionVerbRatio,
    metricDensityRatio,
    totalBullets,
    metricBullets,
  };
}
