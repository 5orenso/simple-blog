(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{VtuJ:function(t){t.exports={lineChart:"lineChart__1V7gu",svg:"svg__2VZNe",pathText:"pathText__2RfbE",pathOriginal:"pathOriginal__9eH9i",legendOriginal:"legendOriginal__2ZbOt",pathLeft0:"pathLeft0__3tOjN",pathLeftFill0:"pathLeftFill0__3QXUB",legendLeft0:"legendLeft0__H5zqB",pathLeft1:"pathLeft1__3XeI-",legendLeft1:"legendLeft1__1vXUq",pathLeft2:"pathLeft2__Jskj_",legendLeft2:"legendLeft2__38D1t",pathLeft3:"pathLeft3__vtNwg",legendLeft3:"legendLeft3__tROYd",pathLeft4:"pathLeft4__ZfOXV",legendLeft4:"legendLeft4__1d0WE",pathLeft5:"pathLeft5__1V5kT",legendLeft5:"legendLeft5__3PSRY",pathLeft6:"pathLeft6__3g2rw",legendLeft6:"legendLeft6__2gdN9",pathLeft7:"pathLeft7__2aVhq",legendLeft7:"legendLeft7__3n5R1",pathLeft8:"pathLeft8__3LkIB",legendLeft8:"legendLeft8__1cA-J",pathLeft9:"pathLeft9__1eWVE",legendLeft9:"legendLeft9__1g73E",pathRight0:"pathRight0__3sPo3",legendRight0:"legendRight0__2sF9z",pathRight1:"pathRight1__16EJJ",legendRight1:"legendRight1__1ryhw",pathRight2:"pathRight2__1giMc",legendRight2:"legendRight2__1Aub9",pathRight3:"pathRight3__yhWxI",legendRight3:"legendRight3__2TdGl",pathRight4:"pathRight4__3M2kd",legendRight4:"legendRight4__2ySNI",pathRight5:"pathRight5__1IsUE",legendRight5:"legendRight5__3amxo",pathRight6:"pathRight6__37j9X",legendRight6:"legendRight6__q3gxO",pathRight7:"pathRight7__2k1bu",legendRight7:"legendRight7__1gMWB",pathRight8:"pathRight8__xUK7j",legendRight8:"legendRight8__1MmGE",pathRight9:"pathRight9__rL-jI",legendRight9:"legendRight9__1z3dO","x-axis":"x-axis__1601s","y-axis-left":"y-axis-left__3tpCF","y-axis-right":"y-axis-right__3gWmK",marker:"marker__2peOe",markers:"markers__2lso3",mouseHover:"mouseHover__2B4N6",mouseHoverDarkmode:"mouseHoverDarkmode__3VPOP",mouseHoverBox:"mouseHoverBox__3fJuY",mouseLine:"mouseLine__1cdau"}},bbv7:function(t,e,a){"use strict";(function(t){function i(t,e){if(null==t)return{};var a,i,n=function(t,e){if(null==t)return{};var a,i,n={},s=Object.keys(t);for(i=0;i<s.length;i++)e.indexOf(a=s[i])>=0||(n[a]=t[a]);return n}(t,e);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(t);for(i=0;i<s.length;i++)e.indexOf(a=s[i])>=0||Object.prototype.propertyIsEnumerable.call(t,a)&&(n[a]=t[a])}return n}function n(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),a.push.apply(a,i)}return a}function s(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?n(Object(a),!0).forEach((function(e){h(t,e,a[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):n(Object(a)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(a,e))}))}return t}function h(t,e,a){return e in t?Object.defineProperty(t,e,{value:a,enumerable:!0,configurable:!0,writable:!0}):t[e]=a,t}function o(t,e,a,i=!1,n="",s=""){let h=Array.from(Array(t).keys());i&&(h=h.reverse());const o=Math.ceil(a)-Math.floor(e);return h.map(""===n&&""===s?a=>parseInt(o/(t-1)*a,10)+Math.floor(e):a=>`${n}${parseInt(o/(t-1)*a,10)+Math.floor(e)}${s}`)}function r(t,e){if(R.a.isFunction(e))return e(t);if("string"==typeof t&&t.match(/\d+h/)){const e=3600*t.replace(/h/g,"")*1e3,a=R.a.epoch();return R.a.isoDate(a-e)}return t}function l(t,e){return R.a.isFunction(e)?e(t):t}function g(t,e,a,i,n){return i+(t-e)*(n-i)/(a-e)}function d(t,e=!1){let a=1;return t<0&&(a=-1),e?1===a?5*Math.floor(Math.abs(t)/5)*a:5*Math.ceil(Math.abs(t)/5)*a:1===a?5*Math.ceil(Math.abs(t)/5)*a:5*Math.floor(Math.abs(t)/5)*a}function c({data:t,min:e}){const a=t.map(t=>{if(R.a.isArray(t))return R.a.isNumber(e)?Math.min(e,...t.map(t=>t.y)):Math.min(...t.map(t=>t.y))});return Math.min(...a)}function p({data:t,max:e}){const a=t.map(t=>{if(R.a.isArray(t))return R.a.isNumber(e)?Math.max(e,...t.map(t=>t.y)):Math.max(...t.map(t=>t.y))});return Math.max(...a)}function f(t,e,a,i){const n=function(t,e){const a=e[0]-t[0],i=e[1]-t[1];return{length:Math.sqrt(Math.pow(a,2)+Math.pow(i,2)),angle:Math.atan2(i,a)}}(e||t,a||t),s=n.angle+(i?Math.PI:0),h=.2*n.length;return[t[0]+Math.cos(s)*h,t[1]+Math.sin(s)*h]}function u(t,e,a){const[i,n]=f(a[e-1],a[e-2],t),[s,h]=f(t,a[e-1],a[e+1],!0);return`C ${i},${n} ${s},${h} ${t[0]},${t[1]}`}function m(t){return null===t[1]?`M ${t[0]} ${t[1]}`:`L ${t[0]} ${t[1]}`}function x(t,e,a={}){const i=Math.max(...t.map(t=>t[0])),n=(Math.min(...t.map(t=>t[0])),t[0]||[[0,a.height]]),s=t[t.length-1]||[[i,a.height]];let h,o;h=a.lineFromXzero?`M 0,${a.height} L ${n[0]-20},${a.height-1}`:`M ${n[0]},${n[1]} L ${n[0]},${n[1]}`,o=a.lineFromXmax?`L ${s[0]+10},${a.height} L ${a.width},${a.height-1}`:`L ${s[0]},${s[1]} L ${s[0]},${s[1]}`;return`${h} ${t.reduce((t,a,i,n)=>0===i?`L ${a[0]},${a[1]}`:`${t} ${e(a,i,n)}`,"")} ${o}`}function y(t){return t.data.map((e,a)=>function({data:t,yMin:e,yMax:a,xMin:i,xMax:n,width:s,height:h,yRangeMin:o,yRangeMax:r,offsetY:l=0,maxMinFixed:f=!1,smooth:y=!1,avgWindow:M=0,lineFromXzero:_,lineFromXmax:L,yMaxMinRound:v}){const b={};if(t&&t.length){const O=i||Math.min(...t.map(t=>t.x),i),w=n||Math.max(...t.map(t=>t.x),n);let j,$;f?j=R.a.isNumber(e)?e:c({data:t}):(j=R.a.isNumber(e)?c({data:t,min:e}):c({data:t}),v&&(j=d(j,!0))),f?$=R.a.isNumber(a)?a:p({data:t}):($=R.a.isNumber(a)?p({data:t,max:a}):p({data:t}),v&&($=d($)));const k=h,T=(t,e)=>{if(-1===t)return-1;const a=g(t,O,w,O,w),i=Math.round(g(a,O,w,0,s));return R.a.isDefined(e)&&(b[e]||(b[e]={}),b[e].x=i,b[e].xVal=t),i},V=(t,e)=>{if(-1===t)return h;let a=t;if(R.a.isNumber(o)&&R.a.isNumber(r))return a=g(a,j,$,o,r),k-g(a,o,r,0,h-l);if(null===a)return null;a=g(a,j,$,j,$);const i=Math.round(k-g(a,j,$,0,h-l));return R.a.isDefined(e)&&(b[e]||(b[e]={}),b[e].y=i,b[e].yVal=a),i},X=t.map((t,e)=>[T(t.x,e+1),V(t.y,e+1)]).filter(t=>null!==t[1]),F=M>0?function(t,e=2,a=(t=>t),i){const n=a,s=[];for(let a=0;a<t.length;a+=1){const h=a-e,o=a+e+1;let r=0,l=0;for(let e=h>=0?h:0;e<o&&e<t.length;e+=1)l+=n(t[e]),r+=1;s[a]=i?i(t[a],l/r):l/r}return s}(X,M,t=>t[1],(t,e)=>[t[0],e]):X;for(let t=0,e=F.length;t<e;t+=1)R.a.isDefined(b[t])&&(b[t+1].ySmooth=F[t][1]);const P=x(F,y?u:m,{height:h,width:s,lineFromXzero:_,lineFromXmax:L}),W=x(X,m,{height:h});return{d:P,maxX:w,maxY:$,minY:j,dOriginal:W,dataMap:b}}return{}}(s(s({},t),{},{data:e,yRangeMin:R.a.isArray(t.yRangeMin)?t.yRangeMin[a]:void 0,yRangeMax:R.a.isArray(t.yRangeMax)?t.yRangeMax[a]:void 0,avgWindow:R.a.isArray(t.avgWindowLeft)?t.avgWindowLeft[a]:R.a.isArray(t.avgWindowRight)?t.avgWindowRight[a]:void 0,smooth:R.a.isArray(t.smoothLeft)?t.smoothLeft[a]:R.a.isArray(t.smoothRight)?t.smoothRight[a]:void 0})))}var M,_=a("hosL"),R=a("Utv1"),L=a("/eY4"),v=a("VtuJ"),b=a.n(v),O=a("ZOvn");const w={mouseData:{}};let j=Object(L.a)(M=class extends _.Component{constructor(t){super(t),this.mouseMove=t=>{if(this.props.stores){const{x:e,y:a}=this.getCoordsWithPadding(t.layerX,t.layerY),{appState:i}=this.props.stores;i.setMousePosition([e,a])}},this.state=s({},w),this.svgRef=null,this.svgContainerRef=null}getCoordsWithPadding(t,e){if(!this.svgRef)return{};const{width:a=600,height:i=200,paddingLeft:n,paddingTop:s,paddingBottom:h,showYTicksLeft:o,showXTicks:r}=this.props,l=s,d=h||(r?20:0),c=this.svgRef.clientHeight;return{x:parseInt(g(t,n||(o?35:0),this.svgRef.clientWidth,0,a),10),y:parseInt(g(e,l,c,d,i),10)}}getMouseCoordX(t,e){const{width:a=600}=this.props;return parseInt(g(e,0,a,0,t),10)+1}getCoordX(t,e,a){const{width:i=600}=this.props;return g(a,t,e,0,i)}getTextBoxX(t,e,a=0){const{width:i=600}=this.props,n=t/i*100>75?t-180:t;return"right"===e?n+20-a+150:n+20-a}getMouseData(t,e,a,n,h,o={autoLimit:!1,padding:0}){const{width:r=600}=this.props,l=parseInt(g(n,0,r,t,e),10)+1;if(!R.a.isObject(a))return null;const d=Object.values(a).reduce((t,e)=>{let{xVal:a}=e,n=i(e,["xVal"]),{xVal:h}=t,o=i(t,["xVal"]);return Math.abs(l-a)<Math.abs(l-h)?s({xVal:a},n):s({xVal:h},o)});if(R.a.isObject(d)){if(!h)return d;return d[h]}}componentDidMount(){const{showValueLeftLine:t,showValueRightLine:e,scrollToRight:a=!1}=this.props;if((t||e)&&this.svgRef.addEventListener("mousemove",this.mouseMove),this.svgContainerRef&&a){this.svgContainerRef.scrollLeft=this.svgContainerRef.scrollLeftMax||this.svgContainerRef.scrollWidth-this.svgContainerRef.clientWidth}}componentWillUnmount(){const{showValueLeftLine:t,showValueRightLine:e}=this.props;(t||e)&&this.svgRef.removeEventListener("mousemove",this.mouseMove)}render(){const{width:e=600,height:a=200,offsetY:i=0,paddingLeft:n=0,paddingRight:h=0,paddingTop:g=0,paddingBottom:f=0,tickCount:u=6,showXTicks:m,showYTicksLeft:x,showYTicksRight:M,xTicks:L,xTicksVal:v,xTicksLink:w,yTicksLeft:j,yTicksLeftVal:$,yTicksLeftPrefix:k,yTicksLeftPostfix:T,yTicksLeftWidth:V,yTicksRight:X,yTicksRightVal:F,yTicksRightPrefix:P,yTicksRightPostfix:W,yTicksRightWidth:C,xMin:D,xMax:z,yMaxLeft:N,yMinLeft:A,yMaxMinLeftRound:B=!0,yMaxRight:S,yMinRight:E,yMaxMinRightRound:Y=!0,rangeMinLeft:I=[],rangeMaxLeft:H=[],rangeMinRight:J=[],rangeMaxRight:U=[],dataLeft:q=[],dataRight:Z=[],legendLeft:G=[],legendRight:K=[],unitLeft:Q=[],unitRight:tt=[],dataFillLeft:et=[],dataFillRight:at=[],avgWindowLeft:it=[],avgWindowRight:nt=[],smoothLeft:st=[],smoothRight:ht=[],hoverValLeft:ot=[],hoverValRight:rt=[],showValueLeftLine:lt=!0,showValueRightLine:gt=!0,lineFromXzero:dt,lineFromXmax:ct,legendFontSize:pt="14px",legendLineHeight:ft=14,hoverFontSize:ut="12px",ticksFontSize:mt="12px",marker:xt,markers:yt=[]}=this.props,{appState:Mt={}}=this.props.stores||{},{mousePos:_t=[],darkmode:Rt}=Mt,Lt=n||(x?35:0),vt=h||(M?20:0),bt=g,Ot=f||(m?20:0),wt=ft,jt=pt,$t=ut,kt=mt,Tt={width:e,height:a,offsetY:i},Vt=d(c({data:q,min:A}),!0),Xt=d(p({data:q,max:N}),!1),Ft=d(c({data:Z,min:E}),!0),Pt=d(p({data:Z,max:S}),!1),Wt=function({data:t,min:e}){const a=t.map(t=>{if(R.a.isArray(t))return R.a.isNumber(e)?Math.min(e,...t.map(t=>t.x)):Math.min(...t.map(t=>t.x))});return Math.min(...a)}({data:q.concat(Z),min:D}),Ct=function({data:t,max:e}){const a=t.map(t=>{if(R.a.isArray(t))return R.a.isNumber(e)?Math.max(e,...t.map(t=>t.x)):Math.max(...t.map(t=>t.x))});return Math.max(...a)}({data:q.concat(Z),max:z}),Dt=y(s(s({},Tt),{},{data:q,xMin:Wt,xMax:Ct,yMin:Vt,yMax:Xt,yRangeMin:I,yRangeMax:H,maxMinFixed:!0,smoothLeft:st,avgWindowLeft:it,offsetY:bt,lineFromXzero:dt,lineFromXmax:ct,yMaxMinRound:B})),zt=y(s(s({},Tt),{},{data:Z,xMin:Wt,xMax:Ct,yMin:Ft,yMax:Pt,yRangeMin:J,yRangeMax:U,maxMinFixed:!0,smoothRight:ht,avgWindowRight:nt,offsetY:bt,lineFromXzero:dt,lineFromXmax:ct,yMaxMinRound:Y})),Nt=Dt.length,At=zt.length,Bt=Nt+At,St=L||o(u,Wt,Ct),Et=j||o(u,Vt,Xt,!0,k,T),Yt=X||o(u,Ft,Pt,!0,P,W),It=this.getCoordX(Wt,Ct,xt);return Object(_.h)("div",{class:b.a.lineChart,style:`height: ${a}px; overflow: hidden;`},Object(_.h)("div",{class:"overflow-auto position-relative w-100 h-100",style:"overflow-y: hidden !important;",ref:t=>this.svgContainerRef=t,onTouchstart:O.a.captureEvents,onTouchend:O.a.captureEvents,onTouchmove:O.a.captureEvents,onScroll:O.a.captureEvents},Object(_.h)("svg",{xmlns:"http://www.w3.org/2000/svg",class:b.a.svg,viewBox:`0 0 ${e} ${a}`,preserveAspectRatio:"none",style:`padding-left: ${Lt}px; padding-right: ${vt}px; padding-bottom: ${Ot}px; width: ${e}px; min-width: 100%; max-height: 100%;`,ref:t=>this.svgRef=t},zt&&zt.reverse().map((e,a)=>{let i;return _t&&_t.length>0&&(i=this.getMouseData(Wt,Ct,e.dataMap,_t[0])),Object(_.h)(t,null,Object(_.h)("path",{d:e.d,class:`${b.a[At>20?"pathOriginal":"pathRight"+(At-a-1)]}\n                                            ${at[At-a-1]?b.a["pathRightFill"+(At-a-1)]:""}`,"fill-rule":"evenodd"}),gt&&_t&&_t.length>0&&e.dataMap&&i&&i.yVal&&Object(_.h)("line",{x1:this.getCoordX(Wt,Ct,Ct),x2:i.x,y1:i.ySmooth,y2:i.ySmooth,class:`${b.a.mouseLine} ${b.a["pathRight"+(At-a-1)]}`}))}),Dt&&Dt.reverse().map((e,a)=>{let i;_t&&_t.length>0&&(i=this.getMouseData(Wt,Ct,e.dataMap,_t[0]));const n=Nt-a-1;let s=b.a["pathLeft"+n],h=b.a[et[n]?b.a["pathLeftFill"+n]:""];return n>9&&(s=b.a.pathOriginal),Object(_.h)(t,null,Object(_.h)("path",{d:e.d,class:`${s} ${h}`,"fill-rule":"evenodd"}),lt&&_t&&_t.length>0&&e.dataMap&&i&&i.yVal&&Object(_.h)("line",{x1:this.getCoordX(Wt,Ct,Wt),x2:i.x,y1:i.ySmooth,y2:i.ySmooth,class:`${b.a.mouseLine} ${b.a["pathLeft"+(Nt-a-1)]}`}))}),_t&&_t.length>0&&Object(_.h)("line",{x1:_t[0],y1:a,x2:_t[0],y2:"0",class:b.a.mouseLine}),It&&Object(_.h)("line",{x1:It,y1:a,x2:It,y2:"0",class:b.a.marker}),yt&&yt.map(t=>{const e=this.getCoordX(Wt,Ct,t);return Object(_.h)("line",{x1:e,y1:a,x2:e,y2:"0",class:b.a.markers})}),(lt||gt)&&Dt&&_t&&_t.length>0&&Object(_.h)("rect",{x:this.getTextBoxX(_t[0],"",10),y:a/2,width:"165",height:15*Bt+25,rx:"5",ry:"5",class:b.a.mouseHoverBox}),(lt||gt)&&_t&&_t.length>0&&Object(_.h)("text",{x:this.getTextBoxX(_t[0]),y:a/2,"font-size":$t,class:Rt?b.a.mouseHoverDarkmode:b.a.mouseHover,style:"border: #ff0000 solid 2px;"},lt&&Dt&&Dt.reverse().map((e,a)=>{const i=R.a.isArray(ot)&&R.a.isFunction(ot[a])?ot[a]:t=>t,n=this.getMouseData(Wt,Ct,e.dataMap,_t[0]);return Object(_.h)(t,null,n&&0===a&&Object(_.h)("tspan",{x:this.getTextBoxX(_t[0]),dy:"1.2em"},r(n.xVal,v)),e.d&&e.dataMap&&R.a.isNumber(n.yVal)&&Object(_.h)("tspan",{x:this.getTextBoxX(_t[0]),dy:"1.2em","text-anchor":"start"},Object(_.h)("tspan",{class:b.a["pathLeft"+a]},"--")," ",G[a],": ",i(n.yVal)," ",Q[a]))}),gt&&zt&&zt.reverse().map((e,a)=>{const i=R.a.isArray(rt)&&R.a.isFunction(rt[a])?rt[a]:t=>t;let n;return _t&&_t.length>0&&(n=this.getMouseData(Wt,Ct,e.dataMap,_t[0])),Object(_.h)(t,null,e.d&&e.dataMap&&R.a.isNumber(n.yVal)&&Object(_.h)("tspan",{x:this.getTextBoxX(_t[0],"right"),dy:"1.2em","text-anchor":"end"},K[a],": ",i(n.yVal)," ",tt[a]," ",Object(_.h)("tspan",{class:b.a["pathRight"+a]},"--")))}))),m&&Object(_.h)("div",{class:""+b.a["x-axis"],style:{left:Lt+"px",bottom:"0px",width:`calc(${e}px - ${Lt}px)`,"font-size":kt}},w?Object(_.h)(t,null,St.map(t=>Object(_.h)("div",{"data-value":r(t,v),class:"position-relative"},Object(_.h)("a",{href:`${w}${t}`,class:"stretched-link"}," ")))):Object(_.h)(t,null,St.map(t=>Object(_.h)("div",{"data-value":r(t,v)}))))),Object(_.h)("div",{class:"position-absolute",style:`top: 0; left: ${Lt+20}px;`},G&&G.map((t,e)=>{let a=b.a["legendLeft"+e];return e>9&&(a=b.a.legendOriginal),Object(_.h)("div",{class:"d-flex align-items-center"},Object(_.h)("span",{class:""+a}),Object(_.h)("small",{class:b.a.pathText,x:"35",y:15+wt*e,"font-size":jt},t))})),Object(_.h)("div",{class:"position-absolute",style:`top: 0; right: ${vt+70}px;`},K&&K.map((t,a)=>Object(_.h)("div",{class:"d-flex align-items-center"},Object(_.h)("span",{class:""+b.a["legendRight"+a],x1:e-150,y1:10+wt*a,x2:e-130,y2:10+wt*a}),Object(_.h)("small",{class:b.a.pathText,x:e-125,y:15+wt*a,"font-size":jt},t)))),x&&Object(_.h)("div",{class:b.a["y-axis-left"],style:{top:bt+"px",bottom:Ot+"px","font-size":kt,width:""+V}},Et.map(t=>Object(_.h)("div",{"data-value":l(t,$)}))),M&&Object(_.h)("div",{class:b.a["y-axis-right"],style:{top:bt+"px",bottom:Ot+"px","font-size":kt,width:""+C}},Yt.map(t=>Object(_.h)("div",{"data-value":l(t,F)}))))}})||M;e.a=j}).call(this,a("hosL").Fragment)}}]);
//# sourceMappingURL=1.chunk.f1768.esm.js.map