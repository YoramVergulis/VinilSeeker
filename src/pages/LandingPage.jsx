import HeroSection from '../components/HeroSection'
import StatsBar from '../components/StatsBar'
import FeaturedSection from '../components/FeaturedSection'
import FeatureBand from '../components/FeatureBand'
import GenreSection from '../components/GenreSection'
import HowItWorksSection from '../components/HowItWorksSection'

const FEATURED_CARDS = [
  { id: 1, title: 'Scoring the End of the World', artist: 'Motionless In White',    year: 2022, format: 'LP',  genre: 'metal', price: 320,                   city: 'תל אביב',  badge: { label: '★ נדיר',   variant: 'gold'     }, img: '/covers/motionless-in-white.png'    },
  { id: 2, title: 'Notes from the Underground',   artist: 'Hollywood Undead',        year: 2013, format: 'LP',  genre: 'metal', price: 290, originalPrice: 380, city: 'חיפה',     badge: { label: "ויניטג'",  variant: 'burgundy' }, img: '/covers/hollywood-undead-notes.png' },
  { id: 3, title: 'F8',                            artist: 'Five Finger Death Punch', year: 2020, format: '2LP', genre: 'metal', price: 410,                   city: 'ראשל"צ',   badge: { label: 'חדש בשוק', variant: 'dark'     }, img: '/covers/ffdp-f8.png'                },
]

const NEW_ARRIVALS = [
  { id: 4, title: 'Wrong Side of Heaven Vol. 2',  artist: 'Five Finger Death Punch', year: 2013, format: '2LP', genre: 'metal', price: 260,                   city: 'פ"ת',                                                        img: '/covers/ffdp-wrong-side.png'        },
  { id: 5, title: 'The Way of the Fist',           artist: 'Five Finger Death Punch', year: 2007, format: 'LP',  genre: 'metal', price: 480,                   city: 'ירושלים',  badge: { label: '★ נדיר',   variant: 'gold'     }, img: '/covers/ffdp-way-of-fist.png'       },
  { id: 6, title: 'V (Five)',                      artist: 'Hollywood Undead',        year: 2017, format: 'LP',  genre: 'metal', price: 340, originalPrice: 420, city: 'ב"ש',      badge: { label: 'מוגבל',    variant: 'burgundy' }, img: '/covers/hollywood-undead-v.png'     },
]

export default function LandingPage({ onNavigate }) {
  return (
    <>
      <HeroSection onNavigate={onNavigate} />

      <StatsBar />

      <FeaturedSection
        eyebrow="פיק השבוע"
        title="תקליטים נבחרים השבוע"
        linkLabel="כל התקליטים"
        cards={FEATURED_CARDS}
        onNavigate={onNavigate}
      />

      <FeatureBand
        eyebrow="★ פינת האספנים"
        title="האוסף השלם של Hollywood Undead — בארץ."
        body="כל הסטודיו אלבומים מ-2008 עד 2022, חלקם מהדורות מוגבלות שלא הופצו רשמית בישראל. עברו אצלנו אימות מוכר ומצב מוצר."
        ctaLabel="גלה את האוסף ←"
        img="/covers/hollywood-undead-v.png"
      />

      <GenreSection />

      <FeaturedSection
        eyebrow="חדש על המדף"
        title="הוספו השבוע"
        linkLabel="כל החדשים"
        cards={NEW_ARRIVALS}
        onNavigate={onNavigate}
      />

      <div id="how-it-works"><HowItWorksSection /></div>
    </>
  )
}
