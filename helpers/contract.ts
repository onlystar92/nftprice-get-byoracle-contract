import { deployments, ethers, waffle, getNamedAccounts } from 'hardhat';
import { Contract } from 'ethers';
import { MetaVerseNFTOracle } from '../types';
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

export const deployMetaVerseNFTOracle = async () => {
  return await deployContract<MetaVerseNFTOracle>('MetaVerseNFTOracle', []);
};

export const getMetaVerseNFTOracleDeployment = async (): Promise<MetaVerseNFTOracle> => {
  return (await ethers.getContractAt(
    ContractId.MetaVerseNFTOracle,
    (
      await deployments.get(ContractId.MetaVerseNFTOracle)
    ).address
  )) as MetaVerseNFTOracle;
};
