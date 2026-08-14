import type { Lang } from './i18n'

export interface UiText {
  navTest: string
  sub: { teoria: string; sim: string; esercizi: string; quiz: string }
  levelF: string; levelM: string; levelD: string
  showHint: string; hintLabel: string; allHints: string
  showSolution: string; hideSolution: string; solutionLabel: string
  exercisesIntro: string
  correctFb: string; wrongFb: string
  testIntro: string; testStart: string; testQuestion: string
  testNext: string; testFinish: string
  testYourAnswer: string; testCorrectAnswer: string; testReview: string; testRetry: string
  testScoreHigh: string; testScoreMid: string; testScoreLow: string
  storicaTitle: string; storicaText: string[]
}

const it: UiText = {
  navTest: '🎯 Test Finale',
  sub: { teoria: '📖 Teoria', sim: '🔬 Simulazione', esercizi: '✏️ Esercizi', quiz: '❓ Quiz' },
  levelF: 'Facile', levelM: 'Medio', levelD: 'Difficile',
  showHint: '💡 Mostra suggerimento',
  hintLabel: 'Suggerimento',
  allHints: 'Hai visto tutti i suggerimenti',
  showSolution: '✅ Mostra soluzione',
  hideSolution: '🙈 Nascondi soluzione',
  solutionLabel: 'Soluzione',
  exercisesIntro: 'Esercizi in ordine di difficoltà crescente, comprese le formule inverse. Prova prima da solo: se ti blocchi, rivela un suggerimento alla volta e controlla la soluzione solo alla fine.',
  correctFb: '✅ Esatto, ottimo lavoro!',
  wrongFb: '💪 Quasi! Non scoraggiarti, leggi la spiegazione:',
  testIntro: 'Metti alla prova tutto ciò che hai imparato: 20 quesiti su tutti gli argomenti. A differenza dei quiz, qui le soluzioni compaiono solo alla fine — proprio come in una verifica. In bocca al lupo!',
  testStart: '🚀 Inizia il test',
  testQuestion: 'Quesito',
  testNext: 'Avanti →',
  testFinish: '🏁 Vedi risultati',
  testYourAnswer: 'La tua risposta',
  testCorrectAnswer: 'Risposta corretta',
  testReview: '📋 Correzione commentata',
  testRetry: '🔄 Rifai il test',
  testScoreHigh: 'Fantastico! Padroneggi la termodinamica.',
  testScoreMid: 'Bel lavoro! Ripassa gli argomenti dei quesiti sbagliati.',
  testScoreLow: 'Non mollare! Rivedi la teoria e riprova: migliorerai di sicuro.',
  storicaTitle: '📜 Un po’ di storia',
  storicaText: [
    'La termodinamica nasce nell’Ottocento, spinta dalla rivoluzione industriale e dal desiderio di costruire macchine a vapore sempre più efficienti.',
    'Nel 1824 il giovane ingegnere francese Sadi Carnot pubblicò «Riflessioni sulla potenza motrice del fuoco», in cui immaginò la macchina termica ideale e pose le basi del rendimento massimo.',
    'Intorno al 1845 l’inglese James Prescott Joule dimostrò con celebri esperimenti che calore e lavoro sono due forme della stessa grandezza — l’energia — misurando l’equivalente meccanico del calore.',
    'Tra il 1850 e il 1865 Rudolf Clausius e William Thomson (Lord Kelvin) formularono il primo e il secondo principio, e Clausius introdusse una nuova grandezza destinata a grande fortuna: l’entropia.',
    'Infine, verso il 1877, l’austriaco Ludwig Boltzmann collегò l’entropia al disordine molecolare, fondando la meccanica statistica: le leggi macroscopiche del calore nascono dal moto di miliardi di particelle.',
    'Oggi la termodinamica governa tutto: dai motori delle automobili ai frigoriferi, dalle stelle al clima del pianeta. Le stesse equazioni che studi qui descrivono l’Universo intero.',
  ],
}

const en: UiText = {
  navTest: '🎯 Final Test',
  sub: { teoria: '📖 Theory', sim: '🔬 Simulation', esercizi: '✏️ Exercises', quiz: '❓ Quiz' },
  levelF: 'Easy', levelM: 'Medium', levelD: 'Hard',
  showHint: '💡 Show hint',
  hintLabel: 'Hint',
  allHints: 'You have seen all the hints',
  showSolution: '✅ Show solution',
  hideSolution: '🙈 Hide solution',
  solutionLabel: 'Solution',
  exercisesIntro: 'Exercises in increasing order of difficulty, including inverse formulas. Try on your own first: if you get stuck, reveal one hint at a time and check the solution only at the end.',
  correctFb: '✅ Correct, great job!',
  wrongFb: '💪 Almost! Don’t be discouraged, read the explanation:',
  testIntro: 'Test everything you have learned: 20 questions across all topics. Unlike the quizzes, here the solutions appear only at the end — just like a real exam. Good luck!',
  testStart: '🚀 Start the test',
  testQuestion: 'Question',
  testNext: 'Next →',
  testFinish: '🏁 See results',
  testYourAnswer: 'Your answer',
  testCorrectAnswer: 'Correct answer',
  testReview: '📋 Commented review',
  testRetry: '🔄 Retake the test',
  testScoreHigh: 'Fantastic! You have mastered thermodynamics.',
  testScoreMid: 'Nice work! Review the topics of the questions you missed.',
  testScoreLow: 'Don’t give up! Go over the theory and try again: you will surely improve.',
  storicaTitle: '📜 A bit of history',
  storicaText: [
    'Thermodynamics was born in the 19th century, driven by the Industrial Revolution and the desire to build ever more efficient steam engines.',
    'In 1824 the young French engineer Sadi Carnot published “Reflections on the Motive Power of Fire”, imagining the ideal heat engine and laying the foundations of maximum efficiency.',
    'Around 1845 the Englishman James Prescott Joule showed through famous experiments that heat and work are two forms of the same quantity — energy — measuring the mechanical equivalent of heat.',
    'Between 1850 and 1865 Rudolf Clausius and William Thomson (Lord Kelvin) formulated the first and second laws, and Clausius introduced a new and far-reaching quantity: entropy.',
    'Finally, around 1877, the Austrian Ludwig Boltzmann linked entropy to molecular disorder, founding statistical mechanics: the macroscopic laws of heat arise from the motion of billions of particles.',
    'Today thermodynamics governs everything: from car engines to refrigerators, from stars to the planet’s climate. The same equations you study here describe the entire Universe.',
  ],
}

export const uiText: Record<Lang, UiText> = { it, en }
