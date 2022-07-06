import { FormulaLexer } from './lexer'
import { FormulaParser } from './parser'

export class Formula {
  public parserInstant: FormulaParser
  constructor(_data?: Record<string | number | symbol, any>) {
    this.parserInstant = new FormulaParser(_data)
  }
  exec(string: string, _data?: Record<string | number | symbol, any>) {
    const result = FormulaLexer.tokenize(string)
    console.log(result)
    this.parserInstant.changeCustomData(_data)
    this.parserInstant.input = result.tokens
    const cst = this.parserInstant.expression()
    return cst
  }
}