import { Formula } from '../src'
import { createSyntaxDiagramsCode } from 'chevrotain'

const formula = new Formula()

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
  
  innerFrame.src = 'data:text/html;charset=utf-8,' + encodeURI(htmlText);
}

window.onTextChange = (type) => {
  const val = document.getElementById(type).value
  localStorage.setItem(type, val)
}

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

