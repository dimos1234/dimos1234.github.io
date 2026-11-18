import test from "node:test";
import assert from "node:assert/strict";
import {BattleAudio,SOUND_FILES,MIX} from "../audio.js";
import {availableActionCount} from "../battle-core.js";
class Music extends EventTarget{
 constructor(){super();this.dataset={};this.paused=true;this.currentTime=0;this.calls=0;}
 play(){this.calls++;this.paused=false;this.dispatchEvent(new Event("playing"));return Promise.resolve();}
 pause(){this.paused=true;this.dispatchEvent(new Event("pause"));}
}
function setup(){
 const music=new Music(),sources=[];
 const context={state:"running",currentTime:1,destination:{},resume:()=>Promise.resolve(),createGain:()=>({gain:{value:1},connect(){}}),createMediaElementSource:()=>({connect(){}}),decodeAudioData:async()=>({decoded:true}),createBufferSource:()=>{const source={playbackRate:{value:1},connect(){},start(){}};sources.push(source);return source;}};
 const audio=new BattleAudio({music,contextFactory:()=>context,fetcher:async()=>({ok:true,arrayBuffer:async()=>new ArrayBuffer(8)})});
 return {audio,music,sources};
}
test("only FIGHT is available until the first hit",()=>{
 assert.equal(availableActionCount(false,false),1);
 assert.equal(availableActionCount(false,true),4);
 assert.equal(availableActionCount(true,false),4);
});
test("sound is enabled by default but music waits for the attack",()=>{
 const {audio,music}=setup();assert.equal(audio.enabled,true);audio.activate();assert.equal(music.calls,0);assert.equal(audio.musicStarted,false);
 audio.startMusic();assert.equal(music.calls,1);assert.equal(music.dataset.playback,"playing");
});
test("one mute toggle silences effects and music without resetting position",()=>{
 const {audio,music}=setup();audio.startMusic();music.currentTime=25;
 assert.equal(audio.toggle(),false);assert.equal(audio.master.gain.value,0);assert.equal(music.muted,true);
 assert.equal(audio.toggle(),true);assert.equal(audio.master.gain.value,1);assert.equal(music.muted,false);assert.equal(music.currentTime,25);assert.equal(music.calls,1);
});
test("a muted first attack arms the song and unmute resumes at its current position",()=>{
 const {audio,music}=setup();audio.toggle();audio.startMusic();assert.equal(music.muted,true);assert.equal(audio.musicStarted,true);music.currentTime=12;audio.toggle();assert.equal(music.currentTime,12);assert.equal(music.muted,false);
});
test("replaying the encounter stops and resets the song",()=>{
 const {audio,music}=setup();audio.startMusic();music.currentTime=72;audio.resetMusic();assert.equal(music.paused,true);assert.equal(music.currentTime,0);assert.equal(audio.musicStarted,false);
});
test("effects use the decoded simulator samples and a separate mix bus",async()=>{
 const {audio,sources}=setup();audio.activate();await audio.loading;audio.play("move");assert.equal(sources[0].buffer,audio.buffers[SOUND_FILES.move]);assert.ok(MIX.effects>MIX.music);
});
test("the heart phase silences active and new effects while leaving music alone",async()=>{
 const {audio,music,sources}=setup();audio.startMusic();await audio.loading;audio.play("confirm");const before=sources.length;
 audio.setEffectsMuted(true);assert.equal(audio.effects.gain.value,0);assert.equal(audio.musicGain.gain.value,MIX.music);assert.equal(music.paused,false);
 for(const kind of Object.keys(SOUND_FILES))audio.play(kind);assert.equal(sources.length,before);
 audio.toggle();audio.toggle();assert.equal(audio.effects.gain.value,0);assert.equal(music.paused,false);
 audio.setEffectsMuted(false);assert.equal(audio.effects.gain.value,MIX.effects);audio.play("move");assert.equal(sources.length,before+1);
});

