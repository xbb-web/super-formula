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
  count,
  round,
  pow,
  flatten,
  prod,
  sqrt,
  isNumber,
  mod,
  BigNumber,
  bignumber,
  Fraction,
  MathCollection,
  max,
  min,
  Complex,
} from "mathjs";

import { ArrayNumberInner } from "../types";

function formatInput(input): number {
  if (Array.isArray(input)) {
    return sum(input);
  } else {
    return input || 0
  }
}

export const NumberFunctions = {
  /**
   * Get the accuracy of the two numbers.
   * @param {MathType} num1 Number 1
   * @param {MathType} num2 Number 2
   * @param {MathType} n Precision
   * @returns {nubmer} nubmer
   * @eg ADD(1,2)
   */
  ADD: function (
    num1: number = 0,
    num2: number = 0,
    n?: number
  ): MathType | string {
    num1 = formatInput(num1)
    num2 = formatInput(num2)
    return n
      ? Number(format(add(num1, num2), { notation: "fixed", precision: n }))
      : Number(format(add(bignumber(num1), bignumber(num2))));
  },
  /**
   * Get the exact difference between two numbers.
   * @param {MathType} num1 Number 1
   * @param {MathType} num2 Number 2
   * @param {MathType} n Precision
   * @returns {nubmer} nubmer
   * @eg SUBTRACT(1,2)
   */
  SUBTRACT: function (
    num1: number = 0,
    num2: number = 0,
    n?: number
  ): MathType | string {
    num1 = formatInput(num1)
    num2 = formatInput(num2)
    return n
      ? Number(
          format(subtract(num1, num2), { notation: "fixed", precision: n })
        )
      : Number(format(subtract(bignumber(num1), bignumber(num2))));
  },
  /**
   * Get the exact product of two numbers.
   * @param {MathType} num1 Number 1
   * @param {MathType} num2 Number 2
   * @param {MathType} n Precision
   * @returns {nubmer} nubmer
   * @eg MULTIPLY(1,2)
   */
  MULTIPLY: function (
    num1: number = 0,
    num2: number = 0,
    n?: number
  ): MathType | string {
    num1 = formatInput(num1)
    num2 = formatInput(num2)
    return n
      ? Number(
          format(multiply(num1, num2), { notation: "fixed", precision: n })
        )
      : Number(format(multiply(bignumber(num1), bignumber(num2))));
  },
  /**
   * Get the exact quotient of two numbers.
   * @param {MathType} num1 Number 1
   * @param {MathType} num2 Number 2
   * @param {MathType} n Precision
   * @returns {nubmer} nubmer
   * @eg DIVIDE(1,2)
   */
  DIVIDE: function (

    num1: number = 0,
    num2: number = 0,
    n?: number
  ): MathType | string {
    // The dividend(num2) cannot be 0, otherwise it will result in results such as infinity and NaN
    if (!num2) return 0
    num1 = formatInput(num1)
    num2 = formatInput(num2)
    return n
      ? Number(format(divide(num1, num2), { notation: "fixed", precision: n }))
      : Number(format(divide(bignumber(num1), bignumber(num2))));
  },
  ABS: function (num: number = 0): number {
    return abs(num);
  },
  AVERAGE: function (...arr: Array<number | BigNumber | Fraction>) {
    const arg = [...arr]
    if (Array.isArray(arg[0])) {
      return sum(...arg[0]) / arg[0].length
    }
    return sum(...arr) / [...arr].length;
  },
  CEILING: function (num1: number = 0, num2: number = 0) {
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
  COUNT: function (...arr: Array<any>) {
    return count([...arr]);
  },
  COUNTIF: function (array: Array<any>, criteria: string) {
    /[<>=!]/.test(criteria) || (criteria = '=="' + criteria + '"');
    let matches = 0;
    for (let args = flatten(array), i = 0; i < args.length; i++) {
      let computCharacters =
        "string" !== typeof args[i]
          ? `return ${args[i]}${criteria}`
          : `return '${args[i]}'${criteria}`;
      new Function(computCharacters)() && matches++;
    }
    return matches;
  },
  SUMIF: function (array: Array<number>, criteria: string) {
    /[<>=!]/.test(criteria) || (criteria = '=="' + criteria + '"');
    const args = flatten(array);
    let matches = 0;
    for (let i = 0; i < args.length; i++) {
      let computCharacters =
        "string" !== typeof args[i]
          ? `return ${args[i]}${criteria}`
          : `return '${args[i]}'${criteria}`;
      if (new Function(computCharacters)()) {
        matches += Number(args[i]);
      }
    }
    return matches;
  },
  FIXED: function (source: number, digits: number) {
    digits = void 0 === digits ? 0 : digits;
    return isNumber(digits) && digits >= 0
      ? Number(source).toFixed(digits)
      : "";
  },
  FLOOR: function (source: number, digits: number) {
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
  INT: function (number: number = 0) {
    const num = Number(number);
    return isNumber(num) ? floor(num) : 0;
  },
  RAND: function () {
    return Math.random();
  },
  LARGE: function (a: Array<number>, b: number) {
    let arr = [].sort.call(a, (a, b) => {
      return b - a;
    });
    return arr[b - 1];
  },
  LOG: function (number: number, base: number) {
    if (number === undefined || base === undefined) return;
    const num = Number(base);
    return isNumber(num) ? log(number, num) : 0;
  },
  MAX: function (...args: any[]) {
    // Confirm that all elements in data must be numbers, null and undefined are converted to 0
    const arrData = [...args];
    arrData.forEach((item, index) => {
      if (item === null || item === undefined) {
        arrData[index] = 0;
      } else if (Array.isArray(item)) {
        item.forEach((element, elementIndex) => {
          if (element === null || element === undefined) {
            item[elementIndex] = 0;
          }
        });
      }
    });
    return max(...args);
  },
  MIN: function (...args: any[]) {
    // Confirm that all elements in data must be numbers, null and undefined are converted to 0
    const arrData = [...args];
    arrData.forEach((item, index) => {
      if (item === null || item === undefined) {
        arrData[index] = 0;
      } else if (Array.isArray(item)) {
        item.forEach((element, elementIndex) => {
          if (element === null || element === undefined) {
            item[elementIndex] = 0;
          }
        });
      }
    });
    return min(...args);
  },
  MOD: function <T extends number | BigNumber | Fraction | MathCollection>(
    dividend: T,
    divisor: number | BigNumber | Fraction | MathCollection
  ) {
    return mod(dividend, divisor);
  },
  POWER: function (base: number, exponent: number) {
    return pow(base, exponent);
  },
  PRODUCT: function (...args: any[]): number | undefined {
    if (
      [...args].length === 0 ||
      ([...args].length === 1 &&
        ([...args][0] === undefined || [...args][0].length === 0))
    ) {
      return;
    }
    return prod(...args);
  },
  ROUND: function (number: number, base: number) {
    return round(number, base);
  },
  ROUNDUP: function (number: number, decimals: number) {
    return ceil(number, decimals);
  },
  ROUNDDOWN: function (number: number, decimals: number) {
    return floor(number, decimals);
  },
  SQRT: function (number: number): number | Complex {
    return sqrt(number);
  },
  CONDITION_SUM: function (
    conditions: Array<any>,
    exp: string,
    values: Array<any>
  ) {
    let sum: number | string = 0;
    conditions.forEach((item, index) => {
      if (item === null) return
      let val = isNumber(values[index]) ? values[index] : 0;
      if (new Function(`return "${item}"${exp}`)()) {
        sum += val;
      }
    });
    return sum;
  },
  // TODO: the sum not support like: SUM([1,2,3,4,[1,2,3,4]])，SUM([1,2,3,4],1)
  SUM: function <T extends ArrayNumberInner>(...arr: T) {
    // Confirm that all elements in data must be numbers, null and undefined are converted to 0
    const arrData = [...arr];
    arrData.forEach((item, index) => {
      if (item === null || item === undefined) {
        arrData[index] = 0;
      } else if (Array.isArray(item)) {
        item.forEach((element, elementIndex) => {
          if (element === null || element === undefined) {
            item[elementIndex] = 0;
          }
        });
      }
    });
    return sum(arrData);
  },
  SUMPRODUCT: function (...args: Array<Array<Array<number> | number>>) {
    if (
      [...args].length === 0 ||
      ([...args].length === 1 &&
        ([...args][0] === undefined || [...args][0].length === 0))
    ) {
      return;
    }
    // TODO: Performance testing and optimization writing
    const arr = [...args];
    let a = 0,
      b: Array<Array<Array<number> | number>> = [],
      c = -1;
    for (let i = 0; i < arr.length; i++) {
      arr[i] instanceof Array &&
        ((c = c < 0 ? arr[i].length : Math.min(arr[i].length, c)),
        b.push(arr[i]));
    }
    let e,
      f,
      g = 0;
    for (let i = 0; i < c; i++) {
      for (e = 1, f = 0; f < b.length; f++) {
        (g = parseFloat(String(b[f][i]))), isNaN(g) && (g = 0), (e *= g);
      }
      a += e;
    }
    return a;
  },
};
