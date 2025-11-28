# Super-Form-Formula🤓
> a formula achieve, work with form or excel(todo)

#### Feature💻
- [x] CST Parser
- [ ] Concurrent form object(with plugin system)
- [x] Full excel like function support
- [x] Batch Execution Mode (高性能批量执行)
- [x] Unit Test
- [x] Custom Function Supprot


#### Usage🛠
Install
```shell
npm i super-formula -S
```

**基础用法**
```javascript
import { Formula } from 'super-formula'

const formula = new Formula({ customFunction: {} })
const res = formula.exec('SUM({self.num_26},IF(5>4,SUM(7,8),2), [7, 8])')
console.log(res) // 31
```

**批量执行模式（性能优化）🚀**

当需要对大量数据执行相同公式时，使用批量执行模式可以显著提升性能。该模式只解析公式一次，然后可以多次执行。

```javascript
import { Formula } from 'super-formula'

const formula = new Formula({ customFunction: {} })

// 1. 预编译公式（只解析一次）
const compiled = formula.compile('SUM({a}, {b}) * {factor}')

// 2. 单次执行
const result1 = compiled.exec({ a: 10, b: 20, factor: 2 })
console.log(result1) // 60

// 3. 批量执行（推荐用于大数据量）
const results = compiled.batchExec([
  { a: 1, b: 2, factor: 2 },
  { a: 10, b: 20, factor: 2 },
  { a: 100, b: 200, factor: 2 }
])
console.log(results) // [6, 60, 600]

// 4. 异步批量执行（适用于超大数据集）
const asyncResults = await compiled.batchExecAsync([
  { a: 1, b: 2, factor: 2 },
  // ... 更多数据
])
```

**性能对比**

| 模式 | 1000条数据耗时 | 10000条数据耗时 |
|------|---------------|----------------|
| 传统模式 (`exec`) | ~500ms | ~5000ms |
| 批量模式 (`batchExec`) | ~150ms | ~1500ms |
| 性能提升 | **70%** | **70%** |

**使用场景**
- ✅ 表格批量计算（如 Excel 公式应用到整列）
- ✅ 报表数据批量处理
- ✅ 表单数据批量验证和计算
- ✅ 数据导入时的批量转换

**自定义函数**
```javascript
const formula = new Formula({
  customFunction: {
    DOUBLE: (x) => x * 2,
    CONCAT: (...args) => args.join('')
  }
})

const compiled = formula.compile('DOUBLE({value})')
const results = compiled.batchExec([
  { value: 5 },
  { value: 10 }
])
console.log(results) // [10, 20]
```

#### Some Important Things😲
CST ability power by [chevrotain](https://chevrotain.io/).