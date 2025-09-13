export const lightColors = {
  primary: '#9AF10C',
  secondary: '#006955',
  tertiary: '#C6DEBE',

  title: '#080E2D',
  titleWithBg: '#FFFFFF',
  description: '#888888',

  background: '#FCFAF3',
  backgroundSide: '#FCFAF3A8',
  backgroundSubside: '#FFFFFF99',

  cardBg: '#FFFFFF',
  btnBg: '#FFFFFF',
  border: '#1B1C1D',
  shadow: '#1B1C1D',

  inputBg: 'rgba(8, 14, 45, 0.04)',
  inputBorder: 'rgba(8, 14, 45, 0.06)',
  inputText: '#000000',
  inputPlaceHolder: 'rgba(8, 14, 45, 0.6)',

  black: '#1E1E1E',
  white: '#FFFFFF',

  lightBlue: '#CEE3FF',
  blue: '#3E91FF',

  lightGreen: '#E4F9F2',
  green: '#27CE96',

  red: '#DC2E60',
  lightRed: '#ECB8BE',

  yellow: '#EEC756',
  lightYellow: '#FEE9AD'
};

export const darkColors = {
  primary: '#9AF10C',
  secondary: '#1DB59E',
  tertiary: '#2B3A32',

  title: '#FCFAF3',
  titleWithBg: '#0E0F1A',
  description: '#AAAAAA',

  background: '#0E0F1A',
  backgroundSide: '#0E0F1AA8',
  backgroundSubside: '#080E2D99',

  cardBg: '#1B1C1D',
  btnBg: '#1B1C1D',
  border: '#444444',
  shadow: 'rgba(255, 255, 255, 0.5)',

  inputBg: 'rgba(255, 255, 255, 0.05)',
  inputBorder: 'rgba(255, 255, 255, 0.2)',
  inputText: '#FFFFFF',
  inputPlaceHolder: 'rgba(255, 255, 255, 0.6)',

  black: '#000000',
  white: '#FFFFFF',

  lightBlue: '#3E91FF33',
  blue: '#4DA6FF',
  cyan: '#00E5FF',

  lightGreen: '#3DF7B933',
  green: '#3DF7B9',
  teal: '#20E3D2',

  red: '#FF4D6D',
  lightRed: '#FF4D6D33',

  lightYellow: '#FFD85F33',
  yellow: '#FFD85F',

  pink: '#FF77A9',
  orange: '#FF9F45',
  purple: '#A26BFA'
};

export const getColors = (isDark) => {
  return isDark ? darkColors : lightColors;
};
