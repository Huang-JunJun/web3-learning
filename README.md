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
├── contracts/                 # Solidity 合约
│   ├── SimpleVault.sol        # Day 1: ETH 金库示例合约
│   ├── SimpleVaultSafe.sol    # Day 4: 防重入版本金库
│   ├── MyToken.sol            # Day 3: 自定义 ERC20 代币
│   ├── Ownable.sol            # Day 6: 通用权限控制模块
│   ├── MyTokenV2.sol          # Day 6: 继承 Ownable 的增强版 ERC20
│   └── BankPool.sol           # Day 6: ETH 资金池 + shares 份额模型
│
├── test/                      # Hardhat + TypeScript 测试
│   ├── SimpleVault.ts         # SimpleVault 单元测试
│   ├── SimpleVaultSafe.ts     # SimpleVaultSafe 单元测试
│   ├── MyToken.ts             # MyToken 单元测试
│   ├── Ownable.ts             # Ownable 单元测试
│   ├── MyTokenV2.ts           # MyTokenV2 单元测试
│   └── BankPool.ts            # BankPool 单元测试
│
├── scripts/                   #（预留）部署 / 操作脚本
│
├── hardhat.config.ts          # Hardhat 配置
├── package.json
└── README.md                  # 仓库说明 & 学习日志
```

后续会根据每天学习内容，继续扩展新的合约文件与测试文件，例如 NFT、Staking、更多 DeFi 组件等。

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

## 📄 License

本仓库采用 MIT License 开源。

---

## 🙌 个人说明

本仓库由 **HuangJunJun** 维护，
用于记录从前端开发工程师转型为 **Web3 / 智能合约开发工程师** 的学习全过程。

如果你也在学习 Web3，欢迎一起交流、对比代码与思路。
