export function getProgressPct(value: number, goal: number): number {
  if (!goal) return 0
  return Math.min(100, Math.round((value / goal) * 100))
}
