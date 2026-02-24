import type { GameState, GameAction, Stats } from './types';
import { hashSeed, nextRandom, randInt, weightedChoice } from './rng';
import { events } from './events';
import { actions } from './actions';

/* ─── Helpers ─── */

function clampStat(val: number): number {
    return Math.max(0, Math.min(100, Math.round(val)));
}

function applyEffects(
    stats: Stats,
    cash: number,
    effects: Partial<Stats> & { cash?: number }
): { stats: Stats; cash: number } {
    return {
        stats: {
            health: clampStat(stats.health + (effects.health ?? 0)),
            happiness: clampStat(stats.happiness + (effects.happiness ?? 0)),
            smarts: clampStat(stats.smarts + (effects.smarts ?? 0)),
            looks: clampStat(stats.looks + (effects.looks ?? 0)),
            karma: clampStat(stats.karma + (effects.karma ?? 0)),
        },
        cash: cash + (effects.cash ?? 0),
    };
}

function eligibleEvents(age: number, stats: Stats) {
    return events.filter((e) => {
        if (age < e.minAge || age > e.maxAge) return false;
        if (e.conditions?.minStat) {
            for (const [k, v] of Object.entries(e.conditions.minStat)) {
                if (stats[k as keyof Stats] < v!) return false;
            }
        }
        if (e.conditions?.maxStat) {
            for (const [k, v] of Object.entries(e.conditions.maxStat)) {
                if (stats[k as keyof Stats] > v!) return false;
            }
        }
        return true;
    });
}

function pickEvents(
    rngState: number,
    age: number,
    stats: Stats
): { picked: typeof events; rngState: number } {
    const pool = eligibleEvents(age, stats);
    if (pool.length === 0) return { picked: [], rngState };

    const [count, next1] = randInt(rngState, 1, 2);
    let st = next1;
    const picked: typeof events = [];

    for (let i = 0; i < count && pool.length > 0; i++) {
        const [ev, next] = weightedChoice(st, pool);
        st = next;
        picked.push(ev);
        const idx = pool.indexOf(ev);
        if (idx >= 0) pool.splice(idx, 1);
    }

    return { picked, rngState: st };
}

function yearlyDrift(
    stats: Stats,
    age: number,
    rngState: number
): { stats: Stats; rngState: number } {
    let st = rngState;
    const drift = { ...stats };

    if (age > 40) {
        const [d, n] = randInt(st, 1, 3);
        st = n;
        drift.health = clampStat(drift.health - d);
    }
    if (age > 60) {
        const [d, n] = randInt(st, 1, 4);
        st = n;
        drift.health = clampStat(drift.health - d);
    }

    const statKeys: (keyof Stats)[] = ['happiness', 'smarts', 'looks', 'karma'];
    for (const key of statKeys) {
        const [r, n] = randInt(st, -2, 2);
        st = n;
        drift[key] = clampStat(drift[key] + r);
    }

    if (age > 50) {
        const [d, n] = randInt(st, 0, 2);
        st = n;
        drift.looks = clampStat(drift.looks - d);
    }

    return { stats: drift, rngState: st };
}

function checkDeath(
    stats: Stats,
    age: number,
    rngState: number
): { dead: boolean; cause: string; rngState: number } {
    if (stats.health <= 0) {
        return { dead: true, cause: 'Health deterioration', rngState };
    }

    if (age >= 65) {
        const [r, next] = nextRandom(rngState);
        const deathChance = (age - 60) * 0.02;
        if (r < deathChance) {
            return { dead: true, cause: 'Passed away peacefully of old age', rngState: next };
        }
        return { dead: false, cause: '', rngState: next };
    }

    return { dead: false, cause: '', rngState };
}

/* ─── Resolve queued actions ─── */

