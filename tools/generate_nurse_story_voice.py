#!/usr/bin/env python3
"""Generate Ward 13 story dialogue using the already configured Tavi Gemini voice.
One-time pack: no automatic retries on provider errors, no browser TTS fallback.
"""
import os,re,sys,subprocess,time,shutil
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
VOICE=ROOT/"playtest/cinematic-episode/nurse-tavi.js"
DEST=ROOT/"playtest/cinematic-episode/assets/tavi-story"
OUTPUT=ROOT/"voice-output/nurse-tavi-custom.wav"
src=VOICE.read_text(encoding="utf-8")
start=src.index("const cues=Object.freeze({")+len("const cues=Object.freeze({")
end=src.index("\n});",start)
lines=re.findall(r'^\s*([a-z]+):"([^"]+)"\s*,?\s*$',src[start:end],flags=re.MULTILINE)
expected=["opening","records","treatment","observation","reflex","silent","directorate","ending"]
if [k for k,_ in lines]!=expected:
    raise SystemExit("Voice cue script changed; refusing to generate mismatched dialogue.")
if not os.environ.get("GEMINI_API_KEY"):
    raise SystemExit("GEMINI_API_KEY unavailable; subtitles continue without substitute voice.")
DEST.mkdir(parents=True,exist_ok=True)
limit=int(os.environ.get("WARD_TAVI_MAX",str(len(lines))))
failed=False
for i,(name,dialogue) in enumerate(lines[:limit],1):
    dest=DEST/(name+".wav")
    if dest.exists() and dest.stat().st_size>2000:
        print("Existing Tavi recording:",name,flush=True)
        continue
    if OUTPUT.exists():OUTPUT.unlink()
    env=os.environ.copy()
    env.update(WARD_CUE="custom",WARD_CUSTOM_LINE=dialogue,WARD_MODE="generate",
               WARD_RIGHTS="true",WARD_TAVI_STYLE=("welcome" if name in ("opening","records","reflex") else "security" if name in ("treatment","silent","directorate") else "fracture"))
    print(f"Generating Tavi {i}/{min(limit,len(lines))}: {name}",flush=True)
    try:
        result=subprocess.run([sys.executable,str(ROOT/"tools/nurse_voice_studio.py")],
            cwd=ROOT,env=env,timeout=180,check=False)
    except subprocess.TimeoutExpired:
        print("Provider request timed out; preserving earlier clips.",flush=True)
        failed=True;break
    if result.returncode!=0 or not OUTPUT.is_file():
        print("Provider unavailable or quota-limited; preserving earlier clips. No synthetic replacement.",flush=True)
        failed=True;break
    wav=OUTPUT.read_bytes()
    if not wav.startswith(b"RIFF") or b"WAVE" not in wav[:16]:
        print("Unexpected audio format. Stopping.",flush=True)
        failed=True;break
    shutil.move(str(OUTPUT),str(dest))
    print(f"Saved {name} — {len(wav)} bytes",flush=True)
    if i<min(limit,len(lines)):time.sleep(15)
print(f"Tavi story pack: {len(list(DEST.glob('*.wav')))} of {len(expected)} recorded; partial={failed}",flush=True)
if failed:sys.exit(2)
