/* WARD 13 N316: three optional tactile logic puzzles, touch and keyboard first.
   Maze, memory pairs, and 3x3 tap/drag swap image reconstruction.
   These puzzles are not required to unlock exam content. */
(()=>{'use strict';
const KEY='ward13.minigames.n316.v1';
const defs={
 maze:{title:'Safe Transfer Route',room:'REFLEX THEATRE',lead:'Find the powered lift, reach the patient, then exit via the supervised corridor. Avoid the restricted zones.',reward:'Original transfer route required a powered lift. The revised incident report claims no equipment was needed.'},
 memory:{title:'The Silent Matching Archive',room:'SILENT GALLERY',lead:'Match an assessment with its corresponding nursing response. Four pairs restore a missing clinical transcript.',reward:'The sensory assessment was recorded without the aids prescribed for this patient; the final chart falsely called it normal.'},
 jigsaw:{title:'Reassemble the Original Record',room:'DIRECTORATE SUBLEVEL',lead:'Nine fragments of an original records photograph were scrambled. Tap two pieces to swap their positions, or drag using a mouse.',reward:'Restored photo: the bed was occupied after the electronic discharge timestamp. The record was intentionally changed.'}
};
const root=document.createElement('div');root.id='ward13-minigame';root.hidden=true;
root.innerHTML='<div class="wg-overlay"><section class="wg-panel" role="dialog" aria-modal="true" aria-labelledby="wg-title"><button class="wg-close" type="button" aria-label="Close mini-game">✕</button><div class="wg-kicker" id="wg-kicker"></div><h2 id="wg-title"></h2><p id="wg-intro"></p><div id="wg-body"></div><p id="wg-message" role="status" aria-live="polite"></p><div class="wg-actions"><button type="button" id="wg-hint">? CLUE</button><button type="button" id="wg-reset">↻ RESET THIS PUZZLE</button><button type="button" id="wg-close-bottom">RETURN TO EXAM</button></div></section></div>';
document.body.appendChild(root);
const $=id=>root.querySelector('#'+id);
let storage;try{storage=JSON.parse(localStorage.getItem(KEY))||{};}catch(e){storage={};}
if(!storage.done||typeof storage.done!=='object')storage.done={};
let current=null,active=null,previousFocus=null;
function save(){try{localStorage.setItem(KEY,JSON.stringify(storage));}catch(e){}}
function message(s){$('wg-message').textContent=s;}
function close(){root.hidden=true;current=null;active=null;if(previousFocus?.isConnected)previousFocus.focus({preventScroll:true});previousFocus=null;document.body.style.overflow='';}
function completed(type){return !!storage.done[type];}
function finish(type){
 storage.done[type]=true;save();
 const reward=document.createElement('div');reward.className='wg-win';
 const title=document.createElement('strong');title.textContent='✓ EVIDENCE RESTORED';
 const body=document.createElement('span');body.textContent=defs[type].reward;
 reward.append(title,body);$('wg-body').replaceChildren(reward);
 message('This clue will remain in your evidence memory after you close the puzzle.');
 window.dispatchEvent(new CustomEvent('ward13:minigame-completed',{detail:{type,clue:defs[type].reward}}));
}
const MAZE=['S..#..','.#...#','..L...','.#.#..','...#.P','.#...E'];
function mazeSetup(){active={x:0,y:0,hasLift:false,hasPatient:false,bad:0,visited:new Set(['0,0']),steps:0};mazeRender();}
function mazeRender(){
 const board=document.createElement('div');board.className='wg-maze';
 board.setAttribute('role','img');board.setAttribute('aria-label','6 by 6 transfer route. Blocked paths striped; obtain lift, help patient, reach exit.');
 for(let row=0;row<6;row++)for(let col=0;col<6;col++){
  const ch=MAZE[row][col],cell=document.createElement('div');
  cell.className='wg-cell'+(ch==='#'?' wall':'')+(ch==='L'?' lift':'')+(ch==='P'?' patient':'')+(ch==='E'?' exit':'')+(active.visited.has(col+','+row)?' visited':'')+(active.x===col&&active.y===row?' current':'');
  cell.textContent=active.x===col&&active.y===row?'●':ch==='L'?'⚙':ch==='P'?'♿':ch==='E'?'⇥':ch==='#'?'×':'';
  board.appendChild(cell);
 }
 const controls=document.createElement('div');controls.className='wg-controls';
 [['↑',0,-1],['←',-1,0],['↓',0,1],['→',1,0]].forEach(([symbol,dx,dy])=>{
  const b=document.createElement('button');b.type='button';b.textContent=symbol;
  b.setAttribute('aria-label','Move '+({'↑':'up','←':'left','↓':'down','→':'right'}[symbol]));b.addEventListener('click',()=>mazeMove(dx,dy));controls.appendChild(b);
 });
 const caption=document.createElement('p');caption.className='wg-label';caption.textContent='LIFT: '+(active.hasLift?'✓':'NOT ACQUIRED')+'  •  PATIENT: '+(active.hasPatient?'✓':'NOT REACHED')+'  •  STEPS: '+active.steps;
 $('wg-body').replaceChildren(board,controls,caption);
}
function mazeMove(dx,dy){
 if(current!=='maze'||completed('maze'))return;
 const x=active.x+dx,y=active.y+dy;
 if(x<0||x>=6||y<0||y>=6||MAZE[y][x]==='#'){active.bad++;message('Blocked corridor. Find another way.');return;}
 const tile=MAZE[y][x];
 if(tile==='P'&&!active.hasLift){active.bad++;message('Unsafe. Obtain the powered patient lift before the transfer.');return;}
 if(tile==='E'&&!active.hasPatient){active.bad++;message('The patient has not reached the discharge route.');return;}
 active.x=x;active.y=y;active.steps++;active.visited.add(x+','+y);
 if(tile==='L'&&!active.hasLift){active.hasLift=true;message('Powered lift collected. Find the patient.');}
 else if(tile==='P'&&!active.hasPatient){active.hasPatient=true;message('Patient transfer supported. Find the monitored exit.');}
 else if(tile==='E'&&active.hasPatient){finish('maze');return;}
 else message('');
 mazeRender();
}
const PAIRS=[
 ['Hearing barrier','Check hearing aids and reduce noise'],
 ['Sensory deprivation','Restore orientation cues and social contact'],
 ['Sudden inattention','Evaluate potentially reversible delirium'],
 ['Pain without words','Assess guarding, expression and behavior']
];
const ORDER=[3,6,1,7,0,4,2,5];
function memorySetup(){active={cards:ORDER.map(n=>({pair:Math.floor(n/2),side:n%2})),flipped:[],matched:new Set(),attempts:0,blocked:false};memoryRender();}
function memoryRender(){
 const grid=document.createElement('div');grid.className='wg-memory';
 active.cards.forEach((card,i)=>{
  const show=active.flipped.includes(i)||active.matched.has(card.pair);
  const b=document.createElement('button');b.type='button';b.className=show?(active.matched.has(card.pair)?'matched':'face'):'down';
  b.setAttribute('aria-label',show?PAIRS[card.pair][card.side]:'Hidden assessment '+(i+1));
  b.textContent=show?PAIRS[card.pair][card.side]:'RECORD '+String(i+1).padStart(2,'0');
  b.addEventListener('click',()=>flip(i));grid.appendChild(b);
 });
 const cap=document.createElement('div');cap.className='wg-label';cap.textContent='MATCHED: '+active.matched.size+'/4  •  ATTEMPTS: '+active.attempts;
 $('wg-body').replaceChildren(grid,cap);
}
function flip(i){
 if(current!=='memory'||active.blocked||active.matched.has(active.cards[i].pair)||active.flipped.includes(i))return;
 active.flipped.push(i);
 if(active.flipped.length===2){
  active.attempts++;const [a,b]=active.flipped;
  if(active.cards[a].pair===active.cards[b].pair){
   active.matched.add(active.cards[a].pair);active.flipped=[];message('Correct association.');
   if(active.matched.size===4){finish('memory');return;}
  }else{
   active.blocked=true;message('Different concepts. Look at both cards before trying again.');
   memoryRender();
   setTimeout(()=>{if(current!=='memory'||!active)return;active.flipped=[];active.blocked=false;memoryRender();},750);return;
  }
 }else message('Choose the matching intervention or assessment.');
 memoryRender();
}
const START_ORDER=[4,0,8,6,2,5,1,7,3];
function jigsawSetup(){active={order:START_ORDER.slice(),selected:null,moves:0};jigsawRender();}
function jigsawRender(){
 const label=document.createElement('div');label.className='wg-label';label.textContent='9 FRAGMENTS  •  MOVES: '+active.moves+'  •  TAP TWO TILES TO SWAP';
 const board=document.createElement('div');board.className='wg-jigsaw';board.setAttribute('role','group');board.setAttribute('aria-label','9-piece image reconstruction puzzle');
 active.order.forEach((piece,i)=>{
  const b=document.createElement('button');b.type='button';b.draggable=true;b.className=active.selected===i?'selected':'';
  b.style.backgroundPosition=(piece%3*50)+'% '+(Math.floor(piece/3)*50)+'%';
  b.setAttribute('aria-label','Photograph fragment '+(piece+1)+' in position '+(i+1));
  b.addEventListener('click',()=>jigsawSwap(i));
  b.addEventListener('dragstart',e=>{e.dataTransfer?.setData('text/plain',String(i));});
  b.addEventListener('dragover',e=>e.preventDefault());
  b.addEventListener('drop',e=>{e.preventDefault();const from=Number(e.dataTransfer?.getData('text/plain'));if(Number.isInteger(from)&&from>=0&&from<9&&from!==i){active.selected=from;jigsawSwap(i);}});
  board.appendChild(b);
 });
 $('wg-body').replaceChildren(label,board);
}
function jigsawSwap(i){
 if(current!=='jigsaw'||completed('jigsaw'))return;
 if(active.selected===null){active.selected=i;message('Select the destination position for the fragment.');jigsawRender();return;}
 if(active.selected===i){active.selected=null;message('Selection cleared.');jigsawRender();return;}
 [active.order[i],active.order[active.selected]]=[active.order[active.selected],active.order[i]];active.moves++;active.selected=null;
 if(active.order.every((piece,j)=>piece===j)){finish('jigsaw');return;}
 message('Align the original room geometry to reassemble the photograph.');jigsawRender();
}
function hint(){
 if(current==='maze')message('The powered lift is in the middle-left. Find it before approaching the patient in the lower-right.');
 else if(current==='memory')message('Each pair combines a patient observation with the nursing response that addresses it.');
 else if(current==='jigsaw')message('Start with the corner pieces, then align door frames and floor lines across adjacent tiles.');
}
function open(type){
 if(!Object.prototype.hasOwnProperty.call(defs,type))return;
 previousFocus=document.activeElement;current=type;
 const d=defs[type];$('wg-kicker').textContent='WARD 13 / '+d.room+' / OPTIONAL EVIDENCE PUZZLE';$('wg-title').textContent=d.title;$('wg-intro').textContent=d.lead;
 root.hidden=false;document.body.style.overflow='hidden';message('');
 if(completed(type)){finish(type);}else if(type==='maze')mazeSetup();else if(type==='memory')memorySetup();else jigsawSetup();
 root.querySelector('.wg-close').focus({preventScroll:true});
}
root.querySelector('.wg-close').addEventListener('click',close);
$('wg-close-bottom').addEventListener('click',close);
$('wg-hint').addEventListener('click',hint);
$('wg-reset').addEventListener('click',()=>{if(!current)return;storage.done[current]=false;save();open(current);});
root.querySelector('.wg-overlay').addEventListener('click',e=>{if(e.target===root.querySelector('.wg-overlay'))close();});
document.addEventListener('keydown',e=>{
 if(root.hidden)return;
 if(e.key==='Escape'){close();return;}
 if(current==='maze'){
  const v={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]}[e.key];
  if(v){e.preventDefault();mazeMove(...v);}
 }
});
window.WARD13Minigames={open,close,completed,defs,get current(){return current;},get state(){return storage;},get debug(){return active;}};
})();
