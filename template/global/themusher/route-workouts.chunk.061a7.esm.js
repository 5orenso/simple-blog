(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{B7Gj:function(e,t,s){"use strict";function r(e,t){var s=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),s.push.apply(s,r)}return s}function c(e,t,s){return t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s,e}function n(e){switch(e.type){case 1:return"border-primary";case 2:return"border-danger";case 3:return"border-success"}}function a(e){switch(e.type){case 1:return"fas fa-running";case 2:return"fas fa-flag-checkered";case 3:return"fas fa-hiking"}}s.r(t);var o,l=s("hosL"),i=s("Utv1"),u=s("/eY4");const b={};let h=Object(u.a)(o=class extends l.Component{constructor(e){super(e),this.state=function(e){for(var t=1;t<arguments.length;t++){var s=null!=arguments[t]?arguments[t]:{};t%2?r(Object(s),!0).forEach((function(t){c(e,t,s[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(s)):r(Object(s)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(s,t))}))}return e}({},b),this.loadWorkouts()}loadWorkouts(){const{workoutStore:e}=this.props.stores;e.load()}render(){const{workoutStore:e,userStore:t}=this.props.stores,{workouts:s}=e;return Object(l.h)("div",{class:"container-fluid",style:"margin-bottom: 100px; margin-top: 60px;"},Object(l.h)("div",{class:"row"},Object(l.h)("div",{class:"col-12"},Object(l.h)("a",{class:"btn btn-primary btn-sm float-right",href:"/workouts/edit/new"},Object(l.h)("i",{class:"fas fa-plus"})," Legg til treningstur")),Object(l.h)("div",{class:"col-12"},Object(l.h)("h5",null,"Treningsturene - ",s.length," stk"),Object(l.h)("div",{class:"row"},s&&s.map(e=>Object(l.h)("div",{class:"col-12 col-sm-6 col-lg-2 mt-2 p-2 d-flex"},Object(l.h)("div",{class:"text-center border rounded-circle imageRounded "+n(e),style:e.image?`background-image: url("${e.image.s3SmallLink}");`:""},!e.image&&Object(l.h)("i",{class:a(e)+" text-muted mt-3",style:"font-size: 40px;"})),Object(l.h)("div",{class:"flex-grow-1 pl-3"},Object(l.h)("a",{class:"stretched-link",href:"/workouts/"+e.id},Object(l.h)("h5",{class:"my-0"},e.name)),t.findTeam(e.team),Object(l.h)("br",null),Object(l.h)("small",null,Object(l.h)("span",{class:"text-muted"},Object(l.h)("i",{class:"fas fa-tools"})," ",e.equipment,Object(l.h)("i",{class:"fas fa-road ml-2"})," ",e.distanceKm,"km",Object(l.h)("i",{class:"fas fa-mountain ml-2"})," ",e.elevation,"m",e.dogs&&Object(l.h)("span",null,Object(l.h)("i",{class:"fas fa-dog ml-2"})," ",e.dogs.length)),Object(l.h)("i",null,e.url),Object(l.h)("br",null)),Object(l.h)("small",{class:"text-muted"},i.a.isoDate(e.date,!1,!1,!0))))))),Object(l.h)("div",{class:"col-12"},Object(l.h)("a",{class:"btn btn-primary btn-sm mt-5 float-right",href:"/workouts/edit/new"},Object(l.h)("i",{class:"fas fa-plus"})," Legg til treningstur"))))}})||o;t.default=h}}]);
//# sourceMappingURL=route-workouts.chunk.061a7.esm.js.map