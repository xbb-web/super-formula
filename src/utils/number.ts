
export const isNumber = function (b: any): Boolean {
  return Number.isInteger(b)
}

export const flatten = function(a, b, c?) {
  if ((c || (c = []), a)) {
    for (var d = 0, e = a.length; d < e; d++) {
      var f = a[d]
      Array.isArray(f) ? flatten(f, b, c) : (b && !b(f)) || c.push(f)
    }
  }
  return c
}
