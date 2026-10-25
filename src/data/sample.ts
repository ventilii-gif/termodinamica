// Estrae n elementi a caso da un array (Fisher-Yates), senza ripetizioni.
// Se n >= lunghezza, restituisce tutti gli elementi mescolati.
export function sampleN<T>(arr: readonly T[], n: number): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return n >= a.length ? a : a.slice(0, n)
}
