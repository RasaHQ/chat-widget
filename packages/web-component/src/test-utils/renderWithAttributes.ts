/**
 * Converts a camelCase string to kebab-case (dash-separated) string.
 * @param {string} camelCaseStr - The camelCase string to convert.
 * @returns {string} The kebab-case string.
 */
export const camelToDash = (camelCaseStr: string): string => {
  return camelCaseStr.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
};

/**
 * Renders an HTML string representing an HTML element with attributes based on the provided props.
 */
export const renderWithAttributes = (tag: string, props: any, content?: string) => {
  const args = Object.keys(props)
    .map(key => `${camelToDash(key)}="${props[key]}"`)
    .join(' ');

  if (args.length === 0) {
    return `<${tag}>${content || ''}</${tag}>`;
  }

  return `<${tag} ${args}>${content || ''}</${tag}>`;
};
