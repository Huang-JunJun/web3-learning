// src/components/WalletInfo.tsx
type WalletInfoProps = {
  address: string;
  chainId: string;
  chainNetwork: string;
  balance: string;
  onDisconnect: () => void;
};

const WalletInfo = ({ address, chainId, chainNetwork, balance, onDisconnect }: WalletInfoProps) => {
  return (
    <div>
      <p>
        <strong>钱包地址：</strong> {address}
      </p>
      <p>
        <strong>当前链 ID：</strong> {chainId}
      </p>
      <p>
        <strong>当前网络：</strong> {chainNetwork}
      </p>
      <p>
        <strong>ETH 余额：</strong> {balance} ETH
      </p>

      <button onClick={onDisconnect}>断开连接</button>
    </div>
  );
};

export default WalletInfo;
