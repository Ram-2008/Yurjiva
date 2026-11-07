"use client";
import dynamic from "next/dynamic";
import { Component, useRef, useState, useEffect, type ReactNode } from "react";
const Experience = dynamic(() => import("./Experience"), { ssr: false });
let capable: boolean | undefined;
function supportsWebGL() {
  if (capable === undefined) {
    const gl = document
      .createElement("canvas")
      .getContext("webgl2", { failIfMajorPerformanceCaveat: true });
    capable = !!gl;
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  }
  return capable;
}
class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
export default function Scene({ network = false }: { network?: boolean }) {
  const ref = useRef<HTMLDivElement>(null),
    [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    let near = false;
    const update = () =>
      setVisible(
        near &&
          !document.hidden &&
          !mq.matches &&
          (navigator.hardwareConcurrency || 4) > 2 &&
          supportsWebGL(),
      );
    const io = new IntersectionObserver(([entry]) => {
      near = entry.isIntersecting;
      update();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", update);
    mq.addEventListener("change", update);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", update);
      mq.removeEventListener("change", update);
    };
  }, []);
  return (
    <div className="scene" ref={ref} aria-hidden="true">
      {visible && (
        <Boundary>
          <Experience network={network} />
        </Boundary>
      )}
    </div>
  );
}
