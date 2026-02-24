import React from 'react';
import type { GameEvent, Stats } from '../types';

interface EventModalProps {
    event: GameEvent;
    onChoice: (index: number) => void;
}

const STAT_LABELS: Record<string, string> = {
    health: '❤️',
    happiness: '😊',
    smarts: '🧠',
    looks: '✨',
    karma: '☯️',
    cash: '💰',
};

function renderEffects(effects: Partial<Stats> & { cash?: number }) {
    const entries = Object.entries(effects).filter(([, v]) => v !== 0 && v !== undefined);
    if (entries.length === 0) return null;

    return (
        <span className="choice-effects">
            {entries.map(([key, val]) => (
                <span
                    key={key}
                    className={`effect-badge ${(val as number) > 0 ? 'positive' : 'negative'}`}
                >
                    {STAT_LABELS[key] || key} {(val as number) > 0 ? '+' : ''}{val}
                </span>
            ))}
        </span>
    );
}

export const EventModal: React.FC<EventModalProps> = ({ event, onChoice }) => {
    return (
        <div className="modal-overlay" onClick={(e) => e.stopPropagation()}>
            <div className="modal-card">
                <h2>{event.title}</h2>
                <p>{event.description}</p>
                <div className="modal-choices">
                    {event.choices.map((choice, i) => (
                        <button
                            key={i}
                            className="choice-btn"
                            onClick={() => onChoice(i)}
                        >
                            <span>{choice.label}</span>
                            {renderEffects(choice.effects)}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
