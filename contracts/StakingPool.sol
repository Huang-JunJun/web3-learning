// SPDX-License-Identifier: MIT
// contracts/StakingPool.sol
pragma solidity ^0.8.28;

import './MyTokenV2.sol';
import './Ownable.sol';

contract StakingPool is Ownable {
  MyTokenV2 public stakingToken;

  // 质押的token总数
  uint256 public totalStaked;
  mapping(address => uint256) public balances;

  // 累计奖励因子 截止当前为止，每 1 个质押 token 应得的历史奖励数量是多少？
  uint256 public rewardPerTokenStored;
  // 记录「用户上一次更新奖励时 rewardPerTokenStored 的值」。
  mapping(address => uint256) public userRewardPerTokenPaid;
  // 用户尚未领取的奖励金额
  mapping(address => uint256) public rewards;

  event Staked(address indexed user, uint256 amount);
  event Unstaked(address indexed user, uint256 amount);
  event RewardAdded(uint256 amount);
  event RewardPaid(address indexed user, uint256 reward);

  constructor(address tokenAddress) {
    stakingToken = MyTokenV2(tokenAddress);
  }

  function stake(uint256 amount) external {
    _updateReward(msg.sender);
    require(amount > 0, 'Cannot stake 0');
    // 转移质押的代币到合约地址
    require(stakingToken.transferFrom(msg.sender, address(this), amount), 'Transfer failed');
    // 更新用户的质押余额和总质押量
    balances[msg.sender] += amount;
    totalStaked += amount;
    emit Staked(msg.sender, amount);
  }

  function unstake(uint256 amount) external {
    _updateReward(msg.sender);
    require(amount > 0, 'Cannot unstake 0');
    require(balances[msg.sender] >= amount, 'Insufficient staked balance');
    // 更新用户的质押余额和总质押量
    balances[msg.sender] -= amount;
    totalStaked -= amount;
    // 将质押的代币转回用户
    require(stakingToken.transfer(msg.sender, amount), 'Transfer failed');
    emit Unstaked(msg.sender, amount);
  }

  function distribute(uint256 rewardAmount) external onlyOwner {
    require(rewardAmount > 0, 'Reward must be greater than 0');
    require(totalStaked > 0, 'No staked tokens');

    // 将奖励代币转入合约
    require(stakingToken.transferFrom(msg.sender, address(this), rewardAmount), 'Transfer failed');

    // 计算每个质押 token 应得的奖励增加量
    rewardPerTokenStored += (rewardAmount * 1e18) / totalStaked;

    emit RewardAdded(rewardAmount);
  }

  function harvest() external {
    _updateReward(msg.sender);
    uint256 reward = rewards[msg.sender];
    require(reward > 0, 'No rewards to harvest');
    rewards[msg.sender] = 0;
    require(stakingToken.transfer(msg.sender, reward), 'Transfer failed');
    emit RewardPaid(msg.sender, reward);
  }

  function earned(address account) public view returns (uint256) {
    uint256 paid = userRewardPerTokenPaid[account];
    uint256 delta = rewardPerTokenStored - paid;
    uint256 pending = (balances[account] * delta) / 1e18;
    return pending + rewards[account];
  }

  function _updateReward(address account) internal {
    if (account != address(0)) {
      // 更新用户的奖励信息
      rewards[account] = earned(account);
      // 记录用户的 rewardPerTokenStored
      userRewardPerTokenPaid[account] = rewardPerTokenStored;
    }
  }
}
