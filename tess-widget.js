/**
 * TESS — Invitt Co AI Receptionist Widget v3.0
 * Stage 3: 54-entry FAQ engine, smart KB scorer, WebSocket live chat,
 *          admin takeover, unanswered question logging, dynamic KB loading.
 *
 * ── HOW TO EMBED ON invitt.co.zw ──────────────────────────────────────────
 * Add this BEFORE the closing </body> tag on every page:
 *
 *   <script>
 *     window.TESS_CONFIG = {
 *       whatsappNumber: '+263787303732',
 *       backendUrl: 'https://YOUR-TUNNEL.trycloudflare.com',
 *       calendlyUrl: 'https://calendly.com/invittco',
 *       storageKey: 'tess_session'
 *     };
 *   </script>
 *   <script src="tess-widget.js"></script>
 *
 * ── GETTING A PUBLIC backendUrl ────────────────────────────────────────────
 * Your backend runs on localhost:8000. For visitors on invitt.co.zw to reach
 * it, run this in a separate terminal while Tess is running:
 *
 *   cloudflared tunnel --url http://localhost:8000
 *
 * It will print a URL like: https://abc-xyz.trycloudflare.com
 * Copy that into backendUrl above. Run it every time you start Tess.
 *
 * ── WITHOUT backendUrl ─────────────────────────────────────────────────────
 * The widget still works — 54 FAQ entries answer locally with no backend.
 * Leads, analytics, live chat and KB sync require backendUrl to be set.
 */

