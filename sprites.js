const NATIVE = 112;
const ANIMATIONS={
 idle:{sheet:"idle",first:0,count:12,duration:1200,loop:true},
 entrance:{sheet:"entrance",first:0,count:12,duration:1150},
 hit:{sheet:"hit",first:0,count:12,duration:720},
 perfect:{sheet:"perfect",first:0,count:12,duration:1500},
 defeat:{sheet:"death",first:0,count:5,duration:1000,hold:true},
 death:{sheet:"death",first:5,count:7,duration:2800,hold:true}
};
export class SpritePlayer {
 constructor(){this.sheets={};this.name="idle";this.age=0;this.idleAge=0;this.frame=0;}
 async load(){await Promise.all(["idle","entrance","hit","perfect","death"].map(async name=>{
  const image=new Image();image.src=name==="death"?"assets/battle/adam-death-v1.png":"assets/battle/adam-"+name+"-five-fingers.png";
  await image.decode();
  const frames=[];let origin=null;
  for(let index=0;index<12;index++){
   const frame=document.createElement("canvas");frame.width=NATIVE;frame.height=NATIVE;
   const context=frame.getContext("2d",{willReadFrequently:true});context.imageSmoothingEnabled=false;
   context.drawImage(image,index%4*image.width/4,Math.floor(index/4)*image.height/3,image.width/4,image.height/3,0,0,NATIVE,NATIVE);
   const pixels=context.getImageData(0,0,NATIVE,NATIVE);
   for(let p=0;p<pixels.data.length;p+=4){const white=pixels.data[p]+pixels.data[p+1]+pixels.data[p+2]>420;pixels.data[p]=pixels.data[p+1]=pixels.data[p+2]=white?255:0;pixels.data[p+3]=white?255:0;}
   context.putImageData(pixels,0,0);
   let bottom=0;for(let y=0;y<NATIVE;y++)for(let x=0;x<NATIVE;x++)if(pixels.data[(y*NATIVE+x)*4+3])bottom=Math.max(bottom,y);
   let footLeft=NATIVE,footRight=0;for(let y=Math.max(0,bottom-10);y<=bottom;y++)for(let x=0;x<NATIVE;x++)if(pixels.data[(y*NATIVE+x)*4+3]){footLeft=Math.min(footLeft,x);footRight=Math.max(footRight,x);}
   const offset={x:Math.round(NATIVE/2-(footLeft+footRight)/2),y:109-bottom};
   // Keep dust in world space instead of re-registering fragments to a shoe.
   if(!origin)origin=offset;
   const registered=document.createElement("canvas");registered.width=NATIVE;registered.height=NATIVE;
   const registeredContext=registered.getContext("2d");registeredContext.imageSmoothingEnabled=false;
   const position=name==="death"?origin:offset;
   registeredContext.drawImage(frame,position.x,position.y);
   frames.push(registered);
  }
  this.sheets[name]=frames;
 }));}
 duration(name=this.name){return ANIMATIONS[name]?.duration||0;}
 play(name){const animation=ANIMATIONS[name];if(animation&&this.sheets[animation.sheet]){this.name=name;this.age=0;this.frame=animation.first;}}
 update(dt){
  this.idleAge+=dt;this.age+=dt;let animation=ANIMATIONS[this.name];
  if(!animation.loop&&!animation.hold&&this.age>=animation.duration){this.name="idle";this.age=0;this.idleAge=0;animation=ANIMATIONS.idle;}
  const age=animation.loop?this.idleAge%animation.duration:this.age;
  this.frame=animation.first+Math.min(animation.count-1,Math.floor(age/animation.duration*animation.count));
 }
 draw(ctx,{x=208,y=14,scale=2}={}){const frame=this.sheets[ANIMATIONS[this.name].sheet]?.[this.frame];if(frame)ctx.drawImage(frame,Math.round(x),Math.round(y),NATIVE*scale,NATIVE*scale);}
}

