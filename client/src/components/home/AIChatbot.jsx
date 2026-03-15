import React, { useState, useEffect } from 'react';
import { AIService } from '../../services/ai-service';
import { useAuth } from '../../context/AuthContext';

const AIChatbot = () => {
    const { userProfile } = useAuth();
    const [chatOpen, setChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [isChatting, setIsChatting] = useState(false);

    useEffect(() => {
        if (chatMessages.length === 0) {
            setChatMessages([{ role: 'assistant', text: "Hello! I'm your AI Career Assistant. How can I help you today?" }]);
        }
    }, [chatMessages.length]);

    const handleSendMessage = async () => {
        if (!chatInput.trim()) return;
        const userMsg = chatInput;
        setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setChatInput('');
        setIsChatting(true);

        try {
            const response = await AIService.getChatResponse(userMsg, userProfile);
            setChatMessages(prev => [...prev, { role: 'assistant', text: response }]);
        } catch (error) {
            setChatMessages(prev => [...prev, { role: 'assistant', text: "Sorry, I encountered an error." }]);
        } finally {
            setIsChatting(false);
        }
    };

    return (
        <div id="chatbot-container" className={chatOpen ? 'chatbot-expanded' : 'chatbot-minimized'}>
            <div className="chatbot-header" onClick={() => setChatOpen(!chatOpen)}>
                <span>AI Assistant</span>
                <i className={`fas ${chatOpen ? 'fa-chevron-down' : 'fa-chevron-up'}`}></i>
            </div>
            {chatOpen && (
                <div className="chatbot-body">
                    <div id="chatbot-messages">
                        {chatMessages.map((msg, i) => (
                            <div key={i} style={{ marginBottom: '8px', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                                <span style={{
                                    display: 'inline-block',
                                    padding: '8px 12px',
                                    borderRadius: '12px',
                                    background: msg.role === 'user' ? 'var(--accent-primary)' : '#f1f5f9',
                                    color: msg.role === 'user' ? 'white' : '#334155',
                                    maxWidth: '80%'
                                }}>{msg.text}</span>
                            </div>
                        ))}
                    </div>
                    <div className="chatbot-input">
                        <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Ask anything..."
                        />
                        <button onClick={handleSendMessage} disabled={isChatting}><i className="fas fa-paper-plane"></i></button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIChatbot;
