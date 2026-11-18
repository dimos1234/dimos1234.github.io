import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';

test('all restored portfolio pages resolve their local navigation and images',async()=>{
 const origin='https://portfolio.test/';
 for(const page of ['index.html','games.html','creative.html']){
  const html=await readFile(new URL('../portfolio/'+page,import.meta.url),'utf8');
  for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){
   const url=new URL(match[1],origin+'portfolio/'+page);if(url.origin!==new URL(origin).origin)continue;
   const path=new URL('..'+url.pathname,import.meta.url);const entry=await stat(path);
   assert.ok(entry.isFile()||entry.isDirectory(),page+': '+url.pathname);
  }
  assert.match(html,/Replay Battle/);
 }
});
