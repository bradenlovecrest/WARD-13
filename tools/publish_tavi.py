"""Publish prerecorded Tavi lines for WARD 13's Treatment Room playtest.

Preview/install never calls Gemini. Generate only runs from a manually dispatched,
rights-confirmed Actions workflow, using its server-side GEMINI_API_KEY secret.
"""
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGE = ROOT / 'playtest/treatment-room/index.html'
OUT = PAGE.parent / 'audio/tavi'
MARKER = '/* WARD13_TAVI_DIALOGUE_V1 */'
MATCH = re.compile(r"\bsay\s*\(\s*(['\"])((?:\\.|(?!\1).)*?)\1\s*(?:,\s*([012]))?\s*\)", re.S)

def collect(html):
    entries = []
    seen = set()
    initial = re.search(r"\bdialogue:'([^']{5,700})'", html)
    if initial:
        greeting=initial.group(1)
        ident=hashlib.sha256(greeting.encode('utf-8')).hexdigest()[:12]
        entries.append((greeting,ident,0))
        seen.add(greeting)
    for match in MATCH.finditer(html):
        line = match.group(2).replace("\\'", "'").replace('\\"', '"')
        if not 1 <= len(line) <= 700 or line in seen:
            continue
        seen.add(line)
        ident = hashlib.sha256(line.encode('utf-8')).hexdigest()[:12]
        phase = int(match.group(3) or 0)
        entries.append((line, ident, phase))
    return entries

def install(html, entries):
    if MARKER in html:
        return html
    original = 'function speakScript(line,phase=0){'
    if html.count(original) != 1:
        raise RuntimeError('Expected one existing speakScript function; refusing to modify page.')
    mapping = {line: f'audio/tavi/{ident}.wav' for line, ident, _ in entries}
    block = '\n' + MARKER + '\nconst WARD13_TAVI_DIALOGUE = ' + json.dumps(mapping,ensure_ascii=False,indent=2) + ''';
function speakScript(line,phase=0){
  const src=WARD13_TAVI_DIALOGUE[line];
  if(voice&&nursePerformer==='tavi'&&src){
    try {
      window.speechSynthesis?.cancel();
      if(currentTaviAudio) currentTaviAudio.pause();
      const clip=new Audio(src);
      clip.volume=Math.max(0,Math.min(1,voiceVolume));
      currentTaviAudio=clip;
      clip.play().catch(()=>{
        if(currentTaviAudio===clip&&voice){currentTaviAudio=null;speakBrowserScript(line,phase);}
      });
      return;
    } catch(e) {/* Fall through to browser voice. */}
  }
  speakBrowserScript(line,phase);
}
'''
    html = html.replace(original, block+'\nfunction speakBrowserScript(line,phase=0){', 1)
    off="if(!voice){try{window.speechSynthesis.cancel()}catch(e){}}"
    if off in html:
        html=html.replace(off,"if(!voice){try{window.speechSynthesis.cancel()}catch(e){}try{currentTaviAudio?.pause()}catch(e){}}",1)
    stop="if(supported)window.speechSynthesis.cancel()"
    if stop in html:
        html=html.replace(stop,"if(supported)window.speechSynthesis.cancel();try{currentTaviAudio?.pause()}catch(e){}",1)
    html=html.replace('Her three prerecorded Treatment Room scenes are listed below. For dialogue not yet recorded, the game uses a device voice or on-screen captions.',
                      'Tavi has three embedded Treatment Room performances and additional prerecorded lines across the ward when available. Missing recordings fall back to device speech or captions.')
    html=html.replace("Tavi's three v0.6 Treatment Room scenes are original recordings embedded in the game. The other choices are device text-to-speech and vary by browser.",
                      'Tavi has prerecorded scenes, with additional audio loading as available. Other performer choices use device speech and vary by browser.')
    html=html.replace('★ Tavi — prerecorded N.U.R.S.E. (Treatment Room)',
                      '★ Tavi — recorded N.U.R.S.E. (available scenes)')
    return html

def main():
    mode = os.environ.get('WARD_PUBLISH_MODE','preview').lower()
    if mode not in ('preview','install','generate'):
        raise SystemExit('Expected preview, install, or generate mode.')
    source=PAGE.read_text(encoding='utf-8')
    catalog=collect(source)
    if not catalog:
        raise SystemExit('Could not find any static N.U.R.S.E. dialogue; no files changed.')
    print(f'Found {len(catalog)} additional dialogue lines. Three Tavi recordings are already embedded.')
    for i,(line,ident,phase) in enumerate(catalog,1):
        print(f'{i:02d} | {ident} | phase {phase} | {line}')
    if mode=='preview':
        print('Preview only. No API calls, commits, or file changes.')
        return
    updated=install(source,catalog)
    if updated!=source:
        PAGE.write_text(updated,encoding='utf-8')
        print('Installed Tavi asset-aware playback with browser voice fallback.')
    else:print('Tavi playback already installed.')
    if mode=='install':
        print('No Gemini API call made. The published game will fall back for missing recordings.')
        return
    if os.environ.get('WARD_RIGHTS','').lower()!='true':
        raise SystemExit('Confirm public distribution rights before generating audio.')
    if not os.environ.get('GEMINI_API_KEY'):
        raise SystemExit('Missing GEMINI_API_KEY in GitHub Actions secrets.')
    start=int(os.environ.get('WARD_START_INDEX','1'))
    count=int(os.environ.get('WARD_BATCH_COUNT','3'))
    if not (1<=start<=len(catalog)) or count not in (1,2,3):
        raise SystemExit('Start must be 1..catalog size and count 1..3.')
    selected=catalog[start-1:start-1+count]
    OUT.mkdir(parents=True,exist_ok=True)
    for line,ident,phase in selected:
        target=OUT/f'{ident}.wav'
        if target.exists():
            print('Already recorded; skipping',target.name)
            continue
        env=os.environ.copy()
        env.update(WARD_CUE='custom',WARD_CUSTOM_LINE=line,WARD_MODE='generate',WARD_RIGHTS='true',WARD_TAVI_STYLE={0:'welcome',1:'security',2:'fracture'}[phase])
        subprocess.run([sys.executable,str(ROOT/'tools/nurse_voice_studio.py')],cwd=ROOT,env=env,check=True)
        generated=ROOT/'voice-output/nurse-tavi-custom.wav'
        if not generated.is_file():
            raise SystemExit('Tavi generator succeeded without expected WAV file.')
        shutil.move(str(generated),str(target))
        print('Published',target.relative_to(ROOT))

if __name__=='__main__':main()
