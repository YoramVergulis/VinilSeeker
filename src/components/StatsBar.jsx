import styles from './StatsBar.module.css'

const STATS = [
  { num: '12,400', accent: '+', label: 'תקליטים זמינים' },
  { num: '38',     accent: '',  label: 'חנויות מובחרות' },
  { num: '850',    accent: '+', label: 'מוכרים פרטיים' },
  { num: '4.8',    accent: '★', label: 'דירוג ממוצע' },
]

export default function StatsBar() {
  return (
    <section className={styles.bar}>
      <div className={styles.grid}>
        {STATS.map(({ num, accent, label }) => (
          <div key={label}>
            <div className={styles.num}>
              {num}<span className={styles.accent}>{accent}</span>
            </div>
            <div className={styles.label}>{label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
