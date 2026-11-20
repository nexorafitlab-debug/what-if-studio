#!/usr/bin/env python3
"""Build the money-count episode code (158 shots) from episode.json.

Reads src/episodes/money-count/episode.json (the spec: every shot id, set,
size, note) and writes, into this episode folder:
  shots.tsx   — data-driven SPECS table + one generic renderer (death-count-full pattern)
  index.tsx   — defineEpisode('MoneyCount', {timeline, shots, grain: false})

Run:  python3 gen_money.py        (from this folder)
Then: npx tsc --noEmit            (from the studio root, with a stub timeline.json)

Device rules (from episode.json cast + notes):
  - Balance pill: small dark pill, coloured outline, white bold $ text, tiny
    downward pointer, ~1/6 head diameter above the head. NEVER above the hero.
  - green $1,000+ | orange $100-$999 | red pulsing under $100 | gold+glow Ellis.
  - Mrs. Park $40 first appears soft WHITE (S2/S3), red once it ticks (S7+).
  - Camera STATIC inside shots. ONE slow push-in only: S121 (gold reveal).
  - Mirror shots (S24-S27, S105-S106): NOTHING above the hero's head.
"""
import json
from pathlib import Path

EP = Path(__file__).resolve().parent
ep = json.loads((EP / 'episode.json').read_text())
NOTES = {s['id']: s['note'] for s in ep['shots']}
SETS = {s['id']: s['set'] for s in ep['shots']}
SIZES = {s['id']: s['size'] for s in ep['shots']}
IDS = [f'S{i}' for i in range(1, 159)]
assert [s['id'] for s in ep['shots']] == IDS, 'episode.json shot ids are not S1..S158'

GREEN = '#3ED598'
ORANGE = '#FF8A3D'
RED = '#FF3344'
GOLD = '#FFC845'
WHITE = '#F6EFE3'

# default pill outline / pulse / glow per look
PILL = {
    'park': (RED, False, False), 'hale': (GREEN, False, False),
    'maya': (ORANGE, False, False), 'sam': (ORANGE, False, False),
    'derek': (RED, True, False), 'ellis': (GOLD, False, True),
    'grant': (GREEN, False, False), 'mom': (RED, False, False),
    'kid1': (GREEN, False, False), 'kid2': (ORANGE, False, False),
    'kid3': (ORANGE, False, False),
}

# crowd pills reuse ONLY values established in the episode (never invented)
CROWD = [('$12,400', GREEN), ('$312', ORANGE), ('$86,000', GREEN),
         ('$40', RED), ('$212.50', ORANGE), ('$48', RED)]


def ch(look, x=None, y=None, s=None, f=1, e='neutral', pill=None, **kw):
    """One character. x/y/scale default by shot size + position (filled in shot())."""
    d = {'look': look, 'facing': f, 'expr': e}
    if x is not None:
        d['x'] = x
    if y is not None:
        d['y'] = y
    if s is not None:
        d['scale'] = s
    if pill is not None:
        d['pill'] = pill
        o, pu, gl = PILL[look]
        d.setdefault('outline', o)
        if pu:
            d.setdefault('pulse', True)
        if gl:
            d.setdefault('glow', True)
    d.update(kw)
    return d


def pl(x, y, n, o=WHITE, **kw):
    d = {'x': x, 'y': y, 'n': n, 'outline': o}
    d.update(kw)
    return d


def crowd(spec):
    """spec: list of (x, look, pill-or-None) background heads, small scale."""
    return [ch(look, x, s=0.7, pill=pill) for x, look, pill in spec]


ZOOM = {'wide': 0.85, 'medium': 0.95, 'medium wide': 0.9, 'close-up': 1.15,
        'extreme close-up': 1.5, 'macro insert': 1.0, 'title': 1.0}
YDEF = {'wide': 720, 'medium': 730, 'close-up': 780, 'extreme close-up': 950}
SDEF = {'wide': 0.95, 'medium': 1.0, 'close-up': 1.25, 'extreme close-up': 1.5}
XDEF = {1: [960], 2: [700, 1220], 3: [560, 960, 1360],
        4: [450, 850, 1200, 1550], 5: [400, 750, 1050, 1350, 1650]}

SPECS = {}


def shot(id, chars=(), pills=(), kind='scene', **kw):
    size = SIZES[id]
    st = SETS[id]
    chars = list(chars)
    n = len(chars)
    xs = XDEF.get(n, [960] * max(n, 1))
    for i, c in enumerate(chars):
        c.setdefault('x', xs[i] if i < len(xs) else 960)
        c.setdefault('y', YDEF.get(size, 730))
        c.setdefault('scale', SDEF.get(size, 1.0))
    d = {'kind': kind, 'set': 'void' if st == 'dark void' else st, 'size': size,
         'zoom': ZOOM[size],
         'cx': chars[0]['x'] if chars and size in ('close-up', 'extreme close-up') else 960,
         'cy': 540,
         'chars': chars, 'pills': list(pills), 'seed': int(id[1:])}
    d.update(kw)
    SPECS[id] = d
    return d

# ============================================================ SHOT TABLE
# Beat 1 — cold open (lunch line, the cashier's $40)
# ------------------------------------------------------------
shot('S1', [ch('hero'), ch('sam')])  # wide line, no number visible yet
shot('S2', [ch('park', 1000, pill='$40', outline=WHITE),
            ch('hero', 620, s=0.85, e='shock')])
shot('S3', kind='macro', macro={'n': '$40', 'outline': WHITE, 's': 2.4})
shot('S4', [ch('hero', 800, e='shock'), ch('park', 1250, pill='$40')])
shot('S5', [ch('hero', e='shock')],
     pills=[pl(1350, 280, '$40', RED, s=0.9)])
shot('S6', [ch('park', 1150, pill='$40'), ch('hero', 800), ch('sam', 500, s=0.9)])
shot('S7', [ch('park', pill='$40', tick={'values': ['$40', '$44', '$48'], 'step': 10, 'flash': GREEN})])
shot('S8', [ch('hero', 800, e='shock'), ch('park', 1200, pill='$48', outline=GREEN),
            ch('sam', 500, s=0.9)])
shot('S9', [ch('sam', 850, e='happy', armR={'a': 60, 'b': -30}),
            ch('hero', 1200, e='shock')],
     pills=[pl(1450, 300, '$48', GREEN, s=0.9)])
shot('S10', [ch('sam', 850, e='worried'), ch('hero', 1200, e='worried')])
shot('S11', [ch('hero', 900, e='shock', armR={'a': -80, 'b': 0}),
             ch('sam', 1250)],
     pills=[pl(1500, 300, '$48', GREEN, s=0.9)])
shot('S12', [ch('sam', 900), ch('hero', 1200, e='worried')],
     pills=[pl(1500, 300, '$48', GREEN, s=0.9)])
shot('S13', [ch('hero', exprs=[[0, 'neutral'], [25, 'happy']])],
     pills=[pl(1350, 280, '$48', GREEN, s=0.9)])
shot('S14', [ch('hero', 960, e='shock')] + crowd(
    [(420, 'kid1', '$12,400'), (700, 'kid2', '$312'), (1150, 'kid3', '$86,000'),
     (1500, 'kid1', '$40')]))
shot('S15', kind='title', title=['WHAT IF YOU COULD SEE', 'HOW MUCH MONEY EVERYONE HAS?'],
     accent='MONEY')
# Beat 2 — the rules / the test (Mom -$112, Sam -$2.50)
# ------------------------------------------------------------
shot('S16', [ch('hero', 850, armR={'a': -60, 'b': -20}), ch('sam', 1200)],
     banner='THE RULES')
shot('S17', [ch('hero', 800)], pills=[pl(1300, 350, '$12,400', GREEN, s=1.0)],
     prop='walletcard', propAt=[1300, 680])
shot('S18', [], pills=[pl(960, 320, '$12,400', GREEN, s=1.3)],
     prop='walletcard', propAt=[960, 700], propS=1.3,
     pop={'x': 1180, 'y': 460, 'n': '+$4', 'color': GREEN})
shot('S19', [ch('hero', 700)] + crowd(
    [(400, 'kid1', '$12,400'), (1000, 'kid2', '$312'), (1300, 'kid3', '$86,000'),
     (1600, 'kid1', '$40')]))
