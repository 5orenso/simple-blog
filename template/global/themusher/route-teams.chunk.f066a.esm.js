(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{"+sdk":function(e,t,s){"use strict";function r(e,t){var s=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),s.push.apply(s,r)}return s}function c(e,t,s){return t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s,e}s.r(t);var n,o=s("hosL"),a=(s("Utv1"),s("/eY4"));const l={};let i=Object(a.a)(n=class extends o.Component{constructor(e){super(e),this.state=function(e){for(var t=1;t<arguments.length;t++){var s=null!=arguments[t]?arguments[t]:{};t%2?r(Object(s),!0).forEach((function(t){c(e,t,s[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(s)):r(Object(s)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(s,t))}))}return e}({},l),this.loadTeams()}loadTeams(){const{teamStore:e}=this.props.stores;e.load()}render(){const{teamStore:e,userStore:t}=this.props.stores,{teams:s}=e,{user:r}=t;return Object(o.h)("div",{class:"container-fluid",style:"margin-bottom: 100px; margin-top: 60px;"},Object(o.h)("div",{class:"row"},Object(o.h)("div",{class:"col-12"},Object(o.h)("h5",null,"Teamene dine - ",s.length," stk"),Object(o.h)("div",{class:"row"},s&&s.map(e=>Object(o.h)("div",{class:"col-6 col-sm-4 col-lg-2 mt-2 p-2 "+(r.team===e.id?"border border-success rounded":"")},Object(o.h)("div",{class:"text-center border rounded p-2 mb-1"},Object(o.h)("a",{href:"/teams/"+e.id,class:"stretched-link"},e.image?Object(o.h)("img",{src:e.image,class:"img-fluid"}):Object(o.h)("i",{class:"fas fa-users text-muted",style:"font-size: 4vw;"}))),Object(o.h)("div",null,e.name),Object(o.h)("small",null,Object(o.h)("span",{class:"float-right text-muted"},e&&e.dogs&&e.dogs.length," ",Object(o.h)("i",{class:"fas fa-dog mr-2"}),e&&e.members&&e.members.length," ",Object(o.h)("i",{class:"fas fa-user"})),Object(o.h)("i",null,e.url),Object(o.h)("br",null))))),Object(o.h)("div",{class:"col-12"},Object(o.h)("a",{class:"btn btn-primary mt-5 float-right",href:"/teams/new"},Object(o.h)("i",{class:"fas fa-plus"})," Legg til team")))))}})||n;t.default=i}}]);
//# sourceMappingURL=route-teams.chunk.f066a.esm.js.map