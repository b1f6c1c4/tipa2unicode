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

describe('errors', () => {
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
  test('throw on worng lut chr', () => {
    expect(() => tipa2unicode('\\:c')).toThrow();
  });
  test('throw on lut command', () => {
    expect(() => tipa2unicode('\\:\\c{c}')).toThrow();
  });
  test('throw on lut break', () => {
    expect(() => tipa2unicode('\\|\n\n')).toThrow();
  });
  test('throw on suffix stress', () => {
    expect(() => tipa2unicode('\\r*"')).toThrow();
  });
  test('throw on suffix break', () => {
    expect(() => tipa2unicode('\\r*\n\n')).toThrow();
  });
  test('throw on end of group', () => {
    expect(() => tipa2unicode('\\:')).toThrow();
  });
});

describe('breaks', () => {
  test('empty', () => {
    expect(tipa2unicode('')).toBeIPA('');
  });
  test('simple breaks', () => {
    expect(tipa2unicode(' \t \n \n\n\n ')).toBeIPA('\n');
  });
  test('breaks with chars', () => {
    expect(tipa2unicode('k \t l\n m\n\n\n o')).toBeIPA('k l m\no');
  });
  test('breaks after prefix', () => {
    expect(tipa2unicode('" \t "\n "\n\n\n "')).toBeIPA('\u02c8 \u02c8 \u02c8\n\u02c8');
  });
});

