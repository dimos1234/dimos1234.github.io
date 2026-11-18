import {wrap} from "./pixel-font.js";
export const ENCOUNTER_LINES=["* Adam Shaltout blocks the way.","* My projects hit harder than my attacks."];
export const hitReactionLines=perfect=>wrap("* "+(perfect?"You have the sudden urge to check his LinkedIn.":"Thats not going on my resume."),43);
export const DEFEAT_LINES=["* Fine. I'll show you my portfolio.","* The skip button was RIGHT THERE.","* Press Z to continue."];
export const BOSS_MAX_HP=100;
export const applyDamage=(hp,damage)=>Math.max(0,hp-damage);
export const arrowsNavigate=mode=>mode==="boot"||mode==="root"||mode==="list";
export function contentPages(entry){if(entry.pages)return entry.pages.map(page=>wrap("* "+page,43));const lines=[...wrap("* "+entry.title,43)];for(const paragraph of entry.paragraphs)lines.push(...wrap("* "+paragraph,43));const pages=[];for(let i=0;i<lines.length;i+=3)pages.push(lines.slice(i,i+3));if(entry.image)pages.push(["* Press Z to view the artwork.","* Press X to go back."]);else if(entry.url)pages.push(["* Press Z to open the project link.","* Press X to go back."]);return pages;}
export const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
export const availableActionCount=(unlocked,hasAttacked)=>unlocked||hasAttacked?4:1;
export function attackPosition(elapsed){const phase=(elapsed/1200)%2;return 60+(phase<=1?phase:2-phase)*520;}
export function attackResult(position){const accuracy=clamp(1-Math.abs(position-320)/260,0,1);return {accuracy,damage:12+Math.round(accuracy*16),perfect:accuracy>=.94};}
export function fitScale(width,height){const available=Math.max(0,Math.min(width/640,height/480));if(available>=1)return Math.floor(available);return available>=.5?.5:available;}

