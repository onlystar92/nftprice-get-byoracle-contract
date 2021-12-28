//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/Ownable.sol';
import './interfaces/IChainlinkV3Aggregator.sol';

abstract contract NFTOracle is Ownable {
    /// @dev priceInfo of NFT
    struct PriceInfo {
        uint256 usdPrice;
        uint256 etherPrice;
        uint256 lastUpdatedBlockNumber;
    }

    /// @dev contract addrss => tokenID => PriceInfo
    mapping(address => PriceInfo) public nftPrices;

    /// @dev chainlink Price feed for ETH / USD
    IChainlinkV3Aggregator public etherPriceAggregator;

    constructor(address _etherUSDAggregator) {
        etherPriceAggregator = IChainlinkV3Aggregator(_etherUSDAggregator);
    }

    /// @return usd & ether price of NFT token
    function viewPrice(address _contract) external view returns (uint256, uint256) {
        PriceInfo memory nft = nftPrices[_contract];
        return (nft.usdPrice, nft.etherPrice);
    }

    /// return usd price of Ether
    function etherUSD() public view returns (int256 price) {
        (, price, , , ) = etherPriceAggregator.latestRoundData();
    }
}
