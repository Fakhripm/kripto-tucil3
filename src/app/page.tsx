'use client';
import React, { useState } from 'react';

interface Message {
  text: string;
  sender: string;
  modified?: boolean;
  decrypted?: boolean; // Add decrypted field to track whether a message has been decrypted
}

export default function Home() {
  const [room1Messages, setRoom1Messages] = useState<Message[]>([]);
  const [room2Messages, setRoom2Messages] = useState<Message[]>([]);
  const [inputValueRoom1, setInputValueRoom1] = useState('');
  const [inputValueRoom2, setInputValueRoom2] = useState('');

  const handleSendMessage = (room: number) => {
    const inputValue = room === 1 ? inputValueRoom1 : inputValueRoom2;
    if (inputValue.trim() === '') return;
    const originalMessage: Message = { text: inputValue, sender: `Room ${room}` };
    if (room === 1) {
      setRoom1Messages([...room1Messages, originalMessage]);
      setInputValueRoom1('');
    } else {
      setRoom2Messages([...room2Messages, originalMessage]);
      setInputValueRoom2('');
    }
  };

  const handleEncryptMessage = (room: number) => {
    const inputValue = room === 1 ? inputValueRoom1 : inputValueRoom2;
    if (inputValue.trim() === '') return;
    const originalMessage: Message = { text: inputValue, sender: `Room ${room}` };
    const modifiedMessage: Message = { text: `${inputValue} (enkripted)`, sender: `Room ${room}`, modified: true };
    
    // Update state for both rooms with original and modified messages
    if (room === 1) {
      setRoom1Messages([...room1Messages, originalMessage]);
      setRoom2Messages([...room2Messages, modifiedMessage]);
    }
    else {
      setRoom2Messages([...room2Messages, originalMessage]);
      setRoom1Messages([...room1Messages, modifiedMessage]);
    }
    
    // Clear input value
    if (room === 1) {
      setInputValueRoom1('');
    } else {
      setInputValueRoom2('');
    }
  };
  

  const handleDecryptMessage = (room: number, index: number) => {
    const messages = room === 1 ? [...room1Messages] : [...room2Messages];
    const decryptedMessage = messages[index].text.replace(' (enkripted)', '');
    messages[index].text = decryptedMessage;
    messages[index].decrypted = true; // Set decrypted flag to true
    if (room === 1) {
      setRoom1Messages(messages);
    } else {
      setRoom2Messages(messages);
    }
  };

  return (
    <div className="flex">
      <div className="border border-gray-300 rounded-lg p-4 w-96">
        <h2 className="text-lg font-semibold mb-4">Room 1</h2>
        <div className="mb-4 h-60 overflow-y-auto">
          {room1Messages.map((msg, index) => (
            <div key={index} className={`flex mb-2 justify-${msg.sender === 'Room 1' ? 'end' : 'start'}`}>
              <div className="flex flex-col items-start">
                <span className="text-xs text-gray-500 mb-1">{msg.sender}</span>
                <div className={`rounded-lg p-2 ${msg.sender === 'Room 1' ? 'bg-blue-500 text-white' : 'bg-green-300 text-black'}`}>
                  {msg.text}
                </div>
              </div>
              {msg.modified && !msg.decrypted && ( // Only show decrypt button if message is modified and not decrypted
                <button onClick={() => handleDecryptMessage(1, index)} className="ml-2 text-xs text-gray-500 hover:text-gray-800">Decrypt</button>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center">
          <input
            type="text"
            value={inputValueRoom1}
            onChange={(e) => setInputValueRoom1(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button onClick={() => handleEncryptMessage(1)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2">Send</button>
        </div>
      </div>
      <div className="border border-gray-300 rounded-lg p-4 w-96">
        <h2 className="text-lg font-semibold mb-4">Room 2</h2>
        <div className="mb-4 h-60 overflow-y-auto">
          {room2Messages.map((msg, index) => (
            <div key={index} className={`flex mb-2 justify-${msg.sender === 'Room 2' ? 'end' : 'start'}`}>
              <div className="flex flex-col items-start">
                <span className="text-xs text-gray-500 mb-1">{msg.sender}</span>
                <div className={`rounded-lg p-2 ${msg.sender === 'Room 2' ? 'bg-blue-500 text-white' : 'bg-green-300 text-black'}`}>
                  {msg.text}
                </div>
              </div>
              {msg.modified && !msg.decrypted && ( // Only show decrypt button if message is modified and not decrypted
                <button onClick={() => handleDecryptMessage(2, index)} className="ml-2 text-xs text-gray-500 hover:text-gray-800">Decrypt</button>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center">
          <input
            type="text"
            value={inputValueRoom2}
            onChange={(e) => setInputValueRoom2(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button onClick={() => handleEncryptMessage(2)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2">Send</button>
        </div>
      </div>
    </div>
  );
}