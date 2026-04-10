import { useState, useRef, useEffect } from "react"
import { ALL_PERSONAS, REGIONS, socioColor } from "./personas.js"

function ApiKeySetup({ onSuccess }) {
  const [key, setKey] = useState("")
  const [status, setStatus] = useState("idle") // idle | checking | error | success
  const [errorMsg, setErrorMsg] = useState("")
  const [show, setShow] = useState(false)

  const testKey = async () => {
    if (!key.trim().startsWith("sk-ant-")) {
      setErrorMsg("המפתח צריך להתחיל ב־sk-ant-")
      setStatus("error")
      return
    }
    setStatus("checking")
    setErrorMsg("")
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": key.trim(),
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 10,
          messages: [{ role: "user", content: "say ok" }]
        })
      })
      const data = await res.json()
      if (data.error) {
        setErrorMsg(data.error.message || "מפתח לא תקין")
        setStatus("error")
      } else {
        setStatus("success")
        setTimeout(() => onSuccess(key.trim()), 1000)
      }
    } catch (e) {
      setErrorMsg("שגיאת חיבור — בדקי את המפתח")
      setStatus("error")
    }
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
          <div style={{ color: "#888", fontSize: 13, lineHeight: 1.7, marginBottom: 24 }}>
            הכלי משתמש ב-Anthropic Claude API. כל משתמש מזין מפתח משלו — המפתח שלך נשאר פרטי לחלוטין.
          </div>

          <div style={{ background: "rgba(255,107,53,0.08)", border: "1px solid rgba(255,107,53,0.2)", borderRadius: 12, padding: 16, marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#ff6b35", marginBottom: 10 }}>איך מקבלים מפתח? (חינם)</div>
            {[
              ["1", "היכנסי ל־", "console.anthropic.com", "https://console.anthropic.com"],
              ["2", "הירשמי ולכי ל־", "API Keys → Create Key", null],
              ["3", "העתיקי את המפתח", "(מתחיל ב-sk-ant-...)", null],
            ].map(([n, text, bold, link]) => (
              <div key={n} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                <span style={{ background: "#ff6b35", color: "#fff", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{n}</span>
                <span style={{ fontSize: 13, color: "#ccc" }}>
                  {text}
                  {link
                    ? <a href={link} target="_blank" rel="noreferrer" style={{ color: "#ff6b35", textDecoration: "none", fontWeight: 700 }}>{bold}</a>
                    : <strong style={{ color: "#fff" }}>{bold}</strong>}
                </span>
              </div>
            ))}
          </div>

          <div style={{ position: "relative", marginBottom: 14 }}>
            <input
              type={show ? "text" : "password"}
              value={key}
              onChange={e => { setKey(e.target.value); setStatus("idle") }}
              placeholder="sk-ant-api03-..."
              style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: `2px solid ${status === "error" ? "#e74c3c" : status === "success" ? "#2ecc71" : "rgba(255,107,53,0.3)"}`, borderRadius: 10, color: "#fff", fontSize: 14, padding: "12px 48px 12px 14px", outline: "none", boxSizing: "border-box", direction: "ltr", letterSpacing: 1, transition: "border-color 0.2s" }}
              onKeyDown={e => e.key === "Enter" && testKey()}
            />
            <button onClick={() => setShow(s => !s)} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: 16 }}>
              {show ? "🙈" : "👁️"}
            </button>
          </div>

          {status === "error" && (
            <div style={{ background: "rgba(231,76,60,0.1)", border: "1px solid rgba(231,76,60,0.3)", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#e74c3c" }}>
              ❌ {errorMsg}
            </div>
          )}

          {status === "success" && (
            <div style={{ background: "rgba(46,204,113,0.1)", border: "1px solid rgba(46,204,113,0.3)", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#2ecc71" }}>
              ✅ המפתח תקין! מכניס אותך...
            </div>
          )}

          <button onClick={testKey} disabled={!key.trim() || status === "checking" || status === "success"}
            style={{ width: "100%", padding: "14px", background: (!key.trim() || status === "checking" || status === "success") ? "#1a1a1a" : "linear-gradient(135deg,#c0392b,#ff6b35)", border: "none", borderRadius: 10, color: (!key.trim() || status === "checking") ? "#444" : "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer", boxShadow: key.trim() && status === "idle" ? "0 4px 20px rgba(255,107,53,0.35)" : "none", transition: "all 0.2s" }}>
            {status === "checking" ? "⏳ בודק מפתח..." : status === "success" ? "✅ מצוין!" : "🚀 כניסה לפלטפורמה"}
          </button>

          <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "#555" }}>
            המפתח נשמר רק בדפדפן שלך ולא נשלח לשום שרת חיצוני
          </div>
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
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages, typing])

  const filtered = ALL_PERSONAS.filter(p => regionFilter === "הכל" || p.region === regionFilter)
  const toggle = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  const clearAll = () => setSelected([])

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
→ מתאימה לדתיים, מסורתיים-דתיים ומסורתיים רגילים

