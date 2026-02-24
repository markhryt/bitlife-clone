import type { GameState } from './types';
import { actions } from './actions';

/**
 * Builds a structured prompt summarizing the current game state,
 * suitable for sending to an LLM for advice.
 *
 * Architecture: This is a pure function. To integrate a real AI backend,
 * create an async wrapper: `async function getAIAdvice(state: GameState): Promise<string>`
 * that calls your API with this prompt and returns the response.
 */
export function buildAIAdvicePrompt(state: GameState): string {
    const { name, age, stats, cash, feed, pendingActions } = state;

    // Last 5 feed entries for recent context
    const recentEvents = feed
        .slice(-5)
        .map((e) => `  - [Age ${e.year}] ${e.text}`)
        .join('\n');

    // Pending actions summary
    const pendingSummary =
        pendingActions.length > 0
            ? pendingActions
                .map((id) => {
                    const def = actions.find((a) => a.id === id);
                    return def ? `  - ${def.emoji} ${def.label}` : `  - ${id}`;
                })
                .join('\n')
            : '  (none)';

    // Stat assessment
    const statLines = [
        `  Health:    ${stats.health}/100${stats.health < 30 ? ' ⚠️ CRITICAL' : ''}`,
        `  Happiness: ${stats.happiness}/100${stats.happiness < 20 ? ' ⚠️ LOW' : ''}`,
        `  Smarts:    ${stats.smarts}/100`,
        `  Looks:     ${stats.looks}/100`,
        `  Karma:     ${stats.karma}/100`,
        `  Cash:      $${cash.toLocaleString()}${cash < 0 ? ' ⚠️ IN DEBT' : ''}`,
    ].join('\n');

    const ageGroup =
        age < 13 ? 'child' : age < 18 ? 'teenager' : age < 65 ? 'adult' : 'elder';

    return `You are a life advisor in a simulation game. The player needs advice on their next decisions.

PLAYER PROFILE:
  Name: ${name}
  Age: ${age} (${ageGroup})

CURRENT STATS:
${statLines}

RECENT LIFE EVENTS:
${recentEvents || '  (no events yet)'}

QUEUED DECISIONS FOR THIS YEAR:
${pendingSummary}

AVAILABLE ACTIONS:
${actions.map((a) => `  - ${a.emoji} ${a.label} (max ${a.maxUsesPerYear}/year)`).join('\n')}

Based on the player's current situation, provide concise advice on:
1. Which stats need the most attention?
2. What actions should they prioritize this year?
3. Any risks or opportunities to watch for at their current age?

Keep your response brief and actionable (3-5 bullet points).`;
}
