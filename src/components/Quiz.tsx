import { useState } from 'react'
import { useLang } from '../App'
import { uiText } from '../uiText'
import { sampleN } from '../data/sample'

interface Question {
  q: string
  opts: readonly string[]
  correct: number
  exp: string
}
interface QuizProps {
  title: string
  questions: readonly Question[]
  draw?: number
}

export default function Quiz({ title, questions, draw }: QuizProps) {
  const { lang } = useLang()
  const u = uiText[lang]
  // Estrae a caso `draw` domande dal pool; ri-sorteggiate a ogni "Riprova".
  const [quizSet, setQuizSet] = useState<readonly Question[]>(() => sampleN(questions, draw ?? questions.length))
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers] = useState<(number|null)[]>(Array(quizSet.length).fill(null))
  const [done, setDone] = useState(false)
  const q = quizSet[current]
  const answered = selected !== null

  function pick(i: number) {
    if (answered) return
    setSelected(i)
    const next = [...answers]; next[current] = i; setAnswers(next)
  }
  function next() {
    if (current < quizSet.length - 1) { setCurrent(c=>c+1); setSelected(answers[current+1]) }
    else setDone(true)
  }
  function prev() {
    if (current > 0) { setCurrent(c=>c-1); setSelected(answers[current-1]) }
  }
  function reset() {
    const fresh = sampleN(questions, draw ?? questions.length)
    setQuizSet(fresh)
    setCurrent(0); setSelected(null)
    setAnswers(Array(fresh.length).fill(null)); setDone(false)
  }

  const score = answers.filter((a,i) => a === quizSet[i].correct).length

  if (done) {
    const pct = Math.round(score/quizSet.length*100)
    const icon = pct===100?'🏆':pct>=67?'⭐':'💪'
    return (
      <div className="quiz-card">
        <div className="quiz-title">{title}</div>
        <div className="quiz-score">
          <div className="quiz-score-num">{icon} {score}/{quizSet.length}</div>
          <div className="quiz-score-msg">{pct}%</div>
          <button className="btn" style={{marginTop:'1rem'}} onClick={reset}>🔄 {lang==='it'?'Riprova':'Try again'}</button>
        </div>
      </div>
    )
  }

  return (
    <div className="quiz-card">
      <div className="quiz-title">{title}</div>
      <div className="quiz-question">{current+1}. {q.q}</div>
      <div className="quiz-options">
        {q.opts.map((opt,i) => {
          let cls = 'quiz-option'
          if (answered) { if(i===q.correct) cls+=' correct'; else if(i===selected) cls+=' wrong' }
          return (
            <button key={i} className={cls} onClick={()=>pick(i)} disabled={answered}>
              {String.fromCharCode(65+i)}. {opt}
            </button>
          )
        })}
      </div>
      {answered && (
        <div className="quiz-explanation">
          <strong>{selected===q.correct ? u.correctFb : u.wrongFb}</strong> {q.exp}
        </div>
      )}
      <div className="quiz-nav">
        <span className="quiz-progress">{current+1} / {quizSet.length}</span>
        <div style={{display:'flex',gap:'0.5rem'}}>
          {current>0 && <button className="btn btn-ghost" onClick={prev}>← {lang==='it'?'Indietro':'Back'}</button>}
          {answered && (
            <button className="btn" onClick={next}>
              {current<quizSet.length-1?(lang==='it'?'Avanti →':'Next →'):(lang==='it'?'Risultati 🏁':'Results 🏁')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
