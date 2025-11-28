import { FormulaLexer } from './lexer'
import { FormulaParser } from './parser'
import { CompiledFormula } from './compiled-formula'
import { createSyntaxDiagramsCode } from 'chevrotain'

export class Formula {
  public parserInstant: FormulaParser
  public customFunction: Record<string, Function>
  constructor({ data = {}, customFunction = {} }) {
    this.customFunction = customFunction
    this.parserInstant = new FormulaParser(data, customFunction)
  }

  /**
   * 执行公式（传统模式）
   * @param string - 公式字符串
   * @param _data - 数据上下文
   * @returns 计算结果
   */
  exec(string: string, _data?: Record<string | number | symbol, any>) {
    const result = FormulaLexer.tokenize(string)
    // console.log('%c [ result ] 🐱-14', 'font-size:13px; background:pink; color:#bf2c9f;', result)
    this.parserInstant.changeCustomData(_data)
    this.parserInstant.input = result.tokens
    const cst = this.parserInstant.expression()
    return cst
  }

  /**
   * 预编译公式（批量执行模式）
   * 解析一次公式，返回可重复执行的编译对象
   * @param formulaString - 公式字符串
   * @returns CompiledFormula 实例
   * @example
   * ```typescript
   * const formula = new Formula({ customFunction: {} })
   * const compiled = formula.compile('SUM({a}, {b})')
   * 
   * // 单次执行
   * const result1 = compiled.exec({ a: 1, b: 2 }) // 3
   * const result2 = compiled.exec({ a: 10, b: 20 }) // 30
   * 
   * // 批量执行
   * const results = compiled.batchExec([
   *   { a: 1, b: 2 },
   *   { a: 10, b: 20 },
   *   { a: 100, b: 200 }
   * ]) // [3, 30, 300]
   * ```
   */
  compile(formulaString: string): CompiledFormula {
    // 只进行词法分析，不执行
    const result = FormulaLexer.tokenize(formulaString)
    
    // 检查词法分析错误
    if (result.errors.length > 0) {
      throw new Error(`Formula syntax error: ${result.errors.map(e => e.message).join(', ')}`)
    }
    
    // 返回编译后的公式对象
    return new CompiledFormula(result.tokens, this.customFunction)
  }

  genDiagrams() {
    return createSyntaxDiagramsCode(this.parserInstant.getSerializedGastProductions())
  }
}

// 导出 CompiledFormula 供外部使用
export { CompiledFormula } from './compiled-formula'
