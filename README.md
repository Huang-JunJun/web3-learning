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

```bash
web3-learning/
│
├── contracts/
│   ├── SimpleVault.sol
│   ├── SimpleVaultSafe.sol
│   ├── MyToken.sol
│   ├── Ownable.sol
│   ├── MyTokenV2.sol
│   ├── BankPool.sol
│   ├── TokenBankPool.sol
│   ├── StakingPool.sol
│   ├── StorageDemo.sol
│   ├── MemoryDemo.sol
│   └── CalldataDemo.sol
│
├── test/
│   ├── SimpleVault.ts
│   ├── SimpleVaultSafe.ts
│   ├── MyToken.ts
│   ├── Ownable.ts
│   ├── MyTokenV2.ts
│   ├── BankPool.ts
│   ├── TokenBankPool.ts
│   ├── StakingPool.ts
│   ├── StorageDemo.ts
│   ├── MemoryDemo.ts
│   └── CalldataDemo.ts
│
├── scripts/
│   └── deploySimpleVaultSafe.ts
│
├── dapp/
│   ├── src/
│   │   ├── common/
│   │   │   └── utils.ts
│   │   ├── App.tsx
│   │   ├── layouts/
│   │   │   └── MainLayout.tsx
│   │   ├── pages/
│   │   │   ├── HomePage/
│   │   │   │   └── index.tsx
│   │   │   ├── BankPoolPage/
│   │   │   │   └── index.tsx
│   │   │   └── VaultPage/
│   │   │       └── index.tsx
│   │   ├── hooks/
│   │   │   ├── useWallet.ts
│   │   │   ├── useSimpleVault.ts
│   │   │   ├── useBankPool.ts
│   │   ├── components/
│   │   │   └── WalletInfo/
│   │   │       └── WalletInfo.tsx
│   │   ├── router/
│   │   │   └── index.tsx
│   │   ├── abis/
│   │   │   └── SimpleVaultSafe.json
│   │   └── config.ts
│   └── ...
│
├── hardhat.config.ts
├── package.json
└── README.md
```

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

---

### ✅ Day 2 — ABI / TypeChain 链路 & version() 实践

- 在 SimpleVault 合约中新增 `version()` 函数，返回当前合约版本字符串 `"1.0.0"`。
- 通过 `npx hardhat compile` 重新生成 ABI 与 TypeChain 类型文件。
- 在 `typechain-types/contracts/SimpleVault.ts` 中看到新增的 `version()` 类型定义。
- 在 `test/SimpleVault.ts` 中新增针对 `version()` 的单元测试，验证返回值为 `"1.0.0"`。
- 更直观地理解了：**Solidity 源码 → ABI → TypeChain 类型 → 测试代码调用** 这一整条链路。

同时补充理解了：

- Solidity 源码无法直接调用，必须先编译生成 ABI
- TypeChain 根据 ABI 生成 TypeScript 类型
- ethers.js 基于 ABI + 地址生成合约实例
- 改合约 → ABI 变 → 必须重新 compile 才能让 TS 同步
- `as any` 会绕过类型检查，工程里禁止使用
- EVM 是状态机，所有数据存储在世界状态树
- mapping 使用 keccak256 计算 slot，不是数组
- ETH 余额存储在账户状态，而不是变量或 mapping
- 交易通过去中心化 P2P 网络广播到全网

---

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

---

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

---

### ✅ Day 5 — ERC20 增强版：Mint / Burn / Pause / 权限控制

本日目标：在自定义 ERC20 基础上，加入生产级代币常见功能，包括增发、销毁、暂停开关与权限管理。同时编写完整的单元测试，确保所有核心逻辑安全可靠。

#### 📌 今日完成内容

- 在 `MyToken.sol` 中新增：
  - `mint(address to, uint256 amount)`：仅 owner 可增发代币
  - `burn(uint256 amount)`：任意用户可销毁自身代币
  - `pause()` 与 `unpause()`：紧急开关
  - `onlyOwner` 与 `whenNotPaused` 修饰器
- 对以下功能编写了单元测试，并全部通过：
  - owner 可以 mint，非 owner 会 revert
  - 用户可以 burn，自身余额与 totalSupply 同步减少
  - pause 后 `transfer` / `transferFrom` / `approve` / `mint` / `burn` 全部会 revert
  - unpause 后恢复正常逻辑
