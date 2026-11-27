import api from "./axios";

export const startConversationApi = (recipientId, postId) =>
  api.post("/chat", { recipientId, postId });
export const getConversationsApi = () => api.get("/chat");
export const getUnreadMessagesApi = () => api.get("/chat/unread");
export const getMessagesApi = (id) => api.get(`/chat/${id}/messages`);
export const sendMessageApi = (id, text) => api.post(`/chat/${id}/messages`, { text });
