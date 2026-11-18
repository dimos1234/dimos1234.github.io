import {wrap} from "./pixel-font.js";
export const ENCOUNTER_LINES=["* Adam Shaltout blocks the way.","* My projects hit harder than my attacks."];
export const hitReactionLines=perfect=>[perfect?"* Even his hat is impressed.":"* Adam claims that was intentional.","* Take a look around. Choose ACT."];
export const arrowsNavigate=mode=>mode==="root"||mode==="list";
export function contentPages(entry){const lines=[...wrap("* "+entry.title,43)];for(const paragraph of entry.paragraphs)lines.push(...wrap("* "+paragraph,43));const pages=[];for(let i=0;i<lines.length;i+=3)pages.push(lines.slice(i,i+3));if(entry.image)pages.push(["* Press Z to view the artwork.","* Press X to go back."]);else if(entry.url)pages.push(["* Press Z to open the project link.","* Press X to go back."]);return pages;}
export const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
export const availableActionCount=(unlocked,hasAttacked)=>unlocked||hasAttacked?4:1;
export function attackPosition(elapsed){const phase=(elapsed/1200)%2;return 60+(phase<=1?phase:2-phase)*520;}
export function attackResult(position){const accuracy=clamp(1-Math.abs(position-320)/260,0,1);return {accuracy,damage:18+Math.round(accuracy*81),perfect:accuracy>=.94};}
export function fitScale(width,height){const available=Math.min(width/640,height/480);if(available>=1)return Math.max(1,Math.floor(available));return available>=.5?.5:Math.max(.25,Math.floor(available*4)/4);}

