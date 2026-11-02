import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  MessageSquare,
  Send,
  Bot,
  User,
  Store,
  Sparkles,
  HelpCircle,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export const ChatView: React.FC = () => {
  const { messages, sendMessage, currentUser } = useApp();
  const [inputText, setInputText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendMessage(inputText.trim());
    setInputText('');
  };

  const quickPrompts = [
    'Bagaimana cara memesan barang?',
    'Berapa ongkos kirim kurir?',
    'Bagaimana cara mendaftarkan warung baru?',
    'Cara kerja sama stok antarwarung?',
    'Kontak bantuan admin',
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col h-[680px]">
        {/* Chat Header */}
        <div className="p-5 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/25">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base font-heading">
                  Pusat Pesan & Bantuan Madura
                </h2>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              </div>
              <p className="text-xs text-blue-200">
                Terhubung dengan Warung Mitra & MaduraBot (Asisten Otomatis)
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold">
            <Bot className="w-3.5 h-3.5 text-amber-300" />
            <span>MaduraBot Siap 24 Jam</span>
          </div>
        </div>

        {/* Quick FAQ Chips */}
        <div className="p-3 bg-slate-50 border-b border-slate-200/80 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs font-bold text-slate-700">
          <span className="text-slate-400 shrink-0 font-semibold text-[11px]">Tanya Cepat:</span>
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(q)}
              className="px-3 py-1 bg-white hover:bg-blue-50 hover:text-blue-600 rounded-xl border border-slate-200 shrink-0 transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => {
            const isMe = msg.senderId === currentUser?.uid;
            const isBot = msg.isBot;

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs ${
                    isBot
                      ? 'bg-amber-500 shadow-md shadow-amber-500/20'
                      : isMe
                      ? 'bg-blue-600'
                      : 'bg-indigo-600'
                  }`}
                >
                  {isBot ? <Bot className="w-5 h-5" /> : isMe ? <User className="w-4 h-4" /> : <Store className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div className={`max-w-[80%] space-y-1 ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-2 px-1">
                    <span className="text-[11px] font-bold text-slate-700">
                      {msg.senderName}
                    </span>
                    {isBot && (
                      <span className="px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800 text-[9px] font-black uppercase">
                        Chatbot AI
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                  </div>

                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isMe
                        ? 'bg-blue-600 text-white rounded-tr-xs shadow-md shadow-blue-500/10'
                        : isBot
                        ? 'bg-amber-50/80 border border-amber-200 text-slate-800 rounded-tl-xs'
                        : 'bg-slate-100 text-slate-800 rounded-tl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200 flex items-center gap-3">
          <input
            type="text"
            placeholder={
              currentUser
                ? 'Ketik pesan atau tanyakan sesuatu kepada warung & bot...'
                : 'Silakan masuk akun terlebih dahulu untuk mengirim pesan...'
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={!currentUser}
            className="flex-1 px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
          />
          <button
            type="submit"
            disabled={!currentUser || !inputText.trim()}
            className="p-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center shrink-0"
            aria-label="Kirim pesan"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