- 修复了测试中 async describe、未加 await、`revertedWith` 文案不规范等问题，使测试风格更符合 Hardhat 工程化规范。

#### 🧠 今日掌握的核心概念

- ERC20 增发与销毁的 Tokenomics 意义
- 为什么 Mint 必须加 onlyOwner
- Burn 的标准事件写法（使用 Transfer from/to zero address）
- `whenNotPaused` 如何统一控制代币可转性
- Pause 模块在真实项目中的安全意义（攻击或异常时紧急冻结代币流通）
- 如何通过测试验证代币内部账本逻辑的正确性

#### ✔️ 今日总结

通过 Day 5，我完成了一个更完整、更工程化的 ERC20 代币实现。掌握了增发、销毁、暂停、授权等核心逻辑，并通过完善的测试确保合约行为与安全性。代码结构更加接近生产环境，为后续实现 DEX、Staking、流动性池等模块奠定了坚实基础。

---

### ✅ Day 6 — Ownable 权限模块 + MyTokenV2 全面升级 + BankPool 资金池

**今日目标：**

- 实现一个可复用的 Ownable 权限控制模块
- 将 MyToken 升级为 MyTokenV2，继承 Ownable 并加强代币逻辑
- 实现一个基于 shares 份额模型的 ETH 资金池 BankPool
- 完成覆盖所有核心逻辑的单元测试

**今日完成内容：**

- 新增 `Ownable.sol`
  - private `_owner` 存储当前 owner
  - `onlyOwner` 修饰器限制敏感操作
  - `transferOwnership(address newOwner)` 允许 owner 变更控制权
  - 拒绝 zero address 作为新 owner
  - 部署时自动把部署者设为 owner

- 新增代币升级版 `MyTokenV2.sol`
  - 继承 `Ownable`
  - 全部敏感操作（mint / pause / unpause / transferOwnership）均受 `onlyOwner` 限制
  - 使用内部 `_transfer` / `_approve` 抽离公共逻辑，减少代码重复
  - 修复并强化 `transfer` / `transferFrom` / `burn` 的安全性检查
  - 保持与 ERC20 事件规范一致（`Transfer` / `Approval`）

- 单元测试 `MyTokenV2.ts` 全部通过，包括：
  - owner 正确初始化
  - `transfer` / `transferFrom` 正常更新余额与 `allowance`
  - `burn` 正确减少 `totalSupply`，且仅限用户自身余额
  - `transferOwnership` 正常切换 owner，并拒绝 zero address
  - 非 owner 调用敏感操作时正确 revert

- 新增 `BankPool.sol`（ETH 资金池 + shares 份额模型）
  - 使用 `totalAssets` / `totalShares` 记录池子整体状态
  - 使用 `userShares` 记录用户在池子中的份额占比
  - `deposit()`：用户存入 ETH，按公式 `shares = deposit * totalShares / totalAssets` 铸造份额；首次存款支持 1:1 初始化
  - `withdraw()`：用户按 `assets = shares * totalAssets / totalShares` 赎回对应 ETH
  - 支持外部直接向合约转入 ETH 作为“池子收益”，通过更新 `totalAssets` 而不改变 `totalShares`，从而提高每份 share 的价值
  - 新增测试 `BankPool.ts`，覆盖首次存款、二次按比例存款、按份额退出、收益增长后的份额价值变化以及超额赎回时的 revert 逻辑

**今日掌握的核心概念：**

- 为什么所有协议都需要 Ownable（协议控制权）
- owner → 新 owner 权限切换的安全性设计
- ERC20 在工程环境中的可扩展结构（拆分工具函数、继承 Ownable）
- 多文件、多模块 Solidity 工程化结构搭建
- 测试中应避免 async describe、遗漏 await 等常见陷阱
- 资金池中的 `shares` 代表的是池子中的“占比权”，而不是固定数量的 ETH
- 通过 `shares / totalShares` 与 `totalAssets` 的配合，可以在收益和亏损情况下自动、按比例分配资产
- DeFi 中 Vault / Pool 的核心是按比例分配：收益不需要逐个用户加余额，而是通过提高每份 share 的价值实现

**今日总结：**

