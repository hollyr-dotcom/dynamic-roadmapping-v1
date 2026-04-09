import React, { useState, useRef, useEffect } from "react";
import {
  IconButton,
  IconSquarePencil,
  IconClockCounterClockwise,
  IconSquaresFour,
  IconDotsThreeVertical,
  IconCross,
  IconChevronDown,
  IconPlus,
  IconSparks,
  IconSparksFilled,
  IconArticle,
} from "@mirohq/design-system";

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
        <IconChevronDown size="small" color="icon-secondary" />
        <div style={{ background: "#f1f2f5", borderRadius: 4, padding: "0 6px", height: 20, display: "flex", alignItems: "center", marginLeft: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#222428" }}>AI Beta</span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", position: "relative", zIndex: 10 }}>
        <IconButton aria-label="New chat" variant="ghost" size="medium" onPress={() => {}}><IconSquarePencil /></IconButton>
        <IconButton aria-label="History" variant="ghost" size="medium" onPress={() => {}}><IconClockCounterClockwise /></IconButton>
        <IconButton aria-label="Library" variant="ghost" size="medium" onPress={() => {}}><IconSquaresFour /></IconButton>
        <IconButton aria-label="More" variant="ghost" size="medium" onPress={() => {}}><IconDotsThreeVertical /></IconButton>
        <IconButton aria-label="Close" variant="ghost" size="medium" onPress={() => { onClose?.(); (window as any).__closeAiPanel?.(); }}><IconCross /></IconButton>
      </div>
    </div>
  );
}

/* ─── Clickable suggestion pill ─── */
function PromptPill({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="prompt-pill"
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
        transition: "all 150ms cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {label}
    </div>
  );
}

/* ─── Card thumbnail SVG ─── */
function CardThumbnail({ selected }: { selected?: boolean } = {}) {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ flexShrink: 0, borderRadius: 6, border: selected ? "1px solid #4262FF" : undefined }}>
      <rect width="48" height="48" fill="#F2F2F2"/>
      <path d="M2.20703 15.7241C2.20703 15.1147 2.70106 14.6207 3.31048 14.6207H44.6898C45.2992 14.6207 45.7932 15.1147 45.7932 15.7241V32.2758C45.7932 32.8853 45.2992 33.3793 44.6898 33.3793H3.31048C2.70106 33.3793 2.20703 32.8853 2.20703 32.2758V15.7241Z" fill="#A8E9FF"/>
      <path d="M2.48242 15.7241C2.48242 15.2671 2.85294 14.8965 3.31001 14.8965H44.6893C45.1464 14.8965 45.5169 15.2671 45.5169 15.7241V31.8621C45.5169 32.2429 45.2081 32.5517 44.8272 32.5517H3.17208C2.79119 32.5517 2.48242 32.2429 2.48242 31.8621V15.7241Z" fill="white"/>
      <rect x="4.1377" y="17.6552" width="39.7241" height="2.2069" rx="1.10345" fill="#C7CAD5"/>
      <rect x="4.1377" y="20.9655" width="30.8966" height="2.2069" rx="1.10345" fill="#C7CAD5"/>
      <rect x="4.1377" y="25.3793" width="5.51724" height="3.31034" rx="1.10345" fill="#C7CAD5"/>
      <rect x="10.7588" y="25.3793" width="5.51724" height="3.31034" rx="1.10345" fill="#C7CAD5"/>
      <rect x="17.3789" y="25.3793" width="5.51724" height="3.31034" rx="1.10345" fill="#C7CAD5"/>
    </svg>
  );
}

/* ─── Input area ─── */
function PanelInput({ onSend, showThumbnail, placeholder = "What are you working on?" }: { onSend: (text: string) => void; showThumbnail?: boolean; placeholder?: string }) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  useEffect(() => {
    if (showThumbnail) {
      const timer = setTimeout(() => textareaRef.current?.focus(), 400);
      return () => clearTimeout(timer);
    }
  }, [showThumbnail]);

  const hasText = text.trim().length > 0;

  return (
    <div style={{ flexShrink: 0, padding: "0 16px 16px", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          border: `1px solid ${hasText ? "#4262FF" : "#e0e2e8"}`,
          borderRadius: 8,
          background: "#fff",
          position: "relative",
          zIndex: 2,
          transition: "border-color 0.2s",
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
            placeholder={placeholder}
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

        <div
          style={{
            maxHeight: showThumbnail ? 64 : 0,
            opacity: showThumbnail ? 1 : 0,
            padding: showThumbnail ? "8px 16px" : "0 16px",
            transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            overflow: "hidden",
          }}
        >
          <CardThumbnail selected />
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
                <path d="M7 12.5L7 1.5M7 1.5L2 6.5M7 1.5L12 6.5" stroke={hasText ? "#fff" : "#AEB2C0"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
      </div>
    </div>
  );
}

/* ─── User message bubble ─── */
function UserMessage({ text, showThumbnail, riseIn }: { text: string; showThumbnail?: boolean; riseIn?: boolean }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8,
      opacity: 0,
      animation: riseIn
        ? 'message-rise 0.4s cubic-bezier(0.16,1,0.3,1) forwards'
        : 'item-enter 0.35s cubic-bezier(0.16,1,0.3,1) forwards',
    }}>
      <div
        style={{
          background: "#f2f4fc",
          borderRadius: 8,
          padding: "12px 16px",
          maxWidth: 304,
          fontSize: 14,
          fontWeight: 400,
          color: "#222428",
          lineHeight: 1.4,
          fontFamily: "var(--font-noto)",
        }}
      >
        {text}
      </div>
      {showThumbnail && <CardThumbnail />}
    </div>
  );
}

