#!/usr/bin/env node
/* WARD 13 pilot: clinical puzzles, voice, scene art, and patient scare integrity. */
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';

const root=process.cwd();
const htmlPath=path.join(root,'playtest/cinematic-episode/classic.html');
const html=fs.readFileSync(htmlPath,'utf8');
const css=fs.readFileSync(path.join(root,'playtest/cinematic-episode/cinematic.css'),'utf8');
const companion=fs.readFileSync(path.join(root,'playtest/cinematic-episode/cinematic.js'),'utf8');
const originals=fs.readFileSync(path.join(root,'playtest/treatment-room/index.html'),'utf8');

const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(x=>x[1].trim()).filter(Boolean);
if(scripts.length!==1)throw Error('Expected one full campaign engine script, found '+scripts.length);
new vm.Script(scripts[0],{filename:'Cinematic campaign inline engine'});
new vm.Script(companion,{filename:'Cinematic patient effects'});
const must=(what,term)=>{if(!what.includes(term))throw Error('Missing '+term.slice(0,95))};
must(html,'ward13-cinematic-campaign-v1');
must(html,"LEGACY_SAVE='ward13-treatment-v06'");
must(html,'<link rel="stylesheet" href="cinematic.css?v=22-recorded-scream">');
must(html,'<script src="cinematic.js?v=22-recorded-scream" defer></script>');
must(html,'id="scare-direct-test"');
must(html,'#scare.active{position:fixed!important');
must(html,'patient004:cinematicPatient004');
must(html,"'obs-glass':cinematicGlass");
must(html,"const TRUTH=[2,4,1,3]");
must(html,'function showPatient()');
must(html,'function archiveCase()');
must(html,'function clinical()');
must(html,'function treatmentMAR()');
must(html,'function treatmentCabinet()');
must(html,'function save()');
must(html,'function load()');
must(html,'RR: <b>8/min</b>');
must(html,'pH <b>7.29</b>');
must(html,'function advance(room)');
must(html,'function render()');
must(html,'nursePerformer');
must(companion,'showPatientScare');
must(css,'.scene-photo.records');
must(css,'.scene-photo.treatment');
must(css,'.scene-photo.observation');
must(css,'.cinematic-nurse-portrait');
must(css,'#patient004-reveal');

const sourceFunctions=['function showPatient()','function archiveCase()','function clinical()','function treatmentMAR()','function treatmentCabinet()'];
for(const f of sourceFunctions)if(!originals.includes(f))throw Error('Original puzzle function unavailable: '+f);
for(const asset of [
  'playtest/visual-lab-realistic/assets/records-v13.webp',
  'playtest/visual-lab-realistic/assets/observation-patient-integrated-v13.webp',
  'playtest/visual-lab-realistic/assets/patient004-face-reveal-v14.webp',
  'playtest/treatment-room/audio/tavi/fdd066b10c5f.wav'
])if(!fs.existsSync(path.join(root,asset)))throw Error('Missing asset '+asset);
const taviRefs=(html.match(/\.\.\/treatment-room\/audio\/tavi\/[0-9a-f]{12}\.wav/g)||[]);
if(taviRefs.length!==18)throw Error('Expected 18 Tavi WAV paths, got '+taviRefs.length);
for(const item of taviRefs)if(!fs.existsSync(path.resolve(root,'playtest/cinematic-episode',item)))throw Error('Missing Tavi voice '+item);
for(const asset of ['real-human-scream-v22.mp3','patient-plaintive-scream-v22.mp3'])if(!fs.existsSync(path.join(root,'playtest/cinematic-episode/assets',asset)))throw Error('Missing recorded scream MP3 '+asset);
if(!html.includes("new Audio('./assets/real-human-scream-v22.mp3')"))throw Error('Main scare must use recorded MP3');
if(!companion.includes("new Audio('./assets/patient-plaintive-scream-v22.mp3')"))throw Error('Patient 004 must use local recorded MP3');
if(html.includes("soundCue('scare_sting_v2'"))throw Error('Synthetic sting still plays for scares');
if(companion.includes('emergencySting('))throw Error('Patient synthetic sound still active');

// New regression tests for the playtest feedback.
for(const marker of ['function balancedChoices(','const ARCHIVE_BREADCRUMBS=','id="evidence-strip"','id="scare-preview"','pH 7.51 / CO₂ 29 / HCO₃⁻ 23','DIRECTORATE OVERRIDE ACTIVE'])if(!html.includes(marker))throw Error('Campaign improvement missing: '+marker);
const optionHelper=html.slice(html.indexOf('function balancedChoices('),html.indexOf('const ARCHIVE_BREADCRUMBS='));
const archiveBank=html.slice(html.indexOf('const ARCHIVE_CASES='),html.indexOf('function archiveCase()'));
const treatBank=html.slice(html.indexOf('const TREAT_CASES='),html.indexOf('const TREAT_CODE='));
const banks=vm.runInNewContext(optionHelper+'\n'+archiveBank+'\n'+treatBank+'\n({balancedChoices,ARCHIVE_CASES,TREAT_CASES})');
const slotCounts=[0,0,0];
for(const [bank,offset] of [[banks.ARCHIVE_CASES,0],[banks.TREAT_CASES,3]]){
  for(const [ci,c] of bank.entries())for(const [fi,field] of c.fields.entries()){
    const result=banks.balancedChoices(field[2],field[3],ci+offset,fi).filter(([v])=>v);
    const slot=result.findIndex(([v])=>v===field[3]);
    if(slot<0)throw Error('Missing correct answer in '+c.id+' '+field[0]);
    slotCounts[slot]++;
  }
}
if(slotCounts.some(n=>n<6))throw Error('Answer positions are predictable: '+slotCounts);
console.log('PASS: Clinical answer positions',slotCounts);
console.log('PASS: Cinematic campaign JS parses; four-room puzzle mechanics, original clinical case, Tavi paths, images, isolated save, and extra patient encounter verified.');
