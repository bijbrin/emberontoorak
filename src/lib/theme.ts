export type ThemeSettings = {
  mode: 'auto' | 'manual'
  manual: string
  schedule: Record<string, string>
}

export function defaultThemeSettings(): ThemeSettings {
  return {
    mode: 'auto',
    manual: 'ember',
    schedule: {
      '1': 'ember',
      '2': 'noir',
      '3': 'midnight',
      '4': 'forest',
      '5': 'wine',
      '6': 'ocean',
      '0': 'copper',
    },
  }
}