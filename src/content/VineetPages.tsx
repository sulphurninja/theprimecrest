/* eslint-disable @next/next/no-img-element */
const IMG = "/issues/vineet";

const CREAM = "#f4efe6";
const TEAL = "#2d8a7b";
const TEAL_DARK = "#1e6b5f";
const CREAM_DIM = "rgba(244, 239, 230, 0.66)";

export const VINEET_TOC = [
  { page: 0, label: "Cover" },
  { page: 1, label: "Credits" },
  { page: 2, label: "The Subject" },
  { page: 3, label: "Contents" },
  { page: 5, label: "Root Causes" },
  { page: 6, label: "Growth vs Execution" },
  { page: 7, label: "Cross-Industry Lessons" },
  { page: 8, label: "Consumer Insights" },
  { page: 9, label: "Execution Failures" },
  { page: 10, label: "Future Ready" },
  { page: 11, label: "The Portrait" },
  { page: 12, label: "PrimeCrest" },
];

export function VineetPages() {
  return (
    <>
      {/* 01 Cover — single, hard */}
      <article className="mag-page mag-bleed" data-density="hard">
        <img
          className="mag-fill"
          src={`${IMG}/coverart.jpg`}
          alt="Vineet Trakroo"
          fetchPriority="high"
        />
        <div className="mag-overlay">
          {/* Masthead — the magazine, front and centre */}
          <div style={{ textAlign: "center" }}>
            <img
              src="/brand/logo-primecrest.png"
              alt="PrimeCrest"
              style={{
                width: "76%",
                maxWidth: 560,
                height: "auto",
                filter: "drop-shadow(0 6px 22px rgba(0,0,0,0.55))",
              }}
            />
            <div
              style={{
                margin: "18px auto 0",
                paddingTop: 12,
                borderTop: "1px solid rgba(244,239,230,0.45)",
                maxWidth: 560,
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                fontSize: 11.5,
                fontWeight: 600,
                letterSpacing: "0.26em",
                textTransform: "uppercase",
                color: CREAM,
              }}
            >
              Vol. III · The Evolution Issue · theprimecrest.com
            </div>
          </div>

          {/* Cover line — kept in the clear left column, off the portrait */}
          <div style={{ marginTop: "auto", maxWidth: 330 }}>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                fontSize: 12.5,
                fontWeight: 700,
                letterSpacing: "0.26em",
                textTransform: "uppercase",
                color: TEAL,
              }}
            >
              Making a difference
              <br />
              in 2026
            </p>
            <h1
              className="mag-display"
              style={{
                marginTop: 16,
                color: "#fff",
                fontSize: 52,
                lineHeight: 1.02,
                textShadow: "0 8px 32px rgba(0,0,0,0.55)",
              }}
            >
              Top 10
              <br />
              Unstoppable
              <br />
              Business
              <br />
              Leaders<span style={{ color: TEAL }}>.</span>
            </h1>
            <div
              style={{
                marginTop: 24,
                paddingTop: 16,
                borderTop: "1px solid rgba(244,239,230,0.4)",
              }}
            >
              <p className="mag-display" style={{ fontSize: 34, color: CREAM }}>
                Vineet Trakroo
              </p>
              <p
                style={{
                  margin: "8px 0 0",
                  fontFamily: "var(--font-sans), system-ui, sans-serif",
                  fontSize: 12.5,
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: CREAM,
                }}
              >
                CEO &amp; Chief Evolution Officer
              </p>
              <p
                style={{
                  margin: "6px 0 0",
                  fontFamily: "var(--font-serif), Georgia, serif",
                  fontSize: 16,
                  fontStyle: "italic",
                  color: "rgba(244,239,230,0.88)",
                }}
              >
                Evolution Strategy Advisors LLP · India
              </p>
            </div>
          </div>
        </div>
        <img className="mag-qr" src="/brand/barcode-primecrest.png" alt="Scan to visit theprimecrest.com" />
      </article>

      {/* 02 Credits — left, dark */}
      <article className="mag-page mag-pad mag-dark">
        <div className="mag-body">
        <p className="mag-kicker" style={{ color: TEAL }}>
          The imprint
        </p>
        <h2
          className="mag-h"
          style={{ color: CREAM, fontStyle: "italic", fontWeight: 500, fontSize: 58, marginBottom: 34 }}
        >
          Credits.
        </h2>
        <ul
          className="mag-credits-list"
          style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-evenly" }}
        >
          <li>
            <b style={{ color: TEAL }}>Magazine</b>
            <span>PrimeCrest · theprimecrest.com</span>
          </li>
          <li>
            <b style={{ color: TEAL }}>Published by</b>
            <span>Fortiora Group LLC</span>
          </li>
          <li>
            <b style={{ color: TEAL }}>Editorial &amp; Design</b>
            <span>Fortiora Studio</span>
          </li>
          <li>
            <b style={{ color: TEAL }}>Digital Production</b>
            <span>Fortiora Studio</span>
          </li>
          <li>
            <b style={{ color: TEAL }}>Featured Subject</b>
            <span>Vineet Trakroo</span>
          </li>
          <li>
            <b style={{ color: TEAL }}>Words</b>
            <span>From the interviews of Vineet Trakroo</span>
          </li>
          <li>
            <b style={{ color: TEAL }}>Issue</b>
            <span>Vol. III · The Evolution Issue</span>
          </li>
        </ul>
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            textAlign: "center",
          }}
        >
          <img
            src="/brand/logo-primecrest.png"
            alt="PrimeCrest"
            style={{ width: 300, height: "auto" }}
          />
          <p className="mag-imprint">
            <strong>PrimeCrest</strong> · a product of Fortiora Group LLC
            <br />
            30 N Gould St Ste R, Sheridan, WY 82801, United States
            <br />
            Hello@thefortiora.com · <strong>theprimecrest.com</strong>
          </p>
          <img
            src="/brand/barcode-primecrest.png"
            alt="Scan to visit theprimecrest.com"
            style={{ width: 178, height: "auto" }}
          />
          <p className="mag-imprint" style={{ fontSize: 11, color: "rgba(244,239,230,0.45)", maxWidth: 520 }}>
            © 2026 Fortiora Group LLC. All rights reserved. No part of this publication may be
            reproduced or transmitted in any form without prior written permission from the
            publisher.
          </p>
        </div>
        </div>
      </article>

      {/* 03 The subject — right */}
      <article className="mag-page mag-pad">
        <div className="mag-body">
        <p className="mag-kicker" style={{ color: TEAL_DARK }}>The Subject</p>
        <h2 className="mag-h mag-h-sm">Evolving enterprises through strategy and execution.</h2>
        <div style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <p className="mag-folio mag-dropcap">
              Vineet Trakroo is the CEO &amp; Chief Evolution Officer at Evolution Strategy
              Advisors LLP, where he helps organizations diagnose and solve their most pressing
              growth challenges. With decades of experience across FMCG, automobiles, pharma,
              consumer products, and building materials, he brings a rare cross-industry
              perspective to commercial strategy.
            </p>
            <p className="mag-folio">
              His philosophy is straightforward: growth problems are rarely just sales or
              marketing problems. The real bottlenecks hide deeper — in culture, leadership,
              strategic choices, and team capabilities. Finding them requires rigorous inquiry
              and the courage to look where others don&apos;t.
            </p>
          </div>
          <div style={{ width: 188, flexShrink: 0, textAlign: "center", paddingTop: 8 }}>
            <img className="mag-avatar" src={`${IMG}/portrait2.jpg`} alt="Vineet Trakroo" style={{ objectPosition: "center 20%" }} />
            <p className="mag-by">Vineet Trakroo</p>
            <p className="mag-role">Strategy · Execution · Growth</p>
          </div>
        </div>
        <blockquote className="mag-pull" style={{ margin: "auto 12px", color: TEAL_DARK }}>
          Sales is merely the effect, the final leg of the entire commercial engine.
        </blockquote>
        <p
          className="mag-folio"
          style={{ marginTop: "auto", fontStyle: "italic", textAlign: "right", color: TEAL_DARK, fontSize: 16 }}
        >
          Growth, strategy, execution, future readiness — these are his watchwords.
        </p>
        </div>
      </article>

      {/* 04–05 Contents spread */}
      <article className="mag-page mag-bleed">
        <img className="mag-spread-photo is-left" src={`${IMG}/portrait1.jpg`} alt="" style={{ objectPosition: "center 30%" }} />
        <div className="mag-scrim" />
        <div className="mag-overlay">
          <span className="mag-banner" style={{ background: TEAL }}>The Evolution Issue</span>
          <p className="mag-num">04</p>
          <h2 className="mag-h mag-h-light" style={{ maxWidth: 540, fontSize: 36 }}>
            A masterclass in diagnosing growth, told by the strategist who fixes it.
          </h2>
          <div style={{ marginTop: "auto" }}>
            <p
              style={{
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                fontSize: 13,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: TEAL,
                marginBottom: 8,
              }}
            >
              10 · Future Ready
            </p>
            <p
              style={{
                fontFamily: "var(--font-serif), Georgia, serif",
                fontSize: 16,
                color: "rgba(244,239,230,0.88)",
                maxWidth: 360,
              }}
            >
              What Indian B2C leaders should start changing today to build sustainable
              growth through 2030.
            </p>
          </div>
        </div>
      </article>

      <article className="mag-page mag-bleed">
        <img className="mag-spread-photo is-right" src={`${IMG}/portrait1.jpg`} alt="" style={{ objectPosition: "center 30%" }} />
        <div className="mag-scrim" />
        <p className="mag-vert" style={{ color: TEAL }}>
          C<span style={{ background: TEAL }} />NTENTS
        </p>
        <div className="mag-overlay" style={{ paddingRight: 120 }}>
          <p className="mag-kicker mag-kicker-light">In this issue</p>
          <ol className="mag-toc">
            <li>
              <span>Root Causes</span>
              <em style={{ color: TEAL }}>06</em>
            </li>
            <li>
              <span>Growth vs Execution</span>
              <em style={{ color: TEAL }}>07</em>
            </li>
            <li>
              <span>Cross-Industry Lessons</span>
              <em style={{ color: TEAL }}>08</em>
            </li>
            <li>
              <span>Consumer Insights</span>
              <em style={{ color: TEAL }}>09</em>
            </li>
            <li>
              <span>Execution Failures</span>
              <em style={{ color: TEAL }}>10</em>
            </li>
            <li>
              <span>Future Ready</span>
              <em style={{ color: TEAL }}>11</em>
            </li>
            <li>
              <span>The Portrait</span>
              <em style={{ color: TEAL }}>12</em>
            </li>
          </ol>
        </div>
      </article>

      {/* 06 Root Causes */}
      <article className="mag-page mag-pad">
        <div className="mag-body">
        <p className="mag-kicker" style={{ color: TEAL_DARK }}>Root Causes</p>
        <h2 className="mag-h">&ldquo;What is usually hiding underneath?&rdquo;</h2>
        <div className="mag-cols mag-folio mag-dropcap" style={{ fontSize: 18, lineHeight: 1.9 }}>
          <p style={{ margin: "0 0 14px" }}>
            Sales is merely the effect, the final leg of the entire commercial engine. If sales
            figures fall short of targets, diagnosing the problem requires rigorous inquiry into
            the underlying root causes. Because multiple functions contribute to performance, the
            bottlenecks rarely sit in a single department.
          </p>
          <p style={{ margin: "0 0 14px" }}>
            Underneath sluggish numbers, you typically find deeper, softer organizational friction:
            misaligned culture, leadership gaps, flawed strategic choices, or team competency
            deficits. Even delivery processes and poor customer experience design can quietly
            derail top-line momentum.
          </p>
          <p style={{ margin: 0 }}>
            Fortunately, modern organizations generate rich departmental data, making diagnostic
            discovery much faster. Operational friction reveals itself in supply chain
            inefficiencies, customer satisfaction drop-offs, or poor sales productivity. The real
            story is always in the data; leadership just needs to look deeper.
          </p>
        </div>
        <blockquote className="mag-pull" style={{ margin: "auto 12px", fontSize: 32, color: TEAL_DARK }}>
          The real story is always in the data.
        </blockquote>
        <p className="mag-foot">The Evolution Issue · 06</p>
        </div>
      </article>

      {/* 07 Growth vs Execution — dark ledger */}
      <article className="mag-page mag-pad mag-dark">
        <div className="mag-body">
        <p className="mag-kicker" style={{ color: TEAL }}>
          Growth vs Execution
        </p>
        <h2 className="mag-h mag-h-light" style={{ fontSize: 34 }}>
          Knowing the difference changes everything.
        </h2>
        <ul
          style={{
            listStyle: "none",
            margin: "10px 0 0",
            padding: 0,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
          }}
        >
          {[
            ["Growth Problem", "Strategic", "Tied to market headroom, category choices, and positioning. Can often be solved through tactical pivots with fast turnarounds."],
            ["Execution Problem", "Systemic", "A structural leak in the bucket. If sales productivity is chronically low, the issue is operational."],
            ["Interdependence", "Critical", "A brilliant strategic growth thesis will fail if the execution engine cannot deliver."],
            ["Market Share", "Headroom", "If a brand hits 50% market share in a mature segment, growth requires targeting entirely new customer segments."],
            ["Infrastructure", "Foundation", "Fixing execution takes longer because it requires re-engineering infrastructure and driving organizational adoption."],
          ].map(([title, type, note]) => (
            <li
              key={title}
              style={{ padding: "15px 0", borderBottom: "1px solid rgba(244,239,230,0.16)" }}
            >
              <p
                style={{
                  margin: 0,
                  fontFamily: "var(--font-sans), system-ui, sans-serif",
                  fontSize: 11.5,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  color: TEAL,
                }}
              >
                {type}
              </p>
              <p
                style={{
                  margin: "4px 0 2px",
                  fontFamily: "var(--font-display), Georgia, serif",
                  fontSize: 24,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  color: CREAM,
                }}
              >
                {title}
              </p>
              <p
                style={{
                  margin: 0,
                  fontFamily: "var(--font-serif), Georgia, serif",
                  fontSize: 15,
                  lineHeight: 1.5,
                  color: CREAM_DIM,
                }}
              >
                {note}
              </p>
            </li>
          ))}
        </ul>
        <p className="mag-foot" style={{ color: "rgba(244,239,230,0.4)" }}>
          The Evolution Issue · 07
        </p>
        </div>
      </article>

      {/* 08 Photo — portrait */}
      <article className="mag-page mag-bleed">
        <img className="mag-fill" src={`${IMG}/portrait3.jpg`} alt="Vineet Trakroo" style={{ objectPosition: "center 40%" }} />
        <div className="mag-caption-bar">The strategist in his element · photographed for The Evolution Issue</div>
      </article>

      {/* 09 Cross-Industry Lessons */}
      <article className="mag-page mag-pad">
        <div className="mag-body">
        <p className="mag-kicker" style={{ color: TEAL_DARK }}>Cross-Industry Lessons</p>
        <h2 className="mag-h mag-h-sm">What works across FMCG, automobiles, pharma, and more.</h2>
        <ul
          className="mag-list"
          style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-evenly" }}
        >
          <li>
            <strong style={{ color: TEAL_DARK }}>Communication Disconnect</strong>
            Internal communication is often surprisingly weak. Frontline sales teams rarely have
            absolute clarity on priorities. On-the-ground market friction rarely makes it up to
            executive leadership unfiltered.
          </li>
          <li>
            <strong style={{ color: TEAL_DARK }}>Timely Diagnostics</strong>
            Practical execution requires real-time market intelligence. Boardroom decisions made
            on outdated assumptions lead to strategic misalignment.
          </li>
          <li>
            <strong style={{ color: TEAL_DARK }}>Usage &amp; Attitude Tracking</strong>
            As consumers use a product over time, expectations evolve from primary functional needs
            to secondary conveniences. Continuous U&amp;A tracking is essential.
          </li>
          <li>
            <strong style={{ color: TEAL_DARK }}>NPD Pipeline</strong>
            Market research must not sit inside marketing as an academic deck. Leading enterprises
            translate customer feedback into packaging changes, SKU variants, or entirely new
            offerings.
          </li>
        </ul>
        <p className="mag-note">
          The most universal commercial bottlenecks are rooted in execution breakdowns.
        </p>
        </div>
      </article>

      {/* 10 Consumer Insights */}
      <article className="mag-page mag-pad">
        <div className="mag-body">
        <p className="mag-kicker" style={{ color: TEAL_DARK }}>Consumer Insights</p>
        <h2 className="mag-h mag-h-sm">Turning research into commercial growth.</h2>
        <div className="mag-cols mag-folio mag-dropcap" style={{ fontSize: 18, lineHeight: 1.9 }}>
          <p style={{ margin: "0 0 14px" }}>
            Over the past decade, several transformative forces have begun impacting enterprise
            growth. The first diagnostic question is foundational: What are we selling, to whom,
            and has it become a commodity? In most cases, product differentiation has eroded.
          </p>
          <p style={{ margin: 0 }}>
            Consumers today are highly informed. Pushing the same products through traditional
            offline channels introduces severe margin and distribution challenges that often prove
            unprofitable without strategic restructuring. Many legacy companies still evaluate
            teams using KPIs designed for how business was conducted decades ago.
          </p>
        </div>
        <blockquote className="mag-pull" style={{ margin: "auto 12px", fontSize: 32, color: TEAL_DARK }}>
          Many enterprises generate 30% to 50% of their business from digital channels.
        </blockquote>
        <p className="mag-foot">The Evolution Issue · 10</p>
        </div>
      </article>

      {/* 11 Execution Failures — dark stats */}
      <article className="mag-page mag-pad mag-dark">
        <div className="mag-body">
        <p className="mag-kicker" style={{ color: TEAL }}>
          Execution Failures
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            flex: 1,
            marginTop: 8,
          }}
        >
          {[
            ["90%", "of organizational effort is execution, not strategy"],
            ["10%", "of frontline problems ever reach top management"],
            ["30-50%", "of business now comes from digital channels"],
            ["2-3", "decades — how old most legacy KPIs are"],
          ].map(([num, label]) => (
            <div key={label} style={{ borderBottom: "1px solid rgba(244,239,230,0.14)", paddingBottom: 22 }}>
              <p
                style={{
                  margin: 0,
                  fontFamily: "var(--font-display), Georgia, serif",
                  fontSize: 74,
                  fontWeight: 600,
                  lineHeight: 0.95,
                  letterSpacing: "-0.04em",
                  color: TEAL,
                }}
              >
                {num}
              </p>
              <p
                style={{
                  margin: "8px 0 0",
                  fontFamily: "var(--font-sans), system-ui, sans-serif",
                  fontSize: 13,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: CREAM_DIM,
                }}
              >
                {label}
              </p>
            </div>
          ))}
        </div>
        <p
          style={{
            marginTop: "auto",
            fontFamily: "var(--font-serif), Georgia, serif",
            fontSize: 15,
            fontStyle: "italic",
            color: "rgba(244,239,230,0.5)",
          }}
        >
          The &ldquo;Iceberg Effect&rdquo; — feedback from dealers and frontline teams gets diluted on its way to headquarters.
        </p>
        </div>
      </article>

      {/* 12 Future Ready */}
      <article className="mag-page mag-pad">
        <div className="mag-body">
        <p className="mag-kicker" style={{ color: TEAL_DARK }}>Future Ready</p>
        <h2 className="mag-h mag-h-sm">Building sustainable growth for 2030.</h2>
        <p className="mag-folio mag-dropcap" style={{ fontSize: 17.5, lineHeight: 1.85 }}>
          Building sustainable growth by 2030 requires one core capability: the institutional
          agility to continuously sense and respond to internal and external environmental changes.
          Sustainable success does not come from doing everything; it comes from identifying the
          few commercial drivers that truly move the needle and executing them with extreme rigor.
        </p>
        <p className="mag-folio" style={{ fontSize: 17.5, lineHeight: 1.85 }}>
          Leadership teams must proactively monitor market shifts, technological disruptions, and
          evolving customer journeys, willing to reshape operating models to drive customer delight.
          Restructuring corporate hierarchies, modifying culture, or adopting advanced digital
          platforms are enablers.
        </p>
        <p className="mag-folio" style={{ fontSize: 17.5, lineHeight: 1.85 }}>
          In an era where product features commoditize rapidly, the ultimate source of enterprise
          value remains the customer&apos;s end-to-end journey, usage experience, and overall
          satisfaction.
        </p>
        <blockquote className="mag-quote" style={{ margin: "auto 0", borderColor: TEAL }}>
          Customer obsession as the North Star.
        </blockquote>
        <p className="mag-foot">The Evolution Issue · 12</p>
        </div>
      </article>

      {/* 13 The Method — statement over the gaze */}
      <article className="mag-page mag-bleed">
        <img
          className="mag-fill"
          src={`${IMG}/cover.jpg`}
          alt=""
          style={{ objectPosition: "center 25%" }}
        />
        <div className="mag-scrim" />
        <div className="mag-overlay">
          <p className="mag-kicker mag-kicker-light">The Method</p>
          <h2 className="mag-h mag-h-light" style={{ marginTop: "auto", fontSize: 42, maxWidth: 520 }}>
            Organizations frequently try to solve too many initiatives at once.
          </h2>
          <p
            className="mag-folio"
            style={{ color: "rgba(244,239,230,0.88)", maxWidth: 500, textAlign: "left" }}
          >
            Real transformation requires matching strategic ambitions with internal capability
            constraints, executing systematically phase by phase. Diluting strategic capacity
            creates competing internal priorities that undermine progress.
          </p>
          <p
            style={{
              marginTop: 10,
              fontFamily: "var(--font-serif), Georgia, serif",
              fontSize: 16,
              fontStyle: "italic",
              color: TEAL,
            }}
          >
            &ldquo;Relentless focus on the few drivers that truly move the needle.&rdquo;
          </p>
        </div>
      </article>

      {/* 14 Back cover — PrimeCrest house page over the issue collage, single, hard */}
      <article className="mag-page mag-bleed mag-dark" data-density="hard">
        <img className="mag-fill" src={`${IMG}/backcover.jpg`} alt="" />
        <div
          className="mag-overlay"
          style={{ alignItems: "center", textAlign: "center", padding: "60px 52px 44px" }}
        >
          <div
            style={{
              margin: "auto 0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              src="/brand/logo-primecrest.png"
              alt="PrimeCrest"
              style={{
                width: "84%",
                maxWidth: 600,
                height: "auto",
                filter: "drop-shadow(0 10px 34px rgba(0,0,0,0.65))",
              }}
            />
            <p
              style={{
                margin: "26px 0 0",
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.5em",
                textIndent: "0.5em",
                textTransform: "uppercase",
                color: TEAL,
              }}
            >
              Where Vision Meets Voice
            </p>
            <p
              style={{
                margin: "34px 0 0",
                fontFamily: "var(--font-serif), Georgia, serif",
                fontSize: 19,
                fontStyle: "italic",
                lineHeight: 1.65,
                color: "rgba(244,239,230,0.85)",
                maxWidth: 470,
              }}
            >
              A journal of affairs, business, and culture — independent reporting, considered
              writing, and the people who shape what comes next.
            </p>
          </div>
          <div
            style={{
              marginTop: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 18,
            }}
          >
            <img
              src="/brand/barcode-primecrest.png"
              alt="Scan to visit theprimecrest.com"
              style={{ width: 210, height: "auto", boxShadow: "0 10px 26px rgba(0,0,0,0.45)" }}
            />
            <p className="mag-imprint">
              <strong>PrimeCrest</strong> · a product of Fortiora Group LLC
              <br />
              30 N Gould St Ste R, Sheridan, WY 82801, United States
              <br />
              Hello@thefortiora.com · <strong>theprimecrest.com</strong>
            </p>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                fontSize: 12,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: TEAL,
              }}
            >
              The Evolution Issue · Vol. III
            </p>
          </div>
        </div>
      </article>
    </>
  );
}
