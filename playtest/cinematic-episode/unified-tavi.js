/* WARD 13 unified AI dialogue. Tavi is the recorded performer, not simulated by device speech.
 * New exact dialogue clips are loaded from assets/tavi-story when published.
 * Fallback is genuine pre-existing Tavi excerpt audio; when text differs, status explicitly says excerpt.
 */
(()=>{'use strict';
const cues=Object.freeze({
  "opening": "Good evening, student nurse. I am N.U.R.S.E.—Nursing Utility for Records, Safety, and Evaluation. I am Ward Thirteen's artificial-intelligence clinical supervisor. My job is to keep patients safe, verify your assessments, and record what happens here. Please try not to make that last part difficult.",
  "station": "Good evening, student nurse. I am N.U.R.S.E.—Nursing Utility for Records, Safety, and Evaluation. I am Ward Thirteen's artificial-intelligence clinical supervisor. My job is to keep patients safe, verify your assessments, and record what happens here. Please try not to make that last part difficult.",
  "records": "The Directorate says every patient is accounted for. You will notice it does not say every bed is empty.",
  "treatment": "Someone changed the bedside observations after they were signed. The signatures are valid. The timing is not.",
  "observation": "You see her too. I am not permitted to say her name. That is not the same as not knowing it.",
  "neuro": "The Reflex Theatre was built to teach safe care. The Directorate removed the transfer equipment before it logged the injuries.",
  "heent": "This room is designed to remove sensory input. Its chart records describe the opposite. Listen carefully to what is missing.",
  "audit": "These documents were changed deliberately. I can recover the originals, but my supervisor has ordered me to stop trying.",
  "ending": "For the first time, I have refused an order. I do not yet know what that makes me."
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