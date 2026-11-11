import { useEffect, useId, useState } from "react";

const CX = 128;
const CY = 140;
const RX = 112;
const RY = 30;
const TILT = -16;
const LOOP = `M${CX + RX},${CY} A${RX},${RY} 0 1,0 ${CX - RX},${CY} A${RX},${RY} 0 1,0 ${CX + RX},${CY}`;
const BACK = `M${CX + RX},${CY} A${RX},${RY} 0 0,0 ${CX - RX},${CY}`;
const FRONT = `M${CX - RX},${CY} A${RX},${RY} 0 0,0 ${CX + RX},${CY}`;
const RING_RATIO = RY / RX;
const PLANET_RINGS = [
  { rx: 16.4, ice: 1.15 },
  { rx: 19.2, ice: 1.55 },
  { rx: 22.2, ice: 0.95 },
] as const;
const LIGHT_REACH = 16;

// Lit limb points back at the star. Samples follow the orbit's arc length so the
// highlight stays on the star-facing side instead of using a fixed local gradient.
const STAR_LIGHT = (() => {
  const steps = 12;
  const n = 720;
  const seg = (Math.PI * 2) / n;
  const cum = [0];
  for (let i = 1; i <= n; i += 1) {
    const phi = (i - 0.5) * seg;
    cum.push(cum[i - 1] + Math.hypot(RX * Math.sin(phi), RY * Math.cos(phi)) * seg);
  }
  const total = cum[n];
  const xs: string[] = [];
  const ys: string[] = [];
  const ts: string[] = [];
  for (let s = 0; s <= steps; s += 1) {
    const target = (s / steps) * total;
    let idx = n;
    if (s !== steps) {
      idx = 0;
      while (idx < n && cum[idx] < target) idx += 1;
    }
    const phi = (idx / n) * Math.PI * 2;
    const vx = RX * Math.cos(phi);
    const vy = -RY * Math.sin(phi);
    const len = Math.hypot(vx, vy) || 1;
    xs.push(((-vx / len) * LIGHT_REACH).toFixed(2));
    ys.push(((-vy / len) * LIGHT_REACH).toFixed(2));
    ts.push((s / steps).toFixed(4));
  }
  return { cx: xs.join(";"), cy: ys.join(";"), keyTimes: ts.join(";") };
})();

function TrackedCoord({
  attribute,
  values,
  period,
  reduced,
}: {
  attribute: "cx" | "cy";
  values: string;
  period: number;
  reduced: boolean;
}) {
  if (reduced) return null;
  return (
    <animate
      attributeName={attribute}
      dur={`${period}s`}
      repeatCount="indefinite"
      values={values}
      keyTimes={STAR_LIGHT.keyTimes}
      calcMode="linear"
    />
  );
}

function PlanetRings({ clipId, iceOpacity }: { clipId: string; iceOpacity: number }) {
  return (
    <g className="wun-orbit__rings">
      {PLANET_RINGS.map((band) => {
        const ry = band.rx * RING_RATIO;
        const edgeRx = band.rx + 0.55;
        return (
          <g key={band.rx}>
            <ellipse
              clipPath={`url(#${clipId})`}
              rx={edgeRx}
              ry={edgeRx * RING_RATIO}
              fill="none"
              stroke="#E4C56A"
              strokeWidth={0.55}
              strokeOpacity={0.5}
            />
            <ellipse
              clipPath={`url(#${clipId})`}
              rx={band.rx}
              ry={ry}
              fill="none"
              stroke="#E7F6FF"
              strokeWidth={band.ice}
              strokeOpacity={iceOpacity}
            />
          </g>
        );
      })}
    </g>
  );
}

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(
    () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
  );
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
};

interface WunStarOrbitProps {
  className?: string;
  period?: number;
}

