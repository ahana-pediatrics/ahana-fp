import {expect} from 'chai';
import {AsyncData} from '../src/AsyncData';

describe('AsyncData', () => {
  it('represents a remotely loaded piece of data', () => {
    const data = AsyncData.loaded([1, 2, 3, 4]);
    expect(data.value()).to.deep.equal([1, 2, 3, 4]);
  });
  it('can map data', () => {
    const data = AsyncData.loaded([1, 2, 3, 4]);
    expect(data.map((x) => 2 * x).value()).to.deep.equal([2, 4, 6, 8]);
  });
  it('can filter data', () => {
    const data = AsyncData.loaded([1, 2, 3, 4]);
    expect(data.filter((x) => x % 2 === 0).value()).to.deep.equal([2, 4]);
  });
  it('can reduce data', () => {
    const data = AsyncData.loaded([1, 2, 3, 4]);
    expect(data.reduce((a, x) => a + x, 0).value()).to.deep.equal([10]);
  });
  describe('.getOptional', () => {
    it('can be converted to an empty Optional when no request has been made', async () => {
      const async = AsyncData.notAsked<{}>();
      expect(async.getOptional().isPresent()).to.be.false;
    });

    it('can be converted to an empty Optional when a request has been made', async () => {
      const async = AsyncData.loading<{}>();
      expect(async.getOptional().isPresent()).to.be.false;
    });

    it('can be converted to an Optional if there is data', async () => {
      const async = AsyncData.loaded<string>(['test']);
      expect(async.getOptional().get()).to.equal('test');
    });

    it('can be converted to an Optional array if there is data', async () => {
      const async = AsyncData.loaded<string>(['test']);
      expect(async.getAllOptional().get()).to.deep.equal(['test']);
    });

    it('can be converted to an empty Optional if there is an error', async () => {
      const async = AsyncData.errored(new Error('Oh dear'));
      expect(async.getOptional().isPresent()).to.be.false;
    });
  });

  describe('.value', () => {
    it('returns the internal value if successfully loaded', () => {
      const ad = AsyncData.loaded([1]);
      expect(ad.value()).to.deep.equal([1]);
    });
    it('throws an error if data is not loaded', () => {
      const ad = AsyncData.loading();
      expect(() => ad.value()).to.throw('Trying to access RemoteData before it is ready');
    });
    it('throws an error if data load failed', () => {
      const ad = AsyncData.errored(new Error('Testing error'));
      expect(() => ad.value()).to.throw('Testing error');
    });
  });

  describe('.singleValue', () => {
    it('returns the internal value if successfully loaded', () => {
      const ad = AsyncData.loaded([1]);
      expect(ad.singleValue()).to.equal(1);
    });
    it('throws an error if not single-valued', () => {
      const ad = AsyncData.loaded([1, 2]);
      expect(() => ad.singleValue()).to.throw('Data is not single-valued');
    });
    it('throws an error if data is not loaded', () => {
      const ad = AsyncData.loading();
      expect(() => ad.singleValue()).to.throw(
        'Trying to access RemoteData before it is ready'
      );
    });
    it('throws an error if data load failed', () => {
      const ad = AsyncData.errored(new Error('Testing error'));
      expect(() => ad.singleValue()).to.throw('Testing error');
    });
  });

  describe('.orElse', () => {
    it('returns the internal value as a single value if there is one', () => {
      expect(AsyncData.loaded([1]).orElse(3)).to.deep.equal(1);
    });
    it('returns the internal value as an array if there is one', () => {
      expect(AsyncData.loaded([1, 2]).orElse([3, 4])).to.deep.equal([1, 2]);
    });
    it('returns the default value if there is no internal value', () => {
      expect(AsyncData.loading().orElse(3)).to.deep.equal(3);
    });
    it('returns the default array if there is no internal value', () => {
      expect(AsyncData.loading().orElse([3, 4])).to.deep.equal([3, 4]);
    });
  });

  describe('.value', () => {
    it('returns the internal value if successfully loaded', () => {
      const ad = AsyncData.loaded([1]);
      expect(ad.value()).to.deep.equal([1]);
    });
    it('throws an error if data is not loaded', () => {
      const ad = AsyncData.loading();
      expect(() => ad.value()).to.throw('Trying to access RemoteData before it is ready');
    });

    it('throws an error if data load failed', () => {
      const ad = AsyncData.errored(new Error('Testing error'));
      expect(() => ad.value()).to.throw('Testing error');
    });
  });

  describe('.singleValue', () => {
    it('returns the internal value if successfully loaded', () => {
      const ad = AsyncData.loaded([1]);
      expect(ad.singleValue()).to.equal(1);
    });

    it('throws an error if not single-valued', () => {
      const ad = AsyncData.loaded([1, 2]);
      expect(() => ad.singleValue()).to.throw('Data is not single-valued');
    });
    it('throws an error if data is not loaded', () => {
      const ad = AsyncData.loading();
      expect(() => ad.singleValue()).to.throw(
        'Trying to access RemoteData before it is ready'
      );
    });

    it('throws an error if data load failed', () => {
      const ad = AsyncData.errored(new Error('Testing error'));
      expect(() => ad.singleValue()).to.throw('Testing error');
    });
  });
});
