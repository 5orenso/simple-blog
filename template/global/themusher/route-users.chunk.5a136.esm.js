(window.webpackJsonp=window.webpackJsonp||[]).push([[59],{tJLP:function(t,e,s){"use strict";var c,a=s("hosL"),i=s("/eY4");let r=Object(i.a)(c=class extends a.Component{componentDidUpdate(){const{remove:t=(()=>{})}=this.props;clearTimeout(this.removeTimer),this.removeTimer=setTimeout(()=>t(),1e4)}componentWillUnmount(){clearTimeout(this.removeTimer)}render(){const{message:t,icon:e,remove:s=(()=>{})}=this.props;return t?Object(a.h)("div",{class:"container"},Object(a.h)("div",{class:"alert alert-danger row"},Object(a.h)("div",{class:"col-12"},Object(a.h)("a",{href:"#",onclick:s,class:"float-right"},Object(a.h)("i",{className:"fas fa-times"})),e&&Object(a.h)("h1",{class:"float-left mr-3"},Object(a.h)("i",{class:e})),t&&Object(a.h)("span",null,t)))):""}})||c;e.a=r},ztHd:function(t,e,s){"use strict";s.r(e),function(t){var c,a=s("hosL"),i=s("Utv1"),r=s("/eY4"),o=s("OhSV"),l=(s("Y3FI"),s("ZOvn")),n=s("tJLP"),h=s("Cjoz");const b=l.a.marginTop(!0),d=l.a.marginBottom(),u=l.a.subMenuMarginTop(),p=l.a.marginTopBack(!0);let m=Object(r.a)(c=class extends a.Component{constructor(t){var e;super(t),e=this,this.resetEmailMessage=()=>{const{userStore:t}=this.props.stores;t.updateField("emailMessage",""),t.updateField("emailMessageIcon","")},this.resetEmailError=()=>{const{userStore:t}=this.props.stores;t.updateField("emailError",""),t.updateField("emailErrorIcon","")},this.toggleSetting=async function(t){const{userStore:s}=e.props.stores,{user:c}=s,{settings:a={}}=c;await s.updateSetting({["settings."+t]:1===a[t]?0:1})},this.subscriptionCreate=async function(){const{paypalStore:t,userStore:s}=e.props.stores;e.setState({paypalLoading:!0}),await t.subscriptionCreate({}),await s.getInfo(),e.setState({paypalLoading:!1})},this.subscriptionCancel=async function(t){const{id:s}=t.target.closest("button").dataset,{paypalStore:c,userStore:a}=e.props.stores;await c.subscriptionCancel({planId:s}),await a.getInfo()},this.subscriptionDetail=async function(){const{paypalStore:t,userStore:s}=e.props.stores,{user:c={}}=s,{subscription:a}=c;if(a.payPalSubscriptionId){const e=await t.subscriptionDetail({id:a.payPalSubscriptionId});s.setSubscriptionPaypal(e.data),await s.getInfo()}},this.toggleCancel=()=>{const{showCancel:t}=this.state;this.setState({showCancel:!t})},this.toggleDetails=()=>{const{showDetails:t}=this.state;t||this.subscriptionDetail(),this.setState({showDetails:!t})},this.back=()=>{const{history:t}=this.props.stores;t.goBack()},this.state={time:Date.now(),count:10}}componentDidMount(){const{userStore:t}=this.props.stores;this.props.verifyEmailToken&&t.verifyEmail({token:this.props.verifyEmailToken})}render(){const{scrolledDown:e}=this.props,{userStore:s,appState:c}=this.props.stores,{darkmode:r}=c,{user:l,emailMessage:m,emailError:j,emailMessageIcon:O,emailErrorIcon:g,isAdmin:f}=s,{teams:v,settings:x={}}=l,w=s.findTeams(v);i.a.getApiServer(),i.a.getJwtToken();return Object(a.h)("div",{class:"container-fluid",style:`margin-bottom: ${d}; margin-top: ${b};`},Object(a.h)("button",{class:"btn btn-link pl-0 fixed-top text-primary",style:`top: ${p}; left: 5px; font-size: 35px; width: 45px;`,onClick:this.back},Object(a.h)("i",{class:"fas fa-arrow-circle-left"})),Object(a.h)("div",{class:"row fixed-top",style:`margin-top: ${e>0?0:u}; background-color: ${r?"#191d21":"#f8f9fa"}; transition: all 0.3s ease-in-out;`},Object(a.h)("div",{class:"col text-center border-bottom border-primary subtopmenu text-overflow"},Object(a.h)("nobr",null,Object(a.h)("a",{href:"/users",class:"text-primary stretched-link"},Object(a.h)("i",{class:"fas fa-user"})," ",Object(a.h)(o.c,{id:"users.title"},"Din profil")))),Object(a.h)("div",{class:"col text-center subtopmenu text-overflow"},Object(a.h)("nobr",null,Object(a.h)("a",{href:"/settings/user",class:"text-secondary stretched-link"},Object(a.h)("i",{class:"fas fa-sliders-h"})," ",Object(a.h)(o.c,{id:"users.settings"},"Innstillinger")))),f&&Object(a.h)("div",{class:"col text-center subtopmenu text-overflow"},Object(a.h)("nobr",null,Object(a.h)("a",{href:"/users/subscription",class:"text-secondary stretched-link"},Object(a.h)("i",{class:"fas fa-signature"})," ",Object(a.h)(o.c,{id:"users.subscriptions"},"Abonnement")))),Object(a.h)("div",{class:"col text-center subtopmenu text-overflow"},Object(a.h)("nobr",null,Object(a.h)("a",{href:"/users/integrations",class:"text-secondary stretched-link"},Object(a.h)("i",{class:"fas fa-plug"})," ",Object(a.h)(o.c,{id:"users.integrations"},"Integrasjoner"))))),Object(a.h)("div",{class:"row mt-5"},Object(a.h)("div",{class:"col-12"},Object(a.h)(n.a,{message:j,icon:g,remove:this.resetEmailError}),Object(a.h)(h.a,{message:m,icon:O,remove:this.resetEmailMessage}),Object(a.h)("a",{href:"/users/edit",class:"btn btn-primary btn-sm float-right"},Object(a.h)(o.c,{id:"users.edit"},"Endre")),Object(a.h)("h5",{class:"ml-3"},Object(a.h)(o.c,{id:"users.title"},"Din profil"))),Object(a.h)("div",{class:"col-4 text-muted text-right"},Object(a.h)(o.c,{id:"users.email"},"E-post")),Object(a.h)("div",{class:"col-8"},l.email),Object(a.h)("div",{class:"col-4 text-muted text-right"},Object(a.h)(o.c,{id:"users.password"},"Passord")),Object(a.h)("div",{class:"col-8"},Object(a.h)("a",{href:"/users/edit-password",class:"btn btn-primary btn-sm"},Object(a.h)(o.c,{id:"users.change-password"},"Endre passord"))),l.team&&Object(a.h)(t,null,Object(a.h)("div",{class:"col-4 text-muted text-right"},Object(a.h)(o.c,{id:"users.main-team"},"Hovedteam")),Object(a.h)("div",{class:"col-8"},s.findTeam(l.team))),l.teams&&Object(a.h)(t,null,Object(a.h)("div",{class:"col-4 text-muted text-right"},Object(a.h)(o.c,{id:"users.all-teams"},"Alle teamene")),Object(a.h)("div",{class:"col-8"},w.map(t=>Object(a.h)("div",null,t.name)))),l.username&&Object(a.h)(t,null,Object(a.h)("div",{class:"col-4 text-muted text-right"},Object(a.h)(o.c,{id:"users.username"},"Brukernavn")),Object(a.h)("div",{class:"col-8"},l.username)),l.firstname&&Object(a.h)(t,null,Object(a.h)("div",{class:"col-4 text-muted text-right"},Object(a.h)(o.c,{id:"users.firstname"},"Fornavn")),Object(a.h)("div",{class:"col-8"},l.firstname)),l.lastname&&Object(a.h)(t,null,Object(a.h)("div",{class:"col-4 text-muted text-right"},Object(a.h)(o.c,{id:"users.lastname"},"Etternavn")),Object(a.h)("div",{class:"col-8"},l.lastname)),l.cellphone&&Object(a.h)(t,null,Object(a.h)("div",{class:"col-4 text-muted text-right"},Object(a.h)(o.c,{id:"users.cellphone"},"Mobil")),Object(a.h)("div",{class:"col-8"},l.cellphone)),l.url&&Object(a.h)(t,null,Object(a.h)("div",{class:"col-4 text-muted text-right"},Object(a.h)(o.c,{id:"users.homepage"},"Hjemmeside")),Object(a.h)("div",{class:"col-8"},l.url)),l.facebook&&Object(a.h)(t,null,Object(a.h)("div",{class:"col-4 text-muted text-right"},Object(a.h)(o.c,{id:"users.facebook"},"Facebook")),Object(a.h)("div",{class:"col-8"},l.facebook)),l.instagram&&Object(a.h)(t,null,Object(a.h)("div",{class:"col-4 text-muted text-right"},Object(a.h)(o.c,{id:"users.instagram"},"Instagram")),Object(a.h)("div",{class:"col-8"},l.instagram)),l.snapchat&&Object(a.h)(t,null,Object(a.h)("div",{class:"col-4 text-muted text-right"},Object(a.h)(o.c,{id:"users.snapchat"},"Snapchat")),Object(a.h)("div",{class:"col-8"},l.snapchat))),Object(a.h)("div",{class:"row mt-5 pt-5"},Object(a.h)("div",{class:"col-12 text-center"},Object(a.h)("a",{href:"/logout",class:"btn btn-block btn-lg btn-warning"},Object(a.h)("i",{class:"fas fa-sign-out-alt"})," ",Object(a.h)(o.c,{id:"header.logout"},"Logg ut")))))}})||c;e.default=m}.call(this,s("hosL").Fragment)}}]);
//# sourceMappingURL=route-users.chunk.5a136.esm.js.map