import styles from './HowItWorksSection.module.css'
import SectionHeader from './SectionHeader'

const STEPS = [
  {
    num: '1',
    title: 'חפש או דפדף',
    desc: 'מצא את התקליט הנכון לפי אמן, אלבום, ז׳אנר, או דפדף בקטגוריות. כל מודעה מאומתת.',
  },
  {
    num: '2',
    title: 'צור קשר עם המוכר',
    desc: 'שלח הודעה ישירה, שאל שאלות, ובדוק את הדירוג של המוכר ואת הביקורות שלו לפני העסקה.',
  },
  {
    num: '3',
    title: 'סגרו את העסקה',
    desc: 'נפגשים אישית או שולחים בדואר. תשלום מועבר ביניכם — VinilSeeker חינמי לחלוטין.',
  },
]

export default function HowItWorksSection() {
  return (
    <section className={styles.section}>
      <SectionHeader eyebrow="פשוט ומהיר" title="איך זה עובד" />
      <div className={styles.grid}>
        {STEPS.map(({ num, title, desc }) => (
          <div key={num} className={styles.card}>
            <div className={styles.num}>{num}</div>
            <h4 className={styles.title}>{title}</h4>
            <p className={styles.desc}>{desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
