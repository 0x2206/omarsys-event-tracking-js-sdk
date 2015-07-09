module.exports = function (grunt) {
    "use strict";

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Project configuration
    grunt.initConfig({

        // Project settings
        conf: {
            app: 'src',
            dist: 'web',
            out: '<%= conf.dist %>/track.min.js'
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= conf.app %>/**/*.js',
                '!<%= conf.app %>/bower_components/**/*.js'
            ]
        },

        // Compile
        requirejs: {
            uglified: {
                options: {
                    baseUrl: "./",
                    mainConfigFile: "<%= conf.app %>/main.js",
                    name: "<%= conf.app %>/main",
                    out: "<%= conf.out %>",
                    optimize: "uglify2",
                    paths: {
                        core: "<%= conf.app %>/core",
                        qwest: "bower_components/qwest/src/qwest",
                        uuid: "bower_components/node-uuid/uuid"
                    }
                }
            }
        },

        browserify: {
            "<%= conf.out %>": ["<%= conf.out %>"]
        },

        watch: {
            files: [ "<%= conf.app %>/**/*.js"],
            tasks: ["build", "jshint"]
        }

    });

    grunt.registerTask('default', ['jshint']);
    grunt.registerTask('build', [
        'requirejs:uglified',
        'browserify'
    ]);
};
