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

  inputBg: 'rgba(8, 14, 45, 0.04)',
  inputBorder: 'rgba(8, 14, 45, 0.06)',

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

  inputBg: '#ffffff',
  inputBorder: '#0E0F1A',

  red: '#FF4D6D',
  yellow: '#FFD85F'
};

export const getColors = (isDark) => {
  return isDark ? darkColors : lightColors;
};
