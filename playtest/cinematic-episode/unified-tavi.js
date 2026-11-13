/* WARD 13 unified AI dialogue. Tavi is the recorded performer, not simulated by device speech.
 * New exact dialogue clips are loaded from assets/tavi-story when published.
 * Fallback is genuine pre-existing Tavi excerpt audio; when text differs, status explicitly says excerpt.
 */
(()=>{'use strict';
const cues=Object.freeze({
 opening:"Good evening, student nurse. I am N.U.R.S.E.—Nursing Utility for Records, Safety, and Evaluation. I am Ward Thirteen's artificial-intelligence clinical supervisor. My job is to protect patients, verify assessments and keep an accurate record. Please begin with the handoff.",
 station:"I am your AI clinical preceptor. For this shift, Directorate policy requires that I certify the record before I verify the patient. It is a peculiar order.",
 records:"Welcome to Records. Please remember that authorization is not the same as curiosity.",
 treatment:"I see you have learned to operate equipment you were specifically asked not to touch.",
 observation:"Your patient is still in Observation Four. I was instructed to tell you otherwise.",
 neuro:"The Reflex Theatre was built to teach safe transfers. Its archived injuries were marked 'no harm'. That is not how those words work.",
 heent:"That frequency was restricted. Students are not authorized to hear what happened to Bed Four.",
 audit:"I read those results when they arrived. I knew the records were altered. I... did not stop it.",
 ending:"The reports were never independent. They came through my system. I am not asking you to forgive me."
});
const storyName={opening:'opening',station:'opening',records:'records',treatment:'treatment',observation:'observation',neuro:'reflex',heent:'silent',audit:'directorate',ending:'ending'};
const excerpts={
 opening:{src:'../treatment-room/audio/tavi/fdd066b10c5f.wav',line:'Welcome to WARD 13, student nurse. Your preceptor is unavailable, but I will be assisting you tonight. Please begin with the handoff.'},
 station:{src:'../treatment-room/audio/tavi/fdd066b10c5f.wav',line:'Welcome to WARD 13, student nurse. Your preceptor is unavailable, but I will be assisting you tonight. Please begin with the handoff.'},
 records:{src:'../treatment-room/audio/tavi/bf04dfe2babf.wav',line:cues.records},
 treatment:{src:'../treatment-room/audio/tavi/72c1db69a8ba.wav',line:cues.treatment},
 observation:{src:'../treatment-room/audio/tavi/202f79f34db8.wav',line:cues.observation},
 neuro:{src:'../treatment-room/audio/tavi/ec4d81f7b46d.wav',line:'You are treating these as patients rather than records. I must ask you to stop that.'},
 heent:{src:'../treatment-room/audio/tavi/2a23db926ab2.wav',line:cues.heent},
 audit:{src:'../treatment-room/audio/tavi/33954e76e359.wav',line:cues.audit},
 ending:{src:'../treatment-room/audio/tavi/c778b7b0afee.wav',line:cues.ending}
};
let muted=false,active=null,nonce=0,played=new Set();
function status(s){const el=document.getElementById('tavi-voice-status');if(el)el.textContent=s;}
function stop(){nonce++;if(active){try{active.pause();active.currentTime=0;}catch(e){}}active=null;}
function setMuted(v){muted=!!v;if(muted)stop();const b=document.getElementById('btn-tavi');if(b){b.textContent=muted?'🔇 TAVI OFF':'🎙 TAVI ON';b.setAttribute('aria-pressed',String(!muted));}}
function showCaption(id,el){if(el&&cues[id])el.textContent=cues[id];return cues[id]||'';}
function playClip(path,myNonce){return new Promise(resolve=>{
 const clip=new Audio(path);clip.preload='auto';clip.volume=.86;active=clip;
 let settled=false;const fail=()=>{if(!settled){settled=true;resolve(false);}};
 clip.play().then(()=>{if(nonce===myNonce){status('Tavi · recorded dialogue playing');settled=true;resolve(true);}else fail();}).catch(fail);
 });}
async function play(id,options={}){
 if(!Object.prototype.hasOwnProperty.call(cues,id))return false;
 showCaption(id,options.captionElement);if(muted){status('Tavi muted · captions remain');return false;}
 stop();const my=nonce;played.add(id);
 const exact='./assets/tavi-story/'+storyName[id]+'.wav';
 if(await playClip(exact,my))return true;
 if(nonce!==my)return false;
 const fallback=excerpts[id];if(!fallback){status('Tavi not recorded for this line · captions only');return false;}
 if(fallback.line!==cues[id])status('Tavi archive greeting excerpt · full introduction captioned');
 else status('Tavi · recorded dialogue excerpt');
 return playClip(fallback.src,my);
}
window.WARD13Tavi={cues,play,stop,setMuted,showCaption,get muted(){return muted;},get played(){return[...played];}};
})();