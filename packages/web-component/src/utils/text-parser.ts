// Supporting Bold Italic and Link commonmark markdown
// For more information check https://commonmark.org/help/
export interface TextSegment {
  text: string;
  linkSrc?: string;
  linkTitle?: string;
  bold?: boolean;
  italic?: boolean;
  newline?: boolean;
}

const BOLD_ITALIC_REGEX = /(\*\*\*([^*]+)\*\*\*)|(___([^_]+)___)|(\*\*\_([^*_]+)_\*\*)|(_\*\*([^_*]+)\*\*\_)|(__\*([^_*]+)\*\__)|(\*\__([^*_]+)__\*)/;
const BOLD_REGEX = /(\*\*([^*]+)\*\*)|(__([^_]+)__)/;
const ITALIC_REGEX = /(\*([^*]+)\*)|(_([^_]+)_)/;
const LINK_REGEX = /\[([^\]]+)\]\(([^ )]+)(?:\s+"([^"]+)")?\)/;
const NEWLINE_REGEX = /\n/;
const NORMAL_TEXT_REGEX = /[^*_<>[\]\n]+/;

const splitIntoSegments = (input: string): string[] => {
  const regex = new RegExp(
    `(${LINK_REGEX.source})|(${BOLD_ITALIC_REGEX.source})|(${BOLD_REGEX.source})|(${ITALIC_REGEX.source})|(${NEWLINE_REGEX.source}|(${NORMAL_TEXT_REGEX.source}))`,
    'g',
  );
  return input.match(regex) || [];
};

const applyFormatting = (text: string): TextSegment => {
  let segment: TextSegment = { text };

  // Bold Italic formatting
  if (BOLD_ITALIC_REGEX.test(text)) {
    text = text.replace(BOLD_ITALIC_REGEX, '$2$4$6$8$10$12');
    segment.text = text;
    segment.bold = true;
    segment.italic = true;
  }

  // Bold formatting
  else if (BOLD_REGEX.test(text)) {
    text = text.replace(BOLD_REGEX, '$2$4');
    segment.text = text;
    segment.bold = true;
  }

  // Italic formatting
  else if (ITALIC_REGEX.test(text)) {
    text = text.replace(ITALIC_REGEX, '$2$4');
    segment.text = text;
    segment.italic = true;
  }

  return segment;
};

const determineFormatting = (segment: string): TextSegment => {
  let formatting: TextSegment = { text: segment };

  // Newline
  if (NEWLINE_REGEX.test(segment)) {
    return { text: '', newline: true };
  }

  // Link formatting
  if (LINK_REGEX.test(segment)) {
    const match = LINK_REGEX.exec(segment);
    formatting.text = match[1];
    formatting.linkSrc = match[2];
    formatting.linkTitle = match[3] || '';

    // Nested formatting within link text
    const innerSegments = splitIntoSegments(formatting.text);
    const formattedInnerSegments = innerSegments.map(sgmnt => applyFormatting(sgmnt)).filter(s => s.text);

    // Parts of link with separate formatting
    if (formattedInnerSegments.length > 0) {
      const innerFormatting = formattedInnerSegments[0];
      formatting.bold = innerFormatting.bold || false;
      formatting.italic = innerFormatting.italic || false;
      formatting.text = innerFormatting.text;
    }
  } else {
    // Apply any formatting for non-link segments
    formatting = applyFormatting(segment);
  }

  return formatting;
};

export const parseFormattedString = (input: string): TextSegment[] => {
  if (typeof input !== 'string') {
    throw new Error(`parseFormattedString: text input is not string`);
  }
  if (input === '') return [{ text: '' }];

  try {
    const segments = splitIntoSegments(input);
    return segments.map(segment => determineFormatting(segment));
  } catch (error) {
    throw new Error(`parseFormattedString: ${error}`);
  }
};
