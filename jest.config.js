module.exports = {
  preset: 'react-native',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest/setup.js'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native'
      + '|@react-native'
      + '|@react-navigation'
      + '|react-native-gesture-handler'
      + '|react-native-reanimated'
      + '|react-native-screens'
      + '|react-native-safe-area-context'
      + '|react-native-vector-icons'
      + '|@react-native-async-storage'
      + '|react-native-encrypted-storage'
      + '|react-native-svg'
      + '|react-native-image-crop-picker'
      + '|react-native-tcp-socket'
      + '|react-native-wifi-reborn'
      + '|react-native-vision-camera'
      + '|react-native-worklets-core'
      + ')/)',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/jest/svgMock.js', // only if you import .svg as components
  },
};
