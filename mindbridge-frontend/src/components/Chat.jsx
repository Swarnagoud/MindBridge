import { useState, useEffect, useRef } from 'react';
import { Send, BarChart3, Lightbulb, Phone, X, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import CrisisPopup from './CrisisPopup';
import { useLanguage } from '../context/LanguageContext';

const Chat = () => {
  const { t, language } = useLanguage();
  const nudgeConfig = {
    stress: {
      message: t('chat.nudgeStress'),
      suggestions: [
        { label: t('chat.logMood'), to: '/mood', icon: BarChart3 },
        { label: t('chat.viewTips'), to: '/recommendations', icon: Lightbulb },
      ]
    },
    anxiety: {
      message: t('chat.nudgeAnxiety'),
      suggestions: [
        { label: t('chat.logMood'), to: '/mood', icon: BarChart3 },
        { label: t('chat.viewTips'), to: '/recommendations', icon: Lightbulb },
      ]
    },
    sadness: {
      message: t('chat.nudgeSadness'),
      suggestions: [
        { label: t('chat.logMood'), to: '/mood', icon: BarChart3 },
        { label: t('chat.talkToSomeone'), to: '/tele-counseling', icon: Phone },
      ]
    },
  };
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCrisis, setShowCrisis] = useState(false);
  const [nudge, setNudge] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setNudge(null);

    try {
      const response = await api.chat(input, token, language);
      const aiMessage = { text: response.response, sender: 'ai', sentiment: response.sentiment };
      setMessages(prev => [...prev, aiMessage]);
      if (response.sentiment === 'crisis') {
        setShowCrisis(true);
      } else if (nudgeConfig[response.sentiment]) {
        setNudge(nudgeConfig[response.sentiment]);
      }
    } catch {
      setMessages(prev => [...prev, { text: t('chat.retryMessage'), sender: 'ai' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    {/* `pb-24` keeps the fixed mobile BottomNav from covering the input box. */}
    <div className="flex flex-col h-[calc(100dvh-8rem)] max-w-3xl mx-auto pb-24 md:pb-0">
      {/* Header */}
      <div className="card mb-3 flex items-center gap-3 py-3">
        <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center">
          <Heart className="w-4 h-4 text-white" />
        </div>
        <div>
            <p className="font-semibold text-gray-700 text-sm">{t('chat.title')}</p>
          <p className="text-xs text-green-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse-soft" />
            {t('chat.status')}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-3 px-1 pb-2">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
            <div className="text-5xl mb-4">🌿</div>
            <p className="text-gray-600 font-medium">{t('chat.greeting')}</p>
            <p className="text-gray-400 text-sm mt-1 max-w-xs">{t('chat.safeSpace')}</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex animate-message ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'ai' && (
              <div className="w-7 h-7 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center mr-2 mt-1 shrink-0">
                <Heart className="w-3.5 h-3.5 text-white" />
              </div>
            )}
            <div className={`max-w-[75%] px-4 py-3 rounded-3xl text-sm leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-lg'
                : 'bg-white shadow-soft text-gray-700 rounded-bl-lg'
            }`}>
              <p>{msg.text}</p>
              {msg.sentiment && msg.sentiment !== 'neutral' && msg.sentiment !== 'crisis' && (
                <span className={`text-[10px] mt-1.5 block font-medium capitalize opacity-70`}>
                  {msg.sender === 'ai' ? `${t('chat.detected')}: ${msg.sentiment}` : ''}
                </span>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-end gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center shrink-0">
              <Heart className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="bg-white shadow-soft px-4 py-3 rounded-3xl rounded-bl-lg">
              <div className="flex gap-1 items-center h-4">
                {[0, 0.2, 0.4].map((delay, i) => (
                  <div key={i} className="w-2 h-2 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: `${delay}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Nudge */}
      {nudge && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 mb-2 flex items-center justify-between gap-3 animate-slide-up">
          <div className="flex items-center gap-3 flex-wrap">
            <p className="text-xs text-blue-700 font-medium">{nudge.message}</p>
            <div className="flex gap-2 flex-wrap">
              {nudge.suggestions.map(({ label, to, icon: Icon }) => (
                <Link key={to} to={to} className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-white rounded-full shadow-soft border border-blue-100 text-blue-600 hover:bg-blue-50 transition-colors">
                  <Icon className="w-3 h-3" /> {label}
                </Link>
              ))}
            </div>
          </div>
          <button onClick={() => setNudge(null)} className="text-blue-300 hover:text-blue-500 shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Input */}
      <div className="card py-3 flex items-end gap-2">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={t('chat.placeholder')}
          rows={1}
          className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent placeholder-gray-400 transition-all"
          style={{ maxHeight: '120px' }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center hover:from-blue-600 hover:to-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {showCrisis && <CrisisPopup onClose={() => setShowCrisis(false)} />}
    </div>
  );
};

export default Chat;
