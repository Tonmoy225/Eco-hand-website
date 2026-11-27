import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useUIStore } from "../../store/uiStore";

export default function Sidebar({ drawer = false, onNavigate = () => {} }) {
  const { user } = useAuthStore();
  const { openModal } = useUIStore();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const open = (name) => {
    onNavigate();
    openModal(name);
  };

  return (
    <div id={drawer ? undefined : "sidebar"} className={drawer ? "sidebar-drawer-inner" : ""}>
      <Link
        to="/"
        className={`nav-item ${isActive("/") ? "active" : ""}`}
        onClick={onNavigate}
      >
        <i className="fa-solid fa-house"></i>
        <span>News Feed</span>
      </Link>
      <Link
        to="/my-posts"
        className={`nav-item ${isActive("/my-posts") ? "active" : ""}`}
        onClick={onNavigate}
      >
        <i className="fa-solid fa-rectangle-list"></i>
        <span>My Posts</span>
      </Link>
      <Link
        to="/saved"
        className={`nav-item ${isActive("/saved") ? "active" : ""}`}
        onClick={onNavigate}
      >
        <i className="fa-regular fa-bookmark"></i>
        <span>Saved Posts</span>
      </Link>
      <div className="nav-item" onClick={() => open("cart")}>
        <i className="fa-solid fa-cart-shopping"></i>
        <span>My Cart</span>
      </div>
      <div className="nav-item" onClick={() => open("notifications")}>
        <i className="fa-regular fa-bell"></i>
        <span>Notifications</span>
      </div>
      <Link to={`/profile/${user?._id}`} className="nav-item" onClick={onNavigate}>
        <i className="fa-regular fa-user"></i>
        <span>My Profile</span>
      </Link>
      {user?.role === "admin" && (
        <Link
          to="/admin"
          className={`nav-item ${isActive("/admin") ? "active" : ""}`}
          onClick={onNavigate}
        >
          <i className="fa-solid fa-shield-halved"></i>
          <span>Admin Dashboard</span>
        </Link>
      )}

      <div className="nav-divider"></div>
      <div className="nav-section-title">Eco Impact</div>
      <div className="eco-stat-card">
        <div className="eco-stat-title">
          <i className="fa-solid fa-seedling" style={{ color: "var(--green)" }}></i> Eco Score
        </div>
        <div className="eco-stat-num">{user?.ecoScore ?? 0}</div>
        <div className="eco-stat-sub">Points earned by reducing e-waste</div>
      </div>

      <div className="nav-divider"></div>
      <div className="nav-section-title">Support</div>
      <div className="nav-item" onClick={() => open("terms")}>
        <i className="fa-solid fa-file-contract"></i>
        <span>Terms of Policy</span>
      </div>
      <div className="nav-item" onClick={() => open("feedback")}>
        <i className="fa-regular fa-comment-dots"></i>
        <span>Feedback</span>
      </div>
      <div className="nav-item" onClick={() => open("report")}>
        <i className="fa-solid fa-flag"></i>
        <span>Report a Problem</span>
      </div>
      <div className="nav-item" onClick={() => open("logout")} style={{ color: "var(--red)" }}>
        <i className="fa-solid fa-right-from-bracket"></i>
        <span>Logout</span>
      </div>
    </div>
  );
}
