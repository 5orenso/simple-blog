(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{B7Gj:function(t,e,r){"use strict";function s(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(t);e&&(s=s.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,s)}return r}function c(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function n(t){switch(t.type){case 1:return"border-primary";case 2:return"border-danger";case 3:return"border-success"}}r.r(e);var o,l=r("hosL"),a=r("Gblv"),i=r("/eY4");const b={};let u=Object(i.a)(o=class extends l.Component{constructor(t){super(t),this.state=function(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?s(Object(r),!0).forEach((function(e){c(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):s(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}({},b),this.loadWorkouts()}loadWorkouts(){const{workoutStore:t}=this.props.stores;t.load()}render(){const{workoutStore:t}=this.props.stores,{workouts:e}=t;return Object(l.h)("div",{class:"container-fluid",style:"margin-bottom: 100px; margin-top: 60px;"},Object(l.h)("div",{class:"row"},Object(l.h)("div",{class:"col-12"},Object(l.h)("h5",null,"Treningsturene dine - ",e.length," stk"),Object(l.h)("div",{class:"row"},e&&e.map(t=>Object(l.h)("div",{class:"col-6 col-sm-4 col-md-3 col-lg-2 mt-2 p-2"},Object(l.h)("div",{class:`text-center border ${n(t)} rounded p-2 mb-1`},Object(l.h)("a",{href:"/workouts/"+t.id},t.image?Object(l.h)("img",{src:t.image,class:"img-fluid"}):Object(l.h)("i",{class:"fas fa-running text-muted",style:"font-size: 4vw;"}))),Object(l.h)("div",null,t.name),Object(l.h)("div",null,Object(l.h)("small",{class:"float-right text-muted"},a.a.isoDate(t.date)),Object(l.h)("br",null)),Object(l.h)("div",null,Object(l.h)("small",null,Object(l.h)("span",{class:"text-muted"},Object(l.h)("i",{class:"fas fa-road"})," ",t.distanceKm,"km",Object(l.h)("i",{class:"fas fa-mountain ml-2"})," ",t.elevation,"m",t.dogs&&Object(l.h)("span",null,Object(l.h)("i",{class:"fas fa-dog ml-2"})," ",t.dogs.length)),Object(l.h)("i",null,t.url),Object(l.h)("br",null)))))),Object(l.h)("div",{class:"col-12"},Object(l.h)("a",{class:"btn btn-primary mt-5 float-right",href:"/workouts/new"},Object(l.h)("i",{class:"fas fa-plus"})," Legg til treningstur")))))}})||o;e.default=u}}]);
//# sourceMappingURL=route-workouts.chunk.b209b.esm.js.map