shot('S20', [ch('hero')], banner='RULE TWO: IT TICKS',
     pills=[pl(1300, 350, '$312', ORANGE, s=1.0)],
     pop={'x': 1300, 'y': 480, 'n': '+$2', 'color': GREEN})
shot('S21', [], pills=[pl(960, 320, '$212.50', ORANGE, s=1.3)],
     prop='coin', propAt=[960, 620],
     pop={'x': 1180, 'y': 460, 'n': '+$1', 'color': GREEN})
shot('S22', [], banner='MONEY IN = GREEN',
     pills=[pl(960, 450, '$48', GREEN, s=1.3)],
     pop={'x': 1180, 'y': 580, 'n': '+$4', 'color': GREEN})
shot('S23', [], banner='MONEY OUT = RED',
     pills=[pl(960, 450, '$48', RED, s=1.3)],
     pop={'x': 1180, 'y': 580, 'n': '-$4', 'color': RED})
shot('S24', [ch('hero', 640)], redLabel='NOTHING ABOVE YOUR HEAD')
shot('S25', [ch('hero', 640, exprs=[[0, 'neutral'], [25, 'worried']])])
shot('S26', [ch('hero', e='worried')])
shot('S27', [ch('hero', 800)])
shot('S28', [ch('mom', 1200, pill=' '), ch('hero', 650)], island=True)
shot('S29', [ch('mom', pill=' ')], phone=[1060, 660])
shot('S30', [ch('mom', 960, 950, 1.5)],
     pills=[pl(960, 350, '-$112', RED, s=1.6, pulse=True)])
shot('S31', [ch('sam', 1000, pill='$212.50'), ch('hero', 650)])
shot('S32', [ch('sam', pill='$212.50',
                tick={'values': ['$212.50', '$210.00'], 'step': 12, 'flash': RED})])
shot('S33', [ch('sam', 900, e='happy', pill='$210.00'), ch('hero', 1200, e='happy')])
shot('S34', [ch('sam', e='happy', pill='$210.00')],
     prop='shoefive', propAt=[960, 880])

# Beat 3 — the experiment (reading the whole school)
# ------------------------------------------------------------
shot('S35', [ch('hero', 700)] + crowd(
    [(400, 'kid1', '$12,400'), (1000, 'kid2', '$312'), (1300, 'kid3', '$86,000'),
     (1600, 'kid1', '$40')]), banner='THE EXPERIMENT')
shot('S36', [ch('hale', 1000, pill='$12,400'), ch('hero', 600)])
shot('S37', [ch('hale', 960, 800, 1.0, pill='$12,400')],
     mugs=[[850, 700], [1070, 700]])
shot('S38', [ch('hale', 900, pill='$12,400')], prop='cart', propAt=[1350, 750])
shot('S39', [ch('maya', 1000, pill='$312')],
     prop='notebook', propAt=[1000, 830], propS=0.8)
shot('S40', [ch('maya', pill='$312')],
     prop='notebook', propAt=[960, 880], propS=1.2)
shot('S41', [ch('maya', 900, pill='$312'), ch('kid1', 1250, e='happy')],
     prop='fries', propAt=[1050, 720])
shot('S42', [ch('sam', pill='$212.50')], prop='coinstack', propAt=[1180, 800])
shot('S43', [ch('sam', pill='$212.50')], prop='coinstack', propAt=[1180, 820])
shot('S44', [ch('sam', pill='$212.50')], prop='shoefive', propAt=[960, 880])
shot('S45', [ch('grant', 1000, pill='$86,000')])
shot('S46', [ch('grant', pill='$86,000')])
shot('S47', [ch('kid1', 1000), ch('hero', 650)],
     prop='machine', propAt=[1300, 620], propS=0.9)
shot('S48', [ch('kid1')], pills=[pl(960, 340, '-$2', RED, s=1.2, pulse=True)])
shot('S49', [ch('hero', 700)] + crowd(
    [(400, 'kid1', '$12,400'), (1000, 'kid2', '$312'), (1300, 'kid3', '$86,000'),
     (1600, 'kid1', '$40')]),
     pop={'x': 1000, 'y': 480, 'n': '-$2', 'color': RED})
shot('S50', [ch('hero', e='happy')],
     pills=[pl(1400, 300, '$86,000', GREEN, s=0.9)])
shot('S51', [ch('hero', 900, e='worried'), ch('kid1', 1300, pill='$48')])
shot('S52', [ch('derek', 1000, pill='$0.00'), ch('hero', 650)] + crowd(
    [(400, 'kid2', '$312'), (1500, 'kid3', '$86,000')]))
shot('S53', [ch('derek', pill='$0.00')], prop='shoes', propAt=[960, 900])
shot('S54', [ch('derek', 1000, pill='$0.00'), ch('hero', 650)] + crowd(
    [(400, 'kid1', '$12,400'), (1500, 'kid2', '$312')]))
shot('S55', [ch('derek', 960, 950, 1.5, e='shock')],
     pills=[pl(960, 380, '$0.00', RED, s=2.4, pulse=True)])
shot('S56', [ch('hero', 850, e='shock'), ch('derek', 1250, e='worried', pill='$0.00')])
shot('S57', [ch('derek', e='worried', pill='$0.00')])
shot('S58', [ch('hero', 900, e='happy'), ch('derek', 1250, pill='$0.00')])
shot('S59', [ch('hero', walk=True)] + crowd(
    [(450, 'kid1', '$12,400'), (1400, 'kid2', '$312')]))
shot('S60', [ch('ellis', 1100, f=-1), ch('hero', 650, e='shock')])
shot('S61', [ch('ellis', 960, 850, 1.3)],
     pills=[pl(960, 300, '$8,412,009', GOLD, s=1.6, glow=True)])
shot('S62', kind='macro', macro={'n': '$8,412,009', 'outline': GOLD, 'glow': True, 's': 2.2})
shot('S63', [ch('hero', 900, e='worried')])
shot('S64', [ch('hero', e='worried')])
# Beat 4 — the science ($75,000 and giving)
# ------------------------------------------------------------
shot('S65', [ch('hero', 960, 800, 0.7)], banner='THE SCIENCE')
shot('S66', [], art='head-outline', redLabel="THAT'S THE MADE-UP PART")
shot('S67', [], banner='MONEY AND HAPPINESS?',
     pills=[pl(760, 450, '$12,400', GREEN, s=1.0),
            pl(1160, 450, '$8,412,009', GOLD, s=0.9, glow=True)])
shot('S68', kind='textcard', textLines=['KAHNEMAN & DEATON', '2010'],
     art='heads-tiny')
shot('S69', [], art='graph-climb')
shot('S70', kind='macro',
     macro={'n': '$75,000', 'outline': GOLD, 'glow': True, 's': 2.4, 'curve': True})
shot('S71', [], art='graph-flat', redLabel='THEN IT STOPS',
     pills=[pl(960, 400, '$75,000', GOLD, s=1.2, glow=True)])
shot('S72', [], art='coins-flat')
shot('S73', [], art='smiley-flat',
     pills=[pl(960, 400, '$75,000', GOLD, s=1.3, glow=True,
               grow={'base': 75000, 'rate': 137})])
shot('S74', kind='textcard', textLines=['DUNN, AKNIN & NORTON', '2008'],
     art='hands-two')
shot('S75', [], art='hands-split')
shot('S76', [], banner='SPEND IT ON SOMEONE ELSE', art='hands-give')
shot('S77', kind='macro',
     macro={'lines': ['SPENDING ON OTHERS', '= HAPPIER'], 'outline': GOLD})
shot('S78', [], banner='TWO THINGS',
     pills=[pl(760, 450, '$75,000', GOLD, s=1.0, glow=True),
            pl(1160, 450, '$8,412,009', GOLD, s=0.8, glow=True)])
shot('S79', [], banner='MONEY HELPS, UP TO A POINT', art='line-75k',
     pills=[pl(960, 350, '$75,000', GREEN, s=1.1)])
shot('S80', [], banner='GIVING FEELS BETTER', art='coins-flow')
shot('S81', [], art='heads-row', redLabel='THEY ONLY SHOW THE MONEY')
shot('S82', [], art='blank-head',
     pills=[pl(960, 380, '$75,000', GOLD, s=1.8, glow=True,
               grow={'base': 75000, 'rate': 200})])

