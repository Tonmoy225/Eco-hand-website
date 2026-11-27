import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useUIStore } from "../../store/uiStore";

export default function MobileNav() {
  const { user } = useAuthStore();
  const { openModal } = useUIStore();
  const { pathname } = useLocation();

  const isActive = (path) => pathname === path;

  return (
    <nav id="mobile-nav" aria-label="Mobile navigation">
      <Link to="/" className={`mobile-nav-item ${isActive("/") ? "active" : ""}`}>
        <i className="fa-solid fa-house"></i>
        <span>Feed</span>
      </Link>
      <Link
        to="/my-posts"
        className={`mobile-nav-item ${isActive("/my-posts") ? "active" : ""}`}
      >
        <i className="fa-solid fa-rectangle-list"></i>
        <span>Posts</span>
      </Link>
      <button className="mobile-nav-item mobile-post-btn" onClick={() => openModal("createPost")}>
        <i className="fa-solid fa-plus"></i>
      </button>
      <Link to="/saved" className={`mobile-nav-item ${isActive("/saved") ? "active" : ""}`}>
        <i className="fa-regular fa-bookmark"></i>
        <span>Saved</span>
      </Link>
      <Link
        to={`/profile/${user?._id}`}
        className={`mobile-nav-item ${pathname.startsWith("/profile") ? "active" : ""}`}
      >
        <i className="fa-regular fa-user"></i>
        <span>Profile</span>
      </Link>
    </nav>
  );
}
