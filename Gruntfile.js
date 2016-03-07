require('colors');
var jsdiff = require('diff');
var fs = require('fs');
var _ = require('lodash');
var pkg = require('./package.json');

var paths = {
  dist: 'dist/',
  src: 'src/',
  sassCache: '.sass-cache/',
  sass: 'src/styles/sass/',
  less: 'src/styles/less/',
  scripts: 'src/scripts/',
  styles: 'src/styles/',
  test: 'test/',
  testCSS: 'test/css-files/',
  testLESS: 'test/css-files/less/',
  testSASS: 'test/css-files/sass/',
};

var moduleName = _.camelCase(pkg.name);

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
            ' * ngToast v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
            ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' * Licensed under <%= pkg.license %> (http://tameraydin.mit-license.org/)\n' +
            ' */\n',
    karma: {
      unit: {
        configFile: paths.test + 'karma.conf.js',
        singleRun: true
      }
    },
    clean: {
      dist: {
        src: [paths.dist]
      },
      sass: {
        src: [paths.sassCache]
      }
    },
    concat: {
      options: {
        stripBanners: {
          'block': true,
          'line': true
        }
      },
      dist: {
        src: [
          paths.scripts + 'provider.js',
          paths.scripts + 'directives.js',
          paths.scripts + 'module.js'
        ],
        dest: paths.dist + moduleName + '.js'
      }
    },
    sass: {
      dist: {
        files: [
          {
            src: paths.sass + 'ngToast.scss',
            dest: paths.dist + 'ngToast.css'
          },
          {
            src: paths.sass + 'ngToast-animations.scss',
            dest: paths.dist + 'ngToast-animations.css'
          }
        ]
      },
      test: {
        files: [
          {
            src: paths.sass + 'ngToast.scss',
            dest: paths.testSASS + 'ngToast.css'
          },
          {
            src: paths.sass + 'ngToast-animations.scss',
            dest: paths.testSASS + 'ngToast-animations.css'
          }
        ]
      }
    },
    less: {
      test: {
        files: [
          {
            expand: true,
            cwd: paths.less,
            src: ['ngToast.less', 'ngToast-animations.less'],
            dest: paths.testLESS,
            ext: '.css'
          }
        ]
      }
    },
    cssbeautifier: {
      files: [paths.testCSS + '**/*.css']
    },
    cssmin: {
      minify: {
        options: {
          keepSpecialComments: 0
        },
        expand: true,
        src: paths.dist + '*.css',
        ext: '.min.css'
      }
    },
    autoprefixer: {
      dist: {
        options: {
          browsers: ['last 2 versions']
        },
        expand: true,
        flatten: true,
        src: paths.dist + '*.css',
        dest: paths.dist
      }
    },
    uglify: {
      build: {
        src: paths.dist + moduleName + '.js',
        dest: paths.dist + moduleName + '.min.js'
      }
    },
    usebanner: {
      options: {
        position: 'top',
        banner: '<%= banner %>'
      },
      files: {
        src: [
          paths.dist + '*'
        ]
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: paths.scripts + '*.js'
    },
    watch: {
      src: {
        files: [paths.src + '**/*.*'],
        tasks: [
          'default',
        ],
        options: {
          spawn: false,
        },
      },
    },
  });

  grunt.registerTask('test-generated-css', function() {
    this.requires('less:test');
    this.requires('sass:test');
    this.requires('cssbeautifier');

    var sassBaseCSS = grunt.file.read(paths.testSASS + 'ngToast.css');
    var sassAnimationsCSS = grunt.file.read(paths.testSASS + 'ngToast-animations.css');
    var lessBaseCSS = grunt.file.read(paths.testLESS + 'ngToast.css');
    var lessAnimationsCSS = grunt.file.read(paths.testLESS + 'ngToast-animations.css');
    grunt.file.delete('test/css-files');

    if (lessBaseCSS === sassBaseCSS && lessAnimationsCSS === sassAnimationsCSS) {
      // pass
      grunt.log.ok('LESS/SASS generated CSS matches.');
    } else {
      // fail
      var headerFooter = 'SASS differences\n'.magenta + 'LESS differences\n\n'.blue;
      var baseDiff = jsdiff.diffCss(lessBaseCSS, sassBaseCSS);
      var animationDiff = jsdiff.diffCss(lessAnimationsCSS, sassAnimationsCSS);

      grunt.log.write(headerFooter);

      baseDiff.forEach(function(line) {
        var color = line.added ? 'magenta' : line.removed ? 'blue' : 'gray';
        grunt.log.write(line.value[color]);
      });

      animationDiff.forEach(function(line) {
        var color = line.added ? 'magenta' : line.removed ? 'blue' : 'gray';
        grunt.log.write(line.value[color]);
      });

      grunt.log.write(headerFooter);
      grunt.fail.warn('Generated LESS/SASS CSS does not match!', 6);
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-cssbeautifier');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-banner');
  grunt.registerTask('default', [
    'sass:test',
    'clean:sass',
    'less:test',
    'cssbeautifier',
    'test-generated-css',
    'jshint',
    'karma',
    'clean:dist',
    'concat',
    'sass:dist',
    'clean:sass',
    'autoprefixer:dist',
    'cssmin',
    'uglify',
    'usebanner'
  ]);
};
