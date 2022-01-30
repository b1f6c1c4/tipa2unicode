const { latexParser } = require('latex-utensils');
const fs = require('fs');

const modifierLUT = {
  [':']: {
    d: '\u0256',
    l: '\u026d',
    n: '\u0273',
    r: '\u027d',
    R: '\u027b',
    s: '\u0282',
    t: '\u0288',
    z: '\u0290',
  },
  [';']: {
    A: '\u1d00',
    B: '\u0299',
    G: '\u0262',
    H: '\u029c',
    L: '\u029f',
    N: '\u0274',
    R: '\u0280',
  },
  ['!']: {
    b: '\u0253',
    d: '\u0257',
    g: '\u0260',
    G: '\u029b',
    j: '\u0284',
    o: '\u0298',
  },
  ['*']: {
    k: '\u029e',
    r: '\u0279',
    t: '\u0287',
    w: '\u028d',
    j: '\u025f',
    n: '\u0272',
    h: '\u0127',
    l: '\u026c',
    z: '\u026e',
  },
};

const toneLUT = {
  5: '\ua712',
  4: '\ua713',
  3: '\ua714',
  2: '\ua715',
  1: '\ua716',
};

const superLUT = {
  h: '\u02b0',
  w: '\u02b7',
  j: '\u02b2',
  G: '\u02e0',
  Q: '\u02e4',
  n: '\u207f',
  l: '\u02e1',
};

const basicCharLUT = {
  // Table 2.2: TIPA shortcut characters
  [':']: '\u02d0', [';']: '\u02d1', /* ['"']: '\u02c8', */
  ['0']: '\u0289', ['1']: '\u0268', ['2']: '\u028c', ['3']: '\u025c', ['4']: '\u0265', ['5']: '\u0250', ['6']: '\u0252', ['7']: '\u0264', ['8']: '\u0275', ['9']: '\u0258',
  ['@']: '\u0259', ['A']: '\u0251', ['B']: '\u03b2', ['C']: '\u0255', ['D']: '\u00f0', ['E']: '\u025b', ['F']: '\u0278', ['G']: '\u0263', ['H']: '\u0266', ['I']: '\u026a',
  ['J']: '\u029d', ['K']: '\u0281', ['L']: '\u028e', ['M']: '\u0271', ['N']: '\u014b', ['O']: '\u0254', ['P']: '\u0294', ['Q']: '\u0295', ['R']: '\u027e', ['S']: '\u0283',
  ['T']: '\u03b8', ['U']: '\u028a', ['V']: '\u028b', ['W']: '\u026f', ['X']: '\u03c7', ['Y']: '\u028f', ['Z']: '\u0292', ['|']: '\u01c0', ['!']: '\u01c3',
  // Vowels and Consonants
  ['a']: 'a', ['b']: 'b', ['c']: 'c', ['d']: 'd', ['e']: 'e', ['f']: 'f', ['g']: '\u0261', ['h']: 'h', ['i']: 'i',
  ['j']: 'j', ['k']: 'k', ['l']: 'l', ['m']: 'm', ['n']: 'n', ['o']: 'o', ['p']: 'p', ['q']: 'q', ['r']: 'r',
  ['s']: 's', ['t']: 't', ['u']: 'u', ['v']: 'v', ['w']: 'w', ['x']: 'x', ['y']: 'y', ['z']: 'z',
  // Accents and Diacritics
  ['\'']: '\u02bc',
  ['.']: '.',
};