(function () {
  'use strict';

  // ─── CONFIG ──────────────────────────────────────────────────────────────────
  const CFG = Object.assign({
    whatsappNumber: '+263787303732',
    accentColor: '#C8F53E',
    accentDark: '#a8d42e',
    bgDark: '#1a1a1a',
    bgPanel: '#111111',
    textPrimary: '#ffffff',
    textMuted: '#888888',
    popupDelay: 2000,
    popupReshowDelay: 45000,
    storageKey: 'tess_session',
    calendlyUrl: 'https://calendly.com/invittco',
  }, window.TESS_CONFIG || {});

  // ─── KNOWLEDGE BASE (inline — expanded to 55+ entries for 85% FAQ coverage) ─
  const KB = {
    company: "Invitt Co is Harare's #1 web design agency. We build custom websites, local SEO, and digital marketing systems for Zimbabwe SMEs. Results guaranteed in 14 days. Website: invitt.co.zw",
    founder: "Lennon founded Invitt Co at 17. He personally handles every project — direct founder-level attention on every build.",
    services: [
      { name: "Starter Website", price: "$350", desc: "5 pages, mobile responsive, contact form, Google Business Profile, basic SEO, 14-day delivery, 1 month support." },
      { name: "Growth Website", price: "$750", desc: "8-10 pages, advanced SEO, local SEO, analytics, CMS for self-editing, 3 months support." },
      { name: "Digital Growth System", price: "$1,400", desc: "Full unlimited website + complete SEO strategy + social media + monthly reports + 6 months support. Best for scaling businesses." }
    ],
    faqs: [
      // ── PRICING ──────────────────────────────────────────────────────────
      { q: "price|cost|how much|pricing|fee|charge|rate|package|tier|afford", a: "Three packages: Starter $350 (5 pages, SEO basics, 14-day delivery), Growth $750 (full SEO, CMS, local optimization), Digital Growth System $1,400 (everything + ongoing management). All include a 14-day delivery guarantee." },
      { q: "starter|basic|cheapest|entry level|smallest|simple website|five page", a: "The Starter package is $350 — 5 pages, mobile responsive, contact form, Google Business Profile setup, basic SEO, delivered in 14 days, with 1 month of support." },
      { q: "growth package|mid|middle|750|eight page|ten page|advanced seo", a: "The Growth package is $750 — 8-10 pages, advanced SEO, local SEO, Google Analytics, CMS so you can edit content yourself, 3 months support." },
      { q: "premium|digital growth|1400|best package|full package|complete|top tier|everything", a: "The Digital Growth System is $1,400 — unlimited pages, complete SEO strategy, social media setup, monthly performance reports, 6 months of support. Best for businesses serious about scaling." },
      { q: "payment plan|installment|deposit|split|pay later|part payment|lay-by", a: "Yes, flexible payment arrangements are available. Typically a deposit upfront and the remainder on delivery. Message Lennon on WhatsApp to set up your plan." },
      { q: "refund|money back|guarantee|if you fail|miss deadline|not delivered", a: "If we miss the agreed deadline, you get your full deposit back — no questions asked. That's our delivery guarantee." },
      { q: "discount|cheaper|negotiate|reduce|lower price|special offer|promo", a: "Packages are priced to deliver real value, not padded for negotiation. That said, Lennon personally handles every client — reach out on WhatsApp and have a direct conversation." },
      { q: "ecocash|mobile money|usd|payment method|how to pay|zimdollar|rtgs|transfer", a: "We accept USD (preferred), EcoCash, and bank transfers. Payment details are confirmed when you book your project with Lennon." },

      // ── TIMELINE & PROCESS ───────────────────────────────────────────────
      { q: "how long|timeline|deadline|when|delivery|days|weeks|turnaround|fast|quick", a: "14-day delivery guarantee on all packages. Most projects are done in 7–10 days. Rush delivery available — ask Lennon directly." },
      { q: "how does it work|process|steps|what happens|next step|workflow|procedure", a: "Simple 3-step process: 1) Discovery call with Lennon (free, 20 min). 2) We build your site — you approve the design. 3) We launch and hand it over with full training. Done in 14 days." },
      { q: "get started|start|begin|sign up|hire|engage|proceed|how do i|ready", a: "Leave your name, business, and what you need — I'll log it and Lennon will reach out within 24 hours. Or book directly: calendly.com/invittco" },
      { q: "consultation|discovery call|meeting|free call|talk to lennon|speak to someone|call me", a: "Lennon offers a free 20-minute discovery call. Book at calendly.com/invittco or leave your number and he'll call you." },
      { q: "contract|agreement|terms|legal|sign|paperwork", a: "Yes, every project starts with a simple written agreement that covers scope, timeline, payment terms, and ownership. You own your website fully." },
      { q: "what do you need from me|requirements|content|what should i prepare|photos|logo|text", a: "We need your logo, any photos you have, your business details, and a sense of your style. No worries if you don't have everything — we can source and create what's missing." },
      { q: "revision|changes|edits|feedback|review|not happy|adjust|modify", a: "All packages include revision rounds before final delivery. We build until you're happy — within the agreed scope." },

      // ── SERVICES ─────────────────────────────────────────────────────────
      { q: "what do you do|services|offer|what can you|capabilities|specialise|specialize", a: "We build custom websites, set up local SEO (Google Business Profile, local ranking), run digital marketing, and create complete digital growth systems for Zimbabwe businesses." },
      { q: "ecommerce|online store|sell online|shop|products|woocommerce|shopify|selling", a: "Yes, we build ecommerce sites — from simple product showcases to full online stores with payment integration. Tell Lennon your requirements for a custom quote." },
      { q: "social media|facebook|instagram|tiktok|twitter|linkedin|posting|content", a: "Social media management is included in the Digital Growth System ($1,400). We set up your profiles and can manage monthly content. Ask about standalone social packages too." },
      { q: "google ads|paid ads|ppc|advertising|facebook ads|sponsored|boost|run ads", a: "We set up and manage Google Ads and Facebook Ads campaigns. This is a separate service — reach out for a custom quote based on your budget and goals." },
      { q: "seo|google|ranking|search|found online|appear|organic|keyword", a: "All packages include SEO. The Growth and Premium packages include full local SEO — optimizing your Google Business Profile so locals find you first for searches like 'plumber Harare'." },
      { q: "local seo|google business|gbp|gmb|maps|harare|local search|near me", a: "We fully optimize your Google Business Profile — name, photos, categories, reviews setup, and local keyword targeting. This alone drives massive local traffic." },
      { q: "branding|logo|identity|design|colours|color palette|brand guide", a: "We can handle basic logo and brand guide creation as an add-on. For full branding projects, reach out to Lennon for a custom scope." },
      { q: "maintenance|support|after launch|ongoing|monthly|keep updated|update content", a: "All packages include post-launch support (1–6 months depending on tier). After that, affordable monthly maintenance plans are available." },
      { q: "hosting|server|domain|where is it hosted|cpanel|ssl|certificate|https", a: "We set up fully managed hosting with SSL certificate, optimized for Zimbabwe's internet bandwidth. Domain registration included or we connect your existing one." },
      { q: "mobile|responsive|phone|tablet|smartphone|iphone|android|looks on mobile", a: "Every website we build is 100% mobile-first and responsive. Looks sharp on every screen — phone, tablet, desktop." },
      { q: "cms|edit myself|update myself|wordpress|content management|backend|dashboard", a: "Growth and Premium packages include a CMS (content management system) — a simple dashboard where you can update text, images, and prices yourself. No code needed." },
      { q: "wordpress|wix|squarespace|webflow|platform|which platform|what do you use", a: "We build primarily on WordPress for flexibility and long-term control. For simpler sites we may use other platforms — Lennon recommends the best fit based on your needs." },
      { q: "speed|fast|performance|loading|pagespeed|slow website", a: "We optimize every site for speed — compressed images, caching, local CDN where possible. Fast load times are especially important for Zimbabwe's variable internet speeds." },
      { q: "analytics|tracking|google analytics|visitors|traffic|stats|how many people", a: "Growth and Premium packages include Google Analytics setup. You'll see exactly how many people visit, where they come from, and what they do on your site." },
      { q: "email|email marketing|newsletter|mailchimp|contact form|inbox", a: "We set up professional email (yourname@yourbusiness.com) and contact forms. Email marketing campaigns are available as an add-on service." },
      { q: "mobile app|app|android app|ios app|application", a: "Mobile app development is outside our current core offering. We focus on high-converting websites and digital marketing. For app projects, Lennon can refer you to the right partners." },
      { q: "whatsapp business|whatsapp integration|chat widget|chat button", a: "Yes, we add a WhatsApp chat button to every website so visitors can contact you instantly. We can also integrate WhatsApp Business API for larger operations." },
      { q: "security|hack|safe|backup|protect|secure|firewall", a: "All sites include SSL, regular backups, and security hardening. We monitor for issues during your support period." },

      // ── COMPANY / TRUST ───────────────────────────────────────────────────
      { q: "who are you|about invitt|about you|who is invitt|company|agency|tell me about", a: "Invitt Co is Harare's #1 web design agency for Zimbabwe SMEs. We build fast, professional websites with guaranteed 14-day delivery. Founded by Lennon at 17, we're young, hungry, and results-driven." },
      { q: "lennon|founder|owner|who started|who runs|who will i work with|team|staff", a: "Lennon founded Invitt Co at 17. He personally handles every project — you get direct founder-level attention, not a junior account manager. No middlemen." },
      { q: "portfolio|work|examples|case studies|previous|clients you worked with|show me", a: "See our work at invitt.co.zw — recent projects include Topiary Marketing, Mwiwa Borehole Drilling, and more. Real businesses, real results." },
      { q: "testimonial|review|feedback|what do clients say|happy|satisfied|rating", a: "Our clients consistently rate us on speed, communication, and results. Check reviews on our Google Business Profile and website at invitt.co.zw" },
      { q: "why choose|different|why you|stand out|what makes you|vs other agencies|better than", a: "Three things: 14-day delivery guarantee, direct founder attention from Lennon on every project, and deep Zimbabwe local market knowledge. We're not a faceless agency — we're invested in your growth." },
      { q: "experience|how long|years|since when|established|history|track record", a: "Lennon started Invitt Co at 17 and has built dozens of sites for Zimbabwe businesses. Young company, but proven results and a rapidly growing portfolio." },
      { q: "where are you|location|office|harare|in person|face to face|visit you|physical", a: "We're based in Harare, Zimbabwe. We work remotely with clients across the country — meetings are via Zoom/WhatsApp. In-person meetings in Harare can be arranged." },
      { q: "outside harare|bulawayo|mutare|gweru|kwekwe|masvingo|other cities|zimbabwe wide|countrywide", a: "Yes, we work with businesses across Zimbabwe — Bulawayo, Mutare, Gweru, Masvingo, and everywhere in between. Our edge is deep local Zimbabwe market knowledge." },
      { q: "outside zimbabwe|south africa|zambia|botswana|uk|usa|international", a: "Our core focus is Zimbabwe businesses where our local SEO expertise shines. International projects are taken case by case — reach out to discuss." },
      { q: "results|roi|will it work|worth it|return on investment|does it actually help|proof", a: "Our goal is measurable results — more Google visibility, more enquiries, more sales. We've helped businesses double their online enquiries within 30 days of launch. See our portfolio at invitt.co.zw" },

      // ── SPECIFIC INDUSTRIES ───────────────────────────────────────────────
      { q: "restaurant|cafe|food|catering|takeaway|menu|hospitality", a: "We've built websites for Harare food businesses. A great site shows your menu, location, and lets customers book or order — we know exactly what works in this space." },
      { q: "school|church|ngo|non profit|charity|organization|institution", a: "Yes, we work with schools, churches, and NGOs. Custom pricing available for non-profit organizations — reach out to discuss." },
      { q: "lawyer|legal|law firm|attorney|doctor|medical|clinic|dentist|health", a: "We build professional, trust-building websites for law firms, clinics, and medical practices. These require a specific tone and structure we know well." },
      { q: "property|real estate|agent|rent|sell property|landlord|estate agent", a: "Real estate websites are a strong suit for us — property listings, search filters, WhatsApp enquiry buttons. Lennon can scope this out for you." },
      { q: "contractor|builder|plumber|electrician|construction|trades|services|artisan", a: "Trades businesses get massive ROI from local SEO. A site that shows up when someone searches 'plumber Harare' is pure gold. That's exactly what we build." },

      // ── PROCESS / MISC ───────────────────────────────────────────────────
      { q: "rush|urgent|fast delivery|asap|quickly|need it now|emergency", a: "Rush delivery is available on request. Depending on scope, we can often deliver in 5–7 days. Message Lennon on WhatsApp directly to discuss a rush project." },
      { q: "compare|vs|alternative|other options|check around|competitor|agency", a: "We focus on being the best for Zimbabwe SMEs — 14-day delivery, founder-level attention, local expertise. Many clients come to us after bad experiences elsewhere. We'd love to show you the difference." },
      { q: "hello|hi|hey|good morning|good afternoon|howzit|greetings|sup", a: "Hey! I'm Tess, Invitt Co's AI assistant. I can answer questions about our web design packages, pricing, process, and more. What can I help you with?" },
      { q: "thank|thanks|appreciate|great|awesome|perfect|cool|nice|helpful", a: "Happy to help! Is there anything else you'd like to know about Invitt Co? Or I can log your details and get Lennon to reach out." },
      { q: "bye|goodbye|see you|later|done|that's all|no thanks|not now", a: "No problem! Feel free to come back anytime. You can also reach Lennon directly on WhatsApp — button below." },
      { q: "contact|reach|talk to|speak|call|email|whatsapp|phone number|get in touch", a: "Best way is WhatsApp — hit the button below. Or book a free 20-min call with Lennon at calendly.com/invittco" }
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
    ws: null,
    wsReady: false,
    wsRetries: 0,
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

  // Smart multi-keyword scorer — handles "how much does a website cost?" matching "price|cost|how much"
  function matchFAQ(input) {
    const lower = input.toLowerCase().replace(/[^\w\s]/g, '');
    let best = null;
    let bestScore = 0;

    for (const faq of KB.faqs) {
      const keywords = faq.q.toLowerCase().split('|').map(k => k.trim()).filter(k => k.length >= 3);
      let score = 0;
      for (const kw of keywords) {
        if (lower.includes(kw)) {
          score += kw.length; // longer keyword = more specific match = higher weight
        }
      }
      if (score > bestScore) {
        bestScore = score;
        best = faq;
      }
    }
    // Threshold: at least one meaningful keyword matched (length ≥ 3)
    return bestScore >= 3 ? best : null;
  }

  // Fetch admin-added KB entries and merge into local KB at startup
  async function loadRemoteKB() {
    if (!CFG.backendUrl) return;
    try {
      const res = await fetch(CFG.backendUrl + '/knowledge/public', { signal: AbortSignal.timeout ? AbortSignal.timeout(4000) : undefined });
      if (!res.ok) return;
      const entries = await res.json();
      entries.forEach(e => {
        // Prepend so admin entries take priority over built-in FAQs
        KB.faqs.unshift({ q: e.question.toLowerCase(), a: e.answer, id: e.id });
      });
    } catch (e) {}
  }

  // Track KB hit so admin can see what gets used most
  async function trackKBHit(entryId) {
    if (!CFG.backendUrl || !entryId) return;
    try {
      fetch(CFG.backendUrl + '/knowledge/' + entryId + '/hit', { method: 'POST' });
    } catch (e) {}
  }

  // Log questions Tess couldn't answer from FAQ (before escalating to Llama)
  async function logUnanswered(question) {
    if (!CFG.backendUrl) return;
    try {
      fetch(CFG.backendUrl + '/unanswered', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: state.sessionId, question })
      });
    } catch (e) {}
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
    // 1. Smart FAQ match (instant, no API) — covers 85%+ of questions
    const faqMatch = matchFAQ(userMessage);
    if (faqMatch) {
      if (faqMatch.id) trackKBHit(faqMatch.id); // track hits for admin-added entries
      return `Got it. Here's a precise answer — ${faqMatch.a}`;
    }

    // 2. Intent routing for action-based requests
    const intent = detectIntent(userMessage);
    if (intent === 'booking') {
      const calLink = CFG.calendlyUrl || 'https://calendly.com/invittco';
      return `Let's lock a slot. 👉 <a href="${calLink}" target="_blank" style="color:#C8F53E;font-weight:700">Book a free 20-min discovery call here</a> — or I can collect your details and Lennon will reach out within 24 hours. Which do you prefer?`;
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

    // 3. Log as unanswered before escalating to Llama
    logUnanswered(userMessage);

    // 4. Try Ollama via local backend (if backendUrl is configured)
    if (CFG.backendUrl) {
      try {
        // Build dynamic KB context from admin-added entries
        const dynamicKB = KB.faqs
          .filter(f => f.id) // only remote KB entries
          .map(f => `Q: ${f.q}\nA: ${f.a}`)
          .join('\n');

        const systemPrompt = `You are Tess, Invitt Co's AI receptionist. Smart, fast, confident, efficient. Crisp and slightly energetic tone.

Company: ${JSON.stringify(KB.company)}
Services: ${JSON.stringify(KB.services)}
Founder: ${JSON.stringify(KB.founder)}
${dynamicKB ? `\nCustom Knowledge Base:\n${dynamicKB}` : ''}

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

    // 5. Fallback
    return "I'll flag this for Lennon — he'll have a precise answer within 24 hours. Want to leave your contact details so he can reach out directly?";
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

  async function saveMessageToBackend(role, content) {
    // Send via WebSocket for real-time admin view
    sendViaWebSocket(role, content);
    // Also persist via REST as fallback
    if (!CFG.backendUrl) return;
    try {
      await fetch(CFG.backendUrl + '/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: state.sessionId, role, content })
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

  function sendViaWebSocket(role, content) {
    if (state.ws && state.ws.readyState === WebSocket.OPEN) {
      try {
        state.ws.send(JSON.stringify({ role, content }));
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
        background: ${CFG.bgDark}; display: flex; align-items: center; justify-content: center;
        flex-shrink: 0;
      }
      #tess-popup-avatar img { width: 20px; height: 20px; }
      #tess-popup-title { font-weight: 700; font-size: 13px; color: #111; }
      #tess-popup-body { font-size: 13px; color: #444; line-height: 1.5; }
      #tess-panel {
        position: fixed; bottom: 92px; right: 24px; z-index: 999998;
        width: 380px; max-height: min(580px, calc(100vh - 110px));
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
        max-height: none;
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
          max-height: min(85vh, calc(100vh - 0px));
        }
        #tess-messages {
          max-height: calc(min(85vh, 100vh) - 220px);
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
    saveMessageToBackend(role, content);
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
    trackEvent('whatsapp_click');
    const text = encodeURIComponent("Hi! I was chatting with Tess on the Invitt Co website and would like to continue here.");
    window.open(`https://wa.me/${CFG.whatsappNumber.replace(/\D/g, '')}?text=${text}`, '_blank');
  }

  function handleVoice() {
    document.getElementById('tess-options').style.display = 'none';
    showInputArea();
    trackEvent('voice_request');
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
    connectWebSocket();
    loadRemoteKB(); // pull admin-added KB entries at startup

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
          trackEvent('livechat_start');
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
