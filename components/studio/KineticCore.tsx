"use client";
import { useEffect, useRef } from "react";

type Vertex = readonly [number, number, number];
type Strand = {
  points: Vertex[];
  color: string;
  width: number;
  loop?: boolean;
};
const tau = Math.PI * 2;

function buildModel(scene: number, compact: boolean): Strand[] {
  const paths: Strand[] = [];
  const count = compact ? 46 : 74;
  const steps = compact ? 74 : 118;
  if (scene === 0) {
    for (let i = 1; i < count; i++) {
      const lat = (Math.PI * i) / count;
      const points: Vertex[] = [];
      for (let j = 0; j < steps; j++) {
        const lon = (tau * j) / steps;
        const bend = lat + 0.13 * Math.sin(lon * 3 + lat * 5) * Math.sin(lat);
        const radius = 1 + 0.04 * Math.sin(lon * 4 - lat * 6);
        points.push([
          radius * Math.sin(bend) * Math.cos(lon),
          radius * Math.cos(bend),
          radius * Math.sin(bend) * Math.sin(lon),
        ]);
      }
      paths.push({
        points,
        loop: true,
        color: hue(i / count, 0.72),
        width: i % 9 === 0 ? 1.5 : 0.85,
      });
    }
  } else if (scene === 1) {
    const nodes: Vertex[] = Array.from({ length: 70 }, (_, i) => {
      const y = 1 - (2 * (i + 0.5)) / 70,
        r = Math.sqrt(1 - y * y),
        a = i * 2.39996;
      return [Math.cos(a) * r, y, Math.sin(a) * r];
    });
    nodes.forEach((p, i) =>
      nodes.slice(i + 1).forEach((q) => {
        if (Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]) < 0.56)
          paths.push({
            points: [p, q],
            color: hue((1 + p[1]) / 2, 0.75),
            width: 1.2,
          });
      }),
    );
  } else {
    for (let i = 0; i < 15; i++) {
      const y = (i - 7) * 0.1,
        w = 0.88 - 0.06 * Math.cos(i * 0.6);
      paths.push({
        points: [
          [-w, y, -w],
          [w, y, -w],
          [w, y, w],
          [-w, y, w],
        ],
        loop: true,
        color: hue(i / 15, 0.88),
        width: i % 4 === 0 ? 2 : 1,
      });
      for (let j = -3; j <= 3; j++)
        paths.push({
          points: [
            [-w, y, j * 0.2],
            [-0.25, y, j * 0.2],
            [0, y, j * 0.2 + 0.12],
            [w, y, j * 0.2 + 0.12],
          ],
          color: hue(i / 15, 0.35),
          width: 0.8,
        });
    }
  }
  for (let i = 0; i < 3; i++) {
    const points: Vertex[] = [];
    for (let j = 0; j < 145; j++) {
      const a = (tau * j) / 145,
        r = 1.3 + i * 0.13;
      points.push([
        r * Math.cos(a),
        r * Math.sin(a) * (0.15 + i * 0.15),
        r * Math.sin(a) * 0.93,
      ]);
    }
    paths.push({
      points,
      loop: true,
      color: hue(i / 2, 0.44),
      width: i === 1 ? 1.7 : 0.8,
    });
  }
  return paths;
}
function hue(t: number, alpha: number) {
  return "hsla(" + (191 + t * 79) + " 100% 67% / " + alpha + ")";
}

