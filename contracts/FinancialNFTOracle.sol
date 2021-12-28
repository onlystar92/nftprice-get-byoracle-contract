//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import './NFTOracle.sol';

////////////////////////////////////////////////////////////////////////////////////////////
/// @title FinancialNFTOracle
/// @author @commonlot
/// @notice oracle contract for NFT
////////////////////////////////////////////////////////////////////////////////////////////

contract FinancialNFTOracle is NFTOracle {
    constructor(address _etherUSDAggregator) NFTOracle(_etherUSDAggregator) {}
}
