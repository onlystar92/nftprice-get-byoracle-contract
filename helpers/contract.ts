import { deployments, ethers } from 'hardhat';
import { Contract } from 'ethers';
import { MetaVerseNFTOracle, EtherUSDMockAggregator } from '../types';
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

export const deployMetaVerseNFTOracle = async (etherUSDAggregator: string) => {
  return await deployContract<MetaVerseNFTOracle>('MetaVerseNFTOracle', [etherUSDAggregator]);
};

export const deployEtherUSDMockAggregator = async () => {
  return await deployContract<EtherUSDMockAggregator>('EtherUSDMockAggregator', []);
};

export const getMetaVerseNFTOracleDeployment = async (): Promise<MetaVerseNFTOracle> => {
  return (await ethers.getContractAt(
    ContractId.MetaVerseNFTOracle,
    (
      await deployments.get(ContractId.MetaVerseNFTOracle)
    ).address
  )) as MetaVerseNFTOracle;
};
