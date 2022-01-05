import { expect } from 'chai';
import { constants } from 'ethers';

import { runTestSuite, TestVars, eventArgs } from './lib';

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
        accounts: [admin, stephon],
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

      const [_whiteList, _statusList] = await eventArgs(
        MetaVerseNFTOracle.setWhiteList([stephon.address], [true]),
        'SetWhiteList'
      );
      expect(_whiteList[0]).to.be.eq(stephon.address);
      expect(_statusList[0]).to.be.true;

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

      const [_updaters, _statusList] = await eventArgs(
        MetaVerseNFTOracle.setUpdaters([stephon.address], [true]),
        'SetUpdaters'
      );
      expect(_updaters[0]).to.be.eq(stephon.address);
      expect(_statusList[0]).to.be.true;

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
        MetaVerseNFTOracle.connect(stephon.signer).setPrice(tmpContract.address, 100000000)
      ).to.be.revertedWith('ONLY_UPDATERS');
    });

    it('success cases', async () => {
      const {
        MetaVerseNFTOracle,
        accounts: [admin, stephon, tmpContract],
      } = vars;

      await MetaVerseNFTOracle.setUpdaters([stephon.address], [true]);
      await MetaVerseNFTOracle.connect(stephon.signer).setPrice(tmpContract.address, 100000000);
    });
  });

  describe('viewPrice', async () => {
    it('reverted cases', async () => {
      const {
        MetaVerseNFTOracle,
        accounts: [admin, stephon, tmpContract],
      } = vars;

      // reverted when try with not whitelisted address
      await expect(
        MetaVerseNFTOracle.connect(stephon.signer).viewPrice(tmpContract.address)
      ).to.be.revertedWith('ONLY_WHITELIST');

      // reverted when try with invalid contract param
      await expect(MetaVerseNFTOracle.viewPrice(constants.AddressZero)).to.be.revertedWith(
        'viewPrice: INVALID_CONTRACT'
      );
    });

    it('scucess cases', async () => {
      const {
        MetaVerseNFTOracle,
        accounts: [admin, stephon, tmpContract],
      } = vars;

      // set price first
      await MetaVerseNFTOracle.setPrice(tmpContract.address, 100000000);
      await MetaVerseNFTOracle.setWhiteList([stephon.address], [true]);
      expect(await MetaVerseNFTOracle.isWhiteListed(stephon.address)).to.be.true;

      // success when try with admin
      let priceData = await MetaVerseNFTOracle.viewPrice(tmpContract.address);
      expect(priceData[0]).to.be.equal('100000000');
      expect(priceData[1]).to.be.equal('25000');

      // success when try with whitelisted address
      priceData = await MetaVerseNFTOracle.connect(stephon.signer).viewPrice(tmpContract.address);
      expect(priceData[0]).to.be.equal('100000000');
      expect(priceData[1]).to.be.equal('25000');
    });
  });
});
