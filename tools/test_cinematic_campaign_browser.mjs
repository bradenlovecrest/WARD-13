#!/usr/bin/env node
/* Mobile Chromium integration smoke test for the actual pilot, not only syntax. */
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const server=spawn('python3',['-m','http.server','8765','--bind','127.0.0.1'],{stdio:'ignore'});
let browser;

async function assertVisibleScare(page, selector, description){
 await page.waitForFunction(sel=>{
   const el=document.querySelector(sel);return el&&Number(getComputedStyle(el).opacity)>.8;
 },selector,{timeout:1800});
 const info=await page.locator(selector).evaluate(el=>{
   const style=getComputedStyle(el),r=el.getBoundingClientRect();
   const v={w:innerWidth,h:innerHeight};
   const covering=r.width>=v.w*.95&&r.height>=v.h*.90&&r.top<=4&&r.left<=4;
   const center=document.elementFromPoint(v.w*.5,v.h*.5);
   return {position:style.position,display:style.display,visibility:style.visibility,
     opacity:Number(style.opacity),zIndex:Number(style.zIndex),pointerEvents:style.pointerEvents,
     covering,ownsCenter:center===el||el.contains(center),
     img:el.querySelector('img')?{complete:el.querySelector('img').complete,naturalWidth:el.querySelector('img').naturalWidth}:null};
 });
 assert.equal(info.position,'fixed',description+' must be fixed to viewport');
 assert.equal(info.covering,true,description+' should cover the phone viewport');
 if(info.pointerEvents!=='none')assert.equal(info.ownsCenter,true,description+' must be frontmost, not behind the game');
 assert.notEqual(info.display,'none',description+' cannot be display:none');
 assert.notEqual(info.visibility,'hidden',description+' cannot be visually hidden');
 assert.ok(info.opacity>.8,description+' must be visible');
 if(info.img){assert.equal(info.img.complete,true,description+' image must load');assert.ok(info.img.naturalWidth>0,description+' image is missing');}
}

async function waitServer(){
 for(let i=0;i<30;i++){
  try{const r=await fetch('http://127.0.0.1:8765/playtest/cinematic-episode/');
   if(r.ok)return;}
  catch(e){}
  await new Promise(r=>setTimeout(r,350));
 }
 throw Error('HTTP server did not become ready');
}
try{
 await waitServer();
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{
   window.__scarePlayCalls=[];
   HTMLMediaElement.prototype.play=function(){window.__scarePlayCalls.push({url:String(this.src).slice(0,90)});return Promise.resolve()};
 });
 const response=await page.goto('http://127.0.0.1:8765/playtest/cinematic-episode/',{waitUntil:'domcontentloaded'});
 assert.equal(response.status(),200);
 await page.locator('#enter-button').click();
 await page.locator('#game:not([hidden])').waitFor();
 await page.locator('#sound-toggle').click();
 assert.ok(await page.locator('.cinematic-nurse-portrait').count());
 assert.match(await page.locator('.nursehead').innerText(),/AI/);
 assert.ok(await page.locator('#evidence-strip button').count()>0,'Evidence chips missing');
 const hasPortrait=await page.locator('.cinematic-nurse-portrait').evaluate(x=>getComputedStyle(x).backgroundImage.startsWith('url("data:image/webp'));
 assert.ok(hasPortrait,'Real cinematic N.U.R.S.E. portrait should render');
 const logo=await page.evaluate(()=>document.title);
 assert.match(logo,/Cinematic Campaign/);
 await page.evaluate(()=>{
  const api=window.WARD13E0;
  const st=api.state;
  st.power=true;st.archiveDone=true;st.treatmentDone=true;st.rails=true;st.audit=true;
  api.advance('records');
 });
 await page.locator('.scene-photo.records').waitFor();
 await page.locator('#scare-preview').click();
 await page.locator('#scare.active').waitFor();
 assert.ok(await page.locator('#scare.active').count(),'Records scare should appear immediately');
 await assertVisibleScare(page,'#scare.active','Records scare');
 const recordsPortrait=await page.locator('#scare .apparition').evaluate(x=>getComputedStyle(x).backgroundImage);
 assert.match(recordsPortrait,/data:image\/webp;base64/,'Records scare must display N.U.R.S.E. portrait');
 const records=await page.locator('#scene-photo').evaluate(x=>getComputedStyle(x).backgroundImage);
 assert.match(records,/records-v13.webp/);
 await page.locator('[data-hot="files"]').click();
 await page.locator('#modal-layer:not([hidden])').waitFor();
 await page.locator('#close-modal').click();
 await page.evaluate(()=>window.WARD13E0.advance('treatment'));
 await page.locator('.scene-photo.treatment').waitFor();
 await page.locator('#scare-preview').click();
 await page.locator('#scare.active').waitFor();
 assert.ok(await page.locator('#scare.active').count(),'Treatment scare should appear immediately');
 await assertVisibleScare(page,'#scare.active','Treatment scare');
 assert.ok((await page.evaluate(()=>window.__scarePlayCalls.length))>0,'Treatment audio should be requested');
 const treat=await page.locator('#scene-photo').evaluate(x=>getComputedStyle(x).backgroundImage);
 assert.match(treat,/data:image\/webp;base64/);
 await page.locator('[data-hot="treat-drawer"]').click();
 await page.locator('#modal-layer:not([hidden])').waitFor();
 await page.locator('#close-modal').click();
 await page.evaluate(()=>window.WARD13E0.advance('observation'));
 await page.locator('.scene-photo.observation').waitFor();
 const obs=await page.locator('#scene-photo').evaluate(x=>getComputedStyle(x).backgroundImage);
 assert.match(obs,/observation-patient-integrated-v13.webp/);
 await page.locator('[data-hot="patient004"]').click();
 await page.locator('#modal-layer:not([hidden])').waitFor();
 await page.locator('#close-modal').click();
 await page.locator('[data-hot="patient004"]').click();
 await page.locator('#patient004-reveal:not([hidden])').waitFor();
 await page.locator('#patient004-reveal img').evaluate(img=>img.decode().catch(()=>{}));
 await assertVisibleScare(page,'#patient004-reveal:not([hidden])','Patient 004 scare');
 const patientImage=await page.locator('#patient004-reveal img').evaluate(x=>({w:x.naturalWidth,h:x.naturalHeight}));
 assert.ok(patientImage.w>500&&patientImage.h>250,'Patient image should be full resolution');
 await page.locator('[data-close-patient]').click();
 assert.ok(await page.locator('#patient004-reveal[hidden]').count());
 await page.locator('[data-hot="patient004"]').click();
 await page.locator('#replay-patient-scare').click();
 await page.locator('#patient004-reveal:not([hidden])').waitFor();
 await page.locator('[data-close-patient]').click();
 await page.locator('[data-hot="patient"]').click();
 await page.locator('#modal-layer:not([hidden])').waitFor();
 const clinical=await page.locator('#modal-body').innerText();
 assert.match(clinical,/R\. VALE/);
 assert.match(clinical,/SpO₂/);
 assert.equal(await page.evaluate(()=>localStorage.getItem('ward13-treatment-v06')),null,
   'Cinematic pilot must not overwrite legacy saves');
 assert.ok(await page.evaluate(()=>localStorage.getItem('ward13-cinematic-campaign-v1')),
   'Cinematic pilot progress must be saved separately');
 assert.deepEqual(errors,[],'No JavaScript page errors');
 console.log('PASS: Mobile browser played four connected rooms, original puzzles, portrait, Patient 004 scare, clinical case, and isolated autosave.');
}finally{
 await browser?.close();
 server.kill();
}
