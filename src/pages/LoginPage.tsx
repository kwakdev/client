import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/Manager/Login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || data.token?.toLowerCase().includes("failed") || data.token?.toLowerCase().includes("invalid")) {
        setStatus(data.token ?? "Login failed.");
      } else {
        localStorage.setItem("token", data.token);
        navigate("/management");
      }
    } catch {
      setStatus("Network error, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px",
    padding: "14px 16px",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s, background 0.2s",
    boxSizing: "border-box",
    fontFamily: "'Archivo', sans-serif",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Archivo:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .login-input::placeholder { color: rgba(255,255,255,0.22); }
        .login-input:focus { border-color: rgba(139,92,246,0.55) !important; background: rgba(255,255,255,0.06) !important; }
        .back-btn { background:none; border:none; cursor:pointer; color:rgba(255,255,255,0.4); font-size:14px; display:flex; align-items:center; gap:6px; font-family:'Archivo',sans-serif; transition:color 0.2s; padding:0; }
        .back-btn:hover { color:#fff; }
        .login-btn { width:100%; padding:15px; border-radius:999px; border:none; background:linear-gradient(90deg,#7c3aed,#c026d3); color:#fff; font-size:15px; font-weight:600; cursor:pointer; font-family:'Archivo',sans-serif; box-shadow:0 4px 30px rgba(168,85,247,0.35); transition:opacity 0.2s, transform 0.1s; }
        .login-btn:hover:not(:disabled) { opacity:0.88; }
        .login-btn:active:not(:disabled) { transform:scale(0.985); }
        .login-btn:disabled { opacity:0.5; cursor:not-allowed; }
      `}</style>

      <div style={{
        minHeight: "100vh",
        backgroundColor: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Archivo', sans-serif",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
        padding: "24px",
      }}>

        {/* Purple orb */}
        <div style={{
          position: "fixed", top: "0", left: "50%", transform: "translateX(-50%)",
          width: "700px", height: "500px", pointerEvents: "none", zIndex: 0,
          background: "radial-gradient(ellipse at center, rgba(109,40,217,0.2) 0%, rgba(76,29,149,0.08) 50%, transparent 70%)",
          filter: "blur(40px)",
        }} />

        {/* Back button top-left */}
        <div style={{ position: "fixed", top: "28px", left: "40px", zIndex: 10 }}>
          <button className="back-btn" onClick={() => navigate("/")}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>
        </div>

        {/* Card */}
        <div style={{
          width: "100%", maxWidth: "420px", position: "relative", zIndex: 1,
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "40px", justifyContent: "center" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg,#7c3aed,#c026d3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "17px" }}>tiviala</span>
          </div>

          {/* Heading */}
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <h1 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "32px", letterSpacing: "-0.03em", marginBottom: "10px" }}>
              Management Login
            </h1>
            <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "14px", lineHeight: 1.6 }}>
              Sign in to access the management dashboard.
            </p>
          </div>

          {/* Form card */}
          <div style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "20px", padding: "32px",
            backdropFilter: "blur(24px)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}>
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#e2e2e2", marginBottom: "8px", fontFamily: "'Archivo', sans-serif" }}>
                  Email <span style={{ color: "#a78bfa" }}>*</span>
                </label>
                <input
                  className="login-input"
                  style={inputStyle}
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#e2e2e2", marginBottom: "8px", fontFamily: "'Archivo', sans-serif" }}>
                  Password <span style={{ color: "#a78bfa" }}>*</span>
                </label>
                <input
                  className="login-input"
                  style={inputStyle}
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>

              <button type="submit" className="login-btn" disabled={loading} style={{ marginTop: "4px" }}>
                {loading ? "Signing in..." : "Sign In"}
              </button>

              {status && (
                <p style={{
                  textAlign: "center", fontSize: "13px",
                  color: status.toLowerCase().includes("failed") || status.toLowerCase().includes("error") || status.toLowerCase().includes("invalid")
                    ? "#f87171" : "#4ade80",
                  marginTop: "4px",
                }}>
                  {status}
                </p>
              )}
            </form>
          </div>

          <p style={{ textAlign: "center", fontSize: "12px", color: "rgba(255,255,255,0.18)", marginTop: "24px" }}>
            © 2026 Tiviala · Management Portal
          </p>
        </div>
      </div>
    </>
  );
};