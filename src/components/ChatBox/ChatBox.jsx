import React, { useState, useRef, useEffect } from 'react';
import { callAI } from '../../services/aiService';
import './ChatBox.css';

const ChatBox = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Xin chào! Tôi là AI Assistant của trang web phim. Tôi có thể giúp bạn tìm hiểu về các bộ phim, thể loại yêu thích, gợi ý phim hot và nhiều hơn nữa! Hãy hỏi tôi bất cứ điều gì nhé! 🎬",
            isUser: false,
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage = {
            id: Date.now(),
            text: inputValue,
            isUser: true,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            // Gọi AI service
            const aiResponse = await callAI(inputValue);

            const aiMessage = {
                id: Date.now() + 1,
                text: aiResponse,
                isUser: false,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error calling AI:', error);

            // Fallback response nếu có lỗi
            const fallbackMessage = {
                id: Date.now() + 1,
                text: "Xin lỗi, tôi đang gặp sự cố kỹ thuật. Tuy nhiên, tôi có thể giúp bạn với một số gợi ý cơ bản:\n\n🎬 **Thể loại phim phổ biến:**\n- Hành động\n- Tình cảm\n- Hài hước\n- Kinh dị\n- Khoa học viễn tưởng\n- Hoạt hình\n\n🔥 **Phim hot hiện tại:**\n- Top phim Hàn Quốc\n- Top phim Trung Quốc\n- Top phim US-UK\n- Anime phổ biến\n\nBạn có thể khám phá các danh mục này trên trang web để tìm phim phù hợp!",
                isUser: false,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, fallbackMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`chat-container ${isOpen ? 'open' : ''}`}>
            {/* Chat Button */}
            <button className="chat-toggle-btn" onClick={toggleChat}>
                {isOpen ? '✕' : '💬'}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <h3>AI Movie Assistant</h3>
                        <button className="close-btn" onClick={toggleChat}>✕</button>
                    </div>

                    <div className="chat-messages">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`message ${message.isUser ? 'user-message' : 'ai-message'}`}
                            >
                                <div className="message-content">
                                    {message.text.split('\n').map((line, index) => (
                                        <p key={index}>{line}</p>
                                    ))}
                                </div>
                                <div className="message-time">
                                    {message.timestamp.toLocaleTimeString('vi-VN', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="message ai-message">
                                <div className="message-content">
                                    <div className="typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-input">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Hỏi tôi về phim ảnh..."
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim() || isLoading}
                            className="send-btn"
                        >
                            ➤
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBox;
