import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
interface MainPageProps {
  onApply?: () => void;
}

export const MainPage: React.FC<MainPageProps> = ({ onApply }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleApply = () => {
    if (onApply) onApply();
    navigate("/formpage");
  };

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".fade-up");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = "1";
            (entry.target as HTMLElement).style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  const CERT_IMG_SRC = "/Rory_Pribble_Consulting_Cert.jpg";

  const faqs = [
    { q: "How does the profit share work?", a: "We take a small percentage of the revenue we help you generate — nothing upfront. If you don't earn, we don't earn. It's that simple." },
    { q: "What size creators do you work with?", a: "We work with creators from 5K followers all the way to 1M+. What matters more than size is engagement, niche, and your growth trajectory." },
    { q: "What exactly do you handle?", a: "Brand deals, content strategy, monetization systems, product launches, sponsorship negotiations, and analytics. Basically the business side so you can focus on creating." },
    { q: "How long are partnerships?", a: "We start with a 3-month trial period. Most creators stay long-term — our average partnership is 14 months and counting." },
    { q: "Why 'shadow operator'?", a: "We work behind the scenes. Your audience never knows we exist. We're your invisible infrastructure — strategy, ops, and deals — all handled quietly." },
    {
      q: "Why should you trust us?",
      a: (
        <div style={{ display: "grid", gap: "14px" }}>
          <p style={{ margin: 0 }}>
            We don't ask for blind trust — we show proof of process. Our work is built on repeatable
            operator frameworks and documented systems, not vague "growth hacks."
          </p>

          <div
            style={{
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "14px",
              overflow: "hidden",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <img
              src={CERT_IMG_SRC}
              alt="Operator frameworks certificate"
              style={{ width: "100%", display: "block" }}
            />
          </div>

          <p style={{ margin: 0, color: "rgba(255,255,255,0.55)", fontSize: "13px", lineHeight: 1.7 }}>
            This certificate is an example of the kind of structured methodology we use: clear systems,
            measurable outcomes, and accountable execution.
          </p>
        </div>
      ),
    },
  ];

  const iconBox = (icon: React.ReactNode) => (
    <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(109,40,217,0.25)", border: "1px solid rgba(139,92,246,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#a78bfa", marginBottom: "20px", flexShrink: 0 }}>
      {icon}
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Archivo:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        .fade-up {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.65s ease, transform 0.65s ease;
        }

        .nav-link {
          color: rgba(255,255,255,0.5);
          font-size: 14px;
          text-decoration: none;
          font-family: 'Archivo', sans-serif;
          transition: color 0.2s;
          background: none; border: none; cursor: pointer; padding: 0;
        }
        .nav-link:hover { color: #fff; }

        .cta-primary {
          background: linear-gradient(90deg, #7c3aed, #c026d3);
          color: #fff; border: none; border-radius: 999px;
          padding: 14px 28px; font-size: 15px; font-weight: 600;
          font-family: 'Archivo', sans-serif; cursor: pointer;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 24px rgba(168,85,247,0.35);
          display: inline-flex; align-items: center; gap: 8px;
        }
        .cta-primary:hover { opacity: 0.88; transform: translateY(-1px); }
        .cta-primary:active { transform: scale(0.98); }

        .cta-ghost {
          background: none; color: rgba(255,255,255,0.75);
          border: none; font-size: 15px; font-weight: 500;
          font-family: 'Archivo', sans-serif; cursor: pointer;
          padding: 14px 20px; transition: color 0.2s;
          display: inline-flex; align-items: center; gap: 8px;
        }
        .cta-ghost:hover { color: #fff; }

        .card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; padding: 28px;
          transition: border-color 0.2s, background 0.2s;
        }
        .card:hover { background: rgba(255,255,255,0.05); border-color: rgba(139,92,246,0.2); }

        .faq-row {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 20px 24px;
          cursor: pointer; transition: background 0.2s, border-color 0.2s;
          display: flex; align-items: center; justify-content: space-between; gap: 16px;
        }
        .faq-row:hover { background: rgba(255,255,255,0.05); border-color: rgba(139,92,246,0.2); }

        .apply-white {
          background: #fff; color: #000; border: none; border-radius: 999px;
          padding: 16px 36px; font-size: 15px; font-weight: 700;
          font-family: 'Archivo', sans-serif; cursor: pointer;
          display: inline-flex; align-items: center; gap: 10px;
          transition: opacity 0.2s, transform 0.15s;
        }
        .apply-white:hover { opacity: 0.9; transform: translateY(-1px); }

        @media (max-width: 700px) {
          .three-col { grid-template-columns: 1fr !important; }
          .two-col { grid-template-columns: 1fr !important; }
          .stats-row { grid-template-columns: 1fr 1fr !important; }
          .hero-btns { flex-direction: column !important; align-items: center !important; }
          .nav-links { display: none !important; }
        }
      `}</style>

      <div style={{ minHeight: "100vh", backgroundColor: "#0a0a0f", fontFamily: "'Archivo', sans-serif", color: "#fff", overflowX: "hidden" }}>

        {/* ── NAV ── */}
        <nav style={{
          position: "sticky", top: 0, zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 48px", height: "64px",
          background: "rgba(10,10,15,0.85)", backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg,#7c3aed,#c026d3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "16px", letterSpacing: "-0.01em" }}>tiviala</span>
          </div>

          {/* Nav links */}
          <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            <a href="#how" className="nav-link">How It Works</a>
            <a href="#why" className="nav-link">Why Tiviala</a>
            <a href="#data" className="nav-link">Our Approach</a>
            <a href="#faq" className="nav-link">FAQ</a>
          </div>

          <button className="cta-primary" style={{ padding: "9px 20px", fontSize: "13px" }} onClick={handleApply}>
            Apply to Partner
          </button>
        </nav>

        {/* ── HERO ── */}
        <section style={{ position: "relative", textAlign: "center", padding: "100px 24px 90px", overflow: "hidden" }}>
          {/* Purple orb */}
          <div style={{
            position: "absolute", top: "-10%", left: "50%", transform: "translateX(-50%)",
            width: "900px", height: "700px", pointerEvents: "none",
            background: "radial-gradient(ellipse at center, rgba(109,40,217,0.28) 0%, rgba(76,29,149,0.1) 45%, transparent 70%)",
            filter: "blur(40px)", zIndex: 0,
          }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Badge */}
            <div className="fade-up" style={{ transitionDelay: "0.05s", display: "inline-flex", alignItems: "center", gap: "8px", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "999px", padding: "7px 18px", fontSize: "13px", color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.04)", marginBottom: "36px", backdropFilter: "blur(8px)" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              The silent force behind creator success
            </div>

            <h1 className="fade-up" style={{ transitionDelay: "0.12s", fontFamily: "'Archivo Black', sans-serif", fontSize: "clamp(52px, 8vw, 90px)", lineHeight: 1.0, letterSpacing: "-0.03em", margin: "0 auto 20px" }}>
              You create.<br />
              <span style={{ background: "linear-gradient(90deg, #9b6dff, #e040fb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                We multiply.
              </span>
            </h1>

            <p className="fade-up" style={{ transitionDelay: "0.2s", color: "rgba(255,255,255,0.45)", fontSize: "clamp(15px, 1.8vw, 17px)", maxWidth: "560px", margin: "0 auto 44px", lineHeight: 1.75 }}>
              Tiviala is your invisible growth partner. We handle strategy, operations, and monetization while you focus on what you love—creating. We only win when you win.
            </p>

            <div className="fade-up hero-btns" style={{ transitionDelay: "0.28s", display: "flex", gap: "4px", justifyContent: "center", alignItems: "center" }}>
              <button className="cta-primary" onClick={handleApply}>
                Apply to Partner <span>→</span>
              </button>
              <button className="cta-ghost" onClick={() => document.getElementById("how")?.scrollIntoView({ behavior: "smooth" })}>
                See How It Works
              </button>
            </div>

            {/* Stats */}
            <div className="fade-up stats-row" style={{ transitionDelay: "0.36s", display: "grid", gridTemplateColumns: "repeat(3,1fr)", maxWidth: "520px", margin: "72px auto 0", gap: "0" }}>
              {[
                { v: "200+", l: "Creators Partnered" },
                { v: "$4.2M", l: "Revenue Generated" },
                { v: "3.5x", l: "Avg. Growth Rate" },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: "center", padding: "0 16px", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                  <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "clamp(28px, 4vw, 38px)", letterSpacing: "-0.03em", marginBottom: "4px" }}>{s.v}</div>
                  <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.38)" }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how" style={{ padding: "100px 24px", maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <div className="fade-up" style={{ fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#9b6dff", marginBottom: "16px", fontWeight: 600 }}>How It Works</div>
            <h2 className="fade-up" style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "clamp(32px, 5vw, 52px)", letterSpacing: "-0.03em", lineHeight: 1.05 }}>
              Simple. Transparent. Aligned.
            </h2>
          </div>

          <div className="three-col fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "20px" }}>
            {[
              {
                n: "01",
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>,
                title: "Apply & Get Matched",
                desc: "Tell us about your brand and goals. We assess fit and assign you a dedicated growth strategist.",
              },
              {
                n: "02",
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
                title: "We Build Your Engine",
                desc: "From content strategy to monetization systems, we build the infrastructure that scales your income.",
              },
              {
                n: "03",
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
                title: "Grow & Share Success",
                desc: "As your revenue grows, we take a small percentage. Zero upfront cost—we only profit when you do.",
              },
            ].map((step, i) => (
              <div key={i} className="card">
                <div style={{ fontSize: "13px", color: "#9b6dff", fontWeight: 600, marginBottom: "20px", letterSpacing: "0.02em" }}>{step.n}</div>
                {iconBox(step.icon)}
                <h3 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "18px", letterSpacing: "-0.02em", marginBottom: "12px" }}>{step.title}</h3>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.42)", lineHeight: 1.75 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── WHY TIVIALA ── */}
        <section id="why" style={{ padding: "100px 24px", maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <div className="fade-up" style={{ fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#9b6dff", marginBottom: "16px", fontWeight: 600 }}>Why Tiviala</div>
            <h2 className="fade-up" style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "clamp(32px, 5vw, 56px)", letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: "20px" }}>
              Your unfair advantage
            </h2>
            <p className="fade-up" style={{ color: "rgba(255,255,255,0.42)", fontSize: "16px", maxWidth: "520px", margin: "0 auto", lineHeight: 1.7 }}>
              We're not an agency. We're your shadow partner—working invisibly to amplify everything you do.
            </p>
          </div>

          <div className="three-col fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px" }}>
            {[
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
                title: "Zero Risk",
                desc: "No upfront fees, no retainers. We invest in you first and only earn when you succeed.",
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><bolt/><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
                title: "Full-Stack Support",
                desc: "Strategy, content optimization, brand deals, product launches—we handle it all.",
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
                title: "Dedicated Team",
                desc: "Your personal growth squad working behind the scenes, 7 days a week.",
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
                title: "Data-Driven Growth",
                desc: "We use analytics and market insights to find untapped revenue opportunities.",
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
                title: "Time Freedom",
                desc: "Stop juggling business tasks. Focus purely on creating while we handle the rest.",
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
                title: "Aligned Incentives",
                desc: "Our success is tied to yours. We're genuinely invested in your growth.",
              },
            ].map((f, i) => (
              <div key={i} className="card">
                {iconBox(f.icon)}
                <h3 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "17px", letterSpacing: "-0.02em", marginBottom: "10px" }}>{f.title}</h3>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.42)", lineHeight: 1.75 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── DATA DRIVEN ── */}
        <section id="data" style={{ padding: "100px 24px", maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <div className="fade-up" style={{ fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#9b6dff", marginBottom: "16px", fontWeight: 600 }}>Data-Driven Approach</div>
            <h2 className="fade-up" style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "clamp(30px, 5vw, 52px)", letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: "20px" }}>
              How we estimate your potential
            </h2>
            <p className="fade-up" style={{ color: "rgba(255,255,255,0.42)", fontSize: "16px", maxWidth: "520px", margin: "0 auto", lineHeight: 1.7 }}>
              We don't guess. We use real engagement data and industry conversion rates to project what you could earn.
            </p>
          </div>

          <div className="two-col fade-up" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            {[
              {
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
                title: "Engagement Analysis",
                desc: "We analyze your likes, comments, shares, and watch time to understand how engaged your audience truly is.",
              },
              {
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>,
                title: "Conversion Tracking",
                desc: "Using industry benchmarks and our database of 200+ creators, we estimate your conversion potential across different revenue streams.",
              },
              {
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
                title: "Growth Modeling",
                desc: "We project your revenue growth based on engagement patterns, niche performance data, and proven monetization strategies.",
              },
              {
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
                title: "Revenue Estimate",
                desc: "You get a clear, data-backed estimate of what you could earn with optimized brand deals, products, and sponsorships.",
              },
            ].map((item, i) => (
              <div key={i} className="card" style={{ padding: "32px" }}>
                {iconBox(item.icon)}
                <h3 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "18px", letterSpacing: "-0.02em", marginBottom: "12px" }}>{item.title}</h3>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.42)", lineHeight: 1.75 }}>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Example breakdown card */}
          <div className="fade-up" style={{
            background: "rgba(109,40,217,0.08)", border: "1px solid rgba(139,92,246,0.2)",
            borderRadius: "16px", padding: "36px 40px",
          }}>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: "28px" }}>Example Breakdown</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px", marginBottom: "20px" }}>
              {[
                { v: "4.2%", l: "Avg. Engagement Rate", c: "#9b6dff" },
                { v: "2.1%", l: "Conversion Rate", c: "#e040fb" },
                { v: "$8.5K", l: "Monthly Potential", c: "#fff" },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "clamp(24px, 3vw, 32px)", color: s.c, letterSpacing: "-0.03em", marginBottom: "6px" }}>{s.v}</div>
                  <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.38)" }}>{s.l}</div>
                </div>
              ))}
            </div>
            <p style={{ textAlign: "center", fontSize: "12px", color: "rgba(255,255,255,0.28)", fontStyle: "italic" }}>
              *Based on a creator with 50K followers, 4.2% engagement, in the business niche
            </p>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" style={{ padding: "100px 24px", maxWidth: "760px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <div className="fade-up" style={{ fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#9b6dff", marginBottom: "16px", fontWeight: 600 }}>FAQ</div>
            <h2 className="fade-up" style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "clamp(32px, 5vw, 56px)", letterSpacing: "-0.03em" }}>
              Questions? Answered.
            </h2>
          </div>

          <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {faqs.map((faq, i) => (
              <div key={i}>
                <div className="faq-row" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span style={{ fontSize: "15px", fontWeight: 500, fontFamily: "'Archivo', sans-serif" }}>{faq.q}</span>
                  <div style={{
                    width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0,
                    background: "rgba(109,40,217,0.25)", border: "1px solid rgba(139,92,246,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#a78bfa", fontSize: "18px", fontWeight: 300,
                    transition: "transform 0.2s",
                    transform: openFaq === i ? "rotate(45deg)" : "none",
                  }}>+</div>
                </div>
                {openFaq === i && (
                  <div style={{ padding: "16px 24px 20px", fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: 1.75 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section style={{ padding: "20px 24px 100px", maxWidth: "1000px", margin: "0 auto" }}>
          <div className="fade-up" style={{ position: "relative", borderRadius: "24px", overflow: "visible", textAlign: "center", padding: "80px 40px 64px" }}>
            {/* Bg */}
            <div style={{
              position: "absolute", inset: 0, borderRadius: "24px",
              background: "linear-gradient(135deg, rgba(109,40,217,0.25) 0%, rgba(192,38,211,0.15) 100%)",
              border: "1px solid rgba(139,92,246,0.2)",
              backdropFilter: "blur(20px)",
            }} />
            {/* Icon circle */}
            <div style={{
              position: "absolute", top: "-28px", left: "50%", transform: "translateX(-50%)",
              width: "56px", height: "56px", borderRadius: "50%",
              background: "linear-gradient(135deg, #7c3aed, #c026d3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 20px rgba(168,85,247,0.5)",
              zIndex: 2,
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>

            <div style={{ position: "relative", zIndex: 1 }}>
              <h2 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "clamp(30px, 5vw, 54px)", letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: "20px" }}>
                Ready to scale your<br />
                <span style={{ background: "linear-gradient(90deg, #9b6dff, #e040fb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  creator business?
                </span>
              </h2>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "15px", maxWidth: "440px", margin: "0 auto 36px", lineHeight: 1.75 }}>
                Join 200+ creators who've unlocked exponential growth with a shadow partner that's fully invested in their success.
              </p>
              <button className="apply-white" onClick={handleApply}>
                Apply Now — It's Free <span>→</span>
              </button>
              <p style={{ marginTop: "16px", fontSize: "13px", color: "rgba(255,255,255,0.28)" }}>
                Limited spots available · Response within 48 hours
              </p>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "32px 48px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "20px", marginBottom: "28px" }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg,#7c3aed,#c026d3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </div>
              <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "15px" }}>tiviala</span>
            </div>

            {/* Contact */}
            <a
              href="mailto:info@tiviala.com"
              style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", color: "rgba(255,255,255,0.38)", fontSize: "14px", fontFamily: "'Archivo', sans-serif", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.38)")}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              info@tiviala.com
            </a>
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.22)" }}>
              © 2026 Tiviala. All rights reserved. Built for creators, by creators.
            </span>
            <button
              onClick={() => navigate("/login")}
              style={{
                background: "none", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px",
                padding: "7px 14px", fontSize: "12px", color: "rgba(255,255,255,0.25)",
                cursor: "pointer", fontFamily: "'Archivo', sans-serif",
                transition: "color 0.2s, border-color 0.2s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.25)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; }}
            >
              Management
            </button>
          </div>
        </footer>
      </div>
    </>
  );
};