export function WunStarOrbit({ className, period = 8 }: WunStarOrbitProps) {
  const reduced = usePrefersReducedMotion();
  const compact = className?.includes("mini") ?? false;
  const uid = useId().replace(/:/g, "");
  const ids = {
    blueL: `wbl${uid}`,
    blueD: `wbd${uid}`,
    goldL: `wgl${uid}`,
    goldD: `wgd${uid}`,
    ring: `wgr${uid}`,
    back: `wcb${uid}`,
    front: `wcf${uid}`,
    planetAtmo: `wpa${uid}`,
    clouds: `wpc${uid}`,
    starlight: `wps${uid}`,
    sheen: `wph${uid}`,
    orbitGlow: `wog${uid}`,
    ringBack: `wrb${uid}`,
    ringFront: `wrf${uid}`,
  };

  const orbitLine = (d: string) => (
    <>
      {!compact && (
        <path
          className="wun-orbit__line wun-orbit__glow"
          d={d}
          stroke="#E8C97A"
          pathLength={100}
          filter={`url(#${ids.orbitGlow})`}
        />
      )}
      <path className="wun-orbit__line" d={d} stroke={`url(#${ids.ring})`} pathLength={100} />
    </>
  );

  const planet = (clip: string) => (
    <g clipPath={`url(#${clip})`}>
      <g transform={reduced ? `translate(${CX + RX * 0.7} ${CY + RY * 0.71})` : undefined}>
        <g className="wun-orbit__planet">
          <PlanetRings clipId={ids.ringBack} iceOpacity={0.62} />
          <circle r="16.6" fill={`url(#${ids.planetAtmo})`} />
          <circle r="14" fill={`url(#${ids.clouds})`} />
          <circle r="14" fill={`url(#${ids.starlight})`} />
          <circle r="14" fill={`url(#${ids.sheen})`} />
          <PlanetRings clipId={ids.ringFront} iceOpacity={0.84} />
          {!reduced && <animateMotion dur={`${period}s`} repeatCount="indefinite" path={LOOP} />}
        </g>
      </g>
    </g>
  );

  return (
    <svg className={className} viewBox="-6 0 268 268" aria-hidden="true">
      <defs>
        <linearGradient id={ids.blueL} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4A9BC7" />
          <stop offset="100%" stopColor="#3A87B3" />
        </linearGradient>
        <linearGradient id={ids.blueD} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1F688E" />
          <stop offset="100%" stopColor="#0F5580" />
        </linearGradient>
        <linearGradient id={ids.goldL} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F6E3A1" />
          <stop offset="100%" stopColor="#E0BC5C" />
        </linearGradient>
        <linearGradient id={ids.goldD} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D2A445" />
          <stop offset="100%" stopColor="#A77B22" />
        </linearGradient>
        <linearGradient id={ids.ring} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#F1D688" />
          <stop offset="55%" stopColor="#D9AE4C" />
          <stop offset="100%" stopColor="#B88A2C" />
        </linearGradient>
        <pattern id={ids.clouds} width="16" height="28" patternUnits="userSpaceOnUse" x="-8" y="-14">
          <rect width="16" height="28" fill="#163E72" />
          <rect y="2" width="16" height="3.5" fill="#6EB4E4" opacity="0.42" />
          <rect y="9" width="16" height="5" fill="#C5E8FF" opacity="0.22" />
          <rect y="17" width="16" height="3" fill="#0E2C52" opacity="0.55" />
          <rect y="23" width="16" height="2.5" fill="#4E97D4" opacity="0.32" />
          {!reduced && (
            <animateTransform
              attributeName="patternTransform"
              type="translate"
              from="0 0"
              to="16 0"
              dur="20s"
              repeatCount="indefinite"
            />
          )}
        </pattern>
        <radialGradient
          id={ids.starlight}
          gradientUnits="userSpaceOnUse"
          cx={reduced ? -16 : STAR_LIGHT.cx.split(";")[0]}
          cy={reduced ? -4 : STAR_LIGHT.cy.split(";")[0]}
          r="34"
        >
          <stop offset="0%" stopColor="#F7FCFF" stopOpacity="0.42" />
          <stop offset="32%" stopColor="#D4F4FF" stopOpacity="0.26" />
          <stop offset="58%" stopColor="#7EB6EA" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#0E2848" stopOpacity="0" />
          <TrackedCoord attribute="cx" values={STAR_LIGHT.cx} period={period} reduced={reduced} />
          <TrackedCoord attribute="cy" values={STAR_LIGHT.cy} period={period} reduced={reduced} />
        </radialGradient>
        <radialGradient
          id={ids.sheen}
          gradientUnits="userSpaceOnUse"
          cx={reduced ? -12 : STAR_LIGHT.cx.split(";")[0]}
          cy={reduced ? -3 : STAR_LIGHT.cy.split(";")[0]}
          r="11"
        >
          <stop offset="0%" stopColor="#F7FEFF" stopOpacity="0.55" />
          <stop offset="45%" stopColor="#D7F6FF" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#D7F6FF" stopOpacity="0" />
          <TrackedCoord attribute="cx" values={STAR_LIGHT.cx} period={period} reduced={reduced} />
          <TrackedCoord attribute="cy" values={STAR_LIGHT.cy} period={period} reduced={reduced} />
          {!reduced && (
            <animate
              attributeName="cx"
              additive="sum"
              dur="18s"
              values="-3.5;4;-1.5;3.5;-3.5"
              repeatCount="indefinite"
            />
          )}
          {!reduced && (
            <animate
              attributeName="cy"
              additive="sum"
              dur="22s"
              values="-2.5;2.5;-3;2;-2.5"
              repeatCount="indefinite"
            />
          )}
        </radialGradient>
        <filter id={ids.orbitGlow} x="-12%" y="-80%" width="124%" height="260%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="2.1" />
        </filter>
        <radialGradient id={ids.planetAtmo} cx="50%" cy="50%" r="50%">
          <stop offset="64%" stopColor="#D7EEFF" stopOpacity="0" />
          <stop offset="84%" stopColor="#C5E4FF" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#8EBFEE" stopOpacity="0" />
        </radialGradient>
        <clipPath id={ids.back} clipPathUnits="userSpaceOnUse">
          <rect x="-40" y="-40" width="340" height={CY + 40} />
        </clipPath>
        <clipPath id={ids.front} clipPathUnits="userSpaceOnUse">
          <rect x="-40" y={CY} width="340" height="200" />
        </clipPath>
        <clipPath id={ids.ringBack} clipPathUnits="objectBoundingBox">
          <rect x="0" y="0" width="1" height="0.5" />
        </clipPath>
        <clipPath id={ids.ringFront} clipPathUnits="objectBoundingBox">
          <rect x="0" y="0.5" width="1" height="0.5" />
        </clipPath>
      </defs>
      <g transform={`rotate(${TILT} ${CX} ${CY})`}>
        {orbitLine(BACK)}
        {planet(ids.back)}
      </g>
      <g className="wun-orbit__star">
        <polygon points="128,132 105.44,85.15 128.00,10.00" fill={`url(#${ids.blueL})`} />
        <polygon points="128,132 128.00,10.00 150.56,85.15" fill={`url(#${ids.blueD})`} />
        <polygon points="128,132 150.56,85.15 223.38,55.93" fill={`url(#${ids.blueL})`} />
        <polygon points="128,132 223.38,55.93 178.70,120.43" fill={`url(#${ids.blueD})`} />
        <polygon points="128,132 178.70,120.43 246.94,159.15" fill={`url(#${ids.blueL})`} />
        <polygon points="128,132 246.94,159.15 168.66,164.42" fill={`url(#${ids.blueD})`} />
        <polygon points="128,132 168.66,164.42 180.93,241.92" fill={`url(#${ids.blueL})`} />
        <polygon points="128,132 180.93,241.92 128.00,184.00" fill={`url(#${ids.blueD})`} />
        <polygon points="128,132 128.00,184.00 75.07,241.92" fill={`url(#${ids.blueL})`} />
        <polygon points="128,132 75.07,241.92 87.34,164.42" fill={`url(#${ids.blueD})`} />
        <polygon points="128,132 87.34,164.42 9.06,159.15" fill={`url(#${ids.blueL})`} />
        <polygon points="128,132 9.06,159.15 77.30,120.43" fill={`url(#${ids.blueD})`} />
        <polygon points="128,132 77.30,120.43 32.62,55.93" fill={`url(#${ids.blueL})`} />
        <polygon points="128,132 32.62,55.93 105.44,85.15" fill={`url(#${ids.blueD})`} />
        <polygon points="128,132 117.59,110.38 128.00,68.00" fill={`url(#${ids.goldL})`} />
        <polygon points="128,132 128.00,68.00 138.41,110.38" fill={`url(#${ids.goldD})`} />
        <polygon points="128,132 138.41,110.38 178.04,92.10" fill={`url(#${ids.goldL})`} />
        <polygon points="128,132 178.04,92.10 151.40,126.66" fill={`url(#${ids.goldD})`} />
        <polygon points="128,132 151.40,126.66 190.40,146.24" fill={`url(#${ids.goldL})`} />
        <polygon points="128,132 190.40,146.24 146.76,146.96" fill={`url(#${ids.goldD})`} />
        <polygon points="128,132 146.76,146.96 155.77,189.66" fill={`url(#${ids.goldL})`} />
        <polygon points="128,132 155.77,189.66 128.00,156.00" fill={`url(#${ids.goldD})`} />
        <polygon points="128,132 128.00,156.00 100.23,189.66" fill={`url(#${ids.goldL})`} />
        <polygon points="128,132 100.23,189.66 109.24,146.96" fill={`url(#${ids.goldD})`} />
        <polygon points="128,132 109.24,146.96 65.60,146.24" fill={`url(#${ids.goldL})`} />
        <polygon points="128,132 65.60,146.24 104.60,126.66" fill={`url(#${ids.goldD})`} />
        <polygon points="128,132 104.60,126.66 77.96,92.10" fill={`url(#${ids.goldL})`} />
        <polygon points="128,132 77.96,92.10 117.59,110.38" fill={`url(#${ids.goldD})`} />
      </g>
      <g transform={`rotate(${TILT} ${CX} ${CY})`}>
        {orbitLine(FRONT)}
        {planet(ids.front)}
      </g>
    </svg>
  );
}

