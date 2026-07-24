import { createContext, useContext, useState, useEffect } from 'react'
import { i18n, type Lang } from './i18n'
import Home from './sections/Home'
import TemperaturaCalore from './sections/TemperaturaCalore'
import PassaggiStato from './sections/PassaggiStato'
import GasPerfetti from './sections/GasPerfetti'
import Termodinamica from './sections/Termodinamica'

type Section = 'home' | 'temperatura' | 'passaggi' | 'gas' | 'termo'
type Theme = 'light' | 'dark'

interface LangCtx { lang: Lang; setLang: (l: Lang) => void }
interface ThemeCtx { theme: Theme; toggle: () => void }

export const LangContext = createContext<LangCtx>({ lang: 'it', setLang: () => {} })
export const ThemeContext = createContext<ThemeCtx>({ theme: 'light', toggle: () => {} })
export const useLang = () => useContext(LangContext)
export const useTheme = () => useContext(ThemeContext)

export default function App() {
  const [lang, setLang] = useState<Lang>('it')
  const [section, setSection] = useState<Section>('home')
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('thermo-theme') as Theme | null
      if (saved === 'dark' || saved === 'light') return saved
    } catch {}
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try { localStorage.setItem('thermo-theme', theme) } catch {}
  }, [theme])

  const toggle = () => setTheme(t => t === 'dark' ? 'light' : 'dark')
  const t = i18n[lang]

  const navItems: { key: Section; label: string }[] = [
    { key: 'home',        label: t.nav.home },
    { key: 'temperatura', label: t.nav.temperatura },
    { key: 'passaggi',   label: t.nav.passaggi },
    { key: 'gas',        label: t.nav.gas },
    { key: 'termo',      label: t.nav.termo },
  ]

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <ThemeContext.Provider value={{ theme, toggle }}>
        <header className="header">
          <div className="header-brand">🔥 <span>Termodinamica</span></div>
          <div className="header-controls">
            <button className="theme-btn" onClick={toggle}
              title={theme === 'dark' ? 'Tema chiaro' : 'Tema scuro'}>
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <div className="lang-toggle">
              <button className={`lang-btn${lang==='it'?' active':''}`} onClick={()=>setLang('it')}>IT</button>
              <button className={`lang-btn${lang==='en'?' active':''}`} onClick={()=>setLang('en')}>EN</button>
            </div>
          </div>
        </header>
        <nav className="nav">
          {navItems.map(({key,label}) => (
            <button key={key} className={`nav-btn${section===key?' active':''}`} onClick={()=>setSection(key)}>{label}</button>
          ))}
        </nav>
        <main key={`${section}-${lang}`} className="section-enter">
          {section==='home'        && <Home onNavigate={(s)=>setSection(s as Section)} />}
          {section==='temperatura' && <TemperaturaCalore />}
          {section==='passaggi'   && <PassaggiStato />}
          {section==='gas'        && <GasPerfetti />}
          {section==='termo'      && <Termodinamica />}
        </main>
      </ThemeContext.Provider>
    </LangContext.Provider>
  )
}
