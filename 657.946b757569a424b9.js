"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[657],{657:(L,h,u)=>{u.r(h),u.d(h,{PcgSeApiModule:()=>b,PcgSeModule:()=>P,PcgSePokemonComponent:()=>I,PcgSeSoundAlert:()=>C,PcgSeSoundAlertComponent:()=>v,PcgSeSoundAlertGeneration:()=>r,PcgSeSoundAlertType:()=>d,PcgSeTimerComponent:()=>y});var i=u(946),f=u(814),w=u(592),T=u(829);const{isArray:k}=Array;var M=u(232),S=u(251),V=u(564);function g(...e){const s=(0,V.jO)(e),t=function A(e){return 1===e.length&&k(e[0])?e[0]:e}(e);return t.length?new w.y(n=>{let o=t.map(()=>[]),l=t.map(()=>!1);n.add(()=>{o=l=null});for(let a=0;!n.closed&&a<t.length;a++)(0,T.Xf)(t[a]).subscribe((0,S.x)(n,X=>{if(o[a].push(X),o.every(p=>p.length)){const p=o.map(m=>m.shift());n.next(s?s(...p):p),o.some((m,z)=>!m.length&&l[z])&&n.complete()}},()=>{l[a]=!0,!o[a].length&&n.complete()}));return()=>{o=l=null}}):M.E}var c=u(225);const B=["pcg-se-timer",""],D=["pcg-se-pokemon",""],W=["pcg-se-sound-alert",""];let y=(()=>{class e{ngOnInit(){window.location.replace("https://poketwitch.bframework.de/info/events/spawn_cooldown/")}}return e.\u0275fac=function(t){return new(t||e)},e.\u0275cmp=i.Xpm({type:e,selectors:[["","pcg-se-timer",""]],attrs:B,decls:0,vars:0,template:function(t,n){},encapsulation:2}),e})(),I=(()=>{class e{constructor(t){this.route=t}ngOnInit(){g([this.route.queryParamMap,this.route.data]).subscribe(([t,n])=>{const o=new URLSearchParams;t.keys.forEach(l=>{o.append(l,t.get(l))}),"show"===n.event&&"current"===n.target&&window.location.replace(`https://poketwitch.bframework.de/info/events/show_current_pokemon/?${o.toString()}`)})}}return e.\u0275fac=function(t){return new(t||e)(i.Y36(c.gz))},e.\u0275cmp=i.Xpm({type:e,selectors:[["","pcg-se-pokemon",""]],attrs:D,decls:0,vars:0,template:function(t,n){},encapsulation:2}),e})();var r=function(e){return e[e.I=1]="I",e[e.II=2]="II",e[e.III=3]="III",e[e.IV=4]="IV",e[e.V=5]="V",e[e.VI=6]="VI",e[e.VII=7]="VII",e[e.VIII=8]="VIII",e[e.IX=9]="IX",e}(r||{}),d=function(e){return e.BattleWild="wild_battle",e}(d||{});class C{constructor(s,t,n,o,l){this.generation=s,this.type=t,this.trackId=n,this.trackDuration=o,this.trackDelay=l}}let v=(()=>{class e{get soundCloudPlayerIFrame(){return document.querySelector("iframe")}get soundCloudPlayer(){return this.soundCloudPlayerWidget||(this.soundCloudPlayerWidget=window.SC.Widget(this.soundCloudPlayerIFrame)),this.soundCloudPlayerWidget}constructor(t){this.route=t,this.debug=!1,this.pcgBaseUrl="https://poketwitch.bframework.de",this.soundCloudPlayerBaseUrl="https://w.soundcloud.com/player",this.soundCloudApiBaseUrl="https://api.soundcloud.com"}ngOnInit(){this.loadSoundCloudPlayer()}getEnumByValue(t,n){return Object.keys(t).filter(o=>"number"==typeof t[o]&&t[o]===n).map(o=>t[o])[0]}ngAfterContentInit(){g([this.route.data,this.route.queryParams]).subscribe(([t,n])=>{const o={...t,...n};this.debug="true"===o.debug,this.debug&&console.log(o),"true"!==o.player&&(this.soundCloudPlayerIFrame.style.display="none"),this.soundAlert=this.getSoundAlert(this.getSoundAlertGeneration(o.gen),this.getSoundAlertType(o.type),o.duration,o.delay),this.debug&&console.log(this.soundAlert),setTimeout(()=>{this.soundCloudPlayer.load(this.getSoundCloudPlayerTrackUrl(this.soundAlert.trackId)),this.simulateTimerMainLoop()},1e3)})}getSoundAlert(t,n,o,l){const a=this.getSoundCloudPlayerTrack(t,n,o);return new C(t,n,a.id,a.duration,l)}getSoundAlertGeneration(t){switch(t.toLowerCase()){default:case"i":return r.I;case"ii":return r.II;case"iii":return r.III;case"iv":return r.IV;case"v":return r.V;case"Vi":return r.VI;case"vii":return r.VII;case"viii":return r.VIII;case"ix":return r.IX}}getSoundAlertType(t){return t.toLowerCase(),d.BattleWild}getSoundCloudPlayerTrack(t,n,o){if(t===r.I){if(n===d.BattleWild)return{id:"1235778460",duration:o||4400}}else if(t===r.IV){if(n===d.BattleWild)return{id:"631141938",duration:o||4800}}else if(t===r.V){if(n===d.BattleWild)return{id:"1235709346",duration:o||5e3}}else if(t===r.IX&&n===d.BattleWild)return{id:"1380417496",duration:o||3500};return{id:"1235778460",duration:o||4400}}getSoundCloudPlayerTrackUrl(t){return`${this.soundCloudApiBaseUrl}/tracks/${this.soundAlert.trackId}`}loadSoundCloudPlayer(){const t=document.createElement("script");t.src=`${this.soundCloudPlayerBaseUrl}/api.js`,document.body.appendChild(t)}simulateTimerSoundAlert(){console.log("[simulateAlert]","will start in "+this.soundAlert.trackDelay||0),setTimeout(()=>{this.debug&&console.log("[simulateAlert]","play"),setTimeout(()=>{this.soundCloudPlayer.pause()},this.soundAlert.trackDuration),this.soundCloudPlayer.seekTo(0),this.soundCloudPlayer.play()},this.soundAlert.trackDelay||0)}simulateTimerMainLoop(){this.debug?this.simulateTimerCooldownWait(10):fetch(`${this.pcgBaseUrl}/info/events/last_spawn/`).then(t=>t.json()).then(t=>{this.simulateTimerCooldownWait(t.next_spawn)})}simulateTimerCooldownWait(t){t-=1,this.debug&&console.log("[simulateTimer]",t),"0"==t.toString()&&this.simulateTimerSoundAlert(),t>0?setTimeout(()=>{this.simulateTimerCooldownWait(t)},1e3):setTimeout(()=>{this.simulateTimerMainLoop()},2e3)}}return e.\u0275fac=function(t){return new(t||e)(i.Y36(c.gz))},e.\u0275cmp=i.Xpm({type:e,selectors:[["","pcg-se-sound-alert",""]],attrs:W,decls:1,vars:0,consts:[["width","100%","height","100","src","https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1328551417&auto_play=true"]],template:function(t,n){1&t&&i._UZ(0,"iframe",0)},encapsulation:2}),e})(),P=(()=>{class e{}return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=i.oAB({type:e}),e.\u0275inj=i.cJS({imports:[f.ez]}),e})();const F=[{path:"info",children:[{path:"events",children:[{path:"show_current_pokemon",component:I,data:{event:"show",target:"current"}},{path:"spawn_cooldown",component:y},{path:"spawn_alert",component:v,data:{gen:"i",type:"wild_battle",delay:3e3}}]}]}];let U=(()=>{class e{}return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=i.oAB({type:e}),e.\u0275inj=i.cJS({imports:[c.Bz.forChild(F),c.Bz]}),e})(),b=(()=>{class e{}return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=i.oAB({type:e}),e.\u0275inj=i.cJS({imports:[P,U,f.ez]}),e})()}}]);