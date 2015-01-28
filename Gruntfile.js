require('colors');
var jsdiff = require('diff');
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
          sassDir: 'src/styles/sass',
          cssDir: 'dist/',
          banner: '<%= banner %>',
          specify: 'src/styles/sass/ngToast.scss'
        }
      },
      test: {
        options: {
          noLineComments: true,
          sassDir: 'src/styles/sass',
          cssDir: 'test/css-files',
          specify: 'src/styles/sass/ngToast.scss'
        }
      }
    },
    less: {
      test: {
        files: {
          "test/css-files/ngToast.less.css": "src/styles/less/ngToast.less"
        }
      }
    },
    cssbeautifier: {
      files: ['test/css-files/**/*.css']
    },
    cssmin: {
      minify: {
        options: {
          banner: '<%= banner %>',
          keepSpecialComments: 0
        },
        expand: true,
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
  });

  grunt.registerTask('test-generated-css', function() {
    this.requires('less:test');
    this.requires('compass:test');
    this.requires('cssbeautifier');

    var sassCSS = grunt.file.read('./test/css-files/ngToast.css');
    var lessCSS = grunt.file.read('./test/css-files/ngToast.less.css');
    grunt.file.delete('test/css-files');

    if (lessCSS === sassCSS) {
      // pass
      grunt.log.ok('LESS/SASS generated CSS matches.');
    } else {
      // fail
      var headerFooter = 'SASS differences\n'.magenta + 'LESS differences\n\n'.blue;
      var diff = jsdiff.diffCss(lessCSS, sassCSS);

      grunt.log.write(headerFooter);

      diff.forEach(function(line) {
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
  grunt.loadNpmTasks('grunt-karma');
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
    'cssmin',
    'uglify'
  ]);
};
