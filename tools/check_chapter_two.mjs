#!/usr/bin/env node
/* WARD 13 — Chapter II structural and clinical-content integrity checks. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=process.cwd(),dir=path.join(root,'playtest/cinematic-episode');
const read=p=>fs.readFileSync(path.join(dir,p),'utf8');
const html=read('chapter-two.html'),css=read('chapter-two.css'),engine=read('chapter-two.js'),content=read('chapter-two-content.js');
new vm.Script(engine,{filename:'chapter-two.js'});
new vm.Script(content,{filename:'chapter-two-content.js'});
const context={window:{}};
vm.runInNewContext(content,context);
const rooms=context.window.WARD13_CHAPTER_TWO_DATA;
if(rooms.length!==3)throw Error('Expected exactly three chapter-two rooms');
const ids=new Set();let total=0;
for(const [ri,room] of rooms.entries()){
 if(room.questions.length!==8)throw Error(room.id+' requires eight interactive clinical charts');
 if(!room.gate||room.gate.options.length!==4)throw Error('Missing synthesis gate '+room.id);
 const counts=[0,0,0,0];
 for(const item of [...room.questions,room.gate]){
  total++;
  if(ids.has(item.id))throw Error('Duplicate ID '+item.id);ids.add(item.id);
  if(item.options.length!==4||item.correct<0||item.correct>3||!Number.isInteger(item.correct))throw Error('Invalid options '+item.id);
  for(const field of ['id','hotspot','title','chart','stem','why','clue','hint','tag'])if(!item[field])throw Error('Missing '+field+' for '+item.id);
 }
 for(const q of room.questions)counts[q.correct]++;
 if(counts.some(n=>n!==2))throw Error('Correct answers are unbalanced in room '+room.id+': '+counts);
 if(!['neuro','heent','audit'].includes(room.id))throw Error('Unexpected room '+room.id);
 if(ri>0&&!rooms[ri-1].gate)throw Error('Room progression broken');
}
if(total!==27)throw Error('Expected 24 charts plus 3 synthesis gates, got '+total);
if(/\b(?:GCS|Glasgow Coma Scale)\b/i.test(content))throw Error('GCS is excluded from user exam scope');
if(!html.includes('id="hotspots"')||!html.includes('id="question-overlay"')||!html.includes('id="scare"'))throw Error('Missing playable interaction layer');
if(!engine.includes('localStorage.setItem(SAVE_KEY')||!engine.includes('pendingReview()'))throw Error('Save/remediation integration missing');
if(!engine.includes('patient-plaintive-scream-v22.mp3')||!engine.includes('real-human-scream-v22.mp3'))throw Error('Must play local recorded screams');
if(!engine.includes('./chapter-two-content.js?v=1'))throw Error('Missing structured content pack URL');
if(!css.includes('@media(max-width:650px)')||!css.includes('@media(prefers-reduced-motion:reduce)'))throw Error('Mobile/reduced-motion styles missing');
for(const file of ['assets/patient-plaintive-scream-v22.mp3','assets/real-human-scream-v22.mp3','../visual-lab-realistic/assets/patient004-face-reveal-v14.webp'])if(!fs.existsSync(path.resolve(dir,file)))throw Error('Missing art/scream asset '+file);
console.log('PASS: Chapter II has 3 playable rooms, 24 clinical charts, 3 synthesis gates, balanced answers, no GCS, recorded screams, local saves, and exam remediation.');
