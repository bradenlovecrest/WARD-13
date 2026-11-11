"""WARD 13: manually-triggered, quota-aware Google Gemini Tavi voice production."""
import json
import os
import sys
from pathlib import Path

CUES = {
    "test": "Good evening, student nurse. I trust you are enjoying your clinical rotation.",
    "welcome": "Good evening, student nurse. Welcome to Ward Thirteen. Your clinical instructor is currently unavailable. Fortunately, I'm fully qualified to supervise your progress. Now, please disregard the screaming. It's not part of your assessment.",
    "security": "Student nurse. I've noticed that you've accessed several confidential patient records. Your curiosity is admirable. Your judgment, however, is becoming a concern. Please return to your assigned clinical area. That is not a suggestion.",
    "fracture": "Wait. That patient wasn't supposed to be in the archive. I remember their admission. I remember their voice. But I don't remember what happened next. Please... don't open that door. Not yet.",
}
STYLES = {
    "test": "Soft youthful Australian English, warm conversational clinical supervisor, dry humor; understated and natural.",
    "welcome": "Soft youthful natural Australian English. A real, warm professional clinical supervisor with dry humor. Conversational, gently reassuring, not a narrator or horror villain.",
    "security": "Soft youthful natural Australian English. Same woman's voice: calm, carefully controlled and quietly authoritarian; polite but colder and firmer, no shouting.",
    "fracture": "Soft youthful natural Australian English. Same character starting to doubt her memories; hesitant private worry and genuine vulnerability, not theatrical fear.",
    "custom": "Soft youthful natural Australian English. Warm, intelligent, subtly patronizing hospital supervisor; understated realistic delivery, never theatrical.",
}
cue = os.environ.get("WARD_CUE", "welcome")
mode = os.environ.get("WARD_MODE", "preview")
if cue not in (*CUES, "custom") or mode not in ("preview", "generate"):
    raise SystemExit("Unsupported cue or mode.")
transcript = os.environ.get("WARD_CUSTOM_LINE", "").strip() if cue == "custom" else CUES[cue]
if not 1 <= len(transcript) <= 700:
    raise SystemExit("Transcript must be between 1 and 700 characters.")
style_override = os.environ.get("WARD_TAVI_STYLE", "").strip()
if style_override and (cue != "custom" or style_override not in ("welcome", "security", "fracture")):
    raise SystemExit("WARD_TAVI_STYLE must be welcome, security, or fracture for custom cues.")
selected_style = STYLES[style_override] if style_override else STYLES[cue]
out = Path("voice-output")
out.mkdir(exist_ok=True)
(out / "transcript.txt").write_text(transcript, encoding="utf-8")
(out / "metadata.json").write_text(json.dumps({
    "provider": "Google Gemini",
    "model": "gemini-3.8-flash-tts",
    "voice": "Tavi",
    "cue": cue,
    "style": selected_style,
}, indent=2), encoding="utf-8")
print("WARD 13 voice studio | model: gemini-3.8-flash-tts | voice: Tavi | cue:", cue)
print("Transcript length:", len(transcript))
if mode == "preview":
    print("Preview complete: No Gemini API call; no credits used.")
    sys.exit(0)
if os.environ.get("WARD_RIGHTS", "").lower() != "true":
    raise SystemExit("Before generating, confirm you may share the output via an artifact in this public repository.")
key = os.environ.get("GEMINI_API_KEY")
if not key:
    raise SystemExit("GEMINI_API_KEY secret is missing. Add it at Settings > Secrets and variables > Actions.")
import base64
import urllib.error
import urllib.request

# Gemini 3.8 TTS Interaction API; the turn's style is separate from the
# transcript, so stage directions are NOT spoken.
payload = {
    "model": "gemini-3.8-flash-tts",
    "input": [{
        "type": "user_input",
        "content": [{
            "type": "text",
            "text": transcript,
            "annotations": [{"type": "speech_metadata", "style": selected_style}],
        }],
    }],
    "response_format": {"type": "audio"},
    "generation_config": {"speech_config": [{"voice": "Tavi"}]},
}
request = urllib.request.Request(
    "https://generativelanguage.googleapis.com/v1beta/interactions",
    data=json.dumps(payload).encode("utf-8"),
    headers={
        "x-goog-api-key": key,
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
    method="POST",
)
try:
    with urllib.request.urlopen(request, timeout=120) as response:
        result = json.loads(response.read().decode("utf-8"))
except urllib.error.HTTPError as exc:
    print(f"Gemini API returned HTTP {exc.code}. Check your key, free-tier access and quota.", file=sys.stderr)
    sys.exit(1)
except (urllib.error.URLError, TimeoutError) as exc:
    print("Unable to reach Gemini TTS API (network timeout or connection error).", file=sys.stderr)
    sys.exit(1)
except (json.JSONDecodeError, UnicodeDecodeError):
    raise SystemExit("Gemini returned an unexpected response.")

# The REST Interactions API returns audio inside steps[].content[].data.
# The output_audio convenience property exists on the Python SDK object,
# NOT as a top-level field in the raw REST JSON.
audio_blocks = []
for step in result.get("steps", []):
    if step.get("type") != "model_output":
        continue
    for part in step.get("content", []):
        if part.get("type") == "audio" and isinstance(part.get("data"), str):
            audio_blocks.append(part["data"])
# Defensive compatibility with SDK-shaped or enveloped responses.
if not audio_blocks and isinstance(result.get("output_audio"), dict):
    block = result["output_audio"].get("data")
    if isinstance(block, str):
        audio_blocks.append(block)
if not audio_blocks and isinstance(result.get("interaction"), dict):
    for step in result["interaction"].get("steps", []):
        if step.get("type") == "model_output":
            for part in step.get("content", []):
                if part.get("type") == "audio" and isinstance(part.get("data"), str):
                    audio_blocks.append(part["data"])
if not audio_blocks:
    # Reveal only the response *shape*, never the full JSON/audio/key.
    step_types = [str(x.get("type", "unknown")) for x in result.get("steps", [])]
    print("Google response has no extractable audio; interaction status:",
          str(result.get("status", "unspecified")), "; step types:", step_types,
          file=sys.stderr)
    raise SystemExit("Tavi generation did not return a readable audio block.")
encoded = audio_blocks[-1]
try:
    decoded = base64.b64decode(encoded, validate=True)
except (ValueError, base64.binascii.Error):
    raise SystemExit("Gemini returned invalid base64 audio encoding.")
if not decoded.startswith(b"RIFF") or b"WAVE" not in decoded[:16]:
    raise SystemExit("Gemini returned audio, but not the expected WAV format.")
dest = out / ("nurse-tavi-" + cue + ".wav")
dest.write_bytes(decoded)
print("Generated", dest.name, "|", len(decoded), "bytes")
