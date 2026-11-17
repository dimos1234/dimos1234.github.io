import test from "node:test";
import assert from "node:assert/strict";
import {attackPosition,attackResult,fitScale} from "../battle-core.js";
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

