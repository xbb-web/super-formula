import { sum, add, format, subtract, multiply, divide, abs, MathType, arg, } from 'mathjs';

export const NumberFunctions = {
  'SUM(': function() {
    return sum(...arguments)
  },
  'ADD(': function(num1: MathType, num2: MathType, n?: number): MathType | string {
    return format(add(num1, num2), n)
  },
  'SUBTRACT(': function(num1: MathType, num2: MathType, n?: number): MathType | string {
    return format(subtract(num1, num2), n)
  },
  'MULTIPLY(': function(num1: MathType, num2: MathType, n?: number): MathType | string {
    return format(multiply(num1, num2), n)
  },
  'DIVIDE(': function(num1: MathType, num2: MathType, n?: number): MathType | string {
    return format(divide(num1, num2), n)
  },
  'ABS(': function(num: number): number {
    return abs(num)
  },
  'AVERAGE(': function() {
    return sum(...arguments) / [...arguments].length
  }
};
