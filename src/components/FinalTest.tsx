import { useState } from 'react'
import { useLang } from '../App'
import { uiText } from '../uiText'
import { finalTest } from '../data/finalTest'

export default function FinalTest() {
  const { lang } = useLang()
  const u = uiText[lang]
  const questions = finalTest[lang]

  const [started, setStarted] = useState(false)
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null))
  const [done, setDone] = useState(false)

  function pick(i: number) {
    const next = [...answers]; next[current] = i; setAnswers(next)
  }
  function next() {
    if (current < questions.length - 1) setCurrent(c => c + 1)
    else setDone(true)
  }
  function reset() {
    setStarted(false); setCurrent(0); setDone(false)
    setAnswers(Array(questions.length).fill(null))
  }

  const score = answers.filter((a, i) => a === questions[i].correct).length

  if (!started) {
    return (
      <div className="quiz-card">
        <div className="quiz-title">{u.navTest}</div>
        <p style={{ marginBottom: '1.25rem' }}>{u.testIntro}</p>
        <button className="btn" onClick={() => setStarted(true)}>{u.testStart}</button>
      </div>
    )
  }

  if (done) {
    const pct = Math.round(score / questions.length * 100)
    const icon = pct >= 80 ? '🏆' : pct >= 50 ? '⭐' : '💪'
    const msg = pct >= 80 ? u.testScoreHigh : pct >= 50 ? u.testScoreMid : u.testScoreLow
    return (
      <div className="quiz-card">
        <div className="quiz-title">{u.navTest}</div>
        <div className="quiz-score" style={{ paddingBottom: '1rem' }}>
          <div className="quiz-score-num">{icon} {score}/{questions.length}</div>
          <div className="quiz-score-msg">{pct}% — {msg}</div>
          <button className="btn" style={{ marginTop: '1rem' }} onClick={reset}>{u.testRetry}</button>
        </div>
        <div className="quiz-title" style={{ fontSize: '0.95rem', marginTop: '0.5rem' }}>{u.testReview}</div>
        {questions.map((qq, i) => {
          const ans = answers[i]
          const ok = ans === qq.correct
          return (
            <div key={i} className="card" style={{ borderLeft: `3px solid ${ok ? 'var(--green)' : 'var(--red)'}` }}>
              <div className="quiz-question">{i + 1}. {qq.q}</div>
              <div style={{ fontSize: '0.86rem', marginBottom: '0.35rem' }}>
                <span style={{ color: 'var(--muted)' }}>{u.testYourAnswer}: </span>
                <span style={{ color: ok ? 'var(--green)' : 'var(--red)', fontWeight: 600 }}>
                  {ans !== null ? `${String.fromCharCode(65 + ans)}. ${qq.opts[ans]}` : '—'}
                </span>
              </div>
              {!ok && (
                <div style={{ fontSize: '0.86rem', marginBottom: '0.35rem' }}>
                  <span style={{ color: 'var(--muted)' }}>{u.testCorrectAnswer}: </span>
                  <span style={{ color: 'var(--green)', fontWeight: 600 }}>
                    {String.fromCharCode(65 + qq.correct)}. {qq.opts[qq.correct]}
                  </span>
                </div>
              )}
              <div className="quiz-explanation">
                <strong>{ok ? u.correctFb : u.wrongFb}</strong> {qq.exp}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const q = questions[current]
  const answered = answers[current] !== null

  return (
    <div className="quiz-card">
      <div className="quiz-title">{u.navTest}</div>
      <div className="quiz-question">{u.testQuestion} {current + 1} / {questions.length}</div>
      <div className="quiz-question" style={{ fontWeight: 700, marginTop: '0.25rem' }}>{q.q}</div>
      <div className="quiz-options">
        {q.opts.map((opt, i) => (
          <button key={i} className={`quiz-option${answers[current] === i ? ' correct' : ''}`}
            onClick={() => pick(i)}>
            {String.fromCharCode(65 + i)}. {opt}
          </button>
        ))}
      </div>
      <div className="quiz-nav">
        <span className="quiz-progress">{current + 1} / {questions.length}</span>
        {answered && (
          <button className="btn" onClick={next}>
            {current < questions.length - 1 ? u.testNext : u.testFinish}
          </button>
        )}
      </div>
    </div>
  )
}
