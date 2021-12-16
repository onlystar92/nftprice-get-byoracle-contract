import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

// deploy/0-deploy-MetaVerseNFTOracle.ts
const deployMetaVerseNFTOracle: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {
    deployments: { deploy },
    getNamedAccounts,
  } = hre;
  const { deployer } = await getNamedAccounts();

  await deploy('MetaVerseNFTOracle', {
    from: deployer,
    args: [],
    log: true,
  });
};

export default deployMetaVerseNFTOracle;
deployMetaVerseNFTOracle.tags = ['MetaVerseNFTOracle'];
