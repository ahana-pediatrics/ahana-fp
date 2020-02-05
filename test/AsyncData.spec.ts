import {expect} from 'chai';
import {AsyncData} from '../src/AsyncData';

describe('AsyncData', () => {
  it('represents a remotely loaded piece of data', () => {
    const data = AsyncData.loaded([1, 2, 3, 4]);
    expect(data.value()).to.deep.equal([1, 2, 3, 4]);
  });
  it('can map data', () => {
    const data = AsyncData.loaded([1, 2, 3, 4]);
    expect(data.map(x => 2 * x).value()).to.deep.equal([2, 4, 6, 8]);
  });
  it('can filter data', () => {
    const data = AsyncData.loaded([1, 2, 3, 4]);
    expect(data.filter(x => x % 2 === 0).value()).to.deep.equal([2, 4]);
  });
  it('can reduce data', () => {
    const data = AsyncData.loaded([1, 2, 3, 4]);
    expect(data.reduce((a, x) => a + x, 0).value()).to.deep.equal([10]);
  });
  describe('getOptional', () => {
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
      console.log(async.getOptional());
      expect(async.getOptional().get()).to.equal('test');
    });

    it('can be converted to an empty Optional if there is an error', async () => {
      const async = AsyncData.errored(new Error('Oh dear'));
      expect(async.getOptional().isPresent()).to.be.false;
    });
  });
});
