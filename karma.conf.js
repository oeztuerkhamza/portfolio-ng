/**
 * Karma-Konfiguration für die Angular-Tests (`npm test`).
 *
 * Nötig nur wegen eines zusätzlichen Browsers: „ChromeHeadlessNoSandbox"
 * startet Chrome ohne Sandbox und läuft damit auch als root, also in
 * Containern und auf CI-Maschinen (`npm run test:ci`). Alles andere bleibt
 * bei den Vorgaben der Angular CLI.
 *
 * Die Server-API liegt außerhalb: sie ist Node-Code und wird mit
 * `npm run test:server` geprüft.
 */
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    client: {
      jasmine: {},
      clearContext: false, // Ergebnisse im Browser sichtbar lassen
    },
    jasmineHtmlReporter: { suppressAll: true },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/breisgau-digital'),
      subdir: '.',
      reporters: [{ type: 'html' }, { type: 'text-summary' }],
    },
    reporters: ['progress', 'kjhtml'],
    browsers: ['Chrome'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
      },
    },
    restartOnFileChange: true,
  });
};
