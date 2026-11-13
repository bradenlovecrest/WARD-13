#!/usr/bin/env node
/* Tavi-only voice regression: actual WAV decoding/playback and opening acronym.
 * Unlike scene smoke tests, does NOT mock audio.play.
 */
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {chromium} from 'playwright';
const port=8827,server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{stdio:'ignore'});
const sleep=n=>new Promise(r=>setTimeout(r,n));
const base='http://127.0.0.1:'+port+'/playtest/cinematic-episode/';
let browser;
try{
 let ready=false;
 for(let i=0;i<35;i++){try{const r=await fetch(base+'n316.html');if(r.ok){ready=true;break;}}catch{}await sleep(200);}
 assert.ok(ready,'Test server must be reachable');
 browser=await chromium.launch({headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.__syntheticSpeechCalls=0;try{const old=speechSynthesis.speak.bind(speechSynthesis);speechSynthesis.speak=(...a)=>{window.__syntheticSpeechCalls++;return old(...a);};}catch(e){}});
 const res=await page.goto(base+'n316.html',{waitUntil:'domcontentloaded'});
 assert.equal(res.status(),200);
 await page.waitForFunction(()=>window.WARD13Tavi?.releasedCues?.length===8);
 assert.match(await page.locator('#nurse-ai-introduction').textContent(),/Nursing Utility for Records, Safety, and Evaluation/);
 await page.locator('#btn-hear-intro').click();
 await page.waitForFunction(()=>window.WARD13Tavi?.activeCue==='opening',{timeout:8000});
 await page.waitForFunction(()=>document.getElementById('tavi-voice-status').textContent.includes('playing'),{timeout:8000});
 const samples=await page.evaluate(async()=>{
  const ids=['opening','records','treatment','observation','reflex','silent','directorate','ending'];
  const out=[];
  for(const id of ids){
   const url='./assets/tavi-story/'+id+'.wav';
   const r=await fetch(url);if(!r.ok)throw Error('Missing released Tavi audio '+url);
   const a=new Audio(url);a.preload='auto';
   await new Promise((resolve,reject)=>{a.addEventListener('loadedmetadata',resolve,{once:true});a.addEventListener('error',()=>reject(Error('Decode error '+url)),{once:true});a.load();});
   if(!Number.isFinite(a.duration)||a.duration<1)throw Error('Invalid voice duration '+id+' '+a.duration);
   out.push({id,seconds:+a.duration.toFixed(1),status:r.status});
  }
  return out;
 });
 assert.equal(samples.length,8);
 assert.equal(await page.evaluate(()=>window.__syntheticSpeechCalls),0,'No device synthetic speech for N.U.R.S.E.');
 await page.locator('#btn-tavi').click();
 assert.equal(await page.evaluate(()=>window.WARD13Tavi.muted),true,'Mute Tavi without using browser speech');
 assert.deepEqual(errors,[],'No browser JavaScript errors in N316 voice');
 // Original first-wing introduction must be explicitly AI, with same voice module.
 const legacy=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const legacyErrors=[];legacy.on('pageerror',e=>legacyErrors.push(e.message));
 const orig=await legacy.goto(base+'classic.html',{waitUntil:'domcontentloaded'});
 assert.equal(orig.status(),200);
 await legacy.locator('#btn-tavi-opening').waitFor({timeout:10000});
 assert.match(await legacy.locator('#nurse-ai-intro').textContent(),/Nursing Utility for Records, Safety, and Evaluation/);
 await legacy.waitForFunction(()=>window.WARD13Tavi?.releasedCues?.length===8);
 await legacy.locator('#btn-tavi-opening').click();
 await legacy.waitForFunction(()=>window.WARD13Tavi?.activeCue==='opening',{timeout:8000});
 assert.deepEqual(legacyErrors,[],'No original first-wing intro errors');
 const full=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const first=await full.goto(base+'unified.html',{waitUntil:'domcontentloaded'});
 assert.equal(first.status(),200);
 assert.match(await full.locator('#nurse-ai-introduction').textContent(),/Nursing Utility for Records, Safety, and Evaluation/);
 await full.locator('#btn-hear-intro').click();
 await full.waitForFunction(()=>window.WARD13Tavi?.played?.includes('opening'),{timeout:8000});
 assert.match(await full.locator('#tavi-voice-status').textContent(),/Tavi/);

 console.log('PASS: Tavi-only voice pack has 8 real WAV recordings, each decodes; all three game introductions establish N.U.R.S.E. as AI and use the same recorded Tavi voice.');
 console.log('CUES:',samples.map(s=>s.id+'='+s.seconds+'s').join(', '));
}finally{await browser?.close();server.kill();}
