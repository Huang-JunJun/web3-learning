// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MemoryDemo {
  struct User {
    uint256 score;
  }
  User public user;

  function changeMemory() external view {
    // score不会改变
    User memory u = user;
    u.score = 999;
  }
}
