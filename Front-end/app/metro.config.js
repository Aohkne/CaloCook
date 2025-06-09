const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

config.resolver.alias = {
  "@": path.resolve(__dirname, "src"),
  "@assets": path.resolve(__dirname, "src/assets"),
  "@components": path.resolve(__dirname, "src/components"),
  "@contexts": path.resolve(__dirname, "src/contexts"),
  "@redux": path.resolve(__dirname, "src/redux"),
  "@auth": path.resolve(__dirname, "src/screens/(auth)"),
  "@screens": path.resolve(__dirname, "src/screens/(screens)"),
  "@services": path.resolve(__dirname, "src/services"),
  "@styles": path.resolve(__dirname, "src/styles"),
  "@utils": path.resolve(__dirname, "src/utils"),
};

module.exports = config;
