"""WARD 13: manually-triggered, quota-aware Google Gemini Tavi voice production."""
import json
import os
import sys
from pathlib import Path

CUES = {
    "welcome": "Good evening, student nurse. Welcome to Ward Thirteen. Your clinical instructor is currently unavailable. Fortunately, I'm fully qualified to supervise your progress. Now, please disregard the screaming. It's not part of your assessment.",
    "security": "Student nurse. I've noticed that you've accessed several confidential patient records. Your curiosity is admirable. Your judgment, however, is becoming a concern. Please return to your assigned clinical area. That is not a suggestion.",
    "fracture": "Wait. That patient wasn't supposed to be in the archive. I remember their admission. I remember their voice. But I don't remember what happened next. Please... don't open that door. Not yet.",
}
STYLES = {
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
out = Path("voice-output")
out.mkdir(exist_ok=True)
(out / "transcript.txt").write_text(transcript, encoding="utf-8")
(out / "metadata.json").write_text(json.dumps({
    "provider": "Google Gemini",
    "model": "gemini-3.8-flash-tts",
    "voice": "Tavi",
    "cue": cue,
    "style": STYLES[cue],
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
from google import genai
from google.genai import types

try:
    client = genai.Client(api_key=key)
    response = client.models.generate_content(
        model="gemini-3.8-flash-tts",
        contents=types.Content(
            role="user",
            parts=[types.Part(
                text=transcript,
                speech_metadata=types.SpeechMetadata(style=STYLES[cue]),
            )],
        ),
        config=types.GenerateContentConfig(
            response_modalities=["AUDIO"],
            speech_config=types.SpeechConfig(
                voice_config=types.VoiceConfig(voice="Tavi"),
            ),
        ),
    )
except Exception as exc:
    print("Gemini synthesis failed (" + type(exc).__name__ + "). Check model availability, key, quotas, and account tier.", file=sys.stderr)
    sys.exit(1)
parts = [
    part.inline_data.data
    for candidate in (response.candidates or [])
    for part in (candidate.content.parts or [])
    if part.inline_data and part.inline_data.data
]
if not parts or not parts[0].startswith(b"RIFF"):
    raise SystemExit("The provider did not return a valid WAV file.")
dest = out / ("nurse-tavi-" + cue + ".wav")
dest.write_bytes(parts[0])
print("Generated", dest.name, "(", len(parts[0]), "bytes )")
