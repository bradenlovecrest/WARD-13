/* WARD 13 visual prototype v1: scenes are opt-in/reversible, no puzzle data changes. */
(function(){
 const KEY='ward13-prototype-scene-art';
 function init(){
   const stage=document.getElementById('stage'), button=document.getElementById('objects-button');
   if(!stage||!button||document.getElementById('ward-art-toggle'))return;
   let enabled=false;
   try{enabled=localStorage.getItem(KEY)==='on'}catch(e){}
   const toggle=document.createElement('button');
   toggle.type='button';toggle.id='ward-art-toggle';toggle.className='btn small soft';
   toggle.title='Compare original photographed scenery and new illustrated room concepts. All item hotspots remain in place.';
   toggle.addEventListener('click',()=>{
     enabled=!enabled;
     try{localStorage.setItem(KEY,enabled?'on':'off')}catch(e){}
     update();
   });
   function update(){
     document.documentElement.classList.toggle('ward-art-mode',enabled);
     toggle.textContent=enabled?'◉ Concept scenery':'◯ Original scenery';
     toggle.setAttribute('aria-pressed',String(enabled));
   }
   button.insertAdjacentElement('afterend',toggle);
   update();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();