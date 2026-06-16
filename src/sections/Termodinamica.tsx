import { useState, useMemo } from 'react'
import { i18n } from '../i18n'
import { useLang } from '../App'
import Quiz from '../components/Quiz'

const R = 8.314
const n = 1
const GAMMA = 5/3
const CV = (3/2) * R

type TrasformazioneKey = 'iso' | 'adi' | 'isc' | 'isb'

function PVDiagram({ tipo, P1, V1, P2, V2 }: { tipo: TrasformazioneKey; P1: number; V1: number; P2: number; V2: number }) {
  const W = 400, H = 240
  const PAD = { l: 50, r: 20, t: 20, b: 40 }
  const gW = W - PAD.l - PAD.r
  const gH = H - PAD.t - PAD.b

  const maxV = Math.max(V1, V2) * 1.3
  const maxP = Math.max(P1, P2) * 1.3

  const px = (v: number) => PAD.l + (v / maxV) * gW
  const py = (p: number) => PAD.t + gH - (p / maxP) * gH

  const curvePoints: [number, number][] = useMemo(() => {
    const pts: [number, number][] = []
    const steps = 60
    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      const v = V1 + (V2 - V1) * t
      let p: number
      if (tipo === 'iso') p = P1 * V1 / v
      else if (tipo === 'adi') p = P1 * Math.pow(V1/v, GAMMA)
      else if (tipo === 'isc') p = P1 + (P2 - P1) * t
      else p = P1
      pts.push([v, p])
    }
    return pts
  }, [tipo, P1, V1, P2, V2])

  const pathD = curvePoints.map(([v,p],i) =>
    `${i===0?'M':'L'}${px(v).toFixed(1)},${py(p).toFixed(1)}`
  ).join(' ')

  const areaD = [
    `M${px(curvePoints[0][0]).toFixed(1)},${py(0).toFixed(1)}`,
    ...curvePoints.map(([v,p]) => `L${px(v).toFixed(1)},${py(p).toFixed(1)}`),
    `L${px(curvePoints[curvePoints.length-1][0]).toFixed(1)},${py(0).toFixed(1)}`,
    'Z',
  ].join(' ')

  const colors: Record<TrasformazioneKey, string> = {
    iso: '#1565c0', adi: '#e65100', isc: '#2e7d32', isb: '#6a1b9a'
  }
  const color = colors[tipo]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ background: '#f8fafc', borderRadius: 8, border: '1px solid #e0e4ea', display: 'block', width: '100%', margin: '0.75rem 0' }}>
      <defs>
        <marker id="arr" markerWidth="8" markerHeight="8" refX="4" refY="3" orient="auto">
          <path d="M0,0 L8,3 L0,6 Z" fill={color} />
        </marker>
      </defs>
      {/* area */}
      <path d={areaD} fill={color} opacity={0.08} />
      {/* grid */}
      <line x1={PAD.l} y1={py(P1)} x2={W-PAD.r} y2={py(P1)} stroke="#e0e4ea" strokeWidth="1" />
      {P2 !== P1 && <line x1={PAD.l} y1={py(P2)} x2={W-PAD.r} y2={py(P2)} stroke="#e0e4ea" strokeWidth="1" />}
      {/* axes */}
      <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={H-PAD.b+5} stroke="#9aadcc" strokeWidth="1.5" />
      <line x1={PAD.l-5} y1={H-PAD.b} x2={W-PAD.r} y2={H-PAD.b} stroke="#9aadcc" strokeWidth="1.5" />
      <text x={PAD.l-8} y={PAD.t+4} textAnchor="end" fill="#6b7280" fontSize="11" fontWeight="600">P</text>
      <text x={W-PAD.r} y={H-PAD.b+14} textAnchor="middle" fill="#6b7280" fontSize="11" fontWeight="600">V</text>
      {/* ticks */}
      <text x={PAD.l-4} y={py(P1)+4} textAnchor="end" fill="#6b7280" fontSize="8">{P1.toFixed(1)}</text>
      <text x={PAD.l-4} y={py(P2)+4} textAnchor="end" fill="#6b7280" fontSize="8">{P2.toFixed(1)}</text>
      <text x={px(V1)} y={H-PAD.b+12} textAnchor="middle" fill="#6b7280" fontSize="8">{V1.toFixed(1)}</text>
      <text x={px(V2)} y={H-PAD.b+12} textAnchor="middle" fill="#6b7280" fontSize="8">{V2.toFixed(1)}</text>
      {/* curve */}
      <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" markerMid="url(#arr)" strokeLinejoin="round" />
      {/* points */}
      <circle cx={px(V1)} cy={py(P1)} r={5} fill="white" stroke={color} strokeWidth="2" />
      <text x={px(V1)+8} y={py(P1)-6} fill={color} fontSize="9" fontWeight="600">A</text>
      <circle cx={px(V2)} cy={py(P2)} r={5} fill={color} stroke={color} strokeWidth="2" />
      <text x={px(V2)+8} y={py(P2)-6} fill={color} fontSize="9" fontWeight="600">B</text>
      <text x={(px(V1)+px(V2))/2} y={py((P1+P2)/4)} textAnchor="middle" fill={color} fontSize="9" opacity={0.6}>Area = L</text>
    </svg>
  )
}

