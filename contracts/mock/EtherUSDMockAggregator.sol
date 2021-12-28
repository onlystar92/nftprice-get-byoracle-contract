//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/Ownable.sol';
import '../interfaces/IChainlinkV3Aggregator.sol';

contract EtherUSDMockAggregator is IChainlinkV3Aggregator {
    function decimals() external pure override returns (uint8) {
        return 8;
    }

    function latestRoundData()
        external
        pure
        override
        returns (
            uint80,
            int256 answer,
            uint256,
            uint256,
            uint80
        )
    {
        answer = 100000000 * 4000;
    }
}
