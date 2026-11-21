// The registry: add each new episode here (one import, one entry).
import { rewind } from './rewind';
import { copyPaste } from './copy-paste';
import { sleep } from './sleep';
import { deathCount } from './death-count';
import { deathCountFull } from './death-count-full';
import { deathCountV2 } from './death-count-v2';
import { deathCount2Min } from './death-count-2min';
import { deathCount30sNew } from './death-count-30s-new';
import { moneyCount30s } from './money-count-30s';
import { moneyCount30sV2 } from './money-count-30s-v2';
import { moneyCount } from './money-count';
import { setsTest } from './sets-test';
import { readThoughts } from './read-thoughts';
import { readThoughts40s } from './read-thoughts-40s';

export const EPISODES = [rewind, copyPaste, sleep, deathCount, deathCountFull, deathCountV2, deathCount2Min, deathCount30sNew, moneyCount30s, moneyCount30sV2, moneyCount, setsTest, readThoughts, readThoughts40s];
