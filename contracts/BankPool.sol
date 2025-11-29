// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract BankPool {
  uint256 public totalAssets; // 池子总资产
  uint256 public totalShares; // shares 总供应量

  mapping(address => uint256) public userShares;

  // 接收 ETH 存款
  receive() external payable {
    totalAssets += msg.value;
  }

  function deposit() external payable returns (uint256 shares) {
    require(msg.value > 0, 'Zero deposit');

    if (totalShares == 0) {
      shares = msg.value;
    } else {
      shares = (msg.value * totalShares) / totalAssets;
    }

    totalAssets += msg.value;
    totalShares += shares;
    userShares[msg.sender] += shares;

    return shares;
  }

  function withdraw(uint256 shares) external returns (uint256 assets) {
    require(userShares[msg.sender] >= shares, 'Insufficient shares');

    assets = (shares * totalAssets) / totalShares;

    userShares[msg.sender] -= shares;
    totalShares -= shares;
    totalAssets -= assets;

    payable(msg.sender).transfer(assets);
  }

  function previewWithdraw(address user) external view returns (uint256 assets) {
    uint256 shares = userShares[user];
    return (shares * totalAssets) / totalShares;
  }
}
