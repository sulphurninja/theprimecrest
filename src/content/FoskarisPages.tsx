/* eslint-disable @next/next/no-img-element */
const IMG = "/issues/foskaris";

const CREAM = "#f4efe6";
const TEAL = "#0d9488";
const CORAL = "#e87468";
const CREAM_DIM = "rgba(244, 239, 230, 0.66)";

export const FOSKARIS_TOC = [
  { page: 0, label: "Cover" },
  { page: 1, label: "Credits" },
  { page: 2, label: "The Subject" },
  { page: 3, label: "Contents" },
  { page: 5, label: "The Origin" },
  { page: 6, label: "The Approach" },
  { page: 7, label: "Red Light Pro" },
  { page: 8, label: "The Achievement" },
  { page: 9, label: "The Vision" },
  { page: 10, label: "The Future" },
  { page: 11, label: "Advice" },
  { page: 12, label: "Unstoppable" },
  { page: 13, label: "Outlook" },
  { page: 15, label: "PrimeCrest" },
];

export function FoskarisPages() {
  return (
    <>
      {/* 01 Cover — single, hard */}
      <article className="mag-page mag-bleed" data-density="hard">
        <img
          className="mag-fill"
          src={`${IMG}/coverart.jpg`}
          alt="Red Light Pro Devices & Foskaris Wellness"
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
              Vol. III · The Wellness Issue · theprimecrest.com
            </div>
          </div>

          <div style={{ marginTop: "auto", maxWidth: 360 }}>
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
                Red Light Pro
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
                Founder &amp; CEO
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
                Foskaris Wellness · Anaheim Hills, California
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
            <span>Red Light Pro Devices &amp; Foskaris Wellness</span>
          </li>
          <li>
            <b style={{ color: TEAL }}>Words</b>
            <span>From the interviews of the Founder</span>
          </li>
          <li>
            <b style={{ color: TEAL }}>Issue</b>
            <span>Vol. III · The Wellness Issue</span>
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
        <h2 className="mag-h mag-h-sm">Reveal. Restore. Reverse.</h2>
        <div style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <p className="mag-folio mag-dropcap">
              My interest in nutrition and chronic disease began when I was a teenager. I had an aunt with 
              Type 1 diabetes and another family member with heart disease. I spent hours in the library 
              researching nutrition and health, trying to understand if there was anything I could do to 
              help them. I didn&apos;t realize it at the time, but those early experiences planted the seed 
              for what would eventually become my life&apos;s work.
            </p>
            <p className="mag-folio">
              Then, in my mid-30s, health became very personal. For more than two and a half years, I 
              struggled with unexplained dizzy spells, chronic fatigue, and continuous abdominal pain. 
              I went from doctor to doctor and had test after test, but no one could figure out what was wrong.
            </p>
          </div>
          <div style={{ width: 188, flexShrink: 0, textAlign: "center", paddingTop: 8 }}>
            <img className="mag-avatar" src={`${IMG}/portrait.jpg`} alt="Founder" style={{ borderColor: TEAL }} />
            <p className="mag-by">Foskaris Wellness</p>
            <p className="mag-role">Founder &amp; CEO</p>
          </div>
        </div>
        <blockquote className="mag-pull" style={{ margin: "auto 12px", color: TEAL }}>
          Longevity isn&apos;t simply about how many years you live.
        </blockquote>
        <p
          className="mag-folio"
          style={{ marginTop: "auto", fontStyle: "italic", textAlign: "right", color: TEAL, fontSize: 16 }}
        >
          If you don&apos;t feel well enough to enjoy those years, that&apos;s not truly living.
        </p>
        </div>
      </article>

      {/* 04–05 Contents spread */}
      <article className="mag-page mag-bleed">
        <img className="mag-spread-photo is-left" src={`${IMG}/wellness.jpg`} alt="" />
        <div className="mag-scrim" />
        <div className="mag-overlay">
          <span className="mag-banner" style={{ background: TEAL }}>The signature story</span>
          <p className="mag-num">04</p>
          <h2 className="mag-h mag-h-light" style={{ maxWidth: 540, fontSize: 36 }}>
            A decade helping more than 5,000 people improve their health and reclaim their vitality.
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
              08 · Red Light Pro
            </p>
            <p
              style={{
                fontFamily: "var(--font-serif), Georgia, serif",
                fontSize: 16,
                color: "rgba(244,239,230,0.88)",
                maxWidth: 360,
              }}
            >
              How a wellness practitioner became a medical device entrepreneur — and why 
              professional quality matters.
            </p>
          </div>
        </div>
      </article>

      <article className="mag-page mag-bleed">
        <img className="mag-spread-photo is-right" src={`${IMG}/wellness.jpg`} alt="" />
        <div className="mag-scrim" />
        <p className="mag-vert" style={{ color: TEAL }}>
          C<span style={{ background: CORAL }} />NTENTS
        </p>
        <div className="mag-overlay" style={{ paddingRight: 120 }}>
          <p className="mag-kicker mag-kicker-light">In this issue</p>
          <ol className="mag-toc">
            <li>
              <span>The Origin</span>
              <em style={{ color: TEAL }}>06</em>
            </li>
            <li>
              <span>The Approach</span>
              <em style={{ color: TEAL }}>07</em>
            </li>
            <li>
              <span>Red Light Pro</span>
              <em style={{ color: TEAL }}>08</em>
            </li>
            <li>
              <span>The Achievement</span>
              <em style={{ color: TEAL }}>09</em>
            </li>
            <li>
              <span>The Vision</span>
              <em style={{ color: TEAL }}>10</em>
            </li>
            <li>
              <span>The Future</span>
              <em style={{ color: TEAL }}>11</em>
            </li>
            <li>
              <span>Advice</span>
              <em style={{ color: TEAL }}>12</em>
            </li>
            <li>
              <span>Unstoppable</span>
              <em style={{ color: TEAL }}>13</em>
            </li>
          </ol>
        </div>
      </article>

      {/* 06 The Origin */}
      <article className="mag-page mag-pad">
        <div className="mag-body">
        <p className="mag-kicker" style={{ color: TEAL }}>The Origin</p>
        <h2 className="mag-h">&ldquo;I wanted to create what I needed.&rdquo;</h2>
        <div className="mag-cols mag-folio mag-dropcap" style={{ fontSize: 18, lineHeight: 1.9 }}>
          <p style={{ margin: "0 0 14px" }}>
            Eventually, I visited a holistic wellness center, and within a week I began feeling better. 
            That experience completely changed the direction of my life. It inspired me to return to 
            school and ultimately open Foskaris Wellness, where I could take a more holistic approach 
            to helping people.
          </p>
          <p style={{ margin: "0 0 14px" }}>
            I wanted to create the kind of wellness center I had needed during those difficult years — 
            a place where people weren&apos;t rushed out the door, where I could spend time listening to 
            them, looking at the whole person, and helping them understand what their body needed.
          </p>
          <p style={{ margin: 0 }}>
            I also wanted it to be a place where people could relax and reduce stress while working 
            toward their health goals. That became the philosophy behind Reveal. Restore. Reverse.
          </p>
        </div>
        <blockquote className="mag-pull" style={{ margin: "auto 12px", fontSize: 32, color: TEAL }}>
          Look at the whole person.
        </blockquote>
        <p className="mag-foot">The Wellness Issue · 06</p>
        </div>
      </article>

      {/* 07 The Approach — dark ledger */}
      <article className="mag-page mag-pad mag-dark">
        <div className="mag-body">
        <p className="mag-kicker" style={{ color: TEAL }}>
          The Approach
        </p>
        <h2 className="mag-h mag-h-light" style={{ fontSize: 34 }}>
          How nutrition and research shape wellness.
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
            ["Conversation", "Understanding what's happening in someone's life — their history, lifestyle, stress levels."],
            ["Sleep", "If the body doesn't rest, it can't properly repair. So much restoration happens while we sleep."],
            ["Nutrition", "Under-nourishing the body contributes to deficiencies, hormonal imbalances, low energy, poor sleep."],
            ["Analysis", "We can learn a tremendous amount from initial body composition and visceral fat analysis."],
            ["Testing", "If we need to go deeper — hormones, micronutrients, and other health markers."],
            ["Personalization", "Creating a realistic plan that the person can actually follow, then adjust as needed."],
          ].map(([name, note]) => (
            <li
              key={name}
              style={{ padding: "15px 0", borderBottom: "1px solid rgba(244,239,230,0.16)" }}
            >
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
                {name}
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
          The Wellness Issue · 07
        </p>
        </div>
      </article>

      {/* 08 Red Light Pro */}
      <article className="mag-page mag-pad">
        <div className="mag-body">
        <p className="mag-kicker" style={{ color: TEAL }}>Red Light Pro</p>
        <h2 className="mag-h mag-h-sm">Born out of necessity, not opportunity.</h2>
        <div className="mag-cols mag-folio mag-dropcap" style={{ fontSize: 18, lineHeight: 1.9 }}>
          <p style={{ margin: "0 0 14px" }}>
            Red Light Pro Devices came later, and it was born out of necessity. I had already been using 
            professional red light therapy with my clients for about three years when they began asking 
            me for devices they could use at home to continue supporting their recovery between visits.
          </p>
          <p style={{ margin: 0 }}>
            We tested different home devices, but I wasn&apos;t satisfied with what was available. I wanted 
            something that could provide my clients with a professional-quality experience similar to 
            what we were using in the wellness center. I approached the company that manufactured our 
            approximately $28,000 professional system and asked whether they would develop smaller home-use 
            devices. They weren&apos;t interested. So I decided to find another way.
          </p>
        </div>
        <blockquote className="mag-pull" style={{ margin: "auto 12px", fontSize: 32, color: TEAL }}>
          Solving a problem for my clients.
        </blockquote>
        <p className="mag-foot">The Wellness Issue · 08</p>
        </div>
      </article>

      {/* 09 The Achievement */}
      <article className="mag-page mag-pad">
        <div className="mag-body">
        <p className="mag-kicker" style={{ color: TEAL }}>The Achievement</p>
        <h2 className="mag-h mag-h-sm">A place where people feel heard.</h2>
        <p className="mag-folio mag-dropcap" style={{ fontSize: 17.5, lineHeight: 1.85 }}>
          What I&apos;m most proud of isn&apos;t a particular business milestone. It&apos;s creating a place where 
          people can come when they&apos;re struggling with their health, feel heard, and hopefully begin 
          finding answers that can help them improve their lives.
        </p>
        <p className="mag-folio" style={{ fontSize: 17.5, lineHeight: 1.85 }}>
          I know personally what it feels like to not feel well for years and have unanswered questions. 
          I know the frustration of going from appointment to appointment, having test after test, and 
          still not understanding why you don&apos;t feel like yourself.
        </p>
        <p className="mag-folio" style={{ fontSize: 17.5, lineHeight: 1.85 }}>
          Over the years, I&apos;ve had the privilege of working with more than 5,000 people. I&apos;ve watched 
          people improve their health, become stronger, reduce pain, reach weight and body-composition 
          goals, improve important health markers, have more energy, and regain the confidence to do 
          things they enjoy again.
        </p>
        <blockquote className="mag-quote" style={{ margin: "auto 0", borderColor: TEAL }}>
          I turned one of the most difficult periods of my own life into something that could help 
          other people struggle less.
        </blockquote>
        <p className="mag-foot">The Wellness Issue · 09</p>
        </div>
      </article>

      {/* 10 The Vision — dark stats */}
      <article className="mag-page mag-pad mag-dark">
        <div className="mag-body">
        <p className="mag-kicker" style={{ color: TEAL }}>
          The Vision
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
            ["5,000+", "people helped to improve their health and vitality"],
            ["10+", "years building a wellness practice from the ground up"],
            ["$28K", "professional system that inspired home-use innovation"],
            ["3", "years of red light therapy before launching Red Light Pro"],
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
          The numbers behind a decade of holistic wellness.
        </p>
        </div>
      </article>

      {/* 11 The Future */}
      <article className="mag-page mag-pad">
        <div className="mag-body">
        <p className="mag-kicker" style={{ color: TEAL }}>The Future</p>
        <h2 className="mag-h mag-h-sm">Red light therapy in every home.</h2>
        <div className="mag-cols mag-folio mag-dropcap" style={{ fontSize: 18, lineHeight: 1.9 }}>
          <p style={{ margin: "0 0 14px" }}>
            I believe we&apos;re still in the early stages of understanding the potential of red light 
            therapy and photobiomodulation. As more clinical research is published and awareness grows, 
            I believe we&apos;ll see greater acceptance among healthcare professionals, athletes, wellness 
            practitioners, and the general public.
          </p>
          <p style={{ margin: 0 }}>
            I envision a future where red light therapy becomes part of the normal performance and 
            recovery environment for athletes beginning as early as high school. Just as people have 
            created home gyms, saunas, and dedicated wellness spaces, I envision more homes having 
            recovery rooms that incorporate technologies such as red light therapy.
          </p>
        </div>
        <blockquote className="mag-pull" style={{ margin: "auto 12px", fontSize: 30, color: TEAL }}>
          The future of health will become increasingly proactive.
        </blockquote>
        <p className="mag-foot">The Wellness Issue · 11</p>
        </div>
      </article>

      {/* 12 Advice */}
      <article className="mag-page mag-pad">
        <div className="mag-body">
        <p className="mag-kicker" style={{ color: TEAL }}>Advice</p>
        <h2 className="mag-h mag-h-sm">&ldquo;Why do you want to do this?&rdquo;</h2>
        <p className="mag-folio mag-dropcap" style={{ fontSize: 17.5, lineHeight: 1.85 }}>
          The first question I would ask is, &ldquo;Why do you want to do this?&rdquo; Your &ldquo;why&rdquo; 
          has to be strong enough to carry you through the parts of entrepreneurship that aren&apos;t 
          exciting, because having a great idea is very different from building a successful business 
          around that idea.
        </p>
        <p className="mag-folio" style={{ fontSize: 17.5, lineHeight: 1.85 }}>
          Before I entered the wellness industry, I was in the restaurant business with my family. 
          People would sometimes tell me they wanted to open a restaurant because they thought it was 
          an easy way to make money. I would tell them, &ldquo;There is nothing easy about owning a 
          restaurant. You&apos;re going to be married to it.&rdquo;
        </p>
        <p className="mag-folio" style={{ fontSize: 17.5, lineHeight: 1.85 }}>
          I would encourage any aspiring entrepreneur to create a real business plan. Understand what 
          you&apos;re building. Those things may not be as exciting as creating the product, designing 
          the logo, or making the first sale, but they&apos;re what allow you to build something sustainable.
        </p>
        <blockquote className="mag-quote" style={{ margin: "auto 0", borderColor: TEAL }}>
          A meaningful business needs both passion and structure.
        </blockquote>
        <p className="mag-foot">The Wellness Issue · 12</p>
        </div>
      </article>

      {/* 13 Unstoppable */}
      <article className="mag-page mag-pad" style={{ paddingBottom: 0 }}>
        <div className="mag-body">
        <div style={{ padding: "0 0 28px" }}>
          <p className="mag-kicker" style={{ color: TEAL }}>Unstoppable</p>
          <h2 className="mag-h mag-h-sm">Setbacks as the springboard for innovation.</h2>
          <p className="mag-folio mag-dropcap" style={{ fontSize: 17.5, lineHeight: 1.85 }}>
            To me, being an unstoppable leader doesn&apos;t mean that you never experience setbacks. It 
            means that when something changes or doesn&apos;t work as planned, you&apos;re willing to learn 
            from it, adapt, and find another way forward.
          </p>
          <p className="mag-folio" style={{ fontSize: 17.5, lineHeight: 1.85 }}>
            In more than ten years of business, I&apos;ve had to pivot many times as markets have changed, 
            new research has emerged, and the needs of my clients have evolved. I&apos;ve watched businesses 
            struggle because they continued doing exactly what they had always done, even when the world 
            around them was telling them it was time to change.
          </p>
        </div>
        <blockquote className="mag-pull" style={{ margin: "auto 12px", fontSize: 30, color: TEAL }}>
          Being open-minded has been one of the most important parts of my growth.
        </blockquote>
        <div className="mag-darkband" style={{ margin: "0 -58px", background: "#0a3d3a" }}>
          Stay committed to your purpose while remaining flexible about the path.
        </div>
        </div>
      </article>

      {/* 14 Photo — gaze */}
      <article className="mag-page mag-bleed">
        <img
          className="mag-fill"
          src={`${IMG}/gaze.jpg`}
          alt=""
          style={{ objectPosition: "center 12%" }}
        />
        <div className="mag-scrim" />
        <div className="mag-overlay">
          <p className="mag-kicker mag-kicker-light">Outlook</p>
          <h2 className="mag-h mag-h-light" style={{ marginTop: "auto", fontSize: 42, maxWidth: 520 }}>
            Technology can be an important part — but we can&apos;t forget the foundation.
          </h2>
          <p
            className="mag-folio"
            style={{ color: "rgba(244,239,230,0.88)", maxWidth: 500, textAlign: "left" }}
          >
            Nutrition, sleep, movement, stress management, and what we consistently put into our bodies 
            still matter tremendously. My hope is that the future of wellness combines those fundamentals 
            with emerging technologies to help people not only live longer, but stay active, independent, 
            and able to enjoy those additional years.
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
            &ldquo;Reveal. Restore. Reverse.&rdquo;
          </p>
        </div>
      </article>

      {/* 15 Method */}
      <article className="mag-page mag-bleed">
        <img
          className="mag-fill"
          src={`${IMG}/studio.jpg`}
          alt=""
          style={{ objectPosition: "center 30%" }}
        />
        <div className="mag-scrim" />
        <div className="mag-overlay">
          <p className="mag-kicker mag-kicker-light">The Method</p>
          <h2 className="mag-h mag-h-light" style={{ marginTop: "auto", fontSize: 42, maxWidth: 520 }}>
            Someone shouldn&apos;t have to live close to my office to have access.
          </h2>
          <p
            className="mag-folio"
            style={{ color: "rgba(244,239,230,0.88)", maxWidth: 500, textAlign: "left" }}
          >
            Technology has given us the ability to reach people across the United States and eventually 
            around the world through education, telehealth, remote testing, and personalized guidance 
            from the comfort of their own homes.
          </p>
          <p
            style={{
              marginTop: 10,
              fontFamily: "var(--font-serif), Georgia, serif",
              fontSize: 16,
              fontStyle: "italic",
              color: CORAL,
            }}
          >
            &ldquo;I want to remove barriers that keep people from being proactive about their health.&rdquo;
          </p>
        </div>
      </article>

      {/* 16 Back cover — PrimeCrest house page */}
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
              The Wellness Issue · Vol. III
            </p>
          </div>
        </div>
      </article>
    </>
  );
}
