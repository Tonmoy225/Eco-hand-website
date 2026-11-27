import { create } from "zustand";
import {
  startConversationApi,
  getConversationsApi,
  getUnreadMessagesApi,
  getMessagesApi,
  sendMessageApi,
} from "../api/chat";

export const useChatStore = create((set, get) => ({
  isOpen: false,
  conversations: [],
  activeId: null,
  messages: [],
  unread: 0,
  loading: false,
  sending: false,

  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false, activeId: null, messages: [] }),

  loadConversations: async () => {
    try {
      const { data } = await getConversationsApi();
      set({
        conversations: data,
        unread: data.reduce((n, c) => n + (c.unread || 0), 0),
      });
    } catch {
      /* silent — next poll/retry will refresh */
    }
  },

  loadUnread: async () => {
    try {
      const { data } = await getUnreadMessagesApi();
      set({ unread: data.count || 0 });
    } catch {
      /* silent */
    }
  },

  openConversation: async (id) => {
    set({ isOpen: true, activeId: id, messages: [], loading: true });
    try {
      const { data } = await getMessagesApi(id);
      set({ messages: data, loading: false });
      set((s) => ({
        conversations: s.conversations.map((c) =>
          c._id === id ? { ...c, unread: 0 } : c
        ),
        unread: Math.max(0, s.unread - (s.conversations.find((c) => c._id === id)?.unread || 0)),
      }));
    } catch {
      set({ loading: false });
    }
  },

  startChat: async (recipientId, postId) => {
    const { data } = await startConversationApi(recipientId, postId);
    await get().loadConversations();
    await get().openConversation(data._id);
    return data;
  },

  send: async (text) => {
    const activeId = get().activeId;
    if (!activeId || !text.trim() || get().sending) return;
    set({ sending: true });
    try {
      const { data } = await sendMessageApi(activeId, text);
      set((s) => ({
        messages: [...s.messages, data],
        sending: false,
        conversations: s.conversations
          .map((c) => (c._id === activeId ? { ...c, lastText: data.text } : c))
          .sort((a, b) =>
            String(b.updatedAt || "").localeCompare(String(a.updatedAt || ""))
          ),
      }));
    } catch {
      set({ sending: false });
    }
  },
}));
