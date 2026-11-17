const NATIVE = 112;
export class SpritePlayer {
 constructor(){this.sheets={};this.name="idle";this.age=0;this.idleAge=0;this.frame=0;}
 async load(){await Promise.all(["idle","entrance","hit","perfect"].map(async name=>{
  const image=new Image();image.src="assets/battle/adam-"+name+"-five-fingers.png";
  await image.decode();
  const frames=[];
  for(let index=0;index<12;index++){
   const frame=document.createElement("canvas");frame.width=NATIVE;frame.height=NATIVE;
   const context=frame.getContext("2d",{willReadFrequently:true});context.imageSmoothingEnabled=false;
   context.drawImage(image,index%4*image.width/4,Math.floor(index/4)*image.height/3,image.width/4,image.height/3,0,0,NATIVE,NATIVE);
   const pixels=context.getImageData(0,0,NATIVE,NATIVE);
   for(let p=0;p<pixels.data.length;p+=4){const white=pixels.data[p]+pixels.data[p+1]+pixels.data[p+2]>420;pixels.data[p]=pixels.data[p+1]=pixels.data[p+2]=white?255:0;pixels.data[p+3]=white?255:0;}
   context.putImageData(pixels,0,0);
   let bottom=0;for(let y=0;y<NATIVE;y++)for(let x=0;x<NATIVE;x++)if(pixels.data[(y*NATIVE+x)*4+3])bottom=Math.max(bottom,y);
   let footLeft=NATIVE,footRight=0;for(let y=Math.max(0,bottom-10);y<=bottom;y++)for(let x=0;x<NATIVE;x++)if(pixels.data[(y*NATIVE+x)*4+3]){footLeft=Math.min(footLeft,x);footRight=Math.max(footRight,x);}
   const registered=document.createElement("canvas");registered.width=NATIVE;registered.height=NATIVE;
   const registeredContext=registered.getContext("2d");registeredContext.imageSmoothingEnabled=false;
   registeredContext.drawImage(frame,Math.round(NATIVE/2-(footLeft+footRight)/2),109-bottom);
   frames.push(registered);
  }
  this.sheets[name]=frames;
 }));}
 play(name){if(this.sheets[name]){this.name=name;this.age=0;}}
 update(dt){this.idleAge+=dt;this.age+=dt;const duration={entrance:1150,hit:720,perfect:1500}[this.name];if(duration&&this.age>=duration){this.name="idle";this.age=0;this.idleAge=0;}const length=this.name==="idle"?1200:duration;const age=this.name==="idle"?this.idleAge%1200:this.age;this.frame=Math.min(11,Math.floor(age/length*12));}
 draw(ctx,{x=208,y=14,scale=2}={}){const frame=this.sheets[this.name]?.[this.frame];if(frame)ctx.drawImage(frame,Math.round(x),Math.round(y),NATIVE*scale,NATIVE*scale);}
}

