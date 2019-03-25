"use strict";

const webpackConfig = require('./webpack.config.js');

module.exports = function (grunt) {
    require('time-grunt')(grunt);

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        webpack: {
            prod: webpackConfig,
            dev: Object.assign({ watch: true }, webpackConfig)
        },
        eslint: {
            options: {
                config: '.eslintrc.json',
                reset: true
            },
            target: ['app/**/*.js', 'lib/**/*.js', 'template/global/js/push-notification.js']
        },
        jsdoc: {
            dist: {
                src: ['lib/**/*.js', 'app/**/*.js'],
                options: {
                    tutorials: 'tutorials',
                    destination: 'doc',
                    template: 'node_modules/ink-docstrap/template',
                    configure: 'node_modules/ink-docstrap/template/jsdoc.conf.json'
                }
            }
        },
        watch: {
            all: {
                files: ['app/**/**/*.js', 'lib/**/**/*.js', 'test/**/**/*.js', 'test/content/**/*.md', 'config/*.js',
                    'template/**/**/*.html', 'template/global/js/push-notification.js'],
                tasks: ['lint', 'buster:unit', 'doc']
            }
        },
        watchtest: {
            all: {
                files: ['app/**/*.js', 'lib/**/*.js', 'test/**/*.js', 'test/content/**/*.md', 'config/*.js',
                    'template/**/**/*.html', 'template/global/js/push-notification.js'],
                tasks: ['buster:unit'],
            }
        },
        retire: {
            js: ['app/**/*.js', 'lib/**/*.js'], /** Which js-files to scan. **/
            node: ['node'], /** Which node directories to scan (containing package.json). **/
            options: {
                verbose: true,
                packageOnly: true,
                jsRepository: 'https://raw.github.com/RetireJS/retire.js/master/repository/jsrepository.json',
                nodeRepository: 'https://raw.github.com/RetireJS/retire.js/master/repository/npmrepository.json',
                ignorefile: '.retireignore' /** list of files to ignore **/
            }
        },
        buster: {
            unit: {
            }
        },
        nodemon: {
            dev: {
                options: {
                    script: 'app/server.js',
                    ext: 'js,json,html',
                    ignore: ['node_modules/*', 'template/*', 'sessions/*', 'preact/*'],
                    args: ['-c', '../config/config.js'],
                    env: {
                        nodeEnv: 'development'
                    }
                },
                tasks: ['eslint', 'buster:unit']
            },
            dev_local: {
                options: {
                    script: 'app/server.js',
                    ext: 'js,json,html',
                    ignore: ['node_modules/*', 'template/*', 'sessions/*', 'preact/*'],
                    args: ['-c', '../config/config-local.js'],
                    env: {
                        nodeEnv: 'development'
                    }
                },
                tasks: ['eslint', 'buster:unit']
            }
        },
        shell: {
            getLatestTag: {
                command: 'git describe --abbrev=0 --tags',
                options: {
                    callback: function (err, stdout, stderr, cb) {
                        stdout = stdout.trim();
                        // If we have a leading 'v' in the version, remove it
                        if (stdout.substring(0, 1) === 'v') {
                            stdout = stdout.substring(1);
                        }
                        console.log('Latest tag: ' + stdout);
                        grunt.config.set('latestTag', stdout);
                        console.log('s3cmd put artifact/' + stdout + '.tar.gz s3://simple-blog-releases/');
                        console.log('');
                        console.log('PS! Remember to upload a corresponding config tar-ball to s3://simple-blog-<purpose>-configs');
                        cb();
                    }
                }
            },
            multiple: {
                command: [
                    'mkdir -p artifact',
                    'mv ./node_modules ./node_modules2',
                    'npm install --production',
                    'tar --exclude "./.git*" --exclude "./node_modules2" --exclude "./test*" --exclude "./artifact" --exclude "./app/config/config*" --exclude "./.idea" --exclude "./dev" -zcf artifact/<%= latestTag %>.tar.gz .',
                    'rm -rf node_modules',
                    'mv ./node_modules2 ./node_modules',
                    'bash changelog.sh'
                ].join('&&')
            }
        },
        coveralls: {
            real_coverage: {
                src: 'coverage/lcov.info'
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    // Rename watch to watchdev and load it again
    grunt.renameTask('watch', 'watchtest');
    // Load it again.
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-buster');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-coveralls');
    grunt.loadNpmTasks('grunt-retire');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-webpack');

    // Default task.
    grunt.registerTask('es', ['eslint']);
    grunt.registerTask( "lint", [ "eslint" ] );

    grunt.registerTask('default', ['lint', 'buster:unit', 'doc', 'retire']);
    grunt.registerTask('doc', ['jsdoc']);
    grunt.registerTask('test', 'buster:unit');
    grunt.registerTask('check', ['watch']);
    grunt.registerTask('run', ['buster:unit', 'nodemon:dev']);
    grunt.registerTask('run-local', ['buster:unit', 'nodemon:dev_local']);
    grunt.registerTask('artifact', ['shell', 'coveralls:real_coverage']);
    grunt.registerTask('report', ['coveralls:real_coverage']);
    grunt.registerTask('build', ['webpack']);

};
