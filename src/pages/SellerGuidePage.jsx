import Layout from '../components/Layout'
import styles from './SellerGuidePage.module.css'

const GRADING = [
  { grade: 'Mint (M)',   desc: 'תקליט חדש לגמרי, לא נגן מעולם, באריזה המקורית.' },
  { grade: 'Near Mint (NM)', desc: 'כמעט מושלם — שמור היטב, ייתכן שנגן פעמים בודדות.' },
  { grade: 'VG+',        desc: 'מצוין. ייתכנו שריטות קלות שאינן משפיעות על הצליל.' },
  { grade: 'VG',         desc: 'טוב. שריטות קלות שניתן לשמוע, אך עדיין ניגון נעים.' },
  { grade: 'Good (G)',   desc: 'ניתן לנגינה אך עם רעשים ושריטות ניכרות לאורך כל הצד.' },
]

export default function SellerGuidePage({ onNavigate, currentUser, onLogout }) {
  return (
    <Layout activePage="" onNavigate={onNavigate} currentUser={currentUser} onLogout={onLogout}>

      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>מדריך למוכרים</span>
          <h1 className={styles.heroTitle}>איך מוכרים תקליטים נכון?</h1>
          <p className={styles.heroSub}>
            ארבעה צעדים פשוטים שיעזרו לך לפרסם מהר, לתמחר נכון — ולסגור עסקה.
          </p>
        </div>
      </div>

      <div className={styles.body}>

        {/* Section 1 — Photography */}
        <section className={styles.section} id="photo">
          <h2 className={styles.sectionTitle}><span className={styles.num}>1</span> צלם נכון</h2>
          <p className={styles.prose}>
            תמונה טובה שווה אלף מילים — ובשוק הוויניל, היא שווה גם כמה עשרות שקלים נוספים.
            קונים מחפשים ראיות חזותיות למצב האמיתי של התקליט לפני שהם מתקשרים.
          </p>
          <ul className={styles.bulletList}>
            <li>צלם על רקע כהה ואחיד — שחור או אפור כהה מפחית רעשים ויזואליים</li>
            <li>כלול תמונות גם של הכריכה, גם של התקליט עצמו, גם של התווית המרכזית</li>
            <li>צלם בתאורה טבעית — אור שמש עקיף (לא ישיר) מגלה שריטות בצורה הטובה ביותר</li>
            <li>הצג שריטות קיימות בבירור — קנייה ישירה מבוססת על אמון</li>
          </ul>
          <div className={styles.callout}>
            <div className={styles.calloutLabel}>טיפ</div>
            <p className={styles.calloutText}>
              תמונה של תקליט שנצלמה בתאורה טובה על רקע ניטרלי מקבלת פי 2 יותר פניות מתמונות מטושטשות או חשוכות.
            </p>
          </div>
        </section>

        {/* Section 2 — Grading */}
        <section className={styles.section} id="grading">
          <h2 className={styles.sectionTitle}><span className={styles.num}>2</span> תאר במצב נכון — Goldmine Grading</h2>
          <p className={styles.prose}>
            מערכת ה-Goldmine היא התקן המקובל בשוק הוויניל הבינלאומי. שימוש בה מעיד על רצינות ובונה אמון.
          </p>
          <div className={styles.gradingTable}>
            <div className={styles.gradingHeader}>
              <span>דרגה</span>
              <span>תיאור</span>
            </div>
            {GRADING.map(row => (
              <div key={row.grade} className={styles.gradingRow}>
                <span className={styles.gradePill}>{row.grade}</span>
                <span className={styles.gradeDesc}>{row.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3 — Pricing */}
        <section className={styles.section} id="pricing">
          <h2 className={styles.sectionTitle}><span className={styles.num}>3</span> תמחר חכם</h2>
          <p className={styles.prose}>
            תמחור נכון הוא האיזון בין מה שאתה רוצה לקבל לבין מה שהשוק מוכן לשלם.
            כלי ייעוץ המחירים שלנו יעזור לך לאתר את הטווח הנכון לתקליט שלך.
          </p>
          <button
            type="button"
            className={styles.inlineLink}
            onClick={() => onNavigate('pricing')}
          >
            עבור לכלי ייעוץ המחירים &larr;
          </button>
        </section>

        {/* Section 4 — Communication */}
        <section className={styles.section} id="communication">
          <h2 className={styles.sectionTitle}><span className={styles.num}>4</span> תקשר מהיר</h2>
          <p className={styles.prose}>
            קונה שמקבל תגובה תוך שעה — סוגר עסקה. קונה שממתין יום — בינתיים מצא תחליף.
            הגדר התראות בטלפון ובדוק פניות כשאתה מפרסם.
          </p>
          <div className={`${styles.callout} ${styles.calloutGold}`}>
            <div className={styles.calloutLabel}>נתון</div>
            <p className={styles.calloutText}>
              מוכרים שמשיבים לפניות תוך שעה — סוגרים עסקה בסיכוי גבוה פי 3 לעומת מי שמשיב אחרי יום.
            </p>
          </div>
        </section>

        {/* CTA */}
        <div className={styles.ctaBlock}>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={() => onNavigate('upload')}
          >
            פרסם תקליט עכשיו &larr;
          </button>
          <p className={styles.ctaNote}>חינם לחלוטין · בלי עמלות · 3 דקות להכנסת מידע</p>
        </div>

      </div>
    </Layout>
  )
}
