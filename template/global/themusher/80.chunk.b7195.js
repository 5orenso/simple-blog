(window.webpackJsonp=window.webpackJsonp||[]).push([[80],{"/DnB":function(e,t,a){"use strict";function r(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function i(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}var n,o=a("hosL"),s=(a("Utv1"),a("/eY4")),c={},l=Object(s.a)(n=function(e){function t(t){var a;return(a=e.call(this,t)||this).state=function(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?r(Object(a),!0).forEach((function(t){i(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):r(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}({},c),a.container=null,a}var a,n;n=e,(a=t).prototype=Object.create(n.prototype),a.prototype.constructor=a,a.__proto__=n;var s=t.prototype;return s.componentDidMount=function(){var e=this.props,t=e.horizontal,a=e.vertical,r=void 0===a?"":a,i={behavior:"smooth"};t&&(i.inline=t),r&&(i.block=r),this.container.scrollIntoView(i)},s.render=function(){var e=this;return Object(o.h)("div",{ref:function(t){return e.container=t}}," ")},t}(o.Component))||n;t.a=l},QQvA:function(e,t,a){"use strict";a.r(t),function(e){function r(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?r(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):r(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,e.__proto__=t}var s,c,l,d=a("hosL"),p=a("Utv1"),u=a("/eY4"),h=(a("go65"),a("Y3FI")),f=a("cneo"),b=a("OhSV"),v=a("ZOvn"),m=a("om2D"),g=a("TiXY"),O=a("HqZR"),j=(a("/DnB"),v.a.marginTop(!1)),k=v.a.marginTopBack(!1),y=v.a.marginBottom(),x={newTrack:{}},w=Object(u.a)(s=function(t){function a(){for(var e,a=arguments.length,r=new Array(a),i=0;i<a;i++)r[i]=arguments[i];return(e=t.call.apply(t,[this].concat(r))||this).handleImageErrored=function(e){var t=e.target;t.onerror=null,setTimeout((function(){t.src+="?"+new Date}),1e3)},e.setDateToNow=function(){var t=e.props,a=t.field,r=t.updateField,i=t.track,n=p.a.isoDate(void 0,!1,!1,!0);r({id:i.id,field:a,value:n})},e.setTimeToNow=function(){var t=e.props,a=t.field,r=t.updateField,i=t.track,n=p.a.isoTime();r({id:i.id,field:a,value:n})},e.removeImage=function(t){return new Promise((function(a){return e.props.stores.trackStore.removeImage({id:e.props.track.id,name:t.target.parentElement.dataset.name||t.target.dataset.name}),a()}))},e.removeMainImage=function(){var t=e.props;(0,t.updateField)({id:t.track.id,field:t.field,value:{}})},e}return o(a,t),a.prototype.render=function(){var t=this,a=this.props,r=a.saved,i=a.track,n=a.type,o=void 0===n?"text":n,s=a.field,c=a.values,l=void 0===c?[]:c,u=a.title,h=a.icon,v=a.help,O=a.onInput,j=a.updateField,k=Object(f.i)(i[s]);return"date"===o&&k&&(k=p.a.isoDate(i[s],!1,!1,!0)),"image"===o?Object(d.h)("div",{class:"form-group "+(r[s+"."+i.id]?"is-valid":"")},Object(d.h)("label",{for:s+"Input"},h&&Object(d.h)("i",{class:h+" text-muted"})," ",u),Object(d.h)("div",{class:"container-fluid"},Object(d.h)("div",{class:"row"},i.image&&i.image.s3SmallLink&&Object(d.h)("div",{class:"col-3 p-1"},Object(d.h)("img",{src:i.image.s3SmallLink,class:"img-fluid border rounded-lg",onError:this.handleImageErrored}),Object(d.h)("button",{class:"btn btn-sm btn-link",onClick:this.removeMainImage,"data-name":i.image.name},Object(d.h)("i",{class:"fas fa-trash"})," Del"),Object(d.h)("span",{class:"badge badge-success"},"Main")),i.images&&i.images.map((function(e){return Object(d.h)("div",{class:"col-3 p-1"},Object(d.h)("img",{src:e.s3SmallLink,class:"img-fluid",onError:t.handleImageErrored}),Object(d.h)("button",{class:"btn btn-sm btn-link",onClick:t.removeImage,"data-name":e.name},Object(d.h)("i",{class:"fas fa-trash"})," Del"))})))),Object(d.h)(m.a,{saved:r,object:i,field:s,updateField:j,autoOpen:!1}),r[s+"."+i.id]?Object(d.h)("div",{class:"valid-feedback",style:"display: block;"},Object(d.h)(b.c,{id:"tracks.changes-saved"},"Endringene er lagret")):Object(d.h)("small",{id:s+"Help",class:"form-text text-muted"},v)):"file"===o?Object(d.h)("div",{class:"form-group "+(r[s+"."+i.id]?"is-valid":"")},Object(d.h)("label",{for:s+"Input"},h&&Object(d.h)("i",{class:h+" text-muted"})," ",u),Object(d.h)(g.a,{saved:r,object:i,field:s,updateField:j}),r[s+"."+i.id]?Object(d.h)("div",{class:"valid-feedback",style:"display: block;"},Object(d.h)(b.c,{id:"tracks.changes-saved"},"Endringene er lagret")):Object(d.h)("small",{id:s+"Help",class:"form-text text-muted"},v)):"radio"===o?Object(d.h)("div",{class:"form-group "+(r[s+"."+i.id]?"is-valid":"")},Object(d.h)("label",{for:s+"Input"},h&&Object(d.h)("i",{class:h+" text-muted"})," ",u,' "',k,'"'),l.map((function(t){return Object(d.h)(e,null,Object(d.h)("div",{class:"form-check"},Object(d.h)("input",{class:"form-check-input "+(r[s+"."+i.id]?"is-valid":""),type:"radio",id:s+"Input",value:t[0],"data-id":i.id,"data-field":s,onInput:O,checked:k==t[0]?"checked":""}),Object(d.h)("label",{class:"form-check-label",for:s+"Input"},t[1])))})),r[s+"."+i.id]?Object(d.h)("div",{class:"valid-feedback",style:"display: block;"},Object(d.h)(b.c,{id:"tracks.changes-saved"},"Endringene er lagret")):Object(d.h)("small",{id:s+"Help",class:"form-text text-muted"},v)):"toggle"===o?Object(d.h)("div",{class:"form-group "+(r[s+"."+i.id]?"is-valid":"")},Object(d.h)("label",{for:s+"Input"},h&&Object(d.h)("i",{class:h+" text-muted"})," ",u),Object(d.h)("div",{class:"custom-control custom-switch"},Object(d.h)("input",{type:"checkbox",class:"custom-control-input",id:s+"Input",value:1===k?0:1,"data-id":i.id,"data-field":s,onInput:O,checked:1==k?"checked":""}),Object(d.h)("label",{class:"custom-control-label",for:s+"Input"})),r[s+"."+i.id]?Object(d.h)("div",{class:"valid-feedback",style:"display: block;"},Object(d.h)(b.c,{id:"tracks.changes-saved"},"Endringene er lagret")):Object(d.h)("small",{id:s+"Help",class:"form-text text-muted"},v)):Object(d.h)("div",{class:"form-group "+(r[s+"."+i.id]?"is-valid":"")},Object(d.h)("label",{for:s+"Input"},h&&Object(d.h)("i",{class:h+" text-muted"})," ",u),Object(d.h)("input",{type:o,class:"form-control "+(r[s+"."+i.id]?"is-valid":""),id:s+"Input","aria-describedby":s+"Help",value:k,"data-id":i.id,"data-field":s,onInput:O}),r[s+"."+i.id]?Object(d.h)("div",{class:"valid-feedback",style:"display: block;"},Object(d.h)(b.c,{id:"tracks.changes-saved"},"Endringene er lagret")):Object(d.h)("small",{id:s+"Help",class:"form-text text-muted"},v))},a}(d.Component))||s,F=Object(u.a)(c=function(e){function t(){for(var t,a=arguments.length,r=new Array(a),i=0;i<a;i++)r[i]=arguments[i];return(t=e.call.apply(e,[this].concat(r))||this).onInput=function(e){t.props.stores.trackStore.updateObjectKeyValue("newTrack",t.props.field,e.target.value)},t}return o(t,e),t.prototype.render=function(){var e=this.props,t=e.field,a=e.icon,r=e.title,i=e.help,n=this.props.stores.trackStore.newTrack;return Object(d.h)("div",{class:"form-group"},Object(d.h)("label",{for:t+"Input"},a&&Object(d.h)("i",{class:a+" text-muted"})," ",r),Object(d.h)("input",{type:"text",class:"form-control",id:t+"Input","aria-describedby":t+"Help",onInput:this.onInput,value:n[t]}),Object(d.h)("small",{id:t+"Help",class:"form-text text-muted"},i))},t}(d.Component))||c,D=Object(u.a)(l=function(e){function t(t){var a;return(a=e.call(this,t)||this).insertTrack=function(){return new Promise((function(e,t){var r,n,o;return n=(r=a.props.stores).trackStore,o=r.userStore,Promise.resolve(n.insert(i({},n.newTrack))).then((function(){try{return Promise.resolve(o.getInfo()).then((function(){try{return a.resetTrack(),Object(h.route)("/tracks/"),e()}catch(e){return t(e)}}),t)}catch(e){return t(e)}}),t)}))},a.updateField=function(e){var t=e.target.dataset,r=t.field,i=t.type,n=t.elementtype,o=t.isNew,s=e.target.value;a.updateFieldValue({id:parseInt(t.id,10),field:r,value:s,type:i,elementtype:n,isNew:o})},a.updateFieldValue=function(e){var t=e.id,r=e.field,i=e.value,n=e.datatype,o=e.elementtype,s=e.isNew,c=void 0!==s&&s,l=e.skipTimer,d=void 0!==l&&l,p=a.props.stores.trackStore,u=i,h=i,f=p.track;"images"===r&&Array.isArray(f.images)&&Array.isArray(i)&&(h=[].concat(f.images,i)),"array"!==n||Array.isArray(i)||(u="number"===o?i.split(",").map((function(e){return parseFloat(e)||e})):i.split(",")),c?p.updateObjectKeyValue("newTrack",r,i):(p.updateField(t,r,h),d?a.doUpdateField(t,r,u):(clearTimeout(a.updateTimer[r]),a.updateTimer[r]=setTimeout((function(){return new Promise((function(e){return a.doUpdateField(t,r,u),e()}))}),500)))},a.back=function(){a.props.stores.history.goBack()},a.state=i({},x),a.updateTimer={},a}o(t,e);var a=t.prototype;return a.loadTrack=function(){return new Promise(function(e){var t=this.props.stores.trackStore;return"new"===this.props.track?this.setState({createNew:!0}):t.load(this.props.track),e()}.bind(this))},a.resetTrack=function(){this.props.stores.trackStore.updateKeyValue("newTrack",{})},a.doUpdateField=function(e,t,a){return new Promise(function(r,i){return Promise.resolve(this.props.stores.trackStore.saveField(e,t,a)).then((function(){try{return r()}catch(e){return i(e)}}),i)}.bind(this))},a.componentDidMount=function(){this.loadTrack()},a.render=function(){var e=this.state.createNew,t=this.props.stores.trackStore,a=t.insertStatus,r=t.saved,i=t.track,n=i.name,o=i.gpx,s=i.gpxInfo;return Object(d.h)("div",{class:"container-fluid",style:"margin-bottom: "+y+"; margin-top: "+j+";"},Object(d.h)("button",{class:"btn btn-link pl-0 fixed-top text-primary",style:"top: "+k+"; left: 5px; font-size: 35px; width: 45px;",onClick:this.back},Object(d.h)("i",{class:"fas fa-arrow-circle-left"})),Object(d.h)("div",{class:"row"},Object(d.h)("div",{class:"offset-0 col-12 offset-sm-2 col-sm-8 offset-lg-4 col-lg-4",style:"padding-left: 35px;"},e?Object(d.h)("div",null,Object(d.h)("h5",null,Object(d.h)(b.c,{id:"tracks.add-new"},"Legg til ny treningsrunde")),Object(d.h)(F,{stores:this.props.stores,field:"name",icon:"fas fa-heading",title:Object(d.h)(b.c,{id:"tracks.title"},"Tittel"),help:Object(d.h)(b.c,{id:"tracks.title-help"},"Tittel på denne runden. Eks: 'Rundt Veslevann og tilbake'")}),Object(d.h)(F,{stores:this.props.stores,field:"distanceKm",icon:"fas fa-road",title:Object(d.h)(b.c,{id:"tracks.distance"},"Distanse i km"),help:Object(d.h)(b.c,{id:"tracks.distance-help"},"Hvor lang er runden i km.")}),Object(d.h)(F,{stores:this.props.stores,field:"elevation",icon:"fas fa-mountain",title:Object(d.h)(b.c,{id:"tracks.elevation"},"Høydemeter"),help:Object(d.h)(b.c,{id:"tracks.elevation-help"},"Høydemeter du klatrer på denne runden.")}),Object(d.h)("button",{type:"button",class:"btn btn-primary",onClick:this.insertTrack},Object(d.h)(b.c,{id:"tracks.save"},"Registrer ny treningsrunde")),Object(d.h)("p",{class:"mt-4"},Object(d.h)(b.c,{id:"tracks.gpx-info"},"For å legge til GPX må du lagre og gå tilbake og endre denne."))):Object(d.h)("div",null,Object(d.h)("h5",null,Object(d.h)(b.c,{id:"tracks.edit"},"Endre"),": ",n),Object(d.h)(w,{saved:r,track:i,field:"public",icon:"fas fa-users",type:"toggle",title:Object(d.h)(b.c,{id:"tracks.public"},"Offentlig"),help:Object(d.h)(b.c,{id:"tracks.public-help"},"Er denne runden synlig for alle som bruker appen?"),onInput:this.updateField}),Object(d.h)(w,{saved:r,track:i,field:"name",icon:"fas fa-heading",title:Object(d.h)(b.c,{id:"tracks.title"},"Tittel"),help:Object(d.h)(b.c,{id:"tracks.title-help"},"Tittel på denne runden. Eks: 'Rundt Veslevann og tilbake'"),onInput:this.updateField}),Object(d.h)("div",{class:"row"},Object(d.h)("div",{class:"col"},Object(d.h)(w,{stores:this.props.stores,saved:r,track:i,field:"date",icon:"fas fa-calendar",type:"date",min:"2010-01-01",max:"today",title:Object(d.h)(b.c,{id:"tracks.date"},"Dato"),help:Object(d.h)(b.c,{id:"tracks.date-help"},"Dato for turen. Format på dato er: 'YYYY-MM-DD'."),onInput:this.updateField,updateField:this.updateFieldValue})),Object(d.h)("div",{class:"col"},Object(d.h)(w,{stores:this.props.stores,saved:r,track:i,field:"time",icon:"fas fa-clock",type:"time",title:Object(d.h)(b.c,{id:"tracks.time"},"Klokka"),help:Object(d.h)(b.c,{id:"tracks.time-help"},"Klokkeslett for turen. Format: 'HH:MI'."),onInput:this.updateField,updateField:this.updateFieldValue}))),Object(d.h)(w,{saved:r,track:i,field:"distanceKm",icon:"fas fa-road",title:Object(d.h)(b.c,{id:"tracks.distance"},"Distanse i km"),help:Object(d.h)(b.c,{id:"tracks.distance-help"},"Hvor lang er runden i km."),onInput:this.updateField}),Object(d.h)(w,{saved:r,track:i,field:"elevation",icon:"fas fa-mountain",title:Object(d.h)(b.c,{id:"tracks.elevation"},"Høydemeter"),help:Object(d.h)(b.c,{id:"tracks.elevation-help"},"Høydemeter du klatrer på denne runden."),onInput:this.updateField}),Object(d.h)(w,{saved:r,track:i,field:"image",icon:"fas fa-camera",type:"image",stores:this.props.stores,title:Object(d.h)(b.c,{id:"tracks.photos"},"Bilder"),help:Object(d.h)(b.c,{id:"tracks.photos-help"},"Bilder fra denne runden."),onInput:this.updateField,updateField:this.updateFieldValue}),o&&Object(d.h)("div",{style:"height: 500px;"},Object(d.h)(O.a,{stores:this.props.stores,mapId:i.id,geojson:o.geoJSON,gpxInfo:o.gpxInfo||s})),Object(d.h)(w,{saved:r,track:i,field:"gpx",type:"file",title:Object(d.h)(b.c,{id:"tracks.gpx"},"Gpx"),help:Object(d.h)(b.c,{id:"tracks.gpx-help"},"Gpx til denne runden."),onInput:this.updateField,updateField:this.updateFieldValue}))),a&&Object(d.h)("div",{class:"alert alert-success mt-4 col-12",role:"alert"},Object(d.h)(b.c,{id:"tracks.saved"},"Runden er lagret."))))},t}(d.Component))||l;t.default=D}.call(this,a("hosL").Fragment)},TiXY:function(e,t,a){"use strict";var r,i=a("hosL"),n=a("/eY4"),o=(a("cneo"),a("Utv1"),a("OhSV")),s=a("u2zT"),c=Object(n.a)(r=function(e){function t(t){var a;return(a=e.call(this,t)||this).handleAddImage=function(e){var t=a.props;(0,t.updateField)({id:t.object.id,field:t.field,value:e})},a.state={files:[]},a}var a,r;return r=e,(a=t).prototype=Object.create(r.prototype),a.prototype.constructor=a,a.__proto__=r,t.prototype.render=function(){var e=this.props,t=e.uploadStatus,a=void 0===t?function(){}:t,r=e.before,n=void 0===r?function(){}:r,c=e.after,l=void 0===c?function(){}:c,d=e.autoOpen,p=void 0!==d&&d;return Object(i.h)("div",{class:"row"},Object(i.h)("div",{class:"col-12"},Object(i.h)(o.c,{id:"form.files.upload-file"},"Last opp fil"),":",Object(i.h)("br",null),Object(i.h)(s.a,{handleAddImage:this.handleAddImage,apiUrl:"/api/fileupload",uploadStatus:a,before:n,after:l,autoOpen:p},Object(i.h)("div",{style:{height:30,width:"100%"}}))))},t}(i.Component))||r;t.a=c},om2D:function(e,t,a){"use strict";var r,i=a("hosL"),n=a("/eY4"),o=(a("cneo"),a("Utv1"),a("u2zT")),s=Object(n.a)(r=function(e){function t(t){var a;return(a=e.call(this,t)||this).handleAddImage=function(e){var t=a.props.addToImages,r=void 0===t||t,i=a.props,n=i.updateField,o=i.object,s=i.field;if(s&&n({id:o.id,field:s,value:e,skipTimer:!0}),r){var c=[];c.push(e),n({id:o.id,field:"images",value:c,skipTimer:!0})}},a.state={files:[]},a}var a,r;return r=e,(a=t).prototype=Object.create(r.prototype),a.prototype.constructor=a,a.__proto__=r,t.prototype.render=function(){var e=this.props,t=e.uploadStatus,a=void 0===t?function(){}:t,r=e.before,n=void 0===r?function(){}:r,s=e.after,c=void 0===s?function(){}:s,l=e.autoOpen,d=void 0===l||l;return Object(i.h)("div",{class:"row"},Object(i.h)("div",{class:"col-12"},Object(i.h)(o.a,{handleAddImage:this.handleAddImage,uploadStatus:a,apiUrl:"/api/fileupload",before:n,after:c,autoOpen:d},Object(i.h)("div",{style:{height:30,width:"100%"}}))))},t}(i.Component))||r;t.a=s},u2zT:function(e,t,a){"use strict";var r,i=a("hosL"),n=a("/eY4"),o=a("Utv1"),s=a("OhSV"),c=Object(n.a)(r=function(e){function t(t){var a;return(a=e.call(this,t)||this).dropRef=Object(i.createRef)(),a.handleDrag=function(e){e.preventDefault(),e.stopPropagation()},a.handleDragIn=function(e){e.preventDefault(),e.stopPropagation(),a.dragCounter++,e.dataTransfer.items&&e.dataTransfer.items.length>0&&a.setState({drag:!0})},a.handleDragOut=function(e){e.preventDefault(),e.stopPropagation(),a.dragCounter--,0===a.dragCounter&&a.setState({drag:!1})},a.handleDrop=function(e){if(e.preventDefault(),e.stopPropagation(),a.setState({drag:!1}),e.dataTransfer.files&&e.dataTransfer.files.length>0){for(var t=0,r=e.dataTransfer.files.length;t<r;t+=1){a.readLocalFile(e.dataTransfer.files[t])}a.dragCounter=0}},a.handleAddFiles=function(e){e.preventDefault();var t=e.target;for(var r=0,i=t.files.length;r<i;r+=1){a.readLocalFile(t.files[r])}},a.handleEvent=function(){0},a.handleUpload=function(e){var t=a.props,r=t.uploadStatus,i=t.before,n=void 0===i?function(){}:i,s=t.after,c=void 0===s?function(){}:s;(void 0===r?function(){}:r)(!1),o.a.isFunction(n)&&n();var l=new FormData;l.append("files[]",e);var d={progress:1};d.xhr=new XMLHttpRequest,d.xhr.upload.addEventListener("progress",(function(t){a.updateProgress(t,e)})),d.xhr.addEventListener("loadstart",(function(t){a.handleEvent(t,e)})),d.xhr.addEventListener("load",(function(t){a.handleEvent(t,e)})),d.xhr.addEventListener("loadend",(function(t){var r=e;o.a.isFunction(c)&&c(),a.handleEvent(t,r)})),d.xhr.addEventListener("progress",(function(t){a.handleEvent(t,e)})),d.xhr.addEventListener("error",(function(t){a.handleEvent(t,e)})),d.xhr.addEventListener("abort",(function(t){a.handleEvent(t,e)})),d.xhr.addEventListener("readystatechange",(function(t){a.uploadDone(t,e)})),d.xhr.open("POST",""+o.a.getApiServer()+a.props.apiUrl),d.xhr.setRequestHeader("Authorization","Bearer "+o.a.getJwtToken()),d.xhr.send(l);var p=e.name,u=a.state.uploadedFilesData;u[p]||(u[p]={}),u[p].uploadMeta=d,u[p].imageNum=a.state.imageNum,a.setState({uploadedFilesData:u})},a.readLocalFile=function(e){return new Promise((function(t,r){var i=new FileReader;i.addEventListener("error",(function(e){r(e)})),i.addEventListener("load",(function(r){var i=e,n=i.name,o=a.state.uploadedFilesData;o[n]||(o[n]={}),o[n].event=r,a.setState({uploadedFilesData:o}),a.handleUpload(i),t(r)})),i.readAsDataURL(e)}))},a.updateProgress=function(e,t){if(e.lengthComputable){var r=t.name,i=a.state.uploadedFilesData,n=e.loaded/e.total*100;0,i[r].uploadMeta.progress=n,a.setState({uploadedFilesData:i})}},a.uploadDone=function(e,t){var r=t.name,i=a.state.uploadedFilesData,n=i[r].uploadMeta;if(n&&4===n.xhr.readyState&&201===n.xhr.status)for(var o=JSON.parse(n.xhr.responseText).data.files,s=0;s<o.length;s+=1){a.addFileToUpload(o[s]),a.fileInput.value=""}},a.state={drag:!1,loadingProgress:0,uploadedFiles:[],uploadedFilesData:{}},a}var a,r;r=e,(a=t).prototype=Object.create(r.prototype),a.prototype.constructor=a,a.__proto__=r;var n=t.prototype;return n.addFileToUpload=function(e){var t=this.state.uploadedFilesData,a=this.props,r=a.handleAddImage,i=a.uploadStatus,n=void 0===i?function(){}:i;delete t[e.name],this.setState({uploadedFilesData:t}),r(e),n(!0)},n.componentDidMount=function(){var e=this,t=this.dropRef.current;t.addEventListener("dragenter",this.handleDragIn),t.addEventListener("dragleave",this.handleDragOut),t.addEventListener("dragover",this.handleDrag),t.addEventListener("drop",this.handleDrop),this.props.autoOpen&&setTimeout((function(){e.fileInput.click()}),10)},n.componentWillUnmount=function(){var e=this.dropRef.current;e.removeEventListener("dragenter",this.handleDragIn),e.removeEventListener("dragleave",this.handleDragOut),e.removeEventListener("dragover",this.handleDrag),e.removeEventListener("drop",this.handleDrop)},n.render=function(){var e=this,t=this.state.uploadedFilesData;return Object(i.h)("div",{style:{position:"relative"},ref:this.dropRef},this.state.drag&&Object(i.h)("div",{style:{border:"dashed grey 4px",backgroundColor:"rgba(255,255,255,.8)",position:"absolute",top:0,bottom:0,left:0,right:0,zIndex:9999}},Object(i.h)("div",{style:{position:"absolute",top:"50%",right:0,left:0,textAlign:"center",color:"grey",fontSize:36}},Object(i.h)("div",null,Object(i.h)(s.c,{id:"imageupload.drag-files-here"},"drop your files here :)")))),Object(i.h)("div",null,Object(i.h)("input",{class:"btn btn-info col-sm-12",multiple:!0,type:"file",id:"image-file",onchange:this.handleAddFiles,ref:function(t){e.fileInput=t}})),Object(i.h)("div",null,Object.keys(t).length>0?Object(i.h)("h3",null,Object(i.h)(s.c,{id:"imageupload.upload-images"},"Uploaded images")):"",Object(i.h)("ul",{class:"list-group"},Object.keys(t).map((function(e){var a=t[e].uploadMeta,r=void 0===a?{}:a,n=e.match(/(jpg|jpeg|png|gif|heic|heif|svg|webp|tif)/i);return Object(i.h)("li",{class:"list-group-item list-group-item-action flex-column align-items-start"},Object(i.h)("div",{class:"d-flex w-100 justify-content-between"},n&&Object(i.h)("img",{class:"img-fluid mr-3",src:t[e].event.target.result,style:"max-height: 50px;"}),Object(i.h)("small",null,t[e].event.uploadDone),Object(i.h)(s.c,{id:"imageupload.uploading-image"},"Laster opp bilde..."),Object(i.h)("small",null,o.a.formatBytes(t[e].event.total,2))),Object(i.h)("div",{class:"progress mt-1",style:"height: 4px;"},Object(i.h)("div",{class:"progress-bar progress-bar-striped progress-bar-animated bg-success",role:"progressbar",style:"width: "+r.progress+"%; height: 4px;","aria-valuenow":r.progress,"aria-valuemin":"0","aria-valuemax":"100"})))})))),this.props.children)},t}(i.Component))||r;t.a=c}}]);
//# sourceMappingURL=80.chunk.b7195.js.map