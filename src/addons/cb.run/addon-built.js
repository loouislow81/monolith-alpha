define("client",[],function(){var e=codebox.require("underscore"),t=codebox.require("core/commands/toolbar"),n=codebox.require("core/app"),r=codebox.require("core/box"),i=codebox.require("core/commands/menu"),s=codebox.require("utils/dialogs"),o=codebox.require("models/command"),u=new o({},{id:"run.ports.http",title:"Running Ports",type:"menu",offline:!1}),a=function(){r.procHttp().then(function(t){u.menu.reset(e.map(t,function(e){return{title:e.port,flags:e.reachable?"":"disabled",action:function(){e.reachable?window.open(e.url):s.alert("Your server is not accessible ","Your server is not accessible externally because it is bound to 'localhost', please bind it to '0.0.0.0' instead")}}}))})},f=t.register("run.workspace",{title:"Run Application",icon:"play",offline:!1,position:1,shortcuts:["r"]},function(){r.run().then(function(e){console.log(e)})});i.register("run",{title:"Run"}).menuSection([f,{type:"action",title:"Logging Output",offline:!1,action:function(){o.run("monitor.open")}}]).menuSection([{type:"action",title:"Refresh Ports",offline:!1,action:a},u]),a()})