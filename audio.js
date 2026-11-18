export const SOUND_FILES = {
 move: "MenuCursor.wav", confirm: "MenuSelect.wav", cancel: "MenuCursor.wav",
 text: "BattleTextBlip.wav", strike: "PlayerFight.wav", hit: "PlayerDamaged.wav",
 perfect: "Ding.wav", start: "Flash.wav", dust: "MonsterDust.wav"
};
export const MIX = {music: 0.42, effects: 1.1};
export class BattleAudio {
 constructor({music,contextFactory,fetcher}={}){
  this.enabled=true;this.effectsMuted=false;this.context=null;this.musicStarted=false;this.buffers={};this.lastPlayed=new Map();
  this.contextFactory=contextFactory||(()=>{const Audio=window.AudioContext||window.webkitAudioContext;return Audio?new Audio():null;});
  this.fetcher=fetcher||((url)=>fetch(url));
  this.music=music||document.getElementById("battle-music");
  this.music.loop=true;this.music.preload="auto";this.music.muted=false;
  this.music.dataset.enabled="true";this.music.dataset.started="false";this.music.dataset.playback="armed";this.music.dataset.effectsMuted="false";
  this.music.addEventListener("playing",()=>{this.music.dataset.playback="playing";});
  this.music.addEventListener("pause",()=>{this.music.dataset.playback="paused";});
  this.music.addEventListener("error",()=>{this.music.dataset.playback="error";});
  this.music.addEventListener("timeupdate",()=>{this.music.dataset.position=this.music.currentTime.toFixed(2);});
  this.pending={};
  for(const file of new Set(Object.values(SOUND_FILES)))this.pending[file]=this.fetcher("assets/audio/sfx/"+file).then(response=>{if(!response.ok)throw Error("Sound unavailable");return response.arrayBuffer();}).catch(()=>null);
 }
 activate(){
  if(!this.context){
   this.context=this.contextFactory();
   if(this.context){
    const c=this.context;this.master=c.createGain();this.master.gain.value=this.enabled?1:0;
    this.effects=c.createGain();this.effects.gain.value=this.effectsMuted?0:MIX.effects;this.effects.connect(this.master);
    this.hurt=c.createGain();this.hurt.gain.value=MIX.effects;this.hurt.connect(this.master);
    this.musicGain=c.createGain();this.musicGain.gain.value=MIX.music;this.musicGain.connect(this.master);
    this.musicSource=c.createMediaElementSource(this.music);this.musicSource.connect(this.musicGain);
    if(c.createDynamicsCompressor){this.limiter=c.createDynamicsCompressor();this.limiter.threshold.value=-3;this.limiter.ratio.value=12;this.limiter.attack.value=.003;this.limiter.release.value=.15;this.master.connect(this.limiter);this.limiter.connect(c.destination);}else this.master.connect(c.destination);
    this.loading=Promise.all(Object.entries(this.pending).map(async([file,promise])=>{const bytes=await promise;if(bytes){try{this.buffers[file]=await c.decodeAudioData(bytes);}catch{}}}));
   }
  }
  if(this.context?.state==="suspended")this.context.resume().catch(()=>{});
  if(this.musicStarted&&this.music.paused&&this.enabled)this.tryMusic();
 }
 tryMusic(){const result=this.music.play();if(result?.catch)result.catch(()=>{this.music.dataset.playback="waiting-for-interaction";});}
 startMusic(){this.activate();if(!this.musicStarted){this.musicStarted=true;this.music.dataset.started="true";this.tryMusic();}}
 resetMusic(){this.musicStarted=false;this.music.dataset.started="false";this.music.pause();this.music.currentTime=0;this.music.dataset.playback="armed";}
 effectDuration(kind){const duration=(this.buffers[SOUND_FILES[kind]]?.duration||0)*1000;return kind==="perfect"?Math.max(duration,this.effectDuration("strike")):duration;}
 setEffectsMuted(muted){this.effectsMuted=muted;this.music.dataset.effectsMuted=String(muted);if(this.effects)this.effects.gain.value=muted?0:MIX.effects;}
 toggle(){
  this.enabled=!this.enabled;this.music.muted=!this.enabled;
  this.music.dataset.enabled=String(this.enabled);
  if(this.master)this.master.gain.value=this.enabled?1:0;
  this.activate();if(this.musicStarted&&this.enabled&&this.music.paused)this.tryMusic();
  return this.enabled;
 }
 play(kind){
  if(!this.enabled||(this.effectsMuted&&kind!=="hit")||!this.context)return;
  const now=this.context.currentTime;const gap=kind==="text"?.055:.025;
  if(now-(this.lastPlayed.get(kind)??-Infinity)<gap)return;this.lastPlayed.set(kind,now);
  const file=SOUND_FILES[kind]||SOUND_FILES.move;
  if(this.buffers[file]){
   const source=this.context.createBufferSource(),gain=this.context.createGain();
   source.buffer=this.buffers[file];gain.gain.value=({text:.35,start:.55,hit:.85,perfect:.7,dust:.8})[kind]??1;
   if(kind==="cancel")source.playbackRate.value=.9;
   source.connect(gain);gain.connect(kind==="hit"?this.hurt:this.effects);source.start();
   if(kind==="perfect")this.play("strike");
   return;
  }
  // Short fallback during initial decoding; subsequent cues use the reference samples.
  const oscillator=this.context.createOscillator(),gain=this.context.createGain();
  const [frequency,length]=({move:[440,.025],confirm:[660,.045],cancel:[250,.035],text:[300,.016],hit:[90,.12],strike:[130,.1],perfect:[880,.12],start:[540,.08]})[kind]||[440,.025];
  oscillator.type="square";oscillator.frequency.setValueAtTime(frequency,now);
  gain.gain.setValueAtTime(kind==="text"?.025:.075,now);gain.gain.exponentialRampToValueAtTime(.0001,now+length);
  oscillator.connect(gain);gain.connect(kind==="hit"?this.hurt:this.effects);oscillator.start(now);oscillator.stop(now+length);
 }
}