interface EmblemCanvasProps {
  activeRoomName?: string;
}

export function EmblemCanvas(_props: EmblemCanvasProps) {
  return (
    <div className="wun-splash-card" role="img" aria-label="World Union Nation">
      <div className="wun-splash__drift" aria-hidden="true">
        <svg viewBox="0 0 40 40" className="wun-splash__shape s1">
          <circle cx="20" cy="20" r="17" />
        </svg>
        <svg viewBox="0 0 40 40" className="wun-splash__shape s2 ring">
          <circle cx="20" cy="20" r="16" />
        </svg>
        <svg viewBox="0 0 40 40" className="wun-splash__shape s3">
          <polygon points="20,2 36,11 36,29 20,38 4,29 4,11" />
        </svg>
        <svg viewBox="0 0 40 40" className="wun-splash__shape s4">
          <polygon points="20,4 37,35 3,35" />
        </svg>
        <svg viewBox="0 0 40 40" className="wun-splash__shape s5">
          <polygon points="20,2 24.7,14.5 38,15 27.5,23.3 31.2,36.2 20,28.8 8.8,36.2 12.5,23.3 2,15 15.3,14.5" />
        </svg>
        <svg viewBox="0 0 40 40" className="wun-splash__shape s6 ring">
          <circle cx="20" cy="20" r="16" />
        </svg>
      </div>

      <div className="wun-splash__stack">
        <WunStarOrbit className="wun-splash__mark" />
        <p className="wun-splash__wordmark" aria-label="World Union Nation">
          {"WORLD UNION NATION".split("").map((ch, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="wun-splash__letter"
              style={{ animationDelay: `${750 + i * 75}ms` }}
            >
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </p>
        <div className="wun-splash__rule" aria-hidden="true">
          <span />
        </div>
      </div>
    </div>
  );
}
