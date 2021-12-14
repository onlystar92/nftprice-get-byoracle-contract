import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

// deploy/0-deploy-DropsNFTOracle.ts
const deployDropsNFTOracle: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {
    deployments: { deploy },
    getNamedAccounts,
  } = hre;
  const { deployer } = await getNamedAccounts();

  await deploy('DropsNFTOracle', {
    from: deployer,
    args: [],
    log: true,
  });
};

export default deployDropsNFTOracle;
deployDropsNFTOracle.tags = ['DropsNFTOracle'];
