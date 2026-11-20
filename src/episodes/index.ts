// The registry: add each new episode here (one import, one entry).
import { rewind } from './rewind';
import { copyPaste } from './copy-paste';
import { sleep } from './sleep';
import { deathCount } from './death-count';
import { deathCountFull } from './death-count-full';
import { deathCountV2 } from './death-count-v2';
import { deathCount2Min } from './death-count-2min';
import { setsTest } from './sets-test';

export const EPISODES = [rewind, copyPaste, sleep, deathCount, deathCountFull, deathCountV2, deathCount2Min, setsTest];
