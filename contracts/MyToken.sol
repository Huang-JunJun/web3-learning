// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract MyToken {
  string public name;
  string public symbol;
  uint8 public decimals;
  uint256 public totalSupply;

  mapping(address => uint256) public balanceOf;
  mapping(address => mapping(address => uint256)) public allowance;

  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);

  constructor() {
    name = 'MyToken';
    symbol = 'MTK';
    decimals = 18;
    uint256 initialSupply = 1_000_000 * 10 ** uint256(decimals);
    totalSupply = initialSupply;
    balanceOf[msg.sender] = initialSupply;
    emit Transfer(address(0), msg.sender, initialSupply);
  }

  function transfer(address to, uint256 amount) external returns (bool) {
    require(balanceOf[msg.sender] >= amount, 'Insufficient balance');
    balanceOf[msg.sender] -= amount;
    balanceOf[to] += amount;
    emit Transfer(msg.sender, to, amount);
    return true;
  }

  function approve(address spender, uint256 amount) external returns (bool) {
    allowance[msg.sender][spender] = amount;
    emit Approval(msg.sender, spender, amount);
    return true;
  }

  function transferFrom(address from, address to, uint256 amount) external returns (bool) {
    uint256 currentAllowance = allowance[from][msg.sender];
    require(currentAllowance >= amount, 'Insufficient allowance');
    require(balanceOf[from] >= amount, 'Insufficient balance');
    allowance[from][msg.sender] = currentAllowance - amount;
    balanceOf[from] -= amount;
    balanceOf[to] += amount;
    emit Transfer(from, to, amount);
    return true;
  }
}