# Beat 5 — the cost (Derek's $0.00, out loud)
# ------------------------------------------------------------
shot('S83', [ch('hero', 700)] + crowd(
    [(400, 'kid1', '$12,400'), (1000, 'kid2', '$312'), (1300, 'kid3', '$86,000'),
     (1600, 'kid1', '$40')]), banner='THE COST')
shot('S84', [ch('hero', e='smug')],
     pills=[pl(1400, 300, '$0.00', RED, s=0.9, dim=True)])
shot('S85', [ch('hero', exprs=[[0, 'smug'], [30, 'worried']])])
shot('S86', [ch('derek', 1000, pill='$0.00'), ch('kid1', 700, e='happy'),
             ch('kid2', 1400, e='happy'), ch('hero', 400, s=0.9)])
shot('S87', [ch('hero', 500), ch('derek', 1000, pill='$0.00'),
             ch('sam', 1300), ch('maya', 1600)])
shot('S88', [ch('hero', e='shock')])
shot('S89', [ch('derek', 960, 950, 1.5, e='shock')],
     pills=[pl(960, 380, '$0.00', RED, s=2.4, pulse=True)])
shot('S90', [ch('derek', 1000, e='worried', pill='$0.00'),
             ch('kid1', 650, e='happy'), ch('kid2', 1350, e='happy'),
             ch('hero', 400, s=0.9, e='worried')])
shot('S91', [ch('derek', e='worried', pill='$0.00', walk=True)])
shot('S92', [ch('sam', 850, e='shock'), ch('hero', 1200, e='worried')])
shot('S93', [ch('sam', 900), ch('hero', 1250, e='worried')])
shot('S94', [ch('hero', exprs=[[0, 'smug'], [25, 'worried']])])
shot('S95', [ch('hero', e='worried')],
     pills=[pl(1400, 300, '$0.00', RED, s=0.8, dim=True)])
shot('S96', [ch('hero', 900), ch('kid3', 1400, s=0.9, pill='<$100')])
shot('S97', [ch('hero', 850), ch('sam', 1200, pill='$210.00'),
             ch('kid3', 1500, s=0.9, pill='<$100')])
shot('S98', [ch('hero', e='happy'), ch('sam', 1300, e='oops')])
shot('S99', [ch('hero', 960)] + crowd(
    [(450, 'kid1', '$12,400'), (1400, 'kid2', '$312')]))
shot('S100', [ch('hero')], tag={'x': 1300, 'y': 350, 'text': '$'})
shot('S101', [ch('hero', 800), ch('maya', 1200, pill='$312')])
shot('S102', [ch('hero', e='worried')],
     pills=[pl(1350, 300, '$312', ORANGE, s=0.9)])
shot('S103', [ch('hero', 700, e='happy')] + crowd(
    [(400, 'kid1', '$12,400'), (1000, 'kid3', '$86,000'),
     (1400, 'kid2', '$312'), (1600, 'kid1', '$0.00')]))
shot('S104', [ch('hero', exprs=[[0, 'happy'], [25, 'worried']])])
# Beat 6 — the mirror (you can't see your own)
# ------------------------------------------------------------
shot('S105', [ch('hero', 640)], redLabel='STILL NOTHING')
shot('S106', [ch('hero', e='worried')])
shot('S107', [ch('hero', 850, walk=True), ch('sam', 1200, walk=True, pill='$210.00')])
shot('S108', [ch('sam', 900, pill='$210.00'), ch('hero', 1250, e='worried')])
shot('S109', [ch('hero', e='shock')])
shot('S110', [ch('hero', e='worried')],
     pills=[pl(450, 300, '$12,400', GREEN, s=0.8, dim=True),
            pl(1500, 320, '$312', ORANGE, s=0.8, dim=True)])
shot('S111', [ch('hero', e='shock')])
shot('S112', [ch('hero', e='worried')])
shot('S113', [ch('hale', 1000, pill='$12,400'), ch('hero', 650)],
     prop='cart', propAt=[1350, 780], mugs=[[1330, 700]])
shot('S114', [ch('maya', 900, pill='$312'), ch('kid1', 1250, e='happy')],
     prop='fries', propAt=[1050, 720])
shot('S115', [ch('derek', e='tired', pill='$0.00')])
shot('S116', [ch('hero')],
     pills=[pl(450, 300, '$12,400', GREEN, s=0.8, dim=True),
            pl(1500, 320, '$0.00', RED, s=0.8, dim=True)])
shot('S117', [], banner='YOU DECIDED THEY MEANT WORTH', art='pillheart')
# Beat 7 — the twist (Mr. Ellis, $8,412,009)
# ------------------------------------------------------------
shot('S118', [ch('hero', 700, walk=True)])
shot('S119', [ch('ellis', 1100, f=-1, pill='$8,412,009', s=0.9),
              ch('hero', 600)])
shot('S120', [], prop='mop', propAt=[960, 700], propS=1.2)
shot('S121', [ch('ellis', 960, 980, 1.5)],
     pills=[pl(960, 360, '$8,412,009', GOLD, s=2.2, glow=True)], pushIn=True)
shot('S122', [ch('hero', 800, e='shock'),
              ch('ellis', 1250, pill='$8,412,009')])
shot('S123', [ch('hero', e='happy')])
shot('S124', [ch('ellis', 1000, pill='$8,412,009')],
     prop='cart', propAt=[1300, 780], mugs=[[1280, 700]])
shot('S125', [ch('ellis', e='happy', pill='$8,412,009')],
     mugs=[[1150, 700]])
shot('S126', [ch('hero', 800), ch('ellis', 1200, pill='$8,412,009')])
shot('S127', [ch('ellis', e='happy', pill='$8,412,009')])
shot('S128', [ch('ellis', 900, e='happy', pill='$8,412,009'), ch('hero', 1250)],
     banner="WHAT THE NUMBER DOESN'T SAY")
shot('S129', [], prop='photo', propAt=[960, 520],
     pills=[pl(1400, 300, '$8,412,009', GOLD, s=0.8, glow=True)])
shot('S130', [], prop='photo', propAt=[960, 500], propS=1.2,
     pills=[pl(1400, 280, '$8,412,009', GOLD, s=0.8, glow=True)])
shot('S131', kind='savings')
shot('S132', [ch('ellis', pill='$8,412,009', walk=True)])
shot('S133', [ch('derek', e='worried', pill='$0.00')],
     prop='shoes', propAt=[1150, 900])
shot('S134', [], prop='wallet', propAt=[960, 680],
     pills=[pl(960, 300, '$0.00', RED, s=1.2, pulse=True)])
shot('S135', [], prop='shopshoes', propAt=[960, 700],
     pills=[pl(960, 300, '$0.00', RED, s=1.0, pulse=True)])
shot('S136', [ch('hero', e='happy')])
shot('S137', [ch('hero', 800), ch('ellis', 1200, pill='$8,412,009')])

# Beat 8 — the moral (the number never measures worth)
# ------------------------------------------------------------
shot('S138', [ch('hero', 700)] + crowd(
    [(400, 'kid1', '$12,400'), (1000, 'kid2', '$312'), (1300, 'kid3', '$86,000'),
     (1600, 'kid1', '$40')]))
shot('S139', [ch('hero', e='happy')])
shot('S140', [ch('hero', 850, e='happy'), ch('maya', 1200, e='happy', pill='$312')],
     prop='fries', propAt=[1000, 720])
shot('S141', [ch('hero', 850), ch('derek', 1200, pill='$0.00')])
shot('S142', [ch('sam', 900, pill='$210.00'), ch('hero', 1250),
              ch('derek', 1500, s=0.9, pill='$0.00')])
shot('S143', [ch('sam', pill='$210.00',
                tick={'values': ['$210.00', '$205.00'], 'step': 12, 'flash': RED})],
     prop='bill', propAt=[1120, 700])
shot('S144', [ch('sam', 900, e='happy'), ch('derek', 1250, e='shock')],
     prop='bill', propAt=[1050, 700])
shot('S145', [ch('sam', e='happy'), ch('derek', 1350, e='shock')],
     prop='bill', propAt=[960, 620])
shot('S146', [ch('derek', 1000, e='happy'), ch('sam', 700, e='happy'),
              ch('hero', 1400)])
