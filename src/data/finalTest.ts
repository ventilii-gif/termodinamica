import type { Lang } from '../i18n'

export interface TestQuestion {
  q: string
  opts: string[]
  correct: number
  exp: string
}

const it: TestQuestion[] = [
  { q: 'La temperatura di un corpo misura:', opts: ['Il calore totale contenuto', "L'energia cinetica media delle molecole", 'La massa del corpo', 'Il flusso di calore'], correct: 1, exp: 'La temperatura misura l’agitazione molecolare media, non il calore totale. Bravo se ci sei arrivato!' },
  { q: '37 °C corrispondono a:', opts: ['310,15 K', '273,15 K', '347 K', '210 K'], correct: 0, exp: 'K = °C + 273,15 = 37 + 273,15 = 310,15 K.' },
  { q: 'Lo zero assoluto vale:', opts: ['0 °C', '−273,15 °C', '−100 °C', '−459 K'], correct: 1, exp: '0 K = −273,15 °C: è la temperatura minima possibile.' },
  { q: 'Per riscaldare 1 kg d’acqua di 1 °C servono circa:', opts: ['4186 J', '334 J', '900 J', '2260 J'], correct: 0, exp: 'Il calore specifico dell’acqua è 4186 J/(kg·K): è quello che serve per +1 °C su 1 kg.' },
  { q: 'Quanto calore per riscaldare 2 kg d’acqua da 20 a 70 °C?', opts: ['418 kJ', '209 kJ', '837 kJ', '84 kJ'], correct: 0, exp: 'Q = mcΔT = 2×4186×50 ≈ 418 kJ. Ottimo lavoro sui calcoli!' },
  { q: 'Durante la fusione la temperatura:', opts: ['Aumenta', 'Rimane costante', 'Diminuisce', 'Oscilla'], correct: 1, exp: 'Il calore serve a rompere i legami: nasce il plateau nel grafico T-Q.' },
  { q: 'Fondere 0,5 kg di ghiaccio a 0 °C (L = 334 kJ/kg) richiede:', opts: ['167 kJ', '334 kJ', '668 kJ', '83 kJ'], correct: 0, exp: 'Q = mL = 0,5×334 = 167 kJ. Attenzione alla massa in kg!' },
  { q: 'La sublimazione è il passaggio:', opts: ['Solido → gas', 'Liquido → gas', 'Gas → liquido', 'Solido → liquido'], correct: 0, exp: 'Sublimazione = da solido direttamente a gas (es. ghiaccio secco).' },
  { q: 'Il calore latente di vaporizzazione dell’acqua vale:', opts: ['2260 kJ/kg', '334 kJ/kg', '4186 kJ/kg', '100 kJ/kg'], correct: 0, exp: 'L_vap = 2260 kJ/kg, circa 7× quello di fusione.' },
  { q: 'Il sudore ci rinfresca grazie a:', opts: ['Conduzione', 'Calore latente di vaporizzazione', 'Irraggiamento', 'Convezione'], correct: 1, exp: 'Evaporando, il sudore assorbe calore latente dalla pelle e la raffredda.' },
  { q: 'La legge dei gas perfetti è:', opts: ['PV = nRT', 'PV = mRT', 'P/V = nRT', 'PV² = nRT'], correct: 0, exp: 'PV = nRT con R = 8,314 J/(mol·K) e T in Kelvin.' },
  { q: 'A T costante, se P raddoppia il volume:', opts: ['Raddoppia', 'Si dimezza', 'Resta uguale', 'Quadruplica'], correct: 1, exp: 'Legge di Boyle: PV = cost, quindi V si dimezza.' },
  { q: 'A P costante, riscaldando il gas il volume:', opts: ['Aumenta con T (K)', 'Diminuisce', 'Resta uguale', 'Aumenta con T²'], correct: 0, exp: 'Legge di Charles: V/T = cost. Ricorda: T in Kelvin!' },
  { q: '1 mol di gas a 0 °C e 1 atm occupa:', opts: ['22,4 L', '1 L', '10 L', '100 L'], correct: 0, exp: 'Il volume molare a STP è 22,4 L per qualsiasi gas ideale.' },
  { q: 'La costante universale dei gas R vale:', opts: ['8,314 J/(mol·K)', '1,38×10⁻²³ J/K', '6,022×10²³', '9,81 m/s²'], correct: 0, exp: 'R = 8,314 J/(mol·K). La 2ª è Boltzmann, la 3ª Avogadro.' },
  { q: 'Il primo principio della termodinamica è:', opts: ['ΔU = Q − L', 'ΔU = Q + L', 'Q = ΔU × L', 'Q = 0'], correct: 0, exp: 'ΔU = Q − L: conservazione dell’energia applicata alla termodinamica.' },
  { q: 'In una isoterma di un gas perfetto:', opts: ['ΔU = 0, Q = L', 'Q = 0', 'L = 0', 'P = cost'], correct: 0, exp: 'T costante → ΔU = 0 → tutto il calore diventa lavoro (Q = L).' },
  { q: 'In una trasformazione adiabatica:', opts: ['Q = 0', 'T = cost', 'V = cost', 'P = cost'], correct: 0, exp: 'Adiabatica = nessuno scambio di calore, Q = 0, quindi ΔU = −L.' },
  { q: 'In una isocora (V costante):', opts: ['L = 0, ΔU = Q', 'Q = 0', 'ΔU = 0', 'L = PΔV'], correct: 0, exp: 'V costante → L = 0 → tutto il calore aumenta l’energia interna.' },
  { q: 'Nel diagramma P-V il lavoro è:', opts: ["L'area sotto la curva", 'La pendenza', 'Il valore di P', 'Il prodotto PV'], correct: 0, exp: 'Il lavoro L = ∫P dV corrisponde all’area sottesa dalla curva. Complimenti, hai completato il test!' },
]

