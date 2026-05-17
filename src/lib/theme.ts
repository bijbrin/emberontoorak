export type ThemeSettings = {
  mode: 'auto' | 'manual'
  manual: string
  schedule: Record<string, string>
}

export function defaultThemeSettings(): ThemeSettings {
  return {
    mode: 'auto',
    manual: 'rose-pine-moon',
    schedule: {
      '1': 'rose-pine-moon',
      '2': 'catppuccin-mocha',
      '3': 'tokyo-night',
      '4': 'gruvbox-dark',
      '5': 'nord',
      '6': 'dracula',
      '0': 'flexoki-dark',
    },
  }
}
