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

const basicCharLUT = {
  // Table 2.2: TIPA shortcut characters
  [':']: '\u02d0', [';']: '\u02d1', ['"']: '\u02c8',
  ['0']: '\u0289', ['1']: '\u0268', ['2']: '\u028c', ['3']: '\u025c', ['4']: '\u0265', ['5']: '\u0250', ['6']: '\u0252', ['7']: '\u0264', ['8']: '\u0275', ['9']: '\u0258',
  ['@']: '\u0259', ['A']: '\u0251', ['B']: '\u03b2', ['C']: '\u0255', ['D']: '\u00f0', ['E']: '\u025b', ['F']: '\u0278', ['G']: '\u0263', ['H']: '\u0266', ['I']: '\u026a',
  ['J']: '\u029d', ['K']: '\u0281', ['L']: '\u028e', ['M']: '\u0271', ['N']: '\u014b', ['O']: '\u0254', ['P']: '\u0294', ['Q']: '\u0295', ['R']: '\u027e', ['S']: '\u0283',
  ['T']: '\u03b8', ['U']: '\u028a', ['V']: '\u028b', ['W']: '\u026f', ['X']: '\u03c7', ['Y']: '\u028f', ['Z']: '\u0292', ['|']: '\u01c0', ['!']: '\u01c3',
  // Appendix
  ['a']: 'a', ['b']: 'b', ['c']: 'c', ['d']: 'd', ['e']: 'e', ['f']: 'f', ['g']: '\u0261', ['h']: 'h', ['i']: 'i',
  ['j']: 'j', ['k']: 'k', ['l']: 'l', ['m']: 'm', ['n']: 'n', ['o']: 'o', ['p']: 'p', ['q']: 'q', ['r']: 'r',
  ['s']: 's', ['t']: 't', ['u']: 'u', ['v']: 'v', ['w']: 'w', ['x']: 'x', ['y']: 'y', ['z']: 'z',
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
};

// Accents and Diacritics

// TODO:
// textbottomtiebar
// tone

class TipaTranspiler {
  constructor() {
    this.result = '';
    this.lut = null;
  }

  addSymbol(sym) {
    this.result += sym;
  }

  processCommand(nm, args) {
    if (this.lut)
      throw new Error(`Unexpected command ${nm} after command \\[:;!*]`);
    if (basicCommandLUT[nm]) {
      if (args.length != 0)
        throw new Error(`Command ${nm} should not have any argument, but got ${args.length}`);
      this.addSymbol(basicCommandLUT[nm]);
      return;
    }
    if (modifierLUT[nm]) {
      if (args.length != 0)
        throw new Error(`Command ${nm} should not have any argument, but got ${args.length}`);
      this.lut = modifierLUT[nm];
      return;
    }
  }

  processChar(ch) {
    if (this.lut) {
      const sym = this.lut[ch];
      this.lut = null;
      if (!sym)
        throw new Error(`Cannot find modified character ${ch}`);
      this.addSymbol(sym);
    } else {
      const sym = basicCharLUT[ch];
      if (!sym)
        throw new Error(`Cannot find shortcut character ${ch}`);
      this.addSymbol(sym);
    }
  }

  take(ast) {
    switch (ast.kind) {
      case 'ast.root':
      case 'arg.group':
        ast.content.forEach((el) => { this.take(el); });
        return;
      case 'space':
      case 'softbreak':
        return;
      case 'command':
        this.processCommand(ast.name, ast.args);
        return;
      case 'text.string':
        [...ast.content].forEach((el) => { this.processChar(el); });
        return;
      default:
        throw new Error(`Unknown ast kind ${ast.kind}`);
    }
  }
};

const tipa2unicode = (latex) => {
  const ast = latexParser.parse(latex);
  const trans = new TipaTranspiler();
  trans.take(ast);
  return trans.result;
};

const data = fs.readFileSync(0, 'utf-8');
console.log(tipa2unicode(data));
