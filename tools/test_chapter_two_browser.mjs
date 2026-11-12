#!/usr/bin/env node
/* WARD 13 — Play all 3 new rooms at iPhone width in actual Chromium. */
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';
const port=8766;
const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{stdio:'ignore'});
let browser;
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const url='http://127.0.0.1:'+port+'/playtest/cinematic-episode/chapter-two.html';
async function waitServer(){for(let i=0;i<40;i++){try{const r=await fetch(url);if(r.ok)return;}catch{}await sleep(250);}throw Error('HTTP server did not start');}
try{
 await waitServer();
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.__audioCalls=[];HTMLMediaElement.prototype.play=function(){window.__audioCalls.push(String(this.src));return Promise.resolve();};});
 const response=await page.goto(url,{waitUntil:'domcontentloaded'});assert.equal(response.status(),200);
 await page.waitForFunction(()=>Array.isArray(window.WARD13_CHAPTER_TWO_DATA)&&window.WARD13_CHAPTER_TWO_DATA.length===3);
 const rooms=await page.evaluate(()=>window.WARD13_CHAPTER_TWO_DATA);
 await page.locator('#btn-start').click();
 await page.locator('#game:not([hidden])').waitFor();
 assert.equal(await page.locator('#room-number').innerText(),'05');
 for(let ri=0;ri<3;ri++){
  const room=rooms[ri];assert.equal(await page.locator('.hotspot').count(),8);
  for(let qi=0;qi<8;qi++){
   const q=room.questions[qi];
   if(qi===0)await page.locator('.hotspot').nth(qi).click();
   else await page.locator('#accessible-charts button').nth(qi).click();
   await page.locator('#question-overlay:not([hidden])').waitFor();
   assert.ok((await page.locator('#question-title').innerText()).includes(q.title),'wrong clinical record '+q.id);
   if(ri===0&&qi===0){
    await page.locator('#options button').nth((q.correct+1)%4).click();
    await page.locator('#btn-submit').click();
    assert.match(await page.locator('#answer-feedback').innerText(),/NOT VERIFIED/);
   }
   await page.locator('#options button').nth(q.correct).click();
   await page.locator('#btn-submit').click();
   if(q.id==='h4'||q.id==='a7'){
     await page.locator('#scare:not([hidden])').waitFor();
     const info=await page.locator('#scare').evaluate(el=>{const r=el.getBoundingClientRect();return {w:r.width,h:r.height,viewportW:innerWidth,viewportH:innerHeight,shown:getComputedStyle(el).display!=='none'};});
     assert.ok(info.shown&&info.w>=info.viewportW*.95&&info.h>=info.viewportH*.95,'Scare must fill mobile viewport');
     await page.locator('#btn-dismiss-scare').click();
   }
   assert.match(await page.locator('#answer-feedback').innerText(),/ASSESSMENT VERIFIED/);
   await page.locator('#btn-submit').click();
   await page.locator('#question-overlay[hidden]').waitFor();
  }
  await page.locator('#btn-gate:not([hidden])').click();
  await page.locator('#question-overlay:not([hidden])').waitFor();
  await page.locator('#options button').nth(room.gate.correct).click();
  await page.locator('#btn-submit').click();
  await page.locator('#btn-submit').click();
  if(ri<2){assert.equal(await page.locator('#room-number').innerText(),rooms[ri+1].number);}
 }
 await page.locator('#ending:not([hidden])').waitFor();
 assert.match(await page.locator('#ending-narrative').innerText(),/patient was never discharged/i);
 const stats=await page.evaluate(()=>JSON.parse(localStorage.getItem('ward13.chapter2.v1')));
 assert.equal(stats.done.length,24);
 assert.equal(stats.gates.length,3);
 assert.equal(stats.misses.n1,1);
 const audioCalls=await page.evaluate(()=>window.__audioCalls);
 assert.ok(audioCalls.some(s=>s.includes('patient-plaintive-scream-v22.mp3')),'Patient scream not played');
 assert.ok(audioCalls.some(s=>s.includes('real-human-scream-v22.mp3')),'Human scream not played');
 await page.locator('#btn-ending-review').click();
 await page.locator('#question-overlay:not([hidden])').waitFor();
 await page.locator('#options button').nth(rooms[0].questions[0].correct).click();
 await page.locator('#btn-submit').click();
 await page.locator('#btn-submit').click();
 const review=await page.evaluate(()=>JSON.parse(localStorage.getItem('ward13.chapter2.v1')));
 assert.ok(review.reviewed.includes('n1'),'Missed clinical case must be retrievable');
 await page.reload({waitUntil:'domcontentloaded'});
 await page.locator('#btn-continue:not([hidden])').waitFor();
 await page.locator('#btn-continue').click();
 assert.equal(await page.locator('#evidence-count').innerText(),'27');
 const width=await page.evaluate(()=>({w:document.documentElement.scrollWidth,v:innerWidth}));
 assert.ok(width.w<=width.v+4,'Unexpected mobile horizontal overflow: '+JSON.stringify(width));
 assert.deepEqual(errors,[],'No browser JavaScript errors');
 console.log('PASS: All 3 chapter-two rooms, 24 chart interactions, 3 gates, two recorded scares, mobile layout, local autosave, and active remediation.');
}finally{await browser?.close();server.kill();}
