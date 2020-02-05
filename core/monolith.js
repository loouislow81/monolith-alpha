// Requires
var Q = require('q');
var _ = require('lodash');

var os = require('os');
var path = require('path');
var Gittle = require('gittle');
var engineer = require('engineer');

var LOCAL_SETTINGS_DIR = path.join(
    process.env.HOME,
    'settings'
);

var start = function(config) {
    var monolithGitRepo = new Gittle(path.resolve(__dirname, ".."));
    var prepare = Q();

    // Options
    config = _.merge({
        'root': process.env.WORKSPACE_DIR || process.cwd(),
        'title': process.env.WORKSPACE_NAME,
        'public': process.env.WORKSPACE_PUBLIC != "false",
        'dev': process.env.DEV != null,
        'workspace': {
            'id': null // Default will be a hash of the root path
        },
        'hooks': {
            // Hooks could be:
            //  - string: considered as url
            //  - function: fucntion is called
            //  - null: default behavior


            // Auth: send auth infos and get status and user settings
            'auth': process.env.WORKSPACE_HOOK_AUTH,

            // Events: send events to a hook
            'events': process.env.WORKSPACE_HOOK_EVENTS,

            // Settings: send user settings to a hook
            'settings': process.env.WORKSPACE_HOOK_SETTINGS,

            // Valid addons installation with a hook
            'addons': process.env.WORKSPACE_HOOK_ADDONS
        },
        'webhook': {
            // Token to pass as Authorization header
            'authToken': process.env.WORKSPACE_HOOK_TOKEN
        },
        'addons': {
            // Base path
            'path': process.env.WORKSPACE_ADDONS_DIR || path.join(LOCAL_SETTINGS_DIR, 'addons'),
            'defaultsPath': process.env.WORKSPACE_ADDONS_DEFAULTS_DIR || path.resolve(__dirname + '/../addons'),
            'tempPath': process.env.WORKSPACE_ADDONS_TEMP_DIR || os.tmpDir(),
            'blacklist': (process.env.WORKSPACE_ADDONS_BLACKLIST || "").split(",")
        },
        'users': {
            // Max number of collaborators
            'max': parseInt(process.env.WORKSPACE_USERS_MAX || 100),

            // Default auth email
            'defaultEmail': null,
            'defaultToken': null,

            // Use git for auth
            'gitDefault': true
        },
        'proc': {
            'urlPattern': process.env.WORKSPACE_WEB_URL_PATTERN || 'http://localhost:%d'
        },
        'server': {
            'hostname': "0.0.0.0",
            'port': parseInt(process.env.PORT || 8000, 10)
        },
        'settings': {
            'path': path.join(LOCAL_SETTINGS_DIR, 'settings.json')
        },
        'project': {
            'forceSample': null
        }
    }, config || {});

    // Normalize root path
    config.root = path.resolve(process.cwd(), config.root);

    // Default title
    if (config.title == null) {
        config.title = path.basename(config.root)
    }

    // Is dev mode
    if (config.dev) {
        console.log("WARNING! your monolith is in dev mode");
    }

    // Use git for auth
    if (config.users.gitDefault && !config.users.defaultEmail) {
        // get GIT settings for defining default user
        prepare = prepare.then(function() {
            return monolithGitRepo.identity().then(function(actor) {
                console.log("Use GIT actor for auth: ", actor.email);
                _.extend(config, {
                    'users': {
                        'defaultEmail': actor.email
                    }
                });
            }, function() {
                return Q();
            });
        });
    }

    // The root of our plugins
    var pluginPath = path.resolve(
        __dirname
    );

    var app = new engineer.Application({
        'paths': [pluginPath]
    });
    app.on("error", function(err) {
        console.log("Error in the application:");
        console.log(err.stack);
    });
    return prepare.fin(function() {
        // Plugins to load
        var plugins = [
            // Core
            {
                // Path to plugin
                'packagePath': "./m.core",

                // Options
                'id': config.workspace.id,
                'title': config.title,
                'root': config.root,
                'public': config.public,
                'maxUsers': config.users.max
            },

            // Utils
            "./m.logger",
            {
                // Path to plugin
                'packagePath': "./m.hooks",

                // Options
                'hooks': config.hooks,
                'webAuthToken': config.webhook.authToken
            },

            // Event bus
            "./m.events",
            "./m.events.log",
            "./m.events.socketio",
            "./m.events.webhook",

            // Addons
            {
                // Path to plugin
                'packagePath': "./m.addons",

                // Options
                'dev': config.dev,
                'path': config.addons.path,
                'tempPath': config.addons.tempPath,
                'defaultsPath': config.addons.defaultsPath,
                'blacklist': config.addons.blacklist
            },

            // Express server
            {
                packagePath: "./m.server",

                'dev': config.dev,
                'port': config.server.port,
                'hostname': config.server.hostname,
                'defaultEmail': config.users.defaultEmail,
                'defaultToken': config.users.defaultToken
            },

            // VFS
            "./m.vfs",
            "./m.vfs.http",

            // Shells
            "./m.shells",
            "./m.shells.stream",

            // Detect project types
            {
                packagePath: "./m.project",

                // Force workspace content to a be sample
                forceProjectSample: config.project.forceSample
            },

            // Deployment solution
            "./m.deploy",
            "./m.deploy.heroku",
            "./m.deploy.appengine",
            "./m.deploy.ftp",
            "./m.deploy.ghpages",
            "./m.deploy.parse",

            // Running code/projects
            {
                packagePath: "./m.run.ports",

                // These are optional, harbor has sane defaults
                min: process.env.RUN_PORTS_MIN,
                max: process.env.RUN_PORTS_MAX,
            },
            "./m.run.file",

            {
                packagePath: "./m.run.project",

                urlPattern: config.proc.urlPattern
            },

            // Socket.io
            "./m.socket.io",

            // Files
            "./m.files.service",
            "./m.files.sync",

            // Code completion
            "./m.codecomplete",
            "./m.codecomplete.ctags",

            // Export
            "./m.export",

            // Offline manifest
            {
                packagePath: "./m.offline",

                dev: config.dev
            },

            // Settings
            {
                packagePath: "./m.settings",

                storageFile: config.settings.path
            },

            // Search
            "./m.search",

            // Watch (file modifications)
            "./m.watch",

            // Manages processes
            {
                packagePath: "./m.proc",

                urlPattern: config.proc.urlPattern
            },

            // APIs
            "./m.rpc",
            "./m.rpc.users",
            "./m.rpc.box",
            "./m.rpc.shells",
            "./m.rpc.auth",
            "./m.rpc.debug",
            "./m.rpc.search",
            "./m.rpc.addons",
            "./m.rpc.deploy",
            "./m.rpc.proc",
            "./m.rpc.project",
            "./m.rpc.run",
            "./m.rpc.codecomplete",

            // Now start the damn server
            "./m.main",
        ];
        return app.load(plugins);
    }).then(function() {
        return Q({
            'app': app,
            'config': config
        });
    });
};

module.exports = {
    'start': start
};
