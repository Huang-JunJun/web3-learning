// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StorageDemo {
  struct User {
    uint256 score;
  }
  User public user;

  function changeStorage() external {
    // score会改变，因为公用一个user变量的存储位置
    User storage u = user;
    u.score = 100;
  }
}
