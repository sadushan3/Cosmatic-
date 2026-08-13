export function formatCurrency(value: number) {
  const amount = Math.round(Number(value) || 0)
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    maximumFractionDigits: 0,
  }).format(amount)
}
