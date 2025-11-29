// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract MyToken {
  string public name;
  string public symbol;
  uint8 public decimals;
  uint256 public totalSupply;
  // owner永不改变
  address public immutable owner;
  string constant ERR_PAUSED = 'Paused';
  bool public paused;

  mapping(address => uint256) public balanceOf;
  mapping(address => mapping(address => uint256)) public allowance;

  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);

  constructor() {
    name = 'MyToken';
    symbol = 'MTK';
    owner = msg.sender;
    decimals = 18;
    uint256 initialSupply = 1_000_000 * 10 ** uint256(decimals);
    totalSupply = initialSupply;
    balanceOf[msg.sender] = initialSupply;
    emit Transfer(address(0), msg.sender, initialSupply);
  }

  modifier onlyOwner() {
    require(msg.sender == owner, 'Not owner');
    _;
  }

  modifier whenNotPaused() {
    require(!paused, 'Paused');
    _;
  }

  function transfer(address to, uint256 amount) external whenNotPaused returns (bool) {
    require(balanceOf[msg.sender] >= amount, 'Insufficient balance');
    balanceOf[msg.sender] -= amount;
    balanceOf[to] += amount;
    emit Transfer(msg.sender, to, amount);
    return true;
  }

  function approve(address spender, uint256 amount) external whenNotPaused returns (bool) {
    allowance[msg.sender][spender] = amount;
    emit Approval(msg.sender, spender, amount);
    return true;
  }

  function transferFrom(
    address from,
    address to,
    uint256 amount
  ) external whenNotPaused returns (bool) {
    uint256 currentAllowance = allowance[from][msg.sender];
    require(currentAllowance >= amount, 'Insufficient allowance');
    require(balanceOf[from] >= amount, 'Insufficient balance');
    allowance[from][msg.sender] = currentAllowance - amount;
    balanceOf[from] -= amount;
    balanceOf[to] += amount;

    emit Transfer(from, to, amount);
    return true;
  }

  function pause() external onlyOwner {
    require(!paused, 'Paused');
    paused = true;
  }

  function unpause() external onlyOwner {
    require(paused, 'Not paused');
    paused = false;
  }

  function mint(address to, uint256 amount) external onlyOwner whenNotPaused {
    require(to != address(0), 'Mint to zero address');
    totalSupply += amount;
    balanceOf[to] += amount;
    emit Transfer(address(0), to, amount);
  }

  function burn(uint256 amount) external whenNotPaused {
    require(balanceOf[msg.sender] >= amount, 'Insufficient balance');
    totalSupply -= amount;
    balanceOf[msg.sender] -= amount;
    emit Transfer(msg.sender, address(0), amount);
  }
}
