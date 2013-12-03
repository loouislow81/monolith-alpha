define("views/panel",[],function(){var e=codebox.require("underscore"),t=codebox.require("jQuery"),n=codebox.require("hr/hr"),r=codebox.require("core/box"),i=codebox.require("utils/dialogs"),s=codebox.require("views/panels/base"),o=s.extend({className:"cb-panel-run",template:"panel.html",templateLoader:"addon.cb.panel.run.templates",events:{"click .cb-action-run":"runApp","click .cb-action-ports-refresh":"refreshPorts","click li[data-run-port]":"openPortApp"},initialize:function(){o.__super__.initialize.apply(this,arguments),this.ports=[],this.refreshPorts()},templateContext:function(){return{ports:this.ports}},refreshPorts:function(e){var t=this;e&&e.preventDefault(),r.procHttp().then(function(e){t.ports=e,t.update()})},runApp:function(e){e&&e.preventDefault(),i.alert("Auto-run is not yet available","Run your application from the terminal on port 5000 and open your applications from the list below.")},openPortApp:function(e){if(!e)return;var n=t(e.currentTarget).data("run-port");alert(n)}});return o}),define("client",["views/panel"],function(e){var t=codebox.require("core/commands"),n=codebox.require("core/app"),r=codebox.require("core/panels"),i=r.register("run",e),s=t.register("run.open",{title:"Run",icon:"play",position:1,shortcuts:["r"]});i.connectCommand(s)})