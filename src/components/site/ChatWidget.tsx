"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { MessageCircle, X, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useChatStore, type Message, type Qualification } from "@/store/useChatStore";
import { editorialEase } from "@/lib/motion";

const QUAL_STEPS: { key: keyof Qualification; en: string; es: string }[] = [
  { key: "service", en: "Front", es: "Frente" },
  { key: "industry", en: "Sector", es: "Sector" },
  { key: "urgency", en: "Urgency", es: "Urgencia" },
];

const EN_SUGGESTIONS = [
  "How are you different from an accountant?",
  "What does tax advisory include?",
  "Do you work with family businesses?",
  "How do we start?",
];
const ES_SUGGESTIONS = [
  "¿En qué se diferencian de un despacho?",
  "¿Qué incluye la consultoría fiscal?",
  "¿Atienden empresas familiares?",
  "¿Cómo empezamos?",
];

function PulseDot({ className = "" }: { className?: string }) {
  return (
    <motion.span
      aria-hidden
      className={`inline-block size-1.5 rounded-full bg-cream ${className}`}
      animate={{ opacity: [1, 0.3, 1] }}
      transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
    />
  );
}

function QualificationProgress({ qualification, locale }: { qualification: Qualification; locale: "en" | "es" }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: editorialEase }}
      className="shrink-0 overflow-hidden border-b border-line bg-surface-1"
    >
      <div className="flex items-center gap-1.5 px-4 py-2.5">
        {QUAL_STEPS.map((step, i) => {
          const filled = Boolean(qualification[step.key]);
          return (
            <Fragment key={step.key}>
              <div className="flex items-center gap-1.5">
                <span className={`size-1.5 rounded-full transition-colors ${filled ? "bg-cream" : "bg-line"}`} />
                <span className={`font-mono text-[10px] uppercase tracking-[0.12em] transition-colors ${filled ? "text-bone" : "text-ash"}`}>
                  {locale === "es" ? step.es : step.en}
                </span>
              </div>
              {i < QUAL_STEPS.length - 1 && <span className="h-px flex-1 bg-line" />}
            </Fragment>
          );
        })}
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-[5px] px-3.5 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-1.5 rounded-full bg-ash"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1, ease: "easeInOut", delay: i * 0.18 }}
        />
      ))}
    </div>
  );
}

function MessageBubble({ role, content, streaming = false }: Pick<Message, "role" | "content"> & { streaming?: boolean }) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-cream px-3.5 py-2.5 text-sm leading-relaxed text-ink">
          {content}
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-line bg-surface-2 px-3.5 py-2.5 text-sm leading-relaxed text-bone">
        <ReactMarkdown
          components={{
            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
            strong: ({ children }) => <strong className="font-medium text-chalk">{children}</strong>,
            ul: ({ children }) => <ul className="mb-2 mt-1 space-y-1 pl-1">{children}</ul>,
            ol: ({ children }) => <ol className="mb-2 mt-1 list-decimal space-y-1 pl-4">{children}</ol>,
            li: ({ children }) => (
              <li className="flex gap-2 text-sm leading-snug">
                <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cream" />
                <span>{children}</span>
              </li>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
        {streaming && (
          <motion.span
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ repeat: Infinity, duration: 0.9, ease: "easeInOut" }}
            className="ml-0.5 inline-block h-[0.95em] w-[2px] align-middle bg-cream/70"
          />
        )}
      </div>
    </div>
  );
}