function resolvePendingActions(
    stats: Stats,
    cash: number,
    pendingActions: string[],
    rngState: number,
    age: number,
    feed: GameState['feed']
): {
    stats: Stats;
    cash: number;
    rngState: number;
    feed: GameState['feed'];
    spawnedEvents: typeof events;
} {
    let currentStats = stats;
    let currentCash = cash;
    let st = rngState;
    const newFeed = [...feed];
    const spawnedEvents: typeof events = [];

    for (const actionId of pendingActions) {
        const actionDef = actions.find((a) => a.id === actionId);
        if (!actionDef) continue;

        // Apply positive effects
        const afterPos = applyEffects(currentStats, currentCash, actionDef.positiveEffects);
        // Apply negative effects
        const afterNeg = applyEffects(afterPos.stats, afterPos.cash, actionDef.negativeEffects);

        currentStats = afterNeg.stats;
        currentCash = afterNeg.cash;

        // Build consequence description
        const posEntries = Object.entries(actionDef.positiveEffects).filter(([, v]) => v !== 0 && v !== undefined);
        const negEntries = Object.entries(actionDef.negativeEffects).filter(([, v]) => v !== 0 && v !== undefined);

        const posStr = posEntries.map(([k, v]) => `${k} ${(v as number) > 0 ? '+' : ''}${v}`).join(', ');
        const negStr = negEntries.map(([k, v]) => `${k} ${v}`).join(', ');

        newFeed.push({
            year: age,
            text: `${actionDef.emoji} ${actionDef.label}: ${posStr ? '✅ ' + posStr : ''}${negStr ? ' | ⚠️ ' + negStr : ''}`,
            type: 'consequence',
        });

        // Check for random event spawn
        const [roll, nextRng] = nextRandom(st);
        st = nextRng;
        if (roll < actionDef.eventChance) {
            const pool = eligibleEvents(age, currentStats);
            if (pool.length > 0) {
                const [ev, nextRng2] = weightedChoice(st, pool);
                st = nextRng2;
                spawnedEvents.push(ev);
            }
        }
    }

    return { stats: currentStats, cash: currentCash, rngState: st, feed: newFeed, spawnedEvents };
}

/* ─── Initial state factory ─── */

export function createInitialState(name: string, seed: string): GameState {
    const rngState = hashSeed(seed || name + Date.now());
    let st = rngState;

    const roll = (base: number): [number, number] => {
        const [r, n] = randInt(st, -10, 10);
        st = n;
        return [clampStat(base + r), st];
    };

    let health: number, happiness: number, smarts: number, looks: number, karma: number;
    [health, st] = roll(70);
    [happiness, st] = roll(65);
    [smarts, st] = roll(50);
    [looks, st] = roll(55);
    [karma, st] = roll(60);

    return {
        screen: 'playing',
        activeTab: 'main',
        name,
        age: 0,
        stats: { health, happiness, smarts, looks, karma },
        cash: 0,
        seed,
        rngState: st,
        feed: [{ year: 0, text: `${name} was born into the world! 👶`, type: 'birth' }],
        pendingEvents: [],
        currentEvent: null,
        causeOfDeath: '',
        pendingActions: [],
        actionUsage: {},
    };
}

/* ─── Reducer ─── */