describe('suffix', () => {
  test('double suffix', () => {
    expect(tipa2unicode('\\r*\\\'d')).toBeIPA('d\u0301\u0325');
  });
  test('\\| series', () => {
    expect(tipa2unicode('\\textsubbridge{e}')).toBeIPA(tipa2unicode('\\|[e'));
    expect(tipa2unicode('\\textinvsubbridge{e}')).toBeIPA(tipa2unicode('\\|]e'));
    expect(tipa2unicode('\\textsubrhalfring{e}')).toBeIPA(tipa2unicode('\\|)e'));
    expect(tipa2unicode('\\textsublhalfring{e}')).toBeIPA(tipa2unicode('\\|(e'));
    expect(tipa2unicode('\\textroundcap{e}')).toBeIPA(tipa2unicode('\\|ce'));
    expect(tipa2unicode('\\textsubplus{e}')).toBeIPA(tipa2unicode('\\|+e'));
    expect(tipa2unicode('\\textraising{e}')).toBeIPA(tipa2unicode('\\|\'e'));
    expect(tipa2unicode('\\textlowering{e}')).toBeIPA(tipa2unicode('\\|`e'));
    expect(tipa2unicode('\\textadvancing{e}')).toBeIPA(tipa2unicode('\\|<e'));
    expect(tipa2unicode('\\textretracting{e}')).toBeIPA(tipa2unicode('\\|>e'));
    expect(tipa2unicode('\\textovercross{e}')).toBeIPA(tipa2unicode('\\|xe'));
    expect(tipa2unicode('\\textsubw{e}')).toBeIPA(tipa2unicode('\\|we'));
    expect(tipa2unicode('\\textseagull{e}')).toBeIPA(tipa2unicode('\\|me'));
    expect(tipa2unicode('\\textsuperimposetilde{e}')).toBeIPA(tipa2unicode('\\|~e'));
  });
  test('\\~ series', () => {
    expect(tipa2unicode('\\texttildedot{e}')).toBeIPA(tipa2unicode('\\~.e'));
    expect(tipa2unicode('\\textsubtilde{e}')).toBeIPA(tipa2unicode('\\~*e'));
  });
  test('\\" series', () => {
    expect(tipa2unicode('\\"{e}')).toBeIPA(tipa2unicode('\\"e'));
    expect(tipa2unicode('\\textsubumlaut{e}')).toBeIPA(tipa2unicode('\\"*e'));
  });
  test('\\^ series', () => {
    expect(tipa2unicode('\\^{e}')).toBeIPA(tipa2unicode('\\^e'));
    expect(tipa2unicode('\\textsubcircum{e}')).toBeIPA(tipa2unicode('\\^*e'));
    expect(tipa2unicode('\\textcircumdot{e}')).toBeIPA(tipa2unicode('\\^.e'));
  });
  test('\\\' series', () => {
    expect(tipa2unicode('\\\'{e}')).toBeIPA(tipa2unicode('\\\'e'));
    expect(tipa2unicode('\\textsubacute{e}')).toBeIPA(tipa2unicode('\\\'*e'));
    expect(tipa2unicode('\\textacutemacron{e}')).toBeIPA(tipa2unicode('\\\'=e'));
    expect(tipa2unicode('\\textdotacute{e}')).toBeIPA(tipa2unicode('\\\'.e'));
  });
  test('\\` series', () => {
    expect(tipa2unicode('\\`{e}')).toBeIPA(tipa2unicode('\\`e'));
    expect(tipa2unicode('\\textsubgrave{e}')).toBeIPA(tipa2unicode('\\`*e'));
    expect(tipa2unicode('\\textgravemacron{e}')).toBeIPA('e\u0304\u0300');
    expect(tipa2unicode('\\textgravedot{e}')).toBeIPA(tipa2unicode('\\`.e'));
  });
  test('\\H series', () => {
    expect(tipa2unicode('\\H{e}')).toBeIPA('e\u02dd');
    expect(tipa2unicode('\\H*{e}')).toBeIPA(tipa2unicode('\\H*e'));
    expect(tipa2unicode('\\textdoublegrave{e}')).toBeIPA(tipa2unicode('\\H*e'));
  });
  test('\\r series', () => {
    expect(tipa2unicode('\\r{e}')).toBeIPA('e\u030a');
    expect(tipa2unicode('\\r*{e}')).toBeIPA(tipa2unicode('\\r*e'));
    expect(tipa2unicode('\\textringmacron{e}')).toBeIPA(tipa2unicode('\\r=e'));
    expect(tipa2unicode('\\textsubring{e}')).toBeIPA(tipa2unicode('\\r*e'));
  });
  test('\\v series', () => {
    expect(tipa2unicode('\\v{e}')).toBeIPA('e\u030c');
    expect(tipa2unicode('\\v\'{e}')).toBeIPA(tipa2unicode('\\v\'e'));
    expect(tipa2unicode('\\v*{e}')).toBeIPA(tipa2unicode('\\v*e'));
    expect(tipa2unicode('\\textacutewedge{e}')).toBeIPA(tipa2unicode('\\v\'e'));
    expect(tipa2unicode('\\textsubwedge{e}')).toBeIPA(tipa2unicode('\\v*e'));
  });
  test('\\u series', () => {
    expect(tipa2unicode('\\u{e}')).toBeIPA('e\u0306');
    expect(tipa2unicode('\\u={e}')).toBeIPA(tipa2unicode('\\u=e'));
    expect(tipa2unicode('\\textbrevemacron{e}')).toBeIPA(tipa2unicode('\\u=e'));
  });
  test('\\= series', () => {
    expect(tipa2unicode('\\={e}')).toBeIPA('e\u02c9');
    expect(tipa2unicode('\\=*{e}')).toBeIPA(tipa2unicode('\\=*e'));
    expect(tipa2unicode('\\textsubbar{e}')).toBeIPA(tipa2unicode('\\=*e'));
  });
  test('\\. series', () => {
    expect(tipa2unicode('\\.{e}')).toBeIPA('e\u02d9');
    expect(tipa2unicode('\\.*{e}')).toBeIPA(tipa2unicode('\\.*e'));
    expect(tipa2unicode('\\.\'{e}')).toBeIPA(tipa2unicode('\\\'.e'));
    expect(tipa2unicode('\\textsubdot{e}')).toBeIPA(tipa2unicode('\\.*e'));
  });
  test('other series', () => {
    expect(tipa2unicode('\\c{e}')).toBeIPA('e\u0327');
    expect(tipa2unicode('\\textpolhook{e}')).toBeIPA(tipa2unicode('\\k{e}'));
    expect(tipa2unicode('\\textvbaraccent{e}')).toBeIPA('e\u030d');
    expect(tipa2unicode('\\textdoublevbaraccent{e}')).toBeIPA('e\u030e');
    expect(tipa2unicode('\\textsubsquare{e}')).toBeIPA('e\u033b');
    expect(tipa2unicode('\\textsubarch{e}')).toBeIPA('e\u032f');
    expect(tipa2unicode('\\textsyllabic{e}')).toBeIPA(tipa2unicode('\\s{e}'));
  });
});

describe('other', () => {
  test('relax', () => {
    expect(tipa2unicode('\\relax{a}')).toBeIPA('a');
  });
});

