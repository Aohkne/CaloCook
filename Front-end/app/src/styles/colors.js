export const lightColors = {
  primary: '#9AF10C',
  secondary: '#006955',

  title: '#080E2D',
  description: '#888888',
  background: '#FCFAF3',

  cardBg: '#FFFFFF',
  btnBg: '#FFFFFF',
  border: '#1B1C1D',
  shadow: '#1B1C1D',

  black: '#1B1C1D',
  white: '#FFFFFF',
  red: '#DC2E60',
  yellow: '#EEC756'
};

export const darkColors = {
  primary: '#9AF10C',
  secondary: '#1DB59E',

  title: '#FCFAF3',
  description: '#AAAAAA',
  background: '#0E0F1A',

  cardBg: '#1B1C1D',
  btnBg: '#1B1C1D',
  border: '#FCFAF3',
  shadow: '#FCFAF3',

  red: '#FF4D6D',
  yellow: '#FFD85F'
};

export const getColors = (isDark) => {
  return isDark ? darkColors : lightColors;
};
