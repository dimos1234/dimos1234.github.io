import {text,center} from "./pixel-font.js";
import {SpritePlayer} from "./sprites.js";
import {BattleAudio} from "./audio.js?v=20261117-flow2";
import {profile,collections,experience,projects,games,art,life} from "./content.js";
import {clamp,attackPosition,attackResult,fitScale,availableActionCount,ENCOUNTER_LINES,hitReactionLines,arrowsNavigate,contentPages} from "./battle-core.js?v=20261117-flow2";

const canvas=document.getElementById("battle"), ctx=canvas.getContext("2d");
const status=document.getElementById("status"), accessible=document.getElementById("accessible-menu");
const reader=document.getElementById("reader");
const sprites=new SpritePlayer(),audio=new BattleAudio(),held=new Set();
const labels=["FIGHT","ACT","ITEM","MERCY"];
const actionX=[32,185,345,500];
const heartRows=["01100110","11111111","11111111","11111111","01111110","00111100","00011000","00000000"];
const stack=[];
const state={mode:"loading",age:0,total:0,root:0,index:0,title:"",options:[],page:0,pages:[],entry:null,listKey:null,unlocked:false,hasAttacked:false,damage:0,perfect:false,hp:20,bossHp:100,hitAge:Infinity,heart:{x:312,y:308},invulnerable:0,reveal:false};
let ready=false,last=null,hitAreas=[],lastAnnouncement="",lastTypeCount=0;
let rootLines=[...ENCOUNTER_LINES];

function announce(message){if(message!==lastAnnouncement){status.textContent=message;lastAnnouncement=message;}}
function mirror(){
 accessible.replaceChildren();
 const add=(label,action,rect={x:32,y:250,w:576,h:135})=>{const b=document.createElement("button");b.type="button";b.textContent=label;b.style.left=rect.x/640*100+"%";b.style.top=rect.y/480*100+"%";b.style.width=rect.w/640*100+"%";b.style.height=rect.h/480*100+"%";b.addEventListener("click",()=>{audio.activate();action();});accessible.append(b);};
 if(state.mode==="boot")add("Begin encounter",begin,{x:0,y:0,w:640,h:480});
 else if(state.mode==="root")labels.slice(0,availableActionCount(state.unlocked,state.hasAttacked)).forEach((label,i)=>add(label,()=>{state.root=i;rootAction();},{x:actionX[i],y:432,w:110,h:42}));
 else if(state.mode==="target")add("Adam Shaltout",startAttack);
 else if(state.mode==="attack")add("Strike now",strike);
 else if(state.mode==="list"){const first=Math.floor(state.index/6)*6;state.options.slice(first,first+6).forEach((option,slot)=>add(option.label,()=>{state.index=first+slot;option.action();},{x:44+(slot%2)*280,y:271+Math.floor(slot/2)*32,w:270,h:31}));}
 else if(state.mode==="detail"){const prompt=state.page===state.pages.length-1&&(state.entry.image||state.entry.url);add("Next page or open project",confirm,{x:44,y:263,w:552,h:prompt?34:96});add("Back",back,prompt?{x:44,y:299,w:552,h:32}:{x:44,y:360,w:100,h:22});}
 else if(state.mode==="dialogue"){add("Continue",confirm);}
}
function mode(name){state.mode=name;canvas.dataset.mode=name;audio.setEffectsMuted(name==="defense");state.age=0;state.reveal=false;lastTypeCount=0;mirror();}
function capture(){return {mode:state.mode,root:state.root,index:state.index,title:state.title,options:state.options,page:state.page,pages:state.pages,entry:state.entry,listKey:state.listKey};}
function restore(snapshot){Object.assign(state,snapshot);canvas.dataset.mode=state.mode;audio.setEffectsMuted(state.mode==="defense");state.age=0;state.reveal=true;mirror();announce(state.mode==="list"?state.title+". "+state.options[state.index]?.label:rootLines.join(" "));}
function list(title,options,{key=null,push=true,index=0}={}){if(push)stack.push(capture());state.title=title;state.options=options;state.index=index;state.listKey=key;mode("list");announce(title+". "+options.map(o=>o.label).join(", "));}
function root(lines){if(lines)rootLines=lines;mode("root");announce(rootLines.join(" ")+(availableActionCount(state.unlocked,state.hasAttacked)===1?" Choose FIGHT.":" Use FIGHT, ACT, ITEM or MERCY."));}
function begin(){if(!ready)return;audio.resetMusic();stack.length=0;state.unlocked=false;state.hasAttacked=false;state.hp=20;state.bossHp=100;state.hitAge=Infinity;state.root=0;state.damage=0;sprites.play("entrance");root([...ENCOUNTER_LINES]);audio.play("start");}
function openCollection(key){const entries=collections[key];if(!entries)return;list({projects:"TECHNICAL PROJECTS",experience:"ENGINEERING EXPERIENCE",games:"GAMES & DEVLOGS",art:"ART & SPRITES",life:"BEYOND THE SCREEN"}[key],entries.map((entry,index)=>({label:entry.title==="AI/ML Engineering Intern"?"AI/ML Intern":entry.title,action:()=>detail(entry)})),{key});}
function actMenu(){list("ACT / ADAM SHALTOUT",[
 {label:"Check Adam",action:()=>detail({title:"Adam Shaltout",stack:"Software engineer / Creator",paragraphs:[profile.intro,"Currently back at university after completing an Applied AI/ML Engineering internship at Pulsenics in August 2026."]})},
 {label:"Projects",action:()=>openCollection("projects")},
 {label:"Experience",action:()=>openCollection("experience")},
 {label:"Games & Devlogs",action:()=>openCollection("games")},
 {label:"Art & Sprites",action:()=>openCollection("art")},
 {label:"Beyond the Screen",action:()=>openCollection("life")}
 ]);}
