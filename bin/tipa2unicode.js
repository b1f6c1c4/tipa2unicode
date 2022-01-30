#!/usr/bin/env node

const yargs = require('yargs');
const fs = require('fs');
const tipa2unicode = require('..');
const display = require('../display.js');

const { argv } = yargs
  .scriptName('tipa2unicode')
  .usage('$0 [<options>] [<file>]')
  .strict()
  .help('h')
  .alias('h', 'help')
  .showHelpOnFail(false, 'Hint: You may need this: tipa2unicode --help.')
  .version()
  .option('unicode', {
    describe: 'Output UTF-8 encoded IPA in unicode.',
    type: 'boolean',
  })
  .option('hex', {
    describe: 'Output (\\uxxxx) hex encoded IPA in unicode.',
    type: 'boolean',
  })
  .option('html', {
    describe: 'Output HTML entities of IPA in unicode.',
    type: 'boolean',
  })
  .option('debug', {
    describe: 'Show debug output.',
    type: 'boolean',
  })
  .check((argv) => {
    const v = +!!argv.unicode + +!!argv.hex + +!!argv.html;
    if (v > 1)
      throw new Error('Error: Only one of --unicode, --hex, --html may be specified.');
    if (v === 0)
      argv.unicode = true;
    return true;
  });

const [file] = argv._.splice(0, 1);
const data = fs.readFileSync(file ? file : 0, 'utf-8');
const irs = tipa2unicode(data, argv.debug);

if (argv.debug) {
  const debug = require('../debug.js');
  console.error('Final result:', debug(irs));
}

let res;
if (argv.unicode) {
  res = irs;
} else if (argv.hex) {
  res = display.toHex(irs);
} else { // if (argv.html) {
  res = display.toHtml(irs);
}

console.log(res);
