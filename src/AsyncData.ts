import {Either, Optional} from '.';

export enum RemoteDataStatus {
  'NotAsked',
  'Loading',
  'Failure',
  'Success',
}

/**
 * This class represents data from a remote source that takes time to load.
 *
 * It can be single-valued or an array of values. The caller is expected to
 * know which it is
 *
 */
export class AsyncData<D, E = {}> {
  protected status: RemoteDataStatus = RemoteDataStatus.NotAsked;
  private readonly internal: Either<E, ReadonlyArray<D>>;

  private constructor({
    status,
    data,
    error,
  }: {
    status: RemoteDataStatus;
    data?: ReadonlyArray<D>;
    error?: E;
  }) {
    this.status = status;
    if (data) {
      this.internal = Either.right(data);
    } else if (error) {
      this.internal = Either.left(error);
    } else {
      this.internal = Either.right(Optional.empty());
    }
  }

  /**
   * Create an instance of this type that indicates that the request for async data
   * has not yet been made
   */
  static notAsked<ND, NE = {}>() {
    return new AsyncData<ND, NE>({
      status: RemoteDataStatus.NotAsked,
    });
  }

  /**
   * Create an instance of this type that indicates that a request is in flight but has not
   * yet completed
   */
  static loading<LD, LE = {}>() {
    return new AsyncData<LD, LE>({
      status: RemoteDataStatus.Loading,
    });
  }

  /**
   * Create an instance of this type that indicates that some data has been returned by the request.
   *
   * NB: There is nothing here that asserts that the request is complete. This factory method can
   * be called multiple times to indicate loading data in progress.
   *
   * @param data
   */
  static loaded<LD, LE = {}>(data: LD[]) {
    return new AsyncData<LD, LE>({
      status: RemoteDataStatus.Success,
      data: Object.freeze(data),
    });
  }

  /**
   * Create an instance of this type that indicates that the requests has errored.
   * @param error
   */
  static errored<ED, EE = {}>(error: EE) {
    return new AsyncData<ED, EE>({
      status: RemoteDataStatus.Failure,
      error,
    });
  }

  /**
   * Check the status of the data request
   *
   * @param status
   */
  is(status: RemoteDataStatus) {
    return this.status === status;
  }

  /**
   * Check whether data has been requested
   *
   * @param status
   */
  isAsked() {
    return this.status !== RemoteDataStatus.NotAsked;
  }

  /**
   * Check whether any data has loaded (or that the request has failed)
   */
  isLoaded() {
    return (
      this.status === RemoteDataStatus.Success || this.status === RemoteDataStatus.Failure
    );
  }

  /**
   * Checks whether the data that was loaded is empty.
   *
   * This will throw an error if the data is not loaded yet
   *
   * @throws {NoSuchElementException}
   */
  isEmpty() {
    const value = this.value();
    return value.length === 0 || (value.length === 1 && value[0] === null);
  }

  /**
   * Checks whether the data is loaded and has the provided `value`.
   *
   * This treats the `AsyncData` as single-valued
   *
   * @param value
   */
  hasValue(value: D) {
    return this.isLoaded() && this.singleValue() === value;
  }

  /**
   *
   */
  value(): ReadonlyArray<D> {
    if (this.status === RemoteDataStatus.Success) {
      return this.internal.getRight();
    }
    if (this.status === RemoteDataStatus.Failure) {
      throw this.internal.getLeft();
    }

    throw new Error('Trying to access RemoteData before it is ready');
  }

  /**
   *
   */
  singleValue(): D {
    const val = this.value();
    if (val.length !== 1) {
      throw new Error('Data is not single-valued');
    }
    return val[0];
  }

  /**
   *
   */
  getOptional(): Optional<D> {
    return this.status === RemoteDataStatus.Failure
      ? Optional.empty<D>()
      : this.status === RemoteDataStatus.Success
      ? Optional.of(this.internal.getRight()[0])
      : Optional.empty<D>();
  }

  getAllOptional(): Optional<readonly D[]> {
    return this.status === RemoteDataStatus.Failure
      ? Optional.empty<D[]>()
      : this.status === RemoteDataStatus.Success
      ? Optional.of(this.internal.getRight())
      : Optional.empty<D[]>();
  }

  /**
   * Standard response for mapping this AsyncData to a new one
   * when no data is loaded
   */
  private getNonLoadedResult<U>() {
    if (this.status === RemoteDataStatus.NotAsked) {
      return AsyncData.notAsked<U, E>();
    }

    if (this.status === RemoteDataStatus.Loading) {
      return AsyncData.loading<U, E>();
    }

    if (this.status === RemoteDataStatus.Failure) {
      return AsyncData.errored<U, E>(this.internal.getLeft());
    }
  }

  map<U>(
    callbackfn: (value: D, index: number, array?: ReadonlyArray<D>) => U
  ): AsyncData<U, E> {
    return (
      this.getNonLoadedResult() ??
      AsyncData.loaded(this.internal.getRight().map(callbackfn))
    );
  }

  mapValue<U>(
    callbackfn: (value: D, index: number, array?: ReadonlyArray<D>) => U
  ): ReadonlyArray<U> {
    return this.map(callbackfn).value();
  }

  filter(
    callbackfn: (value: D, index?: number, array?: ReadonlyArray<D>) => boolean
  ): AsyncData<D, E> {
    return (
      this.getNonLoadedResult() ??
      AsyncData.loaded(this.internal.getRight().filter(callbackfn))
    );
  }

  reduce<U>(
    callbackfn: (
      previousValue: U,
      currentValue: D,
      currentIndex: number,
      array: ReadonlyArray<D>
    ) => U,
    initialValue: U
  ): AsyncData<U, E> {
    return (
      this.getNonLoadedResult() ??
      AsyncData.loaded<U, E>([
        this.internal.getRight().reduce<U>(callbackfn, initialValue),
      ])
    );
  }

  find(
    predicate: (value: D, index: number, obj: ReadonlyArray<D>) => boolean,
    thisArg?: unknown
  ): D | undefined {
    if (this.status !== RemoteDataStatus.Success) {
      throw new Error('Trying to access RemoteData before it is ready');
    }

    return this.value().find(predicate, thisArg);
  }

  findIndex(
    predicate: (value: D, index: number, obj: ReadonlyArray<D>) => boolean,
    thisArg?: unknown
  ) {
    return this.value().findIndex(predicate, thisArg);
  }

  update(index: number, value: D) {
    const arr = this.value();
    if (index >= arr.length) {
      throw new RangeError(`Index ${index} is too large`);
    } else if (index < 0) {
      throw new RangeError(`Index ${index} is too small`);
    }

    return AsyncData.loaded(Object.assign([...arr], {[index]: value}));
  }

  concat(...items: (D | ConcatArray<D>)[]) {
    return AsyncData.loaded(this.value().concat(...items));
  }

  sort(compareFn?: (a: D, b: D) => number) {
    return this.value().slice().sort(compareFn);
  }

  get(index: number) {
    return this.value()[index];
  }

  remove(index: number) {
    return this.filter((_, i) => i !== index);
  }

  all(predicate: (value: D, index: number, array: D[]) => boolean): boolean {
    return this.every(predicate);
  }
  every(predicate: (value: D, index: number, array: D[]) => boolean): boolean {
    return this.value().every(predicate);
  }

  any(predicate: (value: D, index: number, array: D[]) => boolean): boolean {
    return this.some(predicate);
  }
  some(predicate: (value: D, index: number, array: D[]) => boolean): boolean {
    return this.value().some(predicate);
  }
}
