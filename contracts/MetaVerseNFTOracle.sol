//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import './NFTOracle.sol';

////////////////////////////////////////////////////////////////////////////////////////////
/// @title MetaVerseNFTOracle
/// @author @commonlot
/// @notice oracle contract for NFT
////////////////////////////////////////////////////////////////////////////////////////////

contract MetaVerseNFTOracle is NFTOracle {
    /// @notice return true if address can update price
    mapping(address => bool) public isUpdater;

    constructor(address _etherUSDAggregator) NFTOracle(_etherUSDAggregator) {}

    modifier onlyUpdater() {
        require(isUpdater[msg.sender], 'ONLY_UPDATERS');
        _;
    }

    event SetUpdaters(address[] _updaters, bool[] _status);
    event SetPrice(address _contract, uint256 _usdPrice, uint256 _etherPrice, address _updater);

    /// @dev set new updaters that can write NFT price
    /// @param _updaters address array of updaters
    /// @param _status status array of updaters
    function setUpdaters(address[] memory _updaters, bool[] memory _status) external onlyOwner {
        require(
            _updaters.length > 0 && _updaters.length == _status.length,
            'setUpdaters:INVALID_DATA'
        );
        for (uint256 i = 0; i < _updaters.length; i++) {
            require(_updaters[i] != address(0), 'setUpdaters:INVALID_UPDATER');
            isUpdater[_updaters[i]] = _status[i];
        }

        emit SetUpdaters(_updaters, _status);
    }

    /// @dev set new price for the NFT
    /// @param _contract address of collection contract
    /// @param _usdPrice usd price of NFT token
    /// @param _etherPrice ether price of NFT token
    function setPrice(
        address _contract,
        uint256 _usdPrice,
        uint256 _etherPrice
    ) external onlyUpdater {
        require(_contract != address(0), 'setPrice: INVALID_CONTRACT');
        require(_usdPrice > 0, 'setPrice: INVALID_USD_PRICE');
        require(_etherPrice > 0, 'setPrice: INVALID_ETHER_PRICE');

        nftPrices[_contract] = PriceInfo({
            usdPrice: _usdPrice,
            etherPrice: _etherPrice,
            lastUpdatedBlockNumber: block.number
        });

        emit SetPrice(_contract, _usdPrice, _etherPrice, msg.sender);
    }
}
