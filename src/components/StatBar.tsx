import React from 'react';

interface StatBarProps {
    label: string;
    value: number;
    statKey: string;
    emoji: string;
}

export const StatBar: React.FC<StatBarProps> = ({ label, value, statKey, emoji }) => {
    return (
        <div className="stat-bar">
            <div className="stat-bar-header">
                <span className="stat-bar-label">{emoji} {label}</span>
                <span className="stat-bar-value">{value}</span>
            </div>
            <div className="stat-bar-track">
                <div
                    className={`stat-bar-fill ${statKey}`}
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    );
};
