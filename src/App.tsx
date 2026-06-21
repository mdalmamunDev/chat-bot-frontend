import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const suggestedPrompts = [
  'Explain quantum computing simply',
  'Write a professional email',
  'Brainstorm startup ideas',
  'Plan a healthy weekly routine',
];

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const aiReply = (userMessage: string) => {
    const lower = userMessage.toLowerCase();
    if (lower.includes('quantum')) {
      return "Quantum computing uses qubits, which—unlike regular bits—can be both 0 and 1 at once (superposition). This lets quantum computers explore many possibilities simultaneously, making them powerful for certain problems like cryptography and molecular simulation.";
    }
    if (lower.includes('email')) {
      return "Here's a clean template:\n\nSubject: Following Up\n\nHi [Name],\n\nThank you for your time. I wanted to follow up regarding [topic] and share a few thoughts.\n\nPlease let me know if you'd like to discuss further. I appreciate your consideration.\n\nBest regards,\n[Your Name]";
    }
    if (lower.includes('startup') || lower.includes('idea')) {
      return "Here are a few startup ideas worth exploring:\n\n1. AI-powered personal finance coach\n2. Sustainable packaging marketplace\n3. Remote team wellness platform\n4. Local skill-sharing network\n5. Smart meal-planning assistant\n\nWant me to expand on any of these?";
    }
    if (lower.includes('routine') || lower.includes('plan')) {
      return "A balanced weekly routine:\n\n• Mon–Fri: 30 min morning movement + focused deep work blocks\n• Tue/Thu: Strength training\n• Wed: Light cardio or a walk\n• Weekend: One rest day + one active hobby\n\nConsistency matters more than intensity. Start small and build up.";
    }
    return "Great question. Here's a clear way to think about it: break the problem into smaller parts, identify what matters most, and tackle each step one at a time. Let me know if you'd like me to go deeper on any specific point.";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    await new Promise((r) => setTimeout(r, 1000));

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: 'assistant', content: aiReply(userMessage.content) },
    ]);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-screen flex-col bg-white text-zinc-900">
      {/* Header */}
      <header className="flex h-16 items-center justify-center border-b border-zinc-100">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-900">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight">NativeMind</span>
        </div>
      </header>

      {/* Chat area */}
      <main ref={chatRef} className="flex-1 overflow-y-auto">
        {isEmpty ? (
          <div className="flex h-full flex-col items-center justify-center px-6">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">How can I help you today?</h1>
            <p className="mt-2 text-sm text-zinc-500">Ask me anything, or try one of these:</p>
            <div className="mt-8 grid w-full max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => {
                    setInput(prompt);
                    inputRef.current?.focus();
                  }}
                  className="rounded-2xl border border-zinc-200 px-4 py-3 text-left text-sm text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] whitespace-pre-wrap rounded-3xl px-5 py-3 text-[15px] leading-relaxed ${
                    message.role === 'user'
                      ? 'rounded-br-md bg-zinc-900 text-white'
                      : 'rounded-bl-md bg-zinc-100 text-zinc-900'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="rounded-3xl rounded-bl-md bg-zinc-100 px-5 py-4">
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Input */}
      <footer className="border-t border-zinc-100 px-4 py-4">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-end gap-2 rounded-3xl border border-zinc-200 bg-white p-2 pl-5 shadow-sm transition-colors focus-within:border-zinc-400">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Message NativeMind..."
              className="max-h-40 flex-1 resize-none border-0 bg-transparent py-2.5 text-[15px] placeholder:text-zinc-400 focus:outline-none focus:ring-0"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-zinc-900 text-white transition-all hover:bg-zinc-700 disabled:bg-zinc-200 disabled:text-zinc-400"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-3 text-center text-xs text-zinc-400">
            NativeMind can make mistakes. Consider checking important information.
          </p>
        </div>
      </footer>
    </div>
  );
}
