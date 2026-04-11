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
        body: JSON.stringify({ model: "claude-haiku-4-5-20251001", max_tokens: 10, messages: [{ role: "user", content: "say ok" }] })
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
  const [expertAnswers, setExpertAnswers] = useState({}) // {expertId: {status, text}}
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
  const runGroup = async () => {
    if (!question.trim() || selected.length < 2) return
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
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 4000, system: sys, messages: [{ role: "user", content: `נושא: "${question}"\nצור שיחה של 10-14 הודעות.` }] })
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
  const runExpert = async (expert) => {
    const q = (expertQuestion && expertQuestion.trim()) ? expertQuestion.trim() : question.trim()
    if (!q) return
    const searchTopic = expert.searchQuery || "pizza trends 2025"
    setExpertAnswers(prev => ({ ...prev, [expert.id]: { status: "searching", text: "" } }))
    try {
      const userMsg = `חפש ברשת טרנדים עדכניים ב-2025 בנושא: "${searchTopic}".
לאחר החיפוש, ענה בעברית על השאלה הבאה מהזווית המקצועית שלך כ${expert.nameHe}: "${q}"
ענה ב-4-5 משפטים. כלול נתון/טרנד ספציפי שמצאת ברשת.`

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: apiHeaders,
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 800,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          system: `אתה ${expert.nameHe} (${expert.name}), ${expert.title}. ${expert.personality} ענה תמיד בעברית.`,
          messages: [{ role: "user", content: userMsg }]
        })
      })

      const data = await res.json()
      if (data.error) throw new Error(data.error.message)
      setExpertAnswers(prev => ({ ...prev, [expert.id]: { ...prev[expert.id], status: "thinking" } }))

      const textBlocks = (data.content || []).filter(b => b.type === "text")

      if (textBlocks.length === 0 && data.stop_reason === "tool_use") {
        // Claude did a search — now get the answer
        const toolUseBlocks = data.content.filter(b => b.type === "tool_use")
        const followRes = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST", headers: apiHeaders,
          body: JSON.stringify({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 600,
            system: `אתה ${expert.nameHe} (${expert.name}), ${expert.title}. ${expert.personality} ענה תמיד בעברית.`,
            messages: [
              { role: "user", content: userMsg },
              { role: "assistant", content: data.content },
              { role: "user", content: toolUseBlocks.map(b => ({ type: "tool_result", tool_use_id: b.id, content: "תוצאות החיפוש זמינות" })) }
            ]
          })
        })
        const followData = await followRes.json()
        if (followData.error) throw new Error(followData.error.message)
        const finalText = (followData.content || []).find(b => b.type === "text")?.text || "לא התקבלה תשובה"
        setExpertAnswers(prev => ({ ...prev, [expert.id]: { status: "done", text: finalText } }))
      } else {
        const finalText = textBlocks.map(b => b.text).join("\n") || "לא התקבלה תשובה"
        setExpertAnswers(prev => ({ ...prev, [expert.id]: { status: "done", text: finalText } }))
      }
    } catch (e) {
      console.error("Expert error:", e)
      setExpertAnswers(prev => ({ ...prev, [expert.id]: { status: "error", text: "שגיאה: " + e.message } }))
    }
  }

  const runAllExperts = async () => {
    setExpertsRunning(true)
    setExpertSummary(null)
    for (const expert of EXPERT_PERSONAS) {
      await runExpert(expert)
      await new Promise(res => setTimeout(res, 3000))
    }
    // Generate expert summary with scores
    const q = (expertQuestion && expertQuestion.trim()) ? expertQuestion.trim() : question.trim()
    try {
      const answers = EXPERT_PERSONAS.map(e => {
        const ans = expertAnswers[e.id]
        return ans?.text ? `${e.nameHe} (${e.region}): ${ans.text}` : null
      }).filter(Boolean).join("\n\n")

      if (answers) {
        const sumRes = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST", headers: apiHeaders,
          body: JSON.stringify({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 600,
            system: `סכם חוות דעת מומחים בינלאומיים לפיצה. החזר JSON בלבד:
{"globalTrend":"טרנד עולמי מרכזי","scores":{"marco":1-10,"jessica":1-10,"kenji":1-10,"sarah":1-10},"consensus":"האם יש קונצנזוס בין המומחים","recommendation":"המלצה לפיצה האט מהזווית הבינלאומית"}`,
            messages: [{ role: "user", content: `שאלה: "${q}"\n\nחוות דעת המומחים:\n${answers}` }]
          })
        })
        const sumData = await sumRes.json()
        const sumText = sumData.content?.find(b => b.type === "text")?.text
        if (sumText) {
          try { setExpertSummary(JSON.parse(sumText.replace(/\`\`\`json|\`\`\`/g,"").trim())) }
          catch { console.log("Expert summary parse error") }
        }
      }
    } catch(e) { console.error("Expert summary error", e) }
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
          🌍 פאנל מומחים<span style={S.badge}>{EXPERT_PERSONAS.length}</span>
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
              { icon: "🌍", title: "4 מומחים עולמיים", desc: "מומחי פיצה מאיטליה, ארה\"ב, יפן ואוסטרליה עם גישה לאינטרנט" },
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
            <button onClick={() => setView("experts")} style={{ flex: 1, minWidth: 160, padding: "14px", background: "rgba(100,200,255,0.1)", border: "1px solid #4fc3f7", borderRadius: 12, color: "#4fc3f7", fontSize: 15, fontWeight: 800, cursor: "pointer" }}>🌍 מומחים עולמיים</button>
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
              <button onClick={runGroup} disabled={!question.trim() || selected.length < 2}
                style={{ width: "100%", padding: 14, background: (!question.trim() || selected.length < 2) ? "#1a1a1a" : "linear-gradient(135deg,#c0392b,#ff6b35)", border: "none", borderRadius: 12, color: (!question.trim() || selected.length < 2) ? "#444" : "#fff", fontSize: 16, fontWeight: 800, cursor: "pointer", transition: "all 0.2s" }}>
                🚀 הפעל קבוצת מיקוד
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
                        <div style={{ fontSize: 10, color: p.color, fontWeight: 700, marginBottom: 3 }}>{p.name} · {p.location}</div>
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

      {/* ── EXPERTS PANEL ── */}
      {view === "experts" && (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 20px" }}>
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 900 }}>🌍 פאנל מומחי פיצה בינלאומיים</h2>
            <p style={{ margin: 0, color: "#888", fontSize: 13 }}>המומחים מחפשים בזמן אמת את הטרנדים העדכניים ביותר ועונים מהזווית המקצועית שלהם</p>
          </div>

          {/* Expert cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12, marginBottom: 24 }}>
            {EXPERT_PERSONAS.map(e => (
              <div key={e.id} style={{ background: `${e.color}12`, border: `1px solid ${e.color}40`, borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{e.icon}</div>
                <div style={{ fontWeight: 800, fontSize: 15, color: e.color, marginBottom: 2 }}>{e.name}</div>
                <div style={{ fontSize: 11, color: "#aaa", marginBottom: 6 }}>{e.location}</div>
                <div style={{ fontSize: 11, color: "#888", lineHeight: 1.5 }}>{e.title}</div>
              </div>
            ))}
          </div>

          {/* Question input */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(100,200,255,0.2)", borderRadius: 14, padding: 20, marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#4fc3f7", marginBottom: 12 }}>🔍 שאל את המומחים</div>
            <textarea value={expertQuestion} onChange={e => setExpertQuestion(e.target.value)}
              placeholder="לדוגמה: האם פיצה שווארמה עם טחינה יכולה להצליח בשוק הגלובלי? מה הטרנדים העכשוויים בפיצה?"
              style={{ width: "100%", minHeight: 70, background: "rgba(255,255,255,0.04)", border: "2px solid rgba(100,200,255,0.2)", borderRadius: 10, color: "#fff", fontSize: 13, padding: "10px 12px", resize: "vertical", direction: "rtl", outline: "none", boxSizing: "border-box", lineHeight: 1.6, marginBottom: 12, transition: "border-color 0.2s" }}
              onFocus={e => e.target.style.borderColor = "#4fc3f7"} onBlur={e => e.target.style.borderColor = "rgba(100,200,255,0.2)"} />
            {question && !expertQuestion && (
              <div style={{ fontSize: 11, color: "#888", marginBottom: 10 }}>💡 ישתמש בשאלה מקבוצת המיקוד: "{question}"</div>
            )}
            <button onClick={runAllExperts} disabled={expertsRunning || (!expertQuestion.trim() && !question.trim())}
              style={{ width: "100%", padding: 13, background: expertsRunning ? "#1a1a1a" : "linear-gradient(135deg,#0e4d8a,#4fc3f7)", border: "none", borderRadius: 10, color: expertsRunning ? "#444" : "#fff", fontSize: 15, fontWeight: 800, cursor: expertsRunning ? "not-allowed" : "pointer" }}>
              {expertsRunning ? "⏳ המומחים מחפשים ברשת..." : "🌐 שלח לכל המומחים + חיפוש ברשת"}
            </button>
          </div>

          {/* Expert answers */}
          {EXPERT_PERSONAS.map(e => {
            const ans = expertAnswers[e.id]
            return (
              <div key={e.id} style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${e.color}30`, borderRadius: 14, padding: 20, marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <span style={{ fontSize: 28 }}>{e.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, color: e.color, fontSize: 15 }}>{e.name}</div>
                    <div style={{ fontSize: 11, color: "#888" }}>{e.title}</div>
                  </div>
                  {!ans && (
                    <button onClick={() => runExpert(e)} style={{ background: `${e.color}20`, border: `1px solid ${e.color}50`, color: e.color, padding: "6px 14px", borderRadius: 20, cursor: "pointer", fontSize: 12, fontWeight: 700 }}>
                      🌐 שלח
                    </button>
                  )}
                  {ans?.status === "searching" && <span style={{ color: "#4fc3f7", fontSize: 12 }}>🔍 מחפש ברשת...</span>}
                  {ans?.status === "thinking" && <span style={{ color: "#f39c12", fontSize: 12 }}>💭 מנתח...</span>}
                  {ans?.status === "done" && <span style={{ background: "#2ecc7122", color: "#2ecc71", fontSize: 11, padding: "3px 9px", borderRadius: 10, border: "1px solid #2ecc7144" }}>🌐 מחקר עדכני</span>}
                  {ans?.status === "error" && <span style={{ color: "#e74c3c", fontSize: 12 }}>❌</span>}
                </div>
                {ans?.text && (
                  <div style={{ fontSize: 13, color: "#ddd", lineHeight: 1.8, borderTop: `1px solid ${e.color}20`, paddingTop: 14, whiteSpace: "pre-wrap" }}>
                    {ans.text}
                  </div>
                )}
                {!ans && (
                  <div style={{ fontSize: 12, color: "#555", fontStyle: "italic" }}>לחץ "שלח" לקבלת חוות דעת מבוססת מחקר עדכני מהרשת</div>
                )}
              </div>
            )
          })}
        </div>

          {/* Expert Summary */}
          {expertSummary && (
            <div style={{ marginTop: 28, background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,215,0,0.3)", borderRadius: 16, padding: 24, animation: "fadeIn 0.5s ease" }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#ffd700", marginBottom: 20 }}>🌍 סיכום פאנל מומחים בינלאומיים</div>
              <div style={{ background: "rgba(255,215,0,0.08)", borderRadius: 10, padding: "12px 16px", marginBottom: 16, borderRight: "3px solid #ffd700" }}>
                <div style={{ fontSize: 11, color: "#ffd700", fontWeight: 700, marginBottom: 4 }}>טרנד עולמי מרכזי</div>
                <div style={{ fontSize: 14, color: "#eee", lineHeight: 1.6 }}>{expertSummary.globalTrend}</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 10, marginBottom: 16 }}>
                {EXPERT_PERSONAS.map(e => {
                  const score = expertSummary.scores?.[e.id]
                  const scoreColor = score >= 8 ? "#2ecc71" : score >= 6 ? "#f39c12" : "#e74c3c"
                  return (
                    <div key={e.id} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "12px", textAlign: "center" }}>
                      <div style={{ fontSize: 20, marginBottom: 4 }}>{e.icon}</div>
                      <div style={{ fontSize: 11, color: "#aaa", marginBottom: 4 }}>{e.nameHe}</div>
                      <div style={{ fontSize: 24, fontWeight: 900, color: scoreColor }}>{score || "?"}<span style={{ fontSize: 12, color: "#555" }}>/10</span></div>
                    </div>
                  )
                })}
              </div>
              <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "12px 16px", marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: "#888", fontWeight: 700, marginBottom: 4 }}>קונצנזוס בינלאומי</div>
                <div style={{ fontSize: 14, color: "#eee" }}>{expertSummary.consensus}</div>
              </div>
              <div style={{ background: "rgba(255,107,53,0.08)", border: "1px solid rgba(255,107,53,0.2)", borderRadius: 10, padding: "12px 16px" }}>
                <div style={{ fontSize: 11, color: "#ff6b35", fontWeight: 700, marginBottom: 4 }}>המלצה לפיצה האט מהזווית הבינלאומית</div>
                <div style={{ fontSize: 14, color: "#fff" }}>{expertSummary.recommendation}</div>
              </div>
            </div>
          )}

          {Object.keys(expertAnswers).length > 0 && (
            <button onClick={() => { setExpertAnswers({}); setExpertSummary(null) }}
              style={{ marginTop: 16, width: "100%", padding: "10px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "#666", cursor: "pointer", fontSize: 13 }}>
              ← שאלה חדשה למומחים
            </button>
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
