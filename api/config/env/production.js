module.exports = {
    // Development configuration options
    sessionSecret: 'e',
    db: 'mongodb://localhost/er',
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
