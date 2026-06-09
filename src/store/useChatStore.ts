"use client";

import { create } from "zustand";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export type LeadInfo = {
  name?: string;
  email?: string;
  phone?: string;
};

// Subset de LeadQualification (schema.ts) que el chatbot captura.
export type Qualification = {
  service?: string;
  industry?: string;
  urgency?: string;
};

const FALLBACK_PHONE = "664 889 5835";
const MAX_NUDGES = 2;

type ChatState = {
  isOpen: boolean;
  messages: Message[];
  isStreaming: boolean;
  isTyping: boolean;
  leadInfo: LeadInfo;
  leadSaved: boolean;
  qualification: Qualification;
  nudgeCount: number;
  showProactiveBubble: boolean;
  locale: "en" | "es";
  suggestedReplies: string[];

  openChat: () => void;
  closeChat: () => void;
  dismissBubble: () => void;
  setShowProactiveBubble: (v: boolean) => void;
  setLocale: (locale: "en" | "es") => void;
  sendMessage: (text: string, sourceUrl: string) => Promise<void>;
  sendNudge: (sourceUrl: string) => Promise<void>;
};

const uid = () => crypto.randomUUID();

export const useChatStore = create<ChatState>((set, get) => {
  const streamTurn = async (
    apiMessages: { role: string; content: string }[],
    sourceUrl: string,
    nudge = false,
  ) => {
    const { locale, leadInfo } = get();
    const assistantId = uid();

    const runStream = async (currentLead: LeadInfo): Promise<string> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      let res: Response;
      try {
        res = await fetch("/api/chat", {
          method: "POST",
          signal: controller.signal,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: apiMessages, locale, sourceUrl, currentLead, qualification: get().qualification, nudge }),
        });
      } finally {
        clearTimeout(timeoutId);
      }

      if (!res.ok) throw new Error(`Chat API ${res.status}`);

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";
      let buf = "";

      const processLine = (line: string): boolean => {
        if (!line.startsWith("data: ")) return false;
        const raw = line.slice(6).trim();
        if (raw === "[DONE]") return true;
        try {
          const evt = JSON.parse(raw);
          if (evt.type === "text") {
            accumulated += evt.text;
            set((s) => ({
              messages: s.messages.map((m) =>
                m.id === assistantId ? { ...m, content: accumulated } : m,
              ),
            }));
          }
          if (evt.type === "tool_call" && evt.tool === "suggest_replies") {
            set({ suggestedReplies: evt.input.options ?? [] });
          }
          if (evt.type === "tool_call" && evt.tool === "update_qualification") {
            const keys: (keyof Qualification)[] = ["service", "industry", "urgency"];
            const next = { ...get().qualification };
            for (const k of keys) {
              if (evt.input?.[k]) next[k] = evt.input[k];
            }
            set({ qualification: next });
          }
          if (evt.type === "tool_call" && evt.tool === "update_lead_info") {
            const updatedLead = { ...get().leadInfo, ...evt.input };
            set({ leadInfo: updatedLead });
            const alreadySaved = get().leadSaved;
            if (!alreadySaved && updatedLead.name && (updatedLead.email || updatedLead.phone)) {
              set({ leadSaved: true });
              fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  ...updatedLead,
                  source: "bot",
                  qualification: get().qualification,
                  locale: get().locale,
                  sourceUrl,
                  messages: apiMessages,
                }),
              }).catch(console.error);
            }
          }
        } catch {
          /* ignore malformed lines */
        }
        return false;
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          if (processLine(line)) {
            reader.cancel();
            return accumulated;
          }
        }
      }
      if (buf.trim()) processLine(buf);
      return accumulated;
    };

    try {
      set((s) => ({
        isTyping: false,
        isStreaming: true,
        messages: [
          ...s.messages,
          { id: assistantId, role: "assistant", content: "", timestamp: new Date() },
        ],
      }));

      let result = "";
      try {
        result = await runStream(leadInfo);
      } catch {
        result = await runStream(get().leadInfo);
      }
      if (result === "") {
        result = await runStream(get().leadInfo);
      }

      set((s) => ({
        isStreaming: false,
        messages: s.messages.filter((m) => !(m.id === assistantId && m.content === "")),
      }));
    } catch {
      set((s) => ({
        isTyping: false,
        isStreaming: false,
        messages: s.messages.filter((m) => m.id !== assistantId),
      }));
      if (!nudge) {
        const errorMsg =
          get().locale === "es"
            ? `Hubo un problema al conectar. Intente de nuevo o llame al ${FALLBACK_PHONE}.`
            : `There was a problem connecting. Please try again or call ${FALLBACK_PHONE}.`;
        set((s) => ({
          messages: [...s.messages, { id: uid(), role: "assistant", content: errorMsg, timestamp: new Date() }],
        }));
      }
    }
  };

  return {
    isOpen: false,
    messages: [],
    isStreaming: false,
    isTyping: false,
    leadInfo: {},
    leadSaved: false,
    qualification: {},
    nudgeCount: 0,
    showProactiveBubble: false,
    locale: "es",
    suggestedReplies: [],

    openChat: () => set({ isOpen: true, showProactiveBubble: false }),
    closeChat: () => set({ isOpen: false }),
    dismissBubble: () => set({ showProactiveBubble: false }),
    setShowProactiveBubble: (v) => set({ showProactiveBubble: v }),
    setLocale: (locale) => set({ locale }),

    sendMessage: async (text, sourceUrl) => {
      const userMsg: Message = { id: uid(), role: "user", content: text, timestamp: new Date() };
      set((s) => ({
        messages: [...s.messages, userMsg],
        isTyping: true,
        suggestedReplies: [],
        nudgeCount: 0,
      }));
      const apiMessages = get().messages.map((m) => ({ role: m.role, content: m.content }));
      await streamTurn(apiMessages, sourceUrl);
    },

    sendNudge: async (sourceUrl) => {
      const { messages, isStreaming, isTyping, leadSaved, nudgeCount } = get();
      if (isStreaming || isTyping || leadSaved) return;
      if (nudgeCount >= MAX_NUDGES) return;
      const last = messages[messages.length - 1];
      if (!last || last.role !== "assistant") return;

      set({ nudgeCount: nudgeCount + 1, isTyping: true });
      const apiMessages = messages.map((m) => ({ role: m.role, content: m.content }));
      await streamTurn(apiMessages, sourceUrl, true);
    },
  };
});
