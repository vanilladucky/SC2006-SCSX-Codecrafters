module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo", "module:metro-react-native-babel-preset"],
    plugins: [
      "nativewind/babel",
      "@babel/plugin-proposal-export-namespace-from",
      "react-native-reanimated/plugin",
      "module:react-native-dotenv",
      require.resolve("expo-router/babel"),
      [
        require.resolve("babel-plugin-module-resolver"),
        {
          root: ["./src"],
          alias: {
            "@src": "./src",
            "@server": "./server",
            "@env": "./.env",
          },
        },
      ],
    ],
  };
};
