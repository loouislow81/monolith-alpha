define([], function() {
    var _ = codebox.require("underscore");
    var commands = codebox.require("core/commands/toolbar");
    var app = codebox.require("core/app");
    var box = codebox.require("core/box");
    var menu = codebox.require("core/commands/menu");
    var dialogs = codebox.require("utils/dialogs");
    var Command = codebox.require("models/command");

    // HTTP Ports
    var httpPorts = new Command({}, {
        'id': "run.ports.http",
        'title': "Running Ports",
        'type': "menu",
        'offline': false
    });

    // Update running ports list
    var updatePorts = function() {
        box.procHttp().then(function(ports) {
            httpPorts.menu.reset(_.map(ports, function(proc) {
                return {
                    'title': proc.port,
                    'flags': proc.reachable ? "" : "disabled",
                    'action': function() {
                        if (proc.reachable) {
                            window.open(proc.url);
                        } else {
                            dialogs.alert("Your server is not accessible ", "Your server is not accessible externally because it is bound to 'localhost', please bind it to '0.0.0.0' instead");
                        }
                    }
                };
            }))
        });
    };

    // Run command
    var runCommand = commands.register("run.workspace", {
        title: "Run Application",
        icon: "play",
        offline: false,
        position: 1,
        shortcuts: [
            "r"
        ]
    }, function() {
        box.run().then(function(runInfo) {
            console.log(runInfo);
        });
    });

    // Add menu
    menu.register("run", {
        title: "Run"
    }).menuSection([
        runCommand,
        {
            'type': "action",
            'title': "Logging Output",
            'offline': false,
            'action': function() {
                Command.run("monitor.open");
            }
        }
    ]).menuSection([
        {
            'type': "action",
            'title': "Refresh Ports",
            'offline': false,
            'action': updatePorts
        },
        httpPorts
    ]);

    updatePorts();
});