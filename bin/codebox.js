#!/usr/bin/env node
var _ = require('underscore');
var cli = require('commander');
var pkg = require('../package.json');
var codebox = require("../index.js");

// Command 'run'
cli.command('run')
.description('Run a Codebox into a folder.')
.action(function() {
    var path = this.directory || "./";
    var config = {
        'root': path,
        'title': this.title
    };

    // Use CodeNow
    if (this.box) {
        var host = this.codenow || "https://codenow.io";
        _.extend(config, {
            'title': this.box,
            'hooks': {
                'auth': host+"/api/box/"+this.box+"/user",
                'events': host+"/api/box/"+this.box+"/events"
            },
            'webhook': {
                'authToken': this.key
            }
        });
    }
    console.log("start codebox with config ", config);
    codebox.start(config).fail(function(err) {

        console.error('Error initializing CodeBox');
        console.error(err);
        console.error(err.stack);

        // Kill process
        process.exit(1);
    });
});

// Command 'create'
cli.command('create [git]')
.description('Create a new codebox from a git repository.')
.action(function(gitUrl) {
    
});

cli.on('--help', function(){
    console.log('  Examples:');
    console.log('');
    console.log('    $ codebox run -d ./myProject');
    console.log('    $ codebox create https://github.com/FriendCode/codebox.git');
    console.log('');
});


cli.option('-d, --directory <path to project directory>', 'Define working directory for the project.');
cli.option('-t, --title <title>', 'Title for the project.');
cli.option('-b, --box <box id>', 'CodeNow Bow to configure for.');
cli.option('-k, --key <web token>', 'CodeNow Bauth token.');
cli.option('-c, --codenow <codenow host>', 'CodeNow host (ex: http://localhost, https://codenow.io, ...).');

cli.version(pkg.version).parse(process.argv);
if (!cli.args.length) cli.help();

