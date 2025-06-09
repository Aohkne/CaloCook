export const lightColors = {
  primary: '#9AF10C',
  secondary: '#006955',

  title: '#080E2D',
  background: '#FCFAF3',

  black: '#1B1C1D',
  while: '#FFFFFF'
}

export const darkColors = {
  primary: '#9AF10C',
  secondary: '#006955',

  title: '#080E2D',
  background: '#FCFAF3',

  black: '#1B1C1D',
  while: '#FFFFFF'
}

export const getColors = (isDark) => {
  return isDark ? darkColors : lightColors
}
