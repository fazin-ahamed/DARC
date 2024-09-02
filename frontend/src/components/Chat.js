import React, { useState, useEffect } from 'react';

const Chat = ({ sessionId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const websocketRef = useRef(null);

    useEffect(() => {
        websocketRef.current = new WebSocket(`ws://darc-backendonly.vercel.app/ws/chat/${sessionId}`);

        websocketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((prev) => [...prev, data]);
        };

        return () => {
            websocketRef.current.close();
        };
    }, [sessionId]);

    const sendMessage = () => {
        websocketRef.current.send(JSON.stringify({ message: newMessage }));
        setNewMessage('');
    };

    return (
        <div>
            <h3>Chat</h3>
            <div>
                {messages.map((msg, index) => (
                    <p key={index}>{msg.sender}: {msg.message}</p>
                ))}
            </div>
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;
