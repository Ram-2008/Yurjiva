"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Orbit,
  Cpu,
  Globe,
  Smartphone,
  Code2,
  Workflow,
  Layers,
  AudioLines,
  PenTool,
  Mouse,
  Box,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { products, work, sections, services, socials } from "@/lib/studio";
import Brand from "@/components/studio/Brand";
import InteractionFeedback from "@/components/studio/InteractionFeedback";
import KineticCore from "@/components/studio/KineticCore";
import Scene from "@/components/studio/Scene";
import Contact from "@/components/studio/Contact";
const icons = [
  Cpu,
  Globe,
  Smartphone,
  Code2,
  Workflow,
  Layers,
  AudioLines,
  PenTool,
];
const scenes = [
  ["Intelligence Core", "core.webp"],
  ["Neural Network", "network.webp"],
  ["Compute Architecture", "chip.webp"],
];
const strengths = [
  "Innovation-first thinking",
  "Modern engineering practices",
  "Custom-built digital solutions",
  "User-centered product design",
  "Intelligent automation",
  "Scalable software architecture",
];
function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="label">
      <i />
      {children}
    </div>
  );
}
export default function Home() {
  const [menu, setMenu] = useState(false),
    [active, setActive] = useState("home"),
    [scene, setScene] = useState(0),
    [detail, setDetail] = useState<{
      title: string;
      body: string;
      link?: string;
    } | null>(null);
  const dialog = useRef<HTMLDialogElement>(null),
    art = useRef<HTMLDivElement>(null),
    reduced = useReducedMotion();
  useEffect(() => {
    if (detail) dialog.current?.showModal();
    else dialog.current?.close();
  }, [detail]);
  useEffect(() => {
    const set = () => {
      let id = "home";
      for (const [, key] of sections) {
        if (
          (document.getElementById(key)?.getBoundingClientRect().top ??
            Infinity) <
          innerHeight * 0.48
        )
          id = key;
      }
      setActive(id);
    };
    set();
    window.addEventListener("scroll", set, { passive: true });
    return () => window.removeEventListener("scroll", set);
  }, []);
  useEffect(() => {
    if (reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const targets = document.querySelectorAll<HTMLElement>(
        ".about > div, .block > .label, .block > h2, .card, .product, .projects article, .network, .strengths details, .contact > div, .contact form",
      );
      targets.forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 96%",
          end: "bottom 4%",
          onEnter: () => reveal(1),
          onEnterBack: () => reveal(-1),
        });
        function reveal(direction: number) {
          gsap.fromTo(
            el,
            { y: direction * 20, opacity: 0.58 },
            {
              y: 0,
              opacity: 1,
              duration: 0.55,
              ease: "power2.out",
              overwrite: "auto",
              clearProps: "transform,opacity",
            },
          );
        }
      });
    });
    return () => ctx.revert();
  }, [reduced]);
  useEffect(() => {
    if (reduced || !matchMedia("(pointer:fine)").matches) return;
    const buttons = document.querySelectorAll<HTMLElement>(".actions a,.talk");
    const move = (event: PointerEvent) => {
      const el = event.currentTarget as HTMLElement,
        r = el.getBoundingClientRect();
      el.style.translate =
        ((event.clientX - r.left) / r.width - 0.5) * 6 +
        "px " +
        ((event.clientY - r.top) / r.height - 0.5) * 5 +
        "px";
    };
    const reset = (event: PointerEvent) => {
      (event.currentTarget as HTMLElement).style.translate = "";
    };
    buttons.forEach((el) => {
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", reset);
    });
    return () =>
      buttons.forEach((el) => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", reset);
      });
  }, [reduced]);
  return (
    <>
      <InteractionFeedback />
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header>
        <div className="navwrap">
          <a href="#home" aria-label="Yurjiva home">
            <Brand />
          </a>
          <nav className={menu ? "open" : ""} aria-label="Primary">
            {sections.map(([name, id]) => (
              <a
                key={id}
                aria-current={active === id ? "location" : undefined}
                className={active === id ? "active" : ""}
                href={"#" + id}
                onClick={() => setMenu(false)}
              >
                {name}
              </a>
            ))}
          </nav>
          <a className="talk" href="#contact">
            Let’s Talk <ArrowUpRight size={15} />
          </a>
          <button
            className="hamb"
            onClick={() => setMenu(!menu)}
            aria-expanded={menu}
            aria-label="Toggle menu"
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <main id="main">
        <section
          id="home"
          className={"hero s" + scene}
          onPointerMove={(e) => {
            if (!reduced && e.pointerType === "mouse") {
              const r = e.currentTarget.getBoundingClientRect();
              art.current?.style.setProperty(
                "--px",
                ((e.clientX - r.left) / r.width - 0.5) * 12 + "px",
              );
              art.current?.style.setProperty(
                "--py",
                ((e.clientY - r.top) / r.height - 0.5) * 10 + "px",
              );
            }
          }}
        >
          <div
            className="art"
            ref={art}
            key={scene}
            style={{ backgroundImage: "url(/" + scenes[scene][1] + ")" }}
          />
          <KineticCore scene={scene} />
          <div className="hero-inner wrap">
            <div className="kicker">
              <span /> AI & SOFTWARE ENGINEERING
            </div>
            <motion.h1 initial={reduced ? false : { y: 8 }} animate={{ y: 0 }}>
              YURJIVA
            </motion.h1>
            <h2>
              Innovating Beyond
              <br />
              <em>Tomorrow.</em>
            </h2>
            <p>
              We transform ambitious ideas into intelligent digital experiences
              through AI, software engineering, and next-generation innovation.
            </p>
            <div className="actions">
              <a className="primary" href="#services">
                Explore Our Services <ArrowRight size={16} />
              </a>
              <a className="secondary" href="#contact">
                Start a Project <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
          <div className="herobar wrap">
            <a className="scroll" href="#about">
              <Mouse size={16} /> Scroll to explore <ChevronDown size={12} />
            </a>
            <div className="scenecontrol">
              <span className="sceneid">0{scene + 1} / 03</span>
              <span aria-live="polite">{scenes[scene][0]}</span>
              <button
                aria-label="Previous scene"
                onClick={() => setScene((scene + 2) % 3)}
              >
                <ChevronLeft />
              </button>
              <button
                aria-label="Next scene"
                onClick={() => setScene((scene + 1) % 3)}
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </section>
        <section id="about" className="wrap about reveal">
          <div>
            <Label>ABOUT YURJIVA</Label>
            <h2>
              Engineering Tomorrow.
              <br />
              <em>Today.</em>
            </h2>
            <p>Technology that gives life to new possibilities.</p>
            <p>
              YURJIVA (Yur-jee-va) builds intelligent software and digital
              products. Our mission is to turn ambitious ideas into practical
              technology that people can use every day.
            </p>
            <p>
              Our vision is to become a globally recognized technology company
              that transforms ideas into impactful innovations.
            </p>
          </div>
          <div className="chip">
            <img
              src="/chip.webp"
              loading="lazy"
              alt="Exploded layers of a crystalline processor"
            />
            <span>
              <Box size={13} /> SYSTEM ARCHITECTURE
            </span>
          </div>
        </section>
        <section id="services" className="band">
          <div className="wrap block">
            <Label>CORE SERVICES</Label>
            <h2>
              Our capabilities<span>.</span>
            </h2>
            <div className="cards">
              {services.map(([name, desc, more], i) => {
                const Icon = icons[i];
                return (
                  <button
                    key={name}
                    className="card reveal"
                    onClick={() => setDetail({ title: name, body: more })}
                  >
                    <Icon className="serviceicon" />
                    <h3>{name}</h3>
                    <p>{desc}</p>
                    <span>
                      Learn more <ArrowUpRight size={14} />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
        <section className="wrap block">
          <Label>TECHNOLOGY SHOWCASE</Label>
          <div className="network">
            <Scene network />
            <div>
              <Orbit />
              <h2>Connected intelligence.</h2>
              <p>
                Models interpret signals. Agents coordinate actions. APIs
                connect those decisions to the software your team uses.
              </p>
              <div className="tags">
                <b>Models</b>
                <b>Agents</b>
                <b>APIs</b>
              </div>
            </div>
          </div>
        </section>
        <section id="products" className="wrap block">
          <Label>PRODUCTS & INNOVATION</Label>
          <h2>
            Built at YURJIVA<span>.</span>
          </h2>
          {products.map((p) => (
            <article className="product reveal" key={p.name}>
              <div className="device" aria-hidden>
                <div className="devicebar">
                  GodownIQ <b>Supplier workspace</b>
                </div>
                {["Supplier memory", "Purchase history", "Inventory"].map(
                  (s, i) => (
                    <div className="devrow" key={s}>
                      <Layers size={16} />
                      {s}
                      <i style={{ width: 22 + i * 7 + "%" }} />
                    </div>
                  ),
                )}
              </div>
              <div>
                <div className="kicker">
                  <span />
                  {p.status.toUpperCase()}
                </div>
                <h3>{p.name}</h3>
                <p>{p.description}</p>
                <small>{p.stack}</small>
                <a
                  className="textlink"
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Explore product <ArrowUpRight size={16} />
                </a>
              </div>
            </article>
          ))}
        </section>
        <section id="work" className="wrap block">
          <Label>OUR WORK</Label>
          <h2>
            Selected projects<span>.</span>
          </h2>
          <div className="projects">
            {work.map((p, i) => (
              <article key={p.name}>
                <div className={"mock m" + i}>
                  <span>{p.mark}</span>
                  <small>Concept mockup</small>
                </div>
                <small>{p.kind}</small>
                <h3>{p.name}</h3>
                <p>{p.summary}</p>
                <div className="tags project-stack">
                  {p.stack.split(" · ").map((tech) => (
                    <b key={tech}>{tech}</b>
                  ))}
                </div>
                <button
                  className="textlink"
                  onClick={() =>
                    setDetail({
                      title: p.name,
                      body: p.summary + " Technology: " + p.stack + ".",
                      link: p.url,
                    })
                  }
                >
                  View case study <ArrowUpRight size={16} />
                </button>
              </article>
            ))}
          </div>
        </section>
        <section className="band">
          <div className="wrap block">
            <Label>WHY YURJIVA</Label>
            <h2>
              How we build<span>.</span>
            </h2>
            <div className="strengths">
              {strengths.map((s, i) => (
                <details key={s}>
                  <summary>
                    {s}
                    <ChevronDown size={16} />
                  </summary>
                  <p>
                    {
                      [
                        "We explore the problem with small prototypes before committing to an implementation.",
                        "Version control, reviews, and repeatable builds support every delivery.",
                        "The workflow and data model follow the needs of the business.",
                        "We design around the tasks people actually need to complete.",
                        "Automation includes explicit handoffs and recovery paths.",
                        "Clear boundaries let individual parts of the system grow independently.",
                      ][i]
                    }
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
        <section id="contact" className="wrap block contact">
          <div>
            <Label>START A PROJECT</Label>
            <h2>
              Let’s Build
              <br />
              What’s <em>Next.</em>
            </h2>
            <p>Tell us what you have in mind.</p>
          </div>
          <Contact />
        </section>
      </main>
      <footer>
        <div className="wrap footgrid">
          <div>
            <Brand full />
            <p>Innovating Beyond Tomorrow.</p>
          </div>
          <div>
            <b>Explore</b>
            {sections.map(([s, id]) => (
              <a key={id} href={"#" + id}>
                {s}
              </a>
            ))}
          </div>
          <div>
            <b>Services</b>
            {services.map(([s]) => (
              <a href="#services" key={s}>
                {s}
              </a>
            ))}
          </div>
          <div>
            <b>Get in touch</b>
            <a href="#contact">Project inquiries ↗</a>
            {socials.map(([s, url]) => (
              <a key={s} href={url}>
                {s} ↗
              </a>
            ))}
          </div>
        </div>
        <div className="wrap copyright">
          © 2026 YURJIVA. All Rights Reserved.
        </div>
      </footer>
      <dialog
        aria-label={detail?.title}
        ref={dialog}
        onCancel={() => setDetail(null)}
        onClose={() => setDetail(null)}
      >
        <button
          className="close"
          aria-label="Close details"
          onClick={() => setDetail(null)}
        >
          <X />
        </button>
        <Label>YURJIVA</Label>
        <h2>{detail?.title}</h2>
        <p>{detail?.body}</p>
        {detail?.link ? (
          <a
            className="primary"
            href={detail.link}
            target="_blank"
            rel="noreferrer"
          >
            Visit website <ArrowUpRight size={16} />
          </a>
        ) : (
          <a
            className="primary"
            href="#contact"
            onClick={() => setDetail(null)}
          >
            Discuss a project <ArrowRight size={16} />
          </a>
        )}
      </dialog>
    </>
  );
}
