module.exports = {
    // Development configuration options
    sessionSecret: 'inventory',
    db: 'mongodb://localhost/parentof-dev',
    username: "meetshanu1991@gmail.com",//Info@parentof.com",
    password: "losuman",//"pikto2p2attempt",
    postActivation: 'http://kyc.parentof.com/#login',
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