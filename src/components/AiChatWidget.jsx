import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, MessageSquare, X, Send, Bot, User, ChevronRight, Loader2 } from 'lucide-react';
import { aiApi } from '../api/aiApi';

// Helper component to render clean markdown (bold, lists, headers, code, hr) without raw asterisks
function renderInlineMarkdown(str, isUser = false) {
  if (!str) return '';
  const tokenRegex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = tokenRegex.exec(str)) !== null) {
    if (match.index > lastIndex) {
      parts.push(str.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={key++} style={{ fontWeight: 700, color: isUser ? '#ffffff' : '#0f172a' }}>
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code
          key={key++}
          style={{
            backgroundColor: isUser ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.06)',
            color: isUser ? '#ffffff' : '#0369a1',
            padding: '1px 5px',
            borderRadius: '4px',
            fontSize: '0.85em',
            fontFamily: 'monospace'
          }}
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={key++} style={{ fontStyle: 'italic' }}>
          {token.slice(1, -1)}
        </em>
      );
    }
    lastIndex = match.index + token.length;
  }

  if (lastIndex < str.length) {
    parts.push(str.substring(lastIndex));
  }

  return parts.length > 0 ? parts : str;
}

function FormattedMessage({ text, isUser = false }) {
  if (!text) return null;
  if (isUser) {
    return <span>{text}</span>;
  }

  const lines = text.split('\n');
  const elements = [];
  let currentList = [];

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} style={{ margin: '4px 0 8px 18px', padding: 0 }}>
          {currentList.map((item, idx) => (
            <li key={idx} style={{ marginBottom: '4px', listStyleType: 'disc', lineHeight: '1.45' }}>
              {renderInlineMarkdown(item, isUser)}
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((rawLine, idx) => {
    const line = rawLine.trim();

    // Horizontal Rule: --- or ***
    if (line === '---' || line === '***') {
      flushList();
      elements.push(
        <hr key={`hr-${idx}`} style={{ border: 'none', borderTop: '1px solid #cbd5e1', margin: '10px 0' }} />
      );
      return;
    }

    // Headings (#### or ### or ##)
    if (line.startsWith('#### ')) {
      flushList();
      elements.push(
        <div key={`h4-${idx}`} style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1e293b', marginTop: '8px', marginBottom: '4px' }}>
          {renderInlineMarkdown(line.replace(/^####\s+/, ''), isUser)}
        </div>
      );
      return;
    }

    if (line.startsWith('### ')) {
      flushList();
      elements.push(
        <div key={`h3-${idx}`} style={{ fontWeight: 700, fontSize: '0.925rem', color: '#0f172a', marginTop: '10px', marginBottom: '4px' }}>
          {renderInlineMarkdown(line.replace(/^###\s+/, ''), isUser)}
        </div>
      );
      return;
    }

    if (line.startsWith('## ')) {
      flushList();
      elements.push(
        <div key={`h2-${idx}`} style={{ fontWeight: 800, fontSize: '0.975rem', color: '#0f172a', marginTop: '12px', marginBottom: '6px' }}>
          {renderInlineMarkdown(line.replace(/^##\s+/, ''), isUser)}
        </div>
      );
      return;
    }

    // Bullet / numbered list item: "* ", "- ", "• " or "1. "
    const bulletMatch = line.match(/^([*\-•]|\d+\.)\s+(.*)/);
    if (bulletMatch) {
      currentList.push(bulletMatch[2]);
      return;
    }

    // Empty line
    if (!line) {
      flushList();
      elements.push(<div key={`spacer-${idx}`} style={{ height: '6px' }} />);
      return;
    }

    // Regular paragraph
    flushList();
    elements.push(
      <p key={`p-${idx}`} style={{ margin: '0 0 6px 0', lineHeight: '1.45' }}>
        {renderInlineMarkdown(line, isUser)}
      </p>
    );
  });

  flushList();
  return <div style={{ wordBreak: 'break-word' }}>{elements}</div>;
}

export function AiChatWidget({ currentUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const userName = currentUser?.fullName ? currentUser.fullName.split(' ')[0] : 'there';

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `Hello ${userName}! 👋 I am your Sisenco AI Assistant powered by Google Gemini. How can I help you today with team activity, blockers, or reporting workflows?`,
      time: 'Just now'
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  // Section 8: AI Chat Assistant is reserved for Managers & Admins for team-wide Q&A and blocker synthesis
  const isManagerOrAdmin = currentUser?.role === 'ROLE_MANAGER' || currentUser?.role === 'ROLE_ADMIN';
  if (!currentUser || !isManagerOrAdmin) return null;

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await aiApi.sendMessage(query.trim());
      const replyText = response?.reply || (typeof response === 'string' ? response : 'I processed your request, but received an empty response.');

      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: replyText,
        model: response?.model || 'gemini-3.8-flash',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('Failed to get AI response:', err);
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: `⚠️ I encountered an issue connecting to the AI service: ${err.message || 'Server error'}. Please verify backend connection.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
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
          width: '390px',
          height: '540px',
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
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(37, 99, 235, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Sparkles size={17} style={{ color: '#60a5fa' }} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Sisenco AI Copilot</span>
                  <span style={{
                    fontSize: '0.625rem',
                    padding: '1px 6px',
                    borderRadius: '9999px',
                    backgroundColor: '#1e293b',
                    color: '#93c5fd',
                    border: '1px solid #3b82f6'
                  }}>
                    Gemini 3.8
                  </span>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Live RAG Context • Reports & Blockers</div>
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
              onClick={() => handleSend("Summarize team progress across all projects this week")}
              disabled={isLoading}
              style={{
                padding: '4px 9px',
                borderRadius: '9999px',
                fontSize: '0.725rem',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#334155',
                cursor: 'pointer'
              }}
            >
              📊 Progress summary
            </button>
            <button
              onClick={() => handleSend("What are the critical blockers reported by the team?")}
              disabled={isLoading}
              style={{
                padding: '4px 9px',
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
              onClick={() => handleSend("What active enterprise projects are currently being tracked?")}
              disabled={isLoading}
              style={{
                padding: '4px 9px',
                borderRadius: '9999px',
                fontSize: '0.725rem',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#334155',
                cursor: 'pointer'
              }}
            >
              🚀 Active projects
            </button>
            <button
              onClick={() => handleSend("How do I submit and edit my personal weekly report?")}
              disabled={isLoading}
              style={{
                padding: '4px 9px',
                borderRadius: '9999px',
                fontSize: '0.725rem',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#334155',
                cursor: 'pointer'
              }}
            >
              📝 How to report
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
                    maxWidth: '90%'
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
                      padding: '10px 13px',
                      borderRadius: '12px',
                      fontSize: '0.8125rem',
                      lineHeight: '1.45',
                      backgroundColor: isAi ? '#f1f5f9' : '#2563eb',
                      color: isAi ? '#0f172a' : '#ffffff',
                      borderBottomLeftRadius: isAi ? '2px' : '12px',
                      borderBottomRightRadius: isAi ? '12px' : '2px',
                      wordBreak: 'break-word'
                    }}>
                      <FormattedMessage text={m.text} isUser={!isAi} />
                    </div>
                    <div style={{
                      fontSize: '0.65rem',
                      color: '#94a3b8',
                      marginTop: '3px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      justifyContent: isAi ? 'flex-start' : 'flex-end'
                    }}>
                      <span>{m.time}</span>
                      {isAi && m.model && (
                        <span style={{ color: '#64748b' }}>• {m.model}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Thinking / Loading indicator */}
            {isLoading && (
              <div style={{ display: 'flex', gap: '8px', alignSelf: 'flex-start', maxWidth: '85%' }}>
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
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '12px',
                  borderBottomLeftRadius: '2px',
                  fontSize: '0.8rem',
                  backgroundColor: '#f1f5f9',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Loader2 size={14} className="spin" />
                  <span>Gemini is analyzing reports...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
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
              placeholder={isLoading ? "Please wait..." : "Ask about weekly reports, blockers, tasks..."}
              value={input}
              disabled={isLoading}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="btn btn-primary"
              style={{ padding: '0 12px', opacity: (isLoading || !input.trim()) ? 0.6 : 1 }}
            >
              {isLoading ? <Loader2 size={15} className="spin" /> : <Send size={15} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
