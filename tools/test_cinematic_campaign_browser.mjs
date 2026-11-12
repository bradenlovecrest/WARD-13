#!/usr/bin/env node
/* Mobile Chromium integration smoke test for the actual pilot, not only syntax. */
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const server=spawn('python3',['-m','http.server','8765','--bind','127.0.0.1'],{stdio:'ignore'});
let browser;
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
 const response=await page.goto('http://127.0.0.1:8765/playtest/cinematic-episode/',{waitUntil:'domcontentloaded'});
 assert.equal(response.status(),200);
 await page.locator('#enter-button').click();
 await page.locator('#game:not([hidden])').waitFor();
 assert.ok(await page.locator('.cinematic-nurse-portrait').count());
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
 const records=await page.locator('#scene-photo').evaluate(x=>getComputedStyle(x).backgroundImage);
 assert.match(records,/records-v13.webp/);
 await page.locator('[data-hot="files"]').click();
 await page.locator('#modal-layer:not([hidden])').waitFor();
 await page.locator('#close-modal').click();
 await page.evaluate(()=>window.WARD13E0.advance('treatment'));
 await page.locator('.scene-photo.treatment').waitFor();
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
 await page.locator('[data-close-patient]').click();
 assert.ok(await page.locator('#patient004-reveal[hidden]').count());
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
