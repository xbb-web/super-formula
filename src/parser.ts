import { EmbeddedActionsParser, IToken, ParserMethod, Rule, TokenType } from 'chevrotain';
import {
  CloseParen,
  CommaMark,
  NumberMark,
  SeatMark,
  StartParen,
  TokenVocabulary,
  VariableMark,
  FunctionMark,
  ArrayMark,
} from './lexer';
import { NumberUtils, deepGet } from './utils'
import { FunctionSummary } from './function'

export class FormulaParser extends EmbeddedActionsParser {
  private data?: Record<string | number | symbol, any>
  constructor(private _data?: Record<string | number | symbol, any> ) {
    super(TokenVocabulary);
    this.data = _data
    this.expression();
    this.performSelfAnalysis();
  }
  
  /** General expressions */
  private SummaryExpression: ParserMethod<unknown[], unknown> = () => {
    console.log(1111)
    return this.RULE('SummaryExpression', () =>
      this.OR([
        /** Warning: The following order will lead to a change in execution priority. */
        { ALT: () => this.SUBRULE(this.FunctionOp) },
        { ALT: () => this.SUBRULE(this.ParenthesisExpression) },
        { ALT: () => this.SUBRULE(this.VariableOp) },
        { ALT: () => this.SUBRULE(this.NumberOp) },
        { ALT: () => this.SUBRULE(this.ArrayOp) },
      ]),
    )
  };
  /** Entry */
  public expression: ParserMethod<unknown[], unknown> = () => {
    return this.SUBRULE(this.SummaryExpression)
  };

  /**
   * Function expressions
   * @private
   * @memberof FormulaParser
   */
  private FunctionOp = this.RULE('FunctionOp', () => {
    console.log(333)
    const functionName = this.CONSUME(FunctionMark).image;
    const leftParams = this.SUBRULE(this.SummaryExpression);
    const params: Array<any> = [leftParams];
    this.MANY_SEP({
      SEP: this.CONSUME1(CommaMark) as unknown as TokenType,
      DEF: () => {
        const rightParams = this.SUBRULE1(this.SummaryExpression);
        params.push(rightParams);
      },
    });
    this.CONSUME2(CloseParen);
    console.log({ functionName, params }, FunctionSummary[functionName] && FunctionSummary[functionName](params))
    return FunctionSummary[functionName] && FunctionSummary[functionName](params);
  });

  /**
   * ParenthesisExpression
   * @desc eg: ( var + 1 )
   * @private
   * @memberof FormulaParser
   */
  private ParenthesisExpression = this.RULE('ParenthesisExpression', () => {
    let expValue;
    this.CONSUME(StartParen);
    expValue = this.SUBRULE(this.SummaryExpression);
    this.CONSUME(CloseParen);
    return expValue;
  });

  /**
   * Variable Expression
   * @desc eg: var ( + var )
   * @private
   * @memberof FormulaParser
   */
  private VariableOp = this.RULE('VariableOp', () => {
    const valMark = this.CONSUME(VariableMark).image;
    // Operation of value extraction, eg: {self.num_26} -> 1
    let val = deepGet(this.data, valMark.substring(1, valMark.length - 1));
    this.MANY(() => {
      const op = this.CONSUME(SeatMark);
      const rightVal = this.SUBRULE2(this.SummaryExpression);
      val = NumberUtils(val, op, rightVal);
    });
    return val;
  });

  /**
   * Number Expression
   * @desc eg: number ( + number )
   * @private
   * @memberof FormulaParser
   */
  private NumberOp = this.RULE('NumberOp', () => {
    let leftValue: number, op, rightValue;
    leftValue = parseInt(this.CONSUME(NumberMark).image, 10);
    this.MANY(() => {
      // 运算符的情况
      op = this.CONSUME(SeatMark);
      // 运算符右侧的值
      rightValue = this.SUBRULE2(this.SummaryExpression);
      leftValue = NumberUtils(leftValue, op, rightValue);
    });
    // console.log('NumberOpReturn', { leftValue, op, rightValue })
    return leftValue;
  });

  /**
   * Array Expression just like variable, but we need to parse it, because image will return as string, not array
   * @private
   * @memberof FormulaParser
   */
  private ArrayOp = this.RULE('Array', () => {
    const ArrayData = this.CONSUME(ArrayMark)
    // Use ACTION can let JSON.parse be safe.detail: https://chevrotain.io/docs/guide/internals.html#assumption-1-the-parser-won-t-throw-errors-during-recording
    return this.ACTION(() => {
      return JSON.parse(ArrayData.image)
    })
  })
}
