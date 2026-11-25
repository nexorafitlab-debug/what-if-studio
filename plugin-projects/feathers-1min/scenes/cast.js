// scenes/cast.js — the feathers cast.
// KAI = you (hero, 16): BURGUNDY hoodie #800020, black round head, GOLD rim light.
// Everyone has a solid black round head (ink) — the house style. Gold rim light on Kai ONLY.
// Shots pass rim { color: '#ffd76a', dir: [-1, -1], w: 4 } on Kai's drawFigure calls.
// Burgundy hex LOCKED: #800020 (checked in stills — deep wine red, reads burgundy, not brown).
export const CAST = {
  KAI: { name: 'Kai', outfit: { top: 'hoodie', color: '#800020', legs: '#1c1c28' } },
  MOM: { name: 'Mom', outfit: { top: 'tshirt', color: '#8a6ad0', legs: '#1c1c28', head: 'bun' } },
  OKAFOR: { name: 'Mr. Okafor', outfit: { top: 'tshirt', color: '#808080', legs: '#2a2a33', face: 'glasses' } },
  DANNY: { name: 'Danny', outfit: { top: 'tshirt', color: '#3a8a5a', legs: '#1c1c28', head: 'cap' } },
  MAYA: { name: 'Maya', outfit: { top: 'tshirt', color: '#d06a8a', legs: '#1c1c28', head: 'ponytail' } },
  STU1: { name: 'Student', outfit: { top: 'tshirt', color: '#e07856', legs: '#1c1c28' } },
  STU2: { name: 'Student', outfit: { top: 'tshirt', color: '#4a9a6a', legs: '#1c1c28', head: 'cap' } },
  STU3: { name: 'Student', outfit: { top: 'tshirt', color: '#5a7ac9', legs: '#1c1c28', head: 'ponytail' } },
  STU4: { name: 'Student', outfit: { top: 'tshirt', color: '#c9a44a', legs: '#1c1c28' } },
};
