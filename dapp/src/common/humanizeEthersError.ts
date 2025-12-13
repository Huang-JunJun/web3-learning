const unquoteOnce = (s: string) => {
  const t = s.trim();
  if (t.length >= 2) {
    const first = t[0];
    const last = t[t.length - 1];
    if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
      return t.slice(1, -1).trim();
    }
  }
  return t;
};

const unescapeProviderString = (s: string) =>
  // Some provider messages contain escaped quotes like: execution reverted: \"Insufficient balance\"
  s.replace(/\\"/g, '"').replace(/\\'/g, "'").replace(/\\\\/g, '\\');

const normalizeReason = (reason: string) => {
  const cleaned = unescapeProviderString(unquoteOnce(reason))
    .replace(/^execution reverted:\s*/i, '')
    .trim();
  // Some providers return empty quotes like `""` or `"`.
  return cleaned.replace(/^"+|"+$/g, '').trim();
};

const extractReason = (err: any): string | null => {
  const candidates = [
    err?.reason,
    err?.shortMessage,
    err?.info?.error?.message,
    err?.error?.message,
    err?.data?.message,
    err?.message,
  ].filter((v) => typeof v === 'string' && v.length > 0) as string[];

  for (const raw of candidates) {
    const m =
      raw.match(/execution reverted(?::\s*([^\n]+))?/i) ||
      raw.match(/reverted(?::\s*([^\n]+))?/i);
    if (m && m[1]) {
      const r = normalizeReason(m[1]);
      if (r) return r;
    }
  }

  if (typeof candidates[0] === 'string') {
    const s = candidates[0];
    // Some providers embed reason directly in message.
    const m = s.match(/reason(?:=|:)\s*("?)([^"]+)\1/i);
    if (m?.[2]) {
      const r = normalizeReason(m[2]);
      if (r) return r;
    }
  }

  return null;
};

export const humanizeEthersError = (err: unknown): string => {
  const e: any = err;
  const code = e?.code ?? e?.error?.code;

  if (code === 'ACTION_REJECTED') return '你已取消交易签名';
  if (code === 'INSUFFICIENT_FUNDS') return '余额不足，无法支付 gas 或转账金额';

  const reason = extractReason(e);
  const reasonText = (reason ?? '').toLowerCase();

  if (reasonText.includes('allowance exceeded') || reasonText.includes('insufficient allowance')) {
    return '授权额度不足，请先授权';
  }
  if (reasonText.includes('no rewards to harvest') || reasonText.includes('no rewards')) {
    return '当前没有可领取奖励';
  }
  if (reasonText === 'not owner') {
    return '只有合约 Owner 才能执行该操作';
  }
  if (reasonText.includes('no staked tokens')) {
    return '当前没有人质押，无法派发奖励';
  }
  if (reasonText.includes('insufficient reward balance')) {
    return '质押池合约余额不足：请先把奖励 Token 转账到池子合约';
  }
  if (reasonText.includes('insufficient reward fund')) {
    return '奖励资金池不足（可能重复派发或未转账到池子）';
  }
  if (reasonText.includes('bad pool balance')) {
    return '池子余额异常（可能被直接转走/状态不同步），请刷新后重试';
  }
  if (reasonText.includes('insufficient staked balance')) {
    return '质押余额不足';
  }
  if (reasonText.includes('cannot stake 0')) {
    return '质押数量不能为 0';
  }
  if (reasonText.includes('cannot unstake 0')) {
    return '解除质押数量不能为 0';
  }
  if (reasonText.includes('insufficient balance')) {
    return '余额不足';
  }
  if (reasonText.includes('transfer failed')) {
    return '代币转账失败';
  }

  const msg: string = e?.shortMessage ?? e?.message ?? String(e);
  const msgLower = msg.toLowerCase();
  if (msgLower.includes('user rejected') || msgLower.includes('rejected')) {
    return '你已取消交易签名';
  }
  if (msgLower.includes('call_exception') || msgLower.includes('execution reverted')) {
    return reason ? `交易失败：${reason}` : '交易失败（合约拒绝），请检查输入或合约状态';
  }
  if (msgLower.includes('missing revert data')) {
    return '交易失败（未返回失败原因），请检查输入或合约状态';
  }

  return reason ? `操作失败：${reason}` : msg;
};
