(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{ztHd:function(e,t,s){"use strict";s.r(t),function(e){var c,a=s("hosL"),i=s("Utv1"),l=s("/eY4"),n=s("OhSV"),r=s("ZOvn"),o=s.n(r),h=s("tJLP"),d=s("Cjoz");const b=o.a.marginTop(!1),u=o.a.marginBottom();let j=Object(l.a)(c=class extends a.Component{constructor(e){var t;super(e),t=this,this.resetEmailMessage=()=>{const{userStore:e}=this.props.stores;e.updateField("emailMessage",""),e.updateField("emailMessageIcon","")},this.resetEmailError=()=>{const{userStore:e}=this.props.stores;e.updateField("emailError",""),e.updateField("emailErrorIcon","")},this.toggleSetting=async function(e){const{userStore:s}=t.props.stores,{user:c}=s,{settings:a}=c;await s.updateSetting({["settings."+e]:1===a[e]?0:1})},this.state={time:Date.now(),count:10}}componentDidMount(){const{userStore:e}=this.props.stores;this.props.verifyEmailToken&&e.verifyEmail({token:this.props.verifyEmailToken})}render(){const{userStore:t}=this.props.stores,{user:s,emailMessage:c,emailError:l,emailMessageIcon:r,emailErrorIcon:o}=t,{teams:j,settings:m={}}=s,O=t.findTeams(j),v=i.a.getApiServer(),p=i.a.getJwtToken();return Object(a.h)("div",{class:"container-fluid",style:`margin-bottom: ${u}; margin-top: ${b};`},Object(a.h)("div",{class:"row"},Object(a.h)("div",{class:"col-12"},Object(a.h)(h.a,{message:l,icon:o,remove:this.resetEmailError}),Object(a.h)(d.a,{message:c,icon:r,remove:this.resetEmailMessage}),Object(a.h)("a",{href:"/users/edit",class:"btn btn-primary btn-sm float-right"},Object(a.h)(n.c,{id:"users.edit"},"Endre")),Object(a.h)("h5",null,Object(a.h)(n.c,{id:"users.title"},"Din profil"))),Object(a.h)("div",{class:"col-4 text-muted text-right"},Object(a.h)(n.c,{id:"users.email"},"E-post")),Object(a.h)("div",{class:"col-8"},s.email),s.team&&Object(a.h)(e,null,Object(a.h)("div",{class:"col-4 text-muted text-right"},Object(a.h)(n.c,{id:"users.main-team"},"Hovedteam")),Object(a.h)("div",{class:"col-8"},t.findTeam(s.team))),s.teams&&Object(a.h)(e,null,Object(a.h)("div",{class:"col-4 text-muted text-right"},Object(a.h)(n.c,{id:"users.all-teams"},"Alle teamene")),Object(a.h)("div",{class:"col-8"},O.map(e=>Object(a.h)("div",null,e.name)))),s.username&&Object(a.h)(e,null,Object(a.h)("div",{class:"col-4 text-muted text-right"},Object(a.h)(n.c,{id:"users.username"},"Brukernavn")),Object(a.h)("div",{class:"col-8"},s.username)),s.firstname&&Object(a.h)(e,null,Object(a.h)("div",{class:"col-4 text-muted text-right"},Object(a.h)(n.c,{id:"users.firstname"},"Fornavn")),Object(a.h)("div",{class:"col-8"},s.firstname)),s.lastname&&Object(a.h)(e,null,Object(a.h)("div",{class:"col-4 text-muted text-right"},Object(a.h)(n.c,{id:"users.lastname"},"Etternavn")),Object(a.h)("div",{class:"col-8"},s.lastname)),s.cellphone&&Object(a.h)(e,null,Object(a.h)("div",{class:"col-4 text-muted text-right"},Object(a.h)(n.c,{id:"users.cellphone"},"Mobil")),Object(a.h)("div",{class:"col-8"},s.cellphone)),s.url&&Object(a.h)(e,null,Object(a.h)("div",{class:"col-4 text-muted text-right"},Object(a.h)(n.c,{id:"users.homepage"},"Hjemmeside")),Object(a.h)("div",{class:"col-8"},s.url)),s.facebook&&Object(a.h)(e,null,Object(a.h)("div",{class:"col-4 text-muted text-right"},Object(a.h)(n.c,{id:"users.facebook"},"Facebook")),Object(a.h)("div",{class:"col-8"},s.facebook)),s.instagram&&Object(a.h)(e,null,Object(a.h)("div",{class:"col-4 text-muted text-right"},Object(a.h)(n.c,{id:"users.instagram"},"Instagram")),Object(a.h)("div",{class:"col-8"},s.instagram)),s.snapchat&&Object(a.h)(e,null,Object(a.h)("div",{class:"col-4 text-muted text-right"},Object(a.h)(n.c,{id:"users.snapchat"},"Snapchat")),Object(a.h)("div",{class:"col-8"},s.snapchat)),Object(a.h)("div",{class:"col-4 text-muted text-right"},Object(a.h)(n.c,{id:"users.settings-hide-profile"},"Skjul profilen")),Object(a.h)("div",{class:"col-8"},Object(a.h)("div",{class:"custom-control custom-switch"},Object(a.h)("input",{type:"checkbox",class:"custom-control-input",id:"settingsHideProfile",onInput:()=>this.toggleSetting("hideProfile"),checked:m.hideProfile}),Object(a.h)("label",{class:"custom-control-label",for:"settingsHideProfile"})),Object(a.h)("small",{class:"text-muted"},Object(a.h)(n.c,{id:"users.settings-hide-profile-help"},"Det vil snart være mulig å bli venner med andre her på The Musher. Dersom du ikke vil at andre skal kunne finne deg, så kan du skjule profilen din her."))),Object(a.h)("div",{class:"col-4 text-muted text-right"},Object(a.h)(n.c,{id:"users.settings-hide-invite"},"Skjul invitasjonsboks")),Object(a.h)("div",{class:"col-8"},Object(a.h)("div",{class:"custom-control custom-switch"},Object(a.h)("input",{type:"checkbox",class:"custom-control-input",id:"settingsHideInvitation",onInput:()=>this.toggleSetting("hideInvite"),checked:m.hideInvite}),Object(a.h)("label",{class:"custom-control-label",for:"settingsHideInvitation"})),Object(a.h)("small",{class:"text-muted"},Object(a.h)(n.c,{id:"users.settings-hide-invite-help"},"Skjul invitasjonsboksen på forsiden.")))),Object(a.h)("div",{class:"row border-top mt-5 pt-5"},Object(a.h)("div",{class:"col-12"},Object(a.h)("div",null,Object(a.h)("img",{src:"./assets/strava_logo_orange.png",style:"max-height: 100px;"}))),s.strava&&s.strava.access_token?Object(a.h)(e,null,Object(a.h)("div",{class:"col-12"},Object(a.h)("h5",null,Object(a.h)("i",{class:"fas fa-thumbs-up text-success"})," ",Object(a.h)(n.c,{id:"users.strava-connected"},"Connected to Strava!"))),Object(a.h)("div",{class:"col-4 text-right text-muted"},Object(a.h)(n.c,{id:"users.strava-id"},"id"),":"),Object(a.h)("div",{class:"col-8"}," ",s.strava.athlete.id),Object(a.h)("div",{class:"col-4 text-right text-muted"},Object(a.h)(n.c,{id:"users.strava-username"},"username"),":"),Object(a.h)("div",{class:"col-8"}," ",s.strava.athlete.username),Object(a.h)("div",{class:"col-4 text-right text-muted"},Object(a.h)(n.c,{id:"users.strava-profile"},"profile"),":"),Object(a.h)("div",{class:"col-8"}," ",Object(a.h)("img",{src:s.strava.athlete.profile})),Object(a.h)("div",{class:"col-12 mt-2"},Object(a.h)("div",{class:"display-1 text-success"},Object(a.h)("i",{class:"fas fa-check"})),Object(a.h)("small",{class:"text-muted"},Object(a.h)("small",null,Object(a.h)(n.c,{id:"users.strava-reconnect-help"},"Hvis du opplever problemer med integrasjoen så kan du prøve å koble til på nytt"),":",Object(a.h)("br",null),Object(a.h)("a",{href:`${v}/api/strava/request-access?token=${p}`,native:!0},Object(a.h)(n.c,{id:"users.strava-reconnect"},"Reconnect to Strava")))))):Object(a.h)(e,null,Object(a.h)("div",{class:"col-12 mt-2"},Object(a.h)("a",{class:"btn btn-primary",href:`${v}/api/strava/request-access?token=${p}`,native:!0},Object(a.h)(n.c,{id:"users.strava-connect"},"Connect to Strava"))))),Object(a.h)("div",{class:"row border-top mt-5 pt-5"},Object(a.h)("div",{class:"col-12"},Object(a.h)("div",null,Object(a.h)("img",{src:"./assets/garmin-connect.png",style:"height: 100px;"}))),s.garmin&&s.garmin.access&&s.garmin.access.oauth_token?Object(a.h)(e,null,Object(a.h)("div",{class:"col-12"},Object(a.h)("h5",null,Object(a.h)("i",{class:"fas fa-thumbs-up text-success"})," ",Object(a.h)(n.c,{id:"users.garmin-connected"},"Connected to Garmin Connect!"))),Object(a.h)("div",{class:"col-12 mt-2"},Object(a.h)("div",{class:"display-1 text-success"},Object(a.h)("i",{class:"fas fa-check"})),Object(a.h)("small",{class:"text-muted"},Object(a.h)("small",null,Object(a.h)(n.c,{id:"users.garmin-reconnect-help"},"Hvis du opplever problemer med integrasjoen så kan du prøve å koble til på nytt"),":",Object(a.h)("br",null),Object(a.h)("a",{href:`${v}/api/garmin/request-access?token=${p}`,native:!0},Object(a.h)(n.c,{id:"users.garmin-reconnect"},"Reconnect to Garmin Connect")))))):Object(a.h)(e,null,Object(a.h)("div",{class:"col-12 mt-2"},Object(a.h)("a",{class:"btn btn-primary",href:`${v}/api/garmin/request-access?token=${p}`,native:!0},Object(a.h)(n.c,{id:"users.garmin-connect"},"Connect to Garmin Connect"))))))}})||c;t.default=j}.call(this,s("hosL").Fragment)}}]);
//# sourceMappingURL=route-users.chunk.cca66.esm.js.map