export function ChatWidget() {
  const {
    isOpen, openChat, closeChat, messages, isTyping, isStreaming, leadSaved,
    qualification, suggestedReplies, showProactiveBubble, dismissBubble, locale,
    setLocale, setShowProactiveBubble, sendMessage, sendNudge,
  } = useChatStore();

  const pathname = usePathname();
  const [input, setInput] = useState("");
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocale(window.location.pathname.startsWith("/en") ? "en" : "es");
  }, [setLocale]);

  useEffect(() => {
    if (isOpen) return;
    const t = setTimeout(() => setShowProactiveBubble(true), 5000);
    return () => clearTimeout(t);
  }, [isOpen, setShowProactiveBubble]);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => {
      if (window.innerWidth >= 768) return;
      const keyboardHeight = window.innerHeight - vv.height - vv.offsetTop;
      setPanelStyle(keyboardHeight > 50 ? { bottom: `${keyboardHeight}px` } : {});
    };
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => { vv.removeEventListener("resize", update); vv.removeEventListener("scroll", update); };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 360);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const sourceUrl = typeof window !== "undefined" ? window.location.href : "";

  useEffect(() => {
    if (!isOpen || isStreaming || isTyping || leadSaved) return;
    const last = messages[messages.length - 1];
    if (!last || last.role !== "assistant") return;
    const t = setTimeout(() => sendNudge(sourceUrl), 30000);
    return () => clearTimeout(t);
  }, [messages, isOpen, isStreaming, isTyping, leadSaved, sendNudge, sourceUrl]);

  const handleSend = (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || isStreaming) return;
    setInput("");
    sendMessage(content, sourceUrl);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const proactiveText = locale === "es" ? "¿Dudas fiscales o financieras? Pregúnteme aquí." : "Tax or financial questions? Ask me here.";
  const suggestions = locale === "es" ? ES_SUGGESTIONS : EN_SUGGESTIONS;

  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      {/* Burbuja proactiva */}
      <AnimatePresence>
        {showProactiveBubble && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.28, ease: editorialEase }}
            className="fixed bottom-[150px] right-5 z-50 max-w-[230px] md:bottom-[92px] md:right-6"
          >
            <div className="console-panel flex items-start gap-2 rounded-xl bg-surface-2 p-3">
              <p className="flex-1 text-[13px] leading-snug text-bone">{proactiveText}</p>
              <button onClick={dismissBubble} className="mt-0.5 shrink-0 text-ash transition-colors hover:text-chalk" aria-label="Cerrar">
                <X className="size-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            transition={{ duration: 0.35, ease: editorialEase }}
            style={panelStyle}
            className={[
              "fixed z-50 flex flex-col overflow-hidden",
              "inset-x-0 bottom-0 top-0",
              "md:inset-auto md:bottom-[92px] md:right-6",
              "md:h-[min(640px,calc(100dvh-120px))] md:w-[420px]",
              "md:rounded-2xl md:border md:border-line md:shadow-[0_24px_64px_rgba(0,0,0,0.5)]",
              "bg-ink",
            ].join(" ")}
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-line bg-surface-2 px-4 py-3">
              <div>
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-ash">VBT Consultores</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-sm font-medium tracking-tight text-chalk">
                  <PulseDot />
                  {locale === "es" ? "Asesor en línea" : "Advisor online"}
                </p>
              </div>
              <button onClick={closeChat} className="flex size-8 items-center justify-center rounded-full text-bone transition-colors hover:bg-white/10" aria-label="Cerrar chat">
                <X className="size-4" />
              </button>
            </div>

            <AnimatePresence>
              {Object.values(qualification).some(Boolean) && (
                <QualificationProgress qualification={qualification} locale={locale} />
              )}
            </AnimatePresence>

            {/* Mensajes */}
            <div className="scrollbar-hide flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: editorialEase, delay: 0.1 }}
                  className="space-y-3 py-4 text-center"
                >
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-bone">
                    {locale === "es" ? "Asesor disponible ahora" : "Advisor available now"}
                  </p>
                  <p className="px-2 text-[13px] leading-relaxed text-bone">
                    {locale === "es"
                      ? "Soy el asistente de VBT Consultores. Puede preguntarme sobre lo fiscal, financiero y empresarial, y qué servicio conviene a su caso."
                      : "I am the VBT Consultores assistant. Ask about tax, financial and business matters, and which service fits your case."}
                  </p>
                  <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSend(s)}
                        className="rounded-full border border-line px-3 py-1.5 text-[12px] text-bone transition-colors hover:bg-surface-2 hover:text-chalk"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {messages.map((msg, i) => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22, ease: editorialEase }}>
                  <MessageBubble role={msg.role} content={msg.content} streaming={isStreaming && i === messages.length - 1 && msg.role === "assistant"} />
                </motion.div>
              ))}

              <AnimatePresence>
                {suggestedReplies.length > 0 && !isStreaming && !isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.2, ease: editorialEase }}
                    className="flex flex-wrap items-center gap-1.5 px-1 pb-1"
                  >
                    {suggestedReplies.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleSend(option)}
                        className="rounded-full border border-bone/30 px-3 py-1.5 text-[12px] text-chalk transition-colors hover:bg-white/5"
                      >
                        {option}
                      </button>
                    ))}
                    <span className="pl-0.5 text-[11px] text-ash">{locale === "es" ? "o escriba su respuesta" : "or type your answer"}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="flex justify-start">
                  <div className="rounded-2xl rounded-tl-sm border border-line bg-surface-2">
                    <TypingIndicator />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex shrink-0 items-center gap-2 border-t border-line bg-surface-1 px-3 py-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isStreaming}
                placeholder={locale === "es" ? "Escriba su pregunta…" : "Ask a question…"}
                className="min-w-0 flex-1 bg-transparent text-[16px] text-chalk outline-none placeholder:text-ash disabled:opacity-50"
              />
              <motion.button
                onClick={() => handleSend()}
                disabled={!input.trim() || isStreaming}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.9 }}
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-cream text-ink transition-opacity disabled:cursor-not-allowed disabled:opacity-35"
                aria-label="Enviar"
              >
                <Send className="size-3.5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón flotante */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12, scale: 0.9 }}
            transition={{ delay: 0.8, duration: 0.5, ease: editorialEase }}
            onClick={() => { openChat(); dismissBubble(); }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.93 }}
            className="signal-glow fixed bottom-[88px] right-5 z-50 flex size-14 items-center justify-center rounded-full bg-cream text-ink md:bottom-6 md:right-6"
            aria-label={locale === "es" ? "Abrir chat" : "Open chat"}
          >
            <MessageCircle className="size-5" strokeWidth={1.75} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
