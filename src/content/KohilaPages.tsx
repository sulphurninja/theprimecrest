/* eslint-disable @next/next/no-img-element */
const IMG = "/issues/kohila";

const CREAM = "#f4efe6";
const TEAL = "#1a5f6a";
const CORAL = "#e05a4e";
const TEAL_DIM = "rgba(26, 95, 106, 0.75)";

export const KOHILA_TOC = [
  { page: 0, label: "Cover" },
  { page: 1, label: "Credits" },
  { page: 2, label: "The Subject" },
  { page: 3, label: "Contents" },
  { page: 5, label: "The Origin" },
  { page: 6, label: "The Methodology" },
  { page: 7, label: "The Journey" },
  { page: 8, label: "The Vision" },
  { page: 9, label: "The Impact" },
  { page: 10, label: "The Mission" },
  { page: 11, label: "PrimeCrest" },
];

export function KohilaPages() {
  return (
    <>
      {/* 01 Cover — single, hard */}
      <article className="mag-page mag-bleed" data-density="hard">
        <img
          className="mag-fill"
          src={`${IMG}/coverart.jpg`}
          alt="Kohila Sivas"
          fetchPriority="high"
        />
        <div className="mag-overlay">
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
              Vol. III · The Readiness Issue · theprimecrest.com
            </div>
          </div>

          <div style={{ marginTop: "auto", maxWidth: 340 }}>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                fontSize: 12.5,
                fontWeight: 700,
                letterSpacing: "0.26em",
                textTransform: "uppercase",
                color: CORAL,
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
              Leaders<span style={{ color: CORAL }}>.</span>
            </h1>
            <div
              style={{
                marginTop: 24,
                paddingTop: 16,
                borderTop: "1px solid rgba(244,239,230,0.4)",
              }}
            >
              <p className="mag-display" style={{ fontSize: 34, color: CREAM }}>
                Kohila Sivas
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
                Founder &amp; Master Coach
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
                Wholistic SuccessCodes™ · Global
              </p>
            </div>
          </div>
        </div>
        <img className="mag-qr" src="/brand/barcode-primecrest.png" alt="Scan to visit theprimecrest.com" />
      </article>

      {/* 02 Credits — left, dark with teal accent */}
      <article className="mag-page mag-pad mag-dark">
        <div className="mag-body">
          <p className="mag-kicker" style={{ color: CORAL }}>
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
              <b style={{ color: CORAL }}>Magazine</b>
              <span>PrimeCrest · theprimecrest.com</span>
            </li>
            <li>
              <b style={{ color: CORAL }}>Published by</b>
              <span>Fortiora Group LLC</span>
            </li>
            <li>
              <b style={{ color: CORAL }}>Editorial &amp; Design</b>
              <span>Fortiora Studio</span>
            </li>
            <li>
              <b style={{ color: CORAL }}>Digital Production</b>
              <span>Fortiora Studio</span>
            </li>
            <li>
              <b style={{ color: CORAL }}>Featured Subject</b>
              <span>Kohila Sivas</span>
            </li>
            <li>
              <b style={{ color: CORAL }}>Words</b>
              <span>From the interviews and writings of Kohila Sivas</span>
            </li>
            <li>
              <b style={{ color: CORAL }}>Issue</b>
              <span>Vol. III · The Readiness Issue</span>
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
          <p className="mag-kicker" style={{ color: TEAL }}>The Subject</p>
          <h2 className="mag-h mag-h-sm">From struggling child to global readiness expert.</h2>
          <div style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <p className="mag-folio mag-dropcap">
                At twelve years old, Kohila Sivas reached a point where she attempted to take her
                own life. She wasn&apos;t incapable. She wasn&apos;t a problem child. She was a human being
                struggling inside systems that did not understand what was happening underneath
                her behaviour and performance.
              </p>
              <p className="mag-folio">
                That experience never really left her. Later, as an educator and learning coach,
                she began seeing the same thing in children, parents, educators, and eventually
                leaders and professionals: we often try to fix the performance without understanding
                the human who is trying to perform.
              </p>
            </div>
            <div style={{ width: 188, flexShrink: 0, textAlign: "center", paddingTop: 8 }}>
              <img className="mag-avatar" src={`${IMG}/portrait.jpg`} alt="Kohila Sivas" />
              <p className="mag-by">Kohila Sivas</p>
              <p className="mag-role">Master Coach · Entrepreneur</p>
            </div>
          </div>
          <blockquote className="mag-pull" style={{ margin: "auto 12px", color: TEAL }}>
            Readiness precedes performance.
          </blockquote>
          <p
            className="mag-folio"
            style={{ marginTop: "auto", fontStyle: "italic", textAlign: "right", color: TEAL, fontSize: 16 }}
          >
            She turned what she once experienced as pain into a mission that can reduce unnecessary human suffering.
          </p>
        </div>
      </article>

      {/* 04–05 Contents spread */}
      <article className="mag-page mag-bleed">
        <img className="mag-spread-photo is-left" src={`${IMG}/feature.jpg`} alt="" />
        <div className="mag-scrim" />
        <div className="mag-overlay">
          <span className="mag-banner" style={{ background: TEAL }}>The readiness story</span>
          <p className="mag-num">04</p>
          <h2 className="mag-h mag-h-light" style={{ maxWidth: 540, fontSize: 36 }}>
            Two decades helping humans understand themselves, told by the woman who found the blocks.
          </h2>
          <div style={{ marginTop: "auto" }}>
            <p
              style={{
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                fontSize: 13,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: CORAL,
                marginBottom: 8,
              }}
            >
              09 · The Impact
            </p>
            <p
              style={{
                fontFamily: "var(--font-serif), Georgia, serif",
                fontSize: 16,
                color: "rgba(244,239,230,0.88)",
                maxWidth: 360,
              }}
            >
              How a personal struggle became a mission to impact 1.5 billion humans by 2035.
            </p>
          </div>
        </div>
      </article>

      <article className="mag-page mag-bleed">
        <img className="mag-spread-photo is-right" src={`${IMG}/feature.jpg`} alt="" />
        <div className="mag-scrim" />
        <p className="mag-vert" style={{ color: CREAM }}>
          C<span style={{ background: TEAL }} />NTENTS
        </p>
        <div className="mag-overlay" style={{ paddingRight: 120 }}>
          <p className="mag-kicker mag-kicker-light">In this issue</p>
          <ol className="mag-toc">
            <li>
              <span>The Origin</span>
              <em style={{ color: CORAL }}>06</em>
            </li>
            <li>
              <span>The Methodology</span>
              <em style={{ color: CORAL }}>07</em>
            </li>
            <li>
              <span>The Journey</span>
              <em style={{ color: CORAL }}>08</em>
            </li>
            <li>
              <span>The Vision</span>
              <em style={{ color: CORAL }}>09</em>
            </li>
            <li>
              <span>The Impact</span>
              <em style={{ color: CORAL }}>10</em>
            </li>
            <li>
              <span>The Mission</span>
              <em style={{ color: CORAL }}>11</em>
            </li>
          </ol>
        </div>
      </article>

      {/* 06 The Origin */}
      <article className="mag-page mag-pad">
        <div className="mag-body">
          <p className="mag-kicker" style={{ color: TEAL }}>The Origin</p>
          <h2 className="mag-h">&ldquo;What is blocking this person from accessing what is already within them?&rdquo;</h2>
          <div className="mag-cols mag-folio mag-dropcap" style={{ fontSize: 18, lineHeight: 1.9 }}>
            <p style={{ margin: "0 0 14px" }}>
              Wholistic SuccessCodes grew out of one question Kohila kept asking: Why do intelligent,
              capable people struggle even when they know what to do? She saw students receiving more
              tutoring but still struggling. Parents collecting more strategies but still feeling
              helpless. Educators working harder and burning out. Adults reading books, taking courses
              and hiring coaches, yet repeating the same patterns.
            </p>
            <p style={{ margin: "0 0 14px" }}>
              She realized we were often working on the visible problem instead of the problem
              underneath the problem. So she started looking at the whole human system rather than
              one symptom. That eventually became Wholistic SuccessCodes.
            </p>
            <p style={{ margin: 0 }}>
              Instead of asking, &ldquo;What is wrong with this person?&rdquo; the work asks,
              &ldquo;What is blocking this person from accessing what is already within them?&rdquo;
              That shift changes everything.
            </p>
          </div>
          <blockquote className="mag-pull" style={{ margin: "auto 12px", fontSize: 32, color: TEAL }}>
            That shift changes everything.
          </blockquote>
          <p className="mag-foot">The Readiness Issue · 06</p>
        </div>
      </article>

      {/* 07 The Methodology — dark with teal accent */}
      <article className="mag-page mag-pad mag-dark">
        <div className="mag-body">
          <p className="mag-kicker" style={{ color: CORAL }}>
            The Methodology
          </p>
          <h2 className="mag-h mag-h-light" style={{ fontSize: 34 }}>
            Blocks to Flow: The frameworks that change lives.
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
              ["Blocks to Flow™", "Identifying what interferes with a person's natural ability to learn, live, lead and perform."],
              ["ReadinessOS™", "A growing ecosystem of readiness-based programs designed to understand and remove barriers."],
              ["Wholistic Compass™", "A platform dedicated to changing how we understand human learning, living and leading."],
              ["Wholistic Campus™", "A global home and marketplace for readiness-based programs and collaborative experts."],
              ["TEDx Talk", "January 9, 2027, Spoleto, Italy: 'Readiness Precedes Performance' on the global stage."],
            ].map(([name, note]) => (
              <li
                key={name}
                style={{ padding: "15px 0", borderBottom: "1px solid rgba(244,239,230,0.16)" }}
              >
                <p
                  style={{
                    margin: "0 0 4px",
                    fontFamily: "var(--font-display), Georgia, serif",
                    fontSize: 24,
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    color: CORAL,
                  }}
                >
                  {name}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-serif), Georgia, serif",
                    fontSize: 15,
                    lineHeight: 1.5,
                    color: "rgba(244, 239, 230, 0.66)",
                  }}
                >
                  {note}
                </p>
              </li>
            ))}
          </ul>
          <p className="mag-foot" style={{ color: "rgba(244,239,230,0.4)" }}>
            The Readiness Issue · 07
          </p>
        </div>
      </article>

      {/* 08 The Journey */}
      <article className="mag-page mag-pad">
        <div className="mag-body">
          <p className="mag-kicker" style={{ color: TEAL }}>The Journey</p>
          <h2 className="mag-h mag-h-sm">The biggest lesson: readiness precedes performance.</h2>
          <div className="mag-cols mag-folio mag-dropcap" style={{ fontSize: 18, lineHeight: 1.9 }}>
            <p style={{ margin: "0 0 14px" }}>
              We live in a world obsessed with performance. Do more. Work harder. Be disciplined.
              Follow the strategy. Get the result. But a strategy can be excellent and still fail
              if the human system isn&apos;t ready to access it.
            </p>
            <p style={{ margin: "0 0 14px" }}>
              Kohila has seen this with children who are capable of learning but cannot access that
              ability in a particular moment. She has seen it with educators who know exactly what
              to do but are exhausted. She has seen it with entrepreneurs and leaders who have the
              strategy but are internally blocked from executing it.
            </p>
            <p style={{ margin: 0 }}>
              So she no longer begins with performance. She begins with the human. When we understand
              what the person needs in order to become ready, performance can become a natural outcome
              rather than something we constantly have to force.
            </p>
          </div>
          <blockquote className="mag-pull" style={{ margin: "auto 12px", fontSize: 30, color: TEAL }}>
            Begin with the human.
          </blockquote>
          <p className="mag-foot">The Readiness Issue · 08</p>
        </div>
      </article>

      {/* 09 The Vision */}
      <article className="mag-page mag-pad">
        <div className="mag-body">
          <p className="mag-kicker" style={{ color: TEAL }}>The Vision</p>
          <h2 className="mag-h mag-h-sm">Breaking the patterns we mistake for identity.</h2>
          <p className="mag-folio mag-dropcap" style={{ fontSize: 17.5, lineHeight: 1.85 }}>
            One of the biggest challenges Kohila sees is that people mistake their blocks for their
            identity. They say: &ldquo;I am lazy.&rdquo; &ldquo;I am bad at math.&rdquo;
            &ldquo;I am not disciplined.&rdquo; &ldquo;I procrastinate.&rdquo;
            &ldquo;I am not confident.&rdquo; &ldquo;I can&apos;t do this.&rdquo;
          </p>
          <p className="mag-folio" style={{ fontSize: 17.5, lineHeight: 1.85 }}>
            But she doesn&apos;t automatically accept those statements as truth. She wants to know
            what is underneath them. What happened before the procrastination? What makes the person
            shut down? What environment helps them perform differently? What pattern keeps repeating?
            What is their system trying to protect them from?
          </p>
          <p className="mag-folio" style={{ fontSize: 17.5, lineHeight: 1.85 }}>
            We have become very quick to label humans and very slow to understand them. Sometimes the
            very behaviour we are trying to eliminate is information. When we become curious about
            the pattern instead of judging the person, we can finally find the block — and that is
            where real change begins.
          </p>
          <blockquote className="mag-quote" style={{ margin: "auto 0", borderColor: TEAL }}>
            When we become curious about the pattern instead of judging the person, we can finally find the block.
          </blockquote>
          <p className="mag-foot">The Readiness Issue · 09</p>
        </div>
      </article>

      {/* 10 The Impact — dark stats */}
      <article className="mag-page mag-pad mag-dark">
        <div className="mag-body">
          <p className="mag-kicker" style={{ color: CORAL }}>
            The Impact
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
              ["1.5bn", "humans to impact by 2035"],
              ["20+", "years working with learners and families"],
              ["TEDx", "January 2027, Spoleto, Italy"],
              ["Global", "reach through parents, educators, coaches, leaders"],
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
                    color: CORAL,
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
                    color: "rgba(244, 239, 230, 0.66)",
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
            The ripple effect: one educator can impact hundreds, one parent can change a family.
          </p>
        </div>
      </article>

      {/* 11 The Mission */}
      <article className="mag-page mag-pad mag-pb0">
        <div className="mag-body">
          <div style={{ padding: "0 0 28px" }}>
            <p className="mag-kicker" style={{ color: TEAL }}>The Mission</p>
            <h2 className="mag-h mag-h-sm">Understand the human before demanding the performance.</h2>
            <p className="mag-folio mag-dropcap" style={{ fontSize: 17.5, lineHeight: 1.85 }}>
              The transformations that matter most are not simply higher grades, better productivity
              or improved performance. Those things happen, but Kohila looks deeper. She has watched
              children who believed they were incapable begin to understand themselves as learners.
              She has watched parents stop fighting their children and begin understanding what the
              behaviour is communicating.
            </p>
            <p className="mag-folio" style={{ fontSize: 17.5, lineHeight: 1.85 }}>
              She has watched educators realize they do not have to sacrifice themselves to serve
              others. And she has watched adults recognize patterns they have carried for years and
              finally begin moving differently. When somebody understands why they operate the way
              they do, shame can decrease, choice increases, and they can begin building success in
              a way that actually fits who they are.
            </p>
          </div>
          <blockquote className="mag-pull" style={{ margin: "auto 12px", fontSize: 30, color: TEAL }}>
            Nothing works until the human system is ready.
          </blockquote>
          <div className="mag-darkband" style={{ margin: "0 -58px", background: TEAL }}>
            If we are serious about changing education, human development and performance, collaboration has to become part of the solution.
          </div>
        </div>
      </article>

      {/* 12 Back cover — PrimeCrest house page, single, hard */}
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
                color: CORAL,
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
                color: CORAL,
              }}
            >
              The Readiness Issue · Vol. III
            </p>
          </div>
        </div>
      </article>
    </>
  );
}
