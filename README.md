# 🌐 Web3 学习仓库（web3-learning）

这是我的个人 **Web3 / 智能合约开发学习仓库**，用于系统性地记录从零到可以进行智能合约开发的整个过程。

目标不是简单完成教程，而是：

- 有一套 **可运行、可测试、可迭代的合约代码**
- 每天都有 **清晰的学习产出**（合约 / 测试 / 文档）
- 最终形成一个**工程级作品集**

---

## 🎯 总体目标

- 方向：以太坊生态 / Solidity 智能合约开发
- 预期能力：
  - 熟练编写 Solidity 合约（ERC20 / ERC721 / Vault / 简单 DeFi）
  - 会使用 Hardhat + TypeScript 进行开发与测试
  - 理解 EVM、状态树、存储、事件、gas 成本等核心概念
  - 能将合约部署到测试网并编写简单 DApp 前端进行交互

---

## 🧰 技术栈与工具

当前与计划使用的技术栈包括：

- **Solidity 0.8.x** — 智能合约语言
- **Hardhat 2.x** — 主力本地开发框架
- **TypeScript** — 所有脚本与测试默认使用 TS
- **ethers.js v6** — 合约交互 & 测试
- **TypeChain** — 从 ABI 生成 TS 类型
- **Hardhat Toolbox / Gas Reporter** — 测试与 gas 分析
- （后续）**Foundry** — 高效测试与 fuzzing
- （后续）**前端 DApp** — 基于 React / Vue 的简单交互页面

---

## 📂 仓库结构（当前）

> 随着学习推进，会逐渐扩展和细化。

```bash
web3-learning/
│
├── contracts/          # Solidity 合约
│   └── SimpleVault.sol # Day 1: ETH 金库示例合约
│
├── test/               # Hardhat + TypeScript 测试
│   └── SimpleVault.ts  # 对 SimpleVault 的单元测试
│
├── scripts/            #（预留）部署 / 操作脚本
│
├── hardhat.config.ts   # Hardhat 配置
├── package.json
└── README.md           # 仓库说明 & 学习日志
```

后续会根据每天学习内容，增加新的合约文件与测试文件，例如：

---

## ⚙️ 环境与运行方式

### 1. 环境要求

- Node.js ≥ 20.x（使用 nvm 管理版本）
- npm / pnpm / yarn（当前使用 npm）
- Git

### 2. 安装依赖

```bash
npm install
```

### 3. 编译合约

```bash
npx hardhat compile
```

### 4. 运行测试

```bash
npx hardhat test
```

如需清理缓存：

```bash
npx hardhat clean
```

---

## 🗺 学习路线规划（大纲）

> 这是整个仓库的「学习主线」，每天的实际进度会记录在下方「学习日志」中。

1. **基础阶段**
   - Solidity 语法与基础合约
   - payable / msg.sender / msg.value
   - 事件（event）、错误处理（require / revert）
   - 简单状态管理（mapping / struct）

2. **工具链与工程化**
   - Hardhat 项目结构
   - TypeScript 测试（fixtures、revert 测试、事件测试）
   - Gas 报告与简单优化

3. **代币与协议**
   - ERC20 标准（转账、授权、allowance）
   - ERC721 / ERC1155（基础 NFT）
   - Vault / Bank / Token 资金管理模式

4. **安全与进阶**
   - 重入攻击（Reentrancy）与防御（ReentrancyGuard）
   - 授权滥用、整数溢出等常见问题
   - 简单 DeFi 模块（利息、质押、奖励）

5. **DApp 与前端集成**
   - 使用 ethers.js 在前端调用合约
   - 钱包连接（MetaMask 等）
   - 构建简单的交互页面（存款/取款/查看余额）

6. **部署与实践**
   - 测试网部署（如 Sepolia）
   - 合约验证（Etherscan）
   - 形成完整的 Demo 项目 / 作品集

---

## 📒 学习日志 / Daily Progress

> 采用「总 README + 每日补充」的形式，方便回顾学习轨迹。
> 每天至少有一个可以提交到 GitHub 的实际成果（合约 / 测试 / 文档）。

---

### ✅ Day 1 — SimpleVault 金库合约 + 单元测试

**目标：**

- 搭建 Hardhat + TypeScript 环境
- 编写第一个可用的 Solidity 合约
- 完成一套基础但工程化的单元测试

**主要产出：**

1. **SimpleVault.sol**

   功能：
   - 接收 ETH 存款（`deposit()`）
   - 允许余额充足的用户提款（`withdraw(uint256 amount)`）
   - 维护每个地址在金库中的内部余额：`mapping(address => uint256) balances;`
   - 查询接口：
     - `balanceOf(address)`：查询用户内部余额
     - `vaultBalance()`：查询合约地址持有的 ETH 总额
   - 事件：
     - `Deposit(address indexed user, uint256 amount)`
     - `Withdraw(address indexed user, uint256 amount)`

2. **SimpleVault.ts 测试**

   测试内容包括：
   - 存款后，`balanceOf(user)` 内部余额应等于存入金额
   - 存款后，合约地址的 ETH 余额应增加
   - 提款前先存款，余额充足时可以成功提现，内部余额更新正确
   - 余额不足时提现应 `revert`，错误信息为 `"Insufficient balance"`

   测试技术要点：
   - 使用 `loadFixture(deployVaultFixture)` 复用部署逻辑
   - 使用 `ethers.getSigners()` 拿测试账户
   - 使用 `ethers.parseEther()` 处理金额
   - 使用 `expect(...).to.be.revertedWith(...)` 断言错误
   - 初步理解 TypeChain 与合约类型之间的关系

