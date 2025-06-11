module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
            '@assets': './src/assets',
            '@components': './src/components',
            '@contexts': './src/contexts',
            '@navigations': './src/navigations',
            '@redux': './src/redux',
            '@screens': './src/screens',
            '@services': './src/services',
            '@styles': './src/styles',
            '@utils': './src/utils'
          }
        }
      ]
    ]
  }
}
