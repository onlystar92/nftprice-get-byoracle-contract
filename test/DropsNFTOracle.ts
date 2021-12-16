import { expect } from 'chai';

import { runTestSuite, TestVars } from './lib';

runTestSuite('MetaVerseNFTOracle', (vars: TestVars) => {
  it('MetaVerseNFTOracle', async () => {
    const {
      MetaVerseNFTOracle,
      accounts: [admin, team],
    } = vars;
    expect(await MetaVerseNFTOracle.owner()).to.equal(admin.address);
  });
});
