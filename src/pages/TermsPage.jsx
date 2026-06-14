import Layout from '../components/Layout'
import styles from './LegalPage.module.css'

const SECTIONS = [
  {
    id: 's1', num: '1', title: 'הגדרות',
    content: [
      '"הפלטפורמה" — אתר VinilSeeker הזמין בכתובת vinilseeker.co.il וכל אפליקציה נלווית.',
      '"משתמש" — כל אדם הנרשם לפלטפורמה ומקבל עליו את תנאי שימוש אלה.',
      '"מכירה" — מודעה שמשתמש מפרסם לצורך מכירת תקליט ויניל.',
    ],
  },
  {
    id: 's2', num: '2', title: 'הרשמה לפלטפורמה',
    content: [
      'ההרשמה חינמית ופתוחה לכל אדם מעל גיל 18.',
      'עליך לספק פרטים נכונים בעת ההרשמה. אחריות לדיוק הפרטים חלה עליך בלבד.',
      'אינך רשאי ליצור יותר מחשבון אחד. חשבונות כפולים יוסרו ללא הודעה מוקדמת.',
    ],
  },
  {
    id: 's3', num: '3', title: 'פרסום מודעה',
    content: [
      'מודעות חייבות לתאר את התקליט בצורה מדויקת — מצב, פורמט, שנה ומחיר.',
      'תמונות חייבות להיות של התקליט עצמו ולשקף את מצבו האמיתי.',
      'חל איסור מוחלט על פרסום תוכן פוגעני, מסחרי שאינו קשור לוויניל, או מודעות כוזבות.',
    ],
  },
  {
    id: 's4', num: '4', title: 'תקשורת בין משתמשים',
    content: [
      'הצ\'אט המובנה מיועד לתאום מכירות בלבד.',
      'שליחת ספאם, הטרדה, או תוכן שאינו הולם — יובילו להשעיית חשבון לאלתר.',
    ],
  },
  {
    id: 's5', num: '5', title: 'עסקאות ותשלום',
    content: [
      'VinilSeeker היא פלטפורמת חיבור בלבד. העסקה עצמה מתבצעת ישירות בין הקונה למוכר.',
      'אנו לא מעבדים תשלומים, לא מחזיקים כסף ולא נושאים באחריות לתוצאות של עסקה.',
      'מחלוקות בין משתמשים יש לפתור ביניהם. VinilSeeker אינה גורם גישור חוזי.',
    ],
  },
  {
    id: 's6', num: '6', title: 'אחריות',
    content: [
      'VinilSeeker מסופקת כמות שהיא ("AS IS"). אנו לא מתחייבים לזמינות רציפה או ללא תקלות.',
      'איננו אחראים לנזק שנגרם כתוצאה משימוש בפלטפורמה, לרבות הפסד כספי בעסקה.',
    ],
  },
  {
    id: 's7', num: '7', title: 'קניין רוחני',
    content: [
      'עיצוב הפלטפורמה, הלוגו והשם VinilSeeker הם רכוש החברה.',
      'תוכן שאתה מפרסם (תמונות, תיאורים) — האחריות לזכויות יוצרים חלה עליך.',
    ],
  },
  {
    id: 's8', num: '8', title: 'הסרת חשבון',
    content: [
      'תוכל למחוק את חשבונך בכל עת דרך הגדרות הפרופיל.',
      'אנו שומרים את הזכות להסיר חשבון שהפר את תנאי השימוש ללא הודעה מוקדמת.',
    ],
  },
  {
    id: 's9', num: '9', title: 'שינויים בתנאים',
    content: [
      'אנו עשויים לעדכן תנאים אלה מעת לעת. שימוש מתמשך בפלטפורמה לאחר עדכון מהווה הסכמה לגרסה החדשה.',
    ],
  },
  {
    id: 's10', num: '10', title: 'סמכות שיפוט',
    content: [
      'כל מחלוקת הנובעת מהשימוש בפלטפורמה תתברר בבתי המשפט המוסמכים בישראל, בהתאם לדין הישראלי.',
    ],
  },
]

export default function TermsPage({ onNavigate, currentUser, onLogout }) {
  return (
    <Layout activePage="" onNavigate={onNavigate} currentUser={currentUser} onLogout={onLogout}>

      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>תקנון ותנאי שימוש</h1>
          <p className={styles.heroSub}>עודכן: 15 במאי 2026 · גרסה 1.2</p>
        </div>
      </div>

      <div className={styles.body}>

        {/* TOC */}
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

        {/* Content */}
        <div className={styles.content}>
          <p className={styles.meta}>עודכן: 15 במאי 2026 · גרסה 1.2</p>
          {SECTIONS.map(s => (
            <section key={s.id} id={s.id} className={styles.legalSection}>
              <h2 className={styles.sectionTitle}>{s.num}. {s.title}</h2>
              {s.content.map((para, i) => (
                <p key={i} className={styles.prose}>{para}</p>
              ))}
            </section>
          ))}
        </div>

      </div>
    </Layout>
  )
}
