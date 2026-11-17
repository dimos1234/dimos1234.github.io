import test from 'node:test';
import assert from 'node:assert/strict';
import {SpritePlayer} from '../sprites.js';
test('idle cycles through all twelve frames indefinitely',()=>{
 const player=new SpritePlayer();const seen=new Set();
 for(let tick=0;tick<240;tick++){player.update(100);seen.add(player.frame);assert.equal(player.name,'idle');}
 assert.equal(seen.size,12);
});
test('every action recovers into a live idle loop',()=>{
 for(const action of ['entrance','hit','perfect']){
  const player=new SpritePlayer();player.sheets[action]=Array(12).fill({});player.play(action);
  player.update(1600);assert.equal(player.name,'idle');const before=player.frame;
  player.update(200);assert.notEqual(player.frame,before);
 }
});
