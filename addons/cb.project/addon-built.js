define("ports",[],function(){var e=codebox.require("hr/utils"),t=codebox.require("core/operations"),n=codebox.require("core/box"),r=codebox.require("utils/dialogs"),i=codebox.require("utils/alerts"),s=codebox.require("models/command"),o=new s({},{id:"run.ports.http",title:"Running Ports",type:"menu",offline:!1}),u=function(){return n.procHttp().then(function(t){return o.menu.reset(e.map(t,function(e){return{title:e.port,flags:e.reachable?"":"disabled",action:function(){e.reachable?window.open(e.url):r.alert("Your server is not accessible ","Your server is not accessible externally because it is bound to 'localhost', please bind it to '0.0.0.0' instead")}}})),t})};return{command:o,update:u}}),define("autorun",["ports"],function(e){var t=codebox.require("hr/utils"),n=codebox.require("core/commands/toolbar"),r=codebox.require("core/operations"),i=codebox.require("core/box"),s=codebox.require("utils/dialogs"),o=codebox.require("utils/alerts"),u=codebox.require("models/command"),a={run:"fa-play",build:"fa-cog fa-spin",clean:"fa-eraser"},f=n.register("project.run",{title:"Run",icon:"play",offline:!1,position:1,shortcuts:["alt+r"]},function(n){return n=n||{},i.run(n).then(function(n){var i=r.start("project.run."+n.shellId,null,{title:n.name+" running on port "+n.port,icon:a[n.type]||"fa-play",action:function(){window.open(n.url),e.update().then(function(e){var r=t.find(e,function(e){return e.port==n.port});r||i.destroy()})}});n.terminal.on("tab:close",function(){i.destroy()}),e.update()},function(e){s.alert("Error running this project","An error occurred when trying to run this project: "+(e.message||e))})});return{command:f}}),define("runner",["autorun"],function(e){var t=codebox.require("hr/utils"),n=codebox.require("core/operations"),r=codebox.require("core/box"),i=codebox.require("utils/dialogs"),s=codebox.require("utils/alerts"),o=codebox.require("models/command"),u=new o({},{id:"project.action",title:"Perform Action",type:"menu",offline:!1}),a=function(){return r.runner().then(function(n){return u.menu.reset(t.map(n,function(t){return{title:t.name,action:function(){e.command.run({id:t.id})}}})),ports})};return{command:u,update:a}}),define("samples",[],function(){var e=codebox.require("hr/utils"),t=codebox.require("utils/dialogs"),n=codebox.require("core/box"),r=codebox.require("core/backends/rpc"),i=codebox.require("models/command"),s=new i({},{title:"Use Sample Project",type:"menu",offline:!1}),o=function(){return r.execute("project/supported").then(function(n){return s.menu.reset(e.chain(n).map(function(e){return e.sample?{title:e.name,action:function(){t.confirm("Replace workspace contents with "+e.name+" sample?","WARNING: Using a sample will erase the current contents of your workspace. Use only if your workspace is empty or if you want to wipe it").then(function(){return r.execute("project/useSample",{sample:e.id})})}}:null}).compact().value()),n})};return{command:s,update:o}}),define("client",["runner","ports","autorun","samples"],function(e,t,n,r){var i=codebox.require("hr/utils"),s=codebox.require("core/operations"),o=codebox.require("core/app"),u=codebox.require("core/box"),a=codebox.require("core/commands/menu"),f=codebox.require("utils/dialogs"),l=codebox.require("utils/alerts"),c=codebox.require("models/command");a.getById("file").menuSection([r.command]),a.register("project",{title:"Project"}).menuSection([n.command,e.command]).menuSection([c.register("project.build",{title:"Build",offline:!1,action:function(){return n.command.run({type:"build"})},shortcuts:["mod+b"]}),c.register("project.clean",{title:"Clean",offline:!1,action:function(){return n.command.run({type:"clean"})},shortcuts:["mod+shift+k"]})]).menuSection([{type:"action",title:"Refresh Ports",offline:!1,action:t.update},t.command]),u.on("box:project:define",function(){e.update()}),e.update(),t.update(),r.update()})