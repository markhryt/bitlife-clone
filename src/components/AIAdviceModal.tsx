import React, { useState } from 'react';
import type { GameState } from '../types';
import { buildAIAdvicePrompt } from '../ai-advice';

interface AIAdviceModalProps {
    state: GameState;
    onClose: () => void;
}

export const AIAdviceModal: React.FC<AIAdviceModalProps> = ({ state, onClose }) => {
    const prompt = buildAIAdvicePrompt(state);
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(prompt);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for non-secure contexts
            const ta = document.createElement('textarea');
            ta.value = prompt;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="ai-advice-card" onClick={(e) => e.stopPropagation()}>
                <div className="ai-advice-header">
                    <h2>🤖 AI Decision Advisor</h2>
                    <button className="btn btn-ghost" onClick={onClose}>✕</button>
                </div>

                <p className="ai-advice-subtitle">
                    Copy this prompt and paste it into any AI chatbot for personalized life advice.
                </p>

                <div className="ai-advice-prompt">
                    <pre>{prompt}</pre>
                </div>

                <div className="ai-advice-actions">
                    <button className="btn btn-primary" onClick={handleCopy}>
                        {copied ? '✅ Copied!' : '📋 Copy Prompt'}
                    </button>
                    <button className="btn btn-ghost" onClick={onClose}>
                        Close
                    </button>
                </div>

                <div className="ai-advice-placeholder">
                    <div className="sidebar-title">🔮 AI Response</div>
                    <p>
                        Paste the prompt into ChatGPT, Claude, or any AI to get advice.
                        Future versions may integrate directly with an AI API.
                    </p>
                </div>
            </div>
        </div>
    );
};
