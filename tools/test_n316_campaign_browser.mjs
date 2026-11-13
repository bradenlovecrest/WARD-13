#!/usr/bin/env node
/* Ward 13 NURS316: complete mobile gameplay with source-specific 40Q course pack. */
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {chromium} from 'playwright';
const port=8776,url='http://127.0.0.1:'+port+'/playtest/cinematic-episode/n316.html';
const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{stdio:'ignore'});
let browser;
const sleep=n=>new Promise(r=>setTimeout(r,n));
async function waitServer(){for(let i=0;i<40;i++){try{if((await fetch(url)).ok)return;}catch{}await sleep(250);}throw Error('Local test server inaccessible');}
try{
 await waitServer();
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.__audioCalls=[];HTMLMediaElement.prototype.play=function(){window.__audioCalls.push(String(this.src));return Promise.resolve();};});
 const response=await page.goto(url,{waitUntil:'domcontentloaded'});assert.equal(response.status(),200);
 await page.waitForFunction(()=>window.WARD13_N316_ROOMS?.length===3);
 const rooms=await page.evaluate(()=>window.WARD13_N316_ROOMS);
 assert.equal(rooms.reduce((n,r)=>n+r.questions.length+1,0),40);
 await page.locator('#btn-start').click();await page.locator('#game:not([hidden])').waitFor();
 assert.equal(await page.locator('.hotspot-stack').first().textContent(),'0/2','Unverified folder must begin at 0/2');
 let seen=0;
 for(let ri=0;ri<rooms.length;ri++){
  const room=rooms[ri];
  assert.equal(await page.locator('#room-number').textContent(),room.number);
  assert.equal(await page.locator('.hotspot').count(),room.hotspotGroups.length);
  const img=await page.evaluate(async id=>{
    const el=document.querySelector('#scene'),bg=getComputedStyle(el).backgroundImage;
    const file={'neuro':'n316-reflex.webp','heent':'n316-silent.webp','audit':'n316-directorate.webp'}[id];
    const image=new Image();image.src='./assets/'+file;await image.decode();
    return {width:image.naturalWidth,height:image.naturalHeight,bg};
  },room.id);
  assert.ok(img.width>=256&&img.height>=140&&img.bg.includes('n316-'),'Scene art must load for '+room.id);
  // Clue icon centers must be inside image boundaries in the iPhone viewport.
  const markers=await page.locator('.hotspot').evaluateAll((els)=>els.map(el=>{const r=el.getBoundingClientRect(),a=document.querySelector('#scene').getBoundingClientRect();return {inBounds:r.left>=a.left-5&&r.right<=a.right+5&&r.top>=a.top-5&&r.bottom<=a.bottom+5,x:r.x,w:r.width};}));
  assert.ok(markers.every(x=>x.inBounds),'Misaligned scenic hotspot: '+room.id+' '+JSON.stringify(markers));
  // A scene marker opens the assigned first physical-object document.
  const first=room.hotspotGroups[0].ids[0];
  if(first){await page.locator('.hotspot').first().click();assert.ok((await page.locator('#question-title').textContent()).includes(room.questions.find(q=>q.id===first).title));await page.locator('#btn-close-question').click();}
  for(let qi=0;qi<room.questions.length;qi++){
   const q=room.questions[qi];await page.locator('#accessible-charts button').nth(qi).click();
   await page.locator('#question-overlay:not([hidden])').waitFor();
   assert.ok((await page.locator('#question-title').textContent()).includes(q.title));
   if(ri===0&&qi===0){await page.locator('#options button').nth((q.answer[0]+1)%4).click();await page.locator('#btn-submit').click();assert.match(await page.locator('#answer-feedback').innerText(),/NOT VERIFIED/);}
   for(const a of q.answer)await page.locator('#options button').nth(a).click();
   if(q.type==='multi')assert.equal(await page.locator('#options button[aria-checked="true"]').count(),q.answer.length);
   if(q.type==='highlight')assert.equal(await page.locator('.highlight-choice.selected').count(),1);
   await page.locator('#btn-submit').click();
   if(q.id==='s07'||q.id==='d03'){
    await page.locator('#scare:not([hidden])').waitFor();
    const box=await page.locator('#scare').boundingBox();assert.ok(box.width>=380&&box.height>=800);
    await page.locator('#btn-dismiss-scare').click();
   }
   assert.match(await page.locator('#answer-feedback').innerText(),/ASSESSMENT VERIFIED/);
   if(ri===0&&qi===0)assert.equal(await page.locator('.hotspot-stack').first().textContent(),'1/2','Verified record increments folder to 1/2');
   await page.locator('#btn-submit').click();
   await page.locator('#question-overlay').waitFor({state:'hidden'});seen++;
  }
  await page.locator('#btn-gate:not([hidden])').click();
  await page.locator('#question-overlay:not([hidden])').waitFor();
  for(const a of room.gate.answer)await page.locator('#options button').nth(a).click();
  await page.locator('#btn-submit').click();
  await page.locator('#btn-submit').click();seen++;
 }
 assert.equal(seen,40);
 await page.locator('#ending:not([hidden])').waitFor();
 assert.match(await page.locator('#ending-narrative').innerText(),/Directorate|discharge|N.U.R.S.E./i);
 const save=await page.evaluate(()=>JSON.parse(localStorage.getItem('ward13.n316.exam3.v1')));
 assert.equal(save.done.length,37);assert.equal(save.gates.length,3);assert.equal(save.misses.m01,1);
 const audioCalls=await page.evaluate(()=>window.__audioCalls);
 assert.ok(audioCalls.some(s=>s.includes('patient-plaintive-scream-v22.mp3')),'Patient scream did not trigger');
 assert.ok(audioCalls.some(s=>s.includes('real-human-scream-v22.mp3')),'Human scream did not trigger');
 await page.locator('#btn-ending-review').click();
 await page.locator('#question-overlay:not([hidden])').waitFor();
 await page.locator('#options button').nth(rooms[0].questions[0].answer[0]).click();
 await page.locator('#btn-submit').click();await page.locator('#btn-submit').click();
 assert.ok((await page.evaluate(()=>JSON.parse(localStorage.getItem('ward13.n316.exam3.v1')))).reviewed.includes('m01'));
 await page.reload({waitUntil:'domcontentloaded'});await page.locator('#btn-continue:not([hidden])').waitFor();
 await page.locator('#btn-continue').click();assert.equal(await page.locator('#evidence-count').textContent(),'40');
 const width=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:innerWidth}));
 assert.ok(width.scroll<=width.viewport+4,'Unexpected mobile horizontal overflow: '+JSON.stringify(width));
 assert.deepEqual(errors,[],'No JavaScript errors during full playthrough');
 console.log('PASS: 40 instructor-weighted N316 clinical decisions, 3 distinct scenic rooms, aligned iPhone markers, SATA, highlight, all gates, two recorded scares, local saves and remediation.');
}finally{await browser?.close();server.kill();}
