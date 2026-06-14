import styles from './FeaturedSection.module.css'
import SectionHeader from './SectionHeader'
import VinylCard from './VinylCard'

export default function FeaturedSection({ eyebrow, title, linkLabel, cards, onNavigate }) {
  return (
    <section className={styles.section}>
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        linkLabel={linkLabel}
      />
      <div className={styles.grid}>
        {cards.map((card) => (
          <VinylCard key={card.title} {...card} onNavigate={onNavigate} />
        ))}
      </div>
    </section>
  )
}
