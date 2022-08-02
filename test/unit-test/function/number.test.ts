import { NumberFunctions } from '../../../src/function/number';

describe('NumberFunction', () => {
  it('ADD', () => {
    expect(NumberFunctions.ADD(1, 1)).toEqual(2);
    expect(NumberFunctions.ADD(0.1, 0.2, 1)).toEqual(0.3);
    expect(NumberFunctions.ADD(0.455555, 0.355555, 2)).toEqual(0.81);
  });
  it('SUBTRACT', () => {
    expect(NumberFunctions.SUBTRACT(2, 1)).toEqual(1);
    expect(NumberFunctions.SUBTRACT(0.3, 0.2, 1)).toEqual(0.1);
  });
  it('MULTIPLY', () => {
    expect(NumberFunctions.MULTIPLY(2, 1)).toEqual(2);
    expect(NumberFunctions.MULTIPLY(0.3, 0.2, 2)).toEqual(0.06);
  });
  it('DIVIDE', () => {
    expect(NumberFunctions.DIVIDE(4, 2)).toEqual(2);
    expect(NumberFunctions.DIVIDE(1, 0.3, 2)).toEqual(3.3);
  });
  it('ABS', () => {
    expect(NumberFunctions.ABS(-8)).toEqual(8);
  });
  it('AVERAGE', () => {
    expect(NumberFunctions.AVERAGE(1, 2, 3, 4)).toEqual(2.5);
  });
  it('CEILING', () => {
    expect(NumberFunctions.CEILING(7, 0)).toEqual(0);
    expect(NumberFunctions.CEILING(-7, 6)).toEqual(-6);
    expect(NumberFunctions.CEILING(7, 6)).toEqual(12);
  });
  it('COUNT', () => {
    expect(NumberFunctions.COUNT(1, 2, 3, 4)).toEqual(4);
    expect(NumberFunctions.COUNT(['COUNT', 'COUNT'])).toEqual(2);
  });
  it('COUNTIF', () => {
    expect(NumberFunctions.COUNTIF([1, 2, 3, 4], ">2")).toEqual(2);
    expect(NumberFunctions.COUNTIF(["men", "men", "women"], "women")).toEqual(1);
  });
  it('SUMIF', () => {
    expect(NumberFunctions.SUMIF([5, 6, 7, 8], ">6")).toEqual(15);
  });
  it('FIXED', () => {
    expect(NumberFunctions.FIXED(3.1415, 2)).toEqual("3.14");
  });
  it('FLOOR', () => {
    expect(NumberFunctions.FLOOR(6, 0)).toEqual(0);
    expect(NumberFunctions.FLOOR(7, 6)).toEqual(6);
    expect(NumberFunctions.FLOOR(-7, -6)).toEqual(-6);
    expect(NumberFunctions.FLOOR(1, -6)).toEqual(0);
  });
  it('INT', () => {
    expect(NumberFunctions.INT(3.1415)).toEqual(3);
  });
  it('RAND', () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0.123456789);
    expect(NumberFunctions.RAND()).toEqual(0.123456789);
    jest.spyOn(global.Math, 'random').mockRestore();
  });
  it('LARGE', () => {
    expect(NumberFunctions.LARGE([89, 90, 91, 92, 88], 1)).toEqual(92);
  });
  it('LOG', () => {
    expect(NumberFunctions.LOG(100,10)).toEqual(2);
  });
  it('MAX', () => {
    expect(NumberFunctions.MAX(100, 10, 90)).toEqual(100);
  });
  it('MIN', () => {
    expect(NumberFunctions.MIN(100, 10, 90)).toEqual(10);
  });
  it('MOD', () => {
    expect(NumberFunctions.MOD(4, 3)).toEqual(1);
  });
  it('POWER', () => {
    expect(NumberFunctions.POWER(3, 2)).toEqual(9);
  });
  it('PRODUCT', () => {
    expect(NumberFunctions.PRODUCT(1, 2, 3)).toEqual(6);
  });
  it('ROUND', () => {
    expect(NumberFunctions.ROUND(3.1485, 2)).toEqual(3.15);
  });
  it('ROUNDUP', () => {
    expect(NumberFunctions.ROUNDUP(3.11, 1)).toEqual(3.2);
  });
  it('ROUNDDOWN', () => {
    expect(NumberFunctions.ROUNDDOWN(3.19, 1)).toEqual(3.1);
  });
  it('SQRT', () => {
    expect(NumberFunctions.SQRT(9)).toEqual(3);
  });
  it('CONDITION_SUM', () => {
    expect(NumberFunctions.CONDITION_SUM(["men", "men", "women"], "=='men'", [1, 2, 3])).toEqual(3);
    expect(NumberFunctions.CONDITION_SUM([1, 2, 3], ">=2", [1, 2, 3])).toEqual(5);
  });
  it('SUM', () => {
    expect(NumberFunctions.SUM(1, 2, 3, 4)).toEqual(10);
    // expect(NumberFunctions.SUM([1, 2, 3, 4])).toEqual(10);
  });
  it('SUMPRODUCT', () => {
    expect(NumberFunctions.SUMPRODUCT([1, 2, 3],[0.1,0.2,0.3])).toEqual(1.4);
  });
});
