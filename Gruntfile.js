module.exports = function(grunt) {

    // Load tasks
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({

        mochaTest: {
            all: {
                options: {
                    reporter: 'spec'
                },
                src: ['server/tests/**/*.js']
            }
        },
        watch:{
            files:[ 'server/tests/**/**/*.js',
                    'sever/**/*.js',
                    'server/*.js',
                    '!node_module'    ],
            tasks:['mochaTest'],
            options: {
                spawn: true,
                debounceDelay: 250
            }
        }

    });

    grunt.registerTask('test', 'mochaTest:all');

};
