module.exports = function(grunt) {
  grunt.option('stack', true);
  grunt.loadNpmTasks(["grunt-embark", "grunt-version", "grunt-protractor-runner", "grunt-tagrelease", "grunt-git", "grunt-contrib-connect", "grunt-contrib-compress"]);
  grunt.loadTasks("tasks");
  grunt.initConfig({
    connect: {
      generated: {
        options: {
          port: 8000,
          base: "generated/dapp"
        }
      }
    },
    gitcheckout: {
      master: {
        options: {
          branch: "master"
        }
      },
      ghpages: {
        options: {
          branch: "gh-pages"
        }
      }
    },
    gitmerge: {
      master: {
        options: {
          branch: "master",
          force: true
        }
      }
    },
    gitadd: {
      all: {
        options: {
          all: true
        }
      }
    },
    gitcommit: {
      release: {
        options: {
          message: "release"
        }
      }
    },
    gitpush: {
      master: {
        options: {
          tags: true,
          origin: 'origin',
          branch: 'master'
        }
      },
      ghpages: {
        options: {
          tags: true,
          origin: 'origin',
          branch: 'gh-pages'
        }
      }
    },
    version: {
      project: {
        src: "package.json"
      }
    },
    protractor: {
      options: {
        keepAlive: false
      },
      all: {
        configFile: "protractor.conf.js",
        args: {
          '--save': ''
        }
      }
    },
    electron: {
      osxBuild: {
        options: {
          version: "0.34.3",
          name: "SafeMarket",
          dir: "generated/dapp",
          platform: "all",
          arch: "x64",
          out: "packages/latest"
        }
      }
    },
    tagrelease: {
      file: 'package.json',
      commit: true,
      message: 'Release %version%',
      annotate: false,
      prefix: 'v'
    },
    compress: {
      darwin: {
        options: null,
        src: ['packages/latest/SafeMarket-darwin-x64/']
      },
      win32: {
        src: ['packages/latest/SafeMarket-win32-x64/']
      },
      linux: {
        src: ['packages/latest/SafeMarket-linux-x64/']
      }
    },
    files: {
      electron: {
        src: ["main.js", "package.json"]
      },
      web3: "app/js/web3.js",
      js: {
        src: ["node_modules/solc/bin/soljson-latest.js", "bower_components/crypto-js/build/rollups/aes.js", "bower_components/msgpack-javascript/msgpack.js", "bower_components/cryptocoin/dist/cryptocoin.js", "bower_components/validate/validate.min.js", "bower_components/lodash/lodash.min.js", "bower_components/q/q.js", "bower_components/openpgp/dist/openpgp.js", "bower_components/bignumber.js/bignumber.js", "bower_components/marked/lib/marked.js", "bower_components/angular/angular.js", "bower_components/angular-route/angular-route.min.js", "bower_components/angular-growl/build/angular-growl.min.js", "bower_components/angular-timeago/dist/angular-timeago.js", "bower_components/angular-bootstrap/ui-bootstrap-tpls.js", "bower_components/angular-marked/angular-marked.js", "bower_components/angular-sanitize/angular-sanitize.min.js", "bower_components/angular-ui-router/release/angular-ui-router.min.js", "app/js/app.js", "app/js/safemarket.js", "app/js/**/*.js"]
      },
      css: {
        src: ["bobower_components/angular/angular-csp.css", "bower_components/bootstrap/dist/css/bootstrap.min.css", "assets/slim/dist/styles/main.css", "bower_components/angular-growl/build/angular-growl.min.css", "app/css/**/*.css"]
      },
      html: {
        src: ["app/html/**/*.html"]
      },
      fonts: {
        src: ["bower_components/bootstrap/fonts/glyphicons-halflings-regular.woff2", "assets/slim/dist/fonts/glyphicons-halflings-regular.woff", "assets/slim/dist/fonts/glyphicons-halflings-regular.ttf"]
      },
      coffee: {
        dest: "generated/dapp/compiled-coffee",
        compiled: ["generated/dapp/compiled-coffee/app.coffee", "generated/dapp/compiled-coffee/**/*.js"]
      },
      contracts: {
        src: ["app/contracts/**/*.sol"]
      }
    },
    coffee: {
      compile: {
        expand: true,
        cwd: 'coffee',
        src: '**/*.coffee',
        dest: '<%= files.coffee.dest %>',
        ext: '.js'
      }
    },
    concat: {
      app: {
        src: ["<%= files.web3 %>", 'generated/tmp/abi.js', "<%= files.js.src %>", "<%= files.coffee.compiled %>"],
        dest: "generated/dapp/js/app.min.js"
      },
      css: {
        src: "<%= files.css.src %>",
        dest: "generated/dapp/css/app.min.css"
      }
    },
    watch: {
      options: {
        livereload: true
      },
      html: {
        files: ["<%= files.html.src %>"],
        tasks: ["copy"]
      },
      js: {
        files: ["<%= files.js.src %>", "<%= files.web3 %>"],
        tasks: ["concat"]
      },
      css: {
        files: ["<%= files.css.src %>"],
        tasks: ["concat"]
      },
      coffee: {
        files: ["coffee/**/*.coffee"],
        tasks: ["coffee", "concat"]
      },
      contracts: {
        files: ["<%= files.contracts.src %>"],
        tasks: ["deploy", "concat", "copy"]
      },
      config: {
        files: ["config/blockchain.yml", "config/contracts.yml", "Gruntfile.coffee"],
        tasks: ["deploy", "concat", "copy"]
      }
    },
    copy: {
      electron: {
        files: [
          {
            expand: true,
            src: ["<%= files.electron.src %>"],
            dest: 'generated/dapp/',
            flatten: true
          }
        ]
      },
      html: {
        files: [
          {
            expand: true,
            src: ["<%= files.html.src %>"],
            dest: 'generated/dapp/',
            flatten: true
          }
        ]
      },
      fonts: {
        files: [
          {
            expand: true,
            src: ["<%= files.fonts.src %>"],
            dest: 'generated/dapp/fonts',
            flatten: true
          }
        ]
      },
      css: {
        files: {
          "dist/dapp/css/app.min.css": "<%= files.css.src %>"
        }
      },
      contracts: {
        files: {
          "dist/contracts/": '<%= files.contracts.src %>'
        }
      }
    },
    uglify: {
      dist: {
        src: "<%= concat.app.dest %>",
        dest: "dist/dapp/js/app.min.js"
      }
    },
    clean: {
      workspaces: ["dist", "generated"]
    },
    deploy: {
      contracts: '<%= files.contracts.src %>',
      dest: 'generated/tmp/abi.js'
    }
  });
  require('matchdep').filterAll('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.registerTask("deploy", ["copy", "coffee", "deploy_contracts", "concat", "copy", "server", "watch"]);
  grunt.registerTask("build", ["copy", "clean", "deploy_contracts", "coffee", "concat", "uglify", "copy"]);
  grunt.registerTask("release", ["connect:generated", "gitcheckout:ghpages", "gitmerge:master", "protractor", "version::patch", "move_reports", "electron", "move_packages", "gitadd:all", "gitcommit:release", "tagrelease", "gitpush:ghpages", "gitcheckout:master", "version::patch", "gitadd:all", "gitcommit:release", "gitpush:master"]);
  grunt.registerTask("move_reports", function() {
    var fs, packageJson, packageObj;
    fs = require('fs');
    packageJson = fs.readFileSync('package.json', 'utf8');
    packageObj = JSON.parse(packageJson);
    return fs.renameSync('reports/latest', 'reports/' + packageObj.version);
  });
  return grunt.registerTask("move_packages", function() {
    var fs, packageJson, packageObj;
    fs = require('fs');
    packageJson = fs.readFileSync('package.json', 'utf8');
    packageObj = JSON.parse(packageJson);
    return fs.renameSync('packages/latest', 'packages/' + packageObj.version);
  });
};

// ---
// generated by coffee-script 1.9.2