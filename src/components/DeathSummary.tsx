import React from 'react';
import type { GameState } from '../types';

interface DeathSummaryProps {
    state: GameState;
    onNewLife: () => void;
}

export const DeathSummary: React.FC<DeathSummaryProps> = ({ state, onNewLife }) => {
    const totalChoices = state.feed.filter((e) => e.type === 'choice').length;

    return (
        <div className="death-screen">
            <div className="death-card">
                <h1>Rest in Peace</h1>
                <p style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {state.name}
                </p>
                <p className="cause">
                    Lived to age {state.age} — {state.causeOfDeath}
                </p>

                <div className="death-stats">
                    <div className="death-stat">
                        <span className="death-stat-label">❤️ Health</span>
                        <span className="death-stat-value">{state.stats.health}</span>
                    </div>
                    <div className="death-stat">
                        <span className="death-stat-label">😊 Happiness</span>
                        <span className="death-stat-value">{state.stats.happiness}</span>
                    </div>
                    <div className="death-stat">
                        <span className="death-stat-label">🧠 Smarts</span>
                        <span className="death-stat-value">{state.stats.smarts}</span>
                    </div>
                    <div className="death-stat">
                        <span className="death-stat-label">✨ Looks</span>
                        <span className="death-stat-value">{state.stats.looks}</span>
                    </div>
                    <div className="death-stat">
                        <span className="death-stat-label">☯️ Karma</span>
                        <span className="death-stat-value">{state.stats.karma}</span>
                    </div>
                    <div className="death-stat">
                        <span className="death-stat-label">💰 Cash</span>
                        <span className="death-stat-value">${state.cash.toLocaleString()}</span>
                    </div>
                    <div className="death-stat">
                        <span className="death-stat-label">📌 Choices Made</span>
                        <span className="death-stat-value">{totalChoices}</span>
                    </div>
                    <div className="death-stat">
                        <span className="death-stat-label">📅 Years Lived</span>
                        <span className="death-stat-value">{state.age}</span>
                    </div>
                </div>

                <div className="death-buttons">
                    <button className="btn btn-primary btn-lg" onClick={onNewLife}>
                        🔄 New Life
                    </button>
                </div>
            </div>
        </div>
    );
};
