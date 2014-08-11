var fs = require('fs');

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
            ' * ngToast v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
            ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n' +
            ' */\n',
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    },
    clean: {
      dist: {
        src: ['dist/']
      },
      sass: {
        src: ['.sass-cache/']
      }
    },
    concat: {
      options: {
        stripBanners: {
          'block': true,
          'line': true
        },
        banner: '<%= banner %>'
      },
      dist: {
        src: ['src/scripts/provider.js', 'src/scripts/directives.js', 'src/scripts/module.js'],
        dest: 'dist/ngToast.js'
      }
    },
    compass: {
      dist: {
        options: {
          noLineComments: true,
          sassDir: 'src/styles',
          cssDir: 'dist/',
          banner: '<%= banner %>',
          specify: 'src/styles/ngToast.scss'
        }
      }
    },
    cssmin: {
      minify: {
        options: {
          banner: '<%= banner %>',
          keepSpecialComments: 0
        },
        expand : true,
        src: 'dist/*.css',
        ext: '.min.css'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      build: {
        src: 'dist/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: 'src/scripts/*.js'
    }
  });

  grunt.registerTask('version', function(file_version) {
    var bower = grunt.file.readJSON('bower.json');
    var npm_package = grunt.file.readJSON('package.json');

    bower.version = file_version;
    npm_package.version = file_version;

    fs.writeFileSync('bower.json', JSON.stringify(bower, null, 4));
    fs.writeFileSync('package.json', JSON.stringify(npm_package, null, 4));
  })

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-karma');
  grunt.registerTask('default', [
    'jshint',
    'karma',
    'clean:dist',
    'concat',
    'compass',
    'clean:sass',
    'cssmin',
    'uglify'
  ]);
};
