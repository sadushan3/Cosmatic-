export function formatLkr(value: number) {
  const amount = Math.round(Number(value) || 0)
  return `LKR ${new Intl.NumberFormat('en-LK').format(amount)}`
}