/* ─── AI response text ─── */
function AiMessage({ text, children, delay = 0 }: { text: string; children?: React.ReactNode; delay?: number }) {
  return (
    <div style={{ display: "flex", gap: 8, paddingRight: 32, opacity: 0, animation: `item-enter 0.4s cubic-bezier(0.16,1,0.3,1) ${delay}ms forwards` }}>
      <div style={{ flex: 1 }}>
        <p style={{ margin: "0 0 16px", fontSize: 14, color: "#222428", lineHeight: 1.6, fontFamily: "var(--font-noto)" }}>
          {text}
        </p>
        {children}
      </div>
    </div>
  );
}

/* ─── Document summary card ─── */
function DocSummaryCard({ title, onClick }: { title: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "#fff",
        borderRadius: 8,
        padding: "12px 12px",
        border: "1px solid #e0e2e8",
        cursor: "pointer",
        animation: "item-enter 0.35s cubic-bezier(0.16,1,0.3,1) forwards",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#222428", fontFamily: "var(--font-roobert)", fontFeatureSettings: "'ss01'", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {title}
          </div>
          <div style={{ fontSize: 12, color: "#656b81", fontFamily: "var(--font-noto)", marginTop: 2 }}>
            View on canvas
          </div>
        </div>
        <span style={{ color: "#68d3f8", flexShrink: 0 }}>
          <IconArticle size="medium" />
        </span>
      </div>
    </div>
  );
}

