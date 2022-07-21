export const LogicFunctions = {
  /**
   * Determine whether each item of the parameters is true.
   * @param args 
   * @returns boolean
   * @eg AND(3>2, a>5)
   */
  AND: function(...args: any): boolean {
    return [].every.call([...args], item => {
      return item;
    });
  },
  /**
   * Return false.
   * @returns {Boolean} false
   * @eg FALSE()
   */
  FALSE: function(): boolean {
    return false;
  },
  /**
   * Incoming an expression and two values,
   * return parameter 1 when the expression is true,
   * and return parameter 2 when the expression is false.
   * 
   * @param logic Expressions to be judged
   * @param params1 Value returned when the expression is true
   * @param params2 Value returned when the expression is false
   * @returns params1 or params2
   * @eg IF(a>b, 1, 2)
   */
  IF: function<T0, T1, T2>(logic: T0, params1: T1, params2: T2): T1 | T2 {
    return new Function(`return ${logic}`)() ? params1 : params2;
  },
  /**
   * Returns a Boolean value opposite to the specified expression
   * @param a
   * @returns {Boolean} true or false
   * @eg NOT(30>40) => true
   */
  NOT: function(a: number | string | boolean | undefined): boolean {
    return !a;
  },
  /**
   * Return true if any of the passed in parameters is true, otherwise return false
   * @param args 
   * @returns {Boolean} true or false
   * @eg OR(2>1, 1>2) => true
   */
  OR: function(...args: any): boolean {
    return [].some.call([...args], item => {
      return item;
    });
  },
  /**
   * Return true.
   * @returns {Boolean} true
   * @eg TRUE()
   */
  TRUE: function(): boolean {
    return true;
  },
  /**
   * Returns the XOR value of all parameters.
   * @param args 
   * @returns {Boolean} true or false
   * @eg XOR(a>90,b>90)
   */
  XOR: function(...args: any): boolean {
    let first = !![...args][0];
    return [].some.call([...args], item => {
      if (!!item !== first) {
        return true;
      }
      return false;
    });
  },
};
