pragma solidity ^0.8.28;

contract SimpleVault {
  mapping(address => uint256) balances;

  event Deposit(address indexed user, uint256 amount);
  event Withdraw(address indexed user, uint256 amount);

  function deposit() external payable {
    balances[msg.sender] += msg.value;
    emit Deposit(msg.sender, msg.value);
  }

  function withdraw(uint256 amount) external {
    require(balances[msg.sender] >= amount, 'Insufficient balance');
    balances[msg.sender] -= amount;
    payable(msg.sender).transfer(amount);
    emit Withdraw(msg.sender, amount);
  }

  function balanceOf(address account) external view returns (uint256) {
    return balances[account];
  }

  // 获取当前合约的总余额
  function vaultBalance() external view returns (uint256) {
    return address(this).balance;
  }

  function version() external pure returns (string memory) {
    return '1.0.0';
  }
}
