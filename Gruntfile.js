require('colors');
var jsdiff = require('diff');
var fs = require('fs');
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

var moduleName = pkg.name.toLowerCase();

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
        },
        banner: '<%= banner %>'
      },
      dist: {
        src: [paths.scripts + 'provider.js', paths.scripts + 'directives.js', paths.scripts + 'module.js'],
        dest: paths.dist + moduleName + '.js'
      }
    },
    compass: {
      dist: {
        options: {
          noLineComments: true,
          sassDir: paths.sass,
          cssDir: paths.dist,
          banner: '<%= banner %>',
          specify: [paths.sass + 'ngtoast.scss', paths.sass + 'ngtoast-animations.scss']
        }
      },
      test: {
        options: {
          noLineComments: true,
          sassDir: paths.sass,
          cssDir: paths.testSASS,
          specify: [paths.sass + 'ngtoast.scss', paths.sass + 'ngtoast-animations.scss']
        }
      }
    },
    less: {
      test: {
        files: [
          {
            expand: true,
            cwd: paths.less,
            src: ['ngtoast.less', 'ngtoast-animations.less'],
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
          banner: '<%= banner %>',
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
      options: {
        banner: '<%= banner %>'
      },
      build: {
        src: paths.dist + moduleName + '.js',
        dest: paths.dist + moduleName + '.min.js'
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

  grunt.registerTask('version', function(file_version) {
    var bower = grunt.file.readJSON('bower.json');
    var npm_package = grunt.file.readJSON('package.json');

    bower.version = file_version;
    npm_package.version = file_version;

    fs.writeFileSync('bower.json', JSON.stringify(bower, null, 4));
    fs.writeFileSync('package.json', JSON.stringify(npm_package, null, 4));
  });

  grunt.registerTask('test-generated-css', function() {
    this.requires('less:test');
    this.requires('compass:test');
    this.requires('cssbeautifier');

    var sassBaseCSS = grunt.file.read(paths.testSASS + 'ngtoast.css');
    var sassAnimationsCSS = grunt.file.read(paths.testSASS + 'ngtoast-animations.css');
    var lessBaseCSS = grunt.file.read(paths.testLESS + 'ngtoast.css');
    var lessAnimationsCSS = grunt.file.read(paths.testLESS + 'ngtoast-animations.css');
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
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-cssbeautifier');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', [
    'compass:test',
    'clean:sass',
    'less:test',
    'cssbeautifier',
    'test-generated-css',
    'jshint',
    'karma',
    'clean:dist',
    'concat',
    'compass:dist',
    'clean:sass',
    'autoprefixer:dist',
    'cssmin',
    'uglify',
  ]);
};
