//----------------------------------------------------------------------------------------------------------------------
// TrivialPermissions Gruntfile
//----------------------------------------------------------------------------------------------------------------------

module.exports = function(grunt)
{
    grunt.initConfig({
        clean: {
            js: [
                'dist/**/*.*',
                '!dist/*.min.js'
            ]
        },
        browserify: {
            options: {
                banner: "/* TrivialPermissions v" + require('./package').version + " */",
                transform: [ ["babelify"] ],
                plugin: [ ["minifyify", { map: false }] ],
                browserifyOptions: {
                    standalone: 'trivialperms'
                }
            },
            web: {
                files: {
                    "dist/trivialperms.min.js": "src/trivialperms.js"
                }
            }
        },
        eslint: {
            src: {
                src: ['Gruntfile.js', 'src/**/*.js'],
                options: { configFile: '.eslintrc.yml' }
            },
            test: {
                src: ['test/**/*.js'],
                options: { configFile: 'test/.eslintrc.yml' }
            }
        }
    });

    //------------------------------------------------------------------------------------------------------------------

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks("grunt-browserify");
    grunt.loadNpmTasks("gruntify-eslint");

    //------------------------------------------------------------------------------------------------------------------

    grunt.registerTask("build", ["eslint", "clean", "browserify"]);
    grunt.registerTask("default", ["build"]);

    //------------------------------------------------------------------------------------------------------------------
};

//----------------------------------------------------------------------------------------------------------------------
