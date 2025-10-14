module.exports = {
  root: true,
  extends: ['@react-native-community'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      rules: {
        // add TS-specific tweaks here if needed
      },
    },
  ],
};
