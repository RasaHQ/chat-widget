import { WidgetTheme } from './widget-theme';

export type WidgetPreset = 'precise' | 'balanced' | 'bold';
export type BrandPresence = 'subtle' | 'balanced' | 'expressive';
export type BubbleStyle = 'tail' | 'soft' | 'minimal';
export type ButtonStyle = 'auto' | 'outline' | 'soft' | 'solid';
export type Elevation = 'flat' | 'soft' | 'lifted';
export type HeadingFont = 'sans' | 'rounded' | 'serif';
export type HeadingWeight = 'regular' | 'semibold' | 'heavy';
export type TextSize = 'small' | 'medium' | 'large';
export type HeaderLayout = 'compact' | 'hero';
export type Density = 'comfortable' | 'compact';

export type Appearance = {
  brandPresence: BrandPresence;
  bubbleStyle: BubbleStyle;
  buttonStyle: ButtonStyle;
  elevation: Elevation;
  headingFont: HeadingFont;
  headingWeight: HeadingWeight;
  textSize: TextSize;
  headerLayout: HeaderLayout;
  density: Density;
  cornerRadius?: number;
};

export type AppearanceInput = Partial<Appearance> & {
  preset?: WidgetPreset;
  theme?: WidgetTheme;
  accentColor?: string;
  fontFamily?: string;
};

export const SYSTEM_FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "Segoe UI Variable Text", "Segoe UI", system-ui, Roboto, "Helvetica Neue", Arial, sans-serif';

export const PRESETS: Record<WidgetPreset, Appearance> = {
  // Quiet and exact: monochrome surfaces, small radii, compact text.
  precise: {
    brandPresence: 'subtle',
    cornerRadius: 6,
    bubbleStyle: 'minimal',
    buttonStyle: 'outline',
    elevation: 'flat',
    headingFont: 'sans',
    headingWeight: 'semibold',
    textSize: 'small',
    headerLayout: 'compact',
    density: 'compact',
  },
  // Neutral surfaces with the brand color on the visitor's messages, chips and launcher.
  balanced: {
    brandPresence: 'balanced',
    cornerRadius: 12,
    bubbleStyle: 'soft',
    buttonStyle: 'outline',
    elevation: 'soft',
    headingFont: 'sans',
    headingWeight: 'semibold',
    textSize: 'medium',
    headerLayout: 'compact',
    density: 'comfortable',
  },
  // Loud and friendly: brand-color header with a greeting, heavy rounded type, solid buttons.
  bold: {
    brandPresence: 'expressive',
    cornerRadius: 24,
    bubbleStyle: 'soft',
    buttonStyle: 'solid',
    elevation: 'lifted',
    headingFont: 'rounded',
    headingWeight: 'heavy',
    textSize: 'large',
    headerLayout: 'hero',
    density: 'comfortable',
  },
};

const DESIGNER_THEMES: WidgetTheme[] = ['midnight', 'ocean', 'forest', 'sunset', 'mono'];

const APPEARANCE_KEYS: (keyof Appearance)[] = [
  'brandPresence',
  'bubbleStyle',
  'buttonStyle',
  'elevation',
  'headingFont',
  'headingWeight',
  'textSize',
  'headerLayout',
  'density',
  'cornerRadius',
];

/**
 * Combines the defaults, the chosen preset and any individually set props.
 * Individual props win over the preset, and the preset wins over the defaults.
 */
export const resolveAppearance = (input: AppearanceInput): Appearance => {
  const defaults: Appearance = {
    // Designer themes ship their own header colors, which only the expressive layout keeps.
    brandPresence: DESIGNER_THEMES.includes(input.theme) ? 'expressive' : 'balanced',
    bubbleStyle: 'tail',
    buttonStyle: 'auto',
    elevation: 'soft',
    headingFont: 'sans',
    headingWeight: 'semibold',
    textSize: 'medium',
    headerLayout: 'compact',
    density: 'comfortable',
  };
  const resolved: Appearance = { ...defaults, ...(PRESETS[input.preset] || {}) };
  APPEARANCE_KEYS.forEach(key => {
    const value = input[key];
    if (value !== undefined && value !== null && (value as unknown) !== '') {
      (resolved as Record<string, unknown>)[key] = value;
    }
  });
  if (typeof resolved.cornerRadius === 'string') {
    const radius = parseFloat(resolved.cornerRadius);
    resolved.cornerRadius = isNaN(radius) ? undefined : radius;
  }
  return resolved;
};

