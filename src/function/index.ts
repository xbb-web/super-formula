import { LogicFunctions } from './logic';
import { NumberFunctions } from './number';
import { DateFunctions } from './date';
import { TextFunctions } from './text';

export type FunctioType = Record<string, Function>;

export const FunctionSummary: FunctioType = {
  ...LogicFunctions,
  ...NumberFunctions,
  ...DateFunctions,
  ...TextFunctions,
};

export * from './logic'
export * from './number'
export * from './date'
export * from './text'