const basicCommandLUT = {
  // Vowels and Consonants
  textturna: '\u0250', textscripta: '\u0251', textturnscripta: '\u0252', ae: '\u00e6', textsca: '\u1d00', textturnv: '\u028c',
  texthtb: '\u0253', textscb: '\u0299', textbeta: '\u03b2',
  textctc: '\u0255',
  texthtd: '\u0257', textrtaild: '\u0256', texthtrtaild: '\u1d91', textctd: '\u0221', dh: '\u00f0',
  textschwa: '\u0259', textrhookschwa: '\u025a', textreve: '\u0258', textepsilon: '\u025b', textrevepsilon: '\u025c', textrhookrevepsilon: '\u025d', textcloserevepsilon: '\u025e',
  textscriptg: '\u0261', texthtg: '\u0260', textscg: '\u0262', texthtscg: '\u029b', textgamma: '\u0263', textramshorns: '\u0264',
  textcrh: '\u0127', texthth: '\u0266', texththeng: '\u0267', textturnh: '\u0265', textsch: '\u029c',
  textbari: '\u0268', textsci: '\u026a',
  textctj: '\u029d', textbardotlessj: '\u025f', textObardotlessj: '\u025f', texthtbardotlessj: '\u0284', texthtbardotlessjvar: '\u0284',
  textturnk: '\u029e',
  textltilde: '\u026b', textbeltl: '\u026c', textrtaill: '\u026d', textlyoghlig: '\u026e', textOlyoghlig: '\u026e', textscl: '\u029f',
  textltailm: '\u0271', textturnm: '\u026f', textturnmrleg: '\u0270',
  textltailn: '\u0272', ng: '\u014b', textrtailn: '\u0273', textctn: '\u0235', textscn: '\u0274',
  textbullseye: '\u0298', textObullseye: '\u0298', textbaro: '\u0275', o: '\u00f8', oe: '\u0153', textscoelig: '\u0276', OE: '\u0276', textopeno: '\u0254',
  textphi: '\u0278',
  textfishhookr: '\u027e', textrtailr: '\u027d', textturnr: '\u0279', textturnrrtail: '\u027b', textturnlonglegr: '\u027a', textscr: '\u0280', textinvscr: '\u0281',
  textrtails: '\u0282', textesh: '\u0283',
  textrtailt: '\u0288', textturnt: '\u0287', textctt: '\u0236', texttheta: '\u03b8',
  textbaru: '\u0289', textupsilon: '\u028a',
  textscriptv: '\u028b',
  textturnw: '\u028d',
  textchi: '\u03c7',
  textturny: '\u028e', textscy: '\u028f',
  textctz: '\u0291', textrtailz: '\u0290', textyogh: '\u0292',
  textglotstop: '\u0294', textbarglotstop: '\u02a1', textrevglotstop: '\u0295', textbarrevglotstop: '\u02a2',
  textpipe: '\u01c0', textpipevar: '\u01c0', textdoublebarpipe: '\u01c2', textdoublebarpipevar: '\u01c2', textdoublepipe: '\u01c1', textdoublepipevar: '\u01c1',
  // Suprasegmentals
  textprimstress: '\u02c8', textsecstress: '\u02cc',
  textlengthmark: '\u02d0', texthalflength: '\u02d1',
  ['t*']: '\u203f', textbottomtiebar: '\u203f',
  // Accents and Diacritics
  textcorner: '\u02fa', // \u031a
  textopencorner: '\u02f9',
  textrhoticity: '\u02de',
};


// TODO:
// textbottomtiebar

const checkArg0 = (nm, args) => {
  if (args.length != 0)
    throw new Error(`Command ${nm} should not have any argument, but got ${args.length}`);
};

const checkArg1 = (nm, args) => {
  if (args.length != 1 ||
    args[0].kind != 'arg.group' ||
    args[0].content.length != 1 ||
    args[0].content[0].kind != 'text.string')
    throw new Error(`Unexpected calling format of command ${nm}`);
  return args[0].content[0].content;
}

class TipaTranspiler {
  constructor() {
    this.lut = null;
    this.isSuffix = false;
  }

  addSymbol(sym) {
    this.result += sym;
  }

