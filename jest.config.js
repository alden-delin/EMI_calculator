module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.test.js', '**/*.spec.js'],
  collectCoverageFrom: [
    'script.js',
    '!node_modules/**',
    '!coverage/**'
  ],
  verbose: true
};