shot('S147', [ch('sam', e='happy', pill='$205.00')],
     prop='shoefive', propAt=[1150, 880])
shot('S148', [ch('hero', 800, walk=True),
              ch('ellis', 1250, pill='$8,412,009')])
shot('S149', [ch('ellis', 960, 950, 1.4)],
     pills=[pl(960, 350, '$8,412,009', GOLD, s=1.6, glow=True)])
shot('S150', kind='macro',
     macro={'n': '$8,412,009', 'outline': GOLD, 'glow': True, 's': 2.2,
            'lines': ['EIGHT MILLION, FOUR HUNDRED AND TWELVE THOUSAND,',
                      'AND NINE DOLLARS']})
shot('S151', [ch('hero', e='happy')])
shot('S152', [ch('hero', 800, armR={'a': -120, 'b': -10}),
              ch('ellis', 1200, pill='$8,412,009', armR={'a': -120, 'b': -10})])
shot('S153', [ch('ellis', e='happy', pill='$8,412,009')])
shot('S154', [ch('hero', e='happy')])
shot('S155', [ch('hero')],
     banner='THE NUMBER NEVER MEASURES WHAT A PERSON IS WORTH')
shot('S156', [ch('hero', 960)] + crowd(
    [(450, 'kid1', '$12,400'), (1400, 'kid2', '$312')]))
shot('S157', [ch('hero', 960, 760, 1.0)],
     title=['IF YOU COULD SEE ONE NUMBER,', 'WHAT WOULD YOU WANT IT TO BE?'],
     titleSize=64, titleY=200)
shot('S158', [ch('hero', 960, 760, 1.0)],
     title=['TELL US IN THE', 'COMMENTS'], titleSize=110, titleY=220)

# ------------------------------------------------------------ validation
assert set(SPECS) == set(IDS), f'missing shots: {set(IDS) - set(SPECS)}'
for id, sp in SPECS.items():
    assert sp['set'] in ('classroom', 'stairwell', 'bathroom', 'kitchen', 'study',
                         'rooftop', 'schematic', 'void'), f'{id} bad set {sp["set"]}'
    for c in sp['chars']:
        assert not (c['look'] == 'hero' and c.get('pill')), f'{id}: pill above the hero!'

