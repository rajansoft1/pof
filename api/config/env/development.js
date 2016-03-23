module.exports = {
    // Development configuration options
    sessionSecret: 'inventory',
    db: 'mongodb://localhost/parentof-dev',
    postActivation: 'http://localhost:8080/#login',
    log: {
        // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
        format: 'dev',
        // Stream defaults to process.stdout
        // Uncomment to enable logging to a log on the file system
        options: {
            //stream: 'access.log'
        }
    }
};