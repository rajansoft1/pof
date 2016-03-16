module.exports = {
    // Development configuration options
    sessionSecret: 'intialQuoteStaging',
    db: 'mongodb://localhost/quoteCalculatorStage',
    getClientDetail: 'http://apps.homelane.com/webapi/customers/aG9tZWxhbmVvZmZsaW5lY2F0YWxvZw==/info?email=',
    getClientBucket: 'http://54.169.216.87:80/v1/customers/',
    log: {
        // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
        format: 'dev',
        // Stream defaults to process.stdout
        // Uncomment to enable logging to a log on the file system
        options: {
            //stream: 'access.log'
        }
    },
};
