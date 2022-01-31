const { diff } = require('jest-diff');
const tipa2unicode = require('.');
const debug = require('./debug');

expect.extend({
  toBeIPA(received, expected) {
    const options = {
      comment: 'Object.is equality, with output debug',
      isNot: this.isNot,
      promise: this.promise,
    };

    const pass = Object.is(received, expected);

    const message = pass
      ? () =>
          this.utils.matcherHint('toBeIPA', undefined, undefined, options) +
          '\n\n' +
          `Expected: not ${this.utils.printExpected(expected)}\n` +
          `Received: ${this.utils.printReceived(received)}`
      : () => {
          const dbgExpected = debug(expected);
          const dbgReceived = debug(received);
          const diffString = diff(dbgExpected, dbgReceived, {
            expand: this.expand,
          });
          return (
            this.utils.matcherHint('toBeIPA', undefined, undefined, options) +
            '\n\n' +
            `Difference:\n\n${diffString}\n` +
            `Expected: ${this.utils.printExpected(expected)}\n` +
            `Received: ${this.utils.printReceived(received)}`);
        };

    return {actual: received, message, pass};
  },
});

test('empty', () => {
  expect(tipa2unicode('')).toBeIPA('');
});

test('throw on ast kind', () => {
  expect(() => tipa2unicode('\\begin{a}\\end{a}')).toThrow();
});

test('throw on extra arg0', () => {
  expect(() => tipa2unicode('\\textctz{ }')).toThrow();
});

test('throw on extra arg1', () => {
  expect(() => tipa2unicode('\\c{}{}')).toThrow();
});

test('throw on wrong super', () => {
  expect(() => tipa2unicode('\\super{{}}')).toThrow();
});

test('throw on wrong tone', () => {
  expect(() => tipa2unicode('\\tone{{}}')).toThrow();
});

test('throw on wrong command', () => {
  expect(() => tipa2unicode('\\fancy')).toThrow();
});

test('throw on wrong char', () => {
  expect(() => tipa2unicode('ç')).toThrow();
});

test('breaks', () => {
  expect(tipa2unicode(' \t \n \n\n\n ')).toBeIPA('\n');
});

test('breaks with chars', () => {
  expect(tipa2unicode('k \t l\n m\n\n\n o')).toBeIPA('k l m\no');
});

test('jfk/squirrel', () => {
  expect(tipa2unicode('"sk\\super{w}\\r{w}3\\textrhoticity: \\s{\\|]\\textltilde}')).toBeIPA('ˈskʷẘɜ˞ː ɫ̺̩');
});

test('jfk/strengthens', () => {
  expect(tipa2unicode('"s\\t{\\textsubbar{t}\\textraising{\\textsubbar{\\r{\\*r}}}}\\super{w}\\~{E}NT \\s{n}z')).toBeIPA('ˈst̠͡ɹ̠̊˔ʷɛ̃ŋθ n̩z');
});

test('jfk/copyright', () => {
  expect(tipa2unicode('"k\\super{h}A:p i:\\super{w} ""\\textsubbar{\\*r}\\super{w}\\|+A\\textsubarch{I}Pt')).toBeIPA('ˈkʰɑːp iːʷ ˌɹ̠ʷɑ̟ɪ̯ʔt');
});

test('jfk/shenanigans', () => {
  expect(tipa2unicode('S\\super{w}\\~{@} "n\\~{\\ae{}}n 9 g\\~{@}nz')).toBeIPA('ʃʷə̃ ˈnæ̃n ɘ ɡə̃nz');
});

test('jfk/homosexual', () => {
  expect(tipa2unicode('""h\\~{\\|`o}\\~{\\textsubarch{U}}m \\|`o\\textsubarch{U} "sEk\\super{w} S\\super{w}U\\textsubarch{u} \\s{\\|]\\textltilde}')).toBeIPA('ˌhõ̞ʊ̯̃m o̞ʊ̯ ˈsɛkʷ ʃʷʊu̯ ɫ̺̩');
});

test('jfk/Valencia', () => {
  expect(tipa2unicode('v@ "\\|]l\\~{E}ns i\\textbottomtiebar{}\\textsubarch{@}')).toBeIPA('və ˈl̺ɛ̃ns i‿ə̯');
});

test('jfk/humidifier', () => {
  expect(tipa2unicode('\\c{c}\\~{U}\\~{\\textsubarch{u}} "m\\"IR @ ""f\\|+A\\textsubarch{I} \\s{\\textsubbar{\\*r}}')).toBeIPA('çʊ̃ũ̯ ˈmɪ̈ɾ ə ˌfɑ̟ɪ̯ ɹ̠̩');
});

test('jfk/mediterranean', () => {
  expect(tipa2unicode('""mER @R @\\textrhoticity{} "\\textsubbar{\\u{\\*r}}\\~{\\|`e}\\~{\\textsubarch{I}}n \\~{i}: \\s{n}\\textcorner{}')).toBeIPA('ˌmɛɾ əɾ ə˞ ˈɹ̠̆ẽ̞ɪ̯̃n ĩː n̩˺');
});

test('jfk/internationalization', () => {
  expect(tipa2unicode('""\\~{\\"I}n \\s{\\textsubbar{\\*r}} ""n\\ae{}\\super{w}S\\super{w} \\~{@} nA: \\|]l9 "z\\|`e\\textsubarch{I}\\super{w}S\\super{w} \\s{n}\\textcorner{}')).toBeIPA('ˌɪ̈̃n ɹ̠̩ ˌnæʷʃʷ ə̃ nɑː l̺ɘ ˈze̞ɪ̯ʷʃʷ n̩˺');
});

test('jfk/supercalifragilisticexpialidocious', () => {
  expect(tipa2unicode('""sU\\textsubarch{u}p \\s{\\textsubbar{\\*r}} ""k\\super{h}\\ae{}\\|]\\textltilde{} @ "f\\super{w}\\textsubbar{\\r{\\*r}}\\super{w}\\ae{}\\super{w}\\t{dZ}\\super{w} @ ""\\|]l\\"Ist 9 ""k\\super{h}Ek spi: ""\\ae{}\\|]\\textltilde{} @ "d\\|`o\\textsubarch{U}\\super{w}S\\super{w} @s')).toBeIPA('ˌsʊu̯p ɹ̠̩ ˌkʰæɫ̺ ə ˈfʷɹ̠̊ʷæʷd͡ʒʷ ə ˌl̺ɪ̈st ɘ ˌkʰɛk spiː ˌæɫ̺ ə ˈdo̞ʊ̯ʷʃʷ əs');
});
