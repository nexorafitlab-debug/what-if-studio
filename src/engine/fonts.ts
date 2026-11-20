import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';
import { STUDIO } from '../studio.config';

// Use local fonts only — Google Fonts are blocked by the VM proxy.
// The title face loads from public/fonts/ via studio.config.ts.
// UI and handwriting faces use local fallback sans-serif and serif fonts.

if (STUDIO.titleFont) {
  loadFont({ family: STUDIO.titleFont.family, url: staticFile(STUDIO.titleFont.file), weight: STUDIO.titleFont.weight });
}

export const FONT = {
  title: STUDIO.titleFont ? STUDIO.titleFont.family : 'sans-serif',
  ui: 'monospace',
  hand: 'serif',
};
