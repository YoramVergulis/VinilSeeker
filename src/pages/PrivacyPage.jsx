import Layout from '../components/Layout'
import styles from './LegalPage.module.css'

const SECTIONS = [
  {
    id: 'p1', num: '1', title: 'איזה מידע אנחנו אוספים',
    content: [
      'בעת הרשמה: שם, כתובת אימייל ועיר מגורים (אופציונלי).',
      'בעת פרסום מכירה: תמונות, תיאורים ומחירים שאתה מזין.',
      'נתוני שימוש כלליים: עמודים שבקרת, חיפושים (ללא זיהוי אישי).',
    ],
  },
  {
    id: 'p2', num: '2', title: 'למה אנחנו אוספים אותו',
    content: [
      'לספק את שירותי הפלטפורמה — חיבור בין קונים ומוכרים.',
      'לשפר את חוויית המשתמש ולתקן תקלות.',
    ],
    callout: 'בקצרה — אם זה לא חיוני לפעולת הפלטפורמה, לא אוספים.',
  },
  {
    id: 'p3', num: '3', title: 'עוגיות (Cookies)',
    content: [
      'אנו משתמשים בעוגיות טכניות בלבד לצורך שמירת הסשן וזיהוי המשתמש המחובר.',
      'אין אנו משתמשים בעוגיות פרסומיות או מעקב של צד שלישי.',
    ],
  },
  {
    id: 'p4', num: '4', title: 'צד שלישי',
    content: [
      'לא נמכור ולא נשתף את פרטיך עם גורמים חיצוניים לצרכים מסחריים.',
      'ייתכן שנשתמש בשירותי אירוח ותשתית הדרושים לתפעול — בכפוף להסכמי סודיות.',
    ],
  },
  {
    id: 'p5', num: '5', title: 'אבטחת מידע',
    content: [
      'אנו נוקטים באמצעים טכניים סבירים להגנה על המידע השמור.',
      'יחד עם זאת, אין אנו יכולים להבטיח אבטחה מוחלטת. שימוש בפלטפורמה הוא על אחריותך.',
    ],
  },
  {
    id: 'p6', num: '6', title: 'הזכויות שלך',
    content: [
      'יש לך זכות לעיין במידע שנאסף עליך, לתקנו, ולבקש מחיקתו.',
      'לממש זכויות אלה — צור קשר בכתובת privacy@vinilseeker.co.il.',
    ],
  },
  {
    id: 'p7', num: '7', title: 'שמירת מידע',
    content: [
      'נשמור את פרטיך כל עוד חשבונך פעיל, ועד 90 יום לאחר מחיקתו.',
    ],
  },
  {
    id: 'p8', num: '8', title: 'ילדים',
    content: [
      'הפלטפורמה אינה מיועדת לבני מינוס 18. אנו לא אוספים מידע מדעת על קטינים.',
    ],
  },
  {
    id: 'p9', num: '9', title: 'שינויים במדיניות',
    content: [
      'אנו עשויים לעדכן מדיניות זו. שימוש מתמשך לאחר עדכון מהווה הסכמה.',
    ],
  },
  {
    id: 'p10', num: '10', title: 'צור קשר',
    content: [
      'לשאלות בנושא פרטיות: privacy@vinilseeker.co.il',
      'מדיניות זו עומדת בהתאם לתקנות הגנת הפרטיות (ישראל) 2017.',
    ],
  },
]

export default function PrivacyPage({ onNavigate, currentUser, onLogout }) {
  return (
    <Layout activePage="" onNavigate={onNavigate} currentUser={currentUser} onLogout={onLogout}>

      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>מדיניות פרטיות</h1>
          <p className={styles.heroSub}>עודכן: 15 במאי 2026 · תקנות הגנת הפרטיות 2017</p>
        </div>
      </div>

      <div className={styles.body}>

        <nav className={styles.toc} aria-label="תוכן עניינים">
          <p className={styles.tocHeading}>תוכן עניינים</p>
          <ol className={styles.tocList}>
            {SECTIONS.map(s => (
              <li key={s.id} className={styles.tocItem}>
                <a href={`#${s.id}`}>
                  <span className={styles.tocNum}>{s.num}.</span> {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className={styles.content}>
          <p className={styles.meta}>עודכן: 15 במאי 2026 · תקנות הגנת הפרטיות 2017</p>
          {SECTIONS.map(s => (
            <section key={s.id} id={s.id} className={styles.legalSection}>
              <h2 className={styles.sectionTitle}>{s.num}. {s.title}</h2>
              {s.content.map((para, i) => (
                <p key={i} className={styles.prose}>{para}</p>
              ))}
              {s.callout && (
                <div className={styles.callout}>
                  <p><strong>{s.callout}</strong></p>
                </div>
              )}
            </section>
          ))}
        </div>

      </div>
    </Layout>
  )
}
