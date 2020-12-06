export const log = (val: unknown) => console.log(val);
export const logErr = (err: unknown) => console.error(err);

type MapFn = <A, B>(fn: (a: A) => B) => (as: A[]) => B[];
export const map: MapFn = (cb) => (as) => as.map(cb);

type ForEachFn = <A>(op: (a: A) => void) => (as: A[]) => void;
export const forEach: ForEachFn = (op) => (as) => as.forEach(op);

type IncludedIn = <A>(as: A[]) => (a: A) => boolean;
export const includedIn: IncludedIn = (as) => (a) => as.includes(a);

type MatchedIn = (ss: string[]) => (s: string) => boolean;
export const matchedIn: MatchedIn = (ss) => (s) =>
  ss.some((s_) => s.includes(s_));

type Not = <A>(pred: (a: A) => boolean) => (a: A) => boolean;
export const not: Not = (pred) => (a) => !pred(a);
