import { useState } from 'react'

interface Question {
  q: string
  opts: readonly string[]
  correct: number
  exp: string
}
interface QuizProps {
  title: string
  questions: readonly Question[]
}

export default function Quiz({ title, questions }: QuizProps) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers] = useState<(number|null)[]>(Array(questions.length).fill(null))
  const [done, setDone] = useState(false)
  const q = questions[current]
  const answered = selected !== null

  function pick(i: number) {
    if (answered) return
    setSelected(i)
    const next = [...answers]; next[current] = i; setAnswers(next)
  }
  function next() {
    if (current < questions.length - 1) { setCurrent(c=>c+1); setSelected(answers[current+1]) }
    else setDone(true)
  }
  function prev() {
    if (current > 0) { setCurrent(c=>c-1); setSelected(answers[current-1]) }
  }
  function reset() {
    setCurrent(0); setSelected(null)
    setAnswers(Array(questions.length).fill(null)); setDone(false)
  }

  const score = answers.filter((a,i) => a === questions[i].correct).length

  if (done) {
    const pct = Math.round(score/questions.length*100)
    const icon = pct===100?'🏆':pct>=67?'⭐':'💪'
    return (
      <div className="quiz-card">
        <div className="quiz-title">{title}</div>
        <div className="quiz-score">
          <div className="quiz-score-num">{icon} {score}/{questions.length}</div>
          <div className="quiz-score-msg">{pct}%</div>
          <button className="btn" style={{marginTop:'1rem'}} onClick={reset}>🔄 Riprova / Try again</button>
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
      {answered && <div className="quiz-explanation">💡 {q.exp}</div>}
      <div className="quiz-nav">
        <span className="quiz-progress">{current+1} / {questions.length}</span>
        <div style={{display:'flex',gap:'0.5rem'}}>
          {current>0 && <button className="btn btn-ghost" onClick={prev}>← Indietro</button>}
          {answered && (
            <button className="btn" onClick={next}>
              {current<questions.length-1?'Avanti →':'Risultati 🏁'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