/* ─── Gradient sparkle SVG icon ─── */
function GradientSparkleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3.66671 10.6667C3.66688 11.587 4.41301 12.3333 5.33337 12.3333V13C4.41293 13 3.66675 13.7462 3.66671 14.6667H3.00004C3 13.7462 2.25382 13 1.33337 13V12.3333C2.25374 12.3333 2.99986 11.587 3.00004 10.6667H3.66671Z" fill="url(#working-sparkle-grad)"/>
      <path d="M7.11853 3.47136C7.33563 2.55955 8.66447 2.55793 8.88155 3.47136L8.89913 3.56577L8.92712 3.73634C9.25315 5.48605 10.6594 6.84426 12.4336 7.10027C13.4695 7.24967 13.475 8.74904 12.4336 8.8991C10.6021 9.16312 9.16315 10.6021 8.89913 12.4336C8.74908 13.475 7.24971 13.4695 7.1003 12.4336C6.83604 10.6022 5.39718 9.16302 3.5658 8.8991C2.52637 8.74915 2.52828 7.24998 3.5658 7.10027L3.73637 7.07228C5.48617 6.74595 6.84436 5.34007 7.1003 3.56577L7.11853 3.47136Z" fill="url(#working-sparkle-grad)"/>
      <path d="M13 1.33334C13 2.25386 13.7462 3.00001 14.6667 3.00001V3.66668C13.7463 3.66668 13.0001 4.41287 13 5.33334H12.3334C12.3333 4.41287 11.5872 3.66668 10.6667 3.66668V3.00001C11.5872 3.00001 12.3334 2.25386 12.3334 1.33334H13Z" fill="url(#working-sparkle-grad)"/>
      <defs>
        <linearGradient id="working-sparkle-grad" x1="2.6429" y1="15.8572" x2="16.3334" y2="0.50001" gradientUnits="userSpaceOnUse">
          <stop stopColor="#322BFE"/>
          <stop offset="0.25" stopColor="#6E3CFE"/>
          <stop offset="0.5" stopColor="#A34CFF"/>
          <stop offset="0.75" stopColor="#D05DFF"/>
          <stop offset="1" stopColor="#F66EFF"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─── Loading message — gradient text, single-spin sparkle, fade in/out ─── */
function LoadingMessage({ text, phase = 'in', spin = 'once' }: { text: string; phase?: 'in' | 'out'; spin?: 'once' | 'infinite' }) {
  return (
    <div
      key={text}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '6px 0',
        animation: phase === 'in'
          ? 'loading-msg-in 0.5s cubic-bezier(0.16,1,0.3,1) forwards'
          : 'loading-msg-out 0.4s ease-in forwards',
      }}
    >
      <span style={{ display: 'inline-flex', animation: spin === 'infinite' ? 'sparkle-spin 3s ease-in-out infinite' : 'sparkle-spin-once 0.6s ease-in-out 1' }}>
        <GradientSparkleIcon />
      </span>
      <span style={{
        fontSize: 14, fontWeight: 400, lineHeight: 1.4,
        fontFamily: 'var(--font-noto)',
        background: 'linear-gradient(42deg, #322BFE 0%, #6E3CFE 27%, #A34CFF 55%, #D05DFF 82%, #F66EFF 109%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        {text}
      </span>
    </div>
  );
}

/* ─── Panel Body ─── */
type IntroPhase = 'sent' | 'loading-1' | 'loading-1-out' | 'loading-2' | 'loading-2-out' | 'loading-3' | 'loading-3-out' | 'reply' | 'done'

function PanelBody({ introPhase, onWritePRD, isGenerating, isComplete, onViewDoc, onAddToBoard, selectedRowTitle, onPillClick }: {
  introPhase: IntroPhase;
  onWritePRD?: () => void;
  isGenerating?: boolean;
  isComplete?: boolean;
  onViewDoc?: () => void;
  onAddToBoard?: () => void;
  selectedRowTitle?: string;
  onPillClick?: () => void;
}) {
  const [activePill, setActivePill] = useState<string | null>(null);
  const [addedToBoard, setAddedToBoard] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when new content appears
  useEffect(() => {
    if (introPhase === 'reply' || activePill || isComplete || addedToBoard) {
      setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 100);
    }
  }, [introPhase, activePill, isGenerating, isComplete, addedToBoard]);

  const handlePillClick = (label: string) => {
    setActivePill(label);
    onPillClick?.();
    if (label === "Write a PRD") onWritePRD?.();
  };

  const introDone = introPhase === 'reply' || introPhase === 'done';

  return (
    <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "0 28px 8px", display: "flex", flexDirection: "column" }} className="panel-scroll">
      {/* Spacer pushes content to bottom */}
      <div style={{ flex: 1 }} />

      {/* User message — rises up from behind the input */}
      <div style={{
        marginBottom: 16,
        opacity: 0,
        animation: 'message-rise 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
      }}>
        <UserMessage text="Work on canvas" />
      </div>

      {/* AI completion message — stays in chat once it appears */}
      {introDone && (
        <p style={{
          margin: "0 0 16px", fontSize: 14, color: "#222428", lineHeight: 1.5,
          fontFamily: "var(--font-noto)",
          opacity: 0, animation: "item-enter 0.35s cubic-bezier(0.16,1,0.3,1) forwards",
        }}>
          I've created a new board for {selectedRowTitle || 'this item'}, and I've invited your team. What are we working on?
        </p>
      )}

      {/* Prompt pills — hidden once one is clicked */}
      {introDone && !activePill && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {[
            { label: "Write a PRD" },
            { label: "Explore insights" },
            { label: "Start an estimation session" },
            { label: "Import designs" },
            { label: "Make a prototype" },
            { label: "Share with team" },
          ].map((pill, i) => (
            <div key={pill.label} style={{ opacity: 0, animation: `item-enter 0.35s cubic-bezier(0.16,1,0.3,1) ${300 + i * 60}ms forwards` }}>
              <PromptPill label={pill.label} onClick={() => handlePillClick(pill.label)} />
            </div>
          ))}
        </div>
      )}

      {/* Chat flow after pill selection */}
      {activePill && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* User message — rises up like "Work on canvas" */}
          <UserMessage text={activePill} showThumbnail riseIn />

          {/* AI response — appears after user message settles */}
          {(isGenerating || isComplete) && (
            <AiMessage text="I'll create a Product Requirements Document for you on the canvas." delay={500}>
              {isComplete && (
                <>
                  <div style={{ opacity: 0, animation: "item-enter 0.4s cubic-bezier(0.16,1,0.3,1) 200ms forwards" }}>
                    <DocSummaryCard title="Product Requirements Document" onClick={onViewDoc} />
                  </div>
                  <p style={{ margin: "16px 0 12px", fontSize: 14, color: "#222428", lineHeight: 1.6, fontFamily: "var(--font-noto)", opacity: 0, animation: "item-enter 0.4s cubic-bezier(0.16,1,0.3,1) 400ms forwards" }}>
                    Done. What next?
                  </p>
                  {!addedToBoard && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {["Add to board", "Make changes"].map((label, i) => (
                        <div key={label} style={{ opacity: 0, animation: `item-enter 0.35s cubic-bezier(0.16,1,0.3,1) ${550 + i * 60}ms forwards` }}>
                          <PromptPill label={label} onClick={label === "Add to board" ? () => { setAddedToBoard(true); onAddToBoard?.() } : () => {}} />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </AiMessage>
          )}

          {/* Add to board — user message + AI reply */}
          {addedToBoard && (
            <>
              <UserMessage text="Add to board" riseIn />
              <AiMessage text="Done! The document has been added to your board." delay={400}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["Share with team", "Copy doc link"].map((label, i) => (
                    <div key={label} style={{ opacity: 0, animation: `item-enter 0.35s cubic-bezier(0.16,1,0.3,1) ${200 + i * 60}ms forwards` }}>
                      <PromptPill label={label} onClick={() => {}} />
                    </div>
                  ))}
                </div>
              </AiMessage>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Main export ─── */
export default function BoardSidekickPanel({ onClose, onWritePRD, isGenerating, isComplete, onViewDoc, onAddToBoard, selectedRowTitle, spaceName, onCardReady, onLoadingComplete }: {
  onClose?: () => void;
  onWritePRD?: () => void;
  isGenerating?: boolean;
  isComplete?: boolean;
  onViewDoc?: () => void;
  onAddToBoard?: () => void;
  selectedRowTitle?: string;
  spaceName?: string;
  onCardReady?: () => void;
  onLoadingComplete?: () => void;
} = {}) {
  const [introPhase, setIntroPhase] = useState<IntroPhase>('sent');

  // Stable refs for callbacks so the effect doesn't re-run
  const onCardReadyRef = useRef(onCardReady);
  const onLoadingCompleteRef = useRef(onLoadingComplete);
  onCardReadyRef.current = onCardReady;
  onLoadingCompleteRef.current = onLoadingComplete;

  // Intro animation sequence with cycling messages (each fades in, holds, fades out)
  useEffect(() => {
    const t: ReturnType<typeof setTimeout>[] = [];
    t.push(setTimeout(() => setIntroPhase('loading-1'), 800));         // "Creating a new board" in
    t.push(setTimeout(() => setIntroPhase('loading-1-out'), 2200));    // fade out
    t.push(setTimeout(() => setIntroPhase('loading-2'), 2500));        // "Adding context" in
    t.push(setTimeout(() => { onCardReadyRef.current?.() }, 3400));    // show card on canvas
    t.push(setTimeout(() => setIntroPhase('loading-2-out'), 3900));    // fade out
    t.push(setTimeout(() => setIntroPhase('loading-3'), 4200));        // "Inviting your team" in
    t.push(setTimeout(() => setIntroPhase('loading-3-out'), 5500));    // fade out
    t.push(setTimeout(() => {
      setIntroPhase('reply');
      onLoadingCompleteRef.current?.();
    }, 5800));
    t.push(setTimeout(() => setIntroPhase('done'), 6200));
    return () => t.forEach(clearTimeout);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", maxWidth: "100%", background: "#fff", borderRadius: 8, position: "relative" }}>
      <AiGradientDefs />
      <PanelHeader onClose={onClose} />
      <PanelBody introPhase={introPhase} onWritePRD={onWritePRD} isGenerating={isGenerating} isComplete={isComplete} onViewDoc={onViewDoc} onAddToBoard={onAddToBoard} selectedRowTitle={selectedRowTitle} onPillClick={() => {}} />
      {/* Loading message — always takes space, content fades via opacity */}
      <div style={{ padding: '0 24px', marginBottom: 12, flexShrink: 0, height: 28 }}>
        {(() => {
          const isLoading = introPhase.startsWith('loading');
          if (!isLoading) return null;
          const loadingMessages: Record<string, string> = {
            'loading-1': 'Creating a new board',
            'loading-2': `Adding context from ${spaceName || 'Project Galaxy'} backlog`,
            'loading-3': 'Inviting your team',
          };
          const key = introPhase.replace('-out', '');
          const phase = introPhase.endsWith('-out') ? 'out' as const : 'in' as const;
          const text = loadingMessages[key] || '';
          return <LoadingMessage key={key} text={text} phase={phase} />;
        })()}
      </div>
      {/* Working indicator — above chat input */}
      {isGenerating && !isComplete && (
        <div style={{ padding: "0 24px", marginBottom: 12, height: 28, flexShrink: 0 }}>
          <LoadingMessage text="Working on it..." spin="infinite" />
        </div>
      )}
      <PanelInput
        onSend={() => {}}
        showThumbnail={['loading-3', 'loading-3-out', 'reply', 'done'].includes(introPhase) && !isGenerating && !isComplete}
        placeholder="Write a reply"
      />
    </div>
  );
}
