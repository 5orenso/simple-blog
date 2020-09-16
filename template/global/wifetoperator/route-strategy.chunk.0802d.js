(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{uO3H:function(t,e,r){"use strict";function n(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function a(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}r.r(e);var i,o=r("hosL"),s=r("/eY4"),c=r("Utv1"),l=r("wgWz"),p=r("bbv7"),d={},u=Object(s.a)(i=function(t){function e(e){var r;return(r=t.call(this,e)||this).setWindpark=function(t){r.props.stores.windmillStore.setCurrentWindparkName(t.target.dataset.windpark),r.loadAll()},r.state=function(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?n(Object(r),!0).forEach((function(e){a(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):n(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}({},d),r}var r,i;i=t,(r=e).prototype=Object.create(i.prototype),r.prototype.constructor=r,r.__proto__=i;var s=e.prototype;return s.loadAll=function(){return new Promise(function(t,e){var r,n,a,i,o,s,c,p,d,u,h,f,m;return a=(r=this.props.stores).weatherYrStore,i=r.productionStore,o=r.priceStore,s=r.demandStore,c=(n=r.windmillStore).currentWindparkName,p=n.windparkCapacity,d=l.a.getDateDiffTime(-4),u=l.a.getDateDiffTime(10),h=Math.floor((new Date).getTime()/1e3),f=l.a.timeRangeDays(-4,11),this.setState({now:h,xMin:d,xMax:u,markerDays:f}),Promise.resolve(this.loadYrData()).then(function(){try{return Promise.resolve(this.loadOpenData()).then((function(){try{return m=a.getWindSpeeds(c),o.generateData(),i.generateData(m,o.prices,p),s.generateData(),t()}catch(t){return e(t)}}),e)}catch(t){return e(t)}}.bind(this),e)}.bind(this))},s.loadYrData=function(){return new Promise(function(t,e){var r,n,a;return(n=(r=this.props.stores).weatherYrStore).updateQueryFilter({name:(a=r.windmillStore.currentWindpark).name,altitude:a.position.altitude,lat:a.position.lat,lon:a.position.lon}),Promise.resolve(n.load()).then(t,e)}.bind(this))},s.loadOpenData=function(){return new Promise(function(t,e){var r,n,a;return(n=(r=this.props.stores).weatherOpenStore).updateQueryFilter({name:(a=r.windmillStore.currentWindpark).name,lat:a.position.lat,lon:a.position.lon}),Promise.resolve(n.load()).then(t,e)}.bind(this))},s.componentDidMount=function(){this.loadAll()},s.render=function(){var t=this,e=this.state,r=e.now,n=e.xMin,a=e.xMax,i=e.markerDays,s=this.props.stores,l=s.windmillStore,d=s.productionStore,u=s.demandStore,h=u.demands,f=u.demandAiFiltered,m=l.windparks,b=l.currentWindparkName,w=l.windparkCapacity,g=l.windparkMaxCapacity,O=w/g*100,y=d.productionData,v=d.productionBoostDataFiltered,k=d.productionLongLifeDataFiltered;return Object(o.h)("div",{class:"container-fluid mt-5 pt-2",style:"margin-bottom: 200px;"},Object(o.h)("div",{class:"row"},Object(o.h)("div",{class:"col-4"},Object(o.h)("h1",null,Object(o.h)("i",{class:"fas fa-chess-knight"})," Strategy - ",b),Object(o.h)("span",{class:"text-muted"},"Capacity at")," ",c.a.format(O,1),"%",Object(o.h)("span",{class:"text-muted"},", ",w,"/",g," Mw")),Object(o.h)("div",{class:"col-8 pt-2"},Object(o.h)("ul",{class:"nav nav-pills float-right"},m&&m.map((function(e){return Object(o.h)("li",{class:"nav-item"},Object(o.h)("button",{class:"btn btn-link nav-link "+(e.name===b?"active":""),onClick:t.setWindpark,"data-windpark":e.name},e.name))})))),Object(o.h)("div",{class:"col-12"},Object(o.h)(p.a,{stores:this.props.stores,width:1200,height:500,showXTicks:1,xTicksVal:function(t){return c.a.isoDate(t)},xMin:n,xMax:a,paddingTop:30,dataLeft:[h,f],legendLeft:["Demand","Demand AI prediction"],yMaxLeft:4e3,yMinLeft:0,showYTicksLeft:1,yTicksLeft:["4TW","3TW","2TW","1TW","0TW"],unitLeft:["Mw","Mw"],avgWindowLeft:[2,2],smoothLeft:[1,1],dataRight:[y,v,k],legendRight:["Normal production","Boost 10%","Long life -5%"],yMaxRight:4e3,yMinRight:0,showYTicksRight:1,yTicksRight:["4TW","3TW","2TW","1TW","0TW"],unitRight:["Mw"],avgWindowRight:[1,1,1],smoothRight:[1,1,1],marker:r,markers:i}))))},e}(o.Component))||i;e.default=u}}]);
//# sourceMappingURL=route-strategy.chunk.0802d.js.map