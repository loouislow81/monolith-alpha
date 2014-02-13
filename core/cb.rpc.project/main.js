// Requires
var ProjectRPCService = require('./service').ProjectRPCService;


function setup(options, imports, register) {
    // Import
    var project = imports.project;
    var projectTypes = imports.projectTypes;
    var projectDeploy = imports.projectDeploy;
    var rpc = imports.rpc;

    // Service
    var service = new ProjectRPCService(project, projectTypes, projectDeploy);

    // Register RPC
    rpc.register('project', service);

    // Register
    register(null, {});
}

// Exports
module.exports = setup;
