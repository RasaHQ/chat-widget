function generateMixedString(length: number): string {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  let charCount = 0;

  while (result.length < length) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
    charCount++;

    if (charCount === 10) {
      result += ' ';
      charCount = 0;
    }
  }

  return result.substring(0, length);
}

export { generateMixedString };
