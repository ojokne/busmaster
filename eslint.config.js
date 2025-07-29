// // https://docs.expo.dev/guides/using-eslint/
// const { defineConfig } = require('eslint/config');
// const expoConfig = require('eslint-config-expo/flat');
// const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

// module.exports = defineConfig([
//   expoConfig,
//   eslintPluginPrettierRecommended,
//   {
//     ignores: ['dist/*', 'node_modules/'],
//   },
// ]);

// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const eslintPluginJest = require('eslint-plugin-jest');

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    ignores: ['dist/*', 'node_modules/'],
  },
  {
    files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
    plugins: {
      jest: eslintPluginJest,
    },
    languageOptions: {
      globals: {
        ...eslintPluginJest.environments.globals.globals,
      },
    },
    rules: {
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
    },
  },
]);
