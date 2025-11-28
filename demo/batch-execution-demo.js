/**
 * 批量执行模式演示
 * 展示如何使用预编译模式提升大批量数据处理性能
 */

const { Formula } = require('../lib/umd/super-form-formula.umd.js')

console.log('======================================')
console.log('批量执行模式演示')
console.log('======================================\n')

// 创建 Formula 实例
const formula = new Formula({ customFunction: {} })

// 场景1: 基础批量执行
console.log('📊 场景1: 基础批量计算')
console.log('公式: SUM({a}, {b}) * {factor}\n')

const compiled = formula.compile('SUM({a}, {b}) * {factor}')

// 单次执行
console.log('单次执行:')
const singleResult = compiled.exec({ a: 10, b: 20, factor: 2 })
console.log(`  { a: 10, b: 20, factor: 2 } => ${singleResult}\n`)

// 批量执行
console.log('批量执行:')
const batchData = [
  { a: 1, b: 2, factor: 2 },
  { a: 10, b: 20, factor: 2 },
  { a: 100, b: 200, factor: 2 }
]
const batchResults = compiled.batchExec(batchData)
batchData.forEach((data, index) => {
  console.log(`  ${JSON.stringify(data)} => ${batchResults[index]}`)
})
console.log()

// 场景2: 性能对比
console.log('⚡ 场景2: 性能对比测试')
console.log('处理 1000 条数据...\n')

const performanceFormula = 'SUM({sales}, {cost}) * IF({quantity} > 100, 0.9, 1)'
const testData = Array.from({ length: 1000 }, (_, i) => ({
  sales: i * 100,
  cost: i * 50,
  quantity: i
}))

// 传统模式
const startTraditional = Date.now()
const traditionalResults = testData.map(data => 
  formula.exec(performanceFormula, data)
)
const traditionalTime = Date.now() - startTraditional

// 批量模式
const compiledFormula = formula.compile(performanceFormula)
const startBatch = Date.now()
const batchResultsPerf = compiledFormula.batchExec(testData)
const batchTime = Date.now() - startBatch

console.log(`传统模式耗时: ${traditionalTime}ms`)
console.log(`批量模式耗时: ${batchTime}ms`)
console.log(`性能提升: ${((1 - batchTime / traditionalTime) * 100).toFixed(2)}%`)
console.log(`速度提升: ${(traditionalTime / batchTime).toFixed(2)}x\n`)

// 场景3: 复杂公式批量执行
console.log('🔧 场景3: 复杂公式批量执行')
console.log('公式: IF({score} >= 90, "优秀", IF({score} >= 60, "及格", "不及格"))\n')

const gradeFormula = formula.compile('IF({score} >= 90, "优秀", IF({score} >= 60, "及格", "不及格"))')
const students = [
  { name: '张三', score: 95 },
  { name: '李四', score: 75 },
  { name: '王五', score: 55 },
  { name: '赵六', score: 88 }
]

const grades = gradeFormula.batchExec(students)
students.forEach((student, index) => {
  console.log(`  ${student.name} (${student.score}分) => ${grades[index]}`)
})
console.log()

// 场景4: 自定义函数
console.log('🎨 场景4: 自定义函数批量执行\n')

const customFormula = new Formula({
  customFunction: {
    DOUBLE: (x) => x * 2,
    TAX_RATE: (amount) => amount * 0.13,
    FINAL_PRICE: (price, tax) => price + tax
  }
})

const taxFormula = customFormula.compile('FINAL_PRICE({price}, TAX_RATE({price}))')
const products = [
  { name: '商品A', price: 100 },
  { name: '商品B', price: 500 },
  { name: '商品C', price: 1000 }
]

const finalPrices = taxFormula.batchExec(products)
products.forEach((product, index) => {
  console.log(`  ${product.name} 原价: ¥${product.price} => 含税价: ¥${finalPrices[index].toFixed(2)}`)
})
console.log()

// 场景5: 实际应用场景 - 表格数据计算
console.log('📈 场景5: Excel 表格批量计算')
console.log('计算每个订单的总价: 单价 * 数量 * 折扣\n')

const orderFormula = formula.compile('{unitPrice} * {quantity} * (1 - {discount})')
const orders = [
  { orderId: 'ORD001', unitPrice: 99, quantity: 2, discount: 0.1 },
  { orderId: 'ORD002', unitPrice: 299, quantity: 1, discount: 0.15 },
  { orderId: 'ORD003', unitPrice: 59, quantity: 5, discount: 0.05 },
  { orderId: 'ORD004', unitPrice: 199, quantity: 3, discount: 0.2 }
]

const orderTotals = orderFormula.batchExec(orders)
console.log('订单号\t\t单价\t数量\t折扣\t总价')
console.log('─'.repeat(60))
orders.forEach((order, index) => {
  console.log(
    `${order.orderId}\t\t${order.unitPrice}\t${order.quantity}\t${(order.discount * 100).toFixed(0)}%\t¥${orderTotals[index].toFixed(2)}`
  )
})
console.log()

// 总结
console.log('======================================')
console.log('✅ 总结')
console.log('======================================')
console.log('批量执行模式适用场景:')
console.log('  • 表格数据批量计算（Excel、数据网格）')
console.log('  • 数据导入时的批量转换和验证')
console.log('  • 报表生成时的大量数据处理')
console.log('  • 表单批量提交前的数据计算')
console.log('\n使用建议:')
console.log('  • 当需要执行相同公式 > 10 次时使用批量模式')
console.log('  • 数据量越大，性能提升越明显')
console.log('  • 预编译后的对象可以复用，无需重复编译')
console.log('======================================\n')