  processCommand(nm, args) {
    if (this.lut)
      throw new Error(`Unexpected command ${nm} after command \\[:;!*]`);
    if (basicCommandLUT[nm]) {
      checkArg0(nm, args);
      return basicCommandLUT[nm];
    }
    if (modifierLUT[nm]) {
      checkArg0(nm, args);
      this.isSuffix = false;
      this.lut = modifierLUT[nm];
      return '';
    }
    const f = (d = '') => [...checkArg1(nm, args)].map((v) => this.take[v]).join(d);
    switch (nm) {
      case 'tone':
        return [...checkArg1(nm, args)].map((v) => toneLUT[v]).join('');
      case 'textsuperscript':
        return [...checkArg1(nm, args)].map((v) => superLUT[v]).join('');
      case 't':
      case 'texttoptiebar':
        return f('\u0361');

      // Table 3.3: Examples of the accent prefix \|
      case '|':
        checkArg0(nm, args);
        this.isSuffix = true;
        this.lut = {
          '[': '\u032a',
          ']': '\u033a',
          '(': '\u02d2',
          ')': '\u02d3',
          'c': '\u0311',
          '+': '\u031f',
          '\'': '\u031d',
          '`': '\u031e',
          '<': '\u0318',
          '>': '\u0319',
          'x': '\u033d',
          'w': '\u032b',
          'm': '\u033c',
          '~': '\u0334',
        };
        return;
      case 'textsubbridge':
        return f() + '\u032a';
      case 'textinvsubbridge':
        return f() + '\u033a';
      case 'textsubrhalfring':
        return f() + '\u02d2';
      case 'textsublhalfring':
        return f() + '\u02d3';
      case 'textroundcap':
        return f() + '\u0311';
      case 'textsubplus':
        return f() + '\u031f';
      case 'textraising':
        return f() + '\u031d';
      case 'textlowering':
        return f() + '\u031e';
      case 'textadvancing':
        return f() + '\u0318';
      case 'textretracting':
        return f() + '\u0319';
      case 'textovercross':
        return f() + '\u033d';
      case 'textsubw':
        return f() + '\u032b';
      case 'textseagull':
        return f() + '\u033c';
      case 'textsuperimposetilde':
        return f() + '\u0334';

      case '~':
        if (arg.length) {
          return f() + '\u0303';
        }
        this.isSuffix = true;
        this.lut = {
          '': '\u0303',
          '.': '\u0307\u0303',
          '*': '\u0330',
        };
        return '';
      case 'texttildedot':
        return f() + '\u0307\u0303';
      case 'textsubtilde':
        return f() + '\u0330';

      case '"':
        if (arg.length) {
          return f() + '\u0308';
        }
        this.isSuffix = true;
        this.lut = {
          '': '\u0308',
          '*': '\u0324',
        };
        return '';
      case 'textsubumlaut':
        return f() + '\u0324';

      case '^':
        if (arg.length) {
          return f() + '\u0302';
        }
        this.isSuffix = true;
        this.lut = {
          '': '\u0302',
          '*': '\u032d',
          '.': '\u0307\u0302',
        };
        return '';
      case 'textsubcircum':
        return f() + '\u032d';
      case 'textcircumdot':
        return f() + '\u0307\u0302';

      case '\'':
        if (arg.length) {
          return f() + '\u0301';
        }
        this.isSuffix = true;
        this.lut = {
          '': '\u0301',
          '*': '\u02cf', // \u0317
          '=': '\u0304\u0301',
          '.': '\u0307\u0301',
        };
        return '';
      case 'textsubacute':
        return f() + '\u02cf'; // \u0317
      case 'textacutemacron':
        return f() + '\u0304\u0301';
      case 'textdotacute':
        return f() + '\u0307\u0301';

      case '`':
        if (arg.length) {
          return f() + '\u0300';
        }
        this.isSuffix = true;
        this.lut = {
          '': '\u0300',
          '*': '\u02ce', // \u0316
          '.': '\u0300\u0307',
        };
        return '';
      case 'textsubgrave':
        return f() + '\u02ce'; // \u0316
      case 'textgravemacron':
        return f() + '\u0304\u0300';
      case 'textgravedot':
        return f() + '\u0300\u0307';

      case 'H':
        return f() + '\u02dd';
      case 'H*':
        if (args.length) {
          return f() + '\u030f';
        }
        this.isSuffix = true;
        this.lut = {
          '': '\u030f';
        };
        return '';
      case 'textdoublegrave':
        return f() + '\u030f';

      case 'r':
        if (args.length) {
          return f() + '\u02da';
        }
        this.isSuffix = true;
        this.lut = {
          '': '\u02da',
          '=': '\u0304\u02da',
          '*': '\u0325',
        };
        return '';
      case 'textringmacron':
        return f() + '\u0304\u02da';
      case 'textsubring':
        return f() + '\u0325';

      case 'v':
        if (args.length) {
          return f() + '\u02c7';
        }
        this.isSuffix = true;
        this.lut = {
          '': '\u02c7',
          '\'': '\u02c7\u0301',
          '*': '\u032c',
        };
        return '';
      case 'textacutewedge':
        return f() + '\u02c7\u0301';
      case 'textsubwedge':
        return f() + '\u032c';

      case 'u':
        if (args.length) {
          return f() + '\u02d8';
        }
        this.isSuffix = true;
        this.lut = {
          '': '\u02d8',
          '=': '\u0304\u02d8',
        };
        return '';
      case 'textbrevemacron':
        return f() + '\u0304\u02d8';

      case '=':
        if (args.length) {
          return f() + '\u02c9';
        }
        this.isSuffix = true;
        this.lut = {
          '': '\u02c9';
          '*': '\u0320';
        };
        return '';
      case 'textsubbar':
        return f() + '\u0320';

      case '.':
        if (args.length) {
          return f() + '\u02d9';
        }
        this.isSuffix = true;
        this.lut = {
          '': '\u02d9';
          '*': '\u0323';
          '\'': '\u0307\u0301',
        };
        return '';
      case 'textsubdot':
        return f() + '\u0323';

      case 'c':
        return f() + '\u0327';
      case 'k':
      case 'textpolhook':
        return f() + '\u02db';
      case 'textsubsquare':
        return f() + '\u033b';
      case 'textsubarch':
        return f() + '\u032f';
      case 's':
      case 'textsyllabic':
        return f() + '\u0329';

      default:
        throw new Error(`Unknown command ${nm}`);
    }
  }

