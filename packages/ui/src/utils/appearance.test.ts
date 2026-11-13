import { accentTokens, appearanceAttributes, contrastRatio, radiusTokens, resolveAppearance, PRESETS } from './appearance';

const rgb = (hex: string) => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));

describe('resolveAppearance', () => {
  it('uses the balanced presence and tailed bubbles when nothing is set', () => {
    const appearance = resolveAppearance({});
    expect(appearance.brandPresence).toBe('balanced');
    expect(appearance.bubbleStyle).toBe('tail');
    expect(appearance.cornerRadius).toBeUndefined();
  });

  it('keeps designer theme headers by defaulting them to the expressive presence', () => {
    expect(resolveAppearance({ theme: 'ocean' }).brandPresence).toBe('expressive');
    expect(resolveAppearance({ theme: 'dark' }).brandPresence).toBe('balanced');
  });

  it('applies a preset', () => {
    expect(resolveAppearance({ preset: 'bold' })).toEqual(PRESETS.bold);
  });

  it('lets individual props override the preset', () => {
    const appearance = resolveAppearance({ preset: 'bold', headerLayout: 'compact', cornerRadius: 4 });
    expect(appearance.headerLayout).toBe('compact');
    expect(appearance.cornerRadius).toBe(4);
    expect(appearance.buttonStyle).toBe('solid');
  });

  it('parses a corner radius set as an attribute string', () => {
    expect(resolveAppearance({ cornerRadius: '10' as unknown as number }).cornerRadius).toBe(10);
  });
});

describe('accentTokens', () => {
  it('puts white text on a dark accent', () => {
    expect(accentTokens('#2f5bd3')['--color-on-primary']).toBe('#ffffff');
  });

  it('puts a readable deep shade on a light accent instead of white', () => {
    const tokens = accentTokens('#9be15d');
    expect(tokens['--color-on-primary']).not.toBe('#ffffff');
    expect(contrastRatio(rgb(tokens['--color-on-primary']), rgb('#9be15d'))).toBeGreaterThanOrEqual(4.5);
  });

  it('shades the accent so it reads as text on white', () => {
    const tokens = accentTokens('#ff5a1f');
    expect(contrastRatio(rgb(tokens['--color-accent-text-light']), [255, 255, 255])).toBeGreaterThanOrEqual(4.5);
  });

  it('passes non-hex colors through unchanged', () => {
    expect(accentTokens('rebeccapurple')).toEqual({ '--color-primary': 'rebeccapurple' });
  });

  it('returns nothing without an accent', () => {
    expect(accentTokens('')).toEqual({});
  });
});

describe('radiusTokens', () => {
  it('derives pill controls from a large radius', () => {
    const tokens = radiusTokens(24);
    expect(tokens['--radius-messenger']).toBe('24px');
    expect(tokens['--radius-control']).toBe('999px');
    expect(tokens['--radius-launcher']).toBe('999px');
  });

  it('keeps square corners at zero', () => {
    const tokens = radiusTokens(0);
    expect(tokens['--radius-messenger']).toBe('0px');
    expect(tokens['--radius-avatar']).toBe('0px');
  });

  it('returns nothing when unset', () => {
    expect(radiusTokens(undefined)).toEqual({});
  });
});

describe('appearanceAttributes', () => {
  it('maps the appearance to data attributes', () => {
    expect(appearanceAttributes(PRESETS.precise)).toMatchObject({ 'data-presence': 'subtle', 'data-header': 'compact', 'data-text-size': 'small' });
  });
});
