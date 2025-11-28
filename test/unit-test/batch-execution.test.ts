import { Formula } from '../../src/index'

describe('批量执行模式测试', () => {
  let formula: Formula

  beforeEach(() => {
    formula = new Formula({ customFunction: {} })
  })

  describe('基础功能测试', () => {
    test('compile 方法应该返回 CompiledFormula 实例', () => {
      const compiled = formula.compile('1 + 1')
      expect(compiled).toBeDefined()
      expect(typeof compiled.exec).toBe('function')
      expect(typeof compiled.batchExec).toBe('function')
    })

    test('单次执行应该得到正确结果', () => {
      const compiled = formula.compile('{a} + {b}')
      const result = compiled.exec({ a: 1, b: 2 })
      expect(result).toBe(3)
    })

    test('多次执行相同公式不同数据应该得到不同结果', () => {
      const compiled = formula.compile('{a} + {b}')
      
      const result1 = compiled.exec({ a: 1, b: 2 })
      const result2 = compiled.exec({ a: 10, b: 20 })
      const result3 = compiled.exec({ a: 100, b: 200 })
      
      expect(result1).toBe(3)
      expect(result2).toBe(30)
      expect(result3).toBe(300)
    })

    test('批量执行应该返回正确的结果数组', () => {
      const compiled = formula.compile('{a} + {b}')
      
      const results = compiled.batchExec([
        { a: 1, b: 2 },
        { a: 10, b: 20 },
        { a: 100, b: 200 }
      ])
      
      expect(results).toEqual([3, 30, 300])
    })
  })

  describe('复杂公式测试', () => {
    test('应该支持函数调用', () => {
      const compiled = formula.compile('SUM({a}, {b}, {c})')
      
      const results = compiled.batchExec([
        { a: 1, b: 2, c: 3 },
        { a: 10, b: 20, c: 30 },
        { a: 100, b: 200, c: 300 }
      ])
      
      expect(results).toEqual([6, 60, 600])
    })

    test('应该支持嵌套函数', () => {
      const compiled = formula.compile('SUM(IF(5>4, {a}, {b}), {c})')
      
      const result1 = compiled.exec({ a: 10, b: 5, c: 2 })
      const result2 = compiled.exec({ a: 100, b: 50, c: 20 })
      
      expect(result1).toBe(12)
      expect(result2).toBe(120)
    })

    test('应该支持比较运算', () => {
      const compiled = formula.compile('{a} > {b}')
      
      const results = compiled.batchExec([
        { a: 10, b: 5 },
        { a: 5, b: 10 },
        { a: 10, b: 10 }
      ])
      
      expect(results).toEqual([true, false, false])
    })

    test('应该支持字符串操作', () => {
      const compiled = formula.compile('{a} + {b}')
      
      const results = compiled.batchExec([
        { a: 'Hello', b: 'World' },
        { a: 'Super', b: 'Formula' }
      ])
      
      expect(results).toEqual(['HelloWorld', 'SuperFormula'])
    })

    test('应该支持数组操作', () => {
      const compiled = formula.compile('SUM([{a}, {b}, {c}])')
      
      const results = compiled.batchExec([
        { a: 1, b: 2, c: 3 },
        { a: 10, b: 20, c: 30 }
      ])
      
      expect(results).toEqual([6, 60])
    })
  })

  describe('性能测试', () => {
    test('批量执行应该比多次单独执行更快', () => {
      const formulaString = 'SUM({a}, {b}, {c}) * IF({d} > 10, 2, 1)'
      const testData = Array.from({ length: 1000 }, (_, i) => ({
        a: i,
        b: i * 2,
        c: i * 3,
        d: i
      }))

      // 传统方式：每次都解析
      const startTraditional = Date.now()
      const traditionalResults = testData.map(data => 
        formula.exec(formulaString, data)
      )
      const traditionalTime = Date.now() - startTraditional

      // 批量执行方式：只解析一次
      const compiled = formula.compile(formulaString)
      const startBatch = Date.now()
      const batchResults = compiled.batchExec(testData)
      const batchTime = Date.now() - startBatch

      // 结果应该相同
      expect(batchResults).toEqual(traditionalResults)

      // 批量执行应该更快（至少快 30%）
      console.log(`传统方式耗时: ${traditionalTime}ms`)
      console.log(`批量方式耗时: ${batchTime}ms`)
      console.log(`性能提升: ${((traditionalTime - batchTime) / traditionalTime * 100).toFixed(2)}%`)
      
      // 批量执行应该明显更快
      expect(batchTime).toBeLessThan(traditionalTime)
    })

    test('异步批量执行应该正常工作', async () => {
      const compiled = formula.compile('{a} + {b}')
      
      const testData = Array.from({ length: 100 }, (_, i) => ({
        a: i,
        b: i * 2
      }))

      const results = await compiled.batchExecAsync(testData)
      
      expect(results.length).toBe(100)
      expect(results[0]).toBe(0)
      expect(results[1]).toBe(3)
      expect(results[99]).toBe(297)
    })
  })

  describe('错误处理', () => {
    test('语法错误应该抛出异常', () => {
      expect(() => {
        formula.compile('invalid formula {{')
      }).toThrow()
    })

    test('执行时数据缺失应该处理得当', () => {
      const compiled = formula.compile('{a} + {b}')
      const result = compiled.exec({ a: 1 }) // 缺少 b
      
      // 根据实际实现，这里应该返回 NaN 或 undefined
      expect(result).toBeDefined()
    })
  })

  describe('自定义函数支持', () => {
    test('应该支持自定义函数', () => {
      const customFormula = new Formula({
        customFunction: {
          DOUBLE: (x: number) => x * 2,
          ADD_TEN: (x: number) => x + 10
        }
      })

      const compiled = customFormula.compile('DOUBLE({a}) + ADD_TEN({b})')
      
      const results = compiled.batchExec([
        { a: 5, b: 5 },
        { a: 10, b: 10 }
      ])
      
      expect(results).toEqual([25, 40]) // (5*2 + 5+10), (10*2 + 10+10)
    })
  })

  describe('边界情况测试', () => {
    test('空数组批量执行应该返回空数组', () => {
      const compiled = formula.compile('{a} + {b}')
      const results = compiled.batchExec([])
      expect(results).toEqual([])
    })

    test('单个数据的批量执行应该正常工作', () => {
      const compiled = formula.compile('{a} + {b}')
      const results = compiled.batchExec([{ a: 1, b: 2 }])
      expect(results).toEqual([3])
    })

    test('大量数据批量执行应该正常工作', () => {
      const compiled = formula.compile('{a} * 2')
      const largeDataSet = Array.from({ length: 10000 }, (_, i) => ({ a: i }))
      const results = compiled.batchExec(largeDataSet)
      
      expect(results.length).toBe(10000)
      expect(results[0]).toBe(0)
      expect(results[9999]).toBe(19998)
    })
  })
})