  processChar(ch) {
    let prefix = '';
    if (this.lut === '"') {
      this.lut = null;
      if (ch === '"') return '\u02cc';
      else prefix = '\u02c8';
    } else if (ch === '"') {
      this.lut = ch; // Assumption: stress will not occur at the end of a sequence
      return '';
    }
    if (this.lut) {
      const sym = this.lut[ch];
      this.lut = '';
      if (!sym)
        throw new Error(`Cannot find modified character ${ch}`);
      return prefix + sym;
    } else {
      const sym = basicCharLUT[ch];
      if (!sym)
        throw new Error(`Cannot find shortcut character ${ch}`);
      return prefix + sym;
    }
  }

  processBreak() {
    if (this.lut)
      throw new Error(`Break is not allowed here`);
    return '\n';
  }

  take(ast) {
    switch (ast.kind) {
      case 'ast.root':
      case 'arg.group':
        return ast.content.map((el) => this.take(el)).join('');
      case 'command':
        return this.processCommand(ast.name, ast.args);
      case 'text.string':
        return [...ast.content].map((ch) => this.processChar(ch)).join('');
      case 'space':
      case 'softbreak':
        return '';
      case 'parbreak':
        return this.processBreak();
      default:
        throw new Error(`Unknown ast kind ${ast.kind}`);
    }
  }
};

const tipa2unicode = (latex) => {
  const ast = latexParser.parse(latex);
  const trans = new TipaTranspiler();
  return trans.take(ast);
};

const data = fs.readFileSync(0, 'utf-8');
console.log(tipa2unicode(data));
