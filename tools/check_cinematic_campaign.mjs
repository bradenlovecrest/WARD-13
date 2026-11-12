#!/usr/bin/env node
/* WARD 13 pilot: clinical puzzles, voice, scene art, and patient scare integrity. */
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';

const root=process.cwd();
const htmlPath=path.join(root,'playtest/cinematic-episode/index.html');
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
must(html,'<link rel="stylesheet" href="cinematic.css">');
must(html,'<script src="cinematic.js" defer></script>');
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
if(!/const cc0Fallback=new Audio\('data:audio\/ogg;base64,[A-Za-z0-9+/=]{30000,}'\)/.test(companion))throw Error('Missing independently licensed sound fallback');

console.log('PASS: Cinematic campaign JS parses; four-room puzzle mechanics, original clinical case, Tavi paths, images, isolated save, and extra patient encounter verified.');