const en: TestQuestion[] = [
  { q: 'The temperature of a body measures:', opts: ['The total heat stored', 'The average kinetic energy of molecules', 'The mass of the body', 'The heat flow'], correct: 1, exp: 'Temperature measures average molecular agitation, not total heat. Well done if you got it!' },
  { q: '37 °C equals:', opts: ['310.15 K', '273.15 K', '347 K', '210 K'], correct: 0, exp: 'K = °C + 273.15 = 37 + 273.15 = 310.15 K.' },
  { q: 'Absolute zero is:', opts: ['0 °C', '−273.15 °C', '−100 °C', '−459 K'], correct: 1, exp: '0 K = −273.15 °C: the lowest possible temperature.' },
  { q: 'Heating 1 kg of water by 1 °C needs about:', opts: ['4186 J', '334 J', '900 J', '2260 J'], correct: 0, exp: "Water's specific heat is 4186 J/(kg·K): what is needed for +1 °C on 1 kg." },
  { q: 'Heat to warm 2 kg of water from 20 to 70 °C?', opts: ['418 kJ', '209 kJ', '837 kJ', '84 kJ'], correct: 0, exp: 'Q = mcΔT = 2×4186×50 ≈ 418 kJ. Great calculation work!' },
  { q: 'During melting the temperature:', opts: ['Increases', 'Stays constant', 'Decreases', 'Oscillates'], correct: 1, exp: 'Heat breaks bonds: a plateau appears in the T-Q graph.' },
  { q: 'Melting 0.5 kg of ice at 0 °C (L = 334 kJ/kg) requires:', opts: ['167 kJ', '334 kJ', '668 kJ', '83 kJ'], correct: 0, exp: 'Q = mL = 0.5×334 = 167 kJ. Mind the mass in kg!' },
  { q: 'Sublimation is the transition:', opts: ['Solid → gas', 'Liquid → gas', 'Gas → liquid', 'Solid → liquid'], correct: 0, exp: 'Sublimation = solid directly to gas (e.g. dry ice).' },
  { q: "Water's latent heat of vaporisation is:", opts: ['2260 kJ/kg', '334 kJ/kg', '4186 kJ/kg', '100 kJ/kg'], correct: 0, exp: 'L_vap = 2260 kJ/kg, about 7× the heat of fusion.' },
  { q: 'Sweat cools us thanks to:', opts: ['Conduction', 'Latent heat of vaporisation', 'Radiation', 'Convection'], correct: 1, exp: 'By evaporating, sweat absorbs latent heat from the skin and cools it.' },
  { q: 'The ideal gas law is:', opts: ['PV = nRT', 'PV = mRT', 'P/V = nRT', 'PV² = nRT'], correct: 0, exp: 'PV = nRT with R = 8.314 J/(mol·K) and T in Kelvin.' },
  { q: 'At constant T, if P doubles the volume:', opts: ['Doubles', 'Halves', 'Stays the same', 'Quadruples'], correct: 1, exp: "Boyle's Law: PV = const, so V halves." },
  { q: 'At constant P, heating the gas the volume:', opts: ['Increases with T (K)', 'Decreases', 'Stays the same', 'Increases with T²'], correct: 0, exp: "Charles's Law: V/T = const. Remember: T in Kelvin!" },
  { q: '1 mol of gas at 0 °C and 1 atm occupies:', opts: ['22.4 L', '1 L', '10 L', '100 L'], correct: 0, exp: 'The molar volume at STP is 22.4 L for any ideal gas.' },
  { q: 'The universal gas constant R is:', opts: ['8.314 J/(mol·K)', '1.38×10⁻²³ J/K', '6.022×10²³', '9.81 m/s²'], correct: 0, exp: 'R = 8.314 J/(mol·K). The 2nd is Boltzmann, the 3rd Avogadro.' },
  { q: 'The first law of thermodynamics is:', opts: ['ΔU = Q − W', 'ΔU = Q + W', 'Q = ΔU × W', 'Q = 0'], correct: 0, exp: 'ΔU = Q − W: conservation of energy applied to thermodynamics.' },
  { q: 'In an isothermal process of an ideal gas:', opts: ['ΔU = 0, Q = W', 'Q = 0', 'W = 0', 'P = const'], correct: 0, exp: 'Constant T → ΔU = 0 → all heat becomes work (Q = W).' },
  { q: 'In an adiabatic process:', opts: ['Q = 0', 'T = const', 'V = const', 'P = const'], correct: 0, exp: 'Adiabatic = no heat exchange, Q = 0, so ΔU = −W.' },
  { q: 'In an isochoric process (constant V):', opts: ['W = 0, ΔU = Q', 'Q = 0', 'ΔU = 0', 'W = PΔV'], correct: 0, exp: 'Constant V → W = 0 → all heat raises the internal energy.' },
  { q: 'In the P-V diagram, work is:', opts: ['The area under the curve', 'The slope', 'The value of P', 'The product PV'], correct: 0, exp: 'Work W = ∫P dV is the area under the curve. Congratulations, you finished the test!' },
]

export const finalTest: Record<Lang, TestQuestion[]> = { it, en }
