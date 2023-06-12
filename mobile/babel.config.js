module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      require.resolve('expo-router/babel'),
      [
        'module-resolver',
        {
          alias: {
            '@hooks': './hooks',
            '@utils': './utils',
            '@assets': './assets',
            '@components': './components',

            '@stores': './stores',
            '@api': './stores/api',
            '@graphql': './stores/graphql',
            '@actions': './stores/actions',
            '@reducers': './stores/reducers',
          },
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      ],
    ],
  };
};
