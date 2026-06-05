// Karma configuration file
// https://karma-runner.github.io/6.4/config/configuration-file.html

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
      jasmine: {
        // Randomise spec order on every run to catch hidden ordering dependencies
        random: true,
      },
      clearContext: false, // keep Jasmine Spec Runner visible in browser
    },
    jasmineHtmlReporter: {
      suppressAll: true, // removes duplicated traces
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/smart-fleet'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'lcovonly' },
      ],
    },
    reporters: ['progress', 'kjhtml'],
    browsers: ['Chrome'],
    restartOnFileChange: true,
  });
};
