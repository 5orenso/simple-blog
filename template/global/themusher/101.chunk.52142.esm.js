(window.webpackJsonp=window.webpackJsonp||[]).push([[101],{jsqw:function(t,e,s){"use strict";s.r(e),function(t){function i(t,e){var s=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),s.push.apply(s,i)}return s}function o(t,e,s){return e in t?Object.defineProperty(t,e,{value:s,enumerable:!0,configurable:!0,writable:!0}):t[e]=s,t}var c,n=s("hosL"),l=s("ox/y"),a=(s("Utv1"),s("/eY4")),r=s("OhSV"),h=(s("go65"),s("Y3FI"),s("ZOvn"));const p={searchText:"",showInfo:{}},f=h.a.marginTopBack(!1);let b=Object(r.d)({hideProfile:Object(n.h)(r.c,{id:"users.settings-hide-profile"}),hideProfileHelp:Object(n.h)(r.c,{id:"users.settings-hide-profile-help"}),veterinaryAllowed:Object(n.h)(r.c,{id:"users.settings-allow-racevet"},"Tillat veterinær"),veterinaryAllowedHelp:Object(n.h)(r.c,{id:"users.settings-veterinary-help"},"Dersom du ønsker at godkjente veterinærer skal kunne søke deg opp og legge inn vaksiner må du skru på her."),hideInvite:Object(n.h)(r.c,{id:"users.settings-hide-invite"},"Skjul invitasjonsboks"),hideInviteHelp:Object(n.h)(r.c,{id:"users.settings-hide-invite-help"},"Skjul invitasjonsboksen på forsiden."),hideSettings:Object(n.h)(r.c,{id:"users.settings-hide-settings"},"Skjul innstillinger"),hideSettingsHelp:Object(n.h)(r.c,{id:"users.settings-hide-settings-help"},"Skjul innstillinger på forsiden."),imperial:Object(n.h)(r.c,{id:"users.settings-imperial"},"Imperial units"),imperialHelp:Object(n.h)(r.c,{id:"users.settings-imperial-email"},"Use imperial units like mils, mph, Fahrenheit."),summaryEmails:Object(n.h)(r.c,{id:"users.settings-summary-email"},"Oppsummeringer"),summaryEmailsHelp:Object(n.h)(r.c,{id:"users.settings-receive-summary-email"},"Motta oppsummeringer via e-post"),notificationEmails:Object(n.h)(r.c,{id:"users.settings-notification-email"},"Notifications"),notificationEmailsHelp:Object(n.h)(r.c,{id:"users.settings-receive-notification-email"},"Receive notifications via email"),infoEmails:Object(n.h)(r.c,{id:"users.settings-info-email"},"Info"),infoEmailsHelp:Object(n.h)(r.c,{id:"users.settings-receive-info-email"},"Motta info via e-post"),partnerEmails:Object(n.h)(r.c,{id:"users.settings-partner-email"},"Partners"),partnerEmailsHelp:Object(n.h)(r.c,{id:"users.settings-receive-partner-email"},"Motta tilbud fra våre partnere via e-post"),inboxEmails:Object(n.h)(r.c,{id:"users.settings-inbox-email"},"Inbox emails"),inboxEmailsHelp:Object(n.h)(r.c,{id:"users.settings-inbox-email-help"},"Receive inbox notifications via email."),storyLike:Object(n.h)(r.c,{id:"notifications.story-like"},"Story likes"),storyLikeHelp:Object(n.h)(r.c,{id:"notifications.story-like-help"},"Receive notification when your stories are liked."),storyComment:Object(n.h)(r.c,{id:"notifications.story-comment"},"Story comments"),storyCommentHelp:Object(n.h)(r.c,{id:"notifications.story-comment-help"},"Receive notification when your stories are commented."),workoutLike:Object(n.h)(r.c,{id:"notifications.workout-like"},"Workout likes"),workoutLikeHelp:Object(n.h)(r.c,{id:"notifications.workout-like-help"},"Receive notification when your workouts are liked."),workoutComment:Object(n.h)(r.c,{id:"notifications.workout-comment"},"Workout comments"),workoutCommentHelp:Object(n.h)(r.c,{id:"notifications.workout-comment-help"},"Receive notification when your workouts are commented."),message:Object(n.h)(r.c,{id:"notifications.message"},"Inbox messages"),messageHelp:Object(n.h)(r.c,{id:"notifications.message-help"},"Receive notification when your receive an inbox message."),messageLike:Object(n.h)(r.c,{id:"notifications.message-like"},"Inbox message likes"),messageLikeHelp:Object(n.h)(r.c,{id:"notifications.message-like-help"},"Receive notification when your inbox messages are liked."),pushNotifications:Object(n.h)(r.c,{id:"notifications.push-notifications"},"Push notifications"),pushNotificationsHelp:Object(n.h)(r.c,{id:"notifications.message-like-help"},"Enable push notifications on your phone."),workoutChanged:Object(n.h)(r.c,{id:"notifications.workout-changed"},"Workout changed"),workoutChangedHelp:Object(n.h)(r.c,{id:"notifications.workout-changed-help"},"Receive notification when a workout is changed."),trackChanged:Object(n.h)(r.c,{id:"notifications.track-changed"},"Track changed"),trackChangedHelp:Object(n.h)(r.c,{id:"notifications.track-changed-help"},"Receive notification when a track is changed."),dogChanged:Object(n.h)(r.c,{id:"notifications.dog-changed"},"Dog changed"),dogChangedHelp:Object(n.h)(r.c,{id:"notifications.dog-changed-help"},"Receive notification when a dog is changed."),allStories:Object(n.h)(r.c,{id:"notifications.stories-new"},"New stories"),allStoriesHelp:Object(n.h)(r.c,{id:"notifications.stories-new-help"},"Receive notification when a new story is posted.")})(c=Object(a.a)(c=class extends n.Component{constructor(t){var e;super(t),e=this,this.toggleDarkmode=t=>{const{appState:e}=this.props.stores;e.toggleDarkmode(),this.toggleDropdown(t)},this.toggleViewmode=t=>{const{appState:e}=this.props.stores,{mode:s}=t.target.closest("a").dataset;e.toggleViewmode(s)},this.changeLanguage=t=>{const{lang:e}=t.target.closest("a").dataset,{userStore:s}=this.props.stores,{user:i}=s;s.setLanguage({email:i.email,language:e})},this.toggleSetting=async function(t){const{userStore:s}=e.props.stores,{user:i}=s,{settings:o={}}=i;await s.updateSetting({["settings."+t]:1===o[t]?0:1},{[t]:1===o[t]?0:1})},this.toggleInfo=t=>{const{name:e}=t.target.closest("i").dataset,{showInfo:s}=this.state;s[e]=!s[e],this.setState({showInfo:s})},this.toggleNotification=async function(t){const{userStore:s}=e.props.stores,{user:i}=s,{notifications:o={}}=i,c=o[t]?0:1;await s.setNotification({field:"notifications."+t,value:c})},this.toggleNotificationTopic=async function(t){const{userStore:s}=e.props.stores,{user:i}=s,{notificationTopics:o={}}=i,c=o[t]?0:1;await s.setNotificationTopic({field:"notificationTopics."+t,value:c})},this.togglePushNotifications=async function(){const{userStore:t}=e.props.stores;await t.checkNotificationPermission()},this.displayNotificationTopic=t=>{const{userStore:e}=this.props.stores,s=t.split("-"),i=parseInt(s[1],10),o=/^team-\d+/;switch(!0){case/^race-\d+/.test(t):return e.findSubscribedRace(i).title;case o.test(t):return e.findSubscribedTeam(i).name;default:return t}},this.back=()=>{const{history:t}=this.props.stores;t.goBack()},this.runInit=()=>{const{userStore:t}=this.props.stores,e=t.hasFirebasePlugin();this.setState({hasFirebasePlugin:e})},this.state=function(t){for(var e=1;e<arguments.length;e++){var s=null!=arguments[e]?arguments[e]:{};e%2?i(Object(s),!0).forEach((function(e){o(t,e,s[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(s)):i(Object(s)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(s,e))}))}return t}({},p)}componentDidMount(){this.runInit()}render(){const{appState:e,userStore:s}=this.props.stores,{showInfo:i={},hasFirebasePlugin:o}=this.state,{user:c}=s,{settings:a={},notifications:h={},notificationTopics:p={},language:b="en",firebase:m={}}=c;return Object(n.h)("div",{class:"container-fluid",style:"margin-bottom: 200px; margin-top: 60px;"},Object(n.h)("button",{class:"btn btn-link pl-0 fixed-top text-primary",style:`top: ${f}; left: 5px; font-size: 35px; width: 45px;`,onClick:this.back},Object(n.h)("i",{class:"fas fa-arrow-circle-left"})),Object(n.h)("div",{class:"row m-2"},Object(n.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 mt-0 mb-2"},Object(n.h)("h1",null,Object(n.h)(r.c,{id:"settings.user"},"User")))),Object(n.h)("div",{class:"row m-2"},Object(n.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 mt-3 mb-2"},Object(n.h)("h5",{class:"m-0 text-muted"},Object(n.h)(r.c,{id:"settings.profile"},"Profile"))),Object(n.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 mb-3 bg-light rounded-lg",style:"font-size: 1.2em;"},Object(n.h)("div",{class:"row"},Object(n.h)("div",{class:"col-12 py-2 d-flex align-items-center position-relative"},Object(n.h)("button",{class:"btn btn-success py-0 px-1 mr-3",style:"width: 2.0em;"},Object(n.h)("i",{class:"fas fa-user"})),Object(n.h)("span",{class:"flex-grow-1"},Object(n.h)("a",{href:"/users/",class:"stretched-link"},Object(n.h)(r.c,{id:"users.title"},"Din profil"))),Object(n.h)("button",{class:"btn btn-link btn-lg py-0 px-1 mr-3"},Object(n.h)("i",{class:"fas fa-angle-right"})))),Object(n.h)("div",{class:"row border-top"},Object(n.h)("div",{class:"col-12 py-2 d-flex align-items-center position-relative"},Object(n.h)("button",{class:"btn btn-warning py-0 px-1 mr-3",style:"width: 2.0em;"},Object(n.h)("i",{class:"fas fa-user-edit"})),Object(n.h)("span",{class:"flex-grow-1"},Object(n.h)("a",{href:"/users/edit",class:"stretched-link"},Object(n.h)(r.c,{id:"users.edit-profile"},"Edit profil"))),Object(n.h)("button",{class:"btn btn-link btn-lg py-0 px-1 mr-3"},Object(n.h)("i",{class:"fas fa-angle-right"})))),Object(n.h)("div",{class:"row border-top"},Object(n.h)("div",{class:"col-12 py-2 d-flex align-items-center position-relative"},Object(n.h)("button",{class:"btn btn-danger py-0 px-1 mr-3",style:"width: 2.0em;"},Object(n.h)("i",{class:"fas fa-key"})),Object(n.h)("span",{class:"flex-grow-1"},Object(n.h)("a",{href:"/users/edit-password",class:"stretched-link"},Object(n.h)(r.c,{id:"users.change-password"},"Change password"))),Object(n.h)("button",{class:"btn btn-link btn-lg py-0 px-1 mr-3"},Object(n.h)("i",{class:"fas fa-angle-right"}))))),Object(n.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 mt-3 mb-2"},Object(n.h)("h5",{class:"m-0 text-muted"},Object(n.h)(r.c,{id:"settings.user-email"},"Email"))),Object(n.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 mb-3 bg-light rounded-lg",style:"font-size: 1.2em;"},["summaryEmails","notificationEmails","infoEmails","partnerEmails","inboxEmails"].map((e,s)=>Object(n.h)(t,null,Object(n.h)("div",{class:"row "+(s>0?"border-top":"")},Object(n.h)("div",{class:"col-12 py-2 d-flex align-items-center position-relative"},Object(n.h)("span",{class:"flex-grow-1",style:"line-height: 1.0em;"},this.props[e],this.props[e+"Help"]&&Object(n.h)("i",{class:"fas fa-info-circle text-muted ml-2",onClick:this.toggleInfo,"data-name":e}),this.props[e+"Help"]&&i[e]&&Object(n.h)(t,null,Object(n.h)("br",null),Object(n.h)("small",{class:"text-muted"},this.props[e+"Help"]))),Object(n.h)("div",{class:"custom-control custom-switch custom-switch-lg mt-2 ml-3",style:"transform: scale(1.8);"},Object(n.h)("input",{type:"checkbox",class:"custom-control-input",id:"settings"+e,onInput:()=>this.toggleSetting(e),checked:a[e]}),Object(n.h)("label",{class:"custom-control-label",for:"settings"+e}))))))),Object(n.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 mt-3 mb-2"},Object(n.h)("h5",{class:"m-0 text-muted"},Object(n.h)(r.c,{id:"settings.notifications"},"Notifications"))),!o&&Object(n.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 mb-3 bg-light rounded-lg",style:"font-size: 1.2em;"},Object(n.h)("div",{class:"alert alert-danger",role:"alert"},Object(n.h)("i",{class:"fas fa-exclamation-triangle",style:"font-size: 1.5em;"})," ",Object(n.h)(r.c,{id:"notifications.push-notifications-not-supported"},"Push notifications is not supported on your device."))),Object(n.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 mb-3 bg-light rounded-lg",style:`font-size: 1.2em; opacity: ${o?1:.2};`},Object(n.h)("div",{class:"row"},Object(n.h)("div",{class:"col-12 py-2 d-flex align-items-center position-relative"},Object(n.h)("span",{class:"flex-grow-1",style:"line-height: 1.0em;"},this.props.pushNotifications,this.props.pushNotificationsHelp&&Object(n.h)("i",{class:"fas fa-info-circle text-muted ml-2",onClick:this.toggleInfo,"data-name":"pushNotifications"}),this.props.pushNotificationsHelp&&i.pushNotifications&&Object(n.h)(t,null,Object(n.h)("br",null),Object(n.h)("small",{class:"text-muted"},this.props.pushNotificationsHelp))),Object(n.h)("div",{class:"custom-control custom-switch custom-switch-lg mt-2 ml-3",style:"transform: scale(1.8);"},Object(n.h)("input",{type:"checkbox",class:"custom-control-input",id:"settingspushNotifications",onInput:()=>this.togglePushNotifications(),checked:m.hasPermission}),Object(n.h)("label",{class:"custom-control-label",for:"settingspushNotifications"}))))),Object(n.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 mb-3 bg-light rounded-lg",style:`font-size: 1.2em; opacity: ${m.hasPermission?1:.2};`},["storyLike","storyComment","workoutLike","workoutComment","message","messageLike","workoutChanged","trackChanged","dogChanged"].map((e,s)=>Object(n.h)(t,null,Object(n.h)("div",{class:"row "+(s>=0?"border-top":"")},Object(n.h)("div",{class:"col-12 py-2 d-flex align-items-center position-relative"},Object(n.h)("span",{class:"flex-grow-1",style:"line-height: 1.0em;"},this.props[e],this.props[e+"Help"]&&Object(n.h)("i",{class:"fas fa-info-circle text-muted ml-2",onClick:this.toggleInfo,"data-name":e}),this.props[e+"Help"]&&i[e]&&Object(n.h)(t,null,Object(n.h)("br",null),Object(n.h)("small",{class:"text-muted"},this.props[e+"Help"]))),Object(n.h)("div",{class:"custom-control custom-switch custom-switch-lg mt-2 ml-3",style:"transform: scale(1.8);"},Object(n.h)("input",{type:"checkbox",class:"custom-control-input",id:"settings"+e,onInput:()=>this.toggleNotification(e),checked:h[e]}),Object(n.h)("label",{class:"custom-control-label",for:"settings"+e}))))))),Object(n.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 mt-3 mb-2"},Object(n.h)("h5",{class:"m-0 text-muted"},Object(n.h)(r.c,{id:"settings.notification-topics"},"Notification topics"))),Object(n.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 mb-3 bg-light rounded-lg",style:`font-size: 1.2em; opacity: ${m.hasPermission?1:.2};`},0===Object.keys(p).length&&Object(n.h)(t,null,Object(n.h)("div",{class:"text-center text-muted"},Object(n.h)("div",{class:"display-4"},Object(n.h)("i",{class:"fas fa-rss"})),Object(n.h)("h3",{class:"font-weight-lighter"},Object(n.h)(r.c,{id:"users.settings-no-topics"},"No notification topics found for your user.")))),Object.keys(p).map((e,s)=>Object(n.h)(t,null,Object(n.h)("div",{class:"row "+(s>0?"border-top":"")},Object(n.h)("div",{class:"col-12 py-2 d-flex align-items-center position-relative"},Object(n.h)("span",{class:"flex-grow-1",style:"line-height: 1.0em;"},this.displayNotificationTopic(this.props[e]||e),(p[e+"Help"]||this.props[e+"Help"])&&Object(n.h)("i",{class:"fas fa-info-circle text-muted ml-2",onClick:this.toggleInfo,"data-name":e}),(p[e+"Help"]||this.props[e+"Help"])&&i[e]&&Object(n.h)(t,null,Object(n.h)("br",null),Object(n.h)("small",{class:"text-muted"},p[e+"Help"]||this.props[e+"Help"]))),Object(n.h)("div",{class:"custom-control custom-switch custom-switch-lg mt-2 ml-3",style:"transform: scale(1.8);"},Object(n.h)("input",{type:"checkbox",class:"custom-control-input",id:"settings"+e,onInput:()=>this.toggleNotificationTopic(e),checked:p[e]}),Object(n.h)("label",{class:"custom-control-label",for:"settings"+e}))))))),Object(n.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 my-3 bg-light rounded-lg",style:"font-size: 1.2em;"},Object(n.h)("div",{class:"row"},Object(n.h)("div",{class:"col-12 py-2 d-flex align-items-center position-relative"},Object(n.h)("button",{class:"btn btn-secondary py-0 px-1 mr-3",style:"width: 2.0em;"},Object(n.h)("i",{class:"fas fa-sign-out-alt"})),Object(n.h)("span",{class:"flex-grow-1"},Object(n.h)(l.Link,{className:"stretched-link",activeClassName:"active",href:"/logout"},Object(n.h)(r.c,{id:"settings.logout"},"Logout"))))))))}})||c)||c;e.default=b}.call(this,s("hosL").Fragment)}}]);
//# sourceMappingURL=101.chunk.52142.esm.js.map