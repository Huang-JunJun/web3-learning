import fs from 'fs';
import path from 'path';
import { network } from 'hardhat';

type DeploymentInfo = {
  address: string;
  contract: string;
  network: string;
  deployer?: string;
};

const getDeploymentsDir = (): string => {
  return path.join(__dirname, '../deployments', network.name);
};

export const saveDeployment = (info: DeploymentInfo): void => {
  const dir = getDeploymentsDir();
  const filePath = path.join(dir, `${info.contract}.json`);

  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(info, null, 2));

  console.log(`Saved ${info.contract} deployment to:`, filePath);
};

export const loadDeployment = (contract: string): DeploymentInfo => {
  const dir = getDeploymentsDir();
  const filePath = path.join(dir, `${contract}.json`);

  if (!fs.existsSync(filePath)) {
    throw new Error(
      `Deployment file not found: ${filePath}. Have you deployed ${contract} on ${network.name}?`,
    );
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as DeploymentInfo;
};

export const clearDeployments = () => {
  const dir = path.join(__dirname, '../deployments', network.name);
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`Cleared old deployments: ${dir}`);
  }
};
