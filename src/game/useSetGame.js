import { useEffect, useMemo, useReducer } from 'react'
import { deal, findSet, isSet, takeCards } from './logic'
import { BOT_DELAYS, CLAIM_SECONDS } from './config'

// mode 'bot'  : you (player 0) vs bot (player 1), pick 3 cards any time
// mode 'multi': 2-4 players on one board, speed game. Press your "Set" button first, then pick 3 cards.
function init({ mode, players }) {
  const { board, deck } = deal()
  const n = mode === 'bot' ? 2 : players
  return { mode, players: n, board, deck, scores: Array(n).fill(0), claim: null, sel: [], verdict: null, flash: null, last: null }
}

function reducer(s, a) {
  switch (a.type) {
    case 'claim': {
      if (s.mode !== 'multi' || s.claim || s.verdict) return s
      return { ...s, claim: { who: a.who, t: CLAIM_SECONDS }, sel: [], last: null }
    }
    case 'tick': {
      if (!s.claim || s.verdict) return s
      if (s.claim.t > 1) return { ...s, claim: { ...s.claim, t: s.claim.t - 1 } }
      const scores = [...s.scores]
      scores[s.claim.who] -= 1
      return { ...s, scores, claim: null, sel: [], last: { kind: 'timeout', who: s.claim.who } }
    }
    case 'select': {
      if (s.verdict || s.flash) return s
      if (s.mode === 'multi' && !s.claim) return { ...s, last: { kind: 'needclaim' } }
      const sel = s.sel.includes(a.id) ? s.sel.filter((x) => x !== a.id) : [...s.sel, a.id]
      if (sel.length < 3) return { ...s, sel, last: null }
      return { ...s, sel, verdict: { ids: sel, ok: isSet(...sel) } } // checked automatically
    }
    case 'resolve': {
      const v = s.verdict
      if (!v) return s
      const who = s.mode === 'bot' ? 0 : s.claim.who
      const scores = [...s.scores]
      let next = { ...s, verdict: null, claim: null, sel: [] }
      if (v.ok) {
        scores[who] += 1
        next = { ...next, ...takeCards(s.board, s.deck, v.ids), scores, last: { kind: 'ok', who } }
      } else {
        scores[who] -= 1
        next = { ...next, scores, last: { kind: 'bad', who } }
      }
      return next
    }
    case 'botFlash': {
      const found = findSet(s.board)
      if (s.verdict || s.flash || !found) return s
      return { ...s, flash: found, sel: [], last: { kind: 'botfound' } }
    }
    case 'botTake': {
      if (!s.flash) return s
      const scores = [...s.scores]
      scores[1] += 1
      return { ...s, ...takeCards(s.board, s.deck, s.flash), flash: null, scores, last: { kind: 'bottook' } }
    }
    case 'restart':
      return init({ mode: s.mode, players: s.players })
    default:
      return s
  }
}

export function useSetGame(mode, difficulty, players) {
  const [state, dispatch] = useReducer(reducer, { mode, players }, init)
  const over = useMemo(() => state.deck.length === 0 && !findSet(state.board), [state.deck, state.board])

  // show green/red for a moment, then apply the result
  useEffect(() => {
    if (!state.verdict) return
    const t = setTimeout(() => dispatch({ type: 'resolve' }), 750)
    return () => clearTimeout(t)
  }, [state.verdict])

  // multiplayer: countdown after someone pressed Set
  const claimed = state.claim != null
  useEffect(() => {
    if (!claimed || state.verdict) return
    const i = setInterval(() => dispatch({ type: 'tick' }), 1000)
    return () => clearInterval(i)
  }, [claimed, state.verdict])

  // bot: wait, highlight a Set, take it. Never wrong.
  useEffect(() => {
    if (mode !== 'bot' || over || state.verdict) return
    let t
    if (state.flash) {
      t = setTimeout(() => dispatch({ type: 'botTake' }), 1400)
    } else {
      const [min, max] = BOT_DELAYS[difficulty] ?? BOT_DELAYS.medium
      t = setTimeout(() => dispatch({ type: 'botFlash' }), min + Math.random() * (max - min))
    }
    return () => clearTimeout(t)
  }, [mode, difficulty, over, state.board, state.flash, state.verdict])

  return { state, dispatch, over }
}
