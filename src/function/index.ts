import { LogicFunctions } from "./logic";
import { NumberFunctions } from './number'

type FunctioType = Record<string, Function>

export const FunctionSummary: FunctioType = {
  ...LogicFunctions,
  ...NumberFunctions
}