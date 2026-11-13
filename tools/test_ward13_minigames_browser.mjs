#!/usr/bin/env node
/* WARD 13 N316: full playthrough of all three optional logic mini-games on mobile. */
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {chromium} from 'playwright';
const port=8828,server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{stdio:'ignore'});
let browser;const sleep=n=>new Promise(r=>setTimeout(r,n));
const base='http://127.0.0.1:'+port+'/playtest/cinematic-episode/';
async function serve(){for(let i=0;i<40;i++){try{const r=await fetch(base+'n316.html');if(r.ok)return;}catch{}await sleep(250);}throw Error('HTTP server failed');}
try{
 await serve();browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
 const errors=[],notFound=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)notFound.push([r.status(),r.url()]);});
 await page.goto(base+'n316.html',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>!!window.WARD13Minigames?.defs?.jigsaw);
 await page.locator('#btn-start').click();
 await page.locator('#btn-minigame').click();
 await page.locator('#ward13-minigame:not([hidden])').waitFor();
 assert.match(await page.locator('#wg-title').textContent(),/Safe Transfer Route/);
 await page.locator('.wg-controls button').nth(2).click(); // down row1 col0
 await page.locator('.wg-controls button').nth(2).click(); // down row2 col0
 await page.locator('.wg-controls button').nth(3).click(); // right row2 col1
 await page.locator('.wg-controls button').nth(3).click(); // right to lift col2
 assert.match(await page.locator('.wg-label').textContent(),/LIFT: ✓/);
 for(const i of [3,3,2,3,2,2])await page.locator('.wg-controls button').nth(i).click(); // right,right,down,right,down,down
 await page.locator('.wg-win').waitFor();
 assert.equal(await page.evaluate(()=>window.WARD13Minigames.completed('maze')),true);
 await page.locator('#wg-close-bottom').click();
 await page.locator('#ward13-minigame').waitFor({state:'hidden'});
 await page.evaluate(()=>window.WARD13Minigames.open('memory'));
 await page.locator('#wg-title').waitFor();
 assert.match(await page.locator('#wg-title').textContent(),/Silent Matching/);
 const cards=await page.evaluate(()=>window.WARD13Minigames.debug.cards);
 for(let p=0;p<4;p++){
  const positions=cards.map((x,i)=>x.pair===p?i:-1).filter(i=>i>=0);
  assert.equal(positions.length,2);
  await page.locator('.wg-memory button').nth(positions[0]).click();
  await page.locator('.wg-memory button').nth(positions[1]).click();
 }
 await page.locator('.wg-win').waitFor();
 assert.equal(await page.evaluate(()=>window.WARD13Minigames.completed('memory')),true);
 await page.locator('#wg-close-bottom').click();
 await page.evaluate(()=>window.WARD13Minigames.open('jigsaw'));
 await page.locator('#wg-title').waitFor();
 assert.match(await page.locator('#wg-title').textContent(),/Reassemble/);
 const img=await page.evaluate(async()=>{const i=new Image();i.src='../visual-lab-realistic/assets/records-v13.webp';await i.decode();return {w:i.naturalWidth,h:i.naturalHeight};});
 assert.ok(img.w>=500&&img.h>=250,'Jigsaw must use actual high-resolution evidence photograph');
 const current=await page.evaluate(()=>window.WARD13Minigames.debug.order.slice());
 for(let position=0;position<9;position++){
  if(current[position]===position)continue;
  const swap=current.indexOf(position);assert.ok(swap>=0);
  await page.locator('.wg-jigsaw button').nth(position).click();
  await page.locator('.wg-jigsaw button').nth(swap).click();
  [current[position],current[swap]]=[current[swap],current[position]];
 }
 await page.locator('.wg-win').waitFor();
 assert.equal(await page.evaluate(()=>window.WARD13Minigames.completed('jigsaw')),true);
 const state=await page.evaluate(()=>JSON.parse(localStorage.getItem('ward13.minigames.n316.v1')));
 assert.deepEqual(state.done,{maze:true,memory:true,jigsaw:true});
 await page.locator('#wg-close-bottom').click();
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.WARD13Minigames?.completed('jigsaw')===true);
 assert.deepEqual(errors,[],'No JavaScript errors');
 assert.deepEqual(notFound,[],'No missing assets');
 console.log('PASS: 3 N316 mini-games completed on iPhone viewport: safe transfer maze, full 4-pair memory match, 3x3 photo jigsaw, persistence and no missing evidence image.');
}finally{await browser?.close();server.kill();}
