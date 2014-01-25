module.exports = function (grunt) {

    // Load tasks
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-apidoc');

    grunt.initConfig({

        mochaTest: {
            all: {
                options: {
                    reporter: 'spec'
                },
                src: ['server/tests/**/*.js']
            },
            requirejs: {
                src: 'server/tests/**/*.js',
                options: {
                    reporter: 'spec',
                    rjsConfig: {
                        baseUrl: "./",
                        paths: {
                            foo: "bar/v1.0"
                        }
                    }
                }
            }
        },
        watch: {
            mochaTest: {
                files: [ 'server/tests/**/**/*.js',
                    'server/**/*.js',
                    'server/*.js',
                    '!node_module'    ],
                tasks: ['mochaTest'],
                options: {
                    spawn: true,
                    debounceDelay: 250
                }
            },
            jsdoc: {
                files: [ 'server/tests/**/**/*.js',
                    'server/**/*.js',
                    'server/*.js',
                    '!node_module',
                    'server/RAEDME.md'
                ],
                tasks: ['jsdoc'],
                options: {
                    spawn: true,
                    debounceDelay: 100
                }

            }
        },
        jsdoc: {
            dist: {
                src: [
                    'server/*.js',
                    'server/models/*js',
                    'server/controllers/*js',
                    'server/tests/integration/*.js',
                    'server/tests/unit/*.js',
                    'server/README.md'
                ],
                options: {
                    destination: 'docs/server/',
                    template: '../docstrap/template/',
                    config: 'jsDoc.conf.json'
                }
            }
        },
        apidoc: {
            server: {
                src: "server/",
                dest: "docs/api/",
                options: {
                    debug: true,
                    includeFilters: [ ".*\\.js$" ],
                    excludeFilters: [ "node_modules/" ],
                    marked: {
                        gfm: true
                    }
                }
            }
        }
    });

    grunt.registerTask('default', [
//        'lint',
        'test',
        'jsdoc']);
    grunt.registerTask('test', 'mochaTest:all');
    grunt.registerTask('watch-test', 'watch:mochaTest');
    grunt.registerTask('watch-doc', 'watch:jsdoc');

};
