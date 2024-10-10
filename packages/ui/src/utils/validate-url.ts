export const isValidURL = str => {
  const urlRegex = /^(https?:\/\/)(localhost|127\.0\.0\.1|[a-zA-Z0-9.-]+)(\.[a-zA-Z]{2,})?(:\d+)?(\/[^\s]*)?$/;
  return urlRegex.test(str);
};
