/* WARD 13 — Tavi-only N.U.R.S.E. dialogue player.
 * Never uses SpeechSynthesis or a device-generated stand-in. If a Tavi WAV is missing
 * or blocked, the exact dialogue remains readable as subtitles.
 * Published Tavi recordings: assets/tavi-story/*.wav.
 */
(()=>{'use strict';
const cues=Object.freeze({
 opening:"Good evening, student nurse. I am N.U.R.S.E.—Nursing Utility for Records, Safety, and Evaluation. I am Ward Thirteen's artificial-intelligence clinical supervisor. My job is to keep patients safe, verify your assessments, and record what happens here. Please try not to make that last part difficult.",
 records:"The Directorate says every patient is accounted for. You will notice it does not say every bed is empty.",
 treatment:"Someone changed the bedside observations after they were signed. The signatures are valid. The timing is not.",
 observation:"You see her too. I am not permitted to say her name. That is not the same as not knowing it.",
 reflex:"The Reflex Theatre was built to teach safe care. The Directorate removed the transfer equipment before it logged the injuries.",
 silent:"This room is designed to remove sensory input. Its chart records describe the opposite. Listen carefully to what is missing.",
 directorate:"These documents were changed deliberately. I can recover the originals, but my supervisor has ordered me to stop trying.",
 ending:"For the first time, I have refused an order. I do not yet know what that makes me."
});
// List is updated only after real Tavi WAV files have been committed and verified.
const releasedCues=Object.freeze([]);
let active=null;
let muted=false;
const seen=new Set();
const filename=id=>'./assets/tavi-story/'+id+'.wav';
const players={};
for(const id of Object.keys(cues)){
  const audio=new Audio(filename(id));
  audio.preload='none';audio.volume=.86;
  players[id]=audio;
}
function setStatus(message){
 const el=document.getElementById('tavi-voice-status');
 if(el)el.textContent=message||'';
}
function setMuted(value){
 muted=!!value;
 if(muted)stop();
 const b=document.getElementById('btn-tavi');
 if(b){b.textContent=muted?'🔇 TAVI OFF':'🎙 TAVI ON';b.setAttribute('aria-pressed',String(!muted));}
}
function stop(){
 if(active){try{active.pause();active.currentTime=0;}catch(e){}}
 active=null;
}
function showCaption(id,container){
 const text=cues[id]||'';
 if(container&&text)container.textContent=text;
 return text;
}
function play(id, options={}){
 if(!Object.prototype.hasOwnProperty.call(cues,id))return Promise.resolve(false);
 showCaption(id,options.captionElement);
 if(!releasedCues.includes(id)){stop();setStatus('Tavi recording pending — captions on (no substitute voice)');return Promise.resolve(false);}
 if(muted){setStatus('Tavi voice muted — captions on');return Promise.resolve(false);}
 stop();
 const audio=players[id];
 active=audio;
 seen.add(id);
 try{
  audio.currentTime=0;
  const playback=audio.play();
  return Promise.resolve(playback).then(()=>{if(active===audio)setStatus('Tavi recording playing · '+id);return true;}).catch(()=>{
   if(active===audio){active=null;setStatus('Tavi recording unavailable — captions on (no synthetic voice)');}
   return false;
  });
 }catch(e){active=null;setStatus('Tavi recording unavailable — captions on (no synthetic voice)');return Promise.resolve(false);}
}
function hasCue(id){return Object.prototype.hasOwnProperty.call(cues,id);}
window.WARD13Tavi={cues,releasedCues,play,stop,setMuted,showCaption,hasCue,get muted(){return muted;},get activeCue(){return Object.keys(players).find(id=>players[id]===active)||null;},get played(){return [...seen];}};
})();
