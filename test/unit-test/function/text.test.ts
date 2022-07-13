import { TextFunctions } from '../../../src/function/text';

describe('LogicFunction', () => {
  it('JOIN', () => {
    expect(TextFunctions.JOIN(['miemie', 'aman'], ',')).toEqual('miemie,aman');
  });
  it('CONCATENATE', () => {
    expect(TextFunctions.CONCATENATE('miemie', 'aman')).toEqual('miemieaman');
  });
  it('EXACT', () => {
    expect(TextFunctions.EXACT('Wakanda', 'Forever')).toEqual(false);
    expect(TextFunctions.EXACT('formula', 'formula')).toEqual(true);
  });
  it('ISEMPTY', () => {
    expect(TextFunctions.ISEMPTY({})).toEqual(true);
    expect(TextFunctions.ISEMPTY({a: 1})).toEqual(false);
    expect(TextFunctions.ISEMPTY('')).toEqual(true);
    expect(TextFunctions.ISEMPTY('formula')).toEqual(false);
    expect(TextFunctions.ISEMPTY([])).toEqual(true);
    expect(TextFunctions.ISEMPTY(null)).toEqual(true);
  });
  it('LEFT', () => {
    expect(TextFunctions.LEFT('Formula', 2)).toEqual('Fo');
  });
  it('LEN', () => {
    expect(TextFunctions.LEN('Formula')).toEqual(7);
  });
  it('LOWER', () => {
    expect(TextFunctions.LOWER('FORMULA')).toEqual('formula');
  });
  it('MID', () => {
    expect(TextFunctions.MID('formula', 2, 3)).toEqual('orm');
  });
  it('REPLACE', () => {
    expect(TextFunctions.REPLACE('formula', 2, 2, '-')).toEqual('f-mula');
  });
  it('REPT', () => {
    expect(TextFunctions.REPT('formula', 3)).toEqual('formulaformulaformula');
  });
  it('RIGHT', () => {
    expect(TextFunctions.RIGHT('formula', 2)).toEqual('la');
  });
  it('SEARCH', () => {
    expect(TextFunctions.SEARCH('ula', 'formula')).toEqual(5);
  });
  it('SPLIT', () => {
    expect(TextFunctions.SPLIT('formula,formula,formula', ',')).toEqual(['formula', 'formula', 'formula']);
  });
  it('TEXT', () => {
    expect(TextFunctions.TEXT(3.1415)).toEqual('3.1415');
  });
  it('TRIM', () => {
    expect(TextFunctions.TRIM('for mu la')).toEqual('formula');
  });
  it('UPPER', () => {
    expect(TextFunctions.UPPER('formula')).toEqual('FORMULA');
  });
  it('VALUE', () => {
    expect(TextFunctions.VALUE('3.1415')).toEqual(3.1415);
  });
});
