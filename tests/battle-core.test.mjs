import test from "node:test";
import assert from "node:assert/strict";
import {attackPosition,attackResult,fitScale} from "../battle-core.js";
import {ENCOUNTER_LINES,hitReactionLines,arrowsNavigate,contentPages,DEFEAT_LINES,BOSS_MAX_HP,applyDamage} from "../battle-core.js";
import {projects,art,acts} from "../content.js";
test("the first attack never misses and keeps bouncing",()=>{
 assert.equal(attackPosition(0),60);assert.equal(attackPosition(1200),580);assert.equal(attackPosition(2400),60);
 for(let ms=0;ms<120000;ms+=17){const x=attackPosition(ms),result=attackResult(x);assert.ok(x>=60&&x<=580);assert.ok(result.damage>=12&&result.damage<=28);}
});
test("closer timing always gives more damage and perfect hits have a reaction",()=>{
 assert.equal(attackResult(320).damage,28);assert.equal(attackResult(320).perfect,true);
 assert.equal(attackResult(60).damage,12);assert.equal(attackResult(580).damage,12);
 let previous=0;for(let x=60;x<=320;x++){const current=attackResult(x).damage;assert.ok(current>=previous);previous=current;}
});
test("640 by 480 is never distorted, using integer desktop scale",()=>{
 assert.equal(fitScale(1280,960),2);assert.equal(fitScale(1000,600),1);assert.equal(fitScale(380,650),.5);
 for(const width of [230,288,304]){const scale=fitScale(width,350);assert.equal(640*scale,width);assert.ok(480*scale<=350);}
});
test("the encounter opens with the requested quote",()=>{
 assert.deepEqual(ENCOUNTER_LINES,["* Adam Shaltout blocks the way.","* My projects hit harder than my attacks."]);
});
test("hit reactions are short and leave control instructions to the persistent guide",()=>{
 for(const perfect of [false,true]){const lines=hitReactionLines(perfect);assert.ok(lines.length<=3);assert.ok(lines.every(line=>line.length<=43));assert.ok(!lines.join(' ').includes('Press Z'));}
});
test("arrows navigate menus but never dialogue or the heart-phase menu",()=>{
 for(const mode of ["detail","dialogue","hit","defense","attack","dust","leaving"])assert.equal(arrowsNavigate(mode),false);
 for(const mode of ["boot","root","list"])assert.equal(arrowsNavigate(mode),true);
});
test("the four ACT summaries keep each requested paragraph on its own page",()=>{
 assert.deepEqual(acts.map(entry=>entry.title),["Check Adam","Pulsenics","Projects","Interests"]);
 assert.deepEqual(acts.map(entry=>contentPages(entry).length),[3,2,3,2]);
 for(const entry of acts){const pages=contentPages(entry);pages.forEach((page,i)=>{assert.equal(page.join(' '),'* '+entry.pages[i]);assert.ok(page.length<=3&&page.every(line=>line.length<=43));});}
});
test("Adam survives three perfect hits and can actually be defeated on the fourth",()=>{
 let hp=BOSS_MAX_HP;
 for(let hit=0;hit<3;hit++){hp=applyDamage(hp,attackResult(320).damage);assert.ok(hp>0);}
 assert.equal(applyDamage(hp,attackResult(320).damage),0);
 assert.equal(applyDamage(0,28),0);
});
test("even the weakest timing eventually defeats Adam",()=>{
 let hp=BOSS_MAX_HP,hits=0;while(hp>0&&hits<20){hp=applyDamage(hp,attackResult(60).damage);hits++;}
 assert.equal(hp,0);assert.equal(hits,9);
 assert.ok(DEFEAT_LINES.length<=3&&DEFEAT_LINES.every(line=>line.length<=43));
});
test("every project and artwork action prompt includes its back instruction",()=>{
 for(const entry of [...projects,...art]){const pages=contentPages(entry);assert.equal(pages[0][0],"* "+entry.title);assert.ok(pages.every(page=>page.length<=3&&page.every(line=>line.length<=43)));if(entry.image||entry.url){assert.match(pages.at(-1)[0],/^\* Press Z/);assert.equal(pages.at(-1)[1],"* Press X to go back.");}}
});

