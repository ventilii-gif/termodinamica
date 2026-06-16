import { useState, useMemo } from 'react'
import { i18n } from '../i18n'
import { useLang } from '../App'
import Quiz from '../components/Quiz'

const R = 8.314
const n = 1
const GAMMA = 5/3
const CV = (3/2) * R
const CP = (5/2) * R

type TrasformazioneKey = 'iso' | 'adi' | 'isc' | 'isb'

function PVDiagram({
  tipo, P1, V1, P2, V2
}: { tipo: TrasformazioneKey; P1: number; V1: number; P2: number; V2: number }) {
  const W = 400, H = 240
  const PAD = { l: 50, r: 20, t: 20, b: 40 }
  const gW = W - PAD.l - PAD.r
  const gH = H - PAD.t - PAD.b

  // axis ranges
  const allP = [P1, P2, 0.1]
  const allV = [V1, V2, 0.1]
  const minV = 0, maxV = Math.max(...allV) * 1.3
  const minP = 0, maxP = Math.max(...allP) * 1.3

  const px = (v: number) => PAD.l + (v - minV) / (maxV - minV) * gW
  const py = (p: number) => PAD.t + gH - (p - minP) / (maxP - minP) * gH

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
    'Z'
  ].join(' ')

  const colors: Record<TrasformazioneKey, string> = {
    iso: '#ff7043', adi: '#ffd54f', isc: '#69f0ae', isb: '#ef9a9a'
  }
  const color = colors[tipo]

  // arrow midpoint
  const mid = curvePoints[Math.floor(curvePoints.length/2)]
  const nxt = curvePoints[Math.floor(curvePoints.length/2)+1]
  const arrowAngle = Math.atan2(py(nxt[1])-py(mid[1]), px(nxt[0])-px(mid[0])) * 180 / Math.PI

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="sim-svg">
      <defs>
        <marker id="arr" markerWidth="8" markerHeight="8" refX="4" refY="3" orient="auto">
          <path d="M0,0 L8,3 L0,6 Z" fill={color} />
        </marker>
      </defs>

      {/* area */}
      <path d={areaD} fill={color} opacity={0.12} />

      {/* grid */}
      {[P1, P2, (P1+P2)/2].filter((v,i,a)=>a.indexOf(v)===i).map((p,i) => (
        <line key={i} x1={PAD.l} y1={py(p)} x2={W-PAD.r} y2={py(p)}
          stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      ))}

      {/* axes */}
      <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={H-PAD.b+5} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      <line x1={PAD.l-5} y1={H-PAD.b} x2={W-PAD.r} y2={H-PAD.b} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      <text x={PAD.l-8} y={PAD.t+4} textAnchor="end" fill="var(--muted)" fontSize="10">P</text>
      <text x={W-PAD.r} y={H-PAD.b+14} textAnchor="middle" fill="var(--muted)" fontSize="10">V</text>

      {/* axis ticks */}
      <text x={PAD.l-4} y={py(P1)+4} textAnchor="end" fill="var(--muted)" fontSize="8">{P1.toFixed(1)}</text>
      <text x={PAD.l-4} y={py(P2)+4} textAnchor="end" fill="var(--muted)" fontSize="8">{P2.toFixed(1)}</text>
      <text x={px(V1)} y={H-PAD.b+12} textAnchor="middle" fill="var(--muted)" fontSize="8">{V1.toFixed(1)}</text>
      <text x={px(V2)} y={H-PAD.b+12} textAnchor="middle" fill="var(--muted)" fontSize="8">{V2.toFixed(1)}</text>

      {/* curve */}
      <path d={pathD} fill="none" stroke={color} strokeWidth="2.5"
        markerMid="url(#arr)" strokeLinejoin="round" />

      {/* points */}
      <circle cx={px(V1)} cy={py(P1)} r={5} fill="none" stroke={color} strokeWidth="2" />
      <text x={px(V1)+8} y={py(P1)-6} fill={color} fontSize="9">A(V₁,P₁)</text>
      <circle cx={px(V2)} cy={py(P2)} r={5} fill={color} stroke={color} strokeWidth="2" />
      <text x={px(V2)+8} y={py(P2)-6} fill={color} fontSize="9">B(V₂,P₂)</text>

      {/* area label */}
      <text x={(px(V1)+px(V2))/2} y={py((P1+P2)/4)} textAnchor="middle" fill={color} fontSize="9" opacity={0.7}>
        Area = L
      </text>
    </svg>
  )
}

