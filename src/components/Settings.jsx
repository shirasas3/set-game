import { SHAPES } from '../game/logic'
import Symbol from './Symbol'

export default function Settings({ pics, onBack }) {
  const { images, setImage, reset, isCustom } = pics
  return (
    <div className="screen">
      <h1 className="title small">Card pictures</h1>
      <p className="sub">Replace any shape with your own picture. Color shows as the frame, striped = striped picture, outlined = faded picture.</p>

      <div className="panel">
        {SHAPES.map((name, s) => (
          <div className="slot" key={s}>
            <div className="prev">
              {images[s] ? <img src={images[s]} alt="" /> : <Symbol shape={s} color={0} filling={0} />}
            </div>
            <span>{name}</span>
            <label className="btn primary small">
              Upload
              <input type="file" accept="image/*" hidden onChange={(e) => { setImage(s, e.target.files[0]); e.target.value = '' }} />
            </label>
            {isCustom(s) && <button className="btn ghost small" onClick={() => reset(s)}>Reset</button>}
          </div>
        ))}
      </div>

      <div className="row"><button className="btn ghost" onClick={onBack}>← Back</button></div>
    </div>
  )
}
