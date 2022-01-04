//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import './IChainlinkV3Aggregator.sol';

interface INFTPriceOracle {
    /// @dev priceInfo of NFT
    struct PriceInfo {
        int256 usdPrice;
        int256 etherPrice;
        uint256 lastUpdatedBlockNumber;
    }

    /// @dev chainlink Price feed for ETH / USD
    function etherPriceAggregator() external returns (IChainlinkV3Aggregator);

    /// @dev set whitelisted address that can read oracle price data
    function setWhiteList(address[] memory _whiteList, bool[] memory _statusList) external;

    /// @return usd & ether price of NFT token
    function viewPrice(address _contract) external returns (int256, int256);

    /// @return price: usd price of Ether
    function etherUSD() external returns (int256);
}
