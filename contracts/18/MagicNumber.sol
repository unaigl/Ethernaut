// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/* OBJETIVO es CREAR el BYTECODE del runtime_code con los opcodes necesarios para crear un contrato que siempre devuleva 42, indiferentemente de que funcion se llame en el */
/* @remind can be different, depends on the compiler version */
contract BytecodeContract {
    constructor(MagicNum target) {
        /* @remind The bytes value type in Solidity is a dynamically sized byte array. It is provided for storing information in binary format. 
        Since the array is dynamic, its length can grow or shrink. To reflect this, Solidity provides a wide range — from bytes1 to bytes32 . */

        bytes memory bytecode = hex"69602a60005260206000f3600052600a6016f3";
        /* de donde viene el 602a60005260206000f3 ? */
        /* lo unico que sabra hacer el contrato es devolver 42 */
        /* opCodes: 
        PUSH1 0x2a // 42 // PUSH1 uint8
        PUSH1 0 // en el byte 0 de la memorya guarda 0x2a
        MSTORE // saves 32 bytes
        PUSH1 0x20 // hasta 32 bytes
        PUSH1 0 // desde 0
        RETURN
        
        0x602a60005260206000f3 // previous opCodes in bytecode // is runtime_code
        Now we have the runtime_code, we have to get the bytecode of the creation_code
        
        PUSH10 0x602a60005260206000f3
        PUSH1 0 // desde 0
        MSTORE // saves 32 bytes
        
        lo que MSTORE va a guardar es:
        0x00000000000000000000000000000000000000000000602a60005260206000f3 // 44 zeros = 22 bytes + runtime_code (10bytes)
        por lo que tenemos que saltarnos los 1eros 22 bytes para devolver el runtime (los ultimos 10bytes):
        
        PUSH1 0x0a
        PUSH1 0x16
        RETURN
        
        FIN 0x69602a60005260206000f3600052600a6016f3 // previous opCodes in bytecode // is creation_code
        */

        /* @remind en HEX cada byte coje 2 caracteres -- 4 bit coje 1 caracter (de 0 a f) */

        address addr;

        assembly {
            /* @remind create( _value, _offset, _size) */
            /* @param _value represent eth send */
            /* @param _offset is pointer in memory where the code is store (slot in bytes (byte precisely)) -- in this case, for dynamic arrays "bytes memory" will save the length in first 32 bytes */
            /* @param _size is the bytecode length in bytes (will determine the bytecode position) */

            /* 2nd param, to bytecode pointer we add 32 bytes */
            addr := create(0, add(bytecode, 0x20), 0x13)
        }
        require(addr != address(0));

        target.setSolver(addr);
    }
}

contract MagicNum {
    address public solver;

    constructor() {}

    function setSolver(address _solver) public {
        solver = _solver;
    }

    /*
    ____________/\\\_______/\\\\\\\\\_____        
     __________/\\\\\_____/\\\///////\\\___       
      ________/\\\/\\\____\///______\//\\\__      
       ______/\\\/\/\\\______________/\\\/___     
        ____/\\\/__\/\\\___________/\\\//_____    
         __/\\\\\\\\\\\\\\\\_____/\\\//________   
          _\///////////\\\//____/\\\/___________  
           ___________\/\\\_____/\\\\\\\\\\\\\\\_ 
            ___________\///_____\///////////////__
  */
}
