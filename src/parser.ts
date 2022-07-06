import {
  EmbeddedActionsParser,
  IToken,
  ParserMethod,
  Rule,
  tokenMatcher,
  TokenType,
} from 'chevrotain';
import {
  CloseParen,
  CommaMark,
  NumberMark,
  AddSubSeatMark,
  MutDivSeatMark,
  CompareSeatMark,
  StartParen,
  TokenVocabulary,
  VariableMark,
  FunctionMark,
  ArrayMark,
  AddMark,
  MutMark,
  VariableSeatMark,
} from './lexer';
import { NumberUtils, deepGet } from './utils';
import { FunctionSummary } from './function';

export class FormulaParser extends EmbeddedActionsParser {
  private data?: Record<string | number | symbol, any>;
  constructor(private _data?: Record<string | number | symbol, any>) {
    super(TokenVocabulary);
    this.data = _data;
    this.expression();
    this.performSelfAnalysis();
  }

  public changeCustomData = (
    _data: Record<string | number | symbol, any> | undefined,
  ) => {
    this.data = _data;
  };
  /** Entry */
  public expression: ParserMethod<unknown[], unknown> = () => {
    return this.SUBRULE(this.SummaryExpression);
  };
  /** General expressions */
  private SummaryExpression: ParserMethod<unknown[], unknown> = () => {
    return this.RULE('SummaryExpression', () =>
      this.OR([
        /** Warning: The following order will lead to a change in execution priority. */
        { ALT: () => this.SUBRULE(this.FunctionOp) },
        { ALT: () => this.SUBRULE(this.NumberOpAddition) },
        { ALT: () => this.CONSUME(VariableSeatMark) },
        { ALT: () => this.SUBRULE(this.ParenthesisExpression) },
        // { ALT: () => this.SUBRULE(this.VariableOp) },
        { ALT: () => this.SUBRULE(this.ArrayOp) },
      ]),
    );
  };

  /**
   * Function expressions
   * @private
   * @memberof FormulaParser
   */
  private FunctionOp = this.RULE('FunctionOp', () => {
    console.log(333);
    const functionName = this.CONSUME(FunctionMark).image;
    const leftParams = this.SUBRULE(this.SummaryExpression);
    const params: Array<any> = [leftParams];
    this.MANY_SEP({
      SEP: (this.CONSUME1(CommaMark) as unknown) as TokenType,
      DEF: () => {
        const rightParams = this.SUBRULE1(this.SummaryExpression);
        params.push(rightParams);
      },
    });
    this.CONSUME2(CloseParen);
    console.log(
      { functionName, params },
      FunctionSummary[functionName] && FunctionSummary[functionName](params),
    );
    return (
      FunctionSummary[functionName] && FunctionSummary[functionName](params)
    );
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

  private SeatMarkOp = this.RULE('SeatMarkOp', () =>
    this.OR([
      /** Warning: The following order will lead to a change in execution priority. */
      { ALT: () => this.CONSUME(AddSubSeatMark) },
      { ALT: () => this.CONSUME(MutDivSeatMark) },
      { ALT: () => this.CONSUME(CompareSeatMark) },
    ]),
  );

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
      const op = this.CONSUME(AddSubSeatMark);
      const rightVal = this.SUBRULE3(this.NumberOpMutExpression);
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
      op = this.SUBRULE2(this.SeatMarkOp);
      // 运算符右侧的值
      rightValue = this.SUBRULE3(this.SummaryExpression);
      console.log('NumberUtils', leftValue, op, rightValue);
      leftValue = NumberUtils(leftValue, op, rightValue);
    });
    // console.log('NumberOpReturn', { leftValue, op, rightValue })
    return leftValue;
  });
  // 加减法
  private NumberOpAddition = this.RULE('NumberOpAddition', () => {
    let leftValue: unknown, op, rightValue;
    leftValue = this.SUBRULE(this.NumberOpMutExpression);
    // leftValue = parseInt(this.CONSUME(NumberMark).image, 10);
    console.log('Inner:NumberOpAddition', leftValue);
    this.MANY(() => {
      op = this.CONSUME(AddSubSeatMark);
      rightValue = this.SUBRULE1(this.NumberOpMutExpression);
      console.log('NumberOpAddition', leftValue, rightValue, op);
      if (tokenMatcher(op, AddMark)) {
        leftValue += rightValue;
      } else {
        leftValue -= rightValue;
      }
    });
    return leftValue;
  });

  // 乘除法
  private NumberOpMutExpression = this.RULE('NumberOpMultExpression', () => {
    let leftValue: unknown, op, rightValue;
    leftValue = this.SUBRULE(this.SummaryExpression);
    // leftValue = parseInt(this.CONSUME(NumberMark).image, 10);
    console.log('Inner:NumberOpMutExpression', leftValue);
    this.MANY(() => {
      op = this.CONSUME(MutDivSeatMark);
      rightValue = this.SUBRULE2(this.SummaryExpression);
      console.log('NumberOpMultExpression', leftValue, rightValue, op);
      if (tokenMatcher(op, MutMark)) {
        leftValue *= rightValue;
      } else {
        leftValue /= rightValue;
      }
    });
    // this.MANY_SEP({
    //   SEP: this.CONSUME(MutDivSeatMark)  as unknown as TokenType,
    //   DEF: () => {
    //     const op = this.LA(0)
    //     console.log(op)
    //     rightValue = this.SUBRULE2(this.SummaryExpression);
    //     console.log('NumberOpMultExpression', leftValue, rightValue, op)
    //     if (tokenMatcher(op, MutMark)) {
    //       leftValue *= rightValue
    //     } else {
    //       leftValue /= rightValue
    //     }
    //   }
    // })
    return leftValue;
  });

  /**
   * Array Expression just like variable, but we need to parse it, because image will return as string, not array
   * @private
   * @memberof FormulaParser
   */
  private ArrayOp = this.RULE('Array', () => {
    const ArrayData = this.CONSUME(ArrayMark);
    // Use ACTION can let JSON.parse be safe.detail: https://chevrotain.io/docs/guide/internals.html#assumption-1-the-parser-won-t-throw-errors-during-recording
    return this.ACTION(() => {
      return JSON.parse(ArrayData.image);
    });
  });
}
