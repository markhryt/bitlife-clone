import React from 'react';
import { actions } from '../actions';
import type { GameAction } from '../types';

interface DecisionsTabProps {
    dispatch: React.Dispatch<GameAction>;
    pendingActions: string[];
    actionUsage: Record<string, number>;
    disabled: boolean;
}

export const DecisionsTab: React.FC<DecisionsTabProps> = ({
    dispatch,
    pendingActions,
    actionUsage,
    disabled,
}) => {
    return (
        <div className="decisions-tab">
            {/* Pending Queue */}
            {pendingActions.length > 0 && (
                <div className="pending-queue">
                    <div className="pending-queue-header">
                        <span className="sidebar-title">📋 Queued This Year ({pendingActions.length})</span>
                    </div>
                    <div className="pending-list">
                        {pendingActions.map((id, i) => {
                            const def = actions.find((a) => a.id === id);
                            if (!def) return null;
                            return (
                                <div key={`${id}-${i}`} className="pending-item">
                                    <span>
                                        <span className="emoji">{def.emoji}</span> {def.label}
                                    </span>
                                    <button
                                        className="pending-remove"
                                        onClick={() => dispatch({ type: 'UNQUEUE_ACTION', index: i })}
                                        title="Remove from queue"
                                    >
                                        ✕
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Available Actions */}
            <div className="sidebar-title" style={{ padding: '0 0 0.25rem 0' }}>
                Available Actions
            </div>
            <div className="action-cards-grid">
                {actions.map((action) => {
                    const used = actionUsage[action.id] ?? 0;
                    const atLimit = used >= action.maxUsesPerYear;

                    const posEntries = Object.entries(action.positiveEffects).filter(
                        ([, v]) => v !== 0 && v !== undefined
                    );
                    const negEntries = Object.entries(action.negativeEffects).filter(
                        ([, v]) => v !== 0 && v !== undefined
                    );

                    return (
                        <div key={action.id} className={`action-card ${atLimit ? 'at-limit' : ''}`}>
                            <div className="action-card-header">
                                <span className="action-card-title">
                                    <span className="emoji">{action.emoji}</span> {action.label}
                                </span>
                                <span className={`action-usage ${atLimit ? 'maxed' : ''}`}>
                                    {used}/{action.maxUsesPerYear}
                                </span>
                            </div>

                            <div className="action-card-effects">
                                {posEntries.map(([k, v]) => (
                                    <span key={k} className="effect-badge positive">
                                        {k} {(v as number) > 0 ? '+' : ''}{v as number}
                                    </span>
                                ))}
                                {negEntries.map(([k, v]) => (
                                    <span key={k} className="effect-badge negative">
                                        {k} {v as number}
                                    </span>
                                ))}
                            </div>

                            <button
                                className="btn btn-secondary action-queue-btn"
                                disabled={disabled || atLimit}
                                onClick={() => dispatch({ type: 'QUEUE_ACTION', actionId: action.id })}
                            >
                                {atLimit ? 'Limit Reached' : '+ Queue'}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
