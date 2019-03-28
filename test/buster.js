var config = module.exports;

config['My tests'] = {
    environment: 'node',
    rootPath: '../',
    tests: [
        //'all-tests.js'
        'test/**/**/*.js'
    ],
    sources: [
        'lib/**/**/*.js',
        'app/routes/**/*.js',
        '!Gruntfile.js'
    ]
};
