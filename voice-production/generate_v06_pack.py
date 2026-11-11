"""One-shot WARD 13 v0.6 voice pack generator. Uses GitHub secret; never prints key."""
import base64, json, os, sys, time, urllib.request, urllib.error
from pathlib import Path

secret=os.environ.get("GEMINI_API_KEY","")
if not secret: raise SystemExit("GEMINI_API_KEY is absent; cannot create voice pack.")
cues={
 "treatment_intro":(
  "Welcome to the treatment room, student nurse. Three patient medication records need your attention. Do try not to make another discrepancy.",
  "Soft natural Australian English; warm, polite, youthful clinical supervisor; conversational dry humour, light condescension, never theatrical."),
 "treatment_control":(
  "Student nurse, you've identified an alteration that should not exist. Close the cabinet. Immediately.",
  "The exact same soft Australian woman, clipped and firmly authoritative, controlled anger barely under the surface, no shouting."),
 "treatment_fracture":(
  "That chart was corrected. I remember correcting it. Why does the cabinet still say the patient is here?",
  "The same recognizably Australian woman, vulnerable, confused and quietly frightened; hesitant natural speech, almost a whisper at the end.")
}
out=Path("voice-output");out.mkdir(exist_ok=True)
for cue,(dialogue,style) in cues.items():
 payload={
  "model":"gemini-3.8-flash-tts",
  "input":[{"type":"user_input","content":[{"type":"text","text":dialogue,"annotations":[{"type":"speech_metadata","style":style}]}]}],
  "response_format":{"type":"audio"},
  "generation_config":{"speech_config":[{"voice":"Tavi"}]}
 }
 req=urllib.request.Request("https://generativelanguage.googleapis.com/v1beta/interactions",data=json.dumps(payload).encode("utf-8"),headers={"x-goog-api-key":secret,"Content-Type":"application/json","Accept":"application/json"},method="POST")
 try:
  with urllib.request.urlopen(req,timeout=100) as resp: result=json.load(resp)
 except urllib.error.HTTPError as exc:
  raise SystemExit("Gemini TTS HTTP "+str(exc.code)+" for cue "+cue+". No key or response body logged.")
 parts=[p.get("data") for step in result.get("steps",[]) if step.get("type")=="model_output" for p in step.get("content",[]) if p.get("type")=="audio" and p.get("data")]
 if not parts:
  raise SystemExit("No audio returned for "+cue+"; status="+str(result.get("status"))+"; no raw content logged.")
 audio=base64.b64decode(parts[-1],validate=True)
 if not audio.startswith(b"RIFF") or b"WAVE" not in audio[:16]: raise SystemExit("Unexpected audio format for "+cue)
 (out/(cue+".wav")).write_bytes(audio)
 (out/(cue+".txt")).write_text(dialogue,encoding="utf-8")
 print(cue,"generated",len(audio),"bytes")
print("Tavi v0.6 voice pack successfully generated")
