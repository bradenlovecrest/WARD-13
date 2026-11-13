#!/usr/bin/env python3
"""Developer-only static analysis for the original 2.3 MB Ward 13 first-wing HTML.
Outputs bounded, reviewable source excerpts so the pharmacology swap can be safe.
No patient data, credentials, or binary assets are extracted.
"""
from pathlib import Path
import re,json
root=Path(__file__).resolve().parents[1]
html=(root/"playtest/cinematic-episode/index.html").read_text(encoding="utf8")
out=root/"docs/firstwing-inspection"
out.mkdir(parents=True,exist_ok=True)
patterns={
"archive":("const ARCHIVE_CASES=","function archiveCase()"),
"treatment":("const TREAT_CASES=","const TREAT_CODE="),
"clinical":("function clinical()","function treatmentMAR()"),
"treatment-mar":("function treatmentMAR()","function treatmentCabinet()"),
"treatment-cabinet":("function treatmentCabinet()","function "),
"intro":('id="enter-button"','id="game"'),
"advance":("function advance(room)","function render()"),
"render":("function render()","function "),
"voice":("function speakScript(line,phase=0)","function "),
"api":("window.WARD13E0","</script>"),
}
summ={}
for name,(a,b) in patterns.items():
 start=html.find(a)
 if start<0:
  summ[name]={"status":"not found","marker":a}
  continue
 end=html.find(b,start+len(a))
 if end<0:end=start+12000
 excerpt=html[max(0,start-450):min(len(html),min(end,start+18000))]
 (out/(name+".txt")).write_text(excerpt,encoding="utf8")
 summ[name]={"status":"found","start":start,"end":end,"excerpt_length":len(excerpt)}
# Extract first labels/nearby literal patterns, never embed huge base64 assets.
keywords=["function showPatient()","const TRUTH=","const ARCHIVE_CASES=","const TREAT_CASES=",
 "const TREAT_CODE=","function archiveCase()","function clinical()","function treatmentMAR()",
 "function treatmentCabinet()","function advance(room)","function render()","function save()",
 "id=\"enter-button\"","id=\"scene-photo\"","data-hot","N.U.R.S.E.","nursePerformer","function speakScript",
 "function say("]
for k in keywords:
 pos=html.find(k)
 if pos<0:continue
 section=html[max(0,pos-120):pos+1000]
 section=re.sub(r'data:image\/(?:png|webp|jpeg);base64,[A-Za-z0-9+/=]+','[EMBEDDED_IMAGE]',section)
 summ[k]={"offset":pos,"preview":section[:1150]}
(out/"SUMMARY.json").write_text(json.dumps(summ,indent=2),encoding="utf8")
print("Extracted clinical banks and scripts; no giant images.",sum(x.get("excerpt_length",0) for x in summ.values() if isinstance(x,dict)))
