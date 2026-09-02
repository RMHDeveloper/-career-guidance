import React, { useEffect, useRef, useState } from 'react';
import Box from './common/Box';
import { CareerRoadmap, ChatMessage } from '../types';
import { askFollowUp } from '../services/geminiService';

interface FollowUpChatProps {
  roadmap: CareerRoadmap;
}

const SUGGESTIONS = [
  'Is this realistic if I have no experience?',
  'What if I can only use free resources?',
  'Which skill should I learn first?',
  'What entry-level job titles should I search for?',
];

const FollowUpChat: React.FC<FollowUpChatProps> = ({ roadmap }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || loading) return;

    const history = messages;
    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setInput('');
    setError(null);
    setLoading(true);

    try {
      const answer = await askFollowUp(roadmap, trimmed, history);
      setMessages((prev) => [...prev, { role: 'model', text: answer }]);
    } catch (err) {
      console.error(err);
      setError('Could not get an answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="flex flex-col brutalist-box no-print mt-8">
      <h2 className="heading-brutalist text-electric-yellow text-2xl sm:text-3xl mb-1">
        ASK ABOUT THIS ROADMAP
      </h2>
      <p className="text-gray-500 text-sm mb-4">
        Follow-up questions are answered using your roadmap as context.
      </p>

      {messages.length === 0 && !loading && (
        <div className="flex flex-wrap gap-2 mb-4">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="brutalist-input bg-gray-50 hover:bg-blue-50 text-sm text-blue-700 font-semibold px-3 py-2 text-left cursor-pointer transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {messages.length > 0 && (
        <div
          ref={scrollRef}
          className="flex flex-col gap-3 max-h-96 overflow-y-auto mb-4 pr-1"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[90%] px-4 py-3 rounded-2xl text-base whitespace-pre-wrap leading-relaxed ${
                m.role === 'user'
                  ? 'self-end bg-blue-600 text-white'
                  : 'self-start bg-gray-100 text-black'
              }`}
            >
              {m.text}
            </div>
          ))}
          {loading && (
            <div className="self-start bg-gray-100 text-gray-500 px-4 py-3 rounded-2xl text-base">
              Thinking&hellip;
            </div>
          )}
        </div>
      )}

      {error && <p className="text-red-600 font-semibold text-sm mb-3">{error}</p>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question..."
          className="brutalist-input bg-gray-50 text-black p-3 text-base w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="brutalist-button bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          SEND
        </button>
      </form>
    </Box>
  );
};

export default FollowUpChat;
