import { useState } from 'react'
import { SHAPE_IMAGES } from './game/config'
import { StripeDefs } from './components/Symbol'
import Menu from './components/Menu'
import Game from './components/Game'
import './App.css'

export default function App() {
  const [screen, setScreen] = useState({ name: 'menu' })

  return (
    <div className="app">
      <StripeDefs />
      {screen.name === 'menu' && <Menu onPlay={(opts) => setScreen({ name: 'game', ...opts })} />}
      {screen.name === 'game' && (
        <Game
          mode={screen.mode}
          difficulty={screen.difficulty}
          players={screen.players}
          images={SHAPE_IMAGES}
          onMenu={() => setScreen({ name: 'menu' })}
        />
      )}
    </div>
  )
}
