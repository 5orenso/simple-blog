(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{"+1Jk":function(t,e,s){"use strict";s.r(e),function(t){function a(t,e){var s=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),s.push.apply(s,a)}return s}function o(t,e,s){return e in t?Object.defineProperty(t,e,{value:s,enumerable:!0,configurable:!0,writable:!0}):t[e]=s,t}var c,r=s("hosL"),l=s("Utv1"),n=s("/eY4"),i=s("OhSV"),h=s("ZOvn"),d=s("JWe/"),b=s("WAWY"),m=s("azdc"),u=s("XPU5"),O=(s("ZWUU"),s("CE5K")),p=s("qv+O"),f=s("sgpT"),j=s("0SNj"),g=s("9Bb9"),v=s("bUJL"),w=s("4imK"),k=s("pJjI"),y=s("L3gU"),x=s("AEg1"),S=s("gOLw"),P=s("epqT"),D=s("w93r");const L=h.a.marginTop(!0),T=h.a.marginBottom(),I=h.a.subMenuMarginTop(),W={isLoading:!1,submenu:"lastWorkouts",viewmenu:"wall"};let C=Object(n.a)(c=class extends r.Component{constructor(t){var e;super(t),e=this,this.loadTeamInfo=async function(){await e.loadWorkoutSummary(),await e.loadWorkoutPlans()},this.loadWorkoutPlans=async function(t=e.props){const{year:s}=t,a=(new Date).getMonth()+1,o=l.a.getYear(),c=parseInt(s||(a<6?o-1:o),10),{workoutPlanStore:r,workoutStore:n,userStore:i}=t.stores,{team:h}=i,{currentTeam:d=h.id}=n;if(d){await r.load({query:{team:d,seasonYear:c,seasonMonth:6}});const{workoutPlans:t}=r,e=t[0]||{};e.id&&(await r.load(e.id),r.prepareWeekGraphs({year:s}))}else r.updateItem("workoutPlans",[]),r.updateItem("workoutPlan",{}),r.resetGraphPlanWeekDistanceCurrent()},this.loadDogs=async function(){const{dogStore:t}=e.props.stores,{currentTeam:s}=t;await t.load({query:{team:s},addData:["workoutSummary"]})},this.reloadFeeds=async function(t){t.preventDefault(),e.setState({isLoading:!0}),await e.loadStoriesPublicFeed(),await e.loadTeamsPublicFeed(),e.setState({isLoading:!1})},this.setViewMenu=t=>{t.preventDefault();const e=t.target.closest("a").dataset.menu;this.setState({viewmenu:e})},this.toggleViewmode=t=>{const{appState:e}=this.props.stores;let s=t.target.dataset.mode;!s&&t.target.parentNode&&(s=t.target.parentNode.dataset.mode),e.toggleViewmode(s)},this.chooseSubmenu=t=>{this.setState({submenu:t.target.parentElement.dataset.menu||t.target.dataset.menu})},this.state=function(t){for(var e=1;e<arguments.length;e++){var s=null!=arguments[e]?arguments[e]:{};e%2?a(Object(s),!0).forEach((function(e){o(t,e,s[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(s)):a(Object(s)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(s,e))}))}return t}({},W)}async loadAll(){const{appState:t,userStore:e}=this.props.stores;this.setState({isLoading:!0}),await t.getFingerprint(),await e.getInfo(),await e.getNotifications();const{user:s}=e;if(s.currentLocationInfo&&s.currentLocationInfo.coords){const{latitude:t,longitude:a,altitude:o}=s.currentLocationInfo.coords;e.getWeatherUser({lat:t,lon:a,altitude:o})}await this.loadWorkoutSummary(),await Promise.all([this.loadWorkoutPlans(),this.loadTeams()]),this.setState({isLoading:!1})}async loadTeams(t=this.props){const{teamStore:e,workoutStore:s}=t.stores,{currentTeam:a}=s;await e.load({query:{team:a,skipMusherWorkoutSummary:!0},addData:["workoutSummary"]})}async loadFeed(){const{userStore:t}=this.props.stores;await t.getFeed({})}async loadWorkoutSummary(){const{userStore:t,workoutStore:e}=this.props.stores,{currentTeam:s}=e;await t.getWorkoutSummary({team:s})}async loadStoriesPublicFeed(t=this.props){const{storyStore:e}=t.stores;await e.loadPublicFeed()}async loadTeamsPublicFeed(t=this.props){const{teamStore:e}=t.stores;await e.loadPublicFeed()}componentDidMount(){this.loadAll()}render(){const{isLoading:e,submenu:s,viewmenu:a}=this.state,{userStore:o,appState:c,workoutPlanStore:n,teamStore:h,workoutStore:W,stravaActivityStore:C,garminActivityDetailsStore:E}=this.props.stores,{workoutPlan:M,workoutPlans:F}=n,{darkmode:$,viewmode:A}=c,{workouts:R,teams:V,tracks:U,isAdmin:z,dogs:q,user:Y}=o,{yrWeather:K,currentLocationGeocode:N={}}=Y,{formatted_address:B}=N,Z=V.length,G=q.length,H=U.length,{currentTeam:J,cordovaActiveTrackingParams:X,isRunning:_,totalDistance:Q,currentSpeed:tt,totalTime:et}=W,st=o.findTeam(J,!0),{workoutSummary:at}=h,ot=(J?h.findWorkoutSummary(J,2019):h.findWorkoutSummaryTotal(2019))||{},ct=(J?h.findWorkoutSummary(J,2020):h.findWorkoutSummaryTotal(2020))||{},{stravaActivities:rt}=C,{garminActivityDetails:lt}=E;return Object(r.h)("div",{class:"container-fluid",style:`margin-bottom: ${T}; margin-top: ${L};`},Object(r.h)("div",{class:"row mb-4 fixed-top",style:`margin-top: ${I}; background-color: ${$?"#191d21":"#f8f9fa"};`},z&&Object(r.h)("div",{class:"col text-center subtopmenu"},Object(r.h)("a",{href:"/admin",class:"text-secondary stretched-link"},Object(r.h)("nobr",null,Object(r.h)("i",{class:"fas fa-user-shield"})," ",Object(r.h)(i.c,{id:"home.admin"},"Admin")))),Object(r.h)("div",{class:"col text-center subtopmenu border-bottom border-primary"},Object(r.h)("a",{href:"/",class:"text-primary stretched-link"},Object(r.h)("nobr",null,Object(r.h)("i",{class:"fas fa-chart-line"})," ",Object(r.h)(i.c,{id:"home.dashboard"},"Dashboard")))),Object(r.h)("div",{class:"col text-center subtopmenu"},Object(r.h)("a",{href:"/feed",class:"text-secondary stretched-link"},Object(r.h)("nobr",null,Object(r.h)("i",{class:"fas fa-rss"})," ",Object(r.h)(i.c,{id:"home.feed"},"Feed")))),Object(r.h)("div",{class:"col text-center subtopmenu"},Object(r.h)("a",{href:"/todo",class:"text-secondary stretched-link"},Object(r.h)("nobr",null,Object(r.h)("i",{class:"fas fa-list"})," ",Object(r.h)(i.c,{id:"home.todo"},"Todo"))))),_&&X&&Object(r.h)(t,null,Object(r.h)("div",{class:"row"},Object(r.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 border-bottom bg-light py-4"},Object(r.h)("h1",{class:"text-success font-weight-bold"},"Tracking",Object(r.h)("div",{class:"spinner-grow ml-3",role:"status"})),Object(r.h)("div",{class:"row mb-3"},Object(r.h)("div",{class:"col-4 text-center font-weight-bold",style:"font-size: 1.3em;"},l.a.secToHms(et)),Object(r.h)("div",{class:"col-4 text-center font-weight-bold",style:"font-size: 1.3em;"},l.a.format(3.6*tt,1)," km/t"),Object(r.h)("div",{class:"col-4 text-center font-weight-bold",style:"font-size: 1.3em;"},l.a.format(Q/1e3,2)," km")),Object(r.h)("a",{class:"btn btn-block btn-danger",href:"/workouts/tracking"},Object(r.h)(i.c,{id:"workouts.go-to-tracking"},"Go to tracking"))))),["beta"].indexOf(A)>-1?Object(r.h)(t,null,Object(r.h)(P.a,{stores:this.props.stores,url:this.props.url}),Object(r.h)("div",{class:"row"},Object(r.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 text-center"},Object(r.h)("button",{type:"button",class:"btn btn-link btn-sm font-weight-lighter","data-mode":"normal",onClick:this.toggleViewmode},Object(r.h)("small",null,Object(r.h)("i",{class:"fas fa-flask"})," ",Object(r.h)(i.c,{id:"header.viewmode-back-to-normal"},"Gå tilbake til vanlig versjon"))))),Object(r.h)("div",{class:"bg-light"},Object(r.h)(D.a,{stores:this.props.stores,data:K,place:B})),Object(r.h)(x.a,{stores:this.props.stores}),Object(r.h)("div",{class:"row bg-light"},Object(r.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 border-bottom"},Object(r.h)("small",null,Object(r.h)("small",null,Object(r.h)("div",{class:"float-right"},e?Object(r.h)(t,null,Object(r.h)("div",{class:"spinner-border text-primary",role:"status"},Object(r.h)("span",{class:"sr-only"},"Loading..."))):Object(r.h)(t,null,Object(r.h)("a",{href:"#",style:"font-size: 1.8em;",onClick:this.reloadFeeds},Object(r.h)("i",{class:"fas fa-sync-alt"})))),Object(r.h)("ul",{class:"nav nav-sm nav-tabs"},Object(r.h)("li",{class:"nav-item"},Object(r.h)("a",{class:"nav-link "+("wall"===a?"active":""),href:"#",onClick:this.setViewMenu,"data-menu":"wall"},Object(r.h)("i",{class:"fas fa-rss"})," ",Object(r.h)(i.c,{id:"home.wall"},"Veggen"))),Object(r.h)("li",{class:"nav-item"},Object(r.h)("a",{class:"nav-link "+("workout"===a?"active":""),href:"#",onClick:this.setViewMenu,"data-menu":"workout"},Object(r.h)("i",{class:"fas fa-running"})," ",Object(r.h)(i.c,{id:"home.workouts"},"Treninger"))),Object(r.h)("li",{class:"nav-item"},Object(r.h)("a",{class:"nav-link "+("totals"===a?"active":""),href:"#",onClick:this.setViewMenu,"data-menu":"totals"},Object(r.h)("i",{class:"fas fa-list-ol"})," ",Object(r.h)(i.c,{id:"home.totals"},"Totaler")))))))),"wall"===a&&Object(r.h)(t,null,Object(r.h)(S.a,{stores:this.props.stores})),"workout"===a&&Object(r.h)(t,null,Object(r.h)(y.a,{stores:this.props.stores})),"totals"===a&&Object(r.h)(t,null,Object(r.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 border-bottom"},Object(r.h)(k.a,{stores:this.props.stores,callback:this.loadTeamInfo,key:"teams-"+J}),Object(r.h)(j.a,{stores:this.props.stores,key:"totals-"+ct.distancekm,currentSeason:ct,prevSeason:ot}),Object(r.h)(g.a,{stores:this.props.stores,key:"status-"+ct.distancekm,currentSeason:ct,prevSeason:ot})))):Object(r.h)(t,null,Object(r.h)("div",{class:"row"},Object(r.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 border-bottom"},Object(r.h)(k.a,{stores:this.props.stores,callback:this.loadTeamInfo,key:"teams-"+J})),Object(r.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3"},!e&&at&&0===at.length&&Object(r.h)("div",{class:"mb-5 py-3 border-top border-bottom"},Object(r.h)("div",{class:"text-center"},Object(r.h)("div",{class:"display-4"},Object(r.h)("i",{class:"fas fa-paw"})),Object(r.h)("h5",null,Object(r.h)(i.c,{id:"home.welcome-title"},"Velkommen til The Musher.")),Object(r.h)("p",null,Object(r.h)(i.c,{id:"home.welcome-body-1"},"The Musher er en app som er kontinuerlig under utvikling. Alle ideer/innspill/kommentarer mottas med stor takk på Facebooksiden vår 😃")),Object(r.h)("p",null,Object(r.h)(i.c,{id:"home.welcome-body-2"},"Fokus til appen er enkel registrering av hunder, team, treninger og hendelser rundt hundene. Når man har mange hunder så er det ofte vanskelig å holde styr på løpetid, vaksiner, treninger, skader, vetrinærbesøk, chiplister, osv.")),Object(r.h)("p",null,Object(r.h)(i.c,{id:"home.welcome-body-3"},"Alle data lagres sentralt i skyen hos AWS (Amazon Web Services) og det vil derfor være mulig å bruke appen fra flere telefoner og datamaskiner samtidig. Dette kan være fint dersom det er flere som trener og følger opp hundene."))),Object(r.h)("h5",null,Object(r.h)(i.c,{id:"home.howto-title"},"Slik kommer du i gang:")),Object(r.h)("ol",null,Z<1&&Object(r.h)("li",null,Object(r.h)("a",{class:"btn btn-info mt-3",href:"/teams/"},Object(r.h)(i.c,{id:"home.howto-step-1"},"Legg inn teamene dine."))),G<1&&Object(r.h)("li",null,Object(r.h)("a",{class:"btn btn-info mt-3",href:"/dogs/"},Object(r.h)(i.c,{id:"home.howto-step-2"},"Legg inn hundene dine."))),H<1&&Object(r.h)("li",null,Object(r.h)("a",{class:"btn btn-info mt-3",href:"/tracks/"},Object(r.h)(i.c,{id:"home.howto-step-3"},"Legg inn rundene dine."))),Object(r.h)("li",null,Object(r.h)("a",{class:"btn btn-info mt-3",href:"/workouts/"},Object(r.h)(i.c,{id:"home.howto-step-4"},"Begynn å registrere treningene."))))),Object(r.h)(b.a,{stores:this.props.stores,isLoading:e,key:`graph-${M.id}-${F.length}`}),["beta","advanced"].indexOf(A)>-1&&Object(r.h)(t,null,Object(r.h)(m.a,{stores:this.props.stores,isLoading:e,key:`workout-table-${M.id}-${F.length}`,showHeader:!1})))),Object(r.h)(P.a,{stores:this.props.stores,url:this.props.url}),Object(r.h)("div",{class:"row"},Object(r.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 my-3"},Object(r.h)("div",{class:"row"},Object(r.h)("div",{class:"col px-1 pt-2"},Object(r.h)("button",{class:`btn btn-block ${"races"===s?"btn-danger":"btn-outline-danger"} text-nowrap`,style:"text-overflow: ellipsis; overflow: hidden;","data-menu":"races",onClick:this.chooseSubmenu},Object(r.h)("i",{class:"fas fa-dog"})," ",Object(r.h)(i.c,{id:"home.races"},"Løp"))),Object(r.h)("div",{class:"col px-1 pt-2"},Object(r.h)("button",{class:`btn btn-block ${"lastWorkouts"===s?"btn-primary":"btn-outline-primary"} text-nowrap`,style:"text-overflow: ellipsis; overflow: hidden;","data-menu":"lastWorkouts",onClick:this.chooseSubmenu},Object(r.h)("i",{class:"fas fa-running"})," ",Object(r.h)(i.c,{id:"home.workouts"},"Treninger"))),Object(r.h)("div",{class:"col px-1 pt-2"},Object(r.h)("button",{class:`btn btn-block ${"totals"===s?"btn-primary":"btn-outline-primary"} text-nowrap`,style:"text-overflow: ellipsis; overflow: hidden;","data-menu":"totals",onClick:this.chooseSubmenu},Object(r.h)("i",{class:"fas fa-equals"})," ",Object(r.h)(i.c,{id:"home.totals"},"Totaler"))),Object(r.h)("div",{class:"col px-1 pt-2"},Object(r.h)("button",{class:`btn btn-block ${"workoutplanStatus"===s?"btn-primary":"btn-outline-primary"} text-nowrap`,style:"text-overflow: ellipsis; overflow: hidden;","data-menu":"workoutplanStatus",onClick:this.chooseSubmenu},Object(r.h)("i",{class:"fas fa-chart-line"})," ",Object(r.h)(i.c,{id:"home.status"},"Status"))))),"races"===s&&Object(r.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3"},Object(r.h)(p.a,{stores:this.props.stores})),"lastWorkouts"===s&&Object(r.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3"},Object(r.h)(O.a,null),Object(r.h)(u.a,{stores:this.props.stores})),"totals"===s&&Object(r.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3"},Object(r.h)(j.a,{stores:this.props.stores,key:"totals-"+ct.distancekm,currentSeason:ct,prevSeason:ot})),"workoutplanStatus"===s&&Object(r.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3"},Object(r.h)(g.a,{stores:this.props.stores,key:"status-"+ct.distancekm,currentSeason:ct,prevSeason:ot}))),Object(r.h)(f.a,{stores:this.props.stores}),Object(r.h)("div",{class:"row"},Object(r.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 my-3"},Object(r.h)("button",{type:"button",class:"btn btn-success btn-block","data-mode":"beta",onClick:this.toggleViewmode},Object(r.h)("i",{class:"fas fa-flask"})," ",Object(r.h)(i.c,{id:"header.viewmode-try-beta"},"Prøv den nye versjonen av forsiden")))),"lastWorkouts"===s&&Object(r.h)("div",{class:"row"},Y&&Y.strava&&rt&&rt.length>0&&Object(r.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 border-top border-bottom pt-3 pb-3 my-2 overflow-auto",style:"max-height: 30vh;"},Object(r.h)("h5",null,Object(r.h)(i.c,{id:"workout.index.strava-workouts"},"Strava workouts / not imported")),rt&&rt.map(t=>Object(r.h)(v.a,{stores:this.props.stores,activity:t,key:`strava-${J}-${t.id}`}))),Y&&Y.garmin&&lt&&lt.length>0&&Object(r.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 border-top border-bottom pt-3 pb-3 my-2 overflow-auto",style:"max-height: 30vh;"},Object(r.h)("h5",null,Object(r.h)(i.c,{id:"workout.index.garmin-workouts"},"Garmin workouts / not imported")),lt&&lt.map(t=>Object(r.h)(w.a,{stores:this.props.stores,activity:t,key:`garmin-${J}-${t.id}`}))),R&&R.length>0&&Object(r.h)("div",{class:"col-12 mb-4"},Object(r.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 px-0 mt-4"},Object(r.h)("h5",null,Object(r.h)(i.c,{id:"home.last-workouts",fields:{total:R.length}},"Siste treningsturer - ",R.length," stk"),st&&st.name&&Object(r.h)("div",null,Object(r.h)("small",{class:"font-weight-lighter"},"(",Object(r.h)(i.c,{id:"workout.index.filtered-by"},"Filtered by"),": ",st.name,")")))),R&&R.map(t=>Object(r.h)(d.a,{stores:this.props.stores,workout:t}))))))}})||c;e.default=C}.call(this,s("hosL").Fragment)},"9Bb9":function(t,e,s){"use strict";var a,o=s("hosL"),c=s("Utv1"),r=s("/eY4"),l=s("OhSV"),n=s("ETxl"),i=s.n(n),h=s("ZOvn");let d=Object(r.a)(a=class extends o.Component{render(){const{userStore:t,workoutPlanStore:e,teamStore:s}=this.props.stores,{user:a}=t,{language:r="no"}=a,n=h.a.getMonths(r),{team:d}=s,{year:b}=this.props,m=(new Date).getMonth()+1,u=b||c.a.getYear(),O=parseInt(m<6?u-1:u,10),p=c.a.monthRange(O+"-06-01",O+1+"-05-31");let f;return Object(o.h)("div",{class:"container-fluid mb-2"},Object(o.h)("div",{class:"row mt-2"},Object(o.h)("div",{class:"col-12"},Object(o.h)("h5",null,Object(o.h)(l.c,{id:"workout.totals.title"},"Treningsplanstatus")))),Object(o.h)("div",{class:"row mt-2 border-bottom pb-2"},p&&p.map(s=>{if(s.year>u||s.year===u&&s.month>=m)return"";const a=e.sumWorkoutPlanMonth(s.year,s.month+1);if(!a)return"";f=a;const r=t.findWorkoutSummaryMonth(s.year,s.month+1)/a*100,l=r>100?100:c.a.format(r,0);return Object(o.h)("div",{class:"col-3 text-center"},Object(o.h)("div",{class:"px-auto w-100 clearfix"},Object(o.h)("div",{class:"progress "+i.a["progress-bar-vertical"],style:" margin-left: calc(50% - 20px);"},Object(o.h)("div",{class:"progress-bar progress-bar-striped bg-success",role:"progressbar",style:`height: ${l}%; width: 40px;`,"aria-valuenow":l,"aria-valuemin":"0","aria-valuemax":"100"},c.a.format(r,0),"%"))),Object(o.h)("div",{class:"w-100 mt-1"},n[s.month]," ",s.year))}),!f&&Object(o.h)("div",{class:"col-12 text-center"},Object(o.h)("h3",null,Object(o.h)(l.c,{id:"workout.plan.no-workout-plan-found",fields:{name:d.name}},"Ingen treningsplaner funnet for team ",d.name,".")))))}})||a;e.a=d},L3gU:function(t,e,s){"use strict";(function(t){function a(t,e){var s=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),s.push.apply(s,a)}return s}function o(t){for(var e=1;e<arguments.length;e++){var s=null!=arguments[e]?arguments[e]:{};e%2?a(Object(s),!0).forEach((function(e){c(t,e,s[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(s)):a(Object(s)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(s,e))}))}return t}function c(t,e,s){return e in t?Object.defineProperty(t,e,{value:s,enumerable:!0,configurable:!0,writable:!0}):t[e]=s,t}var r,l=s("hosL"),n=s("Utv1"),i=s("/eY4"),h=s("cneo"),d=s("OhSV"),b=s("fh8t"),m=s.n(b),u=(s("1OK2"),s("sqi2")),O=s("/922"),p=s("eQ6k"),f=s("ZOvn");const j={showAddComment:{},viewImageIdx:{}};let g=Object(i.a)(r=class extends l.Component{constructor(t){var e;super(t),e=this,this.toggleDate=t=>{t.stopPropagation(),t.preventDefault();const{showDate:e}=this.state;this.setState({showDate:!e})},this.likeWorkout=async function(t){const s=parseInt(t.target.closest("button").dataset.id,10),{workoutStore:a}=e.props.stores,o=await a.likeWorkout({id:s});200===o.status&&e.addLikeToFeed(s,o.data)},this.addCommentToFeed=({type:t,workout:e,response:s,commentId:a,replyId:o})=>{const{teamStore:c}=this.props.stores;switch(t){case"likeComment":c.addLikeToComment({id:e.id,data:s.data,commentId:a});break;case"likeReply":c.addLikeToCommentReply({id:e.id,data:s.data,commentId:a,replyId:o});break;default:a?c.addCommentToWorkoutComment({id:e.id,data:s.data,commentId:a}):c.addCommentToWorkout({id:e.id,data:s.data})}},this.addLikeToFeed=(t,e)=>{const{teamStore:s}=this.props.stores;s.addLikeToWorkout({id:t,data:e})},this.toggleAddComment=t=>{const e=t.target.closest("button").dataset.id,{showAddComment:s}=this.state;s[e]?delete s[e]:s[e]=!0,this.setState({showAddComment:s},()=>{this.inputRef[e]&&this.inputRef[e].focus()})},this.viewImage=t=>{const{id:e,idx:s}=t.target.closest("img").dataset,{viewImageIdx:a}=this.state;a[e]=s,this.setState({viewImageIdx:a})},this.state=o({},j),this.inputRef={}}async loadTeamsPublicFeed(t=this.props){const{teamStore:e}=t.stores;await e.loadPublicFeed()}async loadAll(){await this.loadTeamsPublicFeed()}componentDidMount(){this.loadAll()}render(){const{showAddComment:e,showDate:s,viewImageIdx:a={}}=this.state,{teamStore:c,userStore:r,appState:i}=this.props.stores,{user:b}=r,{language:j="no"}=b,{publicTeamsFeed:g}=c,{darkmode:v}=i;return Object(l.h)("div",{class:"w-100"},g&&g.map(i=>{const g=c.findPublicTeam(i.team)||{};let w;g.image&&g.image.s3SmallLink?w=g.image:g.images&&g.images[0]&&g.images[0].s3SmallLink&&(w=g.images[0]);const{likes:k,comments:y}=i,x=i.likes&&i.likes.findIndex(t=>t.user===b.id)>-1,S=g&&g.followers?g.followers.length:0,P=g.members&&g.members.indexOf(b.id)>-1,D=g&&g.followers&&g.followers.indexOf(b.id)>-1,L=g.followRequests&&g.followRequests.findIndex(t=>t.id===b.id)>-1,T=[];if(i.mapImage&&T.push(o(o({},i.mapImage),{},{type:"map"})),i.images){const t=Object(h.i)(i.images);T.push(...t)}const I=a[i.id]?a[i.id]:0,W=T&&T[I]?T[I]:null;return g&&g.name?Object(l.h)(t,null,Object(l.h)("div",{class:"row pb-4 bg-light"},Object(l.h)("div",{class:`col-12 col-sm-8 col-lg-6 offset-sm-2 offset-lg-3 mb-0 position-relative rounded rounded-lg py-3 bg-${v?"black":"white"} shadow-sm`},Object(l.h)("div",{class:"d-flex"},Object(l.h)("div",{class:"text-center"},Object(l.h)("div",{class:"text-center border rounded-circle imageRounded imageRoundedSmall",style:w?`background-image: url("${w.s3SmallLink}");`:""},!w&&Object(l.h)("i",{class:"fas fa-users text-muted mt-2",style:"font-size: 20px;"}))),Object(l.h)("div",{class:"flex-grow-1 pl-3",style:"line-height: 1.2em;"},Object(l.h)("h5",{class:"mb-1",style:"line-height: 1.0em;"},g.name),Object(l.h)("div",null,i.date&&Object(l.h)("small",{class:"text-muted",onClick:this.toggleDate},s?n.a.formatDate(i.date,{locale:"no-NB",hour12:!1,hour:"2-digit",minute:"2-digit"}):n.a.formatDistance(i.date,new Date,{locale:"no-NB"})),1===i.public?Object(l.h)(t,null,Object(l.h)("small",{class:"ml-2 text-muted"},Object(l.h)("i",{class:"fas fa-globe-europe"}))):Object(l.h)(t,null,Object(l.h)("small",{class:"ml-2 text-muted"},Object(l.h)("i",{class:"fas fa-users"})," (",n.a.format(S),")")),Object(l.h)("small",{class:"text-muted"},i.equipment>0&&Object(l.h)(t,null,Object(l.h)("i",{class:"fas fa-tools ml-2"})," ",r.findEquipment(i.equipment)||i.equipment),i.dogs>0&&Object(l.h)(t,null,Object(l.h)("i",{class:"fas fa-dog ml-2"})," ",i.dogs.length),i.track>0&&Object(l.h)(t,null,Object(l.h)("i",{class:`fas fa-map-marked text-${i.track>0?"success":"danger"} ml-2`})),i.sledWeight>0&&Object(l.h)(t,null,Object(l.h)("i",{class:"fas fa-sleigh ml-2"})," ",n.a.format(i.sledWeight,0)," kg"),0!==i.temperature&&Object(l.h)(t,null,Object(l.h)("i",{class:"fas fa-temperature-low ml-2"})," ",i.temperature,"°C"))))),Object(l.h)("div",{class:"row mt-2"},Object(l.h)("div",{class:"clearfix col-12 font-weight-bold",style:"font-size: 1.2em;"},Object(l.h)(m.a,{markdown:f.a.replaceImages(i.name,i.images,j),markdownOpts:f.a.getMarkdownOptions()})),Object(l.h)("div",{class:"clearfix col-12"},Object(l.h)(m.a,{markdown:f.a.replaceImages(i.comment,i.images,j),markdownOpts:f.a.getMarkdownOptions()}))),Object(l.h)("div",{class:"row mt-1"},i.distanceKm>0&&Object(l.h)("div",{class:"col-3"},Object(l.h)("div",{class:"text-overflow"},Object(l.h)("small",null,Object(l.h)("i",{class:"fas fa-road"})," ",Object(l.h)(d.c,{id:"workout.calendar.distance"},"Distanse"))),Object(l.h)("div",{class:"text-overflow font-weight-light",style:"font-size: 1.2em;"},n.a.format(C=i.distanceKm,C<5?2:1),"km")),i.elevation>0&&Object(l.h)("div",{class:"col-3"},Object(l.h)("div",{class:"text-overflow"},Object(l.h)("small",null,Object(l.h)("i",{class:"fas fa-mountain"})," ",Object(l.h)(d.c,{id:"workout.calendar.ascend"},"Høydemeter"))),Object(l.h)("div",{class:"text-overflow font-weight-light",style:"font-size: 1.2em;"},n.a.format(i.elevation,0),"m")),i.duration>0&&Object(l.h)("div",{class:"col-3"},Object(l.h)("div",{class:"text-overflow"},Object(l.h)("small",null,Object(l.h)("i",{class:"fas fa-clock"})," ",Object(l.h)(d.c,{id:"workout.calendar.duration"},"Varighet"))),Object(l.h)("div",{class:"text-overflow font-weight-light",style:"font-size: 1.2em;"},n.a.secToHms(i.duration,!0))),i.speedAvg>0&&Object(l.h)("div",{class:"col-3"},Object(l.h)("div",{class:"text-overflow"},Object(l.h)("small",null,Object(l.h)("i",{class:"fas fa-tachometer-alt"})," ",Object(l.h)(d.c,{id:"workout.calendar.avg-speed"},"Snittfart"))),Object(l.h)("div",{class:"text-overflow font-weight-light",style:"font-size: 1.2em;"},n.a.format(i.speedAvg,1),"km/t"))),Object(l.h)("div",{class:"container-fluid px-0 mt-1"},W&&Object(l.h)("div",{class:"clearfix row"},Object(l.h)("div",{class:"col-12 px-0 overflow-hidden",style:"max-height: 50vh;"},Object(l.h)("img",{loading:"lazy",class:"img-fluid",style:"min-width: 100px;",src:W.s3LargeLink}))),T&&T.length>1&&Object(l.h)("div",{class:"clearfix d-flex flex-wrap row"},T.map((e,s)=>Object(l.h)(t,null,Object(l.h)("div",{class:"col px-0 overflow-hidden",style:"max-height: 100px;"},Object(l.h)("img",{loading:"lazy",class:"img-fluid border",style:"min-width: 100px;",src:e.s3SmallLink,onClick:this.viewImage,"data-id":i.id,"data-idx":s})))))),Object(l.h)("div",{class:"mt-2"},k&&k.length>0&&Object(l.h)("small",{class:"bg-light shadow-sm rounded-lg py-0 px-1",style:"bottom: 20px; right: 15px;"},Object(l.h)("i",{class:"fas fa-thumbs-up text-primary"})," ",k.length),y&&y.length>0&&Object(l.h)("small",{class:"float-right bg-light shadow-sm rounded-lg py-0 px-1",style:"bottom: 20px; right: 15px;"},Object(l.h)("i",{class:"fas fa-comment text-primary"})," ",y.length)),!P&&!D&&!L&&Object(l.h)("div",{class:"clearfix mb-2"},Object(l.h)(p.a,{stores:this.props.stores,team:g,buttonOnly:!0})),Object(l.h)("div",null,Object(l.h)("div",{class:"row"},Object(l.h)("div",{class:"col-6 text-center"},Object(l.h)("button",{type:"button",class:`btn btn-sm btn-outline-${x?"primary":"secondary"} btn-lg btn-block ${x?"text-primary":""}`,"data-id":i.id,onClick:this.likeWorkout},Object(l.h)("i",{class:(x?"text-primary fas":"far")+" fa-thumbs-up"})," ",Object(l.h)(d.c,{id:"comments.like"},"Lik"))),Object(l.h)("div",{class:"col-6 text-center"},Object(l.h)("button",{type:"button",class:"btn btn-sm btn-outline-secondary btn-lg btn-block","data-id":i.id,onClick:this.toggleAddComment},Object(l.h)("i",{class:"fas fa-comment"})," ",Object(l.h)(d.c,{id:"comments.comment-add"},"Kommentar"))))),Object(l.h)("div",{class:"mt-2"},e[i.id]&&Object(l.h)(O.a,{stores:this.props.stores,workout:i,inputRef:t=>this.inputRef[i.id]=t,inputRefObject:this.inputRef,col:"12",offset:"0",showAvatar:!0,extraClass:"px-0",callback:this.addCommentToFeed}),Object(l.h)(u.a,{stores:this.props.stores,workout:i,col:"12",offset:"0",compact:!1,callback:this.addCommentToFeed}))))):"";var C}))}})||r;e.a=g}).call(this,s("hosL").Fragment)},ZWUU:function(t,e,s){"use strict";var a,o=s("hosL"),c=(s("Utv1"),s("/eY4")),r=s("OhSV");s("go65");Object(c.a)(a=class extends o.Component{constructor(...t){var e;super(...t),e=this,this.toggleSetting=async function(t){const{userStore:s}=e.props.stores,{user:a}=s,{settings:o={}}=a;await s.updateSetting({["settings."+t]:1===o[t]?0:1})},this.hideSettings=async function(){const{userStore:t}=e.props.stores;await t.updateSetting({"settings.hideSettings":1}),e.setState({hideSettings:!0})}}render(){const{hideSettings:t}=this.state,{userStore:e}=this.props.stores,{forceShow:s}=this.props,{user:a}=e,{settings:c={}}=a;return t||c.hideSettings||!s&&c.summaryEmails&&c.infoEmails&&c.partnerEmails?"":Object(o.h)("div",{class:"col-12 col-sm-8 col-lg-6 offset-sm-2 offset-lg-3 mt-4 mb-4 pt-4 pb-4 border-bottom border-top"},Object(o.h)("h5",null,Object(o.h)(r.c,{id:"users.settings"},"Brukerinnstillinger")),!c.summaryEmails&&Object(o.h)("div",{class:"row mt-4"},Object(o.h)("div",{class:"col-4 text-muted text-right"},Object(o.h)(r.c,{id:"users.settings-summary-email"},"Oppsummeringer")),Object(o.h)("div",{class:"col-8"},Object(o.h)("div",{class:"custom-control custom-switch"},Object(o.h)("input",{type:"checkbox",class:"custom-control-input",id:"settingsSummaryEmails",onInput:()=>this.toggleSetting("summaryEmails"),checked:c.summaryEmails}),Object(o.h)("label",{class:"custom-control-label",for:"settingsSummaryEmails"})),Object(o.h)("small",{class:"text-muted"},Object(o.h)(r.c,{id:"users.settings-receive-summary-email"},"Motta oppsummeringer via e-post")))),!c.infoEmails&&Object(o.h)("div",{class:"row mt-4"},Object(o.h)("div",{class:"col-4 text-muted text-right"},Object(o.h)(r.c,{id:"users.settings-info-email"},"Info")),Object(o.h)("div",{class:"col-8"},Object(o.h)("div",{class:"custom-control custom-switch"},Object(o.h)("input",{type:"checkbox",class:"custom-control-input",id:"settingsInfoEmails",onInput:()=>this.toggleSetting("infoEmails"),checked:c.infoEmails}),Object(o.h)("label",{class:"custom-control-label",for:"settingsInfoEmails"})),Object(o.h)("small",{class:"text-muted"},Object(o.h)(r.c,{id:"users.settings-receive-info-email"},"Motta info via e-post")))),!c.partnerEmails&&Object(o.h)("div",{class:"row mt-4"},Object(o.h)("div",{class:"col-4 text-muted text-right"},Object(o.h)(r.c,{id:"users.settings-partner-email"},"Partners")),Object(o.h)("div",{class:"col-8"},Object(o.h)("div",{class:"custom-control custom-switch"},Object(o.h)("input",{type:"checkbox",class:"custom-control-input",id:"settingsPartnerEmails",onInput:()=>this.toggleSetting("partnerEmails"),checked:c.partnerEmails}),Object(o.h)("label",{class:"custom-control-label",for:"settingsPartnerEmails"})),Object(o.h)("small",{class:"text-muted"},Object(o.h)(r.c,{id:"users.settings-receive-partner-email"},"Motta tilbud fra våre partnere via e-post")))),Object(o.h)("div",{class:"row mt-4"},Object(o.h)("div",{class:"col-12 text-muted"},Object(o.h)("small",null,Object(o.h)("a",{href:"/users"},Object(o.h)("i",{class:"fas fa-sliders-h"})," ",Object(o.h)(r.c,{id:"users.settings-text-info"},"Innstillingene finner du inne på profilen din."))))),Object(o.h)("div",{class:"row mt-4"},Object(o.h)("div",{class:"col-12 text-muted text-right"},Object(o.h)("small",null,Object(o.h)("button",{type:"button",class:"btn btn-sm btn-link mb-2",onClick:this.hideSettings},Object(o.h)("i",{class:"fas fa-eye-slash"})," ",Object(o.h)(r.c,{id:"users.hide-settings"},"Skjul innstillingene"))))))}})},azdc:function(t,e,s){"use strict";(function(t){var a,o=s("hosL"),c=s("Utv1"),r=s("/eY4"),l=s("OhSV"),n=s("ZOvn");let i=Object(l.d)(()=>({week:Object(o.h)(l.c,{id:"workout.graph.week"}),distance:Object(o.h)(l.c,{id:"workout.graph.distance"}),ascend:Object(o.h)(l.c,{id:"workout.graph.ascend"}),plan:Object(o.h)(l.c,{id:"workout.graph.plan"})}))(a=Object(r.a)(a=class extends o.Component{render(){const{userStore:e}=this.props.stores,{year:s,month:a,showHeader:r=!0}=this.props,{user:i}=e,{language:h="no"}=i,d=n.a.getMonths(h),b=a||(new Date).getMonth()+1,m=s||c.a.getYear(),u=parseInt(b<6?m-1:m,10),O=c.a.monthRange(u+"-06-01",u+1+"-05-31"),p=c.a.monthRange(u-1+"-06-01",u+"-05-31"),f=c.a.weekRange(u+"-06-01",u+1+"-05-31").map(t=>t.week),j=Math.floor(f.length/(f.length%6)),g=[];for(let t=0,e=f.length;t<e;t+=j)g.push(f[t]);return Object(o.h)(t,null,r&&Object(o.h)("h5",null,Object(o.h)(l.c,{id:"workout.graph.title"},"Treningsstatistikk")," ",u," - ",u+1),Object(o.h)("div",{class:"w-100 mt-3 mb-4"},Object(o.h)("small",{class:"mb-4"},Object(o.h)("small",null,Object(o.h)("table",{class:"table table-sm font-weigth-lighter border-bottom"},Object(o.h)("thead",null,Object(o.h)("tr",null,Object(o.h)("th",{style:"padding: .15rem;"},Object(o.h)(l.c,{id:"workout.graph.season"},"Sesong")),O.map(t=>Object(o.h)("th",{class:"text-right",style:"padding: .15rem;"},Object(o.h)("a",{href:`/workouts/month/${t.month}/${t.year}`},d[t.month-1]))))),Object(o.h)("tbody",null,Object(o.h)("tr",null,Object(o.h)("th",{scope:"row",style:"padding: .15rem;"},u-1," - ",u),p.map(s=>Object(o.h)(t,null,Object(o.h)("td",{class:"text-right",style:"padding: .15rem;"},Object(o.h)("nobr",null,e.findWorkoutSummaryMonth(s.year,s.month)),Object(o.h)("br",null),Object(o.h)("nobr",null,e.findWorkoutSummaryMonth(s.year,s.month,"elevation")),Object(o.h)("br",null)))),Object(o.h)("td",{class:"text-muted",style:"padding: .15rem;"},Object(o.h)("nobr",null,Object(o.h)("i",{class:"fas fa-road"})," km"),Object(o.h)("br",null),Object(o.h)("nobr",null,Object(o.h)("i",{class:"fas fa-mountain"})," m"),Object(o.h)("br",null))),Object(o.h)("tr",null,Object(o.h)("th",{scope:"row",style:"padding: .15rem;"},u," - ",u+1),O.map(s=>Object(o.h)(t,null,Object(o.h)("td",{class:"text-right",style:"padding: .15rem;"},Object(o.h)("nobr",null,e.findWorkoutSummaryMonth(s.year,s.month)),Object(o.h)("br",null),Object(o.h)("nobr",null,e.findWorkoutSummaryMonth(s.year,s.month,"elevation")),Object(o.h)("br",null)))),Object(o.h)("td",{class:"text-muted",style:"padding: .15rem;"},Object(o.h)("nobr",null,Object(o.h)("i",{class:"fas fa-road"})," km"),Object(o.h)("br",null),Object(o.h)("nobr",null,Object(o.h)("i",{class:"fas fa-mountain"})," m"),Object(o.h)("br",null)))))))))}})||a)||a;e.a=i}).call(this,s("hosL").Fragment)},"qv+O":function(t,e,s){"use strict";(function(t){function a(t,e){var s=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),s.push.apply(s,a)}return s}function o(t,e,s){return e in t?Object.defineProperty(t,e,{value:s,enumerable:!0,configurable:!0,writable:!0}):t[e]=s,t}function c(t="",e,s="no"){if(n.a.isString(t)){let a=t;const o=new RegExp(`<${s}>(.*?)</${s}>`,"s").exec(a);if(o){const t=o[0];t&&(a=t)}return a.replace(/\{\{img\.(\d+)\s*(\d*)\}\}/g,(function(t,s,a){return n.a.isObject(e[s])?`<img src=${e[s].s3XXLargeLink} class='img-fluid float-right' style='width: ${a||40}%;' />`:""}))}return t}var r,l=s("hosL"),n=s("Utv1"),i=s("/eY4"),h=s("OhSV"),d=s("fh8t"),b=s.n(d);s("ZOvn");const m={pedantic:!1,gfm:!0,breaks:!0,sanitize:!1,smartLists:!0,smartypants:!0,xhtml:!0},u={isLoading:!1};let O=Object(i.a)(r=class extends l.Component{constructor(t){super(t),this.state=function(t){for(var e=1;e<arguments.length;e++){var s=null!=arguments[e]?arguments[e]:{};e%2?a(Object(s),!0).forEach((function(e){o(t,e,s[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(s)):a(Object(s)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(s,e))}))}return t}({},u)}async loadRace(t=this.props){this.setState({isLoading:!0});const{raceStore:e}=t.stores;await e.load({query:{}}),this.setState({isLoading:!1})}componentDidMount(){this.loadRace()}componentWillReceiveProps(t){this.loadRace(t)}render(){const{appState:e,userStore:s,raceStore:a,newsStore:o}=this.props.stores,{isAdmin:r,notifications:i=[]}=s,{races:d}=a,{newsList:u}=o,{language:O="no"}=e;return Object(l.h)("div",{class:"row"},Object(l.h)("div",{class:"col-12"},Object(l.h)("h5",null,Object(l.h)(h.c,{id:"races.homerun"},"Homerun races"))),(d||0===d.length)&&Object(l.h)("div",{class:"col-12 text-center py-5"},Object(l.h)("h5",null,"No upcoming races!"),"Take a look at the previous races:",Object(l.h)("br",null),Object(l.h)("a",{href:"https://homerunrace.no/",target:"_blank",rel:"noreferrer"},"homerunrace.no")),d&&d.sort((t,e)=>t.startDate-e.startDate).reverse().map(e=>{const s=new Date;let a="";if(s>=new Date(e.startDate)&&s<=new Date(e.endDate))a="race";else if(s>=new Date(e.signupStartDate)&&s<=new Date(e.signupEndDate))a="signup";else if(s>new Date(e.endDate))return Object(l.h)(t,null);return Object(l.h)(t,null,Object(l.h)("div",{class:"col-12 col-sm-12 col-md-6 col-lg-6 mb-3"},Object(l.h)("div",{class:"card position-relative"},Object(l.h)("h5",{class:"position-absolute",style:"top: 10px; right: 10px;"},"signup"===a&&Object(l.h)(t,null,Object(l.h)("div",{class:"spinner-grow text-primary",role:"status"})),"race"===a&&Object(l.h)(t,null,Object(l.h)("div",{class:"spinner-grow text-danger",role:"status"})),"done"===a&&Object(l.h)(t,null,Object(l.h)("span",null,Object(l.h)("i",{class:"fas fa-check text-success"})))),Object(l.h)("h5",{class:"card-header"},r&&Object(l.h)("i",{class:`fas fa-eye${e.active?" text-success":"-slash text-danger"} float-right`}),e.title),Object(l.h)("div",{class:"list-thumb d-flex align-items-center position-relative"},Object(l.h)("h5",{class:"position-absolute",style:"top: 3px; right: 5px;"},"signup"===a&&Object(l.h)(t,null,Object(l.h)("span",{class:"badge badge-primary border border-white ml-2"},Object(l.h)(h.c,{id:"races.signup-open"},"Påmelding åpen"))),"race"===a&&Object(l.h)(t,null,Object(l.h)("span",{class:"badge badge-danger border border-white ml-2"},Object(l.h)(h.c,{id:"races.race-in-progress"},"Løp pågår"))),"done"===a&&Object(l.h)(t,null,Object(l.h)("span",{class:"badge badge-success border border-white ml-2"},Object(l.h)(h.c,{id:"races.race-finished"},"Løp avsluttet")))),e.images&&e.images[0]?Object(l.h)("img",{src:e.images[0].s3MediumLink,class:"card-img-top"}):""),Object(l.h)("div",{class:"card-body"},Object(l.h)("p",{class:"card-text"},Object(l.h)(b.a,{markdown:c(e.ingress,e.images,O),markdownOpts:m})),e.classes&&Object(l.h)(t,null,Object(l.h)("div",{class:"mb-3"},Object(l.h)("small",{class:"font-weight-lighter mr-2"},Object(l.h)(h.c,{id:"races.classes"},"Klasser"),": "),Object(l.h)("br",null),e.classes.sort((t,e)=>t.distance-e.distance).map(e=>Object(l.h)(t,null,Object(l.h)("span",{class:"badge badge-pill badge-light mr-2 font-weight-light"},e.title))))),Object(l.h)("a",{href:"/app-races/"+e.id,class:"btn btn-primary stretched-link"},Object(l.h)(h.c,{id:"races.read-more"},"Les mer"))),Object(l.h)("div",{class:"card-footer"},Object(l.h)("small",{class:"text-muted"},Object(l.h)(h.c,{id:"races.race-days"},"Løpsdager"),": ",e.startDate&&Object(l.h)(t,null,n.a.formatDate(e.startDate,{locale:O})),e.endDate&&Object(l.h)(t,null," - ",n.a.formatDate(e.endDate,{locale:O})))))))}))}})||r;e.a=O}).call(this,s("hosL").Fragment)},sgpT:function(t,e,s){"use strict";function a(t,e){var s=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),s.push.apply(s,a)}return s}function o(t,e,s){return e in t?Object.defineProperty(t,e,{value:s,enumerable:!0,configurable:!0,writable:!0}):t[e]=s,t}var c,r=s("hosL"),l=(s("ox/y"),s("Utv1"),s("/eY4")),n=(s("go65"),s("Y3FI"),s("OhSV"));const i={menu:{profile:!1,main:!1},searchText:""};let h=Object(l.a)(c=class extends r.Component{constructor(t){super(t),this.state=function(t){for(var e=1;e<arguments.length;e++){var s=null!=arguments[e]?arguments[e]:{};e%2?a(Object(s),!0).forEach((function(e){o(t,e,s[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(s)):a(Object(s)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(s,e))}))}return t}({},i)}render(){const{userStore:t}=this.props.stores,{notifications:e=[]}=t,s=e.filter(t=>!t.read).length||0;return s<3?"":Object(r.h)("div",{class:"col-12 col-sm-8 col-lg-6 offset-sm-2 offset-lg-3 mt-4 mb-4 clearfix px-0"},Object(r.h)("div",{class:"alert alert-danger",role:"alert"},Object(r.h)("a",{href:"/users/notifications",class:"text-dark"},Object(r.h)("i",{class:"fas fa-bell mr-2 text-dark"}),Object(r.h)("span",{class:"badge badge-pill badge-danger"},s)," ",Object(r.h)(n.c,{id:"notifications.unread"},"Uleste varslinger. Klikk her for å se alle..."))))}})||c;e.a=h}}]);
//# sourceMappingURL=route-home.chunk.bac2f.esm.js.map