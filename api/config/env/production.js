module.exports = {
    // Development configuration options
    sessionSecret: 'intialQuoteProduction',
    db: 'mongodb://localhost/quoteCalculatorProd',
    getClientDetail: 'http://apps.homelane.com/webapi/customers/aG9tZWxhbmVvZmZsaW5lY2F0YWxvZw==/info?email=',
    getClientBucket: 'http://artifactservice.homelane.com/v1/customers/',
    log: {
        // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
        format: 'prod',
        // Stream defaults to process.stdout
        // Uncomment to enable logging to a log on the file system
        options: {
            //stream: 'access.log'
        }
    },
};
