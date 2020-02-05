define([], function() {
    var _ = monolith.require("hr/utils");
    var dialogs = monolith.require("utils/dialogs");
    var box = monolith.require("core/box");
    var rpc = monolith.require("core/backends/rpc");
    var Command = monolith.require("models/command");

    // HTTP Ports
    var samplesMenu = Command.register("project.samples", {
        'category': "Project",
        'title': "Use Sample Project",
        'type': "menu",
        'offline': false,
        'search': false
    });

    // Update samples list
    var updateSamples = function() {
        return rpc.execute("project/supported").then(function(projectTypes) {
            samplesMenu.menu.reset(
                _.chain(projectTypes)
                .map(function(projectType) {
                    if (!projectType.sample) return null;

                    return {
                        'title': projectType.name,
                        'action': function() {
                            dialogs.confirm("Replace workspace contents with "+projectType.name+" sample?",
                            "WARNING: Using a sample will erase the current contents of your workspace. Use only if your workspace is empty or if you want to wipe it").then(function() {
                                return rpc.execute("project/useSample", {
                                    'sample': projectType.id
                                });  
                            }); 
                        }
                    };
                })
                .compact()
                .value()
            );

            return projectTypes;
        });
    };

    return {
        'command': samplesMenu,
        'update': updateSamples
    }
});