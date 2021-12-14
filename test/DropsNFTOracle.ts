import { expect } from 'chai';

import { runTestSuite, TestVars } from './lib';

runTestSuite('DropsNFTOracle', (vars: TestVars) => {
  it('DropsNFTOracle', async () => {
    const {
      DropsNFTOracle,
      accounts: [admin, team],
    } = vars;
    expect(await DropsNFTOracle.owner()).to.equal(admin.address);
  });
});
