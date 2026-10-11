// Card = number 0..80. Four features, each with 3 values (0,1,2).
export const COLORS = ['#8a1c9a', '#0a8a1f', '#e30d0d'] // purple, green, red
export const SHAPES = ['Tilde', 'Diamond', 'Pill']

export const attrs = (id) => ({
  color: id % 3,
  shape: Math.floor(id / 3) % 3,
  number: Math.floor(id / 9) % 3, // 0 -> 1 symbol, 2 -> 3 symbols
  filling: Math.floor(id / 27), // 0 solid, 1 striped, 2 outlined
})

// A Set: every feature is all-the-same or all-different  <=>  values sum to 0 mod 3
export const isSet = (a, b, c) => {
  const x = attrs(a), y = attrs(b), z = attrs(c)
  return Object.keys(x).every((k) => (x[k] + y[k] + z[k]) % 3 === 0)
}

export function findSet(board) {
  for (let i = 0; i < board.length; i++)
    for (let j = i + 1; j < board.length; j++)
      for (let k = j + 1; k < board.length; k++)
        if (isSet(board[i], board[j], board[k])) return [board[i], board[j], board[k]]
  return null
}

const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Keep 12 cards on the table, and add 3 more while the board has no Set.
function refill(board, deck) {
  while (board.length < 12 && deck.length) board.push(deck.shift())
  while (!findSet(board) && deck.length) board.push(...deck.splice(0, 3))
  return { board, deck }
}

export function deal() {
  const deck = shuffle([...Array(81).keys()])
  const board = deck.splice(0, 12)
  return refill(board, deck)
}

export function takeCards(board, deck, ids) {
  return refill(board.filter((c) => !ids.includes(c)), [...deck])
}
