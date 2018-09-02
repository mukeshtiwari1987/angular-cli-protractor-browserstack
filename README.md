# Test Angular CLI (5 or 6) webapp on BrowserStack Automate
[Protractor](https://github.com/angular/protractor/) Integration with BrowserStack.

![BrowserStack Logo](https://d98b8t1nnulk5.cloudfront.net/production/images/layout/logo-header.png?1469004780)

Install Angular CLI with following command. Skip if you have already installed
```sh
$ npm install -g @angular/cli
```

Create and move to the new project
```sh
$ ng new angular-cli-protractor-browserstack
$ cd angular-cli-protractor-browserstack
```
Let's verify if a Selenium test is running on local Chrome
```sh
$ ng e2e
```

If you were able to see test running on your local Chrome then lets make changes to execute the test on BrowserStack.

Install Node bindings for BrowserStack Local to make local website available on remote browser
```sh
$ npm install browserstack-local
```
Make following changes in e2e/protractor.conf.js:
```sh
# Add following after require('jasmine-spec-reporter')
const browserstack = require('browserstack-local');
# In exports.config block
browserstackUser: process.env.BROWSERSTACK_USERNAME || 'BROWSERSTACK_USERNAME',
browserstackKey: process.env.BROWSERSTACK_ACCESS_KEY || 'BROWSERSTACK_ACCESS_KEY',
# Replace exisiting capabilities block with following
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
# Change directConnect value to false
directConnect: false,
# After onPrepare function add following
# Code to start browserstack local before start of test
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
# Code to stop browserstack local after end of test
afterLaunch: function () {
    return new Promise(function (resolve, reject) {
      exports.bs_local.stop(resolve);
    });
}
```
Once done, execute following to run test on BrowserStack
```sh
$ ng e2e
```
This was tested with Angular CLI: 6.1.5