describe('jfk', () => {
  test('squirrel', () => {
    expect(tipa2unicode('"sk\\super{w}\\r{w}3\\textrhoticity: \\s{\\|]\\textltilde}')).toBeIPA('ˈskʷẘɜ˞ː ɫ̺̩');
  });
  test('strengthens', () => {
    expect(tipa2unicode('"s\\t{\\textsubbar{t}\\textraising{\\textsubbar{\\r{\\*r}}}}\\super{w}\\~{E}NT \\s{n}z')).toBeIPA('ˈst̠͡ɹ̠̊˔ʷɛ̃ŋθ n̩z');
  });
  test('copyright', () => {
    expect(tipa2unicode('"k\\super{h}A:p i:\\super{w} ""\\textsubbar{\\*r}\\super{w}\\|+A\\textsubarch{I}Pt')).toBeIPA('ˈkʰɑːp iːʷ ˌɹ̠ʷɑ̟ɪ̯ʔt');
  });
  test('shenanigans', () => {
    expect(tipa2unicode('S\\super{w}\\~{@} "n\\~{\\ae{}}n 9 g\\~{@}nz')).toBeIPA('ʃʷə̃ ˈnæ̃n ɘ ɡə̃nz');
  });
  test('homosexual', () => {
    expect(tipa2unicode('""h\\~{\\|`o}\\~{\\textsubarch{U}}m \\|`o\\textsubarch{U} "sEk\\super{w} S\\super{w}U\\textsubarch{u} \\s{\\|]\\textltilde}')).toBeIPA('ˌhõ̞ʊ̯̃m o̞ʊ̯ ˈsɛkʷ ʃʷʊu̯ ɫ̺̩');
  });
  test('Valencia', () => {
    expect(tipa2unicode('v@ "\\|]l\\~{E}ns i\\textbottomtiebar{}\\textsubarch{@}')).toBeIPA('və ˈl̺ɛ̃ns i‿ə̯');
  });
  test('humidifier', () => {
    expect(tipa2unicode('\\c{c}\\~{U}\\~{\\textsubarch{u}} "m\\"IR @ ""f\\|+A\\textsubarch{I} \\s{\\textsubbar{\\*r}}')).toBeIPA('çʊ̃ũ̯ ˈmɪ̈ɾ ə ˌfɑ̟ɪ̯ ɹ̠̩');
  });
  test('mediterranean', () => {
    expect(tipa2unicode('""mER @R @\\textrhoticity{} "\\textsubbar{\\u{\\*r}}\\~{\\|`e}\\~{\\textsubarch{I}}n \\~{i}: \\s{n}\\textcorner{}')).toBeIPA('ˌmɛɾ əɾ ə˞ ˈɹ̠̆ẽ̞ɪ̯̃n ĩː n̩˺');
  });
  test('internationalization', () => {
    expect(tipa2unicode('""\\~{\\"I}n \\s{\\textsubbar{\\*r}} ""n\\ae{}\\super{w}S\\super{w} \\~{@} nA: \\|]l9 "z\\|`e\\textsubarch{I}\\super{w}S\\super{w} \\s{n}\\textcorner{}')).toBeIPA('ˌɪ̈̃n ɹ̠̩ ˌnæʷʃʷ ə̃ nɑː l̺ɘ ˈze̞ɪ̯ʷʃʷ n̩˺');
  });
  test('supercalifragilisticexpialidocious', () => {
    expect(tipa2unicode('""sU\\textsubarch{u}p \\s{\\textsubbar{\\*r}} ""k\\super{h}\\ae{}\\|]\\textltilde{} @ "f\\super{w}\\textsubbar{\\r{\\*r}}\\super{w}\\ae{}\\super{w}\\t{dZ}\\super{w} @ ""\\|]l\\"Ist 9 ""k\\super{h}Ek spi: ""\\ae{}\\|]\\textltilde{} @ "d\\|`o\\textsubarch{U}\\super{w}S\\super{w} @s')).toBeIPA('ˌsʊu̯p ɹ̠̩ ˌkʰæɫ̺ ə ˈfʷɹ̠̊ʷæʷd͡ʒʷ ə ˌl̺ɪ̈st ɘ ˌkʰɛk spiː ˌæɫ̺ ə ˈdo̞ʊ̯ʷʃʷ əs');
  });
});