🟡 כשר מהדרין רבנות מקומית:
ירושלים (מלחה, תלפיות), מבשרת ציון, מעלה אדומים, זיכרון יעקב, חדרה, חריש, כפר יונה, בני דרור, נתיבות, אופקים, ערד, מצפה רמון, קרית אתא, באר שבע רמות

🟢 כשר רבנות מקומית:
חיפה טכניון, יקנעם, פרדס חנה, רמת ישי, קרית מוצקין, מעלות, בית שאן, כרמיאל, קרית שמונה, פארק אדיסון, ראש פינה

⚫ ללא כשרות (בעיקר יישובים ערביים — פתוח לכולם):
אום אל פאחם, נצרת, סכנין, שפרעם, כפר מגאר, טמרה, כפר קרע, דאלית אל כרמל, ירכא, רהט, טירה, שועפאט, תל אביב רמת אביב, חיפה המושבה הגרמנית, נס ציונה, חולון מערב, אילת

📌 כללים לשיחה:
- כל פרסונה יודעת אם יש סניף פיצה האט מתאים קרוב אליה
- חרדים מבני ברק/ירושלים — יודעים על כשרות רובין
- מסורתיים ודתיים לאומיים — יודעים על בד"ץ בית יוסף
- ערבים ביישובים עם סניף — יודעים שיש סניף ללא כשרות (פתוח להם)
- פרסונות מאזורים ללא סניף מתאים — יביעו תסכול או מרחק

פרסונות:
${chosen.map(p => `- ${p.name} (${p.age}, ${p.location}, ${p.religion}): ${p.personality}`).join("\n")}

