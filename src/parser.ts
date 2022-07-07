import {
  EmbeddedActionsParser,
  IToken,
  ParserMethod,
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
  GtMark,
  LtMark,
  GteMark,
  LteMark,
  EqualMark,
  UnEqualMark,
  StringMark
} from './lexer';
import { deepGet } from './utils';
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
  /** ComputedStart */
  public expression: ParserMethod<unknown[], unknown> = () => {
    return this.SUBRULE(this.SummaryEntry);
  };
  /** General Rule */
  private SummaryEntry: ParserMethod<unknown[], unknown> = () => {
    return this.RULE('SummaryEntry', () => 
      this.SUBRULE(this.CompareExpression)
    )
  };
  /**
   * Function expressions
   * @private
   * @memberof FormulaParser
   */
  private FunctionOp = this.RULE('FunctionOp', () => {
    const functionName = this.CONSUME(FunctionMark).image;
    // const firstParams = this.SUBRULE(this.SummaryEntry);
    const params: Array<any> = [];
    this.MANY_SEP({
      SEP: CommaMark,
      DEF: () => {
        const subParams = this.SUBRULE1(this.SummaryEntry);
        params.push(subParams);
      },
    });
    this.CONSUME2(CloseParen);
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
    expValue = this.SUBRULE(this.SummaryEntry);
    this.CONSUME(CloseParen);
    return expValue;
  });

  /**
   * Variable Expression
   * @desc eg: var ( + var )
   * @private
   * @memberof FormulaParser
   */
  private VariableOp = this.RULE('VariableOp', () => this.OR([
    { ALT: () => {
      const valMark = this.CONSUME(VariableMark).image;
      // Operation of value extraction, eg: {self.num_26} -> 1
      return deepGet(this.data, valMark.substring(1, valMark.length - 1));
    } },
    { ALT: () => parseInt(this.CONSUME(NumberMark).image, 10) },
    { ALT: () => {
      const string = this.CONSUME(StringMark).image;
      // Clear string's single and double quotation marks, eg: 'a' + 'a' =>  'aa'
      return string.substring(1, string.length - 1);
    } },
    { ALT: () => this.SUBRULE(this.ArrayOp) },
  ]));

  /**
   * Compare Expression, support: > | < | >= | <= | == | !=
   */
  private CompareExpression = this.RULE('CompareExpression', () => {
    // TODO: Fix the value type.
    let leftValue: number | string | boolean, op, rightValue: number | string;
    leftValue = this.SUBRULE(this.AddExpression);
    console.log(leftValue)
    this.MANY(() => {
      op = this.CONSUME(CompareSeatMark);
      rightValue = this.SUBRULE1(this.AddExpression);
      if (tokenMatcher(op, GtMark)) {
        leftValue = leftValue > rightValue;
      } else if (tokenMatcher(op, LtMark)) {
        leftValue = leftValue < rightValue;
      } else if (tokenMatcher(op, GteMark)) {
        leftValue = leftValue >= rightValue;
      } else if (tokenMatcher(op, LteMark)) {
        leftValue = leftValue <= rightValue;
      } else if (tokenMatcher(op, EqualMark)) {
        leftValue = leftValue == rightValue;
      } else if (tokenMatcher(op, UnEqualMark)) {
        leftValue = leftValue != rightValue;
      }
    });
    return leftValue;
  })
  /**
   * Add and Sub Expression, eg: number - number | number + number
   */
  private AddExpression = this.RULE('AddExpression', () => {
    let leftValue: any, op: IToken, rightValue: any;
    leftValue = this.SUBRULE(this.MutExpression);
    this.MANY(() => {
      op = this.CONSUME(AddSubSeatMark);
      rightValue = this.SUBRULE1(this.MutExpression);
      if (tokenMatcher(op, AddMark)) {
        leftValue += rightValue;
      } else {
        leftValue -= rightValue;
      }
    });
    return leftValue;
  });

  /**
   * Multiplication and Division Expression, eg: number / number | number * number
   */
  private MutExpression = this.RULE('MutExpression', () => {
    let leftValue: any, op, rightValue: any;
    leftValue = this.SUBRULE(this.AtomicExpression);
    // leftValue = parseInt(this.CONSUME(NumberMark).image, 10);
    this.MANY(() => {
      op = this.CONSUME(MutDivSeatMark);
      rightValue = this.SUBRULE2(this.AtomicExpression);
      if (tokenMatcher(op, MutMark)) {
        leftValue *= rightValue;
      } else {
        leftValue /= rightValue;
      }
    });
    return leftValue;
  });

  /**
   * Atomic Expression, eg: (1 + 2) * 1 | SUM(1+2) | var + var
   */
  private AtomicExpression = this.RULE('AtomicExpression', () => this.OR([
    // parenthesisExpression has the highest precedence and thus it
    // appears in the "lowest" leaf in the expression ParseTree.
    {ALT: () => this.SUBRULE(this.ParenthesisExpression)},
    {ALT: () => this.SUBRULE(this.VariableOp)},
    {ALT: () => this.SUBRULE(this.FunctionOp)}
  ]))

  /**
   * Array Expression just like variable, but we need to parse it, because image will return as string, not array
   * @private
   * @memberof FormulaParser
   */
  private ArrayOp = this.RULE('ArrayOp', () => {
    const ArrayData = this.CONSUME(ArrayMark);
    // Use ACTION can let JSON.parse be safe.detail: https://chevrotain.io/docs/guide/internals.html#assumption-1-the-parser-won-t-throw-errors-during-recording
    return this.ACTION(() => {
      return JSON.parse(ArrayData.image);
    });
  });
}
