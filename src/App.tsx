import { Fragment, useState } from "react";
import {
  ArrowUpRight,
  Check,
  Coins,
  Compass,
  Flame,
  Gift,
  MessageSquare,
  Radio,
  Shield,
  Store,
  Vote,
} from "lucide-react";
import { AmbientBackdrop } from "./AmbientBackdrop";
import { EmblemCanvas, WunStarOrbit } from "./EmblemCanvas";
import { NeutronGraphCard } from "./NeutronGraphCard";

const SIGNUP_URL = "https://www.getwun.app/auth/en?tab=signup";
const SIGNIN_URL = "https://www.getwun.app/auth/en?tab=signin";
const CONSTITUTION_URL = "https://www.getwun.app/constitution/en";

const HERO_TITLE_WORDS = ["Welcome", "to the", "nation", "still", "becoming."] as const;

const HERO_SIGNALS = [
  {
    id: "currency",
    label: "WUNCoin",
    title: "WUNCoin is a digital unit intended for use within the WUN ecosystem.",
    note: "Its legal, technical and economic framework is being developed separately.",
  },
  {
    id: "neutron",
    label: "Neutron Graph",
    title: "Every action travels as a visible pulse across the Neutron network.",
    note: "Passports, deals, and friend bonuses share one live ledger.",
  },
  {
    id: "allies",
    label: "Friend Bonuses",
    title: "Stay close to the project — early friends unlock real perks.",
    note: "We don't sell hype. We notice who is active and reward them.",
  },
  {
    id: "orbita",
    label: "Orbita 3D",
    title: "A 3D ring station above the planet, built step by step.",
    note: "Early citizens get first look at new sectors and docks.",
  },
] as const;

const FRIEND_QUESTS = [
  {
    id: "q1",
    title: "Claim your passport early",
    pts: 25,
    reward: "Wave I Founder Mark on profile",
  },
  {
    id: "q2",
    title: "Say hello in Connect & join a guild",
    pts: 25,
    reward: "Priority channel & ally badge",
  },
  {
    id: "q3",
    title: "Test a room or cast a Ministry vote",
    pts: 25,
    reward: "Active tester WUN bonus drop",
  },
  {
    id: "q4",
    title: "Bring a friend who stays active",
    pts: 25,
    reward: "Inner Circle status & Orbita sector priority",
  },
] as const;

const MODULES_DECK = [
  {
    id: "wun",
    icon: Coins,
    name: "WUNCoin",
    short: "WUNCoin is a digital unit intended for use within the WUN ecosystem. Its legal, technical and economic framework is being developed separately.",
    actionLabel: "Simulate 50 WUN Transfer",
    actionResult: "50 WUN routed via Neutron in 0.4s · Fee: 0",
  },
  {
    id: "connect",
    icon: MessageSquare,
    name: "Connect",
    short: "Chats and guilds where every voice has a real passport.",
    actionLabel: "Ping #early-friends",
    actionResult: "Wave sent to 18 online citizens in #early-friends",
  },
  {
    id: "market",
    icon: Store,
    name: "Market",
    short: "Exchange digital craft, code, and services for WUN.",
    actionLabel: "Preview Instant Escrow",
    actionResult: "Escrow locked · Releases on citizen confirmation",
  },
  {
    id: "ministries",
    icon: Vote,
    name: "Ministries",
    short: "Open proposals where citizens vote in full view.",
    actionLabel: "Back Proposal #42",
    actionResult: "Your sample vote is recorded on the public tally",
  },
  {
    id: "orbita",
    icon: Compass,
    name: "Orbita",
    short: "3D orbital ring sectors currently under construction.",
    actionLabel: "Ping Sector S-01 Radar",
    actionResult: "Sector S-01 Arrival Dock · Online & accepting scouts",
  },
  {
    id: "pulse",
    icon: Radio,
    name: "Civic Pulse",
    short: "Live feed of citizen ideas, launches, and milestones.",
    actionLabel: "Boost a Citizen Idea",
    actionResult: "+1 Signal Boost added to the public feed",
  },
] as const;

