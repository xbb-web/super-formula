# Super-Formula🤓
> a formula achieve, work with form or excel(todo)

#### Feature💻
- [x] CST Parser
- [ ] Concurrent form object(with plugin system)
- [x] Full excel like function support
- [ ] Unit Test
- [x] Custom Function Supprot


#### Usage🛠
Install
```shell
npm i super-formula -S
```
Use It
```javascript
import { Formula } from 'super-formula'

const res = formula.exec('SUM({self.num_26},IF(5>4,SUM(7,8),2), [7, 8])')
console.log(res) // 31
```

#### Some Important Things😲
CST ability power by [chevrotain](https://chevrotain.io/).