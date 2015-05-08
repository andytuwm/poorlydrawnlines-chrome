module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                preserveComments: false,
                screwIE8: true
            },
            my_target: {
                files: {
                    'bin/main.js': ['main.js']
                }
            }
        },
        htmlmin: { // Task
            dist: { // Target
                options: { // Target options
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: { // Dictionary of files
                    'bin/index.html': 'index.html', // 'destination': 'source'
                }
            }
        },
        cssmin: {
            target: {
                files: {
                    'bin/css/index.css': ['css/index.css']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('default', ['uglify', 'htmlmin', 'cssmin']);
};