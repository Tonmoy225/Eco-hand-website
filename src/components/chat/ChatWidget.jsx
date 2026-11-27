import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { useChatStore } from "../../store/chatStore";
import { getMessagesApi } from "../../api/chat";
import TimeAgo from "../common/TimeAgo";

export default function ChatWidget() {
  const { user } = useAuthStore();
  const {
    isOpen,
    conversations,
    activeId,
    messages,
    unread,
    loading,
    sending,
    closeChat,
    openConversation,
    send,
    loadConversations,
    loadUnread,
  } = useChatStore();
  const [draft, setDraft] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    loadConversations();
    loadUnread();
    const timer = setInterval(() => {
      loadConversations();
      loadUnread();
    }, 15000);
    return () => clearInterval(timer);
  }, [user?._id, loadConversations, loadUnread]);

  useEffect(() => {
    if (!isOpen || !activeId) return;
    const timer = setInterval(async () => {
      try {
        const { data } = await getMessagesApi(activeId);
        useChatStore.setState({ messages: data });
      } catch {
        /* silent */
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [isOpen, activeId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  if (!user || !isOpen) return null;

  const active = conversations.find((c) => c._id === activeId);

  const submit = async (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    await send(draft);
    setDraft("");
  };

  return (
    <div className="chat-root">
      <div className="chat-backdrop" onClick={closeChat}></div>
      <section className="chat-panel" aria-label="Messages">
        <header className="chat-header">
          <div className="chat-header-title">
            {active && (
              <button
                className="chat-back"
                onClick={() => useChatStore.setState({ activeId: null, messages: [] })}
                aria-label="Back to conversations"
              >
                <i className="fa-solid fa-arrow-left"></i>
              </button>
            )}
            <div className="chat-logo"><i className="fa-regular fa-comments"></i></div>
            <div>
              <h2>{active ? active.other?.name || "Conversation" : "Messages"}</h2>
              <span>
                {active
                  ? active.post?.title || "Direct message"
                  : unread
                    ? `${unread} unread`
                    : "Your conversations"}
              </span>
            </div>
          </div>
          <button className="chat-close" onClick={closeChat} aria-label="Close messages">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </header>

        <div className="chat-body">
          <aside className={`chat-list ${active ? "hidden-on-mobile" : ""}`}>
            {conversations.length === 0 ? (
              <div className="chat-empty">
                <i className="fa-regular fa-comments"></i>
                <p>No conversations yet.</p>
                <span>Open a listing and tap “Chat with seller” to start one.</span>
              </div>
            ) : (
              conversations.map((c) => (
                <button
                  key={c._id}
                  className={`chat-conversation ${activeId === c._id ? "active" : ""}`}
                  onClick={() => openConversation(c._id)}
                >
                  <div className="chat-avatar">
                    {c.other?.avatar ? (
                      <img src={c.other.avatar} alt="" />
                    ) : (
                      c.other?.name?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="chat-conv-main">
                    <div className="chat-conv-top">
                      <strong>{c.other?.name || "Unknown"}</strong>
                      {c.updatedAt && <TimeAgo date={c.updatedAt} />}
                    </div>
                    {c.post?.title && <span className="chat-conv-post">{c.post.title}</span>}
                    <span className="chat-conv-preview">{c.lastText || "Start a conversation"}</span>
                  </div>
                  {c.unread > 0 && <span className="chat-unread-dot">{c.unread}</span>}
                </button>
              ))
            )}
          </aside>

          <div className={`chat-thread ${active ? "visible-on-mobile" : ""}`}>
            {!active ? (
              <div className="chat-empty">
                <i className="fa-regular fa-message"></i>
                <p>Select a conversation</p>
                <span>Your messages will appear here.</span>
              </div>
            ) : (
              <>
                {active.post && (
                  <div className="chat-listing">
                    <div className="chat-listing-thumb">
                      {active.post.images?.[0] ? (
                        <img src={active.post.images[0]} alt="" />
                      ) : (
                        <i className="fa-solid fa-image"></i>
                      )}
                    </div>
                    <div>
                      <strong>{active.post.title}</strong>
                      <span>৳{active.post.price?.toLocaleString()}</span>
                    </div>
                  </div>
                )}
                <div className="chat-messages">
                  {loading && (
                    <div className="chat-empty">
                      <i className="fa-solid fa-spinner fa-spin"></i>
                    </div>
                  )}
                  {!loading && messages.length === 0 && (
                    <div className="chat-empty">
                      <p>No messages yet</p>
                      <span>Say hello and ask about the item.</span>
                    </div>
                  )}
                  {messages.map((m) => {
                    const mine = m.sender?._id === user._id;
                    return (
                      <div key={m._id} className={`chat-bubble-row ${mine ? "mine" : ""}`}>
                        {!mine && (
                          <div className="chat-message-avatar">
                            {m.sender?.avatar ? (
                              <img src={m.sender.avatar} alt="" />
                            ) : (
                              m.sender?.name?.charAt(0).toUpperCase()
                            )}
                          </div>
                        )}
                        <div className="chat-bubble">
                          <p>{m.text}</p>
                          <span><TimeAgo date={m.createdAt} /></span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={endRef} />
                </div>
                <form className="chat-composer" onSubmit={submit}>
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Type a message…"
                    maxLength={2000}
                    aria-label="Message"
                  />
                  <button type="submit" disabled={sending || !draft.trim()} aria-label="Send message">
                    <i className={sending ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-paper-plane"}></i>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
