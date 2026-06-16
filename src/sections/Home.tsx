import { i18n } from '../i18n'
import { useLang } from '../App'

const sectionKeys = ['temperatura', 'passaggi', 'gas', 'termo'] as const

interface Props { onNavigate: (s: string) => void }

export default function Home({ onNavigate }: Props) {
  const { lang } = useLang()
  const t = i18n[lang].home

  return (
    <>
      <div className="home-hero">
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
        <blockquote style={{
          fontStyle: 'italic',
          color: 'var(--accent)',
          fontSize: '0.95rem',
          maxWidth: 520,
          margin: '0 auto',
          lineHeight: 1.6,
          borderLeft: '3px solid var(--accent)',
          paddingLeft: '1rem',
          textAlign: 'left',
        }}>
          {t.quote}
          <br />
          <span style={{ fontStyle: 'normal', fontWeight: 600, color: 'var(--muted)', fontSize: '0.85rem' }}>
            {t.quoteBy}
          </span>
        </blockquote>
      </div>

      <div className="home-grid">
        {sectionKeys.map((key, i) => {
          const card = t.cards[i]
          return (
            <button key={key} className="home-card" onClick={() => onNavigate(key)}>
              <span className="home-card-icon">{card.icon}</span>
              <span className="home-card-title">{card.title}</span>
              <span className="home-card-sub">{card.sub}</span>
            </button>
          )
        })}
      </div>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h2>{t.howItWorks}</h2>
        <p>{t.howItWorksDesc}</p>
        <div className="info-box tip">
          <span className="info-box-icon">💡</span>
          <span>{t.tip}</span>
        </div>
      </div>

      <div className="card">
        <h2>{t.facts}</h2>
        <div style={{ display: 'grid', gap: '0.6rem' }}>
          {t.factsList.map(([icon, text], i) => (
            <div key={i} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', fontSize: '0.92rem' }}>
              <span style={{ fontSize: '1.1rem' }}>{icon}</span>
              <span style={{ color: 'var(--text)' }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