### ✅ Day 2 — ABI / TypeChain 链路 & version() 实践

- 在 SimpleVault 合约中新增 `version()` 函数，返回当前合约版本字符串 `"1.0.0"`。
- 通过 `npx hardhat compile` 重新生成 ABI 与 TypeChain 类型文件。
- 在 `typechain-types/contracts/SimpleVault.ts` 中看到新增的 `version()` 类型定义。
- 在 `test/SimpleVault.ts` 中新增针对 `version()` 的单元测试，验证返回值为 `"1.0.0"`。
- 更直观地理解了：**Solidity 源码 → ABI → TypeChain 类型 → 测试代码调用** 这一整条链路。

- Solidity 源码无法直接调用，必须先编译生成 ABI
- TypeChain 根据 ABI 生成 TypeScript 类型
- ethers.js 基于 ABI + 地址生成合约实例
- 改合约 → ABI 变 → 必须重新 compile 才能让 TS 同步
- as any 会绕过类型检查，工程里禁止使用

- EVM 是状态机，所有数据存储在世界状态树
- mapping 使用 keccak256 计算 slot，不是数组
- ETH 余额存储在账户状态，而不是变量或 mapping
- 交易通过去中心化 P2P 网络广播到全网

### ✅ Day 3 — 自定义 ERC20 代币 MyToken + 授权模型

- 在 contracts 目录中新增 `MyToken.sol`，实现一个最简版 ERC20 代币，包含：
  - 基本元信息：`name`、`symbol`、`decimals`、`totalSupply`。
  - 余额映射：`mapping(address => uint256) public balanceOf;`。
  - 授权映射：`mapping(address => mapping(address => uint256)) public allowance;`。
  - 构造函数中一次性铸造初始总量，并分配给部署者地址。
  - 实现 `transfer`、`approve`、`transferFrom` 三个核心函数，并在转账和授权时触发 `Transfer` 与 `Approval` 事件。
- 在 test 目录中新增 `MyToken.ts`，使用 Hardhat + TypeScript 为 MyToken 编写单元测试，主要场景包括：
  - 部署后，`totalSupply` 全部在 owner 地址上。
  - owner 调用 `transfer` 向 user1 转账后，双方余额更新正确。
  - user1 在余额不足的情况下调用 `transfer` 会 `revert`，错误信息为 `"Insufficient balance"`。
  - owner 调用 `approve` 为 user1 授权一定额度后，`allowance(owner, user1)` 值正确。
  - user1 在授权额度内调用 `transferFrom(owner → user2)`，user2 收到代币、owner 余额减少、授权额度相应减少。
  - user1 在超出授权额度时调用 `transferFrom` 会 `revert`，错误信息为 `"Insufficient allowance"`。
- 通过 MyToken 的实现与测试，更清晰地理解：
  - ETH 转账是修改账户自身的 ETH 余额（协议层的状态）。
  - ERC20 代币转账是修改合约内部的 `balanceOf` 映射（应用层的账本）。
  - `allowance` 表示“owner 授权给 spender 的可用额度”，`transferFrom` 用的就是这部分额度。

```
### ✅ Day 4 — SimpleVaultSafe：防重入版本（金库安全升级）

本日目标：理解重入攻击（Reentrancy）风险，并将 SimpleVault 升级为安全版本 SimpleVaultSafe，掌握现代 Solidity 中安全转账与状态更新顺序的最佳实践。

#### 📌 今日完成内容

- 新增合约 `SimpleVaultSafe.sol`，并成功编译：
  - 使用 `ReentrancyGuard` 防止重入攻击。
  - 将原来的 `transfer` 替换为更安全、更推荐的 `call`。
  - 实现正确的防御顺序：**先更新状态 → 再执行转账**。
  - 使用事件 `Deposit` / `Withdraw` 记录金库操作。

- 新增测试文件 `test/SimpleVaultSafe.ts`，并全部通过，包括：
  - 存款后 `balanceOf` 正确更新。
  - 存款 + 取款后余额变为 0。
  - 超出余额提款时正确 revert（"Insufficient balance"）。

#### 🧠 今日掌握的核心概念

- `msg.sender.call{value: xxx}("")` 是现代 Solidity 推荐的安全 ETH 转账方式。
- `nonReentrant` 通过锁机制阻止函数在结束前被再次进入。
- 为什么必须先扣余额再转账，否则会留下重入攻击窗口。
- `msg.sender` 是调用者地址，由 EVM 自动填入，不需要手动传入。

#### 📁 今日新增文件

- `contracts/SimpleVaultSafe.sol`
- `test/SimpleVaultSafe.ts`

#### ✔️ 今日总结

通过 Day 4，我已经掌握了重入攻击的核心原理，并写出了一个可用于生产环境的安全金库合约。对 Solidity 安全编码有了进一步理解，也熟悉了 Hardhat 测试的基础工程流程。
```

**简单测试命令：**

```bash
npx hardhat test
```

---

## 📄 License

本仓库采用 MIT License 开源。

---

## 🙌 个人说明

本仓库由 **HuangJunJun** 维护，
用于记录从前端开发工程师转型为 **Web3 / 智能合约开发工程师** 的学习全过程。

如果你也在学习 Web3，欢迎一起交流、对比代码与思路。
