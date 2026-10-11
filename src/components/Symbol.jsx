import { COLORS } from '../game/logic'

// Hidden SVG patterns used for the "striped" filling. Render once near the root.
export function StripeDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        {COLORS.map((c, i) => (
          <pattern key={i} id={`stripe-${i}`} width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="4" height="1.6" fill={c} />
          </pattern>
        ))}
      </defs>
    </svg>
  )
}

// shape: 0 tilde, 1 diamond, 2 pill | color: 0..2 | filling: 0 solid, 1 striped, 2 outlined
// image: optional picture that replaces the vector shape
export default function Symbol({ shape, color, filling, image }) {
  const col = COLORS[color]

  if (image) {
    return (
      <div
        className="pic"
        style={{ borderColor: col, opacity: filling === 2 ? 0.35 : 1, filter: filling === 2 ? 'grayscale(1)' : 'none' }}
      >
        <img src={image} alt="" />
        {filling === 1 && <div className="pic-stripes" />}
      </div>
    )
  }

  const p = {
    fill: filling === 0 ? col : filling === 1 ? `url(#stripe-${color})` : 'none',
    stroke: col,
    strokeWidth: 2.5,
  }
  return (
    <svg viewBox="0 0 60 30" className="sym">
      {shape === 0 && <path {...p} d="M6 20C5 8 18 7 27 13S44 23 52 12C58 6 58 25 46 26C34 28 28 19 18 24C11 27 6 25 6 20Z" />}
      {shape === 1 && <polygon {...p} points="30,2 57,15 30,28 3,15" />}
      {shape === 2 && <rect {...p} x="4" y="5" width="52" height="20" rx="10" />}
    </svg>
  )
}
