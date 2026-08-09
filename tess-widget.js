/**
 * TESS — Invitt Co AI Receptionist Widget
 * Drop this script into any page to activate Tess.
 * Requires: TESS_CONFIG to be defined before this script, or defaults are used.
 *
 * Usage:
 *   <script>
 *     window.TESS_CONFIG = {
 *       whatsappNumber: '+263787412809',
 *       adminPassword: 'your-admin-password',
 *       backendUrl: 'https://YOUR-APP-NAME.onrender.com' // your Render backend URL
 *     };
 *   </script>
 *   <script src="tess-widget.js"></script>
 */

(function () {
  'use strict';

  const LOGO_IMG = 'data:image/png;base64,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';

  // ─── CONFIG ──────────────────────────────────────────────────────────────────
  const CFG = Object.assign({
    whatsappNumber: '+263787412809',
    adminPassword: 'invitt2024',
    accentColor: '#C8F53E',
    accentDark: '#a8d42e',
    bgDark: '#1a1a1a',
    bgPanel: '#111111',
    textPrimary: '#ffffff',
    textMuted: '#888888',
    popupDelay: 2000,
    popupReshowDelay: 45000,
    storageKey: 'tess_session',
  }, window.TESS_CONFIG || {});

  // ─── SESSION ID ─────────────────────────────────────────────────────────
  function generateSessionId() {
    return 'sess_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10);
  }

  // ─── STATE ──────────────────────────────────────────────────────────────
  const state = {
    sessionId: generateSessionId(),
    messages: [],
    mode: 'select',
    isOpen: false,
    isHumanMode: false,
    isAdmin: false,
    ws: null,
    wsReady: false,
    wsRetries: 0,
    pendingImage: null,
    leadStep: 0,
    lead: {},
    voiceCall: null
  };

  // ─── LEAD FLOW STEPS ────────────────────────────────────────────────────
  const leadSteps = [
    { field: 'name', prompt: "What's your name?" },
    { field: 'phone', prompt: "What's the best phone or WhatsApp number to reach you on?" },
    { field: 'email', prompt: "And your email address?" },
    { field: 'business', prompt: "What's the name of your business?" },
    { field: 'budget', prompt: "Roughly what budget are you working with?" }
  ];

  function scoreLead(lead) {
    let score = 0;
    if (lead.name) score += 20;
    if (lead.phone) score += 20;
    if (lead.email) score += 20;
    if (lead.business) score += 20;
    if (lead.budget) score += 20;
    return score;
  }

  // ─── SESSION PERSISTENCE ────────────────────────────────────────────────
  function loadSession() {
    try {
      const raw = localStorage.getItem(CFG.storageKey);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved && saved.sessionId) state.sessionId = saved.sessionId;
      if (saved && Array.isArray(saved.messages)) state.messages = saved.messages;
    } catch (e) {
      // Corrupt or inaccessible storage — start fresh
    }
  }

  function saveSession() {
    try {
      localStorage.setItem(CFG.storageKey, JSON.stringify({
        sessionId: state.sessionId,
        messages: state.messages
      }));
    } catch (e) {
      // Storage full or unavailable — safe to ignore
    }
  }

  // ─── AI RESPONSE — all messages go to backend via WebSocket ───────────────
  // FAQ matching removed. Backend handles all responses using document context.

  async function sendToAI(userMessage) {
    // Signal backend to handle with AI — no local matching
    if (state.ws && state.ws.readyState === WebSocket.OPEN) {
      state.ws.send(JSON.stringify({
        role: 'user',
        content: userMessage,
        image_data: null,
        needs_ai: true
      }));
      return '__AI_PENDING__'; // typing indicator stays until ws.onmessage fires
    }
    return null;
  }

  // ─── LEAD STORAGE ────────────────────────────────────────────────────────
  async function saveLead(lead) {
    const scored = { ...lead, score: scoreLead(lead), timestamp: new Date().toISOString(), sessionId: state.sessionId, messages: state.messages.length };
    // Save to localStorage as backup
    try {
      const leads = JSON.parse(localStorage.getItem('tess_leads') || '[]');
      leads.push(scored);
      localStorage.setItem('tess_leads', JSON.stringify(leads));
    } catch (e) {}
    // Save to backend API
    if (CFG.backendUrl) {
      try {
        await fetch(CFG.backendUrl + '/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: state.sessionId,
            name: lead.name || null,
            email: lead.email || null,
            phone: lead.phone || null,
            business: lead.business || null,
            budget: lead.budget || null,
            score: scoreLead(lead),
            messages_count: state.messages.length
          })
        });
        // Also save to bookings if intent is booking or voice callback
        if (lead.intent === 'booking' || lead.intent === 'voice_callback') {
          await fetch(CFG.backendUrl + '/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              session_id: state.sessionId,
              name: lead.name || null,
              email: lead.email || null,
              phone: lead.phone || null,
              preferred_time: lead.preferred_time || null,
              status: 'pending'
            })
          });
        }
      } catch (e) {}
    }
  }

  async function saveMessageToBackend(role, content, imageData = null) {
    // Send via WebSocket for real-time admin view
    sendViaWebSocket(role, content, imageData);
    // Also persist via REST as fallback
    if (!CFG.backendUrl) return;
    try {
      await fetch(CFG.backendUrl + '/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: state.sessionId, role, content, image_data: imageData || null })
      });
    } catch (e) {}
  }

  async function trackEvent(event_type, data = {}) {
    if (!CFG.backendUrl) return;
    try {
      await fetch(CFG.backendUrl + '/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: state.sessionId, event_type, data: JSON.stringify(data) })
      });
    } catch (e) {}
  }

  // ─── WEBSOCKET (Live Chat + Admin Takeover) ────────────────────────────────
  function connectWebSocket() {
    if (!CFG.backendUrl) return;
    if (state.ws && state.ws.readyState === WebSocket.OPEN) return;
    const wsUrl = CFG.backendUrl
      .replace(/^https:\/\//, 'wss://')
      .replace(/^http:\/\//, 'ws://')
      + '/ws/chat/' + state.sessionId;
    try {
      state.ws = new WebSocket(wsUrl);
      state.ws.onopen = () => {
        state.wsReady = true;
        state.wsRetries = 0;
      };
      state.ws.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          // Admin released back to AI
          if (data.type === 'human_released') {
            state.isHumanMode = false;
            const banner = document.getElementById('tess-human-banner');
            if (banner) {
              banner.style.display = 'block';
              banner.textContent = '🤖 You are now chatting with Tess AI again';
              setTimeout(() => { banner.style.display = 'none'; }, 4000);
            }
            return;
          }
          // Admin takeover message received
          if (data.role === 'assistant' || data.role === 'human') {
            hideTyping();
            if (data.is_human) {
              state.isHumanMode = true;
              const banner = document.getElementById('tess-human-banner');
              if (banner) {
                banner.style.display = 'block';
                banner.textContent = '✅ You are now chatting with a human agent';
              }
            }
            addMessage(data.content, 'assistant');
          }
        } catch (err) {}
      };
      state.ws.onclose = () => {
        state.wsReady = false;
        // Reconnect with exponential backoff, max 30s
        const delay = Math.min(3000 * Math.pow(1.5, state.wsRetries), 30000);
        state.wsRetries++;
        setTimeout(connectWebSocket, delay);
      };
      state.ws.onerror = () => {
        state.wsReady = false;
      };
    } catch (err) {}
  }

  function sendViaWebSocket(role, content, imageData = null) {
    if (state.ws && state.ws.readyState === WebSocket.OPEN) {
      try {
        state.ws.send(JSON.stringify({ role, content, image_data: imageData || null }));
      } catch (err) {}
    }
  }


  function injectStyles() {
    if (document.getElementById('tess-styles')) return;
    const style = document.createElement('style');
    style.id = 'tess-styles';
    style.textContent = `
      #tess-root * { box-sizing: border-box; font-family: 'Space Grotesk', -apple-system, sans-serif; }
      #tess-bubble {
        position: fixed; bottom: 24px; right: 24px; z-index: 999999;
        width: 56px; height: 56px; border-radius: 50%;
        background: ${CFG.accentColor}; border: none; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 4px 24px rgba(200,245,62,0.4);
        transition: transform 0.2s, box-shadow 0.2s;
      }
      #tess-bubble:hover { transform: scale(1.08); box-shadow: 0 6px 32px rgba(200,245,62,0.6); }
      #tess-bubble svg { width: 26px; height: 26px; }
      #tess-popup {
        position: fixed; bottom: 92px; right: 24px; z-index: 999998;
        background: #fff; border-radius: 16px 16px 4px 16px;
        padding: 14px 18px; max-width: 240px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.18);
        display: none; animation: tess-fade-in 0.3s ease;
        cursor: pointer;
      }
      #tess-popup-close {
        position: absolute; top: 8px; right: 10px;
        background: none; border: none; cursor: pointer; font-size: 16px; color: #888;
        line-height: 1; padding: 2px;
      }
      #tess-popup-header { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
      #tess-popup-avatar {
        width: 32px; height: 32px; border-radius: 50%;
        background: transparent; overflow: hidden; flex-shrink: 0;
      }
      #tess-popup-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
      #tess-popup-title { font-weight: 700; font-size: 13px; color: #111; }
      #tess-popup-body { font-size: 13px; color: #444; line-height: 1.5; }
      #tess-panel {
        position: fixed; bottom: 92px; right: 24px; z-index: 999998;
        width: 380px; max-width: calc(100vw - 32px); height: 580px; max-height: calc(100vh - 116px); max-height: calc(100dvh - 116px);
        background: #ffffff; border-radius: 20px;
        box-shadow: 0 16px 64px rgba(0,0,0,0.18);
        display: none; flex-direction: column; overflow: hidden;
        animation: tess-slide-up 0.3s cubic-bezier(0.34,1.56,0.64,1);
        border: 1px solid rgba(0,0,0,0.08);
      }
      #tess-panel-header {
        background: ${CFG.accentColor}; padding: 16px 20px;
        display: flex; align-items: center; gap: 12px; flex-shrink: 0;
      }
      #tess-header-close {
        background: none; border: none; cursor: pointer; padding: 4px;
        display: flex; align-items: center; justify-content: center;
        color: ${CFG.bgDark}; opacity: 0.7; margin-left: auto; flex-shrink: 0;
      }
      #tess-header-close:hover { opacity: 1; }
      #tess-back-row {
        padding: 10px 16px 0; display: none; flex-shrink: 0; background: #ffffff;
      }
      #tess-back-row.show { display: block; }
      #tess-header-back {
        background: #ffffff; border: 1.5px solid #d0d0d0; cursor: pointer;
        padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600;
        color: #333; display: inline-flex; align-items: center; gap: 6px;
        transition: background 0.15s, border-color 0.15s;
      }
      #tess-header-back:hover { background: #f5f5f5; border-color: #bbb; }
      #tess-header-avatar {
        width: 40px; height: 40px; border-radius: 50%;
        background: transparent; overflow: hidden; flex-shrink: 0;
      }
      #tess-header-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
      #tess-header-info { flex: 1; }
      #tess-header-name { font-weight: 800; font-size: 15px; color: ${CFG.bgDark}; text-transform: uppercase; letter-spacing: 0.5px; }
      #tess-body {
        flex: 1; overflow-y: auto; overflow-x: hidden;
        display: flex; flex-direction: column;
        scrollbar-width: thin; scrollbar-color: #ddd transparent;
        background: #ffffff;
        min-height: 0;
      }
      #tess-messages {
        flex-shrink: 0; padding: 16px;
        display: flex; flex-direction: column; gap: 10px;
      }
      .tess-msg { display: flex; gap: 8px; animation: tess-fade-in 0.2s ease; }
      .tess-msg-avatar {
        width: 28px; height: 28px; border-radius: 50%; background: ${CFG.accentColor};
        display: flex; align-items: center; justify-content: center;
        font-size: 11px; font-weight: 800; color: ${CFG.bgDark}; flex-shrink: 0; margin-top: 2px;
      }
      .tess-msg-bubble {
        background: #f3f4f6; color: #111; border-radius: 4px 16px 16px 16px;
        padding: 10px 14px; font-size: 13.5px; line-height: 1.55; max-width: 85%;
        border: 1px solid #ececec; box-shadow: none;
        overflow-wrap: anywhere; word-break: break-word; min-width: 0;
      }
      .tess-msg-bubble a {
        overflow-wrap: anywhere; word-break: break-word;
        color: ${CFG.accentDark}; text-decoration: underline; font-weight: 600;
      }
      .tess-msg-user .tess-msg-bubble a { color: ${CFG.bgDark}; }
      .tess-msg-user { flex-direction: row-reverse; }
      .tess-msg-user .tess-msg-bubble {
        background: ${CFG.accentColor}; color: ${CFG.bgDark}; font-weight: 600;
        border-radius: 16px 4px 16px 16px; border: none;
      }
      .tess-msg-user .tess-msg-avatar { background: #ddd; color: #333; }
      .tess-typing { display: flex; gap: 4px; padding: 12px 14px; }
      .tess-typing span { width: 6px; height: 6px; border-radius: 50%; background: ${CFG.accentColor}; animation: tess-bounce 1.2s infinite; }
      .tess-typing span:nth-child(2) { animation-delay: 0.2s; }
      .tess-typing span:nth-child(3) { animation-delay: 0.4s; }
      #tess-options { padding: 0 16px 12px; display: flex; flex-direction: column; gap: 8px; flex-shrink: 0; }
      .tess-option-btn {
        background: #f5f5f5; border: 1.5px solid #e0e0e0; color: #111;
        border-radius: 12px; padding: 13px 18px; font-size: 14px; font-weight: 600;
        cursor: pointer; display: flex; align-items: center; gap: 10px;
        transition: background 0.15s, border-color 0.15s; text-align: left; width: 100%;
      }
      .tess-option-btn:hover { background: rgba(200,245,62,0.15); border-color: ${CFG.accentColor}; }
      .tess-option-btn svg { flex-shrink: 0; stroke: #555; }
      .tess-voice-card {
        padding: 32px 24px 24px; display: flex; flex-direction: column; align-items: center;
        text-align: center; animation: tess-fade-in 0.25s ease;
      }
      .tess-voice-avatar {
        width: 92px; height: 92px; border-radius: 50%; overflow: hidden; margin-bottom: 14px;
        border: 2px solid ${CFG.accentColor}; box-shadow: 0 4px 20px rgba(200,245,62,0.3); flex-shrink: 0;
      }
      .tess-voice-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
      .tess-voice-name {
        font-size: 17px; font-weight: 800; color: #111;
        display: flex; align-items: center; justify-content: center; gap: 7px;
      }
      .tess-voice-badge {
        background: ${CFG.accentColor}; color: ${CFG.bgDark}; font-size: 10px; font-weight: 800;
        padding: 3px 7px; border-radius: 6px; letter-spacing: 0.5px;
      }
      .tess-voice-role { font-size: 13px; color: #888; margin-top: 4px; margin-bottom: 20px; font-weight: 500; }
      .tess-voice-btn {
        display: flex; align-items: center; justify-content: center; gap: 8px;
        background: #ffffff; border: 1.5px solid ${CFG.accentColor}; color: ${CFG.bgDark};
        font-size: 14px; font-weight: 700; padding: 12px 24px; border-radius: 30px; cursor: pointer;
        transition: background 0.15s, transform 0.1s; width: 100%; max-width: 220px;
      }
      .tess-voice-btn:hover { background: rgba(200,245,62,0.15); }
      .tess-voice-btn:active { transform: scale(0.97); }
      .tess-voice-btn svg { flex-shrink: 0; stroke: ${CFG.bgDark}; }
      .tess-voice-note { font-size: 11.5px; color: #aaa; margin-top: 14px; line-height: 1.5; max-width: 260px; }
      .tess-voice-avatar.tess-call-live {
        border-color: ${CFG.accentColor}; box-shadow: 0 0 0 0 rgba(200,245,62,0.5);
        animation: tess-call-pulse 1.8s infinite;
      }
      .tess-voice-avatar.tess-call-live.tess-speaking {
        animation: tess-call-pulse-fast 0.9s infinite;
      }
      @keyframes tess-call-pulse {
        0% { box-shadow: 0 0 0 0 rgba(200,245,62,0.45); }
        70% { box-shadow: 0 0 0 14px rgba(200,245,62,0); }
        100% { box-shadow: 0 0 0 0 rgba(200,245,62,0); }
      }
      @keyframes tess-call-pulse-fast {
        0% { box-shadow: 0 0 0 0 rgba(200,245,62,0.55); }
        70% { box-shadow: 0 0 0 10px rgba(200,245,62,0); }
        100% { box-shadow: 0 0 0 0 rgba(200,245,62,0); }
      }
      .tess-voice-status { font-size: 13px; color: #888; margin-top: 4px; margin-bottom: 22px; font-weight: 600; display: flex; align-items: center; gap: 7px; }
      .tess-voice-status .tess-dot { width: 6px; height: 6px; border-radius: 50%; background: #4ade80; flex-shrink: 0; }
      .tess-voice-status .tess-dot.tess-connecting { background: #f5b400; animation: tess-bounce 1s infinite; }
      .tess-voice-controls { display: flex; align-items: center; justify-content: center; gap: 18px; }
      .tess-voice-round-btn {
        width: 52px; height: 52px; border-radius: 50%; border: 1.5px solid #e0e0e0;
        background: #f5f5f5; cursor: pointer; display: flex; align-items: center; justify-content: center;
        transition: background 0.15s, border-color 0.15s, transform 0.1s; flex-shrink: 0;
      }
      .tess-voice-round-btn:hover { background: #eee; }
      .tess-voice-round-btn:active { transform: scale(0.95); }
      .tess-voice-round-btn svg { stroke: #333; }
      .tess-voice-round-btn.tess-muted { background: ${CFG.accentColor}; border-color: ${CFG.accentColor}; }
      .tess-voice-round-btn.tess-muted svg { stroke: ${CFG.bgDark}; }
      .tess-voice-round-btn.tess-end-call { background: #e6453a; border-color: #e6453a; }
      .tess-voice-round-btn.tess-end-call svg { stroke: #fff; }
      .tess-voice-round-btn.tess-end-call:hover { background: #cc3b31; }
      .tess-voice-btn-label { font-size: 10.5px; color: #999; text-align: center; margin-top: 6px; font-weight: 600; }
      .tess-voice-btn-col { display: flex; flex-direction: column; align-items: center; }
      #tess-input-area {
        padding: 12px 16px; border-top: 1px solid #e8e8e8;
        display: flex; gap: 8px; flex-shrink: 0; background: #ffffff;
        flex-wrap: wrap;
      }
      #tess-img-preview-row {
        width: 100%; display: none; padding-bottom: 8px;
      }
      #tess-img-preview-row.show { display: block; }
      #tess-img-preview-wrap {
        position: relative; display: inline-block;
      }
      #tess-img-preview {
        width: 72px; height: 72px; object-fit: cover;
        border-radius: 10px; border: 2px solid ${CFG.accentColor};
        display: block;
      }
      #tess-img-remove {
        position: absolute; top: -6px; right: -6px;
        width: 20px; height: 20px; border-radius: 50%;
        background: #333; border: none; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        color: #fff; font-size: 11px; font-weight: 700; line-height: 1;
      }
      #tess-img-btn {
        width: 40px; height: 40px; border-radius: 10px;
        background: #f5f5f5; border: 1.5px solid #e0e0e0; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        transition: background 0.15s, border-color 0.15s; flex-shrink: 0;
      }
      #tess-img-btn:hover { background: rgba(200,245,62,0.15); border-color: ${CFG.accentColor}; }
      #tess-img-input { display: none; }
      #tess-input {
        flex: 1; background: #f5f5f5; border: 1.5px solid #e0e0e0;
        border-radius: 10px; padding: 10px 14px; color: #111; font-size: 14px;
        outline: none; resize: none; height: 40px; max-height: 120px; overflow: hidden;
        transition: border-color 0.2s;
      }
      #tess-input::placeholder { color: #aaa; }
      #tess-input:focus { border-color: ${CFG.accentColor}; }
      #tess-send {
        width: 40px; height: 40px; border-radius: 10px;
        background: ${CFG.accentColor}; border: none; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        transition: background 0.15s, transform 0.1s; flex-shrink: 0;
      }
      #tess-send:hover { background: ${CFG.accentDark}; }
      #tess-send:active { transform: scale(0.95); }
      #tess-footer {
        padding: 8px; text-align: center; font-size: 11px; color: #888;
        border-top: 1px solid #e8e8e8; flex-shrink: 0; background: #ffffff;
      }
      #tess-footer a { color: ${CFG.accentDark}; text-decoration: none; }
      #tess-wa-btn {
        margin: 0 16px 12px; background: #25D366; color: white; border: none;
        border-radius: 12px; padding: 12px; font-size: 14px; font-weight: 700;
        cursor: pointer; display: none; align-items: center; justify-content: center; gap: 8px;
        transition: background 0.15s;
      }
      #tess-wa-btn:hover { background: #1da851; }
      #tess-footer button {
        background: none; border: none; padding: 0; margin: 0; cursor: pointer;
        color: ${CFG.accentDark}; text-decoration: none; font-size: 11px; font-family: inherit;
      }
      #tess-privacy-overlay {
        position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 2147483001;
        display: none; align-items: center; justify-content: center; padding: 20px;
      }
      #tess-privacy-overlay.show { display: flex; }
      #tess-privacy-modal {
        background: #fff; border-radius: 16px; max-width: 480px; width: 100%;
        max-height: 80vh; display: flex; flex-direction: column; overflow: hidden;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      }
      #tess-privacy-header {
        display: flex; align-items: center; justify-content: space-between;
        padding: 16px 20px; border-bottom: 1px solid #eee; flex-shrink: 0;
      }
      #tess-privacy-header h3 { margin: 0; font-size: 16px; font-weight: 700; color: ${CFG.bgDark}; }
      #tess-privacy-close {
        background: none; border: none; cursor: pointer; font-size: 20px; line-height: 1;
        color: #888; padding: 4px; border-radius: 6px;
      }
      #tess-privacy-close:hover { background: #f0f0f0; }
      #tess-privacy-body {
        padding: 20px; overflow-y: auto; font-size: 13px; line-height: 1.6; color: #444;
      }
      #tess-privacy-body h4 { font-size: 13px; color: ${CFG.bgDark}; margin: 16px 0 6px; }
      #tess-privacy-body h4:first-child { margin-top: 0; }
      #tess-privacy-body p { margin: 0 0 8px; }
      #tess-human-banner {
        margin: 8px 16px; background: rgba(200,245,62,0.12); border: 1px solid rgba(200,245,62,0.4);
        border-radius: 8px; padding: 8px 12px; font-size: 12px; color: #5a7a00;
        display: none; text-align: center; font-weight: 600;
      }
      .tess-msg-img {
        max-width: 200px; max-height: 180px; border-radius: 10px;
        display: block; margin-top: 6px; object-fit: cover;
        border: 1px solid rgba(0,0,0,0.08);
      }
      @keyframes tess-fade-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes tess-slide-up { from { opacity: 0; transform: translateY(20px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
      @keyframes tess-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      @keyframes tess-bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-5px); } }
      @media (max-width: 480px) {
        #tess-panel {
          width: 100vw;
          right: 0;
          bottom: 0;
          border-radius: 20px 20px 0 0;
          height: 85vh;
          max-height: 85vh;
          height: 85dvh;
          max-height: 85dvh;
        }
        #tess-bubble {
          bottom: 16px;
          right: 16px;
        }
        #tess-popup {
          right: 16px;
          bottom: 84px;
          max-width: calc(100vw - 80px);
        }
      }
      @media (max-width: 360px) {
        #tess-panel-header { padding: 12px 16px; }
        #tess-messages { padding: 12px; }
        #tess-options { padding: 0 12px 12px; }
        #tess-input-area { padding: 10px 12px; }
      }
    `;
    document.head.appendChild(style);
  }

  // ─── DOM CREATION ─────────────────────────────────────────────────────────
  function createDOM() {
    const root = document.createElement('div');
    root.id = 'tess-root';

    root.innerHTML = `
      <!-- Popup notification -->
      <div id="tess-popup">
        <button id="tess-popup-close" aria-label="Close">×</button>
        <div id="tess-popup-header">
          <div id="tess-popup-avatar">
            <img src="data:image/png;base64,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" alt="Invitt Co"/>
          </div>
          <div id="tess-popup-title">Invitt Co</div>
        </div>
        <div id="tess-popup-body">Hi there! Have a question? Talk with us here</div>
      </div>

      <!-- Main panel -->
      <div id="tess-panel" role="dialog" aria-label="Tess - Invitt Co AI Receptionist">
        <div id="tess-panel-header">
          <div id="tess-header-avatar">
            <img src="data:image/png;base64,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" alt="Invitt Co"/>
          </div>
          <div id="tess-header-info">
            <div id="tess-header-name">HAVE A QUESTION?</div>
          </div>
          <button id="tess-header-close" aria-label="Close chat">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${CFG.bgDark}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
        </div>

        <div id="tess-back-row">
          <button id="tess-header-back" aria-label="Go back">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back
          </button>
        </div>

        <div id="tess-body">
          <div id="tess-messages"></div>

          <div id="tess-human-banner">You are now chatting with a human</div>

          <div id="tess-options">
            <button class="tess-option-btn" data-action="livechat">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${CFG.accentColor}" stroke-width="2" stroke-linecap="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              Chat via Live Chat
            </button>
            <button class="tess-option-btn" data-action="voice">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${CFG.accentColor}" stroke-width="2" stroke-linecap="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              Chat with Voice
            </button>
          </div>

          <button id="tess-wa-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
            Continue on WhatsApp
          </button>
        </div>

        <div id="tess-input-area" style="display:none">
          <div id="tess-img-preview-row">
            <div id="tess-img-preview-wrap">
              <img id="tess-img-preview" src="" alt="Preview"/>
              <button id="tess-img-remove" aria-label="Remove image">×</button>
            </div>
          </div>
          <input type="file" id="tess-img-input" accept="image/*"/>
          <button id="tess-img-btn" aria-label="Attach image">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </button>
          <textarea id="tess-input" placeholder="Type a message..." rows="1" maxlength="500"></textarea>
          <button id="tess-send" aria-label="Send">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${CFG.bgDark}" stroke-width="2.5" stroke-linecap="round">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>

        <div id="tess-footer">Powered by <span style="color:${CFG.accentDark};font-weight:600;">Invitt Co</span> &nbsp;·&nbsp; <button id="tess-privacy-link" type="button">Privacy Policy</button></div>
      </div>

      <!-- Privacy policy modal -->
      <div id="tess-privacy-overlay">
        <div id="tess-privacy-modal" role="dialog" aria-modal="true" aria-labelledby="tess-privacy-title">
          <div id="tess-privacy-header">
            <h3 id="tess-privacy-title">Privacy Policy</h3>
            <button id="tess-privacy-close" aria-label="Close">×</button>
          </div>
          <div id="tess-privacy-body">
            <h4>What we collect</h4>
            <p>When you chat with Tess, we collect the messages you send, any images you attach, and basic contact details you choose to share (like your name, phone number, or email) so we can respond to you and follow up if needed.</p>
            <h4>How we use it</h4>
            <p>Your information is used to answer your questions, provide quotes, and, where relevant, follow up about your enquiry. We do not sell your data to third parties.</p>
            <h4>Storage & security</h4>
            <p>Conversations are stored securely and are only accessible to Invitt Co staff supporting your enquiry.</p>
            <h4>Contact</h4>
            <p>Questions about this policy? Reach out to us via WhatsApp or email at hello@invitt.co.zw.</p>
          </div>
        </div>
      </div>

      <!-- Floating bubble -->
      <button id="tess-bubble" aria-label="Open chat with Tess">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="${CFG.bgDark}"/>
        </svg>
      </button>
    `;

    document.body.appendChild(root);
  }

  // ─── UI HELPERS ───────────────────────────────────────────────────────────
  function addMessage(content, role = 'assistant', imageDataUrl = null) {
    const msg = { role, content, time: Date.now(), image: imageDataUrl || null };
    state.messages.push(msg);
    saveSession();
    renderMessage(msg);
    scrollToBottom();
    saveMessageToBackend(role, content, imageDataUrl || null);
    if (role !== 'user') playNotificationSound();
  }

  let tessAudioCtx = null;
  function playNotificationSound() {
    try {
      if (!tessAudioCtx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        tessAudioCtx = new AudioCtx();
      }
      if (tessAudioCtx.state === 'suspended') tessAudioCtx.resume();

      const now = tessAudioCtx.currentTime;
      const notes = [
        { freq: 880, start: 0, dur: 0.11 },
        { freq: 1318.51, start: 0.09, dur: 0.16 }
      ];

      notes.forEach(({ freq, start, dur }) => {
        const osc = tessAudioCtx.createOscillator();
        const gain = tessAudioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + start);
        gain.gain.setValueAtTime(0, now + start);
        gain.gain.linearRampToValueAtTime(0.18, now + start + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);
        osc.connect(gain);
        gain.connect(tessAudioCtx.destination);
        osc.start(now + start);
        osc.stop(now + start + dur + 0.02);
      });
    } catch (e) {
      // Silently ignore if audio isn't available (autoplay restrictions, etc.)
    }
  }

  function renderMessage(msg) {
    const container = document.getElementById('tess-messages');
    const div = document.createElement('div');
    div.className = `tess-msg${msg.role === 'user' ? ' tess-msg-user' : ''}`;

    const avatarText = msg.role === 'user' ? 'YOU' : 'T';
    const escapeHtml = (str) => str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    const formattedContent = escapeHtml(msg.content)
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/(https?:\/\/[^\s<]+)/g, (url) => {
        const clean = url.replace(/[.,)\]]+$/, '');
        const trailing = url.slice(clean.length);
        return `<a href="${clean}" target="_blank" rel="noopener noreferrer">${clean}</a>${trailing}`;
      })
      .replace(/\n/g, '<br>');

    const imgHtml = msg.image
      ? `<img class="tess-msg-img" src="${msg.image}" alt="Uploaded image"/>`
      : '';

    div.innerHTML = `
      <div class="tess-msg-avatar">${avatarText}</div>
      <div class="tess-msg-bubble">${formattedContent ? formattedContent : ''}${imgHtml}</div>
    `;
    container.appendChild(div);
  }

  function showTyping() {
    const container = document.getElementById('tess-messages');
    const div = document.createElement('div');
    div.className = 'tess-msg';
    div.id = 'tess-typing-indicator';
    div.innerHTML = `
      <div class="tess-msg-avatar">T</div>
      <div class="tess-msg-bubble tess-typing"><span></span><span></span><span></span></div>
    `;
    container.appendChild(div);
    scrollToBottom();
  }

  function hideTyping() {
    const el = document.getElementById('tess-typing-indicator');
    if (el) el.remove();
  }

  function scrollToBottom() {
    const el = document.getElementById('tess-body');
    if (el) el.scrollTop = el.scrollHeight;
  }

  function showInputArea() {
    document.getElementById('tess-input-area').style.display = 'flex';
    document.getElementById('tess-options').style.display = 'none';
  }

  function showWAButton() {
    document.getElementById('tess-wa-btn').style.display = 'flex';
  }

  // ─── LEAD FLOW ────────────────────────────────────────────────────────────
  function startLeadCapture() {
    state.mode = 'lead';
    state.leadStep = 0;
    showInputArea();
    setTimeout(() => addMessage(leadSteps[0].prompt), 400);
  }

  function handleLeadStep(input) {
    const step = leadSteps[state.leadStep];
    state.lead[step.field] = input;
    state.leadStep++;

    if (state.leadStep < leadSteps.length) {
      setTimeout(() => addMessage(leadSteps[state.leadStep].prompt), 300);
    } else {
      // Lead capture complete
      saveLead(state.lead);
      const score = scoreLead(state.lead);
      setTimeout(() => {
        addMessage(`Logged. Score: ${score}/100 — ${score >= 60 ? 'High quality lead.' : 'Good fit.'} Lennon will reach out within 24 hours. Want to jump straight to WhatsApp?`);
        showWAButton();
        state.mode = 'chat';
      }, 400);
    }
  }

  // ─── EVENT HANDLERS ───────────────────────────────────────────────────────
  function handleSend(text) {
    const input = (text || document.getElementById('tess-input').value).trim();
    const image = state.pendingImage;
    if (!input && !image) return;

    document.getElementById('tess-input').value = '';
    // Clear image preview
    if (image) {
      state.pendingImage = null;
      document.getElementById('tess-img-preview-row').classList.remove('show');
      document.getElementById('tess-img-preview').src = '';
    }

    addMessage(input, 'user', image);

    // Admin takeover check
    if (input === '/admin ' + CFG.adminPassword) {
      state.isAdmin = true;
      state.isHumanMode = true;
      document.getElementById('tess-human-banner').style.display = 'block';
      addMessage('Admin mode active. You are now controlling this conversation.');
      return;
    }

    if (state.isHumanMode && !state.isAdmin) {
      // Message is sent to admin via WebSocket (handled in saveMessageToBackend → sendViaWebSocket)
      // Show subtle acknowledgment only if WS is connected
      if (!state.wsReady) {
        addMessage("Message sent. A human agent will reply shortly.");
      }
      return;
    }

    // Lead capture flow
    if (state.mode === 'lead') {
      handleLeadStep(input);
      return;
    }

    // Check for lead/booking intent
    const lower = input.toLowerCase();
    if (/my details|capture|quote|get started|interested/.test(lower)) {
      startLeadCapture();
      return;
    }

    // All messages go to backend AI via WebSocket
    showTyping();
    const aiInput = input || (image ? '[User sent an image]' : '');

    if (image && !input) {
      // Image-only message: show friendly reply immediately
      hideTyping();
      addMessage("Thanks for sharing that image! If you have a question about it or anything else, feel free to ask.");
      return;
    }

    // Send to backend — response comes back via ws.onmessage
    if (state.ws && state.ws.readyState === WebSocket.OPEN) {
      state.ws.send(JSON.stringify({
        role: 'user',
        content: aiInput,
        image_data: null,
        needs_ai: true
      }));
      // typing indicator cleared when ws.onmessage fires
    } else {
      hideTyping();
      addMessage("Connection issue. Reach us directly on WhatsApp — button below.");
      showWAButton();
    }
  }

  function openPanel() {
    document.getElementById('tess-bubble').style.display = 'none';
    state.isOpen = true;
    document.getElementById('tess-panel').style.display = 'flex';
    document.getElementById('tess-popup').style.display = 'none';

    if (state.messages.length === 0) {
      // Reload previous messages
      state.messages.forEach(m => renderMessage(m));

      // Show first message
      if (state.messages.length === 0) {
        const intro = document.getElementById('tess-messages');
        const div = document.createElement('div');
        div.className = 'tess-msg';
        div.innerHTML = `
          <div class="tess-msg-avatar">T</div>
          <div class="tess-msg-bubble">Choose a chat option to get started.</div>
        `;
        intro.appendChild(div);
      }
    }
  }

  function closePanel() {
    document.getElementById('tess-bubble').style.display = 'flex';
    state.isOpen = false;
    document.getElementById('tess-panel').style.display = 'none';
    document.getElementById('tess-popup').style.display = 'block';
  }

  function showPopup() {
    if (!state.isOpen) {
      document.getElementById('tess-popup').style.display = 'block';
    }
  }

  function openWhatsApp() {
    trackEvent('whatsapp_click');
    const text = encodeURIComponent("Hi! I was chatting with Tess on the Invitt Co website and would like to continue here.");
    window.open(`https://wa.me/${CFG.whatsappNumber.replace(/\D/g, '')}?text=${text}`, '_blank');
  }

  function handleVoice() {
    document.getElementById('tess-options').style.display = 'none';
    trackEvent('voice_request');
    renderVoiceCard();
  }

  function renderVoiceCard() {
    const container = document.getElementById('tess-messages');
    const div = document.createElement('div');
    div.className = 'tess-voice-card';
    div.id = 'tess-voice-card';
    div.innerHTML = `
      <div class="tess-voice-avatar" id="tess-voice-avatar"><img src="${LOGO_IMG}" alt="Tess"/></div>
      <div class="tess-voice-name">Tess <span class="tess-voice-badge">AI</span></div>
      <div class="tess-voice-role" id="tess-voice-role">Live Voice Call</div>
      <button id="tess-voice-start-btn" class="tess-voice-btn" type="button">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
        Start voice call
      </button>
      <div class="tess-voice-note" id="tess-voice-note">Talk to Tess directly, right here in your browser. No phone call needed.</div>
    `;
    container.appendChild(div);
    scrollToBottom();

    document.getElementById('tess-voice-start-btn').addEventListener('click', () => startVoiceCall(div));
  }

  // ─── LIVE VOICE CALL ────────────────────────────────────────────────────
  async function startVoiceCall(cardEl) {
    trackEvent('voice_call_start');

    const roleEl = document.getElementById('tess-voice-role');
    const noteEl = document.getElementById('tess-voice-note');
    const startBtn = document.getElementById('tess-voice-start-btn');
    startBtn.disabled = true;
    startBtn.textContent = 'Connecting…';
    if (roleEl) roleEl.textContent = 'Connecting…';

    let micStream;
    try {
      micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      if (noteEl) noteEl.textContent = "Couldn't access your microphone. Check your browser's site permissions and try again.";
      startBtn.disabled = false;
      startBtn.textContent = 'Start voice call';
      if (roleEl) roleEl.textContent = 'Live Voice Call';
      return;
    }

    if (!CFG.backendUrl) {
      if (noteEl) noteEl.textContent = 'Voice call is not available right now.';
      micStream.getTracks().forEach(t => t.stop());
      startBtn.disabled = false;
      startBtn.textContent = 'Start voice call';
      return;
    }

    const wsUrl = CFG.backendUrl
      .replace(/^https:\/\//, 'wss://')
      .replace(/^http:\/\//, 'ws://')
      + '/ws/voice/' + state.sessionId;

    const voiceWs = new WebSocket(wsUrl);
    const call = {
      ws: voiceWs,
      micStream,
      micCtx: null,
      processor: null,
      micSource: null,
      playbackCtx: null,
      nextPlayTime: 0,
      muted: false,
      seconds: 0,
      timerInterval: null,
      ended: false,
    };
    state.voiceCall = call;

    voiceWs.onopen = () => {
      // Wait for the server's {type:'ready'} before streaming mic audio —
      // Gemini's Live session needs to finish its setup handshake first.
    };

    voiceWs.onmessage = async (e) => {
      let data;
      try { data = JSON.parse(e.data); } catch (err) { return; }

      if (data.type === 'ready') {
        beginMicStreaming(call);
        renderInCallUI(cardEl, call);
      } else if (data.type === 'audio' && data.data) {
        playVoiceChunk(call, data.data);
      } else if (data.type === 'interrupted') {
        // Visitor talked over Tess — drop whatever's still queued to play.
        if (call.playbackCtx) call.nextPlayTime = call.playbackCtx.currentTime;
      } else if (data.type === 'turn_complete') {
        setSpeaking(false);
      } else if (data.type === 'error') {
        endVoiceCall(cardEl, data.message || 'Call ended unexpectedly.');
      }
    };

    voiceWs.onclose = () => {
      if (!call.ended) endVoiceCall(cardEl, 'Call ended.');
    };

    voiceWs.onerror = () => {
      if (!call.ended) endVoiceCall(cardEl, "Couldn't connect. Check your connection and try again.");
    };
  }

  function beginMicStreaming(call) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    call.micCtx = new AudioCtx();
    call.micSource = call.micCtx.createMediaStreamSource(call.micStream);
    // ScriptProcessorNode is deprecated but has the broadest browser support
    // for raw PCM access without shipping a separate AudioWorklet module file.
    call.processor = call.micCtx.createScriptProcessor(2048, 1, 1);
    const inRate = call.micCtx.sampleRate;

    call.processor.onaudioprocess = (e) => {
      if (call.muted || call.ws.readyState !== WebSocket.OPEN) return;
      const input = e.inputBuffer.getChannelData(0);
      const pcm16 = downsampleTo16kPCM16(input, inRate);
      const b64 = arrayBufferToBase64(pcm16.buffer);
      call.ws.send(JSON.stringify({ type: 'audio', data: b64 }));
    };

    call.micSource.connect(call.processor);
    // Some browsers require the processor connected to a destination to
    // keep firing onaudioprocess, even though we don't want mic passthrough.
    const silentGain = call.micCtx.createGain();
    silentGain.gain.value = 0;
    call.processor.connect(silentGain);
    silentGain.connect(call.micCtx.destination);
  }

  function downsampleTo16kPCM16(float32Data, inputSampleRate) {
    const targetRate = 16000;
    const ratio = inputSampleRate / targetRate;
    const outLength = Math.floor(float32Data.length / ratio);
    const out = new Int16Array(outLength);
    for (let i = 0; i < outLength; i++) {
      const srcIndex = Math.floor(i * ratio);
      let s = float32Data[srcIndex];
      s = Math.max(-1, Math.min(1, s));
      out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return out;
  }

  function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  }

  function base64ToInt16Array(b64) {
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new Int16Array(bytes.buffer);
  }

  function playVoiceChunk(call, b64Audio) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!call.playbackCtx) {
      call.playbackCtx = new AudioCtx({ sampleRate: 24000 });
      call.nextPlayTime = call.playbackCtx.currentTime;
    }
    const int16 = base64ToInt16Array(b64Audio);
    const float32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) float32[i] = int16[i] / 0x8000;

    const buffer = call.playbackCtx.createBuffer(1, float32.length, 24000);
    buffer.copyToChannel(float32, 0);

    const source = call.playbackCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(call.playbackCtx.destination);

    const now = call.playbackCtx.currentTime;
    const startAt = Math.max(now, call.nextPlayTime);
    source.start(startAt);
    call.nextPlayTime = startAt + buffer.duration;

    setSpeaking(true);
    source.onended = () => {
      if (call.playbackCtx && call.nextPlayTime <= call.playbackCtx.currentTime + 0.05) {
        setSpeaking(false);
      }
    };
  }

  function setSpeaking(isSpeaking) {
    const avatar = document.getElementById('tess-voice-avatar');
    if (avatar) avatar.classList.toggle('tess-speaking', isSpeaking);
  }

  function renderInCallUI(cardEl, call) {
    const avatar = document.getElementById('tess-voice-avatar');
    if (avatar) avatar.classList.add('tess-call-live');

    const startBtn = document.getElementById('tess-voice-start-btn');
    const roleEl = document.getElementById('tess-voice-role');
    const noteEl = document.getElementById('tess-voice-note');
    if (startBtn) startBtn.remove();
    if (noteEl) noteEl.remove();

    if (roleEl) {
      roleEl.innerHTML = `<span class="tess-voice-status"><span class="tess-dot"></span><span id="tess-voice-timer">Talking 00:00</span></span>`;
    }

    call.timerInterval = setInterval(() => {
      call.seconds++;
      const m = String(Math.floor(call.seconds / 60)).padStart(2, '0');
      const s = String(call.seconds % 60).padStart(2, '0');
      const timerEl = document.getElementById('tess-voice-timer');
      if (timerEl) timerEl.textContent = `Talking ${m}:${s}`;
    }, 1000);

    const controls = document.createElement('div');
    controls.className = 'tess-voice-controls';
    controls.innerHTML = `
      <div class="tess-voice-btn-col">
        <button id="tess-voice-mute-btn" class="tess-voice-round-btn" type="button" title="Mute">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/>
          </svg>
        </button>
        <span class="tess-voice-btn-label">Mute</span>
      </div>
      <div class="tess-voice-btn-col">
        <button id="tess-voice-end-btn" class="tess-voice-round-btn tess-end-call" type="button" title="End call">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            <line x1="2" y1="2" x2="22" y2="22"/>
          </svg>
        </button>
        <span class="tess-voice-btn-label">End Call</span>
      </div>
    `;
    cardEl.appendChild(controls);

    document.getElementById('tess-voice-mute-btn').addEventListener('click', () => {
      call.muted = !call.muted;
      const btn = document.getElementById('tess-voice-mute-btn');
      const label = btn.parentElement.querySelector('.tess-voice-btn-label');
      btn.classList.toggle('tess-muted', call.muted);
      if (label) label.textContent = call.muted ? 'Unmute' : 'Mute';
    });

    document.getElementById('tess-voice-end-btn').addEventListener('click', () => {
      trackEvent('voice_call_end');
      try { call.ws.send(JSON.stringify({ type: 'end' })); } catch (err) {}
      endVoiceCall(cardEl, null);
    });
  }

  function endVoiceCall(cardEl, message) {
    const call = state.voiceCall;
    if (!call || call.ended) return;
    call.ended = true;

    if (call.timerInterval) clearInterval(call.timerInterval);
    try { call.ws.close(); } catch (err) {}
    call.micStream.getTracks().forEach(t => t.stop());
    if (call.processor) call.processor.disconnect();
    if (call.micSource) call.micSource.disconnect();
    if (call.micCtx) call.micCtx.close();
    if (call.playbackCtx) call.playbackCtx.close();

    state.voiceCall = null;
    if (cardEl && cardEl.parentElement) cardEl.remove();

    document.getElementById('tess-options').style.display = 'none';
    showInputArea();
    addMessage(message || 'Voice call ended. Want to keep chatting here, or leave your details and our team will follow up?');
    state.mode = 'chat';
  }


  // ─── INIT ─────────────────────────────────────────────────────────────────
  function init() {
    loadSession();
    injectStyles();
    createDOM();
    connectWebSocket();

    // Load Space Grotesk
    if (!document.querySelector('[data-tess-font]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700;800&display=swap';
      link.setAttribute('data-tess-font', '1');
      document.head.appendChild(link);
    }

    // Bubble click
    document.getElementById('tess-bubble').addEventListener('click', () => {
      state.isOpen ? closePanel() : openPanel();
    });

    // Popup click — open chat
    document.getElementById('tess-popup').addEventListener('click', (e) => {
      if (e.target.id !== 'tess-popup-close') openPanel();
    });

    // Popup close
    document.getElementById('tess-popup-close').addEventListener('click', (e) => {
      e.stopPropagation();
      // Popup never disappears — clicking X just opens the chat instead
      openPanel();
    });

    // Option buttons
    document.querySelectorAll('.tess-option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        if (action === 'livechat') {
          document.getElementById('tess-options').style.display = 'none';
          document.getElementById('tess-back-row').classList.add('show');
          showInputArea();
          trackEvent('livechat_start');
          addMessage("Enter your question below and a representative will get right back to you.");
          state.mode = 'chat';
        } else if (action === 'voice') {
          document.getElementById('tess-back-row').classList.add('show');
          handleVoice();
        }
      });
    });

    // Privacy policy modal
    document.getElementById('tess-privacy-link').addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('tess-privacy-overlay').classList.add('show');
    });
    document.getElementById('tess-privacy-close').addEventListener('click', () => {
      document.getElementById('tess-privacy-overlay').classList.remove('show');
    });
    document.getElementById('tess-privacy-overlay').addEventListener('click', (e) => {
      if (e.target.id === 'tess-privacy-overlay') {
        document.getElementById('tess-privacy-overlay').classList.remove('show');
      }
    });

    // Close button (chevron-down in header)
    document.getElementById('tess-header-close').addEventListener('click', () => closePanel());

    // Back button — return to options screen
    document.getElementById('tess-header-back').addEventListener('click', () => {
      // Reset to options view
      document.getElementById('tess-options').style.display = 'flex';
      document.getElementById('tess-input-area').style.display = 'none';
      document.getElementById('tess-messages').innerHTML = '';
      document.getElementById('tess-back-row').classList.remove('show');
      state.mode = 'select';
      state.messages = [];
    });

    // Send button
    document.getElementById('tess-send').addEventListener('click', () => handleSend());

    // Enter to send
    document.getElementById('tess-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    });

    // Image upload button — open file picker
    document.getElementById('tess-img-btn').addEventListener('click', () => {
      document.getElementById('tess-img-input').click();
    });

    // File selected — read as base64 and show preview
    document.getElementById('tess-img-input').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      // 5 MB guard
      if (file.size > 5 * 1024 * 1024) {
        addMessage("That image is over 5 MB. Please choose a smaller one.");
        e.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        // Compress image to max 800px wide/tall, ~150KB, before storing
        const img = new Image();
        img.onload = () => {
          const MAX = 800;
          let w = img.width, h = img.height;
          if (w > MAX || h > MAX) {
            if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
            else { w = Math.round(w * MAX / h); h = MAX; }
          }
          const canvas = document.createElement('canvas');
          canvas.width = w; canvas.height = h;
          canvas.getContext('2d').drawImage(img, 0, 0, w, h);
          // Start at quality 0.7, reduce until under 200KB
          let quality = 0.7;
          let dataUrl = canvas.toDataURL('image/jpeg', quality);
          while (dataUrl.length > 200000 && quality > 0.2) {
            quality -= 0.1;
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }
          state.pendingImage = dataUrl;
          document.getElementById('tess-img-preview').src = dataUrl;
          document.getElementById('tess-img-preview-row').classList.add('show');
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
      e.target.value = ''; // reset so same file can be reselected
    });

    // Remove preview
    document.getElementById('tess-img-remove').addEventListener('click', () => {
      state.pendingImage = null;
      document.getElementById('tess-img-preview').src = '';
      document.getElementById('tess-img-preview-row').classList.remove('show');
    });

    // WhatsApp button
    document.getElementById('tess-wa-btn').addEventListener('click', openWhatsApp);

    // Popup timing
    setTimeout(showPopup, CFG.popupDelay);
  }

  // ─── PUBLIC API ───────────────────────────────────────────────────────────
  window.Tess = {
    open: openPanel,
    close: closePanel,
    sendMessage: handleSend,
    humanTakeover: () => {
      state.isHumanMode = true;
      document.getElementById('tess-human-banner').style.display = 'block';
    },
    getLeads: () => JSON.parse(localStorage.getItem('tess_leads') || '[]'),
    clearLeads: () => localStorage.removeItem('tess_leads')
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
