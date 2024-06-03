/* eslint-disable @typescript-eslint/no-explicit-any */
export const camelToDash = (camelCaseStr: string): string => {
  return camelCaseStr.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
};

/**
 * Renders an HTML string representing an HTML element with attributes based on the provided props.
 *
 * @param {string} tag - The HTML tag name for the element.
 * @param {Object} props - An object containing attribute names and their respective values for the HTML element.
 * @returns {string} The HTML string representing the rendered HTML element.
 *
 */
export const renderWithAttributes = (tag: string) => (props: any) => {
  const args = Object.keys(props)
    .map((key) => `${camelToDash(key)}="${props[key]}"`)
    .join(" ");

  if (args.length === 0) {
    return `<${tag}></${tag}>`;
  }

  return `<${tag} ${args}> </${tag}>`;
};
