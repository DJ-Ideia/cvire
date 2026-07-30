import React from 'react';
import { X, Palette, Type, Sliders, Check } from 'lucide-react';
import { useCVStore } from '../../store/useCVStore';
import { useUIStore } from '../../store/useUIStore';

const COLOR_PRESETS = [
  { name: 'Royal Blue', hex: '#2563eb' },
  { name: 'Emerald', hex: '#059669' },
  { name: 'Violet', hex: '#7c3aed' },
  { name: 'Rose', hex: '#e11d48' },
  { name: 'Slate', hex: '#334155' },
  { name: 'Amber', hex: '#d97706' },
  { name: 'Teal', hex: '#0d9488' },
  { name: 'Indigo', hex: '#4f46e5' },
];

const FONT_PRESETS: Array<'Inter' | 'Roboto' | 'Merriweather' | 'Fira Code' | 'Outfit' | 'Poppins'> = [
  'Inter',
  'Roboto',
  'Merriweather',
  'Fira Code',
  'Outfit',
  'Poppins',
];

export const ThemeCustomizerDrawer: React.FC = () => {
  const { activeProfile, updateTheme } = useCVStore();
  const { activeModal, closeModal } = useUIStore();

  if (activeModal !== 'theme-customizer' || !activeProfile) return null;

  const theme = activeProfile.theme;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#131b2e] border border-[#222f47] rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#222f47] pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Theme Customizer</h2>
              <p className="text-xs text-slate-400">Customize colors, typography, and layout spacing</p>
            </div>
          </div>

          <button
            onClick={closeModal}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-[#0d1322] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 text-xs">
          {/* Primary Color Palette */}
          <div>
            <label className="block font-bold text-slate-200 mb-3 flex items-center gap-2">
              <Palette className="w-4 h-4 text-blue-400" />
              <span>Primary Accent Color</span>
            </label>

            <div className="grid grid-cols-4 gap-3 mb-3">
              {COLOR_PRESETS.map((color) => {
                const isSelected = theme.primaryColor === color.hex;
                return (
                  <button
                    key={color.hex}
                    onClick={() => updateTheme({ primaryColor: color.hex })}
                    className={`h-10 rounded-xl border flex items-center justify-center transition-all ${
                      isSelected ? 'ring-2 ring-white scale-105 border-transparent' : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {isSelected && <Check className="w-4 h-4 text-white drop-shadow" />}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 bg-[#0d1322] p-2.5 rounded-xl border border-[#222f47]">
              <span className="text-slate-400">Custom Hex:</span>
              <input
                type="color"
                value={theme.primaryColor}
                onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
              />
              <span className="font-mono text-slate-200 uppercase font-bold">{theme.primaryColor}</span>
            </div>
          </div>

          {/* Typography */}
          <div>
            <label className="block font-bold text-slate-200 mb-3 flex items-center gap-2">
              <Type className="w-4 h-4 text-indigo-400" />
              <span>Font Family</span>
            </label>

            <div className="grid grid-cols-2 gap-2">
              {FONT_PRESETS.map((font) => (
                <button
                  key={font}
                  onClick={() => updateTheme({ fontFamily: font })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    theme.fontFamily === font
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-bold'
                      : 'bg-[#0d1322] border-[#222f47] text-slate-400 hover:text-slate-200'
                  }`}
                  style={{ fontFamily: font }}
                >
                  {font}
                </button>
              ))}
            </div>
          </div>

          {/* Layout Spacing & Scale */}
          <div>
            <label className="block font-bold text-slate-200 mb-3 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Font Scale & Density</span>
            </label>

            <div className="space-y-4 bg-[#0d1322] p-4 rounded-2xl border border-[#222f47]">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Line Height</span>
                  <span className="font-mono">{theme.lineHeight || 1.45}</span>
                </div>
                <input
                  type="range"
                  min={1.15}
                  max={1.75}
                  step={0.05}
                  value={theme.lineHeight || 1.45}
                  onChange={(e) => updateTheme({ lineHeight: parseFloat(e.target.value) })}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Font Scale</span>
                  <span className="uppercase font-bold">{theme.fontSizeScale}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['sm', 'md', 'lg'] as const).map((scale) => (
                    <button
                      key={scale}
                      onClick={() => updateTheme({ fontSizeScale: scale })}
                      className={`py-1.5 rounded-lg border text-center font-bold ${
                        theme.fontSizeScale === scale
                          ? 'bg-blue-600 text-white border-blue-500'
                          : 'bg-[#131b2e] border-[#222f47] text-slate-400'
                      }`}
                    >
                      {scale.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
