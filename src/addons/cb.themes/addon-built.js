define("cssgen",[],function(){var e=function(e,t){var n=[];t=_.defaults(t||{},{base:"",namespace:{},joint:"\n"});var r=function(e,i){return _.map(e,function(e,t){var s="",o="",u,a="";return _.isString(e)?t+": "+e+";":(t[0]=="&"?(u=i,a=t):u=i?i+" "+t:t,n.push({selector:u,attr:a,content:r(e,u)}),"")}).join(t.joint)};return r(e),_.map(n,function(e){var n=t.base+" "+(t.namespace[e.selector]||e.selector);return n+=e.attr.replace("&",""),n+" {"+t.joint+e.content+t.joint+"}"}).join(t.joint)};return{convert:e}}),define("defaults/default",[],function(){return{id:"default",title:"Default",description:"Default theme"}}),define("defaults/spacegray",[],function(){var e="#1a1d24",t="#65737d",n="#2b303b",r="#dfe0e6",i="#343c45",s="#dadfe6";return{id:"spacegray",title:"Spacegray",description:"Spacegray is all about hype and minimal.",editor:{theme:"spacegray"},styles:{menubar:{background:n,color:r,"border-color":"transparent","box-shadow":"none"},lateralbar:{commands:{background:e,color:s,"border-color":"transparent","box-shadow":"none"},body:{background:e,color:t,"border-color":"transparent","box-shadow":"none"}},tabs:{section:{"border-color":e},header:{background:e,color:t,"border-color":"transparent","box-shadow":"none"},content:{background:i},tab:{"&.active":{background:i,color:s}}}}}}),define("main",["cssgen","defaults/default","defaults/spacegray"],function(e,t,n){var r=codebox.require("jQuery"),i=codebox.require("hr/hr"),s=codebox.require("core/settings"),o=i.Logger.addNamespace("themes"),u=null,a={},f=r("<style>",{type:"text/css"}).appendTo(r("body"));s.add({namespace:"themes",title:"Themes",defaults:{theme:"default"},fields:{theme:{label:"Theme",type:"select",options:{}}}});var l=function(e){if(!e.id||a[e.id])return!1;o.log("add theme",e.id,e),a[e.id]=_.defaults(e,{styles:{},description:""})},c=function(t){var n,r=a[t];return r?(u=t,n=e.convert(r.styles,{namespace:{menubar:".cb-menubar","lateralbar commands":".cb-lateralbar .lateral-commands","lateralbar body":".cb-lateralbar .lateral-body","tabs section":".cb-tabs .section","tabs header":".cb-tabs .section .tabs-header","tabs content":".cb-tabs .section .tabs-content","tabs tab":".component-tab"},base:"body #codebox"}),o.log("Output:",n),f.html(n),!0):!1};return l(t),l(n),c("spacegray"),{themes:{add:l,change:c}}})