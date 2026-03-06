'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Sparkles,
  ArrowRight,
  Database,
  History,
  Info
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { supabase } from '@/lib/supabase';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  actions?: any[];
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: "Halo! Saya adalah AI Assistant untuk AssetFlow. Saya bisa membantu Anda mencari informasi aset, melihat riwayat penugasan, atau memberikan ringkasan inventaris. Apa yang ingin Anda ketahui hari ini?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchAssetContext = async () => {
    try {
      // Fetch assets with department names
      const { data: assets, error: assetError } = await supabase
        .from('assets')
        .select('*, departments(name)');
      
      if (assetError) throw assetError;

      // Fetch recent history
      const { data: history, error: historyError } = await supabase
        .from('asset_history')
        .select('*, assets(asset_name)')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (historyError) throw historyError;

      // Summarize data for context
      const assetSummary = assets?.map(a => ({
        id: a.id,
        name: a.asset_name,
        category: a.category,
        status: a.status,
        assigned_to: a.assigned_to,
        department: a.departments?.name,
        serial: a.serial_number
      }));

      const historySummary = history?.map(h => ({
        asset: h.assets?.asset_name,
        action: h.action_type,
        desc: h.description,
        date: h.created_at
      }));

      return {
        assets: assetSummary,
        history: historySummary
      };
    } catch (err) {
      console.error('Error fetching context:', err);
      return null;
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const context = await fetchAssetContext();
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      
      if (!apiKey) {
        throw new Error("Gemini API Key is missing. Please configure it in your environment.");
      }

      const genAI = new GoogleGenAI({ apiKey });
      
      const result = await genAI.models.generateContent({ 
        model: "gemini-3-flash-preview",
        contents: [{ parts: [{ text: userMessage }] }],
        config: {
          systemInstruction: `You are an expert IT Asset Management Assistant for AssetFlow.
          Context about the current inventory: ${JSON.stringify(context)}
          
          Instructions for Formatting (CRITICAL):
          1. Use clear HEADINGS (###) for different sections of your answer.
          2. Use DOUBLE LINE BREAKS between paragraphs and sections to create clear whitespace.
          3. Use BULLET POINTS (unordered lists) for listing assets or details.
          4. Use BOLD text for important terms, asset names, or IDs.
          5. If providing a summary, use a structured format with sections like:
             ### Ringkasan Inventaris
             [Isi ringkasan...]
             
             ### Detail Aset
             [Isi detail...]
          6. Ensure the output is "super neat" and easy to read "per session/section".
          7. Use a professional, helpful, and organized tone.
          
          Language: Indonesian (Bahasa Indonesia).`
        }
      });
      const response = result.text || "Maaf, saya tidak bisa memberikan jawaban saat ini.";

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err: any) {
      console.error('AI Error:', err);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Maaf, terjadi kesalahan: ${err.message || 'Gagal menghubungi AI.'}` 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-100 flex items-center gap-3">
          <Sparkles className="text-emerald-400" size={32} />
          AI Assistant
        </h1>
        <p className="text-zinc-500 mt-2 text-lg">Tanyakan apa saja tentang inventaris aset IT Anda.</p>
      </div>

      <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <Bot size={18} />
                  </div>
                )}
                
                <div className={`max-w-[85%] rounded-2xl px-6 py-4 ${
                  msg.role === 'assistant' 
                    ? 'bg-zinc-800/50 text-zinc-200 border border-zinc-700/50 backdrop-blur-sm shadow-xl' 
                    : 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20'
                }`}>
                  <div className="prose prose-invert prose-emerald max-w-none 
                    prose-p:leading-relaxed prose-p:mb-6 
                    prose-headings:mb-4 prose-headings:mt-6 first:prose-headings:mt-0
                    prose-ul:my-4 prose-li:my-2
                    prose-strong:text-emerald-400 prose-strong:font-bold">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 shrink-0">
                    <User size={18} />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <div className="flex gap-4 justify-start">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Bot size={18} className="animate-pulse" />
              </div>
              <div className="bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 flex items-center gap-2">
                <Loader2 size={14} className="animate-spin text-emerald-500" />
                <span className="text-xs text-zinc-500 font-medium">Berpikir...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
          <div className="relative flex items-center">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Tanyakan tentang aset, misal: 'Berapa banyak laptop yang tersedia?'"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl pl-4 pr-14 py-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-inner"
            />
            <button 
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="absolute right-2 p-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow-lg shadow-emerald-900/20"
            >
              <Send size={20} />
            </button>
          </div>
          <div className="mt-3 flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
            <QuickAction label="Ringkasan Inventaris" onClick={() => setInput("Berikan ringkasan inventaris lengkap dengan kategori dan statusnya.")} />
            <QuickAction label="Cek Laptop" onClick={() => setInput("Tampilkan daftar semua Laptop yang tersedia dan siapa yang terakhir menggunakannya.")} />
            <QuickAction label="Aktivitas Terbaru" onClick={() => setInput("Apa saja 5 aktivitas terbaru di sistem ini? Jelaskan dengan detail.")} />
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickAction({ label, onClick }: { label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="whitespace-nowrap px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-[10px] font-bold text-zinc-400 uppercase tracking-wider transition-all"
    >
      {label}
    </button>
  );
}
