import { useState, useMemo } from 'react'
import { i18n } from '../i18n'
import { useLang } from '../App'
import Quiz from '../components/Quiz'

const C_ICE = 2.09
const L_FUS = 334
const C_WAT = 4.186
const L_VAP = 2260
const C_STE = 2.01
const T0 = -40

const Q1 = C_ICE * (0 - T0)  // 83.6 kJ — riscaldamento ghiaccio
const Q2 = Q1 + L_FUS        // 417.6 kJ — fine fusione
const Q3 = Q2 + C_WAT * 100  // 836.2 kJ — fine riscaldamento acqua
const QMAX = Q3 + 100        // mostriamo fino a 936 kJ, inizio vaporizzazione

function tempFromQ(q: number): number {
  if (q <= 0) return T0
  if (q < Q1) return T0 + q / C_ICE
  if (q < Q2) return 0
  if (q < Q3) return (q - Q2) / C_WAT
  return 100 + (q - Q3) / C_STE
}

function stateFromQ(q: number, lang: 'it' | 'en'): { label: string; icon: string; color: string } {
  if (q < Q1) return { label: lang==='it'?'Ghiaccio (solido)':'Ice (solid)', icon: '🧧', color: '#90caf9' }
  if (q < Q2) return { label: lang==='it'?'Fusione in corso...':'Melting...', icon: '🌊', color: '#fff176' }
  if (q < Q3) return { label: lang==='it'?'Acqua (liquido)':'Water (liquid)', icon: '💧', color: '#4fc3f7' }
  if (q < Q3 + L_VAP) return { label: lang==='it'?'Ebollizione in corso...':'Boiling...', icon: '♨️', color: '#ff7043' }
  return { label: lang==='it'?'Vapore (gas)':'Steam (gas)', icon: '☁️', color: '#ce93d8' }
}

function MoleculesSVG({ q }: { q: number }) {
  const W = 200, H = 100
  const state = q < Q1 ? 'solid' : q < Q2 ? 'melt' : q < Q3 ? 'liquid' : 'gas'

  const molecules = useMemo(() => {
    const n = state === 'gas' ? 8 : 12
    return Array.from({ length: n }, (_, i) => {
      if (state === 'solid') {
        const col = i % 4, row = Math.floor(i / 4)
        return { x: 30 + col * 42, y: 20 + row * 35 }
      }
      const seed = i * 137.5
      return {
        x: 15 + ((seed * 7.3) % (W - 30)),
        y: 10 + ((seed * 3.7) % (H - 20)),
      }
    })
  }, [state])

  const color = state === 'solid' ? '#90caf9' : state === 'liquid' ? '#4fc3f7' : '#ff7043'
  const r = state === 'gas' ? 6 : 5

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="sim-svg" style={{ maxHeight: 120 }}>
      <rect x={0} y={0} width={W} height={H} rx={8} fill="rgba(0,0,0,0.4)" />
      {molecules.map((m, i) => (
        <g key={i}>
          <circle cx={m.x} cy={m.y} r={r}
            fill={color} opacity={0.85}
            style={{
              animation: state === 'solid'
                ? `vibrate${i%3} 0.4s ease-in-out infinite alternate`
                : state === 'liquid'
                ? `floatM${i%4} ${1.5 + (i%3)*0.4}s ease-in-out infinite alternate`
                : `zoomM${i%4} ${0.8 + (i%3)*0.2}s ease-in-out infinite alternate`,
            }}
          />
          {state === 'solid' && i < molecules.length - 1 && (
            <line
              x1={m.x} y1={m.y}
              x2={molecules[(i+1) % molecules.length].x}
              y2={molecules[(i+1) % molecules.length].y}
              stroke={color} strokeWidth="0.5" opacity={0.2}
            />
          )}
        </g>
      ))}
      <style>{`
        @keyframes vibrate0{to{transform:translate(2px,1px)}} 
        @keyframes vibrate1{to{transform:translate(-1px,2px)}} 
        @keyframes vibrate2{to{transform:translate(1px,-2px)}}
        @keyframes floatM0{to{transform:translate(15px,8px)}} 
        @keyframes floatM1{to{transform:translate(-12px,10px)}}
        @keyframes floatM2{to{transform:translate(10px,-12px)}} 
        @keyframes floatM3{to{transform:translate(-8px,-10px)}}
        @keyframes zoomM0{to{transform:translate(40px,20px)}} 
        @keyframes zoomM1{to{transform:translate(-35px,25px)}}
        @keyframes zoomM2{to{transform:translate(30px,-30px)}} 
        @keyframes zoomM3{to{transform:translate(-40px,-20px)}}
      `}</style>
    </svg>
  )
}

