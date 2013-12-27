// Requires
var Q = require('q');
var _ = require('underscore');

var ss = require('socket.io-stream');
var es = require('event-stream');

var Shell = require('./shell').Shell;


function ShellSocketManager(manager) {
    this.manager = manager;

    _.bindAll(this);
}

ShellSocketManager.prototype.handleStream = function(stream, shellId, opts) {
    // Input data
    var manager = this.manager;

    // Build new shell
    var shell = new Shell(
        manager,
        shellId,
        stream,
        opts
    );

    // Initialize
    shell
    .init()
    .then(function(shell) {
        // Shell is ready
    });
    return stream;
};


function setup(options, imports, register) {
    // Import
    var shellManager = imports.shells;
    var io = imports.socket_io.io;
    var events = imports.events;
    var shells_rpc = imports.shells_rpc;

    var socketManager = new ShellSocketManager(shellManager);

    // Construct
    io.of('/stream/shells').on('connection', function(socket) {
        ss(socket).on('shell.open', function(stream, data) {
            events.emit('shell.open', {
                'shellId': data.shellId
            });

            // Default options
            data.opts = _.defaults(data.opts, {
                'arguments': []
            });

            // Open up shell
            socketManager.handleStream(stream, data.shellId, data.opts);
        });

        socket.on('shell.destroy', function (data) {
            shells_rpc.destroy(data)
            .then(function() {
                events.emit('shell.destroy', data);
            });
        });

        socket.on('shell.resize', function(data) {
            shells_rpc.resize(data)
            .then(function() {
                events.emit('shell.resize', data);
            });
        });
    });

    // Register
    register(null, {});
}

// Exports
module.exports = setup;
