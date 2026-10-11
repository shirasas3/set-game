import { attrs } from '../game/logic'
import Symbol from './Symbol'

export default function Card({ id, images, state, onClick }) {
  const { color, shape, number, filling } = attrs(id)
  return (
    <button className={`card ${state ?? ''}`} onClick={onClick} aria-label="card">
      {Array.from({ length: number + 1 }, (_, i) => (
        <Symbol key={i} shape={shape} color={color} filling={filling} image={images[shape]} />
      ))}
    </button>
  )
}
