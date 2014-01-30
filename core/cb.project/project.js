var Q = require('q');
var _ = require('underscore');
var path = require('path');
var utils = require('../utils');

function ProjectType(workspace, events, logger) {
    this.workspace = workspace;
    this.events = events;
    this.logger = logger;
    
    this.clear();

    _.bindAll(this);

     this.logger.log("project is ready");
};

/*
 *  Clear project informations
 */
ProjectType.prototype.clear = function() {
    // Unique project type id
    this.id = null;

    // Name associated to the project type
    this.name = null;

    // List of run and build scripts
    this.runner = [];

    // List of merged project types id
    this.types = [];

    // Rules of files to ignore
    this.ignoreRules = [
        ".git",
        ".DS_Store"
    ];

    // List of files with rules
    this.ignoreRulesFiles = [
        ".ignore",
        ".gitignore"
    ];
};

/*
 *  Merge a new project type
 */
ProjectType.prototype.merge = function(type) {
    var that = this;

    type = _.defaults({}, type, {

        // Runner list
        runner: [],

        // Rules of glob to ignore
        ignoreRules: [],

        // List of files with rules
        ignoreRulesFiles: []
    });

    // First type merged define the project name
    if (!this.id) {
        this.id = type.id;
        this.name = type.name;
    }

    return Q().then(function() {
        return Q(_.result(type, 'runner'));
    }).then(function(_runner) {
        // Add runner
        that.runner = _.chain(that.runner)
        .concat(
            _.map(_runner, function(runner) {
                if (!runner.script || !runner.id) return null;
                var _id =type.id+":"+runner.id;
                return {
                    'id': _id,
                    'script': runner.script,
                    'name': runner.name || _id,
                    'score': runner.score || 1,
                    'type': runner.type || "run"
                };
            })
        )
        .compact()
        .sortBy(function(runner) {
            return -runner.score;
        })
        .value();
    }).then(function() {
        // Ignore rules
        that.ignoreRules = that.ignoreRules.concat(type.ignoreRules);

        // Ignore rules file
        that.ignoreRulesFiles = that.ignoreRulesFiles.concat(type.ignoreRulesFiles);

        that.types.push(type.id);
    });
};

/*
 *  Define a project
 */
ProjectType.prototype.define = function(types) {
    var typeIds, that = this;

    // Clear current infos
    this.clear();

    // Merge new infos
    return _.reduce(types.reverse(), function(prev, type) {
        return prev.then(function() {
            return that.merge(type);
        });
    }, Q()).then(function() {
        typeIds = _.pluck(types, "id");
        that.logger.log("define", typeIds);
        that.events.emit('project.define', typeIds);
    });
};

/*
 *  Return a representation for this project type
 */
ProjectType.prototype.reprData = function() {
    return {
        'id': this.id,
        'name': this.name,
        'types': this.types,
        'runner': this.runner,
        'ignoreRules': this.ignoreRules,
        'ignoreRulesFiles': this.ignoreRulesFiles
    };
};

/*
 *  Return a list of all ignored directories
 */
ProjectType.prototype.getValidFiles = function() {
    var Ignore = require("fstream-ignore");
    var d = Q.defer();
    var results = [];

    var ig = Ignore({
        path: this.workspace.root,
        ignoreFiles: [".ignore", ".gitignore"]
    });
    ig.addIgnoreRules(this.ignoreRules);
    ig.on("child", function (c) {
        results.push(c.path.substr(c.root.path.length + 1));
    }).on("end", function() {
        d.resolve(results);
    }).on("error", function(err) {
        d.reject(err);
    })
    return d.promise;
};

/*
 *  Return run script
 */
ProjectType.prototype.getRunner = function(options) {
    options = _.defaults({}, options, {
        // Filter runner by id
        'id': null,

        // Filter type
        'type': null,

        // Pick only one
        'pick': false
    });

    var c = _.chain(this.runner)
    .filter(function(runner) {
        if (options.id && options.id != runner.id) return false; 
        if (options.type && options.type != runner.type) return false;
        return true;
    }); 

    if (options.pick) c = c.first();

    return c.value();
};


// Exports
exports.ProjectType = ProjectType;
