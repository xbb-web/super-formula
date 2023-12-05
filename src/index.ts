import { FormulaLexer } from './lexer'
import { FormulaParser } from './parser'
import { createSyntaxDiagramsCode } from 'chevrotain'

export class Formula {
  public parserInstant: FormulaParser
  public customFunction: Record<string, Function>
  constructor({ data = {}, customFunction = {} }) {
    this.customFunction = customFunction
    this.parserInstant = new FormulaParser(data, customFunction)
  }
  exec(string: string, _data?: Record<string | number | symbol, any>) {
    const result = FormulaLexer.tokenize(string)
    this.parserInstant.changeCustomData(_data)
    this.parserInstant.input = result.tokens
    const cst = this.parserInstant.expression()
    return cst
  }
  genDiagrams() {
    return createSyntaxDiagramsCode(this.parserInstant.getSerializedGastProductions())
  }
}
