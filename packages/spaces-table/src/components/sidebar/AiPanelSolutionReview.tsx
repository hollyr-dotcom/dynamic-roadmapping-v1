import React, { useState, useEffect, useRef } from "react";
import {
  IconButton,
  IconSquarePencil,
  IconClockCounterClockwise,
  IconSquaresFour,
  IconDotsThreeVertical,
  IconCross,
  IconChevronDown,
  IconPlus,
  IconArrowRight,
  IconSquareLineSquareDashed,
  IconSparks,
  IconSparksFilled,
  IconInsights,
} from "@mirohq/design-system";
import { roadmapData, sampleData, companyARR, customerQuotes, itemDependencies } from "@spaces/shared";
import type { SpaceRow } from "@spaces/shared";

/* ─── Escher-style AI avatar (gradient circle + sparkle icon) ─── */
function AgentAvatar({ size = 40 }: { size?: number }) {
  const iconSize = size === 28 ? 14 : 20;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        background:
          "linear-gradient(42deg, #322BFE 0%, #6E3CFE 27%, #A34CFF 55%, #D05DFF 82%, #F66EFF 109%)",
      }}
    >
      <svg width={iconSize} height={iconSize} viewBox="0 0 20 20" fill="none">
        <path d="M8.678 3.207c.325-1.368 2.319-1.37 2.644 0l.026.142.042.255c.49 2.625 2.599 4.662 5.26 5.046 1.554.224 1.562 2.473 0 2.698-2.747.394-4.906 2.552-5.302 5.3-.224 1.562-2.474 1.554-2.698 0-.396-2.747-2.554-4.906-5.302-5.3-1.559-.225-1.556-2.474 0-2.699l.256-.042c2.625-.49 4.662-2.599 5.046-5.26l.028-.14Z" fill="white" />
        {size >= 40 && (
          <>
            <path d="M3.5 14c0 1.38 1.12 2.5 2.5 2.5v1c-1.38 0-2.5 1.12-2.5 2.5h-1c0-1.38-1.12-2.5-2.5-2.5v-1c1.38 0 2.5-1.12 2.5-2.5h1Z" fill="white" />
            <path d="M17.5 0c0 1.38 1.12 2.5 2.5 2.5v1c-1.38 0-2.5 1.12-2.5 2.5h-1c0-1.38-1.12-2.5-2.5-2.5v-1c1.38 0 2.5-1.12 2.5-2.5h1Z" fill="white" />
          </>
        )}
      </svg>
    </div>
  );
}

/* ─── Hidden SVG gradient definition (rendered once) ─── */
function AiGradientDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute", pointerEvents: "none" }}>
      <defs>
        <linearGradient id="ai-sparkle-gradient" x1="0%" y1="0%" x2="100%" y2="100%" gradientTransform="rotate(42)">
          <stop offset="0%" stopColor="#322BFE" />
          <stop offset="27%" stopColor="#6E3CFE" />
          <stop offset="55%" stopColor="#A34CFF" />
          <stop offset="82%" stopColor="#D05DFF" />
          <stop offset="100%" stopColor="#F66EFF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─── Gradient sparkle icon wrapper ─── */
function GradientSparks({ filled, size = "small" }: { filled?: boolean; size?: "small" | "medium" | "large" }) {
  return (
    <span className="gradient-sparkle" style={{ display: "inline-flex", flexShrink: 0 }}>
      {filled ? <IconSparksFilled size={size} /> : <IconSparks size={size} />}
    </span>
  );
}

/* ─── Panel Header ─── */
function PanelHeader({ onClose }: { onClose?: () => void }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: 24,
        paddingRight: 12,
        height: 56,
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <span style={{ fontSize: 16, fontWeight: 600, color: "#222428", fontFamily: "var(--font-roobert)", fontFeatureSettings: "'ss01'" }}>
          Sidekick
        </span>
        <IconChevronDown size="small" color="icon-primary" />
        <div style={{ background: "#f1f2f5", borderRadius: 4, padding: "0 6px", height: 20, display: "flex", alignItems: "center", marginLeft: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#222428" }}>AI Beta</span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", position: "relative", zIndex: 10 }}>
        <IconButton aria-label="New chat" variant="ghost" size="medium" onPress={() => {}}><IconSquarePencil /></IconButton>
        <IconButton aria-label="History" variant="ghost" size="medium" onPress={() => {}}><IconClockCounterClockwise /></IconButton>
        <IconButton aria-label="Library" variant="ghost" size="medium" onPress={() => {}}><IconSquaresFour /></IconButton>
        <IconButton aria-label="More" variant="ghost" size="medium" onPress={() => {}}><IconDotsThreeVertical /></IconButton>
        <button onClick={() => onClose?.()} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#656B81] hover:bg-[#F1F2F5] transition-colors shrink-0" aria-label="Close"><IconCross css={{ width: 16, height: 16 }} /></button>
      </div>
    </div>
  );
}

/* ─── Clickable suggestion pill ─── */
function PromptPill({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "#fff",
        border: "1px solid #e0e2e8",
        borderRadius: 8,
        padding: "6px 12px",
        fontSize: 14,
        fontWeight: 400,
        color: "#222428",
        display: "inline-flex",
        alignItems: "center",
        cursor: "pointer",
      }}
    >
      {label}
    </div>
  );
}

/* ─── Checkbox option row ─── */
function CheckboxOption({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 12px",
        borderRadius: 8,
        background: checked ? "#E8ECFC" : "transparent",
        cursor: "pointer",
        transition: "background 150ms ease",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: 6,
          border: checked ? "none" : "2px solid #c4c7d0",
          background: checked ? "#3859FF" : "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "all 150ms ease",
        }}
      >
        {checked && (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7l3 3 5-5.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span style={{ fontSize: 14, fontWeight: 400, color: "#222428", lineHeight: 1.4 }}>
        {label}
      </span>
    </div>
  );
}

/* ─── User message bubble ─── */
function UserBubble({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", paddingLeft: 32 }}>
      <div style={{ background: "#f1f2f5", borderRadius: 8, padding: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 400, color: "#222428", lineHeight: 1.4 }}>{text}</span>
      </div>
    </div>
  );
}

