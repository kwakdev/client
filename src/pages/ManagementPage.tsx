import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

interface Form {
  id: number;
  name: string;
  email: string;
  socialType: string;
  monthlyRevenue: number;
  followerCount: number;
  goals: string;
  niche: string;
  submittedAt: string;
}

// Decode the manager's name from the JWT payload
function getManagerName(): string {
  try {
    const token = localStorage.getItem("token");
    if (!token) return "Manager";
    const payload = JSON.parse(atob(token.split(".")[1]));
    // Try common claim keys
    return payload.name || payload.firstname || payload.email || "Manager";
  } catch {
    return "Manager";
  }
}

const COLORS = ["#7c3aed", "#c026d3", "#06B6D4", "#F59E0B", "#22C55E", "#EF4444"];

export const ManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const managerName = getManagerName();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://localhost:7051/api/forms", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        const data = await res.json();
        setForms(data);
      } catch {
        setError("Failed to load submissions.");
      } finally {
        setLoading(false);
      }
    };
    fetchForms();
  }, []);

  const sortedForms = useMemo(() =>
    [...forms].sort((a, b) =>
      b.followerCount !== a.followerCount
        ? b.followerCount - a.followerCount
        : b.monthlyRevenue - a.monthlyRevenue
    ), [forms]);

  const topFollowers = useMemo(() =>
    sortedForms.slice(0, 5).map(f => ({ name: f.name, followers: f.followerCount })),
    [sortedForms]);

  const revenueByPlatform = useMemo(() => {
    const grouped: Record<string, number> = {};
    forms.forEach(f => {
      grouped[f.socialType] = (grouped[f.socialType] ?? 0) + f.monthlyRevenue;
    });
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [forms]);

  const totalRevenue = useMemo(() => forms.reduce((s, f) => s + f.monthlyRevenue, 0), [forms]);
  const totalFollowers = useMemo(() => forms.reduce((s, f) => s + f.followerCount, 0), [forms]);

  const renderPieLabel = ({ name, percent }: { name?: string; percent?: number }) =>
    `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`;

  const cardStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "16px",
    padding: "28px",
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
        .recharts-text { fill: rgba(255,255,255,0.45) !important; font-family: 'Archivo', sans-serif !important; font-size: 12px !important; }
        .recharts-cartesian-grid line { stroke: rgba(255,255,255,0.06) !important; }
        .recharts-tooltip-wrapper .recharts-default-tooltip { background: #1a1a2e !important; border: 1px solid rgba(255,255,255,0.1) !important; border-radius: 8px !important; font-family: 'Archivo', sans-serif !important; }
        .recharts-legend-item-text { color: rgba(255,255,255,0.5) !important; font-size: 12px !important; }
      `}</style>

      <div style={{ minHeight: "100vh", backgroundColor: "#0a0a0f", color: "#fff", fontFamily: "'Archivo', sans-serif", padding: "0 0 80px" }}>

        {/* Purple orb */}
        <div style={{
          position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)",
          width: "800px", height: "500px", pointerEvents: "none", zIndex: 0,
          background: "radial-gradient(ellipse at center, rgba(109,40,217,0.15) 0%, transparent 70%)",
          filter: "blur(40px)",
        }} />

        {/* Nav */}
        <nav style={{
          position: "sticky", top: 0, zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 40px", height: "64px",
          background: "rgba(10,10,15,0.9)", backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
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
            {/* Welcome chip */}
            <div style={{
              display: "flex", alignItems: "center", gap: "8px",
              background: "rgba(109,40,217,0.15)", border: "1px solid rgba(139,92,246,0.2)",
              borderRadius: "999px", padding: "6px 14px",
            }}>
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

          {/* Page heading */}
          <div style={{ marginBottom: "36px" }}>
            <h1 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "clamp(26px, 4vw, 38px)", letterSpacing: "-0.03em", marginBottom: "8px" }}>
              Dashboard
            </h1>
            <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "14px" }}>
              All partner applications, sorted by follower count.
            </p>
          </div>

          {/* Stat cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "32px" }}>
            {[
              { label: "Total Submissions", value: forms.length.toString() },
              { label: "Total Followers", value: totalFollowers.toLocaleString() },
              { label: "Total Declared Revenue", value: `$${totalRevenue.toLocaleString()}` },
              { label: "Platforms", value: revenueByPlatform.length.toString() },
            ].map((s, i) => (
              <div key={i} style={{ ...cardStyle, padding: "20px 24px" }}>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.38)", marginBottom: "8px", letterSpacing: "0.05em", textTransform: "uppercase" }}>{s.label}</div>
                <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "26px", letterSpacing: "-0.03em" }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px", marginBottom: "32px" }}>
            <div style={cardStyle}>
              <h2 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "24px", color: "rgba(255,255,255,0.7)" }}>Top 5 by Followers</h2>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={topFollowers} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontFamily: "'Archivo', sans-serif", fontSize: "13px" }} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                  <Bar dataKey="followers" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#9b6dff" />
                      <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={cardStyle}>
              <h2 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "24px", color: "rgba(255,255,255,0.7)" }}>Revenue by Platform</h2>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={revenueByPlatform} dataKey="value" nameKey="name" outerRadius={95} innerRadius={45} paddingAngle={3} label={renderPieLabel} labelLine={false}>
                    {revenueByPlatform.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontFamily: "'Archivo', sans-serif", fontSize: "13px" }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px", color: "rgba(255,255,255,0.45)" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table */}
          <div style={cardStyle}>
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
                      {["Name", "Email", "Platform", "Revenue", "Followers", "Niche", "Goals", "Submitted"].map(h => (
                        <th key={h} style={{ color: "rgba(255,255,255,0.38)", fontWeight: 500, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedForms.map(form => (
                      <tr key={form.id}>
                        <td style={{ color: "#fff", fontWeight: 500 }}>{form.name}</td>
                        <td style={{ color: "rgba(255,255,255,0.5)" }}>{form.email}</td>
                        <td>
                          <span style={{ background: "rgba(109,40,217,0.2)", border: "1px solid rgba(139,92,246,0.25)", borderRadius: "6px", padding: "3px 10px", fontSize: "12px", color: "#a78bfa" }}>
                            {form.socialType}
                          </span>
                        </td>
                        <td style={{ color: "#4ade80" }}>${form.monthlyRevenue.toLocaleString()}</td>
                        <td style={{ color: "rgba(255,255,255,0.7)" }}>{form.followerCount.toLocaleString()}</td>
                        <td style={{ color: "rgba(255,255,255,0.5)" }}>{form.niche}</td>
                        <td style={{ color: "rgba(255,255,255,0.4)", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{form.goals}</td>
                        <td style={{ color: "rgba(255,255,255,0.35)", whiteSpace: "nowrap" }}>{new Date(form.submittedAt).toLocaleDateString()}</td>
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