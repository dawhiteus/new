import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Plus, Download, Clock, X, Copy } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

type Screen = 1 | 2 | 3 | 4;

export function LiquidAI() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(1);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [showDenverTooltip, setShowDenverTooltip] = useState(false);
  const [showCostTooltip, setShowCostTooltip] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentScreen]);

  const handleCopyDraft = () => {
    const draftText = "Hi Marcus — your team's LiquidSpace program has been live for several months but engagement is still low. Activating your account is the first step — it lets you see your team's budget and booking activity. Takes 2 minutes: [activate link]. Happy to walk through it. — David";
    navigator.clipboard.writeText(draftText);
    setCopiedToClipboard(true);
    setTimeout(() => setCopiedToClipboard(false), 2000);
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#F1F3F4', fontFamily: "'DM Sans', sans-serif" }}>
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <div className="h-12 flex items-center px-5 gap-3 flex-shrink-0" style={{ backgroundColor: '#1a5276' }}>
          <button 
            className="flex items-center gap-1 px-2 py-1 rounded text-white/70 hover:text-white transition-all"
            style={{ fontSize: '12px', backgroundColor: 'transparent' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Dashboard</span>
          </button>
          <div className="w-px h-4" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}></div>
          <div className="flex items-center gap-2">
            <Badge 
              className="flex items-center gap-1 text-white border-0"
              style={{ 
                backgroundColor: '#6c5ce7', 
                fontSize: '10px', 
                fontWeight: 600, 
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                paddingLeft: '7px',
                paddingRight: '7px'
              }}
            >
              <div 
                className="w-1.5 h-1.5 rounded-full" 
                style={{ 
                  backgroundColor: '#a0f0a0',
                  animation: 'pulse 2s ease-in-out infinite'
                }}
              ></div>
              Co-Pilot
            </Badge>
            <span className="text-white font-semibold" style={{ fontSize: '14px' }}>
              Portfolio Intelligence
            </span>
          </div>
          <div className="ml-auto flex gap-1.5">
            <Button 
              variant="ghost" 
              size="sm"
              className="h-7 px-2 text-white/80 hover:text-white border-white/20"
              style={{ fontSize: '11px', backgroundColor: 'transparent' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.18)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <Plus className="h-3 w-3 mr-1" />
              New Session
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="h-7 px-2 text-white/80 hover:text-white border-white/20"
              style={{ fontSize: '11px', backgroundColor: 'transparent' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.18)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <Download className="h-3 w-3 mr-1" />
              Export
            </Button>
          </div>
        </div>

        {/* Context Bar */}
        <div className="bg-white border-b px-5 py-2 flex items-center gap-2.5 flex-shrink-0" style={{ borderColor: '#E8EAED' }}>
          <span 
            className="text-gray-400 font-semibold uppercase tracking-wide" 
            style={{ fontSize: '10px', letterSpacing: '0.05em' }}
          >
            Context
          </span>
          <Badge 
            className="flex items-center gap-1.5 border cursor-pointer hover:border-blue-600 transition-colors"
            style={{ 
              backgroundColor: '#d6eaf8',
              borderColor: '#2e86c1',
              color: '#154360',
              fontSize: '11.5px',
              fontWeight: 500,
              paddingLeft: '9px',
              paddingRight: '9px'
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#1e8449' }}></div>
            AT&T Enterprise · All Teams
          </Badge>
          <Badge 
            className="flex items-center gap-1.5 border bg-white cursor-pointer hover:border-blue-600 transition-colors"
            style={{ 
              borderColor: '#DADCE0',
              color: '#5f6368',
              fontSize: '11.5px',
              fontWeight: 500,
              paddingLeft: '9px',
              paddingRight: '9px'
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#2e86c1' }}></div>
            All Markets
          </Badge>
          <Badge 
            className="flex items-center gap-1.5 border cursor-pointer hover:border-blue-600 transition-colors"
            style={{ 
              backgroundColor: '#d6eaf8',
              borderColor: '#2e86c1',
              color: '#154360',
              fontSize: '11.5px',
              fontWeight: 500,
              paddingLeft: '9px',
              paddingRight: '9px'
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#e67e22' }}></div>
            January 2026
          </Badge>
          <div className="ml-auto text-gray-400" style={{ fontSize: '11px' }}>
            Data as of Feb 26, 2026 · 8:36 am
          </div>
        </div>

        {/* Three Column Layout */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          {/* Left: Conversation */}
          <div className="w-80 flex-shrink-0 bg-white border-r flex flex-col overflow-hidden" style={{ borderColor: '#E8EAED' }}>
            <div className="px-3.5 py-3 border-b flex items-center justify-between" style={{ borderColor: '#F1F3F4' }}>
              <span className="font-semibold text-gray-700" style={{ fontSize: '12px' }}>
                Conversation
              </span>
              <div className="flex gap-1">
                <button className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                  <Clock className="h-3 w-3" />
                </button>
                <button 
                  className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                  onClick={() => setCurrentScreen(1)}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 py-2.5 space-y-0.5">
              {/* Greeting Message */}
              <div className="py-1.5 px-3">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <div 
                      className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: '#6c5ce7', fontSize: '8px' }}
                    >
                      AI
                    </div>
                    <span className="font-semibold" style={{ fontSize: '11px', color: '#6c5ce7' }}>
                      Co-Pilot
                    </span>
                    <span className="ml-auto text-gray-400" style={{ fontSize: '10px' }}>
                      8:36 am
                    </span>
                  </div>
                  <div 
                    className="text-gray-700 mb-1.5"
                    style={{ fontSize: '12.5px', lineHeight: 1.6 }}
                  >
                    Good morning, David. I'm connected to your AT&T portfolio — 2,468 members across all teams. What would you like to explore today?
                  </div>
                  {currentScreen === 1 && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {['Team activity summary', 'Spend vs. budget', 'Flex hotspots'].map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentScreen(2)}
                          className="bg-white border rounded-full px-2 py-0.5 transition-all"
                          style={{ 
                            borderColor: '#d8d4fb',
                            color: '#6c5ce7',
                            fontSize: '11px',
                            fontWeight: 500
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#6c5ce7';
                            e.currentTarget.style.color = 'white';
                            e.currentTarget.style.borderColor = '#6c5ce7';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'white';
                            e.currentTarget.style.color = '#6c5ce7';
                            e.currentTarget.style.borderColor = '#d8d4fb';
                          }}
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Screen 2+ Messages */}
              {currentScreen >= 2 && (
                <>
                  {/* Q1 User */}
                  <div className="py-1.5 px-3">
                    <div 
                      className="rounded-lg border px-3 py-2"
                      style={{ 
                        backgroundColor: '#f0eeff',
                        borderColor: '#d8d4fb',
                        borderRadius: '10px 10px 3px 10px',
                        fontSize: '12.5px',
                        lineHeight: 1.5,
                        color: '#202124'
                      }}
                    >
                      Summarize activity across all teams for last month
                    </div>
                  </div>

                  {/* Q1 AI Response */}
                  <div className="py-1.5 px-3">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <div 
                          className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
                          style={{ backgroundColor: '#6c5ce7', fontSize: '8px' }}
                        >
                          AI
                        </div>
                        <span className="font-semibold" style={{ fontSize: '11px', color: '#6c5ce7' }}>
                          Co-Pilot
                        </span>
                        <span className="ml-auto text-gray-400" style={{ fontSize: '10px' }}>
                          8:37 am
                        </span>
                      </div>
                      <div 
                        className="text-gray-700 mb-1.5"
                        style={{ fontSize: '12.5px', lineHeight: 1.6 }}
                      >
                        In January, 1,333 active members made 4,218 reservations across 8 active teams — up 11% from December. AT&T General and LS Management account for 71% of all activity. Three teams are below 20% engagement and haven't meaningfully used the program since onboarding. I've surfaced the full breakdown in the canvas. Want me to drill into any specific team?
                      </div>
                      {currentScreen === 2 && (
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {[
                            { label: 'Low-engagement teams', action: () => setCurrentScreen(3) },
                            { label: 'AT&T General detail', action: () => setCurrentScreen(3) },
                            { label: 'Spend vs. budget', action: () => setCurrentScreen(4) }
                          ].map((item, idx) => (
                            <button
                              key={idx}
                              onClick={item.action}
                              className="bg-white border rounded-full px-2 py-0.5 transition-all"
                              style={{ 
                                borderColor: '#d8d4fb',
                                color: '#6c5ce7',
                                fontSize: '11px',
                                fontWeight: 500
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#6c5ce7';
                                e.currentTarget.style.color = 'white';
                                e.currentTarget.style.borderColor = '#6c5ce7';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'white';
                                e.currentTarget.style.color = '#6c5ce7';
                                e.currentTarget.style.borderColor = '#d8d4fb';
                              }}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Screen 3+ Messages */}
              {currentScreen >= 3 && (
                <>
                  {/* Q2 User */}
                  <div className="py-1.5 px-3">
                    <div 
                      className="rounded-lg border px-3 py-2"
                      style={{ 
                        backgroundColor: '#f0eeff',
                        borderColor: '#d8d4fb',
                        borderRadius: '10px 10px 3px 10px',
                        fontSize: '12.5px',
                        lineHeight: 1.5,
                        color: '#202124'
                      }}
                    >
                      Which 3 teams have low engagement?
                    </div>
                  </div>

                  {/* Q2 AI Response */}
                  <div className="py-1.5 px-3">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <div 
                          className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
                          style={{ backgroundColor: '#6c5ce7', fontSize: '8px' }}
                        >
                          AI
                        </div>
                        <span className="font-semibold" style={{ fontSize: '11px', color: '#6c5ce7' }}>
                          Co-Pilot
                        </span>
                        <span className="ml-auto text-gray-400" style={{ fontSize: '10px' }}>
                          8:38 am
                        </span>
                      </div>
                      <div 
                        className="text-gray-700 mb-1.5"
                        style={{ fontSize: '12.5px', lineHeight: 1.6 }}
                      >
                        The three lowest-engagement teams are Denver Field (9%), Chicago Remote (14%), and NY East (18%). All three were enrolled 3–5 months ago. Denver Field has had zero bookings since November — their team lead hasn't activated either. This pattern usually points to one of two things: no nearby locations that match their work style, or the team lead never drove adoption. Worth a quick check on location coverage before assuming it's a program issue.
                      </div>
                      {currentScreen === 3 && (
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {[
                            { label: 'Denver coverage', action: () => setShowDenverTooltip(true) },
                            { label: 'Spend vs. budget', action: () => setCurrentScreen(4) },
                            { label: 'Draft nudge →', action: () => setShowDraftModal(true) }
                          ].map((item, idx) => (
                            <button
                              key={idx}
                              onClick={item.action}
                              className="bg-white border rounded-full px-2 py-0.5 transition-all"
                              style={{ 
                                borderColor: '#d8d4fb',
                                color: '#6c5ce7',
                                fontSize: '11px',
                                fontWeight: 500
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#6c5ce7';
                                e.currentTarget.style.color = 'white';
                                e.currentTarget.style.borderColor = '#6c5ce7';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'white';
                                e.currentTarget.style.color = '#6c5ce7';
                                e.currentTarget.style.borderColor = '#d8d4fb';
                              }}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Screen 4 Messages */}
              {currentScreen >= 4 && (
                <>
                  {/* Q3 User */}
                  <div className="py-1.5 px-3">
                    <div 
                      className="rounded-lg border px-3 py-2"
                      style={{ 
                        backgroundColor: '#f0eeff',
                        borderColor: '#d8d4fb',
                        borderRadius: '10px 10px 3px 10px',
                        fontSize: '12.5px',
                        lineHeight: 1.5,
                        color: '#202124'
                      }}
                    >
                      Compare spend to budget for January
                    </div>
                  </div>

                  {/* Q3 AI Response */}
                  <div className="py-1.5 px-3">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <div 
                          className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
                          style={{ backgroundColor: '#6c5ce7', fontSize: '8px' }}
                        >
                          AI
                        </div>
                        <span className="font-semibold" style={{ fontSize: '11px', color: '#6c5ce7' }}>
                          Co-Pilot
                        </span>
                        <span className="ml-auto text-gray-400" style={{ fontSize: '10px' }}>
                          8:39 am
                        </span>
                      </div>
                      <div 
                        className="text-gray-700 mb-1.5"
                        style={{ fontSize: '12.5px', lineHeight: 1.6 }}
                      >
                        January came in at $341K against a $322K budget — 5.9% over. AT&T General and LS Management are the two teams driving the overage. Worth noting: Patrick Henkel's individual spend of $47K in January represents 39% of AT&T General's total — he's within policy but accounts for a significant portion of the variance. The three low-engagement teams are spending above their allocation relative to activity — fewer bookings but higher cost per reservation, suggesting a location mismatch.
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {[
                          { label: 'Why higher cost/res?', action: () => setShowCostTooltip(true) },
                          { label: 'Denver coverage', action: () => setShowDenverTooltip(true) },
                          { label: 'Draft nudge →', action: () => setShowDraftModal(true) }
                        ].map((item, idx) => (
                          <button
                            key={idx}
                            onClick={item.action}
                            className="bg-white border rounded-full px-2 py-0.5 transition-all"
                            style={{ 
                              borderColor: '#d8d4fb',
                              color: '#6c5ce7',
                              fontSize: '11px',
                              fontWeight: 500
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#6c5ce7';
                              e.currentTarget.style.color = 'white';
                              e.currentTarget.style.borderColor = '#6c5ce7';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'white';
                              e.currentTarget.style.color = '#6c5ce7';
                              e.currentTarget.style.borderColor = '#d8d4fb';
                            }}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t p-2.5 bg-white" style={{ borderColor: '#F1F3F4' }}>
              <div className="flex flex-wrap gap-1 mb-1.5">
                <button 
                  className="bg-gray-50 border rounded-full px-2 py-0.5 text-gray-600 hover:border-purple-600 hover:text-purple-600 hover:bg-purple-50 transition-all"
                  style={{ borderColor: '#E8EAED', fontSize: '11px' }}
                >
                  Draft Denver nudge
                </button>
                <button 
                  className="bg-gray-50 border rounded-full px-2 py-0.5 text-gray-600 hover:border-purple-600 hover:text-purple-600 hover:bg-purple-50 transition-all"
                  style={{ borderColor: '#E8EAED', fontSize: '11px' }}
                >
                  Denver coverage
                </button>
              </div>
              <div className="flex gap-1.5">
                <textarea
                  placeholder="Ask about your portfolio…"
                  className="flex-1 border rounded-lg px-2.5 py-2 text-gray-900 resize-none outline-none focus:border-purple-600 transition-colors"
                  style={{ 
                    borderColor: '#E8EAED',
                    fontSize: '12.5px',
                    minHeight: '34px',
                    maxHeight: '72px',
                    borderWidth: '1.5px'
                  }}
                  rows={1}
                />
                <button
                  className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#6c5ce7' }}
                >
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="2">
                    <line x1="2" y1="8" x2="14" y2="8"/>
                    <polyline points="9,3 14,8 9,13"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Center: Canvas */}
          <div className="flex-1 min-w-0 flex flex-col overflow-hidden" style={{ backgroundColor: '#F8F9FA' }}>
            <div className="bg-white border-b px-5 py-2.5 flex items-center justify-between flex-shrink-0" style={{ borderColor: '#E8EAED' }}>
              <div>
                <div className="font-semibold text-gray-900" style={{ fontSize: '13px' }}>
                  Team Activity — January 2026
                </div>
                <div className="text-gray-500" style={{ fontSize: '11px', marginTop: '1px' }}>
                  Visualizations update as the conversation develops
                </div>
              </div>
              <div className="flex gap-0">
                <button className="px-3 py-1 border-b-2 font-semibold" style={{ fontSize: '11.5px', color: '#1a5276', borderBottomColor: '#1a5276' }}>
                  Overview
                </button>
                <button className="px-3 py-1 text-gray-500 border-b-2 border-transparent hover:text-gray-900 transition-colors" style={{ fontSize: '11.5px' }}>
                  By Team
                </button>
                <button className="px-3 py-1 text-gray-500 border-b-2 border-transparent hover:text-gray-900 transition-colors" style={{ fontSize: '11.5px' }}>
                  Spend
                </button>
                <button className="px-3 py-1 text-gray-500 border-b-2 border-transparent hover:text-gray-900 transition-colors" style={{ fontSize: '11.5px' }}>
                  Engagement
                </button>
              </div>
            </div>

            {/* Canvas Body */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
              {/* Empty State - Screen 1 */}
              {currentScreen === 1 && (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center border-2 border-dashed rounded-lg p-12" style={{ borderColor: '#E8EAED' }}>
                    <div className="text-gray-500" style={{ fontSize: '14px' }}>
                      Ask a question to get started.
                    </div>
                    <div className="text-gray-400 mt-1" style={{ fontSize: '13px' }}>
                      Visualizations will appear here.
                    </div>
                  </div>
                </div>
              )}

              {/* Screen 2+ Cards */}
              {currentScreen >= 2 && (
                <>
                  {/* January Snapshot */}
                  <div 
                    className="bg-white rounded-lg border overflow-hidden animate-in fade-in slide-in-from-bottom-3" 
                    style={{ 
                      borderColor: '#E8EAED', 
                      boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                      animationDuration: '350ms',
                      animationTimingFunction: 'ease-out'
                    }}
                  >
                    <div className="px-4 py-3 border-b flex items-start justify-between" style={{ borderColor: '#F1F3F4' }}>
                      <div>
                        <div className="font-semibold text-gray-900" style={{ fontSize: '13px' }}>
                          January Snapshot
                        </div>
                        <div className="text-gray-500" style={{ fontSize: '11px', marginTop: '2px' }}>
                          All teams · Month of January 2026
                        </div>
                      </div>
                      <Badge 
                        className="border-0 mt-0.5"
                        style={{ 
                          backgroundColor: '#f0eeff',
                          color: '#6c5ce7',
                          fontSize: '10px',
                          fontWeight: 600,
                          paddingLeft: '7px',
                          paddingRight: '7px'
                        }}
                      >
                        AI Generated
                      </Badge>
                    </div>
                    <div className="px-4 py-3.5">
                      <div className="grid grid-cols-4 gap-2.5">
                        {[
                          { label: 'Reservations', value: '4,218', delta: '↑ 11% vs. Dec', color: '#1e8449' },
                          { label: 'Active Members', value: '1,333', delta: '54% engaged', color: '#2e86c1' },
                          { label: 'Total Spend', value: '$341K', delta: '↑ 6% vs. budget', color: '#e67e22' },
                          { label: 'Avg / Reservation', value: '$81', delta: '→ flat vs. Dec', color: '#9aa0a6' }
                        ].map((metric, idx) => (
                          <div key={idx} className="bg-gray-50 border rounded-lg px-3 py-2.5" style={{ borderColor: '#E8EAED' }}>
                            <div className="text-gray-500 mb-0.5" style={{ fontSize: '10.5px' }}>
                              {metric.label}
                            </div>
                            <div className="text-gray-900 font-semibold mb-0.5" style={{ fontSize: '20px', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                              {metric.value}
                            </div>
                            <div className="font-semibold" style={{ fontSize: '11px', color: metric.color }}>
                              {metric.delta}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Reservations by Team */}
                  <div 
                    className="bg-white rounded-lg border overflow-hidden animate-in fade-in slide-in-from-bottom-3" 
                    style={{ 
                      borderColor: '#E8EAED', 
                      boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                      animationDuration: '350ms',
                      animationTimingFunction: 'ease-out',
                      animationDelay: '80ms'
                    }}
                  >
                    <div className="px-4 py-3 border-b flex items-start justify-between" style={{ borderColor: '#F1F3F4' }}>
                      <div>
                        <div className="font-semibold text-gray-900" style={{ fontSize: '13px' }}>
                          Reservations by Team
                        </div>
                        <div className="text-gray-500" style={{ fontSize: '11px', marginTop: '2px' }}>
                          January 2026 · All active teams
                        </div>
                      </div>
                      <Badge 
                        className="border-0 mt-0.5"
                        style={{ 
                          backgroundColor: '#f0eeff',
                          color: '#6c5ce7',
                          fontSize: '10px',
                          fontWeight: 600,
                          paddingLeft: '7px',
                          paddingRight: '7px'
                        }}
                      >
                        AI Generated
                      </Badge>
                    </div>
                    <div className="px-4 py-3.5">
                      <div className="space-y-2">
                        {[
                          { label: 'AT&T General', value: 2241, members: 451, width: 100, color: '#1a5276' },
                          { label: 'AT&T LS Mgmt', value: 1014, members: 88, width: 54, color: '#2e86c1' },
                          { label: 'San Ramon', value: 530, members: 204, width: 28, color: '#5dade2' },
                          { label: 'BU Funded – Bishop', value: 290, members: 97, width: 16, color: '#85c1e9' },
                          { label: 'NY East', value: 103, eng: '18% eng.', width: 7, color: '#aed6f1', warn: true },
                          { label: 'Chicago Remote', value: 29, eng: '14% eng.', width: 4, color: '#f0c080', warn: true },
                          { label: 'Denver Field', value: 6, eng: '9% eng.', width: 1, color: '#f0a080', warn: true }
                        ].map((team, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="text-gray-600 flex-shrink-0 overflow-hidden text-ellipsis whitespace-nowrap" style={{ fontSize: '11.5px', width: '110px' }}>
                              {team.label}
                            </span>
                            <div className="flex-1 h-4.5 rounded overflow-hidden relative" style={{ backgroundColor: '#F1F3F4' }}>
                              <div 
                                className="h-full rounded transition-all duration-700"
                                style={{ width: `${team.width}%`, backgroundColor: team.color }}
                              ></div>
                            </div>
                            <div className="text-right flex-shrink-0" style={{ width: '48px' }}>
                              <div className="font-semibold text-gray-700" style={{ fontSize: '11.5px' }}>
                                {team.value}
                              </div>
                              <div className="text-gray-500" style={{ fontSize: '10px', color: team.warn ? '#c0392b' : '#9aa0a6' }}>
                                {team.eng || `${team.members} members`}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Screen 3+ Cards */}
              {currentScreen >= 3 && (
                <div 
                  className="bg-white rounded-lg border overflow-hidden animate-in fade-in slide-in-from-bottom-3" 
                  style={{ 
                    borderColor: '#E8EAED', 
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                    animationDuration: '350ms',
                    animationTimingFunction: 'ease-out',
                    animationDelay: '160ms'
                  }}
                >
                  <div className="px-4 py-3 border-b flex items-start justify-between" style={{ borderColor: '#F1F3F4' }}>
                    <div>
                      <div className="font-semibold text-gray-900" style={{ fontSize: '13px' }}>
                        Low-Engagement Teams
                      </div>
                      <div className="text-gray-500" style={{ fontSize: '11px', marginTop: '2px' }}>
                        Enrolled 3–5 months ago · Under 20% active
                      </div>
                    </div>
                    <Badge 
                      className="border mt-0.5"
                      style={{ 
                        backgroundColor: '#fef9e7',
                        color: '#e67e22',
                        borderColor: '#f0c080',
                        fontSize: '10px',
                        fontWeight: 600,
                        paddingLeft: '7px',
                        paddingRight: '7px'
                      }}
                    >
                      Action Recommended
                    </Badge>
                  </div>
                  <div className="p-0">
                    <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#F8F9FA' }}>
                          <th className="text-left text-gray-500 font-semibold px-2.5 py-1.5 uppercase tracking-wide" style={{ fontSize: '10.5px', letterSpacing: '0.04em' }}>Team</th>
                          <th className="text-left text-gray-500 font-semibold px-2.5 py-1.5 uppercase tracking-wide" style={{ fontSize: '10.5px', letterSpacing: '0.04em' }}>Members</th>
                          <th className="text-left text-gray-500 font-semibold px-2.5 py-1.5 uppercase tracking-wide" style={{ fontSize: '10.5px', letterSpacing: '0.04em' }}>Engaged</th>
                          <th className="text-left text-gray-500 font-semibold px-2.5 py-1.5 uppercase tracking-wide" style={{ fontSize: '10.5px', letterSpacing: '0.04em' }}>Last Booking</th>
                          <th className="text-left text-gray-500 font-semibold px-2.5 py-1.5 uppercase tracking-wide" style={{ fontSize: '10.5px', letterSpacing: '0.04em' }}>Lead Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { team: 'Denver Field', members: 41, engaged: '9%', lastBooking: 'Nov 12', leadStatus: 'Not activated', statusType: 'lo' },
                          { team: 'Chicago Remote', members: 68, engaged: '14%', lastBooking: 'Jan 3', leadStatus: 'Activated', statusType: 'mid' },
                          { team: 'NY East', members: 112, engaged: '18%', lastBooking: 'Jan 18', leadStatus: 'Activated', statusType: 'mid' }
                        ].map((row, idx) => (
                          <tr key={idx} className="border-b hover:bg-gray-50 transition-colors" style={{ borderColor: '#F1F3F4' }}>
                            <td className="px-2.5 py-2 text-gray-900 font-medium" style={{ fontSize: '12px' }}>{row.team}</td>
                            <td className="px-2.5 py-2 text-gray-700" style={{ fontSize: '12px' }}>{row.members}</td>
                            <td className="px-2.5 py-2">
                              <Badge 
                                className="border-0"
                                style={{ 
                                  backgroundColor: '#fdedec',
                                  color: '#c0392b',
                                  fontSize: '10px',
                                  fontWeight: 600,
                                  paddingLeft: '7px',
                                  paddingRight: '7px'
                                }}
                              >
                                {row.engaged}
                              </Badge>
                            </td>
                            <td className="px-2.5 py-2 text-gray-700" style={{ fontSize: '12px' }}>{row.lastBooking}</td>
                            <td className="px-2.5 py-2">
                              <Badge 
                                className="border-0"
                                style={{ 
                                  backgroundColor: row.statusType === 'lo' ? '#fdedec' : '#fef9e7',
                                  color: row.statusType === 'lo' ? '#c0392b' : '#e67e22',
                                  fontSize: '10px',
                                  fontWeight: 600,
                                  paddingLeft: '7px',
                                  paddingRight: '7px'
                                }}
                              >
                                {row.leadStatus}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="px-4 pb-3.5">
                    <div className="rounded-lg border flex gap-2 p-3" style={{ marginTop: '8px', backgroundColor: '#fef9e7', borderColor: '#f0c080' }}>
                      <span className="text-lg flex-shrink-0" style={{ marginTop: '1px' }}>⚠️</span>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 mb-0.5" style={{ fontSize: '12px' }}>
                          Denver Field: no bookings in 75 days
                        </div>
                        <div className="text-gray-700" style={{ fontSize: '12px', lineHeight: 1.5 }}>
                          Team lead (M. Kowalski) hasn't completed activation. Without lead adoption, team-level engagement is unlikely to recover without an outreach trigger.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Screen 4 Cards */}
              {currentScreen >= 4 && (
                <div 
                  className="bg-white rounded-lg border overflow-hidden animate-in fade-in slide-in-from-bottom-3" 
                  style={{ 
                    borderColor: '#E8EAED', 
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                    animationDuration: '350ms',
                    animationTimingFunction: 'ease-out',
                    animationDelay: '240ms'
                  }}
                >
                  <div className="px-4 py-3 border-b flex items-start justify-between" style={{ borderColor: '#F1F3F4' }}>
                    <div>
                      <div className="font-semibold text-gray-900" style={{ fontSize: '13px' }}>
                        Spend vs. Budget — January 2026
                      </div>
                      <div className="text-gray-500" style={{ fontSize: '11px', marginTop: '2px' }}>
                        All teams · Actuals vs. monthly allocation
                      </div>
                    </div>
                    <Badge 
                      className="border mt-0.5"
                      style={{ 
                        backgroundColor: '#fef9e7',
                        color: '#e67e22',
                        borderColor: '#f0c080',
                        fontSize: '10px',
                        fontWeight: 600,
                        paddingLeft: '7px',
                        paddingRight: '7px'
                      }}
                    >
                      2 Teams Over Budget
                    </Badge>
                  </div>
                  <div className="px-4 py-3.5">
                    <div className="grid grid-cols-3 gap-2.5 mb-3.5">
                      {[
                        { label: 'Budget (Jan)', value: '$322K', delta: 'Allocated', color: '#9aa0a6' },
                        { label: 'Actual Spend', value: '$341K', delta: '+$19K over', color: '#c0392b' },
                        { label: 'Variance', value: '+5.9%', delta: '2 teams driving', color: '#c0392b' }
                      ].map((metric, idx) => (
                        <div key={idx} className="bg-gray-50 border rounded-lg px-3 py-2.5" style={{ borderColor: '#E8EAED' }}>
                          <div className="text-gray-500 mb-0.5" style={{ fontSize: '10.5px' }}>
                            {metric.label}
                          </div>
                          <div className="font-semibold mb-0.5" style={{ fontSize: '20px', letterSpacing: '-0.02em', lineHeight: 1.1, color: idx === 2 ? '#c0392b' : '#202124' }}>
                            {metric.value}
                          </div>
                          <div className="font-semibold" style={{ fontSize: '11px', color: metric.color }}>
                            {metric.delta}
                          </div>
                        </div>
                      ))}
                    </div>

                    <table className="w-full mb-2.5" style={{ borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#F8F9FA' }}>
                          <th className="text-left text-gray-500 font-semibold px-2.5 py-1.5 uppercase tracking-wide" style={{ fontSize: '10.5px', letterSpacing: '0.04em' }}>Team</th>
                          <th className="text-left text-gray-500 font-semibold px-2.5 py-1.5 uppercase tracking-wide" style={{ fontSize: '10.5px', letterSpacing: '0.04em' }}>Budget</th>
                          <th className="text-left text-gray-500 font-semibold px-2.5 py-1.5 uppercase tracking-wide" style={{ fontSize: '10.5px', letterSpacing: '0.04em' }}>Actual</th>
                          <th className="text-left text-gray-500 font-semibold px-2.5 py-1.5 uppercase tracking-wide" style={{ fontSize: '10.5px', letterSpacing: '0.04em' }}>Variance</th>
                          <th className="text-left text-gray-500 font-semibold px-2.5 py-1.5 uppercase tracking-wide" style={{ fontSize: '10.5px', letterSpacing: '0.04em' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { team: 'AT&T General', budget: '$180K', actual: '$192K', variance: '+$12K', varColor: '#c0392b', status: 'Over', statusType: 'lo' },
                          { team: 'AT&T LS Mgmt', budget: '$68K', actual: '$75K', variance: '+$7K', varColor: '#c0392b', status: 'Over', statusType: 'lo' },
                          { team: 'San Ramon', budget: '$44K', actual: '$42K', variance: '–$2K', varColor: '#1e8449', status: 'Under', statusType: 'hi' },
                          { team: 'BU Funded – Bishop', budget: '$24K', actual: '$21K', variance: '–$3K', varColor: '#1e8449', status: 'Under', statusType: 'hi' },
                          { team: 'NY East / Chicago / Denver', budget: '$6K', actual: '$11K', variance: '+$5K', varColor: '#5f6368', status: 'Marginal', statusType: 'mid' }
                        ].map((row, idx) => (
                          <tr key={idx} className="border-b hover:bg-gray-50 transition-colors" style={{ borderColor: '#F1F3F4' }}>
                            <td className="px-2.5 py-2 text-gray-900 font-medium" style={{ fontSize: '12px' }}>{row.team}</td>
                            <td className="px-2.5 py-2 text-gray-700" style={{ fontSize: '12px' }}>{row.budget}</td>
                            <td className="px-2.5 py-2 text-gray-700" style={{ fontSize: '12px' }}>{row.actual}</td>
                            <td className="px-2.5 py-2 font-semibold" style={{ fontSize: '12px', color: row.varColor }}>{row.variance}</td>
                            <td className="px-2.5 py-2">
                              <Badge 
                                className="border-0"
                                style={{ 
                                  backgroundColor: row.statusType === 'lo' ? '#fdedec' : row.statusType === 'hi' ? '#eafaf1' : '#fef9e7',
                                  color: row.statusType === 'lo' ? '#c0392b' : row.statusType === 'hi' ? '#1e8449' : '#e67e22',
                                  fontSize: '10px',
                                  fontWeight: 600,
                                  paddingLeft: '7px',
                                  paddingRight: '7px'
                                }}
                              >
                                {row.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="rounded-lg border flex gap-2 p-3" style={{ backgroundColor: '#d6eaf8', borderColor: '#a8d4f0' }}>
                      <span className="text-lg flex-shrink-0" style={{ marginTop: '1px' }}>ℹ️</span>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 mb-0.5" style={{ fontSize: '12px' }}>
                          AT&T General overage driven by Patrick Henkel
                        </div>
                        <div className="text-gray-700" style={{ fontSize: '12px', lineHeight: 1.5 }}>
                          Single-member spend of $47K in January accounts for 39% of the team total and 25% of the team's overage. Within policy but worth flagging.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Insights */}
          <div className="w-72 flex-shrink-0 bg-white border-l flex flex-col overflow-hidden" style={{ borderColor: '#E8EAED' }}>
            <div className="px-3.5 py-3 border-b" style={{ borderColor: '#F1F3F4' }}>
              <div className="font-semibold text-gray-700" style={{ fontSize: '12px' }}>
                Insights & Actions
              </div>
              <div className="text-gray-400" style={{ fontSize: '11px', marginTop: '1px' }}>
                Updating with conversation
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-2.5 py-2.5 space-y-2.5">
              {/* This Session */}
              <div className="rounded-lg border overflow-hidden" style={{ borderColor: '#E8EAED' }}>
                <div className="px-3 py-2 border-b flex items-center gap-1.5" style={{ backgroundColor: '#f0eeff', borderColor: '#d8d4fb' }}>
                  <span style={{ fontSize: '13px' }}>🧵</span>
                  <span className="font-semibold flex-1" style={{ fontSize: '12px', color: '#6c5ce7' }}>
                    This Session
                  </span>
                </div>
                <div className="px-3 py-2">
                  <div className="space-y-0">
                    {[
                      { id: 1, text: 'Team activity overview', time: currentScreen >= 2 ? '8:37 am' : '', status: currentScreen >= 2 ? 'done' : 'pending' },
                      { id: 2, text: 'Low-engagement teams identified', time: currentScreen >= 3 ? '8:38 am' : '', status: currentScreen >= 3 ? 'done' : currentScreen === 2 ? 'active' : 'pending' },
                      { id: 3, text: 'Spend vs. budget complete', time: currentScreen >= 4 ? '8:39 am' : '', status: currentScreen >= 4 ? 'done' : currentScreen === 3 ? 'active' : 'pending' },
                      { id: 4, text: 'Next question', time: '', status: 'pending' }
                    ].map((step, idx) => (
                      <div key={step.id} className="flex items-start gap-2 py-1.5 relative">
                        {idx !== 3 && (
                          <div 
                            className="absolute left-2 top-6 bottom-0 w-px"
                            style={{ backgroundColor: '#E8EAED', marginLeft: '-0.5px' }}
                          ></div>
                        )}
                        <div 
                          className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold ${step.status === 'active' ? 'animate-pulse' : ''}`}
                          style={{ 
                            fontSize: '8px',
                            backgroundColor: step.status === 'done' ? '#1e8449' : step.status === 'active' ? '#6c5ce7' : '#DADCE0',
                            marginTop: '1px'
                          }}
                        >
                          {step.status === 'done' ? '✓' : step.status === 'active' ? '●' : '○'}
                        </div>
                        <div className="flex-1">
                          <div 
                            className="text-gray-700" 
                            style={{ 
                              fontSize: '11.5px', 
                              lineHeight: 1.4,
                              opacity: step.status === 'pending' && step.id === 4 ? 0.4 : 1
                            }}
                          >
                            {step.text}
                          </div>
                          {step.time && (
                            <div className="text-gray-400" style={{ fontSize: '10px' }}>
                              {step.time}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Activation Opportunity CTA - Screen 3+ */}
              {currentScreen >= 3 && (
                <div 
                  className="rounded-lg border p-3 animate-in fade-in"
                  style={{ 
                    borderColor: '#d8d4fb',
                    background: 'linear-gradient(135deg, #f0eeff, #e8e3ff)',
                    animationDuration: '200ms'
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-1 font-semibold" style={{ fontSize: '12px', color: '#6c5ce7' }}>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="6" cy="4" r="2.5"/>
                      <path d="M1 13c0-2.8 2.2-5 5-5s5 2.2 5 5"/>
                      <path d="M13 6v6M10 9h6"/>
                    </svg>
                    Activation Opportunity
                  </div>
                  <div className="text-gray-600 mb-2" style={{ fontSize: '11.5px', lineHeight: 1.5 }}>
                    3 teams with low engagement. Denver Field's lead is unactivated — a single outreach could unlock 41 dormant members.
                  </div>
                  <Button 
                    onClick={() => setShowDraftModal(true)}
                    className="w-full mb-1 text-white font-semibold"
                    style={{ 
                      backgroundColor: '#6c5ce7',
                      fontSize: '11.5px',
                      height: '30px'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5a4bd1')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#6c5ce7')}
                  >
                    Draft Outreach →
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full border hover:bg-purple-50"
                    style={{ 
                      borderColor: '#d8d4fb',
                      color: '#6c5ce7',
                      backgroundColor: 'white',
                      fontSize: '11.5px',
                      height: '30px',
                      fontWeight: 600
                    }}
                  >
                    View All Low-Engagement
                  </Button>
                </div>
              )}

              {/* January Spend */}
              <div 
                className="rounded-lg border overflow-hidden" 
                style={{ 
                  borderColor: currentScreen >= 4 ? '#f0c080' : '#E8EAED',
                  backgroundColor: currentScreen >= 4 ? '#fef9e7' : 'transparent'
                }}
              >
                <div 
                  className="px-3 py-2 border-b flex items-center gap-1.5" 
                  style={{ 
                    backgroundColor: currentScreen >= 4 ? '#fef9e7' : '#F8F9FA',
                    borderColor: currentScreen >= 4 ? '#f0c080' : '#E8EAED'
                  }}
                >
                  <span style={{ fontSize: '13px' }}>💰</span>
                  <span className="font-semibold flex-1 text-gray-800" style={{ fontSize: '12px' }}>
                    January Spend
                  </span>
                  <button className="text-blue-500 hover:underline" style={{ fontSize: '11px', fontWeight: 500 }}>
                    Details
                  </button>
                </div>
                <div className="px-3 py-1" style={{ backgroundColor: 'white' }}>
                  {[
                    { label: 'Budget', value: '$322K', color: '#2e86c1' },
                    { label: 'Actual', value: '$341K', color: '#202124' },
                    { label: 'Variance', value: '+$19K (+5.9%)', color: '#c0392b' },
                    { label: 'Teams over', value: currentScreen >= 4 ? '2 of 7' : '—', color: currentScreen >= 4 ? '#e67e22' : '#5f6368' },
                    { label: 'Largest overage', value: currentScreen >= 4 ? 'AT&T General' : '—', color: currentScreen >= 4 ? '#c0392b' : '#5f6368' }
                  ].map((row, idx) => (
                    <div key={idx} className="flex justify-between items-baseline py-1.5 border-b last:border-0" style={{ borderColor: '#F1F3F4', fontSize: '12px' }}>
                      <span className="text-gray-600">{row.label}</span>
                      <span className="font-semibold" style={{ color: row.color }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Portfolio Health */}
              <div className="rounded-lg border overflow-hidden" style={{ borderColor: '#E8EAED' }}>
                <div className="px-3 py-2 bg-gray-50 border-b flex items-center gap-1.5" style={{ borderColor: '#E8EAED' }}>
                  <span style={{ fontSize: '13px' }}>📊</span>
                  <span className="font-semibold flex-1 text-gray-800" style={{ fontSize: '12px' }}>
                    Portfolio Health
                  </span>
                </div>
                <div className="px-3 py-1">
                  {[
                    { label: 'Active members', value: '1,333', color: '#2e86c1' },
                    { label: 'Pending activation', value: '477', color: '#e67e22' },
                    { label: 'Teams below 20%', value: '3', color: '#c0392b' },
                    { label: 'Avg. reservations/member', value: '3.2/mo', color: '#202124' },
                    { label: 'Avg. cost/reservation', value: '$81', color: '#202124' }
                  ].map((row, idx) => (
                    <div key={idx} className="flex justify-between items-baseline py-1.5 border-b last:border-0" style={{ borderColor: '#F1F3F4', fontSize: '12px' }}>
                      <span className="text-gray-600">{row.label}</span>
                      <span className="font-semibold" style={{ color: row.color }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Sessions */}
              <div className="pt-0.5 pb-1">
                <div className="font-semibold text-gray-400 uppercase tracking-wide mb-1.5" style={{ fontSize: '10px', letterSpacing: '0.06em' }}>
                  Recent Sessions
                </div>
                {[
                  { text: 'This session · Team activity', time: 'Just now', active: true },
                  { text: 'Q4 spend analysis by team', time: 'Feb 20', active: false },
                  { text: 'San Ramon renewal review', time: 'Feb 14', active: false }
                ].map((session, idx) => (
                  <button 
                    key={idx} 
                    className="w-full flex items-start gap-2 px-2.5 py-1.5 cursor-pointer rounded hover:bg-gray-50 transition-colors"
                  >
                    <div 
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ 
                        backgroundColor: session.active ? '#6c5ce7' : '#DADCE0',
                        marginTop: '4px'
                      }}
                    ></div>
                    <div className="flex-1 text-left">
                      <div 
                        className="text-gray-600"
                        style={{ 
                          fontSize: '11.5px', 
                          lineHeight: 1.4,
                          color: session.active ? '#6c5ce7' : '#5f6368',
                          fontWeight: session.active ? 500 : 400
                        }}
                      >
                        {session.text}
                      </div>
                      <div className="text-gray-400" style={{ fontSize: '10px' }}>
                        {session.time}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Draft Modal */}
      <Dialog open={showDraftModal} onOpenChange={setShowDraftModal}>
        <DialogContent className="max-w-md p-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge 
                className="flex items-center gap-1 text-white border-0"
                style={{ 
                  backgroundColor: '#6c5ce7', 
                  fontSize: '10px', 
                  fontWeight: 600, 
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  paddingLeft: '7px',
                  paddingRight: '7px'
                }}
              >
                Co-Pilot
              </Badge>
            </div>
            <DialogTitle style={{ fontSize: '16px', fontWeight: 600, color: '#202124' }}>
              Draft: Outreach to Denver Field Lead
            </DialogTitle>
            <DialogDescription style={{ fontSize: '13px', color: '#5f6368', marginTop: '4px' }}>
              AI-generated activation email
            </DialogDescription>
          </DialogHeader>
          <div 
            className="bg-gray-50 border rounded-lg p-4 my-4"
            style={{ 
              borderColor: '#E8EAED',
              fontSize: '13px',
              lineHeight: 1.6,
              color: '#202124',
              fontFamily: 'monospace'
            }}
          >
            Hi Marcus — your team's LiquidSpace program has been live for several months but engagement is still low. Activating your account is the first step — it lets you see your team's budget and booking activity. Takes 2 minutes: [activate link]. Happy to walk through it. — David
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleCopyDraft}
              className="flex-1 text-white font-semibold"
              style={{ 
                backgroundColor: '#6c5ce7',
                fontSize: '14px'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5a4bd1')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#6c5ce7')}
            >
              <Copy className="h-4 w-4 mr-2" />
              {copiedToClipboard ? 'Copied!' : 'Copy'}
            </Button>
            <Button 
              onClick={() => setShowDraftModal(false)}
              variant="ghost"
              className="flex-1"
              style={{ fontSize: '14px', color: '#5f6368' }}
            >
              Dismiss
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Denver Coverage Tooltip */}
      {showDenverTooltip && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
          onClick={() => setShowDenverTooltip(false)}
        >
          <div 
            className="bg-white rounded-lg border p-5 max-w-md mx-4 shadow-lg"
            style={{ borderColor: '#E8EAED' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">📍</span>
              <div>
                <div className="font-semibold text-gray-900 mb-2" style={{ fontSize: '14px' }}>
                  Denver Field Coverage
                </div>
                <div className="text-gray-700" style={{ fontSize: '13px', lineHeight: 1.5 }}>
                  Denver Field members are distributed across Aurora, Highlands Ranch, and Lakewood. Nearest platform location: Industry Denver (RiNo), ~22 miles from team center. Coverage gap confirmed — recommend adding suburban locations.
                </div>
                <Button 
                  onClick={() => setShowDenverTooltip(false)}
                  className="mt-3 w-full"
                  style={{ fontSize: '13px' }}
                >
                  Got it
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cost Tooltip */}
      {showCostTooltip && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
          onClick={() => setShowCostTooltip(false)}
        >
          <div 
            className="bg-white rounded-lg border p-5 max-w-md mx-4 shadow-lg"
            style={{ borderColor: '#E8EAED' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">💡</span>
              <div>
                <div className="font-semibold text-gray-900 mb-2" style={{ fontSize: '14px' }}>
                  Why Higher Cost per Reservation?
                </div>
                <div className="text-gray-700" style={{ fontSize: '13px', lineHeight: 1.5 }}>
                  Low-engagement teams average $134/reservation vs. $71 for high-engagement teams. Infrequent users tend to book private offices rather than desks — more expensive, less familiar with the platform's options.
                </div>
                <Button 
                  onClick={() => setShowCostTooltip(false)}
                  className="mt-3 w-full"
                  style={{ fontSize: '13px' }}
                >
                  Got it
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
