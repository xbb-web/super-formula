import { LogicFunctions } from '../../../src/function/logic'

describe("LogicFunction", () => {
  it("AND", () => {
      expect(LogicFunctions.AND(1, 1)).toEqual(true);
      expect(LogicFunctions.AND(1, 0)).toEqual(false);
      expect(LogicFunctions.AND(true, true)).toEqual(true);
      expect(LogicFunctions.AND(false, true)).toEqual(false);
  })
  it("FALSE", () => {
    expect(LogicFunctions.FALSE()).toEqual(false);
  })
  it("IF", () => {
    expect(LogicFunctions.IF(1, 2, 3)).toEqual(2);
    expect(LogicFunctions.IF(60 > 60, 2, 3)).toEqual(3);
  })
  it("NOT", () => {
    expect(LogicFunctions.NOT(1)).toEqual(false);
    expect(LogicFunctions.NOT(false)).toEqual(true);
  })
  it("OR", () => {
    expect(LogicFunctions.OR(3 < 2, 2 == 2, false)).toEqual(true);
    expect(LogicFunctions.OR(3 < 2, 3 < 3, false)).toEqual(false);
  })
  it("TRUE", () => {
    expect(LogicFunctions.TRUE()).toEqual(true);
  })
  it("XOR", () => {
    expect(LogicFunctions.XOR(100>90,100>90)).toEqual(false);
    expect(LogicFunctions.XOR(100<90,100<90)).toEqual(false);
    expect(LogicFunctions.XOR(100<90,100>90)).toEqual(true);
  })
})