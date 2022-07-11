import {
  sum,
  add,
  format,
  subtract,
  multiply,
  divide,
  abs,
  MathType,
  log,
  floor,
  ceil,
  round,
  pow,
  count,
  flatten,
  prod,
  sqrt,
  isNumber,
  mod,
  BigNumber,
  Fraction,
  MathCollection,
  max,
  min,
} from 'mathjs';

export const NumberFunctions = {
  'ADD(': function(
    num1: MathType,
    num2: MathType,
    n?: number,
  ): MathType | string {
    return format(add(num1, num2), n);
  },
  'SUBTRACT(': function(
    num1: MathType,
    num2: MathType,
    n?: number,
  ): MathType | string {
    return format(subtract(num1, num2), n);
  },
  'MULTIPLY(': function(
    num1: MathType,
    num2: MathType,
    n?: number,
  ): MathType | string {
    return format(multiply(num1, num2), n);
  },
  'DIVIDE(': function(
    num1: MathType,
    num2: MathType,
    n?: number,
  ): MathType | string {
    return format(divide(num1, num2), n);
  },
  'ABS(': function(num: number): number {
    return abs(num);
  },
  'AVERAGE(': function(...arr: Array<number | BigNumber | Fraction>) {
    return sum(...arr) / [...arr].length;
  },
  'CEILING(': function(num1: number, num2: number) {
    // TODO: Fix the variable name
    if (num2 === 0) {
      return 0;
    }
    const c = num2 < 0 ? -1 : 0;
    num2 = abs(num2);
    const d = num2 - floor(num2);
    let e = 0;
    d > 0 && (e = -floor(log(d) / log(10)));
    return num1 >= 0
      ? round(ceil(num1 / num2) * num2, e)
      : c === 0
      ? -round(floor(abs(num1) / num2) * num2, e)
      : -round(ceil(abs(num1) / num2) * num2, e);
  },
  'COUNT(': function(...arr: MathType[]) {
    return count([...arr]);
  },
  'COUNTIF(': function(array: Array<any>, criteria: string) {
    /[<>=!]/.test(criteria) || (criteria = '=="' + criteria + '"');
    let matches;
    for (let args = flatten(array), matches = 0, i = 0; i < args.length; i++) {
      'string' != typeof args[i]
        ? new Function(`return ${args[i]}${criteria}`)() && matches++
        : new Function(`return '${args[i]}'${criteria}`)() && matches++;
    }
    return matches;
  },
  'SUMIF(': function(array: Array<any>, criteria: string) {
    /[<>=!]/.test(criteria) || (criteria = '=="' + criteria + '"');
    const args = flatten(array);
    let matches = 0;
    for (let i = 0; i < args.length; i++) {
      if ('string' != typeof args[i]) {
        if (new Function(`return ${args[i]}${criteria}`)()) {
          matches += args[i];
        }
      } else {
        if (new Function(`return '${args[i]}'${criteria}`)()) {
          matches += args[i];
        }
      }
    }
    return matches;
  },
  'FIXED(': function(source: number, digits: number) {
    digits = void 0 === digits ? 0 : digits;
    return isNumber(digits) && digits >= 0
      ? Number(source).toFixed(digits)
      : '';
  },
  'FLOOR(': function(source: number, digits: number) {
    // TODO: Fix the variable name
    if (digits === 0) {
      return 0;
    }
    if (!((source > 0 && digits > 0) || (source < 0 && digits < 0))) {
      return 0;
    }
    digits = abs(digits);
    const c = digits - floor(digits);
    let d = 0;
    c > 0 && (d = -floor(log(c) / log(10)));
    return source >= 0
      ? round(floor(source / digits) * digits, d)
      : -round(floor(abs(source) / digits) * digits, d);
  },
  'INT(': function(number: number) {
    return isNumber(number) ? floor(number) : 0;
  },
  'RAND(': function() {
    return Math.random();
  },
  'LARGE(': function(a: Array<number>, b: number) {
    let arr = [].sort.call(a, (a, b) => {
      return b - a;
    });
    return arr[b - 1];
  },
  'LOG(': function(number: number, base: number) {
    if (number === undefined || base === undefined) return;
    return isNumber(base) ? log(number, base) : 0;
  },
  'MAX(': function(...args: MathType[]) {
    return max(...args);
  },
  'MIN(': function(...args: MathType[]) {
    return min(...args);
  },
  'MOD(': function<T extends number | BigNumber | Fraction | MathCollection>(
    dividend: T,
    divisor: number | BigNumber | Fraction | MathCollection,
  ) {
    return mod(dividend, divisor);
  },
  'POWER(': function(base: number, exponent: number) {
    return pow(base, exponent);
  },
  'PRODUCT(': function(...args: MathType[]): number | undefined {
    return prod(...args);
  },
  'ROUND(': function(number: number, base: number) {
    return round(number, base);
  },
  'ROUNDUP(': function(number: number, decimals: number) {
    return ceil(number, decimals);
  },
  'ROUNDDOWN(': function(number: number, decimals: number) {
    return floor(number, decimals);
  },
  'SQRT(': function(number: number): number {
    return sqrt(number);
  },
  'CONDITION_SUM(': function(
    conditions: Array<any>,
    exp: string,
    values: Array<any>,
  ) {
    let sum: number | string = 0;
    conditions.forEach((item, index) => {
      let val = isNumber(values[index]) ? values[index] : 0;
      if (new Function(`return "${item}"${exp}`)()) {
        sum += val;
      }
    });
    return sum;
  },
  'SUM(': function(...arr: Array<number | BigNumber | Fraction>) {
    return sum(...arr);
  },
  'SUMPRODUCT(': function() {
    // TODO: Performance testing and optimization writing
    for (
      var a = 0, b = [], c = -1, d = 0;
      d < arguments.length;
      d++ // eslint-disable-next-line
    ) {
      arguments[d] instanceof Array &&
        ((c = c < 0 ? arguments[d].length : Math.min(arguments[d].length, c)),
        b.push(arguments[d]));
    }
    for (var e, f, g, h = 0; h < c; h++) {
      for (
        e = 1, f = 0;
        f < b.length;
        f++ // eslint-disable-next-line
      ) {
        (g = parseFloat(b[f][h])), isNaN(g) && (g = 0), (e *= g);
      }
      a += e;
    }
    return a;
  },
};
