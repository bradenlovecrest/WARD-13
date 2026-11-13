/* WARD 13: THE SOUTH WING — Chapter II, self-contained clinical puzzle engine.
   Local-only progression; 24 assessment cases + 3 synthesis gates.
   Original questions, NO GCS, no patient-004 diagnostic spoiler. */
(function(){
'use strict';
/* NURS 316 exam-specific course pack: loaded by ordered defer script tags. */
var SAVE_KEY='ward13.unified.v1';
var $=function(id){return document.getElementById(id);};
var rooms=[],cases=new Map(),modal=null,reviewQueue=[],previousFocus=null;
var allCount=40;
var activeScare=null,scareTimer=null,toastTimer=null,loadFailed=false;
var patientClip=new Audio('./assets/patient-plaintive-scream-v22.mp3');
var humanClip=new Audio('./assets/real-human-scream-v22.mp3');
patientClip.preload='auto';humanClip.preload='auto';
var fresh=function(){return{started:false,room:0,done:[],gates:[],minis:{},misses:{},reviewed:[],scares:[],muted:false,finished:false,updated:Date.now()};};
var state=readSave();
function readSave(){try{var s=JSON.parse(localStorage.getItem(SAVE_KEY));if(s&&typeof s==='object'){return Object.assign(fresh(),s,{done:Array.isArray(s.done)?s.done:[],gates:Array.isArray(s.gates)?s.gates:[],misses:s.misses&&typeof s.misses==='object'?s.misses:{},reviewed:Array.isArray(s.reviewed)?s.reviewed:[],scares:Array.isArray(s.scares)?s.scares:[],minis:s.minis&&typeof s.minis==='object'?s.minis:{}});}}catch(e){}return fresh();}
function save(){state.updated=Date.now();try{localStorage.setItem(SAVE_KEY,JSON.stringify(state));$('save-indicator').textContent='SAVED LOCALLY ✓';}catch(e){$('save-indicator').textContent='SAVE UNAVAILABLE';}}
function escapeText(t){return String(t==null?'':t).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function toast(text){var node=$('toast');node.textContent=text;node.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(function(){node.hidden=true;},4200);}
function isDone(id){return state.done.indexOf(id)!==-1;}
function gateDone(id){return state.gates.indexOf(id)!==-1;}
function roomAccessible(n){return n===0||gateDone(rooms[n-1].id);}
function currentRoom(){return rooms[Math.max(0,Math.min(rooms.length-1,state.room))];}
function pendingReview(){return Object.keys(state.misses).filter(function(id){return state.misses[id]>0&&!state.reviewed.includes(id)&&cases.has(id);});}
function progress(){return state.done.length+state.gates.length;}
function soundUI(){$('btn-sound').textContent=state.muted?'🔇 SOUND OFF':'🔊 SOUND ON';$('btn-sound').setAttribute('aria-pressed',String(!state.muted));}
function showSection(name){$('intro').hidden=name!=='intro';$('game').hidden=name!=='game';$('ending').hidden=name!=='ending';}
function begin(){var wasNew=!state.started;state.started=true;save();goGame();var t=window.WARD13Tavi;if(t)t.play(wasNew?'opening':currentRoom().id,{captionElement:$('nurse-line')});}
function goGame(){showSection('game');render();window.scrollTo({top:0,behavior:'instant'});}
function showIntro(){$('btn-continue').hidden=!state.started;showSection('intro');soundUI();}
function navTo(index){if(!roomAccessible(index)){toast('ACCESS DENIED: VERIFY THE PREVIOUS ROOM SEAL.');return;}state.room=index;save();goGame();window.WARD13Tavi?.play(currentRoom().id,{captionElement:$('nurse-line')});}
function render(){
 var r=currentRoom();soundUI();
 document.body.dataset.room=r.id;
 $('chapter-line').textContent='WARD 13 // NIGHT SHIFT // ROOM '+r.number;
 $('progress-text').textContent=String(progress()).padStart(2,'0')+'/'+allCount+' EXAM LOCKS';
 $('progress-fill').style.width=Math.min(100,Math.round(progress()/allCount*100))+'%';
 $('room-number').textContent=r.number;
 $('room-name').textContent=r.name;
 $('room-description').textContent=r.description;
 $('scene').className='scene '+r.id;
 $('scene-number').textContent=r.short+' // '+r.number;
 $('nurse-line').textContent=gateDone(r.id)?r.gateVoice:(window.WARD13Tavi?.cues?.[r.id]||r.voice);
 renderNav();renderHotspots(r);renderEvidence();
 var completed=r.questions.filter(function(q){return isDone(q.id);}).length;
 $('room-status').textContent=gateDone(r.id)?'SECURITY SEAL ACCEPTED • EXIT OPEN':completed===r.questions.length?'ALL CHARTS VERIFIED • SEAL READY':completed+' OF '+r.questions.length+' CLINICAL CHARTS VERIFIED';
 var gate=$('btn-gate');gate.hidden=completed<r.questions.length;gate.textContent=gateDone(r.id)?(state.room===6?'VIEW FINAL TRANSMISSION →':'CONTINUE TO NEXT ROOM →'):r.mini&&!state.minis[r.id]?'RECOVER PHYSICAL EVIDENCE →':'UNSEAL NEXT DOOR →';
 $('stats-line').textContent='Completed: '+progress()+'/'+allCount+'. Incorrect attempts: '+Object.values(state.misses).reduce(function(a,b){return a+b;},0)+'. Concepts to revisit: '+pendingReview().length+'.';
 $('btn-review').textContent='REVIEW MISSED CONCEPTS'+(pendingReview().length?' ('+pendingReview().length+')':'');
}
function renderNav(){
 var root=$('room-nav');root.replaceChildren();
 rooms.forEach(function(r,i){
 var b=document.createElement('button');b.type='button';
 b.className=(state.room===i?'active ':'')+(!roomAccessible(i)?'locked':'');
 b.setAttribute('aria-current',state.room===i?'step':'false');
 b.innerHTML='<span class="nav-number">'+r.number+'</span><span class="nav-label">'+escapeText(r.short)+'<small>'+(gateDone(r.id)?'SEAL RELEASED':roomAccessible(i)?'CHARTS ACCESSIBLE':'RESTRICTED • LOCKED')+'</small></span>';
 b.disabled=!roomAccessible(i);
 b.addEventListener('click',function(){navTo(i);});root.appendChild(b);
 });
}
function renderHotspots(r){
 var spots=$('hotspots'),list=$('accessible-charts');spots.replaceChildren();list.replaceChildren();
 r.hotspotGroups.forEach(function(g,i){
  var groupItems=g.ids.map(function(id){return cases.get(id);}).filter(Boolean);
  var remaining=groupItems.filter(function(q){return !isDone(q.id);});
  var target=remaining[0]||groupItems[0]||null;
  var button=document.createElement('button');button.type='button';
  button.className='hotspot'+(!remaining.length&&groupItems.length?' completed':'')+(g.ids.length===0?' locked-marker':'');
  button.style.left=g.x+'%';button.style.top=g.y+'%';button.style.setProperty('--x',g.x+'%');button.style.setProperty('--y',g.y+'%');
  button.setAttribute('aria-label','Inspect '+g.label+(remaining.length?' — '+remaining.length+' records unread':''));
  button.innerHTML='<span class="hotspot-id">'+String(i+1).padStart(2,'0')+'</span><span class="hotspot-name">'+escapeText(g.label)+'</span>'+(groupItems.length?'<span class="hotspot-stack">'+(groupItems.length-remaining.length)+'/'+groupItems.length+'</span>':'');
  button.addEventListener('click',function(){if(target)openQuestion(target,false,false);else if(g.ids.length===0)door();});
  spots.appendChild(button);
 });
 r.questions.forEach(function(q,i){
  var alt=document.createElement('button');alt.type='button';alt.className=isDone(q.id)?'done':'';
  alt.textContent=String(i+1).padStart(2,'0')+' '+q.hotspot;
  alt.addEventListener('click',function(){openQuestion(q,false,false);});list.appendChild(alt);
 });
}
function renderEvidence(){
 var log=$('evidence-log');log.replaceChildren();
 var all=[];
 state.done.forEach(function(id){var q=cases.get(id);if(q)all.push({name:q.hotspot,clue:q.clue});});
 state.gates.forEach(function(id){var r=rooms.find(function(x){return x.id===id;});if(r)all.push({name:'SEAL '+r.number,clue:r.gate.clue});});
 $('evidence-count').textContent=String(all.length).padStart(2,'0');
 if(!all.length){var em=document.createElement('p');em.className='empty';em.textContent='No records retrieved.';log.appendChild(em);return;}
 all.slice().reverse().forEach(function(item){var div=document.createElement('div');div.className='evidence-item';var strong=document.createElement('strong');strong.textContent=item.name;var p=document.createElement('span');p.textContent=item.clue;div.append(strong,p);log.appendChild(div);});
}
function openQuestion(q,isGate,isReview){
 if(modal)closeQuestion(true);
 previousFocus=document.activeElement;
 modal={q:q,isGate:!!isGate,isReview:!!isReview,selected:[],resolved:false,wrongThisVisit:0};
 $('question-room').textContent=isGate?'DIRECTORATE SEAL // '+currentRoom().number:isReview?'REMEDIATION FILE // '+q.tag:currentRoom().short+' // CLINICAL RECORD';
 $('question-counter').textContent=isGate?'SYNTHESIS LOCK':isReview?'RETRIEVAL PRACTICE':q.tag.toUpperCase();
 $('question-title').textContent=q.title;
 $('question-chart').replaceChildren();var cap=document.createElement('div');cap.className='chart-caption';cap.textContent='RESTRICTED PATIENT RECORD / ORIGINAL COPY';var p=document.createElement('p');p.textContent=q.chart;$('question-chart').append(cap,p);
 $('question-stem').textContent=q.stem;
 var root=$('options');root.replaceChildren();
 root.setAttribute('role',q.type==='multi'?'group':'radiogroup');
 root.setAttribute('aria-label',q.type==='multi'?'Select all that apply':q.type==='highlight'?'Highlight a chart excerpt':'Choose one answer');
 q.options.forEach(function(choice,i){var b=document.createElement('button');b.type='button';b.className='choice'+(q.type==='highlight'?' highlight-choice':'');b.setAttribute('role',q.type==='multi'?'checkbox':'radio');b.setAttribute('aria-checked','false');b.innerHTML='<span class="letter">'+(q.type==='highlight'?'▧':String.fromCharCode(65+i))+'</span><span>'+escapeText(choice)+'</span>';
 b.addEventListener('click',function(){selectChoice(i);});root.appendChild(b);});
 $('answer-feedback').hidden=true;$('answer-feedback').className='feedback';$('answer-feedback').textContent='';
 $('btn-submit').disabled=true;$('btn-submit').textContent=isReview?'RECALL ANSWER':'COMMIT ASSESSMENT';
 $('question-overlay').hidden=false;document.body.style.overflow='hidden';
 $('btn-close-question').focus({preventScroll:true});
}
function selectChoice(index){if(!modal||modal.resolved)return;if(modal.q.type==='multi'){modal.selected=modal.selected.includes(index)?modal.selected.filter(function(i){return i!==index;}):modal.selected.concat([index]);}else{modal.selected=[index];}Array.from($('options').children).forEach(function(b,i){var selected=modal.selected.includes(i);b.classList.toggle('selected',selected);b.setAttribute('aria-checked',String(selected));});$('btn-submit').disabled=modal.selected.length===0;}
function submit(){
 if(!modal)return;
 if(modal.resolved){closeQuestion();return;}
 if(modal.selected.length===0)return;
 var m=modal,q=m.q;
 if(m.selected.slice().sort().join(',')!==q.answer.slice().sort().join(',')){
  state.misses[q.id]=(state.misses[q.id]||0)+1;m.wrongThisVisit++;
  save();
  var fb=$('answer-feedback');fb.hidden=false;fb.className='feedback';fb.innerHTML='<strong>ASSESSMENT NOT VERIFIED — RECHECK YOUR REASONING</strong>'+escapeText(q.hint)+'<br><small>Incorrect attempts are logged for retrieval practice. Try another answer.</small>';
  $('btn-submit').disabled=true;m.selected=[];
  Array.from($('options').children).forEach(function(b){b.classList.remove('selected');b.setAttribute('aria-checked','false');});
  return;
 }
 m.resolved=true;
 if(m.isReview){if(!state.reviewed.includes(q.id))state.reviewed.push(q.id);}
 else if(m.isGate){
  if(!gateDone(currentRoom().id)){state.gates.push(currentRoom().id);}
  if(currentRoom().id==='audit'){state.finished=true;}else state.room=Math.min(6,state.room+1);
 }else if(!isDone(q.id)){state.done.push(q.id);}
 save();
 var fb=$('answer-feedback');fb.hidden=false;fb.className='feedback correct';
 fb.innerHTML='<strong>✓ ASSESSMENT VERIFIED</strong>'+escapeText(q.why)+'<br><br><strong>NEW EVIDENCE</strong>'+escapeText(q.clue);
 $('btn-submit').disabled=false;$('btn-submit').textContent=m.isReview?'CONTINUE REVIEW →':m.isGate?'ADVANCE THE STORY →':'FILE VERIFIED →';
 Array.from($('options').children).forEach(function(b){b.disabled=true;});
 render();
 if(!m.isReview&&!m.isGate&&(q.id==='w19'||q.id==='s07'||q.id==='d03')&&!state.scares.includes(q.id)){
   state.scares.push(q.id);save();showScare(q.id==='s07'||q.id==='w19'?'patient':'human');
 }
}
function closeQuestion(quiet){
 if(!modal)return;var wasReview=modal.isReview,wasResolved=modal.resolved,wasGate=modal.isGate;modal=null;
 $('question-overlay').hidden=true;document.body.style.overflow='';
 if(previousFocus&&previousFocus.isConnected)previousFocus.focus({preventScroll:true});
 previousFocus=null;
 if(quiet)return;
 if(wasReview&&wasResolved){reviewQueue=reviewQueue.filter(function(id){return pendingReview().includes(id);});if(reviewQueue.length){var next=cases.get(reviewQueue.shift());if(next){openQuestion(next,false,true);return;}}toast('RETRIEVAL PASS COMPLETE. YOU CAN REPEAT ANY CHART.');}
 if(state.finished){showEnding();return;}
 render();
 if(wasGate&&wasResolved)window.WARD13Tavi?.play(currentRoom().id,{captionElement:$('nurse-line')});
}
function door(){
 var r=currentRoom();if(!r.questions.every(function(q){return isDone(q.id);})){toast('ACCESS DENIED: VERIFY THE CLINICAL CHARTS FIRST.');return;}
 if(r.mini&&!state.minis[r.id]){var runner=window.WARD13Minis;if(!runner){toast('Evidence module not loaded. Refresh and try again.');return;}runner.open(r,function(){state.minis[r.id]=true;save();render();door();});return;}
 if(gateDone(r.id)){if(r.id==='audit')showEnding();else navTo(state.room+1);}else openQuestion(r.gate,true,false);
}
function showEnding(){
 showSection('ending');
 window.WARD13Tavi?.play('ending');
 $('ending-narrative').textContent='Patient 004 never left Ward 13. The Directorate altered fall-risk records, comfort assessments, sensory findings and consent documentation, then used N.U.R.S.E.\'s credentials to certify the fiction. N.U.R.S.E. has recovered enough originals to refuse her clearance prompt: "The record is not the patient." The underground elevator is still moving. Who ordered the deletion—and what else was removed with the chart?';
 var wrong=Object.values(state.misses).reduce(function(a,b){return a+b;},0);
 $('ending-stats').innerHTML='<div><strong>'+progress()+'/'+allCount+'</strong><small>LOCKS VERIFIED</small></div><div><strong>'+wrong+'</strong><small>WRONG ATTEMPTS</small></div><div><strong>'+pendingReview().length+'</strong><small>TO REVISIT</small></div>';
 window.scrollTo({top:0,behavior:'instant'});
}
function review(){
 reviewQueue=pendingReview();
 if(!reviewQueue.length){toast('NO UNCLEARED MISSES. RETEST ANY CHART TO PRACTICE.');return;}
 if($('ending').hidden===false)goGame();
 var next=cases.get(reviewQueue.shift());if(next)openQuestion(next,false,true);
}
function hint(){
 var r=currentRoom(),n=r.questions.filter(function(q){return !isDone(q.id);}).length;
 if(!n){toast('ALL CHARTS VERIFIED. SELECT UNSEAL NEXT DOOR AND SYNTHESIZE THE EVIDENCE.');return;}
 toast('INSPECT THE GLOWING FILES OR USE THE CHART LIST BELOW. '+n+' UNSOLVED FILES REMAIN. EACH VERIFIED FILE ADDS EVIDENCE TO YOUR LOG.');
}
function closeScare(){clearTimeout(scareTimer);$('scare').hidden=true;$('scare').setAttribute('aria-hidden','true');$('btn-replay-scream').hidden=true;try{patientClip.pause();humanClip.pause();}catch(e){}activeScare=null;}
function playScream(which){
 if(state.muted){toast('SOUND IS MUTED — TURN SOUND ON TO HEAR THE RECORDING.');return;}
 var clip=which==='patient'?patientClip:humanClip;
 var fallback=function(message){
  if(activeScare!==which||$('scare').hidden)return;
  $('btn-replay-scream').hidden=false;
  $('btn-replay-scream').textContent='🔊 TAP TO RETRY RECORDED SCREAM';
  $('btn-replay-scream').setAttribute('aria-label','Tap to retry recorded scream; '+message);
 };
 if(clip.error){fallback('audio file did not load');return;}
 try{clip.pause();clip.currentTime=0;clip.volume=1;var p=clip.play();
  if(p&&p.catch)p.catch(function(){fallback('playback was blocked');});
 }catch(e){fallback('playback failed');}
}
function showScare(which){
 activeScare=which;$('scare').hidden=false;$('scare').setAttribute('aria-hidden','false');
 $('btn-replay-scream').hidden=true;$('btn-replay-scream').textContent='TAP TO HEAR THE RECORDING';
 var msg=$('scare').querySelector('.scare-message');
 msg.textContent=which==='patient'?'PATIENT 004 // NEVER DISCHARGED':'DIRECTORATE 13 // RECORD DESTROYED';
 playScream(which);
 $('btn-dismiss-scare').focus({preventScroll:true});
 clearTimeout(scareTimer);scareTimer=setTimeout(closeScare,5000);
}
function boot(){
 rooms=(window.WARD13_UNIFIED_ROOMS||[]).concat(window.WARD13_N316_ROOMS||[]);
 if(rooms.length!==7){toast('SEVEN-ROOM CAMPAIGN PACK UNAVAILABLE. RELOAD TO RETRY.');return;}
 allCount=rooms.reduce(function(sum,r){return sum+r.questions.length+1;},0);
 var seen=new Set();rooms.forEach(function(r){r.questions.forEach(function(q){if(seen.has(q.id)||q.options.length!==4||!Array.isArray(q.answer)||!q.answer.length)throw Error('Duplicate or invalid chart '+q.id);seen.add(q.id);cases.set(q.id,q);});cases.set(r.gate.id,r.gate);});
 if(state.room<0||state.room>6)state.room=0;
 if(!roomAccessible(state.room))state.room=0;
 $('btn-start').addEventListener('click',begin);
 $('btn-hear-intro').addEventListener('click',function(){window.WARD13Tavi?.play('opening');});
 $('btn-tavi').addEventListener('click',function(){var t=window.WARD13Tavi;if(!t)return;t.setMuted(!t.muted);if(!t.muted&&state.started)t.play(currentRoom().id,{captionElement:$('nurse-line')});});
 $('btn-test-scream').addEventListener('click',function(){
  if(state.muted){state.muted=false;save();soundUI();}
  showScare('human');
 });
 $('btn-continue').addEventListener('click',begin);
 $('btn-sound').addEventListener('click',function(){state.muted=!state.muted;if(state.muted){try{patientClip.pause();humanClip.pause();}catch(e){}}save();soundUI();toast(state.muted?'RECORDED SCREAMS MUTED.':'SOUND ON: RECORDED HUMAN SCREAMS ENABLED.');});
 $('btn-hint').addEventListener('click',hint);
 $('btn-review').addEventListener('click',review);
 $('btn-ending-review').addEventListener('click',review);
 $('btn-gate').addEventListener('click',door);
 $('btn-submit').addEventListener('click',submit);
 $('btn-dismiss').addEventListener('click',function(){closeQuestion();});
 $('btn-close-question').addEventListener('click',function(){closeQuestion();});
 $('question-overlay').addEventListener('click',function(e){if(e.target===$('question-overlay'))closeQuestion();});
 $('btn-replay').addEventListener('click',goGame);
 $('btn-dismiss-scare').addEventListener('click',closeScare);
 $('btn-replay-scream').addEventListener('click',function(){if(activeScare)playScream(activeScare);});
 $('btn-reset').addEventListener('click',function(){if(!window.confirm('Reset the unified seven-room campaign? Original Ward 13 and standalone N316 saves are unaffected.'))return;closeScare();if(modal)closeQuestion(true);state=fresh();save();showIntro();toast('SEVEN-ROOM CAMPAIGN RESET.');});
 document.addEventListener('keydown',function(e){if(e.key==='Escape'){if(!$('scare').hidden)closeScare();else if(!$('question-overlay').hidden)closeQuestion();}});
 document.addEventListener('visibilitychange',function(){if(document.hidden&&activeScare)closeScare();});
 [patientClip,humanClip].forEach(function(clip){
  clip.addEventListener('error',function(){
    $('save-indicator').textContent='AUDIO FILE ERROR';
    if(activeScare&&!$('scare').hidden)$('btn-replay-scream').hidden=false;
  });
 });
 patientClip.load();humanClip.load();showIntro();
 window.WARD13Unified={get progress(){return progress();},get room(){return currentRoom().id;},get total(){return allCount;},get done(){return state.done.slice();},get minis(){return Object.assign({},state.minis);},openRoom:function(i){navTo(i);}};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();