通过 Day 6，我完成了可复用的权限模块 Ownable，并构建了一个更贴近生产环境的 MyTokenV2。同时实现了第一个带有 **shares 份额模型** 的资金池 BankPool，理解了共享池子中“总资产 / 总份额 / 用户份额”三者之间的数学关系。现在已经具备搭建简单 DeFi 协议（如 Vault、储蓄池、质押池）的基础能力，为后续引入 DEX、Staking、Liquidity Pool 等模块奠定了扎实的理论与代码基础。

---

### ✅ Day 7 — TokenBankPool：ERC20 版资金池 + shares 复盘

**今日目标：**

- 在 BankPool（ETH 池）的基础上，完成一个支持 ERC20 的资金池合约 TokenBankPool
- 串联 MyTokenV2（ERC20）、approve/transferFrom 与 shares 模型
- 通过单元测试验证 ERC20 池的数学正确性与授权流程
- 进一步巩固 Vault / Pool 的核心设计思路

**今日完成内容：**

- 新增 `TokenBankPool.sol`（ERC20 资金池 + shares 份额模型）
  - 构造函数接收已有的 `MyTokenV2` 地址，而不是在池子内部 new 代币合约
  - 使用 `MyTokenV2 public token` 保存池子所管理的 ERC20 代币
  - 使用 `totalAssets` / `totalShares` 记录池子的整体状态
  - 使用 `userShares` 记录每个用户在池子中的份额
  - `deposit(uint256 amount)`：
    - 调用方先在 `MyTokenV2` 上 `approve(TokenBankPool, amount)`
    - 池子内部通过 `token.transferFrom(msg.sender, address(this), amount)` 收取代币
    - 首次存款：按 1:1 铸造 shares（`shares = amount`）
    - 之后存款：使用 `shares = amount * totalShares / totalAssets` 公式按比例铸造 shares
    - 更新 `totalAssets`、`totalShares`、`userShares[msg.sender]`
  - `withdraw(uint256 shares)`：
    - 校验用户 shares 是否足够
    - 按 `assets = shares * totalAssets / totalShares` 公式计算可赎回资产数量
    - 更新 `totalAssets`、`totalShares`、`userShares[msg.sender]`
    - 通过 `token.transfer(msg.sender, assets)` 将 ERC20 代币返还给用户
  - `previewWithdraw(address user)`：
    - 只读函数，根据 `userShares[user]` 与当前 `totalAssets`、`totalShares` 预估用户可赎回资产数量
    - 对 `totalShares == 0` 的情况做了保护，避免除以 0

- 新增测试文件 `test/TokenBankPool.ts`
  - 使用 Hardhat fixtures 部署 `MyTokenV2` 与 `TokenBankPool`
  - 由 owner 先向 user1、user2 分发初始代币，作为存款资金来源
  - 用例覆盖：
    - 首次存款：user1 approve → deposit 后，`totalAssets`、`totalShares` 与 `userShares` 1:1 对应
    - 第二次存款：user2 在池子已有资产与 shares 的情况下存入，shares 按比例计算
    - 取款：用户 withdraw 部分 shares 后，用户代币余额增加、`totalAssets`、`totalShares`、`userShares` 按数学关系正确更新
    - 超额赎回：当用户尝试提取超过自身 shares 时，应正确 revert（"Insufficient shares"）
  - 在测试过程中修复了典型问题：
    - 忘记对合约调用加 `await`，导致 Chai 收到 Promise 而不是 bigint
    - `approve` 的 spender 必须是池子合约地址（`pool.getAddress()` 或 `pool.target`），而不是用户自身地址
    - 使用 `expect(await pool.xxx()).to.equal(...)` 的正确断言方式

**今日掌握的核心概念：**

- ERC20 池与 ETH 池的差异：资产不再来自 `msg.value`，而是来自代币合约的内部余额
- `approve + transferFrom` 在 DeFi 协议中的标准使用方式：授权池子合约代表用户转账
- 为什么资金池本身不负责“发币”，而是接管已有代币的流动与分配
- shares 模型在 ERC20 场景中的复用：`shares / totalShares` 决定用户在池子中的占比，`totalAssets` 决定池子总规模
- 当有人绕过 `deposit` 直接向池子地址转账代币时，为什么会导致 `totalAssets` 与真实余额不一致（以及如何在工程中通过改造为 `token.balanceOf(address(this))` 避免此类问题）
- 测试层面上，如何通过 approve → deposit → withdraw 的完整流程验证池子的资金流闭环