/* ─── Typing indicator (three bouncing dots) ─── */
function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#AEB2C0",
              animation: `typingBounce 1.4s ease-in-out ${i * 0.16}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Streaming text reveal (word-by-word) ─── */
function StreamingText({ text, speed = 80, onComplete, onProgress }: { text: string; speed?: number; onComplete?: () => void; onProgress?: () => void }) {
  const words = text.split(' ');
  const [count, setCount] = useState(0);
  const doneRef = useRef(false);
  const chunkSize = 1;

  useEffect(() => {
    if (count >= words.length) {
      if (!doneRef.current) {
        doneRef.current = true;
        onComplete?.();
      }
      return;
    }
    const t = setTimeout(() => {
      setCount((c) => Math.min(c + chunkSize, words.length));
      onProgress?.();
    }, speed);
    return () => clearTimeout(t);
  }, [count, words.length, speed, chunkSize]);

  return <>{words.slice(0, count).join(' ')}</>;
}

/* ─── Analysing indicator (spinner + text + expanding steps) ─── */
function AnalysingIndicator({ steps }: { steps?: string[] }) {
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    if (!steps || revealed >= steps.length) return;
    const t = setTimeout(() => setRevealed(r => r + 1), 500);
    return () => clearTimeout(t);
  }, [revealed, steps?.length]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <svg width="20" height="20" viewBox="0 0 20 20" style={{ flexShrink: 0, animation: "spin 1.2s linear infinite" }}>
          <circle cx="10" cy="10" r="8" stroke="#e0e2e8" strokeWidth="2.5" fill="none" />
          <path d="M10 2a8 8 0 0 1 8 8" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </svg>
        <span style={{ fontSize: 14, fontWeight: 400, color: "#222428", lineHeight: 1.5 }}>
          Sidekick is analysing
        </span>
      </div>
      {steps && steps.length > 0 && (
        <div style={{ paddingLeft: 30, display: "flex", flexDirection: "column", gap: 6 }}>
          {steps.map((step, i) => (
            <div
              key={i}
              style={{
                fontSize: 13,
                color: i < revealed ? "#222428" : "#6f7489",
                lineHeight: 1.5,
                opacity: i <= revealed ? 1 : 0,
                transform: i <= revealed ? "translateY(0)" : "translateY(4px)",
                transition: "all 300ms ease-out",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {i < revealed ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M2.5 6l2.5 2.5 4.5-5" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <div style={{ width: 12, height: 12, flexShrink: 0 }} />
              )}
              {step}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── AI Citation chip (mds-ai-citation style) ─── */
function CitationChip({ label }: { label?: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 6px",
        background: hovered ? "#DFE1E6" : "#E9EAEF",
        borderRadius: 4,
        cursor: "pointer",
        verticalAlign: "middle",
        marginLeft: 4,
        transition: "background 150ms",
        flexShrink: 0,
        lineHeight: 1,
      }}
    >
      <IconInsights size="small" color="icon-secondary" />
      {label && <span style={{ fontSize: 12, fontWeight: 500, color: "#222428", whiteSpace: "nowrap" }}>{label}</span>}
    </span>
  );
}

/* ─── Evidence card (matches existing prototype card style) ─── */
function EvidenceCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ borderRadius: 12, overflow: "hidden", background: "#fff", boxShadow: "0px 2px 8px rgba(34,36,40,0.08)" }}>
      <div style={{ background: "#E8E0FF", display: "flex", alignItems: "center", gap: 8, padding: "14px 20px" }}>
        <GradientSparks filled size="small" />
        <span style={{ fontSize: 14, fontWeight: 700, color: "#3B2D7B", fontFamily: "var(--font-roobert)", fontFeatureSettings: "'ss01'" }}>{title}</span>
      </div>
      <div style={{ padding: "4px 0" }}>
        {children}
      </div>
    </div>
  );
}

/* ─── Evidence row inside a card ─── */
function EvidenceRow({ label, value, subtext, highlight }: { label: string; value: string; subtext?: string; highlight?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "10px 20px", borderBottom: "1px solid #f1f2f5" }}>
      <span style={{ fontSize: 13, fontWeight: 400, color: "#222428", lineHeight: 1.4, flex: 1 }}>{label}</span>
      <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: highlight ? "#7C3AED" : "#222428", lineHeight: 1.4 }}>{value}</span>
        {subtext && <div style={{ fontSize: 12, color: "#6f7489", fontWeight: 400 }}>{subtext}</div>}
      </div>
    </div>
  );
}

/* ─── Impact estimates grid (matches existing prototype style) ─── */
function ImpactEstimates({ mentions, customers, revenue }: { mentions: number; customers: number; revenue: number }) {
  return (
    <div style={{ padding: "16px 0" }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#222428", marginBottom: 16 }}>Impact estimates</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 16px" }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#222428", lineHeight: 1 }}>{mentions}</div>
          <div style={{ fontSize: 12, color: "#6f7489", marginTop: 4 }}>Total Mentions</div>
        </div>
        <div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#222428", lineHeight: 1 }}>{customers}</div>
          <div style={{ fontSize: 12, color: "#6f7489", marginTop: 4 }}>Unique Customers</div>
        </div>
        <div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#222428", lineHeight: 1 }}>{customers}</div>
          <div style={{ fontSize: 12, color: "#6f7489", marginTop: 4 }}>Total Users</div>
        </div>
        <div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#222428", lineHeight: 1 }}>${revenue}K</div>
          <div style={{ fontSize: 12, color: "#6f7489", marginTop: 4 }}>Impacted Customer ARR</div>
        </div>
      </div>
    </div>
  );
}

/* ─── Feedback card (matches existing prototype feedback cards) ─── */
function FeedbackCard({ quote, role, type }: { quote: string; role: string; type: 'positive' | 'neutral' }) {
  const bg = type === 'positive' ? '#F0FFF4' : '#F5F3FF';
  const borderColor = type === 'positive' ? '#C6F6D5' : '#E8E0FF';
  return (
    <div style={{ background: bg, border: `1px solid ${borderColor}`, borderRadius: 12, padding: "16px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 16 }}>{type === 'positive' ? '♡' : '⚑'}</span>
      </div>
      <span style={{ fontSize: 13, color: "#222428", lineHeight: 1.6, display: "block" }}>
        {quote}
      </span>
      <div style={{ fontSize: 12, color: "#7C3AED", fontWeight: 500, marginTop: 8 }}>{role}</div>
    </div>
  );
}

/* ─── Customer quote block (matches existing prototype quote style) ─── */
function QuoteBlock({ company, quote, role }: { company: string; quote: string; role: string }) {
  return (
    <div style={{ borderLeft: "3px solid #D4BBFF", padding: "12px 16px", background: "#FAFAFE", borderRadius: "0 8px 8px 0" }}>
      <span style={{ fontSize: 13, fontStyle: "italic", color: "#222428", lineHeight: 1.6 }}>"{quote}"</span>
      <div style={{ fontSize: 12, fontWeight: 600, color: "#7C3AED", marginTop: 6 }}>{company} — {role}</div>
    </div>
  );
}

/* ─── Dependency chain card ─── */
function DependencyCard({ dependencies }: { dependencies: { from: SpaceRow; to: SpaceRow; type: string }[] }) {
  return (
    <div style={{ borderRadius: 12, background: "#fff", boxShadow: "0px 2px 8px rgba(34,36,40,0.08)", overflow: "hidden" }}>
      <div style={{ background: "#FFF8F0", padding: "12px 20px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid #FFE8CC" }}>
        <span style={{ fontSize: 14 }}>⚠️</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#9C4221" }}>Blocking dependencies</span>
      </div>
      <div style={{ padding: "8px 0" }}>
        {dependencies.map((dep, i) => (
          <div key={i} style={{ padding: "10px 20px", borderBottom: i < dependencies.length - 1 ? "1px solid #f1f2f5" : "none", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#222428", lineHeight: 1.4 }}>{dep.from.title}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, margin: "4px 0" }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M6 2v8M6 10l-2.5-2.5M6 10l2.5-2.5" stroke="#E53E3E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#E53E3E", textTransform: "uppercase", letterSpacing: "0.5px" }}>blocks</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#222428", lineHeight: 1.4 }}>{dep.to.title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Impact card (gain/loss — matches prototype card styling) ─── */
function ImpactCard({ title, type, items }: { title: string; type: 'lose' | 'gain'; items: { label: string; value: string }[] }) {
  const bg = type === 'lose' ? '#FFF5F5' : '#F0FFF4';
  const borderColor = type === 'lose' ? '#FED7D7' : '#C6F6D5';
  const accent = type === 'lose' ? '#E53E3E' : '#38A169';
  return (
    <div style={{ border: `1px solid ${borderColor}`, borderRadius: 12, overflow: "hidden", background: bg, boxShadow: "0px 2px 8px rgba(34,36,40,0.06)" }}>
      <div style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 8, borderBottom: `1px solid ${borderColor}` }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: accent }}>{type === 'lose' ? '▼' : '▲'} {title}</span>
      </div>
      <div style={{ padding: "8px 20px 16px", display: "flex", flexDirection: "column", gap: 0 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#222428", lineHeight: 1.5, padding: "8px 0", borderBottom: i < items.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none" }}>
            <span>{item.label}</span>
            <span style={{ fontWeight: 700 }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Helper: get item by ID from both tables ─── */
function getItem(id: string): SpaceRow | undefined {
  return roadmapData.find(r => r.id === id) || sampleData.find(r => r.id === id);
}

/* ─── Helper: get Q2 items (priority: now, not done) ─── */
function getQ2Items(): SpaceRow[] {
  return roadmapData.filter(r => r.priority === 'now' && r.status !== 'done');
}

/* ─── Helper: get dependencies for an item ─── */
function getDeps(id: string) {
  return {
    blocks: itemDependencies.filter(d => d.from === id && d.type === 'blocks').map(d => getItem(d.to)).filter(Boolean) as SpaceRow[],
    dependsOn: itemDependencies.filter(d => d.to === id && d.type === 'blocks').map(d => getItem(d.from)).filter(Boolean) as SpaceRow[],
    related: itemDependencies.filter(d => (d.from === id || d.to === id) && d.type === 'related').map(d => getItem(d.from === id ? d.to : d.from)).filter(Boolean) as SpaceRow[],
  };
}

/* ─── Helper: short title ─── */
function shortTitle(title: string, maxLen = 40) {
  return title.length > maxLen ? title.slice(0, maxLen) + '…' : title;
}

/* ═══════════════════════════════════════════════════════════════
   SCRIPTED FLOW RESPONSES
   ═══════════════════════════════════════════════════════════════ */

type MessageContent = {
  text: string;
  cards?: React.ReactNode[];
  pills?: { label: string; key: string }[];
  loadingSteps?: string[];
};

function buildFlow1Initial(): MessageContent {
  const q2 = getQ2Items().sort((a, b) => b.estRevenue - a.estRevenue);
  const totalARR = q2.reduce((s, r) => s + r.estRevenue, 0);
  const noQuotes = q2.filter(r => !customerQuotes[r.id] || customerQuotes[r.id].length === 0);

  // Find overlooked backlog item
  const backlogHighSignal = sampleData
    .filter(s => !roadmapData.find(r => r.title === s.title))
    .sort((a, b) => b.estRevenue - a.estRevenue)[0];

  const totalMentions = q2.reduce((s, r) => s + r.mentions, 0);
  const totalCustomers = q2.reduce((s, r) => s + r.customers, 0);

  const text = `Your ${q2.length} Q2 items cover a combined $${(totalARR / 1000).toFixed(1)}M estimated revenue. Here's how they stack up:`;

  const formattedARR = totalARR >= 1000 ? `$${(totalARR / 1000).toFixed(1)}M` : `$${totalARR}K`;

  const cards: React.ReactNode[] = [
    <div key="combined" style={{ borderRadius: 12, background: "#fff", boxShadow: "0px 2px 8px rgba(34,36,40,0.08)", overflow: "hidden" }}>
      {/* Impact estimates */}
      <div style={{ padding: "16px 20px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#222428", marginBottom: 16 }}>Impact estimates</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 16px" }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#222428", lineHeight: 1 }}>{totalMentions}</div>
            <div style={{ fontSize: 12, color: "#6f7489", marginTop: 4 }}>Total Mentions</div>
          </div>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#222428", lineHeight: 1 }}>{totalCustomers}</div>
            <div style={{ fontSize: 12, color: "#6f7489", marginTop: 4 }}>Unique Customers</div>
          </div>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#222428", lineHeight: 1 }}>{totalCustomers}</div>
            <div style={{ fontSize: 12, color: "#6f7489", marginTop: 4 }}>Total Users</div>
          </div>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#222428", lineHeight: 1 }}>{formattedARR}</div>
            <div style={{ fontSize: 12, color: "#6f7489", marginTop: 4 }}>Impacted Customer ARR</div>
          </div>
        </div>
      </div>
      {/* Q2 items */}
      <div style={{ borderTop: "1px solid #F1F2F5" }}>
        <div style={{ background: "#E8E0FF", display: "flex", alignItems: "center", gap: 8, padding: "12px 20px" }}>
          <GradientSparks filled size="small" />
          <span style={{ fontSize: 14, fontWeight: 700, color: "#3B2D7B" }}>Q2 Roadmap Coverage</span>
        </div>
        {q2.map(item => (
          <EvidenceRow
            key={item.id}
            label={item.title}
            value={`$${item.estRevenue}K`}
            subtext={`${item.customers} customers · ${item.mentions} mentions`}
          />
        ))}
      </div>
    </div>,
  ];

  const findings: string[] = [];
  if (noQuotes.length > 0) {
    findings.push(`${noQuotes.length} of your Q2 items have no customer quotes linked: ${noQuotes.map(r => shortTitle(r.title, 30)).join(', ')}. High mention counts but no qualitative evidence.`);
  }
  if (backlogHighSignal) {
    findings.push(`Meanwhile, "${shortTitle(backlogHighSignal.title, 45)}" sits in your backlog with $${backlogHighSignal.estRevenue}K revenue from ${backlogHighSignal.customers} customers — worth a second look.`);
  }

  const fullText = text + (findings.length > 0 ? '\n\n' + findings.join('\n\n') : '');

  return {
    text: fullText,
    cards,
    loadingSteps: [
      "Reading Roadmap table…",
      "Cross-referencing Backlog data…",
      "Analyzing customer evidence…",
    ],
    pills: [
      { label: "Which Q2 items have no evidence?", key: "no-evidence" },
      { label: "What should I be worried about?", key: "worried" },
      { label: "Show the full backlog ranked by revenue", key: "backlog-ranked" },
    ],
  };
}

