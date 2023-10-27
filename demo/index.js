import { Formula } from '../src/index.ts'
// import { Formula }  from '../lib/umd/super-form-formula.umd.js'
import { createSyntaxDiagramsCode } from 'chevrotain'

const formula = new Formula({
  customFunction: {
    'UUID': function() {
      return '1273812789dsa8912387as8d6781'
    },
    'GETUSERNAME': function(users) {
      if(!users || !Array.isArray(users)) return ''
      return users.map(user=> user.name).join(',')
    },
    'TODAY': function() {
      return parseInt(new Date().getTime() / 1000, 10)
    }
  }
})

window.onload = () => {
  const inputCache = localStorage.getItem('input')
  const dataCache = localStorage.getItem('data')
  if (inputCache) {
    document.getElementById('input').value = inputCache
  }
  if (dataCache) {
    document.getElementById('data').value = dataCache
  }

  const serialziedGrammar = formula.parserInstant.getSerializedGastProductions()
  const htmlText = createSyntaxDiagramsCode(serialziedGrammar)
  const innerFrame = document.getElementById("innerFrame")
  innerFrame.contentWindow.document.open();
  innerFrame.contentWindow.document.write(htmlText);
  innerFrame.contentWindow.document.close();
  // innerFrame.src = 'data:text/html;charset=utf-8,' + encodeURI(htmlText);
  // console.log('%c [ encodeURI(htmlText) ] 🐱-35', 'font-size:13px; background:pink; color:#bf2c9f;', encodeURI(htmlText))
  console.log('%c [ htmlText ] 🐱-35', 'font-size:13px; background:pink; color:#bf2c9f;', htmlText)

  document.getElementById('exec').addEventListener('click', () => {
    const input = document.getElementById('input').value
    const data = document.getElementById('data').value
    let formatData
    try {
      if (data) formatData = JSON.parse(data)
    } catch (error) {
      return alert('data value with:' + error)
    }
    console.time()
    const res = formula.exec(input, formatData)
    console.timeEnd()
    document.getElementById('output').value = res
    console.log(res)
    // const diagrams = formula.genDiagrams()
    // console.log(diagrams)
  })
  
}

window.onTextChange = (type) => {
  const val = document.getElementById(type).value
  localStorage.setItem(type, val)
}

