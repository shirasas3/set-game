import { useState } from 'react'

export default function Menu({ onPlay }) {
  const [difficulty, setDifficulty] = useState('medium')
  return (
    <div className="screen menu">
      <h1 className="title">Set</h1>
      <p className="sub">Find 3 cards where every feature is all the same or all different.</p>

      <div className="stack">
        <button className="btn primary" onClick={() => onPlay({ mode: 'bot', difficulty })}>🤖 Play vs Bot</button>
        <div className="seg" role="radiogroup" aria-label="Bot difficulty">
          {['easy', 'medium', 'hard'].map((d) => (
            <button key={d} className={d === difficulty ? 'on' : ''} onClick={() => setDifficulty(d)}>{d}</button>
          ))}
        </div>

        <div className="label">👥 Same board · speed game</div>
        <div className="trio">
          {[2, 3, 4].map((n) => (
            <button key={n} className="btn primary" onClick={() => onPlay({ mode: 'multi', players: n })}>{n} Players</button>
          ))}
        </div>

      </div>
    </div>
  )
}