HEAD = r'''import React from 'react';
import {
  Hero, poseAt, kf, easeOut, faceAt, clamp, FONT, Look, Expr,
  Study, Rooftop, TitleCard, camT, ShotProps,
  Kitchen, KitchenIsland, Classroom, Stairwell, Bathroom, Schematic,
  NightSky, Stars, Mug, Phone,
} from '../../engine';

/* MoneyCount — 'What If You Could See How Much Money Everyone Has?' (158 shots).
   Data-driven: one SPECS table + one generic renderer (death-count-full pattern).
   The balance pill: small dark pill, coloured outline, white bold $ text, tiny
   downward pointer, ~1/6 head diameter above the head. NEVER above the hero's
   own head (not in mirrors either). Camera STATIC inside shots; the ONE slow
   push-in is S121, the gold $8,412,009 reveal. grain: false in index.tsx. */

const BLACK = '#0D0D12';
const GREEN = '#3ED598';
const ORANGE = '#FF8A3D';
const RED = '#FF3344';
const GOLD = '#FFC845';
const WHITE = '#F6EFE3';

const mkLook = (jacket: string, shade: string, accent: string, extra?: Look['extra'], shoe = '#3A3446'): Look => ({
  skin: BLACK, skinShade: '#141419', hand: '#26232F', jacket, jacketShade: shade,
  accent, limb: '#26232F', line: '#121019', shoe, face: '#FFFFFF', hair: BLACK, extra,
});

/* Black round heads, white dot eyes, thin stick limbs, flat coloured tops. */
const HERO: Look = mkLook('#2E6FF0', '#2458C4', '#F2B33D', 'hood', '#1E4FB0');
const SAM: Look = mkLook('#E8722A', '#C25E20', '#FFC845');
const HALE: Look = mkLook('#7A5A8A', '#62466E', '#E9C46A', 'bob');
const MAYA: Look = mkLook('#3E8C86', '#2F6E69', '#F28C6A', 'bunches');
const DEREK: Look = mkLook('#A8323E', '#8A2832', '#FFC845');
const ELLIS: Look = mkLook('#6B7A5A', '#55614A', '#E9C46A');
const PARK: Look = mkLook('#D97A8C', '#B85F70', '#F6EFE3', 'bob');
const GRANT: Look = mkLook('#2B2F3A', '#20232C', '#A8323E', 'suit', '#14151A');
const MOM: Look = mkLook('#8A5A6A', '#704858', '#E9C46A', 'bob');
const KID1: Look = mkLook('#5E6E46', '#4C5A38', '#E9C46A');
const KID2: Look = mkLook('#6A5A8A', '#52446E', '#E9C46A');
const KID3: Look = mkLook('#B08A2E', '#8F7024', '#F6EFE3');

const LOOKMAP: Record<string, Look> = {
  hero: HERO, sam: SAM, hale: HALE, maya: MAYA, derek: DEREK, ellis: ELLIS,
  park: PARK, grant: GRANT, mom: MOM, kid1: KID1, kid2: KID2, kid3: KID3,
};

type TickSpec = { values: string[]; step: number; flash?: string };
type GrowSpec = { base: number; rate: number };
type CharSpec = {
  look: string; x: number; y: number; scale: number; facing?: 1 | -1; expr?: Expr;
  exprs?: [number, Expr][]; pill?: string; outline?: string; pulse?: boolean; glow?: boolean;
  tick?: TickSpec; grow?: GrowSpec; walk?: boolean;
  armR?: { a: number; b: number }; armL?: { a: number; b: number };
};
type PillSpec = {
  x: number; y: number; n: string; outline: string; s?: number;
  pulse?: boolean; glow?: boolean; dim?: boolean; tick?: TickSpec; grow?: GrowSpec;
};
type Spec = {
  kind: string; set: string; size: string; zoom: number; cx: number; cy: number;
  chars: CharSpec[]; pills: PillSpec[]; seed: number;
  banner?: string; redLabel?: string; title?: [string, string]; accent?: string;
  titleSize?: number; titleY?: number;
  macro?: { n?: string; lines?: string[]; outline: string; s?: number; curve?: boolean; glow?: boolean };
  textLines?: string[]; art?: string; prop?: string; propAt?: [number, number]; propS?: number;
  mugs?: [number, number][]; fries?: [number, number][]; bill?: [number, number];
  phone?: [number, number];
  pop?: { x: number; y: number; n: string; color: string; from?: number; s?: number };
  tag?: { x: number; y: number; text: string };
  pushIn?: boolean; island?: boolean; night?: boolean; veil?: number;
};

/* The balance pill. `tick` steps through values (flashing `flash` on each move);
   `grow` counts a number up from `base`. `glow` is the gold Ellis halo. */
const Count: React.FC<{ x: number; y: number; n: string; t: number; outline: string; pulse?: boolean; glow?: boolean; s?: number; tick?: TickSpec; grow?: GrowSpec; dim?: boolean }> = ({
  x, y, n, t, outline, pulse = false, glow = false, s = 1, tick, grow, dim = false,
}) => {
  let label = n;
  let stroke = outline;
  if (tick) {
    const idx = Math.min(tick.values.length - 1, Math.floor(t / tick.step));
    label = tick.values[idx];
    if (idx > 0 && tick.flash && t - idx * tick.step < 8) stroke = tick.flash;
  }
  if (grow) label = '$' + (grow.base + Math.floor(t * grow.rate)).toLocaleString('en-US');
  const w = 36 + label.length * 20;
  const o = (pulse ? 0.75 + 0.25 * Math.sin(t / 4) : 1) * (dim ? 0.45 : 1);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      {glow ? <rect x={-w / 2 - 16} y={-40} width={w + 32} height={80} rx={40} fill={outline} opacity={0.22} /> : null}
      <rect x={-w / 2} y={-24} width={w} height={48} rx={24} fill="#0E0C1E" stroke={stroke} strokeWidth={3} />
      <polygon points="-10,20 10,20 0,34" fill="#0E0C1E" stroke={stroke} strokeWidth={3} strokeLinejoin="round" />
      <text x={0} y={11} fontFamily={FONT.title} fontWeight={700} fontSize={30} fill="#FFFFFF" textAnchor="middle">
        {label}
      </text>
    </g>
  );
};

/** Where a pill sits above a character's head: pointer tip ~1/6 head diameter above the head top. */
const above = (p: { x: number; y: number; scale: number }) => ({ x: p.x, y: p.y - 295 * p.scale });

/** Small pop pill, e.g. "+$4" / "-$2" — money moving. */
const PopPill: React.FC<{ x: number; y: number; n: string; t: number; from: number; color: string; s?: number }> = ({
  x, y, n, t, from, color, s = 1,
}) => {
  const k = Math.min(1, Math.max(0, (t - from) / 6));
  if (k <= 0) return null;
  const w = 30 + n.length * 18;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * (0.6 + 0.4 * k)})`} opacity={k}>
      <rect x={-w / 2} y={-20} width={w} height={40} rx={20} fill="#0E0C1E" stroke={color} strokeWidth={3} />
      <text x={0} y={9} fontFamily={FONT.title} fontWeight={700} fontSize={24} fill="#FFFFFF" textAnchor="middle">
        {n}
      </text>
    </g>
  );
};

/** Yellow ALL-CAPS banner, top-centre — the genre's beat label. Pops on at t=2. */
const Banner: React.FC<{ text: string; y?: number; t: number }> = ({ text, y = 130, t }) => {
  const k = Math.min(1, Math.max(0, (t - 2) / 8));
  if (k <= 0) return null;
  const w = text.length * 26 + 60;
  return (
    <g transform={`translate(960 ${y}) scale(${0.7 + 0.3 * k})`} opacity={k}>
      <rect x={-w / 2} y={-32} width={w} height={64} rx={10} fill="#FFD23F" />
      <text x={0} y={13} fontFamily={FONT.title} fontWeight={700} fontSize={38} fill="#14101E" textAnchor="middle" letterSpacing={2}>
        {text}
      </text>
    </g>
  );
};

/** Small red label for warnings, e.g. NOTHING ABOVE YOUR HEAD. */
const RedLabel: React.FC<{ text: string; y?: number; t: number; from?: number }> = ({ text, y = 130, t, from = 2 }) => {
  const k = Math.min(1, Math.max(0, (t - from) / 8));
  if (k <= 0) return null;
  return (
    <g transform={`translate(960 ${y})`} opacity={k}>
      <text fontFamily={FONT.title} fontWeight={700} fontSize={34} fill={RED} textAnchor="middle" letterSpacing={6}>
        {text}
      </text>
    </g>
  );
};

/** A small price-tag pop — the hero pricing a stranger (S100). */
const PriceTag: React.FC<{ x: number; y: number; text: string; t: number }> = ({ x, y, text, t }) => {
  const k = Math.min(1, Math.max(0, (t - 8) / 6));
  if (k <= 0) return null;
  return (
    <g transform={`translate(${x} ${y}) rotate(-12) scale(${0.6 + 0.4 * k})`} opacity={k}>
      <path d="M -50 -24 L 30 -24 L 56 0 L 30 24 L -50 24 Z" fill="#FFD23F" stroke="#14101E" strokeWidth={3} />
      <circle cx={36} cy={0} r={6} fill="#14101E" />
      <text x={-8} y={9} fontFamily={FONT.title} fontWeight={700} fontSize={26} fill="#14101E" textAnchor="middle">
        {text}
      </text>
    </g>
  );
};

/* ------------------------- small hand-drawn props ------------------------- */
const Fries: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={-30 + i * 14} y={-64 - (i % 2) * 10} width={10} height={56} rx={3} fill="#FFD23F" stroke="#D9A41F" strokeWidth={2} />)}
    <path d="M -40 -20 L 40 -20 L 32 40 L -32 40 Z" fill="#D9534F" stroke="#8A2832" strokeWidth={3} />
  </g>
);

const Bill5: React.FC<{ x: number; y: number; rot?: number }> = ({ x, y, rot = -8 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-70} y={-35} width={140} height={70} rx={6} fill="#7AB648" stroke="#4C7A2E" strokeWidth={3} />
    <circle cx={0} cy={0} r={20} fill="#E9F2D2" />
    <text x={0} y={8} fontFamily={FONT.title} fontWeight={700} fontSize={26} fill="#4C7A2E" textAnchor="middle">5</text>
  </g>
);

const Notebook: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-150} y={-100} width={300} height={200} rx={10} fill="#E9E2D2" />
    <rect x={-140} y={-90} width={134} height={180} rx={6} fill="#F6F1E6" />
    <rect x={6} y={-90} width={134} height={180} rx={6} fill="#F6F1E6" />
    <path d="M -100 -40 Q -60 -70 -20 -30 Q 20 -60 60 -20" stroke="#3E8C86" strokeWidth={5} fill="none" strokeLinecap="round" />
    <circle cx={60} cy={40} r={22} fill="none" stroke="#FF8A3D" strokeWidth={4} />
  </g>
);

const ShoeFive: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <g transform="rotate(-12)"><Bill5 x={0} y={-34} rot={0} /></g>
    <path d="M -70 0 L 60 0 Q 90 0 90 26 L 90 40 L -80 40 Q -90 40 -90 20 Z" fill="#A8323E" stroke="#121019" strokeWidth={4} />
    <rect x={-90} y={40} width={180} height={12} rx={6} fill="#F6EFE3" />
  </g>
);

/** Ellis's mop, bucket and worn shoes — forty years of the same motion (S120). */
const Mop: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -90 60 L 90 60 L 70 150 L -70 150 Z" fill="#5A6E8A" stroke="#2A3446" strokeWidth={4} />
    <ellipse cx={0} cy={60} rx={90} ry={16} fill="#7A94B8" />
    <line x1={60} y1={-160} x2={-40} y2={140} stroke="#8A6A3A" strokeWidth={12} strokeLinecap="round" />
    <path d="M -70 130 L -10 130 L -20 180 L -60 180 Z" fill="#C9C2B2" stroke="#8A8474" strokeWidth={3} />
    <path d="M -190 190 L -110 190 Q -90 190 -90 210 L -90 222 L -200 222 Q -210 222 -210 206 Z" fill="#3A3446" stroke="#121019" strokeWidth={4} />
    <path d="M 110 190 L 190 190 Q 210 190 210 210 L 210 222 L 100 222 Q 90 222 90 206 Z" fill="#3A3446" stroke="#121019" strokeWidth={4} />
  </g>
);

/** Derek's empty wallet, receipts spilling (S134). */
const Wallet: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-150} y={-70} width={300} height={150} rx={18} fill="#5A3A2E" stroke="#2A1A14" strokeWidth={4} />
    <rect x={-150} y={-70} width={300} height={50} rx={18} fill="#6E4636" />
    <rect x={40} y={-20} width={90} height={60} rx={8} fill="#F6EFE3" />
    <text x={85} y={20} fontFamily={FONT.title} fontWeight={700} fontSize={26} fill="#5A3A2E" textAnchor="middle">$0</text>
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(${-120 + i * 30} ${-140 - i * 18}) rotate(${-8 + i * 8})`}>
        <rect x={-45} y={-60} width={90} height={120} rx={4} fill="#F6F1E6" stroke="#C9C2B2" strokeWidth={2} />
        <rect x={-32} y={-40} width={64} height={8} fill="#8A8474" />
        <rect x={-32} y={-22} width={44} height={6} fill="#B8B2A2" />
      </g>
    ))}
  </g>
);

/** Derek's scuffed new shoes hurrying past a shop window (S135). */
const ShopShoes: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-320} y={-260} width={640} height={300} rx={12} fill="#1E2A44" stroke="#4A4460" strokeWidth={5} />
    <rect x={-300} y={-240} width={280} height={260} fill="#2E3A55" />
    <circle cx={-160} cy={-110} r={50} fill="#FFC27A" opacity={0.5} />
    <rect x={40} y={-240} width={260} height={260} fill="#2E3A55" />
    <rect x={60} y={-180} width={80} height={140} rx={8} fill="#A8323E" opacity={0.8} />
    <path d="M -120 60 L -10 60 Q 20 60 20 90 L 20 110 L -130 110 Q -140 110 -140 90 Z" fill="#A8323E" stroke="#121019" strokeWidth={4} />
    <path d="M 30 60 L 140 60 Q 170 60 170 90 L 170 110 L 20 110 Q 10 110 10 90 Z" fill="#8A2832" stroke="#121019" strokeWidth={4} />
    <rect x={-140} y={110} width={150} height={10} rx={5} fill="#F6EFE3" opacity={0.8} />
    <rect x={10} y={110} width={160} height={10} rx={5} fill="#F6EFE3" opacity={0.8} />
  </g>
);

/** The photograph on Ellis's cart — his mother, young, smiling (S129/S130). */
const Photo: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-160} y={-200} width={320} height={400} rx={10} fill="#F4F1EA" stroke="#8A7FA8" strokeWidth={4} />
    <rect x={-140} y={-180} width={280} height={280} fill="#2A2440" />
    <circle cx={0} cy={-60} r={58} fill="#0D0D12" />
    <circle cx={-20} cy={-64} r={7} fill="#FFFFFF" />
    <circle cx={20} cy={-64} r={7} fill="#FFFFFF" />
    <path d="M -18 -34 Q 0 -26 18 -34" stroke="#FFFFFF" strokeWidth={5} fill="none" strokeLinecap="round" />
    <path d="M -90 100 Q 0 20 90 100 L 90 100 L -90 100 Z" fill="#7A5A8A" />
    <text x={0} y={160} fontFamily={FONT.title} fontWeight={600} fontSize={26} fill="#5A4A3A" textAnchor="middle">MOM, 1968</text>
  </g>
);

/** The snack machine (S47). */
const Machine: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-130} y={-320} width={260} height={560} rx={16} fill="#3A4A6A" stroke="#1E2A44" strokeWidth={5} />
    <rect x={-105} y={-290} width={210} height={300} rx={8} fill="#101A2A" stroke="#4A4460" strokeWidth={3} />
    {[0, 1, 2].map((r) => [0, 1, 2].map((c) => (
      <rect key={`${r}${c}`} x={-90 + c * 70} y={-270 + r * 95} width={52} height={70} rx={6} fill={['#D9534F', '#F2C230', '#3E8C86'][c]} opacity={0.85} />
    )))}
    <rect x={-105} y={60} width={210} height={70} rx={8} fill="#0E0C1E" stroke="#4A4460" strokeWidth={3} />
    <rect x={-40} y={160} width={80} height={50} rx={6} fill="#2A2440" stroke="#FFC845" strokeWidth={3} />
  </g>
);

/** The janitor's cart — Mrs. Hale leaves a coffee on it (S38/S113/S124). */
const Cart: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-140} y={-40} width={280} height={130} rx={12} fill="#5A6E46" stroke="#2A3446" strokeWidth={4} />
    <rect x={-140} y={-40} width={280} height={30} rx={12} fill="#6E8A56" />
    <circle cx={-100} cy={110} r={22} fill="#0E0C1E" stroke="#4A4460" strokeWidth={5} />
    <circle cx={100} cy={110} r={22} fill="#0E0C1E" stroke="#4A4460" strokeWidth={5} />
    <line x1={140} y1={-20} x2={190} y2={-90} stroke="#8A8474" strokeWidth={10} strokeLinecap="round" />
  </g>
);

/** A wallet opening, cash inside, a bank card beside it (S17/S18). */
const WalletCard: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-190} y={-60} width={220} height={140} rx={16} fill="#5A3A2E" stroke="#2A1A14" strokeWidth={4} />
    <rect x={-160} y={-30} width={60} height={40} rx={6} fill="#7AB648" />
    <rect x={60} y={-90} width={190} height={120} rx={12} fill="#2E6FF0" stroke="#1E4FB0" strokeWidth={4} transform="rotate(8 155 -30)" />
    <rect x={80} y={-70} width={60} height={44} rx={6} fill="#FFC845" transform="rotate(8 110 -48)" />
    {[0, 1, 2].map((i) => <circle key={i} cx={-120 + i * 46} cy={-110 - i * 8} r={20} fill="#FFC845" stroke="#D9A41F" strokeWidth={3} />)}
  </g>
);

/** A coin dropping the instant money moves (S21). */
const Coin: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => {
  const dy = kf(t, [[0, -120], [20, 60]]);
  return (
    <g transform={`translate(${x} ${y + dy}) scale(${s})`}>
      <circle r={26} fill="#FFC845" stroke="#D9A41F" strokeWidth={4} />
      <text y={9} fontFamily={FONT.title} fontWeight={700} fontSize={28} fill="#8A6A1A" textAnchor="middle">$</text>
    </g>
  );
};

const CoinStack: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[0, 1, 2, 3, 4].map((i) => <ellipse key={i} cx={0} cy={-i * 16} rx={46 - i * 2} ry={12} fill="#FFC845" stroke="#D9A41F" strokeWidth={3} />)}
  </g>
);

/** Derek's brand-new shoes (S53). */
const Shoes: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -130 0 L -20 0 Q 10 0 10 30 L 10 50 L -140 50 Q -150 50 -150 30 Z" fill="#F6EFE3" stroke="#121019" strokeWidth={4} />
    <path d="M 20 0 L 130 0 Q 160 0 160 30 L 160 50 L 10 50 Q 0 50 0 30 Z" fill="#E9E2D2" stroke="#121019" strokeWidth={4} />
    <rect x={-150} y={50} width={160} height={12} rx={6} fill="#A8323E" />
    <rect x={0} y={50} width={160} height={12} rx={6} fill="#A8323E" />
  </g>
);
'''