const FAQ_SHORT = [
  {
    q: "What is WUN in one sentence?",
    a: "A digital nation where one passport unlocks currency, chats, a peer store, open voting, and a 3D orbital world.",
  },
  {
    q: "How do friend bonuses work?",
    a: "No empty promises: we simply track who shows up early, tests new rooms, and helps the community grow — and we send them perks, badges, and WUN drops.",
  },
  {
    q: "What is WUNCoin?",
    a: "WUNCoin is a digital unit intended for use within the WUN ecosystem. Its legal, technical and economic framework is being developed separately. Nothing on this website constitutes an investment offer, a guarantee of value or a promise of financial return.",
  },
  {
    q: "How fast can I join?",
    a: "Under two minutes at the desk (getwun.app/auth/en) with an email code or password.",
  },
] as const;

export function App() {
  const [signalIdx, setSignalIdx] = useState(0);
  const [checkedQuests, setCheckedQuests] = useState<Record<string, boolean>>({
    q1: true,
    q2: true,
  });
  const [callsign, setCallsign] = useState("Nova Citizen");
  const [passTilt, setPassTilt] = useState({ rx: 0, ry: 0 });
  const [triggeredModules, setTriggeredModules] = useState<Record<string, boolean>>({});
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const activeSignal = HERO_SIGNALS[signalIdx];

  const friendshipScore = FRIEND_QUESTS.reduce(
    (acc, q) => acc + (checkedQuests[q.id] ? q.pts : 0),
    0
  );

  const friendTier =
    friendshipScore >= 100
      ? "INNER CIRCLE ALLY"
      : friendshipScore >= 75
        ? "CORE FRIEND · TIER III"
        : friendshipScore >= 50
          ? "ACTIVE FRIEND · TIER II"
          : "EARLY VISITOR · TIER I";

  return (
    <div className="showcase-page">
      <AmbientBackdrop />

      {/* Top Navigation */}
      <header className="topbar">
        <div className="container topbar-inner">
          <a href="#top" className="brand-lockup">
            <WunStarOrbit className="brand-mini-emblem" period={12} />
            <span className="brand-word copy-card">
              WORLD UNION <b>NATION</b>
            </span>
          </a>

          <nav className="topbar-nav copy-card" aria-label="Primary">
            <a href="#neutron">Neutron Graph</a>
            <a href="#friends">Friend Bonuses</a>
            <a href="#modules">Modules</a>
            <a href="#faq">FAQ</a>
            <a href={CONSTITUTION_URL} target="_blank" rel="noreferrer">
              Constitution
            </a>
          </nav>

          <div className="topbar-actions">
            <a href={SIGNIN_URL} className="btn-ghost-sm">
              Sign In
            </a>
            <a href={SIGNUP_URL} className="btn-primary-sm">
              <span>Join</span>
              <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      </header>

      <main id="top">
        {/* HERO SECTION */}
        <section className="hero-section">
          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="hero-title copy-card">
                <span className="hero-light-beam" aria-hidden="true" />
                <span className="hero-signal-pulse" aria-hidden="true" />
                <span className="hero-kicker">A nation beyond borders</span>
                <h1 className="hero-title-line">
                  {HERO_TITLE_WORDS.map((word, i) => (
                    <Fragment key={word}>
                      {i > 0 && " "}
                      <span className={`hero-title-word hero-title-word-${i + 1}`}>
                        {word}
                      </span>
                    </Fragment>
                  ))}
                </h1>
                <p className="hero-title-support">
                  A living digital world, built in public with the people who choose to call it
                  theirs.
                </p>
                <p className="hero-operator-note">
                  A digital platform and community project operated by WUN LLC.
                </p>
                <span className="hero-title-rule" aria-hidden="true" />
              </div>

              <p className="hero-lead copy-card">
                Zero hype. One passport for currency, chats, trade, voting, and our 3D orbital
                station. Show up early and stay active — friends who remain may earn perks.
              </p>

              {/* Interactive Signal Tuner */}
              <div className="hero-room-Spotlighter">
                <div className="spotlighter-header">
                  <span>LIVE SIGNAL TUNER</span>
                  <span className="spotlighter-code">0{signalIdx + 1} / 04</span>
                </div>

                <div className="room-pill-row" role="tablist" aria-label="Tune nation signal">
                  {HERO_SIGNALS.map((sig, idx) => (
                    <button
                      key={sig.id}
                      type="button"
                      role="tab"
                      aria-selected={idx === signalIdx}
                      className={idx === signalIdx ? "room-pill is-active" : "room-pill"}
                      onClick={() => setSignalIdx(idx)}
                    >
                      <span>{sig.label}</span>
                    </button>
                  ))}
                </div>

                <div className="spotlighter-body">
                  <h3>{activeSignal.title}</h3>
                  <p>{activeSignal.note}</p>
                </div>
              </div>

              <div className="hero-cta-row">
                <a href={SIGNUP_URL} className="btn-primary-lg">
                  <span>Get Your Passport</span>
                  <ArrowUpRight size={18} />
                </a>
                <a href="#neutron" className="btn-secondary-lg">
                  <span>Explore Neutron Graph</span>
                </a>
              </div>
            </div>

            {/* Right Column: Reference SplashScreen Emblem */}
            <div className="hero-stage-col">
              <EmblemCanvas activeRoomName={activeSignal.label} />
            </div>
          </div>
        </section>

        {/* NEUTRON ANIMATED GRAPH SECTION */}
        <section className="bento-section" id="neutron">
          <div className="container">
            <div className="section-header copy-card">
              <p className="section-kicker">01 · NEUTRON NETWORK</p>
              <h2 className="section-title">
                Watch the nation <span className="text-gradient">move in real time.</span>
              </h2>
              <p className="section-sub">
                Click any node on the Neutron graph or fire a test impulse to see how passports,
                peer deals, and friend bonuses flow together.
              </p>
            </div>

            <NeutronGraphCard />
          </div>
        </section>

        {/* INTERACTIVE FRIENDSHIP & BONUS SIMULATOR */}
        <section className="allies-section" id="friends">
          <div className="container">
            <div className="allies-grid">
              <div className="allies-copy">
                <div className="allies-intro copy-card">
                  <p className="section-kicker">02 · EARLY FRIENDS PERKS</p>
                  <h2 className="section-title">
                    No loud promises. <span className="text-gradient">Real bonuses for friends.</span>
                  </h2>
                  <p className="section-sub">
                    Toggle the actions below to see how active friends unlock perks inside World
                    Union Nation.
                  </p>
                </div>

                <div className="quest-checklist">
                  {FRIEND_QUESTS.map((q) => {
                    const on = !!checkedQuests[q.id];
                    return (
                      <button
                        key={q.id}
                        type="button"
                        className={on ? "quest-item is-checked" : "quest-item"}
                        onClick={() =>
                          setCheckedQuests((prev) => ({ ...prev, [q.id]: !prev[q.id] }))
                        }
                      >
                        <span className="quest-box">{on && <Check size={14} />}</span>
                        <div className="quest-text">
                          <strong>{q.title}</strong>
                          <span>Unlocks: {q.reward}</span>
                        </div>
                        <span className="quest-pts">+{q.pts}%</span>
                      </button>
                    );
                  })}
                </div>

                <div className="pass-customizer">
                  <label className="customizer-label" htmlFor="citizen-handle-input">
                    Your callsign on the pass:
                  </label>
                  <input
                    id="citizen-handle-input"
                    type="text"
                    maxLength={22}
                    value={callsign}
                    onChange={(e) => setCallsign(e.target.value)}
                    placeholder="Enter your name"
                    className="customizer-input"
                  />
                </div>
              </div>

              {/* Interactive 3D-Tilting Citizen Passport Card */}
              <div className="pass-preview-wrap">
                <div
                  className="pioneer-pass-card"
                  style={{
                    transform: `perspective(900px) rotateX(${passTilt.rx}deg) rotateY(${passTilt.ry}deg)`,
                  }}
                  onPointerMove={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    const x = (e.clientX - r.left) / r.width - 0.5;
                    const y = (e.clientY - r.top) / r.height - 0.5;
                    setPassTilt({ rx: -y * 10, ry: x * 12 });
                  }}
                  onPointerLeave={() => setPassTilt({ rx: 0, ry: 0 })}
                >
                  <div className="pass-top">
                    <span className="pass-issuer">WORLD UNION NATION · ALLY PASS</span>
                    <span className="pass-wave">{friendTier}</span>
                  </div>

                  <div className="pass-identity">
                    <div className="pass-avatar">
                      <WunStarOrbit className="pass-mini-star" period={10.5} />
                    </div>
                    <div>
                      <span className="pass-role-tag">FRIENDSHIP SYNC · {friendshipScore}%</span>
                      <h3 className="pass-holder-name">{callsign.trim() || "New Friend"}</h3>
                    </div>
                  </div>

                  <div className="friendship-meter">
                    <div
                      className="friendship-meter-fill"
                      style={{ width: `${friendshipScore}%` }}
                    />
                  </div>

                  <div className="pass-perk-box">
                    <span>UNLOCKED FRIEND BONUSES</span>
                    <ul className="unlocked-perks-list">
                      {FRIEND_QUESTS.filter((q) => checkedQuests[q.id]).map((q) => (
                        <li key={q.id}>
                          <Gift size={13} />
                          <span>{q.reward}</span>
                        </li>
                      ))}
                      {friendshipScore === 0 && (
                        <li>
                          <Flame size={13} />
                          <span>Select any action on the left to unlock perks</span>
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="pass-bottom">
                    <div>
                      <span>NETWORK</span>
                      <strong>Neutron Live</strong>
                    </div>
                    <div>
                      <span>ENTRY DESK</span>
                      <strong>Instant</strong>
                    </div>
                    <a href={SIGNUP_URL} className="btn-primary-sm">
                      <span>Claim Pass</span>
                      <ArrowUpRight size={14} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE 6 MODULES ACTION DECK */}
        <section className="bento-section" id="modules">
          <div className="container">
            <div className="section-header copy-card">
              <p className="section-kicker">03 · SIX CONNECTED ROOMS</p>
              <h2 className="section-title">
                Test each room <span className="text-gradient">with one click.</span>
              </h2>
            </div>

            <div className="bento-grid">
              {MODULES_DECK.map((m) => {
                const Icon = m.icon;
                const fired = !!triggeredModules[m.id];
                return (
                  <article key={m.id} className="bento-card bento-span-4">
                    <div className="bento-card-top">
                      <div className="bento-badge">
                        <Icon size={15} />
                        <span>{m.name.toUpperCase()}</span>
                      </div>
                      <Shield size={14} className="trust-icon" />
                    </div>

                    <h3 className="bento-heading">{m.name}</h3>
                    <p className="bento-copy">{m.short}</p>

                    <div className="mini-ui module-ping-box">
                      <button
                        type="button"
                        className={fired ? "module-ping-btn is-fired" : "module-ping-btn"}
                        onClick={() =>
                          setTriggeredModules((prev) => ({ ...prev, [m.id]: !prev[m.id] }))
                        }
                      >
                        <span>{m.actionLabel}</span>
                        <ArrowUpRight size={14} />
                      </button>
                      <p className="module-ping-output">
                        {fired ? m.actionResult : "Click above to test this room"}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="faq-section" id="faq">
          <div className="container faq-container">
            <div className="section-header copy-card">
              <p className="section-kicker">04 · QUICK FAQ</p>
              <h2 className="section-title">
                <span className="text-gradient">Short answers.</span>
              </h2>
            </div>

            <div className="faq-list">
              {FAQ_SHORT.map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={item.q} className={isOpen ? "faq-item is-open" : "faq-item"}>
                    <button
                      type="button"
                      className="faq-trigger"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                    >
                      <span>{item.q}</span>
                      <span className="faq-plus">{isOpen ? "−" : "+"}</span>
                    </button>
                    {isOpen && <p className="faq-answer">{item.a}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="final-cta-section">
          <div className="container">
            <div className="final-cta-card">
              <h2>Be an early friend of the nation.</h2>
              <p>
                Register in two minutes, get your passport, and start collecting early ally bonuses.
              </p>
              <div className="final-cta-buttons">
                <a href={SIGNUP_URL} className="btn-primary-lg">
                  <span>Enter Passport Desk</span>
                  <ArrowUpRight size={18} />
                </a>
                <a href={SIGNIN_URL} className="btn-secondary-lg">
                  Sign In
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="footer-brand copy-card">
            WORLD UNION <b>NATION</b>
          </div>
          <div className="footer-company copy-card">
            <p>World Union Nation is a digital platform operated by WUN LLC.</p>
            <address>
              WUN LLC
              <br />
              Identification No. 405871356
              <br />
              18 Akaki Kvantaliani Street, Saburtalo District, Tbilisi, Georgia
              <br />
              <a href="mailto:info@worldunion.live">info@worldunion.live</a>
            </address>
            <p className="footer-copyright">© 2026 WUN LLC. All rights reserved.</p>
          </div>
          <div className="footer-links copy-card">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Use</a>
            <a href="mailto:info@worldunion.live">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