export function gameReducer(state: GameState, action: GameAction): GameState {
    switch (action.type) {
        case 'START_GAME':
            return createInitialState(action.name, action.seed);

        case 'QUEUE_ACTION': {
            const actionDef = actions.find((a) => a.id === action.actionId);
            if (!actionDef) return state;

            const currentUses = state.actionUsage[action.actionId] ?? 0;
            if (currentUses >= actionDef.maxUsesPerYear) return state;

            return {
                ...state,
                pendingActions: [...state.pendingActions, action.actionId],
                actionUsage: {
                    ...state.actionUsage,
                    [action.actionId]: currentUses + 1,
                },
            };
        }

        case 'UNQUEUE_ACTION': {
            const idx = action.index;
            if (idx < 0 || idx >= state.pendingActions.length) return state;

            const removedId = state.pendingActions[idx];
            const newPending = [...state.pendingActions];
            newPending.splice(idx, 1);

            const currentUses = state.actionUsage[removedId] ?? 0;

            return {
                ...state,
                pendingActions: newPending,
                actionUsage: {
                    ...state.actionUsage,
                    [removedId]: Math.max(0, currentUses - 1),
                },
            };
        }

        case 'SET_TAB':
            return { ...state, activeTab: action.tab };

        case 'AGE_UP': {
            if (state.currentEvent || state.pendingEvents.length > 0) return state;

            const newAge = state.age + 1;

            // 1. Resolve any queued actions first
            const {
                stats: afterActions,
                cash: cashAfterActions,
                rngState: rng0,
                feed: feedAfterActions,
                spawnedEvents: actionEvents,
            } = resolvePendingActions(
                state.stats,
                state.cash,
                state.pendingActions,
                state.rngState,
                newAge,
                state.feed
            );

            // 2. Apply yearly drift
            const { stats: drifted, rngState: rng1 } = yearlyDrift(afterActions, newAge, rng0);

            // 3. Pick age-based events
            const { picked, rngState: rng2 } = pickEvents(rng1, newAge, drifted);

            // Combine action-spawned events + age-based events
            const allNewEvents = [...actionEvents, ...picked];

            // Passive income
            let passiveIncome = 0;
            if (newAge >= 18 && newAge < 65) passiveIncome = 20;
            if (newAge >= 65) passiveIncome = 10;

            const newFeed = [
                ...feedAfterActions,
                { year: newAge, text: `Year ${newAge} begins.`, type: 'action' as const },
            ];

            // Check death
            const { dead, cause, rngState: rng3 } = checkDeath(drifted, newAge, rng2);

            if (dead) {
                return {
                    ...state,
                    age: newAge,
                    stats: drifted,
                    cash: cashAfterActions + passiveIncome,
                    rngState: rng3,
                    feed: [
                        ...newFeed,
                        { year: newAge, text: `💀 ${cause}.`, type: 'death' },
                    ],
                    screen: 'death',
                    activeTab: 'main',
                    causeOfDeath: cause,
                    currentEvent: null,
                    pendingEvents: [],
                    pendingActions: [],
                    actionUsage: {},
                };
            }

            return {
                ...state,
                age: newAge,
                stats: drifted,
                cash: cashAfterActions + passiveIncome,
                rngState: rng3,
                feed: newFeed,
                currentEvent: allNewEvents[0] ?? null,
                pendingEvents: allNewEvents.slice(1),
                pendingActions: [],
                actionUsage: {},
                activeTab: 'main',
            };
        }

        case 'RESOLVE_CHOICE': {
            if (!state.currentEvent) return state;

            const choice = state.currentEvent.choices[action.choiceIndex];
            if (!choice) return state;

            const { stats, cash } = applyEffects(state.stats, state.cash, choice.effects);

            const newFeed: typeof state.feed = [
                ...state.feed,
                {
                    year: state.age,
                    text: `📌 ${state.currentEvent.title}: "${choice.label}"`,
                    type: 'choice',
                },
            ];

            if (choice.followUpEventId) {
                const followUp = events.find((e) => e.id === choice.followUpEventId);
                if (followUp) {
                    return {
                        ...state,
                        stats,
                        cash,
                        feed: newFeed,
                        currentEvent: followUp,
                    };
                }
            }

            if (stats.health <= 0) {
                return {
                    ...state,
                    stats,
                    cash,
                    feed: [
                        ...newFeed,
                        { year: state.age, text: '💀 Health deterioration.', type: 'death' },
                    ],
                    screen: 'death',
                    causeOfDeath: 'Health deterioration',
                    currentEvent: null,
                    pendingEvents: [],
                    pendingActions: [],
                    actionUsage: {},
                };
            }

            const nextEvent = state.pendingEvents[0] ?? null;
            const remaining = state.pendingEvents.slice(1);

            return {
                ...state,
                stats,
                cash,
                feed: newFeed,
                currentEvent: nextEvent,
                pendingEvents: remaining,
            };
        }

        case 'DISMISS_EVENT':
            return {
                ...state,
                currentEvent: state.pendingEvents[0] ?? null,
                pendingEvents: state.pendingEvents.slice(1),
            };

        case 'LOAD_STATE':
            return { ...action.state };

        case 'RESET':
            return {
                screen: 'start',
                activeTab: 'main',
                name: '',
                age: 0,
                stats: { health: 100, happiness: 100, smarts: 50, looks: 50, karma: 50 },
                cash: 0,
                seed: '',
                rngState: 0,
                feed: [],
                pendingEvents: [],
                currentEvent: null,
                causeOfDeath: '',
                pendingActions: [],
                actionUsage: {},
            };

        case 'SET_SCREEN':
            return { ...state, screen: action.screen };

        default:
            return state;
    }
}
