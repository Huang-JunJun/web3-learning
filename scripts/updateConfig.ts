import fs from 'fs';
import path from 'path';

const NETWORK = process.argv[2] || 'localhost';
const DEPLOY_DIR = path.join(__dirname, '../deployments', NETWORK);

// 映射 deploy 名字 → config.ts 常量名
const MAP: Record<string, string> = {
  SimpleVaultSafe: 'VAULT_ADDRESS',
  BankPool: 'BANK_POOL_ADDRESS',
  StakingPool: 'STAKING_POOL_ADDRESS',
  MyTokenV2: 'MYTOKENV2_ADDRESS',
};

const CONFIG_FILE = path.join(__dirname, '../dapp/src/config.ts');

const run = async () => {
  if (!fs.existsSync(DEPLOY_DIR)) {
    console.error('Deployment directory not found:', DEPLOY_DIR);
    return;
  }

  const files = fs.readdirSync(DEPLOY_DIR);

  let lines: string[] = [];

  for (const file of files) {
    if (!file.endsWith('.json')) continue;

    const json = require(path.join(DEPLOY_DIR, file));
    const name = file.replace('.json', '');

    const constName = MAP[name];
    if (!constName) continue;

    lines.push(`export const ${constName} = "${json.address}";`);
  }

  const content = lines.join('\n') + '\n';

  fs.writeFileSync(CONFIG_FILE, content);
  console.log('Updated config.ts:');
  console.log(content);
};

run();
