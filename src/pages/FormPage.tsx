import React, { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

export const FormPage: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [platform, setPlatform] = useState("");
  const [followerCount, setFollowerCount] = useState("");
  const [monthlyRevenue, setMonthlyRevenue] = useState("");
  const [niche, setNiche] = useState("");
  const [goals, setGoals] = useState("");

  const [status, setStatus] = useState<string>("");
  const [statusKind, setStatusKind] = useState<"idle" | "info" | "success" | "error">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  const parseFirstNumber = (value: string): number | null => {
    const match = value.replace(/,/g, "").match(/(\d+(\.\d+)?)/);
    if (!match) return null;
    const n = Number(match[1]);
    return Number.isFinite(n) ? n : null;
  };

  const apiBase = import.meta.env.VITE_API_BASE_URL;

  const canSubmit = useMemo(() => {
    return (
      !isSubmitting &&
      name.trim().length > 0 &&
      email.trim().length > 0 &&
      platform.trim().length > 0 &&
      niche.trim().length > 0 &&
      goals.trim().length > 0 &&
      parseFirstNumber(followerCount) !== null
    );
  }, [isSubmitting, name, email, platform, niche, goals, followerCount]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setStatusKind("info");
    setStatus("Submitting...");

    try {
      const revenueNumber = parseFirstNumber(monthlyRevenue);
      const followersNumber = parseFirstNumber(followerCount);

      const res = await fetch(`${apiBase}/api/forms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          socialType: platform,
          monthlyRevenue: revenueNumber ?? 0,
          followerCount: followersNumber ?? 0,
          goals: goals.trim(),
          niche: niche.trim(),
        }),
      });

      if (!res.ok) {
        let msg = "";
        const contentType = res.headers.get("content-type") || "";

        if (contentType.includes("application/json")) {
          try {
            const data = await res.json();
            msg =
              (typeof data === "string" && data) ||
              data?.message ||
              data?.error ||
              JSON.stringify(data);
          } catch {
            msg = "";
          }
        } else {
          try {
            msg = await res.text();
          } catch {
            msg = "";
          }
        }

        const safeMsg = (msg || "").trim();
        setStatusKind("error");
        setStatus(
          safeMsg
            ? `Submission failed (${res.status}). ${safeMsg}`
            : `Submission failed (${res.status}). Please try again.`
        );
        return;
      }

      setStatusKind("success");
      setStatus("Form submitted successfully!");

      // Reset fields
      setName("");
      setEmail("");
      setPlatform("");
      setFollowerCount("");
      setMonthlyRevenue("");
      setNiche("");
      setGoals("");
    } catch {
      setStatusKind("error");
      setStatus("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px",
    paddingTop: "14px",
    paddingBottom: "14px",
    paddingLeft: "16px",
    paddingRight: "16px",
    color: "#fff",
    fontSize: "14px",
    lineHeight: "1.5",
    outline: "none",
    transition: "border-color 0.2s, background 0.2s",
    boxSizing: "border-box",
    fontFamily: "'Archivo', sans-serif",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "13px",
    fontWeight: 500,
    color: "#e2e2e2",
    marginBottom: "8px",
    fontFamily: "'Archivo', sans-serif",
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    paddingRight: "36px",
    appearance: "none" as any,
    cursor: "pointer",
  };

  const statusColor =
    statusKind === "error" ? "#f87171" : statusKind === "success" ? "#4ade80" : "rgba(255,255,255,0.55)";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Archivo:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .form-input { line-height: 1.5 !important; min-height: 48px !important; height: auto !important; }
        .form-input::placeholder { color: rgba(255,255,255,0.22); line-height: 1.5; }
        .form-input:focus { border-color: rgba(139,92,246,0.55) !important; background: rgba(255,255,255,0.06) !important; }
        .form-select option { background: #0d0a15; color: #fff; }
        .back-btn { background:none; border:none; cursor:pointer; color:rgba(255,255,255,0.45); font-size:14px; display:flex; align-items:center; gap:6px; font-family:'Archivo',sans-serif; transition:color 0.2s; padding:0; }
        .back-btn:hover { color:#fff; }
        .submit-btn {
          width:100%;
          padding:16px;
          border-radius:999px;
          border:none;
          background:linear-gradient(90deg,#7c3aed,#c026d3);
          color:#fff;
          font-size:15px;
          font-weight:600;
          cursor:pointer;
          letter-spacing:0.02em;
          transition:opacity 0.2s,transform 0.1s;
          font-family:'Archivo',sans-serif;
          box-shadow:0 4px 30px rgba(168,85,247,0.35);
        }
        .submit-btn:hover { opacity:0.88; }
        .submit-btn:active { transform:scale(0.985); }
        .submit-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
          transform: none;
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          backgroundColor: "#000",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          fontFamily: "'Archivo', sans-serif",
        }}
      >
        {/* Purple ambient orb */}
        <div
          style={{
            position: "fixed",
            top: "5%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "800px",
            height: "600px",
            background:
              "radial-gradient(ellipse at center, rgba(109,40,217,0.22) 0%, rgba(76,29,149,0.1) 45%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
            filter: "blur(30px)",
          }}
        />

        {/* Top Nav */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            paddingTop: "28px",
            paddingBottom: "8px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <button className="back-btn" onClick={() => navigate("/")}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M10 3L5 8L10 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back to Home
            </button>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "999px",
                padding: "6px 16px",
                fontSize: "13px",
                color: "#fff",
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(8px)",
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#a78bfa"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Partner Application
            </div>
          </div>
        </div>

        {/* Hero */}
        <div
          style={{
            textAlign: "center",
            marginTop: "52px",
            marginBottom: "44px",
            padding: "0 16px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <h1
            style={{
              fontSize: "clamp(38px, 6vw, 60px)",
              fontWeight: 800,
              color: "#fff",
              margin: "0 0 16px",
              letterSpacing: "-0.03em",
              lineHeight: 1.08,
              fontFamily: "'Archivo Black', sans-serif",
            }}
          >
            Let's grow together
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: "15px",
              maxWidth: "500px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Tell us about yourself and your goals. We'll review your application and reach out within
            48 hours.
          </p>
        </div>

        {/* Form Card */}
        <div
          style={{
            width: "100%",
            maxWidth: "680px",
            margin: "0 16px 80px",
            padding: "36px",
            borderRadius: "20px",
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.07)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow:
              "0 32px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)",
            position: "relative",
            zIndex: 1,
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Name */}
            <div>
              <label style={labelStyle}>
                Name <span style={{ color: "#a78bfa" }}>*</span>
              </label>
              <input
                className="form-input"
                style={inputStyle}
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>
                Email <span style={{ color: "#a78bfa" }}>*</span>
              </label>
              <input
                className="form-input"
                style={inputStyle}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Social Platform */}
            <div>
              <label style={labelStyle}>
                Social Platform <span style={{ color: "#a78bfa" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <select
                  className="form-input form-select"
                  style={selectStyle}
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  required
                  disabled={isSubmitting}
                >
                  <option value="" disabled>
                    Select platform
                  </option>
                  <option value="youtube">YouTube</option>
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="twitter">Twitter / X</option>
                  <option value="twitch">Twitch</option>
                  <option value="podcast">Podcast</option>
                  <option value="blog">Blog / Website</option>
                  <option value="other">Other</option>
                </select>
                <svg
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                  }}
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>

            {/* Revenue + Followers side by side */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={labelStyle}>
                  Monthly Revenue <span style={{ color: "#a78bfa" }}>optional</span>
                </label>
                <input
                  className="form-input"
                  style={inputStyle}
                  placeholder="e.g., $2,000-$5,000"
                  value={monthlyRevenue}
                  onChange={(e) => setMonthlyRevenue(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label style={labelStyle}>
                  Followers <span style={{ color: "#a78bfa" }}>*</span>
                </label>
                <input
                  className="form-input"
                  style={inputStyle}
                  placeholder="e.g., 25,000"
                  value={followerCount}
                  onChange={(e) => setFollowerCount(e.target.value)}
                  required
                  disabled={isSubmitting}
                  inputMode="numeric"
                />
              </div>
            </div>

            {/* Niche */}
            <div>
              <label style={labelStyle}>
                Niche <span style={{ color: "#a78bfa" }}>*</span>
              </label>
              <input
                className="form-input"
                style={inputStyle}
                placeholder="e.g., Tech reviews, Fitness, Business"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Goals */}
            <div>
              <label style={labelStyle}>
                Goals <span style={{ color: "#a78bfa" }}>*</span>
              </label>
              <textarea
                className="form-input"
                style={{ ...inputStyle, minHeight: "130px", resize: "vertical" }}
                placeholder="Tell us what you want to achieve with Tiviala..."
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <button type="submit" className="submit-btn" disabled={!canSubmit}>
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>

            <p style={{ textAlign: "center", fontSize: "13px", color: "rgba(255,255,255,0.28)", marginTop: "2px" }}>
              We'll review your application and respond within 48 hours.
            </p>
            <p style={{ textAlign: "center", fontSize: "13px", color: "rgba(255,255,255,0.28)", marginTop: "2px" }}>
              We won't work with you if you are botting, racist, political, or any hateful content, no matter the severity.
            </p>

            {status && (
              <p style={{ textAlign: "center", fontSize: "13px", color: statusColor }}>
                {status}
              </p>
            )}
          </form>
        </div>
      </div>
    </>
  );
};