// Work in integer cents so bill and coin totals match the displayed amount.
export const USD_DENOMINATIONS = [
  [10000, '$100', '100-front'], [5000, '$50', '50-front'],
  [2000, '$20', '20-front'], [1000, '$10', '10-front'],
  [500, '$5', '5-front'], [200, '$2', '2-front'], [100, '$1', '1-front'],
  [25, '25¢', 'quarter'], [10, '10¢', 'dime'], [5, '5¢', 'nickel'], [1, '1¢', 'penny'],
];
export function splitCash(amount) {
  if (!Number.isFinite(amount) || amount < 0) return [];
  let remaining = Math.round((amount + Number.EPSILON) * 100);
  if (!Number.isSafeInteger(remaining)) return [];
  return USD_DENOMINATIONS.flatMap(([cents, label, asset]) => {
    const count = Math.floor(remaining / cents);
    remaining %= cents;
    return count ? [{ cents, label, asset, count, coin: cents < 100 }] : [];
  });
}
