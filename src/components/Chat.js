// frontend/src/components/Chat.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const Chat = ({ username }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const socket = io(process.env.REACT_APP_API_URL); // Replace with your backend socket URL

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages([...messages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [messages, socket]);

  const handleMessageSend = () => {
    socket.emit('message', { content: inputMessage, username });
    setInputMessage('');
  };

  return (
    <div className="chat">
      <h2>Chat</h2>
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index}>
            <strong>{message.username}: </strong>
            {message.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={handleMessageSend}>Send</button>
    </div>
  );
};

export default Chat;
