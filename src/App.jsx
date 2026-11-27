import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import { useUIStore } from "./store/uiStore";
import Topbar from "./components/layout/Topbar";
import CategoryBar from "./components/layout/CategoryBar";
import Sidebar from "./components/layout/Sidebar";
import RightPanel from "./components/layout/RightPanel";
import MobileNav from "./components/layout/MobileNav";
import ChatWidget from "./components/chat/ChatWidget";
import ModalRoot from "./components/modals/ModalRoot";
import Feed from "./pages/Feed";
import PostDetail from "./pages/PostDetail";
import Profile from "./pages/Profile";
import MyPosts from "./pages/MyPosts";
import SavedPosts from "./pages/SavedPosts";
import Landing from "./pages/Landing";
import Admin from "./pages/Admin";

export default function App() {
  const { user, loading, init } = useAuthStore();
  const { mobileNavOpen, closeMobileNav } = useUIStore();

  useEffect(() => {
    init();
  }, [init]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-page)",
          color: "var(--accent)",
          fontSize: "1.5rem",
        }}
      >
        <i className="fa-solid fa-leaf fa-spin"></i>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Landing />
        <ModalRoot />
      </>
    );
  }

  return (
    <>
      <Topbar />
      <CategoryBar />
      <div id="layout">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/my-posts" element={<MyPosts />} />
          <Route path="/saved" element={<SavedPosts />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <RightPanel />
      </div>
      <MobileNav />
      <ChatWidget />
      <div id="mobile-drawer" className={mobileNavOpen ? "open" : ""}>
        <div className="drawer-backdrop" onClick={closeMobileNav}></div>
        <div className="drawer-panel">
          <div className="drawer-head">
            <span>Menu</span>
            <button onClick={closeMobileNav} aria-label="Close menu">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <Sidebar drawer onNavigate={closeMobileNav} />
        </div>
      </div>
      <ModalRoot />
    </>
  );
}
