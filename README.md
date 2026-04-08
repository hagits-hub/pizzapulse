# 🍕 PizzaPulse IL

פלטפורמת קבוצות מיקוד וירטואליות לשוק הפיצות הישראלי.  
27 פרסונות ישראליות אמיתיות | AI | תובנות שיווקיות מיידיות

---

## 🚀 העלאה ל-GitHub Pages (פעם ראשונה)

### שלב 1 — התקני Node.js
הורידי מ: https://nodejs.org (גרסה 20 ומעלה)

### שלב 2 — צרי Repository ב-GitHub
1. היכנסי ל-github.com
2. לחצי על **New repository**
3. שמי את השם: `pizzapulse-il`
4. השאירי **Public**
5. לחצי **Create repository**

### שלב 3 — הפעילי GitHub Pages
1. בתוך ה-repository, לכי ל **Settings → Pages**
2. תחת **Source** בחרי **GitHub Actions**
3. שמרי

### שלב 4 — העלי את הקבצים
פתחי Terminal (מחשב Windows: PowerShell / Mac: Terminal) והריצי:

```bash
cd pizzapulse-il
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/pizzapulse-il.git
git push -u origin main
```

החליפי `YOUR_USERNAME` בשם המשתמש שלך ב-GitHub.

### שלב 5 — המתיני ~2 דקות
GitHub יבנה ויעלה את האתר אוטומטית.  
הכתובת תהיה: `https://YOUR_USERNAME.github.io/pizzapulse-il`

---

## 💻 הרצה מקומית (לבדיקה)

```bash
npm install
npm run dev
```
פתחי דפדפן על: http://localhost:5173

---

## 📁 מבנה הפרויקט

```
pizzapulse-il/
├── src/
│   ├── App.jsx        ← הפלטפורמה המלאה
│   ├── personas.js    ← 27 הפרסונות
│   └── main.jsx       ← נקודת כניסה
├── index.html
├── vite.config.js
├── package.json
└── .github/
    └── workflows/
        └── deploy.yml ← העלאה אוטומטית
```

---

## ✏️ איך להוסיף פרסונה חדשה

פתחי את `src/personas.js` והוסיפי אובייקט לרשימה:

```js
{
  id: "shimrit",
  name: "שמרית כהן",
  age: 29,
  location: "אשקלון",
  region: "דרום",          // מרכז / צפון / דרום / יהודה ושומרון
  religion: "מסורתית",
  icon: "🌺",
  color: "#e91e63",
  socio: "בינוני",
  job: "אחות",
  personality: "תיאור האישיות והרגלי הצריכה...",
  tags: ["תג1", "תג2", "תג3"]
}
```

---

## 🔑 הערה על API

הכלי משתמש ב-Anthropic Claude API.  
בסביבת claude.ai הוא עובד אוטומטית.  
להרצה עצמאית יש צורך במפתח API — צרי קשר להגדרה.

---

Built with ❤️ | PizzaPulse IL
