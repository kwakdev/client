// src/pages/ManagementPage.tsx
import React, { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection, query, orderBy, onSnapshot,
  updateDoc, deleteDoc, doc, Timestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Form {
  id: string;
  name: string;
  email: string;
  socialType: string;
  monthlyRevenue: number;
  followerCount: number;
  goals: string;
  niche: string;
  isEmailed: boolean;
  submittedAt: Timestamp | null;
}

const COLORS = ["#7c3aed", "#c026d3", "#06B6D4", "#F59E0B", "#22C55E", "#EF4444"];

// ── Lightweight Bar Chart (pure SVG, no dependencies) ────────────────────────

interface BarChartProps {
  data: { name: string; value: number }[];
  height?: number;
}

const SimpleBarChart: React.FC<BarChartProps> = ({ data, height = 220 }) => {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; label: string; value: number } | null>(null);
  if (!data.length) return <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>No data yet.</p>;

  const W = 100; // percentage-based via viewBox
  const max = Math.max(...data.map((d) => d.value), 1);
  const barW = Math.min(32, (W / data.length) * 0.5);
  const gap  = W / data.length;
  const padB = 28; // space for labels
  const chartH = height - padB;

  return (
    <div style={{ position: "relative" }}>
      <svg
        viewBox={`0 0 ${W} ${height}`}
        preserveAspectRatio="none"
        style={{ width: "100%", height, overflow: "visible" }}
      >
        {/* Gridlines */}
        {[0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={t}
            x1={0} y1={chartH * (1 - t)}
            x2={W} y2={chartH * (1 - t)}
            stroke="rgba(255,255,255,0.06)" strokeWidth="0.4"
          />
        ))}

        <defs>
          <linearGradient id="barG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9b6dff" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>

        {data.map((d, i) => {
          const barH = (d.value / max) * chartH;
          const cx   = gap * i + gap / 2;
          const x    = cx - barW / 2;
          const y    = chartH - barH;
          const r    = Math.min(3, barW / 4);

          return (
            <g key={i}
              onMouseEnter={(e) => {
                const rect = (e.currentTarget.closest("svg") as SVGSVGElement).getBoundingClientRect();
                setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top, label: d.name, value: d.value });
              }}
              onMouseLeave={() => setTooltip(null)}
              style={{ cursor: "default" }}
            >
              {/* Hover hit area */}
              <rect x={cx - gap * 0.4} y={0} width={gap * 0.8} height={chartH} fill="transparent" />
              {/* Bar with rounded top */}
              <path
                d={`M${x + r},${y} h${barW - 2 * r} a${r},${r} 0 0 1 ${r},${r} v${barH - r} h-${barW} v-${barH - r} a${r},${r} 0 0 1 ${r},-${r}z`}
                fill="url(#barG)"
                opacity={0.9}
              />
              {/* X label */}
              <text
                x={cx} y={chartH + 16}
                textAnchor="middle"
                fill="rgba(255,255,255,0.38)"
                fontSize="4"
                fontFamily="'Archivo', sans-serif"
              >
                {d.name.length > 8 ? d.name.slice(0, 7) + "…" : d.name}
              </text>
            </g>
          );
        })}
      </svg>

      {tooltip && (
        <div style={{
          position: "absolute", pointerEvents: "none",
          left: tooltip.x + 8, top: tooltip.y - 8,
          background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "8px", padding: "8px 12px",
          fontSize: "12px", fontFamily: "'Archivo', sans-serif", color: "#fff",
          whiteSpace: "nowrap", zIndex: 10,
        }}>
          <span style={{ color: "rgba(255,255,255,0.5)" }}>{tooltip.label}: </span>
          {tooltip.value.toLocaleString()}
        </div>
      )}
    </div>
  );
};

// ── Lightweight Donut Chart (pure SVG, no dependencies) ───────────────────────

interface DonutChartProps {
  data: { name: string; value: number }[];
  size?: number;
}

