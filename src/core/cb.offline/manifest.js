var _ = require('underscore');
var glob = require("glob");
var path = require('path');
var Q = require('q');

var Manifest = function() {
    // Regenerate manifest
    this.clear = function(regenerate) {
        if (regenerate) this.startTime = Date.now();
        this.sections = {
            'CACHE': {},
            'NETWORK': {},
            'FALLBACK': {}
        };
        return Q(this);
    };

    // Add a resource
    this.add = function(category, resource, value) {
        if (_.isArray(resource)) {
            _.each(resource, function(subres) {
                this.add(category, subres, value);
            }, this);
            return;
        }
        this.sections[category][resource] = value;
    };

    // Add a directory in cache
    this.addFolder = function(folder, root, globR) {
        var that = this;
        root = root || "/";
        globR = globR || "**/*";

        return Q.nfcall(glob, globR, {
            'cwd': folder,
            'mark': true
        }).then(function(files) {
            _.each(
                // Ignore diretcories
                _.filter(files, function(file) {
                    return file.substr(-1) != "/";
                }),
                function(file) {
                    that.add("CACHE", path.join(root,file));
                }
            );
        })
    };

    // Get manifest content
    this.content = function() {
        var lines = [
            "CACHE MANIFEST",
            "# Revision "+this.startTime
        ];

        _.each(this.sections, function(content, section) {
            if (_.size(content) == 0) return;
            lines.push("");
            lines.push(section+":");
            lines = lines.concat(_.keys(content));
        }, this);

        return Q(lines.join("\n"));
    };

    this.clear(true);
};

exports.Manifest = Manifest;