function TQGraph({ q: currentQ, lang }: { q: number; lang: 'it' | 'en' }) {
  const W = 500, H = 220
  const PAD = { l: 45, r: 20, t: 20, b: 35 }
  const gW = W - PAD.l - PAD.r
  const gH = H - PAD.t - PAD.b

  const points: [number, number][] = [
    [0, T0], [Q1, 0], [Q2, 0], [Q3, 100], [QMAX, 100 + (QMAX - Q3)/C_STE],
  ]

  const minT = T0 - 5, maxT = 130
  const qx = (q: number) => PAD.l + (q / QMAX) * gW
  const ty = (t: number) => PAD.t + gH - ((t - minT) / (maxT - minT)) * gH

  const pathD = points.map(([q,t],i) => `${i===0?'M':'L'}${qx(q).toFixed(1)},${ty(t).toFixed(1)}`).join(' ')

  const curX = qx(currentQ)
  const curY = ty(tempFromQ(currentQ))

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="sim-svg">
      <defs>
        <linearGradient id="tqGrad" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#90caf9" />
          <stop offset={`${Q1/QMAX*100}%`} stopColor="#90caf9" />
          <stop offset={`${Q2/QMAX*100}%`} stopColor="#4fc3f7" />
          <stop offset={`${Q3/QMAX*100}%`} stopColor="#ff7043" />
          <stop offset="100%" stopColor="#ff7043" />
        </linearGradient>
      </defs>

      {/* grid */}
      {[-40, 0, 20, 100].map(t => (
        <line key={t} x1={PAD.l} y1={ty(t)} x2={W - PAD.r} y2={ty(t)}
          stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      ))}

      {/* axes */}
      <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={H - PAD.b} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      <line x1={PAD.l} y1={H - PAD.b} x2={W - PAD.r} y2={H - PAD.b} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />

      {/* axis labels */}
      <text x={PAD.l - 6} y={ty(0) + 4} textAnchor="end" fill="var(--muted)" fontSize="9">0°</text>
      <text x={PAD.l - 6} y={ty(100) + 4} textAnchor="end" fill="var(--muted)" fontSize="9">100°</text>
      <text x={PAD.l - 6} y={ty(T0) + 4} textAnchor="end" fill="var(--muted)" fontSize="9">{T0}°</text>
      <text x={PAD.l + gW/2} y={H - 5} textAnchor="middle" fill="var(--muted)" fontSize="9">
        {lang==='it'?'Calore aggiunto (kJ)':'Heat added (kJ)'}
      </text>
      <text x={8} y={PAD.t + gH/2} textAnchor="middle" fill="var(--muted)" fontSize="9"
        transform={`rotate(-90,8,${PAD.t + gH/2})`}>T (°C)</text>

      {/* plateau labels */}
      <text x={qx((Q1+Q2)/2)} y={ty(0) - 6} textAnchor="middle" fill="#fff176" fontSize="8">
        {lang==='it'?'Fusione':'Melting'}
      </text>
      <text x={qx(Q3 + 30)} y={ty(100) - 6} textAnchor="middle" fill="#ff7043" fontSize="8">
        {lang==='it'?'Ebollizione':'Boiling'}
      </text>

      {/* curve */}
      <path d={pathD} fill="none" stroke="url(#tqGrad)" strokeWidth="2.5" strokeLinejoin="round" />

      {/* current point */}
      <line x1={curX} y1={PAD.t} x2={curX} y2={H - PAD.b} stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3,3" />
      <circle cx={curX} cy={curY} r={5} fill="white" stroke="var(--primary)" strokeWidth="2" />
    </svg>
  )
}

export default function PassaggiStato() {
  const { lang } = useLang()
  const t = i18n[lang].passaggiStato
  const [q, setQ] = useState(200)

  const temp = tempFromQ(q)
  const stato = stateFromQ(q, lang)

  return (
    <>
      <div className="card">
        <h2>{t.title}</h2>
        <h3>{t.sec1Title}</h3>
        <p>{t.sec1Text}</p>
      </div>

      <div className="card">
        <h2>{t.sec2Title}</h2>
        <p>{t.sec2Text}</p>
        <div className="formula highlight">{t.sec2Formula}</div>
        <div className="info-box example">
          <span className="info-box-icon">📊</span>
          <span>{t.sec2Values}</span>
        </div>
      </div>

      <div className="card">
        <h2>{t.sec3Title}</h2>
        <p>{t.sec3Text}</p>
        <div className="info-box warn">
          <span className="info-box-icon">⚠️</span>
          <span>{t.sec3Tip}</span>
        </div>
      </div>

      <div className="sim-card">
        <h2>🔬 {t.simTitle}</h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--muted)', marginBottom: '1rem' }}>{t.simDesc}</p>

        <div className="ctrl-row">
          <span className="ctrl-label">{t.simLabel}</span>
          <input type="range" min="0" max={QMAX} step="1" value={q}
            onChange={e => setQ(+e.target.value)} />
          <span className="ctrl-value">{q.toFixed(0)} kJ</span>
        </div>

        <TQGraph q={q} lang={lang} />

        <div style={{
          display: 'flex', alignItems: 'center', gap: '1rem',
          background: 'rgba(255,255,255,0.04)', borderRadius: 10,
          padding: '0.75rem 1rem', marginBottom: '0.75rem',
          border: `1px solid ${stato.color}40`,
        }}>
          <span style={{ fontSize: '2rem' }}>{stato.icon}</span>
          <div>
            <div style={{ fontWeight: 700, color: stato.color, fontSize: '1rem' }}>{stato.label}</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--primary)', fontSize: '0.9rem' }}>
              T = {temp.toFixed(1)} °C = {(temp + 273.15).toFixed(1)} K
            </div>
          </div>
        </div>

        <MoleculesSVG q={q} />

        <div className="readouts">
          <div className="readout">
            <span className="readout-label">{lang==='it'?'Calore aggiunto':'Heat added'}</span>
            <span className="readout-value">{q.toFixed(0)} kJ</span>
          </div>
          <div className="readout">
            <span className="readout-label">{lang==='it'?'Temperatura':'Temperature'}</span>
            <span className="readout-value">{temp.toFixed(1)} °C</span>
          </div>
          <div className="readout">
            <span className="readout-label">T (Kelvin)</span>
            <span className="readout-value">{(temp + 273.15).toFixed(1)} K</span>
          </div>
        </div>
      </div>

      <Quiz title={t.quiz.title} questions={t.quiz.questions} />
    </>
  )
}
