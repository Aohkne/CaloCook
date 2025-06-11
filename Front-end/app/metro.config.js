const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

const config = getDefaultConfig(__dirname)

config.resolver.alias = {
  '@': path.resolve(__dirname, 'src'),
  '@assets': path.resolve(__dirname, 'src/assets'),
  '@components': path.resolve(__dirname, 'src/components'),
  '@contexts': path.resolve(__dirname, 'src/contexts'),
  '@navigations': path.resolve(__dirname, 'src/navigations'),
  '@redux': path.resolve(__dirname, 'src/redux'),
  '@screens': path.resolve(__dirname, 'src/screens'),
  '@services': path.resolve(__dirname, 'src/services'),
  '@styles': path.resolve(__dirname, 'src/styles'),
  '@utils': path.resolve(__dirname, 'src/utils')
}

module.exports = config
