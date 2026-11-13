#!/usr/bin/env node
/* Ward 13 seven-room campaign static audit: one engine, four mini-games, no pharm. */
import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';import path from 'node:path';
const dir=path.join(process.cwd(),'playtest/cinematic-episode');
const txt=p=>fs.readFileSync(path.join(dir,p),'utf8'),html=txt('unified.html'),js=txt('unified.js'),css=txt('unified.css'),mini=txt('unified-minis.js'),voice=txt('unified-tavi.js');
for(const [p,t] of [['unified.js',js],['unified-minis.js',mini],['unified-tavi.js',voice]])new vm.Script(t,{filename:p});
const ctx={window:{}};for(const p of ['unified-first-wing.js','n316-room05.js','n316-room06.js','n316-room07.js'])vm.runInNewContext(txt(p),ctx,{filename:p});
const rs=[...ctx.window.WARD13_UNIFIED_ROOMS,...ctx.window.WARD13_N316_ROOMS];
assert.deepEqual(rs.map(x=>x.id),['station','records','treatment','observation','neuro','heent','audit']);
assert.equal(rs.length,7);
assert.equal(rs.slice(0,4).reduce((n,r)=>n+r.questions.length+1,0),20);
assert.equal(rs.slice(4).reduce((n,r)=>n+r.questions.length+1,0),40);
assert.deepEqual(rs.slice(0,4).map(r=>r.mini),['jigsaw','memory','logic','maze']);
const ids=new Set();
for(const room of rs){
 for(const item of [...room.questions,room.gate]){
  assert.ok(!ids.has(item.id),'Duplicate '+item.id);ids.add(item.id);
  assert.equal(item.options.length,4);
  assert.ok(item.answer.length>0&&item.answer.every(a=>Number.isInteger(a)&&a>=0&&a<4),'Invalid answer '+item.id);
  assert.ok(item.why&&item.clue&&item.chart&&item.stem);
 }
 for(const g of room.hotspotGroups)for(const id of g.ids)assert.ok(room.questions.some(q=>q.id===id),'Unmapped physical chart '+id);
 for(const q of room.questions)assert.ok(room.hotspotGroups.some(g=>g.ids.includes(q.id)),'Unreachable chart '+q.id);
}
assert.equal(ids.size,60);
assert.ok(!/digoxin|glipizide|PaCO₂|respiratory acidosis|albuterol|metoprolol|prednisone/i.test(JSON.stringify(rs)),'Off-exam pharm case in unified bank');
assert.match(html,/Nursing Utility for Records, Safety, and Evaluation/);
assert.match(voice,/artificial-intelligence clinical supervisor/);
assert.match(js,/ward13\.unified\.v1/);
assert.match(js,/runner\.open\(r,function\(\)\{/);
assert.match(js,/rooms\.length!==7/);
assert.ok(html.includes('unified-tavi.js'));
for(const id of ['jigsaw','memory','logic','maze'])assert.ok(mini.includes('function '+id+'()'));
for(const name of ['n316-firstwing-station.webp','n316-firstwing-records.webp','n316-firstwing-treatment.webp','n316-firstwing-observation.webp','n316-firstwing-photo.webp']){
 const b=fs.readFileSync(path.join(dir,'assets',name));assert.ok(b.length>22000&&b.toString('ascii',0,4)==='RIFF'&&b.toString('ascii',8,12)==='WEBP','Missing original high-res art '+name);
}
for(const name of ['n316-reflex.webp','n316-silent.webp','n316-directorate.webp']){
 assert.ok(fs.statSync(path.join(dir,'assets',name)).size>1000,'Missing south scene '+name);
}
assert.ok(css.includes('.scene.station')&&css.includes('.scene.observation'));
console.log('PASS: Unified 7-room campaign / 60 source-relevant clinical cases / 4 physical mini-games / original art / voice captions / preserved independent saves.');
