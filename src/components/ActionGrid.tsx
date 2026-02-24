import React from 'react';
import { actions } from '../actions';
import type { GameAction } from '../types';

interface ActionGridProps {
    dispatch: React.Dispatch<GameAction>;
    disabled: boolean;
}

export const ActionGrid: React.FC<ActionGridProps> = ({ dispatch, disabled }) => {
    return (
        <>
            {actions.map((action) => (
                <button
                    key={action.id}
                    className="action-btn"
                    disabled={disabled}
                    onClick={() => dispatch({ type: 'APPLY_ACTION', actionId: action.id })}
                    title={`${action.label} — ${Object.entries(action.effects)
                        .filter(([, v]) => v !== 0)
                        .map(([k, v]) => `${k}: ${v! > 0 ? '+' : ''}${v}`)
                        .join(', ')}`}
                >
                    <span className="emoji">{action.emoji}</span>
                    {action.label}
                </button>
            ))}
        </>
    );
};
