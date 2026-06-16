import { useState, useMemo } from 'react'
import { i18n } from '../i18n'
import { useLang } from '../App'
import Quiz from '../components/Quiz'

const R = 8.314

function GasBoxSVG({ n, T, V }: { n: number; T: number; V: number }) {
  const W = 300, H = 180
  const speed = Math.sqrt(T / 300)
  const numMol = Math.round(n * 6 + 4)
  const density = n / V
  const boxSize = Math.max(70, Math.min(W - 40, 110 / Math.cbrt(density * 0.5)))
  const bx = (W - boxSize) / 2, by = (H - boxSize) / 2

  const molecules = useMemo(() => {
    return Array.from({ length: numMol }, (_, i) => {
      const seed = i * 137.508
      return {
        x: bx + 8 + ((seed * 13.7) % (boxSize - 16)),
        y: by + 8 + ((seed * 7.3) % (boxSize - 16)),
        delay: (i * 0.15) % 1.5,
        dur: (0.4 + (i % 5) * 0.12) / speed,
        dx: (i % 2 === 0 ? 1 : -1) * (7 + (i % 4) * 3),
        dy: (i % 3 === 0 ? 1 : -1) * (5 + (i % 4) * 2),
      }
    })
  }, [numMol, boxSize, bx, by, speed])

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ background: '#f8fafc', borderRadius: 8, border: '1px solid #e0e4ea', display: 'block', width: '100%', maxHeight: 200, margin: '0.75rem 0' }}>
      <rect x={bx} y={by} width={boxSize} height={boxSize} rx={4}
        fill="#e8f0fe" stroke="#1565c0" strokeWidth="1.5" />
      <text x={bx + boxSize/2} y={by - 6} textAnchor="middle" fill="#6b7280" fontSize="9">
        V = {V.toFixed(1)} L
      </text>
      {molecules.map((m, i) => (
        <circle key={i} cx={m.x} cy={m.y} r={5}
          fill="#1565c0" opacity={0.75}
          style={{ animation: `mol${i%6} ${m.dur.toFixed(2)}s ${m.delay.toFixed(2)}s ease-in-out infinite alternate` }}
        />
      ))}
      <style>{molecules.map((m, i) =>
        `@keyframes mol${i%6}{from{transform:translate(0,0)}to{transform:translate(${m.dx}px,${m.dy}px)}}`
      ).filter((v,i,a)=>a.indexOf(v)===i).join(' ')}</style>
    </svg>
  )
}

export default function GasPerfetti() {
  const { lang } = useLang()
  const t = i18n[lang].gasPerfetti
  const [n, setN] = useState(1)
  const [TK, setTK] = useState(300)
  const [V, setV] = useState(5)

  const P_Pa = (n * R * TK) / (V * 1e-3)
  const P_atm = P_Pa / 101325
  const TC = TK - 273.15

  return (
    <>
      <div className="card">
        <h2>{t.title}</h2>
        <h3>{t.sec1Title}</h3>
        <p>{t.sec1Text}</p>
        <div className="info-box tip">
          <span className="info-box-icon">💡</span>
          <span>{lang==='it'
            ? "Gas reali si comportano come gas perfetti a bassa pressione (< 10 atm) e alta temperatura. L'aria a condizioni normali è un buon esempio."
            : 'Real gases behave like ideal gases at low pressure (< 10 atm) and high temperature. Air under normal conditions is a good example.'}
          </span>
        </div>
      </div>

      <div className="card">
        <h2>{t.sec2Title}</h2>
        <p>{t.sec2Text}</p>
        <div className="formula highlight" dangerouslySetInnerHTML={{__html: t.sec2Formula}} />
        <h3>{t.sec3Title}</h3>
        <p>{t.sec3Text}</p>
        <div className="formula">{t.sec3Formula1}</div>
        <div className="formula">{t.sec3Formula2}</div>
      </div>

      <div className="card">
        <h2>{t.sec4Title}</h2>
        <div className="formula highlight" style={{ fontSize: '1.4rem' }}>{t.sec4Formula}</div>
        <p>{t.sec4Text}</p>
        <div className="info-box example">
          <span className="info-box-icon">🧪</span>
          <span>{t.sec4Tip}</span>
        </div>
        <div className="info-box physics">
          <span className="info-box-icon">⚗️</span>
          <span>{lang==='it'
            ? 'Calcolo: 1 mol, T = 0°C = 273,15 K, P = 101325 Pa. V = nRT/P = 1 × 8,314 × 273,15 / 101325 = 0,02241 m³ = 22,41 L'
            : 'Calculation: 1 mol, T = 0°C = 273.15 K, P = 101,325 Pa. V = nRT/P = 1 × 8.314 × 273.15 / 101325 = 0.02241 m³ = 22.41 L'}
          </span>
        </div>
      </div>

      <div className="sim-card">
        <h2>🔬 {t.simTitle}</h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--muted)', marginBottom: '1rem' }}>{t.simDesc}</p>

        <div className="ctrl-row">
          <span className="ctrl-label">{t.readN} (mol)</span>
          <input type="range" min="0.5" max="5" step="0.5" value={n} onChange={e => setN(+e.target.value)} />
          <span className="ctrl-value">{n.toFixed(1)} mol</span>
        </div>
        <div className="ctrl-row">
          <span className="ctrl-label">{t.readT} (K)</span>
          <input type="range" min="100" max="1000" step="10" value={TK} onChange={e => setTK(+e.target.value)} />
          <span className="ctrl-value">{TK} K</span>
        </div>
        <div className="ctrl-row">
          <span className="ctrl-label">{t.readV} (L)</span>
          <input type="range" min="0.5" max="20" step="0.5" value={V} onChange={e => setV(+e.target.value)} />
          <span className="ctrl-value">{V.toFixed(1)} L</span>
        </div>

        <GasBoxSVG n={n} T={TK} V={V} />

        <div className="readouts">
          <div className="readout">
            <span className="readout-label">{t.readP} (atm)</span>
            <span className="readout-value">{P_atm.toFixed(3)} atm</span>
          </div>
          <div className="readout">
            <span className="readout-label">{t.readP} (kPa)</span>
            <span className="readout-value">{(P_Pa/1000).toFixed(1)} kPa</span>
          </div>
          <div className="readout">
            <span className="readout-label">{t.readV}</span>
            <span className="readout-value">{V.toFixed(1)} L</span>
          </div>
          <div className="readout">
            <span className="readout-label">{t.readT}</span>
            <span className="readout-value">{TK} K / {TC.toFixed(0)}°C</span>
          </div>
          <div className="readout">
            <span className="readout-label">{t.readN}</span>
            <span className="readout-value">{n.toFixed(1)} mol</span>
          </div>
          <div className="readout">
            <span className="readout-label">P·V (J)</span>
            <span className="readout-value">{(P_Pa * V * 1e-3).toFixed(1)} J</span>
          </div>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--primary)', marginTop: '0.75rem', fontFamily: 'JetBrains Mono, monospace' }}>
          PV = nRT: {(P_Pa * V * 1e-3).toFixed(1)} = {n.toFixed(1)} × 8,314 × {TK} = {(n * R * TK).toFixed(1)} J ✓
        </p>
      </div>

      <Quiz title={t.quiz.title} questions={t.quiz.questions} />
    </>
  )
}
