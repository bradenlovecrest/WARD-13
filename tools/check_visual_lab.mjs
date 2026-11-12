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
const nightmareOption='<option value="nightmare">NIGHTMARE · real + rumble</option>';
if(!html.includes(nightmareOption))throw new Error('Missing default Nightmare scream option');
if(!code.includes("clip.volume=Math.min(.95,chosenVolume()*2)"))throw new Error('Human scream level regressed');
if(!code.includes("stopNightmareLayer()"))throw new Error('Scare cleanup missing');
if(!code.includes("playNightmareLayer()"))throw new Error('Nightmare layer not connected');
console.log('PASS: Inline JavaScript parses, essential DOM controls exist, and event handlers initialize.');
