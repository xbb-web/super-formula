import { createToken, Lexer, TokenType } from 'chevrotain';

/**
 * SeatMark
 * @desc Summary mark of Comparators and Calculator
 */
export const AddSubSeatMark = createToken({ name: 'AddSubSeatMark', pattern: Lexer.NA });
export const MutDivSeatMark = createToken({ name: 'MutDivSeatMark', pattern: Lexer.NA });
export const CompareSeatMark = createToken({ name: 'CompareSeatMark', pattern: Lexer.NA });
export const VariableSeatMark = createToken({ name:  'VariableSeatMark', pattern: Lexer.NA })

/**
 * RideMark
 * @desc eg: a * b
 */
export const MutMark = createToken({
  name: 'MutMark',
  pattern: /\*/,
  categories: MutDivSeatMark,
});

/**
 * DivMark
 * @desc eg: a / b
 */
 export const DivMark = createToken({
  name: 'DidMark',
  pattern: /\//,
  categories: MutDivSeatMark,
});

/**
 * RideMark
 * @desc eg: a + b
 */
export const AddMark = createToken({
  name: 'AddMark',
  pattern: /\+/,
  categories: AddSubSeatMark,
});

/**
 * SubMark
 * @desc eg: a - b
 */
export const SubMark = createToken({
  name: 'SubMark',
  pattern: /\-/,
  categories: AddSubSeatMark,
});

/**
 * EqualMark
 * @desc eg: a == b
 */
export const EqualMark = createToken({
  name: 'EqualMark',
  pattern: /\=\=/,
  categories: CompareSeatMark,
});

/**
 * GtMark
 * @desc eg: a > b. Important: it registration order must take precedence over GteMark.
 */
export const GtMark = createToken({
  name: 'GtMark',
  pattern: />/,
  categories: CompareSeatMark,
});

/**
 * LtMark
 * @desc eg: a < b. Important: it registration order must take precedence over LteMark.
 */
export const LtMark = createToken({
  name: 'LtMark',
  pattern: /</,
  categories: CompareSeatMark,
});

/**
 * GteMark
 * @desc eg: a >= b.
 */
export const GteMark = createToken({
  name: 'GteMark',
  pattern: />=/,
  categories: CompareSeatMark,
});

/**
 * LteMark
 * @desc eg: a >= b.
 */
export const LteMark = createToken({
  name: 'LteMark',
  pattern: /<=/,
  categories: CompareSeatMark,
});

/**
 * CommaMark
 * @desc split for function sentence
 */
export const CommaMark = createToken({
  name: 'CommaMark',
  pattern: /,/,
});

/**
 * VariableMark
 * @desc Variable analysis, default rule is self.keyName, you can re-registration for input.
 */
export const VariableMark = createToken({
  name: 'VariableMark',
  pattern: /{.*}/,
  categories: VariableSeatMark
});

/**
 * NumberMark
 * @desc pure number for CONSUME
 */
export const NumberMark = createToken({
  name: 'NumberMark',
  pattern: /\d+/,
  categories: VariableSeatMark
});

export const StringMark = createToken({
  name: 'StringMark',
  pattern: /["|'].+["|']/,
  categories: VariableSeatMark
})

/**
 * FunctionMark
 * @desc work for Function CONSUME
 */
export const FunctionMark = createToken({
  name: 'Function',
  pattern: /[A-Za-z_]+[A-Za-z_0-9.]*\(/,
});

/**
 * StartParen
 * @desc Work for number calculate, used to improve the priority of calculation
 */
export const StartParen = createToken({
  name: 'StartParen',
  pattern: /\(/
});

/**
 * StartParen
 * @desc Work with FunctionMark and StartParen
 */
export const CloseParen = createToken({
  name: 'CloseParen',
  pattern: /\)/
});

export const ArrayMark = createToken({
  name: 'ArrayMark',
  pattern: /\[.+\]/,
})

/** 
 * WhiteSpace
 * @desc We will skipped all white space for input
 */
const WhiteSpace = createToken({
  name: 'WhiteSpace',
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

export const AllLexerToken = [
  AddSubSeatMark,
  MutDivSeatMark,
  CompareSeatMark,
  MutMark,
  SubMark,
  DivMark,
  AddMark,
  SubMark,
  GteMark,
  LteMark,
  GtMark,
  LtMark,
  EqualMark,
  WhiteSpace,
  CommaMark,
  FunctionMark,
  StartParen,
  CloseParen,
  VariableSeatMark,
  NumberMark,
  VariableMark,
  StringMark,
  ArrayMark
]

export const TokenVocabulary: Record<string, TokenType> = {}
for (let i = 0; i < AllLexerToken.length; i++) {
  const element = AllLexerToken[i];
  TokenVocabulary[element.name] = element
}

export const FormulaLexer = new Lexer(AllLexerToken)