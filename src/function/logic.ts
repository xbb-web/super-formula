export const LogicFunctions = {
  'IF(': (params: Array<[number | boolean, unknown, unknown]>) => {
    return params[0] ? params[1] : params[2]
  }
};