function buildFlow1NoEvidence(): MessageContent {
  const q2 = getQ2Items();
  const noQuotes = q2.filter(r => !customerQuotes[r.id] || customerQuotes[r.id].length === 0);

  const lines = noQuotes.map((item, i) =>
    `${i + 1}. **${shortTitle(item.title)}** — ${item.mentions} mentions, ${item.customers} customers, $${item.estRevenue}K. High signal but all quantitative; no verbatim customer quotes attached.`
  ).join('\n\n');

  return {
    text: `These ${noQuotes.length} Q2 items have mention counts but no linked customer quotes:\n\n${lines}\n\nThis doesn't mean customers don't want them — it means you're betting on numbers without hearing the "why." Consider connecting customer evidence before committing.`,
    loadingSteps: [
      "Scanning customer evidence…",
      "Checking Insights research data…",
    ],
    pills: [
      { label: "What's the strongest signal we're ignoring?", key: "strongest-ignored" },
      { label: "Am I betting on the right things for Q2?", key: "flow1-initial" },
    ],
  };
}

function buildFlow1Worried(): MessageContent {
  const deps = itemDependencies.filter(d => d.type === 'blocks');
  const depPairs = deps.map(d => {
    const from = getItem(d.from);
    const to = getItem(d.to);
    return from && to ? { from, to, type: d.type } : null;
  }).filter(Boolean) as { from: SpaceRow; to: SpaceRow; type: string }[];

  const cards: React.ReactNode[] = [];
  if (depPairs.length > 0) {
    cards.push(<DependencyCard key="deps" dependencies={depPairs} />);
  }

  return {
    text: `Here's what I'd flag:\n\nYou have ${deps.length} blocking dependencies in your Q2 roadmap. If any upstream item slips, the downstream ones are stuck.\n\n**Evidence gaps:** 3 items have zero customer quotes — you're prioritising based on numbers alone.\n\n**Backlog blind spot:** "Natural language search" has $190K revenue and 48 mentions in your backlog but isn't on the roadmap.`,
    cards,
    loadingSteps: [
      "Mapping dependency chains…",
      "Checking evidence coverage…",
      "Scanning backlog for blind spots…",
    ],
    pills: [
      { label: "Which Q2 items have no evidence?", key: "no-evidence" },
      { label: "Tell me about dependency risks", key: "worried" },
    ],
  };
}

