module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver', {
        root: ['./'],
        alias: {
          // This needs to be mirrored in tsconfig.json
          '@app/components': './src/shared/components',
          '@app/shared': './src/shared',
          '@app/contexts': './src/contexts',
          '@app/appearance': './src/appearance',
          '@app/services': './src/services',
          '@app/stores': './src/stores',
          '@app/models': './src/models',
          '@toothcase/shared': './toothcase/shared'
        },
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
      }
    ],
    'react-native-reanimated/plugin',   // keep this LAST
  ],
};
