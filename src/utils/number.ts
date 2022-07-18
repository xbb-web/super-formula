interface FormatNumberObj {
  max: number
  sum: number
  sub: number
}

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

/**
 * @ignore
 * 将科学技术法格式化为普通数字字符串
 */
 function toNonExponential(num: number | string): string {
  num = +num
  try {
    const m: any = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/)
    return num.toFixed(Math.max(0, (m[1] || '').length - m[2]))
  } catch (e) {
    return '0'
  }
}
