#!/usr/bin/env node
/**
 * WARD 13 Visual Lab static JavaScript smoke test.
 * Fails when an inline-script syntax error would disable all interactive controls.
 * Does not need npm, browser dependencies, or external services.
 */
import fs from 'node:fs';
import vm from 'node:vm';

const target='playtest/visual-lab-realistic/index.html';
const html=fs.readFileSync(target,'utf8');
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(m=>m[1].trim()).filter(Boolean);
if(scripts.length !== 1)throw new Error('Expected exactly one inline Visual Lab script; found '+scripts.length);
new vm.Script(scripts[0],{filename:target+' script'});
const essentials=[
  'tab-treatment','tab-records','tab-observation',
  'scare-test','scare-voice','scare-exit','play-tavi',
  'sfx-on','voice-on','volume','reduced-on','hotspots'
];
for(const id of essentials){
  const rx=new RegExp('\\bid=["\\x27]'+id+'["\\x27]');
  if(!rx.test(html))throw new Error('Missing required control: '+id);
}
const code=scripts[0];
for(const marker of [
  "addEventListener('click',()=>renderRoom('treatment'))",
  "addEventListener('click',()=>renderRoom('records'))",
  "addEventListener('click',()=>renderRoom('observation'))",
  "addEventListener('click',()=>",
  "renderRoom('treatment',false)"
]){
  if(!code.includes(marker))throw new Error('Missing event initialization: '+marker);
}
const nightmareOption='<option value="nightmare">Previous NIGHTMARE mix</option>';
if(!html.includes(nightmareOption))throw new Error('Missing previous Nightmare scream option');
if(!html.includes('<option value="new-real">NEW · Real bloodcurdling scream</option>'))throw new Error('Missing the new real scream default');
if(!code.includes("const newHumanScream = new Audio('data:audio/ogg;base64,"))throw new Error('New human scream embedded audio missing');
const embeddedOgg=code.match(/const newHumanScream = new Audio\('data:audio\/ogg;base64,([A-Za-z0-9+/=]+)'\)/);
if(!embeddedOgg||embeddedOgg[1].length<30000)throw new Error('New human scream asset truncated');
const raw=Buffer.from(embeddedOgg[1],'base64');
if(raw.toString('ascii',0,4)!=='OggS')throw new Error('New human scream is not Ogg audio');
if(!code.includes("clip.volume=Math.min(.95,chosenVolume()*2)"))throw new Error('Human scream level regressed');
if(!code.includes("stopNightmareLayer()"))throw new Error('Scare cleanup missing');
if(!code.includes("playNightmareLayer()"))throw new Error('Nightmare layer not connected');
for(const name of ['records-v11.webp','observation-four-v11.webp']){
  const path='playtest/visual-lab-realistic/assets/'+name;
  const raw=fs.readFileSync(path);
  if(raw.length<20000||raw.toString('ascii',0,4)!=='RIFF'||raw.toString('ascii',8,12)!=='WEBP')throw new Error('Invalid room scene WebP: '+name);
  if(!code.includes("'assets/"+name+"'"))throw new Error('Scene art not wired: '+name);
}
if(!code.includes("observationGlassTaps===2"))throw new Error('Earned Observation Four scare missing');
if(!code.includes("recordsTerminalSeen"))throw new Error('Records evidence sequence missing');
if(!html.includes('12 complete · 8 upcoming'))throw new Error('Visual Lab checklist count not updated');
console.log('PASS: All three cinematic rooms, image files, WebP headers, hotspot handlers, earned scares and JavaScript syntax verified.');
