module.exports = function(grunt) {

    grunt.initConfig({
        bower: grunt.file.readJSON('bower.json'),
        concat: {
            options: {
                banner: '/*!\n' +
                        ' * @name <%= bower.name %>\n' +
                        ' * @version v<%= bower.version %>\n' +
                        ' * @author <%= bower.authors[0]  %>\n' +
                        ' * @see <%= bower.homepage %>\n' +
                        ' */\n' +
                        ';(function(root, factory) {\n' +
                        '   if (typeof module === \'object\' && typeof module.exports === \'object\') {\n' +
                        '       module.exports = factory(require(\'jquery\'));\n' +
                        '   } else {\n' +
                        '       root.jQuery.fly = factory(root.jQuery);\n' +
                        '   }\n' +
                        '})(this, function($) {\n',
                footer: '   return fly;\n' +
                        '});'
            },
            full: {
                src: [
                    'src/fly.js',
                    'src/component.base.js',
                    'src/mixin.rect.js',
                    'src/mixin.position.js',
                    'src/component.tooltip.js',
                    'src/component.dropdown.js',
                    'src/jquery.fly.js'
                ],
                dest: 'fly.full.js'
            }
        },
        watch: {
            src: {
                files: ['Gruntfile.js', 'src/*.js', 'src/*.css'],
                tasks: ['concat', 'jshint', 'postcss:dist']
            }
        },
        jshint: {
            options: {
                jshintrc: true
            },
            all: ['Gruntfile.js', 'src/*.js', '*.js']
        },
        postcss: {
            options: {
                processors: [
                    require('autoprefixer')({
                        browsers: ['last 2 versions']
                    })
                ]
            },
            dist: {
                src: 'src/popover.css',
                dest: 'css/popover.css'
            }
        }
    });

    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['concat', 'jshint', 'postcss:dist']);
};
