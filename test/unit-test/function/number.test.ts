import { NumberFunctions } from '../../../src/function/number'

describe("add function", () => {
  it("1+1", () => {
      expect(NumberFunctions.ADD(1, 1)).toEqual(2);
  })
})