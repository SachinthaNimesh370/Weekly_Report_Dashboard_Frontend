import React, { useState } from 'react';
import { Sparkles, MessageSquare, X, Send, Bot, User, ChevronRight } from 'lucide-react';
import { AI_SUGGESTIONS } from '../data/mockData';

export function AiChatWidget({ currentUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `Hello ${currentUser.fullName.split(' ')[0]}! I am your Weekly Report AI Assistant. Ask me about team deliverables, recurring blockers, workload distribution, or submission status.`,
      time: 'Just now'
    }
  ]);

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulated RAG / Backend AI lookup
    setTimeout(() => {
      const match = AI_SUGGESTIONS.find(s => 
        query.toLowerCase().includes(s.query.toLowerCase().substring(0, 15)) ||
        s.query.toLowerCase().includes(query.toLowerCase().substring(0, 15))
      );

      let replyText = "";
      if (match) {
        replyText = match.response;
      } else if (query.toLowerCase().includes('blocker') || query.toLowerCase().includes('issue')) {
        replyText = AI_SUGGESTIONS[1].response;
      } else if (query.toLowerCase().includes('submit') || query.toLowerCase().includes('status') || query.toLowerCase().includes('who')) {
        replyText = AI_SUGGESTIONS[2].response;
      } else {
        replyText = `Based on reports for Week 37:\n• 4 out of 5 active team members submitted their reports.\n• 1 report (Maria Garcia) is in NEEDS_CORRECTION state.\n• 1 report (David Kim) has been APPROVED.\n• Alex Chen's report is awaiting manager review with 100% auth deliverables completed.`;
      }

      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 450);
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 900 }}>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 18px',
            borderRadius: '9999px',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            boxShadow: '0 10px 25px -5px rgba(37,99,235,0.4)',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.875rem',
            transition: 'transform 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
        >
          <Sparkles size={18} />
          <span>AI Report Assistant</span>
        </button>
      )}

      {/* Chat Popover Window */}
      {isOpen && (
        <div style={{
          width: '380px',
          height: '520px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 20px 30px -10px rgba(15,23,42,0.2), 0 0 0 1px rgba(15,23,42,0.08)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          {/* Header */}
          <div style={{
            padding: '14px 16px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Sparkles size={16} style={{ color: '#60a5fa' }} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Weekly Report Copilot</div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>RAG-Lite Report Synthesis</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#cbd5e1',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px'
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Prompt suggestions pills */}
          <div style={{
            padding: '8px 12px',
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            whiteSpace: 'nowrap'
          }}>
            <button
              onClick={() => handleSend("What did the backend team work on this week?")}
              style={{
                padding: '4px 8px',
                borderRadius: '9999px',
                fontSize: '0.725rem',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#334155',
                cursor: 'pointer'
              }}
            >
              🔍 Backend tasks
            </button>
            <button
              onClick={() => handleSend("Summarize open blockers across all projects")}
              style={{
                padding: '4px 8px',
                borderRadius: '9999px',
                fontSize: '0.725rem',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#334155',
                cursor: 'pointer'
              }}
            >
              ⚠️ Open blockers
            </button>
            <button
              onClick={() => handleSend("Who hasn't submitted their weekly report yet?")}
              style={{
                padding: '4px 8px',
                borderRadius: '9999px',
                fontSize: '0.725rem',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#334155',
                cursor: 'pointer'
              }}
            >
              📋 Compliance check
            </button>
          </div>

          {/* Chat Messages Body */}
          <div style={{
            flex: 1,
            padding: '14px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {messages.map((m) => {
              const isAi = m.sender === 'ai';
              return (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    gap: '8px',
                    alignSelf: isAi ? 'flex-start' : 'flex-end',
                    maxWidth: '88%'
                  }}
                >
                  {isAi && (
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#eff6ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#2563eb',
                      flexShrink: 0
                    }}>
                      <Bot size={14} />
                    </div>
                  )}

                  <div>
                    <div style={{
                      padding: '10px 12px',
                      borderRadius: '12px',
                      fontSize: '0.8125rem',
                      lineHeight: '1.4',
                      backgroundColor: isAi ? '#f1f5f9' : '#2563eb',
                      color: isAi ? '#0f172a' : '#ffffff',
                      borderBottomLeftRadius: isAi ? '2px' : '12px',
                      borderBottomRightRadius: isAi ? '12px' : '2px',
                      whiteSpace: 'pre-line'
                    }}>
                      {m.text}
                    </div>
                    <div style={{
                      fontSize: '0.675rem',
                      color: '#94a3b8',
                      marginTop: '3px',
                      textAlign: isAi ? 'left' : 'right'
                    }}>
                      {m.time}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Input Bar */}
          <div style={{
            padding: '10px 12px',
            borderTop: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            display: 'flex',
            gap: '8px'
          }}>
            <input
              type="text"
              className="form-input"
              style={{ fontSize: '0.8125rem', padding: '7px 10px' }}
              placeholder="Ask about weekly reports..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
            />
            <button
              onClick={() => handleSend()}
              className="btn btn-primary"
              style={{ padding: '0 12px' }}
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
