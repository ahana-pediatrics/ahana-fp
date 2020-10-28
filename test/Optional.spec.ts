import {expect} from 'chai';
import {Optional} from '../src/Optional';

describe('Optional', () => {
  it('represents a value which is possibly set', () => {
    const data = Optional.of(1);
    expect(data.get()).to.equal(1);
  });

  describe('#isPresent', () => {
    it('reports when a value is present in the Optional', () => {
      const data = Optional.of(1);
      expect(data.isPresent()).to.be.true;
    });
    it('reports when a value is not present in the Optional', () => {
      const data = Optional.empty();
      expect(data.isPresent()).to.be.false;
    });
  });
  describe('#orElse', () => {
    it('returns the internal value if set', () =>
      expect(Optional.of(2).orElse(3)).to.equal(2));
    it('returns the orElse value if not set', () =>
      expect(Optional.empty().orElse(3)).to.equal(3));
  });
  describe('#orNothing', () => {
    it('returns the internal value if set', () =>
      expect(Optional.of(2).orNothing()).to.equal(2));
    it('returns undefined value if not set', () =>
      expect(Optional.empty().orNothing()).to.be.undefined);
  });
  describe('#orNull', () => {
    it('returns the internal value if set', () =>
      expect(Optional.of(2).orNull()).to.equal(2));
    it('returns null value if not set', () =>
      expect(Optional.empty().orNull()).to.be.null);
  });
  describe('#equals', () => {
    it('compares two Optionals with identical values as equal', () => {
      expect(Optional.of(1).equals(Optional.of(1))).to.be.true;
    });
    it('compares two Optionals with different values as not equal', () => {
      expect(Optional.of(1).equals(Optional.of(2))).to.be.false;
    });
    it('compares two empty Optionals as not equal', () => {
      expect(Optional.empty().equals(Optional.empty())).to.be.false;
    });
    it('compares two Optionals with identical complex values as equal', () => {
      expect(
        Optional.of({id: 1, age: 3}).equals(
          Optional.of({id: 1, age: 4}),
          (a, b) => a.id === b.id
        )
      ).to.be.true;
    });
  });
  describe('#map', () => {
    it('maps one Optional to another', () => {
      expect(
        Optional.of(1)
          .map((x) => x + 3)
          .get()
      ).to.equal(4);
    });
    it('maps while squashing internal Optionals', () => {
      expect(
        Optional.of(1)
          .map((x) => Optional.of(x + 3))
          .get()
      ).to.equal(4);
    });
    it('maps empty to empty', () => {
      expect(
        Optional.empty()
          .map((x) => x)
          .isPresent()
      ).to.be.false;
    });
  });
  describe('#filter', () => {
    it('filters an Optional to the same value if the filter matches', () => {
      expect(
        Optional.of(2)
          .filter((x) => x === 2)
          .get()
      ).to.equal(2);
    });
    it('filters an Optional to empty if the filter does not match', () => {
      expect(
        Optional.of(2)
          .filter((x) => x !== 2)
          .isPresent()
      ).to.be.false;
    });
    it('filters empty to empty', () => {
      expect(
        Optional.empty()
          .filter((x) => true)
          .isPresent()
      ).to.be.false;
    });
  });
  describe('#toJSON', () => {
    it('returns undefined when JSON stringified', () => {
      const data = Optional.empty();
      expect(JSON.stringify(data)).to.be.undefined;
      expect(JSON.stringify({data})).to.equal('{}');
    });
    it('returns correct JSON  stringified', () => {
      expect(JSON.stringify(Optional.of(1))).to.equal('1');
      expect(JSON.stringify(Optional.of(true))).to.equal('true');
      expect(JSON.stringify(Optional.of('test'))).to.equal('"test"');
      expect(JSON.stringify(Optional.of(null))).to.equal(undefined);
      expect(JSON.stringify(Optional.of({}))).to.equal('{}');
    });
    it('handles nested optionals when stringified', () => {
      expect(
        JSON.stringify(
          Optional.of({
            a: Optional.empty(),
          })
        )
      ).to.equal('{}');
      expect(
        JSON.stringify(
          Optional.of({
            a: Optional.of(1),
          })
        )
      ).to.equal('{"a":1}');
    });
  });

  describe('#property', () => {
    type Opt = {
      a: number;
      b: string;
      c?: string;
    };
    const getOptional = (): Optional<Opt> =>
      Optional.of({
        a: 1,
        b: 'bee',
      });
    it('returns the enclosed property', () => {
      expect(getOptional().property('a')).to.equal(1);
      expect(getOptional().property('b')).to.equal('bee');
    });
    it('returns undefined if no default provided', () => {
      expect(Optional.empty<Opt>().property('a')).to.be.undefined;
    });
    it('returns the default value for an empty', () => {
      expect(Optional.empty<Opt>().property('a', 9)).to.equal(9);
    });
    it('returns the default value for an undefined', () => {
      expect(Optional.of(getOptional()).property('c', 'test')).to.equal('test');
      expect(Optional.of<Opt>(undefined).property('c', '')).to.equal('');
    });

    it('handles the Ahana use case', () => {});
  });
});
