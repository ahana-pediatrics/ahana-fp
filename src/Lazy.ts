/**
 * Represents a value that is initialized in a lazy manner, i.e. not until it is needed
 */
export class Lazy<T> {
  private builder: () => T;
  private value: T;

  private constructor(builder: () => T) {
    this.builder = builder;
  }

  /**
   * Create a Lazy<T> by providing the function that will be called when the value
   * is first needed
   *
   * @param builder - the initializing function. Since this could be doing anything, it can have
   *                  side effects
   */
  static create<T>(builder: () => T) {
    return new Lazy<T>(builder);
  }

  /**
   * Gets the value of the lazy object, initializing it, if necessary
   */
  getValue(): T {
    if (typeof this.value === 'undefined') {
      this.value = this.builder();
    }

    return this.value;
  }

  /**
   * Creates a new Lazy<S> value. The initializer takes the value of this Lazy<T> and uses it
   * to create a Lazy<S>
   *
   * Multiple values can be chained; they won't initialize until the last one is resolved.
   *
   * @param builder - the initializing function. Since this could be doing anything, it can have
   *                  side effects
   */
  chain<S>(builder: (t: T) => S) {
    return Lazy.create(() => builder(this.getValue()));
  }
}
