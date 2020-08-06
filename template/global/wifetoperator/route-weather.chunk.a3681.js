(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{JmdN:function(t,a,e){"use strict";function n(t,a){var e=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);a&&(n=n.filter((function(a){return Object.getOwnPropertyDescriptor(t,a).enumerable}))),e.push.apply(e,n)}return e}function i(t,a,e){return a in t?Object.defineProperty(t,a,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[a]=e,t}e.r(a);var r,o=e("hosL"),c=e("/eY4"),s=e("bbv7"),h=e("wgWz"),d=h.a.makeRandomData(500,20,60,!1,[],1),p=h.a.makeRandomData(500,20,60,!1,d,1),y={forcastData:d,aiData:p,windData:h.a.makeRandomData(500,20,60,!1,p,2)},x=Object(c.a)(r=function(t){function a(a){var e;return(e=t.call(this,a)||this).state=function(t){for(var a=1;a<arguments.length;a++){var e=null!=arguments[a]?arguments[a]:{};a%2?n(Object(e),!0).forEach((function(a){i(t,a,e[a])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(e)):n(Object(e)).forEach((function(a){Object.defineProperty(t,a,Object.getOwnPropertyDescriptor(e,a))}))}return t}({},y),e}var e,r;return r=t,(e=a).prototype=Object.create(r.prototype),e.prototype.constructor=e,e.__proto__=r,a.prototype.render=function(){var t=this.state,a=t.windData,e=t.forcastData,n=t.aiData;return Object(o.h)("div",{class:"container-fluid mt-5 pt-2"},Object(o.h)("div",{class:"row"},Object(o.h)("div",{class:"col-12"},Object(o.h)("h1",null,"Weather"),Object(o.h)(s.a,{data:a,dataB:e,dataC:n,legend:"Wind",legendB:"Wind forcast",legendC:"Wind AI prediction",width:1200,height:500,yMax:100,y2Max:100,showYTicks:1,yTicks:'["20 m/s", "15 m/s", "10 m/s", "5 m/s", "0 m/s"]',showXTicks:1,marker:400}))))},a}(o.Component))||r;a.default=x},VtuJ:function(t){t.exports={lineChart:"lineChart__1V7gu",svg:"svg__2VZNe",pathText:"pathText__2RfbE",path:"path__39L9w",pathB:"pathB__4I_xm",pathC:"pathC__1DQi-",pathD:"pathD__2lI_C",path2:"path2__19gje",path2B:"path2B__-l86N",path2C:"path2C__3xnAW",path3:"path3__1IFnl","x-axis":"x-axis__1601s","y-axis":"y-axis__13f0R","y-axis2":"y-axis2__3xPFM",marker:"marker__2peOe"}},bbv7:function(t,a,e){"use strict";function n(t,a){var e=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);a&&(n=n.filter((function(a){return Object.getOwnPropertyDescriptor(t,a).enumerable}))),e.push.apply(e,n)}return e}function i(t){for(var a=1;a<arguments.length;a++){var e=null!=arguments[a]?arguments[a]:{};a%2?n(Object(e),!0).forEach((function(a){r(t,a,e[a])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(e)):n(Object(e)).forEach((function(a){Object.defineProperty(t,a,Object.getOwnPropertyDescriptor(e,a))}))}return t}function r(t,a,e){return a in t?Object.defineProperty(t,a,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[a]=e,t}function o(t,a,e,n,i){void 0===n&&(n=""),void 0===i&&(i="");var r=Array.from(Array(t).keys()),o=Math.ceil(e)-Math.floor(a);return r.map((function(e){return""+n+(parseInt(o/(t-1)*e,10)+Math.floor(a))+i}))}function c(t){if(t)return JSON.parse(t)}function s(t){if("string"==typeof t&&t.match(/\d+h/)){var a=3600*t.replace(/h/g,"")*1e3,e=f.a.epoch();return f.a.isoDate(e-a)}return t}function h(t,a,e,n,i){return n+(t-a)*(i-n)/(e-a)}function d(t,a){void 0===a&&(a=!1);var e=1;return t<0&&(e=-1),a&&1===e?5*Math.floor(Math.abs(t)/5)*e:5*Math.ceil(Math.abs(t)/5)*e}function p(t){var a=t.data,e=t.max;return f.a.isNumber(e)?Math.max.apply(Math,[e].concat(a.map((function(t){return t.y})))):Math.max.apply(Math,a.map((function(t){return t.y})))}function y(t){var a=t.data,e=t.min;return f.a.isNumber(e)?Math.min.apply(Math,[e].concat(a.map((function(t){return t.y})))):Math.min.apply(Math,a.map((function(t){return t.y})))}function x(t){var a=t.data,e=t.yMin,n=t.yMax,i=t.width,r=t.height,o=t.yRangeMin,c=t.yRangeMax,s=t.offsetY,x=void 0===s?0:s,u=t.maxMinFixed,l=void 0!==u&&u;if(a&&a.length){var b,v,m=Math.max.apply(Math,a.map((function(t){return t.x})));b=l?f.a.isNumber(e)?e:y({data:a}):d(b=f.a.isNumber(e)?y({data:a,min:e}):y({data:a}),!0),v=l?f.a.isNumber(n)?n:p({data:a}):d(v=f.a.isNumber(n)?p({data:a,max:n}):p({data:a}));var O=r-x,M=function(t){return t/m*i},g=function(t){var a=t;return f.a.isNumber(o)&&f.a.isNumber(c)?(a=h(a,b,v,o,c),O-h(a,o,c,x,r)):(a=h(a,b,v,b,v),O-h(a,b,v,x,r))};return{d:"M-100 "+(O+x)+" L"+M(a[0].x)+" "+g(a[0].y)+" \n            "+a.slice(1).map((function(t){return"L"+M(t.x)+" "+g(t.y)})).join(" ")+"\n            L"+(M(m)+100)+" "+(O+x)+"\n        ",maxX:m,maxY:v,minY:b}}return{}}var u,l=e("hosL"),f=e("Utv1"),b=e("/eY4"),v=e("VtuJ"),m=e.n(v),O={},M=Object(b.a)(u=function(t){function a(a){var e;return(e=t.call(this,a)||this).setState(i({},O)),e}var e,n;return n=t,(e=a).prototype=Object.create(n.prototype),e.prototype.constructor=e,e.__proto__=n,a.prototype.render=function(){var t=this.props,a=t.width,e=void 0===a?600:a,n=t.height,r=void 0===n?200:n,h=t.offsetY,u=t.paddingLeft,f=t.paddingBottom,b=t.tickCount,v=void 0===b?6:b,O=t.showXTicks,M=t.showYTicks,g=t.xTicks,j=t.yTicks,w=t.yTicksPrefix,_=t.yTicksPostfix,k=void 0===_?"°C":_,D=t.yMin,C=t.showY2Ticks,P=t.y2Ticks,T=t.y2TicksPrefix,R=t.y2TicksPostfix,B=void 0===R?"°C":R,N=t.y2Max,Y=t.y2Min,z=t.y2BMax,I=t.y2BMin,F=t.range2bMin,L=void 0===F?0:F,W=t.range2bMax,J=void 0===W?100:W,S=t.y2CMax,A=t.y2CMin,E=t.range2cMin,V=void 0===E?0:E,X=t.range2cMax,Q=void 0===X?100:X,U=t.y3Min,Z=t.y3Max,q=t.range3Min,G=void 0===q?0:q,H=t.range3Max,K=void 0===H?100:H,$=t.legend,tt=t.legendB,at=t.legendC,et=t.legendD,nt=t.legend2,it=t.legend2B,rt=t.legend2C,ot=t.legend3,ct=t.data,st=void 0===ct?[]:ct,ht=t.dataB,dt=void 0===ht?[]:ht,pt=t.dataC,yt=void 0===pt?[]:pt,xt=t.dataD,ut=void 0===xt?[]:xt,lt=t.data2,ft=void 0===lt?[]:lt,bt=t.data2B,vt=void 0===bt?[]:bt,mt=t.data2C,Ot=void 0===mt?[]:mt,Mt=t.data3,gt=void 0===Mt?[]:Mt,jt=t.marker,wt=(void 0===u?0:u)||(M?30:0),_t=(void 0===f?0:f)||(O?20:0),kt={width:e,height:r,offsetY:void 0===h?0:h},Dt=p({data:st,max:t.yMax}),Ct=d(p({data:dt,max:Dt})),Pt=y({data:st,min:D}),Tt=d(y({data:dt,min:Pt}),!0),Rt=x(i(i({},kt),{},{data:st,yMin:Tt,yMax:Ct,maxMinFixed:!0})),Bt=Rt.d,Nt=Rt.maxX,Yt=void 0===Nt?0:Nt,zt=x(i(i({},kt),{},{data:dt,yMin:Tt,yMax:Ct,maxMinFixed:!0})).d,It=x(i(i({},kt),{},{data:yt,yMin:Tt,yMax:Ct,maxMinFixed:!0})).d,Ft=x(i(i({},kt),{},{data:ut,yMin:Tt,yMax:Ct,maxMinFixed:!0})).d,Lt=x(i(i({},kt),{},{data:ft,yMin:Y,yMax:N})),Wt=Lt.d,Jt=Lt.minY,St=void 0===Jt?0:Jt,At=Lt.maxY,Et=void 0===At?0:At,Vt=x(i(i({},kt),{},{data:vt,yMin:I,yMax:z,yRangeMin:L,yRangeMax:J})).d,Xt=x(i(i({},kt),{},{data:Ot,yMin:A,yMax:S,yRangeMin:V,yRangeMax:Q,maxMinFixed:!0})).d,Qt=x(i(i({},kt),{},{data:gt,yMin:U,yMax:Z,yRangeMin:G,yRangeMax:K})).d,Ut=c(g)||o(v,0,Yt),Zt=c(j)||o(v,Tt,Ct,w,k).reverse(),qt=c(P)||o(v,St,Et,T,B).reverse();return Object(l.h)("div",{class:m.a.lineChart,style:"height: "+r+"px; overflow: hidden;"},Object(l.h)("svg",{xmlns:"http://www.w3.org/2000/svg",class:m.a.svg,viewBox:"0 0 "+e+" "+r,preserveAspectRatio:"none",style:"padding-left: "+wt+"px; padding-bottom: "+_t+"px; width: calc(100%); max-height: 100%;"},Qt&&Object(l.h)("path",{d:Qt,class:m.a.path3}),Xt&&Object(l.h)("path",{d:Xt,class:m.a.path2C}),Vt&&Object(l.h)("path",{d:Vt,class:m.a.path2B}),Wt&&Object(l.h)("path",{d:Wt,class:m.a.path2}),zt&&Object(l.h)("path",{d:zt,class:m.a.pathB}),It&&Object(l.h)("path",{d:It,class:m.a.pathC}),Ft&&Object(l.h)("path",{d:Ft,class:m.a.pathD}),Bt&&Object(l.h)("path",{d:Bt,class:m.a.path}),$&&Object(l.h)("line",{x1:"10",y1:"5",x2:"30",y2:"5",class:m.a.path}),$&&Object(l.h)("text",{x:"35",y:"10","font-size":"10px",class:m.a.pathText},$),tt&&Object(l.h)("line",{x1:"10",y1:"15",x2:"30",y2:"15",class:m.a.pathB}),tt&&Object(l.h)("text",{x:"35",y:"20","font-size":"10px",class:m.a.pathText},tt),at&&Object(l.h)("line",{x1:"10",y1:"25",x2:"30",y2:"25",class:m.a.pathC}),at&&Object(l.h)("text",{x:"35",y:"30","font-size":"10px",class:m.a.pathText},at),et&&Object(l.h)("line",{x1:"10",y1:"35",x2:"30",y2:"35",class:m.a.pathD}),et&&Object(l.h)("text",{x:"35",y:"40","font-size":"10px",class:m.a.pathText},et),nt&&Object(l.h)("line",{x1:"10",y1:"15",x2:"30",y2:"15",class:m.a.path2}),nt&&Object(l.h)("text",{x:"35",y:"20","font-size":"10px",class:m.a.pathText},nt),ot&&Object(l.h)("line",{x1:"10",y1:"25",x2:"30",y2:"25",class:m.a.path3}),ot&&Object(l.h)("text",{x:"35",y:"30","font-size":"10px",class:m.a.pathText},ot),it&&Object(l.h)("line",{x1:"10",y1:"45",x2:"30",y2:"45",class:m.a.path2B}),it&&Object(l.h)("text",{x:"35",y:"50","font-size":"10px",class:m.a.pathText},it),rt&&Object(l.h)("line",{x1:"10",y1:"55",x2:"30",y2:"55",class:m.a.path2C}),rt&&Object(l.h)("text",{x:"35",y:"60","font-size":"10px",class:m.a.pathText},rt),jt&&Object(l.h)("line",{x1:jt,y1:r,x2:jt,y2:"0",class:m.a.marker})),O&&Object(l.h)("div",{class:m.a["x-axis"],style:{left:wt+"px",width:"calc(100% - "+wt+"px)"}},Ut.map((function(t){return Object(l.h)("div",{"data-value":s(t)})}))),M&&Object(l.h)("div",{class:m.a["y-axis"],style:{bottom:_t+"px"}},Zt.map((function(t){return Object(l.h)("div",{"data-value":t})}))),C&&Object(l.h)("div",{class:m.a["y-axis2"],style:{bottom:_t+"px"}},qt.map((function(t){return Object(l.h)("div",{"data-value":t})}))))},a}(l.Component))||u;a.a=M},wgWz:function(t,a){"use strict";a.a=function(){function t(){}return t.getRandomInt=function(t,a){return t=Math.ceil(t),a=Math.floor(a),Math.floor(Math.random()*(a-t+1))+t},t.makeRandomData=function(a,e,n,i,r,o){void 0===a&&(a=200),void 0===i&&(i=!1),void 0===r&&(r=[]),void 0===o&&(o=5);for(var c=[],s=0,h=o,d=0,p=a;d<p;d+=1)r[d]&&r[d].y?(h=t.getRandomInt(h-o,h+o),s=r[d].y+h,h>o&&(h=0)):s=s?t.getRandomInt(i?s:s-o,s+o):t.getRandomInt(e,n),c.push({x:d,y:s});return c},t.addPercent=function(t,a,e){void 0===t&&(t=[]),void 0===a&&(a=10),void 0===e&&(e=0);for(var n=e,i=0,r=t.length;i<r;i+=1)t[i]&&t[i].y&&t[i].y>n&&(n=t[i].y);for(var o=[],c=0,s=t.length;c<s;c+=1){if(t[c]&&t[c].y)o.push({x:c,y:t[c].y+a*n/100})}return o},t}()}}]);
//# sourceMappingURL=route-weather.chunk.a3681.js.map