**今日总结：**

通过 Day 7，我在原有 ETH 版本 BankPool 的基础上，成功完成了一个基于 ERC20 的 TokenBankPool。它串联了 MyTokenV2、approve/transferFrom、shares 份额模型以及资金池的整体数学关系，使我对 DeFi 协议中“代币 → 池子 → 份额 → 赎回”的完整链路有了更立体的理解。现在不仅可以写出安全的金库合约和基础 ERC20，还能实现一个具备基础生产可用形态的 ERC20 资金池，这为后续实现更复杂的 Vault、Staking、LP 池等模块打下了扎实基础。

### ✅ Day 8 — storage / memory / calldata 数据位置专题

**今日目标：**

- 理解 Solidity 中三种数据位置：`storage`、`memory`、`calldata` 的作用与差异
- 通过三个独立的小合约 + 单元测试，从实践上验证它们的真实行为
- 为后续理解状态树、存储布局、复杂数据结构打下基础

**今日完成内容：**

- 新增三个用于实验的数据位置示例合约（当前放在本地实验文件中，未来视情况加入正式 contracts 目录）：
  - `StorageDemo`：
    - 定义一个简单的 `User` 结构体（例如只有 `score` 字段）
    - 在函数中通过 `User storage u = user;` 获取对状态变量的引用
    - 修改 `u.score` 后，持久化到链上状态
  - `MemoryDemo`：
    - 复用 `User` 结构体
    - 在函数中通过 `User memory u = user;` 拷贝一份数据到内存
    - 修改 `u.score`，但不会影响链上真实的 `user` 状态
  - `CalldataDemo`：
    - 定义 external 函数 `testCalldata(uint256[] calldata arr)`
    - 不修改 `arr`，而是读取 `arr.length` 等只读信息，并返回结果
    - 通过测试验证：可以正常传入数组参数并读取长度

- 为三个 Demo 编写对应测试（暂在本地实验文件中），并全部通过：
  - `StorageDemo` 测试：
    - 调用修改函数后，读取 `user`，`score` 变为期望值（例如 `100n`）
    - 验证 `storage` 是对状态变量的“引用”，修改会持久化
  - `MemoryDemo` 测试：
    - 调用修改函数后，读取 `user`，`score` 仍保持初始值（例如 `0n`）
    - 验证 `memory` 是一份“拷贝”，修改不会写回链上状态
  - `CalldataDemo` 测试：
    - 调用 `testCalldata([1,2,3])`，返回值为 `3n`
    - 验证 `calldata` 数组可以被正常读取和遍历，但在合约中不能被修改（尝试修改会在编译期报错）

- 再次运行整个测试集，当前所有合约相关测试（包括 SimpleVault / SimpleVaultSafe / MyToken / MyTokenV2 / Ownable / BankPool / TokenBankPool 以及数据位置 Demo 测试）全部通过，测试数达到 50+ 用例，初步具备工程级测试覆盖意识。

**今日掌握的核心概念：**

- `storage`：
  - 存储在链上的永久状态，是合约真正的“账本”
  - 典型用途是状态变量、`mapping`、`struct`、数组等
  - 写入与修改都消耗较高 gas，但交易结束后数据会持续存在
  - 使用 `User storage u = user;` 时，`u` 与 `user` 指向同一份存储，修改即修改本体
- `memory`：
  - 存在于函数执行期间的临时内存，是一份“拷贝”
  - 常用于函数内部的中间计算、对数据进行读写但不希望影响链上状态
  - 使用 `User memory u = user;` 会从 `storage` 拷贝一份到内存，修改 `u` 不会回写
  - 函数结束后，`memory` 数据被回收
- `calldata`：
  - 只读的数据位置，主要用于 `external` 函数的参数（尤其是数组、字符串等引用类型）
  - 不会拷贝到内存，读取成本更低，gas 更省
  - 在函数体内可以读取 `arr.length`、遍历元素，但不能对 `arr[i]` 进行赋值，试图修改会在编译阶段报错
- 三者的对比理解：
  - `storage` 像“硬盘上的账本文件”，负责长期存储真实状态
  - `memory` 像“函数内的内存副本”，适合临时计算
  - `calldata` 像“只读的请求数据视图”，适合作为 external 入参，既安全又省 gas