function itemMenu(){list("ITEM",[
 {label:"Resume",action:()=>openReader("Resume",{experience,projects})},
 {label:"GitHub",action:()=>openLink(profile.github)},
 {label:"LinkedIn",action:()=>openLink(profile.linkedin)},
 {label:"Email",action:()=>openLink(profile.email)}
 ]);}
function mercyMenu(){list("MERCY",[
 {label:"Spare",action:()=>{state.unlocked=true;stack.length=0;state.root=1;root(["* You spare Adam.","* He offers you a tour. Choose ACT."]);}},
 {label:"Read Portfolio",action:()=>openReader()},
 {label:"Replay Encounter",action:begin}
 ]);}
function rootAction(){
 if(availableActionCount(state.unlocked,state.hasAttacked)===1)state.root=0;
 audio.play("confirm");
 if(state.root===0){stack.push(capture());mode("target");announce("Adam Shaltout");}
 if(state.root===1)actMenu();
 if(state.root===2)itemMenu();
 if(state.root===3)mercyMenu();
}
function startAttack(){audio.play("confirm");mode("attack");announce("The attack indicator bounces indefinitely. Press Z to strike. Every hit lands.");}
function strike(){const first=!state.unlocked;const result=attackResult(attackPosition(state.age));Object.assign(state,result);state.hasAttacked=true;state.bossHp=Math.max(1,state.bossHp-result.damage);state.hitAge=0;state.strikeX=attackPosition(state.age);sprites.play(result.perfect?"perfect":"hit");audio.startMusic();audio.play(result.perfect?"perfect":"strike");if(first)startDefense();else finishAttack();}
function startDefense(){state.heart={x:312,y:308};state.invulnerable=0;mode("defense");announce("Move your heart with the arrow keys for six seconds.");}
function finishAttack(){state.unlocked=true;try{sessionStorage.setItem("adam-encounter-complete","1");}catch{}stack.length=0;state.root=1;root(hitReactionLines(state.perfect));}
function dialogue(lines,done){state.lines=lines;state.done=done;mode("dialogue");announce(lines.join(" "));}
function detail(entry){stack.push(capture());state.entry=entry;state.title=entry.title;state.page=0;state.pages=contentPages(entry);mode("detail");announce(state.pages[0].join(" "));}
function back(){if(state.mode==="attack"||state.mode==="defense"||state.mode==="boot")return;audio.play("cancel");if(stack.length)restore(stack.pop());else root();}
function openLink(url){window.open(url,"_blank","noopener,noreferrer");}
function pageText(){return state.mode==="detail"?state.pages[state.page]:state.mode==="dialogue"?state.lines:rootLines;}
function fullyTyped(){return state.reveal||state.age>=pageText().join("").length*17;}
function confirm(){
 if(!["boot","attack","root","target"].includes(state.mode))audio.play("confirm");
 if(state.mode==="boot"){begin();return;}
 if(state.mode==="root"){rootAction();return;}
 if(state.mode==="target"){startAttack();return;}
 if(state.mode==="attack"){strike();return;}
 if(state.mode==="list"){state.options[state.index]?.action();return;}
 if(state.mode==="dialogue"){if(!fullyTyped()){state.reveal=true;return;}state.done?.();return;}
 if(state.mode==="detail"){if(!fullyTyped()){state.reveal=true;return;}if(state.page<state.pages.length-1){state.page++;state.age=0;state.reveal=false;lastTypeCount=0;mirror();announce(state.pages[state.page].join(" "));}else if(state.entry.image)openReader(state.entry.title,null,state.entry);else if(state.entry.url)openLink(state.entry.url);else back();return;}
}
function input(key,repeat=false){
 audio.activate();
 if(key==="m"){if(!repeat)toggleSound();return;}
 if(reader.open){if(key==="x"||key==="Escape"){reader.close();canvas.focus();}return;}
 if(state.mode==="defense")return;
 if(key==="z"||key==="Enter"){if(!repeat)confirm();return;}
 if(key==="x"||key==="Escape"){if(state.mode==="dialogue"&&!fullyTyped())state.reveal=true;else back();return;}
 if(!key.startsWith("Arrow")||!arrowsNavigate(state.mode))return;
 if(state.mode==="root"){if(!fullyTyped())return;const delta=key==="ArrowLeft"||key==="ArrowUp"?-1:1;const count=availableActionCount(state.unlocked,state.hasAttacked),next=(state.root+delta+count)%count;if(next!==state.root)audio.play("move");state.root=next;announce(labels[state.root]);}
 if(state.mode==="list"){const delta=key==="ArrowLeft"?-1:key==="ArrowRight"?1:key==="ArrowUp"?-2:2;const next=(state.index+delta+state.options.length)%state.options.length;if(next!==state.index)audio.play("move");state.index=next;mirror();announce(state.options[state.index].label);}
}
function addText(parent,tag,value,className){const element=document.createElement(tag);element.textContent=value;if(className)element.className=className;parent.append(element);return element;}
function openReader(title="Adam Shaltout",groups=null,single=null){
 document.getElementById("reader-title").textContent=title;
 const container=document.getElementById("reader-content");container.replaceChildren();
 if(!single)addText(container,"p",profile.intro);
 const sections=single?{Artwork:[single]}:groups||{"Engineering Experience":experience,"Technical Projects":projects,"Games & Devlogs":games,"Art & Sprites":art,"Beyond the Screen":life};
 for(const [heading,entries] of Object.entries(sections)){
  addText(container,"h3",heading);
  for(const entry of entries){const article=document.createElement("article");container.append(article);addText(article,"h3",entry.fullTitle||entry.title);addText(article,"h4",entry.stack||"");if(entry.tag)addText(article,"p",entry.tag,"meta");entry.paragraphs.forEach(p=>addText(article,"p",p));if(entry.image){const image=document.createElement("img");image.src=entry.image;image.alt=entry.title;image.className="reader-image";article.append(image);}if(entry.url){const link=addText(article,"a","[ Open project ]");link.href=entry.url;link.target="_blank";link.rel="noopener noreferrer";}}
 }
 const contact=addText(container,"div","","contact-links");addText(contact,"span","Get in touch:");for(const [label,url] of [["Email",profile.email],["GitHub",profile.github],["LinkedIn",profile.linkedin]]){const a=addText(contact,"a",label);a.href=url;if(!url.startsWith("mailto:")){a.target="_blank";a.rel="noopener noreferrer";}}
 reader.showModal();
}
function box(x=32,y=250,w=576,h=135){ctx.fillStyle="#fff";ctx.fillRect(x,y,w,h);ctx.fillStyle="#000";ctx.fillRect(x+5,y+5,w-10,h-10);}
function heart(x,y,color="#f00",size=2){ctx.fillStyle=color;heartRows.forEach((row,iy)=>{for(let ix=0;ix<8;ix++)if(row[ix]==="1")ctx.fillRect(Math.round(x)+ix*size,Math.round(y)+iy*size,size,size);});}
function enemyHud(){text(ctx,"LV 20",226,232,{sx:1,sy:1});text(ctx,"HP",274,232,{sx:1,sy:1});ctx.fillStyle="#601111";ctx.fillRect(292,231,92,8);ctx.fillStyle="#33ff33";ctx.fillRect(292,231,Math.round(92*state.bossHp/100),8);text(ctx,state.bossHp+"/100",392,232,{sx:1,sy:1});}
function hitEffect(){if(state.hitAge>=900)return;const rise=Math.min(20,Math.floor(state.hitAge/45));text(ctx,String(state.damage),304,102-rise,{sx:3,sy:4,color:state.perfect?"#ffff00":"#f44"});if(state.hitAge<120){ctx.fillStyle="#fff";for(let s=0;s<13;s++)ctx.fillRect(295+s*3,70+s*8,5,10);}}
function lines(values,{typed=true}={}){const count=Math.min(values.join("").length,Math.floor(state.age/17));if(typed&&!state.reveal&&count>lastTypeCount)audio.play("text");lastTypeCount=count;let remaining=state.reveal||!typed?Infinity:count;for(let i=0;i<Math.min(values.length,3);i++){const value=values[i];text(ctx,value.slice(0,Math.max(0,remaining)),54,272+i*30);remaining-=value.length;}}
function actionIcon(i,x,y,color){ctx.fillStyle=color;if(i===0){for(let n=0;n<9;n++)ctx.fillRect(x+12-n,y+n*2,3,4);ctx.fillRect(x+1,y+13,14,2);}else if(i===1){ctx.fillRect(x+1,y+7,3,5);ctx.fillRect(x+6,y+3,3,13);ctx.fillRect(x+11,y,3,19);}else if(i===2){ctx.fillRect(x+4,y+3,10,15);ctx.fillStyle="#000";ctx.fillRect(x+7,y+7,4,7);ctx.fillStyle=color;ctx.fillRect(x+3,y,4,3);}else{ctx.fillRect(x+3,y,2,20);ctx.fillRect(x+9,y,2,20);ctx.fillRect(x,y+5,14,2);}}
function drawActions(){for(let i=0;i<availableActionCount(state.unlocked,state.hasAttacked);i++){const selected=state.root===i;const color=selected?"#ffff00":"#ff8000";const x=actionX[i];ctx.fillStyle=color;ctx.fillRect(x,432,110,42);ctx.fillStyle="#000";ctx.fillRect(x+2,434,106,38);if(selected&&state.mode==="root")heart(x+7,446);else actionIcon(i,x+8,442,color);text(ctx,labels[i],x+28,440,{sx:2,sy:4,color});hitAreas.push({x,y:432,w:110,h:42,action:()=>{if(!["root","list","detail","target"].includes(state.mode))return;stack.length=0;state.root=i;root();rootAction();}});}}
function hud(){text(ctx,"VISITOR",32,402,{sx:2,sy:2});text(ctx,"LV 1",166,402,{sx:2,sy:2});text(ctx,"HP",285,403,{sx:1,sy:2});ctx.fillStyle="#f00";ctx.fillRect(313,399,40,20);ctx.fillStyle="#ff0";ctx.fillRect(313,399,Math.round(40*state.hp/20),20);text(ctx,String(state.hp).padStart(2,"0")+" / 20",366,402,{sx:2,sy:2});}
function drawList(){
 const first=Math.floor(state.index/6)*6;
 state.options.slice(first,first+6).forEach((option,slot)=>{const x=68+(slot%2)*280,y=274+Math.floor(slot/2)*32;const selected=first+slot===state.index;if(selected)heart(x-24,y+3);else text(ctx,"*",x-20,y,{sx:2,sy:3});text(ctx,option.label,x,y,{sx:2,sy:3,color:selected?"#ffff00":"#fff"});hitAreas.push({x:x-24,y:y-3,w:272,h:31,action:()=>{state.index=first+slot;option.action();}});});
 if(state.options.length>6)text(ctx,"PAGE "+(Math.floor(state.index/6)+1)+"/"+Math.ceil(state.options.length/6),516,369,{sx:1,sy:1,color:"#aaa"});
}
function drawGauge(){const y=317;for(let x=52;x<=588;x+=4){const n=(x-320)/270;const h=Math.round(Math.sqrt(Math.max(0,1-n*n))*52/2)*2;ctx.fillStyle="#99b824";ctx.fillRect(x,y-h,4,2);ctx.fillRect(x,y+h,4,2);}for(const [x,color] of [[110,"#f22"],[206,"#ff0"],[300,"#7fff24"],[330,"#7fff24"],[418,"#ff0"],[518,"#f22"]]){ctx.fillStyle=color;ctx.fillRect(x,279,8,78);}ctx.fillStyle="#7fff24";ctx.fillRect(310,268,20,98);ctx.fillStyle="#000";ctx.fillRect(316,273,8,88);for(let x=96;x<558;x+=24){ctx.fillStyle=Math.abs(x-320)<130?"#ff0":"#a11";for(let yy=293;yy<352;yy+=18)ctx.fillRect(x,yy,8,2);}const pointer=attackPosition(state.age);ctx.fillStyle="#000";ctx.fillRect(Math.round(pointer)-5,258,12,120);ctx.fillStyle="#fff";ctx.fillRect(Math.round(pointer)-2,258,5,120);}
function defenseBullets(){const age=state.age;const bullets=[];for(let i=0;i<9;i++){const x=253+i*15,y=255+((age*.065+i*26)%120);bullets.push({x,y});}return bullets;}
function drawDefense(){box(238,250,164,135);for(const b of defenseBullets()){ctx.fillStyle="#fff";ctx.fillRect(b.x,b.y,5,5);}if(state.invulnerable<=0||Math.floor(state.total/80)%2===0)heart(state.heart.x,state.heart.y);}
function drawIntro(){
 if(state.mode==="loading"){center(ctx,"LOADING ENCOUNTER...",222,{sx:2,sy:3});return;}
 heart(312,105);center(ctx,"AN UNEXPECTED",178,{sx:3,sy:3});center(ctx,"ENCOUNTER",212,{sx:4,sy:4});center(ctx,"ADAM SHALTOUT",278,{sx:2,sy:2,color:"#aaa"});
 if(Math.floor(state.total/650)%2===0)center(ctx,"[ Z ] BEGIN",345,{sx:2,sy:3,color:"#ffff00"});
 hitAreas.push({x:0,y:0,w:640,h:480,action:begin});
}
function render(){
 ctx.imageSmoothingEnabled=false;ctx.fillStyle="#000";ctx.fillRect(0,0,640,480);hitAreas=[];
 if(["loading","boot"].includes(state.mode))drawIntro();
 else{
  sprites.draw(ctx,{y:0});enemyHud();
  if(state.mode==="defense")drawDefense();
  else{
   box();
   if(state.mode==="root")lines(rootLines);
   if(state.mode==="list")drawList();
   if(state.mode==="target"){heart(49,278);text(ctx,"Adam Shaltout",74,275);hitAreas.push({x:40,y:265,w:540,h:100,action:startAttack});}
   if(state.mode==="attack")drawGauge();
   if(state.mode==="detail"){lines(state.pages[state.page]);text(ctx,(state.page+1)+"/"+state.pages.length,560,369,{sx:1,sy:1,color:"#aaa"});hitAreas.push({x:44,y:263,w:552,h:96,action:confirm});}
   if(state.mode==="dialogue")lines(state.lines);
  }
  hitEffect();hud();drawActions();
 }
 canvas.dataset.mode=state.mode;canvas.dataset.animation=sprites.name;canvas.dataset.frame=String(sprites.frame);canvas.dataset.damage=String(state.damage);canvas.dataset.unlocked=String(state.unlocked);canvas.dataset.selection=String(state.index);canvas.dataset.page=String(state.page);canvas.dataset.list=state.listKey||"";canvas.dataset.root=String(state.root);canvas.dataset.bossLevel="20";canvas.dataset.bossHp=String(state.bossHp);
}
function update(dt){
 state.total+=dt;state.age+=dt;state.hitAge+=dt;sprites.update(dt);
 if(state.mode==="defense"){
  const rate=dt*.18,dx=(held.has("ArrowRight")?1:0)-(held.has("ArrowLeft")?1:0),dy=(held.has("ArrowDown")?1:0)-(held.has("ArrowUp")?1:0);
  const length=Math.hypot(dx,dy)||1;state.heart.x=clamp(state.heart.x+dx/length*rate,245,379);state.heart.y=clamp(state.heart.y+dy/length*rate,257,362);state.invulnerable-=dt;
  for(const b of defenseBullets())if(state.invulnerable<=0&&Math.abs(b.x-(state.heart.x+8))<8&&Math.abs(b.y-(state.heart.y+7))<8){state.hp=Math.max(1,state.hp-1);state.invulnerable=550;}
  if(state.age>6000)finishAttack();
 }
}
function tick(now){const dt=last===null?0:Math.min(60,now-last);last=now;if(!document.hidden&&!reader.open)update(dt);render();requestAnimationFrame(tick);}
function resize(){const touch=matchMedia("(max-width:639px),(pointer:coarse)").matches;const scale=fitScale(innerWidth-16,innerHeight-(touch?210:120));document.documentElement.style.setProperty("--game-scale",scale);}
function pointer(event){const rect=canvas.getBoundingClientRect();const x=(event.clientX-rect.left)*640/rect.width,y=(event.clientY-rect.top)*480/rect.height;audio.activate();canvas.focus();if(state.mode==="attack"&&y<420){strike();return;}const hit=hitAreas.find(area=>x>=area.x&&x<=area.x+area.w&&y>=area.y&&y<=area.y+area.h);if(hit)hit.action();}
canvas.addEventListener("pointerdown",pointer);
document.addEventListener("keydown",event=>{if(event.target.closest("input,textarea,select"))return;const k=event.key.length===1?event.key.toLowerCase():event.key;if(k==="Enter"&&event.target.closest("button,a,summary"))return;if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","z","x","m","Enter","Escape"].includes(k)){event.preventDefault();held.add(k);input(k,event.repeat);}});
document.addEventListener("keyup",event=>held.delete(event.key));
window.addEventListener("blur",()=>held.clear());document.addEventListener("visibilitychange",()=>{last=null;held.clear();});window.addEventListener("resize",resize);
document.querySelectorAll("[data-key]").forEach(button=>{button.addEventListener("pointerdown",event=>{event.preventDefault();const k=button.dataset.key;held.add(k);button.setPointerCapture(event.pointerId);input(k);});for(const event of ["pointerup","pointercancel","lostpointercapture"])button.addEventListener(event,()=>held.delete(button.dataset.key));});
document.getElementById("quick").addEventListener("click",()=>openReader());
document.getElementById("reader-close").addEventListener("click",()=>{reader.close();canvas.focus();});
function toggleSound(){const enabled=audio.toggle();const button=document.getElementById("sound");button.textContent="SOUND: "+(enabled?"ON":"OFF")+" [M]";button.setAttribute("aria-pressed",String(enabled));audio.play("confirm");announce("Sound "+(enabled?"on":"muted")+". Press M to toggle.");}
document.getElementById("sound").addEventListener("click",toggleSound);
document.getElementById("retry").addEventListener("click",()=>location.reload());
document.getElementById("fallback").addEventListener("click",()=>openReader());
reader.addEventListener("close",()=>canvas.focus());
resize();requestAnimationFrame(tick);
try{await sprites.load();ready=true;const direct=document.body.dataset.start||({"#engineering":"experience","#projects":"projects","#games":"games","#art":"art"})[location.hash];if(direct){state.unlocked=true;root();openCollection(direct);}else{let seen=false;try{seen=sessionStorage.getItem("adam-encounter-complete")==="1";}catch{}if(seen&&!new URLSearchParams(location.search).has("intro")){state.unlocked=true;state.root=1;root(["* Welcome back.","* Choose ACT to continue exploring."]);}else{mode("boot");announce("An unexpected encounter. Press Z to begin.");}}}catch(error){console.error("Sprite loading failed",error);document.getElementById("load-error").hidden=false;announce("Sprite loading failed. The readable portfolio is available below.");}
