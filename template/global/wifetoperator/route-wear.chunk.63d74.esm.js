(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{"7ncz":function(t,e,a){"use strict";function s(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(t);e&&(s=s.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),a.push.apply(a,s)}return a}function r(t,e,a){return e in t?Object.defineProperty(t,e,{value:a,enumerable:!0,configurable:!0,writable:!0}):t[e]=a,t}a.r(e);var c,i=a("hosL"),n=a("/eY4"),l=a("Utv1"),o=a("wgWz"),h=a("bbv7");const b={};let d=Object(n.a)(c=class extends i.Component{constructor(t){super(t),this.setWindpark=t=>{const{windmillStore:e}=this.props.stores;e.setCurrentWindparkName(t.target.dataset.windpark),this.loadAll()},this.state=function(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?s(Object(a),!0).forEach((function(e){r(t,e,a[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):s(Object(a)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(a,e))}))}return t}({},b)}async loadAll(){const{wearStore:t}=this.props.stores;t.generateData();const e=Math.floor((new Date).getTime()/1e3),a=o.a.timeRangeDays(-4,11);this.setState({now:e,markerDays:a})}componentDidMount(){this.loadAll()}render(){const{now:t,markerDays:e}=this.state,{windmillStore:a,wearStore:s}=this.props.stores,{wears:r,wearsAiFiltered:c}=s,{windparks:n,currentWindparkName:o,currentWindpark:b}=a;return Object(i.h)("div",{class:"container-fluid mt-5 pt-2",style:"margin-bottom: 200px;"},Object(i.h)("div",{class:"row"},Object(i.h)("div",{class:"col-4"},Object(i.h)("h1",null,Object(i.h)("i",{class:"fas fa-thermometer"})," Wear prognosis")),Object(i.h)("div",{class:"col-8 pt-2"},Object(i.h)("ul",{class:"nav nav-pills float-right"},n&&n.map(t=>Object(i.h)("li",{class:"nav-item"},Object(i.h)("button",{class:"btn btn-link nav-link "+(t.name===o?"active":""),onClick:this.setWindpark,"data-windpark":t.name},t.name))))),Object(i.h)("div",{class:"col-12"},Object(i.h)("table",{class:"table table-sm table-striped"},Object(i.h)("thead",null,Object(i.h)("tr",null,Object(i.h)("th",{class:"w-25"},"Windmill"),Object(i.h)("th",{class:""},"Installed"),Object(i.h)("th",{class:""},"Maintainance"),Object(i.h)("th",{class:"text-center"},"Up/down rating"),Object(i.h)("th",{class:"text-center"},"Capacity"),Object(i.h)("th",{class:"text-center"},"Production"),Object(i.h)("th",{class:"text-center"},"Wear"),Object(i.h)("th",{class:"text-center"},"Burnrate"),Object(i.h)("th",{class:"text-center"},"EOL"),Object(i.h)("th",{class:"text-center"},"Location"))),Object(i.h)("tbody",null,b&&b.windmills&&b.windmills.map(t=>{const e=t.lifetimeControl||b.lifetimeControl,a=365*e*86400;let s,r,c,n,o,h,d,p,O,u,j,m,g=!1;if((t.lifetimeControl||"lifetimeControl"===b.strategy)&&(g=!0),t.installed){const e=536112e3,i=Math.floor(new Date(t.installed).getTime()/1e3),l=Math.floor((new Date).getTime()/1e3);n=l-i,r=e-e*t.wear/100,o=n/e*100,h=t.wear/o*100,c=r*(100/h),s=new Date(0),s.setUTCSeconds(l+c);const g=365*b.lifetime*86400+a;d=g-n,O=n/g*100,u=t.wear/O*100,j=Math.floor(r/d*100),p=d*(100/u),m=new Date(0),m.setUTCSeconds(l+d)}return Object(i.h)("tr",null,Object(i.h)("td",null,t.title),Object(i.h)("td",null,t.installed),Object(i.h)("td",null,t.maintainance),Object(i.h)("td",{class:"text-center"},e," years"),Object(i.h)("td",{class:"text-right"},l.a.format(j*t.capacity/100,1)," ",Object(i.h)("span",{class:"text-muted"},"(",t.capacity,")")," MW",Object(i.h)("br",null),g&&Object(i.h)("div",{class:"progress mt-2"},Object(i.h)("div",{class:"progress-bar progress-bar-striped bg-"+(j>100?"danger":"success"),role:"progressbar",style:`width: ${j}%`,"aria-valuenow":j,"aria-valuemin":"0","aria-valuemax":"100"},l.a.format(j,0),"%"))),Object(i.h)("td",{class:"text-right "+(t.production?"text-success":"text-danger")},t.production?Object(i.h)("i",{class:"fas fa-check mr-4"}):Object(i.h)("i",{class:"fas fa-exclamation-triangle mr-4"})),Object(i.h)("td",{class:"text-right"},Object(i.h)("div",{class:"progress"},Object(i.h)("div",{class:"progress-bar",role:"progressbar",style:`width: ${t.wear}%`,"aria-valuenow":t.wear,"aria-valuemin":"0","aria-valuemax":"100"},t.wear,"%"))),Object(i.h)("td",{class:"text-right"},Object(i.h)("div",{class:"progress"},Object(i.h)("div",{class:"progress-bar progress-bar-striped bg-"+(h>100?"danger":"success"),role:"progressbar",style:`width: ${h}%`,"aria-valuenow":h,"aria-valuemin":"0","aria-valuemax":"100"},l.a.format(h,0),"%")),g&&Object(i.h)("div",{class:"progress mt-2"},Object(i.h)("div",{class:"progress-bar progress-bar-striped bg-"+(u>100?"danger":"success"),role:"progressbar",style:`width: ${u}%`,"aria-valuenow":u,"aria-valuemin":"0","aria-valuemax":"100"},l.a.format(u,0),"%"))),Object(i.h)("td",{class:"text-right"},t.installed?l.a.isoDate(s,!1,!1,!0):"n/a",g&&Object(i.h)("span",{class:"text-muted"},t.installed?l.a.isoDate(m,!1,!1,!0):"n/a")),Object(i.h)("td",{class:"text-right"},t.lat,", ",t.lng))})))),Object(i.h)("div",{class:"col-12 mt-4"},Object(i.h)(h.a,{stores:this.props.stores,width:1200,height:500,showXTicks:1,xTicksVal:t=>l.a.isoDate(t),paddingTop:30,dataLeft:[...r,...c],legendLeft:["Wear","AI prediction"],yMaxLeft:30,yMinLeft:0,showYTicksLeft:1,yTicksLeftPostfix:"år",unitLeft:["år","år"],hoverValLeft:[t=>l.a.format(t,0),t=>l.a.format(t,0)],avgWindowLeft:[1,1],smoothLeft:[1,1],showValueLeftLine:!1,showValueRightLine:!1,marker:t,markers:e}))))}})||c;e.default=d}}]);
//# sourceMappingURL=route-wear.chunk.63d74.esm.js.map