HEAD += r'''
/* ------------------------- dark-void infographics ------------------------- */
const HeadDot: React.FC<{ x: number; y: number; r: number; blank?: boolean }> = ({ x, y, r, blank = false }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill={BLACK} stroke="#3A3446" strokeWidth={3} />
    {!blank ? (
      <g>
        <circle cx={x - r * 0.32} cy={y - r * 0.1} r={r * 0.11} fill="#FFFFFF" />
        <circle cx={x + r * 0.32} cy={y - r * 0.1} r={r * 0.11} fill="#FFFFFF" />
        <path d={`M ${x - r * 0.25} ${y + r * 0.35} Q ${x} ${y + r * 0.45} ${x + r * 0.25} ${y + r * 0.35}`} stroke="#FFFFFF" strokeWidth={4} fill="none" strokeLinecap="round" />
      </g>
    ) : null}
  </g>
);

const Hand: React.FC<{ x: number; y: number; rot?: number }> = ({ x, y, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-70} y={-20} width={140} height={60} rx={30} fill="#26232F" stroke="#3A3446" strokeWidth={3} />
    {[0, 1, 2, 3].map((i) => <circle key={i} cx={-48 + i * 32} cy={-28} r={14} fill="#26232F" stroke="#3A3446" strokeWidth={3} />)}
  </g>
);

const Heart: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} opacity={o} d="M 0 28 C -8 12 -30 -2 -48 12 C -66 26 -48 52 0 84 C 48 52 66 26 48 12 C 30 -2 8 12 0 28 Z" fill={RED} />
);

const VoidArt: React.FC<{ art: string; t: number }> = ({ art, t }) => {
  switch (art) {
    case 'head-outline': // S66: a single head outline, no pill above it
      return <HeadDot x={960} y={470} r={130} />;
    case 'graph-climb': // S69: happiness climbs, then flattens
      return (
        <g>
          <path d="M 480 760 L 760 700 L 1040 560 L 1300 400 L 1560 400" stroke={GOLD} strokeWidth={8} fill="none" strokeLinecap="round" />
          <circle cx={480} cy={760} r={12} fill={WHITE} />
          <circle cx={1560} cy={400} r={12} fill={GOLD} />
          <text x={1560} y={320} fontFamily={FONT.title} fontWeight={700} fontSize={110} fill={GOLD} textAnchor="middle">?</text>
        </g>
      );
    case 'graph-flat': // S71: the $75,000 line goes flat
      return <line x1={480} y1={620} x2={1440} y2={620} stroke={GOLD} strokeWidth={8} strokeLinecap="round" />;
    case 'coins-flat': // S72: coins pile higher beside a flat, unmoving smiley
      return (
        <g>
          {[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={700} cy={760 - i * 34} r={30} fill={GOLD} stroke="#D9A41F" strokeWidth={3} />)}
          <circle cx={1250} cy={560} r={110} fill={BLACK} stroke="#3A3446" strokeWidth={4} />
          <circle cx={1210} cy={530} r={10} fill="#FFFFFF" />
          <circle cx={1290} cy={530} r={10} fill="#FFFFFF" />
          <line x1={1210} y1={610} x2={1290} y2={610} stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" />
        </g>
      );
    case 'smiley-flat': // S73: the smiley stays exactly the same
      return (
        <g>
          <circle cx={960} cy={720} r={100} fill={BLACK} stroke="#3A3446" strokeWidth={4} />
          <circle cx={925} cy={690} r={10} fill="#FFFFFF" />
          <circle cx={995} cy={690} r={10} fill="#FFFFFF" />
          <line x1={925} y1={760} x2={995} y2={760} stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" />
        </g>
      );
    case 'blank-head': // S82: the face beneath the spinning pill is blank
      return <HeadDot x={960} y={760} r={120} blank />;
    case 'hands-two': // S74: two hands holding out coins
      return (
        <g>
          <Hand x={700} y={700} rot={-8} />
          <Hand x={1220} y={700} rot={8} />
          {[0, 1, 2].map((i) => <circle key={i} cx={660 + i * 40} cy={620 - (i % 2) * 26} r={22} fill={GOLD} stroke="#D9A41F" strokeWidth={3} />)}
          {[0, 1, 2].map((i) => <circle key={i} cx={1180 + i * 40} cy={620 - (i % 2) * 26} r={22} fill={GOLD} stroke="#D9A41F" strokeWidth={3} />)}
        </g>
      );
    case 'hands-split': // S75: one hand spends on itself, the other holds coins out
      return (
        <g>
          <HeadDot x={700} y={450} r={70} />
          <HeadDot x={1220} y={450} r={70} />
          {[0, 1].map((i) => <circle key={i} cx={660 + i * 50} cy={300} r={24} fill={GOLD} stroke="#D9A41F" strokeWidth={3} />)}
          {[0, 1, 2].map((i) => <circle key={i} cx={1160 + i * 50} cy={300 - (i % 2) * 24} r={24} fill={GOLD} stroke="#D9A41F" strokeWidth={3} />)}
          <Hand x={700} y={700} rot={-8} />
          <Hand x={1220} y={700} rot={8} />
        </g>
      );
    case 'hands-give': // S76: the second hand gives its coins away; that face lights up
      return (
        <g>
          <circle cx={1250} cy={450} r={120} fill={GOLD} opacity={0.18} />
          <HeadDot x={650} y={450} r={70} />
          <HeadDot x={1250} y={450} r={70} />
          <circle cx={kf(t, [[0, 700], [30, 1150]])} cy={320} r={24} fill={GOLD} stroke="#D9A41F" strokeWidth={3} />
          <circle cx={1180} cy={300} r={24} fill={GOLD} stroke="#D9A41F" strokeWidth={3} />
          <Hand x={650} y={700} rot={-8} />
          <Hand x={1250} y={700} rot={8} />
        </g>
      );
    case 'coins-flow': // S80: coins flow from one hand to another
      return (
        <g>
          <Hand x={600} y={700} rot={-8} />
          <Hand x={1320} y={700} rot={8} />
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={i} cx={620 + i * 150} cy={520 - Math.sin((i / 4) * Math.PI) * 90} r={22} fill={GOLD} stroke="#D9A41F" strokeWidth={3} />
          ))}
          <circle cx={kf(t, [[0, 620], [30, 1220]])} cy={430} r={24} fill={GOLD} stroke="#D9A41F" strokeWidth={3} />
          <circle cx={1320} cy={450} r={90} fill={GOLD} opacity={0.12} />
        </g>
      );
    case 'heads-row': // S81: pills above a row of heads, none showing a face
      return (
        <g>
          {[420, 660, 960, 1260, 1500].map((x, i) => (
            <HeadDot key={i} x={x} y={650} r={70} blank />
          ))}
          {([['$12,400', GREEN], ['$312', ORANGE], ['$86,000', GREEN], ['$40', RED], ['$0.00', RED]] as [string, string][]).map(([n, o], i) => (
            <Count key={i} x={[420, 660, 960, 1260, 1500][i]} y={500} n={n} t={t} outline={o} s={0.7} />
          ))}
        </g>
      );
    case 'heads-tiny': // S68: thousands of Americans, as tiny head outlines
      return (
        <g>
          {Array.from({ length: 12 }).map((_, i) => (
            <HeadDot key={i} x={360 + i * 110} y={820} r={26} blank />
          ))}
        </g>
      );
    case 'line-75k': // S79: a green pill climbs to a gold line marked $75,000 and stops
      return (
        <g>
          <line x1={480} y1={620} x2={1440} y2={620} stroke={GOLD} strokeWidth={8} strokeLinecap="round" />
          <text x={960} y={580} fontFamily={FONT.title} fontWeight={700} fontSize={40} fill={GOLD} textAnchor="middle">$75,000</text>
        </g>
      );
    case 'pillheart': { // S117: a pill and a heart side by side; the pill fades, the heart stays
      const fade = 1 - clamp((t - 10) / 20, 0, 1);
      return (
        <g>
          <g opacity={fade}>
            <Count x={700} y={480} n="$8,412,009" t={t} outline={GOLD} glow s={1.0} />
          </g>
          <Heart x={1220} y={420} s={1.2} />
        </g>
      );
    }
    default:
      return null;
  }
};

const Prop: React.FC<{ kind: string; at: [number, number]; s: number; t: number }> = ({ kind, at, s, t }) => {
  const [x, y] = at;
  switch (kind) {
    case 'notebook': return <Notebook x={x} y={y} s={s} />;
    case 'fries': return <Fries x={x} y={y} s={s} />;
    case 'bill': return <Bill5 x={x} y={y} />;
    case 'shoefive': return <ShoeFive x={x} y={y} s={s} />;
    case 'mop': return <Mop x={x} y={y} s={s} />;
    case 'wallet': return <Wallet x={x} y={y} s={s} />;
    case 'shopshoes': return <ShopShoes x={x} y={y} s={s} />;
    case 'photo': return <Photo x={x} y={y} s={s} />;
    case 'machine': return <Machine x={x} y={y} s={s} />;
    case 'cart': return <Cart x={x} y={y} s={s} />;
    case 'walletcard': return <WalletCard x={x} y={y} s={s} />;
    case 'coin': return <Coin x={x} y={y} t={t} s={s} />;
    case 'coinstack': return <CoinStack x={x} y={y} s={s} />;
    case 'shoes': return <Shoes x={x} y={y} s={s} />;
    default: return null;
  }
};

const Back: React.FC<{ spec: Spec; t: number }> = ({ spec, t }) => {
  const n = spec.seed;
  switch (spec.set) {
    case 'kitchen':
      return <Kitchen t={t} id={`k${n}`} veil={spec.veil ?? 0.3} />;
    case 'study':
      return <Study t={t} id={`s${n}`} veil={spec.veil ?? 0.44} night={spec.night ?? false} />;
    case 'classroom':
      return <Classroom t={t} id={`c${n}`} />;
    case 'stairwell':
      return <Stairwell t={t} id={`w${n}`} />;
    case 'rooftop':
      return <Rooftop t={t} sunX={960} sunY={620} cityLit={1} />;
    case 'schematic':
      return <Schematic t={t} id={`sch${n}`} />;
    case 'bathroom':
      return <Bathroom />;
    case 'void':
      return (
        <g>
          <NightSky id={`v${n}`} horizonY={1080} />
          <Stars seed={n} x0={-400} y0={-400} w={2720} h={1480} t={t} n={60} />
        </g>
      );
    default:
      return <rect x={-400} y={-200} width={2720} height={1480} fill="#14101E" />;
  }
};

const Char: React.FC<{ c: CharSpec; t: number; i: number }> = ({ c, t, i }) => {
  const swing = c.walk ? Math.sin(t / 6 + i * 1.7) * 18 : 0;
  const pose = poseAt(t, [
    { f: 0, p: { x: c.x, y: c.y, scale: c.scale, facing: c.facing ?? 1, headTilt: 0, armR: c.armR ?? { a: 18 + swing, b: -10 }, armL: c.armL ?? { a: 10 - swing, b: -8 }, legL: { a: c.walk ? swing : 5, b: 0 }, legR: { a: c.walk ? -swing : -5, b: 0 } } },
    { f: 24, p: { headTilt: (i % 2 ? -1 : 1) * 3, armR: c.armR ?? { a: 34 + swing, b: -8 } }, ease: easeOut },
    { f: 48, p: { headTilt: 0, armR: c.armR ?? { a: 20 + swing, b: -10 } } },
  ]);
  const head = above(pose);
  const faces: [number, Expr][] = c.exprs ?? [[0, c.expr ?? 'neutral']];
  return (
    <>
      <Hero look={LOOKMAP[c.look]} pose={{ ...pose, ...faceAt(t, faces) }} shadow={0} rimId="rimR" />
      {c.pill ? (
        <Count x={head.x} y={head.y} n={c.pill} t={t} outline={c.outline ?? WHITE} pulse={c.pulse} glow={c.glow} tick={c.tick} grow={c.grow} s={c.scale >= 1 ? 1 : 0.9} />
      ) : null}
    </>
  );
};

const Pill: React.FC<{ p: PillSpec; t: number }> = ({ p, t }) => (
  <Count x={p.x} y={p.y} n={p.n} t={t} outline={p.outline} pulse={p.pulse} glow={p.glow} dim={p.dim} tick={p.tick} grow={p.grow} s={p.s ?? 1} />
);

/* CAMERA IS STATIC inside every shot (Ifinite, measured) — except S121, the
   episode's ONE slow push-in on the gold $8,412,009 payoff reveal. */
const GenericShot: React.FC<ShotProps & { spec: Spec }> = ({ t, spec }) => {
  if (spec.kind === 'title') {
    return (
      <g transform={camT(960, 540, 1.0)}>
        <Back spec={spec} t={t} />
        <Count x={960} y={300} n="$40" t={t} outline={WHITE} glow s={1.1} />
        <TitleCard t={t} lines={spec.title ?? ['', '']} accent={spec.accent} y={430} size={100} />
      </g>
    );
  }
  if (spec.kind === 'macro') {
    const m = spec.macro ?? { outline: GOLD };
    const bg = spec.set === 'void' ? <Back spec={spec} t={t} /> : <g filter="url(#blur16)"><Back spec={spec} t={t} /></g>;
    return (
      <g transform={camT(960, 540, 1.0)}>
        {bg}
        {m.n ? <Count x={960} y={440} n={m.n} t={t} outline={m.outline} glow={m.glow} s={m.s ?? 2.2} /> : null}
        {m.lines ? m.lines.map((ln, i) => (
          <text key={i} x={960} y={m.n ? 720 + i * 80 : 420 + i * 90} fontFamily={FONT.title} fontWeight={700} fontSize={m.n ? 44 : 72} fill={GOLD} textAnchor="middle" style={{ filter: 'drop-shadow(0 0 18px rgba(255,200,69,0.6))' }}>
            {ln}
          </text>
        )) : null}
        {m.curve ? <path d="M 560 780 Q 760 720 960 680 T 1360 630" stroke={GOLD} strokeWidth={6} fill="none" strokeLinecap="round" /> : null}
      </g>
    );
  }
  if (spec.kind === 'textcard') {
    return (
      <g transform={camT(960, 540, 1.0)}>
        <Back spec={spec} t={t} />
        {spec.textLines?.map((ln, i) => (
          <text key={i} x={960} y={430 + i * 100} fontFamily={FONT.title} fontWeight={700} fontSize={i === 0 ? 76 : 64} fill={i === 0 ? WHITE : GOLD} textAnchor="middle" letterSpacing={4}>
            {ln}
          </text>
        ))}
        {spec.art ? <VoidArt art={spec.art} t={t} /> : null}
      </g>
    );
  }
  if (spec.kind === 'savings') {
    return (
      <g transform={camT(960, 540, 1.0)}>
        <Back spec={spec} t={t} />
        <path d="M 420 820 L 700 780 L 960 700 L 1220 560 L 1500 340" stroke={GOLD} strokeWidth={8} fill="none" strokeLinecap="round" />
        <circle cx={1500} cy={340} r={14} fill={GOLD} />
        <text x={1500} y={280} fontFamily={FONT.title} fontWeight={700} fontSize={52} fill={GOLD} textAnchor="middle">$8,412,009</text>
        <text x={960} y={950} fontFamily={FONT.title} fontWeight={600} fontSize={36} fill={WHITE} textAnchor="middle" letterSpacing={4}>FORTY YEARS OF SAVING</text>
      </g>
    );
  }
  const z = spec.pushIn ? kf(t, [[0, spec.zoom], [60, spec.zoom * 1.12]], easeOut) : spec.zoom;
  const blurBg = spec.set !== 'void' && (spec.size === 'close-up' || spec.size === 'extreme close-up');
  return (
    <g transform={camT(spec.cx, spec.cy, z)}>
      {blurBg ? <g filter="url(#blur16)"><Back spec={spec} t={t} /></g> : <Back spec={spec} t={t} />}
      {spec.art ? <VoidArt art={spec.art} t={t} /> : null}
      {spec.prop ? <Prop kind={spec.prop} at={spec.propAt ?? [960, 750]} s={spec.propS ?? 1} t={t} /> : null}
      {spec.chars.map((c, i) => <Char key={i} c={c} t={t} i={i} />)}
      {spec.set === 'kitchen' && spec.island ? <KitchenIsland /> : null}
      {spec.mugs?.map(([x, y], i) => <Mug key={i} x={x} y={y} rot={0} f={t} />)}
      {spec.fries?.map(([x, y], i) => <Fries key={i} x={x} y={y} />)}
      {spec.bill ? <Bill5 x={spec.bill[0]} y={spec.bill[1]} /> : null}
      {spec.phone ? <Phone x={spec.phone[0]} y={spec.phone[1]} w={170} on={1} f={t} /> : null}
      {spec.pills.map((p, i) => <Pill key={i} p={p} t={t} />)}
      {spec.pop ? <PopPill x={spec.pop.x} y={spec.pop.y} n={spec.pop.n} t={t} from={spec.pop.from ?? 8} color={spec.pop.color} s={spec.pop.s ?? 1} /> : null}
      {spec.tag ? <PriceTag x={spec.tag.x} y={spec.tag.y} text={spec.tag.text} t={t} /> : null}
      {spec.banner ? <Banner text={spec.banner} t={t} /> : null}
      {spec.redLabel ? <RedLabel text={spec.redLabel} t={t} /> : null}
      {spec.title ? <TitleCard t={t} lines={spec.title} accent={spec.accent} y={spec.titleY ?? 200} size={spec.titleSize ?? 72} /> : null}
    </g>
  );
};

'''

