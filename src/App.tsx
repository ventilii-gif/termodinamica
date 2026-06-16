import { createContext, useContext, useState } from 'react'
import { i18n, type Lang } from './i18n'
import Home from './sections/Home'
import TemperaturaCalore from './sections/TemperaturaCalore'
import PassaggiStato from './sections/PassaggiStato'
import GasPerfetti from './sections/GasPerfetti'
import Termodinamica from './sections/Termodinamica'

type Section = 'home' | 'temperatura' | 'passaggi' | 'gas' | 'termo'
interface LangCtx { lang: Lang; setLang: (l: Lang) => void }
export const LangContext = createContext<LangCtx>({ lang: 'it', setLang: () => {} })
export const useLang = () => useContext(LangContext)

export default function App() {
  const [lang, setLang] = useState<Lang>('it')
  const [section, setSection] = useState<Section>('home')
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
      <header className="header">
        <div className="header-brand">🔥 <span>Termodinamica</span></div>
        <div className="lang-toggle">
          <button className={`lang-btn${lang==='it'?' active':''}`} onClick={()=>setLang('it')}>IT</button>
          <button className={`lang-btn${lang==='en'?' active':''}`} onClick={()=>setLang('en')}>EN</button>
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
    </LangContext.Provider>
  )
}
