import { parseFormattedString, TextSegment } from './text-parser';

describe('parseFormattedString', () => {
  it('parse empty string', () => {
    const input = '';
    const expected: TextSegment[] = [{ text: '' }];
    expect(parseFormattedString(input)).toEqual(expected);
  });

  it('parse plain text segment', () => {
    const input = 'Hello, world!';
    const expected: TextSegment[] = [{ text: 'Hello, world!' }];
    expect(parseFormattedString(input)).toEqual(expected);
  });

  it('parse text segment - with bold', () => {
    const input = 'This is **bold**';
    const expected: TextSegment[] = [{ text: 'This is ' }, { text: 'bold', bold: true }];
    expect(parseFormattedString(input)).toEqual(expected);
  });

  it('parse text segment - with italic', () => {
    const input = 'This is *italic*';
    const expected: TextSegment[] = [{ text: 'This is ' }, { text: 'italic', italic: true }];
    expect(parseFormattedString(input)).toEqual(expected);
  });

  it('parse text segment - with link', () => {
    const input = 'Link [Google](https://google.com).';
    const expected: TextSegment[] = [{ text: 'Link ' }, { text: 'Google', linkSrc: 'https://google.com', linkTitle: '', bold: false, italic: false }, { text: '.' }];
    expect(parseFormattedString(input)).toEqual(expected);
  });

  it('parse mixed formatting segments', () => {
    const input = 'This is **bold**, *italic*';
    const expected: TextSegment[] = [{ text: 'This is ' }, { text: 'bold', bold: true }, { text: ', ' }, { text: 'italic', italic: true }];
    expect(parseFormattedString(input)).toEqual(expected);
  });

  it('parse complex mixed formatting segments (bold italic ***text***)', () => {
    const input = '***bold italic***';
    const expected: TextSegment[] = [{ text: 'bold italic', bold: true, italic: true }];
    expect(parseFormattedString(input)).toEqual(expected);
  });

  it('parse complex mixed formatting segments (bold italic _**text**_)', () => {
    const input = '_**bold italic**_';
    const expected: TextSegment[] = [{ text: 'bold italic', bold: true, italic: true }];
    expect(parseFormattedString(input)).toEqual(expected);
  });

  it('parse complex mixed formatting segments (bold italic __*text*__)', () => {
    const input = '__*bold italic*__';
    const expected: TextSegment[] = [{ text: 'bold italic', bold: true, italic: true }];
    expect(parseFormattedString(input)).toEqual(expected);
  });

  it('parse complex mixed formatting segments (bold italic ___text___)', () => {
    const input = '___bold italic___';
    const expected: TextSegment[] = [{ text: 'bold italic', bold: true, italic: true }];
    expect(parseFormattedString(input)).toEqual(expected);
  });

  it('parse complex mixed formatting segments (bold italic *__text__*)', () => {
    const input = '*__bold italic__*';
    const expected: TextSegment[] = [{ text: 'bold italic', bold: true, italic: true }];
    expect(parseFormattedString(input)).toEqual(expected);
  });

  it('parse complex mixed formatting segments (bold italic **_text_**)', () => {
    const input = '**_bold italic_**';
    const expected: TextSegment[] = [{ text: 'bold italic', bold: true, italic: true }];
    expect(parseFormattedString(input)).toEqual(expected);
  });

  it('parse complex mixed formatting segments', () => {
    const input = 'This is ***bold italic*** link [Google](https://google.com)';
    const expected: TextSegment[] = [
      { text: 'This is ' },
      { text: 'bold italic', bold: true, italic: true },
      { text: ' link ' },
      { text: 'Google', linkSrc: 'https://google.com', linkTitle: '', bold: false, italic: false },
    ];
    expect(parseFormattedString(input)).toEqual(expected);
  });

  it('parse link with formatting (bold)', () => {
    const input = 'Link [**Google**](https://google.com)';
    const expected: TextSegment[] = [{ text: 'Link ' }, { text: 'Google', linkSrc: 'https://google.com', linkTitle: '', bold: true, italic: false }];
    expect(parseFormattedString(input)).toEqual(expected);
  });

  it('parse link with formatting (bold and italic)', () => {
    const input = 'This link is [**_Google(bold italic)_**](https://google.com)';
    const expected: TextSegment[] = [{ text: 'This link is ' }, { text: 'Google(bold italic)', linkSrc: 'https://google.com', linkTitle: '', bold: true, italic: true }];
    expect(parseFormattedString(input)).toEqual(expected);
  });

  test('handles non string argument', () => {
    const input = null;
    // @ts-ignore-next-line
    expect(() => parseFormattedString(input)).toThrow(`parseFormattedString: text input is not string`);
  });
});