# ------------------------------------------------------------ emit
def clean_note(n):
    n = ' '.join(n.split())[:110].replace('*/', '')
    return n


specs_json = json.dumps(SPECS, indent=1)
exports = []
for id in IDS:
    exports.append(
        f"// ---------- {id}: {SIZES[id]} · {SETS[id]} — {clean_note(NOTES[id])}\n"
        f"export const {id}: React.FC<ShotProps> = (p) => <GenericShot {{...p}} spec={{SPECS.{id}}} />;"
    )

(EP / 'shots.tsx').write_text(
    HEAD + 'const SPECS: Record<string, Spec> = ' + specs_json + ';\n\n'
    + '\n'.join(exports) + '\n'
)

names = ', '.join(IDS)
index = f"""import React from 'react';
import {{ defineEpisode, Timeline }} from '../../engine';
import timeline from './timeline.json';
import {{ {names} }} from './shots';

// 'What If You Could See How Much Money Everyone Has?' — full 8-min episode.
// grain: false — the per-frame epGrain feTurbulence filter is removed for
// this episode only (prime suspect in the GitHub render race that tiled
// ~1 in 13 frames in the last two videos). The shared engine is untouched.
export const moneyCount = defineEpisode('MoneyCount', {{
  timeline: timeline as Timeline,
  shots: {{ {names} }},
  grain: false,
}});
"""
(EP / 'index.tsx').write_text(index)
print(f'wrote shots.tsx ({len(SPECS)} shots) and index.tsx')
