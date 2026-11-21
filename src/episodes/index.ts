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
import { readThoughts40sV2 } from './read-thoughts-40s-v2';
import { pastLives1Min } from './past-lives-1min';
import { pastLives1minV2 } from './past-lives-1min-v2';
import { pastLives1minV3 } from './past-lives-1min-v3';
import { pastLives1minV4 } from './past-lives-1min-v4';
import { allergies40s } from './allergies-40s';
import { allergiesFirst2min } from './allergies-first-2min';
import { allergies2minMuse } from './allergies-2min-muse';

export const EPISODES = [rewind, copyPaste, sleep, deathCount, deathCountFull, deathCountV2, deathCount2Min, deathCount30sNew, moneyCount30s, moneyCount30sV2, moneyCount, setsTest, readThoughts, readThoughts40s, readThoughts40sV2, pastLives1Min, pastLives1minV2, pastLives1minV3, pastLives1minV4, allergies40s, allergiesFirst2min, allergies2minMuse];
