import { deployments, ethers, waffle, getNamedAccounts } from 'hardhat';
import { Contract } from 'ethers';
import { DropsNFTOracle } from '../types';
import { ContractId } from './types';

export const deployContract = async <ContractType extends Contract>(
  contractName: string,
  args: any[],
  libraries?: {}
) => {
  const signers = await hre.ethers.getSigners();
  const contract = (await (
    await hre.ethers.getContractFactory(contractName, signers[0], {
      libraries: {
        ...libraries,
      },
    })
  ).deploy(...args)) as ContractType;

  return contract;
};

export const deployDropsNFTOracle = async () => {
  return await deployContract<DropsNFTOracle>('DropsNFTOracle', []);
};

export const getDropsNFTOracleDeployment = async (): Promise<DropsNFTOracle> => {
  return (await ethers.getContractAt(
    ContractId.DropsNFTOracle,
    (
      await deployments.get(ContractId.DropsNFTOracle)
    ).address
  )) as DropsNFTOracle;
};
