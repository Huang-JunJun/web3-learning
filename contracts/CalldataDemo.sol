// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CalldataDemo {
  function testCalldata(uint256[] calldata arr) external pure returns (uint256) {
    // calldata 是只读，修改会报错
    // arr[0] = 123; // <-- 会报错
    return arr.length;
  }
}