const SimpleDonutChart: React.FC<DonutChartProps> = ({ data, size = 220 }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  if (!data.length) return <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>No data yet.</p>;

  const total  = data.reduce((s, d) => s + d.value, 0) || 1;
  const cx     = size / 2;
  const cy     = size / 2;
  const R      = size * 0.36;
  const r      = size * 0.22;

  // Build arc paths
  let cumAngle = -Math.PI / 2;
  const slices = data.map((d, i) => {
    const angle = (d.value / total) * 2 * Math.PI;
    const start = cumAngle;
    cumAngle   += angle;
    const end   = cumAngle;

    const x1 = cx + R * Math.cos(start);
    const y1 = cy + R * Math.sin(start);
    const x2 = cx + R * Math.cos(end);
    const y2 = cy + R * Math.sin(end);
    const ix1 = cx + r * Math.cos(end);
    const iy1 = cy + r * Math.sin(end);
    const ix2 = cx + r * Math.cos(start);
    const iy2 = cy + r * Math.sin(start);
    const large = angle > Math.PI ? 1 : 0;

    // Label position (midpoint of arc)
    const mid  = start + angle / 2;
    const lx   = cx + (R + 18) * Math.cos(mid);
    const ly   = cy + (R + 18) * Math.sin(mid);

    return { path: `M${x1},${y1} A${R},${R} 0 ${large},1 ${x2},${y2} L${ix1},${iy1} A${r},${r} 0 ${large},0 ${ix2},${iy2} Z`, lx, ly, mid, ...d, pct: Math.round((d.value / total) * 100), color: COLORS[i % COLORS.length], i };
  });

  return (
    <div>
      <svg width={size} height={size} style={{ display: "block", margin: "0 auto", overflow: "visible" }}>
        {slices.map((s) => (
          <g key={s.i}
            onMouseEnter={() => setHovered(s.i)}
            onMouseLeave={() => setHovered(null)}
            style={{ cursor: "default", transition: "transform 0.15s" }}
            transform={hovered === s.i ? `translate(${Math.cos(s.mid) * 4},${Math.sin(s.mid) * 4})` : ""}
          >
            <path d={s.path} fill={s.color} opacity={hovered === null || hovered === s.i ? 1 : 0.55} />
          </g>
        ))}

        {/* Centre label */}
        <text x={cx} y={cy - 6} textAnchor="middle" fill="#fff" fontSize="18" fontWeight="700" fontFamily="'Archivo Black', sans-serif">
          {data.length}
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill="rgba(255,255,255,0.38)" fontSize="9" fontFamily="'Archivo', sans-serif">
          platforms
        </text>
      </svg>

      {/* Legend */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px", marginTop: "16px", justifyContent: "center" }}>
        {slices.map((s) => (
          <div key={s.i} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontFamily: "'Archivo', sans-serif", color: hovered === s.i ? "#fff" : "rgba(255,255,255,0.5)", cursor: "default", transition: "color 0.15s" }}
            onMouseEnter={() => setHovered(s.i)}
            onMouseLeave={() => setHovered(null)}
          >
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: s.color, flexShrink: 0, display: "inline-block" }} />
            {s.name} {s.pct}%
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────

export const ManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [forms, setForms]             = useState<Form[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [managerName, setManagerName] = useState("Manager");

  // Auth guard
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) { navigate("/login"); return; }
      setManagerName(user.displayName || user.email || "Manager");
    });
    return () => unsub();
  }, [navigate]);

  // Firestore real-time listener
  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "forms"), orderBy("submittedAt", "desc"));
    const unsub = onSnapshot(q,
      (snap) => {
        setForms(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Form, "id">) })));
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError("Failed to load submissions. Check Firestore rules.");
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const handleLogout = async () => { await signOut(auth); navigate("/login"); };

  const handleToggleIsEmailed = async (id: string, checked: boolean) => {
    setForms((prev) => prev.map((f) => (f.id === id ? { ...f, isEmailed: checked } : f)));
    try {
      await updateDoc(doc(db, "forms", id), { isEmailed: checked });
    } catch {
      setError("Failed to update email status.");
      setForms((prev) => prev.map((f) => (f.id === id ? { ...f, isEmailed: !checked } : f)));
    }
  };

  const handleDeleteForm = async (id: string) => {
    if (!window.confirm("Delete this submission permanently?")) return;
    const prev = forms;
    setForms((f) => f.filter((x) => x.id !== id));
    try {
      await deleteDoc(doc(db, "forms", id));
    } catch {
      setError("Failed to delete submission.");
      setForms(prev);
    }
  };

  // Derived
  const sortedForms = useMemo(() =>
    [...forms].sort((a, b) =>
      b.followerCount !== a.followerCount ? b.followerCount - a.followerCount : b.monthlyRevenue - a.monthlyRevenue
    ), [forms]);

  const topFollowers = useMemo(() =>
    sortedForms.slice(0, 5).map((f) => ({ name: f.name, value: f.followerCount })),
    [sortedForms]);

  const revenueByPlatform = useMemo(() => {
    const g: Record<string, number> = {};
    forms.forEach((f) => { const k = f.socialType?.trim() || "Unknown"; g[k] = (g[k] ?? 0) + (Number(f.monthlyRevenue) || 0); });
    return Object.entries(g).map(([name, value]) => ({ name, value }));
  }, [forms]);

  const totalRevenue   = useMemo(() => forms.reduce((s, f) => s + (Number(f.monthlyRevenue) || 0), 0), [forms]);
  const totalFollowers = useMemo(() => forms.reduce((s, f) => s + (Number(f.followerCount)  || 0), 0), [forms]);

  const formatSubmitted = (ts: Timestamp | null) => {
    if (!ts) return "—";
    try { return ts.toDate().toLocaleString(); } catch { return "—"; }
  };

  const card: React.CSSProperties = {
    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "16px", padding: "28px",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Archivo:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0f; }
        .mgmt-table th, .mgmt-table td { padding: 12px 14px; text-align: left; font-family: 'Archivo', sans-serif; font-size: 13px; }
        .mgmt-table thead tr { border-bottom: 1px solid rgba(255,255,255,0.08); }
        .mgmt-table tbody tr { border-bottom: 1px solid rgba(255,255,255,0.04); transition: background 0.15s; }
        .mgmt-table tbody tr:hover { background: rgba(255,255,255,0.03); }
        .logout-btn { background: none; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 8px 16px; color: rgba(255,255,255,0.45); font-size: 13px; cursor: pointer; font-family: 'Archivo', sans-serif; transition: color 0.2s, border-color 0.2s; }
        .logout-btn:hover { color: #fff; border-color: rgba(255,255,255,0.25); }
        .danger-btn { background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.3); border-radius: 8px; padding: 7px 12px; color: #fca5a5; font-size: 12px; cursor: pointer; font-family: 'Archivo', sans-serif; transition: 0.2s; }
        .danger-btn:hover { background: rgba(239,68,68,0.18); color: #fff; }
        .email-checkbox { width: 16px; height: 16px; cursor: pointer; accent-color: #7c3aed; }
      `}</style>

      <div style={{ minHeight: "100vh", backgroundColor: "#0a0a0f", color: "#fff", fontFamily: "'Archivo', sans-serif", padding: "0 0 80px" }}>

        <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: "800px", height: "500px", pointerEvents: "none", zIndex: 0, background: "radial-gradient(ellipse at center, rgba(109,40,217,0.15) 0%, transparent 70%)", filter: "blur(40px)" }}/>

        {/* Nav */}
        <nav style={{ position: "sticky", top: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", height: "64px", background: "rgba(10,10,15,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "linear-gradient(135deg,#7c3aed,#c026d3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <span style={{ fontWeight: 600, fontSize: "15px" }}>tiviala</span>
            <span style={{ color: "rgba(255,255,255,0.2)", margin: "0 4px" }}>/</span>
            <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>Management</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(109,40,217,0.15)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: "999px", padding: "6px 14px" }}>
              <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#c026d3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700 }}>
                {managerName.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>
                Welcome, <span style={{ color: "#fff", fontWeight: 600 }}>{managerName}</span>
              </span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>Sign Out</button>
          </div>
        </nav>

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px 0", position: "relative", zIndex: 1 }}>

          <div style={{ marginBottom: "36px" }}>
            <h1 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "clamp(26px, 4vw, 38px)", letterSpacing: "-0.03em", marginBottom: "8px" }}>Dashboard</h1>
            <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "14px" }}>All partner applications, sorted by follower count.</p>
          </div>

          {/* Stat cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "32px" }}>
            {[
              { label: "Total Submissions",     value: forms.length.toString() },
              { label: "Total Followers",        value: totalFollowers.toLocaleString() },
              { label: "Total Declared Revenue", value: `$${totalRevenue.toLocaleString()}` },
              { label: "Platforms",              value: revenueByPlatform.length.toString() },
            ].map((s, i) => (
              <div key={i} style={{ ...card, padding: "20px 24px" }}>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.38)", marginBottom: "8px", letterSpacing: "0.05em", textTransform: "uppercase" }}>{s.label}</div>
                <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "26px", letterSpacing: "-0.03em" }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px", marginBottom: "32px" }}>
            <div style={card}>
              <h2 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "24px", color: "rgba(255,255,255,0.7)" }}>Top 5 by Followers</h2>
              <SimpleBarChart data={topFollowers} height={240} />
            </div>
            <div style={card}>
              <h2 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "24px", color: "rgba(255,255,255,0.7)" }}>Revenue by Platform</h2>
              <SimpleDonutChart data={revenueByPlatform} size={200} />
            </div>
          </div>

          {/* Table */}
          <div style={card}>
            <h2 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "20px", color: "rgba(255,255,255,0.7)" }}>
              All Submissions <span style={{ color: "rgba(255,255,255,0.28)", fontWeight: 400 }}>({forms.length})</span>
            </h2>

            {loading ? (
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", padding: "20px 0" }}>Loading...</p>
            ) : error ? (
              <p style={{ color: "#f87171", fontSize: "14px", padding: "20px 0" }}>{error}</p>
            ) : forms.length === 0 ? (
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px", padding: "20px 0" }}>No submissions yet.</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="mgmt-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      {["Name","Email","Platform","Revenue","Followers","Niche","Goals","Will Email","Submitted","Actions"].map((h) => (
                        <th key={h} style={{ color: "rgba(255,255,255,0.38)", fontWeight: 500, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedForms.map((form) => (
                      <tr key={form.id}>
                        <td style={{ color: "#fff", fontWeight: 500 }}>{form.name}</td>
                        <td style={{ color: "rgba(255,255,255,0.5)" }}>{form.email}</td>
                        <td>
                          <span style={{ background: "rgba(109,40,217,0.2)", border: "1px solid rgba(139,92,246,0.25)", borderRadius: "6px", padding: "3px 10px", fontSize: "12px", color: "#a78bfa" }}>
                            {form.socialType}
                          </span>
                        </td>
                        <td style={{ color: "#4ade80" }}>${Number(form.monthlyRevenue || 0).toLocaleString()}</td>
                        <td style={{ color: "rgba(255,255,255,0.7)" }}>{Number(form.followerCount || 0).toLocaleString()}</td>
                        <td style={{ color: "rgba(255,255,255,0.5)" }}>{form.niche}</td>
                        <td style={{ color: "rgba(255,255,255,0.4)", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={form.goals}>{form.goals}</td>
                        <td style={{ textAlign: "center" }}>
                          <input className="email-checkbox" type="checkbox" checked={!!form.isEmailed}
                            onChange={(e) => handleToggleIsEmailed(form.id, e.target.checked)}
                            aria-label={`Mark ${form.name} as will be emailed`}/>
                        </td>
                        <td style={{ color: "rgba(255,255,255,0.35)", whiteSpace: "nowrap" }}>{formatSubmitted(form.submittedAt)}</td>
                        <td>
                          <button className="danger-btn" onClick={() => handleDeleteForm(form.id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};