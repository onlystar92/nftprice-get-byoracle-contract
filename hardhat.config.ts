import '@typechain/hardhat';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import 'hardhat-deploy';
import 'solidity-coverage';
import 'hardhat-contract-sizer';
import 'hardhat-gas-reporter';
import '@nomiclabs/hardhat-etherscan';

import { HardhatUserConfig } from 'hardhat/types';
import { task } from 'hardhat/config';

require('dotenv').config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
export default {
  solidity: '0.8.4',
  settings: {
    optimizer: {
      enabled: true,
      runs: 500,
    },
  },
  typechain: {
    outDir: 'types/',
    target: 'ethers-v5',
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  },
  namedAccounts: {
    deployer: {
      mainnet: '0xabB6D4a1015e291b1bc71e7e56ff2c9204665b07',
      rinkeby: '0xabB6D4a1015e291b1bc71e7e56ff2c9204665b07',
      default: 0,
    },
    etherUSDAggregator: {
      mainnet: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
      rinkeby: '0x8A753747A1Fa494EC906cE90E9f37563A8AF630e',
      default: 1,
    },
  },
  networks: {
    hardhat: {
      initialBaseFeePerGas: 0,
    },
    rinkeby: {
      url: process.env.RINKEBY_PROVIDER_URL as string,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  gasReporter: {
    currency: 'USD',
    gasPrice: 21,
  },
  etherscan: {
    apiKey: process.env.ETHERESCAN_API,
  },
} as HardhatUserConfig;
