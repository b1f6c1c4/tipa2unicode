const tipa2unicode = require('.');

test('empty', () => {
  expect(tipa2unicode('')).toBe('');
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
  expect(tipa2unicode(' \t \n \n\n\n ')).toBe('\n');
});

test('breaks with chars', () => {
  expect(tipa2unicode('k \t l\n m\n\n\n o')).toBe('k l m\no');
});

test('jfk/squirrel', () => {
  expect(tipa2unicode('"sk\\super{w}\\r{w}3\\textrhoticity: \\s{\\|~{\\|]l}}')).toBe('ˈskʷẘɜ˞ː ɫ̺̩');
});

test('jfk/strengthens', () => {
  expect(tipa2unicode('"s\\t{\\textsubbar{t}\\textraising{\\textsubbar{\\r{\\*r}}}}\\super{w}\\~{E}NT \\s{n}z')).toBe('ˈst̠͡ɹ̠̊˔ʷɛ̃ŋθ n̩z');
});

test('jfk/copyright', () => {
  expect(tipa2unicode('"k\\super{h}A:p i:\\super{w} ""\\textsubbar{\\*r}\\super{w}\\|+A\\textsubarch{I}Pt')).toBe('ˈkʰɑːp iːʷ ˌɹ̠ʷɑ̟ɪ̯ʔt');
});

test('jfk/shenanigans', () => {
  expect(tipa2unicode('S\\super{w}\\~{@} "n\\~{\\ae{}}n 9 g\\~{@}nz')).toBe('ʃʷə̃ ˈnæ̃n ɘ ɡə̃nz');
});

test('jfk/homosexual', () => {
  expect(tipa2unicode('""h\\~{\\|`o}\\~{\\textsubarch{U}}m \\|`o\\textsubarch{U} "sEk\\super{w} S\\super{w}U\\textsubarch{u} \\s{\\|~{\\|]l}}')).toBe('ˌhõ̞ʊ̯̃m o̞ʊ̯ ˈsɛkʷ ʃʷʊu̯ ɫ̺̩');
});

test('jfk/Valencia', () => {
  expect(tipa2unicode('v@ "\\|]l\\~{E}ns i\\textbottomtiebar{}\\textsubarch{@}')).toBe('və ˈl̺ɛ̃ns i‿ə̯');
});

test('jfk/humidifier', () => {
  expect(tipa2unicode('\\c{c}\\~{U}\\~{\\textsubarch{u}} "m\\"IR @ ""f\\|+A\\textsubarch{I} \\s{\\textsubbar{\\*r}}')).toBe('çʊ̃ũ̯ ˈmɪ̈ɾ ə ˌfɑ̟ɪ̯ ɹ̠̩');
});

test('jfk/mediterranean', () => {
  expect(tipa2unicode('""mER @R @\\textrhoticity "\\textsubbar{\\u{\\*r}}\\~{\\|`e\\textsubarch{I}}n \\~{i}: \\s{n}\\textcorner{}')).toBe('ˌmɛɾ əɾ ə˞ ˈɹ̠̆ẽ̞ɪ̯̃n ĩː n̩˺');
});

test('jfk/internationalization', () => {
  expect(tipa2unicode('""\\~{\\"I}n \\s{\\textsubbar{\\*r}} ""n\\ae{}\\super{w}S\\super{w} \\~{@} nA: \\|]l9 "z\\|`e\\textsubarch{I}\\super{w}S\\super{w} \\s{n}\\textcorner{}')).toBe('ˌɪ̈̃n ɹ̠̩ ˌnæʷʃʷ ə̃ nɑː l̺ɘ ˈze̞ɪ̯ʷʃʷ n̩˺');
});

test('jfk/supercalifragilisticexpialidocious', () => {
  expect(tipa2unicode('""sU\\textsubarch{u}p \\s{\\textsubbar{\\*r}} ""k\\super{h}\\ae{}\\|~{\\|]l} @ "f\\super{w}\\textsubbar{\\r{\\*r}}\\super{w}\\ae{}\\super{w}\\t{dZ}\\super{w} @ ""\\|]l\\"Ist 9 ""k\\super{h}Ek spi: ""\\ae{}\\|~{\\|]l} @ "d\\|`o\\textsubarch{U}\\super{w}S\\super{w} @s')).toBe('ˌsʊu̯p ɹ̠̩ ˌkʰæɫ̺ ə ˈfʷɹ̠̊ʷæʷd͡ʒʷ ə ˌl̺ɪ̈st ɘ ˌkʰɛk spiː ˌæɫ̺ ə ˈdo̞ʊ̯ʷʃʷ əs');
});
