export const formatAmount = (value: string | undefined, decimals = 4) => {
  if (!value) return '-';
  const n = Number(value);
  if (Number.isNaN(n)) return value;
  return n.toFixed(decimals);
};
