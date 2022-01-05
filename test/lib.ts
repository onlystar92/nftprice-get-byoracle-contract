import { deployments, ethers, getNamedAccounts } from 'hardhat';
import { Signer, Wallet } from 'ethers';
import { assert } from 'chai';
import { ContractReceipt, ContractTransaction } from '@ethersproject/contracts';
import { Result } from '@ethersproject/abi';

import { MetaVerseNFTOracle } from '../types';
import { EthereumAddress } from '../helpers/types';
import { deployEtherUSDMockAggregator, deployMetaVerseNFTOracle } from '../helpers/contract';

export interface IAccount {
  address: EthereumAddress;
  signer: Signer;
  privateKey: string;
}

export interface TestVars {
  MetaVerseNFTOracle: MetaVerseNFTOracle;
  accounts: IAccount[];
}

const testVars: TestVars = {
  MetaVerseNFTOracle: {} as MetaVerseNFTOracle,
  accounts: {} as IAccount[],
};

const setupOtherTestEnv = async (vars: TestVars) => {
  const etherUSDMockAggregator = await deployEtherUSDMockAggregator();
  return {
    MetaVerseNFTOracle: await deployMetaVerseNFTOracle(etherUSDMockAggregator.address),
  };
};

export function runTestSuite(title: string, tests: (arg: TestVars) => void) {
  describe(title, function () {
    before(async () => {
      // we manually derive the signers address using the mnemonic
      // defined in the hardhat config
      const mnemonic = 'test test test test test test test test test test test junk';

      testVars.accounts = await Promise.all(
        (
          await ethers.getSigners()
        ).map(async (signer, index) => ({
          address: await signer.getAddress(),
          signer,
          privateKey: ethers.Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/${index}`).privateKey,
        }))
      );
      assert.equal(
        new Wallet(testVars.accounts[0].privateKey).address,
        testVars.accounts[0].address,
        'invalid mnemonic or address'
      );
    });

    beforeEach(async () => {
      const setupTest = deployments.createFixture(
        async ({ deployments, getNamedAccounts, ethers }, options) => {
          await deployments.fixture(); // ensure you start from a fresh deployments
        }
      );

      await setupTest();
      const vars = await setupOtherTestEnv(testVars);
      Object.assign(testVars, vars);
    });

    tests(testVars);
  });
}

export const eventArgs = async (
  fn: Promise<ContractTransaction>,
  event: string
): Promise<Result> => {
  const tx: ContractTransaction = await fn;
  const res: ContractReceipt = await tx.wait();
  const evt = res.events?.filter((e) => e.event === event);

  if (evt && evt.length && evt[0].args) {
    return evt[0].args;
  } else {
    return [];
  }
};
