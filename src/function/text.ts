import { convertCurrency, numberToChinese } from "../utils";

const isObjectEmpty = function (a: any) {
   if (a == null) {
      return !0;
   }
   if (a.length > 0) {
      return !1;
   }
   if (a.length === 0) {
      return !0;
   }
   for (var b in a) {
      if (Object.hasOwnProperty.call(a, b)) {
         return !1;
      }
   }
   return isNaN(a);
};
export const TextFunctions = {
   JOIN: (params: Array<any>, split: string) => params.join(split),
   CONCATENATE: function (...args: Array<string>) {
      let res = '';
      [...args].forEach((item = '') => {
         res += item;
      });
      return res;
   },
   EXACT: function (text_1: string, text_2: string) {
      return text_1 === text_2;
   },
   ISEMPTY: function (target: any): boolean {
      return isObjectEmpty(target);
   },
   LEFT: function (text = '', slice: number): string {
      return ''.substr.call(text, 0, slice);
   },
   LEN: function (text: string): number {
      return text.length;
   },
   LOWER: function (text: string = '') {
      return text.toLocaleLowerCase();
   },
   MID: function (text: string, start: number, end: number) {
      return text.slice(start - 1, start + end - 1);
   },
   REPLACE: function (text = '', start: number, end: number, target: string) {
      let arr = text.split('');
      arr.splice(start - 1, end, target);
      return arr.join('');
   },
   REPT: function (text: string, times: number) {
      let str = '';
      for (let i = 0; i < times; i++) {
         str += text;
      }
      return str;
   },
   RIGHT: function (text = '', lens: number) {
      return text.substr(-lens);
   },
   SEARCH: function (text1 = '', text2 = '') {
      return text2.indexOf(text1) + 1;
   },
   SPLIT: function (text = '', split = '') {
      return text.split(split);
   },
   // TODO: check full function
   TEXT: function (number: number, text_format = '') {
      switch (text_format) {
         case '[Num1]':
            return numberToChinese(number)
         case '[Num2]':
            return convertCurrency(number)
         default:
            return String(number);
      }
   },
   TRIM: function (text = '') {
      return text.trim().replace(/\s+/g, '');
   },
   UPPER: function (text = '') {
      return text.toLocaleUpperCase();
   },
   // TODO: Type check
   VALUE: function (text = '') {
      return Number(text);
   },
};
