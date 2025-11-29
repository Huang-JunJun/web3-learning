// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Ownable {
  // 当前 owner 地址
  address private _owner;

  // owner 变更事件
  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

  // 构造函数：部署者默认成为 owner
  constructor() {
    _transferOwnership(msg.sender);
  }

  // 对外查询当前 owner
  function owner() public view returns (address) {
    return _owner;
  }

  // 只有 owner 才能调用的修饰器
  modifier onlyOwner() {
    require(msg.sender == _owner, 'Not owner');
    _;
  }

  // 转移所有权给新的地址
  function transferOwnership(address newOwner) external onlyOwner {
    require(newOwner != address(0), 'New owner is zero address');
    _transferOwnership(newOwner);
  }

  // 放弃所有权（owner 变为 0 地址）
  function renounceOwnership() external onlyOwner {
    _transferOwnership(address(0));
  }

  // 内部的 owner 修改逻辑，统一事件发射
  function _transferOwnership(address newOwner) internal {
    address oldOwner = _owner;
    _owner = newOwner;
    emit OwnershipTransferred(oldOwner, newOwner);
  }
}