- 在测试与工程实践中的意义：
  - 写测试时，通过修改前后的对比，可以清晰地观察 data location 对状态的影响
  - 编写 external 函数时，数组和字符串参数优先考虑使用 `calldata`
  - 操作结构体或数组时，要有意识地区分“在改本体”还是“在改副本”，避免无意中消耗大量 gas 或错误修改状态

**今日总结：**

---

### ✅ Day 9 — StakingPool：质押 + 奖励分配合约

**今日目标：**

- 实现一个支持 ERC20 质押与奖励分配的 StakingPool 合约
- 掌握 DeFi 中常见的「累积奖励因子」模型（`rewardPerToken` / `accRewardPerShare`）
- 理解 stake / unstake / distribute / harvest 之间的状态流转与数学关系
- 通过单元测试验证奖励按占比分配且不可重复领取

**今日完成内容：**

- 新增 `StakingPool.sol`：
  - 使用 `MyTokenV2 public stakingToken` 作为质押与奖励代币
  - 使用 `totalStaked` 记录池子中质押总量，`balances[user]` 记录每个用户的质押数量
  - 使用 `rewardPerTokenStored` 作为全局累积奖励因子，按 `rewardAmount * 1e18 / totalStaked` 方式更新
  - 使用 `userRewardPerTokenPaid[user]` 记录用户上次结算时的 `rewardPerTokenStored`
  - 使用 `rewards[user]` 累计用户尚未领取的奖励
  - `stake(uint256 amount)`：
    - 调用方先在 `MyTokenV2` 上 `approve(StakingPool, amount)`
    - 合约内部通过 `transferFrom(msg.sender, address(this), amount)` 拉入质押代币
    - 调用 `_updateReward(msg.sender)` 后更新 `balances` 与 `totalStaked`
    - 触发 `Staked` 事件
  - `unstake(uint256 amount)`：
    - 调用 `_updateReward(msg.sender)`，结算到最新奖励
    - 校验 `balances[msg.sender] >= amount`，不足时 revert `"Insufficient staked balance"`
    - 更新 `balances` 与 `totalStaked`，通过 `transfer` 把本金返还给用户
    - 触发 `Unstaked` 事件
  - `distribute(uint256 rewardAmount)`（仅 owner 调用）：
    - 由 owner 先 `approve` 授权，再在合约中通过 `transferFrom(owner, address(this), rewardAmount)` 将奖励代币转入池子
    - 根据当前 `totalStaked` 更新 `rewardPerTokenStored`，实现「每 1 个 token 累积可领取多少奖励」的状态推进
    - 触发 `RewardAdded` 事件
  - `earned(address account)`：
    - 根据公式
      `pending = balances[account] * (rewardPerTokenStored - userRewardPerTokenPaid[account]) / 1e18`
      计算从上次结算到当前的新增奖励，并加上历史未领取的 `rewards[account]`
  - `harvest()`：
    - 先 `_updateReward(msg.sender)`，把该用户奖励结算到最新
    - 读取 `rewards[msg.sender]`，若为 0 则 revert `"No rewards to harvest"`
    - 将奖励清零并通过 `transfer` 发放给用户
    - 触发 `RewardPaid` 事件
  - `_updateReward(address account)`：
    - 用于在 stake / unstake / harvest / distribute 流程中，统一更新用户奖励状态：
      - `rewards[account] = earned(account);`
      - `userRewardPerTokenPaid[account] = rewardPerTokenStored;`

- 新增测试文件 `test/StakingPool.ts`，并全部通过：
  - `用户可以 stake 并更新余额和 totalStaked`：
    - owner 给 user1 分发代币
    - user1 `approve` → `stake`
    - 断言 `balances[user1]` 与 `totalStaked` 更新正确
  - `用户可以 unstake 并取回本金`：
    - 先 stake，再 `unstake` 部分或全部
    - 检查用户钱包余额、`balances[user1]`、`totalStaked` 同步变化
  - `distribute 后用户可以按占比领取奖励`：
    - user1 / user2 按不同比例质押
    - owner `approve + distribute` 奖励
    - 两人分别 `harvest`，检查奖励代币到账情况与占比分配是否正确
  - `多次 harvest 不会重复领取同一份奖励`：
    - 用户 stake 后，distribute 一次奖励并 harvest
    - 再次调用 `harvest` 会 revert，错误信息为 `"No rewards to harvest"`
    - 验证奖励只能被领取一次，不能重复发放
  - `未质押用户不能 unstake 或领取奖励`：
    - 对从未质押的用户调用 `unstake`，应当 revert `"Insufficient staked balance"`
    - 对从未质押或已领完奖励的用户调用 `harvest`，应当 revert `"No rewards to harvest"`