const parseHex = (color: string): number[] | null => {
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color.trim());
  if (!match) return null;
  const hex = match[1].length === 3 ? match[1].replace(/./g, c => c + c) : match[1];
  return [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16));
};

const toHex = (rgb: number[]) => '#' + rgb.map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');

const mix = (a: number[], b: number[], amount: number) => a.map((v, i) => v + (b[i] - v) * amount);

const luminance = (rgb: number[]) => {
  const [r, g, b] = rgb.map(c => c / 255).map(c => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const contrastRatio = (a: number[], b: number[]) => {
  const [x, y] = [luminance(a), luminance(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

const WHITE = [255, 255, 255];
const BLACK = [0, 0, 0];

/** Steps `base` toward `toward` until it reaches `target` contrast against `against`. */
const shadeFor = (base: number[], against: number[], target: number, toward: number[]) => {
  let color = base;
  for (let step = 1; step <= 10 && contrastRatio(color, against) < target; step++) {
    color = mix(base, toward, step * 0.09);
  }
  return color;
};

/**
 * Colors derived from the brand accent: the text color to use on top of it
 * (white, or a deep shade of the accent when white is unreadable), and the
 * accent shaded to be readable as text on light and dark surfaces.
 */
export const accentTokens = (accentColor: string): Record<string, string> => {
  if (!accentColor) return {};
  const rgb = parseHex(accentColor);
  if (!rgb) return { '--color-primary': accentColor };
  const onAccent = contrastRatio(rgb, WHITE) >= 4.5 ? WHITE : shadeFor(rgb, rgb, 6, BLACK);
  return {
    '--color-primary': toHex(rgb),
    '--color-on-primary': toHex(onAccent),
    '--color-accent-text-light': toHex(shadeFor(rgb, WHITE, 4.5, BLACK)),
    '--color-accent-text-dark': toHex(shadeFor(rgb, [19, 19, 22], 4.5, WHITE)),
  };
};

/** Shape tokens derived from a single corner radius, in px. */
export const radiusTokens = (radius?: number): Record<string, string> => {
  if (radius === undefined || radius === null || isNaN(radius)) return {};
  const r = Math.max(0, radius);
  const px = (value: number) => `${Math.round(value)}px`;
  const bubble = Math.max(4, r * 0.9 + 4);
  return {
    '--radius-messenger': px(r),
    '--radius-bubble': px(bubble),
    '--radius-bubble-tail': px(Math.min(4, bubble)),
    '--radius-control': r >= 16 ? '999px' : px(Math.max(4, r * 0.75)),
    '--radius-field': r >= 16 ? '999px' : px(Math.max(4, r * 0.9 + 2)),
    '--radius-launcher': r >= 12 ? '999px' : px(Math.max(6, r + 6)),
    '--radius-avatar': r === 0 ? '0px' : r >= 20 ? '999px' : px(Math.max(6, r * 0.6 + 4)),
  };
};

/** Host attributes the stylesheet keys its appearance variants off. */
export const appearanceAttributes = (appearance: Appearance): Record<string, string> => ({
  'data-presence': appearance.brandPresence,
  'data-bubbles': appearance.bubbleStyle,
  'data-buttons': appearance.buttonStyle,
  'data-elevation': appearance.elevation,
  'data-heading-font': appearance.headingFont,
  'data-heading-weight': appearance.headingWeight,
  'data-text-size': appearance.textSize,
  'data-header': appearance.headerLayout,
  'data-density': appearance.density,
});

/** Inline custom properties for the host element. */
export const appearanceStyle = (appearance: Appearance, input: AppearanceInput): Record<string, string> => ({
  '--widget-font-family': input.fontFamily || SYSTEM_FONT_STACK,
  ...radiusTokens(appearance.cornerRadius),
  ...accentTokens(input.accentColor),
});
