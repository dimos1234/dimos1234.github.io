import test from 'node:test';
import assert from 'node:assert/strict';
import {SpritePlayer} from '../sprites.js';
test('idle cycles through all twelve frames indefinitely',()=>{
 const player=new SpritePlayer();const seen=new Set();
 for(let tick=0;tick<240;tick++){player.update(100);seen.add(player.frame);assert.equal(player.name,'idle');}
 assert.equal(seen.size,12);
});
test('defeat poses wait and the dust animation stays gone instead of returning to idle',()=>{
 const player=new SpritePlayer();player.sheets.death=Array(12).fill({});
 player.play('defeat');player.update(10000);assert.equal(player.name,'defeat');assert.equal(player.frame,4);
 player.play('death');assert.equal(player.frame,5);const seen=new Set();
 for(let tick=0;tick<40;tick++){player.update(100);seen.add(player.frame);assert.equal(player.name,'death');}
 assert.deepEqual([...seen],[5,6,7,8,9,10,11]);
 player.update(10000);assert.equal(player.frame,11);assert.equal(player.name,'death');
});
test('every action recovers into a live idle loop',()=>{
 for(const action of ['entrance','hit','perfect']){
  const player=new SpritePlayer();player.sheets[action]=Array(12).fill({});player.play(action);
  player.update(1600);assert.equal(player.name,'idle');const before=player.frame;
  player.update(200);assert.notEqual(player.frame,before);
 }
});
