import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import TimeAgo from "../components/common/TimeAgo";
import {
  getAdminStatsApi,
  getAdminUsersApi,
  getAdminPostsApi,
  getAdminReportsApi,
  getAdminFeedbackApi,
  updateUserRoleApi,
  updateReportApi,
  deleteAdminPostApi,
} from "../api/admin";

const TABS = ["Overview", "Users", "Listings", "Reports", "Feedback"];

export default function Admin() {
  const { user } = useAuthStore();
  const [tab, setTab] = useState("Overview");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [reports, setReports] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async (which = tab) => {
    setLoading(true);
    try {
      if (which === "Overview") setStats((await getAdminStatsApi()).data);
      if (which === "Users") setUsers((await getAdminUsersApi()).data);
      if (which === "Listings") setPosts((await getAdminPostsApi()).data);
      if (which === "Reports") setReports((await getAdminReportsApi()).data);
      if (which === "Feedback") setFeedback((await getAdminFeedbackApi()).data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") load(tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, user?._id, user?.role]);

  if (user?.role !== "admin") {
    return (
      <div id="main-content">
        <div className="empty-state">
          <i className="fa-solid fa-lock"></i>
          <p>Admin access required.</p>
          <Link to="/" className="btn btn-outline" style={{ width: "auto", marginTop: 12 }}>
            Back to feed
          </Link>
        </div>
      </div>
    );
  }

  const changeRole = async (u) => {
    const next = u.role === "admin" ? "user" : "admin";
    try {
      const { data } = await updateUserRoleApi(u._id, next);
      setUsers((list) => list.map((x) => (x._id === u._id ? { ...x, role: data.role } : x)));
      toast.success(`${u.name} is now ${data.role}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update role");
    }
  };

  const removePost = async (id) => {
    if (!confirm("Remove this listing permanently?")) return;
    try {
      await deleteAdminPostApi(id);
      setPosts((list) => list.filter((p) => p._id !== id));
      toast.success("Listing removed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not remove listing");
    }
  };

  const setReportStatus = async (id, status) => {
    try {
      await updateReportApi(id, status);
      setReports((list) => list.map((r) => (r._id === id ? { ...r, status } : r)));
      toast.success(`Report marked ${status}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update report");
    }
  };

  return (
    <div id="main-content" className="admin-page">
      <div className="admin-header">
        <div>
          <h1><i className="fa-solid fa-shield-halved"></i> Admin Dashboard</h1>
          <p>Manage users, listings, reports and feedback.</p>
        </div>
        <button className="btn btn-outline admin-refresh" onClick={() => load()}>
          <i className="fa-solid fa-rotate"></i> Refresh
        </button>
      </div>

      <div className="admin-tabs">
        {TABS.map((t) => (
          <button
            key={t}
            className={`admin-tab ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {loading && <div className="admin-loading"><i className="fa-solid fa-spinner fa-spin"></i> Loading…</div>}

      {tab === "Overview" && stats && (
        <div className="admin-stats">
          {[
            ["Users", stats.users, "fa-users", "var(--accent)"],
            ["Listings", stats.posts, "fa-rectangle-list", "var(--green)"],
            ["Comments", stats.comments, "fa-comments", "var(--purple-300)"],
            ["Available", stats.available, "fa-tag", "var(--green)"],
            ["Sold", stats.sold, "fa-check-circle", "var(--gold)"],
            ["Pending reports", stats.pendingReports, "fa-flag", "var(--red)"],
            ["Feedback", stats.feedback, "fa-comment-dots", "var(--accent)"],
          ].map(([label, value, icon, color]) => (
            <div className="admin-stat-card" key={label}>
              <i className={`fa-solid ${icon}`} style={{ color }}></i>
              <div className="admin-stat-num">{value}</div>
              <div className="admin-stat-label">{label}</div>
            </div>
          ))}
        </div>
      )}

      {tab === "Overview" && stats && (
        <div className="admin-card">
          <h3>Newest members</h3>
          {stats.recentUsers?.length ? (
            stats.recentUsers.map((u) => (
              <div className="admin-row" key={u._id}>
                <div className="admin-avatar">
                  {u.avatar ? <img src={u.avatar} alt="" /> : u.name?.charAt(0).toUpperCase()}
                </div>
                <div className="admin-row-main">
                  <strong>{u.name}</strong>
                  <span>{u.email}</span>
                </div>
                <span className={`role-badge ${u.role}`}>{u.role}</span>
                <span className="admin-muted"><TimeAgo date={u.createdAt} /></span>
              </div>
            ))
          ) : (
            <p className="admin-muted">No users yet.</p>
          )}
        </div>
      )}

      {tab === "Users" && (
        <div className="admin-card">
          <div className="admin-card-title">
            <h3>All users ({users.length})</h3>
          </div>
          {users.map((u) => (
            <div className="admin-row" key={u._id}>
              <div className="admin-avatar">
                {u.avatar ? <img src={u.avatar} alt="" /> : u.name?.charAt(0).toUpperCase()}
              </div>
              <div className="admin-row-main">
                <strong>
                  {u.name} {u.isDemo && <span className="demo-badge">demo</span>}
                </strong>
                <span>{u.email} · 🌱 {u.ecoScore ?? 0}</span>
              </div>
              <span className={`role-badge ${u.role}`}>{u.role}</span>
              <button className="admin-mini-btn" onClick={() => changeRole(u)}>
                {u.role === "admin" ? "Remove admin" : "Make admin"}
              </button>
            </div>
          ))}
          {!users.length && !loading && <p className="admin-muted">No users found.</p>}
        </div>
      )}

      {tab === "Listings" && (
        <div className="admin-card">
          <div className="admin-card-title"><h3>All listings ({posts.length})</h3></div>
          {posts.map((p) => (
            <div className="admin-row" key={p._id}>
              <div className="admin-thumb">
                {p.images?.[0] ? <img src={p.images[0]} alt="" /> : <i className="fa-solid fa-image"></i>}
              </div>
              <div className="admin-row-main">
                <Link to={`/post/${p._id}`}><strong>{p.title}</strong></Link>
                <span>{p.owner?.name || "Unknown"} · ৳{p.price?.toLocaleString()}</span>
              </div>
              <span className={`status-badge ${p.status}`}>{p.status}</span>
              <button className="admin-mini-btn danger" onClick={() => removePost(p._id)}>
                <i className="fa-regular fa-trash-can"></i>
              </button>
            </div>
          ))}
          {!posts.length && !loading && <p className="admin-muted">No listings found.</p>}
        </div>
      )}

      {tab === "Reports" && (
        <div className="admin-card">
          <div className="admin-card-title"><h3>Reports ({reports.length})</h3></div>
          {reports.map((r) => (
            <div className="admin-report" key={r._id}>
              <div className="admin-report-head">
                <strong><i className="fa-solid fa-flag"></i> {r.reason}</strong>
                <span className={`status-badge ${r.status}`}>{r.status}</span>
              </div>
              <p>{r.details}</p>
              <div className="admin-muted">
                By {r.reporter?.name || "Unknown"} ·{" "}
                {r.targetPost?.title ? `Listing: ${r.targetPost.title}` : "General report"} ·{" "}
                <TimeAgo date={r.createdAt} />
              </div>
              <div className="admin-report-actions">
                <button className="admin-mini-btn" onClick={() => setReportStatus(r._id, "reviewed")}>
                  Mark reviewed
                </button>
                <button className="admin-mini-btn" onClick={() => setReportStatus(r._id, "resolved")}>
                  Resolve
                </button>
              </div>
            </div>
          ))}
          {!reports.length && !loading && <p className="admin-muted">No reports yet.</p>}
        </div>
      )}

      {tab === "Feedback" && (
        <div className="admin-card">
          <div className="admin-card-title"><h3>Feedback ({feedback.length})</h3></div>
          {feedback.map((f) => (
            <div className="admin-report" key={f._id}>
              <div className="admin-report-head">
                <strong>{f.subject}</strong>
                <span className="role-badge user">{f.type}</span>
              </div>
              <p>{f.message}</p>
              <div className="admin-muted">
                {f.user?.name || "Unknown"} · <TimeAgo date={f.createdAt} />
              </div>
            </div>
          ))}
          {!feedback.length && !loading && <p className="admin-muted">No feedback yet.</p>}
        </div>
      )}
    </div>
  );
}
