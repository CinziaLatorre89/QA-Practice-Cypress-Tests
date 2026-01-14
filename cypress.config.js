const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://qa-practice.razvanvancea.ro/',
	viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    videosFolder:'cypress/videos',
    screenshotOnRunFailure: true,
    screenshotsFolder:'cypress/screenshots',
  },

  //Configurazioni Report
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports/mochawesome',
      overwrite: false,
      html: true,
      json: true,
      charts: true
    },

})