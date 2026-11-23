// scenes/cast.js — the words-swallow cast.
// ELI = you (hero, 16): forest green hoodie #1E7B4D, black round head, GOLD rim light.
// Everyone has a solid black round head (ink) — the house style. Gold rim light on Eli ONLY.
// Shots pass rim { color: '#ffd76a', dir: [-1, -1], w: 4 } on Eli's drawFigure calls.
// Grandma Rose: white hair is NOT a rig option — shots draw a white bun over her black head.
export const CAST = {
  ELI: { name: 'Eli', outfit: { top: 'hoodie', color: '#1E7B4D', legs: '#1c1c28' } },
  MOM: { name: 'Mom', outfit: { top: 'tshirt', color: '#8a6ad0', legs: '#1c1c28', head: 'bun' } },
  DAD: { name: 'Dad', outfit: { top: 'tshirt', color: '#6a5a4a', legs: '#2a2a33' } },
  JUNE: { name: 'June', outfit: { top: 'tshirt', color: '#e8b23a', legs: '#1c1c28', head: 'ponytail' } },
  THEO: { name: 'Theo', outfit: { top: 'tshirt', color: '#4a7ac9', legs: '#1c1c28', head: 'cap' } },
  HALE: { name: 'Mr. Hale', outfit: { top: 'tshirt', color: '#808080', legs: '#2a2a33', face: 'glasses' } },
  COLE: { name: 'Cole', outfit: { top: 'tshirt', color: '#c94a3a', legs: '#1c1c28' } },
  ROSE: { name: 'Grandma Rose', outfit: { top: 'dress', color: '#b8c4d0', legs: '#1c1c28', head: 'bun' } },
  BUSMAN: { name: 'Bus man', outfit: { top: 'tshirt', color: '#5a6a7a', legs: '#1c1c28' } },
  BUSWIFE: { name: 'Bus wife', outfit: { top: 'tshirt', color: '#7a5a8a', legs: '#1c1c28', head: 'bun' } },
  STRANGER: { name: 'Stranger', outfit: { top: 'tshirt', color: '#8a8a9a', legs: '#1c1c28' } },
  GIRL: { name: 'Girl', outfit: { top: 'tshirt', color: '#d06a8a', legs: '#1c1c28', head: 'ponytail' } },
  FRIEND: { name: 'Friend', outfit: { top: 'tshirt', color: '#3a8a7a', legs: '#1c1c28' } },
  KID: { name: 'Kid', outfit: { top: 'tshirt', color: '#e07856', legs: '#1c1c28' } },
  STU1: { name: 'Student', outfit: { top: 'tshirt', color: '#e07856', legs: '#1c1c28' } },
  STU2: { name: 'Student', outfit: { top: 'tshirt', color: '#4a9a6a', legs: '#1c1c28', head: 'cap' } },
  STU3: { name: 'Student', outfit: { top: 'tshirt', color: '#5a7ac9', legs: '#1c1c28', head: 'ponytail' } },
  STU4: { name: 'Student', outfit: { top: 'tshirt', color: '#c9a44a', legs: '#1c1c28' } },
  STU5: { name: 'Student', outfit: { top: 'tshirt', color: '#7a5ac9', legs: '#1c1c28', head: 'bun' } },
  STU6: { name: 'Student', outfit: { top: 'tshirt', color: '#3a8a5a', legs: '#1c1c28', head: 'cap' } },
  PASSER1: { name: 'Passer-by', outfit: { top: 'tshirt', color: '#4a6a8a', legs: '#1c1c28' } },
  PASSER2: { name: 'Passer-by', outfit: { top: 'tshirt', color: '#a05a9a', legs: '#1c1c28', head: 'ponytail' } },
};
