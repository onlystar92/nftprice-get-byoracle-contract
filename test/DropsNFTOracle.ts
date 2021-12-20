import { expect } from 'chai';
import { constants } from 'ethers';

import { runTestSuite, TestVars } from './lib';

runTestSuite('MetaVerseNFTOracle', (vars: TestVars) => {
  it('MetaVerseNFTOracle', async () => {
    const {
      MetaVerseNFTOracle,
      accounts: [admin],
    } = vars;
    expect(await MetaVerseNFTOracle.owner()).to.equal(admin.address);
  });

  describe('setUpdaters', async () => {
    it('reverted cases', async () => {
      const {
        MetaVerseNFTOracle,
        accounts: [admin, team, denis],
      } = vars;

      await expect(
        MetaVerseNFTOracle.connect(denis.signer).setUpdaters([denis.address], [true])
      ).to.be.revertedWith('Ownable: caller is not the owner');

      await expect(MetaVerseNFTOracle.setUpdaters([], [true])).to.be.revertedWith(
        'setUpdaters:INVALID_DATA'
      );

      await expect(MetaVerseNFTOracle.setUpdaters([denis.address], [])).to.be.revertedWith(
        'setUpdaters:INVALID_DATA'
      );

      await expect(
        MetaVerseNFTOracle.setUpdaters([constants.AddressZero], [true])
      ).to.be.revertedWith('setUpdaters:INVALID_UPDATER');
    });

    it('success cases', async () => {
      const {
        MetaVerseNFTOracle,
        accounts: [admin, denis],
      } = vars;

      expect(await MetaVerseNFTOracle.isUpdater(denis.address)).to.false;

      await MetaVerseNFTOracle.setUpdaters([denis.address], [true]);

      expect(await MetaVerseNFTOracle.isUpdater(denis.address)).to.true;
    });
  });

  describe('setPrice', async () => {
    it('reverted cases', async () => {
      const {
        MetaVerseNFTOracle,
        accounts: [admin, denis, tmpContract],
      } = vars;

      await expect(
        MetaVerseNFTOracle.connect(denis.signer).setPrice(
          tmpContract.address,
          1,
          100000000,
          1000000000
        )
      ).to.be.revertedWith('ONLY_UPDATERS');
    });

    it('success cases', async () => {
      const {
        MetaVerseNFTOracle,
        accounts: [admin, denis, tmpContract],
      } = vars;

      await MetaVerseNFTOracle.setUpdaters([denis.address], [true]);
      await MetaVerseNFTOracle.connect(denis.signer).setPrice(
        tmpContract.address,
        1,
        100000000,
        1000000000
      );

      const priceData = await MetaVerseNFTOracle.viewPrice(tmpContract.address, 1);
      expect(priceData[0]).to.be.equal('100000000');
      expect(priceData[1]).to.be.equal('1000000000');
    });
  });
});
