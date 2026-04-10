import { useState } from "react";

const DEFAULT_SETTINGS = {
  influencers: [
    { id: 1, name: "Dan Martell", notes: "Systems-first thinking, frameworks, buy back your time energy, practical AI application" },
    { id: 2, name: "GaryVee", notes: "Document don't create, raw unfiltered takes, attention arbitrage, no-BS directness" },
    { id: 3, name: "Sam Gaudet", notes: "H.E.I.T. script framework, model proven formats before innovating, content as manufacturing not art" },
  ],
  buckets: [
    { id: 1, name: "AI TOOLS & WINS", description: "Practical AI tools a regular dad can use TODAY. Real results, real time saved." },
    { id: 2, name: "DAD IDENTITY & BALANCE", description: "The tension of being a provider, husband, and still chasing something more. Raw, real, relatable." },
    { id: 3, name: "ECONOMIC ANXIETY & AI DISPLACEMENT", description: "The fear that AI will take jobs. Reframing it as an opportunity, not a threat." },
  ],
  extraTopics: "",
};

const BUCKET_COLORS = ["#00ff87", "#ff6b35", "#a855f7", "#3b82f6", "#f59e0b"];

function buildPrompt(settings) {
  const influencerList = settings.influencers.map(i => `- ${i.name}: ${i.notes}`).join("\n");
  const bucketList = settings.buckets.map((b, idx) => `${idx + 1}. ${b.name} — ${b.description}`).join("\n");
  return `You are a content intelligence agent for @themannyhernandez, a personal brand for working dads on Instagram and TikTok.

BRAND MISSION: Help overwhelmed 9-5 dads adopt AI so they don't get left behind economically.
VOICE: Radical relatability — NOT polished expert. Document the journey, don't preach from the mountaintop.
PRIMARY AUDIENCE: The overwhelmed 9-5 dad. Stressed, time-starved, scared of being replaced by AI, identity tied to providing.

CONTENT BUCKETS:
${bucketList}

CREATOR STYLE DNA TO DRAW FROM:
${influencerList}

${settings.extraTopics ? `ADDITIONAL CONTENT FOCUS AREAS:\n${settings.extraTopics}\n` : ""}

SCORING CRITERIA (rate each topic 1-10):
- Audience Relevance (does this hit a 9-5 dad's real pain?)
- Trend Momentum (is this blowing up RIGHT NOW?)
- Bucket Fit (does it map cleanly to one of the buckets?)
- Manny's Unique Angle (can he tell this from personal experience, not as an expert?)
- Urgency (time-sensitive = higher score; evergreen = lower)

OUTPUT FORMAT — respond ONLY with a valid JSON object, no markdown, no explanation, no preamble:
{
  "date": "today's date",
  "top_pick": {
    "rank": 1,
    "topic": "topic title",
    "bucket": "bucket name",
    "score": 9,
    "why_now": "one sentence on why this is timely",
    "manny_angle": "one sentence on the specific personal angle Manny should take",
    "hook": "punchy opening hook for the video (10 words max)",
    "heit": {
      "hook": "hook line",
      "explain": "what to explain (1 sentence)",
      "illustrate": "real-life dad scenario to use",
      "takeaway": "the actionable thing the viewer does next"
    },
    "creator_style_note": "which creator's style fits this topic and why"
  },
  "briefs": [
    { "rank": 1, "topic": "...", "bucket": "...", "score": 0, "why_now": "...", "manny_angle": "...", "hook": "...", "urgency": "hot|warm|evergreen" }
  ]
}

Generate 6 total briefs (rank 1-6). Rank 1 should also be the top_pick with full H.E.I.T. breakdown.
Search for what is actually trending RIGHT NOW in: AI tools for productivity, AI job displacement news, working dad content, personal finance stress, everyday AI adoption. Make the topics current and specific, not generic.`;
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
  const [editingBucket, setEditingBucket] = useState(null);
  const [newInfluencer, setNewInfluencer] = useState({ name: "", notes: "" });
  const [newBucket, setNewBucket] = useState({ name: "", description: "" });
  const [showAddInfluencer, setShowAddInfluencer] = useState(false);
  const [showAddBucket, setShowAddBucket] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  const saveSettings = (updated) => {
    setSettings(updated);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  };

  const urgencyConfig = {
    hot: { label: "🔥 HOT", color: "#ff4444" },
    warm: { label: "⚡ WARM", color: "#ff9500" },
    evergreen: { label: "🌿 EVERGREEN", color: "#4ade80" },
  };

  const getBucketColor = (bucketName) => {
    const idx = settings.buckets.findIndex(b => bucketName?.toUpperCase().includes(b.name.split(" ")[0]));
    return BUCKET_COLORS[idx >= 0 ? idx % BUCKET_COLORS.length : 0];
  };

  const generateBrief = async () => {
    setLoading(true); setError(null); setBrief(null); setExpandedCard(null); setView("brief");
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-ipc": "true" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          system: buildPrompt(settings),
          messages: [{ role: "user", content: `Today is ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}. Search for what's trending right now in AI, working dad content, job displacement, and everyday productivity. Then generate my morning content brief as a JSON object only.` }],
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
  const SettingsView = () => (
    <div style={{ padding: "16px 16px 100px" }}>
      <div style={{ background: "#0f1a0f", border: "1px solid #00ff8722", borderRadius: 12, padding: 14, marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: "#00ff87", letterSpacing: 1, marginBottom: 6 }}>HOW THIS WORKS</div>
        <div style={{ fontSize: 12, color: "#555", lineHeight: 1.7 }}>
          • <strong style={{ color: "#888" }}>Creator Style DNA</strong> — add anyone whose content style you want to borrow from<br />
          • <strong style={{ color: "#888" }}>Content Buckets</strong> — the topic pillars your brand is built on<br />
          • <strong style={{ color: "#888" }}>Extra Focus Areas</strong> — specific topics you always want watched<br />
          Changes save instantly and take effect on your next brief.
        </div>
      </div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1, color: "#f0f0f0" }}>CREATOR STYLE DNA</div>
            <div style={{ fontSize: 11, color: "#444", marginTop: 2 }}>Whose content style to borrow from</div>
          </div>
          <button onClick={() => { setShowAddInfluencer(true); setShowAddBucket(false); }} style={{ background: "#00ff8715", border: "1px solid #00ff8733", borderRadius: 8, padding: "6px 12px", fontSize: 12, color: "#00ff87", fontWeight: 700, cursor: "pointer" }}>+ Add</button>
        </div>
        {showAddInfluencer && (
          <div style={{ background: "#111", border: "1px solid #00ff8733", borderRadius: 12, padding: 14, marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: "#00ff87", fontWeight: 700, marginBottom: 10, letterSpacing: 1 }}>NEW CREATOR</div>
            <input placeholder="Creator name (e.g. Alex Hormozi)" value={newInfluencer.name} onChange={e => setNewInfluencer({ ...newInfluencer, name: e.target.value })} style={inputStyle} />
            <textarea placeholder="Their style in your words (e.g. Volume content, lead with free value, no-fluff offers)" value={newInfluencer.notes} onChange={e => setNewInfluencer({ ...newInfluencer, notes: e.target.value })} rows={2} style={{ ...inputStyle, resize: "none", marginTop: 8 }} />
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
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1, color: "#f0f0f0" }}>CONTENT BUCKETS</div>
            <div style={{ fontSize: 11, color: "#444", marginTop: 2 }}>Your brand's core topic pillars</div>
          </div>
          <button onClick={() => { setShowAddBucket(true); setShowAddInfluencer(false); }} style={{ background: "#a855f715", border: "1px solid #a855f733", borderRadius: 8, padding: "6px 12px", fontSize: 12, color: "#a855f7", fontWeight: 700, cursor: "pointer" }}>+ Add</button>
        </div>
        {showAddBucket && (
          <div style={{ background: "#111", border: "1px solid #a855f733", borderRadius: 12, padding: 14, marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: "#a855f7", fontWeight: 700, marginBottom: 10, letterSpacing: 1 }}>NEW BUCKET</div>
            <input placeholder="Bucket name in CAPS (e.g. MINDSET SHIFTS)" value={newBucket.name} onChange={e => setNewBucket({ ...newBucket, name: e.target.value })} style={inputStyle} />
            <textarea placeholder="What kind of content goes here? Who is it for?" value={newBucket.description} onChange={e => setNewBucket({ ...newBucket, description: e.target.value })} rows={2} style={{ ...inputStyle, resize: "none", marginTop: 8 }} />
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button onClick={() => { if (!newBucket.name.trim()) return; saveSettings({ ...settings, buckets: [...settings.buckets, { id: Date.now(), ...newBucket }] }); setNewBucket({ name: "", description: "" }); setShowAddBucket(false); }} style={{ ...btnPrimary, background: "#a855f7", color: "#fff" }}>Save</button>
              <button onClick={() => setShowAddBucket(false)} style={btnGhost}>Cancel</button>
            </div>
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {settings.buckets.map((b, idx) => {
            const color = BUCKET_COLORS[idx % BUCKET_COLORS.length];
            return (
              <div key={b.id} style={{ background: "#0f0f0f", border: `1px solid ${color}22`, borderRadius: 12, padding: 14, borderLeft: `3px solid ${color}` }}>
                {editingBucket?.id === b.id ? (
                  <>
                    <input value={editingBucket.name} onChange={e => setEditingBucket({ ...editingBucket, name: e.target.value })} style={inputStyle} />
                    <textarea value={editingBucket.description} onChange={e => setEditingBucket({ ...editingBucket, description: e.target.value })} rows={2} style={{ ...inputStyle, resize: "none", marginTop: 8 }} />
                    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                      <button onClick={() => { saveSettings({ ...settings, buckets: settings.buckets.map(bk => bk.id === b.id ? editingBucket : bk) }); setEditingBucket(null); }} style={{ ...btnPrimary, background: color, color: "#000" }}>Save</button>
                      <button onClick={() => setEditingBucket(null)} style={btnGhost}>Cancel</button>
                    </div>
                  </>
                ) : (
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color, marginBottom: 3 }}>{b.name}</div>
                      <div style={{ fontSize: 11, color: "#555", lineHeight: 1.5 }}>{b.description}</div>
                    </div>
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      <button onClick={() => setEditingBucket({ ...b })} style={iconBtn}>✏️</button>
                      <button onClick={() => { if (settings.buckets.length > 1) saveSettings({ ...settings, buckets: settings.buckets.filter(bk => bk.id !== b.id) }); }} style={{ ...iconBtn, color: "#ff4444" }}>✕</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1, color: "#f0f0f0", marginBottom: 4 }}>EXTRA FOCUS AREAS</div>
        <div style={{ fontSize: 11, color: "#444", marginBottom: 10 }}>Specific topics, news, or angles to always watch for</div>
        <textarea placeholder="e.g. ConnectWise industry news, GoHighLevel updates, Latino dad perspective, side hustle tax tips..." value={settings.extraTopics} onChange={e => saveSettings({ ...settings, extraTopics: e.target.value })} rows={4} style={{ ...inputStyle, resize: "none" }} />
      </div>
      <button onClick={() => { if (window.confirm("Reset everything back to defaults?")) saveSettings(DEFAULT_SETTINGS); }} style={{ width: "100%", padding: "12px", background: "transparent", border: "1px solid #1f1f1f", borderRadius: 10, fontSize: 12, color: "#333", cursor: "pointer", fontFamily: "DM Sans" }}>Reset to defaults</button>
    </div>
  );

  const BriefView = () => (
    <div style={{ padding: "20px 16px 0" }}>
      <button onClick={generateBrief} disabled={loading} style={{ width: "100%", padding: "16px", background: loading ? "#111" : "#00ff87", color: loading ? "#555" : "#0a0a0a", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "DM Sans", animation: !loading && !brief ? "pulse-ring 2s infinite" : "none", transition: "background 0.2s" }}>
        {loading ? (<><span>Scanning trends</span><span style={{ display: "flex", gap: 3 }}>{[0,1,2].map(i => <span key={i} className="loading-dot" style={{ width: 4, height: 4, borderRadius: "50%", background: "#555", display: "inline-block", animationDelay: `${i*0.2}s` }} />)}</span></>) : <span>{brief ? "↻ Refresh Brief" : "⚡ Generate Today's Brief"}</span>}
      </button>
      {lastGenerated && !loading && (<div style={{ textAlign: "center", fontSize: 10, color: "#333", marginTop: 8, fontFamily: "DM Mono" }}>Generated at {lastGenerated.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</div>)}
      {error && <div style={{ marginTop: 12, padding: 12, background: "#1a0a0a", borderRadius: 10, border: "1px solid #3a1a1a", fontSize: 13, color: "#ff6b6b", textAlign: "center" }}>{error}</div>}
      {brief?.top_pick && (
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: "#555", fontWeight: 700, marginBottom: 10 }}>TODAY'S TOP PICK</div>
          <div style={{ background: "linear-gradient(135deg, #0f1a0f 0%, #0d0d0d 100%)", border: "1px solid #00ff8733", borderRadius: 16, padding: 18, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, #00ff87, transparent)" }} />
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ background: "#00ff8715", border: "1px solid #00ff8733", borderRadius: 6, padding: "3px 8px", fontSize: 10, color: "#00ff87", fontWeight: 700, letterSpacing: 1 }}>#1 MAKE THIS TODAY</div>
              <div style={{ background: "#0f0f0f", borderRadius: 8, padding: "4px 10px", fontSize: 18, fontWeight: 900, color: brief.top_pick.score >= 8 ? "#00ff87" : "#ff9500", fontFamily: "DM Mono" }}>{brief.top_pick.score}</div>
            </div>
            <div style={{ fontSize: 17, fontWeight: 800, lineHeight: 1.2, marginBottom: 8, letterSpacing: -0.3 }}>{brief.top_pick.topic}</div>
            <div style={{ background: "#00ff8710", borderRadius: 8, padding: "10px 12px", marginBottom: 12, borderLeft: "2px solid #00ff87" }}>
              <div style={{ fontSize: 10, color: "#00ff87", fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>HOOK</div>
              <div style={{ fontSize: 14, fontStyle: "italic", color: "#e0e0e0", lineHeight: 1.4 }}>"{brief.top_pick.hook}"</div>
            </div>
            {brief.top_pick.heit && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, letterSpacing: 2, color: "#555", fontWeight: 700, marginBottom: 8 }}>H.E.I.T. SCRIPT FRAMEWORK</div>
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
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {brief.top_pick.bucket && <div style={{ background: "#1a1a1a", borderRadius: 6, padding: "4px 8px", fontSize: 10, color: getBucketColor(brief.top_pick.bucket), fontWeight: 600 }}>{brief.top_pick.bucket}</div>}
              {brief.top_pick.creator_style_note && <div style={{ background: "#1a1a1a", borderRadius: 6, padding: "4px 8px", fontSize: 10, color: "#888" }}>🎯 {brief.top_pick.creator_style_note}</div>}
            </div>
          </div>
        </div>
      )}
      {brief?.briefs?.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: "#555", fontWeight: 700, marginBottom: 12 }}>FULL RANKED LIST</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {brief.briefs.map((item, idx) => {
              const color = getBucketColor(item.bucket);
              const urgency = urgencyConfig[item.urgency] || urgencyConfig.warm;
              const isExpanded = expandedCard === idx;
              return (
                <div key={idx} className="card" onClick={() => setExpandedCard(isExpanded ? null : idx)} style={{ background: "#0f0f0f", border: `1px solid ${isExpanded ? "#2a2a2a" : "#181818"}`, borderRadius: 12, padding: 14, cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: idx === 0 ? "#00ff8715" : "#111", border: `1px solid ${idx === 0 ? "#00ff8733" : "#1f1f1f"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: idx === 0 ? "#00ff87" : "#555", flexShrink: 0, fontFamily: "DM Mono" }}>{item.rank}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.2, paddingRight: 8, letterSpacing: -0.2 }}>{item.topic}</div>
                        <div style={{ fontSize: 16, fontWeight: 900, color: item.score >= 8 ? "#00ff87" : item.score >= 6 ? "#ff9500" : "#ff4444", fontFamily: "DM Mono", flexShrink: 0 }}>{item.score}</div>
                      </div>
                      <ScoreBar score={item.score} />
                      <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                        <div style={{ fontSize: 9, fontWeight: 700, color: urgency.color, background: `${urgency.color}15`, borderRadius: 4, padding: "2px 6px" }}>{urgency.label}</div>
                        <div style={{ fontSize: 9, color, background: `${color}15`, borderRadius: 4, padding: "2px 6px", fontWeight: 600 }}>{item.bucket}</div>
                      </div>
                      {isExpanded && (
                        <div className="expand-enter" style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #1a1a1a" }}>
                          <div style={{ marginBottom: 10 }}>
                            <div style={{ fontSize: 9, color: "#444", letterSpacing: 1, marginBottom: 4 }}>WHY NOW</div>
                            <div style={{ fontSize: 12, color: "#bbb", lineHeight: 1.5 }}>{item.why_now}</div>
                          </div>
                          <div style={{ marginBottom: 10 }}>
                            <div style={{ fontSize: 9, color: "#444", letterSpacing: 1, marginBottom: 4 }}>MANNY'S ANGLE</div>
                            <div style={{ fontSize: 12, color: "#bbb", lineHeight: 1.5 }}>{item.manny_angle}</div>
                          </div>
                          <div style={{ background: "#00ff8708", borderRadius: 8, padding: "10px 12px", borderLeft: "2px solid #00ff8755" }}>
                            <div style={{ fontSize: 9, color: "#00ff87aa", letterSpacing: 1, marginBottom: 4 }}>HOOK</div>
                            <div style={{ fontSize: 13, fontStyle: "italic", color: "#ddd", lineHeight: 1.4 }}>"{item.hook}"</div>
                          </div>
                        </div>
                      )}
                      <div style={{ marginTop: 8, fontSize: 10, color: "#2a2a2a" }}>{isExpanded ? "↑ tap to collapse" : "↓ tap for details"}</div>
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
          <div style={{ fontSize: 14, color: "#333", lineHeight: 1.6 }}>Hit the button above.<br />Your daily brief generates in seconds.</div>
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
        @keyframes slideDown { from { opacity: 0; max-height: 0; } to { opacity: 1; max-height: 600px; } }
        @keyframes pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(0,255,135,0.4); } 70% { box-shadow: 0 0 0 12px rgba(0,255,135,0); } 100% { box-shadow: 0 0 0 0 rgba(0,255,135,0); } }
        .loading-dot { animation: blink 1.2s infinite; }
        .loading-dot:nth-child(2) { animation-delay: 0.2s; }
        .loading-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes blink { 0%,80%,100% { opacity: 0.2; } 40% { opacity: 1; } }
        input:focus, textarea:focus { outline: none; border-color: #00ff8766 !important; }
        input::placeholder, textarea::placeholder { color: #333; }
      `}</style>
      <div style={{ background: "#0d0d0d", borderBottom: "1px solid #1a1a1a", padding: "20px 20px 16px" }}>
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
