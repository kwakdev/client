// src/pages/LoginPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";

const provider = new GoogleAuthProvider();

export const LoginPage: React.FC = () => {
  const navigate              = useNavigate();
  const [status, setStatus]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setStatus("");

    try {
      await signInWithPopup(auth, provider);
      navigate("/management");
    } catch (err: any) {
      const code: string = err?.code ?? "";
      if (
        code === "auth/popup-closed-by-user" ||
        code === "auth/cancelled-popup-request"
      ) {
        // user dismissed — nothing to show
      } else if (code === "auth/network-request-failed") {
        setStatus("Network error. Please check your connection.");
      } else if (code === "auth/unauthorized-domain") {
        setStatus("This domain isn't authorised. Add it in Firebase → Authentication → Settings.");
      } else {
        setStatus("Sign-in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Archivo:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .back-btn { background:none; border:none; cursor:pointer; color:rgba(255,255,255,0.4); font-size:14px; display:flex; align-items:center; gap:6px; font-family:'Archivo',sans-serif; transition:color 0.2s; padding:0; }
        .back-btn:hover { color:#fff; }
        .google-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 15px 20px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.06);
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          font-family: 'Archivo', sans-serif;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, transform 0.1s;
          backdrop-filter: blur(8px);
        }
        .google-btn:hover:not(:disabled) {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.22);
        }
        .google-btn:active:not(:disabled) { transform: scale(0.985); }
        .google-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{
        minHeight: "100vh", backgroundColor: "#000", display: "flex",
        flexDirection: "column", alignItems: "center", justifyContent: "center",
        fontFamily: "'Archivo', sans-serif", color: "#fff",
        position: "relative", overflow: "hidden", padding: "24px",
      }}>

        {/* Purple orb */}
        <div style={{
          position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)",
          width: "700px", height: "500px", pointerEvents: "none", zIndex: 0,
          background: "radial-gradient(ellipse at center, rgba(109,40,217,0.2) 0%, rgba(76,29,149,0.08) 50%, transparent 70%)",
          filter: "blur(40px)",
        }}/>

        {/* Back button */}
        <div style={{ position: "fixed", top: "28px", left: "40px", zIndex: 10 }}>
          <button className="back-btn" onClick={() => navigate("/")}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>
        </div>

        <div style={{ width: "100%", maxWidth: "420px", position: "relative", zIndex: 1 }}>

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
              Sign in with your Google account to access the dashboard.
            </p>
          </div>

          {/* Card */}
          <div style={{
            background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "20px", padding: "32px", backdropFilter: "blur(24px)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}>
            <button className="google-btn" onClick={handleGoogleLogin} disabled={loading}>
              {loading ? (
                /* spinner */
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"
                  style={{ animation: "spin 1s linear infinite" }}>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
              ) : (
                /* Official Google G */
                <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
              )}
              {loading ? "Signing in…" : "Continue with Google"}
            </button>

            {status && (
              <p style={{ textAlign: "center", fontSize: "13px", color: "#f87171", marginTop: "20px" }}>
                {status}
              </p>
            )}
          </div>

          <p style={{ textAlign: "center", fontSize: "12px", color: "rgba(255,255,255,0.18)", marginTop: "24px" }}>
            © 2026 Tiviala · Management Portal
          </p>
        </div>
      </div>
    </>
  );
};