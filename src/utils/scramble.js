const FACES = ['U', 'D', 'L', 'R', 'F', 'B'];
const AXIS = { U: 0, D: 0, L: 1, R: 1, F: 2, B: 2 };
const SUFFIXES = ['', "'", '2'];

export function generateScramble(length = 20) {
  const moves = [];
  let lastAxis = -1;

  while (moves.length < length) {
    const face = FACES[Math.floor(Math.random() * FACES.length)];
    if (AXIS[face] === lastAxis) continue;
    lastAxis = AXIS[face];
    moves.push(face + SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)]);
  }

  return moves.join(' ');
}
