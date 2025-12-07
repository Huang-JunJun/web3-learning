// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import '@openzeppelin/contracts/utils/ReentrancyGuard.sol';

contract SimpleVaultSafe is ReentrancyGuard {
  mapping(address => uint256) private balances;

  event Deposit(address indexed user, uint256 amount);
  event Withdraw(address indexed user, uint256 amount);

  function deposit() external payable nonReentrant {
    balances[msg.sender] += msg.value;
    emit Deposit(msg.sender, msg.value);
  }

  function withdraw(uint256 amount) external nonReentrant {
    require(balances[msg.sender] >= amount, 'Insufficient balance');

    // 1. 先更新账本（防止重入漏洞）
    balances[msg.sender] -= amount;

    // 2. 再进行 ETH 转账（使用 call 最安全）
    (bool ok, ) = msg.sender.call{value: amount}('');
    require(ok, 'Transfer failed');

    emit Withdraw(msg.sender, amount);
  }

  function balanceOf(address user) external view returns (uint256) {
    return balances[user];
  }

  function vaultBalance() external view returns (uint256) {
    return address(this).balance;
  }

  function version() external pure returns (string memory) {
    return '1.0.0';
  }
}
