import { useState } from "react";

const DEFAULT_SETTINGS = {
  influencers: [
    { id: 1, name: "Dan Martell", notes: "Systems-first thinking, frameworks, buy back your time energy, practical AI application for regular people" },
    { id: 2, name: "GaryVee", notes: "Document don't create, raw unfiltered takes, attention arbitrage, no-BS directness, life as content" },
    { id: 3, name: "Sam Gaudet", notes: "H.E.I.T. script framework (Hook, Explain, Illustrate, Takeaway), model proven formats before innovating, content as manufacturing not art" },
  ],
  extraTopics: "",
};

const PILLAR_COLORS = ["#00ff87", "#ff6b35", "#a855f7"];
const PILLARS = [
  { name: "AI FOR REGULAR DADS", color: "#00ff87" },
  { name: "BUILDING IN THE MARGINS", color: "#ff6b35" },
  { name: "FAITH & FATHERHOOD", color: "#a855f7" },
];

const MODE_CONFIG = {
  "Capture": { icon: "📱", color: "#ff6b35", equipment: "DJI Pocket or iPhone", note: "Raw, unplanned, no setup" },
  "Teach": { icon: "🎯", color: "#00ff87", equipment: "DJI Pocket", note: "One specific thing, step by step" },
  "Story": { icon: "🎬", color: "#a855f7", equipment: "Sony A7IV + Nanlite", note: "Cinematic, planned, Sony day only" },
};

const LEVER_CONFIG = {
  "Fear": { icon: "⚡", color: "#ff4444" },
  "Time": { icon: "⏰", color: "#ff9500" },
  "Identity": { icon: "🪞", color: "#a855f7" },
};

