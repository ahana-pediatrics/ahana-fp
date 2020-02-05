import {Optional} from './Optional';

export * from './Optional';
export * from './AsyncData';
export * from './Either';
export * from './Lazy';
export * from './partial';

/**
 * Take a function that requires a value of `T` and return a version that takes `Optional<T>`
 *
 * NB: If an empty `Optional` is passed to the new function, a `NoSuchElementException`
 *     will be thrown
 *
 * @param f
 */
export const makeOptional = <T>(f: (o: T) => unknown) => (v: Optional<T>) => f(v.get());

/**
 * Take a function that requires a value of `Optional<T>` and return a version that takes `T`
 * @param f
 */
export const makeNonOptional = <T>(f: (o: Optional<T>) => unknown) => (v: T) =>
  f(Optional.of(v));
