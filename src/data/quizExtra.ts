import type { Lang } from '../i18n'
import type { SectionKey } from './exercises'

export interface QuizQ { q: string; opts: string[]; correct: number; exp: string }

const it: Record<SectionKey, QuizQ[]> = {
  temperatura: [
    { q: 'Quanti °C sono 350 K?', opts: ['77 °C', '87 °C', '77 K', '−77 °C'], correct: 0, exp: '°C = K − 273,15 = 350 − 273,15 ≈ 77 °C.' },
    { q: 'Raddoppiando la massa d’acqua da riscaldare (stesso ΔT), il calore necessario:', opts: ['Raddoppia', 'Si dimezza', 'Resta uguale', 'Quadruplica'], correct: 0, exp: 'In Q = mcΔT il calore è proporzionale alla massa: massa doppia → calore doppio.' },
  ],
  passaggi: [
    { q: 'Quanto calore per vaporizzare 0,5 kg d’acqua a 100 °C? (L_vap = 2260 kJ/kg)', opts: ['1130 kJ', '2260 kJ', '565 kJ', '4520 kJ'], correct: 0, exp: 'Q = mL = 0,5 × 2260 = 1130 kJ.' },
    { q: 'Il brinamento è il passaggio:', opts: ['Gas → solido', 'Solido → gas', 'Liquido → solido', 'Gas → liquido'], correct: 0, exp: 'Il brinamento porta un gas direttamente allo stato solido (es. la brina sui vetri).' },
  ],
  gas: [
    { q: 'Raddoppiando le moli n a V e T costanti, la pressione:', opts: ['Raddoppia', 'Si dimezza', 'Resta uguale', 'Quadruplica'], correct: 0, exp: 'Da PV = nRT, a V e T fissi P ∝ n: moli doppie → pressione doppia.' },
    { q: 'A P e T costanti, 2 mol di gas rispetto a 1 mol occupano:', opts: ['Il doppio del volume', 'Metà volume', 'Lo stesso volume', 'Il quadruplo'], correct: 0, exp: 'A P e T costanti V ∝ n (principio di Avogadro): moli doppie → volume doppio.' },
  ],
  termo: [
    { q: 'In un ciclo termodinamico completo, ΔU vale:', opts: ['0', 'Q totale', '−L totale', 'Il massimo'], correct: 0, exp: 'Lo stato finale coincide con quello iniziale: l’energia interna è una funzione di stato, quindi ΔU = 0.' },
    { q: 'In un’espansione isoterma un gas assorbe 500 J di calore. Il lavoro compiuto è:', opts: ['500 J', '0 J', '−500 J', '250 J'], correct: 0, exp: 'Isoterma: ΔU = 0 → L = Q = 500 J. Tutto il calore diventa lavoro.' },
  ],
}

const en: Record<SectionKey, QuizQ[]> = {
  temperatura: [
    { q: 'How many °C is 350 K?', opts: ['77 °C', '87 °C', '77 K', '−77 °C'], correct: 0, exp: '°C = K − 273.15 = 350 − 273.15 ≈ 77 °C.' },
    { q: 'Doubling the mass of water to heat (same ΔT), the required heat:', opts: ['Doubles', 'Halves', 'Stays the same', 'Quadruples'], correct: 0, exp: 'In Q = mcΔT heat is proportional to mass: double mass → double heat.' },
  ],
  passaggi: [
    { q: 'Heat to vaporise 0.5 kg of water at 100 °C? (L_vap = 2260 kJ/kg)', opts: ['1130 kJ', '2260 kJ', '565 kJ', '4520 kJ'], correct: 0, exp: 'Q = mL = 0.5 × 2260 = 1130 kJ.' },
    { q: 'Deposition is the transition:', opts: ['Gas → solid', 'Solid → gas', 'Liquid → solid', 'Gas → liquid'], correct: 0, exp: 'Deposition takes a gas directly to the solid state (e.g. frost on windows).' },
  ],
  gas: [
    { q: 'Doubling the moles n at constant V and T, pressure:', opts: ['Doubles', 'Halves', 'Stays the same', 'Quadruples'], correct: 0, exp: 'From PV = nRT, at fixed V and T, P ∝ n: double moles → double pressure.' },
    { q: 'At constant P and T, 2 mol of gas vs 1 mol occupy:', opts: ['Twice the volume', 'Half the volume', 'The same volume', 'Four times'], correct: 0, exp: "At constant P and T, V ∝ n (Avogadro's principle): double moles → double volume." },
  ],
  termo: [
    { q: 'In a complete thermodynamic cycle, ΔU is:', opts: ['0', 'Total Q', '−total W', 'The maximum'], correct: 0, exp: 'The final state equals the initial one: internal energy is a state function, so ΔU = 0.' },
    { q: 'In an isothermal expansion a gas absorbs 500 J of heat. The work done is:', opts: ['500 J', '0 J', '−500 J', '250 J'], correct: 0, exp: 'Isothermal: ΔU = 0 → W = Q = 500 J. All heat becomes work.' },
  ],
}

export const quizExtra: Record<Lang, Record<SectionKey, QuizQ[]>> = { it, en }
