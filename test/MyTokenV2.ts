import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { ethers } from 'hardhat';
import { expect } from 'chai';

describe('MyTokenV2', () => {
  async function deployFixture() {
    const [owner, user1, user2, spender] = await ethers.getSigners();
    const MyTokenV2 = await ethers.getContractFactory('MyTokenV2');
    const token = await MyTokenV2.deploy();
    return { owner, user1, user2, spender, token };
  }

  it('部署后 owner 应该持有全部初始 totalSupply', async () => {
    const { owner, token } = await loadFixture(deployFixture);
    const totalSupply = await token.totalSupply();

    expect(await token.balanceOf(owner.address)).to.equal(totalSupply);
  });

  it('name / symbol / decimals / totalSupply 初始化应正确', async () => {
    const { token } = await loadFixture(deployFixture);

    expect(await token.name()).to.equal('MyTokenV2');
    expect(await token.symbol()).to.equal('MTK2');
    expect(await token.decimals()).to.equal(18);
    expect(await token.totalSupply()).to.equal(1_000_000n * 10n ** 18n);
  });

  it('transfer 正常转账应成功，且余额正确变化', async () => {
    const { owner, user1, token } = await loadFixture(deployFixture);
    const transferAmount = 100n * 10n ** 18n;

    await expect(token.connect(owner).transfer(user1.address, transferAmount)).to.not.be.reverted;

    expect(await token.balanceOf(owner.address)).to.equal(1_000_000n * 10n ** 18n - transferAmount);
    expect(await token.balanceOf(user1.address)).to.equal(transferAmount);
  });

  it('transfer 余额不足时应 revert', async () => {
    const { user1, user2, token } = await loadFixture(deployFixture);
    const transferAmount = 50n * 10n ** 18n; // user1 初始余额为 0

    await expect(token.connect(user1).transfer(user2.address, transferAmount)).to.be.revertedWith(
      'Insufficient balance',
    );
  });

  it('approve 设置 allowance 后，allowance 应更新', async () => {
    const { owner, spender, token } = await loadFixture(deployFixture);
    const approveAmount = 200n * 10n ** 18n;

    await expect(token.connect(owner).approve(spender.address, approveAmount)).to.not.be.reverted;

    expect(await token.allowance(owner.address, spender.address)).to.equal(approveAmount);
  });

  it('transferFrom 在 allowance 足够时应成功，且余额与 allowance 同步更新', async () => {
    const { owner, user1, spender, token } = await loadFixture(deployFixture);
    const approveAmount = 300n * 10n ** 18n;
    const transferAmount = 150n * 10n ** 18n;

    await token.connect(owner).approve(spender.address, approveAmount);

    await expect(token.connect(spender).transferFrom(owner.address, user1.address, transferAmount))
      .to.not.be.reverted;

    expect(await token.balanceOf(owner.address)).to.equal(1_000_000n * 10n ** 18n - transferAmount);
    expect(await token.balanceOf(user1.address)).to.equal(transferAmount);
    expect(await token.allowance(owner.address, spender.address)).to.equal(
      approveAmount - transferAmount,
    );
  });

  it('transferFrom 在 allowance 不足时应 revert', async () => {
    const { owner, user1, spender, token } = await loadFixture(deployFixture);
    const approveAmount = 100n * 10n ** 18n;
    const transferAmount = 150n * 10n ** 18n;

    await token.connect(owner).approve(spender.address, approveAmount);

    await expect(
      token.connect(spender).transferFrom(owner.address, user1.address, transferAmount),
    ).to.be.revertedWith('Allowance exceeded');
  });

  // -------------------------------
  // pause / unpause
  // -------------------------------
  // it('owner 可以 pause，paused 状态应为 true', async () => {
  //   // 你来写
  // });

  // it('pause 后 transfer / approve / transferFrom 都应 revert', async () => {
  //   // 你来写
  // });

  // it('owner 可以 unpause，恢复正常操作', async () => {
  //   // 你来写
  // });

  // -------------------------------
  // mint / burn
  // -------------------------------
  it('onlyOwner 可以 mint，totalSupply 与接收地址余额增加', async () => {
    const { owner, user1, token } = await loadFixture(deployFixture);
    const mintAmount = 500n * 10n ** 18n;
    const initialTotalSupply = await token.totalSupply();

    await expect(token.connect(owner).mint(user1.address, mintAmount)).to.not.be.reverted;

    expect(await token.totalSupply()).to.equal(initialTotalSupply + mintAmount);
    expect(await token.balanceOf(user1.address)).to.equal(mintAmount);
  });

  it('非 owner 调用 mint 应 revert', async () => {
    const { user1, token } = await loadFixture(deployFixture);
    const mintAmount = 500n * 10n ** 18n;

    await expect(token.connect(user1).mint(user1.address, mintAmount)).to.be.revertedWith(
      'Not owner',
    );
  });

  it('burn 正常销毁时，totalSupply 与用户余额减少', async () => {
    const { owner, token } = await loadFixture(deployFixture);
    const burnAmount = 200n * 10n ** 18n;
    const initialTotalSupply = await token.totalSupply();

    await expect(token.connect(owner).burn(burnAmount)).to.not.be.reverted;

    expect(await token.totalSupply()).to.equal(initialTotalSupply - burnAmount);
    expect(await token.balanceOf(owner.address)).to.equal(initialTotalSupply - burnAmount);
  });

  it('burn 数量超过自己余额时应 revert', async () => {
    const { user1, token } = await loadFixture(deployFixture);
    const burnAmount = 100n * 10n ** 18n; // user1 初始余额为 0

    await expect(token.connect(user1).burn(burnAmount)).to.be.revertedWith('Insufficient balance');
  });

  it('transfer 应触发 Transfer 事件', async () => {
    const { owner, user1, token } = await loadFixture(deployFixture);
    const transferAmount = 100n * 10n ** 18n;

    await expect(token.connect(owner).transfer(user1.address, transferAmount))
      .to.emit(token, 'Transfer')
      .withArgs(owner.address, user1.address, transferAmount);
  });

  it('approve 应触发 Approval 事件', async () => {
    const { owner, spender, token } = await loadFixture(deployFixture);
    const approveAmount = 250n * 10n ** 18n;

    await expect(token.connect(owner).approve(spender.address, approveAmount))
      .to.emit(token, 'Approval')
      .withArgs(owner.address, spender.address, approveAmount);
  });
});
