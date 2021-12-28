import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

// deploy/0-deploy-MetaVerseNFTOracle.ts
const deployMetaVerseNFTOracle: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {
    deployments: { deploy },
    getNamedAccounts,
  } = hre;
  const { deployer, etherUSDAggregator } = await getNamedAccounts();

  console.log();
  await deploy('MetaVerseNFTOracle', {
    from: deployer,
    args: [etherUSDAggregator],
    log: true,
  });
};

export default deployMetaVerseNFTOracle;
deployMetaVerseNFTOracle.tags = ['MetaVerseNFTOracle'];
