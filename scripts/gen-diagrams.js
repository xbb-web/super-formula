const fs = require('fs')
const path = require('path')
const { createSyntaxDiagramsCode } = require('chevrotain')
const { FormulaParser } = require('../lib/parser')


const instant = new FormulaParser()
const htmlText = createSyntaxDiagramsCode(instant.getSerializedGastProductions())

// Write the HTML file to disk
const outPath = path.resolve(__dirname, "./")
fs.writeFileSync(outPath + "/generated_diagrams.html", htmlText)