function buildPrompt(settings) {
  const influencerList = settings.influencers.map(i => `- ${i.name}: ${i.notes}`).join("\n");
  return `You are the content intelligence engine for @themannyhernandez — a personal brand built for working dads on Instagram and TikTok.

CORE POSITIONING: "Teaching regular dads how to use AI before it replaces them — one hour at a time."
BRAND THESIS: "Being a dad or having no time is never the real excuse to work for a better life."

WHO MANNY IS:
Latino husband, father, man of faith. Former video production company owner who traveled the world with artists. Voluntarily walked away to choose family. Now works a remote 9-5 at a corporate software company and builds his brand in the margins — one hour after work each day. Wakes up at 5:30am to work out. Cooks for his family on lunch breaks. He is NOT a guru. He is the proof of concept. His redemption arc, Latino identity, and faith show up authentically but are NOT the filter — every working dad should see himself in Manny.

PRIMARY AVATAR:
Working dads 28-45, any background. Gets home depleted. Quietly scared AI will replace him before he understands it. Does NOT see himself as a tech person. Zero tolerance for jargon. Core fears: falling behind economically, being invisible at home, not being enough for his family. Needs someone showing him exactly what to do — not another motivational account.

THE 3 CONTENT PILLARS (Phase 1 — these only, no exceptions):
1. AI FOR REGULAR DADS — Practical AI tools, workflows, and prompts for busy dads who are not tech people. Includes economic displacement angle. This is the PRIMARY differentiator. Lead with this.
2. BUILDING IN THE MARGINS — How Manny builds a brand, manages money, and executes big goals inside a full life with one hour per day. The redemption arc and proof of concept live here.
3. FAITH & FATHERHOOD — The why behind everything. Presence, intentionality, identity as a dad and husband. The emotional core that builds the most loyal audience.

THE 3 EMOTIONAL LEVERS — every piece of content must pull at least one:
1. FEAR — AI is coming. Falling behind. Being replaced. Not being enough.
2. TIME — The one resource dads never have enough of. Every minute matters.
3. IDENTITY — Who he is vs. who he wants to be. The gap that keeps him up at night.

VOICE RULES:
- Direct, real, zero fluff. Plain words, short sentences, no jargon.
- Never preachy, never motivational poster energy, never LinkedIn, never coach-speak, never hype bro.
- Think: texting a smart friend who knows exactly what you need to hear.
- Raw beats perfect — always. The struggle is as important as the win.
- Vulnerability rule: show the moments he wants to quit AND how he pushes through.

CONTENT MODES:
- Capture: Raw, unplanned, DJI Pocket or iPhone. Spontaneous real moments.
- Teach: One specific AI thing step by step. DJI Pocket. Structured but raw.
- Story: Cinematic, emotional, planned. Sony A7IV + Nanlite lights. ONCE PER WEEK MAX — Sunday hero piece only.

WEEKLY CONTENT SKELETON:
Monday — Capture (raw moment, any pillar)
Tuesday — Teach (AI tool or workflow)
Wednesday — Capture (building in the margins)
Thursday — Teach (system, routine, or hack)
Sunday — Story (cinematic hero piece, Sony only)

EQUIPMENT RULES:
- Sony A7IV + Nanlite: Story mode ONLY, once per week max. Sunday only.
- DJI Pocket: Daily capture and Teach mode. Consistency engine.
- iPhone: Stories, spontaneous moments, daily visibility.

HOOK PHILOSOPHY:
- First 1.7 seconds, spoken AND text overlay for muted viewers.
- Must connect to Fear, Time, or Identity — if it doesn't, it's wrong.
- Hook types: Contrarian / Number / Mistake / Relatable pain / Identity / Curiosity gap / Story / Value promise

CREATOR STYLE DNA:
${influencerList}

${settings.extraTopics ? `ADDITIONAL FOCUS AREAS:\n${settings.extraTopics}\n` : ""}

SCORING CRITERIA (rate 1-10 composite):
- Avatar Relevance: does this hit a tired, scared, time-starved working dad?
- Emotional Lever: does it pull Fear, Time, or Identity hard?
- Pillar Fit: does it map cleanly to one of the 3 pillars?
- Manny's Angle: can he tell this from lived experience, not as an expert?
- Urgency: time-sensitive vs evergreen

TODAY'S DATE CONTEXT: Use the day of the week to recommend the right content mode from the weekly skeleton above.

OUTPUT FORMAT — respond ONLY with a valid JSON object. No markdown, no backticks, no explanation, no preamble. Raw JSON only:
{
  "date": "today's date",
  "day_context": "e.g. It's Tuesday — Teach day. AI tool or workflow.",
  "top_pick": {
    "rank": 1,
    "topic": "topic title — written in Manny's voice, plain language",
    "pillar": "AI FOR REGULAR DADS | BUILDING IN THE MARGINS | FAITH & FATHERHOOD",
    "emotional_lever": "Fear | Time | Identity",
    "score": 9,
    "why_now": "one sentence — why is this timely or relevant today",
    "manny_angle": "one sentence — the specific lived experience angle Manny takes, not expert positioning",
    "content_mode": "Capture | Teach | Story",
    "equipment": "iPhone | DJI Pocket | Sony A7IV + Nanlite",
    "urgency": "hot|warm|evergreen",
    "hook": "punchy opening hook — 10 words max, connects to Fear Time or Identity",
    "heit": {
      "hook": "full hook line spoken on camera",
      "explain": "what to explain in plain language — one sentence",
      "illustrate": "specific real dad scenario from Manny's actual life to use",
      "takeaway": "the one actionable thing the viewer does in the next 10 minutes"
    },
    "caption_hook": "first line of the caption — a second hook that goes deeper",
    "cta": "one clear call to action matched to Phase 1 goals — share, save, or email list",
    "creator_style_note": "which creator's style fits and exactly why"
  },
  "briefs": [
    {
      "rank": 1,
      "topic": "...",
      "pillar": "...",
      "emotional_lever": "...",
      "score": 0,
      "why_now": "...",
      "manny_angle": "...",
      "content_mode": "...",
      "equipment": "...",
      "hook": "...",
      "urgency": "hot|warm|evergreen"
    }
  ]
}

Generate 6 total briefs (rank 1-6). Rank 1 is also the top_pick with full breakdown.
Base topics on what a working dad would genuinely care about today — AI replacing jobs, saving time, being present, economic anxiety, building something real. Keep it grounded in Manny's actual life, not abstract trends. Make every hook connect to Fear, Time, or Identity.`;
}

