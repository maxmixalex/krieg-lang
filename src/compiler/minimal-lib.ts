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
interface Array<T> { readonly length: number; [index: number]: T }
interface ReadonlyArray<T> { readonly length: number; readonly [index: number]: T }
type Readonly<T> = { readonly [P in keyof T]: T[P] };
type Partial<T> = { [P in keyof T]?: T[P] };
type Record<K extends string | number | symbol, T> = { [P in K]: T };
type Pick<T, K extends keyof T> = { [P in K]: T[P] };
type Exclude<T, U> = T extends U ? never : T;
type Extract<T, U> = T extends U ? T : never;
type Omit<T, K extends string | number | symbol> = Pick<T, Exclude<keyof T, K>>;
`;
