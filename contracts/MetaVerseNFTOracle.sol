//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/Ownable.sol';
import './interfaces/IChainlinkV3Aggregator.sol';
import './interfaces/INFTPriceOracle.sol';

////////////////////////////////////////////////////////////////////////////////////////////
/// @title MetaVerseNFTOracle
/// @author @commonlot
/// @notice oracle contract for NFT
////////////////////////////////////////////////////////////////////////////////////////////

contract MetaVerseNFTOracle is Ownable, INFTPriceOracle {
    /// @dev contract addrss => PriceInfo
    mapping(address => PriceInfo) public nftPrices;

    /// @dev return true when address can read oracle price data
    mapping(address => bool) public isWhiteListed;

    /// @notice return true if address can update price
    mapping(address => bool) public isUpdater;

    /// @dev chainlink Price feed for ETH / USD
    IChainlinkV3Aggregator public override etherPriceAggregator;

    /// @dev decimal
    uint8 public constant decimals = 8;

    modifier onlyUpdater() {
        require(isUpdater[msg.sender] || msg.sender == owner(), 'ONLY_UPDATERS');
        _;
    }

    modifier onlyWhitelist() {
        require(isWhiteListed[msg.sender] || msg.sender == owner(), 'ONLY_WHITELIST');
        _;
    }

    event SetUpdaters(address[] _updaters, bool[] _statusList);
    event SetWhiteList(address[] _whiteList, bool[] _statusList);
    event SetPrice(address _contract, int256 _usdPrice, int256 _etherPrice, address _updater);

    constructor(address _etherUSDAggregator) {
        etherPriceAggregator = IChainlinkV3Aggregator(_etherUSDAggregator);
    }

    /// @dev set new updaters that can write NFT price
    /// @param _updaters address array of updaters
    /// @param _statusList status array of updaters
    function setUpdaters(address[] memory _updaters, bool[] memory _statusList) external onlyOwner {
        require(
            _updaters.length > 0 &&
                _statusList.length > 0 &&
                _statusList.length == _statusList.length,
            'setUpdaters:INVALID_DATA'
        );
        for (uint256 i = 0; i < _updaters.length; i++) {
            require(_updaters[i] != address(0), 'setUpdaters:INVALID_UPDATER');
            isUpdater[_updaters[i]] = _statusList[i];
        }

        emit SetUpdaters(_updaters, _statusList);
    }

    /// @dev set new price for the NFT
    /// @param _contract address of collection contract
    /// @param _usdPrice usd price of NFT token (decimal is 8)
    function setPrice(address _contract, int256 _usdPrice) external onlyUpdater {
        require(_contract != address(0), 'setPrice: INVALID_CONTRACT');
        require(_usdPrice > 0, 'setPrice: INVALID_USD_PRICE');

        int256 _etherPrice = (_usdPrice * 1e8) / etherUSD();

        nftPrices[_contract] = PriceInfo({
            usdPrice: _usdPrice,
            etherPrice: _etherPrice,
            lastUpdatedBlockNumber: block.number
        });

        emit SetPrice(_contract, _usdPrice, _etherPrice, msg.sender);
    }

    /// @dev set whitelisted address that can read oracle price data
    /// @param _whiteList address array
    /// @param _statusList status array
    function setWhiteList(address[] memory _whiteList, bool[] memory _statusList)
        public
        override
        onlyOwner
    {
        require(
            _whiteList.length > 0 &&
                _statusList.length > 0 &&
                _whiteList.length == _statusList.length,
            'setWhiteList:INVALID_DATA'
        );
        for (uint256 i = 0; i < _whiteList.length; i++) {
            require(_whiteList[i] != address(0), 'setWhiteList:INVALID_ADDRESS');
            isWhiteListed[_whiteList[i]] = _statusList[i];
        }

        emit SetWhiteList(_whiteList, _statusList);
    }

    /// @return usd & ether price of NFT token
    function viewPrice(address _contract)
        external
        view
        override
        onlyWhitelist
        returns (int256, int256)
    {
        require(_contract != address(0), 'viewPrice: INVALID_CONTRACT');
        PriceInfo memory nft = nftPrices[_contract];
        return (nft.usdPrice, nft.etherPrice);
    }

    /// @return price of ether in USD
    function etherUSD() public view override returns (int256 price) {
        (, price, , , ) = etherPriceAggregator.latestRoundData();
    }
}
