import chai, {expect} from 'chai';
import {spy} from 'sinon';
import sinonChai from "sinon-chai";
import {Lazy} from '../src/Lazy';

chai.use(sinonChai);

describe('Lazy', () => {
  it('represents a lazy loaded piece of data', () => {
    const data = Lazy.create(()=>1);
    expect(data.getValue()).to.equal(1);
    expect(data.getValue()).to.equal(1);
  });

  it('calls the intializer once',() => {
    const intializer =  spy(()=>42);
    const data = Lazy.create(intializer);
    expect(intializer).not.to.have.been.called
    expect(data.getValue()).to.equal(42);
    expect(intializer).to.have.been.calledOnce
    expect(data.getValue()).to.equal(42);
    expect(intializer).to.have.been.calledOnce
  });

  it('allows chaining', () => {
    const data = Lazy.create(()=>'aa');
    const converted = data.chain(v => parseInt(v,16));
    expect(converted.getValue()).to.equal(170);
  })
});
