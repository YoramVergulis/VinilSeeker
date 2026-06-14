import styles from './SectionHeader.module.css'

export default function SectionHeader({ eyebrow, title, linkLabel, linkHref = '#' }) {
  return (
    <div className={styles.head}>
      <div>
        {eyebrow && <div className={styles.eyebrow}>{eyebrow}</div>}
        <h2 className={styles.title}>{title}</h2>
      </div>
      {linkLabel && (
        <a href={linkHref} className={styles.link}>{linkLabel} ←</a>
      )}
    </div>
  )
}
