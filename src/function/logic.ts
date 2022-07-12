export const LogicFunctions = {
  'AND(': function(...args: any): boolean {
    return [].every.call([...args], item => {
      return item;
    });
  },
  'FALSE(': function(): boolean {
    return false;
  },
  'IF(': (params: Array<[number | boolean, unknown, unknown]>) => {
    return params[0] ? params[1] : params[2];
  },
  'NOT(': function(a: number | string | boolean | undefined): boolean {
    return !a;
  },
  'OR(': function(...args: any): boolean {
    return [].some.call([...args], item => {
      return item;
    });
  },
  'TRUE(': function(): boolean {
    return true;
  },
  'XOR(': function(...args: any): boolean {
    let first = !![...args][0];
    return [].some.call([...args], item => {
      if (!!item !== first) {
        return true;
      }
      return false;
    });
  },
};
