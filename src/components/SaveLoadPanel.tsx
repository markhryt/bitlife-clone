import React, { useState, useEffect } from 'react';
import type { GameState, GameAction } from '../types';
import { getSaves, saveGame, loadGame, deleteSave } from '../storage';

interface SaveLoadPanelProps {
    state: GameState;
    dispatch: React.Dispatch<GameAction>;
    onClose: () => void;
}

export const SaveLoadPanel: React.FC<SaveLoadPanelProps> = ({
    state,
    dispatch,
    onClose,
}) => {
    const [slots, setSlots] = useState(getSaves());

    useEffect(() => {
        setSlots(getSaves());
    }, []);

    const handleSave = (index: number) => {
        saveGame(index, state);
        setSlots(getSaves());
    };

    const handleLoad = (index: number) => {
        const loaded = loadGame(index);
        if (loaded) {
            dispatch({ type: 'LOAD_STATE', state: loaded });
            onClose();
        }
    };

    const handleDelete = (index: number) => {
        deleteSave(index);
        setSlots(getSaves());
    };

    return (
        <div className="saveload-overlay" onClick={onClose}>
            <div className="saveload-card" onClick={(e) => e.stopPropagation()}>
                <h2>💾 Save / Load</h2>
                {slots.map((slot, i) => (
                    <div key={i} className="save-slot">
                        {slot ? (
                            <>
                                <div className="slot-info">
                                    <p>{slot.name} — Age {slot.age}</p>
                                    <span>{new Date(slot.timestamp).toLocaleString()}</span>
                                </div>
                                <div className="slot-actions">
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => handleSave(i)}
                                    >
                                        Overwrite
                                    </button>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleLoad(i)}
                                    >
                                        Load
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDelete(i)}
                                    >
                                        ✕
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <span className="slot-empty">Slot {i + 1} — Empty</span>
                                <div className="slot-actions">
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleSave(i)}
                                    >
                                        Save Here
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
                <button className="btn btn-ghost" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
};
