// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import './MyTokenV2.sol'; // 或 IERC20 接口，看你想怎么写

contract TokenBankPool {
  // 1. 使用哪个代币MyTokenV2
  MyTokenV2 public token;
  // 2. totalAssets / totalShares
  uint256 public totalAssets; // 池子总资产
  uint256 public totalShares; // shares 总供应量
  // 3. userShares 映射
  mapping(address => uint256) public userShares;

  constructor(address tokenAddress) {
    token = MyTokenV2(tokenAddress);
  }

  function deposit(uint256 amount) external returns (uint256 shares) {
    // 1. 检查 amount > 0
    require(amount > 0, 'Zero amount');
    // 2. 调用 token.transferFrom(msg.sender, address(this), amount)
    token.transferFrom(msg.sender, address(this), amount);
    // 3. 根据公式计算 shares
    if (totalShares == 0) {
      shares = amount;
    } else {
      shares = (amount * totalShares) / totalAssets;
    }
    // 4. 更新 totalAssets / totalShares / userShares
    totalAssets += amount;
    totalShares += shares;
    userShares[msg.sender] += shares;
    // 5. 返回 shares
    return shares;
  }

  function withdraw(uint256 shares) external returns (uint256 assets) {
    // 1. 检查用户 shares 是否足够
    require(userShares[msg.sender] >= shares, 'Insufficient shares');
    // 2. 根据公式算 assets
    assets = (shares * totalAssets) / totalShares;
    // 3. 更新 totalAssets / totalShares / userShares
    totalAssets -= assets;
    totalShares -= shares;
    userShares[msg.sender] -= shares;
    // 4. 调用 token.transfer(msg.sender, assets)
    token.transfer(msg.sender, assets);
    // 5. 返回 assets
    return assets;
  }

  function previewWithdraw(address user) external view returns (uint256 assets) {
    if (totalShares == 0) {
      return 0;
    }

    uint256 shares = userShares[user];
    return (shares * totalAssets) / totalShares;
  }
}
