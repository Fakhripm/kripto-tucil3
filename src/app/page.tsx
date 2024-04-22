'use client';
import React, { useState } from 'react';

const { encryptRSA, decryptRSA, arrayToBase64 } = require('./../utils/rsa.js');
import { keyPairOne, keyPairTwo } from './globalVariables';

interface Message {
  text: string;
  sender: string;
  modified?: boolean;
  decrypted?: boolean;
  isFile?: boolean;
  array?: BigInt[];
}

export default function Home() {
  const [room1Messages, setRoom1Messages] = useState<Message[]>([]);
  const [room2Messages, setRoom2Messages] = useState<Message[]>([]);
  const [inputValueRoom1, setInputValueRoom1] = useState('');
  const [inputValueRoom2, setInputValueRoom2] = useState('');
  const [generateKeyPressedRoom1, setGenerateKeyPressedRoom1] = useState(false);
  const [sendPublicKeyPressedRoom1, setSendPublicKeyPressedRoom1] = useState(false);
  const [generateKeyPressedRoom2, setGenerateKeyPressedRoom2] = useState(false);
  const [sendPublicKeyPressedRoom2, setSendPublicKeyPressedRoom2] = useState(false);

  console.log("publickeyTwo", keyPairTwo.publicKey);
  console.log("privatekeyTwo", keyPairTwo.privateKey);

  const handleSendMessage = (room: number) => {
    const generateKeyPressed = room === 1 ? generateKeyPressedRoom1 : generateKeyPressedRoom2;
    const sendPublicKeyPressed = room === 1 ? sendPublicKeyPressedRoom1 : sendPublicKeyPressedRoom2;
    if (!generateKeyPressed || !sendPublicKeyPressed) return;

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

    const isFile = /^file:/.test(inputValue);
    originalMessage.isFile = isFile;
    var inputEncrypted = " ";
    if (room === 1) {
      inputEncrypted = arrayToBase64(encryptRSA(inputValue,keyPairTwo.publicKey));
    }
    else {
      inputEncrypted = arrayToBase64(encryptRSA(inputValue,keyPairOne.publicKey));
    }
    var modifiedMessage: Message = { text: `${inputEncrypted} (enkripted)`, sender: `Room ${room}`, modified: true, isFile };

    if (room === 1) {
      setRoom1Messages([...room1Messages, originalMessage]);
      setRoom2Messages([...room2Messages, modifiedMessage]);
      modifiedMessage.array = (encryptRSA(inputValue,keyPairTwo.publicKey));
    } else {
      setRoom2Messages([...room2Messages, originalMessage]);
      setRoom1Messages([...room1Messages, modifiedMessage]);
      modifiedMessage.array = (encryptRSA(inputValue,keyPairOne.publicKey));
    }

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
    messages[index].decrypted = true;
    if (room === 1) {
      messages[index].text = decryptRSA(messages[index].array ,keyPairOne.privateKey);
      setRoom1Messages(messages);
    } else {
      messages[index].text = decryptRSA(messages[index]. array,keyPairTwo.privateKey);
      setRoom2Messages(messages);
    }
  };

  const handleGenerateKey = (room: number) => {
    if (room === 1) {
      setGenerateKeyPressedRoom1(true);
    } else {
      setGenerateKeyPressedRoom2(true);
    }
  };

  const handleSendPublicKey = (room: number) => {
    if (room === 1) {
      setSendPublicKeyPressedRoom1(true);
    } else {
      setSendPublicKeyPressedRoom2(true);
    }
  };

  const handleFileUpload = (room: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const fileContent = reader.result as string;
      const inputValue = `file:${file.name}`;

      if (room === 1) {
        setInputValueRoom1(inputValue);
      } else {
        setInputValueRoom2(inputValue);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileDownload = (url: string) => {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = url.replace('file:', '');
    anchor.click();
  };

  return (
    <div className="flex">
      <div className="border border-gray-300 rounded-lg p-4 w-96">
        <h2 className="text-lg font-semibold mb-4">Alice</h2>
        <div className="mt-2">
          <button onClick={() => handleGenerateKey(1)} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2">Bangkitkan Kunci</button>
          <button onClick={() => handleSendPublicKey(1)} className={`ml-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 ${!generateKeyPressedRoom1 && "cursor-not-allowed"}`} disabled={!generateKeyPressedRoom1}>Kirim Kunci Publik</button>
        </div>
        <div className="mb-4 h-60 overflow-y-auto">
          {room1Messages.map((msg, index) => (
            <div key={index} className={`flex mb-2 justify-${msg.sender === 'Room 1' ? 'end' : 'start'}`}>
              <div className="flex flex-col items-start">
                <span className="text-xs text-gray-500 mb-1">{msg.sender}</span>
                {msg.isFile ? (
                  <div className={`rounded-lg p-2 ${msg.sender === 'Room 1' ? 'bg-blue-500 text-white' : 'bg-green-300 text-black'}`}>
                    <a href={msg.text} download>{msg.text.replace('file:', '')}</a>
                    <button onClick={() => handleFileDownload(msg.text)} className="text-xs text-gray-500 hover:text-gray-800 ml-2">Download</button>
                  </div>
                ) : (
                  <div className={`rounded-lg p-2 ${msg.sender === 'Room 1' ? 'bg-blue-500 text-white' : 'bg-green-300 text-black'}`}>
                    {msg.text}
                  </div>
                )}
              </div>
              {msg.modified && !msg.decrypted && (
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
            className={`flex-1 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!generateKeyPressedRoom1 && "cursor-not-allowed"}`}
            disabled={!generateKeyPressedRoom1}
          />
          <input
            type="file"
            onChange={(e) => handleFileUpload(1, e)}
            className={`hidden`}
            id="file-upload-room1"
          />
          <label htmlFor="file-upload-room1" className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 cursor-pointer ${!generateKeyPressedRoom1 && "cursor-not-allowed"}`} disabled={!generateKeyPressedRoom1}>Upload File</label>
          <button onClick={() => handleEncryptMessage(1)} className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 ml-2 ${!generateKeyPressedRoom1 && "cursor-not-allowed"}`} disabled={!generateKeyPressedRoom1}>Send</button>
        </div>
      </div>
      <div className="border border-gray-300 rounded-lg p-4 w-96">
        <h2 className="text-lg font-semibold mb-4">Bob</h2>
        <div className="mt-2">
          <button onClick={() => handleGenerateKey(2)} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2">Bangkitkan Kunci</button>
          <button onClick={() => handleSendPublicKey(2)} className={`ml-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 ${!generateKeyPressedRoom2 && "cursor-not-allowed"}`} disabled={!generateKeyPressedRoom2}>Kirim Kunci Publik</button>
        </div>
        <div className="mb-4 h-60 overflow-y-auto">
          {room2Messages.map((msg, index) => (
            <div key={index} className={`flex mb-2 justify-${msg.sender === 'Room 2' ? 'end' : 'start'}`}>
              <div className="flex flex-col items-start">
                <span className="text-xs text-gray-500 mb-1">{msg.sender}</span>
                {msg.isFile ? (
                  <div className={`rounded-lg p-2 ${msg.sender === 'Room 2' ? 'bg-blue-500 text-white' : 'bg-green-300 text-black'}`}>
                    <a href={msg.text} download>{msg.text.replace('file:', '')}</a>
                    <button onClick={() => handleFileDownload(msg.text)} className="text-xs text-gray-500 hover:text-gray-800 ml-2">Download</button>
                  </div>
                ) : (
                  <div className={`rounded-lg p-2 ${msg.sender === 'Room 2' ? 'bg-blue-500 text-white' : 'bg-green-300 text-black'}`}>
                    {msg.text}
                  </div>
                )}
              </div>
              {msg.modified && !msg.decrypted && (
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
            className={`flex-1 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!generateKeyPressedRoom2 && "cursor-not-allowed"}`}
            disabled={!generateKeyPressedRoom2}
          />
          <input
            type="file"
            onChange={(e) => handleFileUpload(2, e)}
            className={`hidden`}
            id="file-upload-room2"
          />
          <label htmlFor="file-upload-room2" className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 cursor-pointer ${!generateKeyPressedRoom2 && "cursor-not-allowed"}`} disabled={!generateKeyPressedRoom2}>Upload File</label>
          <button onClick={() => handleEncryptMessage(2)} className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 ml-2 ${!generateKeyPressedRoom2 && "cursor-not-allowed"}`} disabled={!generateKeyPressedRoom2}>Send</button>
        </div>
      </div>
    </div>
  );
}