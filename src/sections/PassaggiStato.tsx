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

// Cumulative heat thresholds for 1 kg of water
const Q1 = C_ICE * (0 - T0)           // 83.6  kJ — fine riscaldamento ghiaccio
const Q2 = Q1 + L_FUS                  // 417.6 kJ — fine fusione
const Q3 = Q2 + C_WAT * 100            // 836.2 kJ — fine riscaldamento acqua
const Q4 = Q3 + L_VAP                  // 3096  kJ — fine vaporizzazione
const QMAX = Q4 + C_STE * 40          // 3176  kJ — fine (vapore a ~120°C)

function tempFromQ(q: number): number {
  if (q <= 0) return T0
  if (q < Q1) return T0 + q / C_ICE
  if (q < Q2) return 0
  if (q < Q3) return (q - Q2) / C_WAT
  if (q < Q4) return 100
  return 100 + (q - Q4) / C_STE
}

function stateFromQ(q: number, lang: 'it' | 'en'): { label: string; icon: string; color: string } {
  if (q < Q1) return { label: lang==='it'?'Ghiaccio (solido)':'Ice (solid)', icon: '🧧', color: '#1565c0' }
  if (q < Q2) return { label: lang==='it'?'Fusione in corso...':'Melting...', icon: '🌊', color: '#f57c00' }
  if (q < Q3) return { label: lang==='it'?'Acqua (liquido)':'Water (liquid)', icon: '💧', color: '#0277bd' }
  if (q < Q4) return { label: lang==='it'?'Ebollizione in corso...':'Boiling...', icon: '♨️', color: '#c62828' }
  return { label: lang==='it'?'Vapore (gas)':'Steam (gas)', icon: '☁️', color: '#6a1b9a' }
}

function MoleculesSVG({ q }: { q: number }) {
  const W = 260, H = 100
  const state = q < Q1 ? 'solid' : q < Q2 ? 'melt' : q < Q3 ? 'liquid' : 'gas'

  const molecules = useMemo(() => {
    const n = state === 'gas' ? 8 : 12
    return Array.from({ length: n }, (_, i) => {
      if (state === 'solid') {
        const col = i % 4, row = Math.floor(i / 4)
        return { x: 40 + col * 48, y: 18 + row * 36 }
      }
      const seed = i * 137.5
      return {
        x: 15 + ((seed * 7.3) % (W - 30)),
        y: 10 + ((seed * 3.7) % (H - 20)),
      }
    })
  }, [state])

  const colors: Record<string, string> = { solid: '#1565c0', melt: '#f57c00', liquid: '#0277bd', gas: '#c62828' }
  const color = colors[state]
  const r = state === 'gas' ? 7 : 6

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ background: '#f8fafc', borderRadius: 8, border: '1px solid #e0e4ea', display: 'block', width: '100%', margin: '0.5rem 0' }}>
      {molecules.map((m, i) => (
        <g key={i}>
          <circle cx={m.x} cy={m.y} r={r} fill={color} opacity={0.75}
            style={{ animation: state === 'solid'
              ? `vibrate${i%3} 0.4s ease-in-out infinite alternate`
              : state === 'gas'
              ? `zoomM${i%4} ${(0.6 + i%3*0.15).toFixed(2)}s ease-in-out infinite alternate`
              : `floatM${i%4} ${(1.2 + i%3*0.3).toFixed(2)}s ease-in-out infinite alternate` }}
          />
          {state === 'solid' && i < molecules.length - 1 && (
            <line x1={m.x} y1={m.y} x2={molecules[(i+1)%molecules.length].x} y2={molecules[(i+1)%molecules.length].y}
              stroke={color} strokeWidth="0.7" opacity={0.25} />
          )}
        </g>
      ))}
      <style>{`
        @keyframes vibrate0{to{transform:translate(2px,1px)}}
        @keyframes vibrate1{to{transform:translate(-1px,2px)}}
        @keyframes vibrate2{to{transform:translate(1px,-2px)}}
        @keyframes floatM0{to{transform:translate(14px,7px)}}
        @keyframes floatM1{to{transform:translate(-11px,9px)}}
        @keyframes floatM2{to{transform:translate(9px,-11px)}}
        @keyframes floatM3{to{transform:translate(-8px,-9px)}}
        @keyframes zoomM0{to{transform:translate(38px,18px)}}
        @keyframes zoomM1{to{transform:translate(-32px,22px)}}
        @keyframes zoomM2{to{transform:translate(28px,-28px)}}
        @keyframes zoomM3{to{transform:translate(-36px,-18px)}}
      `}</style>
    </svg>
  )
}

