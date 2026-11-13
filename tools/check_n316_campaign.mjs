#!/usr/bin/env node
/* Ward 13 NURS 316 Exam 3: source-aligned content and asset consistency. */
import fs from 'node:fs';import vm from 'node:vm';import path from 'node:path';import assert from 'node:assert/strict';
const root=process.cwd(),dir=path.join(root,'playtest/cinematic-episode'),read=p=>fs.readFileSync(path.join(dir,p),'utf8');
const html=read('n316.html'),engine=read('n316.js'),css=read('n316.css');
new vm.Script(engine,{filename:'n316.js'});
const ctx={window:{}};for(const p of ['n316-room05.js','n316-room06.js','n316-room07.js'])vm.runInNewContext(read(p),ctx,{filename:p});
const rooms=ctx.window.WARD13_N316_ROOMS;
assert.equal(rooms.length,3);
const expectedByRoom=[{Mobility:6,Tissue:6},{Sensory:8,Cognition:6},{Pain:8,Neurocognition:6}];
const countByTag={Mobility:0,Tissue:0,Sensory:0,Cognition:0,Pain:0,Neurocognition:0};
const ids=new Set();
let total=0,multi=0,highlight=0;
for(const [ri,room] of rooms.entries()){
 assert.ok(room.questions.length>10,'Room '+room.id+' must contain more than ten chart assessments');
 assert.ok(room.hotspotGroups.length>=7,'Room '+room.id+' requires mapped interactive prop groups');
 const known=new Set(room.questions.map(q=>q.id));
 for(const g of room.hotspotGroups){
  assert.ok(g.x>=3&&g.x<=97&&g.y>=5&&g.y<=95,'Bad hotspot location '+g.label);
  for(const id of g.ids)assert.ok(known.has(id),'Hotspot group references absent chart '+id);
 }
 for(const q of room.questions)assert.ok(room.hotspotGroups.some(g=>g.ids.includes(q.id)),'Unmapped question '+q.id);
 const local={};
 for(const q of [...room.questions,room.gate]){
  total++;assert.ok(!ids.has(q.id),'Duplicate question ID '+q.id);ids.add(q.id);
  assert.equal(q.options.length,4,'Wrong option count '+q.id);
  assert.ok(Array.isArray(q.answer)&&q.answer.length>=1&&q.answer.length<=3,'Bad answer '+q.id);
  assert.ok(q.answer.every(a=>Number.isInteger(a)&&a>=0&&a<4),'Answer outside A-D '+q.id);
  assert.equal(new Set(q.answer).size,q.answer.length,'Duplicate correct answer '+q.id);
  assert.ok(q.chart&&q.stem&&q.why&&q.hint&&q.clue,'Incomplete clinical rationale '+q.id);
  if(q.type==='multi'){multi++;assert.ok(q.answer.length>=2,'SATA needs multiple correct answers '+q.id);}
  else{assert.equal(q.answer.length,1,'Single/highlight must have one answer '+q.id);if(q.type==='highlight')highlight++;}
  const topic=q.tag.split(' • ')[0];assert.ok(topic in countByTag,'Off-review-topic question '+q.id+' '+topic);
  countByTag[topic]++;local[topic]=(local[topic]||0)+1;
 }
 assert.equal(local[Object.keys(expectedByRoom[ri])[0]],Object.values(expectedByRoom[ri])[0]);
 assert.equal(local[Object.keys(expectedByRoom[ri])[1]],Object.values(expectedByRoom[ri])[1]);
}
assert.equal(total,40);
assert.ok(multi>=3&&highlight>=2,'Exam mix should include multiple response and highlighting');
for(const [topic,count] of Object.entries({Mobility:6,Tissue:6,Sensory:8,Pain:8,Cognition:6,Neurocognition:6}))assert.equal(countByTag[topic],count);
assert.match(engine,/ward13\.n316\.exam3\.v1/);
assert.match(engine,/allCount=rooms\.reduce/);
assert.ok(!engine.includes("'Completed: '+progress()+'/27"),'Outdated /27 progress counter persists');
assert.match(html,/btn-test-scream/);
assert.match(html,/scene-clues/);
assert.match(engine,/modal\.selected\.includes/);
for(const id of ['n316-room05.js','n316-room06.js','n316-room07.js','n316.js','n316.css'])assert.ok(html.includes(id),'Missing linked file '+id);
for(const name of ['n316-reflex.webp','n316-silent.webp','n316-directorate.webp']){
 const b=fs.readFileSync(path.join(dir,'assets',name));
 assert.ok(b.length>1000&&b.subarray(0,4).toString()==='RIFF'&&b.subarray(8,12).toString()==='WEBP','Missing WebP room art '+name);
 assert.ok(css.includes(name));
}
assert.ok(!/respiratory alkalosis|pH\s*7\.29|preload|glipizide/i.test(JSON.stringify(rooms)),'Former pharmacology content leaked into N316 pack');
console.log('PASS: N316 Exam 3 has exactly 40 clinical decisions: mobility 6, tissue 6, sensory 8, pain 8, cognition 6, neurocognitive 6; SATA/highlight; original scenes, art, and saves.');
