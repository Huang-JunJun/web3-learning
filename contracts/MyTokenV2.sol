// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import './Ownable.sol';

contract MyTokenV2 is Ownable {
  string public name = 'MyTokenV2';
  string public symbol = 'MTK2';
  uint8 public decimals = 18;

  uint256 private _totalSupply;
  constructor() {
    uint256 initialSupply = 1_000_000 * 10 ** uint256(decimals);
    _mint(msg.sender, initialSupply);
  }

  mapping(address => uint256) private _balances;
  mapping(address => mapping(address => uint256)) private _allowances;

  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);

  function totalSupply() public view returns (uint256) {
    return _totalSupply;
  }

  function balanceOf(address account) public view returns (uint256) {
    return _balances[account];
  }

  function allowance(address owner, address spender) public view returns (uint256) {
    return _allowances[owner][spender];
  }

  function transfer(address to, uint256 amount) external returns (bool) {
    require(balanceOf(msg.sender) >= amount, 'Insufficient balance');
    _transfer(msg.sender, to, amount);
    return true;
  }

  function approve(address spender, uint256 amount) external returns (bool) {
    _approve(msg.sender, spender, amount);
    return true;
  }

  function transferFrom(address from, address to, uint256 amount) external returns (bool) {
    uint256 currentAllowance = allowance(from, msg.sender);
    require(currentAllowance >= amount, 'Allowance exceeded');
    require(balanceOf(from) >= amount, 'Insufficient balance');
    _allowances[from][msg.sender] = currentAllowance - amount;
    _transfer(from, to, amount);
    return true;
  }

  function mint(address to, uint256 amount) external onlyOwner {
    require(to != address(0), 'Mint to zero address');
    _totalSupply += amount;
    _balances[to] += amount;
    emit Transfer(address(0), to, amount);
  }

  function burn(uint256 amount) external {
    require(balanceOf(msg.sender) >= amount, 'Insufficient balance');
    _totalSupply -= amount;
    _balances[msg.sender] -= amount;
    emit Transfer(msg.sender, address(0), amount);
  }

  function _transfer(address from, address to, uint256 amount) internal {
    require(to != address(0), 'Transfer to zero address');
    require(from != address(0), 'Transfer from zero address');
    _balances[from] -= amount;
    _balances[to] += amount;
    emit Transfer(from, to, amount);
  }

  function _approve(address owner, address spender, uint256 amount) internal {
    _allowances[owner][spender] = amount;
    emit Approval(owner, spender, amount);
  }

  function _mint(address to, uint256 amount) internal {
    require(to != address(0), 'Mint to zero address');
    _totalSupply += amount;
    _balances[to] += amount;
    emit Transfer(address(0), to, amount);
  }
}
