(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{uO3H:function(t,e,a){"use strict";function n(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),a.push.apply(a,n)}return a}function o(t,e,a){return e in t?Object.defineProperty(t,e,{value:a,enumerable:!0,configurable:!0,writable:!0}):t[e]=a,t}a.r(e);var r,i=a("hosL"),c=(a("Utv1"),a("/eY4")),d=(a("Y3FI"),a("bbv7")),p=a("wgWz"),s=p.a.makeRandomData({cnt:500,min:1e3,max:4e3,onlyUp:!1,inputData:[],diff:100}),u=p.a.makeRandomData({cnt:500,min:1e3,max:4e3,onlyUp:!1,demandData:s,diff:50,maxSkew:50}),l=p.a.makeRandomData({cnt:500,min:0,max:25,onlyUp:!1,diff:1}),w=p.a.calcData(l,p.a.calcProductionData,{min:0,max:500}),f={demandData:s,aiData:u,productionData:w,productionBoostData:p.a.addPercent(w,10),productionLongLifeData:p.a.addPercent(w,-5)},b=Object(c.a)(r=function(t){function e(e){var a;return(a=t.call(this,e)||this).state=function(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?n(Object(a),!0).forEach((function(e){o(t,e,a[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):n(Object(a)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(a,e))}))}return t}({},f),a}var a,r;return r=t,(a=e).prototype=Object.create(r.prototype),a.prototype.constructor=a,a.__proto__=r,e.prototype.render=function(){var t=this.state,e=t.demandData,a=t.aiData,n=t.productionData,o=t.productionBoostData,r=t.productionLongLifeData;return Object(i.h)("div",{class:"container-fluid mt-5 pt-2"},Object(i.h)("div",{class:"row"},Object(i.h)("div",{class:"col-12"},Object(i.h)("h1",null,"Strategy"),Object(i.h)(d.a,{stores:this.props.stores,data:e,dataB:a,data2:n,data2B:o,data2C:r,legend:"Demand",legendB:"AI prediction",legend2:"Normal production",legend2B:"Boost 10%",legend2C:"Long life -5%",width:1200,height:500,yMax:4e3,yMin:0,y2Max:550,y2Min:0,showXTicks:1,showYTicks:1,showY2Ticks:1,yTicks:'["4TW", "3TW", "2TW", "1TW", "0TW"]',y2Ticks:'["550Mw", "450Mw", "350Mw", "250Mw", "150Mw", "5Mw", "0Mw"]',unit:"Mw",unit2:"Mw",marker:400,avgWindow2:8,avgWindow2B:8,avgWindow2C:8}))))},e}(i.Component))||r;e.default=b}}]);
//# sourceMappingURL=route-strategy.chunk.8daee.js.map