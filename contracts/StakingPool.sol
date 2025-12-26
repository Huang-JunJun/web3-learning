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

  // 已入账但尚未发放/领取的奖励资金池（防止重复 distribute）
  uint256 private _rewardFund;

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

  function rewardFund() external view returns (uint256) {
    return _rewardFund;
  }

  function fundAndDistribute(uint256 amount) external onlyOwner {
    require(amount > 0, 'Reward must be greater than 0');
    require(totalStaked > 0, 'No staked tokens');

    // 1) 从 owner 拉取奖励代币到池子（需要 owner 先 approve StakingPool）
    require(stakingToken.transferFrom(msg.sender, address(this), amount), 'Transfer failed');

    // 2) 记账：增加 rewardFund，并推进 rewardPerTokenStored
    uint256 bal = stakingToken.balanceOf(address(this));
    require(bal >= totalStaked + _rewardFund, 'Bad pool balance');
    _rewardFund += amount;
    rewardPerTokenStored += (amount * 1e18) / totalStaked;

    emit RewardAdded(amount);
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

    // 奖励通过「代币转账」直接打到本合约后再分配：
    // 需要先执行 MyTokenV2.transfer(StakingPool, rewardAmount)，再调用本方法。
    uint256 bal = stakingToken.balanceOf(address(this));
    require(bal >= totalStaked + _rewardFund, 'Bad pool balance');
    require(bal >= totalStaked + _rewardFund + rewardAmount, 'Insufficient reward balance');
    _rewardFund += rewardAmount;

    // 计算每个质押 token 应得的奖励增加量
    rewardPerTokenStored += (rewardAmount * 1e18) / totalStaked;

    emit RewardAdded(rewardAmount);
  }

  function harvest() external {
    _updateReward(msg.sender);
    uint256 reward = rewards[msg.sender];
    require(reward > 0, 'No rewards to harvest');
    require(_rewardFund >= reward, 'Insufficient reward fund');
    rewards[msg.sender] = 0;
    _rewardFund -= reward;
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
