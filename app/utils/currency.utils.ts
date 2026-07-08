export function formatMoney(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

export const fmtCurrency = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

export function formatWithCommas(value: number | string) {
  return Number(value).toLocaleString('en-US')
}
