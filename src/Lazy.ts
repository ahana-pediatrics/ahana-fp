type Builder<T, I = void> = (input: I) => T | Promise<T>;

/**
 * Represents a value that is initialized in a lazy manner, i.e. not until it is needed
 */
export class Lazy<T> {
  private builder: Builder<T>;
  private value: T | Promise<T>;

  private constructor(builder: Builder<T>) {
    this.builder = builder;
  }

  /**
   * Create a Lazy<T> by providing the function that will be called when the value
   * is first needed
   *
   * @param builder - the initializing function. Since this could be doing anything, it can have
   *                  side effects
   */
  static create<T>(builder: Builder<T>) {
    return new Lazy<T>(builder);
  }

  /**
   * Gets the value of the lazy object, initializing it, if necessary
   */
  async getValue(): Promise<T> {
    if (typeof this.value === 'undefined') {
      this.value = await this.builder();
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
  chain<S>(builder: Builder<S, T>) {
    return Lazy.create(() => this.getValue().then(builder));
  }
}
