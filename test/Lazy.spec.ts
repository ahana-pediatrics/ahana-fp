import chai, {expect} from 'chai';
import {spy} from 'sinon';
import sinonChai from "sinon-chai";
import chaiAsPromises from 'chai-as-promised';
import {Lazy} from '../src/Lazy';

chai.use(sinonChai);
chai.use(chaiAsPromises);

describe('Lazy', () => {
  it('represents a lazy loaded piece of data', async () => {
    const data = Lazy.create(()=>1);
    await expect(data.getValue()).to.eventually.equal(1);
    await expect(data.getValue()).to.eventually.equal(1);
  });

  it('calls the intializer once',async () => {
    const intializer =  spy(()=>42);
    const data = Lazy.create(intializer);
    expect(intializer).not.to.have.been.called
    await expect(data.getValue()).to.eventually.equal(42);
    expect(intializer).to.have.been.calledOnce
    await expect(data.getValue()).to.eventually.equal(42);
    expect(intializer).to.have.been.calledOnce
  });

  it('allows chaining', async () => {
    const data = Lazy.create(()=>'aa');
    const converted = data.chain(v => parseInt(v,16));
    await expect(converted.getValue()).to.eventually.equal(170);
  })
});
