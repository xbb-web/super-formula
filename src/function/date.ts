
export const DateFunctions = {
  'DATE(': function () {
    let date
    if (arguments.length === 6) {
      date = new Date(
        parseInt(arguments[0], 10),
        parseInt(arguments[1], 10) - 1,
        parseInt(arguments[2], 10),
        parseInt(arguments[3], 10),
        parseInt(arguments[4], 10),
        parseInt(arguments[5], 10)
      )
    } else if (arguments.length === 3) {
      date = new Date(
        parseInt(arguments[0], 10),
        parseInt(arguments[1], 10) - 1,
        parseInt(arguments[2], 10)
      )
    } else {
      if (arguments[0] === undefined) {
        return undefined
      }
      date = new Date(arguments[0] * 1000)
    }
    return date
  },
  'TIME(': function (h: number, m: number, s: number) {
    return (3600 * h + 60 * m + s) / 86400
  },
  'TIMESTAMP(': function (a: Date | number) {
    return Number(a) / 1000
  },
  'NOW(': function () {
    return parseInt(String(new Date().getTime() / 1000))
  },
};
