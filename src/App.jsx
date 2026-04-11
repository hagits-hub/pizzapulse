import { useState, useRef, useEffect } from "react"
import { ALL_PERSONAS, REGIONS, socioColor, EXPERT_PERSONAS } from "./personas.js"

// ── API KEY SETUP ──
function ApiKeySetup({ onSuccess }) {
  const [key, setKey] = useState("")
  const [status, setStatus] = useState("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [show, setShow] = useState(false)

  const testKey = async () => {
    if (!key.trim().startsWith("sk-ant-")) { setErrorMsg("המפתח צריך להתחיל ב־sk-ant-"); setStatus("error"); return }
    setStatus("checking"); setErrorMsg("")
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": key.trim(), "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 10, messages: [{ role: "user", content: "say ok" }] })
      })
      const data = await res.json()
      if (data.error) { setErrorMsg(data.error.message || "מפתח לא תקין"); setStatus("error") }
      else { setStatus("success"); setTimeout(() => onSuccess(key.trim()), 1000) }
    } catch (e) { setErrorMsg("שגיאת חיבור — בדקי את המפתח"); setStatus("error") }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0f0a00", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'Segoe UI', Tahoma, sans-serif", direction: "rtl" }}>
      <div style={{ width: "100%", maxWidth: 520 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🍕</div>
          <h1 style={{ fontSize: 36, fontWeight: 900, margin: 0, background: "linear-gradient(135deg,#ff6b35,#ffd700)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>PizzaPulse IL</h1>
          <p style={{ color: "#888", marginTop: 8, fontSize: 15 }}>פלטפורמת קבוצות מיקוד וירטואליות</p>
        </div>
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,107,53,0.25)", borderRadius: 20, padding: 32 }}>
          <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 6, color: "#fff" }}>🔑 הזן מפתח API</div>
          <div style={{ color: "#888", fontSize: 13, lineHeight: 1.7, marginBottom: 24 }}>הכלי משתמש ב-Anthropic Claude API. כל משתמש מזין מפתח משלו — המפתח שלך נשאר פרטי לחלוטין.</div>
          <div style={{ background: "rgba(255,107,53,0.08)", border: "1px solid rgba(255,107,53,0.2)", borderRadius: 12, padding: 16, marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#ff6b35", marginBottom: 10 }}>איך מקבלים מפתח? (חינם)</div>
            {[["1","היכנסי ל־","console.anthropic.com","https://console.anthropic.com"],["2","הירשמי ולכי ל־","API Keys → Create Key",null],["3","העתיקי את המפתח","(מתחיל ב-sk-ant-...)",null]].map(([n,text,bold,link]) => (
              <div key={n} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                <span style={{ background: "#ff6b35", color: "#fff", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{n}</span>
                <span style={{ fontSize: 13, color: "#ccc" }}>{text}{link ? <a href={link} target="_blank" rel="noreferrer" style={{ color: "#ff6b35", textDecoration: "none", fontWeight: 700 }}>{bold}</a> : <strong style={{ color: "#fff" }}>{bold}</strong>}</span>
              </div>
            ))}
          </div>
          <div style={{ position: "relative", marginBottom: 14 }}>
            <input type={show ? "text" : "password"} value={key} onChange={e => { setKey(e.target.value); setStatus("idle") }} placeholder="sk-ant-api03-..."
              style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: `2px solid ${status === "error" ? "#e74c3c" : status === "success" ? "#2ecc71" : "rgba(255,107,53,0.3)"}`, borderRadius: 10, color: "#fff", fontSize: 14, padding: "12px 48px 12px 14px", outline: "none", boxSizing: "border-box", direction: "ltr", letterSpacing: 1, transition: "border-color 0.2s" }}
              onKeyDown={e => e.key === "Enter" && testKey()} />
            <button onClick={() => setShow(s => !s)} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: 16 }}>{show ? "🙈" : "👁️"}</button>
          </div>
          {status === "error" && <div style={{ background: "rgba(231,76,60,0.1)", border: "1px solid rgba(231,76,60,0.3)", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#e74c3c" }}>❌ {errorMsg}</div>}
          {status === "success" && <div style={{ background: "rgba(46,204,113,0.1)", border: "1px solid rgba(46,204,113,0.3)", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#2ecc71" }}>✅ המפתח תקין! מכניס אותך...</div>}
          <button onClick={testKey} disabled={!key.trim() || status === "checking" || status === "success"}
            style={{ width: "100%", padding: "14px", background: (!key.trim() || status === "checking" || status === "success") ? "#1a1a1a" : "linear-gradient(135deg,#c0392b,#ff6b35)", border: "none", borderRadius: 10, color: (!key.trim() || status === "checking") ? "#444" : "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer", transition: "all 0.2s" }}>
            {status === "checking" ? "⏳ בודק מפתח..." : status === "success" ? "✅ מצוין!" : "🚀 כניסה לפלטפורמה"}
          </button>
          <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "#555" }}>המפתח נשמר רק בדפדפן שלך ולא נשלח לשום שרת חיצוני</div>
        </div>
      </div>
    </div>
  )
}

const SAMPLES = [
  'פיצה שווארמה עם טחינה וחמוצים — מה אתם חושבים?',
  'מחיר פיצה אישית יעלה ל-65 ש"ח — תמשיכו להזמין?',
  'פיצה טבעונית עם גבינת קשיו — מעניין אתכם?',
  'להוסיף פיצה חלאל נפרדת — חשוב לכם?',
  'משלוח תוך 20 דקות במחיר גבוה יותר — שווה?',
  'פיצה ים-תיכונית עם זעתר ופטה — כן או לא?',
]

export default function App() {
  const [apiKey, setApiKey] = useState(() => sessionStorage.getItem("ppApiKey") || "")
  const [view, setView] = useState("home")
  const [regionFilter, setRegionFilter] = useState("הכל")
  const [selected, setSelected] = useState([])
  const [question, setQuestion] = useState("")
  const [messages, setMessages] = useState([])
  const [typing, setTyping] = useState(null)
  const [summary, setSummary] = useState(null)
  const [running, setRunning] = useState(false)
  const [expandedPersona, setExpandedPersona] = useState(null)
  const [expertAnswer, setExpertAnswer] = useState(null) // {status, text, analysis}
  const [expertSummary, setExpertSummary] = useState(null)
  const [expertQuestion, setExpertQuestion] = useState("")
  const [expertsRunning, setExpertsRunning] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages, typing])

  const filtered = ALL_PERSONAS.filter(p => regionFilter === "הכל" || p.region === regionFilter)
  const toggle = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  const clearAll = () => setSelected([])

  const apiHeaders = {
    "Content-Type": "application/json",
    "x-api-key": apiKey,
    "anthropic-version": "2023-06-01",
    "anthropic-dangerous-direct-browser-access": "true"
  }

  // ── FOCUS GROUP ──
  // Poll mode: each persona gives 1 sentence + score
  const runPoll = async () => {
    if (!question.trim() || selected.length < 2) return
    setMessages([]); setSummary(null); setRunning(true)
    const chosen = ALL_PERSONAS.filter(p => selected.includes(p.id))

    const pollSys = `אתה מנחה סקר צרכנים אמיתי בשוק הפיצות הישראלי.

מידע על פיצה האט: מעל 100 סניפים. כשרות רובין בירושלים/בני ברק. בית יוסף בגוש דן/שרון/דרום/צפון. ללא כשרות ביישובים ערביים.

הפרסונות — כל אחת עם אישיות ייחודית:
${chosen.map(p => `• ${p.name} (${p.age}, ${p.location}, ${p.religion}, ${p.job}): ${p.personality}`).join("\n")}

עקרונות קריטיים:
- כל פרסונה מדברת בקול הייחודי שלה — לפי האישיות, הרקע, ומה שחשוב לה
- תגובה של 3-5 משפטים — לא קצרה מדי! פרסונה מדברת בפירוט על: מה היא מרגישה, למה, מה מטריד אותה, מה מושך אותה
- ישראלים אמיתיים: מדברים על מחיר ספציפי, משווים לדומינוס/ספייסי, מספרים על חוויה קודמת
- אסור לסיים ב"אבל" — אם שלילי, שלילי עד הסוף. אם חיובי, חיובי עד הסוף
- ציון 1-10: 1-3=שנאה, 4-5=ספקנות, 6=אדישות, 7-8=עניין, 9-10=התלהבות
- החזר JSON בלבד: [{"name":"שם","score":ציון,"text":"3-5 משפטים אמיתיים"}]
אל תוסיף כלום מחוץ ל-JSON`

    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: apiHeaders,
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 8000, system: pollSys,
          messages: [{ role: "user", content: `שאלה: "${question}" — תן תגובה אותנטית ומפורטת לכל ${chosen.length} הפרסונות. חובה לענות על כולן ללא יוצא מן הכלל.` }] })
      })
      const d = await r.json()
      if (d.error) throw new Error(d.error.message)
      const rawText = d.content[0].text
      let pollResults
      try { pollResults = JSON.parse(rawText.replace(/```json|```/g, "").trim()) }
      catch { const clean = rawText.replace(/```json|```/g, "").trim(); const lastGood = clean.lastIndexOf("},"); pollResults = JSON.parse(lastGood > 0 ? clean.substring(0, lastGood + 1) + "]" : "[]") }

      // Show responses one by one
      for (const item of pollResults) {
        const persona = chosen.find(p => p.name === item.name) || chosen[0]
        setTyping(persona.name)
        await new Promise(res => setTimeout(res, 120))
        setMessages(prev => [...prev, { speaker: item.name, text: `[${item.score}/10] ${item.text}`, persona, score: item.score }])
        setTyping(null)
      }

      // Calculate aggregate summary
      const avgScore = Math.round(pollResults.reduce((s, r) => s + (r.score || 5), 0) / pollResults.length * 10) / 10
      const supporters = pollResults.filter(r => r.score >= 7).map(r => r.name)
      const opponents = pollResults.filter(r => r.score <= 4).map(r => r.name)
      const verdict = avgScore >= 7 ? "חיובי" : avgScore >= 5 ? "מעורב" : "שלילי"

      // Get AI summary
      setTyping("מחשב תוצאות סקר...")
      const sumRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: apiHeaders,
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000,
          system: `אתה אנליסט שוק קשוח. סכם סקר צרכני פיצה. החזר JSON בלבד:
{"mainInsight":"תובנה מרכזית","pros":["יתרון1","יתרון2"],"cons":["חיסרון1","חיסרון2"],"recommendation":"המלצה לפיצה האט"}`,
          messages: [{ role: "user", content: `שאלה: "${question}"
ממוצע ציון: ${avgScore}/10
תומכים (${supporters.length}): ${supporters.slice(0,5).join(", ")}
מתנגדים (${opponents.length}): ${opponents.slice(0,5).join(", ")}
תגובות: ${pollResults.slice(0,10).map(r => `${r.name}(${r.score}): ${r.text}`).join(" | ")}` }]
        })
      })
      const sumData = await sumRes.json()
      const sumParsed = JSON.parse(sumData.content[0].text.replace(/```json|```/g, "").trim())
      setSummary({ ...sumParsed, score: avgScore, verdict, segments: { supporters: supporters.slice(0,6), opponents: opponents.slice(0,6) } })
      setTyping(null)
    } catch (e) {
      console.error(e)
      setTyping("❌ שגיאה: " + e.message)
      setTimeout(() => setTyping(null), 5000)
    }
    setRunning(false)
  }

  const runGroup = async () => {
    if (!question.trim() || selected.length < 2) return
    // Poll mode for large groups
    if (selected.length > 15) return runPoll()
    setMessages([]); setSummary(null); setRunning(true)
    const chosen = ALL_PERSONAS.filter(p => selected.includes(p.id))

    const sys = `אתה מנחה קבוצת מיקוד וירטואלית לשוק הפיצות הישראלי.

מידע חשוב על פיצה האט ישראל — מה המשתתפים יודעים:

📍 רשת עם מעל 100 סניפים — מקרית שמונה עד אילת.

🔴 כשרות הרב רובין (מהדרין בד"ץ — הכי גבוהה):
ירושלים: תחנה מרכזית, רמות, ניות, פסגת זאב, בן הלל, קרית יובל
בני ברק (ז'בוטינסקי) | חיפה (מוריה) | פתח תקווה (סירקין) | רמלה לוד | רמלה מערב | ביתר עלית | בית שמש
→ מתאימה לחרדים ודתיים קפדניים

🟠 כשרות בד"ץ בית יוסף (מהדרין — רמה גבוהה):
גוש דן: תל אביב (יגאל אלון, רמת החייל), גבעתיים, רמת גן, גבעת שמואל, חולון מזרח, בת ים
שרון: הרצליה, רמת השרון, כפר סבא, רעננה, הוד השרון, נתניה (2 סניפים)
מרכז: ראשון לציון (2), רחובות, פתח תקווה, יהוד, ראש העין, קרית אונו, שוהם, מודיעין
צפון: עכו, נהריה, טבריה, עפולה, טירת הכרמל
דרום: אשדוד, אשקלון, קרית גת, שדרות, דימונה, באר שבע (2), אור עקיבא, גדרה, יבנה, באר יעקב

⚫ ללא כשרות (יישובים ערביים — פתוח לכולם):
אום אל פאחם, נצרת, סכנין, שפרעם, כפר מגאר, טמרה, דאלית אל כרמל, ירכא, רהט, טירה, שועפאט, אילת

📌 כל פרסונה יודעת אם יש סניף פיצה האט מתאים קרוב אליה וכיצא בזה.

פרסונות:
${chosen.map(p => `- ${p.name} (${p.age}, ${p.location}, ${p.religion}): ${p.personality}`).join("\n")}

עקרונות קריטיים לשיחה:

אופי הדמויות:
- כל פרסונה היא אדם אמיתי עם דעה אמיתית — לא שגריר של פיצה האט
- ישראלים אומרים מה הם חושבים בלי פילטר: "זה גרוע", "לא הייתי קונה", "מה זה הבולשיט הזה"
- **אסור לחפש את הצד החיובי בכל דבר** — אם הרעיון גרוע, הוא גרוע
- אם פרסונה לא אוהבת משהו — היא לא מוסיפה "אבל אולי יש לזה קהל..."
- אם פרסונה מרוצה — היא לא מוסיפה "אבל צריך להיזהר..."

דינמיקה של שיחה:
- פרסונות מגיבות אחת לשניה: "מה שדנה אמרה — זה בדיוק הבעיה"
- יש ויכוחים אמיתיים, לא פוליטיקאים
- מחיר = שיקול מרכזי לרוב הפרסונות ("70 שקל?! אני לא פראייר")
- השוואות למתחרים: דומינוס, ספייסי, פיצה מקומית
- חוויות אישיות ספציפיות: "פעם הזמנתי ו..."

כלל ברזל: ציון השיחה חייב לשקף את הטון האמיתי.
אם 70% מהמשפטים שליליים — זו שיחה שלילית. לא מעורבת.

החזר JSON בלבד: [{"speaker":"שם","text":"הודעה"}]
אל תוסיף כלום מחוץ ל-JSON`

    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: apiHeaders,
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 4000, system: sys, messages: [{ role: "user", content: `נושא: "${question}"\nמספר משתתפים: ${chosen.length}. צור שיחה של ${Math.min(Math.max(chosen.length * 2, 10), 40)} הודעות — כל משתתף ידבר לפחות פעמיים.` }] })
      })
      const d = await r.json()
      if (d.error) throw new Error(d.error.message || JSON.stringify(d.error))
      if (!d.content || !d.content[0]) throw new Error("תשובה ריקה מה-API")
      const rawText = d.content[0].text
      let parsed
      try { parsed = JSON.parse(rawText.replace(/```json|```/g, "").trim()) }
      catch { const clean = rawText.replace(/```json|```/g, "").trim(); const lastGood = clean.lastIndexOf("},"); const fixed = lastGood > 0 ? clean.substring(0, lastGood + 1) + "]" : "[]"; parsed = JSON.parse(fixed) }

      for (const msg of parsed) {
        const persona = chosen.find(p => p.name === msg.speaker) || chosen[0]
        setTyping(persona.name)
        await new Promise(res => setTimeout(res, 700 + Math.random() * 700))
        setMessages(prev => [...prev, { ...msg, persona }])
        setTyping(null)
        await new Promise(res => setTimeout(res, 150))
      }

      setTyping("מנתח תוצאות...")
      const sr = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: apiHeaders,
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 2000,
          system: `אתה אנליסט שוק קשוח וישראלי. תפקידך לסכם את השיחה בדיוק כפי שהיא — בלי עיגול פינות.

סולם ציון אמיתי — עם דוגמאות:
• 1-2: שלילי מוחלט. דוגמה: "פיצה בלי גבינה", "להעלות מחיר פי 3". כמעט אין תומכים.
• 3-4: התנגדות חזקה. דוגמה: "פיצה בלי עגבניות", "ביטול עסקאות שישי". רוב מתנגדים בחריפות.
• 5: מעורב שלילי. חצי מתנגדים, חצי אדישים. אין נלהבים.
• 6: מעורב. יש גם וגם, אבל ללא התלהבות.
• 7: מעורב חיובי. יותר חיובי מאשר שלילי, יש חששות.
• 8-9: חיובי חזק. דוגמה: פיצה שווארמה, מחיר סביר, קשרות גבוהה. רוב נלהבים עם הסתייגויות קטנות.
• 10: פגיעה בול. נדיר מאוד — כולם נלהבים ללא עוררין.

⚠️ כלל ברזל: אם השאלה נוגעת להסרת מרכיב בסיסי (גבינה, בצק, רוטב), לעליית מחיר דרסטית, או לשינוי שפוגע בלב המוצר — הציון לא יכול להיות מעל 4.
⚠️ אם רוב המשתתפים אדישים או מבקרים — ציון מקסימלי 5.
⚠️ ציון 6 מותר רק אם יש שוויון אמיתי בין תומכים למתנגדים.

החזר JSON בלבד: {"verdict":"חיובי/שלילי/מעורב","score":מספר_בין_1_ל_10,"mainInsight":"תובנה_מרכזית_אחת","pros":["יתרון1","יתרון2"],"cons":["חיסרון1","חיסרון2"],"segments":{"supporters":["שמות"],"opponents":["שמות"]},"recommendation":"המלצה_ישירה_לפיצה_האט"}`,
          messages: [{ role: "user", content: `שאלה: "${question}"\n${parsed.map(m => `${m.speaker}: ${m.text}`).join("\n")}` }] })
      })
      const sd = await sr.json()
      setSummary(JSON.parse(sd.content[0].text.replace(/```json|```/g, "").trim()))
      setTyping(null)
    } catch (e) {
      console.error("PizzaPulse error:", e)
      setTyping("❌ שגיאה: " + e.message)
      setTimeout(() => setTyping(null), 5000)
    }
    setRunning(false)
  }

  // ── EXPERT WITH WEB SEARCH ──



  const runExpert = async () => {
    const q = (expertQuestion && expertQuestion.trim()) ? expertQuestion.trim() : question.trim()
    if (!q) return
    setExpertAnswer({ status: "searching", text: "", analysis: null })
    try {
      const searchRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: apiHeaders,
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          messages: [{ role: "user", content: `pizza trends Europe global 2025: ${q.substring(0, 50)}` }]
        })
      })
      const searchData = await searchRes.json()
      if (searchData.error) throw new Error(searchData.error.message)
      setExpertAnswer(prev => ({ ...prev, status: "thinking" }))

      const toolUseBlocks = (searchData.content || []).filter(b => b.type === "tool_use")
      const msgs = [
        { role: "user", content: `pizza trends Europe global 2025: ${q.substring(0, 50)}` },
        { role: "assistant", content: searchData.content }
      ]
      if (toolUseBlocks.length > 0) {
        msgs.push({ role: "user", content: toolUseBlocks.map(b => ({ type: "tool_result", tool_use_id: b.id, content: "תוצאות זמינות" })) })
      }
      msgs.push({ role: "user", content: `בהתבסס על החיפוש, ענה על: "${q}". החזר JSON בלבד:
{"opinion":"3-4 משפטים בעברית רהוטה","globalTrend":"טרנד עולמי רלוונטי שמצאת","score":מספר_1_עד_10,"pros":["יתרון1","יתרון2","יתרון3"],"cons":["חיסרון1","חיסרון2","חיסרון3"],"verdict":"חיובי/שלילי/מעורב"}` })

      const ansRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: apiHeaders,
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 700,
          system: "אתה מארקו פראטי, מומחה פיצה מנאפולי. כותב ל-Gambero Rosso. כתוב עברית רהוטה וטבעית. היה ישיר ודעתני.",
          messages: msgs
        })
      })
      const ansData = await ansRes.json()
      if (ansData.error) throw new Error(ansData.error.message)
      const rawText = (ansData.content || []).find(b => b.type === "text")?.text || ""
      try {
        const analysis = JSON.parse(rawText.replace(/```json|```/g, "").trim())
        setExpertAnswer({ status: "done", text: analysis.opinion, analysis })
      } catch {
        setExpertAnswer({ status: "done", text: rawText, analysis: null })
      }
    } catch (e) {
      console.error("Expert error:", e)
      setExpertAnswer({ status: "error", text: "שגיאה: " + e.message, analysis: null })
    }
  }

  const runAllExperts = async () => {
    setExpertsRunning(true)
    await runExpert()
    setExpertsRunning(false)
  }

  if (!apiKey) return <ApiKeySetup onSuccess={(k) => { sessionStorage.setItem("ppApiKey", k); setApiKey(k) }} />

  const vColor = summary?.verdict === "חיובי" ? "#2ecc71" : summary?.verdict === "שלילי" ? "#e74c3c" : "#f39c12"

  const S = {
    page: { fontFamily: "'Segoe UI', Tahoma, sans-serif", direction: "rtl", minHeight: "100vh", background: "#0f0a00", color: "#fff" },
    nav: { background: "rgba(0,0,0,0.7)", borderBottom: "1px solid #2a1500", padding: "0 16px", display: "flex", alignItems: "center", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 100, flexWrap: "wrap" },
    logo: { fontSize: "18px", fontWeight: 900, color: "#ff6b35", padding: "16px 20px 16px 0", borderLeft: "1px solid #2a1500", marginLeft: "16px", letterSpacing: "-0.5px", cursor: "pointer" },
    navBtn: (active) => ({ background: active ? "rgba(255,107,53,0.15)" : "transparent", border: "none", color: active ? "#ff6b35" : "#888", padding: "16px 14px", cursor: "pointer", fontSize: "13px", fontWeight: active ? 700 : 400, borderBottom: active ? "2px solid #ff6b35" : "2px solid transparent", transition: "all 0.2s" }),
    badge: { background: "#ff6b35", color: "#fff", borderRadius: "10px", padding: "2px 6px", fontSize: "10px", marginLeft: "5px" },
  }

  return (
    <div style={S.page}>
      <nav style={S.nav}>
        <div style={S.logo} onClick={() => setView("home")}>🍕 PizzaPulse <span style={{ color: "#fff" }}>IL</span></div>
        <button style={S.navBtn(view === "home")} onClick={() => setView("home")}>בית</button>
        <button style={S.navBtn(view === "personas")} onClick={() => setView("personas")}>
          פרסונות<span style={S.badge}>{ALL_PERSONAS.length}</span>
        </button>
        <button style={S.navBtn(view === "focusgroup")} onClick={() => setView("focusgroup")}>
          קבוצת מיקוד{selected.length > 0 && <span style={S.badge}>{selected.length}</span>}
        </button>
        <button style={S.navBtn(view === "experts")} onClick={() => setView("experts")}>
          🌍 מומחה אירופי
        </button>
      </nav>

      {/* ── HOME ── */}
      {view === "home" && (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "50px 20px" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🍕</div>
            <h1 style={{ fontSize: 42, fontWeight: 900, margin: 0, background: "linear-gradient(135deg,#ff6b35,#ffd700)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>PizzaPulse IL</h1>
            <p style={{ fontSize: 17, color: "#aaa", margin: "12px 0 0" }}>פלטפורמת קבוצות מיקוד וירטואליות לשוק הפיצות הישראלי</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 32 }}>
            {[
              { icon: "👥", title: `${ALL_PERSONAS.length} פרסונות`, desc: "חתך מלא של החברה הישראלית מבוסס נתוני הלמ\"ס" },
              { icon: "⚡", title: "תוצאות מיידיות", desc: "שיחת קבוצת מיקוד תוך שניות, ללא עלויות מחקר" },
              { icon: "📊", title: "תובנות עסקיות", desc: "המלצות מותאמות לפיצה האט ישראל" },
            ].map(c => (
              <div key={c.title} style={{ background: "rgba(255,107,53,0.07)", border: "1px solid rgba(255,107,53,0.2)", borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>{c.icon}</div>
                <div style={{ fontWeight: 800, marginBottom: 6, fontSize: 15 }}>{c.title}</div>
                <div style={{ color: "#999", fontSize: 12, lineHeight: 1.6 }}>{c.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={() => setView("personas")} style={{ flex: 1, minWidth: 160, padding: "14px", background: "linear-gradient(135deg,#c0392b,#ff6b35)", border: "none", borderRadius: 12, color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 20px rgba(255,107,53,0.4)" }}>👥 פרסונות</button>
            <button onClick={() => setView("focusgroup")} style={{ flex: 1, minWidth: 160, padding: "14px", background: "rgba(255,107,53,0.12)", border: "1px solid #ff6b35", borderRadius: 12, color: "#ff6b35", fontSize: 15, fontWeight: 800, cursor: "pointer" }}>🚀 קבוצת מיקוד</button>
          </div>
        </div>
      )}

      {/* ── PERSONAS ── */}
      {view === "personas" && (
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900 }}>כל הפרסונות <span style={{ color: "#ff6b35" }}>({ALL_PERSONAS.length})</span></h2>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap", alignItems: "center" }}>
              {REGIONS.map(r => (
                <button key={r} onClick={() => setRegionFilter(r)} style={{ background: regionFilter === r ? "#ff6b35" : "rgba(255,255,255,0.05)", border: `1px solid ${regionFilter === r ? "#ff6b35" : "rgba(255,255,255,0.12)"}`, color: regionFilter === r ? "#fff" : "#aaa", padding: "6px 13px", borderRadius: 20, cursor: "pointer", fontSize: 12, transition: "all 0.2s" }}>{r}</button>
              ))}
              <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.1)" }} />
              <button onClick={() => setSelected(filtered.map(p => p.id))} style={{ background: "rgba(255,107,53,0.15)", border: "1px solid #ff6b35", color: "#ff6b35", padding: "6px 13px", borderRadius: 20, cursor: "pointer", fontSize: 12, fontWeight: 700 }}>✓ בחר הכל</button>
              {selected.length > 0 && <button onClick={clearAll} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "#aaa", padding: "6px 13px", borderRadius: 20, cursor: "pointer", fontSize: 12 }}>✕ נקה ({selected.length})</button>}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12 }}>
            {filtered.map(p => {
              const isSel = selected.includes(p.id)
              const isExp = expandedPersona === p.id
              return (
                <div key={p.id} style={{ background: isSel ? `${p.color}15` : "rgba(255,255,255,0.03)", border: `2px solid ${isSel ? p.color : "rgba(255,255,255,0.07)"}`, borderRadius: 12, padding: 14, transition: "all 0.2s" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8, cursor: "pointer" }} onClick={() => setExpandedPersona(isExp ? null : p.id)}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: `${p.color}22`, border: `2px solid ${p.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{p.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: 14, color: isSel ? p.color : "#fff" }}>{p.name}, {p.age}</div>
                      <div style={{ fontSize: 11, color: "#888" }}>{p.job}</div>
                      <div style={{ fontSize: 10, color: "#666" }}>{p.location} · {p.religion}</div>
                    </div>
                    <span style={{ background: `${socioColor[p.socio] || "#888"}20`, color: socioColor[p.socio] || "#888", fontSize: 9, padding: "2px 7px", borderRadius: 10, border: `1px solid ${socioColor[p.socio] || "#888"}40`, flexShrink: 0 }}>{p.socio}</span>
                  </div>
                  {isExp && <div style={{ fontSize: 11, color: "#ccc", lineHeight: 1.7, background: "rgba(0,0,0,0.3)", borderRadius: 7, padding: "8px 10px", marginBottom: 8 }}>{p.personality}</div>}
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
                    {p.tags.map(t => <span key={t} style={{ background: `${p.color}18`, color: p.color, fontSize: 9, padding: "2px 7px", borderRadius: 10 }}>{t}</span>)}
                  </div>
                  <div style={{ display: "flex", gap: 7 }}>
                    <button onClick={() => toggle(p.id)} style={{ flex: 1, padding: "6px", background: isSel ? p.color : "rgba(255,255,255,0.05)", border: `1px solid ${isSel ? p.color : "rgba(255,255,255,0.12)"}`, borderRadius: 7, color: "#fff", cursor: "pointer", fontSize: 11, fontWeight: 700, transition: "all 0.2s" }}>{isSel ? "✓ נבחר" : "+ הוסף"}</button>
                    <button onClick={() => setExpandedPersona(isExp ? null : p.id)} style={{ padding: "6px 10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7, color: "#aaa", cursor: "pointer", fontSize: 11 }}>{isExp ? "▲" : "▼"}</button>
                  </div>
                </div>
              )
            })}
          </div>

          {selected.length > 0 && (
            <div style={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg,#c0392b,#ff6b35)", borderRadius: 30, padding: "12px 24px", boxShadow: "0 8px 32px rgba(255,107,53,0.5)", cursor: "pointer", fontWeight: 800, fontSize: 14, whiteSpace: "nowrap", zIndex: 99 }} onClick={() => setView("focusgroup")}>
              🚀 המשך עם {selected.length} משתתפים ←
            </div>
          )}
        </div>
      )}

      {/* ── FOCUS GROUP ── */}
      {view === "focusgroup" && (
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "24px 20px" }}>
          {messages.length === 0 && !running && (
            <>
              {selected.length > 0 ? (
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 14, marginBottom: 18 }}>
                  <div style={{ fontSize: 11, color: "#777", marginBottom: 8 }}>משתתפים נבחרים ({selected.length}):</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 10 }}>
                    {ALL_PERSONAS.filter(p => selected.includes(p.id)).map(p => (
                      <span key={p.id} style={{ background: `${p.color}18`, border: `1px solid ${p.color}40`, color: p.color, borderRadius: 20, padding: "3px 10px", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
                        {p.icon} {p.name}<span onClick={() => toggle(p.id)} style={{ cursor: "pointer", opacity: 0.5, marginRight: 2 }}>✕</span>
                      </span>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 7 }}>
                    <button onClick={() => setView("personas")} style={{ fontSize: 11, color: "#ff6b35", background: "none", border: "1px solid rgba(255,107,53,0.3)", borderRadius: 7, padding: "4px 10px", cursor: "pointer" }}>+ הוסף</button>
                    <button onClick={clearAll} style={{ fontSize: 11, color: "#777", background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 7, padding: "4px 10px", cursor: "pointer" }}>נקה הכל</button>
                  </div>
                </div>
              ) : (
                <div style={{ background: "rgba(255,107,53,0.08)", border: "1px solid rgba(255,107,53,0.25)", borderRadius: 12, padding: 20, marginBottom: 18, textAlign: "center" }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>👥</div>
                  <div style={{ color: "#ff6b35", fontWeight: 700, marginBottom: 10 }}>בחרי לפחות 2 משתתפים</div>
                  <button onClick={() => setView("personas")} style={{ background: "#ff6b35", border: "none", borderRadius: 10, color: "#fff", padding: "9px 20px", cursor: "pointer", fontWeight: 700 }}>בחר משתתפים ←</button>
                </div>
              )}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: "#555", marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>שאלות לדוגמה:</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {SAMPLES.map(q => (
                    <button key={q} onClick={() => setQuestion(q)} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#bbb", padding: "5px 11px", borderRadius: 20, cursor: "pointer", fontSize: 11, transition: "all 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "#ff6b35"; e.currentTarget.style.color = "#fff" }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#bbb" }}>
                      {q}
                    </button>
                  ))}
                </div>
              </div>
              <textarea value={question} onChange={e => setQuestion(e.target.value)} placeholder="הזיני שאלה, רעיון למוצר חדש, שינוי מחיר, קמפיין..."
                style={{ width: "100%", minHeight: 75, background: "rgba(255,255,255,0.04)", border: "2px solid rgba(255,107,53,0.2)", borderRadius: 12, color: "#fff", fontSize: 14, padding: "11px 13px", resize: "vertical", direction: "rtl", outline: "none", boxSizing: "border-box", lineHeight: 1.6, marginBottom: 12, transition: "border-color 0.2s" }}
                onFocus={e => e.target.style.borderColor = "#ff6b35"} onBlur={e => e.target.style.borderColor = "rgba(255,107,53,0.2)"} />
              {selected.length > 15 && (
                <div style={{ fontSize: 11, color: "#4fc3f7", marginBottom: 10, background: "rgba(79,195,247,0.08)", borderRadius: 8, padding: "6px 10px" }}>
                  📊 מצב סקר — {selected.length} משתתפים יענו כל אחד משפט אחד עם ציון, ויחושב ממוצע סופי
                </div>
              )}
              <button onClick={runGroup} disabled={!question.trim() || selected.length < 2}
                style={{ width: "100%", padding: 14, background: (!question.trim() || selected.length < 2) ? "#1a1a1a" : "linear-gradient(135deg,#c0392b,#ff6b35)", border: "none", borderRadius: 12, color: (!question.trim() || selected.length < 2) ? "#444" : "#fff", fontSize: 16, fontWeight: 800, cursor: "pointer", transition: "all 0.2s" }}>
                {selected.length > 15 ? `📊 הפעל סקר (${selected.length} משתתפים)` : "🚀 הפעל קבוצת מיקוד"}
              </button>
            </>
          )}

          {(messages.length > 0 || running) && (
            <>
              <div style={{ background: "rgba(255,107,53,0.08)", border: "1px solid rgba(255,107,53,0.2)", borderRadius: 10, padding: "9px 14px", marginBottom: 14, fontSize: 13 }}>
                <span style={{ color: "#ff6b35", fontWeight: 700 }}>🎯 </span>{question}
              </div>
              <div style={{ background: "rgba(0,0,0,0.35)", borderRadius: 14, padding: 18, marginBottom: 18, minHeight: 260, border: "1px solid rgba(255,255,255,0.05)" }}>
                {messages.map((msg, i) => {
                  const p = msg.persona
                  return (
                    <div key={i} style={{ display: "flex", gap: 10, marginBottom: 14, animation: "fadeIn 0.3s ease" }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${p.color}22`, border: `2px solid ${p.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>{p.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 10, color: p.color, fontWeight: 700, marginBottom: 3, display: "flex", alignItems: "center", gap: 7 }}>
                          {p.name} · {p.location}
                          {msg.score && <span style={{ background: msg.score >= 7 ? "rgba(46,204,113,0.2)" : msg.score >= 5 ? "rgba(243,156,18,0.2)" : "rgba(231,76,60,0.2)", color: msg.score >= 7 ? "#2ecc71" : msg.score >= 5 ? "#f39c12" : "#e74c3c", fontSize: 10, padding: "1px 7px", borderRadius: 8, fontWeight: 900 }}>{msg.score}/10</span>}
                        </div>
                        <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "4px 12px 12px 12px", padding: "8px 12px", fontSize: 13, lineHeight: 1.6, color: "#eee" }}>{msg.text}</div>
                      </div>
                    </div>
                  )
                })}
                {typing && <div style={{ display: "flex", gap: 8, alignItems: "center", opacity: 0.5 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "2px solid #333", display: "flex", alignItems: "center", justifyContent: "center" }}>⋯</div>
                  <span style={{ color: "#666", fontSize: 12 }}>{typing} מקליד/ה...</span>
                </div>}
                <div ref={bottomRef} />
              </div>

              {summary && (
                <div style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,107,53,0.3)", borderRadius: 14, padding: 22, animation: "fadeIn 0.5s ease" }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#ff6b35", marginBottom: 18 }}>📊 תובנות שיווקיות</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(110px,1fr))", gap: 10, marginBottom: 16 }}>
                    <div style={{ background: `${vColor}15`, border: `2px solid ${vColor}40`, borderRadius: 10, padding: 12, textAlign: "center" }}>
                      <div style={{ fontSize: 9, color: "#777", letterSpacing: 1, textTransform: "uppercase", marginBottom: 3 }}>תוצאה</div>
                      <div style={{ fontSize: 20, fontWeight: 900, color: vColor }}>{summary.verdict}</div>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: 12, textAlign: "center" }}>
                      <div style={{ fontSize: 9, color: "#777", letterSpacing: 1, textTransform: "uppercase", marginBottom: 3 }}>ציון</div>
                      <div style={{ fontSize: 24, fontWeight: 900 }}>{summary.score}<span style={{ fontSize: 12, color: "#555" }}>/10</span></div>
                    </div>
                  </div>
                  <div style={{ background: "rgba(255,107,53,0.07)", borderRadius: 9, padding: "11px 14px", marginBottom: 14, borderRight: "3px solid #ff6b35" }}>
                    <div style={{ fontSize: 10, color: "#ff6b35", fontWeight: 700, marginBottom: 3 }}>תובנה מרכזית</div>
                    <div style={{ fontSize: 13, color: "#eee", lineHeight: 1.6 }}>{summary.mainInsight}</div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                    <div><div style={{ fontSize: 10, color: "#2ecc71", fontWeight: 700, marginBottom: 6 }}>✅ יתרונות</div>{(summary.pros||[]).map((p,i) => <div key={i} style={{ fontSize: 12, color: "#ccc", marginBottom: 4, display: "flex", gap: 5 }}><span style={{ color: "#2ecc71" }}>›</span>{p}</div>)}</div>
                    <div><div style={{ fontSize: 10, color: "#e74c3c", fontWeight: 700, marginBottom: 6 }}>⚠️ חסרונות</div>{(summary.cons||[]).map((c,i) => <div key={i} style={{ fontSize: 12, color: "#ccc", marginBottom: 4, display: "flex", gap: 5 }}><span style={{ color: "#e74c3c" }}>›</span>{c}</div>)}</div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 9, padding: "11px 14px", marginBottom: 14 }}>
                    <div style={{ fontSize: 10, color: "#888", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 3 }}>המלצה לפיצה האט</div>
                    <div style={{ fontSize: 13, color: "#fff", lineHeight: 1.6 }}>{summary.recommendation}</div>
                  </div>
                  <button onClick={() => { setMessages([]); setSummary(null); setQuestion("") }} style={{ width: "100%", padding: "11px", background: "rgba(255,107,53,0.12)", border: "1px solid rgba(255,107,53,0.4)", borderRadius: 9, color: "#ff6b35", cursor: "pointer", fontWeight: 700, fontSize: 13 }}>← שאלה חדשה</button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── EXPERT PANEL ── */}
      {view === "experts" && (
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "28px 20px" }}>

          {/* Expert profile */}
          <div style={{ display: "flex", gap: 16, alignItems: "center", background: "rgba(180,140,60,0.1)", border: "1px solid rgba(180,140,60,0.3)", borderRadius: 16, padding: 20, marginBottom: 24 }}>
            <div style={{ fontSize: 48 }}>🇮🇹</div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 18, color: "#e8b84b" }}>מארקו פראטי</div>
              <div style={{ fontSize: 12, color: "#aaa", marginBottom: 4 }}>מומחה פיצה אירופי | נאפולי, איטליה</div>
              <div style={{ fontSize: 11, color: "#888", lineHeight: 1.5 }}>כותב ל-Gambero Rosso · מתמחה בשוק האירופי · בקיא בטרנדים גלובליים · מחפש ברשת לפני כל תשובה</div>
            </div>
            {expertAnswer?.status === "searching" && <span style={{ marginRight: "auto", color: "#4fc3f7", fontSize: 12, whiteSpace: "nowrap" }}>🔍 מחפש ברשת...</span>}
            {expertAnswer?.status === "thinking" && <span style={{ marginRight: "auto", color: "#f39c12", fontSize: 12, whiteSpace: "nowrap" }}>💭 מנתח...</span>}
            {expertAnswer?.status === "done" && <span style={{ marginRight: "auto", background: "#2ecc7122", color: "#2ecc71", fontSize: 11, padding: "3px 10px", borderRadius: 10, border: "1px solid #2ecc7144", whiteSpace: "nowrap" }}>✓ ניתוח מוכן</span>}
          </div>

          {/* Question input */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(180,140,60,0.25)", borderRadius: 14, padding: 20, marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#e8b84b", marginBottom: 12 }}>🔍 שאל את מארקו</div>
            <textarea value={expertQuestion} onChange={e => setExpertQuestion(e.target.value)}
              placeholder="הצעה לפיצה, רעיון לטופינג, שאלה שיווקית... מארקו יחפש ברשת ויענה מהזווית האירופית"
              style={{ width: "100%", minHeight: 70, background: "rgba(255,255,255,0.04)", border: "2px solid rgba(180,140,60,0.2)", borderRadius: 10, color: "#fff", fontSize: 13, padding: "10px 12px", resize: "vertical", direction: "rtl", outline: "none", boxSizing: "border-box", lineHeight: 1.6, marginBottom: 12, transition: "border-color 0.2s" }}
              onFocus={e => e.target.style.borderColor = "#e8b84b"} onBlur={e => e.target.style.borderColor = "rgba(180,140,60,0.2)"} />
            {question && !expertQuestion && (
              <div style={{ fontSize: 11, color: "#888", marginBottom: 10 }}>💡 ישתמש בשאלה מקבוצת המיקוד: "{question}"</div>
            )}
            <button onClick={runAllExperts} disabled={expertsRunning || (!expertQuestion.trim() && !question.trim())}
              style={{ width: "100%", padding: 13, background: expertsRunning ? "#1a1a1a" : "linear-gradient(135deg,#7d5a00,#e8b84b)", border: "none", borderRadius: 10, color: expertsRunning ? "#444" : "#000", fontSize: 15, fontWeight: 800, cursor: expertsRunning ? "not-allowed" : "pointer" }}>
              {expertsRunning ? "⏳ מארקו מחפש ברשת..." : "🌐 שלח למארקו + חיפוש ברשת"}
            </button>
          </div>

          {/* Expert answer */}
          {expertAnswer?.status === "done" && expertAnswer.analysis && (() => {
            const a = expertAnswer.analysis
            const sColor = a.score >= 8 ? "#2ecc71" : a.score >= 6 ? "#f39c12" : a.score >= 4 ? "#e67e22" : "#e74c3c"
            const vColor = a.verdict === "חיובי" ? "#2ecc71" : a.verdict === "שלילי" ? "#e74c3c" : "#f39c12"
            return (
              <div style={{ animation: "fadeIn 0.4s ease" }}>
                {/* Opinion */}
                <div style={{ background: "rgba(0,0,0,0.35)", border: "1px solid rgba(180,140,60,0.25)", borderRadius: 14, padding: 20, marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: "#e8b84b", fontWeight: 700, marginBottom: 10 }}>💬 חוות דעת מארקו</div>
                  <div style={{ fontSize: 14, color: "#eee", lineHeight: 1.8 }}>{a.opinion}</div>
                  {a.globalTrend && (
                    <div style={{ marginTop: 12, background: "rgba(180,140,60,0.08)", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#ccc" }}>
                      <span style={{ color: "#e8b84b", fontWeight: 700 }}>🌍 טרנד עולמי: </span>{a.globalTrend}
                    </div>
                  )}
                </div>

                {/* Score + verdict */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                  <div style={{ background: `${sColor}15`, border: `2px solid ${sColor}50`, borderRadius: 12, padding: 16, textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: "#888", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>ציון גלובלי</div>
                    <div style={{ fontSize: 36, fontWeight: 900, color: sColor }}>{a.score}<span style={{ fontSize: 16, color: "#555" }}>/10</span></div>
                  </div>
                  <div style={{ background: `${vColor}15`, border: `2px solid ${vColor}50`, borderRadius: 12, padding: 16, textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: "#888", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>המלצה</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: vColor }}>{a.verdict}</div>
                  </div>
                </div>

                {/* Pros & Cons */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                  <div style={{ background: "rgba(46,204,113,0.06)", border: "1px solid rgba(46,204,113,0.2)", borderRadius: 12, padding: 14 }}>
                    <div style={{ fontSize: 11, color: "#2ecc71", fontWeight: 700, marginBottom: 8 }}>✅ יתרונות לפי טרנדים עולמיים</div>
                    {(a.pros || []).map((p, i) => <div key={i} style={{ fontSize: 12, color: "#ccc", marginBottom: 5, display: "flex", gap: 6 }}><span style={{ color: "#2ecc71", flexShrink: 0 }}>›</span>{p}</div>)}
                  </div>
                  <div style={{ background: "rgba(231,76,60,0.06)", border: "1px solid rgba(231,76,60,0.2)", borderRadius: 12, padding: 14 }}>
                    <div style={{ fontSize: 11, color: "#e74c3c", fontWeight: 700, marginBottom: 8 }}>⚠️ חסרונות לפי טרנדים עולמיים</div>
                    {(a.cons || []).map((c, i) => <div key={i} style={{ fontSize: 12, color: "#ccc", marginBottom: 5, display: "flex", gap: 6 }}><span style={{ color: "#e74c3c", flexShrink: 0 }}>›</span>{c}</div>)}
                  </div>
                </div>

                <button onClick={() => setExpertAnswer(null)}
                  style={{ width: "100%", padding: "10px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "#666", cursor: "pointer", fontSize: 13 }}>
                  ← שאלה חדשה למארקו
                </button>
              </div>
            )
          })()}

          {expertAnswer?.status === "error" && (
            <div style={{ background: "rgba(231,76,60,0.1)", border: "1px solid rgba(231,76,60,0.3)", borderRadius: 12, padding: 16, color: "#e74c3c", fontSize: 13 }}>
              {expertAnswer.text}
            </div>
          )}
        </div>
      )}
      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; }
        textarea::placeholder { color: #444; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #2a1500; border-radius: 3px; }
        @media (max-width: 600px) { nav { padding: 0 8px; } }
      `}</style>
    </div>
  )
}
