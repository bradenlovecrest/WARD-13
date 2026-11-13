#!/usr/bin/env node
/* Ward 13 N316 extended browser audit: actual media, visibility, scene markers and mobile controls.
   Supplements full 40-question smoke playthrough, does not claim physical iOS playback. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {spawn} from 'node:child_process';
import {chromium} from 'playwright';
const port=8806,root='http://127.0.0.1:'+port+'/playtest/cinematic-episode/';
const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{stdio:'ignore'});
let browser;const sleep=n=>new Promise(r=>setTimeout(r,n));
async function ready(){for(let i=0;i<40;i++){try{if((await fetch(root+'n316.html')).ok)return;}catch{}await sleep(250);}throw Error('Test server startup failure');}
function pairOverlaps(rects){const collisions=[];for(let i=0;i<rects.length;i++)for(let j=i+1;j<rects.length;j++){const a=rects[i],b=rects[j],dx=Math.abs(a.cx-b.cx),dy=Math.abs(a.cy-b.cy);if(dx<(a.w+b.w)/2-3 && dy<(a.h+b.h)/2-3)collisions.push([i,j]);}return collisions;}
try{
 await ready();
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2});
 const errors=[],badResources=[],consoleErrors=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(r.status()>=400)badResources.push([r.status(),r.url()]);});
 page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text());});
 await page.addInitScript(()=>{
  window.__audioPlays=[];
  const original=HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play=function(){
   const rec={src:this.src,startedAt:performance.now(),result:'pending'};
   window.__audioPlays.push(rec);
   try{const p=original.call(this);if(p&&p.then)p.then(()=>rec.result='resolved',e=>rec.result='rejected: '+e.name);return p;}
   catch(e){rec.result='thrown: '+e.message;throw e;}
  };
 });
 await page.goto(root+'n316.html',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.WARD13_N316_ROOMS?.length===3);
 const sources=await page.evaluate(async()=>{
  const urls=['./assets/patient-plaintive-scream-v22.mp3','./assets/real-human-scream-v22.mp3'];
  const ac=new (window.AudioContext||window.webkitAudioContext)();
  const out=[];
  for(const url of urls){
   const res=await fetch(url);if(!res.ok)throw Error('Audio HTTP '+res.status+' '+url);
   const raw=await res.arrayBuffer();const decoded=await ac.decodeAudioData(raw);
   const samples=decoded.getChannelData(0);let sum=0,peak=0;
   for(let i=0;i<samples.length;i+=3){const v=Math.abs(samples[i]);sum+=v*v;peak=Math.max(v,peak);}
   out.push({url,duration:decoded.duration,channels:decoded.numberOfChannels,sampleRate:decoded.sampleRate,peak,rms:Math.sqrt(sum/Math.ceil(samples.length/3)),bytes:raw.byteLength});
  }await ac.close();return out;
 });
 for(const a of sources){assert.ok(a.duration>=2&&a.duration<=10,'Scream duration unexpected '+JSON.stringify(a));assert.ok(a.peak>0.04&&a.rms>0.005,'Silent or failed scream '+JSON.stringify(a));}
 await page.locator('#btn-test-scream').click();
 await page.locator('#scare:not([hidden])').waitFor();
 await page.waitForTimeout(700);
 let plays=await page.evaluate(()=>window.__audioPlays);
 assert.ok(plays.some(a=>a.src.includes('real-human-scream-v22.mp3')&&a.result==='resolved'),'Recorded scream did not start after real user click: '+JSON.stringify(plays));
 const scarePhoto=await page.locator('#scare img').evaluate(img=>({loaded:img.complete&&img.naturalWidth>100,width:img.naturalWidth}));
 assert.ok(scarePhoto.loaded,'Scare photo missing');
 await page.keyboard.press('Escape');await page.locator('#scare').waitFor({state:'hidden'});
 await page.locator('#btn-start').click();await page.locator('#game:not([hidden])').waitFor();
 assert.equal(await page.locator('#stats-line').innerText().then(s=>s.includes('/40')),true,'Old /27 count still appears');
 const rooms=await page.evaluate(()=>window.WARD13_N316_ROOMS);
 fs.mkdirSync('artifacts/n316-audit',{recursive:true});
 for(const [ri,room] of rooms.entries()){
  if(ri>0){
   await page.evaluate((i)=>{const s=JSON.parse(localStorage.getItem('ward13.n316.exam3.v1'));s.room=i;s.gates=['neuro','heent','audit'].slice(0,i);localStorage.setItem('ward13.n316.exam3.v1',JSON.stringify(s));},ri);
   await page.reload({waitUntil:'domcontentloaded'});await page.locator('#btn-continue').click();
  }
  for(const width of [320,375,390,768,1440]){
   await page.setViewportSize({width,height:width===320?700:900});
   const metrics=await page.evaluate(()=>{
    const scene=document.querySelector('#scene').getBoundingClientRect(),buttons=[...document.querySelectorAll('.hotspot')].map(el=>{const r=el.getBoundingClientRect();return {cx:r.x+r.width/2,cy:r.y+r.height/2,w:r.width,h:r.height,rect:{x:r.x,y:r.y,right:r.right,bottom:r.bottom}};});
    return {scene:{left:scene.left,right:scene.right,top:scene.top,bottom:scene.bottom},buttons,documentWidth:document.documentElement.scrollWidth,viewport:innerWidth,testButtonVisible:document.querySelector('#btn-test-scream').getBoundingClientRect().width>0};
   });
   assert.ok(metrics.documentWidth<=width+4,'Horizontal overflow '+room.id+' width '+width+': '+JSON.stringify(metrics));
   assert.ok(metrics.testButtonVisible,'Test scream button missing at width '+width);
   for(const q of metrics.buttons){assert.ok(q.rect.x>=metrics.scene.left-2 && q.rect.right<=metrics.scene.right+2,'Clipped hotspot '+room.id+' width '+width+' '+JSON.stringify(q));assert.ok(q.rect.y>=metrics.scene.top-2&&q.rect.bottom<=metrics.scene.bottom+2,'Vertical clipping '+room.id+' width '+width);}
   assert.deepEqual(pairOverlaps(metrics.buttons),[],'Overlapping hotspot controls '+room.id+' width '+width);
  }
  await page.setViewportSize({width:390,height:844});
  const bg=await page.locator('#scene').evaluate(el=>getComputedStyle(el).backgroundImage);
  assert.ok(bg.includes('n316-'),'Wrong room background '+room.id);
  if(room.id==='audit'){
   assert.ok(await page.locator('.forensic-wall .forensic-paper').count()===3,'Out-of-syllabus ABG posters must be covered by N316 forensic materials');
  }
  await page.screenshot({path:'artifacts/n316-audit/'+room.number+'-phone.png',fullPage:true});
  await page.setViewportSize({width:1440,height:900});
  await page.screenshot({path:'artifacts/n316-audit/'+room.number+'-desktop.png',fullPage:true});
  await page.setViewportSize({width:390,height:844});
 }
 await page.locator('#btn-sound').click();assert.match(await page.locator('#btn-sound').textContent(),/OFF/);
 await page.locator('#btn-test-scream').click();await page.locator('#scare:not([hidden])').waitFor();assert.match(await page.locator('#btn-sound').textContent(),/ON/);await page.locator('#btn-dismiss-scare').click();
 assert.deepEqual(errors,[],'Browser JavaScript errors');
 assert.deepEqual(badResources,[],'Missing resources');
 assert.deepEqual(consoleErrors,[],'Console errors');
 console.log('PASS: sound MP3 decode energy/duration '+JSON.stringify(sources.map(a=>({name:a.url,duration:a.duration,peak:a.peak,rms:a.rms})))+'; actual play event, photo, 3 scenes, 5 widths, no overlaps or clips, no errors.');
}finally{await browser?.close();server.kill();}