function calcola(
  tipo: TrasformazioneKey,
  P1_atm: number, V1_L: number, P2_atm: number, V2_L: number
): { Q: number; L: number; dU: number; formula: string } {
  const P1 = P1_atm * 101325
  const V1 = V1_L * 1e-3
  const P2 = P2_atm * 101325
  const V2 = V2_L * 1e-3
  const T1 = (P1 * V1) / (n * R)
  const T2 = (P2 * V2) / (n * R)
  const dU = n * CV * (T2 - T1)

  if (tipo === 'iso') {
    const L = P1 * V1 * Math.log(V2 / V1)
    return { Q: L, L, dU: 0, formula: 'L = nRT·ln(V₂/V₁)' }
  }
  if (tipo === 'adi') {
    const L = (P1*V1 - P2*V2) / (GAMMA - 1)
    return { Q: 0, L, dU: -L, formula: 'L = (P₁V₁ − P₂V₂)/(γ−1)' }
  }
  if (tipo === 'isc') {
    return { Q: dU, L: 0, dU, formula: 'L = 0' }
  }
  // isobara
  const L = P1 * (V2 - V1)
  const Q = dU + L
  return { Q, L, dU, formula: 'L = PΔV' }
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
            <div key={tr.name} className="transform-card" style={{ borderColor: tr.color + '60' }}>
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
            <button key={k} className={`seg-btn${tipo===k?' active':''}`} onClick={() => setTipo(k)}>
              {t.transforms[i].icon} {t.transforms[i].name}
            </button>
          ))}
        </div>

        <div className="ctrl-row">
          <span className="ctrl-label">{t.labelP1}</span>
          <input type="range" min="0.5" max="8" step="0.5" value={P1}
            onChange={e => setP1(+e.target.value)} />
          <span className="ctrl-value">{P1.toFixed(1)} atm</span>
        </div>
        <div className="ctrl-row">
          <span className="ctrl-label">{t.labelV1}</span>
          <input type="range" min="1" max="15" step="0.5" value={V1}
            onChange={e => setV1(+e.target.value)} />
          <span className="ctrl-value">{V1.toFixed(1)} L</span>
        </div>

        {tipo === 'isc' ? (
          <div className="ctrl-row">
            <span className="ctrl-label">{t.labelP2}</span>
            <input type="range" min="0.5" max="8" step="0.5" value={P2}
              onChange={e => setP2(+e.target.value)} />
            <span className="ctrl-value">{P2.toFixed(1)} atm</span>
          </div>
        ) : tipo !== 'isb' ? (
          <div className="ctrl-row">
            <span className="ctrl-label">{t.labelV2}</span>
            <input type="range" min={V1 + 0.5} max="20" step="0.5" value={V2}
              onChange={e => setV2(+e.target.value)} />
            <span className="ctrl-value">{V2.toFixed(1)} L</span>
          </div>
        ) : (
          <div className="ctrl-row">
            <span className="ctrl-label">{t.labelV2}</span>
            <input type="range" min={V1 + 0.5} max="20" step="0.5" value={V2}
              onChange={e => setV2(+e.target.value)} />
            <span className="ctrl-value">{V2.toFixed(1)} L</span>
          </div>
        )}

        <PVDiagram tipo={tipo} P1={P1} V1={V1} P2={derivedP2} V2={derivedV2} />

        <div className="readouts" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
          <div className="readout" style={{ borderColor: derivedP2 < P1 ? 'rgba(105,240,174,0.3)' : 'rgba(255,82,82,0.3)' }}>
            <span className="readout-label">{t.labelQ}</span>
            <span className="readout-value" style={{ color: Q > 50 ? 'var(--green)' : Q < -50 ? 'var(--red)' : 'var(--muted)' }}>
              {sign(Q)} {fmtJ(Q)}
            </span>
          </div>
          <div className="readout">
            <span className="readout-label">{t.labelL}</span>
            <span className="readout-value" style={{ color: L > 50 ? 'var(--primary)' : L < -50 ? 'var(--accent2)' : 'var(--muted)' }}>
              {sign(L)} {fmtJ(L)}
            </span>
          </div>
          <div className="readout">
            <span className="readout-label">{t.labelDU}</span>
            <span className="readout-value" style={{ color: dU > 50 ? 'var(--accent)' : dU < -50 ? 'var(--red)' : 'var(--muted)' }}>
              {sign(dU)} {fmtJ(dU)}
            </span>
          </div>
        </div>

        <div className="info-box tip" style={{ marginTop: '0.75rem' }}>
          <span className="info-box-icon">📊</span>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
              {formula}
            </div>
            <div style={{ fontSize: '0.82rem' }}>
              ΔU = {fmtJ(dU)}, &nbsp; Q = {fmtJ(Q)}, &nbsp; L = {fmtJ(L)}
            </div>
            <div style={{ fontSize: '0.82rem', opacity: 0.7 }}>
              Verifica: Q − L = {fmtJ(Q-L)} = ΔU {Math.abs(Q-L-dU) < 1 ? '✓' : '✗'}
            </div>
          </div>
        </div>
      </div>

      <Quiz title={t.quiz.title} questions={t.quiz.questions} />
    </>
  )
}
