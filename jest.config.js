module.exports = {
  preset: 'jest-expo', // or 'react-native' if not using Expo
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|' +
      '@react-native|' +
      '@react-native-community|' +
      '@react-navigation|' +
      '@expo|' +
      'expo|' +
      'expo-status-bar|' +
      'expo-router|' +
      'firebase|' + // include firebase package
      '@firebase|' + // include firebase's sub-packages
      '@react-native-async-storage/async-storage' +
    ')',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1', // for @ alias support
  },
  setupFiles: ['./jest.setup.js'],
};
