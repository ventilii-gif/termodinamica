import { useState } from 'react'
import { i18n } from '../i18n'
import { useLang } from '../App'
import Quiz from '../components/Quiz'

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

function tempColor(c: number): string {
  const t = Math.max(0, Math.min(1, (c + 100) / 600))
  const r = Math.round(lerp(50, 220, t))
  const g = Math.round(lerp(100, 60, t))
  const b = Math.round(lerp(200, 30, t))
  return `rgb(${r},${g},${b})`
}

function ThermometerSVG({ celsius }: { celsius: number }) {
  const W = 160, H = 300
  const tubeX = 65, tubeW = 22, tubeTop = 30, tubeBottom = 240
  const tubeH = tubeBottom - tubeTop
  const minC = -100, maxC = 500
  const clampedC = Math.max(minC, Math.min(maxC, celsius))
  const fillFraction = (clampedC - minC) / (maxC - minC)
  const fillH = fillFraction * tubeH
  const fillY = tubeBottom - fillH
  const color = tempColor(celsius)

  const ticks: [number, string][] = [[-100,''], [0,'0°'], [100,'100°'], [200,'200°'], [300,'300°'], [400,'400°'], [500,'']]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ maxWidth: 160, margin: '0 auto', display: 'block', background: '#f8fafc', borderRadius: 10, border: '1px solid #e0e4ea' }}>
      {/* bulb */}
      <circle cx={tubeX + tubeW/2} cy={tubeBottom + 20} r={18} fill={color} stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
      {/* tube outline */}
      <rect x={tubeX} y={tubeTop} width={tubeW} height={tubeH + 2} rx={tubeW/2}
        fill="#e8edf5" stroke="#b0c0d8" strokeWidth="1.5" />
      {/* mercury fill */}
      {fillH > 0 && (
        <rect x={tubeX + 2} y={fillY} width={tubeW - 4} height={fillH}
          rx={(tubeW - 4) / 2} fill={color} />
      )}
      {/* ticks */}
      {ticks.map(([c, label]) => {
        const y = tubeBottom - ((c - minC) / (maxC - minC)) * tubeH
        return (
          <g key={c}>
            <line x1={tubeX + tubeW} y1={y} x2={tubeX + tubeW + 8} y2={y}
              stroke="#9aadcc" strokeWidth="1" />
            {label && <text x={tubeX + tubeW + 12} y={y + 4} fill="#6b7280" fontSize="9">{label}</text>}
          </g>
        )
      })}
      {/* current value indicator */}
      <line x1={tubeX - 5} y1={fillY} x2={tubeX + tubeW + 5} y2={fillY}
        stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export default function TemperaturaCalore() {
  const { lang } = useLang()
  const t = i18n[lang].temperaturaCalore
  const [celsius, setCelsius] = useState(20)

  const kelvin = celsius + 273.15
  const fahrenheit = celsius * 9/5 + 32

  const notevoli: [number, string][] = [
    [-273.15, lang==='it'?'Zero assoluto':'Absolute zero'],
    [-40, lang==='it'?'Punto incontro °C/°F':'C/F meeting point'],
    [0, lang==='it'?'Fusione acqua (1 atm)':'Water melting (1 atm)'],
    [20, lang==='it'?'Temperatura ambiente':'Room temperature'],
    [37, lang==='it'?'Temperatura corporea':'Body temperature'],
    [100, lang==='it'?'Ebollizione acqua':'Water boiling'],
  ]

  return (
    <>
      <div className="card">
        <h2>{t.title}</h2>
        <h3>{t.sec1Title}</h3>
        <p>{t.sec1Text}</p>
        <div className="info-box tip">
          <span className="info-box-icon">💡</span>
          <span>{t.sec1Tip}</span>
        </div>
      </div>

      <div className="card">
        <h2>{t.sec2Title}</h2>
        <p>{t.sec2Text}</p>
        <div className="formula highlight">{t.sec2Formula1}</div>
        <div className="formula highlight">{t.sec2Formula2}</div>
        <div className="formula highlight">{t.sec2Formula3}</div>
        <div className="info-box example">
          <span className="info-box-icon">🌡️</span>
          <span>{lang==='it'
            ? 'Corpo umano: 37°C = 310 K = 98,6°F — Ebollizione acqua: 100°C = 373 K = 212°F — Zero assoluto: -273°C = 0 K = -459°F'
            : 'Human body: 37°C = 310 K = 98.6°F — Water boiling: 100°C = 373 K = 212°F — Absolute zero: -273°C = 0 K = -459°F'}
          </span>
        </div>
      </div>

      <div className="card">
        <h2>{t.sec3Title}</h2>
        <p>{t.sec3Text}</p>
        <div className="formula highlight">{t.sec3Formula}</div>
        <div className="info-box example">
          <span className="info-box-icon">📝</span>
          <span>{t.sec3Example}</span>
        </div>
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
          <input type="range" min="-100" max="500" step="1" value={celsius}
            onChange={e => setCelsius(+e.target.value)} />
          <span className="ctrl-value">{celsius}°C</span>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap', marginTop: '0.75rem' }}>
          <ThermometerSVG celsius={celsius} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <div className="readouts" style={{ gridTemplateColumns: '1fr' }}>
              <div className="readout">
                <span className="readout-label">Celsius (°C)</span>
                <span className="readout-value" style={{ color: tempColor(celsius) }}>{celsius.toFixed(1)} °C</span>
              </div>
              <div className="readout">
                <span className="readout-label">Kelvin (K)</span>
                <span className="readout-value">{kelvin.toFixed(2)} K</span>
              </div>
              <div className="readout">
                <span className="readout-label">Fahrenheit (°F)</span>
                <span className="readout-value">{fahrenheit.toFixed(1)} °F</span>
              </div>
            </div>
            <div style={{ marginTop: '0.75rem' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '0.4rem' }}>
                {lang==='it'?'Temperature notevoli:':'Notable temperatures:'}
              </p>
              {notevoli.map(([c, label]) => (
                <button key={c}
                  onClick={() => setCelsius(Math.round(c))}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    background: Math.abs(celsius - c) < 1 ? 'var(--primary-light)' : '#fff',
                    border: '1.5px solid ' + (Math.abs(celsius - c) < 1 ? 'var(--primary)' : 'var(--border)'),
                    borderRadius: 6, padding: '0.32rem 0.7rem', marginBottom: '0.3rem',
                    cursor: 'pointer', fontSize: '0.82rem', color: 'var(--text)', fontFamily: 'inherit',
                    transition: 'all 0.12s',
                  }}
                >
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--primary)', fontWeight: 700 }}>{c}°C</span>
                  {' '}— {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Quiz title={t.quiz.title} questions={t.quiz.questions} />
    </>
  )
}
