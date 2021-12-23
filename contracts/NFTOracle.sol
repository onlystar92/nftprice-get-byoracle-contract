//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/Ownable.sol';

abstract contract NFTOracle is Ownable {
    /// @dev priceInfo of NFT
    struct PriceInfo {
        uint256 usdPrice;
        uint256 etherPrice;
        uint256 lastUpdatedBlockNumber;
    }

    /// @dev contract addrss => tokenID => PriceInfo
    mapping(address => PriceInfo) public nftPrices;

    /// @return usd & ether price of NFT token
    function viewPrice(address _contract) external view returns (uint256, uint256) {
        PriceInfo memory nft = nftPrices[_contract];
        return (nft.usdPrice, nft.etherPrice);
    }
}
