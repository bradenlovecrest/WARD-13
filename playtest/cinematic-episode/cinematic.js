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
   if(!info.enabled)return;
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
 window.WARD13Cinematic={showPatientScare,hidePatientScare:hide};
})();
