(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{nKYJ:function(t,e,r){"use strict";r.r(e),function(t){function s(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(t);e&&(s=s.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,s)}return r}function c(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}var a,i=r("hosL"),o=(r("Utv1"),r("/eY4")),n=r("OhSV"),l=r("w8dD"),d=(r("bUJL"),r("4imK")),h=r("ZOvn");const b=h.a.marginTop(!0),p=h.a.marginBottom(),f=h.a.subMenuMarginTop(),O={isLoading:!1};let u=Object(o.a)(a=class extends i.Component{constructor(t){super(t),this.state=function(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?s(Object(r),!0).forEach((function(e){c(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):s(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}({},O)}async loadTracks(){this.setState({isLoading:!0});const{trackStore:t,userStore:e}=this.props.stores;await t.load(),await e.getNotifications(),this.setState({isLoading:!1})}async loadStravaActivities(){const{stravaActivityStore:t}=this.props.stores;t.load({query:{hideImported:1}})}async loadGarminActivities(){const{garminActivityDetailsStore:t}=this.props.stores;t.load({query:{hideImported:1}})}componentDidMount(){this.loadTracks(),this.loadGarminActivities()}render(){const{isLoading:e}=this.state,{trackStore:r,userStore:s,appState:c,workoutStore:a,stravaActivityStore:o,garminActivityDetailsStore:h}=this.props.stores,{tracks:O}=r,{user:u}=s,{darkmode:m}=c,{currentTeam:g}=a,{stravaActivities:j=[]}=o,{garminActivityDetails:k=[]}=h;return Object(i.h)("div",{class:"container-fluid",style:`margin-bottom: ${p}; margin-top: ${b};`},Object(i.h)("div",{class:"row fixed-top",style:`margin-top: ${f}; background-color: ${m?"#191d21":"#f8f9fa"};`},Object(i.h)("div",{class:"col text-center border-bottom border-primary subtopmenu"},Object(i.h)("a",{href:"/tracks/",class:"text-primary stretched-link"},Object(i.h)("nobr",null,Object(i.h)("i",{class:"fas fa-map-marked"})," ",Object(i.h)(n.c,{id:"tracks.your-tracks"},"Dine runder")))),Object(i.h)("div",{class:"col text-center subtopmenu"},Object(i.h)("a",{href:"/tracks/public",class:"text-secondary stretched-link"},Object(i.h)("nobr",null,Object(i.h)("i",{class:"fas fa-map-marked"})," ",Object(i.h)(n.c,{id:"tracks.public-tracks"},"Offentlige runder"))))),Object(i.h)("div",{class:"row"},Object(i.h)("div",{class:"col-12"},Object(i.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 px-0"},Object(i.h)("h5",null,Object(i.h)(n.c,{id:"tracks.all-tracks",fields:{total:O.length}},"Treningsrundene dine - ",O.length," stk"))),Object(i.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 px-0 clearfix mb-2"},Object(i.h)("a",{class:"btn btn-sm btn-primary float-right",href:"/tracks/edit/new"},Object(i.h)("i",{class:"fas fa-plus"})," ",Object(i.h)(n.c,{id:"tracks.add-new"},"Legg til runde"))),!e&&O&&0===O.length&&Object(i.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 text-muted"},Object(i.h)("div",{class:"text-center mb-5"},Object(i.h)("div",{class:"display-1"},Object(i.h)("i",{class:"fas fa-map-marked"})),Object(i.h)("h5",null,Object(i.h)(n.c,{id:"tracks.no-tracks-yet"},"Ingen runder er registrert ennå."))),Object(i.h)("p",{class:"text-center"},Object(i.h)("p",null,Object(i.h)(n.c,{id:"tracks.no-tracks-info-1"},"Du har mulighet til å laste opp GPX-filer fra rundene dine.")),Object(i.h)("p",null,Object(i.h)(n.c,{id:"tracks.no-tracks-info-2"},"Det finnes mange apper som lar deg lage GPX-filer, men vi anbefaler"),":"),"ViewRanger for ",Object(i.h)("a",{href:"https://apps.apple.com/gb/app/viewranger-hike-ride-or-walk/id404581674"},"iOS")," and  ",Object(i.h)("a",{href:"https://play.google.com/store/apps/details?id=com.augmentra.viewranger.android&hl=en"},"Android"),"."),Object(i.h)(n.c,{id:"tracks.howto-title"},"Slik kommer du i gang"),":",Object(i.h)("ol",null,Object(i.h)("li",null,Object(i.h)(n.c,{id:"tracks.howto-1"},'Trykk på knappen "Legg til runde" rett nedenfor.')))))),Object(i.h)("div",{class:"row"},u&&u.garmin&&Object(i.h)(t,null,Object(i.h)(d.a,{stores:this.props.stores,activities:k,asTrack:!0,key:`garmin-${g}-${k.length}`}))),Object(i.h)("div",{class:"row"},Object(i.h)("div",{class:"col-12"},O&&O.map(t=>Object(i.h)(l.a,{stores:this.props.stores,track:t})))))}})||a;e.default=u}.call(this,r("hosL").Fragment)}}]);
//# sourceMappingURL=route-tracks.chunk.1c660.esm.js.map