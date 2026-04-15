import React, { useState, useEffect, useRef, createContext, useContext } from "react";
import { createPortal } from "react-dom";
import {
  Button,
  Checkbox,
  DropdownMenu,
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
  IconTable,
  IconUsers,
  IconChatLinesTwo,
  IconArrowsDownUp,
  IconBoard,
  IconLink,
  IconSquaresTwoOverlap,
  IconEyeOpen,
  IconArrowLeft,
  IconArrowUp,
} from "@mirohq/design-system";
import { roadmapData as _staticRoadmap, sampleData as _staticBacklog, companyARR, customerQuotes, itemDependencies, demandTrend, itemHistory } from "@spaces/shared";

/* ─── Live state refs — updated each render by the component ─── */
/* All builders read from these instead of the static imports, so they
   reflect any changes the user has applied during this session. */
let _liveRoadmap: SpaceRow[] = _staticRoadmap;
let _liveBacklog: SpaceRow[] = _staticBacklog;
/** Call once per render to sync live state */
function syncLiveState(roadmap: SpaceRow[], backlog: SpaceRow[]) {
  _liveRoadmap = roadmap;
  _liveBacklog = backlog;
}
/** Accessors used by all builders */
const roadmapData: SpaceRow[] = new Proxy([] as SpaceRow[], {
  get(_target, prop) { return Reflect.get(_liveRoadmap, prop); },
  has(_target, prop) { return Reflect.has(_liveRoadmap, prop); },
  ownKeys() { return Reflect.ownKeys(_liveRoadmap); },
  getOwnPropertyDescriptor(_target, prop) { return Object.getOwnPropertyDescriptor(_liveRoadmap, prop); },
});
const sampleData: SpaceRow[] = new Proxy([] as SpaceRow[], {
  get(_target, prop) { return Reflect.get(_liveBacklog, prop); },
  has(_target, prop) { return Reflect.has(_liveBacklog, prop); },
  ownKeys() { return Reflect.ownKeys(_liveBacklog); },
  getOwnPropertyDescriptor(_target, prop) { return Object.getOwnPropertyDescriptor(_liveBacklog, prop); },
});
import { generateNarrative, classifyIntent } from "../../lib/openai";
import type { ClassifiedIntent } from "../../lib/openai";
import type { SpaceRow } from "@spaces/shared";
import { OVERVIEW_ROWS } from "../page/OverviewPage";

/* ─── Navigation context for sub-views ─── */
const NavigateContext = createContext<(view: string, context?: string) => void>(() => {});

/* ─── Global dropdown state (avoids re-render issues with inline components) ─── */
let globalDropdownId: string | null = null;
let globalDropdownListeners: (() => void)[] = [];
function setGlobalDropdown(id: string | null) {
  globalDropdownId = id;
  globalDropdownListeners.forEach(fn => fn());
}
function useGlobalDropdown(id: string) {
  const [, rerender] = useState(0);
  useEffect(() => {
    const fn = () => rerender(n => n + 1);
    globalDropdownListeners.push(fn);
    return () => { globalDropdownListeners = globalDropdownListeners.filter(f => f !== fn); };
  }, []);
  return globalDropdownId === id;
}

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
export function PanelHeader({ onClose }: { onClose?: () => void }) {
  const handleClose = () => {
    // Use onClose prop first, fall back to window global
    const closeFn = onClose || (window as any).__closeAiPanel;
    if (closeFn) closeFn();
  };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: 20,
        paddingRight: 8,
        height: 48,
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#222428", fontFamily: "var(--font-roobert)", fontFeatureSettings: "'ss01'" }}>
          Sidekick
        </span>
        <IconChevronDown size="small" color="icon-secondary" />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
        <IconButton aria-label="New chat" variant="ghost" size="medium"><IconSquarePencil /></IconButton>
        <IconButton aria-label="History" variant="ghost" size="medium"><IconClockCounterClockwise /></IconButton>
        <IconButton aria-label="More" variant="ghost" size="medium"><IconDotsThreeVertical /></IconButton>
        <IconButton aria-label="Close" variant="ghost" size="medium" onPress={handleClose}><IconCross /></IconButton>
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

/* ─── Checkbox option row (using Miro Checkbox) ─── */
function CheckboxOption({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  const id = `cb-${label.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 12px",
        borderRadius: 8,
        background: checked ? "#E8ECFC" : "transparent",
        cursor: "pointer",
        transition: "background 150ms ease",
      }}
      onClick={() => onChange(!checked)}
    >
      <Checkbox
        id={id}
        checked={checked}
        onChecked={() => onChange(true)}
        onUnchecked={() => onChange(false)}
        size="large"
      />
      <label htmlFor={id} style={{ fontSize: 14, fontWeight: 400, color: "#222428", lineHeight: 1.4, cursor: "pointer" }}>
        {label}
      </label>
    </div>
  );
}

/* ─── User message bubble ─── */
function UserBubble({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", paddingLeft: 48 }}>
      <div style={{ background: "#F4F4F1", borderRadius: 16, padding: "12px 16px" }}>
        <span style={{ fontSize: 14, fontWeight: 400, color: "#222428", lineHeight: 1.5 }}>{text}</span>
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

/* ─── Analysing indicator (collapsible step list with agent icon) ─── */
function AnalysingIndicator({ steps }: { steps?: string[] }) {
  const [revealed, setRevealed] = useState(0);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    if (!steps || revealed >= steps.length) return;
    const t = setTimeout(() => setRevealed(r => r + 1), 600);
    return () => clearTimeout(t);
  }, [revealed, steps?.length]);

  const currentStep = steps?.[Math.min(revealed, (steps?.length ?? 1) - 1)] || 'Analysing';

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Header row — agent icon + current step + chevron */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "4px 0" }}
      >
        <img src="/logo-spinner.png" alt="" width={20} height={20} style={{ flexShrink: 0 }} />
        <span style={{ fontSize: 14, fontWeight: 400, color: "#656B81", lineHeight: 1.5 }}>
          {currentStep}
        </span>
        <IconChevronDown size="small" color="icon-secondary" css={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 200ms' } as any} />
      </div>

      {/* Expanded steps with left border */}
      {expanded && steps && steps.length > 0 && (
        <div style={{ marginLeft: 10, borderLeft: "1.5px solid #E9EAEF", paddingLeft: 16, display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
          {steps.map((step, i) => (
            <div
              key={i}
              style={{
                fontSize: 13,
                color: "#656B81",
                lineHeight: 1.5,
                opacity: i <= revealed ? 1 : 0,
                transition: "opacity 300ms ease-out",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {i < revealed ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                  <circle cx="8" cy="8" r="7" stroke="#AEB2C0" strokeWidth="1" fill="none" />
                  <path d="M5 8l2.5 2.5L11 6" stroke="#AEB2C0" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <img src="/logo-spinner.png" alt="" width={16} height={16} style={{ flexShrink: 0 }} />
              )}
              <span>
                <span style={{ fontWeight: 600, color: "#656B81" }}>Sidekick</span>{" "}{step}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Completed steps (collapsed, expandable) ─── */
function CompletedSteps({ steps }: { steps: string[] }) {
  const [expanded, setExpanded] = useState(false);
  const lastStep = steps[steps.length - 1] || 'Done';

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 8 }}>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "4px 0" }}
      >
        <span style={{ fontSize: 13, fontWeight: 400, color: "#AEB2C0", lineHeight: 1.5 }}>
          {lastStep}
        </span>
        <IconChevronDown size="small" color="icon-secondary" css={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 200ms' } as any} />
      </div>
      {expanded && (
        <div style={{ marginLeft: 8, borderLeft: "1.5px solid #E9EAEF", paddingLeft: 16, display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
          {steps.map((step, i) => (
            <div key={i} style={{ fontSize: 13, color: "#AEB2C0", lineHeight: 1.5, display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                <circle cx="8" cy="8" r="7" stroke="#AEB2C0" strokeWidth="1" fill="none" />
                <path d="M5 8l2.5 2.5L11 6" stroke="#AEB2C0" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span><span style={{ fontWeight: 600 }}>Sidekick</span> {step}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── AI Citation chip with dropdown ─── */
function CitationChip({ label }: { label?: string }) {
  const chipId = useRef(`chip-${Math.random().toString(36).slice(2, 8)}`).current;
  const open = useGlobalDropdown(chipId);
  const ref = useRef<HTMLSpanElement>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const navigate = useContext(NavigateContext);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (ref.current?.contains(target)) return;
      if (dropdownRef.current?.contains(target)) return;
      setGlobalDropdown(null);
    };
    const t = setTimeout(() => document.addEventListener("mousedown", handler), 150);
    return () => { clearTimeout(t); document.removeEventListener("mousedown", handler); };
  }, [open]);

  const icon = (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <path d="M6.5 2.5H4.5C3.4 2.5 2.5 3.4 2.5 4.5V11.5C2.5 12.6 3.4 13.5 4.5 13.5H11.5C12.6 13.5 13.5 12.6 13.5 11.5V9.5M9.5 2.5H13.5M13.5 2.5V6.5M13.5 2.5L7.5 8.5" stroke="#4262FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <span ref={ref} style={{ position: "relative", display: "inline-flex", verticalAlign: "middle", marginLeft: 4 }}>
      <span
        onClick={(e) => { e.stopPropagation(); setGlobalDropdown(open ? null : chipId); }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          padding: "2px 6px",
          background: open ? "#DFE1E6" : "#E9EAEF",
          borderRadius: 4,
          cursor: "pointer",
          flexShrink: 0,
          lineHeight: 1,
        }}
      >
        {icon}
        {label && <span style={{ fontSize: 12, fontWeight: 500, color: "#4262FF", whiteSpace: "nowrap" }}>{label}</span>}
      </span>
      {open && (() => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return null;
        const items = [
          { icon: <IconBoard size="small" />, text: "Add to board", onClick: () => setGlobalDropdown(null) },
          { icon: <IconSquaresTwoOverlap size="small" />, text: "Copy", onClick: () => setGlobalDropdown(null) },
          { icon: <IconEyeOpen size="small" />, text: "View details", onClick: () => { setGlobalDropdown(null); navigate('view-details', label || ''); } },
          { icon: <IconInsights size="small" />, text: "Related evidence", onClick: () => { setGlobalDropdown(null); navigate('related-evidence', label || ''); } },
        ];
        return createPortal(
          <div
            ref={(el) => { dropdownRef.current = el; }}
            style={{
              position: "fixed",
              top: rect.bottom + 4,
              left: rect.left,
              background: "#FFFFFF",
              border: "0.5px solid #E9EAEF",
              borderRadius: 8,
              boxShadow: "0px 2px 4px rgba(34, 36, 40, 0.08)",
              padding: "4px 0",
              zIndex: 99999,
              minWidth: 180,
            }}
          >
            {items.map((item, i) => (
              <div
                key={i}
                onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); item.onClick(); }}
                onMouseEnter={e => (e.currentTarget.style.background = "#F7F8FA")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", cursor: "pointer", fontSize: 14, color: "#222428" }}
              >
                <span style={{ display: "flex", color: "#6f7489" }}>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>,
          document.body
        );
      })()}
    </span>
  );
}

/* ─── Evidence card (matches existing prototype card style) ─── */
function EvidenceCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ borderRadius: 12, overflow: "hidden", background: "#FFFFFF", border: "1px solid #E9EAEF" }}>
      <div style={{ padding: "14px 20px", borderBottom: "1px solid #E9EAEF" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#222428" }}>{title}</span>
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
        <span style={{ fontSize: 14, fontWeight: 700, color: "#222428", lineHeight: 1.4 }}>{value}</span>
        {subtext && <div style={{ fontSize: 12, color: highlight ? "#E53E3E" : "#6f7489", fontWeight: highlight ? 600 : 400 }}>{subtext}</div>}
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
          <div style={{ fontSize: 28, fontWeight: 800, color: "#222428", lineHeight: 1 }}>${revenue}K</div>
          <div style={{ fontSize: 12, color: "#6f7489", marginTop: 4 }}>Addressable ARR</div>
        </div>
        <div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#222428", lineHeight: 1 }}>{Math.round(revenue / Math.max(customers, 1))}K</div>
          <div style={{ fontSize: 12, color: "#6f7489", marginTop: 4 }}>ARR per Customer</div>
        </div>
      </div>
    </div>
  );
}

/* ─── Feedback quote (inline text, no card) ─── */
function FeedbackCard({ quote, role }: { quote: string; role: string; type?: 'positive' | 'neutral' }) {
  return (
    <div style={{ padding: "4px 0" }}>
      <span style={{ fontSize: 14, fontStyle: "italic", color: "#222428", lineHeight: 1.6 }}>"{quote}"</span>
      <div style={{ fontSize: 13, color: "#6f7489", marginTop: 4 }}>— {role}</div>
    </div>
  );
}

/* ─── Customer quote (inline text, no card) ─── */
function QuoteBlock({ company, quote, role }: { company: string; quote: string; role: string }) {
  return (
    <div style={{ padding: "4px 0" }}>
      <span style={{ fontSize: 14, fontStyle: "italic", color: "#222428", lineHeight: 1.6 }}>"{quote}"</span>
      <div style={{ fontSize: 13, color: "#6f7489", marginTop: 4 }}>— {company}, {role}</div>
    </div>
  );
}

/* ─── Dependency chain (inline bold text, no card) ─── */
function DependencyCard({ dependencies }: { dependencies: { from: SpaceRow; to: SpaceRow; type: string }[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "4px 0" }}>
      {dependencies.map((dep, i) => (
        <div key={i} style={{ fontSize: 14, color: "#222428", lineHeight: 1.6 }}>
          <span style={{ fontWeight: 700 }}>{dep.from.title}</span>
          <span style={{ color: "#6f7489" }}> blocks </span>
          <span style={{ fontWeight: 700 }}>{dep.to.title}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Impact card (grey card ONLY for number-heavy content) ─── */
function ImpactCard({ title, items }: { title: string; type?: 'lose' | 'gain'; items: { label: string; value: string }[] }) {
  return (
    <div style={{ border: "1px solid #E9EAEF", borderRadius: 12, overflow: "hidden", background: "#F7F8FA" }}>
      <div style={{ padding: "12px 20px", borderBottom: "1px solid #E9EAEF" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#222428" }}>{title}</span>
      </div>
      <div style={{ padding: "4px 0" }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#222428", lineHeight: 1.5, padding: "8px 20px", borderBottom: i < items.length - 1 ? "1px solid #E9EAEF" : "none" }}>
            <span>{item.label}</span>
            <span style={{ fontWeight: 700 }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Change card (before → after for every suggestion) ─── */
function ChangeCard({ changes }: { changes: { item: string; from: string; to: string; reason?: string }[] }) {
  return (
    <div style={{ border: "1px solid #E9EAEF", borderRadius: 12, background: "#FFFFFF", overflow: "hidden" }}>
      <div style={{ padding: "12px 20px", borderBottom: "1px solid #E9EAEF" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#222428" }}>Proposed changes</span>
      </div>
      {changes.map((c, i) => (
        <div key={i} style={{ padding: "12px 20px", borderBottom: i < changes.length - 1 ? "1px solid #E9EAEF" : "none" }}>
          <div style={{ fontSize: 13, color: "#222428", fontWeight: 600, marginBottom: 4 }}>{c.item}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
            <span style={{ color: "#6f7489", textDecoration: "line-through" }}>{c.from}</span>
            <span style={{ color: "#6f7489" }}>→</span>
            <span style={{ color: "#38A169", fontWeight: 600 }}>{c.to}</span>
          </div>
          {c.reason && <div style={{ fontSize: 12, color: "#6f7489", marginTop: 4 }}>{c.reason}</div>}
        </div>
      ))}
    </div>
  );
}

/* ─── Helper: get item by ID from all tables ─── */
function getItem(id: string): SpaceRow | undefined {
  return roadmapData.find(r => r.id === id) || sampleData.find(r => r.id === id) || Object.values(OVERVIEW_ROWS).find(r => r.id === id);
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

/* ─── Intent roots (drives pill guardrails) ─── */
type IntentRoot = 'architect' | 'debug' | 'refine' | 'expand';

type MessageContent = {
  text: string;
  textPromise?: Promise<string>;
  cards?: React.ReactNode[];
  pills?: { label: string; key: string }[];
  loadingSteps?: string[];
  intentRoot?: IntentRoot;
};

/**
 * Pill guardrails — enforces 3 rules from the response framework:
 * 1. Consistency: pills build on the answer, never negate it
 * 2. Progression: step 2, edge case, or optimization — not "start over"
 * 3. No contradictions: never suggest the opposite of what we just said
 *
 * Takes the intent root + the builder's raw pill candidates, returns max 3 validated pills.
 */
function buildGuardedPills(
  root: IntentRoot,
  candidates: { label: string; key: string }[],
  context: { allDeclining?: boolean; recommendedAction?: 'promote' | 'demote' | 'add' | 'cut' | 'swap' | null }
): { label: string; key: string }[] {
  const filtered = candidates.filter(pill => {
    // Rule 3: No contradictions — if we recommended demoting, don't offer a promote pill
    if (context.allDeclining && pill.key.includes('promote')) return false;
    if (context.recommendedAction === 'demote' && pill.key.includes('promote')) return false;
    if (context.recommendedAction === 'promote' && pill.key.includes('demote')) return false;
    // Rule 1: Don't loop back to the same view we're on
    // (handled by each builder — they shouldn't include their own key)
    return true;
  });

  // Rule 2: Progression — ensure at least one pill moves forward
  // "flow1-initial" is a "start over" key — only allow it as the last pill
  const forward = filtered.filter(p => p.key !== 'flow1-initial');
  const reset = filtered.find(p => p.key === 'flow1-initial');

  const result = forward.slice(0, 2);
  if (reset && result.length < 3) result.push(reset);

  return result.slice(0, 3);
}

function buildFlow1Initial(): MessageContent {
  // 1. Read ALL items from both tables
  const allItems = [...roadmapData.filter(r => r.status !== 'done'), ...sampleData.filter(s => !roadmapData.find(r => r.title === s.title))];

  // 2. Rank by composite evidence score (ARR + customers + mentions + trend + recency)
  const scored = allItems.map(item => {
    const trend = getTrend(item.id);
    const score = evidenceScore(item);
    const onRoadmap = roadmapData.find(r => r.id === item.id);
    return { item, score, trend, onRoadmap, priorityNum: priorityNum(item.priority) };
  }).sort((a, b) => b.score - a.score);

  const top5 = scored.slice(0, 5);
  const q2 = getQ2Items();
  const totalARR = q2.reduce((s, r) => s + r.estRevenue, 0);
  const totalMentions = q2.reduce((s, r) => s + r.mentions, 0);
  const totalCustomers = q2.reduce((s, r) => s + r.customers, 0);
  const formattedARR = totalARR >= 1000 ? `$${(totalARR / 1000).toFixed(1)}M` : `$${totalARR}K`;

  // 3. Surface disagreements — unique insight per finding, no repetitive comparisons
  const disagreements: string[] = [];

  for (const { item, score, onRoadmap } of scored.slice(0, 10)) {
    if (disagreements.length >= 2) break;
    const pNum = priorityNum(item.priority);
    const evidenceRank = scored.findIndex(s => s.item.id === item.id) + 1;
    const trend = getTrend(item.id);
    if (evidenceRank <= 5 && (pNum <= 2 || !onRoadmap)) {
      if (!onRoadmap) {
        disagreements.push(`${item.title} ranks #${evidenceRank} but isn't on your roadmap — a blind spot.`);
      } else {
        disagreements.push(`${item.title} ranks #${evidenceRank} but is only ${item.priority} priority.`);
      }
    }
    if (evidenceRank > 7 && pNum >= 3) {
      const trendNote = trend?.direction === 'declining' ? 'Demand is declining.' : trend?.direction === 'stable' ? 'Demand has been flat.' : '';
      disagreements.push(`${item.title} is ${item.priority} but ranks #${evidenceRank}. ${trendNote}`);
    }
  }

  // 4. Group by theme — find items sharing 2+ companies
  const companyMap: Record<string, typeof scored> = {};
  for (const s of scored.slice(0, 15)) {
    for (const company of s.item.companies) {
      if (!companyMap[company]) companyMap[company] = [];
      companyMap[company].push(s);
    }
  }
  // Find themes: groups of 3+ items sharing keywords in titles
  const titleWords = scored.slice(0, 15).map(s => ({
    s,
    words: s.item.title.toLowerCase().split(/\s+/).filter(w => w.length >= 4),
  }));
  const themes: { name: string; items: typeof scored; combinedARR: number; uniqueAccounts: number }[] = [];
  const themeKeywords: Record<string, typeof scored> = {};
  const themeNames: Record<string, string> = {
    'transaction': 'Transaction & categorisation',
    'investment': 'Investment & portfolio',
    'savings': 'Savings & budgeting',
    'currency': 'Multi-currency & FX',
    'security': 'Security & access control',
    'fraud': 'Security & access control',
  };
  for (const tw of titleWords) {
    for (const w of tw.words) {
      const themeName = themeNames[w];
      if (themeName) {
        if (!themeKeywords[themeName]) themeKeywords[themeName] = [];
        if (!themeKeywords[themeName].find(s => s.item.id === tw.s.item.id)) {
          themeKeywords[themeName].push(tw.s);
        }
      }
    }
  }
  for (const [name, items] of Object.entries(themeKeywords)) {
    if (items.length >= 2) {
      const uniqueCompanies = new Set(items.flatMap(i => i.item.companies));
      themes.push({
        name,
        items,
        combinedARR: items.reduce((s, i) => s + i.item.estRevenue, 0),
        uniqueAccounts: uniqueCompanies.size,
      });
    }
  }
  themes.sort((a, b) => b.combinedARR - a.combinedARR);

  // 5. Zero/weak evidence items
  const noQuotes = q2.filter(r => !customerQuotes[r.id] || customerQuotes[r.id].length === 0);
  const weakEvidence = scored.filter(s => s.priorityNum >= 3 && s.score < scored[Math.floor(scored.length / 2)]?.score);

  // Build structured text — count from the 3 we show, not all 5
  const shown = top5.slice(0, 3);
  const onRoadmapCount = shown.filter(s => s.onRoadmap).length;
  const notOnRoadmapCount = shown.length - onRoadmapCount;

  // Concise: answer + top 3 + one key finding. Depth behind pills.
  let text = `## Your Q2 priorities by evidence\n\n`;

  if (notOnRoadmapCount > 0) {
    const notOnRoadmapItems = top5.filter(s => !s.onRoadmap).map(s => `**${s.item.title}**`);
    text += `${onRoadmapCount} of your top 3 are on the roadmap. ${notOnRoadmapItems.join(', ')} ${notOnRoadmapCount === 1 ? 'isn\'t' : 'aren\'t'} — that's a gap worth closing.`;
  } else {
    text += `Your top 3 are all on your roadmap. Priorities align with demand.`;
  }

  // Top 3 only — keep it scannable
  text += `\n\n─── Top 3 by evidence ─────────────\n${top5.slice(0, 3).map(({ item, trend, onRoadmap }, i) => {
    const dir = trend?.direction || 'stable';
    const trendText = dir === 'growing' ? '{{green:↑ growing}}' : dir === 'declining' ? '{{red:↓ declining}}' : '→ stable';
    const statusTag = !onRoadmap ? ' · {{red:not on roadmap}}' : '';
    return `${i + 1}. ${item.title}\n   $${item.estRevenue}K · ${item.customers} accounts · ${trendText}${statusTag}`;
  }).join('\n\n')}`;

  // One key finding — the most important thing to act on
  if (disagreements.length > 0) {
    text += `\n\n${disagreements[0]}`;
  } else if (noQuotes.length > 0) {
    text += `\n\n${noQuotes.length} items need validation — no direct customer feedback yet.`;
  } else {
    text += `\n\nGood alignment. Check back after your next round of customer calls.`;
  }

  // Build pills — include promote if there's a disagreement
  const promotable = disagreements.length > 0 ? scored.find(s => s.priorityNum <= 2 && scored.indexOf(s) < 5) : null;
  const pills: { label: string; key: string }[] = [
    ...(noQuotes.length > 0 ? [{ label: `${noQuotes.length} items need validation`, key: "no-evidence" }] : []),
    ...(disagreements.length > 1 ? [{ label: "What else stands out?", key: "uc2-mismatch" }] : []),
    ...(themes.length > 0 ? [{ label: `Explore ${themes[0].name} theme`, key: `uc1-theme-${themes[0].name}` }] : []),
    ...(promotable ? [{ label: "What should I reprioritize?", key: `reprioritize-promote-${promotable.item.id}` }] : []),
  ];

  const dataForAI = { top5: top5.map(s => ({ title: s.item.title, revenue: s.item.estRevenue, customers: s.item.customers, trend: s.trend?.direction, priority: s.item.priority })), disagreements: disagreements.slice(0, 2), themes: themes.slice(0, 1).map(t => ({ name: t.name, count: t.items.length, arr: t.combinedARR })), noQuoteCount: noQuotes.length };

  return {
    text,
    textPromise: generateNarrative({ useCase: "uc1", structuredData: dataForAI, fallbackText: text }).then(r =>
      r.fromAI ? text + '\n\n' + r.text : text
    ),
    loadingSteps: [
      "Reading Roadmap and Backlog tables…",
      "Scoring by evidence strength…",
      "Detecting themes and disagreements…",
    ],
    pills,
  };
}

