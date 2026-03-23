export function handleActionResult<T>(result: { success: boolean; error?: string | null; data?: T | null } | T, fallbackMessage: string): T {
  if (result && typeof result === 'object' && 'success' in result) {
    if (!result.success) throw new Error(result.error ?? fallbackMessage)
    return result.data as T
  }
  return result as T
}
