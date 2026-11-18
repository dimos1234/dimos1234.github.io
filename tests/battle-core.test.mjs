import test from "node:test";
import assert from "node:assert/strict";
import {attackPosition,attackResult,fitScale} from "../battle-core.js";
import {ENCOUNTER_LINES,hitReactionLines,arrowsNavigate,contentPages} from "../battle-core.js";
import {projects,art} from "../content.js";
test("the first attack never misses and keeps bouncing",()=>{
 assert.equal(attackPosition(0),60);assert.equal(attackPosition(1200),580);assert.equal(attackPosition(2400),60);
 for(let ms=0;ms<120000;ms+=17){const x=attackPosition(ms),result=attackResult(x);assert.ok(x>=60&&x<=580);assert.ok(result.damage>=18&&result.damage<=99);}
});
test("closer timing always gives more damage and perfect hits have a reaction",()=>{
 assert.equal(attackResult(320).damage,99);assert.equal(attackResult(320).perfect,true);
 assert.equal(attackResult(60).damage,18);assert.equal(attackResult(580).damage,18);
 let previous=0;for(let x=60;x<=320;x++){const current=attackResult(x).damage;assert.ok(current>=previous);previous=current;}
});
test("640 by 480 is never distorted, using integer desktop scale",()=>{
 assert.equal(fitScale(1280,960),2);assert.equal(fitScale(1000,600),1);assert.equal(fitScale(380,650),.5);
});
test("the encounter opens with the requested quote",()=>{
 assert.deepEqual(ENCOUNTER_LINES,["* Adam Shaltout blocks the way.","* My projects hit harder than my attacks."]);
});
test("normal and perfect reactions include the ACT invitation in the same box",()=>{
 for(const perfect of [false,true]){const lines=hitReactionLines(perfect);assert.equal(lines.length,2);assert.equal(lines[1],"* Take a look around. Choose ACT.");assert.ok(lines.every(line=>line.length<=43));}
});
test("arrows navigate menus but never dialogue or the heart-phase menu",()=>{
 for(const mode of ["detail","dialogue","defense","attack","boot"])assert.equal(arrowsNavigate(mode),false);
 for(const mode of ["root","list"])assert.equal(arrowsNavigate(mode),true);
});
test("every project and artwork action prompt includes its back instruction",()=>{
 for(const entry of [...projects,...art]){const pages=contentPages(entry);assert.equal(pages[0][0],"* "+entry.title);assert.ok(pages.every(page=>page.length<=3&&page.every(line=>line.length<=43)));if(entry.image||entry.url){assert.match(pages.at(-1)[0],/^\* Press Z/);assert.equal(pages.at(-1)[1],"* Press X to go back.");}}
});

