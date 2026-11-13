#!/usr/bin/env node
/* Seven-room end-to-end clinical/mini-game playthrough on iPhone viewport. */
import assert from 'node:assert/strict';import {spawn} from 'node:child_process';import{chromium}from'playwright';
const port=8788,url='http://127.0.0.1:'+port+'/playtest/cinematic-episode/unified.html';
const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{stdio:'ignore'});let browser;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function ready(){for(let n=0;n<45;n++){try{if((await fetch(url)).ok)return;}catch{}await sleep(250);}throw Error('Game HTTP server unavailable');}
async function solveJigsaw(page){
 await page.locator('.jigsaw-slot').first().waitFor();
 await page.evaluate(()=>{for(let id=0;id<9;id++){const e=new Event('drop',{bubbles:true,cancelable:true});e.dataTransfer={getData:()=>String(id)};document.querySelectorAll('.jigsaw-slot')[id].dispatchEvent(e);}});
 await page.locator('#mini-check').click();
}
async function solveMemory(page){
 const textByIndex=[];
 for(let i=0;i<8;i+=2){
  const cards=page.locator('.memory-card');await cards.nth(i).click();await cards.nth(i+1).click();
  textByIndex[i]=await cards.nth(i).textContent();textByIndex[i+1]=await cards.nth(i+1).textContent();
  await sleep(1000);
 }
 const dict=new Map([['PQRST',0],['Structured pain history',0],['SHEAR',1],['Deeper tissues shift against skin',1],['IADLs',2],['Shopping and medication management',2],['REFERRED PAIN',3],['Felt away from the affected organ',3]]);
 for(let p=0;p<4;p++){
  const ids=textByIndex.map((t,i)=>dict.get(t)===p?i:-1).filter(i=>i>=0);
  assert.equal(ids.length,2,'Memory card pair '+p+' not found in grid');
  const cards=page.locator('.memory-card');
  if(await cards.nth(ids[0]).isDisabled())continue;
  await cards.nth(ids[0]).click();await cards.nth(ids[1]).click();await sleep(80);
 }
 await page.locator('#mini-check').click();
}
async function solveLogic(page){
 const stamps=['00:01','00:04','00:11','00:13'];
 for(let i=0;i<4;i++){
  let labels=await page.locator('.logic-item span').allTextContents();
  let found=labels.findIndex(t=>t.includes(stamps[i]));assert.ok(found>=i);
  while(found>i){await page.locator('.logic-item').nth(found).locator('button').first().click();found--;}
 }
 await page.locator('#mini-check').click();
}
async function solveMaze(page){
 const rows=['S......','.###.#.','...#...','##.#.##','...#...','.#...#.','...#..E'];
 const queue=[[0,0,'']],visited=new Set(['0,0']);
 const dirs=[[1,0,'ArrowRight'],[-1,0,'ArrowLeft'],[0,1,'ArrowDown'],[0,-1,'ArrowUp']];
 let path=null;
 while(queue.length){const [x,y,p]=queue.shift();if(x===6&&y===6){path=p;break;}
   for(const [dx,dy,k] of dirs){let nx=x+dx,ny=y+dy,key=nx+','+ny;if(nx<0||ny<0||nx>6||ny>6||rows[ny][nx]==='#'||visited.has(key))continue;visited.add(key);queue.push([nx,ny,p?k+','+p:k]);}
 }
 // Build shortest route afresh to preserve forward order.
 const q=[[0,0,[]]],seen=new Set(['0,0']);let seq=null;
 while(q.length){const [x,y,p]=q.shift();if(x===6&&y===6){seq=p;break;}
 for(const [dx,dy,k] of dirs){const xx=x+dx,yy=y+dy,key=xx+','+yy;if(xx<0||yy<0||xx>6||yy>6||rows[yy][xx]==='#'||seen.has(key))continue;seen.add(key);q.push([xx,yy,p.concat(k)]);}}
 assert.ok(seq&&seq.length>4,'Maze must have a real solution');
 for(const key of seq)await page.keyboard.press(key);
 await page.locator('#mini-check').click();
}
async function solveMini(page,type){await page.locator('#mini-overlay:not([hidden])').waitFor();
 if(type==='jigsaw')await solveJigsaw(page);else if(type==='memory')await solveMemory(page);
 else if(type==='logic')await solveLogic(page);else if(type==='maze')await solveMaze(page);
 else throw Error('Unknown puzzle '+type);
 await page.locator('#mini-overlay').waitFor({state:'hidden'});
}
try{
 await ready();browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2});
 const errors=[],badResponses=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&!r.url().includes('tavi-story'))badResponses.push(r.status()+' '+r.url());});
 await page.addInitScript(()=>{window.__sounds=[];HTMLMediaElement.prototype.play=function(){window.__sounds.push(String(this.src));return Promise.resolve();};});
 assert.equal((await page.goto(url,{waitUntil:'domcontentloaded'})).status(),200);
 await page.waitForFunction(()=>window.WARD13Unified?.total===60);
 assert.match(await page.locator('#nurse-ai-introduction').textContent(),/Nursing Utility for Records, Safety, and Evaluation/);
 await page.locator('#btn-start').click();await page.locator('#game:not([hidden])').waitFor();
 const rooms=await page.evaluate(()=>[...window.WARD13_UNIFIED_ROOMS,...window.WARD13_N316_ROOMS]);
 let solved=0;
 for(let ri=0;ri<7;ri++){
  const room=rooms[ri];assert.equal(await page.locator('#room-number').textContent(),room.number);
  const scene=await page.locator('#scene').evaluate(el=>getComputedStyle(el).backgroundImage);
  assert.match(scene,/url\(/);
  // Guarantee every physical hotspot marker actually lands in the scene rectangle.
  const bounds=await page.locator('.hotspot').evaluateAll(els=>els.map(el=>{let s=document.querySelector('#scene').getBoundingClientRect(),r=el.getBoundingClientRect();return r.left>=s.left-5&&r.right<=s.right+5&&r.top>=s.top-5&&r.bottom<=s.bottom+5;}));
  assert.ok(bounds.every(Boolean),'Clue marker out of scene bounds in '+room.id);
  for(let i=0;i<room.questions.length;i++){
   const q=room.questions[i];await page.locator('#accessible-charts button').nth(i).click();
   await page.locator('#question-overlay:not([hidden])').waitFor();
   assert.ok((await page.locator('#question-title').textContent()).includes(q.title));
   if(ri===0&&i===0){await page.locator('#options button').nth((q.answer[0]+1)%4).click();await page.locator('#btn-submit').click();assert.match(await page.locator('#answer-feedback').textContent(),/NOT VERIFIED/);}
   for(const ix of q.answer)await page.locator('#options button').nth(ix).click();
   await page.locator('#btn-submit').click();
   if(['w19','s07','d03'].includes(q.id)){
     await page.locator('#scare:not([hidden])').waitFor();
     await page.locator('#btn-dismiss-scare').click();
   }
   assert.match(await page.locator('#answer-feedback').textContent(),/ASSESSMENT VERIFIED/);
   await page.locator('#btn-submit').click();
   await page.locator('#question-overlay').waitFor({state:'hidden'});
   solved++;
  }
  await page.locator('#btn-gate:not([hidden])').click();
  if(room.mini)await solveMini(page,room.mini);
  await page.locator('#question-overlay:not([hidden])').waitFor();
  for(const ix of room.gate.answer)await page.locator('#options button').nth(ix).click();
  await page.locator('#btn-submit').click();await page.locator('#btn-submit').click();
  solved++;
 }
 assert.equal(solved,60);
 await page.locator('#ending:not([hidden])').waitFor();
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('ward13.unified.v1')));
 assert.equal(saved.done.length,53);assert.equal(saved.gates.length,7);
 assert.deepEqual(Object.keys(saved.minis).sort(),['observation','records','station','treatment']);
 assert.equal(saved.misses.w01,1);
 const sounds=await page.evaluate(()=>window.__sounds);
 assert.ok(sounds.some(u=>u.includes('patient-plaintive-scream-v22.mp3')));
 assert.ok(sounds.some(u=>u.includes('real-human-scream-v22.mp3')));
 await page.locator('#btn-ending-review').click();
 await page.locator('#options button').nth(rooms[0].questions[0].answer[0]).click();
 await page.locator('#btn-submit').click();await page.locator('#btn-submit').click();
 assert.ok((await page.evaluate(()=>JSON.parse(localStorage.getItem('ward13.unified.v1')))).reviewed.includes('w01'));
 await page.reload({waitUntil:'domcontentloaded'});
 await page.locator('#btn-continue:not([hidden])').waitFor();
 await page.locator('#btn-continue').click();
 assert.equal(await page.locator('#evidence-count').textContent(),'60');
 const width=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,view:innerWidth}));
 assert.ok(width.scroll<=width.view+4,'Mobile horizontal overflow '+JSON.stringify(width));
 assert.deepEqual(errors,[],'No browser script errors');
 assert.deepEqual(badResponses,[],'No missing gameplay assets');
 console.log('PASS: 7 seamless rooms, 60 NURS316 decisions, true jigsaw, memory, chronology logic, navigation maze, recorded screams, saves, remediation and mobile hotspot bounds.');
}finally{await browser?.close();server.kill();}
