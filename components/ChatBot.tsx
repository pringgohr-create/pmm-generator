import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage } from '../types';
import { sendChatMessage } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import LoadingSpinner from './LoadingSpinner';

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const newUserMessage: ChatMessage = { role: 'user', content: input.trim() };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const chatHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      const modelResponse = await sendChatMessage(newUserMessage.content, chatHistory);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'model', content: modelResponse },
      ]);
    } catch (error) {
      console.error('Error sending chat message:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'model', content: `Maaf, terjadi kesalahan saat memproses permintaan Anda. (${error instanceof Error ? error.message : String(error)})` },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, messages]);

  const renderMessage = (message: ChatMessage, index: number) => (
    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`p-3 rounded-lg max-w-[70%] ${
        message.role === 'user'
          ? 'bg-blue-500 text-white'
          : 'bg-gray-200 text-gray-800'
      }`}>
        <ReactMarkdown>{message.content}</ReactMarkdown>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md flex flex-col h-[500px] w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold p-4 border-b text-center">Chat Bot Gemini</h2>
      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        {messages.length === 0 && (
          <p className="text-center text-gray-500 italic mt-10">
            Halo! Tanyakan sesuatu kepada saya...
          </p>
        )}
        {messages.map(renderMessage)}
        {isLoading && <LoadingSpinner />}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="p-4 border-t flex sticky bottom-0 bg-white">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ketik pesan Anda..."
          className="flex-1 border border-gray-300 rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          Kirim
        </button>
      </form>
    </div>
  );
};

export default ChatBot;
