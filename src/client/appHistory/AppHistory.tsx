const HISTORY_KEY = 'calculatorHistory'

export function saveHistory(history: string[]) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  } catch (error) {
    console.error('Error', error)
  }
}

export function getHistory(): string[] {
  try {
    const savedHistory = localStorage.getItem(HISTORY_KEY)
    return savedHistory ? JSON.parse(savedHistory) : []
  } catch (error) {
    console.error('Error', error)
    return []
  }
}

export function clearHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY)
  } catch (error) {
    console.error('Error', error)
  }
}
