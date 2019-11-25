import {NoSuchElementException} from './exceptions/NoSuchElementException';

/*
 * TS Implementation of https://docs.oracle.com/javase/8/docs/api/java/util/fp/Optional.html
 */
const haveValue = <T>(value: T | undefined): value is T => typeof value !== 'undefined';

/**
 * An implementation of https://docs.oracle.com/javase/8/docs/api/java/util/fp/Optional.html
 */
export class Optional<T> {
  private readonly value: T | undefined;

  private constructor(val?: T | Optional<T> | null) {
    if (val !== null) {
      if (val instanceof Optional) {
        this.value = val.get();
      } else {
        this.value = val;
      }
    }
  }

  /**
   * Create an empty Optional instance with type `T`
   */
  static empty<T>() {
    return new Optional<T>();
  }

  /**
   * Create a non-empty Optional instance with type `T`
   * @param value
   */
  static of<T>(value: T | Optional<T> | undefined | null): Optional<NonNullable<T>> {
    if (typeof value === 'undefined' || value === null) {
      return Optional.empty();
    }
    if (value instanceof Optional) {
      if (!value.isPresent()) {
        return Optional.empty();
      }
      const val = value.get();
      return new Optional<NonNullable<T>>(val as NonNullable<T>);
    }

    return new Optional<NonNullable<T>>(value as NonNullable<T>);
  }

  /**
   * Checks the value of the optional. If it matches the `predicate`, then a non-empty
   * Optional of the same value will be returned.
   *
   * Otherwise, an empty Optional is returned.
   *
   * @param predicate
   */
  filter(predicate: (v: T) => boolean): Optional<T> {
    if (haveValue(this.value) && predicate(this.value)) {
      return new Optional(this.value);
    }
    return Optional.empty();
  }

  /**
   * Map the value of an Optional to another value of the same or a different type.
   *
   * @param mapper
   */
  map<U>(mapper: (v: T) => U | undefined | null): Optional<U> {
    if (haveValue(this.value)) {
      const result = mapper(this.value);
      if (typeof result !== 'undefined' && result !== null) {
        return Optional.of(result);
      }
    }
    return Optional.empty();
  }

  /**
   * Map the value of an Optional to an Optional value of the same or a different type.
   *
   * This differs from `map`, such that the returned Optional is 'squashed' so that
   * the returned value is `Optional<U>` not `Optional<Optional<U>>`
   *
   * @param mapper
   */
  flatMap<U>(mapper: (val: T) => Optional<U | undefined | null>): Optional<U> {
    if (haveValue(this.value)) {
      return mapper(this.value) as Optional<U>;
    }

    return Optional.empty();
  }

  /**
   * Get the value of the optional or throw a `NoSuchElement` exception
   */
  get(): T | never {
    if (haveValue(this.value)) {
      return this.value;
    }

    throw new NoSuchElementException();
  }

  /**
   * If the Optional is non-empty, pass the value to a consuming function.
   *
   * The `consumer` should not return a value. If it does, this value is ignored.
   *
   * @param consumer
   */
  ifPresent(consumer: (val: T) => void): void {
    if (haveValue(this.value)) {
      consumer(this.value);
    }
  }

  /**
   * Check whether the Optional is empty or not.
   */
  isPresent(): boolean {
    return haveValue(this.value);
  }

  /**
   * Return the Optional's value if it is not empty, otherwise return the
   * provided value.
   *
   * @param other
   */
  orElse(other: T) {
    if (haveValue(this.value)) {
      return this.value;
    }

    return other;
  }

  /**
   * Return the Optional's value if it is not empty, otherwise return undefined.
   */
  orNothing(): T | undefined {
    if (haveValue(this.value)) {
      return this.value;
    }

    return undefined;
  }

  /**
   * Return the Optional's value if it is not empty, otherwise return null.
   */
  orNull(): T | null {
    if (haveValue(this.value)) {
      return this.value;
    }

    return null;
  }

  /**
   * Return the Optional's value if it is not empty, otherwise call `other` and
   * return that value.
   *
   * @param other
   */
  orElseGet(other: () => T) {
    if (haveValue(this.value)) {
      return this.value;
    }
    return other();
  }

  /**
   * Return the Optional's value if it is not empty, otherwise call `exceptionSupplier`
   * to generate an exception that is then thrown
   *
   * @param exceptionSupplier
   */
  orElseThrow(exceptionSupplier: () => Error): T | never {
    if (haveValue(this.value)) {
      return this.value;
    }

    throw exceptionSupplier();
  }

  /**
   * Compares this Optional value to the provided on.
   *
   * Empty Optionals are never considered equal to anything, including other
   * empty Optionals.
   *
   * @param val
   */
  equals(val: Optional<T>) {
    if (this.isPresent() && val.isPresent()) {
      return val.get() === this.get();
    }
    return false;
  }

  /**
   * Converts the internal type to another. `guard` is called to do the necessary
   * type checking. This is generally used for up- and down-casting.
   *
   * @param guard
   */
  cast<S extends T>(guard: (o: T | S) => boolean): Optional<S> {
    if (this.isPresent() && guard(this.get())) {
      return Optional.of(this.get() as S);
    }
    return Optional.empty<S>();
  }
}
