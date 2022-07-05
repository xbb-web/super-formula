import { FormulaLexer } from './lexer'
import { FormulaParser } from './parser'

export class Formula {
  public parserInstant: FormulaParser
  constructor(_data?: Record<string | number | symbol, any>) {
    this.parserInstant = new FormulaParser(_data)
  }
  exec(string: string) {
    const result = FormulaLexer.tokenize(string)
    this.parserInstant.input = result.tokens
    console.log(result)
    const cst = this.parserInstant.expression()
    return cst
  }
}