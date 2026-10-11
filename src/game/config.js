// ---- CARD PICTURES --------------------------------------------------------
// Change the pictures HERE. Each of the 3 shapes can be replaced by an image:
//   index 0 = Tilde (the squiggle), 1 = Diamond, 2 = Pill
//
// 1. Put your images in  src/assets/cards/   (png / jpg / svg / webp)
// 2. Import them and list them below, for example:
//
//      import cat from '../assets/cards/cat.png'
//      import dog from '../assets/cards/dog.png'
//      import fish from '../assets/cards/fish.png'
//      export const SHAPE_IMAGES = [cat, dog, fish]
//
// Use null to keep the built-in vector shape for that slot.
// Color shows as the picture's frame, striped = striped picture, outlined = faded picture.
export const SHAPE_IMAGES = [null, null, null]

// Seconds range [min, max] the bot waits before finding a Set
export const BOT_DELAYS = {
  easy: [22000, 32000],
  medium: [12000, 20000],
  hard: [5000, 10000],
}

// Multiplayer: colors, and keyboard keys that press each player's "Set" button
export const PLAYER_COLORS = ['#2563eb', '#ea580c', '#0d9488', '#db2777']
export const PLAYER_KEYS = ['a', 'l', 'z', 'm']
export const CLAIM_SECONDS = 10
