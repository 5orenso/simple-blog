(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{"+sdk":function(t,e,s){"use strict";function r(t,e){var s=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),s.push.apply(s,r)}return s}function o(t,e,s){return e in t?Object.defineProperty(t,e,{value:s,enumerable:!0,configurable:!0,writable:!0}):t[e]=s,t}s.r(e);var a,c,n=s("hosL"),i=s("Utv1"),l=s("/eY4"),m=s("OhSV"),f=s("ZOvn"),h=s.n(f),p=Object(l.a)(a=function(t){function e(){return t.apply(this,arguments)||this}var s,r;return r=t,(s=e).prototype=Object.create(r.prototype),s.prototype.constructor=s,s.__proto__=r,e.prototype.render=function(){var t=this.props.team,e=this.props.stores.teamStore.findWorkoutSummary(t.id,2020)||{};return Object(n.h)("div",{class:"w-100 mb-3"},Object(n.h)("div",{class:"row"},Object(n.h)("div",{class:"col-12 col-sm-8 col-lg-6 offset-sm-2 offset-lg-3 d-flex mb-0 position-relative"},Object(n.h)("div",{class:"text-center border rounded-circle imageRounded",style:t.image?'background-image: url("'+t.image.s3SmallLink+'");':""},!t.image&&Object(n.h)("i",{class:"fas fa-users text-muted mt-3",style:"font-size: 40px;"})),Object(n.h)("div",{class:"flex-grow-1 pl-3",style:"line-height: 1.2em;"},Object(n.h)("a",{class:"stretched-link",href:"/teams/"+t.id},Object(n.h)("h5",{class:"mb-1",style:"line-height: 1.0em;"},t.name)),Object(n.h)("small",{class:"text-muted"},t&&t.dogs&&Object(n.h)("span",{class:""},Object(n.h)("i",{class:"fas fa-dog"})," ",t.dogs.length),t&&t.members&&Object(n.h)("span",{class:"ml-2"},Object(n.h)("i",{class:"fas fa-user"})," ",t.members.length),e&&e.distanceKm>0&&Object(n.h)("span",{class:"ml-2"},Object(n.h)("i",{class:"fas fa-road"})," ",i.a.format(e.distanceKm,0),"km"),e&&e.elevation>0&&Object(n.h)("span",{class:"ml-2"},Object(n.h)("i",{class:"fas fa-mountain"})," ",i.a.format(e.elevation,0),"m"),e&&e.duration>0&&Object(n.h)("span",{class:"ml-2"},Object(n.h)("i",{class:"fas fa-clock"})," ",i.a.secToHms(e.duration)),e&&e.speedAvg>0&&Object(n.h)("span",{class:"ml-2"},Object(n.h)("i",{class:"fas fa-tachometer-alt"})," ",i.a.format(e.speedAvg,1),"km/t"))))))},e}(n.Component))||a,b=h.a.marginTop(!1),u=(h.a.marginTopBack(!1),h.a.marginBottom()),d={isLoading:!1},O=Object(l.a)(c=function(t){function e(e){var s;return(s=t.call(this,e)||this).state=function(t){for(var e=1;e<arguments.length;e++){var s=null!=arguments[e]?arguments[e]:{};e%2?r(Object(s),!0).forEach((function(e){o(t,e,s[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(s)):r(Object(s)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(s,e))}))}return t}({},d),s}var s,a;a=t,(s=e).prototype=Object.create(a.prototype),s.prototype.constructor=s,s.__proto__=a;var c=e.prototype;return c.loadTeams=function(){return new Promise(function(t,e){var s,r;return this.setState({isLoading:!0}),r=(s=this.props.stores).userStore,Promise.resolve(s.teamStore.load(void 0,!1,{addData:["workoutSummary","musherSummary"]})).then(function(){try{return Promise.resolve(r.getNotifications()).then(function(){try{return this.setState({isLoading:!1}),t()}catch(t){return e(t)}}.bind(this),e)}catch(t){return e(t)}}.bind(this),e)}.bind(this))},c.componentDidMount=function(){this.loadTeams()},c.render=function(){var t=this,e=this.props.stores,s=e.teamStore.teams;return Object(n.h)("div",{class:"container-fluid",style:"margin-bottom: "+u+"; margin-top: "+b+";"},Object(n.h)("div",{class:"row"},Object(n.h)("div",{class:"col-12"},Object(n.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 px-0"},Object(n.h)("h5",null,Object(n.h)(m.c,{id:"teams.all-teams",fields:{total:s.length}},"Teamene dine - ",s.length," stk"))),Object(n.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 px-0 clearfix mb-2"},Object(n.h)("a",{class:"btn btn-sm btn-primary float-right",href:"/teams/edit/new"},Object(n.h)("i",{class:"fas fa-plus"})," ",Object(n.h)(m.c,{id:"teams.add-new"},"Legg til team"))),s&&s.map((function(e){return Object(n.h)(p,{stores:t.props.stores,team:e})})))))},e}(n.Component))||c;e.default=O}}]);
//# sourceMappingURL=route-teams.chunk.d8cd6.js.map