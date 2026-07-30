import { ThemeSettings } from '../types/cv';

export function calculateAutoFitTheme(
  currentTheme: ThemeSettings,
  overflowPixels: number
): ThemeSettings {
  if (overflowPixels <= 0) return currentTheme;

  // Reduce line height, font scale, section spacing iteratively
  const newScale = currentTheme.fontSizeScale === 'lg' ? 'md' : 'sm';
  const newLineHeight = Math.max(currentTheme.lineHeight - 0.1, 1.2);

  return {
    ...currentTheme,
    fontSizeScale: newScale,
    lineHeight: Number(newLineHeight.toFixed(2)),
    sectionSpacing: 'compact',
    pageMargins: 'compact',
  };
}
