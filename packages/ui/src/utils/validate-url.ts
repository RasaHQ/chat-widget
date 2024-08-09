export const isValidURL = str => {
  const urlRegex =
    /^(https?:\/\/)(\S+(?::\S*)?@)?(localhost|(\d{1,3}\.){3}\d{1,3}|([a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+(\.[a-zA-Z\u00a1-\uffff0-9]+-?)*(\.[a-zA-Z\u00a1-\uffff]{2,}))(:(\d{2,5}))?(\/\S*)?$/i;
  return urlRegex.test(str);
};
