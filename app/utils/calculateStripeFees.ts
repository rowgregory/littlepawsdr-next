export function calculateStripeFees(amount: number) {
  return Math.round(((amount + 0.3) / (1 - 0.029) - amount) * 100) / 100
}
