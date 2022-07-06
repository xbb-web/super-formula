import { tokenMatcher, IToken } from 'chevrotain'
import { AddMark, DivMark, MutMark, SubMark, GtMark, LtMark, GteMark, LteMark, EqualMark } from '../lexer'

export const NumberUtils = (val: any, op: IToken, rhsVal: any) => {
  if (tokenMatcher(op, AddMark)) {
    val += rhsVal
  } else if (tokenMatcher(op, DivMark)) {
    val /= rhsVal
  } else if (tokenMatcher(op, MutMark)) {
    val *= rhsVal
  } else if (tokenMatcher(op, SubMark)) {
    val -= rhsVal
  } else if (tokenMatcher(op, GtMark)) {
    val = val > rhsVal
  } else if (tokenMatcher(op, LtMark)) {
    val = val < rhsVal
  } else if (tokenMatcher(op, GteMark)) {
    val = val >= rhsVal
  } else if (tokenMatcher(op, LteMark)) {
    val = val <= rhsVal
  } else if (tokenMatcher(op, EqualMark)) {
    val = val == rhsVal
  }
  return val
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
