import * as nzhcn from 'nzh/cn'

export const convertCurrency = (n) => {
  return nzhcn.toMoney(n, {
    outSymbol: false
  })
};
