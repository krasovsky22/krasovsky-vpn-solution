module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      require.resolve('expo-router/babel'),
      [
        'module-resolver',
        {
          alias: {
            '@lib': '/lib',
            '@api': './api',
            '@hooks': './hooks',
            '@stores': './stores',
            '@assets': './assets',
            '@context': './context',
            '@graphql': './graphql',
            '@components': './components',
          },
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      ],
    ],
  };
};
