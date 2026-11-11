import { useEffect, useRef, useState } from "react";
import { Activity, Sparkles, Zap } from "lucide-react";

type NodeIcon = "seal" | "orb" | "lock" | "star" | "drop";

interface NeutronNode {
  id: string;
  label: string;
  system: boolean;
  icon: NodeIcon;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

interface NeutronEdge {
  s: number;
  t: number;
  weight: number;
  kind: "sync" | "reward" | "trade";
}

interface PulseParticle {
  edgeIdx: number;
  t: number;
  speed: number;
  burst?: boolean;
  life?: number;
}

const ICON_PATHS: Record<NodeIcon, string> = {
  drop: "M12 3c3 4 5 6.5 5 9a5 5 0 0 1-10 0c0-2.5 2-5 5-9z",
  orb: "M9 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0M3 12c3-4 15-4 18 0M3 12c3 4 15 4 18 0",
  lock: "M7 11h10v8H7zM9 11V8a3 3 0 0 1 6 0v3",
  seal: "M12 3l2.5 2h3l.8 3 2 2.5-1.5 2.7.3 3-2.9 1-1.7 2.6L12 19l-2.5 1.8-1.7-2.6-2.9-1 .3-3L3.7 12.5l2-2.5.8-3h3z",
  star: "M12 4l2.3 5 5.4.5-4.1 3.6 1.2 5.3L12 15.7 7.2 18.4l1.2-5.3L4.3 9.5 9.7 9z",
};

const INITIAL_NODES: Omit<NeutronNode, "vx" | "vy">[] = [
  { id: "neutron", label: "Neutron Core", system: true, icon: "star", x: 340, y: 155, r: 20 },
  { id: "passport", label: "Passport ID", system: true, icon: "seal", x: 165, y: 88, r: 16 },
  { id: "rewards", label: "Friend Drops", system: true, icon: "drop", x: 515, y: 86, r: 16 },
  { id: "orbita", label: "Orbita Ring", system: true, icon: "orb", x: 525, y: 230, r: 16 },
  { id: "market", label: "Peer Escrow", system: true, icon: "lock", x: 170, y: 232, r: 16 },
  { id: "c1", label: "@elena", system: false, icon: "seal", x: 75, y: 145, r: 9 },
  { id: "c2", label: "@marcus", system: false, icon: "seal", x: 265, y: 46, r: 9 },
  { id: "c3", label: "@sora", system: false, icon: "seal", x: 425, y: 48, r: 9 },
  { id: "c4", label: "@nadia", system: false, icon: "seal", x: 615, y: 155, r: 9 },
  { id: "c5", label: "@atlas", system: false, icon: "seal", x: 340, y: 265, r: 9 },
];

const EDGES: NeutronEdge[] = [
  { s: 0, t: 1, weight: 3, kind: "sync" },
  { s: 0, t: 2, weight: 3, kind: "reward" },
  { s: 0, t: 3, weight: 3, kind: "sync" },
  { s: 0, t: 4, weight: 3, kind: "trade" },
  { s: 1, t: 2, weight: 2, kind: "reward" },
  { s: 2, t: 3, weight: 2, kind: "reward" },
  { s: 3, t: 4, weight: 2, kind: "trade" },
  { s: 4, t: 1, weight: 2, kind: "sync" },
  { s: 1, t: 5, weight: 1.4, kind: "sync" },
  { s: 4, t: 5, weight: 1.4, kind: "trade" },
  { s: 1, t: 6, weight: 1.4, kind: "sync" },
  { s: 0, t: 6, weight: 1.5, kind: "reward" },
  { s: 2, t: 7, weight: 1.6, kind: "reward" },
  { s: 0, t: 7, weight: 1.4, kind: "sync" },
  { s: 2, t: 8, weight: 1.6, kind: "reward" },
  { s: 3, t: 8, weight: 1.5, kind: "sync" },
  { s: 3, t: 9, weight: 1.5, kind: "trade" },
  { s: 4, t: 9, weight: 1.5, kind: "trade" },
];

function curvePoint(ax: number, ay: number, bx: number, by: number, t: number, bend = 0.16) {
  const mx = (ax + bx) / 2 + (by - ay) * bend;
  const my = (ay + by) / 2 - (bx - ax) * bend;
  const u = 1 - t;
  return {
    x: u * u * ax + 2 * u * t * mx + t * t * bx,
    y: u * u * ay + 2 * u * t * my + t * t * by,
    mx,
    my,
  };
}

export function NeutronGraphCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedId, setSelectedId] = useState<string>("neutron");
  const [filterKind, setFilterKind] = useState<"all" | "reward" | "sync" | "trade">("all");
  const [pulseCount, setPulseCount] = useState(14);

  const stateRef = useRef({
    nodes: INITIAL_NODES.map((n) => ({ ...n, vx: 0, vy: 0 })),
    particles: [] as PulseParticle[],
    selected: "neutron",
    filter: "all" as "all" | "reward" | "sync" | "trade",
    w: 680,
    h: 310,
  });

  useEffect(() => {
    stateRef.current.selected = selectedId;
  }, [selectedId]);

  useEffect(() => {
    stateRef.current.filter = filterKind;
  }, [filterKind]);

  const emitBurstFrom = (nodeId: string) => {
    const s = stateRef.current;
    const nodeIdx = s.nodes.findIndex((n) => n.id === nodeId);
    const targetIdx = nodeIdx >= 0 ? nodeIdx : 0;
    EDGES.forEach((edge, ei) => {
      if (edge.s === targetIdx || edge.t === targetIdx) {
        s.particles.push({
          edgeIdx: ei,
          t: 0,
          speed: 0.55 + Math.random() * 0.25,
          burst: true,
          life: 1,
        });
      }
    });
    setPulseCount((c) => c + 1);
  };

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const s = stateRef.current;

    // Seed continuous ambient particles along edges
    s.particles = [];
    EDGES.forEach((_, ei) => {
      for (let j = 0; j < 2; j++) {
        s.particles.push({
          edgeIdx: ei,
          t: (j * 0.5 + ei * 0.13) % 1,
          speed: 0.14 + (ei % 3) * 0.04,
        });
      }
    });

    const iconCache = new Map<NodeIcon, Path2D>();
    const getIcon = (k: NodeIcon) => {
      let p = iconCache.get(k);
      if (!p && typeof Path2D !== "undefined") {
        p = new Path2D(ICON_PATHS[k]);
        iconCache.set(k, p);
      }
      return p;
    };

    const resize = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const nw = Math.max(260, r.width);
      const nh = 310;
      if (Math.abs(nw - s.w) > 1) {
        const sx = nw / s.w;
        s.nodes.forEach((n) => {
          n.x *= sx;
        });
      }
      s.w = nw;
      s.h = nh;
      cv.width = Math.round(nw * dpr);
      cv.height = Math.round(nh * dpr);
      cv.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(cv);

    let raf = 0;
    let last = performance.now();
    let clock = 0;

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      clock += dt;

      const ctx = cv.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, s.w, s.h);

      // Gentle breathing drift on nodes
      s.nodes.forEach((n, idx) => {
        n.x += Math.sin(clock * 1.1 + idx * 1.3) * 0.08;
        n.y += Math.cos(clock * 0.9 + idx * 1.7) * 0.08;
      });

      // Draw curved edges
      EDGES.forEach((e) => {
        if (s.filter !== "all" && e.kind !== s.filter) return;
        const a = s.nodes[e.s];
        const b = s.nodes[e.t];
        const isHot = s.selected && (a.id === s.selected || b.id === s.selected);
        const { mx, my } = curvePoint(a.x, a.y, b.x, b.y, 0.5);

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.quadraticCurveTo(mx, my, b.x, b.y);
        ctx.strokeStyle = isHot
          ? "rgba(224, 188, 92, 0.78)"
          : e.kind === "reward"
            ? "rgba(201, 160, 67, 0.28)"
            : "rgba(90, 174, 240, 0.24)";
        ctx.lineWidth = isHot ? 2.2 : 1.3;
        ctx.stroke();
      });

      // Draw flowing particles along edges
      s.particles = s.particles.filter((p) => {
        const e = EDGES[p.edgeIdx];
        if (!e) return false;
        if (s.filter !== "all" && e.kind !== s.filter) return true;

        p.t += dt * p.speed;
        if (p.burst) {
          if (p.t >= 1) {
            p.life = (p.life ?? 1) - dt * 2.4;
            if ((p.life ?? 0) <= 0) return false;
          }
        } else {
          p.t %= 1;
        }

        const a = s.nodes[e.s];
        const b = s.nodes[e.t];
        const q = curvePoint(a.x, a.y, b.x, b.y, Math.min(1, p.t));

        ctx.fillStyle = e.kind === "reward" || p.burst ? "#E7C877" : "#67B9F0";
        ctx.globalAlpha = p.burst ? Math.max(0, Math.min(1, p.life ?? 1)) : 0.88;
        ctx.beginPath();
        ctx.arc(q.x, q.y, p.burst ? 4.6 : 2.6, 0, Math.PI * 2);
        ctx.fill();

        if (p.burst) {
          ctx.globalAlpha *= 0.28;
          ctx.beginPath();
          ctx.arc(q.x, q.y, 11, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        return true;
      });

      // Draw system & citizen nodes
      ctx.textAlign = "center";
      s.nodes.forEach((n) => {
        const isSel = s.selected === n.id;

        if (n.system) {
          // Outer halo
          ctx.fillStyle = isSel ? "rgba(224, 188, 92, 0.28)" : "rgba(201, 160, 67, 0.14)";
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r + (isSel ? 8 : 5), 0, Math.PI * 2);
          ctx.fill();

          // Gold node disc
          const g = ctx.createRadialGradient(n.x - n.r / 3, n.y - n.r / 3, 1, n.x, n.y, n.r);
          g.addColorStop(0, "#F5DF9E");
          g.addColorStop(1, "#B98F35");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
          ctx.fill();

          const p = getIcon(n.icon);
          if (p) {
            ctx.save();
            const sc = (n.r * 1.15) / 24;
            ctx.translate(n.x - 12 * sc, n.y - 12 * sc);
            ctx.scale(sc, sc);
            ctx.strokeStyle = "#1E1912";
            ctx.lineWidth = 1.8;
            ctx.stroke(p);
            ctx.restore();
          }
        } else {
          // Citizen node
          ctx.fillStyle = isSel ? "#67B9F0" : "#2D6C9E";
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = isSel ? "#F5DF9E" : "rgba(255,255,255,0.35)";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Node label
        ctx.font = n.system ? "500 12px Outfit, sans-serif" : "400 11px Outfit, sans-serif";
        ctx.fillStyle = isSel ? "#F5EFE2" : "rgba(215, 222, 240, 0.78)";
        ctx.fillText(n.label, n.x, n.y + n.r + 15);
      });
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <article className="neutron-card">
      <div className="neutron-card-header">
        <div className="neutron-copy copy-card">
          <div className="bento-badge">
            <Activity size={15} />
            <span>NEUTRON NETWORK · LIVE FLOW GRAPH</span>
          </div>
          <h3 className="neutron-title">
            Every passport, deal, and friend bonus moves through one living graph.
          </h3>
        </div>

        <div className="neutron-controls copy-card">
          <div className="neutron-filter-pills" role="group" aria-label="Filter graph streams">
            {(
              [
                ["all", "All Streams"],
                ["reward", "Friend Bonuses"],
                ["sync", "Passport Sync"],
                ["trade", "Market Deals"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                className={filterKind === key ? "mini-chip is-active" : "mini-chip"}
                onClick={() => setFilterKind(key)}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="neutron-pulse-btn"
            onClick={() => emitBurstFrom(selectedId)}
          >
            <Zap size={14} />
            <span>Send Impulse ({pulseCount})</span>
          </button>
        </div>
      </div>

      <div className="neutron-canvas-shell">
        <canvas
          ref={canvasRef}
          className="neutron-canvas"
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - r.left;
            const y = e.clientY - r.top;
            const hit = stateRef.current.nodes.find(
              (n) => Math.hypot(n.x - x, n.y - y) <= n.r + 10
            );
            if (hit) {
              setSelectedId(hit.id);
              emitBurstFrom(hit.id);
            }
          }}
        />
      </div>

      <div className="neutron-footer-bar">
        <div className="neutron-node-pills copy-card">
          {INITIAL_NODES.filter((n) => n.system).map((n) => (
            <button
              key={n.id}
              type="button"
              className={selectedId === n.id ? "node-pill is-active" : "node-pill"}
              onClick={() => {
                setSelectedId(n.id);
                emitBurstFrom(n.id);
              }}
            >
              <Sparkles size={12} />
              <span>{n.label}</span>
            </button>
          ))}
        </div>
      </div>
    </article>
  );
}