function buildFlow1BacklogRanked(): MessageContent {
  const backlogOnly = sampleData
    .filter(s => !roadmapData.find(r => r.title === s.title))
    .sort((a, b) => b.estRevenue - a.estRevenue);

  const totalMentions = backlogOnly.reduce((s, r) => s + r.mentions, 0);
  const totalCustomers = backlogOnly.reduce((s, r) => s + r.customers, 0);
  const totalARR = backlogOnly.reduce((s, r) => s + r.estRevenue, 0);
  const formattedARR = totalARR >= 1000 ? `$${(totalARR / 1000).toFixed(1)}M` : `$${totalARR}K`;

  const cards: React.ReactNode[] = [
    <div key="backlog" style={{ borderRadius: 12, background: "#fff", boxShadow: "0px 2px 8px rgba(34,36,40,0.08)", overflow: "hidden" }}>
      <div style={{ padding: "16px 20px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#222428", marginBottom: 16 }}>Impact estimates</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 16px" }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#222428", lineHeight: 1 }}>{totalMentions}</div>
            <div style={{ fontSize: 12, color: "#6f7489", marginTop: 4 }}>Total Mentions</div>
          </div>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#222428", lineHeight: 1 }}>{totalCustomers}</div>
            <div style={{ fontSize: 12, color: "#6f7489", marginTop: 4 }}>Unique Customers</div>
          </div>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#222428", lineHeight: 1 }}>{totalCustomers}</div>
            <div style={{ fontSize: 12, color: "#6f7489", marginTop: 4 }}>Total Users</div>
          </div>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#222428", lineHeight: 1 }}>{formattedARR}</div>
            <div style={{ fontSize: 12, color: "#6f7489", marginTop: 4 }}>Impacted Customer ARR</div>
          </div>
        </div>
      </div>
      <div style={{ borderTop: "1px solid #F1F2F5" }}>
        <div style={{ background: "#E8E0FF", display: "flex", alignItems: "center", gap: 8, padding: "12px 20px" }}>
          <GradientSparks filled size="small" />
          <span style={{ fontSize: 14, fontWeight: 700, color: "#3B2D7B" }}>Backlog by Revenue</span>
        </div>
        {backlogOnly.slice(0, 6).map((item, i) => (
          <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "10px 20px", borderBottom: i < 5 ? "1px solid #f1f2f5" : "none" }}>
            <span style={{ fontSize: 13, fontWeight: 400, color: "#222428", lineHeight: 1.4, flex: 1 }}>{item.title}</span>
            <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#222428" }}>${item.estRevenue}K</span>
              <div style={{ fontSize: 12, color: "#6f7489" }}>{item.customers} customers · {item.priority}</div>
            </div>
          </div>
        ))}
      </div>
    </div>,
  ];

  return {
    text: `Here are your highest-revenue backlog items that aren't currently on the roadmap:`,
    cards,
    pills: [
      { label: "Tell me more about the top one", key: "flow2-top-backlog" },
      { label: "Am I betting on the right things for Q2?", key: "flow1-initial" },
    ],
  };
}

