import React, { useReducer, useRef, useEffect, useState, useCallback } from 'react';
import { gameReducer } from './reducer';
import type { GameState, FeedEntry } from './types';
import { StatBar } from './components/StatBar';
import { EventModal } from './components/EventModal';
import { DecisionsTab } from './components/DecisionsTab';
import { SaveLoadPanel } from './components/SaveLoadPanel';
import { DeathSummary } from './components/DeathSummary';
import { AIAdviceModal } from './components/AIAdviceModal';

const initialState: GameState = {
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

/* ─── Feed grouped by year ─── */
function groupFeedByYear(feed: FeedEntry[]) {
    const groups: { year: number; entries: FeedEntry[] }[] = [];
    let currentYear = -1;

    for (const entry of feed) {
        if (entry.year !== currentYear) {
            currentYear = entry.year;
            groups.push({ year: currentYear, entries: [] });
        }
        groups[groups.length - 1].entries.push(entry);
    }

    return groups;
}

export default function App() {
    const [state, dispatch] = useReducer(gameReducer, initialState);
    const [showSaveLoad, setShowSaveLoad] = useState(false);
    const [showAIAdvice, setShowAIAdvice] = useState(false);
    const [startName, setStartName] = useState('');
    const [startSeed, setStartSeed] = useState('');
    const feedEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll feed
    useEffect(() => {
        feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [state.feed.length]);

    // Keyboard shortcuts
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (state.screen !== 'playing') return;
            if (showSaveLoad || showAIAdvice) {
                if (e.key === 'Escape') {
                    setShowSaveLoad(false);
                    setShowAIAdvice(false);
                }
                return;
            }
            if (state.currentEvent) {
                if (e.key === 'Escape') return;
                const num = parseInt(e.key);
                if (num >= 1 && num <= state.currentEvent.choices.length) {
                    dispatch({ type: 'RESOLVE_CHOICE', choiceIndex: num - 1 });
                }
                return;
            }
            if (e.key === 'a' || e.key === 'A') {
                dispatch({ type: 'AGE_UP' });
            }
            if (e.key === 'd' || e.key === 'D') {
                dispatch({ type: 'SET_TAB', tab: state.activeTab === 'decisions' ? 'main' : 'decisions' });
            }
        },
        [state.screen, state.currentEvent, showSaveLoad, showAIAdvice, state.activeTab]
    );

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    /* ─── Start Screen ─── */
    if (state.screen === 'start') {
        return (
            <div className="start-screen">
                <div className="start-card">
                    <h1>🌟 LifeSim</h1>
                    <p>Live a thousand lives. Every choice matters.</p>

                    <div className="input-group">
                        <label htmlFor="name-input">Your Name</label>
                        <input
                            id="name-input"
                            type="text"
                            placeholder="Enter your name..."
                            value={startName}
                            onChange={(e) => setStartName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && startName.trim()) {
                                    dispatch({ type: 'START_GAME', name: startName.trim(), seed: startSeed || String(Date.now()) });
                                }
                            }}
                            autoFocus
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="seed-input">Seed (optional)</label>
                        <input
                            id="seed-input"
                            type="text"
                            placeholder="For deterministic runs..."
                            value={startSeed}
                            onChange={(e) => setStartSeed(e.target.value)}
                        />
                    </div>

                    <button
                        className="btn btn-primary btn-lg"
                        disabled={!startName.trim()}
                        onClick={() =>
                            dispatch({
                                type: 'START_GAME',
                                name: startName.trim(),
                                seed: startSeed || String(Date.now()),
                            })
                        }
                    >
                        ✨ Start New Life
                    </button>

                    <button
                        className="btn btn-ghost"
                        onClick={() => setShowSaveLoad(true)}
                    >
                        📂 Load Saved Game
                    </button>
                </div>

                {showSaveLoad && (
                    <SaveLoadPanel
                        state={state}
                        dispatch={dispatch}
                        onClose={() => setShowSaveLoad(false)}
                    />
                )}
            </div>
        );
    }

    /* ─── Death Screen ─── */
    if (state.screen === 'death') {
        return (
            <DeathSummary
                state={state}
                onNewLife={() => {
                    dispatch({ type: 'RESET' });
                    setStartName('');
                    setStartSeed('');
                }}
            />
        );
    }

    /* ─── Main Game Screen ─── */
    const feedGroups = groupFeedByYear(state.feed);
    const hasEvent = state.currentEvent !== null;

    return (
        <div className="game-layout">
            {/* Header */}
            <header className="game-header">
                <div className="header-left">
                    <span className="header-name">{state.name}</span>
                    <span className="header-age">🎂 Age {state.age}</span>
                    <span className="header-cash">
                        💰 ${state.cash.toLocaleString()}
                    </span>
                </div>
                <div className="header-right">
                    <button
                        className="btn btn-ghost"
                        onClick={() => setShowAIAdvice(true)}
                    >
                        🤖 AI Advice
                    </button>
                    <button
                        className="btn btn-ghost"
                        onClick={() => setShowSaveLoad(true)}
                    >
                        💾 Save/Load
                    </button>
                    <button
                        className="btn btn-ghost"
                        onClick={() => {
                            if (confirm('Start a new life? Unsaved progress will be lost.')) {
                                dispatch({ type: 'RESET' });
                                setStartName('');
                                setStartSeed('');
                            }
                        }}
                    >
                        🔄 New
                    </button>
                </div>
            </header>

            {/* Tab Navigation */}
            <nav className="tab-nav">
                <button
                    className={`tab-btn ${state.activeTab === 'main' ? 'active' : ''}`}
                    onClick={() => dispatch({ type: 'SET_TAB', tab: 'main' })}
                >
                    📖 Main
                </button>
                <button
                    className={`tab-btn ${state.activeTab === 'decisions' ? 'active' : ''}`}
                    onClick={() => dispatch({ type: 'SET_TAB', tab: 'decisions' })}
                >
                    🎯 Decisions
                    {state.pendingActions.length > 0 && (
                        <span className="tab-badge">{state.pendingActions.length}</span>
                    )}
                </button>
            </nav>

            {/* Sidebar — Stats */}
            <aside className="sidebar">
                <div className="sidebar-title">Character Stats</div>
                <StatBar label="Health" value={state.stats.health} statKey="health" emoji="❤️" />
                <StatBar label="Happiness" value={state.stats.happiness} statKey="happiness" emoji="😊" />
                <StatBar label="Smarts" value={state.stats.smarts} statKey="smarts" emoji="🧠" />
                <StatBar label="Looks" value={state.stats.looks} statKey="looks" emoji="✨" />
                <StatBar label="Karma" value={state.stats.karma} statKey="karma" emoji="☯️" />

                {state.pendingActions.length > 0 && (
                    <div className="sidebar-pending-summary">
                        <div className="sidebar-title" style={{ marginTop: '0.75rem' }}>Queued Actions</div>
                        <div className="pending-count-badge">
                            {state.pendingActions.length} action{state.pendingActions.length !== 1 ? 's' : ''} pending
                        </div>
                    </div>
                )}
            </aside>

            {/* Content Area — Main or Decisions */}
            {state.activeTab === 'main' ? (
                <main className="feed">
                    {feedGroups.map((g) => (
                        <React.Fragment key={g.year}>
                            <div className="feed-year-header">— Age {g.year} —</div>
                            {g.entries.map((entry, i) => (
                                <div key={`${g.year}-${i}`} className={`feed-entry ${entry.type}`}>
                                    {entry.text}
                                </div>
                            ))}
                        </React.Fragment>
                    ))}
                    <div ref={feedEndRef} />
                </main>
            ) : (
                <main className="feed decisions-content">
                    <DecisionsTab
                        dispatch={dispatch}
                        pendingActions={state.pendingActions}
                        actionUsage={state.actionUsage}
                        disabled={hasEvent}
                    />
                </main>
            )}

            {/* Bottom Bar — Age Up (always visible) */}
            <div className="actions-bar">
                <button
                    className="action-btn age-up-btn"
                    disabled={hasEvent}
                    onClick={() => dispatch({ type: 'AGE_UP' })}
                >
                    ⏩ Age Up{state.pendingActions.length > 0 ? ` (resolve ${state.pendingActions.length} action${state.pendingActions.length !== 1 ? 's' : ''})` : ''}
                </button>
                <div className="keyboard-hint">
                    <kbd className="kbd">A</kbd> Age Up &nbsp; <kbd className="kbd">D</kbd> Toggle Decisions &nbsp; <kbd className="kbd">1-3</kbd> Choose &nbsp; <kbd className="kbd">ESC</kbd> Close
                </div>
            </div>

            {/* Event Modal */}
            {state.currentEvent && (
                <EventModal
                    event={state.currentEvent}
                    onChoice={(i) => dispatch({ type: 'RESOLVE_CHOICE', choiceIndex: i })}
                />
            )}

            {/* Save/Load Panel */}
            {showSaveLoad && (
                <SaveLoadPanel
                    state={state}
                    dispatch={dispatch}
                    onClose={() => setShowSaveLoad(false)}
                />
            )}

            {/* AI Advice Modal */}
            {showAIAdvice && (
                <AIAdviceModal
                    state={state}
                    onClose={() => setShowAIAdvice(false)}
                />
            )}
        </div>
    );
}
