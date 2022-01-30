# tipa2unicode

[![npm version](https://badge.fury.io/js/tipa2unicode.svg)](https://badge.fury.io/js/tipa2unicode)

> Convert LaTeX/TIPA to Unicode IPA

## Usage

```bash
npx tipa2unicode [--unicode|--hex|--html] [--debug] [<file>]
```

## Install as a library

```bash
npm install tipa2unicode
```

and then

```javascript
const tipa2unicode = require('tipa2unicode');
console.log(tipa2unicode('"f\\|+2k', /* debug */ false)); // => ˈfʌ̟k 
```