function TQGraph({ q: currentQ, lang }: { q: number; lang: 'it' | 'en' }) {
  const W = 500, H = 230
  const PAD = { l: 48, r: 15, t: 20, b: 38 }
  const gW = W - PAD.l - PAD.r
  const gH = H - PAD.t - PAD.b

  // 6 punti che definiscono la curva con i due plateau
  const points: [number, number][] = [
    [0,    T0],  // ghiaccio freddo
    [Q1,   0],   // inizio fusione
    [Q2,   0],   // fine fusione    — plateau 1 a 0°C
    [Q3,   100], // inizio ebollizione
    [Q4,   100], // fine ebollizione — plateau 2 a 100°C
    [QMAX, 100 + (QMAX - Q4) / C_STE],  // vapore surriscaldato
  ]

  const minT = T0 - 5, maxT = 130
  const qx = (q: number) => PAD.l + (q / QMAX) * gW
  const ty = (t: number) => PAD.t + gH - ((t - minT) / (maxT - minT)) * gH

  const pathD = points.map(([q, t], i) =>
    `${i === 0 ? 'M' : 'L'}${qx(q).toFixed(1)},${ty(t).toFixed(1)}`
  ).join(' ')

  const curX = qx(currentQ)
  const curY = ty(tempFromQ(currentQ))

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ background: '#f8fafc', borderRadius: 8, border: '1px solid #e0e4ea', display: 'block', width: '100%', margin: '0.75rem 0' }}>
      {/* grid */}
      {[-40, 0, 100].map(t => (
        <line key={t} x1={PAD.l} y1={ty(t)} x2={W - PAD.r} y2={ty(t)}
          stroke="#e0e4ea" strokeWidth="1" />
      ))}
      {/* axes */}
      <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={H - PAD.b + 5} stroke="#9aadcc" strokeWidth="1.5" />
      <line x1={PAD.l - 5} y1={H - PAD.b} x2={W - PAD.r} y2={H - PAD.b} stroke="#9aadcc" strokeWidth="1.5" />
      {/* T axis labels */}
      <text x={PAD.l - 6} y={ty(0) + 4} textAnchor="end" fill="#6b7280" fontSize="9">0°</text>
      <text x={PAD.l - 6} y={ty(100) + 4} textAnchor="end" fill="#6b7280" fontSize="9">100°</text>
      <text x={PAD.l - 6} y={ty(T0) + 4} textAnchor="end" fill="#6b7280" fontSize="9">{T0}°</text>
      {/* axis names */}
      <text x={PAD.l + gW / 2} y={H - 5} textAnchor="middle" fill="#6b7280" fontSize="9">
        {lang === 'it' ? 'Calore aggiunto (kJ)' : 'Heat added (kJ)'}
      </text>
      <text x={10} y={PAD.t + gH / 2} textAnchor="middle" fill="#6b7280" fontSize="9"
        transform={`rotate(-90,10,${PAD.t + gH / 2})`}>T (°C)</text>
      {/* plateau labels */}
      <text x={qx((Q1 + Q2) / 2)} y={ty(0) - 7} textAnchor="middle" fill="#f57c00" fontSize="8" fontWeight="600">
        {lang === 'it' ? 'Fusione (334 kJ/kg)' : 'Melting (334 kJ/kg)'}
      </text>
      <text x={qx((Q3 + Q4) / 2)} y={ty(100) - 7} textAnchor="middle" fill="#c62828" fontSize="8" fontWeight="600">
        {lang === 'it' ? 'Ebollizione (2260 kJ/kg)' : 'Boiling (2260 kJ/kg)'}
      </text>
      {/* curve */}
      <path d={pathD} fill="none" stroke="#1565c0" strokeWidth="2.5" strokeLinejoin="round" />
      {/* current position */}
      <line x1={curX} y1={PAD.t} x2={curX} y2={H - PAD.b}
        stroke="rgba(0,0,0,0.15)" strokeWidth="1" strokeDasharray="3,3" />
      <circle cx={curX} cy={curY} r={5} fill="white" stroke="#1565c0" strokeWidth="2" />
      {/* Q scale ticks */}
      {[Q1, Q2, Q3, Q4].map((q, i) => (
        <line key={i} x1={qx(q)} y1={H - PAD.b} x2={qx(q)} y2={H - PAD.b + 5}
          stroke="#9aadcc" strokeWidth="1" />
      ))}
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
          <input type="range" min="0" max={QMAX} step="10" value={q}
            onChange={e => setQ(+e.target.value)} />
          <span className="ctrl-value">{q.toFixed(0)} kJ</span>
        </div>

        <TQGraph q={q} lang={lang} />

        <div style={{
          display: 'flex', alignItems: 'center', gap: '1rem',
          background: 'var(--bg)', borderRadius: 8,
          padding: '0.75rem 1rem', marginBottom: '0.75rem',
          border: `1.5px solid ${stato.color}40`,
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
            <span className="readout-label">{lang === 'it' ? 'Calore aggiunto' : 'Heat added'}</span>
            <span className="readout-value">{q.toFixed(0)} kJ</span>
          </div>
          <div className="readout">
            <span className="readout-label">{lang === 'it' ? 'Temperatura' : 'Temperature'}</span>
            <span className="readout-value">{temp.toFixed(1)} °C</span>
          </div>
          <div className="readout">
            <span className="readout-label">T (Kelvin)</span>
            <span className="readout-value">{(temp + 273.15).toFixed(1)} K</span>
          </div>
        </div>

        <div className="info-box tip" style={{ marginTop: '0.5rem' }}>
          <span className="info-box-icon">💡</span>
          <span style={{ fontSize: '0.85rem' }}>
            {lang === 'it'
              ? `L_vapore (2260 kJ/kg) è circa ${(L_VAP / L_FUS).toFixed(0)}× il calore latente di fusione (334 kJ/kg): per questo è molto più difficile evaporare che fondere.`
              : `L_vaporisation (2,260 kJ/kg) is about ${(L_VAP / L_FUS).toFixed(0)}× the latent heat of fusion (334 kJ/kg): this is why evaporation requires so much more energy than melting.`}
          </span>
        </div>
      </div>

      <Quiz title={t.quiz.title} questions={t.quiz.questions} />
    </>
  )
}
