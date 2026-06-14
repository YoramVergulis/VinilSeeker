import styles from './GenreSection.module.css'
import SectionHeader from './SectionHeader'

const GENRES = [
  { name: 'רוק',    count: '3,240' },
  { name: 'מטאל',   count: '1,180' },
  { name: 'ג׳אז',   count: '2,640' },
  { name: 'ישראלי', count: '1,890' },
  { name: 'קלאסי',  count: '1,420' },
  { name: 'בלוז',   count: '880' },
]

export default function GenreSection() {
  return (
    <section className={styles.section}>
      <SectionHeader eyebrow="לפי ז׳אנר" title="גלה לפי סגנון" />
      <div className={styles.grid}>
        {GENRES.map(({ name, count }) => (
          <a key={name} href="#" className={styles.chip}>
            <div className={styles.disc} aria-hidden="true" />
            <div className={styles.name}>{name}</div>
            <div className={styles.count}>{count} תקליטים</div>
          </a>
        ))}
      </div>
    </section>
  )
}
