import { IToken } from 'chevrotain'
import { FormulaParser } from './parser'

/**
 * 预编译的公式执行计划
 * 通过预先解析公式，可以在批量执行时避免重复的词法和语法分析
 */
export class CompiledFormula {
  private tokens: IToken[]
  private parser: FormulaParser
  private customFunction: Record<string, Function>

  constructor(
    tokens: IToken[],
    customFunction: Record<string, Function> = {}
  ) {
    this.tokens = tokens
    this.customFunction = customFunction
    // 创建一个专用的 parser 实例用于执行
    this.parser = new FormulaParser({}, customFunction)
  }

  /**
   * 使用指定数据执行已编译的公式
   * @param data - 执行上下文数据
   * @returns 计算结果
   */
  exec(data: Record<string | number | symbol, any>): any {
    this.parser.changeCustomData(data)
    this.parser.input = this.tokens
    return this.parser.expression()
  }

  /**
   * 批量执行公式
   * @param dataList - 数据数组
   * @returns 结果数组
   */
  batchExec(dataList: Array<Record<string | number | symbol, any>>): any[] {
    return dataList.map(data => this.exec(data))
  }

  /**
   * 并行批量执行（适用于独立的计算任务）
   * @param dataList - 数据数组
   * @returns Promise<结果数组>
   */
  async batchExecAsync(
    dataList: Array<Record<string | number | symbol, any>>
  ): Promise<any[]> {
    // 将数据分片，使用 Promise 并行执行
    const chunkSize = 100 // 每批处理100条
    const results: any[] = []
    
    for (let i = 0; i < dataList.length; i += chunkSize) {
      const chunk = dataList.slice(i, i + chunkSize)
      const chunkResults = await Promise.all(
        chunk.map(data => Promise.resolve(this.exec(data)))
      )
      results.push(...chunkResults)
    }
    
    return results
  }

  /**
   * 获取 tokens（用于调试）
   */
  getTokens(): IToken[] {
    return this.tokens
  }
}

