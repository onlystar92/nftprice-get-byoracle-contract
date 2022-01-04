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

  describe('setWhiteList', async () => {
    it('reverted cases', async () => {
      const {
        MetaVerseNFTOracle,
        accounts: [admin, team, stephon],
      } = vars;

      await expect(
        MetaVerseNFTOracle.connect(stephon.signer).setWhiteList([stephon.address], [true])
      ).to.be.revertedWith('Ownable: caller is not the owner');

      await expect(MetaVerseNFTOracle.setWhiteList([], [true])).to.be.revertedWith(
        'setWhiteList:INVALID_DATA'
      );

      await expect(MetaVerseNFTOracle.setWhiteList([stephon.address], [])).to.be.revertedWith(
        'setWhiteList:INVALID_DATA'
      );

      await expect(
        MetaVerseNFTOracle.setWhiteList([constants.AddressZero], [true])
      ).to.be.revertedWith('setWhiteList:INVALID_ADDRESS');
    });

    it('success cases', async () => {
      const {
        MetaVerseNFTOracle,
        accounts: [admin, stephon],
      } = vars;

      expect(await MetaVerseNFTOracle.isWhiteListed(stephon.address)).to.false;

      await MetaVerseNFTOracle.setWhiteList([stephon.address], [true]);

      expect(await MetaVerseNFTOracle.isWhiteListed(stephon.address)).to.true;
    });
  });

  describe('setUpdaters', async () => {
    it('reverted cases', async () => {
      const {
        MetaVerseNFTOracle,
        accounts: [admin, team, stephon],
      } = vars;

      await expect(
        MetaVerseNFTOracle.connect(stephon.signer).setUpdaters([stephon.address], [true])
      ).to.be.revertedWith('Ownable: caller is not the owner');

      await expect(MetaVerseNFTOracle.setUpdaters([], [true])).to.be.revertedWith(
        'setUpdaters:INVALID_DATA'
      );

      await expect(MetaVerseNFTOracle.setUpdaters([stephon.address], [])).to.be.revertedWith(
        'setUpdaters:INVALID_DATA'
      );

      await expect(
        MetaVerseNFTOracle.setUpdaters([constants.AddressZero], [true])
      ).to.be.revertedWith('setUpdaters:INVALID_UPDATER');
    });

    it('success cases', async () => {
      const {
        MetaVerseNFTOracle,
        accounts: [admin, stephon],
      } = vars;

      expect(await MetaVerseNFTOracle.isUpdater(stephon.address)).to.false;

      await MetaVerseNFTOracle.setUpdaters([stephon.address], [true]);

      expect(await MetaVerseNFTOracle.isUpdater(stephon.address)).to.true;
    });
  });

  describe('setPrice', async () => {
    it('reverted cases', async () => {
      const {
        MetaVerseNFTOracle,
        accounts: [admin, stephon, tmpContract],
      } = vars;

      await expect(
        MetaVerseNFTOracle.connect(stephon.signer).setPrice(
          tmpContract.address,
          100000000,
          1000000000
        )
      ).to.be.revertedWith('ONLY_UPDATERS');
    });

    it('success cases', async () => {
      const {
        MetaVerseNFTOracle,
        accounts: [admin, stephon, tmpContract],
      } = vars;

      await MetaVerseNFTOracle.setUpdaters([stephon.address], [true]);
      await MetaVerseNFTOracle.connect(stephon.signer).setPrice(
        tmpContract.address,
        100000000,
        1000000000
      );

      const priceData = await MetaVerseNFTOracle.viewPrice(tmpContract.address);
      expect(priceData[0]).to.be.equal('100000000');
      expect(priceData[1]).to.be.equal('1000000000');
    });
  });
});
