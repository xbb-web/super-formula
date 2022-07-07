import { isNumber, flatten } from '../utils/index';

export const NumberFunctions = {
  'SUM(': function() {
    for (
      var a = 0,
        b = flatten(arguments, function(a: any) {
          return isNumber(a);
        }),
        c = 0,
        d = b.length;
      c < d;
      ++c
    ) {
      a += +b[c];
    }
    return a;
  },
};