חוקים:
1. כל פרסונה מדברת בגוף ראשון בשפה הייחודית לה
2. שיחה טבעית — הסכמות, חילוקי דעות, תגובות הדדיות
3. כל פרסונה תגיב לפחות פעמיים
4. ריאליזם ישראלי מלא — מחירים, מותגים, הרגלים אמיתיים
5. כשנושא הכשרות עולה — הפרסונות הרלוונטיות יודעות על כשרות רובין ובית יוסף בפיצה האט
6. החזר JSON בלבד: [{"speaker":"שם","text":"הודעה"}]
אל תוסיף כלום מחוץ ל-JSON`

    const apiHeaders = {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    }

    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: apiHeaders,
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          system: sys,
          messages: [{ role: "user", content: `נושא: "${question}"\nצור שיחה של 10-14 הודעות.` }]
        })
      })
      const d = await r.json()
      console.log("=== FULL API RESPONSE ===", JSON.stringify(d))
      if (d.error) throw new Error(d.error.message || JSON.stringify(d.error))
      if (!d.content || !d.content[0]) throw new Error("תשובה ריקה מה-API: " + JSON.stringify(d))
      const rawText = d.content[0].text
      console.log("=== RAW TEXT ===", rawText)
      let parsed
      try {
        // try full parse first
        parsed = JSON.parse(rawText.replace(/```json|```/g, "").trim())
      } catch(parseErr) {
        try {
          const clean = rawText.replace(/```json|```/g, "").trim()
          const lastGood = clean.lastIndexOf("},")
          const fixed = lastGood > 0 ? clean.substring(0, lastGood + 1) + "]" : "[]"
          parsed = JSON.parse(fixed)
        } catch(e2) {
          throw new Error("שגיאת פירסור — נסי שוב")
        }
      }

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
        method: "POST",
        headers: apiHeaders,
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          system: `סכם קבוצת מיקוד. החזר JSON בלבד:
{"verdict":"חיובי/שלילי/מעורב","score":1-10,"mainInsight":"תובנה","pros":["..."],"cons":["..."],"segments":{"supporters":["שמות"],"opponents":["שמות"]},"recommendation":"המלצה לפיצה האט"}`,
          messages: [{ role: "user", content: `שאלה: "${question}"\n${parsed.map(m => `${m.speaker}: ${m.text}`).join("\n")}` }]
        })
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

  if (!apiKey) return <ApiKeySetup onSuccess={(k) => { sessionStorage.setItem("ppApiKey", k); setApiKey(k) }} />

  const vColor = summary?.verdict === "חיובי" ? "#2ecc71" : summary?.verdict === "שלילי" ? "#e74c3c" : "#f39c12"

  const S = {
    page: { fontFamily: "'Segoe UI', Tahoma, sans-serif", direction: "rtl", minHeight: "100vh", background: "#0f0a00", color: "#fff" },
    nav: { background: "rgba(0,0,0,0.7)", borderBottom: "1px solid #2a1500", padding: "0 24px", display: "flex", alignItems: "center", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 100 },
    logo: { fontSize: "20px", fontWeight: 900, color: "#ff6b35", padding: "16px 24px 16px 0", borderLeft: "1px solid #2a1500", marginLeft: "24px", letterSpacing: "-0.5px", cursor: "pointer" },
    navBtn: (active) => ({ background: active ? "rgba(255,107,53,0.15)" : "transparent", border: "none", color: active ? "#ff6b35" : "#888", padding: "18px 20px", cursor: "pointer", fontSize: "14px", fontWeight: active ? 700 : 400, borderBottom: active ? "2px solid #ff6b35" : "2px solid transparent", transition: "all 0.2s" }),
    badge: { background: "#ff6b35", color: "#fff", borderRadius: "10px", padding: "2px 7px", fontSize: "11px", marginLeft: "6px" },
  }

  return (
    <div style={S.page}>
      {/* NAV */}
      <nav style={S.nav}>
        <div style={S.logo} onClick={() => setView("home")}>🍕 PizzaPulse <span style={{ color: "#fff" }}>IL</span></div>
        <button style={S.navBtn(view === "home")} onClick={() => setView("home")}>בית</button>
        <button style={S.navBtn(view === "personas")} onClick={() => setView("personas")}>
          פרסונות <span style={S.badge}>{ALL_PERSONAS.length}</span>
        </button>
        <button style={S.navBtn(view === "focusgroup")} onClick={() => setView("focusgroup")}>
          קבוצת מיקוד {selected.length > 0 && <span style={S.badge}>{selected.length}</span>}
        </button>
      </nav>

      {/* ── HOME ── */}
      {view === "home" && (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px 20px" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 72, marginBottom: 20 }}>🍕</div>
            <h1 style={{ fontSize: 44, fontWeight: 900, margin: 0, background: "linear-gradient(135deg,#ff6b35,#ffd700)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              PizzaPulse IL
            </h1>
            <p style={{ fontSize: 18, color: "#aaa", margin: "14px 0 0" }}>
              פלטפורמת קבוצות מיקוד וירטואליות לשוק הפיצות הישראלי
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20, marginBottom: 40 }}>
            {[
              { icon: "👥", title: "27 פרסונות", desc: "חתך מלא של החברה הישראלית — מכל דת, אזור ומצב סוציואקונומי" },
              { icon: "⚡", title: "תוצאות מיידיות", desc: "שיחת קבוצת מיקוד מלאה תוך שניות, ללא עלויות מחקר שוק" },
              { icon: "📊", title: "תובנות עסקיות", desc: "ניתוח אוטומטי עם המלצות מותאמות לפיצה האט ישראל" },
            ].map(c => (
              <div key={c.title} style={{ background: "rgba(255,107,53,0.07)", border: "1px solid rgba(255,107,53,0.2)", borderRadius: 16, padding: 24 }}>
                <div style={{ fontSize: 38, marginBottom: 12 }}>{c.icon}</div>
                <div style={{ fontWeight: 800, marginBottom: 8, fontSize: 16 }}>{c.title}</div>
                <div style={{ color: "#999", fontSize: 13, lineHeight: 1.7 }}>{c.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #2a1500", borderRadius: 16, padding: 28, marginBottom: 32 }}>
            <div style={{ fontWeight: 800, marginBottom: 16, fontSize: 15, color: "#ff6b35" }}>🗺️ כיסוי גאוגרפי ודמוגרפי</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {[["מרכז","13"],["צפון","8"],["דרום","5"],['יו"ש',"1"],["חילונים","10"],["מסורתיים","5"],["דתיים-לאומיים","1"],["חרדים","1"],["מוסלמים","3"],["נוצרים","2"],["דרוזים","1"],["עולים","2"]].map(([label, count]) => (
                <span key={label} style={{ background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.25)", borderRadius: 20, padding: "5px 14px", fontSize: 13, color: "#ddd" }}>
                  {label} <strong style={{ color: "#ff6b35" }}>{count}</strong>
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <button onClick={() => setView("personas")} style={{ flex: 1, minWidth: 200, padding: "15px", background: "linear-gradient(135deg,#c0392b,#ff6b35)", border: "none", borderRadius: 12, color: "#fff", fontSize: 16, fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 20px rgba(255,107,53,0.4)" }}>
              👥 הכר את הפרסונות
            </button>
            <button onClick={() => setView("focusgroup")} style={{ flex: 1, minWidth: 200, padding: "15px", background: "rgba(255,107,53,0.12)", border: "1px solid #ff6b35", borderRadius: 12, color: "#ff6b35", fontSize: 16, fontWeight: 800, cursor: "pointer" }}>
              🚀 הפעל קבוצת מיקוד
            </button>
          </div>
        </div>
      )}

      {/* ── PERSONAS ── */}
      {view === "personas" && (
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>
              כל הפרסונות <span style={{ color: "#ff6b35" }}>({ALL_PERSONAS.length})</span>
            </h2>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              {REGIONS.map(r => (
                <button key={r} onClick={() => setRegionFilter(r)} style={{ background: regionFilter === r ? "#ff6b35" : "rgba(255,255,255,0.05)", border: `1px solid ${regionFilter === r ? "#ff6b35" : "rgba(255,255,255,0.12)"}`, color: regionFilter === r ? "#fff" : "#aaa", padding: "7px 16px", borderRadius: 20, cursor: "pointer", fontSize: 13, transition: "all 0.2s" }}>
                  {r}
                </button>
              ))}
              <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.1)", margin: "0 4px" }} />
              <button onClick={() => setSelected(filtered.map(p => p.id))}
                style={{ background: "rgba(255,107,53,0.15)", border: "1px solid #ff6b35", color: "#ff6b35", padding: "7px 16px", borderRadius: 20, cursor: "pointer", fontSize: 13, fontWeight: 700, transition: "all 0.2s" }}>
                ✓ בחר הכל
              </button>
              {selected.length > 0 && (
                <button onClick={() => setSelected([])}
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "#aaa", padding: "7px 16px", borderRadius: 20, cursor: "pointer", fontSize: 13, transition: "all 0.2s" }}>
                  ✕ נקה הכל ({selected.length})
                </button>
              )}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))", gap: 14 }}>
            {filtered.map(p => {
              const isSel = selected.includes(p.id)
              const isExp = expandedPersona === p.id
              return (
                <div key={p.id} style={{ background: isSel ? `${p.color}15` : "rgba(255,255,255,0.03)", border: `2px solid ${isSel ? p.color : "rgba(255,255,255,0.07)"}`, borderRadius: 14, padding: 16, transition: "all 0.2s" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10, cursor: "pointer" }} onClick={() => setExpandedPersona(isExp ? null : p.id)}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${p.color}22`, border: `2px solid ${p.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{p.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: 15, color: isSel ? p.color : "#fff" }}>{p.name}, {p.age}</div>
                      <div style={{ fontSize: 12, color: "#888" }}>{p.job}</div>
                      <div style={{ fontSize: 11, color: "#666" }}>{p.location} · {p.religion}</div>
                    </div>
                    <span style={{ background: `${socioColor[p.socio] || "#888"}20`, color: socioColor[p.socio] || "#888", fontSize: 10, padding: "3px 8px", borderRadius: 10, border: `1px solid ${socioColor[p.socio] || "#888"}40`, flexShrink: 0 }}>{p.socio}</span>
                  </div>

                  {isExp && (
                    <div style={{ fontSize: 12, color: "#ccc", lineHeight: 1.7, background: "rgba(0,0,0,0.3)", borderRadius: 8, padding: "10px 12px", marginBottom: 10 }}>
                      {p.personality}
                    </div>
                  )}

                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10 }}>
                    {p.tags.map(t => <span key={t} style={{ background: `${p.color}18`, color: p.color, fontSize: 10, padding: "2px 8px", borderRadius: 10 }}>{t}</span>)}
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => toggle(p.id)} style={{ flex: 1, padding: "7px", background: isSel ? p.color : "rgba(255,255,255,0.05)", border: `1px solid ${isSel ? p.color : "rgba(255,255,255,0.12)"}`, borderRadius: 8, color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 700, transition: "all 0.2s" }}>
                      {isSel ? "✓ נבחר" : "+ הוסף לקבוצה"}
                    </button>
                    <button onClick={() => setExpandedPersona(isExp ? null : p.id)} style={{ padding: "7px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "#aaa", cursor: "pointer", fontSize: 12 }}>
                      {isExp ? "▲" : "▼"}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {selected.length > 0 && (
            <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg,#c0392b,#ff6b35)", borderRadius: 30, padding: "14px 28px", boxShadow: "0 8px 32px rgba(255,107,53,0.5)", cursor: "pointer", fontWeight: 800, fontSize: 15, whiteSpace: "nowrap" }} onClick={() => setView("focusgroup")}>
              🚀 המשך עם {selected.length} משתתפים ←
            </div>
          )}
        </div>
      )}

      {/* ── FOCUS GROUP ── */}
      {view === "focusgroup" && (
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "28px 20px" }}>

          {messages.length === 0 && !running && (
            <>
              {selected.length > 0 ? (
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 16, marginBottom: 20 }}>
                  <div style={{ fontSize: 12, color: "#777", marginBottom: 10 }}>משתתפים נבחרים ({selected.length}):</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                    {ALL_PERSONAS.filter(p => selected.includes(p.id)).map(p => (
                      <span key={p.id} style={{ background: `${p.color}18`, border: `1px solid ${p.color}40`, color: p.color, borderRadius: 20, padding: "4px 12px", fontSize: 12, display: "flex", alignItems: "center", gap: 5 }}>
                        {p.icon} {p.name}
                        <span onClick={() => toggle(p.id)} style={{ cursor: "pointer", opacity: 0.5, marginRight: 2 }}>✕</span>
                      </span>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setView("personas")} style={{ fontSize: 12, color: "#ff6b35", background: "none", border: "1px solid rgba(255,107,53,0.3)", borderRadius: 8, padding: "5px 12px", cursor: "pointer" }}>+ הוסף משתתפים</button>
                    <button onClick={clearAll} style={{ fontSize: 12, color: "#777", background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "5px 12px", cursor: "pointer" }}>נקה הכל</button>
                  </div>
                </div>
              ) : (
                <div style={{ background: "rgba(255,107,53,0.08)", border: "1px solid rgba(255,107,53,0.25)", borderRadius: 14, padding: 24, marginBottom: 20, textAlign: "center" }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>👥</div>
                  <div style={{ color: "#ff6b35", fontWeight: 700, marginBottom: 12 }}>בחרי לפחות 2 משתתפים</div>
                  <button onClick={() => setView("personas")} style={{ background: "#ff6b35", border: "none", borderRadius: 10, color: "#fff", padding: "10px 22px", cursor: "pointer", fontWeight: 700 }}>בחר משתתפים ←</button>
                </div>
              )}

              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: "#555", marginBottom: 9, letterSpacing: 1, textTransform: "uppercase" }}>שאלות לדוגמה:</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {SAMPLES.map(q => (
                    <button key={q} onClick={() => setQuestion(q)} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#bbb", padding: "6px 13px", borderRadius: 20, cursor: "pointer", fontSize: 12, transition: "all 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "#ff6b35"; e.currentTarget.style.color = "#fff" }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#bbb" }}>
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <textarea value={question} onChange={e => setQuestion(e.target.value)}
                placeholder="הזיני שאלה, רעיון למוצר חדש, שינוי מחיר, קמפיין..."
                style={{ width: "100%", minHeight: 80, background: "rgba(255,255,255,0.04)", border: "2px solid rgba(255,107,53,0.2)", borderRadius: 12, color: "#fff", fontSize: 15, padding: "12px 14px", resize: "vertical", direction: "rtl", outline: "none", boxSizing: "border-box", lineHeight: 1.6, marginBottom: 14, transition: "border-color 0.2s" }}
                onFocus={e => e.target.style.borderColor = "#ff6b35"}
                onBlur={e => e.target.style.borderColor = "rgba(255,107,53,0.2)"} />

              <button onClick={runGroup} disabled={!question.trim() || selected.length < 2}
                style={{ width: "100%", padding: 16, background: (!question.trim() || selected.length < 2) ? "#1a1a1a" : "linear-gradient(135deg,#c0392b,#ff6b35)", border: "none", borderRadius: 12, color: (!question.trim() || selected.length < 2) ? "#444" : "#fff", fontSize: 17, fontWeight: 800, cursor: (!question.trim() || selected.length < 2) ? "not-allowed" : "pointer", boxShadow: (!question.trim() || selected.length < 2) ? "none" : "0 4px 20px rgba(255,107,53,0.4)", transition: "all 0.2s" }}>
                🚀 הפעל קבוצת מיקוד
              </button>
            </>
          )}

          {(messages.length > 0 || running) && (
            <>
              <div style={{ background: "rgba(255,107,53,0.08)", border: "1px solid rgba(255,107,53,0.2)", borderRadius: 10, padding: "10px 16px", marginBottom: 16, fontSize: 14 }}>
                <span style={{ color: "#ff6b35", fontWeight: 700 }}>🎯 </span>{question}
              </div>

              <div style={{ background: "rgba(0,0,0,0.35)", borderRadius: 16, padding: 20, marginBottom: 20, minHeight: 280, border: "1px solid rgba(255,255,255,0.05)" }}>
                {messages.map((msg, i) => {
                  const p = msg.persona
                  return (
                    <div key={i} style={{ display: "flex", gap: 12, marginBottom: 16, animation: "fadeIn 0.3s ease" }}>
                      <div style={{ width: 38, height: 38, borderRadius: "50%", background: `${p.color}22`, border: `2px solid ${p.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{p.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 11, color: p.color, fontWeight: 700, marginBottom: 4 }}>{p.name} · {p.location}</div>
                        <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "4px 12px 12px 12px", padding: "9px 13px", fontSize: 14, lineHeight: 1.6, color: "#eee" }}>{msg.text}</div>
                      </div>
                    </div>
                  )
                })}
                {typing && (
                  <div style={{ display: "flex", gap: 10, alignItems: "center", opacity: 0.5 }}>
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "2px solid #333", display: "flex", alignItems: "center", justifyContent: "center" }}>⋯</div>
                    <span style={{ color: "#666", fontSize: 13 }}>{typing} מקליד/ה...</span>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {summary && (
                <div style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,107,53,0.3)", borderRadius: 16, padding: 24, animation: "fadeIn 0.5s ease" }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#ff6b35", marginBottom: 20 }}>📊 תובנות שיווקיות</div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 12, marginBottom: 20 }}>
                    <div style={{ background: `${vColor}15`, border: `2px solid ${vColor}40`, borderRadius: 12, padding: 14, textAlign: "center" }}>
                      <div style={{ fontSize: 10, color: "#777", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>תוצאה</div>
                      <div style={{ fontSize: 22, fontWeight: 900, color: vColor }}>{summary.verdict}</div>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 14, textAlign: "center" }}>
                      <div style={{ fontSize: 10, color: "#777", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>ציון</div>
                      <div style={{ fontSize: 28, fontWeight: 900 }}>{summary.score}<span style={{ fontSize: 13, color: "#555" }}>/10</span></div>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 14, textAlign: "center" }}>
                      <div style={{ fontSize: 10, color: "#777", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>תומכים</div>
                      <div style={{ fontSize: 12, color: "#2ecc71", fontWeight: 700, lineHeight: 1.4 }}>{(summary.segments?.supporters || []).join(", ")}</div>
                    </div>
                  </div>

                  <div style={{ background: "rgba(255,107,53,0.07)", borderRadius: 10, padding: "12px 16px", marginBottom: 16, borderRight: "3px solid #ff6b35" }}>
                    <div style={{ fontSize: 11, color: "#ff6b35", fontWeight: 700, marginBottom: 4 }}>תובנה מרכזית</div>
                    <div style={{ fontSize: 14, color: "#eee", lineHeight: 1.6 }}>{summary.mainInsight}</div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 11, color: "#2ecc71", fontWeight: 700, marginBottom: 8 }}>✅ יתרונות</div>
                      {(summary.pros || []).map((p, i) => <div key={i} style={{ fontSize: 13, color: "#ccc", marginBottom: 5, display: "flex", gap: 6 }}><span style={{ color: "#2ecc71" }}>›</span>{p}</div>)}
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: "#e74c3c", fontWeight: 700, marginBottom: 8 }}>⚠️ חסרונות</div>
                      {(summary.cons || []).map((c, i) => <div key={i} style={{ fontSize: 13, color: "#ccc", marginBottom: 5, display: "flex", gap: 6 }}><span style={{ color: "#e74c3c" }}>›</span>{c}</div>)}
                    </div>
                  </div>

                  <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "12px 16px", marginBottom: 16 }}>
                    <div style={{ fontSize: 11, color: "#888", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>המלצה לפיצה האט</div>
                    <div style={{ fontSize: 14, color: "#fff", lineHeight: 1.6 }}>{summary.recommendation}</div>
                  </div>

                  <button onClick={() => { setMessages([]); setSummary(null); setQuestion("") }}
                    style={{ width: "100%", padding: "12px", background: "rgba(255,107,53,0.12)", border: "1px solid rgba(255,107,53,0.4)", borderRadius: 10, color: "#ff6b35", cursor: "pointer", fontWeight: 700, fontSize: 14 }}>
                    ← שאלה חדשה
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; }
        textarea::placeholder { color: #444; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #2a1500; border-radius: 3px; }
        @media (max-width: 600px) {
          nav { flex-wrap: wrap; padding: 0 12px; }
          h1 { font-size: 32px !important; }
        }
      `}</style>
    </div>
  )
}
