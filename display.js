const { htmlEncode } = require('htmlencode');

module.exports.toHtml = (str) => htmlEncode(str);

module.exports.toHex = (str) => [...str].map((ch) => {
  const code = ch.charCodeAt(0);
  if (code >= 32 && code <= 126) return ch;
  const desc = Object.entries(unicode).find(([ty, cat]) => cat[code])[1][code].name;
  let s = code.toString(16);
  while (s.length < 4) s = '0' + s;
  return '\\u' + s;
}).join('');
