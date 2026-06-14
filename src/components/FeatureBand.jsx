import styles from './FeatureBand.module.css'

export default function FeatureBand({ eyebrow, title, body, ctaLabel = 'גלה את האוסף ←', img }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.band}>
        <div className={styles.text}>
          <div className={styles.eyebrow}>{eyebrow}</div>
          <h3 className={styles.heading}>{title}</h3>
          <p className={styles.body}>{body}</p>
          <a href="#" className={styles.cta}>{ctaLabel}</a>
        </div>

        <div className={styles.visual}>
          {img
            ? <img src={img} alt={title} className={styles.visualImg} />
            : <div className={styles.visualPlaceholder} aria-hidden="true" />
          }
        </div>
      </div>
    </div>
  )
}