**今日掌握的核心概念：**

- `rewardPerTokenStored` 作为全局累积奖励因子，是 DeFi Staking / Farming 协议中常见的「每份质押份额的历史收益」度量方式
- `userRewardPerTokenPaid[user]` 记录用户上次结算时的奖励因子，用于计算「这次结算新增的那一段奖励」
- `earned(account)` 的本质是：
  `当前应得总奖励 = 历史未领奖励 + 当前余额 × (全局因子变化量)`
- `_updateReward` 在 stake / unstake / harvest 时必须先调用，以保证在修改用户质押余额前，先把旧奖励结算清楚
- distribute 不直接逐个更新用户余额，而是通过更新一个全局因子，让奖励分配保持 O(1) 复杂度，适合海量用户的 DeFi 场景
- 对于「多次 harvest」和「未质押用户」等边界条件，通过 revert 文案精确的单元测试可以有效避免逻辑漏洞

**今日总结：**

通过 Day 9 的 StakingPool 实战，我完成了一个具备工程意义的「质押 + 奖励分配」合约，实现了与真实 DeFi 项目接近的奖励结算模型。现在不仅能写出简单的 Vault / BankPool，还能基于 ERC20 构建支持多用户、按占比分配奖励、可领取且不可重复领取的 Staking 池，为后续理解更复杂的流动性挖矿、收益聚合器、流动性池（LP Token）等模块打下了坚实基础。

---

### ✅ Day 10 — DApp 前端：钱包连接 + 读取 SimpleVaultSafe 金库信息

**今日完成内容：**

- 新增 dapp/ 前端工程（React + Vite + TypeScript）。
- 采用 Ant Design 作为主要 UI 组件库，构建整体布局与卡片式首页。
- 实现 MainLayout（全局 Header + 回到主页按钮 + Outlet）。
- 实现 HomePage（钱包概览 + 模块入口卡片）。
- 实现 VaultPage（调用 loadVersion 与 loadVaultBalance 读取链上金库信息）。
- 编写 useWallet.ts（MetaMask 连接、地址、余额、链信息）。
- 编写 useSimpleVault.ts（与 SimpleVaultSafe 合约的前端读取逻辑）。
- 解决前端与 Hardhat 本地链交互中的错误：
  - invalid ENS name（因地址写成 URL）。
  - 0x 返回（因部署地址未更新或网络不一致）。

**今日掌握概念：**

- 前端调用链需要：正确的合约地址 + ABI + 与链一致的网络。
- React Router 的多页面结构：Layout + Outlet。
- 前端与合约的职责分离（Hook 负责链交互，页面负责 UI）。

---

### ✅ Day 11 — DApp 前端：SimpleVaultSafe 存款 / 取款交互

**今日目标：**

- 让 VaultPage 不仅能“读取”金库信息，还能完成真实的链上存款 / 取款操作
- 在前端完整走通：输入金额 → 发送交易 → 等待确认 → 刷新最新状态
- 进一步理解交易生命周期与前端状态刷新时机

**今日完成内容：**

- 在 `useSimpleVault.ts` 中补全写操作能力：
  - 新增 `deposit(amount: string, signer)`，内部使用 `ethers.parseEther(amount)` 和 `contract.deposit({ value })` 发送带 value 的交易。
  - 新增 `withdraw(amount: string, signer)`，使用 `contract.withdraw(parsedAmount)` 从金库取回 ETH。
  - 统一在这两个函数中对交易调用 `await tx.wait()`，确保在区块打包完成后再返回给页面逻辑。
- 在 `VaultPage` 中实现存款 / 取款 UI 与交互流程：
  - 使用 AntD 的 `Input` + `Button` 组合，分别对应“存入 ETH”“取出 ETH”两块区域。
  - 为存款、取款分别维护独立的 loading 状态，在交易进行中禁用按钮，避免用户重复点击。
  - 存款 / 取款成功后，自动调用 `loadVaultBalance()` 刷新金库余额，并清空输入框。
  - 将错误信息收敛到页面底部的统一错误区域，而不是零散的 `alert`。
