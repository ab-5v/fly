module.exports = function(grunt) {

    grunt.initConfig({
        bower: grunt.file.readJSON('bower.json'),
        concat: {
            options: {
                banner: '/*!\n' +
                        ' * @name <%= bower.name %>\n' +
                        ' * @version v<%= bower.version %>\n' +
                        ' * @author <%= bower.authors[0]  %>\n' +
                        ' */\n' +
                        ';(function() {\n',
                footer: '})();'
            },
            full: {
                src: [
                    'src/fly.js',
                    'src/component.base.js',
                    'src/mixin.rect.js',
                    'src/mixin.position.js',
                    'src/component.tooltip.js',
                    'src/component.dropdown.js',
                    'src/jquery.dropdown.js'
                ],
                dest: 'fly.full.js'
            }
        },
        watch: {
            src: {
                files: ['src/*.js'],
                tasks: ['concat']
            }
        }
    });


    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
};
