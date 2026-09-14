const fs = require('fs');

const files = [
  'C:/Users/Suji/.gemini/antigravity/scratch/drishthinet-prototype/src/components/common/MockFeedPreview.tsx',
  'C:/Users/Suji/.gemini/antigravity/scratch/drishthinet-prototype/src/components/layout/PresentationBar.tsx',
  'C:/Users/Suji/.gemini/antigravity/scratch/drishthinet-prototype/src/components/map/GujaratMap.tsx',
  'C:/Users/Suji/.gemini/antigravity/scratch/drishthinet-prototype/src/components/map/TrackingReplayMap.tsx',
  'C:/Users/Suji/.gemini/antigravity/scratch/drishthinet-prototype/src/components/modals/EvidenceModal.tsx'
];

const replacements = {
  'bg-\\[#0F172A\\]': 'bg-surface',
  'bg-\\[#0B1120\\]': 'bg-bg',
  'bg-\\[#080D1A\\]': 'bg-bg',
  'bg-\\[#0A0F1D\\]': 'bg-bg',
  'border-slate-800': 'border-border',
  'border-slate-700': 'border-border',
  'text-slate-400': 'text-text-muted',
  'text-slate-300': 'text-text-muted',
  'text-slate-200': 'text-text',
  'text-slate-100': 'text-text',
  'text-white': 'text-text',
  'hover:border-slate-700': 'hover:border-border',
  'hover:bg-slate-850': 'hover:bg-surface',
  'hover:text-white': 'hover:text-text',
  'bg-slate-900': 'bg-surface',
  'bg-slate-950': 'bg-bg',
};

const inlineReplacements = {
  '#0F1B2D': 'var(--color-bg)',
  '#080D1A': 'var(--color-bg)',
  '#0A0F1D': 'var(--color-bg)',
  '#17253D': 'var(--color-surface)',
  '#0F172A': 'var(--color-surface)',
  '#0B1120': 'var(--color-surface)',
  '#2A3B57': 'var(--color-border)',
  '#1E293B': 'var(--color-border)',
  '#334155': 'var(--color-border)',
  '#C9A227': 'var(--color-accent)',
  '#C4554D': 'var(--color-alert)',
  '#E7EAF0': 'var(--color-text)',
  '#FFFFFF': 'var(--color-text)',
  '#F8FAFC': 'var(--color-text)',
  '#8B96AA': 'var(--color-text-muted)',
  '#94A3B8': 'var(--color-text-muted)',
  '#CBD5E1': 'var(--color-text-muted)',
};

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  for (const [key, value] of Object.entries(replacements)) {
    const regex = new RegExp(key, 'g');
    content = content.replace(regex, value);
  }
  for (const [key, value] of Object.entries(inlineReplacements)) {
    const regex = new RegExp(key, 'gi');
    content = content.replace(regex, value);
  }
  fs.writeFileSync(file, content);
  console.log(`Processed ${file}`);
}
