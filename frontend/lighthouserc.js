module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/services',
        'http://localhost:3000/about',
        'http://localhost:3000/contact',
        'http://localhost:3000/providers',
        'http://localhost:3000/login',
      ],
      numberOfRuns: 1,
      settings: {
        chromeFlags: '--no-sandbox',
        preset: 'desktop',
      },
    },
    assert: {
      assertions: {
        'categories:accessibility': ['warn', { minNumericValue: 85 }],
        'categories:best-practices': ['warn', { minNumericValue: 80 }],
        'categories:seo': ['warn', { minNumericValue: 80 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: './lighthouse-results',
    },
    server: {
      port: 9001,
    },
  },
}
