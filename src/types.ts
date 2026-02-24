/* ─── Core Game Types ─── */

export interface Stats {
    health: number;
    happiness: number;
    smarts: number;
    looks: number;
    karma: number;
}

export interface FeedEntry {
    year: number;
    text: string;
    type: 'event' | 'action' | 'birth' | 'death' | 'choice' | 'consequence';
}

export interface EventChoice {
    label: string;
    effects: Partial<Stats> & { cash?: number };
    followUpEventId?: string;
}

export interface GameEvent {
    id: string;
    title: string;
    description: string;
    minAge: number;
    maxAge: number;
    weight: number;
    conditions?: {
        minStat?: Partial<Stats>;
        maxStat?: Partial<Stats>;
    };
    choices: EventChoice[];
}

export interface GameState {
    screen: 'start' | 'playing' | 'death' | 'saveload';
    activeTab: 'main' | 'decisions';
    name: string;
    age: number;
    stats: Stats;
    cash: number;
    seed: string;
    rngState: number;
    feed: FeedEntry[];
    pendingEvents: GameEvent[];
    currentEvent: GameEvent | null;
    causeOfDeath: string;
    pendingActions: string[];              // queued action IDs for this year
    actionUsage: Record<string, number>;   // actionId → times used this year
}

/* ─── Actions ─── */

export type GameAction =
    | { type: 'START_GAME'; name: string; seed: string }
    | { type: 'AGE_UP' }
    | { type: 'QUEUE_ACTION'; actionId: string }
    | { type: 'UNQUEUE_ACTION'; index: number }
    | { type: 'RESOLVE_CHOICE'; choiceIndex: number }
    | { type: 'DISMISS_EVENT' }
    | { type: 'LOAD_STATE'; state: GameState }
    | { type: 'RESET' }
    | { type: 'SET_SCREEN'; screen: GameState['screen'] }
    | { type: 'SET_TAB'; tab: GameState['activeTab'] };

/* ─── Action definitions ─── */

export interface ActionDef {
    id: string;
    label: string;
    emoji: string;
    positiveEffects: Partial<Stats> & { cash?: number };
    negativeEffects: Partial<Stats> & { cash?: number };
    eventChance: number; // 0-1 chance to spawn a random event
    maxUsesPerYear: number;
}