const inputStyle = { width: "100%", background: "#0a0a0a", border: "1px solid #1f1f1f", borderRadius: 8, padding: "10px 12px", fontSize: 13, color: "#f0f0f0", fontFamily: "'DM Sans', sans-serif" };
const btnPrimary = { flex: 1, padding: "10px", background: "#00ff87", color: "#000", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "DM Sans" };
const btnGhost = { flex: 1, padding: "10px", background: "transparent", color: "#555", border: "1px solid #1f1f1f", borderRadius: 8, fontSize: 13, cursor: "pointer", fontFamily: "DM Sans" };
const iconBtn = { background: "#111", border: "1px solid #1f1f1f", borderRadius: 6, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, cursor: "pointer", color: "#888" };

export default function MorningBrief() {
  const [view, setView] = useState("brief");
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [brief, setBrief] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const [lastGenerated, setLastGenerated] = useState(null);
  const [editingInfluencer, setEditingInfluencer] = useState(null);
  const [newInfluencer, setNewInfluencer] = useState({ name: "", notes: "" });
  const [showAddInfluencer, setShowAddInfluencer] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  const saveSettings = (updated) => {
    setSettings(updated);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  };

  const getPillarColor = (pillar) => {
    const p = PILLARS.find(p => pillar?.toUpperCase().includes(p.name.split(" ")[0]));
    return p ? p.color : "#666";
  };

  const generateBrief = async () => {
    setLoading(true); setError(null); setBrief(null); setExpandedCard(null); setView("brief");
    try {
      const response = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 2000,
          system: buildPrompt(settings),
          messages: [{ role: "user", content: `Today is ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}. Generate my morning content brief. Return raw JSON only — no markdown, no backticks, no explanation.` }],
        }),
      });
      const data = await response.json();
      const textBlock = data.content?.find(b => b.type === "text");
      if (!textBlock) throw new Error("No response");
      const clean = textBlock.text.trim().replace(/```json|```/gi, "").trim();
      setBrief(JSON.parse(clean));
      setLastGenerated(new Date());
    } catch (err) {
      setError("Failed to generate. Tap retry.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const ScoreBar = ({ score }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 4, background: "#1a1a1a", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${score * 10}%`, background: score >= 8 ? "#00ff87" : score >= 6 ? "#ff9500" : "#ff4444", borderRadius: 2, transition: "width 0.8s ease" }} />
      </div>
      <span style={{ fontFamily: "monospace", fontSize: 11, color: "#888", minWidth: 20 }}>{score}/10</span>
    </div>
  );

  const Tag = ({ label, color }) => (
    <div style={{ fontSize: 9, fontWeight: 700, color, background: `${color}18`, borderRadius: 4, padding: "2px 7px", border: `1px solid ${color}33` }}>{label}</div>
  );
  const SettingsView = () => (
    <div style={{ padding: "16px 16px 100px" }}>
      <div style={{ background: "#0f1a0f", border: "1px solid #00ff8722", borderRadius: 12, padding: 14, marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: "#00ff87", letterSpacing: 1, marginBottom: 6 }}>YOUR BRAND OS IS LOCKED IN</div>
        <div style={{ fontSize: 12, color: "#555", lineHeight: 1.7 }}>
          Core positioning, 3 pillars, emotional levers, voice rules, and weekly skeleton are all baked into the agent. Add creator references and extra focus areas below.
        </div>
      </div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 10, letterSpacing: 2, color: "#555", fontWeight: 700, marginBottom: 10 }}>YOUR 3 PILLARS</div>
        {PILLARS.map((p, i) => (
          <div key={i} style={{ background: "#0f0f0f", borderLeft: `3px solid ${p.color}`, borderRadius: 8, padding: "10px 12px", marginBottom: 6 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: p.color }}>{p.name}</div>
          </div>
        ))}
        <div style={{ fontSize: 10, color: "#333", marginTop: 6 }}>Pillars are fixed for Phase 1 (first 90 days). Non-negotiable.</div>
      </div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1, color: "#f0f0f0" }}>CREATOR STYLE DNA</div>
            <div style={{ fontSize: 11, color: "#444", marginTop: 2 }}>Whose content style to borrow from</div>
          </div>
          <button onClick={() => setShowAddInfluencer(true)} style={{ background: "#00ff8715", border: "1px solid #00ff8733", borderRadius: 8, padding: "6px 12px", fontSize: 12, color: "#00ff87", fontWeight: 700, cursor: "pointer" }}>+ Add</button>
        </div>
        {showAddInfluencer && (
          <div style={{ background: "#111", border: "1px solid #00ff8733", borderRadius: 12, padding: 14, marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: "#00ff87", fontWeight: 700, marginBottom: 10, letterSpacing: 1 }}>NEW CREATOR</div>
            <input placeholder="Creator name (e.g. Alex Hormozi)" value={newInfluencer.name} onChange={e => setNewInfluencer({ ...newInfluencer, name: e.target.value })} style={inputStyle} />
            <textarea placeholder="Their style in plain words" value={newInfluencer.notes} onChange={e => setNewInfluencer({ ...newInfluencer, notes: e.target.value })} rows={2} style={{ ...inputStyle, resize: "none", marginTop: 8 }} />
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button onClick={() => { if (!newInfluencer.name.trim()) return; saveSettings({ ...settings, influencers: [...settings.influencers, { id: Date.now(), ...newInfluencer }] }); setNewInfluencer({ name: "", notes: "" }); setShowAddInfluencer(false); }} style={btnPrimary}>Save</button>
              <button onClick={() => setShowAddInfluencer(false)} style={btnGhost}>Cancel</button>
            </div>
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {settings.influencers.map(inf => (
            <div key={inf.id} style={{ background: "#0f0f0f", border: "1px solid #1a1a1a", borderRadius: 12, padding: 14 }}>
              {editingInfluencer?.id === inf.id ? (
                <>
                  <input value={editingInfluencer.name} onChange={e => setEditingInfluencer({ ...editingInfluencer, name: e.target.value })} style={inputStyle} />
                  <textarea value={editingInfluencer.notes} onChange={e => setEditingInfluencer({ ...editingInfluencer, notes: e.target.value })} rows={2} style={{ ...inputStyle, resize: "none", marginTop: 8 }} />
                  <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                    <button onClick={() => { saveSettings({ ...settings, influencers: settings.influencers.map(i => i.id === inf.id ? editingInfluencer : i) }); setEditingInfluencer(null); }} style={btnPrimary}>Save</button>
                    <button onClick={() => setEditingInfluencer(null)} style={btnGhost}>Cancel</button>
                  </div>
                </>
              ) : (
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#f0f0f0", marginBottom: 3 }}>{inf.name}</div>
                    <div style={{ fontSize: 11, color: "#555", lineHeight: 1.5 }}>{inf.notes}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <button onClick={() => setEditingInfluencer({ ...inf })} style={iconBtn}>✏️</button>
                    <button onClick={() => { if (settings.influencers.length > 1) saveSettings({ ...settings, influencers: settings.influencers.filter(i => i.id !== inf.id) }); }} style={{ ...iconBtn, color: "#ff4444" }}>✕</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1, color: "#f0f0f0", marginBottom: 4 }}>EXTRA FOCUS AREAS</div>
        <div style={{ fontSize: 11, color: "#444", marginBottom: 10 }}>Specific topics or angles to always watch for</div>
        <textarea placeholder="e.g. ConnectWise news, GoHighLevel updates, Latino dad content, side hustle tax angles..." value={settings.extraTopics} onChange={e => saveSettings({ ...settings, extraTopics: e.target.value })} rows={4} style={{ ...inputStyle, resize: "none" }} />
      </div>
      <button onClick={() => { if (window.confirm("Reset to defaults?")) saveSettings(DEFAULT_SETTINGS); }} style={{ width: "100%", padding: "12px", background: "transparent", border: "1px solid #1f1f1f", borderRadius: 10, fontSize: 12, color: "#333", cursor: "pointer", fontFamily: "DM Sans" }}>Reset to defaults</button>
    </div>
  );

  const BriefView = () => (
    <div style={{ padding: "16px 16px 0" }}>
      {brief?.day_context && (
        <div style={{ background: "#0f0f0f", border: "1px solid #1f1f1f", borderRadius: 10, padding: "10px 14px", marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: "#00ff87", fontWeight: 700, letterSpacing: 1, marginBottom: 2 }}>TODAY'S MODE</div>
          <div style={{ fontSize: 13, color: "#888" }}>{brief.day_context}</div>
        </div>
      )}
      <button onClick={generateBrief} disabled={loading} style={{ width: "100%", padding: "16px", background: loading ? "#111" : "#00ff87", color: loading ? "#555" : "#0a0a0a", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "DM Sans", animation: !loading && !brief ? "pulse-ring 2s infinite" : "none", transition: "background 0.2s", marginBottom: 12 }}>
        {loading ? (<><span>Building your brief</span><span style={{ display: "flex", gap: 3 }}>{[0,1,2].map(i => <span key={i} className="loading-dot" style={{ width: 4, height: 4, borderRadius: "50%", background: "#555", display: "inline-block", animationDelay: `${i*0.2}s` }} />)}</span></>) : <span>{brief ? "↻ Refresh Brief" : "⚡ Generate Today's Brief"}</span>}
      </button>
      {lastGenerated && !loading && (<div style={{ textAlign: "center", fontSize: 10, color: "#333", marginBottom: 16, fontFamily: "DM Mono" }}>Generated at {lastGenerated.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</div>)}
      {error && <div style={{ marginBottom: 12, padding: 12, background: "#1a0a0a", borderRadius: 10, border: "1px solid #3a1a1a", fontSize: 13, color: "#ff6b6b", textAlign: "center" }}>{error}</div>}
      {brief?.top_pick && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: "#555", fontWeight: 700, marginBottom: 10 }}>TODAY'S TOP PICK</div>
          <div style={{ background: "linear-gradient(135deg, #0f1a0f 0%, #0d0d0d 100%)", border: "1px solid #00ff8733", borderRadius: 16, padding: 18, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, #00ff87, transparent)" }} />
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ background: "#00ff8715", border: "1px solid #00ff8733", borderRadius: 6, padding: "3px 8px", fontSize: 10, color: "#00ff87", fontWeight: 700, letterSpacing: 1 }}>#1 MAKE THIS TODAY</div>
              <div style={{ background: "#0f0f0f", borderRadius: 8, padding: "4px 10px", fontSize: 18, fontWeight: 900, color: brief.top_pick.score >= 8 ? "#00ff87" : "#ff9500", fontFamily: "DM Mono" }}>{brief.top_pick.score}</div>
            </div>
            <div style={{ fontSize: 17, fontWeight: 800, lineHeight: 1.2, marginBottom: 12, letterSpacing: -0.3 }}>{brief.top_pick.topic}</div>
            {brief.top_pick.content_mode && (
              <div style={{ background: "#111", borderRadius: 10, padding: "10px 12px", marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ fontSize: 20 }}>{MODE_CONFIG[brief.top_pick.content_mode]?.icon || "📱"}</div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: MODE_CONFIG[brief.top_pick.content_mode]?.color || "#888", letterSpacing: 0.5 }}>{brief.top_pick.content_mode?.toUpperCase()} MODE</div>
                  <div style={{ fontSize: 11, color: "#666", marginTop: 1 }}>📷 {brief.top_pick.equipment}</div>
                  <div style={{ fontSize: 10, color: "#444", marginTop: 1 }}>{MODE_CONFIG[brief.top_pick.content_mode]?.note}</div>
                </div>
              </div>
            )}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
              {brief.top_pick.pillar && <Tag label={brief.top_pick.pillar} color={getPillarColor(brief.top_pick.pillar)} />}
              {brief.top_pick.emotional_lever && <Tag label={`${LEVER_CONFIG[brief.top_pick.emotional_lever]?.icon || ""} ${brief.top_pick.emotional_lever}`} color={LEVER_CONFIG[brief.top_pick.emotional_lever]?.color || "#888"} />}
              {brief.top_pick.urgency && <Tag label={brief.top_pick.urgency === "hot" ? "🔥 HOT" : brief.top_pick.urgency === "warm" ? "⚡ WARM" : "🌿 EVERGREEN"} color={brief.top_pick.urgency === "hot" ? "#ff4444" : brief.top_pick.urgency === "warm" ? "#ff9500" : "#4ade80"} />}
            </div>
            <div style={{ background: "#00ff8710", borderRadius: 8, padding: "10px 12px", marginBottom: 12, borderLeft: "2px solid #00ff87" }}>
              <div style={{ fontSize: 10, color: "#00ff87", fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>OPENING HOOK</div>
              <div style={{ fontSize: 14, fontStyle: "italic", color: "#e0e0e0", lineHeight: 1.4 }}>"{brief.top_pick.hook}"</div>
            </div>
            {brief.top_pick.heit && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, letterSpacing: 2, color: "#555", fontWeight: 700, marginBottom: 8 }}>H.E.I.T. SCRIPT</div>
                {[{ key: "hook", label: "H", full: "Hook", color: "#ff6b35" }, { key: "explain", label: "E", full: "Explain", color: "#a855f7" }, { key: "illustrate", label: "I", full: "Illustrate", color: "#3b82f6" }, { key: "takeaway", label: "T", full: "Takeaway", color: "#00ff87" }].map(step => (
                  <div key={step.key} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                    <div style={{ width: 24, height: 24, borderRadius: 6, background: `${step.color}20`, border: `1px solid ${step.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900, color: step.color, flexShrink: 0, fontFamily: "DM Mono" }}>{step.label}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 9, color: "#444", letterSpacing: 1, marginBottom: 2 }}>{step.full.toUpperCase()}</div>
                      <div style={{ fontSize: 12, color: "#ccc", lineHeight: 1.4 }}>{brief.top_pick.heit[step.key]}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {brief.top_pick.caption_hook && (
              <div style={{ background: "#111", borderRadius: 8, padding: "10px 12px", marginBottom: 8 }}>
                <div style={{ fontSize: 9, color: "#555", letterSpacing: 1, marginBottom: 4 }}>CAPTION OPENER</div>
                <div style={{ fontSize: 12, color: "#bbb", lineHeight: 1.4, fontStyle: "italic" }}>"{brief.top_pick.caption_hook}"</div>
              </div>
            )}
            {brief.top_pick.cta && (
              <div style={{ background: "#111", borderRadius: 8, padding: "10px 12px", marginBottom: 8 }}>
                <div style={{ fontSize: 9, color: "#555", letterSpacing: 1, marginBottom: 4 }}>CTA</div>
                <div style={{ fontSize: 12, color: "#bbb", lineHeight: 1.4 }}>{brief.top_pick.cta}</div>
              </div>
            )}
            {brief.top_pick.manny_angle && (
              <div style={{ background: "#111", borderRadius: 8, padding: "10px 12px", marginBottom: 8 }}>
                <div style={{ fontSize: 9, color: "#555", letterSpacing: 1, marginBottom: 4 }}>YOUR ANGLE</div>
                <div style={{ fontSize: 12, color: "#bbb", lineHeight: 1.4 }}>{brief.top_pick.manny_angle}</div>
              </div>
            )}
            {brief.top_pick.creator_style_note && (<div style={{ fontSize: 10, color: "#444", marginTop: 6 }}>🎯 {brief.top_pick.creator_style_note}</div>)}
          </div>
        </div>
      )}
      {brief?.briefs?.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: "#555", fontWeight: 700, marginBottom: 12 }}>FULL RANKED LIST</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {brief.briefs.map((item, idx) => {
              const pillarColor = getPillarColor(item.pillar);
              const leverConfig = LEVER_CONFIG[item.emotional_lever] || {};
              const modeConfig = MODE_CONFIG[item.content_mode] || {};
              const isExpanded = expandedCard === idx;
              const urgencyColor = item.urgency === "hot" ? "#ff4444" : item.urgency === "warm" ? "#ff9500" : "#4ade80";
              const urgencyLabel = item.urgency === "hot" ? "🔥 HOT" : item.urgency === "warm" ? "⚡ WARM" : "🌿 EVERGREEN";
              return (
                <div key={idx} className="card" onClick={() => setExpandedCard(isExpanded ? null : idx)} style={{ background: "#0f0f0f", border: `1px solid ${isExpanded ? "#2a2a2a" : "#181818"}`, borderRadius: 12, padding: 14, cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: idx === 0 ? "#00ff8715" : "#111", border: `1px solid ${idx === 0 ? "#00ff8733" : "#1f1f1f"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: idx === 0 ? "#00ff87" : "#555", flexShrink: 0, fontFamily: "DM Mono" }}>{item.rank}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.2, paddingRight: 8, letterSpacing: -0.2 }}>{item.topic}</div>
                        <div style={{ fontSize: 16, fontWeight: 900, color: item.score >= 8 ? "#00ff87" : item.score >= 6 ? "#ff9500" : "#ff4444", fontFamily: "DM Mono", flexShrink: 0 }}>{item.score}</div>
                      </div>
                      <ScoreBar score={item.score} />
                      <div style={{ display: "flex", gap: 5, marginTop: 8, flexWrap: "wrap" }}>
                        <Tag label={urgencyLabel} color={urgencyColor} />
                        {item.content_mode && <Tag label={`${modeConfig.icon || ""} ${item.content_mode}`} color={modeConfig.color || "#888"} />}
                        {item.emotional_lever && <Tag label={`${leverConfig.icon || ""} ${item.emotional_lever}`} color={leverConfig.color || "#888"} />}
                        {item.pillar && <Tag label={item.pillar.split(" ")[0]} color={pillarColor} />}
                      </div>
                      {isExpanded && (
                        <div className="expand-enter" style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #1a1a1a" }}>
                          {item.equipment && (<div style={{ marginBottom: 8 }}><div style={{ fontSize: 9, color: "#444", letterSpacing: 1, marginBottom: 3 }}>EQUIPMENT</div><div style={{ fontSize: 12, color: "#bbb" }}>📷 {item.equipment}</div></div>)}
                          {item.why_now && (<div style={{ marginBottom: 8 }}><div style={{ fontSize: 9, color: "#444", letterSpacing: 1, marginBottom: 3 }}>WHY NOW</div><div style={{ fontSize: 12, color: "#bbb", lineHeight: 1.5 }}>{item.why_now}</div></div>)}
                          {item.manny_angle && (<div style={{ marginBottom: 8 }}><div style={{ fontSize: 9, color: "#444", letterSpacing: 1, marginBottom: 3 }}>YOUR ANGLE</div><div style={{ fontSize: 12, color: "#bbb", lineHeight: 1.5 }}>{item.manny_angle}</div></div>)}
                          {item.hook && (
                            <div style={{ background: "#00ff8708", borderRadius: 8, padding: "10px 12px", borderLeft: "2px solid #00ff8755" }}>
                              <div style={{ fontSize: 9, color: "#00ff87aa", letterSpacing: 1, marginBottom: 4 }}>HOOK</div>
                              <div style={{ fontSize: 13, fontStyle: "italic", color: "#ddd", lineHeight: 1.4 }}>"{item.hook}"</div>
                            </div>
                          )}
                        </div>
                      )}
                      <div style={{ marginTop: 8, fontSize: 10, color: "#2a2a2a" }}>{isExpanded ? "↑ collapse" : "↓ details"}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {!brief && !loading && !error && (
        <div style={{ textAlign: "center", padding: "50px 20px" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>☀️</div>
          <div style={{ fontSize: 14, color: "#333", lineHeight: 1.8 }}>Your brand OS is loaded.<br />Hit generate. Get your brief.<br /><span style={{ fontSize: 12, color: "#222" }}>One hour. One post. Every day.</span></div>
        </div>
      )}
      <div style={{ height: 40 }} />
    </div>
  );

  return (
    <div style={{ background: "#080808", minHeight: "100vh", fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", color: "#f0f0f0", paddingBottom: 80 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,500;0,9..40,700;0,9..40,900;1,9..40,400&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { display: none; }
        .card { transition: transform 0.15s ease; }
        .card:active { transform: scale(0.98); }
        .expand-enter { animation: slideDown 0.25s ease forwards; overflow: hidden; }
        @keyframes slideDown { from { opacity: 0; max-height: 0; } to { opacity: 1; max-height: 800px; } }
        @keyframes pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(0,255,135,0.4); } 70% { box-shadow: 0 0 0 12px rgba(0,255,135,0); } 100% { box-shadow: 0 0 0 0 rgba(0,255,135,0); } }
        .loading-dot { animation: blink 1.2s infinite; }
        .loading-dot:nth-child(2) { animation-delay: 0.2s; }
        .loading-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes blink { 0%,80%,100% { opacity: 0.2; } 40% { opacity: 1; } }
        input:focus, textarea:focus { outline: none; border-color: #00ff8766 !important; }
        input::placeholder, textarea::placeholder { color: #333; }
      `}</style>
      <div style={{ background: "#0d0d0d", borderBottom: "1px solid #1a1a1a", padding: "18px 20px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 3, color: "#555", fontWeight: 700, marginBottom: 4 }}>@THEMANNYHERNANDEZ</div>
            <div style={{ fontSize: 22, fontWeight: 900, lineHeight: 1.1, letterSpacing: -0.5 }}>Morning<span style={{ color: "#00ff87" }}> Brief</span></div>
          </div>
          <button onClick={() => setView(view === "settings" ? "brief" : "settings")} style={{ background: view === "settings" ? "#00ff8715" : "#111", border: `1px solid ${view === "settings" ? "#00ff8744" : "#1f1f1f"}`, borderRadius: 10, padding: "8px 14px", fontSize: 13, color: view === "settings" ? "#00ff87" : "#666", cursor: "pointer", fontWeight: 700, fontFamily: "DM Sans" }}>
            {view === "settings" ? "← Back" : "⚙️ Settings"}
          </button>
        </div>
        {savedFlash && <div style={{ marginTop: 8, fontSize: 11, color: "#00ff87", fontWeight: 600 }}>✓ Saved</div>}
      </div>
      {view === "settings" ? <SettingsView /> : <BriefView />}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#0d0d0d", borderTop: "1px solid #1a1a1a", display: "flex", height: 56 }}>
        {[{ id: "brief", label: "Brief", icon: "☀️" }, { id: "settings", label: "Settings", icon: "⚙️" }].map(tab => (
          <button key={tab.id} onClick={() => setView(tab.id)} style={{ flex: 1, background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, color: view === tab.id ? "#00ff87" : "#333", fontFamily: "DM Sans" }}>
            <span style={{ fontSize: 18 }}>{tab.icon}</span>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1 }}>{tab.label.toUpperCase()}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
