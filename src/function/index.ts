import { LogicFunctions } from './logic';
import { NumberFunctions } from './number';
import { DateFunctions } from './date';
import { TextFunctions } from './text';

type FunctioType = Record<string, Function>;

export const FunctionSummary: FunctioType = {
  ...LogicFunctions,
  ...NumberFunctions,
  ...DateFunctions,
  ...TextFunctions,
};
