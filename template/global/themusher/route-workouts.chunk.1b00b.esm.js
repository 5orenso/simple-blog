(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{B7Gj:function(t,e,s){"use strict";s.r(e),function(t){function r(t,e){var s=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),s.push.apply(s,r)}return s}function o(t,e,s){return e in t?Object.defineProperty(t,e,{value:s,enumerable:!0,configurable:!0,writable:!0}):t[e]=s,t}var a,c,l=s("hosL"),n=s("Utv1"),i=s("/eY4"),h=s("JWe/"),b=s("3pQw"),m=s("bbv7");const u=["jan","feb","mar","apr","mai","jun","jul","aug","sep","okt","nov","des"],d={isLoading:!1};let f=Object(i.a)(a=class extends l.Component{constructor(...t){super(...t),this.toggleTeam=t=>{const{callback:e}=this.props,{workoutStore:s}=this.props.stores,{currentTeam:r}=s;s.setCurrentTeam(t===r?void 0:t),n.a.isDefined(e)&&e()}}render(){const{userStore:t,workoutStore:e}=this.props.stores,{teams:s}=t,{currentTeam:r}=e;return Object(l.h)("div",{class:"container-fluid px-0"},Object(l.h)("div",{class:"row"},s&&s.map(t=>Object(l.h)("div",{class:"col-6 mb-2"},Object(l.h)("div",{class:"border rounded rounded-pill px-3 py-2 "+(r===t.id?"bg-success":""),style:"line-height: 0.9em; cursor: pointer; pointer-events: inherit;",onClick:()=>this.toggleTeam(t.id)},Object(l.h)("small",null,Object(l.h)("i",{class:"fas fa-users mr-2"}),t.name))))))}})||a,p=Object(i.a)(c=class extends l.Component{constructor(t){var e;super(t),e=this,this.loadWorkouts=async function(){e.setState({isLoading:!0});const{workoutStore:t}=e.props.stores,{currentTeam:s}=t;await t.load({query:{team:s}}),await e.loadWorkoutSummary(),e.setState({isLoading:!1})},this.loadDogs=async function(){const{dogStore:t}=e.props.stores,{currentTeam:s}=t;await t.load({query:{team:s},addData:["workoutSummary"]})},this.state=function(t){for(var e=1;e<arguments.length;e++){var s=null!=arguments[e]?arguments[e]:{};e%2?r(Object(s),!0).forEach((function(e){o(t,e,s[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(s)):r(Object(s)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(s,e))}))}return t}({},d)}async loadTracks(){const{trackStore:t}=this.props.stores;await t.load()}async loadWorkoutSummary(){const{userStore:t,workoutStore:e}=this.props.stores,{currentTeam:s}=e;await t.getWorkoutSummary({team:s})}componentDidMount(){this.loadWorkouts(),this.loadDogs(),this.loadTracks()}render(){const{userStore:e,appState:s,workoutStore:r}=this.props.stores,{darkmode:o}=s,a=r.getLatests(),{workoutSummaryWeek:c=[],graphWorkoutSummaryWeekDistanceCurrent:i,graphWorkoutSummaryWeekDistancePrev:d,graphWorkoutSummaryWeekElevationCurrent:p,graphWorkoutSummaryWeekElevationPrev:O}=e;return Object(l.h)("div",{class:"container-fluid",style:"margin-bottom: 100px; margin-top: 90px;"},Object(l.h)("div",{class:"row mb-4 fixed-top",style:`margin-top: 58px; background-color: ${o?"#191d21":"#f8f9fa"};`},Object(l.h)("div",{class:"col text-center border-bottom border-primary"},Object(l.h)("a",{href:"/workouts/",class:"text-primary stretched-link"},Object(l.h)("i",{class:"fas fa-chart-line"})," Oversikt")),Object(l.h)("div",{class:"col text-center"},Object(l.h)("a",{href:"/workouts/list",class:"text-secondary stretched-link"},Object(l.h)("i",{class:"fas fa-list"})," Liste")),Object(l.h)("div",{class:"col text-center"},Object(l.h)("a",{href:"/workouts/plan",class:"text-secondary stretched-link"},Object(l.h)("i",{class:"fas fa-calendar-alt"})," Plan"))),Object(l.h)("div",{class:"row"},Object(l.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 border-bottom"},Object(l.h)(f,{stores:this.props.stores,callback:this.loadWorkouts})),Object(l.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 mt-2 mb-2"},Object(l.h)("a",{class:"btn btn-primary btn-sm float-right",href:"/workouts/edit/new"},Object(l.h)("i",{class:"fas fa-plus"})," Legg til treningstur")),Object(l.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3"},c&&c.length>0&&Object(l.h)(t,null,Object(l.h)("h5",null,"Trenings statistikk"),Object(l.h)("div",{class:"w-100 mt-3 mb-4"},Object(l.h)("small",{class:"mb-4"},Object(l.h)("small",null,Object(l.h)("table",{class:"table table-sm font-weigth-lighter border-bottom"},Object(l.h)("thead",null,Object(l.h)("tr",null,Object(l.h)("th",{style:"padding: .2rem;"},"Mnd"),n.a.range(1,12).map(t=>Object(l.h)("th",{class:"text-right",style:"padding: .2rem;"},u[t-1])))),Object(l.h)("tbody",null,Object(l.h)("tr",null,Object(l.h)("th",{scope:"row",style:"padding: .2rem;"},"2019"),n.a.range(1,12).map(s=>Object(l.h)(t,null,Object(l.h)("td",{class:"text-right",style:"padding: .2rem;"},e.findWorkoutSummaryMonth(2019,s),Object(l.h)("br",null),e.findWorkoutSummaryMonth(2019,s,"elevation"),Object(l.h)("br",null)))),Object(l.h)("td",{class:"text-muted",style:"padding: .2rem;"},Object(l.h)("nobr",null,Object(l.h)("i",{class:"fas fa-road"})," km"),Object(l.h)("br",null),Object(l.h)("nobr",null,Object(l.h)("i",{class:"fas fa-mountain"})," m"),Object(l.h)("br",null))),Object(l.h)("tr",null,Object(l.h)("th",{scope:"row",style:"padding: .2rem;"},"2020"),n.a.range(1,12).map(s=>Object(l.h)(t,null,Object(l.h)("td",{class:"text-right",style:"padding: .2rem;"},e.findWorkoutSummaryMonth(2020,s),Object(l.h)("br",null),e.findWorkoutSummaryMonth(2020,s,"elevation"),Object(l.h)("br",null)))),Object(l.h)("td",{class:"text-muted",style:"padding: .2rem;"},Object(l.h)("nobr",null,Object(l.h)("i",{class:"fas fa-road"})," km"),Object(l.h)("br",null),Object(l.h)("nobr",null,Object(l.h)("i",{class:"fas fa-mountain"})," m"),Object(l.h)("br",null))))))),Object(l.h)(m.a,{stores:this.props.stores,width:500,height:150,showXTicks:1,xTicksVal:t=>"uke "+t,paddingTop:30,lineFromXzero:!0,lineFromXmax:!0,dataLeft:[i,d],legendLeft:["2020 Distanse","2019 Distanse"],showYTicksLeft:1,yTicksLeftPostfix:"km",unitLeft:["km","km"],avgWindowLeft:[0,0],smoothLeft:[1,1],dataRight:[p,O],legendRight:["2020 Høydemeter","2019 Høydemeter"],showYTicksRight:1,yTicksRightPostfix:"m",unitRight:["m","m"],avgWindowRight:[0,0],smoothRight:[1,1]}))),i&&i.length<2&&Object(l.h)("div",{class:"mb-5 py-3 border-top border-bottom"},Object(l.h)("div",{class:"text-left",style:"line-height: 1.0em;"},Object(l.h)("div",{class:"display-4 float-left text-warning mr-3"},Object(l.h)("i",{class:"fas fa-paw"})),Object(l.h)("small",null,"Foreløpig er det litt lite data for å kunne vise noen fine grafer. Etterhvert som du legger inn flere treninger så vil dette bli en fin tabell og graf som viser progresjonen din."))))),Object(l.h)("div",{class:"row"},a&&a.length>0&&Object(l.h)("div",{class:"col-12 mb-4"},Object(l.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 px-0 mt-4"},Object(l.h)("h5",null,"Nyeste treningsturer - ",a.length," stk")),a&&a.map(t=>Object(l.h)(h.a,{stores:this.props.stores,workout:t})))),Object(l.h)("div",{class:"row"},c&&c.length>0&&Object(l.h)("div",{class:"col-12 mb-4"},Object(l.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 px-0"},Object(l.h)("h5",{class:"mt-4"},"Treningsoversikt")),c&&c.map(t=>Object(l.h)(b.a,{stores:this.props.stores,summary:t})))))}})||c;e.default=p}.call(this,s("hosL").Fragment)}}]);
//# sourceMappingURL=route-workouts.chunk.1b00b.esm.js.map