function buildUC1Theme(requestedTheme?: string): MessageContent {
  const allItems = [...roadmapData.filter(r => r.status !== 'done'), ...sampleData.filter(s => !roadmapData.find(r => r.title === s.title))];
  const themeNames: Record<string, string> = {
    'transaction': 'Transaction & categorisation',
    'investment': 'Investment & portfolio',
    'savings': 'Savings & budgeting',
    'currency': 'Multi-currency & FX',
    'budget': 'Savings & budgeting',
    'portfolio': 'Investment & portfolio',
    'fraud': 'Security & risk',
    'security': 'Security & risk',
  };
  const themeGroups: Record<string, SpaceRow[]> = {};
  for (const item of allItems) {
    const words = item.title.toLowerCase().split(/\s+/);
    for (const w of words) {
      const theme = themeNames[w];
      if (theme) {
        if (!themeGroups[theme]) themeGroups[theme] = [];
        if (!themeGroups[theme].find(i => i.id === item.id)) themeGroups[theme].push(item);
      }
    }
  }

  let themes = Object.entries(themeGroups)
    .filter(([, items]) => items.length >= 2)
    .map(([name, items]) => ({
      name,
      items,
      combinedARR: items.reduce((s, i) => s + i.estRevenue, 0),
      totalCustomers: items.reduce((s, i) => s + i.customers, 0),
      totalMentions: items.reduce((s, i) => s + i.mentions, 0),
    }))
    .sort((a, b) => b.combinedARR - a.combinedARR);

  // Filter to requested theme if specified
  if (requestedTheme) {
    const filtered = themes.filter(t => t.name.toLowerCase() === requestedTheme.toLowerCase());
    if (filtered.length > 0) themes = filtered;
  }

  if (themes.length === 0) {
    return { text: `## ${requestedTheme || 'Themes'}\n\nNo items found for this theme.`, pills: [{ label: "Show the evidence ranking", key: "flow1-initial" }] };
  }

  const t = themes[0];
  const onRoadmapItems = t.items.filter(item => roadmapData.find(r => r.id === item.id));
  const notOnRoadmap = t.items.filter(item => !roadmapData.find(r => r.id === item.id));
  const growingItems = t.items.filter(item => getTrend(item.id)?.direction === 'growing');
  const decliningItems = t.items.filter(item => getTrend(item.id)?.direction === 'declining');

  // Strategic insight about this theme
  let verdict = '';
  let recommendation = '';
  if (decliningItems.length === t.items.length) {
    verdict = `This theme is dying. All ${t.items.length} items show declining demand — customers are moving on.`;
    recommendation = `Pull back investment here and reallocate to growing themes.`;
  } else if (decliningItems.length > 0 && growingItems.length > 0) {
    verdict = `Mixed signals. Some items in this theme are growing while others are fading — the demand is shifting, not disappearing.`;
    recommendation = `Double down on the growing items and consider descoping the declining ones.`;
  } else if (notOnRoadmap.length > 0) {
    verdict = `You're leaving demand on the table. ${notOnRoadmap.length} of ${t.items.length} items aren't on your roadmap but customers are asking for them.`;
    recommendation = `The combined signal ($${t.combinedARR}K from ${t.totalCustomers} customers) is strong enough to justify a dedicated initiative.`;
  } else if (growingItems.length === t.items.length) {
    verdict = `This theme is accelerating. Every item is growing — customers are converging on this need.`;
    recommendation = `This is your strongest cluster. Treat it as a single initiative rather than separate items.`;
  } else {
    verdict = `Stable demand across ${t.items.length} items. Customers consistently want this but it's not getting louder.`;
    recommendation = `Keep current investment level. No urgency to change.`;
  }

  const text = `## ${t.name}\n\n${verdict}\n\n${recommendation}`;

  // Theme card: items by trend + roadmap status
  const themeCards: React.ReactNode[] = [
    <div key="theme-items" style={{ border: "1px solid #E9EAEF", borderRadius: 12, background: "#FFFFFF", overflow: "hidden" }}>
      <div style={{ padding: "12px 20px", borderBottom: "1px solid #E9EAEF", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#222428" }}>{t.name}</span>
        <span style={{ fontSize: 12, color: "#6f7489" }}>${t.combinedARR}K combined ARR</span>
      </div>
      {t.items.map((item, i) => {
        const onRM = roadmapData.find(r => r.id === item.id);
        const trend = getTrend(item.id);
        const dir = trend?.direction || 'stable';
        const trendColor = dir === 'growing' ? '#38A169' : dir === 'declining' ? '#E53E3E' : '#6f7489';
        return (
          <div key={item.id} style={{ padding: "10px 20px", borderBottom: i < t.items.length - 1 ? "1px solid #f1f2f5" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, color: "#222428", lineHeight: 1.4 }}>{item.title}</div>
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                {!onRM && <span style={{ fontSize: 11, fontWeight: 600, color: "#E53E3E", background: "#FFF5F5", borderRadius: 4, padding: "1px 6px" }}>Not on roadmap</span>}
                {onRM && <span style={{ fontSize: 11, color: "#6f7489", background: "#F1F2F5", borderRadius: 4, padding: "1px 6px" }}>{onRM.priority}</span>}
                <span style={{ fontSize: 11, fontWeight: 600, color: trendColor }}>{trendLabel(dir)}</span>
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#222428" }}>${item.estRevenue}K</span>
              <div style={{ fontSize: 12, color: "#6f7489" }}>{item.customers} accounts</div>
            </div>
          </div>
        );
      })}
    </div>,
  ];

  // Context-aware pills: promote only if theme is healthy, demote if dying
  const allDeclining = decliningItems.length === t.items.length;
  const promotable = !allDeclining ? t.items.find(item => {
    const trend = getTrend(item.id);
    return (trend?.direction === 'growing' || trend?.direction === 'stable') && (!roadmapData.find(r => r.id === item.id) || item.priority !== 'now');
  }) : null;
  const demotable = allDeclining ? t.items.find(item => {
    const onRM = roadmapData.find(r => r.id === item.id);
    return onRM && (onRM.priority === 'now' || onRM.priority === 'next');
  }) : null;

  const rawPills = [
    ...(promotable ? [{ label: `Promote ${promotable.title.split(' ').slice(0, 3).join(' ')}`, key: `reprioritize-promote-${promotable.id}` }] : []),
    ...(demotable ? [{ label: `Move ${shortTitle(demotable.title, 20)} down`, key: `reprioritize-demote-${demotable.id}` }] : []),
    ...(themes.length > 1 ? [{ label: `Deep dive into ${themes[1].name}`, key: `uc1-theme-${themes[1].name}` }] : []),
    { label: "Show the evidence ranking", key: "flow1-initial" },
  ];

  return {
    text,
    cards: themeCards,
    loadingSteps: ["Scanning for patterns…", "Grouping by theme…"],
    pills: buildGuardedPills('architect', rawPills, { allDeclining, recommendedAction: allDeclining ? 'demote' : promotable ? 'promote' : null }),
    intentRoot: 'architect',
  };
}

function buildFlow1NoEvidence(): MessageContent {
  const q2 = getQ2Items();
  const noQuotes = q2.filter(r => !customerQuotes[r.id] || customerQuotes[r.id].length === 0);

  const lines = noQuotes.map((item, i) =>
    `${i + 1}. **${shortTitle(item.title)}** — ${item.mentions} mentions, ${item.customers} customers, $${item.estRevenue}K. High signal but all quantitative; no verbatim customer quotes attached.`
  ).join('\n\n');

  if (noQuotes.length === 0) {
    return {
      text: `All your Q2 items have customer quotes linked. Your evidence coverage is solid.`,
      pills: [
        { label: "Show the evidence ranking", key: "flow1-initial" },
        { label: "Has anything drifted?", key: "uc5-drift" },
      ],
    };
  }

  // Assess risk: how much ARR is riding on unvalidated bets?
  const totalBlindARR = noQuotes.reduce((s, r) => s + r.estRevenue, 0);
  const highestBlind = noQuotes.sort((a, b) => b.estRevenue - a.estRevenue)[0];

  const bulletLines = noQuotes.map(item => {
    const trend = getTrend(item.id);
    const riskColor = trend?.direction === 'declining' ? '{{red:declining — highest risk}}' : trend?.direction === 'growing' ? '{{green:growing — validate soon}}' : '→ stable';
    return `• ${item.title}\n   $${item.estRevenue}K · ${item.customers} accounts · ${riskColor}`;
  }).join('\n\n');

  return {
    text: `## Needs validation\n\n$${totalBlindARR}K of your Q2 ARR has no direct customer feedback behind it.\n\n─── What to do ────────────────────\nSchedule customer interviews for these ${noQuotes.length} items — starting with **${highestBlind.title}**, your biggest unvalidated bet.\n\n─── Items ─────────────────────────\n${bulletLines}`,
    loadingSteps: [
      "Scanning customer evidence…",
      "Checking Insights research data…",
    ],
    pills: [
      { label: "Show me backlog items we're ignoring", key: "strongest-ignored" },
      { label: "Deep dive into Savings & budgeting", key: "uc1-theme-Savings & budgeting" },
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

  // Dynamic analysis
  const q2 = getQ2Items();
  const noQuotes = q2.filter(r => !customerQuotes[r.id] || customerQuotes[r.id].length === 0);
  const decliningQ2 = q2.filter(r => getTrend(r.id)?.direction === 'declining');
  const backlogBlindSpots = sampleData
    .filter(s => !roadmapData.find(r => r.title === s.title))
    .filter(s => evidenceScore(s) > evidenceScore(q2[q2.length - 1] || s))
    .slice(0, 2);

  // Rank risks by urgency — PM sees the top 2 first
  const risks: { label: string; detail: string; urgency: number }[] = [];
  if (decliningQ2.length > 0) {
    const topDeclining = decliningQ2.sort((a, b) => b.estRevenue - a.estRevenue)[0];
    risks.push({ label: 'Fading demand', detail: `${decliningQ2.length} Q2 items have {{red:declining}} demand.\n   Biggest: ${topDeclining.title} ($${topDeclining.estRevenue}K) — move it down or validate.`, urgency: decliningQ2.reduce((s, i) => s + i.estRevenue, 0) });
  }
  if (noQuotes.length > 0) {
    const blindARR = noQuotes.reduce((s, r) => s + r.estRevenue, 0);
    risks.push({ label: 'Needs validation', detail: `${noQuotes.length} Q2 items ($${blindARR}K) have no direct customer feedback.\n   Schedule interviews to validate these bets.`, urgency: blindARR });
  }
  if (depPairs.length > 0) {
    risks.push({ label: 'Dependency chains', detail: `${depPairs.length} blocking chains.\n   If ${depPairs[0].from.title.split(' ').slice(0, 4).join(' ')} slips, ${depPairs[0].to.title.split(' ').slice(0, 4).join(' ')} is stuck too.`, urgency: depPairs.length * 100 });
  }
  if (backlogBlindSpots.length > 0) {
    risks.push({ label: 'Missed opportunities', detail: `${backlogBlindSpots.map(item => item.title).join(' and ')} have stronger evidence than some Q2 items.\n   Not on your roadmap yet.`, urgency: backlogBlindSpots.reduce((s, i) => s + i.estRevenue, 0) });
  }
  risks.sort((a, b) => b.urgency - a.urgency);

  const riskCount = risks.length;
  let text = `## What needs your attention\n\n`;

  if (riskCount === 0) {
    text += `Your Q2 is in good shape. No major risks found.`;
  } else {
    // Lead with "fix these first"
    text += `Fix these ${Math.min(riskCount, 2)} first:\n\n`;
    text += risks.slice(0, 2).map((r, i) => `${i + 1}. **${r.label}** — ${r.detail}`).join('\n\n');
    if (risks.length > 2) {
      text += `\n\n─── Also worth knowing ────────────\n`;
      text += risks.slice(2).map(r => `• **${r.label}** — ${r.detail}`).join('\n');
    }
  }

  return {
    text,
    cards,
    loadingSteps: [
      "Mapping dependency chains…",
      "Checking evidence coverage…",
      "Scanning for blind spots…",
    ],
    pills: [
      ...(noQuotes.length > 0 ? [{ label: "Show me the blind bets", key: "no-evidence" }] : []),
      ...(backlogBlindSpots.length > 0 ? [{ label: "Where is my roadmap out of sync?", key: "uc2-mismatch" }] : []),
      { label: "Show the evidence ranking", key: "flow1-initial" },
    ],
  };
}

function buildFlow1BacklogRanked(): MessageContent {
  const backlogOnly = sampleData
    .filter(s => !roadmapData.find(r => r.title === s.title))
    .map(item => ({ item, score: evidenceScore(item), trend: getTrend(item.id) }))
    .sort((a, b) => b.score - a.score);

  const totalMentions = backlogOnly.reduce((s, r) => s + r.item.mentions, 0);
  const totalCustomers = backlogOnly.reduce((s, r) => s + r.item.customers, 0);
  const totalARR = backlogOnly.reduce((s, r) => s + r.item.estRevenue, 0);
  const formattedARR = totalARR >= 1000 ? `$${(totalARR / 1000).toFixed(1)}M` : `$${totalARR}K`;

  const cards: React.ReactNode[] = [
    <div key="backlog" style={{ borderRadius: 12, background: "#FFFFFF", border: "1px solid #E9EAEF", overflow: "hidden" }}>
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
            <div style={{ fontSize: 28, fontWeight: 800, color: "#222428", lineHeight: 1 }}>{formattedARR}</div>
            <div style={{ fontSize: 12, color: "#6f7489", marginTop: 4 }}>Combined ARR</div>
          </div>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#222428", lineHeight: 1 }}>{backlogOnly.length}</div>
            <div style={{ fontSize: 12, color: "#6f7489", marginTop: 4 }}>Backlog Items</div>
          </div>
        </div>
      </div>
      <div style={{ borderTop: "1px solid #F1F2F5" }}>
        <div style={{ padding: "12px 20px", borderBottom: "1px solid #E9EAEF" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#222428" }}>Backlog by evidence strength</span>
        </div>
        {backlogOnly.slice(0, 6).map(({ item, trend }, i) => {
          const recency = recencyLabel(item.id);
          return (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "10px 20px", borderBottom: i < 5 ? "1px solid #f1f2f5" : "none" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 400, color: "#222428", lineHeight: 1.4 }}>{item.title}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#222428" }}>${item.estRevenue}K</span>
                <div style={{ fontSize: 12, color: "#6f7489" }}>{item.customers} accounts · {trendLabel(trend?.direction || 'stable')}</div>
                {recency && <div style={{ fontSize: 11, color: "#AEB2C0" }}>Last mentioned {recency}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>,
  ];

  const topItem = backlogOnly[0];

  return {
    text: `Your backlog ranked by evidence strength. These aren't on your roadmap yet:`,
    cards,
    loadingSteps: [
      "Reading Backlog table…",
      "Scoring by evidence strength…",
    ],
    pills: [
      ...(topItem ? [{ label: "Deep dive into the top one", key: `flow2-${topItem.item.id}` }] : []),
      ...(topItem && topItem.item.priority !== 'now' ? [{ label: "Promote the top backlog item", key: `reprioritize-promote-${topItem.item.id}` }] : []),
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
    <div key="impact-block" style={{ borderRadius: 12, background: "#FFFFFF", border: "1px solid #E9EAEF", overflow: "hidden" }}>
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
            <div style={{ fontSize: 28, fontWeight: 800, color: "#222428", lineHeight: 1 }}>${item.estRevenue}K</div>
            <div style={{ fontSize: 12, color: "#6f7489", marginTop: 4 }}>Addressable ARR</div>
          </div>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#222428", lineHeight: 1 }}>{arr.length}</div>
            <div style={{ fontSize: 12, color: "#6f7489", marginTop: 4 }}>Requesting Companies</div>
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

  const trendF2 = getTrend(item.id);
  const onRM = roadmapData.find(r => r.id === item.id);
  const allScored = [...roadmapData.filter(r => r.status !== 'done'), ...sampleData].map(i => ({ item: i, score: evidenceScore(i) })).sort((a, b) => b.score - a.score);
  const rank = allScored.findIndex(s => s.item.id === item.id) + 1;

  let verdict = '';
  if (!onRM && rank <= 5) {
    verdict = `This ranks #${rank} by evidence but isn't on your roadmap. That's a significant gap — consider adding it.`;
  } else if (onRM && trendF2?.direction === 'declining') {
    verdict = `Demand is declining. At ${onRM.priority} priority, this may be getting more investment than the evidence supports.`;
  } else if (onRM && trendF2?.direction === 'growing') {
    verdict = `Demand is growing and it's already ${onRM.priority} priority. Good alignment — this is a well-placed bet.`;
  } else if (rank <= 3) {
    verdict = `This is one of your strongest items by evidence (#${rank}). ${onRM ? 'Well prioritized.' : 'Not on your roadmap yet.'}`;
  } else {
    verdict = `Ranks #${rank} by evidence. ${onRM ? `Currently ${onRM.priority} priority.` : 'Not on your roadmap.'}`;
  }

  const fallback = `## ${item.title}\n\n${verdict}${depText}`;
  const dataForAI = { title: item.title, jiraKey, revenue: item.estRevenue, customers: item.customers, mentions: item.mentions, trend: getTrend(item.id)?.direction, topRequesters: arr.slice(0, 3).map(a => ({ company: a.company, arr: a.arr })), quotes: quotes.map(q => q.quote.slice(0, 80)), deps: depLines };

  return {
    text: fallback,
    textPromise: generateNarrative({ useCase: "uc1", structuredData: dataForAI, fallbackText: fallback }).then(r => r.fromAI ? fallback + '\n\n' + r.text : fallback),
    cards,
    loadingSteps: [
      `Reading ${jiraKey || item.id} from Roadmap table…`,
      "Pulling Insights evidence…",
      "Checking cross-table dependencies…",
    ],
    pills: [
      ...(!onRM ? [{ label: `Add to roadmap`, key: `reprioritize-promote-${item.id}` }] : []),
      ...(onRM && trendF2?.direction === 'growing' && onRM.priority !== 'now' ? [{ label: `Move up in priority`, key: `reprioritize-promote-${item.id}` }] : []),
      ...(deps.blocks.length > 0 || deps.dependsOn.length > 0 ? [{ label: "Show dependency chain", key: `flow2-${deps.blocks[0]?.id || deps.dependsOn[0]?.id || item.id}` }] : []),
      { label: "Where is my roadmap out of sync?", key: "uc2-mismatch" },
    ],
  };
}

function buildFlow3(cutId: string, addId: string): MessageContent {
  const cutItem = getItem(cutId);
  const addItem = getItem(addId);
  if (!cutItem || !addItem) return { text: "I couldn't find one of those items. Could you try again?" };

  const cutDeps = getDeps(cutId);
  const addDeps = getDeps(addId);
  const cutTrend = getTrend(cutId);
  const addTrend = getTrend(addId);

  // Change card showing both items
  const cards: React.ReactNode[] = [
    <ChangeCard key="swap-changes" changes={[
      { item: cutItem.title, from: cutItem.priority, to: 'later', reason: `$${cutItem.estRevenue}K, ${cutItem.customers} customers, ${trendLabel(cutTrend?.direction || 'stable')}` },
      { item: addItem.title, from: addItem.priority, to: 'now (Q2)', reason: `$${addItem.estRevenue}K, ${addItem.customers} customers, ${trendLabel(addTrend?.direction || 'stable')}` },
    ]} />,
  ];

  const netDiff = addItem.estRevenue - cutItem.estRevenue;
  const custDiff = addItem.customers - cutItem.customers;

  const cutDir = cutTrend?.direction || 'stable';
  const addDir = addTrend?.direction || 'stable';

  // Strategic fit analysis
  let verdict = '';
  if (cutDir === 'declining' && addDir === 'growing') {
    verdict = `Good trade — you're replacing declining demand with growing demand.`;
  } else if (netDiff >= 50) {
    verdict = `Strong trade — net gain of $${netDiff}K and ${custDiff >= 0 ? `+${custDiff}` : custDiff} accounts.`;
  } else if (netDiff >= 0) {
    verdict = `Neutral on revenue (+$${netDiff}K), but ${addDir === 'growing' ? 'the incoming item has growing momentum' : 'both items have similar demand trajectories'}.`;
  } else if (addDir === 'growing') {
    verdict = `Short-term revenue dip (-$${Math.abs(netDiff)}K), but ${addItem.title.split(' ').slice(0, 3).join(' ')} has growing demand — this bet improves over time.`;
  } else {
    verdict = `Risky — net loss of $${Math.abs(netDiff)}K and both items have ${addDir} demand. Make sure there's a strategic reason beyond the numbers.`;
  }

  // Risk assessment
  const risks: string[] = [];
  if (cutDeps.blocks.length > 0) risks.push(`Moving ${shortTitle(cutItem.title, 25)} down will stall ${cutDeps.blocks.map(d => shortTitle(d.title, 20)).join(' and ')}`);
  if (addDeps.dependsOn.length > 0) risks.push(`${shortTitle(addItem.title, 25)} depends on ${addDeps.dependsOn.map(d => shortTitle(d.title, 20)).join(' and ')} — make sure those ship first`);
  const hasQuotes = customerQuotes[cutItem.id] && customerQuotes[cutItem.id].length > 0;
  if (hasQuotes) risks.push(`Customers have specifically quoted ${shortTitle(cutItem.title, 25)} — expect pushback`);

  const riskSection = risks.length > 0
    ? `\n\n─── Risks ─────────────────────────\n${risks.map(r => `• ${r}`).join('\n')}`
    : '';

  const fullText = `## Replacing ${shortTitle(cutItem.title, 30)} with ${shortTitle(addItem.title, 30)}\n\n${verdict}${riskSection}`;

  const dataForAI3 = { cutting: { title: cutItem.title, revenue: cutItem.estRevenue, customers: cutItem.customers, trend: cutDir, blocks: cutDeps.blocks.map(d => d.title) }, adding: { title: addItem.title, revenue: addItem.estRevenue, customers: addItem.customers, trend: addDir }, netRevenueDelta: netDiff };

  return {
    text: fullText,
    textPromise: generateNarrative({ useCase: "uc3", structuredData: dataForAI3, fallbackText: fullText }).then(r => r.fromAI ? fullText + '\n\n' + r.text : fullText),
    cards,
    loadingSteps: [
      `Reading ${cutItem.title.split(' ').slice(0, 4).join(' ')}…`,
      `Reading ${addItem.title.split(' ').slice(0, 4).join(' ')}…`,
      "Mapping dependency chains…",
      "Ranking Q2 items by cut safety…",
    ],
    pills: buildGuardedPills('expand', [
      { label: "Apply this swap", key: `apply-swap-${cutItem.id}-${addItem.id}` },
      { label: "What else could we cut instead?", key: "alt-cut" },
      { label: "Write a trade-off summary for leadership", key: "uc4-leadership" },
    ], { recommendedAction: 'swap' }),
    intentRoot: 'expand',
  };
}

/* ─── UC3: "Add X to Q2, what do I cut?" (mandate-driven) ─── */
function buildAddToQ2(addItemId: string): MessageContent {
  const addItem = getItem(addItemId);
  if (!addItem) return { text: "I couldn't find that item. Could you try again?" };

  const addTrend = getTrend(addItemId);
  const q2 = getQ2Items();

  // Rank all Q2 items by cut safety (weakest evidence + no deps + declining = safest)
  const cutCandidates = q2.map(item => {
    const deps = getDeps(item.id);
    const trend = getTrend(item.id);
    const hasQuotes = customerQuotes[item.id] && customerQuotes[item.id].length > 0;
    const score = evidenceScore(item);
    const safetyScore = score + (deps.blocks.length * 50) + (hasQuotes ? 20 : 0);
    const safetyLabel = deps.blocks.length > 0 ? 'risky — blocks other items' : hasQuotes ? 'has customer quotes' : trend?.direction === 'declining' ? 'safest — declining demand' : 'moderate';
    return { item, score, deps, trend, hasQuotes, safetyScore, safetyLabel };
  }).sort((a, b) => a.safetyScore - b.safetyScore);

  const recommended = cutCandidates[0];
  const netDiff = addItem.estRevenue - (recommended?.item.estRevenue ?? 0);

  // Cards: show the incoming item + recommended cut
  // Change card instead of ImpactCards
  const cards: React.ReactNode[] = [];
  if (recommended) {
    cards.push(<ChangeCard key="trade-changes" changes={[
      { item: recommended.item.title, from: recommended.item.priority, to: 'later', reason: recommended.safetyLabel },
      { item: addItem.title, from: roadmapData.find(r => r.id === addItemId) ? 'current priority' : 'Not on roadmap', to: 'now (Q2)', reason: `$${addItem.estRevenue}K ARR, ${addItem.customers} customers, ${trendLabel(addTrend?.direction || 'stable')}` },
    ]} />);
  }

  // Structured text
  let text = `## Making room for ${addItem.title}\n\n`;
  if (recommended) {
    const recTrend = recommended.trend?.direction || 'stable';
    const reason = recTrend === 'declining' ? 'Declining demand, no customer quotes.'
      : recommended.deps.blocks.length === 0 ? 'Weakest evidence in Q2, nothing depends on it.'
      : 'Weakest evidence, but blocks other items.';
    text += `Move **${recommended.item.title}** down. ${reason}`;
  } else {
    text += `You'd need to move something down.`;
  }

  if (cutCandidates.length > 1) {
    text += `\n\n${cutCandidates.length - 1} other options available if you'd rather cut something else.`;
  }

  const dataForAI3 = { adding: { title: addItem.title, revenue: addItem.estRevenue, trend: addTrend?.direction }, recommendedCut: recommended ? { title: recommended.item.title, revenue: recommended.item.estRevenue, trend: recommended.trend?.direction, safetyLabel: recommended.safetyLabel } : null, allOptions: cutCandidates.map(c => ({ title: c.item.title, safetyLabel: c.safetyLabel })) };

  return {
    text,
    textPromise: generateNarrative({ useCase: "uc3", structuredData: dataForAI3, fallbackText: text }).then(r => r.fromAI ? text + '\n\n' + r.text : text),
    cards,
    loadingSteps: [
      `Evaluating ${addItem.title.split(' ').slice(0, 4).join(' ')}…`,
      "Ranking Q2 items by cut safety…",
      "Calculating net impact…",
    ],
    pills: [
      ...(recommended ? [{ label: `Drop ${recommended.item.title.split(' ').slice(0, 3).join(' ')} and add it`, key: `apply-swap-${recommended.item.id}-${addItemId}` }] : []),
      { label: "Show me a different cut option", key: "alt-cut" },
      { label: "Write a trade-off summary for leadership", key: "uc4-leadership" },
    ],
  };
}

function buildAltCut(): MessageContent {
  const q2 = getQ2Items();
  // Rank by cut safety: lowest evidence + no deps + no quotes = safest
  const ranked = q2.map(item => {
    const deps = getDeps(item.id);
    const trend = getTrend(item.id);
    const hasQuotes = customerQuotes[item.id] && customerQuotes[item.id].length > 0;
    const score = evidenceScore(item);
    const safetyScore = score + (deps.blocks.length * 50) + (hasQuotes ? 20 : 0);
    return { item, deps, trend, hasQuotes, safetyScore };
  }).sort((a, b) => a.safetyScore - b.safetyScore);

  const safest = ranked[0];

  let text = `## Easiest Q2 items to move down\n\n`;
  if (safest) {
    const reason = safest.trend?.direction === 'declining' ? 'declining demand' : !safest.hasQuotes ? 'no customer quotes backing it' : 'weakest evidence in Q2';
    text += `**${safest.item.title}** is the safest — ${reason}, nothing depends on it.\n\n`;
  }
  text += `─── All options by risk ────────────\n`;
  text += ranked.slice(0, 3).map((r, i) => {
    const risk = r.deps.blocks.length > 0 ? '{{red:blocks other items}}' : r.hasQuotes ? 'has customer quotes' : '{{green:clean — no dependencies or quotes}}';
    return `${i + 1}. ${r.item.title}\n   $${r.item.estRevenue}K · ${r.item.customers} accounts · ${risk}`;
  }).join('\n\n');

  // Change card for the safest cut
  const cards: React.ReactNode[] = [];
  if (safest) {
    cards.push(<ChangeCard key="alt-cut-card" changes={ranked.slice(0, 3).map(r => ({
      item: r.item.title,
      from: r.item.priority,
      to: 'later',
      reason: r.deps.blocks.length > 0 ? 'blocks other items — risky' : r.hasQuotes ? 'has customer quotes' : r.trend?.direction === 'declining' ? 'declining demand — safest' : 'weakest evidence',
    }))} />);
  }

  return {
    text,
    cards,
    pills: [
      ...(safest ? [{ label: `Move ${shortTitle(safest.item.title, 20)} down`, key: `reprioritize-demote-${safest.item.id}` }] : []),
      { label: "Where is my roadmap out of sync?", key: "uc2-mismatch" },
      { label: "Rank everything by evidence", key: "flow1-initial" },
    ],
  };
}

/* ═══════════════════════════════════════════════════════════════
   REPRIORITIZE ACTION — before/after diff with confirmation
   ═══════════════════════════════════════════════════════════════ */

function buildReprioritize(itemId: string, action: 'promote' | 'demote'): MessageContent {
  const item = getItem(itemId);
  if (!item) return { text: "I couldn't find that item." };

  const onRoadmap = roadmapData.find(r => r.id === item.id);

  // If item is NOT on the roadmap, "promote" means "add to roadmap"
  if (!onRoadmap && action === 'promote') {
    const trend = getTrend(itemId);
    const deps = getDeps(itemId);
    const cards: React.ReactNode[] = [
      <div key="diff" style={{ border: "1px solid #E9EAEF", borderRadius: 12, background: "#FFFFFF", overflow: "hidden" }}>
        <div style={{ padding: "12px 20px", borderBottom: "1px solid #E9EAEF" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#222428" }}>Proposed change</span>
        </div>
        <div style={{ padding: "12px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "#6f7489" }}>Item</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#222428" }}>{item.title}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "#6f7489" }}>Action</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#38A169" }}>Add to roadmap (next)</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "#6f7489" }}>Evidence</span>
            <span style={{ fontSize: 13, color: "#222428" }}>${item.estRevenue}K · {item.customers} customers · {trend ? trendLabel(trend.direction) : 'stable'}</span>
          </div>
        </div>
      </div>,
    ];

    const allScored = [...roadmapData.filter(r => r.status !== 'done'), ...sampleData].map(i => ({ item: i, score: evidenceScore(i) })).sort((a, b) => b.score - a.score);
    const rank = allScored.findIndex(s => s.item.id === item.id) + 1;
    const promoteReason = trend?.direction === 'growing'
      ? `demand is growing and ${item.customers} accounts worth $${item.estRevenue}K are asking for it`
      : rank <= 5
        ? `it ranks #${rank} by evidence — $${item.estRevenue}K ARR from ${item.customers} accounts`
        : `${item.customers} accounts are requesting it with $${item.estRevenue}K in addressable ARR`;

    return {
      text: `**${item.title}** is in your backlog but not on the roadmap. Add it — ${promoteReason}.${deps.blocks.length > 0 ? ` This would also unblock ${deps.blocks.map(d => `**${d.title}**`).join(' and ')}.` : ''}`,
      cards,
      loadingSteps: [
        `Evaluating ${item.title.split(' ').slice(0, 4).join(' ')}…`,
        "Checking roadmap capacity…",
      ],
      pills: [
        { label: "Add to roadmap", key: `apply-reprioritize-${itemId}-next` },
        { label: "Show me what I'd need to cut", key: "alt-cut" },
        { label: "Back to ranking", key: "flow1-initial" },
      ],
    };
  }

  const currentPriority = onRoadmap ? onRoadmap.priority : item.priority;
  const priorityOrder: string[] = ['icebox', 'later', 'triage', 'next', 'now'];
  const currentIdx = priorityOrder.indexOf(currentPriority);
  const newPriority = action === 'promote'
    ? priorityOrder[Math.min(currentIdx + 1, priorityOrder.length - 1)]
    : priorityOrder[Math.max(currentIdx - 1, 0)];

  if (newPriority === currentPriority) {
    return {
      text: `**${item.title}** is already at ${action === 'promote' ? 'the highest' : 'the lowest'} priority (${currentPriority}). No change needed.`,
      pills: [{ label: "Show the evidence ranking", key: "flow1-initial" }],
    };
  }

  const trend = getTrend(itemId);
  const deps = getDeps(itemId);
  const impactItems = action === 'promote' ? deps.blocks : deps.dependsOn;

  // Build before/after diff card
  const cards: React.ReactNode[] = [
    <div key="diff" style={{ border: "1px solid #E9EAEF", borderRadius: 12, background: "#FFFFFF", overflow: "hidden" }}>
      <div style={{ padding: "12px 20px", borderBottom: "1px solid #E9EAEF" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#222428" }}>Proposed change</span>
      </div>
      <div style={{ padding: "12px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, color: "#6f7489" }}>Item</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#222428" }}>{shortTitle(item.title, 30)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, color: "#6f7489" }}>Priority</span>
          <span style={{ fontSize: 13 }}>
            <span style={{ color: "#6f7489", textDecoration: "line-through" }}>{currentPriority}</span>
            <span style={{ color: "#222428", margin: "0 6px" }}>→</span>
            <span style={{ fontWeight: 700, color: action === 'promote' ? "#38A169" : "#E53E3E" }}>{newPriority}</span>
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, color: "#6f7489" }}>Evidence</span>
          <span style={{ fontSize: 13, color: "#222428" }}>${item.estRevenue}K · {item.customers} customers · {trend ? trendLabel(trend.direction) : 'stable'}</span>
        </div>
        {impactItems.length > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <span style={{ fontSize: 13, color: "#6f7489" }}>{action === 'promote' ? 'Unblocks' : 'Affected'}</span>
            <span style={{ fontSize: 13, color: "#222428", textAlign: "right" }}>{impactItems.map(d => shortTitle(d.title, 25)).join(', ')}</span>
          </div>
        )}
      </div>
    </div>,
  ];

  // Build specific evidence reason
  const recency = recencyLabel(itemId);
  const allScored = [...roadmapData.filter(r => r.status !== 'done'), ...sampleData].map(i => ({ item: i, score: evidenceScore(i) })).sort((a, b) => b.score - a.score);
  const rank = allScored.findIndex(s => s.item.id === item.id) + 1;

  let evidenceReason = '';
  if (action === 'promote') {
    if (trend?.direction === 'growing') evidenceReason = `Demand is growing (+${trend.mentionsDelta} mentions recently) and ${item.customers} accounts are asking for it.`;
    else if (rank <= 5) evidenceReason = `It ranks #${rank} by evidence — $${item.estRevenue}K ARR across ${item.customers} accounts.`;
    else if (item.customers > 30) evidenceReason = `${item.customers} accounts are requesting this, with $${item.estRevenue}K in addressable ARR.`;
    else evidenceReason = `$${item.estRevenue}K in addressable ARR and ${trend?.direction === 'stable' ? 'steady' : trend?.direction || 'steady'} demand${recency ? ` (last mentioned ${recency})` : ''}.`;
  } else {
    if (trend?.direction === 'declining') evidenceReason = `Demand is declining (${trend.mentionsDelta} mentions) and it ranks #${rank} by evidence — below items that are lower priority.`;
    else if (rank > allScored.length * 0.6) evidenceReason = `It ranks #${rank} out of ${allScored.length} by evidence — other ${currentPriority}-priority items have stronger signals.`;
    else evidenceReason = `At $${item.estRevenue}K and ${item.customers} accounts, the evidence doesn't justify ${currentPriority} priority${recency ? ` (last mention: ${recency})` : ''}.`;
  }

  const text = action === 'promote'
    ? `Move **${item.title}** up from *${currentPriority}* to *${newPriority}*.\n\n${evidenceReason}${impactItems.length > 0 ? ` This would also unblock ${impactItems.map(d => `**${d.title}**`).join(' and ')}.` : ''}`
    : `Move **${item.title}** down from *${currentPriority}* to *${newPriority}*.\n\n${evidenceReason}${impactItems.length > 0 ? ` Note: ${impactItems.map(d => `**${d.title}**`).join(' and ')} depend${impactItems.length === 1 ? 's' : ''} on this — check with eng before moving.` : ''}`;

  return {
    text,
    cards,
    loadingSteps: [
      `Evaluating ${shortTitle(item.title, 25)}…`,
      "Checking downstream impact…",
      "Preparing change preview…",
    ],
    pills: buildGuardedPills('refine', [
      { label: "Apply this change", key: `apply-reprioritize-${itemId}-${newPriority}` },
      { label: "What's the downstream impact?", key: `flow2-${itemId}` },
      { label: "Show me alternatives", key: "alt-cut" },
      { label: "Back to overview", key: "flow1-initial" },
    ], { recommendedAction: action }),
    intentRoot: 'refine',
  };
}

/* ─── Apply reprioritization (mock — shows confirmation) ─── */
function buildApplyConfirmation(itemId: string, newPriority: string): MessageContent {
  const item = getItem(itemId);
  if (!item) return { text: "Item not found." };

  const oldPriority = item.priority;
  const deps = getDeps(itemId);
  const trend = getTrend(itemId);
  const promoted = priorityNum(newPriority) > priorityNum(oldPriority);

  // Impact summary
  const impacts: string[] = [];
  if (promoted && deps.blocks.length > 0) {
    impacts.push(`Unblocks ${deps.blocks.map(d => `**${shortTitle(d.title, 25)}**`).join(' and ')}`);
  }
  if (!promoted && deps.dependsOn.length > 0) {
    impacts.push(`**${deps.dependsOn.map(d => shortTitle(d.title, 25)).join(' and ')}** depend on this — check with eng`);
  }
  if (promoted) {
    impacts.push(`+$${item.estRevenue}K ARR now in ${newPriority} priority`);
  }

  const impactText = impacts.length > 0
    ? `\n\n─── Impact ────────────────────────\n${impacts.map(i => `• ${i}`).join('\n')}`
    : '';

  // Notify line — specific to audience
  const notifyLine = promoted
    ? `Tell engineering — this changes sprint capacity. ${newPriority === 'now' ? 'Needs allocation immediately.' : 'Plan for upcoming cycle.'}`
    : `Let the team know this is deprioritized. Free up any active capacity.`;

  const cards: React.ReactNode[] = [
    <ChangeCard key="applied-change" changes={[{
      item: item.title,
      from: oldPriority,
      to: newPriority,
      reason: `$${item.estRevenue}K ARR, ${item.customers} accounts, ${trend ? trendLabel(trend.direction) : 'stable'}`,
    }]} />,
  ];

  return {
    text: `## Change applied\n\n**${item.title}** moved from *${oldPriority}* to *${newPriority}*.\n\n${notifyLine}${impactText}`,
    cards,
    pills: [
      { label: "Write an update for leadership", key: "uc4-leadership" },
      { label: "What else needs attention?", key: "uc5-drift" },
    ],
  };
}

/* ─── Apply swap (mock — shows confirmation for UC3) ─── */
function buildApplySwap(cutId: string, addId: string): MessageContent {
  const cutItem = getItem(cutId);
  const addItem = getItem(addId);
  if (!cutItem || !addItem) return { text: "Items not found." };

  const netARR = addItem.estRevenue - cutItem.estRevenue;
  const netCust = addItem.customers - cutItem.customers;
  const cutDeps = getDeps(cutId);
  const addDeps = getDeps(addId);

  const impacts: string[] = [];
  if (cutDeps.blocks.length > 0) impacts.push(`**${cutDeps.blocks.map(d => shortTitle(d.title, 20)).join(', ')}** may be affected — ${shortTitle(cutItem.title, 20)} was blocking them`);
  if (addDeps.dependsOn.length > 0) impacts.push(`**${shortTitle(addItem.title, 20)}** depends on ${addDeps.dependsOn.map(d => shortTitle(d.title, 20)).join(', ')} — make sure those ship first`);

  const impactSection = impacts.length > 0
    ? `\n\n─── Watch out ─────────────────────\n${impacts.map(i => `• ${i}`).join('\n')}`
    : '';

  const cards: React.ReactNode[] = [
    <ChangeCard key="swap-applied" changes={[
      { item: cutItem.title, from: cutItem.priority, to: 'later', reason: `Freed capacity` },
      { item: addItem.title, from: roadmapData.find(r => r.id === addId) ? addItem.priority : 'Not on roadmap', to: 'now (Q2)', reason: `$${addItem.estRevenue}K ARR, ${addItem.customers} accounts` },
    ]} />,
  ];

  return {
    text: `## Swap applied\n\nNet impact: ${netARR >= 0 ? '+' : ''}$${netARR}K addressable ARR, ${netCust >= 0 ? '+' : ''}${netCust} accounts.\n\nTell engineering about the capacity shift — ${shortTitle(cutItem.title, 20)} is paused, ${shortTitle(addItem.title, 20)} needs allocation.${impactSection}`,
    cards,
    pills: [
      { label: "Write a trade-off summary for leadership", key: "uc4-leadership" },
      { label: "What else needs attention?", key: "uc5-drift" },
    ],
  };
}

/* ─── Helper: compute evidence score for an item ─── */
function evidenceScore(item: SpaceRow): number {
  const trend = demandTrend.find(t => t.itemId === item.id);
  const trendBonus = trend ? (trend.direction === 'growing' ? 1.2 : trend.direction === 'declining' ? 0.7 : 1.0) : 1.0;
  // Recency bonus: items mentioned in last 14 days get 1.15x, 14-30 days get 1.0x, older get 0.85x
  const now = new Date('2026-04-01'); // fixed date for consistent demo
  const lastMention = trend?.lastMentionDate ? new Date(trend.lastMentionDate) : null;
  const daysSince = lastMention ? Math.floor((now.getTime() - lastMention.getTime()) / 86400000) : 60;
  const recencyBonus = daysSince <= 14 ? 1.15 : daysSince <= 30 ? 1.0 : 0.85;
  return ((item.mentions * 0.3) + (item.customers * 0.4) + (item.estRevenue / 10 * 0.3)) * trendBonus * recencyBonus;
}

/* ─── Helper: priority to numeric ─── */
function priorityNum(p: string): number {
  return { now: 4, next: 3, later: 2, triage: 1, icebox: 0 }[p] ?? 0;
}

/* ─── Helper: get trend for item ─── */
function getTrend(id: string) {
  return demandTrend.find(t => t.itemId === id);
}

/* ─── Helper: trend label (plain text — for cards/JSX) ─── */
function trendLabel(dir: string): string {
  return dir === 'growing' ? '↑ growing' : dir === 'declining' ? '↓ declining' : '→ stable';
}
/* ─── Helper: colored trend (for text rendered by renderTextWithLinks) ─── */
function colorTrend(dir: string): string {
  return dir === 'growing' ? '{{green:↑ growing}}' : dir === 'declining' ? '{{red:↓ declining}}' : '→ stable';
}

/* ─── Helper: recency label ─── */
function recencyLabel(itemId: string): string {
  const trend = demandTrend.find(t => t.itemId === itemId);
  if (!trend?.lastMentionDate) return '';
  const d = new Date(trend.lastMentionDate);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

/* ═══════════════════════════════════════════════════════════════
   UC2: PLAN VS DEMAND MISMATCH
   ═══════════════════════════════════════════════════════════════ */

function buildUC2Mismatch(): MessageContent {
  const allItems = [...roadmapData.filter(r => r.status !== 'done'), ...sampleData.filter(s => !roadmapData.find(r => r.title === s.title))];
  const scored = allItems.map(item => ({
    item,
    score: evidenceScore(item),
    priorityN: priorityNum(item.priority),
    evidenceRank: 0,
    onRoadmap: !!roadmapData.find(r => r.id === item.id),
  }));
  scored.sort((a, b) => b.score - a.score);
  scored.forEach((s, i) => { s.evidenceRank = i + 1; });

  const median = scored[Math.floor(scored.length / 2)]?.score ?? 0;
  const topQuartile = scored[Math.floor(scored.length * 0.25)]?.score ?? 0;

  // Find reference items for comparison
  const weakestQ2Item = scored.filter(s => s.priorityN >= 3).sort((a, b) => a.score - b.score)[0];
  const strongestNonQ2 = scored.find(s => s.priorityN <= 2 || !s.onRoadmap);

  const findings: { type: 'over-invested' | 'under-invested' | 'missing'; item: SpaceRow; detail: string; severity: number }[] = [];

  // Over-invested: high priority but low evidence — each gets a unique insight, no repetitive comparison
  const usedComparisonIds = new Set<string>();
  for (const s of scored) {
    if (s.priorityN >= 3 && s.score < median && findings.length < 4) {
      const trend = getTrend(s.item.id);
      const recency = recencyLabel(s.item.id);
      const severity = s.evidenceRank - (scored.length - s.priorityN * 3);
      // Unique insight per finding instead of always comparing to the same item
      let insight = '';
      if (trend?.direction === 'declining') {
        insight = ' Demand is declining — the signal is getting weaker, not stronger.';
      } else if (s.item.estRevenue < 100) {
        insight = ' The revenue impact is small relative to other Q2 items.';
      } else if (!recency || recency.includes('Feb') || recency.includes('Jan')) {
        insight = ' No recent mentions — this is a stale priority.';
      }
      findings.push({
        type: 'over-invested',
        item: s.item,
        severity: Math.abs(severity),
        detail: `${s.item.title} — *${s.item.priority}* but ranks #${s.evidenceRank} by evidence.\n   $${s.item.estRevenue}K · ${s.item.customers} accounts · ${colorTrend(trend?.direction || 'stable')}${recency ? ` · ${recency}` : ''}${insight ? `\n   ${insight.trim()}` : ''}`,
      });
    }
  }

  // Under-invested / Missing: low priority but strong evidence
  for (const s of scored) {
    if (s.priorityN <= 2 && s.score > topQuartile && findings.length < 4) {
      const trend = getTrend(s.item.id);
      const recency = recencyLabel(s.item.id);
      const type = s.onRoadmap ? 'under-invested' as const : 'missing' as const;
      // Unique insight per finding
      let insight = '';
      if (trend?.direction === 'growing') {
        insight = ' Demand is growing — this is gaining momentum.';
      } else if (s.item.customers > 40) {
        insight = ' A large number of accounts are asking for this.';
      }
      const severity = (scored.length - s.evidenceRank) + s.priorityN * 5;
      findings.push({
        type,
        item: s.item,
        severity: Math.abs(severity),
        detail: `${s.item.title} — ${s.onRoadmap ? `only *${s.item.priority}*` : '{{red:not on roadmap}}'} but strong evidence.\n   $${s.item.estRevenue}K · ${s.item.customers} accounts · ${colorTrend(trend?.direction || 'stable')}${recency ? ` · ${recency}` : ''}${insight ? `\n   ${insight.trim()}` : ''}`,
      });
    }
  }

  // Fix 2: Sort by severity (biggest gap first)
  findings.sort((a, b) => b.severity - a.severity);

  const typeLabels: Record<string, string> = { 'over-invested': 'Getting more priority than demand supports', 'under-invested': 'Not getting the priority demand deserves', 'missing': 'Strong demand but not on your roadmap' };

  // Build root cause per finding
  function mismatchRootCause(f: typeof findings[0]): string {
    const trend = getTrend(f.item.id);
    const recency = recencyLabel(f.item.id);
    if (f.type === 'over-invested') {
      if (trend?.direction === 'declining') return `Demand has been dropping — likely a stale priority that hasn't been revisited.`;
      if (f.item.customers < 20) return `Only ${f.item.customers} accounts are asking — likely elevated by a single loud voice.`;
      if (recency && (recency.includes('Jan') || recency.includes('Feb'))) return `Last mentioned ${recency} — no recent signals to justify its position.`;
      return `Evidence doesn't match its priority — review whether this was a gut call or data-driven.`;
    } else if (f.type === 'under-invested') {
      if (trend?.direction === 'growing') return `Demand is accelerating but priority hasn't caught up.`;
      return `Strong evidence ($${f.item.estRevenue}K, ${f.item.customers} accounts) but sitting at ${f.item.priority} priority.`;
    } else {
      if (trend?.direction === 'growing') return `Growing demand from ${f.item.customers} accounts — this should be on your radar.`;
      return `${f.item.customers} accounts worth $${f.item.estRevenue}K are asking for this.`;
    }
  }

  // Concise: top 2 findings. Full list behind pill.
  const showFindings = findings.slice(0, 2);
  const text = findings.length === 0
    ? `## Plan vs demand\n\nYour priorities match customer demand — well done. Check back after your next wave of customer research.`
    : `## Plan vs demand\n\n${findings.length} gaps found. Biggest: **${findings[0].item.title}**.\n\n${showFindings.map((f) => {
        return `• **${f.item.title}** — ${typeLabels[f.type]}.\n   ${mismatchRootCause(f)}`;
      }).join('\n\n')}${findings.length > 2 ? `\n\n*+${findings.length - 2} more gaps — deep dive to see all.*` : ''}`;

  // Change card for the top actionable finding
  const changeCards: React.ReactNode[] = [];
  if (findings.length > 0) {
    const topChanges = findings.slice(0, 2).map(f => ({
      item: f.item.title,
      from: f.type === 'missing' ? 'Not on roadmap' : `${f.item.priority}`,
      to: f.type === 'over-invested' ? 'Move down' : f.type === 'missing' ? 'Add to roadmap' : 'Move up',
      reason: typeLabels[f.type],
    }));
    changeCards.push(<ChangeCard key="uc2-changes" changes={topChanges} />);
  }

  const dataForAI2 = { mismatches: findings.map(f => ({ type: f.type, title: f.item.title, priority: f.item.priority, revenue: f.item.estRevenue, customers: f.item.customers, trend: getTrend(f.item.id)?.direction })) };

  const missingItem = findings.find(f => f.type === 'missing');
  const underInvested = findings.find(f => f.type === 'under-invested');
  const overInvested = findings.find(f => f.type === 'over-invested');

  const rawPills: { label: string; key: string }[] = findings.length === 0
    ? [
        { label: "Has anything drifted?", key: "uc5-drift" },
        { label: "Show me the full evidence ranking", key: "flow1-initial" },
      ]
    : [
        ...(missingItem ? [{ label: `Add ${missingItem.item.title.split(' ').slice(0, 3).join(' ')} to roadmap`, key: `reprioritize-promote-${missingItem.item.id}` }] : []),
        ...(underInvested && underInvested.item.priority !== 'now' && !missingItem ? [{ label: "Promote the under-invested item", key: `reprioritize-promote-${underInvested.item.id}` }] : []),
        ...(overInvested ? [{ label: `Move ${shortTitle(overInvested.item.title, 20)} down`, key: `reprioritize-demote-${overInvested.item.id}` }] : []),
        { label: "Deep dive into the top mismatch", key: `flow2-${findings[0].item.id}` },
        { label: "Rank everything by evidence", key: "flow1-initial" },
      ];

  return {
    text,
    textPromise: generateNarrative({ useCase: "uc2", structuredData: dataForAI2, fallbackText: text }).then(r => r.fromAI ? text + '\n\n' + r.text : text),
    cards: changeCards,
    loadingSteps: [
      "Cross-referencing priorities with evidence…",
      "Identifying gaps…",
    ],
    pills: buildGuardedPills('debug', rawPills, { recommendedAction: overInvested ? 'demote' : missingItem ? 'add' : null }),
    intentRoot: 'debug',
  };
}

/* ═══════════════════════════════════════════════════════════════
   UC4: SUMMARIZE CHANGES FOR AUDIENCE
   ═══════════════════════════════════════════════════════════════ */

function buildUC4Summary(audience: 'leadership' | 'engineering' | 'cs', dateRange?: string): MessageContent {
  // Parse date range — default to 30 days
  const now = new Date('2026-04-10'); // fixed for demo consistency
  let cutoff = new Date(now);
  let rangeLabel = 'last 30 days';

  if (dateRange) {
    const lower = dateRange.toLowerCase();
    if (lower.includes('week') || lower.includes('7 day')) {
      cutoff.setDate(cutoff.getDate() - 7);
      rangeLabel = 'this week';
    } else if (lower.includes('2 week') || lower.includes('two week') || lower.includes('14 day')) {
      cutoff.setDate(cutoff.getDate() - 14);
      rangeLabel = 'last 2 weeks';
    } else if (lower.includes('quarter') || lower.includes('90 day') || lower.includes('3 month')) {
      cutoff.setDate(cutoff.getDate() - 90);
      rangeLabel = 'this quarter';
    } else if (lower.includes('month') || lower.includes('30 day')) {
      cutoff.setDate(cutoff.getDate() - 30);
      rangeLabel = 'last month';
    } else {
      // Try to parse "since March 8" / "since 2026-03-08"
      const sinceMatch = lower.match(/since\s+(.+)/);
      if (sinceMatch) {
        const parsed = new Date(sinceMatch[1]);
        if (!isNaN(parsed.getTime())) {
          cutoff = parsed;
          const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
          rangeLabel = `since ${months[parsed.getMonth()]} ${parsed.getDate()}`;
        }
      }
    }
  } else {
    cutoff.setDate(cutoff.getDate() - 30);
  }

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const dateHeader = `${months[cutoff.getMonth()]} ${cutoff.getDate()} – ${months[now.getMonth()]} ${now.getDate()}`;

  const recent = itemHistory.filter(h => new Date(h.date) >= cutoff);
  const changes = recent.map(h => {
    const item = getItem(h.itemId);
    return { ...h, item };
  }).filter(c => c.item);

  const audienceLabels = { leadership: 'Leadership', engineering: 'Engineering', cs: 'Customer Success' };

  // Group changes when >5 by type
  const grouped = {
    priority: changes.filter(c => c.changeType === 'priority-changed'),
    status: changes.filter(c => c.changeType === 'status-changed'),
    scope: changes.filter(c => c.changeType === 'scope-changed'),
    added: changes.filter(c => c.changeType === 'added'),
    removed: changes.filter(c => c.changeType === 'removed'),
  };

  const shouldGroup = changes.length > 5;

  // Compute net ARR impact
  const promotedARR = grouped.priority.filter(c => priorityNum(c.to!) > priorityNum(c.from!)).reduce((s, c) => s + (c.item?.estRevenue || 0), 0);
  const demotedARR = grouped.priority.filter(c => priorityNum(c.to!) < priorityNum(c.from!)).reduce((s, c) => s + (c.item?.estRevenue || 0), 0);
  const addedARR = grouped.added.reduce((s, c) => s + (c.item?.estRevenue || 0), 0);
  const removedARR = grouped.removed.reduce((s, c) => s + (c.item?.estRevenue || 0), 0);
  const netARR = promotedARR + addedARR - demotedARR - removedARR;

  // Find biggest open risk: high priority + weak evidence
  const q2Items = roadmapData.filter(r => r.priority === 'now' && r.status !== 'done');
  const allScored = [...roadmapData.filter(r => r.status !== 'done'), ...sampleData].map(i => ({ item: i, score: evidenceScore(i) })).sort((a, b) => b.score - a.score);
  const weakestQ2 = q2Items.map(item => ({
    item,
    score: evidenceScore(item),
    rank: allScored.findIndex(s => s.item.id === item.id) + 1,
  })).sort((a, b) => a.score - b.score)[0];

  let intro = '';
  const bullets: string[] = [];

  if (audience === 'leadership') {
    const totalARRImpact = changes.reduce((sum, c) => sum + (c.item?.estRevenue || 0), 0);
    intro = `## Q2 Roadmap Update (${dateHeader})\n\n${changes.length} changes worth flagging:\n\n─── What shifted and why ──────────`;

    if (shouldGroup) {
      // Grouped format — each item on its own indented line
      if (grouped.priority.length > 0) {
        const elevated = grouped.priority.filter(c => priorityNum(c.to!) > priorityNum(c.from!));
        const deprioritized = grouped.priority.filter(c => priorityNum(c.to!) < priorityNum(c.from!));
        if (elevated.length > 0) bullets.push(`**${elevated.length} {{green:moved up}}:**\n${elevated.map(c => `   ${c.item!.title} · ${c.from} → ${c.to} · $${c.item!.estRevenue}K`).join('\n')}`);
        if (deprioritized.length > 0) bullets.push(`**${deprioritized.length} {{red:moved down}}:**\n${deprioritized.map(c => `   ${c.item!.title} · ${c.from} → ${c.to}`).join('\n')}`);
      }
      if (grouped.added.length > 0) bullets.push(`**${grouped.added.length} added to roadmap:**\n${grouped.added.map(c => `   ${c.item!.title} · $${c.item!.estRevenue}K`).join('\n')}`);
      if (grouped.removed.length > 0) bullets.push(`**${grouped.removed.length} removed:**\n${grouped.removed.map(c => `   ${c.item!.title}`).join('\n')}`);
      if (grouped.scope.length > 0) bullets.push(`**${grouped.scope.length} scope changed:**\n${grouped.scope.map(c => `   ${c.item!.title} · "${c.from}" → "${c.to}"`).join('\n')}`);
      if (grouped.status.length > 0) {
        const shipped = grouped.status.filter(c => c.to === 'done');
        const started = grouped.status.filter(c => c.to === 'in-progress');
        if (shipped.length > 0) bullets.push(`**${shipped.length} shipped:**\n${shipped.map(c => `   ${c.item!.title}`).join('\n')}`);
        if (started.length > 0) bullets.push(`**${started.length} now in progress:**\n${started.map(c => `   ${c.item!.title}`).join('\n')}`);
      }
    } else {
      for (const c of changes.slice(0, 5)) {
        if (c.changeType === 'priority-changed') {
          const dir = priorityNum(c.to!) > priorityNum(c.from!) ? '{{green:moved up}}' : '{{red:moved down}}';
          bullets.push(`${c.item!.title} — ${dir} from ${c.from} to ${c.to}\n   $${c.item!.estRevenue}K ARR · ${c.item!.customers} accounts · ${c.reason}`);
        } else if (c.changeType === 'status-changed' && c.to === 'done') {
          bullets.push(`${c.item!.title} — shipped\n   $${c.item!.estRevenue}K ARR · ${c.reason}`);
        } else if (c.changeType === 'status-changed') {
          bullets.push(`${c.item!.title} — now ${c.to}\n   $${c.item!.estRevenue}K ARR · ${c.reason}`);
        } else if (c.changeType === 'added') {
          bullets.push(`${c.item!.title} — added to roadmap\n   $${c.item!.estRevenue}K ARR · ${c.item!.customers} accounts · ${c.reason}`);
        } else if (c.changeType === 'removed') {
          bullets.push(`${c.item!.title} — removed\n   ${c.reason}`);
        } else if (c.changeType === 'scope-changed') {
          bullets.push(`${c.item!.title} — scope changed\n   "${c.from}" → "${c.to}" · ${c.reason}`);
        }
      }
    }

    // Net impact + risk line
    const netLine = netARR >= 0
      ? `Net: Q2 is ${netARR > 50 ? 'significantly ' : ''}more aligned with customer evidence than before.`
      : `Net: Q2 shifted $${Math.abs(netARR)}K away from evidence-backed items — worth a check.`;
    const riskLine = weakestQ2
      ? ` Biggest open risk: **${shortTitle(weakestQ2.item.title, 30)}** is now priority but ranks #${weakestQ2.rank} by evidence ($${weakestQ2.item.estRevenue}K, ${weakestQ2.item.customers} accounts).`
      : '';
    bullets.push(`${netLine}${riskLine}`);

  } else if (audience === 'engineering') {
    intro = `## Q2 Engineering Update (${dateHeader})\n\n${changes.length} changes that affect your sprint planning.\n\n─── Action items ──────────────────`;

    if (shouldGroup) {
      const started = grouped.status.filter(c => c.to === 'in-progress');
      const shipped = grouped.status.filter(c => c.to === 'done');
      const accelerated = grouped.priority.filter(c => priorityNum(c.to!) > priorityNum(c.from!));
      const paused = grouped.priority.filter(c => priorityNum(c.to!) < priorityNum(c.from!));
      if (started.length > 0) bullets.push(`**Now in progress (${started.length}):** ${started.map(c => { const d = getDeps(c.item!.id); return `${c.item!.title}${d.blocks.length > 0 ? ` (blocks ${d.blocks.map(b => shortTitle(b.title, 15)).join(', ')})` : ''}`; }).join('; ')}. Plan capacity.`);
      if (accelerated.length > 0) bullets.push(`**Moved up (${accelerated.length}):** ${accelerated.map(c => `${c.item!.title} (${c.from} → ${c.to})`).join('; ')}. Needs eng allocation.`);
      if (paused.length > 0) bullets.push(`**Moved down (${paused.length}):** ${paused.map(c => `${c.item!.title} (${c.from} → ${c.to})`).join('; ')}. Free up that capacity.`);
      if (grouped.scope.length > 0) bullets.push(`**Scope changed (${grouped.scope.length}):** ${grouped.scope.map(c => `${c.item!.title} — "${c.from}" → "${c.to}"`).join('; ')}. Re-estimate effort.`);
      if (shipped.length > 0) bullets.push(`**Shipped (${shipped.length}):** ${shipped.map(c => c.item!.title).join(', ')}. Close out remaining tickets.`);
      if (grouped.removed.length > 0) bullets.push(`**Removed (${grouped.removed.length}):** ${grouped.removed.map(c => c.item!.title).join(', ')}. Halt active work.`);
    } else {
      for (const c of changes.slice(0, 5)) {
        const deps = getDeps(c.item!.id);
        const depNote = deps.blocks.length > 0 ? ` Blocks ${deps.blocks.map(d => shortTitle(d.title, 20)).join(', ')}.` : '';
        if (c.changeType === 'status-changed' && c.to === 'in-progress') {
          bullets.push(`**Now in progress:** ${c.item!.title} — plan capacity.${depNote}`);
        } else if (c.changeType === 'status-changed' && c.to === 'done') {
          bullets.push(`**Shipped:** ${c.item!.title} — close out remaining tickets.${depNote}`);
        } else if (c.changeType === 'scope-changed') {
          bullets.push(`**Scope changed:** ${c.item!.title} — from "${c.from}" to "${c.to}". Re-estimate effort.`);
        } else if (c.changeType === 'priority-changed') {
          const up = priorityNum(c.to!) > priorityNum(c.from!);
          bullets.push(`**${up ? 'Moved up' : 'Moved down'}:** ${c.item!.title} — ${c.from} → ${c.to}.${up ? ' Needs eng allocation.' : ' Free up that capacity.'}${depNote}`);
        } else if (c.changeType === 'removed') {
          bullets.push(`**Removed:** ${c.item!.title} — removed from roadmap. Halt active work.${depNote}`);
        }
      }
    }

  } else {
    intro = `## Customer-Facing Update (${dateHeader})\n\n${changes.length} changes your accounts may ask about.\n\n─── Talking points ────────────────`;

    if (shouldGroup) {
      const shipped = grouped.status.filter(c => c.to === 'done');
      const comingSoon = grouped.priority.filter(c => c.to === 'now');
      const newItems = grouped.added;
      const deprioritized = [...grouped.priority.filter(c => priorityNum(c.to!) < priorityNum(c.from!)), ...grouped.removed];
      if (shipped.length > 0) bullets.push(`**Shipped (${shipped.length}):** ${shipped.map(c => `${c.item!.title} (${c.item!.customers} accounts)`).join('; ')}. Reach out to affected accounts.`);
      if (comingSoon.length > 0) bullets.push(`**Coming soon (${comingSoon.length}):** ${comingSoon.map(c => `${c.item!.title} (${c.item!.customers} accounts)`).join('; ')}. Accounts can expect progress.`);
      if (newItems.length > 0) bullets.push(`**New on roadmap (${newItems.length}):** ${newItems.map(c => `${c.item!.title} (${c.item!.customers} accounts)`).join('; ')}`);
      if (deprioritized.length > 0) bullets.push(`**Deprioritized (${deprioritized.length}):** ${deprioritized.map(c => c.item!.title).join(', ')}. Prepare talking points for affected accounts.`);
      if (grouped.scope.length > 0) bullets.push(`**Scope adjusted (${grouped.scope.length}):** ${grouped.scope.map(c => `${c.item!.title} — now "${c.to}"`).join('; ')}. Set expectations.`);
    } else {
      for (const c of changes.slice(0, 5)) {
        const accountCount = c.item!.customers;
        if (c.changeType === 'status-changed' && c.to === 'done') {
          bullets.push(`**Shipped:** ${c.item!.title} — reach out to the ${accountCount} accounts that requested this.`);
        } else if (c.changeType === 'priority-changed' && c.to === 'now') {
          bullets.push(`**Coming soon:** ${c.item!.title} — ${accountCount} accounts asked for this. Now top priority for Q2.`);
        } else if (c.changeType === 'priority-changed') {
          const up = priorityNum(c.to!) > priorityNum(c.from!);
          bullets.push(`**${up ? 'Moving up' : 'Deprioritized'}:** ${c.item!.title} — ${accountCount} accounts tracking this. ${up ? 'Progress expected sooner.' : 'Prepare talking points.'}`);
        } else if (c.changeType === 'added') {
          bullets.push(`**New on roadmap:** ${c.item!.title} — ${accountCount} accounts requested it. Now officially planned.`);
        } else if (c.changeType === 'scope-changed') {
          bullets.push(`**Scope change:** ${c.item!.title} — adjusted to "${c.to}". Set expectations with the ${accountCount} accounts tracking this.`);
        } else if (c.changeType === 'removed') {
          bullets.push(`**Deprioritized:** ${c.item!.title} — prepare talking points for ${accountCount} accounts that were expecting this.`);
        }
      }
    }
  }

  if (bullets.length === 0) {
    bullets.push(`No significant changes in the ${rangeLabel}.`);
  }

  const text = `${intro}\n${bullets.map((b, i) => `${i + 1}. ${b}`).join('\n')}`;

  const otherAudiences = (['leadership', 'engineering', 'cs'] as const).filter(a => a !== audience);

  const dataForAI4 = { audience, dateRange: rangeLabel, changes: recent.map(h => ({ date: h.date, item: getItem(h.itemId)?.title, changeType: h.changeType, from: h.from, to: h.to, reason: h.reason })) };

  return {
    text,
    textPromise: generateNarrative({ useCase: "uc4", structuredData: dataForAI4, fallbackText: text }).then(r => r.fromAI ? text + '\n\n' + r.text : text),
    loadingSteps: [
      "Scanning change history…",
      `Filtering ${rangeLabel}…`,
      `Framing for ${audienceLabels[audience]}…`,
    ],
    pills: buildGuardedPills('architect', [
      { label: "Copy to clipboard", key: `copy-summary` },
      { label: `Rewrite for ${audienceLabels[otherAudiences[0]]}`, key: `uc4-${otherAudiences[0]}` },
      { label: `Rewrite for ${audienceLabels[otherAudiences[1]]}`, key: `uc4-${otherAudiences[1]}` },
    ], { recommendedAction: null }),
    intentRoot: 'architect',
  };
}

/* ═══════════════════════════════════════════════════════════════
   UC5: DRIFT DETECTION
   ═══════════════════════════════════════════════════════════════ */

function buildUC5Drift(): MessageContent {
  type DriftFlag = {
    item: SpaceRow;
    trend: typeof demandTrend[number];
    type: 'surging' | 'fading' | 'new-signal' | 'scope-shift' | 'theme';
    narrative: string;
    action: string;
    magnitude: number;
    severity: 'critical' | 'warning' | 'info';
  };

  const flags: DriftFlag[] = [];
  const allItems = [...roadmapData.filter(r => r.status !== 'done'), ...sampleData.filter(s => !roadmapData.find(r => r.title === s.title))];

  // 1. Surging demand — growing items where the plan hasn't kept up
  for (const trend of demandTrend.filter(t => t.direction === 'growing' && t.mentionsDelta >= 8)) {
    const item = getItem(trend.itemId);
    if (!item) continue;
    const onRoadmap = roadmapData.find(r => r.id === item.id);

    // Compute before/after magnitude
    const prevMentions = Math.max(0, item.mentions - trend.mentionsDelta);
    const prevCustomers = Math.max(1, Math.round(item.customers * (prevMentions / Math.max(item.mentions, 1))));
    const prevARR = Math.max(0, Math.round(item.estRevenue * (prevMentions / Math.max(item.mentions, 1))));

    if (!onRoadmap) {
      flags.push({
        item, trend, type: 'surging', magnitude: trend.mentionsDelta,
        severity: trend.mentionsDelta >= 15 ? 'critical' : 'warning',
        narrative: `**${item.title}** went from a blip to a real signal — was ~$${prevARR}K/${prevCustomers} accounts, now $${item.estRevenue}K/${item.customers} accounts. Still not on your roadmap.`,
        action: `needs a decision on whether to roadmap it`,
      });
    } else if (onRoadmap.priority !== 'now') {
      const rank = allItems.map(i => ({ i, s: evidenceScore(i) })).sort((a, b) => b.s - a.s).findIndex(s => s.i.id === item.id) + 1;
      flags.push({
        item, trend, type: 'surging', magnitude: trend.mentionsDelta,
        severity: trend.mentionsDelta >= 15 ? 'critical' : 'warning',
        narrative: `**${item.title}** added ~$${item.estRevenue - prevARR}K ARR and ${item.customers - prevCustomers} new accounts — now $${item.estRevenue}K from ${item.customers} accounts, your #${rank} signal. Still ${onRoadmap.priority} priority.`,
        action: `is under-prioritized relative to its evidence`,
      });
    }
  }

  // 2. Fading demand — declining items still getting investment
  for (const trend of demandTrend.filter(t => t.direction === 'declining' && t.mentionsDelta <= -4)) {
    const item = getItem(trend.itemId);
    if (!item) continue;
    const onRoadmap = roadmapData.find(r => r.id === item.id);
    if (onRoadmap && (onRoadmap.priority === 'now' || onRoadmap.priority === 'next')) {
      const recency = recencyLabel(trend.itemId);
      const recencyNote = recency ? `, last mention ${recency}` : ', no recent mentions';
      flags.push({
        item, trend, type: 'fading', magnitude: Math.abs(trend.mentionsDelta),
        severity: Math.abs(trend.mentionsDelta) >= 6 ? 'warning' : 'info',
        narrative: `**${item.title}** went quiet — ${Math.abs(trend.mentionsDelta)} fewer mentions, trend turned declining${recencyNote}. Still ${onRoadmap.priority} in your plan.`,
        action: `isn't worth ${onRoadmap.priority} priority anymore`,
      });
    }
  }

  // 3. New signals — backlog items with strong current evidence but not on roadmap
  const backlogStrong = sampleData
    .filter(s => !roadmapData.find(r => r.title === s.title))
    .filter(s => {
      const trend = getTrend(s.id);
      return trend && trend.direction === 'growing' && s.estRevenue >= 100 && s.customers >= 10;
    })
    .filter(s => !flags.find(f => f.item.id === s.id)); // skip already flagged
  for (const item of backlogStrong.slice(0, 2)) {
    const trend = getTrend(item.id)!;
    flags.push({
      item, trend, type: 'new-signal', magnitude: trend.mentionsDelta,
      severity: item.estRevenue >= 200 ? 'critical' : 'warning',
      narrative: `**${item.title}** is building momentum — $${item.estRevenue}K from ${item.customers} accounts with +${trend.mentionsDelta} new mentions. Not on your roadmap yet.`,
      action: `deserves a look — the signal is strong enough to act on`,
    });
  }

  // 4. Scope shifts from history
  const recentScope = itemHistory.filter(h => h.changeType === 'scope-changed' && new Date(h.date) >= new Date('2026-03-01'));
  for (const sc of recentScope) {
    const item = getItem(sc.itemId);
    const trend = getTrend(sc.itemId);
    if (item && trend && !flags.find(f => f.item.id === item.id)) {
      flags.push({
        item, trend, type: 'scope-shift', magnitude: 5,
        severity: 'info',
        narrative: `**${item.title}** was rescoped from "${sc.from}" to "${sc.to}". ${sc.reason || 'Review if the narrower scope still addresses the core demand.'}`,
        action: `check if the rescoped version still matches what customers are asking for`,
      });
    }
  }

  // Sort by magnitude (biggest shifts first)
  flags.sort((a, b) => b.magnitude - a.magnitude);
  const top = flags.slice(0, 6);

  // 5. Theme connections — find items that share keyword themes
  const themeKeywords: Record<string, string> = {
    'security': 'security & access', 'permission': 'security & access', 'fraud': 'security & access',
    'investment': 'investment & portfolio', 'portfolio': 'investment & portfolio',
    'savings': 'savings & budgeting', 'budget': 'savings & budgeting',
    'currency': 'multi-currency & FX', 'multi': 'multi-currency & FX',
  };
  const themeItems: Record<string, DriftFlag[]> = {};
  for (const f of top) {
    for (const word of f.item.title.toLowerCase().split(/\s+/)) {
      const theme = themeKeywords[word];
      if (theme) {
        if (!themeItems[theme]) themeItems[theme] = [];
        if (!themeItems[theme].find(t => t.item.id === f.item.id)) themeItems[theme].push(f);
      }
    }
  }
  // Add theme note to last item in a multi-item theme
  for (const [theme, items] of Object.entries(themeItems)) {
    if (items.length >= 2) {
      const lastItem = items[items.length - 1];
      const otherNames = items.filter(i => i.item.id !== lastItem.item.id).map(i => shortTitle(i.item.title, 25));
      lastItem.narrative += ` Combined with ${otherNames.join(' and ')}, the ${theme} theme keeps getting louder.`;
    }
  }

  // Build text — concise: top 3 items + action line. Full list behind pill.
  let text = '';
  if (top.length === 0) {
    text = `## What shifted\n\nNothing drifted — your roadmap still matches demand. Check back in a week or after your next customer calls.`;
  } else {
    const actionable = top.filter(f => f.severity === 'critical' || f.severity === 'warning');
    const showCount = Math.min(top.length, 3);

    text = `## What shifted\n\n${top.length} things shifted. ${actionable.length > 0 ? `${actionable.length} need your attention.` : 'Minor shifts — nothing urgent.'}\n\n`;
    text += top.slice(0, showCount).map((f, i) => `${i + 1}. ${f.narrative}`).join('\n\n');

    if (top.length > showCount) {
      text += `\n\n*+${top.length - showCount} more — ask to see the full list.*`;
    }
  }

  const dataForAI5 = { driftItems: top.map(f => ({ title: f.item.title, type: f.type, revenue: f.item.estRevenue, customers: f.item.customers, trend: f.trend.direction, mentionsDelta: f.trend.mentionsDelta, narrative: f.narrative, action: f.action })) };

  // Change cards for actionable drift items
  const driftCards: React.ReactNode[] = [];
  const actionableChanges = top.filter(f => f.severity !== 'info').map(f => {
    const onRM = roadmapData.find(r => r.id === f.item.id);
    if (f.type === 'surging' && !onRM) {
      return { item: f.item.title, from: 'Not on roadmap', to: 'Add to roadmap', reason: `$${f.item.estRevenue}K ARR, ${f.item.customers} accounts, +${f.trend.mentionsDelta} mentions` };
    } else if (f.type === 'surging' && onRM) {
      return { item: f.item.title, from: onRM.priority, to: 'now', reason: `$${f.item.estRevenue}K ARR, ${f.item.customers} accounts, growing demand` };
    } else if (f.type === 'fading') {
      return { item: f.item.title, from: onRM?.priority || f.item.priority, to: 'later', reason: `${Math.abs(f.trend.mentionsDelta)} fewer mentions, declining demand` };
    } else if (f.type === 'new-signal') {
      return { item: f.item.title, from: 'Not on roadmap', to: 'Add to roadmap', reason: `$${f.item.estRevenue}K ARR, +${f.trend.mentionsDelta} mentions, emerging signal` };
    }
    return null;
  }).filter(Boolean) as { item: string; from: string; to: string; reason: string }[];

  if (actionableChanges.length > 0) {
    driftCards.push(<ChangeCard key="drift-changes" changes={actionableChanges} />);
  }

  // Context-aware pills based on top action candidates
  const surgingNotOnRoadmap = top.find(f => f.type === 'surging' && !roadmapData.find(r => r.id === f.item.id));
  const surgingUnderPrioritized = top.find(f => f.type === 'surging' && roadmapData.find(r => r.id === f.item.id) && f.item.priority !== 'now');
  const fadingOverPrioritized = top.find(f => f.type === 'fading');

  const rawPills: { label: string; key: string }[] = top.length === 0
    ? [
        { label: "Show the full backlog ranked", key: "backlog-ranked" },
        { label: "Am I betting on the right things?", key: "flow1-initial" },
      ]
    : [
        // Compound action: promote + demote if both exist
        ...(surgingUnderPrioritized && fadingOverPrioritized ? [{
          label: `Promote ${shortTitle(surgingUnderPrioritized.item.title, 15)} and demote ${shortTitle(fadingOverPrioritized.item.title, 15)}`,
          key: `apply-swap-${fadingOverPrioritized.item.id}-${surgingUnderPrioritized.item.id}`,
        }] : [
          ...(surgingUnderPrioritized ? [{ label: `Promote ${shortTitle(surgingUnderPrioritized.item.title, 20)}`, key: `reprioritize-promote-${surgingUnderPrioritized.item.id}` }] : []),
          ...(fadingOverPrioritized ? [{ label: `Move ${shortTitle(fadingOverPrioritized.item.title, 20)} down`, key: `reprioritize-demote-${fadingOverPrioritized.item.id}` }] : []),
        ]),
        ...(surgingNotOnRoadmap ? [{ label: `Add ${shortTitle(surgingNotOnRoadmap.item.title, 20)} to roadmap`, key: `reprioritize-promote-${surgingNotOnRoadmap.item.id}` }] : []),
        ...(top[0] ? [{ label: `Show full evidence for ${shortTitle(top[0].item.title, 20)}`, key: `flow2-${top[0].item.id}` }] : []),
        { label: "Rank everything by evidence", key: "flow1-initial" },
      ];

  return {
    text,
    cards: driftCards,
    textPromise: generateNarrative({ useCase: "uc5", structuredData: dataForAI5, fallbackText: text }).then(r => r.fromAI ? text + '\n\n' + r.text : text),
    loadingSteps: [
      "Comparing current vs 4 weeks ago…",
      "Detecting new signals…",
      "Checking theme momentum…",
      "Ranking by urgency…",
    ],
    pills: buildGuardedPills('debug', rawPills, {
      recommendedAction: surgingUnderPrioritized ? 'promote' : fadingOverPrioritized ? 'demote' : null,
    }),
    intentRoot: 'debug',
  };
}

/* ═══════════════════════════════════════════════════════════════
   FLOW ROUTING — matches user input to a flow response
   ═══════════════════════════════════════════════════════════════ */

function routeInputRegex(text: string): MessageContent {
  const lower = text.toLowerCase().trim();

  // UC1: Prioritize by evidence
  if (/betting|right things|q2 overview|q2 items|prioriti[sz]e.*evidence|strongest.*signal|customer signal/i.test(lower)) return buildFlow1Initial();
  if (/no evidence|zero.*evidence|no.*quotes/i.test(lower)) return buildFlow1NoEvidence();
  if (/worried|risk|concern|flag/i.test(lower)) return buildFlow1Worried();
  if (/backlog.*rank|rank.*backlog|full backlog|strongest.*ignor/i.test(lower)) return buildFlow1BacklogRanked();

  // UC2: Plan vs demand mismatch
  if (/out of sync|mismatch|where.*wrong|over.?invest|under.?invest|sync.*demand|what.*missing|am i missing/i.test(lower)) return buildUC2Mismatch();

  // UC4: Summarize changes for audience (with optional date range extraction)
  const extractDateRange = (t: string): string | undefined => {
    const m = t.match(/(?:this week|last (?:week|month|quarter)|since .+?(?:\d{4}|\d{1,2})|this month|this quarter|\d+ days?)/i);
    return m ? m[0] : undefined;
  };
  if (/summarize|summary|update.*leadership|leadership.*update|write.*leadership/i.test(lower)) return buildUC4Summary('leadership', extractDateRange(lower));
  if (/update.*eng|eng.*update|write.*eng|what.*changed.*eng/i.test(lower)) return buildUC4Summary('engineering', extractDateRange(lower));
  if (/update.*cs|cs.*update|tell.*customer|customer success/i.test(lower)) return buildUC4Summary('cs', extractDateRange(lower));
  if (/what changed|what.*different|changes.*since/i.test(lower)) return buildUC4Summary('leadership', extractDateRange(lower));

  // UC5: Drift detection
  if (/drift|hasn.?t.*looked|needs attention|stale|anything.*know|shifted|what.*changed.*since.*last/i.test(lower)) return buildUC5Drift();

  // Flow 3 triggers — "cut X for Y" / "swap X for Y" / "replace X with Y"
  const cutMatch = lower.match(/cut(?:ting)?\s+(.+?)\s+(?:for|to make room for|and add|replace with)\s+(.+)/i)
    || lower.match(/swap\s+(.+?)\s+(?:for|with)\s+(.+)/i)
    || lower.match(/replace\s+(.+?)\s+with\s+(.+)/i);
  if (cutMatch) {
    const cutName = cutMatch[1].trim();
    const addName = cutMatch[2].trim();
    const allItemsF3 = [...roadmapData, ...sampleData];
    const cutItem = allItemsF3.find(r => r.title.toLowerCase().includes(cutName));
    const addItem = allItemsF3.find(r => r.title.toLowerCase().includes(addName));
    if (cutItem && addItem) return buildFlow3(cutItem.id, addItem.id);
  }

  // Flow 3 — standalone cut/add without a pair
  if (/we\s+need\s+to\s+cut|cut\s+one|which.*cut|least.*impact/i.test(lower)) return buildAltCut();
  if (/add\s+.+\s+to\s+q2|add.*to.*roadmap|leadership.*add|leadership.*wants|what do i trade/i.test(lower)) {
    // Try to find the item they want to add
    const allItemsAdd = [...roadmapData, ...sampleData];
    // Match patterns like "add X to Q2", "add X to roadmap", "leadership wants me to add X"
    const addMatch = lower.match(/add\s+(.+?)\s+to/i) || lower.match(/add\s+(.+?)[\.\?]?\s*$/i);
    if (addMatch) {
      const searchTerm = addMatch[1].trim().replace(/to q2|to roadmap|to the roadmap/i, '').trim();
      const addItem = allItemsAdd.find(r => {
        const keywords = searchTerm.split(/\s+/).filter(w => w.length >= 4);
        return keywords.filter(w => r.title.toLowerCase().includes(w)).length >= 1;
      });
      if (addItem) return buildAddToQ2(addItem.id);
    }
    return buildAltCut();
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

  // Promote/bump — check BEFORE Flow 2 item matching so "promote X" doesn't trigger a deep dive
  if (/bump|promote|demote|prioriti[sz]e|move.*roadmap|reprioritize/i.test(lower)) {
    const isDemote = /demote/i.test(lower);
    const action = isDemote ? 'demote' as const : 'promote' as const;
    const allItemsForPromote = [...roadmapData, ...sampleData];
    const mentioned = allItemsForPromote.find(item => {
      const keywords = item.title.toLowerCase().split(/\s+/).filter(w => w.length >= 4);
      return keywords.filter(w => lower.includes(w)).length >= 2;
    });
    if (mentioned) {
      if (action === 'promote' && mentioned.priority === 'now') {
        return { text: `**${mentioned.title}** is already at the highest priority (now). No change needed.`, pills: [{ label: "Has anything drifted?", key: "uc5-drift" }] };
      }
      if (action === 'demote' && mentioned.priority === 'icebox') {
        return { text: `**${mentioned.title}** is already at the lowest priority (icebox). No change needed.`, pills: [{ label: "Has anything drifted?", key: "uc5-drift" }] };
      }
      return buildReprioritize(mentioned.id, action);
    }
    // No specific item — find the best candidate
    const scored = allItemsForPromote
      .filter(item => item.priority !== 'now')
      .map(item => ({ item, score: evidenceScore(item) }))
      .sort((a, b) => b.score - a.score);
    if (scored[0]) {
      return buildReprioritize(scored[0].item.id, 'promote');
    }
    return {
      text: "All your high-evidence items are already at the highest priority. Nothing to promote right now.",
      pills: [
        { label: "Am I betting on the right things?", key: "flow1-initial" },
        { label: "Has anything drifted?", key: "uc5-drift" },
      ],
    };
  }

  // Flow 2 triggers — item-specific questions (runs after promote check)
  const allItems = [...roadmapData, ...sampleData];
  for (const item of allItems) {
    const keywords = item.title.toLowerCase().split(/\s+/).filter(w => w.length >= 4);
    const matchCount = keywords.filter(w => lower.includes(w)).length;
    if (matchCount >= 2) return buildFlow2(item.id);
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

  // Fallback — try to be helpful
  return {
    text: "I didn't quite catch that. Here are some things I can help with:\n\n• *Prioritize* — \"Rank my backlog by evidence\" or \"Am I betting on the right things?\"\n• *Validate* — \"Where is my roadmap out of sync with demand?\"\n• *Trade off* — \"What if I cut [item A] for [item B]?\"\n• *Summarize* — \"Write a leadership update\" or \"What should CS tell customers?\"\n• *Check drift* — \"Has anything drifted?\" or \"What needs attention?\"",
    pills: [
      { label: "Am I betting on the right things?", key: "flow1-initial" },
      { label: "Where is my roadmap out of sync?", key: "uc2-mismatch" },
      { label: "Has anything drifted?", key: "uc5-drift" },
    ],
  };
}

/* ─── Map AI-classified intent to builder ─── */
function mapIntentToBuilder(classified: ClassifiedIntent): MessageContent {
  const { intent, itemName, itemName2, audience, action, dateRange } = classified;

  // Strict item matching — requires real keyword overlap, not loose substring
  const findItem = (name?: string) => {
    if (!name) return null;
    const lower = name.toLowerCase().trim();
    const all = [...roadmapData, ...sampleData];

    // Skip very short or obviously non-item text
    if (lower.length < 4) return null;

    // 1. Exact title match
    const exact = all.find(r => r.title.toLowerCase() === lower);
    if (exact) return exact;

    // 2. Title contains the full search term (only for terms 8+ chars to avoid false matches)
    if (lower.length >= 8) {
      const contains = all.find(r => r.title.toLowerCase().includes(lower));
      if (contains) return contains;
    }

    // 3. Keyword overlap — extract meaningful words and require matches
    const searchWords = lower.replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length >= 4);
    if (searchWords.length === 0) return null;

    let bestMatch: SpaceRow | null = null;
    let bestCount = 0;
    for (const item of all) {
      const titleLower = item.title.toLowerCase();
      const matchCount = searchWords.filter(w => titleLower.includes(w)).length;
      // Need at least 2 keyword matches, or 1 if the word is very specific (7+ chars)
      if (matchCount >= 2 && matchCount > bestCount) {
        bestMatch = item;
        bestCount = matchCount;
      }
      if (matchCount === 1 && searchWords.length === 1 && searchWords[0].length >= 7 && bestCount === 0) {
        bestMatch = item;
        bestCount = matchCount;
      }
    }
    return bestMatch;
  };

  const item1 = findItem(itemName);
  const item2 = findItem(itemName2);

  switch (intent) {
    case 'rank':
      // If question seems backlog-specific, use backlog ranker
      if (itemName?.toLowerCase().includes('backlog')) return buildFlow1BacklogRanked();
      return buildFlow1Initial();
    case 'mismatch':
      return buildUC2Mismatch();
    case 'add-to-q2':
      if (item1) return buildAddToQ2(item1.id);
      return buildAltCut();
    case 'swap':
    case 'trade-off':
      if (item1 && item2) return buildFlow3(item1.id, item2.id);
      if (item1) return buildAddToQ2(item1.id);
      return buildAltCut();
    case 'cut':
      return buildAltCut();
    case 'summarize':
      return buildUC4Summary((audience as 'leadership' | 'engineering' | 'cs') || 'leadership', dateRange);
    case 'drift':
      return buildUC5Drift();
    case 'deep-dive':
      if (item1) return buildFlow2(item1.id);
      return buildFlow1Initial();
    case 'promote':
      if (item1) return buildReprioritize(item1.id, 'promote');
      // No specific item — find best candidate
      const bestPromote = [...roadmapData, ...sampleData]
        .filter(i => i.priority !== 'now')
        .map(i => ({ item: i, score: evidenceScore(i) }))
        .sort((a, b) => b.score - a.score)[0];
      return bestPromote ? buildReprioritize(bestPromote.item.id, 'promote') : buildFlow1Initial();
    case 'demote':
      if (item1) return buildReprioritize(item1.id, 'demote');
      return buildFlow1Initial();
    case 'no-evidence':
      return buildFlow1NoEvidence();
    case 'dependencies':
      return routeInputRegex('dependencies');
    case 'theme':
      return buildUC1Theme();
    default:
      return routeInputRegex(classified.intent);
  }
}

/* ─── Async intent routing (AI first, regex fallback) ─── */
async function routeInputAsync(text: string): Promise<MessageContent> {
  // Build item lists for the classifier
  const roadmapTitles = roadmapData.filter(r => r.status !== 'done').map(r => ({ title: r.title, priority: r.priority }));
  const backlogTitles = sampleData.filter(s => !roadmapData.find(r => r.title === s.title)).map(s => ({ title: s.title, priority: s.priority }));

  // Try AI classifier
  const classified = await classifyIntent(text, roadmapTitles, backlogTitles);
  if (classified) {
    return mapIntentToBuilder(classified);
  }

  // Fallback to regex
  return routeInputRegex(text);
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
    case 'flow2-top-backlog': {
      const top = sampleData.filter(s => !roadmapData.find(r => r.title === s.title)).sort((a, b) => b.estRevenue - a.estRevenue)[0];
      return top ? buildFlow2(top.id) : routeInputRegex('backlog');
    }
    // UC2
    case 'uc2-mismatch': return buildUC2Mismatch();
    case 'uc2-action': {
      // Find the top under-invested item and suggest promoting it
      const allScored = [...roadmapData.filter(r => r.status !== 'done'), ...sampleData]
        .map(item => ({ item, score: evidenceScore(item), priority: priorityNum(item.priority) }))
        .sort((a, b) => b.score - a.score);
      const underInvested = allScored.find(s => s.priority <= 2 && s.score > allScored[Math.floor(allScored.length * 0.25)]?.score);
      if (underInvested) return buildReprioritize(underInvested.item.id, 'promote');
      return buildFlow1Initial();
    }
    // UC4
    case 'uc4-leadership': return buildUC4Summary('leadership');
    case 'uc4-engineering': return buildUC4Summary('engineering');
    case 'uc4-cs': return buildUC4Summary('cs');
    case 'uc4-biggest': {
      const recent = itemHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
      return recent ? buildFlow2(recent.itemId) : buildUC4Summary('leadership');
    }
    // UC5
    case 'uc5-drift': return buildUC5Drift();
    case 'uc1-theme': return buildUC1Theme();
    default: {
      // Handle dynamic theme keys
      if (key.startsWith('uc1-theme-')) {
        const themeName = key.slice('uc1-theme-'.length);
        return buildUC1Theme(themeName);
      }
      // Reprioritize actions
      const promoteMatch = key.match(/^reprioritize-promote-(.+)$/);
      if (promoteMatch) return buildReprioritize(promoteMatch[1], 'promote');
      const demoteMatch = key.match(/^reprioritize-demote-(.+)$/);
      if (demoteMatch) return buildReprioritize(demoteMatch[1], 'demote');
      const applyMatch = key.match(/^apply-reprioritize-(.+?)-(.+)$/);
      if (applyMatch) return buildApplyConfirmation(applyMatch[1], applyMatch[2]);
      const swapMatch = key.match(/^apply-swap-(.+?)-(.+)$/);
      if (swapMatch) return buildApplySwap(swapMatch[1], swapMatch[2]);
      if (key === 'copy-summary') return { text: "Copied to clipboard. You can paste it into Slack, email, or a doc." };
      return routeInputRegex(key);
    }
  }
}

/* ─── Render text with bold → bold + citation chip ─── */
function renderTextWithLinks(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Empty line = spacing
    if (trimmed === '') {
      elements.push(<div key={`sp-${i}`} style={{ height: 10 }} />);
      continue;
    }

    // Section header: ─── Title ───
    const sectionMatch = trimmed.match(/^───\s*(.+?)\s*───+$/);
    if (sectionMatch) {
      elements.push(
        <div key={`sec-${i}`} style={{ fontSize: 11, fontWeight: 700, color: "#9096A4", textTransform: "uppercase", letterSpacing: "0.8px", marginTop: 16, marginBottom: 6 }}>
          {sectionMatch[1]}
        </div>
      );
      continue;
    }

    // Main header: ## Title
    if (trimmed.startsWith('## ')) {
      elements.push(
        <div key={`h-${i}`} style={{ fontSize: 16, fontWeight: 700, color: "#222428", marginBottom: 6, lineHeight: 1.3 }}>
          {trimmed.slice(3)}
        </div>
      );
      continue;
    }

    // Data/detail line: starts with 3+ spaces (indented under a numbered item)
    if (line.startsWith('   ') && !trimmed.startsWith('•') && !trimmed.startsWith('-')) {
      elements.push(
        <div key={`d-${i}`} style={{ fontSize: 13, color: "#6f7489", lineHeight: '150%', letterSpacing: 0, paddingLeft: 28, fontFamily: "'Open Sans', sans-serif" }}>
          {renderInlineFormatting(trimmed)}
        </div>
      );
      continue;
    }

    // Bullet: • text
    if (trimmed.startsWith('• ') || trimmed.startsWith('- ')) {
      const bulletText = trimmed.slice(2);
      elements.push(
        <div key={`b-${i}`} style={{ display: "flex", gap: 8, fontSize: 14, color: "#222428", lineHeight: '150%', letterSpacing: 0, paddingLeft: 4, fontFamily: "'Open Sans', sans-serif" }}>
          <span style={{ color: "#9096A4", flexShrink: 0 }}>•</span>
          <span>{renderInlineFormatting(bulletText)}</span>
        </div>
      );
      continue;
    }

    // Numbered list: 1. text
    const numMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
    if (numMatch) {
      elements.push(
        <div key={`n-${i}`} style={{ display: "flex", gap: 8, fontSize: 14, color: "#222428", lineHeight: '150%', letterSpacing: 0, paddingLeft: 4, fontFamily: "'Open Sans', sans-serif" }}>
          <span style={{ color: "#9096A4", flexShrink: 0, minWidth: 18, fontVariantNumeric: "tabular-nums" }}>{numMatch[1]}.</span>
          <span style={{ fontWeight: 500 }}>{renderInlineFormatting(numMatch[2])}</span>
        </div>
      );
      continue;
    }

    // Regular paragraph text — Miro DS body: 14px, 150% line-height, 0 letter-spacing
    elements.push(
      <div key={`t-${i}`} style={{ fontSize: 14, color: "#222428", lineHeight: '150%', letterSpacing: 0, fontFamily: "'Open Sans', sans-serif" }}>
        {renderInlineFormatting(trimmed)}
      </div>
    );
  }

  return elements;
}

/* ─── Inline source chip (replaces LinkIcon) ─── */
function SourceChip({ label }: { label?: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        marginLeft: 4,
        padding: "2px 8px",
        fontSize: 12,
        fontWeight: 600,
        color: "#6f7489",
        background: "#F1F2F5",
        borderRadius: 4,
        verticalAlign: "middle",
        cursor: "pointer",
        lineHeight: 1.4,
        whiteSpace: "nowrap",
      }}
    >
      <IconTable css={{ width: 12, height: 12, color: '#6f7489' } as any} />
      {label || "Roadmap table"}
    </span>
  );
}

/* ─── Sources section (collapsible, shown after response) ─── */
function SourcesSection() {
  const [expanded, setExpanded] = useState(false);
  const sources = [
    { icon: <IconTable css={{ width: 14, height: 14, color: '#6f7489' } as any} />, name: "Roadmap table" },
    { icon: <IconTable css={{ width: 14, height: 14, color: '#6f7489' } as any} />, name: "Backlog table" },
    { icon: <IconInsights css={{ width: 14, height: 14, color: '#6f7489' } as any} />, name: "Insights evidence" },
    { icon: <IconChatLinesTwo css={{ width: 14, height: 14, color: '#6f7489' } as any} />, name: "Customer quotes" },
  ];

  return (
    <div style={{ marginTop: 12 }}>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#6f7489" }}
      >
        Sources ({sources.length})
        <IconChevronDown size="small" color="icon-secondary" css={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 200ms', width: 14, height: 14 } as any} />
      </div>
      {expanded && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
          {sources.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#222428", padding: "6px 0" }}>
              {s.icon}
              {s.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Legacy alias for LinkIcon references ─── */
function LinkIcon() {
  return <SourceChip />;
}

function renderInlineFormatting(text: string): React.ReactNode {
  // First pass: extract color tokens {{green:text}} / {{red:text}}
  const colorSplit = text.split(/(\{\{(?:green|red):[^}]+\}\})/g);
  const colorParsed = colorSplit.map((segment, si) => {
    const colorMatch = segment.match(/^\{\{(green|red):(.+)\}\}$/);
    if (colorMatch) {
      const color = colorMatch[1] === 'green' ? '#38A169' : '#E53E3E';
      return <span key={`c${si}`} style={{ color, fontWeight: 600 }}>{colorMatch[2]}</span>;
    }
    // Second pass: parse bold/italic within non-color segments
    const parts = segment.split(/(\*\*.*?\*\*|\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const inner = part.slice(2, -2);
        const isLabel = inner.split(/\s+/).length <= 2 || inner.endsWith(':');
        if (isLabel) return <span key={`${si}-${i}`} style={{ fontWeight: 700 }}>{inner}</span>;
        return <span key={`${si}-${i}`}><span style={{ fontWeight: 700 }}>{inner}</span><LinkIcon /></span>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <span key={`${si}-${i}`} style={{ color: "#6f7489" }}>{part.slice(1, -1)}</span>;
      }
      return <span key={`${si}-${i}`}>{part}</span>;
    });
  });
  return colorParsed;
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

function PanelBody({ activePage, focusItemId, contextUserMessage, onApplyReprioritize, onApplySwap }: { activePage?: string; focusItemId?: string; contextUserMessage?: string; onApplyReprioritize?: (itemId: string, newPriority: string, reason: string) => void; onApplySwap?: (cutId: string, addId: string, reason: string) => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeLoadingSteps, setActiveLoadingSteps] = useState<string[]>([]);
  const [streamedSet] = useState(() => new Set<number>());
  const [selectedFollowUp, setSelectedFollowUp] = useState<string | null>(null);
  const [activePills, setActivePills] = useState<{ label: string; key: string }[]>([]);
  const [pillsDismissed, setPillsDismissed] = useState(false);
  const [streamCompleteCounter, forceUpdate] = useState(0);
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

  // Auto-trigger from floating prompt bar (contextUserMessage)
  const contextTriggeredRef = useRef<string | null>(null);
  useEffect(() => {
    if (contextUserMessage && contextUserMessage !== contextTriggeredRef.current) {
      contextTriggeredRef.current = contextUserMessage;
      handleChatSend(contextUserMessage);
    }
  }, [contextUserMessage]);

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
      userScrolledUpRef.current = false;
    }
    // Update active pills from latest AI message — only after streaming completes
    const lastAi = [...messages].reverse().find(m => m.role === 'ai');
    if (lastAi?.pills && lastAi.pills.length > 0 && streamedSet.has(lastAi.id)) {
      setActivePills(lastAi.pills);
      setPillsDismissed(false);
    }
    prevMsgCount.current = messages.length;
    scrollToBottom();
  }, [messages.length, isTyping, isLoading, streamCompleteCounter]);

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
    setSelectedFollowUp(null);
    const userId = ++msgIdRef.current;
    setMessages(prev => [...prev, { id: userId, role: 'user', text: userText }]);

    // Start resolving AI text in background (if promise exists)
    let resolvedText = content.text;
    const aiTextPromise = content.textPromise
      ? content.textPromise.then(t => { resolvedText = t; }).catch(() => {})
      : Promise.resolve();

    const showMessage = () => {
      setIsTyping(false);
      const aiId = ++msgIdRef.current;
      setMessages(prev => [...prev, {
        id: aiId,
        role: 'ai',
        text: resolvedText,
        cards: content.cards,
        pills: content.pills,
        loadingSteps: content.loadingSteps,
      }]);
      scrollToBottom();
    };

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
        // Wait for AI text to resolve before showing message
        aiTextPromise.then(() => setTimeout(showMessage, 1000));
      }, loadDuration);
    } else {
      setIsTyping(true);
      scrollToBottom();
      aiTextPromise.then(() => setTimeout(showMessage, 1200));
    }
  };

  const handlePillClick = (pill: { label: string; key: string }) => {
    // Copy to clipboard
    if (pill.key === 'copy-summary') {
      const lastAi = [...messages].reverse().find(m => m.role === 'ai');
      if (lastAi) {
        // Strip markdown formatting for clean paste into Slack/email
        const clean = lastAi.text
          .replace(/^## /gm, '')              // strip ## headers
          .replace(/^─+.*─+$/gm, '')          // strip ─── section dividers
          .replace(/\*\*/g, '')               // strip bold markers
          .replace(/\*/g, '')                 // strip italic markers
          .replace(/\n{3,}/g, '\n\n')         // collapse excess newlines
          .trim();
        navigator.clipboard?.writeText(clean);
      }
      addAiResponse(routePillKey(pill.key), pill.label);
      return;
    }
    // Apply reprioritize — actually mutate state
    const applyReprioritizeMatch = pill.key.match(/^apply-reprioritize-(.+?)-(.+)$/);
    if (applyReprioritizeMatch) {
      const [, itemId, newPriority] = applyReprioritizeMatch;
      const item = getItem(itemId);
      const reason = `Evidence-based reprioritization — $${item?.estRevenue || 0}K ARR, ${item?.customers || 0} customers, demand ${getTrend(itemId)?.direction || 'stable'}`;
      try { onApplyReprioritize?.(itemId, newPriority, reason); } catch { /* mutation failed silently */ }
      addAiResponse(routePillKey(pill.key), pill.label);
      return;
    }
    // Apply swap — actually mutate both items
    const applySwapMatch = pill.key.match(/^apply-swap-(.+?)-(.+)$/);
    if (applySwapMatch) {
      const [, cutId, addId] = applySwapMatch;
      const cutItem = getItem(cutId);
      const addItem = getItem(addId);
      const reason = `Trade-off swap — cut ${cutItem?.title || cutId} for ${addItem?.title || addId}`;
      try { onApplySwap?.(cutId, addId, reason); } catch { /* mutation failed silently */ }
      addAiResponse(routePillKey(pill.key), pill.label);
      return;
    }
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

  const handleChatSend = async (text: string) => {
    // Show user bubble + loading immediately
    const userId = ++msgIdRef.current;
    setMessages(prev => [...prev, { id: userId, role: 'user', text }]);
    setSelectedFollowUp(null);
    setIsLoading(true);
    setActiveLoadingSteps(["Understanding your question…", "Analyzing roadmap data…"]);
    scrollToBottom();

    // Classify intent via AI (falls back to regex)
    let content: MessageContent;
    try {
      content = await routeInputAsync(text);
    } catch {
      content = routeInputRegex(text);
    }

    // Now show the response with its own loading steps (if any)
    setIsLoading(false);
    setActiveLoadingSteps([]);
    if (content.loadingSteps && content.loadingSteps.length > 0) {
      setIsLoading(true);
      setActiveLoadingSteps(content.loadingSteps);
      const loadDuration = content.loadingSteps.length * 600 + 1500;
      setTimeout(() => {
        setIsLoading(false);
        setActiveLoadingSteps([]);
        setIsTyping(true);
        scrollToBottom();
        // Resolve AI text promise if exists
        let resolvedText = content.text;
        const textPromise = content.textPromise
          ? content.textPromise.then(t => { resolvedText = t; }).catch(() => {})
          : Promise.resolve();
        textPromise.then(() => setTimeout(() => {
          setIsTyping(false);
          const aiId = ++msgIdRef.current;
          setMessages(prev => [...prev, { id: aiId, role: 'ai', text: resolvedText, cards: content.cards, pills: content.pills, loadingSteps: content.loadingSteps }]);
          scrollToBottom();
        }, 1000));
      }, loadDuration);
    } else {
      setIsTyping(true);
      scrollToBottom();
      let resolvedText = content.text;
      const textPromise = content.textPromise
        ? content.textPromise.then(t => { resolvedText = t; }).catch(() => {})
        : Promise.resolve();
      textPromise.then(() => setTimeout(() => {
        setIsTyping(false);
        const aiId = ++msgIdRef.current;
        setMessages(prev => [...prev, { id: aiId, role: 'ai', text: resolvedText, cards: content.cards, pills: content.pills, loadingSteps: content.loadingSteps }]);
        scrollToBottom();
      }, 1200));
    }
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
          background: "#FFFFFF",
          minWidth: 0,
        }}
      >
        {messages.length > 0 && <div style={{ flex: 1 }} />}

        <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: messages.length > 0 ? "0 24px 24px" : "0", flex: messages.length === 0 ? 1 : undefined }}>

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

            const pillSets: Record<string, { label: string; key: string }[]> = {
              backlog: [
                { label: "Rank my backlog by customer evidence", key: "backlog-ranked" },
                { label: "What should move to the roadmap?", key: "uc2-mismatch" },
                { label: "Which items have the strongest signal?", key: "flow1-initial" },
              ],
              overview: [
                { label: "Summarize Q2 changes for leadership", key: "uc4-leadership" },
                { label: "What needs my attention?", key: "uc5-drift" },
                { label: "Am I betting on the right things?", key: "flow1-initial" },
              ],
              roadmap: [
                { label: "Am I betting on the right things for Q2?", key: "flow1-initial" },
                { label: "Where is my roadmap out of sync?", key: "uc2-mismatch" },
                { label: "Has anything drifted?", key: "uc5-drift" },
              ],
            };
            const pills = pillSets[activePage || 'roadmap'] || pillSets.roadmap;

            return (
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "stretch", height: "100%", minHeight: 0 }}>

                {/* Centered "For you" label */}
                <div style={{ textAlign: "center", paddingBottom: 12 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#42413A" }}>For you</span>
                </div>

                {/* Suggestion cards */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "0 16px" }}>
                  {pills.map((pill, i) => (
                    <div
                      key={pill.key}
                      onClick={() => handlePillClick(pill)}
                      onMouseEnter={e => (e.currentTarget.style.boxShadow = "0px 2px 8px rgba(34,36,40,0.06)")}
                      onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
                      style={{
                        background: "#FAFAFC",
                        border: "1px solid #F4F4F1",
                        borderRadius: 12,
                        padding: "20px",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                        transition: "box-shadow 150ms",
                      }}
                    >
                      <span style={{ fontSize: 20, fontWeight: 400, color: "#222428", lineHeight: 1.35, textAlign: "center", fontStyle: i === 2 ? 'italic' : 'normal', fontFamily: "'Apris', serif", letterSpacing: '0.02em', maxWidth: "80%", margin: "0 auto" }}>
                        {pill.label}
                      </span>
                      <div style={{ display: "flex", justifyContent: "flex-end", width: "100%", color: "#191812" }}>
                        <IconArrowRight size="small" />
                      </div>
                    </div>
                  ))}
                </div>

              </div>
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
                {/* Completed loading steps — collapsed, expandable */}
                {msg.loadingSteps && msg.loadingSteps.length > 0 && (
                  <CompletedSteps steps={msg.loadingSteps} />
                )}
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

                {/* Sources section — after cards, before pills */}
                {(!shouldStream || streamedSet.has(msg.id)) && isLastAiMessage && (
                  <SourcesSection />
                )}

                {/* Pills now render above the prompt bar, not here */}
              </React.Fragment>
            );
          })}

          {/* Analysing indicator with steps */}
          {isLoading && <AnalysingIndicator steps={activeLoadingSteps} />}

          {/* Typing dots removed — loading steps are sufficient */}
        </div>
      </div>
      {/* Chip pills above prompt bar — fixed bottom zone */}
      {activePills.length > 0 && !pillsDismissed && !isLoading && !isTyping && (
        <div style={{ flexShrink: 0, padding: "8px 16px 4px", position: "relative", animation: "fadeSlideIn 300ms ease-out both" }}>
          {/* Dismiss X — top right */}
          <button
            onClick={() => setPillsDismissed(true)}
            style={{
              position: "absolute",
              top: 8,
              right: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 24,
              height: 24,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#656B81",
              padding: 0,
            }}
          >
            <IconCross size="small" />
          </button>
          {/* Pill chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, paddingRight: 36 }}>
            {activePills.map(pill => (
              <button
                key={pill.key}
                onClick={() => { setPillsDismissed(true); handlePillClick(pill); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 12px",
                  maxWidth: 260,
                  height: 37,
                  background: "#FFFFFF",
                  border: "1px solid #E7E7E5",
                  boxShadow: "0px 2px 4px rgba(34, 36, 40, 0.08)",
                  borderRadius: 16,
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 400,
                  color: "#222428",
                  fontFamily: "'Open Sans', sans-serif",
                  lineHeight: 1.3,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  transition: "box-shadow 150ms, border-color 150ms",
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0px 4px 8px rgba(34,36,40,0.12)"; e.currentTarget.style.borderColor = "#D0D0CE"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0px 2px 4px rgba(34,36,40,0.08)"; e.currentTarget.style.borderColor = "#E7E7E5"; }}
              >
                <span style={{ color: "#656B81", flexShrink: 0, fontSize: 14 }}>→</span>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{pill.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      <PanelInput onSend={handleChatSend} />
    </>
  );
}

/* ─── Input area ─── */
export function PanelInput({ onSend }: { onSend: (text: string) => void }) {
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
    <div style={{ flexShrink: 0, padding: "8px 16px 16px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "#F4F4F1",
          borderRadius: 16,
          height: 48,
          padding: "0 14px 0 18px",
        }}
      >
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = Math.min(e.target.scrollHeight, 80) + "px";
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="What shall we do next?"
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            resize: "none",
            fontSize: 14,
            fontWeight: 400,
            color: "#222428",
            lineHeight: 1.4,
            fontFamily: "var(--font-noto)",
            background: "transparent",
            minHeight: 20,
            maxHeight: 80,
            overflow: "auto",
            '::placeholder': { color: '#6F7489' },
          } as any}
          rows={1}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          {/* Mic icon */}
          <svg width="16" height="16" viewBox="4 1 16 22" fill="none" style={{ cursor: "pointer", flexShrink: 0 }}>
            <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" stroke="#222428" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19 10a7 7 0 0 1-14 0M12 17v4M9 21h6" stroke="#222428" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {/* AI icon */}
          {hasText ? (
            <div
              onClick={handleSend}
              style={{
                width: 32,
                height: 32,
                borderRadius: 12,
                background: "#222428",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <IconArrowUp size="small" css={{ color: '#FFFFFF' }} />
            </div>
          ) : (
            <img src="/icon-voice-llm.png" width={26} height={26} alt="AI" style={{ cursor: "pointer" }} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-view: Related Evidence ─── */
function RelatedEvidenceView({ itemLabel, onBack }: { itemLabel: string; onBack: () => void }) {
  const allItems = [...roadmapData, ...sampleData];
  const item = allItems.find(r => {
    const keywords = (itemLabel || '').toLowerCase().split(/\s+/).filter(w => w.length > 3);
    return keywords.filter(w => r.title.toLowerCase().includes(w)).length >= 1;
  });
  const quotes = item ? (customerQuotes[item.id] || []) : [];

  const cardStyles: { icon: string; bg: string; stars?: number }[] = [
    { icon: '⚑', bg: '#EFE9FF', stars: undefined },
    { icon: '⚑', bg: '#FFF0E0', stars: 2 },
    { icon: '♡', bg: '#EAFAEA', stars: undefined },
    { icon: '⚑', bg: '#FFF0E0', stars: 2 },
  ];

  const mockCards = [
    { text: `Mobile navigation issues are creating friction in the user experience, making it difficult for users to find key features and complete task efficiently, leading t...`, author: "John Doe, CPO" },
    { text: `"The app successfully performs the intended actions, but the overall experience feels slow and unresponsive. Each tap is followed by a noticeabl..."`, author: "John Doe, CPO" },
    { text: `I'm really impressed with how well this works. The system automatically categorizes my transactions in real time and does it very accurately. It makes trackin...`, author: "John Doe, CPO" },
    { text: `"The app successfully performs the intended actions, but the overall experience feels slow and unresponsive. Each tap is followed by a noticeabl..."`, author: "John Doe, CPO" },
  ];

  const cards = quotes.length > 0
    ? quotes.map((q, i) => ({ text: q.quote, author: `${q.company}, ${q.role}`, style: cardStyles[i % cardStyles.length] }))
    : mockCards.map((m, i) => ({ text: m.text, author: m.author, style: cardStyles[i % cardStyles.length] }));

  return (
    <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
      {/* Back nav */}
      <div
        onClick={onBack}
        style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 24px", cursor: "pointer" }}
      >
        <IconArrowLeft size="small" color="icon-secondary" />
        <span style={{ fontSize: 14, fontWeight: 500, color: "#4262FF" }}>Related evidence</span>
      </div>

      {/* Cards */}
      <div style={{ padding: "0 16px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
        {cards.map((card, i) => (
          <div key={i} style={{ background: card.style.bg, borderRadius: 16, padding: "16px 20px" }}>
            {/* Top row: icon + actions */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 18, lineHeight: 1 }}>{card.style.icon}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 16, color: "#6f7489", cursor: "pointer", lineHeight: 1 }}>⋮</span>
                <span style={{ fontSize: 14, color: "#6f7489", cursor: "pointer", lineHeight: 1 }}>✕</span>
              </div>
            </div>
            {/* Stars (if applicable) */}
            {card.style.stars !== undefined && (
              <div style={{ marginBottom: 8, fontSize: 13, letterSpacing: 2 }}>
                {'★'.repeat(card.style.stars)}{'☆'.repeat(5 - card.style.stars)}
              </div>
            )}
            {/* Text */}
            <div style={{ fontSize: 14, color: "#222428", lineHeight: 1.6, marginBottom: 6 }}>
              {card.text.length > 150 ? card.text.slice(0, 150) + '...' : card.text}
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#222428", textDecoration: "underline", cursor: "pointer", marginBottom: 8 }}>
              Show more.
            </div>
            {/* Author */}
            <div style={{ fontSize: 13, color: "#6f7489" }}>{card.author}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Sub-view: View Details (Feedback detail) ─── */
function ViewDetailsView({ itemLabel, onBack }: { itemLabel: string; onBack: () => void }) {
  const allItems = [...roadmapData, ...sampleData];
  const item = allItems.find(r => {
    const keywords = (itemLabel || '').toLowerCase().split(/\s+/).filter(w => w.length > 3);
    return keywords.filter(w => r.title.toLowerCase().includes(w)).length >= 1;
  });
  const quotes = item ? (customerQuotes[item.id] || []) : [];
  const firstQuote = quotes[0];
  const personName = firstQuote?.role?.split(',')[0]?.trim() || 'John Doe';
  const personTitle = firstQuote?.role?.split(',')[1]?.trim() || 'CPO';
  const company = firstQuote?.company || item?.companies?.[0] || 'Insights';

  return (
    <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
      {/* Back nav */}
      <div
        onClick={onBack}
        style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 24px", cursor: "pointer" }}
      >
        <IconArrowLeft size="small" color="icon-secondary" />
        <span style={{ fontSize: 14, fontWeight: 500, color: "#4262FF" }}>Feedback</span>
      </div>

      <div style={{ padding: "0 24px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Person header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>{personName[0]}</span>
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#222428" }}>{personName}</div>
              <div style={{ fontSize: 13, color: "#38A169" }}>{personTitle}</div>
            </div>
          </div>
          <IconChevronDown size="small" color="icon-secondary" />
        </div>

        {/* Metadata rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, color: "#6f7489" }}>Source</span>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: "#F1F2F5", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <IconInsights size="small" color="icon-secondary" />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, color: "#6f7489" }}>Company</span>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: "#4262FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>{company[0]}</span>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, color: "#6f7489" }}>Participants</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#D69E2E", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>J</span>
              </div>
              <span style={{ fontSize: 13, color: "#222428" }}>James Watson</span>
              <span style={{ fontSize: 12, color: "#6f7489", background: "#F1F2F5", borderRadius: 4, padding: "1px 6px" }}>+2</span>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, color: "#6f7489" }}>Feedback date</span>
            <span style={{ fontSize: 14, fontWeight: 500, color: "#222428" }}>Aug 14</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, color: "#6f7489" }}>Feedback type</span>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: "#222428" }}>User request</span>
              <IconInsights size="small" color="icon-secondary" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "10px 12px", display: "flex", alignItems: "center", gap: 8, border: "1px solid #E9EAEF" }}>
          <span style={{ fontSize: 14, color: "#AEB2C0" }}>🔍</span>
          <span style={{ fontSize: 14, color: "#AEB2C0" }}>Search keywords...</span>
        </div>

        {/* Transcript */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Highlighted quote */}
          {firstQuote && (
            <div style={{ background: "#EFE9FF", borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#222428" }}>{personName}</span>
                  <span style={{ fontSize: 12, color: "#6f7489" }}>00:01</span>
                </div>
                <span style={{ fontSize: 14, color: "#6f7489", cursor: "pointer" }}>⎘</span>
              </div>
              <div style={{ fontSize: 14, color: "#222428", lineHeight: 1.6 }}>"{firstQuote.quote}" — {personTitle}, {company}</div>
            </div>
          )}

          {/* Additional transcript entries */}
          {[
            { speaker: "Dave Gertner", time: "00:05", text: "I spent ten minutes this morning just trying to remember which sub-account our client project lives in." },
            { speaker: personName, time: "00:05", text: "Oh my god, same. I always feel like I'm in the wrong place." },
            { speaker: "David Gertner", time: "00:05", text: "Yeah. I'm not sure." },
            { speaker: personName, time: "00:05", text: "We have a. In person. I kind of feel like I recognize your face. Maybe from slack maybe." },
            { speaker: "David Gertner", time: "00:05", text: "Yeah. I'm not sure." },
          ].map((entry, i) => (
            <div key={i}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 2 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#222428" }}>{entry.speaker}</span>
                <span style={{ fontSize: 12, fontStyle: "italic", color: "#6f7489" }}>{entry.time}</span>
              </div>
              <div style={{ fontSize: 14, color: "#222428", lineHeight: 1.6 }}>{entry.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Main export ─── */
export default function AiPanelSolutionReview({ onClose, activePage, focusItemId, contextUserMessage, onApplyReprioritize, onApplySwap, liveRoadmapItems, liveBacklogItems }: { onClose?: () => void; activePage?: string; focusItemId?: string; contextUserMessage?: string; onApplyReprioritize?: (itemId: string, newPriority: string, reason: string) => void; onApplySwap?: (cutId: string, addId: string, reason: string) => void; liveRoadmapItems?: SpaceRow[]; liveBacklogItems?: SpaceRow[] } = {}) {
  // Sync live state so all builders see applied changes
  syncLiveState(liveRoadmapItems || _staticRoadmap, liveBacklogItems || _staticBacklog);

  const [panelView, setPanelView] = useState<'chat' | 'related-evidence' | 'view-details'>('chat');
  const [viewContext, setViewContext] = useState('');

  const handleNavigate = (view: string, context?: string) => {
    setPanelView(view as any);
    setViewContext(context || '');
  };

  return (
    <NavigateContext.Provider value={handleNavigate}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        maxWidth: "100%",
        background: "#FFFFFF",
        border: "0.5px solid #E9EAEF",
        boxShadow: "0px 2px 4px rgba(34, 36, 40, 0.08)",
        borderRadius: 8,
      }}>
        <AiGradientDefs />
        <PanelHeader onClose={onClose} />
        {/* Keep PanelBody always mounted so chat state is preserved */}
        <div style={{ display: panelView === 'chat' ? 'flex' : 'none', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <PanelBody activePage={activePage} focusItemId={focusItemId} contextUserMessage={contextUserMessage} onApplyReprioritize={onApplyReprioritize} onApplySwap={onApplySwap} />
        </div>
        {panelView === 'related-evidence' && (
          <RelatedEvidenceView itemLabel={viewContext} onBack={() => setPanelView('chat')} />
        )}
        {panelView === 'view-details' && (
          <ViewDetailsView itemLabel={viewContext} onBack={() => setPanelView('chat')} />
        )}
      </div>
    </NavigateContext.Provider>
  );
}
