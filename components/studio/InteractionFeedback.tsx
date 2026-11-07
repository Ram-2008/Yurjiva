"use client";

import { useEffect, useRef } from "react";

export default function InteractionFeedback() {
  const progress = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const updateProgress = () => {
      frame = 0;
      const range = document.documentElement.scrollHeight - innerHeight;
      const ratio = range > 0 ? Math.max(0, Math.min(1, scrollY / range)) : 0;
      if (progress.current)
        progress.current.style.transform = "scaleX(" + ratio + ")";
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(updateProgress);
    };
    let press: { id: number; x: number; y: number } | undefined;
    const bursts = new Set<HTMLElement>();
    const begin = (event: PointerEvent) => {
      if (!event.isPrimary || event.button !== 0 || motion.matches) return;
      press = { id: event.pointerId, x: event.clientX, y: event.clientY };
    };
    const cancel = () => {
      press = undefined;
    };
    const moved = (event: PointerEvent) => {
      if (
        press?.id === event.pointerId &&
        Math.hypot(event.clientX - press.x, event.clientY - press.y) > 9
      )
        cancel();
    };
    const burst = (event: PointerEvent) => {
      if (press?.id !== event.pointerId) return;
      moved(event);
      if (!press || motion.matches) return;
      cancel();
      const spray = document.createElement("span");
      spray.className = "spark-burst";
      spray.setAttribute("aria-hidden", "true");
      spray.style.left = event.clientX + "px";
      spray.style.top = event.clientY + "px";
      const offset = Math.random() * Math.PI;
      for (let i = 0; i < 10; i++) {
        const ray = document.createElement("i");
        const angle = offset + (i * Math.PI) / 5;
        const distance = 21 + Math.random() * 20;
        ray.style.setProperty("--dx", Math.cos(angle) * distance + "px");
        ray.style.setProperty("--dy", Math.sin(angle) * distance + "px");
        ray.style.setProperty("--angle", angle + "rad");
        spray.appendChild(ray);
      }
      if (bursts.size >= 5) {
        const oldest = bursts.values().next().value;
        if (oldest) {
          oldest.remove();
          bursts.delete(oldest);
        }
      }
      (document.querySelector("dialog[open]") || document.body).appendChild(
        spray,
      );
      bursts.add(spray);
      const animation = spray.animate(
        [{ opacity: 1 }, { opacity: 1, offset: 0.32 }, { opacity: 0 }],
        { duration: 460 },
      );
      const remove = () => {
        spray.remove();
        bursts.delete(spray);
      };
      animation.onfinish = animation.oncancel = remove;
    };
    document.addEventListener("pointerdown", begin, true);
    document.addEventListener("pointermove", moved, true);
    document.addEventListener("pointercancel", cancel, true);
    document.addEventListener("pointerup", burst, true);
    const waves = new Set<HTMLElement>();
    const activate = (event: MouseEvent) => {
      if (motion.matches || !(event.target instanceof Element)) return;
      const control = event.target.closest<HTMLElement>(
        "button:not(:disabled), a[href], summary",
      );
      if (!control || control.getAttribute("aria-disabled") === "true") return;
      const rect = control.getBoundingClientRect();
      const keyboard = event.detail === 0;
      const x = keyboard ? rect.left + rect.width / 2 : event.clientX;
      const y = keyboard ? rect.top + rect.height / 2 : event.clientY;
      const wave = document.createElement("span");
      wave.className = "activation-wave";
      wave.setAttribute("aria-hidden", "true");
      wave.style.left = x + "px";
      wave.style.top = y + "px";
      (control.closest("dialog[open]") || document.body).appendChild(wave);
      waves.add(wave);
      const remove = () => {
        wave.remove();
        waves.delete(wave);
      };
      const animation = wave.animate(
        [
          { transform: "translate(-50%, -50%) scale(.12)", opacity: 0.95 },
          {
            transform: "translate(-50%, -50%) scale(.68)",
            opacity: 0.65,
            offset: 0.42,
          },
          { transform: "translate(-50%, -50%) scale(1)", opacity: 0 },
        ],
        { duration: 430, easing: "cubic-bezier(.16,.75,.28,1)" },
      );
      animation.onfinish = remove;
      animation.oncancel = remove;
    };
    updateProgress();
    const size = new ResizeObserver(schedule);
    size.observe(document.body);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("click", activate, true);
    return () => {
      document.removeEventListener("pointerdown", begin, true);
      document.removeEventListener("pointermove", moved, true);
      document.removeEventListener("pointercancel", cancel, true);
      document.removeEventListener("pointerup", burst, true);
      bursts.forEach((item) => item.remove());
      size.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("click", activate, true);
      waves.forEach((wave) => wave.remove());
    };
  }, []);
  return <div ref={progress} className="reading-progress" aria-hidden="true" />;
}
