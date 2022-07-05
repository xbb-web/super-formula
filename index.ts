import { Formula } from './src'

const data = {
  self: {
    num_26: 1,
    num_28: 1
  }
}

const formula = new Formula(data)
const res = formula.exec('SUM({self.num_26},IF(5>4,SUM(7,8),2), [7, 8])')
console.log(res)