export default function KineticCore({ scene }: { scene: number }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const yaw = useRef(0),
    pitch = useRef(-0.18);
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;
    const host = el.closest<HTMLElement>(".hero");
    if (!host) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const paths = buildModel(scene, window.innerWidth < 760);
    let frame = 0,
      visible = false,
      width = 0,
      height = 0,
      last = 0,
      angle = 0,
      tilt = -0.18;
    function draw(now: number) {
      frame = 0;
      if (!ctx || !el || !visible || document.hidden) return;
      const dt = Math.min(50, now - last);
      if (dt < 31 && !motion.matches) {
        frame = requestAnimationFrame(draw);
        return;
      }
      last = now;
      if (!motion.matches) yaw.current += dt * 0.0001;
      angle += (yaw.current - angle) * 0.2;
      tilt += (pitch.current - tilt) * 0.2;
      const cy = Math.cos(angle),
        sy = Math.sin(angle),
        cx = Math.cos(tilt),
        sx = Math.sin(tilt);
      const radius = Math.min(width * 0.31, height * 0.4);
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(width * 0.5, height * 0.5);
      ctx.rotate(-0.24);
      const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 1.58);
      glow.addColorStop(0, "#3049c83d");
      glow.addColorStop(0.62, "#2930a527");
      glow.addColorStop(1, "#13164700");
      ctx.fillStyle = glow;
      ctx.fillRect(-width, -height, width * 2, height * 2);
      ctx.globalCompositeOperation = "lighter";
      function project([x, y, z]: Vertex) {
        const xx = x * cy + z * sy,
          zz = z * cy - x * sy,
          depth = zz * cx + y * sx;
        const k = (radius * 4.8) / (4.8 - depth);
        return [xx * k, (-y * cx + zz * sx) * k, depth];
      }
      for (const path of paths) {
        ctx.beginPath();
        path.points.forEach((p, i) => {
          const [x, y] = project(p);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        if (path.loop) ctx.closePath();
        ctx.strokeStyle = path.color;
        ctx.lineWidth = path.width;
        ctx.stroke();
      }
      for (let i = 0; i < 50; i++) {
        const a = i * 2.39996 + angle * 0.7,
          r = 1.06 + (i % 9) * 0.073;
        const [x, y, z] = project([
          Math.cos(a) * r,
          Math.sin(a * 2 + i) * 0.46,
          Math.sin(a) * r,
        ]);
        ctx.fillStyle = hue((i % 8) / 8, 0.55 + z * 0.16);
        ctx.beginPath();
        ctx.arc(x, y, i % 9 === 0 ? 2.3 : 1.2, 0, tau);
        ctx.fill();
      }
      ctx.restore();
      host?.classList.add("core-ready");
      if (!motion.matches) frame = requestAnimationFrame(draw);
    }
    function start() {
      cancelAnimationFrame(frame);
      frame = 0;
      if (visible && !document.hidden) frame = requestAnimationFrame(draw);
    }
    const resize = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      width = r.width;
      height = r.height;
      const d = Math.min(devicePixelRatio || 1, 1.5);
      el.width = Math.round(width * d);
      el.height = Math.round(height * d);
      ctx.setTransform(d, 0, 0, d, 0, 0);
      start();
    });
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      start();
    });
    resize.observe(el);
    io.observe(el);
    let drag: { id: number; x: number; y: number } | null = null;
    function down(e: PointerEvent) {
      if (!el) return;
      drag = { id: e.pointerId, x: e.clientX, y: e.clientY };
      el.setPointerCapture(e.pointerId);
    }
    function move(e: PointerEvent) {
      if (!drag || e.pointerId !== drag.id) return;
      yaw.current += (e.clientX - drag.x) * 0.012;
      pitch.current = Math.max(
        -1,
        Math.min(1, pitch.current + (e.clientY - drag.y) * 0.008),
      );
      drag.x = e.clientX;
      drag.y = e.clientY;
      if (motion.matches) {
        angle = yaw.current;
        tilt = pitch.current;
        start();
      }
    }
    function end() {
      drag = null;
    }
    function key(e: KeyboardEvent) {
      if (!["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp"].includes(e.key))
        return;
      e.preventDefault();
      yaw.current +=
        e.key === "ArrowLeft" ? -0.25 : e.key === "ArrowRight" ? 0.25 : 0;
      pitch.current +=
        e.key === "ArrowUp" ? -0.18 : e.key === "ArrowDown" ? 0.18 : 0;
      if (motion.matches) {
        angle = yaw.current;
        tilt = pitch.current;
        start();
      }
    }
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("lostpointercapture", end);
    el.addEventListener("keydown", key);
    motion.addEventListener("change", start);
    document.addEventListener("visibilitychange", start);
    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      resize.disconnect();
      host.classList.remove("core-ready");
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("lostpointercapture", end);
      el.removeEventListener("keydown", key);
      motion.removeEventListener("change", start);
      document.removeEventListener("visibilitychange", start);
    };
  }, [scene]);
  return (
    <div className="core-stage">
      <canvas
        ref={canvas}
        tabIndex={0}
        aria-label="Interactive 3D model. Drag or use the arrow keys to rotate."
      />
      <span aria-hidden="true">↔ &nbsp; DRAG TO ROTATE</span>
    </div>
  );
}
