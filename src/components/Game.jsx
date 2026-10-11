import { useEffect } from 'react'
import { useSetGame } from '../game/useSetGame'
import { PLAYER_COLORS, PLAYER_KEYS } from '../game/config'
import Card from './Card'

function statusText(s, names, over) {
  if (over) return 'Game over!'
  const l = s.last
  if (s.verdict) return s.verdict.ok ? 'That is a Set! ✓' : 'Not a Set ✗'
  if (s.claim) return `${names[s.claim.who]}: pick 3 cards! (${s.claim.t}s)`
  if (l?.kind === 'ok') return `${names[l.who]} found a Set! +1`
  if (l?.kind === 'bad') return `${names[l.who]}: not a Set, -1`
  if (l?.kind === 'timeout') return `${names[l.who]} ran out of time, -1`
  if (l?.kind === 'botfound') return 'The bot found a Set!'
  if (l?.kind === 'bottook') return 'The bot took a Set.'
  if (l?.kind === 'needclaim') return 'Press your Set button first!'
  return s.mode === 'multi' ? 'Spot a Set? Be first to press your Set button!' : 'Pick 3 cards — it checks automatically'
}

function Pad({ i, s, onClaim, locked, pos }) {
  const mine = s.claim?.who === i
  return (
    <div className={`pad ${pos} ${mine ? 'active' : ''}`} style={{ '--pc': PLAYER_COLORS[i] }}>
      <div className="info">P{i + 1}<b>{s.scores[i]}</b></div>
      <button className="setpad" disabled={locked} onClick={onClaim}>
        {mine ? `${s.claim.t}s` : 'SET!'}
        <small>[{PLAYER_KEYS[i].toUpperCase()}]</small>
      </button>
    </div>
  )
}

export default function Game({ mode, difficulty, players, images, onMenu }) {
  const { state: s, dispatch, over } = useSetGame(mode, difficulty, players)
  const n = s.players
  const names = mode === 'bot' ? ['You', 'Bot'] : Array.from({ length: n }, (_, i) => `Player ${i + 1}`)
  const locked = over || !!s.claim || !!s.verdict

  // keyboard: each player has a key for their Set button
  useEffect(() => {
    if (mode !== 'multi') return
    const onKey = (e) => {
      const i = PLAYER_KEYS.indexOf(e.key.toLowerCase())
      if (i >= 0 && i < n && !locked) dispatch({ type: 'claim', who: i })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mode, n, locked, dispatch])

  const max = Math.max(...s.scores)
  const leaders = s.scores.flatMap((v, i) => (v === max ? [i] : []))
  const winner = leaders.length > 1 ? "It's a tie!" : `${names[leaders[0]]} wins! 🎉`

  const cardState = (id) => {
    if (s.verdict?.ids.includes(id)) return s.verdict.ok ? 'ok' : 'bad'
    if (s.flash?.includes(id)) return 'flash'
    if (s.sel.includes(id)) return 'sel'
    return ''
  }

  // multiplayer: one player at each wall of the board
  const POSITIONS = ['bottom', 'top', 'left', 'right']

  return (
    <div className="screen">
      {mode === 'bot' && (
        <div className="bar">
          {names.map((nm, i) => <div key={i} className="score">{nm}<b>{s.scores[i]}</b></div>)}
        </div>
      )}

      <div className="status">{statusText(s, names, over)}</div>
      {over && <div className="over">{winner}</div>}

      <div className={mode === 'multi' ? 'arena' : 'arena solo'}>
        {mode === 'multi' && Array.from({ length: n }, (_, i) => (
          <Pad key={i} i={i} s={s} pos={POSITIONS[i]} locked={locked} onClaim={() => dispatch({ type: 'claim', who: i })} />
        ))}
        <div className="grid">
          {s.board.map((id) => (
            <Card key={id} id={id} images={images} state={cardState(id)} onClick={() => dispatch({ type: 'select', id })} />
          ))}
        </div>
      </div>

      <p className="hint">{s.deck.length} cards left in the deck</p>
      <div className="row">
        {over && <button className="btn primary small" onClick={() => dispatch({ type: 'restart' })}>Play again</button>}
        <button className="btn ghost small menu-btn" onClick={onMenu}>Menu</button>
      </div>
    </div>
  )
}
