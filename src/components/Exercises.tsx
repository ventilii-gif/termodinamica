import { useState } from 'react'
import { useLang } from '../App'
import { uiText } from '../uiText'
import { exercises, type Exercise, type SectionKey } from '../data/exercises'

function levelInfo(level: Exercise['level'], u: ReturnType<typeof pick>) {
  if (level === 'F') return { label: u.levelF, color: 'var(--green)', bg: 'var(--green-bg)' }
  if (level === 'M') return { label: u.levelM, color: '#f57c00', bg: '#fff8e1' }
  return { label: u.levelD, color: 'var(--red)', bg: 'var(--red-bg)' }
}
function pick() { return uiText.it }

function ExerciseCard({ ex, idx }: { ex: Exercise; idx: number }) {
  const { lang } = useLang()
  const u = uiText[lang]
  const [hints, setHints] = useState(0)
  const [showSol, setShowSol] = useState(false)
  const lv = levelInfo(ex.level, u)

  return (
    <div className="card" style={{ borderLeft: `3px solid ${lv.color}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: 'var(--muted)' }}>#{idx + 1}</span>
        <span style={{ background: lv.bg, color: lv.color, borderRadius: 20, padding: '2px 12px', fontSize: '0.78rem', fontWeight: 700 }}>{lv.label}</span>
        <span style={{ fontWeight: 700, color: 'var(--text)' }}>{ex.title}</span>
      </div>
      <p style={{ marginBottom: '0.75rem' }}>{ex.text}</p>

      {ex.hints.slice(0, hints).map((h, i) => (
        <div key={i} className="info-box tip" style={{ marginTop: '0.4rem' }}>
          <span className="info-box-icon">💡</span>
          <span><strong>{u.hintLabel} {i + 1}:</strong> {h}</span>
        </div>
      ))}

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
        {hints < ex.hints.length ? (
          <button className="btn btn-ghost" onClick={() => setHints(h => h + 1)}>{u.showHint}</button>
        ) : (
          <span style={{ fontSize: '0.8rem', color: 'var(--muted)', alignSelf: 'center' }}>{u.allHints}</span>
        )}
        <button className="btn" onClick={() => setShowSol(s => !s)}>
          {showSol ? u.hideSolution : u.showSolution}
        </button>
      </div>

      {showSol && (
        <div className="quiz-explanation" style={{ marginTop: '0.75rem' }}>
          <strong>{u.solutionLabel}:</strong> {ex.answer}
        </div>
      )}
    </div>
  )
}

export default function Exercises({ section }: { section: SectionKey }) {
  const { lang } = useLang()
  const u = uiText[lang]
  const list = exercises[lang][section]

  return (
    <>
      <div className="info-box example" style={{ marginBottom: '1rem' }}>
        <span className="info-box-icon">✏️</span>
        <span>{u.exercisesIntro}</span>
      </div>
      {list.map((ex, i) => <ExerciseCard key={i} ex={ex} idx={i} />)}
    </>
  )
}
