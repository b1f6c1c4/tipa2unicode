const unicode = require('unicode/category');

const dbg = (obj) => {
  if (typeof obj === 'string') {
    return [...obj].map((ch) => {
      const code = ch.charCodeAt(0);
      const desc = Object.entries(unicode).find(([ty, cat]) => cat[code])[1][code].name;
      let s = code.toString(16);
      while (s.length < 4) s = '0' + s;
      return ['U+' + s, desc];
    });
  } else if (Array.isArray(obj)) {
    return obj.map(dbg);
  } else if (typeof obj === 'object') {
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, dbg(v)]));
  } else {
    return obj;
  }
};

module.exports = dbg;
