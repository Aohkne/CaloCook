export const lightColors = {
  primary: '#9AF10C',
  secondary: '#006955',

  title: '#080E2D',
  description: '#888888',
  background: '#FCFAF3',

  black: '#1B1C1D',
  white: '#FFFFFF',
  red: '#DC2E60',
  yellow: '#EEC756'
};

export const darkColors = {
  primary: '#9AF10C',
  secondary: '#006955',

  title: '#080E2D',
  description: '#888888',
  background: '#FCFAF3',

  black: '#1B1C1D',
  white: '#FFFFFF',
  red: '#DC2E60',
  yellow: '#EEC756'
};

export const getColors = (isDark) => {
  return isDark ? darkColors : lightColors;
};
