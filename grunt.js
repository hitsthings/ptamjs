module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-concat');

  function concatFileLists() {
    var args = Array.prototype.slice.call(arguments);
    var ret = [];
    while(args.length) {
      var list = args.shift();
      if (list instanceof Array) {
        ret = ret.concat(list);
      } else {
        ret.push(list);
      }
    }
    return ret;
  }
  var coreFiles = [
    'lib/tracker.js',
    'lib/mapper.js',
    'lib/ptam.js'
  ];

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    test: {
      files: ['test/**/*.js']
    },
    lint: {
      files: ['grunt.js', 'lib/**/*.js', 'test/**/*.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'default'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true,
        strict: false
      },
      globals: {
        exports: true
      }
    },
    concat: {
      node:{
        src : concatFileLists(['lib/node_deps.js'], coreFiles, ['lib/node_exports.js']),
        dest: 'build/ptam_node.js',
        separator : '\n'
      },
      browser:{
        src : concatFileLists(['lib/browser_deps.js'], coreFiles),
        dest: 'temp/ptam_browser.js',
        separator : '\n'
      }
    },
    min: {
      browser: {
        src: 'build/ptam.js',
        dest: 'build/ptam.min.js'
      }
    }
  });

  // Default task.
  grunt.registerTask('default', 'lint concat wrapbrowser min');

  grunt.registerTask('wrapbrowser', 'things', function() {
    var fs = require('fs');
    var body = fs.readFileSync('temp/ptam_browser.js', 'utf8');
    var browserTemplate = fs.readFileSync('helper/browser.mustache', 'utf8');
    fs.writeFileSync('build/ptam.js', require('mustache').render(browserTemplate, {
      body : body
    }));
  });
};