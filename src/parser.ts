import {
  EmbeddedActionsParser,
  IToken,
  ParserMethod,
  tokenMatcher,
  TokenType,
} from "chevrotain";
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
  // ArrayMark,
  AddMark,
  MutMark,
  GtMark,
  LtMark,
  GteMark,
  LteMark,
  EqualMark,
  UnEqualMark,
  StringMark,
  ArrayStartMark,
  ArrayEndMark,
  SubMark,
  WithMark
} from "./lexer";
import { deepGet } from "./utils";
import { FunctionSummary } from "./function";

export class FormulaParser extends EmbeddedActionsParser {
  private data?: Record<string | number | symbol, any>;
  private SummaryFunction: Record<string, Function>;
  constructor(
    private _data?: Record<string | number | symbol, any>,
    private customFunction?: Record<string, Function>
  ) {
    super(TokenVocabulary);
    this.data = _data;
    this.expression();
    this.performSelfAnalysis();
    this.SummaryFunction = { ...FunctionSummary, ...customFunction };
  }

  public changeCustomData = (
    _data: Record<string | number | symbol, any> | undefined
  ) => {
    this.data = _data;
  };
  /** ComputedStart */
  public expression: ParserMethod<unknown[], unknown> = () => {
    return this.SUBRULE(this.SummaryEntry);
  };
  /** General Rule */
  private SummaryEntry: ParserMethod<unknown[], unknown> = () => {
    return this.RULE("SummaryEntry", () =>
      this.SUBRULE(this.CompareExpression)
    );
  };
  /**
   * Function expressions
   * @private
   * @memberof FormulaParser
   */
  private FunctionOp = this.RULE("FunctionOp", () => {
    let functionName = this.CONSUME(FunctionMark).image;
    functionName = functionName.substr(0, functionName.length - 1);
    // const firstParams = this.SUBRULE(this.SummaryEntry);
    const params: Array<any> = [];
    this.MANY_SEP({
      SEP: CommaMark,
      DEF: () => {
        const subParams = this.SUBRULE(this.SummaryEntry);
        params.push(subParams);
      },
    });
    this.CONSUME1(CloseParen);
    let arrayOpNumber
    this.MANY(() => {
      this.CONSUME2(ArrayStartMark)
      arrayOpNumber = this.CONSUME(NumberMark).image;
      this.CONSUME3(ArrayEndMark)
    });
    return this.ACTION(() => {
      let functionRes = this.SummaryFunction[functionName] &&
      this.SummaryFunction[functionName](...params)
      if (Number.isSafeInteger(+arrayOpNumber)) {
        functionRes = functionRes[arrayOpNumber]
      }
      return functionRes;
    });
  });

  /**
   * ParenthesisExpression
   * @desc eg: ( var + 1 )
   * @private
   * @memberof FormulaParser
   */
  private ParenthesisExpression = this.RULE("ParenthesisExpression", () => {
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
  private VariableOp = this.RULE("VariableOp", () => {
    return this.OR([
      {
        ALT: () => {
          const string = this.CONSUME(StringMark).image;
          // Clear string's single and double quotation marks, eg: 'a' + 'a' =>  'aa'
          return string.substring(1, string.length - 1);
        },
      },
      {
        ALT: () => {
          const valMark = this.CONSUME(VariableMark).image;
          let valId = deepGet(this.data, valMark.substring(1, valMark.length - 1))
          // After varmark maybe have get array value operate like {self.subForm_1.num_1}[1],it should be regarded as a whole.
          // Try consume array mark.
          this.MANY(() => {
            this.CONSUME(ArrayStartMark)
            let number = this.SUBRULE(this.SummaryEntry) as number;
            this.CONSUME2(ArrayEndMark)
            if (Number.isSafeInteger(+number)) {
              valId = valId[number]
            }
          });
          // Operation of value extraction, eg: {self.num_26} -> 1
          return valId;
        },
      },
      { ALT: () => Number(this.CONSUME(NumberMark).image) },
      { ALT: () => this.SUBRULE(this.NegativeNum) },
      { ALT: () => this.SUBRULE(this.ArrayOp) },
    ]);
  });

  private NegativeNum = this.RULE("NegativeNumOp", () => {
    this.CONSUME(SubMark);
    const rightValue = this.OR([
      {
        ALT: () => {
          const valMark = this.CONSUME(VariableMark).image;
          // Operation of value extraction, eg: {self.num_26} -> 1
          return deepGet(this.data, valMark.substring(1, valMark.length - 1));
        },
      },
      { ALT: () => Number(this.CONSUME(NumberMark).image) },
    ]);
    return -rightValue
  })

  /**
   * Compare Expression, support: > | < | >= | <= | == | != | =
   */
  private CompareExpression = this.RULE("CompareExpression", () => {
    // TODO: Fix the value type.
    let leftValue: number | string | boolean, op, rightValue: number | string;
    leftValue = this.SUBRULE(this.AddExpression);
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
      } else if (tokenMatcher(op, WithMark)) {
        leftValue = leftValue && rightValue;
      }
    });
    return leftValue;
  });
  /**
   * Add and Sub Expression, eg: number - number | number + number
   */
  private AddExpression = this.RULE("AddExpression", () => {
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
  private MutExpression = this.RULE("MutExpression", () => {
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
  private AtomicExpression = this.RULE("AtomicExpression", () => {
    return this.OR([
      // parenthesisExpression has the highest precedence and thus it
      // appears in the "lowest" leaf in the expression ParseTree.
      { ALT: () => this.SUBRULE(this.ParenthesisExpression) },
      { ALT: () => this.SUBRULE(this.VariableOp) },
      { ALT: () => this.SUBRULE(this.FunctionOp) },
    ]);
  });

  /**
   * Array Expression just like variable, but we need to parse it, because image will return as string, not array
   * @private
   * @memberof FormulaParser
   */
  private ArrayOp = this.RULE('ArrayOp', () => {
    // const ArrayData = this.CONSUME(ArrayMark);
    this.CONSUME(ArrayStartMark)
    const arr: Array<any> = []
    this.MANY_SEP({
      SEP: CommaMark,
      DEF: () => {
        const subParams = this.SUBRULE1(this.SummaryEntry);
        arr.push(subParams);
      },
    });
    this.CONSUME2(ArrayEndMark)
    // Use ACTION can let JSON.parse be safe.detail: https://chevrotain.io/docs/guide/internals.html#assumption-1-the-parser-won-t-throw-errors-during-recording
    return this.ACTION(() => {
      console.log('%c [ arr ] 🐱-244', 'font-size:13px; background:pink; color:#bf2c9f;', arr)
      return arr;
    });
  });
}
