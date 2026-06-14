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
      '3': 'truffle',
      '4': 'espresso',
      '5': 'wine',
      '6': 'aubergine',
      '0': 'copper',
    },
  }
}