function calcola(tipo: TrasformazioneKey, P1_atm: number, V1_L: number, P2_atm: number, V2_L: number) {
  const P1 = P1_atm * 101325, V1 = V1_L * 1e-3
  const P2 = P2_atm * 101325, V2 = V2_L * 1e-3
  const T1 = (P1 * V1) / (n * R)
  const T2 = (P2 * V2) / (n * R)
  const dU = n * CV * (T2 - T1)
  if (tipo === 'iso') { const L = P1*V1*Math.log(V2/V1); return { Q: L, L, dU: 0, formula: 'L = nRT·ln(V₂/V₁)' } }
  if (tipo === 'adi') { const L = (P1*V1 - P2*V2)/(GAMMA-1); return { Q: 0, L, dU: -L, formula: 'L = (P₁V₁−P₂V₂)/(γ−1)' } }
  if (tipo === 'isc') { return { Q: dU, L: 0, dU, formula: 'L = 0, ΔU = Q' } }
  const L = P1*(V2-V1); return { Q: dU+L, L, dU, formula: 'L = PΔV' }
}

export default function Termodinamica() {
  const { lang } = useLang()
  const t = i18n[lang].termodinamica
  const [tipo, setTipo] = useState<TrasformazioneKey>('iso')
  const [P1, setP1] = useState(3)
  const [V1, setV1] = useState(2)
  const [V2, setV2] = useState(6)
  const [P2, setP2] = useState(1)

  const derivedP2 = useMemo(() => {
    if (tipo === 'iso') return P1 * V1 / V2
    if (tipo === 'adi') return P1 * Math.pow(V1/V2, GAMMA)
    if (tipo === 'isc') return P2
    return P1
  }, [tipo, P1, V1, V2, P2])

  const derivedV2 = tipo === 'isc' ? V1 : V2
  const { Q, L, dU, formula } = useMemo(
    () => calcola(tipo, P1, V1, derivedP2, derivedV2),
    [tipo, P1, V1, derivedP2, derivedV2]
  )

  const fmtJ = (v: number) => `${v >= 0 ? '+' : ''}${(v/1000).toFixed(2)} kJ`
  const sign = (v: number) => v > 50 ? '⬆️' : v < -50 ? '⬇️' : '↔️'

  return (
    <>
      <div className="card">
        <h2>{t.title}</h2>
        <h3>{t.sec1Title}</h3>
        <p>{t.sec1Text}</p>
        <div className="formula highlight" style={{ fontSize: '1.4rem' }}>{t.sec1Formula}</div>
        <div className="info-box warn">
          <span className="info-box-icon">⚠️</span>
          <span>{t.sec1Tip}</span>
        </div>
      </div>

      <div className="card">
        <h2>{t.sec2Title}</h2>
        <p>{t.sec2Text}</p>
        <div className="transform-grid">
          {t.transforms.map((tr) => (
            <div key={tr.name} className="transform-card" style={{ borderLeftColor: tr.color, borderLeftWidth: 3 }}>
              <h4 style={{ color: tr.color }}>{tr.icon} {tr.name}</h4>
              <div className="transform-row">
                <span className="transform-key">{lang==='it'?'Condizione':'Condition'}</span>
                <span className="transform-val" style={{ color: tr.color }}>{tr.cond}</span>
              </div>
              <div className="transform-row">
                <span className="transform-key">ΔU</span>
                <span className="transform-val">{tr.dU}</span>
              </div>
              <div className="transform-row">
                <span className="transform-key">Q</span>
                <span className="transform-val">{tr.Q}</span>
              </div>
              <div className="transform-row">
                <span className="transform-key">{lang==='it'?'Lavoro':'Work'}</span>
                <span className="transform-val">{tr.L}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="sim-card">
        <h2>🔬 {t.simTitle}</h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--muted)', marginBottom: '1rem' }}>{t.simDesc}</p>
        <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>{t.simSelectLabel}</p>
        <div className="seg-control">
          {(['iso','adi','isc','isb'] as TrasformazioneKey[]).map((k, i) => (
            <button key={k} className={`seg-btn${tipo===k?' active':''}`} onClick={()=>setTipo(k)}>
              {t.transforms[i].icon} {t.transforms[i].name}
            </button>
          ))}
        </div>
        <div className="ctrl-row">
          <span className="ctrl-label">{t.labelP1}</span>
          <input type="range" min="0.5" max="8" step="0.5" value={P1} onChange={e=>setP1(+e.target.value)} />
          <span className="ctrl-value">{P1.toFixed(1)} atm</span>
        </div>
        <div className="ctrl-row">
          <span className="ctrl-label">{t.labelV1}</span>
          <input type="range" min="1" max="15" step="0.5" value={V1} onChange={e=>setV1(+e.target.value)} />
          <span className="ctrl-value">{V1.toFixed(1)} L</span>
        </div>
        {tipo === 'isc' ? (
          <div className="ctrl-row">
            <span className="ctrl-label">{t.labelP2}</span>
            <input type="range" min="0.5" max="8" step="0.5" value={P2} onChange={e=>setP2(+e.target.value)} />
            <span className="ctrl-value">{P2.toFixed(1)} atm</span>
          </div>
        ) : (
          <div className="ctrl-row">
            <span className="ctrl-label">{t.labelV2}</span>
            <input type="range" min={V1+0.5} max="20" step="0.5" value={V2} onChange={e=>setV2(+e.target.value)} />
            <span className="ctrl-value">{V2.toFixed(1)} L</span>
          </div>
        )}
        <PVDiagram tipo={tipo} P1={P1} V1={V1} P2={derivedP2} V2={derivedV2} />
        <div className="readouts" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
          <div className="readout">
            <span className="readout-label">{t.labelQ}</span>
            <span className="readout-value" style={{ color: Q > 50 ? 'var(--green)' : Q < -50 ? 'var(--red)' : 'var(--muted)' }}>
              {sign(Q)} {fmtJ(Q)}
            </span>
          </div>
          <div className="readout">
            <span className="readout-label">{t.labelL}</span>
            <span className="readout-value" style={{ color: L > 50 ? 'var(--primary)' : L < -50 ? 'var(--accent)' : 'var(--muted)' }}>
              {sign(L)} {fmtJ(L)}
            </span>
          </div>
          <div className="readout">
            <span className="readout-label">{t.labelDU}</span>
            <span className="readout-value" style={{ color: dU > 50 ? 'var(--accent2)' : dU < -50 ? 'var(--red)' : 'var(--muted)' }}>
              {sign(dU)} {fmtJ(dU)}
            </span>
          </div>
        </div>
        <div className="info-box tip" style={{ marginTop: '0.75rem' }}>
          <span className="info-box-icon">📊</span>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', marginBottom: '0.2rem' }}>{formula}</div>
            <div style={{ fontSize: '0.82rem' }}>ΔU = {fmtJ(dU)}, &nbsp;Q = {fmtJ(Q)}, &nbsp;L = {fmtJ(L)}</div>
            <div style={{ fontSize: '0.82rem', opacity: 0.7 }}>Verifica: Q−L = {fmtJ(Q-L)} = ΔU {Math.abs(Q-L-dU) < 1 ? '✓' : '✗'}</div>
          </div>
        </div>
      </div>

      <Quiz title={t.quiz.title} questions={t.quiz.questions} />
    </>
  )
}