- 完整跑通本地 Hardhat 链 + MetaMask 账户的测试流程：
  - 使用 `npx hardhat node` 启动本地链，复制控制台输出中的私钥，并在 MetaMask 中通过“导入账户”功能导入 Hardhat 账户，获得 10000 测试 ETH 余额。
  - 解决存款时 MetaMask 报 "资金不足" 的问题，理解这是因为当前账户没有本地链余额，而不是合约逻辑错误。
  - 在多次测试中，确认存款后合约余额增加、取款后合约余额减少，前端显示的金库余额与链上状态一致。
- 调试并修复了前端集成中的典型问题：
  - 当 ABI 不同步或前端未更新最新 ABI 时，TypeScript 会认为合约类型是 `BaseContract`，从而报错 "Property 'withdraw' does not exist"，通过更新 `SimpleVaultSafe.json` 并为合约添加类型断言解决该问题。
  - 理解了某些控制台报错来自浏览器扩展注入的 `content_script.js`，与 DApp 业务逻辑无关，可以忽略或在无痕模式下调试。

**今日掌握概念：**

- 交易生命周期：从前端发起交易，到进入内存池（pending），再到被打包进区块、生成收据（receipt），中间存在时间差。
- 为什么必须在前端 `await tx.wait()` 后再去读取最新链上状态，否则会读到“旧余额”。
- 本地开发闭环：Hardhat 节点 → 部署脚本输出合约地址 → 更新前端 `config.ts` 中的 `VAULT_ADDRESS` → MetaMask 切到本地网络并导入 Hardhat 账户。
- 前端与合约交互的职责拆分：
  - Hook（`useWallet` / `useSimpleVault`）负责封装链上读写逻辑与 signer/provider 管理。
  - 页面组件（`VaultPage`）只关心 UI 状态与用户交互流程。

**今日总结：**

通过 Day 11，我让 SimpleVaultSafe 对应的前端页面从“只读信息”升级为“可真实操作链上金库”的 DApp 页面。现在已经具备：连接钱包、读取合约信息、执行存款与取款交易、在交易确认后自动刷新最新余额等完整闭环能力。这为后续将 BankPool、TokenBankPool、StakingPool 等合约接入前端、构建一个完整的 Web3 学习控制台打下了良好的基础。

---

### ✅ Day 12 — BankPool 前端：资金池信息 & 存取款交互

**今日完成内容：**

- 新增 `useBankPool.ts`，封装与 BankPool 合约的交互：读取 totalAssets / totalShares / userShares、previewWithdraw、deposit / withdraw 等。
- 新增 `BankPoolPage` 页面，使用 Ant Design 的 Card/Form/Button 展示池子总资产、总份额、我的份额、可赎回金额，并支持输入金额进行存入和按份额取回。
- 在前端增加 `common/utils.ts` 的 `formatAmount` 工具函数，用于对大整数金额做保留 4 位小数的格式化展示。
- 为 dapp 配置路径别名 `@` 指向 `src`，并在各组件中使用 `@/hooks/...`、`@/common/utils` 等形式简化导入路径。

**今日掌握概念：**

- 再次巩固 BankPool shares 模型在前端的映射：前端只显示计算后的 ETH 金额与份额，不直接暴露 raw bigint。
- 理解为什么前端在展示金额时需要格式化（toFixed / formatAmount），避免 18 位小数影响可读性。
- 熟悉 React + AntD 下，将合约读写逻辑收敛到自定义 Hook、中台化 UI 与业务逻辑的分层。

**今日总结：**
已经完成从 BankPool 智能合约 → Hardhat 测试 → DApp 前端的完整闭环。现在前端可以完整展示资金池的总资产、总份额、我的份额、可赎回金额，并支持 ETH 存入和按份额赎回。后续可以用类似模式接入 TokenBankPool、StakingPool 等模块，进一步完善 DApp 的多池子、多模块集成能力。

## 📄 License

本仓库采用 MIT License 开源。

---

## 🙌 个人说明

本仓库由 **HuangJunJun** 维护，
用于记录从前端开发工程师转型为 **Web3 / 智能合约开发工程师** 的学习全过程。

如果你也在学习 Web3，欢迎一起交流、对比代码与思路。
