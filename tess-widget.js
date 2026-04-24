/**
 * TESS — Invitt Co AI Receptionist Widget
 * Drop this script into any page to activate Tess.
 * Requires: TESS_CONFIG to be defined before this script, or defaults are used.
 *
 * Usage:
 *   <script>
 *     window.TESS_CONFIG = {
 *       whatsappNumber: '+263781234567',
 *       adminPassword: 'your-admin-password',
 *       backendUrl: 'https://your-tunnel.trycloudflare.com' // your local backend tunnel URL
 *     };
 *   </script>
 *   <script src="tess-widget.js"></script>
 */

(function () {
  'use strict';

  // ─── CONFIG ──────────────────────────────────────────────────────────────────
  const CFG = Object.assign({
    whatsappNumber: '+263781234567',
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

  // ─── KNOWLEDGE BASE (inline — no server needed) ───────────────────────────
  const KB = {
    company: "Invitt Co is Harare's #1 web design agency. We build custom websites, local SEO, and digital marketing systems for Zimbabwe SMEs. Results guaranteed in 14 days. Website: invitt.co.zw",
    founder: "Lennon founded Invitt Co at 17. He personally handles every project — direct founder-level attention on every build.",
    services: [
      { name: "Starter Website", price: "$350", desc: "5 pages, mobile responsive, contact form, Google Business Profile, basic SEO, 14-day delivery, 1 month support." },
      { name: "Growth Website", price: "$750", desc: "8-10 pages, advanced SEO, local SEO, analytics, CMS for self-editing, 3 months support." },
      { name: "Digital Growth System", price: "$1,400", desc: "Full unlimited website + complete SEO strategy + social media + monthly reports + 6 months support. Best for scaling businesses." }
    ],
    faqs: [
      { q: "how long", a: "14-day delivery guarantee. Most projects done in 7-10 days." },
      { q: "payment plan", a: "Yes. Flexible payment arrangements available. Message on WhatsApp to discuss." },
      { q: "refund", a: "If we miss the agreed deadline, you get your deposit back. No questions." },
      { q: "local seo", a: "We optimize your Google Business Profile and website so locals find you first — searches like 'plumber Harare' or 'restaurant Borrowdale'." },
      { q: "update website", a: "Growth and Premium packages include a CMS — update your content anytime, no code needed." },
      { q: "outside harare", a: "Yes, we work across Zimbabwe. Our edge is deep local market knowledge." },
      { q: "portfolio", a: "See our work at invitt.co.zw — including Topiary Marketing, Mwiwa Borehole Drilling, and more." },
      { q: "different", a: "Speed (14-day delivery), founder-level attention from Lennon personally, and local expertise. Not a faceless agency." },
      { q: "hosting", a: "We set up and can manage your hosting — optimized for Zimbabwe's internet." },
      { q: "get started", a: "Share your name, business, and what you need. I'll log you and get Lennon to reach out within 24 hours." },
      { q: "price", a: "Three tiers: Starter $350, Growth $750, Premium Digital Growth System $1,400. All include 14-day delivery." },
      { q: "cost", a: "Three tiers: Starter $350, Growth $750, Premium Digital Growth System $1,400. All include 14-day delivery." }
    ]
  };

  // ─── STATE ────────────────────────────────────────────────────────────────
  let state = {
    isOpen: false,
    mode: 'select', // select | chat | voice | lead | booking
    messages: [],
    lead: {},
    leadStep: 0,
    isHumanMode: false,
    isAdmin: false,
    sessionId: Date.now().toString(36),
    popupShown: false,
    typingTimeout: null,
  };

  const leadSteps = [
    { field: 'name', prompt: "Your full name?" },
    { field: 'email', prompt: "Business email?" },
    { field: 'phone', prompt: "WhatsApp/phone number?" },
    { field: 'business', prompt: "What type of business are you running?" },
    { field: 'budget', prompt: "Budget range? (e.g. under $500, $500-$1000, $1000+)" }
  ];

  // ─── STORAGE ─────────────────────────────────────────────────────────────
  function saveSession() {
    try {
      sessionStorage.setItem(CFG.storageKey, JSON.stringify({
        messages: state.messages.slice(-20),
        lead: state.lead,
        sessionId: state.sessionId
      }));
    } catch (e) {}
  }

  function loadSession() {
    try {
      const saved = JSON.parse(sessionStorage.getItem(CFG.storageKey) || '{}');
      if (saved.messages) state.messages = saved.messages;
      if (saved.lead) state.lead = saved.lead;
      if (saved.sessionId) state.sessionId = saved.sessionId;
    } catch (e) {}
  }

  // ─── LEAD SCORING ─────────────────────────────────────────────────────────
  function scoreLead(lead) {
    let score = 0;
    if (lead.email && lead.email.includes('@')) score += 25;
    if (lead.phone) score += 20;
    if (lead.business) score += 15;
    if (lead.budget) {
      if (lead.budget.includes('1000') || lead.budget.includes('1,000')) score += 40;
      else if (lead.budget.includes('500')) score += 25;
      else score += 10;
    }
    if (state.messages.length > 6) score += 10;
    return Math.min(score, 100);
  }

  // ─── AI RESPONSE ENGINE ───────────────────────────────────────────────────
  function matchFAQ(input) {
    const lower = input.toLowerCase();
    for (const faq of KB.faqs) {
      if (lower.includes(faq.q)) return faq.a;
    }
    return null;
  }

  function detectIntent(input) {
    const lower = input.toLowerCase();
    if (/book|appointment|meeting|call|schedule|slot/.test(lower)) return 'booking';
    if (/whatsapp|chat|message|contact/.test(lower)) return 'whatsapp';
    if (/lead|quote|proposal|details|info|interested/.test(lower)) return 'lead';
    if (/price|cost|how much|pricing|package|plan/.test(lower)) return 'pricing';
    if (/service|offer|do you|can you/.test(lower)) return 'services';
    if (/who|founder|lennon|owner|about/.test(lower)) return 'about';
    return null;
  }

  async function getAIResponse(userMessage) {
    // 1. Check FAQ match first (instant, no API)
    const faqMatch = matchFAQ(userMessage);
    if (faqMatch) return `Got it. Here's a precise answer — ${faqMatch}`;

    // 2. Intent routing
    const intent = detectIntent(userMessage);
    if (intent === 'booking') {
      return "Let's lock a slot. Book a free 20-min discovery call with Lennon: https://calendly.com/invittco — or I can collect your details and he'll reach out within 24 hours. Which do you prefer?";
    }
    if (intent === 'whatsapp') {
      return "I'll route you to WhatsApp now. [Click the button below to continue the conversation with Lennon directly.]";
    }
    if (intent === 'pricing' || intent === 'services') {
      return `Got it. Here's a precise answer — Three packages:\n\n• **Starter** $350 — 5-page website, SEO basics, 14-day delivery\n• **Growth** $750 — Full SEO, local optimization, CMS, analytics\n• **Digital Growth System** $1,400 — Everything + ongoing management\n\nAll come with a 14-day delivery guarantee. Which fits your stage?`;
    }
    if (intent === 'about') {
      return "Lennon founded Invitt Co at 17 — building Harare's best digital presence agency for SMEs. He personally handles every project. No middlemen. Direct founder attention on your business.";
    }

    // 3. Try Ollama via local backend (if backendUrl is configured)
    if (CFG.backendUrl) {
      try {
        const systemPrompt = `You are Tess, Invitt Co's AI receptionist. Smart, fast, confident, efficient. Crisp and slightly energetic tone.

Company info: ${JSON.stringify(KB.company)}
Services: ${JSON.stringify(KB.services)}
Founder: ${JSON.stringify(KB.founder)}

Rules:
- For FAQs: start with "Got it. Here's a precise answer —"
- For lead capture: say "Please share your details. I'll log this."
- For bookings: say "Let's lock a slot."
- For WhatsApp: say "I'll route you to WhatsApp now."
- Keep responses under 80 words.
- Never make up prices or services not listed.
- If you don't know, say "I'll flag this for Lennon — he'll have an answer within 24 hours."`;

        const res = await fetch(CFG.backendUrl + '/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system: systemPrompt,
            messages: [
              ...state.messages.slice(-6).map(m => ({ role: m.role, content: m.content })),
              { role: 'user', content: userMessage }
            ]
          })
        });
        const data = await res.json();
        if (data.text) return data.text;
      } catch (e) {}
    }

    // 4. Fallback smart response
    return "I'll flag this for Lennon — he'll have a precise answer within 24 hours. Want to leave your contact details so he can reach out directly?";
  }

  // ─── LEAD STORAGE (localStorage for persistence) ──────────────────────────
  function saveLead(lead) {
    try {
      const leads = JSON.parse(localStorage.getItem('tess_leads') || '[]');
      leads.push({
        ...lead,
        score: scoreLead(lead),
        timestamp: new Date().toISOString(),
        sessionId: state.sessionId,
        messages: state.messages.length
      });
      localStorage.setItem('tess_leads', JSON.stringify(leads));
    } catch (e) {}
  }

  // ─── STYLES ───────────────────────────────────────────────────────────────
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
        background: ${CFG.bgDark}; display: flex; align-items: center; justify-content: center;
        flex-shrink: 0;
      }
      #tess-popup-avatar img { width: 20px; height: 20px; }
      #tess-popup-title { font-weight: 700; font-size: 13px; color: #111; }
      #tess-popup-body { font-size: 13px; color: #444; line-height: 1.5; }
      #tess-panel {
        position: fixed; bottom: 92px; right: 24px; z-index: 999998;
        width: 380px; max-height: 580px;
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
      #tess-header-back {
        background: none; border: none; cursor: pointer; padding: 4px;
        display: none; align-items: center; justify-content: center;
        color: ${CFG.bgDark}; opacity: 0.7; margin-right: 4px;
      }
      #tess-header-back.show { display: flex; }
      #tess-header-back:hover { opacity: 1; }
      #tess-header-avatar {
        width: 40px; height: 40px; border-radius: 50%;
        background: ${CFG.bgDark}; display: flex; align-items: center; justify-content: center;
      }
      #tess-header-info { flex: 1; }
      #tess-header-name { font-weight: 800; font-size: 15px; color: ${CFG.bgDark}; text-transform: uppercase; letter-spacing: 0.5px; }
      #tess-header-sub { font-size: 12px; color: rgba(26,26,26,0.65); font-weight: 500; }
      #tess-header-status { display: flex; align-items: center; gap: 5px; font-size: 11px; color: ${CFG.bgDark}; font-weight: 600; }
      #tess-header-dot { width: 7px; height: 7px; border-radius: 50%; background: ${CFG.bgDark}; animation: tess-pulse 2s infinite; }
      #tess-messages {
        flex: 1; overflow-y: auto; padding: 16px;
        display: flex; flex-direction: column; gap: 10px;
        scrollbar-width: thin; scrollbar-color: #ddd transparent;
        background: #f7f7f7;
        min-height: 0;
        max-height: 340px;
      }
      .tess-msg { display: flex; gap: 8px; animation: tess-fade-in 0.2s ease; }
      .tess-msg-avatar {
        width: 28px; height: 28px; border-radius: 50%; background: ${CFG.accentColor};
        display: flex; align-items: center; justify-content: center;
        font-size: 11px; font-weight: 800; color: ${CFG.bgDark}; flex-shrink: 0; margin-top: 2px;
      }
      .tess-msg-bubble {
        background: #ffffff; color: #111; border-radius: 4px 16px 16px 16px;
        padding: 10px 14px; font-size: 13.5px; line-height: 1.55; max-width: 85%;
        border: 1px solid #e8e8e8; box-shadow: 0 1px 4px rgba(0,0,0,0.06);
      }
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
      #tess-options { padding: 0 16px 12px; display: flex; flex-direction: column; gap: 8px; flex-shrink: 0; background: #ffffff; }
      .tess-option-btn {
        background: #f5f5f5; border: 1.5px solid #e0e0e0; color: #111;
        border-radius: 12px; padding: 13px 18px; font-size: 14px; font-weight: 600;
        cursor: pointer; display: flex; align-items: center; gap: 10px;
        transition: background 0.15s, border-color 0.15s; text-align: left; width: 100%;
      }
      .tess-option-btn:hover { background: rgba(200,245,62,0.15); border-color: ${CFG.accentColor}; }
      .tess-option-btn svg { flex-shrink: 0; stroke: #555; }
      #tess-input-area {
        padding: 12px 16px; border-top: 1px solid #e8e8e8;
        display: flex; gap: 8px; flex-shrink: 0; background: #ffffff;
      }
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
      #tess-human-banner {
        margin: 8px 16px; background: rgba(200,245,62,0.12); border: 1px solid rgba(200,245,62,0.4);
        border-radius: 8px; padding: 8px 12px; font-size: 12px; color: #5a7a00;
        display: none; text-align: center; font-weight: 600;
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
          max-height: 85vh;
        }
        #tess-messages {
          max-height: calc(85vh - 220px);
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
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:18px;height:18px">
              <circle cx="12" cy="8" r="4" fill="${CFG.accentColor}"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="${CFG.accentColor}" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div id="tess-popup-title">Tess — Invitt Co AI</div>
        </div>
        <div id="tess-popup-body">Hi there! Have a question? Talk with us here 👋</div>
      </div>

      <!-- Main panel -->
      <div id="tess-panel" role="dialog" aria-label="Tess - Invitt Co AI Receptionist">
        <div id="tess-panel-header">
          <button id="tess-header-back" aria-label="Go back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${CFG.bgDark}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <div id="tess-header-avatar">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:22px;height:22px">
              <circle cx="12" cy="8" r="4" fill="${CFG.accentColor}"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="${CFG.accentColor}" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div id="tess-header-info">
            <div id="tess-header-name">HAVE A QUESTION?</div>
            <div id="tess-header-sub">Ivie</div>
          </div>
          <div id="tess-header-status"><span id="tess-header-dot"></span> Online</div>
        </div>

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

        <div id="tess-input-area" style="display:none">
          <textarea id="tess-input" placeholder="Type a message..." rows="1" maxlength="500"></textarea>
          <button id="tess-send" aria-label="Send">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${CFG.bgDark}" stroke-width="2.5" stroke-linecap="round">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>

        <div id="tess-footer">Powered by <a href="https://invitt.co.zw" target="_blank">Invitt Co</a></div>
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
  function addMessage(content, role = 'assistant') {
    const msg = { role, content, time: Date.now() };
    state.messages.push(msg);
    saveSession();
    renderMessage(msg);
    scrollToBottom();
  }

  function renderMessage(msg) {
    const container = document.getElementById('tess-messages');
    const div = document.createElement('div');
    div.className = `tess-msg${msg.role === 'user' ? ' tess-msg-user' : ''}`;

    const avatarText = msg.role === 'user' ? 'YOU' : 'T';
    const formattedContent = msg.content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');

    div.innerHTML = `
      <div class="tess-msg-avatar">${avatarText}</div>
      <div class="tess-msg-bubble">${formattedContent}</div>
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
    const el = document.getElementById('tess-messages');
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
    if (!input) return;

    document.getElementById('tess-input').value = '';
    addMessage(input, 'user');

    // Admin takeover check
    if (input === '/admin ' + CFG.adminPassword) {
      state.isAdmin = true;
      state.isHumanMode = true;
      document.getElementById('tess-human-banner').style.display = 'block';
      addMessage('Admin mode active. You are now controlling this conversation.');
      return;
    }

    if (state.isHumanMode && !state.isAdmin) {
      // Route to admin — in production, this would go via WebSocket
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

    // Normal AI response
    showTyping();
    getAIResponse(input).then(response => {
      hideTyping();
      addMessage(response);

      // Show WhatsApp button if routing
      if (response.toLowerCase().includes("whatsapp") || response.toLowerCase().includes("route you")) {
        showWAButton();
      }
    }).catch(() => {
      hideTyping();
      addMessage("Connection issue. Reach us directly on WhatsApp — button below.");
      showWAButton();
    });
  }

  function openPanel() {
    state.isOpen = true;
    document.getElementById('tess-panel').style.display = 'flex';
    document.getElementById('tess-popup').style.display = 'none';
    document.getElementById('tess-bubble').innerHTML = `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${CFG.bgDark}" stroke-width="2.5" stroke-linecap="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    `;

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
    state.isOpen = false;
    document.getElementById('tess-panel').style.display = 'none';
    document.getElementById('tess-bubble').innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="${CFG.bgDark}"/>
      </svg>
    `;
    // Always show popup immediately when chat is closed
    document.getElementById('tess-popup').style.display = 'block';
  }

  function showPopup() {
    if (!state.isOpen) {
      document.getElementById('tess-popup').style.display = 'block';
    }
  }

  function openWhatsApp() {
    const text = encodeURIComponent("Hi! I was chatting with Tess on the Invitt Co website and would like to continue here.");
    window.open(`https://wa.me/${CFG.whatsappNumber.replace(/\D/g, '')}?text=${text}`, '_blank');
  }

  function handleVoice() {
    // Display voice info — in production integrate Twilio here
    document.getElementById('tess-options').style.display = 'none';
    showInputArea();
    addMessage("Chat with Voice selected. Lennon will call you back within the hour during business hours (Mon–Fri 9am–5pm CAT). Leave your number and I'll flag it now.");
    state.mode = 'voice';
    setTimeout(() => {
      state.mode = 'lead';
      state.leadStep = 2; // Jump to phone step
      state.lead.intent = 'voice_callback';
      addMessage("Phone number?");
    }, 600);
  }

  // ─── INIT ─────────────────────────────────────────────────────────────────
  function init() {
    loadSession();
    injectStyles();
    createDOM();

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
          document.getElementById('tess-header-back').classList.add('show');
          showInputArea();
          addMessage("Tess here. Invitt Co AI assistant. What do you need?");
          state.mode = 'chat';
        } else if (action === 'voice') {
          document.getElementById('tess-header-back').classList.add('show');
          handleVoice();
        }
      });
    });

    // Back button — return to options screen
    document.getElementById('tess-header-back').addEventListener('click', () => {
      // Reset to options view
      document.getElementById('tess-options').style.display = 'flex';
      document.getElementById('tess-input-area').style.display = 'none';
      document.getElementById('tess-messages').innerHTML = '';
      document.getElementById('tess-header-back').classList.remove('show');
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
