// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const {SpecReporter} = require('jasmine-spec-reporter');
const browserstack = require('browserstack-local');


exports.config = {
  browserstackUser: process.env.BROWSERSTACK_USERNAME || 'BROWSERSTACK_USERNAME',
  browserstackKey: process.env.BROWSERSTACK_ACCESS_KEY || 'BROWSERSTACK_ACCESS_KEY',
  allScriptsTimeout: 11000,
  specs: [
    './src/**/*.e2e-spec.ts'
  ],
  capabilities: {
    'os' : 'Windows',
    'os_version' : '10',
    'browserName' : 'Chrome',
    'browser_version' : '68.0',
    'browserstack.local': 'true',
    'project': 'Angular CLI with Protractor',
    'build': 'v 1.0',
    'name': 'browserstack-local'
  },
  directConnect: false,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 60000,
    print: function () {}
  },
  onPrepare() {
    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.e2e.json')
    });
    jasmine.getEnv().addReporter(new SpecReporter({
      spec: {
        displayStacktrace: true
      }
    }));
  },

  // Code to start browserstack local before start of test
  beforeLaunch: function () {
    console.log("Connecting local");
    return new Promise(function (resolve, reject) {
      exports.bs_local = new browserstack.Local();
      exports.bs_local.start({
        'key': exports.config['browserstackKey'],
        'verbose': 'true'
      }, function (error) {
        if (error) return reject(error);
        console.log('Connected. Now testing...');

        resolve();
      });
    });
  },

  // Code to stop browserstack local after end of test
  afterLaunch: function () {
    return new Promise(function (resolve, reject) {
      exports.bs_local.stop(resolve);
    });
  }
};
