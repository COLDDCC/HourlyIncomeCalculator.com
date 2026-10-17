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

// Break one piece into smaller denominations without changing the total.
export function makeChange(groups) {
  const index = groups.findIndex(group => group.cents > 1 && group.count > 0);
  if (index < 0) return groups;
  const counts = new Map(groups.map(group => [group.cents, group.count]));
  const piece = groups[index];
  counts.set(piece.cents, piece.count - 1);
  let remaining = piece.cents;
  for (const [cents] of USD_DENOMINATIONS) {
    if (cents >= piece.cents) continue;
    const count = Math.floor(remaining / cents);
    if (count) counts.set(cents, (counts.get(cents) || 0) + count);
    remaining %= cents;
  }
  return USD_DENOMINATIONS.flatMap(([cents, label, asset]) => {
    const count = counts.get(cents) || 0;
    return count ? [{cents, label, asset, count, coin: cents < 100}] : [];
  });
}

// Keep large annual incomes responsive: a labelled bundle represents many notes.
export function cashPieces(groups, limit = 36) {
  const slots = Math.max(1, Math.floor(limit / Math.max(groups.length, 1)));
  return groups.flatMap(group => {
    const length = Math.min(group.count, slots);
    return Array.from({length}, (_, index) => ({...group,
      count: index === length - 1 ? group.count - index : 1,
      key: group.asset + '-' + index,
    }));
  });
}
