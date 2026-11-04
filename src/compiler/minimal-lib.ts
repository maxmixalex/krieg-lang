/** Language intrinsics only: no JavaScript standard library, DOM or Node ambient types. */
export const MINIMAL_LIB = `
interface Object {}
interface Function {}
interface CallableFunction extends Function {}
interface NewableFunction extends Function {}
interface IArguments { readonly length: number; readonly [index: number]: unknown }
interface String { readonly length: number }
interface Number {}
interface Boolean {}
interface RegExp {}
interface Array<T> extends ReadonlyArray<T> {
  length: number;
  [index: number]: T;
  push(...items: T[]): number;
  splice(start: number, deleteCount: number, ...items: T[]): T[];
}
interface ReadonlyArray<T> {
  readonly length: number;
  readonly [index: number]: T;
  includes(value: T): boolean;
  map<U>(callback: (value: T, index: number, array: readonly T[]) => U): U[];
  flatMap<U>(callback: (value: T, index: number, array: readonly T[]) => U | readonly U[]): U[];
  filter(callback: (value: T, index: number, array: readonly T[]) => boolean): T[];
  some(callback: (value: T, index: number, array: readonly T[]) => boolean): boolean;
  every(callback: (value: T, index: number, array: readonly T[]) => boolean): boolean;
}
// Type-only support for the PDX lexer declaration exported by krieg-lang/pdx.
// There is deliberately no Set constructor value in the source language.
interface Set<T> { readonly size: number; has(value: T): boolean }
type Readonly<T> = { readonly [P in keyof T]: T[P] };
type Partial<T> = { [P in keyof T]?: T[P] };
type Record<K extends string | number | symbol, T> = { [P in K]: T };
type Pick<T, K extends keyof T> = { [P in K]: T[P] };
type Exclude<T, U> = T extends U ? never : T;
type Extract<T, U> = T extends U ? T : never;
type Omit<T, K extends string | number | symbol> = Pick<T, Exclude<keyof T, K>>;
type NoInfer<T> = intrinsic;
`;
