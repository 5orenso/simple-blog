(window.webpackJsonp=window.webpackJsonp||[]).push([[91],{TQac:function(t,e,s){"use strict";s.r(e),function(t){var c,a=s("hosL"),r=s("Utv1"),i=s("/eY4"),n=s("OhSV"),o=(s("Y3FI"),s("ZOvn"));s("tJLP"),s("Cjoz");const l=o.a.marginTop(!0),h=o.a.marginBottom(),b=o.a.subMenuMarginTop(),u=o.a.marginTopBack(!0);let p=Object(i.a)(c=class extends a.Component{constructor(t){var e;super(t),e=this,this.resetEmailMessage=()=>{const{userStore:t}=this.props.stores;t.updateField("emailMessage",""),t.updateField("emailMessageIcon","")},this.resetEmailError=()=>{const{userStore:t}=this.props.stores;t.updateField("emailError",""),t.updateField("emailErrorIcon","")},this.toggleSetting=async function(t){const{userStore:s}=e.props.stores,{user:c}=s,{settings:a={}}=c;await s.updateSetting({["settings."+t]:1===a[t]?0:1})},this.subscriptionCreate=async function(){const{paypalStore:t,userStore:s}=e.props.stores;e.setState({paypalLoading:!0}),await t.subscriptionCreate({}),await s.getInfo(),e.setState({paypalLoading:!1})},this.subscriptionCancel=async function(t){const{id:s}=t.target.closest("button").dataset,{paypalStore:c,userStore:a}=e.props.stores;await c.subscriptionCancel({planId:s}),await a.getInfo()},this.subscriptionDetail=async function(){const{paypalStore:t,userStore:s}=e.props.stores,{user:c={}}=s,{subscription:a}=c;if(a.payPalSubscriptionId){const e=await t.subscriptionDetail({id:a.payPalSubscriptionId});s.setSubscriptionPaypal(e.data),await s.getInfo()}},this.toggleCancel=()=>{const{showCancel:t}=this.state;this.setState({showCancel:!t})},this.toggleDetails=()=>{const{showDetails:t}=this.state;t||this.subscriptionDetail(),this.setState({showDetails:!t})},this.back=()=>{const{history:t}=this.props.stores;t.goBack()},this.state={time:Date.now(),count:10}}componentDidMount(){const{userStore:t}=this.props.stores;this.props.verifyEmailToken&&t.verifyEmail({token:this.props.verifyEmailToken})}render(){const{scrolledDown:e}=this.props,{userStore:s,appState:c}=this.props.stores,{darkmode:i}=c,{user:o,isAdmin:p}=s,{teams:d,settings:m={}}=o,j=(s.findTeams(d),r.a.getApiServer()),O=r.a.getJwtToken();return Object(a.h)("div",{class:"container-fluid",style:`margin-bottom: ${h}; margin-top: ${l};`},Object(a.h)("button",{class:"btn btn-link pl-0 fixed-top text-primary",style:`top: ${u}; left: 5px; font-size: 35px; width: 45px;`,onClick:this.back},Object(a.h)("i",{class:"fas fa-arrow-circle-left"})),Object(a.h)("div",{class:"row fixed-top",style:`margin-top: ${e>0?0:b}; background-color: ${i?"#191d21":"#f8f9fa"}; transition: all 0.3s ease-in-out;`},Object(a.h)("div",{class:"col text-center subtopmenu text-overflow"},Object(a.h)("nobr",null,Object(a.h)("a",{href:"/users",class:"text-secondary stretched-link"},Object(a.h)("i",{class:"fas fa-user"})," ",Object(a.h)(n.c,{id:"users.title"},"Din profil")))),Object(a.h)("div",{class:"col text-center subtopmenu text-overflow"},Object(a.h)("nobr",null,Object(a.h)("a",{href:"/users/settings",class:"text-secondary stretched-link"},Object(a.h)("i",{class:"fas fa-sliders-h"})," ",Object(a.h)(n.c,{id:"users.settings"},"Innstillinger")))),p&&Object(a.h)("div",{class:"col text-center subtopmenu text-overflow"},Object(a.h)("nobr",null,Object(a.h)("a",{href:"/users/subscription",class:"text-secondary stretched-link"},Object(a.h)("i",{class:"fas fa-signature"})," ",Object(a.h)(n.c,{id:"users.subscriptions"},"Abonnement")))),Object(a.h)("div",{class:"col text-center subtopmenu text-overflow border-bottom border-primary"},Object(a.h)("nobr",null,Object(a.h)("a",{href:"/users/integrations",class:"text-primary stretched-link"},Object(a.h)("i",{class:"fas fa-plug"})," ",Object(a.h)(n.c,{id:"users.integrations"},"Integrasjoner"))))),Object(a.h)("div",{class:"row border-top mt-5"},Object(a.h)("div",{class:"col-12"},Object(a.h)("div",null,Object(a.h)("img",{src:"./assets/strava_logo_orange.png",style:"max-height: 100px;"}))),o.strava&&o.strava.access_token?Object(a.h)(t,null,Object(a.h)("div",{class:"col-12"},Object(a.h)("h5",null,Object(a.h)("i",{class:"fas fa-thumbs-up text-success"})," ",Object(a.h)(n.c,{id:"users.strava-connected"},"Connected to Strava!"))),Object(a.h)("div",{class:"col-4 text-right text-muted"},Object(a.h)(n.c,{id:"users.strava-id"},"id"),":"),Object(a.h)("div",{class:"col-8"}," ",o.strava.athlete.id),Object(a.h)("div",{class:"col-4 text-right text-muted"},Object(a.h)(n.c,{id:"users.strava-username"},"username"),":"),Object(a.h)("div",{class:"col-8"}," ",o.strava.athlete.username),Object(a.h)("div",{class:"col-4 text-right text-muted"},Object(a.h)(n.c,{id:"users.strava-profile"},"profile"),":"),Object(a.h)("div",{class:"col-8"}," ",Object(a.h)("img",{src:o.strava.athlete.profile})),Object(a.h)("div",{class:"col-12 mt-2"},Object(a.h)("div",{class:"display-1 text-success"},Object(a.h)("i",{class:"fas fa-check text-success"})),Object(a.h)("small",{class:"text-muted"},Object(a.h)("small",null,Object(a.h)(n.c,{id:"users.strava-reconnect-help"},"Hvis du opplever problemer med integrasjoen så kan du prøve å koble til på nytt"),":",Object(a.h)("br",null),Object(a.h)("a",{href:`${j}/api/strava/request-access?token=${O}`,native:!0,target:"_blank",rel:"noreferrer"},Object(a.h)(n.c,{id:"users.strava-reconnect"},"Reconnect to Strava")))))):Object(a.h)(t,null,Object(a.h)("div",{class:"col-12 mt-2"},Object(a.h)("a",{class:"btn btn-primary",href:`${j}/api/strava/request-access?token=${O}`,native:!0,target:"_blank",rel:"noreferrer"},Object(a.h)(n.c,{id:"users.strava-connect"},"Connect to Strava"))))),Object(a.h)("div",{class:"row border-top mt-5 pt-5"},Object(a.h)("div",{class:"col-12"},Object(a.h)("div",null,Object(a.h)("img",{src:"./assets/garmin-connect.png",style:"height: 100px;"}))),o.garmin&&o.garmin.access&&o.garmin.access.oauth_token?Object(a.h)(t,null,Object(a.h)("div",{class:"col-12"},Object(a.h)("h5",null,Object(a.h)("i",{class:"fas fa-thumbs-up text-success"})," ",Object(a.h)(n.c,{id:"users.garmin-connected"},"Connected to Garmin Connect!"))),Object(a.h)("div",{class:"col-12 mt-2"},Object(a.h)("div",{class:"display-1 text-success"},Object(a.h)("i",{class:"fas fa-check text-success"})),Object(a.h)("small",{class:"text-muted"},Object(a.h)("small",null,Object(a.h)(n.c,{id:"users.garmin-reconnect-help"},"Hvis du opplever problemer med integrasjoen så kan du prøve å koble til på nytt"),":",Object(a.h)("br",null),Object(a.h)("a",{href:`${j}/api/garmin/request-access?token=${O}`,native:!0,target:"_blank",rel:"noreferrer"},Object(a.h)(n.c,{id:"users.garmin-reconnect"},"Reconnect to Garmin Connect")))))):Object(a.h)(t,null,Object(a.h)("div",{class:"col-12 mt-2"},Object(a.h)("a",{class:"btn btn-primary",href:`${j}/api/garmin/request-access?token=${O}`,native:!0,target:"_blank",rel:"noreferrer"},Object(a.h)(n.c,{id:"users.garmin-connect"},"Connect to Garmin Connect"))))))}})||c;e.default=p}.call(this,s("hosL").Fragment)},tJLP:function(t,e,s){"use strict";var c,a=s("hosL"),r=s("/eY4");let i=Object(r.a)(c=class extends a.Component{componentDidUpdate(){const{remove:t=(()=>{})}=this.props;clearTimeout(this.removeTimer),this.removeTimer=setTimeout(()=>t(),1e4)}componentWillUnmount(){clearTimeout(this.removeTimer)}render(){const{message:t,icon:e,remove:s=(()=>{})}=this.props;return t?Object(a.h)("div",{class:"container"},Object(a.h)("div",{class:"alert alert-danger row"},Object(a.h)("div",{class:"col-12"},Object(a.h)("a",{href:"#",onclick:s,class:"float-right"},Object(a.h)("i",{className:"fas fa-times"})),e&&Object(a.h)("h1",{class:"float-left mr-3"},Object(a.h)("i",{class:e})),t&&Object(a.h)("span",null,t)))):""}})||c;e.a=i}}]);
//# sourceMappingURL=91.chunk.585eb.esm.js.map