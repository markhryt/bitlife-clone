import type { GameState } from './types';

const STORAGE_KEY = 'lifesim_saves';

export interface SaveSlot {
    name: string;
    age: number;
    timestamp: number;
    state: GameState;
}

export function getSaves(): (SaveSlot | null)[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [null, null, null];
        const parsed = JSON.parse(raw);
        return [parsed[0] ?? null, parsed[1] ?? null, parsed[2] ?? null];
    } catch {
        return [null, null, null];
    }
}

export function saveGame(slotIndex: number, state: GameState): void {
    const saves = getSaves();
    saves[slotIndex] = {
        name: state.name,
        age: state.age,
        timestamp: Date.now(),
        state,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saves));
}

export function loadGame(slotIndex: number): GameState | null {
    const saves = getSaves();
    return saves[slotIndex]?.state ?? null;
}

export function deleteSave(slotIndex: number): void {
    const saves = getSaves();
    saves[slotIndex] = null;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saves));
}