function buildFlow2(itemId: string): MessageContent {
  const item = getItem(itemId);
  if (!item) return { text: "I couldn't find that item. Could you try again?" };

  const arr = companyARR[item.id] || [];
  const quotes = customerQuotes[item.id] || [];
  const deps = getDeps(item.id);
  const jiraKey = 'jiraKey' in item ? (item as any).jiraKey : undefined;

  const cards: React.ReactNode[] = [];

  // Combined: Impact estimates + Top requesters in one block
  cards.push(
    <div key="impact-block" style={{ borderRadius: 12, background: "#fff", boxShadow: "0px 2px 8px rgba(34,36,40,0.08)", overflow: "hidden" }}>
      {/* Impact estimates 2x2 */}
      <div style={{ padding: "16px 20px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#222428", marginBottom: 16 }}>Impact estimates</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 16px" }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#222428", lineHeight: 1 }}>{item.mentions}</div>
            <div style={{ fontSize: 12, color: "#6f7489", marginTop: 4 }}>Total Mentions</div>
          </div>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#222428", lineHeight: 1 }}>{item.customers}</div>
            <div style={{ fontSize: 12, color: "#6f7489", marginTop: 4 }}>Unique Customers</div>
          </div>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#222428", lineHeight: 1 }}>{item.customers}</div>
            <div style={{ fontSize: 12, color: "#6f7489", marginTop: 4 }}>Total Users</div>
          </div>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#222428", lineHeight: 1 }}>${item.estRevenue}K</div>
            <div style={{ fontSize: 12, color: "#6f7489", marginTop: 4 }}>Impacted Customer ARR</div>
          </div>
        </div>
      </div>
      {/* Top requesters rows */}
      {arr.length > 0 && (
        <div style={{ borderTop: "1px solid #F1F2F5" }}>
          <div style={{ padding: "12px 20px 4px", fontSize: 13, fontWeight: 700, color: "#222428" }}>Top requesters</div>
          {arr.slice(0, 4).map((a, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "10px 20px", borderBottom: i < Math.min(arr.length, 4) - 1 ? "1px solid #f1f2f5" : "none" }}>
              <span style={{ fontSize: 13, color: "#222428" }}>{a.company}</span>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#222428" }}>${a.arr}K</span>
                <div style={{ fontSize: 12, color: "#6f7489" }}>{a.contacts} contacts</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Feedback cards
  if (quotes.length > 0) {
    cards.push(
      <div key="feedback" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#222428" }}>Feedback</div>
        {quotes.map((q, i) => (
          <FeedbackCard key={i} quote={q.quote} role={`${q.company} — ${q.role}`} type={i % 2 === 0 ? 'positive' : 'neutral'} />
        ))}
      </div>
    );
  }

  const depLines: string[] = [];
  if (deps.blocks.length > 0) depLines.push(`Blocks: ${deps.blocks.map(d => shortTitle(d.title, 30)).join(', ')}`);
  if (deps.dependsOn.length > 0) depLines.push(`Depends on: ${deps.dependsOn.map(d => shortTitle(d.title, 30)).join(', ')}`);
  if (deps.related.length > 0) depLines.push(`Related to: ${deps.related.map(d => shortTitle(d.title, 30)).join(', ')}`);

  const depText = depLines.length > 0 ? `\n\n**Cross-table connections:**\n${depLines.map(l => `• ${l}`).join('\n')}` : '\n\nNo blocking dependencies found.';

  return {
    text: `**${item.title}**${jiraKey ? ` (${jiraKey})` : ''} has $${item.estRevenue}K estimated revenue from ${item.customers} customers across ${item.companies.length} accounts.${depText}`,
    cards,
    loadingSteps: [
      `Reading ${jiraKey || item.id} from Roadmap table…`,
      "Pulling Insights evidence…",
      "Checking cross-table dependencies…",
    ],
    pills: [
      { label: "Is this big enough to bump something from Q2?", key: "bump-q2" },
      { label: "What depends on this?", key: "deps-detail" },
      { label: "Back to Q2 overview", key: "flow1-initial" },
    ],
  };
}

function buildFlow3(cutId: string, addId: string): MessageContent {
  const cutItem = getItem(cutId);
  const addItem = getItem(addId);
  if (!cutItem || !addItem) return { text: "I couldn't find one of those items. Could you try again?" };

  const cutDeps = getDeps(cutId);
  const addDeps = getDeps(addId);

  const loseItems: { label: string; value: string }[] = [
    { label: "Est. Revenue", value: `$${cutItem.estRevenue}K` },
    { label: "Customers", value: `${cutItem.customers}` },
    { label: "Mentions", value: `${cutItem.mentions}` },
  ];
  if (cutDeps.blocks.length > 0) {
    loseItems.push({ label: "Blocks", value: cutDeps.blocks.map(d => shortTitle(d.title, 25)).join(', ') });
  }

  const gainItems: { label: string; value: string }[] = [
    { label: "Est. Revenue", value: `$${addItem.estRevenue}K` },
    { label: "Customers", value: `${addItem.customers}` },
    { label: "Mentions", value: `${addItem.mentions}` },
  ];
  if (addDeps.blocks.length > 0) {
    gainItems.push({ label: "Blocks", value: addDeps.blocks.map(d => shortTitle(d.title, 25)).join(', ') });
  }

  const cards: React.ReactNode[] = [
    <ImpactCard key="lose" title={`Cutting: ${shortTitle(cutItem.title, 30)}`} type="lose" items={loseItems} />,
    <ImpactCard key="gain" title={`Adding: ${shortTitle(addItem.title, 30)}`} type="gain" items={gainItems} />,
  ];

  const netDiff = addItem.estRevenue - cutItem.estRevenue;
  const netText = netDiff >= 0
    ? `Net: +$${netDiff}K revenue, but`
    : `Net: -$${Math.abs(netDiff)}K revenue.`;

  let riskText = '';
  if (cutDeps.blocks.length > 0) {
    const downstream = cutDeps.blocks.map(d => `"${shortTitle(d.title, 30)}" ($${d.estRevenue}K)`).join(' and ');
    riskText = ` Cutting ${shortTitle(cutItem.title, 25)} also affects ${downstream}, which depend${cutDeps.blocks.length === 1 ? 's' : ''} on it.`;
  }

  return {
    text: `Here's the trade-off:\n\n${netText}${riskText}\n\n${addDeps.blocks.length === 0 && addDeps.dependsOn.length === 0 ? `"${shortTitle(addItem.title, 30)}" has no blocking dependencies — it's a clean addition.` : ''}`,
    cards,
    loadingSteps: [
      `Reading ${shortTitle(cutItem.title, 25)}…`,
      `Reading ${shortTitle(addItem.title, 25)}…`,
      "Mapping dependency chains…",
      "Comparing evidence strength…",
    ],
    pills: [
      { label: "What else could we cut instead?", key: "alt-cut" },
      { label: "What if we descope to MVP?", key: "descope" },
      { label: "Back to Q2 overview", key: "flow1-initial" },
    ],
  };
}

function buildAltCut(): MessageContent {
  const q2 = getQ2Items().sort((a, b) => a.estRevenue - b.estRevenue);
  const safest = q2.find(item => {
    const deps = getDeps(item.id);
    return deps.blocks.length === 0 && (!customerQuotes[item.id] || customerQuotes[item.id].length === 0);
  });

  const lines = q2.slice(0, 3).map((item, i) => {
    const deps = getDeps(item.id);
    const hasQuotes = customerQuotes[item.id] && customerQuotes[item.id].length > 0;
    const risk = deps.blocks.length > 0 ? 'blocks other items' : hasQuotes ? 'has customer quotes' : 'no dependencies, no quotes';
    return `${i + 1}. **${shortTitle(item.title, 35)}** — $${item.estRevenue}K, ${item.customers} customers. ${risk}.`;
  }).join('\n\n');

  let recommendation = '';
  if (safest) {
    recommendation = `\n\nIf you need room, **${shortTitle(safest.title, 35)}** is the cleanest cut: decent revenue signal but no qualitative backing and nothing depends on it.`;
  }

  return {
    text: `Looking at your Q2 items by lowest evidence strength:\n\n${lines}${recommendation}`,
    pills: [
      { label: "Am I betting on the right things for Q2?", key: "flow1-initial" },
    ],
  };
}

/* ═══════════════════════════════════════════════════════════════
   FLOW ROUTING — matches user input to a flow response
   ═══════════════════════════════════════════════════════════════ */

function routeInput(text: string): MessageContent {
  const lower = text.toLowerCase().trim();

  // Flow 1 triggers
  if (/betting|right things|q2 overview|q2 items/i.test(lower)) return buildFlow1Initial();
  if (/no evidence|zero.*evidence|no.*quotes/i.test(lower)) return buildFlow1NoEvidence();
  if (/worried|risk|concern|flag/i.test(lower)) return buildFlow1Worried();
  if (/backlog.*rank|rank.*backlog|full backlog/i.test(lower)) return buildFlow1BacklogRanked();
  if (/strongest.*ignor/i.test(lower)) return buildFlow1BacklogRanked();

  // Flow 3 triggers — "cut X for Y" / "swap X for Y" / "replace X with Y"
  const cutMatch = lower.match(/cut(?:ting)?\s+(.+?)\s+(?:for|to make room for|and add|replace with)\s+(.+)/i)
    || lower.match(/swap\s+(.+?)\s+(?:for|with)\s+(.+)/i)
    || lower.match(/replace\s+(.+?)\s+with\s+(.+)/i);
  if (cutMatch) {
    const cutName = cutMatch[1].trim();
    const addName = cutMatch[2].trim();
    const allItems = [...roadmapData, ...sampleData];
    const cutItem = allItems.find(r => r.title.toLowerCase().includes(cutName));
    const addItem = allItems.find(r => r.title.toLowerCase().includes(addName));
    if (cutItem && addItem) return buildFlow3(cutItem.id, addItem.id);
  }

  // Flow 3 drill-ins
  if (/what else.*cut|alt.*cut|instead/i.test(lower)) return buildAltCut();
  if (/descope|mvp/i.test(lower)) {
    return {
      text: "Descoping to an MVP is a smart way to keep momentum without cutting entirely. You'd ship the core value proposition now and push advanced features to Q3.\n\nFor example, if you descope Smart budgeting to just the spending forecast (without the recommendation engine), you'd reduce effort by ~40% and keep the dependency chain intact for Real-time categorisation.",
      pills: [
        { label: "Am I betting on the right things for Q2?", key: "flow1-initial" },
        { label: "What else could we cut instead?", key: "alt-cut" },
      ],
    };
  }

  // Flow 2 triggers — item-specific questions
  const allItems = [...roadmapData, ...sampleData];
  for (const item of allItems) {
    const keywords = item.title.toLowerCase().split(/\s+/).filter(w => w.length > 4);
    const matchCount = keywords.filter(w => lower.includes(w)).length;
    if (matchCount >= 2) return buildFlow2(item.id);
  }

  // "bump" something from Q2
  if (/bump|promote|move.*roadmap/i.test(lower)) {
    return {
      text: "To make room on the Q2 roadmap, you'd need to cut or descope an existing item. Your lowest-evidence items are the safest candidates. Want me to show you which Q2 items have the weakest backing?",
      pills: [
        { label: "What else could we cut instead?", key: "alt-cut" },
        { label: "Am I betting on the right things for Q2?", key: "flow1-initial" },
      ],
    };
  }

  // Deps
  if (/depend|block|what.*depends/i.test(lower)) {
    const depPairs = itemDependencies
      .filter(d => d.type === 'blocks')
      .map(d => {
        const from = getItem(d.from);
        const to = getItem(d.to);
        return from && to ? { from, to, type: d.type } : null;
      }).filter(Boolean) as { from: SpaceRow; to: SpaceRow; type: string }[];
    return {
      text: `Here are the blocking dependencies across your roadmap. If any upstream item slips, the downstream ones are stuck.`,
      cards: [<DependencyCard key="deps" dependencies={depPairs} />],
      loadingSteps: ["Mapping dependency chains…"],
      pills: [
        { label: "Am I betting on the right things for Q2?", key: "flow1-initial" },
      ],
    };
  }

  // Fallback
  return {
    text: "I can help you explore your roadmap evidence. Try asking me:\n\n• \"Am I betting on the right things for Q2?\"\n• \"Why do customers keep asking about [feature]?\"\n• \"What if I cut [feature A] for [feature B]?\"",
    pills: [
      { label: "Am I betting on the right things for Q2?", key: "flow1-initial" },
      { label: "Show the full backlog ranked by revenue", key: "backlog-ranked" },
    ],
  };
}

/* ─── Pill key → response routing ─── */
function routePillKey(key: string): MessageContent {
  switch (key) {
    case 'flow1-initial': return buildFlow1Initial();
    case 'no-evidence': return buildFlow1NoEvidence();
    case 'worried': return buildFlow1Worried();
    case 'backlog-ranked': return buildFlow1BacklogRanked();
    case 'strongest-ignored': return buildFlow1BacklogRanked();
    case 'alt-cut': return buildAltCut();
    case 'descope': return routeInput('descope');
    case 'bump-q2': return routeInput('bump');
    case 'deps-detail': return routeInput('dependencies');
    case 'flow2-top-backlog': {
      const top = sampleData.filter(s => !roadmapData.find(r => r.title === s.title)).sort((a, b) => b.estRevenue - a.estRevenue)[0];
      return top ? buildFlow2(top.id) : routeInput('backlog');
    }
    default: return routeInput(key);
  }
}

/* ─── Render text with bold → bold + citation chip ─── */
function renderTextWithLinks(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*.*?\*\*|\n)/g);
  return parts.map((part, i) => {
    if (part === '\n') return <br key={i} />;
    if (part.startsWith('**') && part.endsWith('**')) {
      const inner = part.slice(2, -2);
      // Derive a short citation label — use first 2-3 words
      const words = inner.split(/\s+/);
      const label = words.length > 3 ? words.slice(0, 2).join(' ') : inner;
      return (
        <span key={i}>
          <span style={{ fontWeight: 700 }}>{inner}</span>
          <CitationChip label={label} />
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

/* ═══════════════════════════════════════════════════════════════
   PANEL BODY — conversation-thread model
   ═══════════════════════════════════════════════════════════════ */

interface Message {
  id: number;
  role: 'user' | 'ai';
  text: string;
  cards?: React.ReactNode[];
  pills?: { label: string; key: string }[];
  loadingSteps?: string[];
}

function PanelBody({ activePage, focusItemId }: { activePage?: string; focusItemId?: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeLoadingSteps, setActiveLoadingSteps] = useState<string[]>([]);
  const [streamedSet] = useState(() => new Set<number>());
  const [selectedFollowUp, setSelectedFollowUp] = useState<string | null>(null);
  const [, forceUpdate] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const msgIdRef = useRef(0);

  // Auto-trigger Flow 2 when a bar is clicked (focusItemId)
  const triggeredRef = useRef<string | null>(null);
  useEffect(() => {
    if (focusItemId && focusItemId !== triggeredRef.current) {
      triggeredRef.current = focusItemId;
      const item = getItem(focusItemId);
      if (item) {
        const content = buildFlow2(focusItemId);
        addAiResponse(content, `Tell me about ${shortTitle(item.title, 40)}`);
      }
    }
  }, [focusItemId]);

  // Track if user has scrolled up manually
  const userScrolledUpRef = useRef(false);

  const isNearBottom = () => {
    const el = scrollRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  };

  const scrollToBottom = () => {
    if (userScrolledUpRef.current) return;
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  // Detect manual scroll up
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      userScrolledUpRef.current = !isNearBottom();
    };
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll only when new content arrives and user hasn't scrolled up
  // Reset userScrolledUp when a new message is added (user sent something)
  const prevMsgCount = useRef(messages.length);
  useEffect(() => {
    const newUserMsg = messages.length > prevMsgCount.current && messages[messages.length - 1]?.role === 'user';
    if (newUserMsg) {
      userScrolledUpRef.current = false; // user just sent a message, follow the conversation
    }
    prevMsgCount.current = messages.length;
    scrollToBottom();
  }, [messages.length, isTyping, isLoading]);

  // MutationObserver — auto-scroll only if user is near bottom
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const observer = new MutationObserver(() => {
      if (!userScrolledUpRef.current) {
        el.scrollTop = el.scrollHeight;
      }
    });
    observer.observe(el, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, []);

  const addAiResponse = (content: MessageContent, userText: string) => {
    // Add user bubble
    setSelectedFollowUp(null);
    const userId = ++msgIdRef.current;
    setMessages(prev => [...prev, { id: userId, role: 'user', text: userText }]);

    const steps = content.loadingSteps;
    scrollToBottom();
    if (steps && steps.length > 0) {
      setIsLoading(true);
      setActiveLoadingSteps(steps);
      const loadDuration = steps.length * 600 + 1500;
      setTimeout(() => {
        setIsLoading(false);
        setActiveLoadingSteps([]);
        setIsTyping(true);
        scrollToBottom();
        setTimeout(() => {
          setIsTyping(false);
          const aiId = ++msgIdRef.current;
          setMessages(prev => [...prev, {
            id: aiId,
            role: 'ai',
            text: content.text,
            cards: content.cards,
            pills: content.pills,
          }]);
          scrollToBottom();
        }, 1000);
      }, loadDuration);
    } else {
      setIsTyping(true);
      scrollToBottom();
      setTimeout(() => {
        setIsTyping(false);
        const aiId = ++msgIdRef.current;
        setMessages(prev => [...prev, {
          id: aiId,
          role: 'ai',
          text: content.text,
          cards: content.cards,
          pills: content.pills,
        }]);
        scrollToBottom();
      }, 1200);
    }
  };

  const handlePillClick = (pill: { label: string; key: string }) => {
    // Handle dynamic flow2/flow3 pill keys
    const flow2Match = pill.key.match(/^flow2-(.+)$/);
    if (flow2Match) {
      addAiResponse(buildFlow2(flow2Match[1]), pill.label);
      return;
    }
    const flow3Match = pill.key.match(/^flow3-(.+)-(.+)$/);
    if (flow3Match) {
      addAiResponse(buildFlow3(flow3Match[1], flow3Match[2]), pill.label);
      return;
    }
    const content = routePillKey(pill.key);
    addAiResponse(content, pill.label);
  };

  const handleChatSend = (text: string) => {
    const content = routeInput(text);
    addAiResponse(content, text);
  };

  // One contextual suggestion based on page state
  const noQuoteCount = getQ2Items().filter(r => !customerQuotes[r.id] || customerQuotes[r.id].length === 0).length;
  const initialPill = noQuoteCount > 0
    ? { label: `${noQuoteCount} Q2 items have zero customer evidence`, key: "no-evidence" }
    : { label: "Am I betting on the right things for Q2?", key: "flow1-initial" };

  return (
    <>
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <div style={{ flex: 1 }} />

        <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: "0 24px 24px" }}>

          {/* Insight card entry point (only before first message) */}
          {messages.length === 0 && (() => {
            const q2 = getQ2Items();
            const totalARR = q2.reduce((s, r) => s + r.estRevenue, 0);
            const noQuotes = q2.filter(r => !customerQuotes[r.id] || customerQuotes[r.id].length === 0);
            const topItem = q2.sort((a, b) => b.estRevenue - a.estRevenue)[0];
            const weakestQ2 = q2
              .filter(r => !customerQuotes[r.id] || customerQuotes[r.id].length === 0)
              .sort((a, b) => a.estRevenue - b.estRevenue)[0];
            const backlogTop = sampleData
              .filter(s => !roadmapData.find(r => r.title === s.title))
              .sort((a, b) => b.estRevenue - a.estRevenue)[0];

            return (
              <>
                <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
                  <div style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", width: 72, height: 44, borderRadius: 22, background: "#F1F2F5" }} />
                  <div style={{ position: "relative", zIndex: 1 }}><AgentAvatar size={48} /></div>
                  <div style={{ position: "relative", zIndex: 1, width: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <IconChevronDown size="small" color="icon-secondary" />
                  </div>
                </div>

                <span style={{ fontSize: 20, fontWeight: 600, color: "#656b81", lineHeight: 1.4, fontFamily: "var(--font-roobert)", fontFeatureSettings: "'ss01'" }}>
                  Hey Shreya,
                </span>

                <span style={{ fontSize: 14, fontWeight: 400, color: "#222428", lineHeight: 1.5 }}>
                  I scanned your Roadmap and Backlog. Here's what I found:
                </span>

                {/* Suggested prompts — one per flow, short and crisp */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <PromptPill
                    label="Am I betting on the right things for Q2?"
                    onClick={() => handlePillClick({ label: "Am I betting on the right things for Q2?", key: "flow1-initial" })}
                  />
                  <PromptPill
                    label="Deep dive into my top roadmap item"
                    onClick={() => {
                      if (topItem) {
                        const content = buildFlow2(topItem.id);
                        addAiResponse(content, `Tell me about ${topItem.title}`);
                      }
                    }}
                  />
                  <PromptPill
                    label="What happens if I swap a Q2 item?"
                    onClick={() => {
                      if (weakestQ2 && backlogTop) {
                        const content = buildFlow3(weakestQ2.id, backlogTop.id);
                        addAiResponse(content, `What if I cut ${weakestQ2.title} for ${backlogTop.title}?`);
                      }
                    }}
                  />
                </div>
              </>
            );
          })()}

          {/* Message thread */}
          {messages.map((msg, i) => {
            if (msg.role === 'user') {
              return <UserBubble key={msg.id} text={msg.text} />;
            }

            const isLatestAi = !messages.slice(i + 1).some(m => m.role === 'ai');
            const shouldStream = isLatestAi && !streamedSet.has(msg.id);

            const isLastAiMessage = i === messages.length - 1 || !messages.slice(i + 1).some(m => m.role === 'ai');

            return (
              <React.Fragment key={msg.id}>
                {/* AI text with link icons on bold findings */}
                <div>
                  <span style={{ fontSize: 14, fontWeight: 400, color: "#222428", lineHeight: 1.6, whiteSpace: "pre-line" }}>
                    {shouldStream ? (
                      <StreamingText
                        text={msg.text}
                        speed={80}
                        onProgress={scrollToBottom}
                        onComplete={() => { streamedSet.add(msg.id); forceUpdate(n => n + 1); scrollToBottom(); }}
                      />
                    ) : renderTextWithLinks(msg.text)}
                  </span>
                </div>

                {/* Evidence cards — show after streaming completes */}
                {(!shouldStream || streamedSet.has(msg.id)) && msg.cards?.map((card, ci) => (
                  <div key={ci} style={{ animation: "fadeSlideIn 400ms ease-out both" }}>
                    {card}
                  </div>
                ))}

                {/* Follow-up checkboxes — only on the latest AI message */}
                {isLastAiMessage && (!shouldStream || streamedSet.has(msg.id)) && msg.pills && msg.pills.length > 0 && (
                  <div style={{ animation: "fadeSlideIn 400ms ease-out 200ms both" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                      {msg.pills.map(pill => (
                        <CheckboxOption
                          key={pill.key}
                          label={pill.label}
                          checked={selectedFollowUp === pill.key}
                          onChange={(checked) => setSelectedFollowUp(checked ? pill.key : null)}
                        />
                      ))}
                    </div>
                    {selectedFollowUp && (
                      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                        <div
                          onClick={() => {
                            const pill = msg.pills!.find(p => p.key === selectedFollowUp);
                            if (pill) handlePillClick(pill);
                          }}
                          style={{
                            background: "#222428",
                            color: "#fff",
                            borderRadius: 8,
                            padding: "8px 16px",
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          Go
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </React.Fragment>
            );
          })}

          {/* Analysing indicator with steps */}
          {isLoading && <AnalysingIndicator steps={activeLoadingSteps} />}

          {/* Typing indicator */}
          {isTyping && <TypingIndicator />}
        </div>
      </div>
      <PanelInput onSend={handleChatSend} />
    </>
  );
}

/* ─── Input area ─── */
function PanelInput({ onSend }: { onSend: (text: string) => void }) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const hasText = text.trim().length > 0;

  return (
    <div style={{ flexShrink: 0, padding: "0 24px 16px", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          background: "#f1f2f5",
          borderRadius: "8px 8px 0 0",
          padding: "8px 12px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 0,
          position: "relative",
          zIndex: 1,
        }}
      >
        <IconSquareLineSquareDashed size="small" color="icon-secondary" />
        <span style={{ fontSize: 12, fontWeight: 400, color: "#222428", lineHeight: 1.5 }}>
          Select objects on the canvas to add context
        </span>
      </div>

      <div
        style={{
          border: `1px solid ${hasText ? "#4262FF" : "#e0e2e8"}`,
          borderRadius: 8,
          background: "#fff",
          position: "relative",
          zIndex: 2,
          transition: "border-color 0.15s",
        }}
      >
        <div style={{ padding: "12px 16px 4px" }}>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask about your roadmap..."
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              resize: "none",
              fontSize: 14,
              fontWeight: 400,
              color: "#222428",
              lineHeight: 1.4,
              fontFamily: "var(--font-noto)",
              background: "transparent",
              minHeight: 24,
              maxHeight: 120,
              overflow: "auto",
            }}
            rows={1}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 8px 8px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <IconButton aria-label="Add" variant="ghost" size="medium"><IconPlus /></IconButton>
          </div>

          <div
            onClick={handleSend}
            style={{
              background: hasText ? "#4262FF" : "#e9eaef",
              borderRadius: 20,
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: hasText ? "pointer" : "default",
              transition: "background 0.15s",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1.5 7L12.5 7M12.5 7L7.5 2M12.5 7L7.5 12" stroke={hasText ? "#fff" : "#AEB2C0"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main export ─── */
export default function AiPanelSolutionReview({ onClose, activePage, focusItemId }: { onClose?: () => void; activePage?: string; focusItemId?: string } = {}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", maxWidth: "100%", background: "#fff", borderRadius: 8 }}>
      <AiGradientDefs />
      <PanelHeader onClose={onClose} />
      <PanelBody activePage={activePage} focusItemId={focusItemId} />
    </div>
  );
}
