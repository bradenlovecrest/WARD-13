/* WARD 13 / FOUR PHYSICAL EVIDENCE PUZZLES
 * Mobile and keyboard accessible; no random softlocks; each mini has a deterministic, testable solution.
 * Real nine-piece image-cut jigsaw (canvas clipping with mating tabs/notches), memory, chronological logic, maze. */
(()=>{'use strict';
const $=id=>document.getElementById(id),root=$('mini-overlay'),view=$('mini-content');
let current=null,done=null,miniState=null,picture=null,update=null,check=null,cleanup=null;
const JIGSAW_SRC='./assets/n316-firstwing-photo.webp';
function shuffle(a){const n=a.slice();for(let i=n.length-1;i>0;i--){let j=(i*7+3)%(i+1);[n[i],n[j]]=[n[j],n[i]];}if(n.every((x,i)=>x===i))return n.reverse();return n;}
function feedback(t,good=false){const p=$('mini-feedback');p.textContent=t;p.className='mini-feedback'+(good?' good':'');}
function button(label,fn,className){const el=document.createElement('button');el.type='button';el.className=className||'mini-btn';el.textContent=label;el.addEventListener('click',fn);return el;}
function finish(){const cb=done;close();if(cb)cb();}
function close(){if(cleanup){cleanup();cleanup=null;}root.hidden=true;document.body.classList.remove('mini-open');document.body.style.overflow='';current=null;done=null;miniState=null;update=check=null;}
function open(room,completed){
 if(current)close();current=room;done=completed;
 root.hidden=false;document.body.classList.add('mini-open');document.body.style.overflow='hidden';
 $('mini-heading').textContent=room.miniTitle;$('mini-description').textContent=room.miniNote;
 feedback('');view.replaceChildren();
 if(room.mini==='jigsaw')jigsaw();
 else if(room.mini==='memory')memory();
 else if(room.mini==='logic')logic();
 else if(room.mini==='maze')maze();
 else{feedback('This evidence reconstruction is unavailable.');}
 $('mini-check').focus({preventScroll:true});
}
function jigsaw(){
 // 3x3 fragments: 84px body with 16px tabs. Each side of an adjacent pair is complementary.
 const sz=84,pad=17,side=sz+2*pad;
 miniState={slots:Array(9).fill(null),selected:null,drag:null,order:shuffle([0,1,2,3,4,5,6,7,8])};
 const layout=document.createElement('div');layout.className='jigsaw-layout';const original=document.createElement('div');original.className='jigsaw-reference';
 original.innerHTML='<h3>RECOVERED REFERENCE</h3><img src="'+JIGSAW_SRC+'" alt="Recovered admission photograph reference (damaged, low contrast)" loading="eager"><p>Rebuild the evidence before the Directorate deletes the source file.</p>';
 const boardWrap=document.createElement('div');boardWrap.className='puzzle-board-wrap';boardWrap.innerHTML='<h3>PHOTO ASSEMBLY / 3 × 3</h3>';const board=document.createElement('div');board.className='jigsaw-board';board.setAttribute('aria-label','Nine-slot photo assembly board');
 board.style.width=(sz*3)+'px';board.style.height=(sz*3)+'px';boardWrap.appendChild(board);
 const trayWrap=document.createElement('div');trayWrap.className='puzzle-tray-wrap';trayWrap.innerHTML='<h3>UNPLACED FRAGMENTS</h3>';const tray=document.createElement('div');tray.className='jigsaw-tray';trayWrap.appendChild(tray);
 layout.append(original,boardWrap,trayWrap);view.appendChild(layout);
 function edgeOf(id,d){const r=Math.floor(id/3),c=id%3;
 if(d==='top'){if(r===0)return 0;return -edgeOf(id-3,'bottom');}
 if(d==='left'){if(c===0)return 0;return -edgeOf(id-1,'right');}
 if(d==='right')return c===2?0:(r+c)%2?1:-1;
 return r===2?0:(r*3+c)%2?1:-1;
 }
 function draw(canvas,id){const ctx=canvas.getContext('2d');canvas.width=side;canvas.height=side;
 const top=edgeOf(id,'top'),right=edgeOf(id,'right'),bottom=edgeOf(id,'bottom'),left=edgeOf(id,'left');
 const a=pad,b=pad+sz,n=13,mid=sz/2;
 ctx.beginPath();ctx.moveTo(a,a);
 ctx.lineTo(a+mid-16,a);
 if(top){ctx.bezierCurveTo(a+mid-15,a-15*top,a+mid-7,a-17*top,a+mid,a-17*top);ctx.bezierCurveTo(a+mid+7,a-17*top,a+mid+15,a-15*top,a+mid+16,a);}
 ctx.lineTo(b,a);ctx.lineTo(b,a+mid-16);
 if(right){ctx.bezierCurveTo(b+15*right,a+mid-15,b+17*right,a+mid-7,b+17*right,a+mid);ctx.bezierCurveTo(b+17*right,a+mid+7,b+15*right,a+mid+15,b,a+mid+16);}
 ctx.lineTo(b,b);ctx.lineTo(a+mid+16,b);
 if(bottom){ctx.bezierCurveTo(a+mid+15,b+15*bottom,a+mid+7,b+17*bottom,a+mid,b+17*bottom);ctx.bezierCurveTo(a+mid-7,b+17*bottom,a+mid-15,b+15*bottom,a+mid-16,b);}
 ctx.lineTo(a,b);ctx.lineTo(a,a+mid+16);
 if(left){ctx.bezierCurveTo(a-15*left,a+mid+15,a-17*left,a+mid+7,a-17*left,a+mid);ctx.bezierCurveTo(a-17*left,a+mid-7,a-15*left,a+mid-15,a,a+mid-16);}
 ctx.closePath();ctx.save();ctx.clip();
 if(picture?.complete&&picture.naturalWidth){let r=Math.floor(id/3),c=id%3;const scale=sz*3;ctx.drawImage(picture,a-c*sz,a-r*sz,scale,scale);}else{ctx.fillStyle=['#384b4a','#5e4848','#334148'][id%3];ctx.fillRect(0,0,side,side);}
 ctx.restore();ctx.strokeStyle='#f7e8cc';ctx.lineWidth=2;ctx.shadowColor='#000';ctx.shadowBlur=5;ctx.stroke();
 }
 function select(id){miniState.selected=id;feedback('Fragment selected. Place it into a square of the assembly board.');render();}
 function place(pos,id){
  if(id===null||id===undefined){if(miniState.slots[pos]!==null){miniState.selected=miniState.slots[pos];miniState.slots[pos]=null;render();}return;}
  const old=miniState.slots.indexOf(id);if(old>=0)miniState.slots[old]=null;
  if(miniState.slots[pos]!==null&&miniState.slots[pos]!==id)miniState.selected=miniState.slots[pos];else miniState.selected=null;
  miniState.slots[pos]=id;render();
 }
 function render(){
  board.replaceChildren();tray.replaceChildren();
  miniState.slots.forEach((id,pos)=>{
   const cell=document.createElement('button');cell.type='button';cell.className='jigsaw-slot';cell.setAttribute('aria-label','Place selected fragment into slot '+(pos+1));cell.style.left=(pos%3*sz)+'px';cell.style.top=(Math.floor(pos/3)*sz)+'px';cell.style.width=sz+'px';cell.style.height=sz+'px';
   cell.addEventListener('click',()=>place(pos,miniState.selected));
   cell.addEventListener('dragover',e=>e.preventDefault());cell.addEventListener('drop',e=>{e.preventDefault();let id=Number(e.dataTransfer.getData('text/plain'));if(Number.isInteger(id)&&id>=0&&id<9)place(pos,id);});
   if(id!==null){const cvs=document.createElement('canvas');cvs.className='jigsaw-piece';cvs.style.width=side+'px';cvs.style.height=side+'px';cvs.style.left=(-pad)+'px';cvs.style.top=(-pad)+'px';draw(cvs,id);cell.appendChild(cvs);}
   board.appendChild(cell);
  });
  const placed=new Set(miniState.slots.filter(x=>x!==null));
  miniState.order.filter(id=>!placed.has(id)).forEach(id=>{
   const tile=document.createElement('button');tile.type='button';tile.className='jigsaw-tile'+(miniState.selected===id?' active':'');tile.draggable=true;tile.setAttribute('aria-label','Loose photograph fragment');
   const cvs=document.createElement('canvas');cvs.className='jigsaw-piece';draw(cvs,id);tile.appendChild(cvs);
   tile.addEventListener('click',()=>select(id));tile.addEventListener('dragstart',e=>e.dataTransfer.setData('text/plain',String(id)));
   tray.appendChild(tile);
  });
 }
 update=render;check=()=>{const complete=miniState.slots.every((id,i)=>id===i);if(complete){feedback('Admission photo reconstructed. Metadata recovered.',true);finish();}
 else{const right=miniState.slots.filter((id,i)=>id===i).length;feedback('The fragments do not align yet. '+right+' of 9 positions match the original photograph.');}};
 picture=new Image();picture.onload=()=>{if(current?.mini==='jigsaw')render();};picture.src=JIGSAW_SRC;
 render();
}
function memory(){
 const pairs=[['PQRST','Structured pain history'],['SHEAR','Deeper tissues shift against skin'],['IADLs','Shopping and medication management'],['REFERRED PAIN','Felt away from the affected organ']];
 const items=shuffle(pairs.flatMap(([a,b],i)=>[{text:a,pair:i},{text:b,pair:i}]));
 miniState={flipped:[],matched:new Set(),pending:false};const grid=document.createElement('div');grid.className='memory-grid';view.appendChild(grid);
 let timeout=null;
 function flip(i){
  const st=miniState;if(st.pending||st.matched.has(items[i].pair)&&!st.flipped.includes(i)||st.flipped.includes(i))return;
  st.flipped.push(i);render();
  if(st.flipped.length===2){
   if(items[st.flipped[0]].pair===items[st.flipped[1]].pair){st.matched.add(items[i].pair);st.flipped=[];feedback(st.matched.size+' of 4 evidence pairs recovered.',st.matched.size===4);render();}
   else{st.pending=true;timeout=setTimeout(()=>{if(current?.mini==='memory'){st.flipped=[];st.pending=false;render();}},900);}
  }
 }
 function render(){grid.replaceChildren();items.forEach((it,i)=>{let exposed=miniState.flipped.includes(i)||miniState.matched.has(it.pair);const b=button(exposed?it.text:'✦',()=>flip(i),'memory-card'+(exposed?' revealed':'')+(miniState.matched.has(it.pair)?' matched':''));b.setAttribute('aria-label',exposed?it.text:'Hidden card '+(i+1));b.disabled=miniState.matched.has(it.pair);grid.appendChild(b);});}
 cleanup=()=>clearTimeout(timeout);update=render;check=()=>{if(miniState.matched.size===4)finish();else feedback('Recover all four pairs before verifying. '+miniState.matched.size+' of 4 complete.');};render();
}
function logic(){
 const events=[
 '00:01 — Electronic record changed to DISCHARGED',
 '00:04 — Physical wristband 004 found in intake records',
 '00:11 — Bedside assessment contradicts the discharge',
 '00:13 — N.U.R.S.E. files an integrity protest'
 ];
 miniState={order:[2,0,3,1]};const list=document.createElement('ol');list.className='logic-list';view.appendChild(list);
 function move(i,d){const other=i+d;if(other<0||other>3)return;[miniState.order[i],miniState.order[other]]=[miniState.order[other],miniState.order[i]];render();}
 function render(){list.replaceChildren();miniState.order.forEach((id,i)=>{const li=document.createElement('li');li.className='logic-item';const label=document.createElement('span');label.textContent=events[id];const up=button('↑',()=>move(i,-1));const dn=button('↓',()=>move(i,1));up.disabled=i===0;dn.disabled=i===3;li.append(label,up,dn);list.appendChild(li);});}
 update=render;check=()=>{if(miniState.order.every((id,i)=>id===i)){feedback('Timeline verified. The discharge happened before the assessment.',true);finish();}else feedback('The chronology conflicts with the timestamps. Reorder the four records.');};render();
}
function maze(){
 const rows=['S......','.###.#.','...#...','##.#.##','...#...','.#...#.','...#..E'];
 const grid=rows.map(x=>x.split(''));miniState={x:0,y:0,steps:0,visited:new Set(['0,0'])};
 const host=document.createElement('div');host.className='maze-layout';const table=document.createElement('div');table.className='maze-grid';table.setAttribute('role','grid');host.appendChild(table);
 const pad=document.createElement('div');pad.className='maze-pad';for(const [glyph,dx,dy] of [['↑',0,-1],['←',-1,0],['↓',0,1],['→',1,0]]){const b=button(glyph,()=>move(dx,dy));b.setAttribute('aria-label',glyph==='↑'?'Move up':glyph==='↓'?'Move down':glyph==='←'?'Move left':'Move right');pad.appendChild(b);}host.appendChild(pad);view.appendChild(host);
 function move(dx,dy){let x=miniState.x+dx,y=miniState.y+dy;if(y<0||x<0||y>6||x>6||grid[y][x]==='#'){feedback('That route is sealed. Find another path.');return;}miniState.x=x;miniState.y=y;miniState.steps++;miniState.visited.add(x+','+y);feedback(x===6&&y===6?'Safe route reached. Verify evidence to unlock the door.':'Route progressed '+miniState.steps+' moves.');render();}
 function onKey(e){if(root.hidden||current?.mini!=='maze')return;const d={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]}[e.key];if(d){e.preventDefault();move(...d);}}
 document.addEventListener('keydown',onKey);
 cleanup=()=>document.removeEventListener('keydown',onKey);
 function render(){table.replaceChildren();grid.forEach((row,y)=>row.forEach((c,x)=>{const el=document.createElement('div');el.className='maze-cell'+(c==='#'?' wall':'')+(x===miniState.x&&y===miniState.y?' player':'')+(c==='E'?' exit':'')+(miniState.visited.has(x+','+y)?' visited':'');el.textContent=x===miniState.x&&y===miniState.y?'●':c==='E'?'BED 04':c==='#'?'▨':'';table.appendChild(el);}));}
 update=render;check=()=>{if(miniState.x===6&&miniState.y===6){feedback('Safe patient route verified.',true);finish();}else feedback('The destination is BED 04, marked in the southeast corner.');};render();
}
$('mini-check')?.addEventListener('click',()=>check?.());
$('mini-reset')?.addEventListener('click',()=>{if(current){const room=current,cb=done;close();open(room,cb);}});
$('mini-close')?.addEventListener('click',close);
root?.addEventListener('click',e=>{if(e.target===root)close();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!root.hidden)close();});
window.WARD13Minis={open,close,get active(){return current?.mini||null;}};
})();