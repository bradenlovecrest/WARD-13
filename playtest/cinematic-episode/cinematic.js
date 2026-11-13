/* WARD 13 CINEMATIC CAMPAIGN PILOT — story effects only, not diagnostic logic.
   Keeps all original Treatment Room lock and teaching handlers intact.
   Patient 004 is an unexplained apparition separate from assigned patient R. Vale. */
(()=>{
 'use strict';
 const overlay=document.getElementById('patient004-reveal');
 if(!overlay)return;
 document.documentElement.dataset.cinematicScareLoaded='22';
 const build=document.getElementById('scare-build-id');if(build)build.textContent='SCREAM ENGINE v2.2 ✓';
 const close=overlay.querySelector('[data-close-patient]');
 const image=overlay.querySelector('img');
 // Lazy images do not load while the scare overlay is hidden on iOS. Preload now.
 if(image){image.loading='eager';image.decoding='async';image.fetchPriority='high';const picture=new Image();picture.src=image.src;}
 let focusBeforeScare=null;
 const patientClip=new Audio('./assets/patient-plaintive-scream-v22.mp3');
 patientClip.preload='auto';
 patientClip.addEventListener('error',()=>{if(build)build.textContent='SCREAM ENGINE v2.2 / PATIENT AUDIO MISSING'});
 let dismissTimer=0;
 function playPatientScream(info){
   if(info.enabled===false)return; // Undefined/missing audioInfo must not silently suppress the recorded scream.
   patientClip.volume=Math.max(.12,Math.min(.82,(info.mix??.72)*.85));
   try{
     patientClip.pause();patientClip.currentTime=0;
     const p=patientClip.play();
     if(p?.catch)p.catch(()=>{if(!overlay.hidden&&build)build.textContent='SCREAM ENGINE v2.2 / PATIENT PLAYBACK FAILED'});
   }catch(e){if(build)build.textContent='SCREAM ENGINE v2.2 / PATIENT PLAYBACK FAILED'}
 }
 function stopAudio(){
   try{patientClip.pause();patientClip.currentTime=0;}catch(e){}
 }
 function hide(){
   window.clearTimeout(dismissTimer);
   overlay.hidden=true;
   overlay.style.display='none';
   overlay.setAttribute('aria-hidden','true');
   overlay.classList.remove('cinematic-motion');
   stopAudio();
   if(focusBeforeScare?.isConnected)focusBeforeScare.focus({preventScroll:true});
   focusBeforeScare=null;
 }
 function showPatientScare(){
   window.clearTimeout(dismissTimer);
   stopAudio();
   const info=window.WARD13E0?.audioInfo?.() || {};
   const reduced=document.body.classList.contains('reduced') || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
   focusBeforeScare=document.activeElement;
   overlay.classList.toggle('cinematic-motion',!reduced);
   overlay.hidden=false;
   // Explicit fixed positioning survives stale or delayed stylesheets on mobile browsers.
   overlay.style.cssText='position:fixed;inset:0;width:100vw;height:100dvh;display:flex;align-items:center;justify-content:center;z-index:9999;visibility:visible;opacity:1;background:#030809;overflow:hidden;';
   overlay.setAttribute('aria-hidden','false');
   if(image){
     image.loading='eager';
     image.alt='Close-up of Patient 004 with windblown hair, distressed expression, and unexplained clinical signs.';
     image.style.cssText='width:100%;height:100%;object-fit:cover;object-position:center 46%;';
   }
   playPatientScream(info);
   close?.focus({preventScroll:true});
   // Let the full image and recorded scream land before hiding it.
   dismissTimer=window.setTimeout(hide,4700);
 }

 close?.addEventListener('click',hide);
 overlay.addEventListener('click',e=>{if(e.target===overlay)hide()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!overlay.hidden)hide()});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)hide()});
 // Chapter II access is a separate file. Preserve every original four-room handler and save.
 const southWingLink=document.createElement('a');
 southWingLink.href='./n316.html';
 southWingLink.textContent='✚ NURS 316 / EXAM 3';
 southWingLink.setAttribute('aria-label','Open Ward 13 NURS 316 Exam 3 South Wing edition');
 southWingLink.style.cssText='position:fixed;left:12px;bottom:calc(12px + env(safe-area-inset-bottom));z-index:95;display:inline-flex;align-items:center;justify-content:center;min-height:42px;max-width:210px;padding:9px 12px;border:1px solid #9fe1bc;background:#091b1bee;color:#d6f4e3;border-radius:3px;text-decoration:none;font:700 10px/1.2 monospace;letter-spacing:.7px;box-shadow:0 4px 25px #000b;';
 southWingLink.addEventListener('pointerenter',()=>{southWingLink.style.background='#264637'});
 southWingLink.addEventListener('pointerleave',()=>{southWingLink.style.background='#091b1bee'});
 document.body.appendChild(southWingLink);
 // The original four-room campaign keeps its existing recorded Tavi performances.
 // New introduction uses the SAME Tavi voice pack as South Wing; never device TTS.
 const taviScript=document.createElement('script');
 taviScript.src='./nurse-tavi.js?v=1';
 taviScript.defer=true;
 document.head.appendChild(taviScript);
 const enter=document.getElementById('enter-button');
 if(enter){
   const info=document.createElement('div');
   info.id='nurse-ai-intro';
   info.style.cssText='max-width:680px;margin:12px auto 14px;padding:11px 16px;border-left:3px solid #a2e1ca;background:#071c1dd9;color:#d8efde;box-shadow:0 3px 18px #0007;text-align:left;';
   const line=document.createElement('p');
   line.textContent='N.U.R.S.E. — Nursing Utility for Records, Safety, and Evaluation. Your artificial-intelligence clinical supervisor.';
   line.style.cssText='font:600 13px/1.6 system-ui,sans-serif;margin:0 0 8px;';
   const hear=document.createElement('button');
   hear.type='button';hear.id='btn-tavi-opening';hear.textContent='▶ HEAR N.U.R.S.E. INTRODUCE HERSELF (TAVI)';
   hear.style.cssText='background:#133a33;border:1px solid #b4edd4;color:#e3ffe8;padding:10px;font:600 11px/1.4 monospace;cursor:pointer;max-width:100%;white-space:normal;';
   const subtitle=document.createElement('p');
   subtitle.style.cssText='font:400 11px/1.6 system-ui,sans-serif;color:#b7d5c6;margin:8px 0 0;';
   subtitle.textContent='Recorded Tavi voice only. If the clip is unavailable, subtitles play silently—never robotic speech.';
   hear.addEventListener('click',()=>{
     if(window.WARD13Tavi)window.WARD13Tavi.play('opening',{captionElement:subtitle});
     else subtitle.textContent='Tavi audio is loading. The opening line is captioned; no synthetic voice will play.';
   });
   info.append(line,hear,subtitle);
   enter.parentElement.insertBefore(info,enter);
 }
 window.WARD13Cinematic={showPatientScare,hidePatientScare:hide};
})();
