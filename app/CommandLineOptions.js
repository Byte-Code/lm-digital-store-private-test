const argv = require('electron').remote.process.argv;

export const isDebugMode = argv.indexOf('--debug') > 0;
export const isDevToolMode = argv.indexOf('--dev-tool') > 0;
export const isAnalyticsLogMode = argv.indexOf('--log-analytics') > 0;

// wiejfhiwefiojwe
