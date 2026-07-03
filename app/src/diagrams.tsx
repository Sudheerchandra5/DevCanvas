import React, { useEffect, useState } from "react";
import { theme } from "./theme";

/* ================================================================== *
 * Interactive learning widgets — "learn by playing"
 * Each topic gets a small, dynamic playground built on a shared kit.
 * ================================================================== */

/* ------------------------------ SVG kit --------------------------- */

function Frame({
  w,
  h,
  label,
  children,
}: {
  w: number;
  h: number;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      style={{ maxWidth: w, height: "auto", display: "block" }}
      role="img"
      aria-label={label}
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
}

function Box({
  x,
  y,
  w,
  h,
  title,
  sub,
  active,
  muted,
  fill,
  onClick,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  sub?: string;
  active?: boolean;
  muted?: boolean;
  fill?: string;
  onClick?: () => void;
}) {
  const cx = x + w / 2;
  const stroke = active ? theme.accent.primary : theme.border;
  return (
    <g
      opacity={muted ? 0.32 : 1}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={8}
        fill={active ? "rgba(74,158,255,0.14)" : fill ?? theme.surface2}
        stroke={stroke}
        strokeWidth={active ? 1.8 : 1}
      />
      <text
        x={cx}
        y={sub ? y + h / 2 - 7 : y + h / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={12.5}
        fontWeight={600}
        fill={active ? theme.accent.primary : theme.text.primary}
      >
        {title}
      </text>
      {sub ? (
        <text
          x={cx}
          y={y + h / 2 + 9}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={10}
          fill={theme.text.secondary}
        >
          {sub}
        </text>
      ) : null}
    </g>
  );
}

function Region({
  x,
  y,
  w,
  h,
  tag,
  active,
  muted,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  tag: string;
  active?: boolean;
  muted?: boolean;
}) {
  return (
    <g opacity={muted ? 0.32 : 1}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={10}
        fill={active ? "rgba(74,158,255,0.07)" : "transparent"}
        stroke={active ? theme.accent.primary : theme.border}
        strokeWidth={1}
        strokeDasharray="5 4"
      />
      <text
        x={x + 12}
        y={y + 16}
        fontSize={11}
        fontWeight={700}
        letterSpacing={0.4}
        fill={active ? theme.accent.primary : theme.text.secondary}
      >
        {tag}
      </text>
    </g>
  );
}

function Arrow({
  x1,
  y1,
  x2,
  y2,
  label,
  active,
  dashed,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label?: string;
  active?: boolean;
  dashed?: boolean;
}) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const size = 7;
  const bx = x2 - size * Math.cos(angle);
  const by = y2 - size * Math.sin(angle);
  const nx = Math.sin(angle);
  const ny = Math.cos(angle);
  const left = { x: bx - size * 0.55 * nx, y: by + size * 0.55 * ny };
  const right = { x: bx + size * 0.55 * nx, y: by - size * 0.55 * ny };
  const color = active ? theme.accent.primary : theme.text.tertiary;
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={active ? 2 : 1.4}
        strokeDasharray={dashed ? "4 3" : undefined}
      />
      <polygon
        points={`${x2},${y2} ${left.x},${left.y} ${right.x},${right.y}`}
        fill={color}
      />
      {label ? (
        <text
          x={(x1 + x2) / 2}
          y={(y1 + y2) / 2 - 6}
          textAnchor="middle"
          fontSize={10}
          fontWeight={500}
          fill={active ? theme.accent.primary : theme.text.secondary}
        >
          {label}
        </text>
      ) : null}
    </g>
  );
}

/* ---------------------------- HTML kit ---------------------------- */

function Btn({
  children,
  onClick,
  active,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: active ? theme.accent.primary : theme.surface2,
        color: active ? "#0b0c0d" : theme.text.primary,
        border: `1px solid ${active ? theme.accent.primary : theme.border}`,
        borderRadius: 6,
        padding: "5px 11px",
        fontSize: 12,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        fontFamily: "inherit",
      }}
    >
      {children}
    </button>
  );
}

function Toggle({
  label,
  on,
  onChange,
  locked,
}: {
  label: string;
  on: boolean;
  onChange: (v: boolean) => void;
  locked?: boolean;
}) {
  return (
    <button
      onClick={() => !locked && onChange(!on)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        background: on ? "rgba(74,158,255,0.14)" : theme.surface2,
        border: `1px solid ${on ? theme.accent.primary : theme.border}`,
        borderRadius: 6,
        padding: "5px 10px",
        fontSize: 12,
        color: theme.text.primary,
        cursor: locked ? "default" : "pointer",
        fontFamily: "inherit",
        opacity: locked ? 0.7 : 1,
      }}
    >
      <span
        style={{
          width: 12,
          height: 12,
          borderRadius: 3,
          border: `1px solid ${on ? theme.accent.primary : theme.text.tertiary}`,
          background: on ? theme.accent.primary : "transparent",
          display: "inline-block",
        }}
      />
      {label}
    </button>
  );
}

function Controls({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        flexWrap: "wrap",
        alignItems: "center",
        marginTop: 12,
      }}
    >
      {children}
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        marginTop: 10,
        fontSize: 12.5,
        color: theme.text.secondary,
        lineHeight: 1.5,
        minHeight: 36,
      }}
    >
      {children}
    </div>
  );
}

function useStepper(count: number) {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    if (i >= count - 1) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setI((v) => Math.min(v + 1, count - 1)), 950);
    return () => clearTimeout(t);
  }, [playing, i, count]);
  return { i, setI, playing, setPlaying };
}

/* ---------------- Reusable horizontal flow stepper ---------------- */

type FlowNode = { title: string; sub?: string; desc: string };

function FlowStepper({ nodes, label }: { nodes: FlowNode[]; label: string }) {
  const { i, setI, playing, setPlaying } = useStepper(nodes.length);
  const n = nodes.length;
  const W = 600;
  const H = 108;
  const margin = 8;
  const gap = 12;
  const bw = (W - margin * 2 - (n - 1) * gap) / n;
  const y = 26;
  const bh = 58;
  return (
    <div>
      <Frame w={W} h={H} label={label}>
        {nodes.map((node, idx) => {
          const x = margin + idx * (bw + gap);
          const isActive = idx === i;
          const isMuted = idx > i;
          return (
            <g key={node.title}>
              {idx > 0 ? (
                <Arrow
                  x1={x - gap}
                  y1={y + bh / 2}
                  x2={x}
                  y2={y + bh / 2}
                  active={idx <= i}
                />
              ) : null}
              <Box
                x={x}
                y={y}
                w={bw}
                h={bh}
                title={node.title}
                sub={node.sub}
                active={isActive}
                muted={isMuted}
                onClick={() => {
                  setPlaying(false);
                  setI(idx);
                }}
              />
            </g>
          );
        })}
      </Frame>
      <Controls>
        <Btn
          onClick={() => {
            setPlaying(false);
            setI(0);
          }}
        >
          ⟲ Reset
        </Btn>
        <Btn
          disabled={i === 0}
          onClick={() => {
            setPlaying(false);
            setI(Math.max(0, i - 1));
          }}
        >
          ◀ Prev
        </Btn>
        <Btn onClick={() => (i >= n - 1 ? (setI(0), setPlaying(true)) : setPlaying(!playing))}>
          {playing ? "❚❚ Pause" : "▶ Play"}
        </Btn>
        <Btn
          disabled={i === n - 1}
          onClick={() => {
            setPlaying(false);
            setI(Math.min(n - 1, i + 1));
          }}
        >
          Next ▶
        </Btn>
        <span style={{ fontSize: 11, color: theme.text.tertiary }}>
          step {i + 1} / {n}
        </span>
      </Controls>
      <Note>
        <b style={{ color: theme.text.primary }}>{nodes[i].title}.</b> {nodes[i].desc}
      </Note>
    </div>
  );
}

/* ================================================================== *
 * 1 · JDK vs JRE vs JVM — "what do I need?" explorer
 * ================================================================== */
function JdkJreJvm() {
  const [mode, setMode] = useState<"run" | "develop" | null>(null);
  const develop = mode === "develop";
  const anyMode = mode !== null;
  const W = 600;
  const H = 210;
  return (
    <div>
      <Frame w={W} h={H} label="JDK contains JRE contains JVM">
        <Region x={16} y={10} w={568} h={182} tag="JDK — develop" active={develop} />
        <Box
          x={32}
          y={40}
          w={536}
          h={34}
          title="Developer tools"
          sub="javac · javadoc · jdb · jlink"
          fill={theme.fill.tertiary}
          active={develop}
          muted={anyMode && !develop}
        />
        <Region x={32} y={86} w={536} h={98} tag="JRE — run" active={anyMode} />
        <Box
          x={48}
          y={116}
          w={280}
          h={52}
          title="JVM"
          sub="executes bytecode"
          active={anyMode}
        />
        <Box
          x={344}
          y={116}
          w={208}
          h={52}
          title="Core libraries"
          sub="java.base, java.*"
          active={anyMode}
        />
      </Frame>
      <Controls>
        <Btn active={mode === "run"} onClick={() => setMode("run")}>
          I want to run apps
        </Btn>
        <Btn active={mode === "develop"} onClick={() => setMode("develop")}>
          I want to develop apps
        </Btn>
        <Btn onClick={() => setMode(null)}>⟲ Reset</Btn>
      </Controls>
      <Note>
        {mode === "run" ? (
          <>
            To <b style={{ color: theme.text.primary }}>run</b> Java you only need the{" "}
            <b style={{ color: theme.text.primary }}>JRE</b> — the JVM plus core libraries.
            No compiler required.
          </>
        ) : mode === "develop" ? (
          <>
            To <b style={{ color: theme.text.primary }}>develop</b> Java you need the full{" "}
            <b style={{ color: theme.text.primary }}>JDK</b> — the JRE plus tools like{" "}
            <code>javac</code>, <code>jdb</code> and <code>javadoc</code>.
          </>
        ) : (
          <>Pick a goal above to see exactly which layer you need.</>
        )}
      </Note>
    </div>
  );
}

/* ================================================================== *
 * 2 · Editions & distributions — click a build
 * ================================================================== */
type Distro = { name: string; vendor: string; license: string; note: string };
const DISTROS: Distro[] = [
  { name: "OpenJDK", vendor: "OpenJDK community", license: "GPLv2 + CE", note: "The open-source reference implementation everyone else builds on." },
  { name: "Temurin", vendor: "Eclipse Adoptium", license: "GPLv2 + CE", note: "Popular free, TCK-certified builds — a common default." },
  { name: "Oracle JDK", vendor: "Oracle", license: "Oracle NFTC", note: "Oracle's build; free for many uses, paid commercial support available." },
  { name: "Corretto", vendor: "Amazon", license: "GPLv2 + CE", note: "Amazon's free LTS builds with long-term security patches." },
  { name: "Azul Zulu", vendor: "Azul", license: "GPLv2 + CE", note: "Azul's builds spanning many OSes and older Java versions." },
];
function EditionsDistros() {
  const [sel, setSel] = useState(0);
  const d = DISTROS[sel];
  return (
    <div>
      <div
        style={{
          display: "inline-block",
          border: `1px solid ${theme.accent.primary}`,
          background: "rgba(74,158,255,0.12)",
          color: theme.accent.primary,
          borderRadius: 8,
          padding: "6px 12px",
          fontSize: 12.5,
          fontWeight: 600,
        }}
      >
        Java SE Specification (the standard)
      </div>
      <div style={{ margin: "8px 0 2px", color: theme.text.tertiary, fontSize: 18 }}>↓</div>
      <Controls>
        {DISTROS.map((x, idx) => (
          <Btn key={x.name} active={idx === sel} onClick={() => setSel(idx)}>
            {x.name}
          </Btn>
        ))}
      </Controls>
      <Note>
        <b style={{ color: theme.text.primary }}>{d.name}</b> · {d.vendor} ·{" "}
        <span style={{ color: theme.text.tertiary }}>{d.license}</span>
        <br />
        {d.note} <i>All distributions implement the same spec &amp; API.</i>
      </Note>
    </div>
  );
}

/* ================================================================== *
 * 3 · Bytecode & .class files — step the compile→run pipeline
 * ================================================================== */
function BytecodeClass() {
  return (
    <FlowStepper
      label="Compile to bytecode, then run on the JVM"
      nodes={[
        { title: "Source", sub: "Hello.java", desc: "You write human-readable Java in a .java file." },
        { title: "javac", sub: "compiler", desc: "javac translates source into platform-independent bytecode." },
        { title: ".class", sub: "0xCAFEBABE", desc: "Bytecode lives in a .class file — instructions for the JVM, not the CPU." },
        { title: "Verify", sub: "class loader", desc: "On load, the verifier checks the bytecode is safe and well-formed." },
        { title: "JVM", sub: "executes", desc: "The JVM interprets then JIT-compiles the bytecode to native code and runs it." },
      ]}
    />
  );
}

/* ================================================================== *
 * 4 · javac & java — simulated terminal
 * ================================================================== */
function JavacJava() {
  const [compiled, setCompiled] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const push = (s: string) => setLines((l) => [...l, s]);
  return (
    <div>
      <div
        style={{
          background: "#0b0c0d",
          border: `1px solid ${theme.border}`,
          borderRadius: 8,
          padding: "10px 12px",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
          fontSize: 12.5,
          minHeight: 92,
          color: theme.text.secondary,
          whiteSpace: "pre-wrap",
        }}
      >
        {lines.length === 0 ? (
          <span style={{ color: theme.text.tertiary }}>
            $ _ &nbsp;&nbsp;run the commands below in order…
          </span>
        ) : (
          lines.map((l, i) => (
            <div key={i} style={{ color: l.startsWith("$") ? theme.text.primary : theme.text.secondary }}>
              {l}
            </div>
          ))
        )}
      </div>
      <Controls>
        <Btn
          onClick={() => {
            push("$ javac Main.java");
            push("→ produced Main.class (bytecode)");
            setCompiled(true);
          }}
        >
          $ javac Main.java
        </Btn>
        <Btn
          disabled={!compiled}
          onClick={() => {
            push("$ java Main");
            push("Hello, Java!");
          }}
        >
          $ java Main
        </Btn>
        <Btn
          onClick={() => {
            setCompiled(false);
            setLines([]);
          }}
        >
          ⟲ Reset
        </Btn>
      </Controls>
      <Note>
        <code>javac</code> compiles source to a <code>.class</code>; <code>java</code> then
        launches it. Try running <code>java</code> first — it&apos;s disabled until you
        compile. <i>(Java 11+ can run <code>java Main.java</code> directly.)</i>
      </Note>
    </div>
  );
}

/* ================================================================== *
 * 5 · Classpath & module path — toggle sources, resolve a class
 * ================================================================== */
function ClasspathModulepath() {
  const [cls, setCls] = useState(false);
  const [jar, setJar] = useState(true);
  const [mod, setMod] = useState(false);
  const source = cls ? "classes/ (class path)" : jar ? "app.jar (class path)" : mod ? "mods/ (module path)" : null;
  const W = 600;
  const H = 176;
  return (
    <div>
      <Frame w={W} h={H} label="How the JVM resolves a class">
        <Box x={210} y={64} w={180} h={52} title="JVM" sub="needs com.app.Foo" active />
        <Box x={24} y={20} w={150} h={40} title="classes/" sub="compiled dirs" active={cls} muted={!cls} />
        <Box x={24} y={92} w={150} h={40} title="app.jar" sub="library" active={jar} muted={!jar} />
        <Box x={426} y={68} w={150} h={44} title="mods/" sub="named modules" active={mod} muted={!mod} />
        <Arrow x1={174} y1={40} x2={210} y2={78} active={cls} />
        <Arrow x1={174} y1={112} x2={210} y2={100} active={jar} />
        <Arrow x1={426} y1={90} x2={390} y2={94} active={mod} />
        <text x={70} y={150} fontSize={10.5} fontWeight={600} fill={theme.text.secondary}>
          class path
        </text>
        <text x={500} y={140} fontSize={10.5} fontWeight={600} fill={theme.text.secondary} textAnchor="middle">
          module path
        </text>
      </Frame>
      <Controls>
        <Toggle label="classes/ on class path" on={cls} onChange={setCls} />
        <Toggle label="app.jar on class path" on={jar} onChange={setJar} />
        <Toggle label="mods/ on module path" on={mod} onChange={setMod} />
      </Controls>
      <Note>
        {source ? (
          <span style={{ color: theme.accent.primary }}>
            ✓ Loaded <code>com.app.Foo</code> from <b>{source}</b>.
          </span>
        ) : (
          <span style={{ color: theme.warning }}>
            ✗ <code>ClassNotFoundException</code> — the class isn&apos;t on any path. Toggle a
            source on.
          </span>
        )}
      </Note>
    </div>
  );
}

/* ================================================================== *
 * 6 · JShell — a real mini REPL
 * ================================================================== */
function evalSnippet(raw: string): string {
  const expr = raw.trim();
  if (!expr) return "";
  try {
    if (/^[\d+\-*/(). %]+$/.test(expr)) {
      // eslint-disable-next-line no-new-func
      const v = Function(`"use strict"; return (${expr});`)() as number;
      return Number.isFinite(v) ? String(v) : "error";
    }
    if (/^Math\.(max|min|abs|sqrt|pow|round|floor|ceil)\(\s*-?\d+(\.\d+)?\s*(,\s*-?\d+(\.\d+)?\s*)?\)$/.test(expr)) {
      // eslint-disable-next-line no-new-func
      const v = Function("Math", `"use strict"; return (${expr});`)(Math) as number;
      return String(v);
    }
    if (/^\s*"[^"]*"(\s*\+\s*"[^"]*")*\s*$/.test(expr)) {
      const parts = expr.match(/"[^"]*"/g) ?? [];
      return '"' + parts.map((p) => p.slice(1, -1)).join("") + '"';
    }
  } catch {
    return "error";
  }
  return "…try arithmetic, Math.*, or \"string\" + \"concat\"";
}
function JshellRepl() {
  const [input, setInput] = useState("");
  const [log, setLog] = useState<{ in: string; out: string; n: number }[]>([]);
  const [count, setCount] = useState(1);
  const run = (raw: string) => {
    const src = raw.trim();
    if (!src) return;
    const out = evalSnippet(src);
    setLog((l) => [...l, { in: src, out, n: count }]);
    setCount((c) => c + 1);
    setInput("");
  };
  return (
    <div>
      <div
        style={{
          background: "#0b0c0d",
          border: `1px solid ${theme.border}`,
          borderRadius: 8,
          padding: "10px 12px",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
          fontSize: 12.5,
          minHeight: 92,
          maxHeight: 160,
          overflowY: "auto",
        }}
      >
        {log.length === 0 ? (
          <span style={{ color: theme.text.tertiary }}>jshell&gt; type an expression and press Enter…</span>
        ) : (
          log.map((e, i) => (
            <div key={i} style={{ marginBottom: 4 }}>
              <div style={{ color: theme.text.primary }}>jshell&gt; {e.in}</div>
              <div style={{ color: theme.accent.primary }}>${e.n} ==&gt; {e.out}</div>
            </div>
          ))
        )}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <span
          style={{
            fontFamily: "ui-monospace, monospace",
            color: theme.text.tertiary,
            fontSize: 13,
            alignSelf: "center",
          }}
        >
          jshell&gt;
        </span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") run(input);
          }}
          placeholder="e.g. 2 + 2"
          style={{
            flex: 1,
            background: theme.surface2,
            border: `1px solid ${theme.border}`,
            borderRadius: 6,
            padding: "7px 10px",
            color: theme.text.primary,
            fontFamily: "ui-monospace, monospace",
            fontSize: 13,
            outline: "none",
          }}
        />
        <Btn onClick={() => run(input)}>Run</Btn>
      </div>
      <Controls>
        <span style={{ fontSize: 11, color: theme.text.tertiary }}>try:</span>
        {["2 + 2", "10 % 3", "Math.max(3, 7)", '"Ja" + "va"'].map((s) => (
          <Btn key={s} onClick={() => run(s)}>
            {s}
          </Btn>
        ))}
        <Btn
          onClick={() => {
            setLog([]);
            setCount(1);
          }}
        >
          ⟲ Clear
        </Btn>
      </Controls>
      <Note>
        A REPL gives <b style={{ color: theme.text.primary }}>instant feedback</b> — each
        expression is evaluated immediately and bound to <code>$n</code>, no class or{" "}
        <code>main()</code> needed.
      </Note>
    </div>
  );
}

/* ================================================================== *
 * 7 · Maven & Gradle — click a phase, watch the lifecycle cascade
 * ================================================================== */
const PHASES = ["validate", "compile", "test", "package", "verify", "install", "deploy"];
function MavenGradle() {
  const [target, setTarget] = useState(-1);
  const W = 600;
  const H = 92;
  const n = PHASES.length;
  const margin = 8;
  const gap = 6;
  const bw = (W - margin * 2 - (n - 1) * gap) / n;
  return (
    <div>
      <Frame w={W} h={H} label="Maven build lifecycle">
        {PHASES.map((p, idx) => {
          const x = margin + idx * (bw + gap);
          return (
            <g key={p}>
              {idx > 0 ? (
                <Arrow x1={x - gap} y1={49} x2={x} y2={49} active={idx <= target} />
              ) : null}
              <Box
                x={x}
                y={26}
                w={bw}
                h={44}
                title={p}
                active={idx <= target}
                onClick={() => setTarget(idx)}
              />
            </g>
          );
        })}
      </Frame>
      <Controls>
        <span style={{ fontSize: 11, color: theme.text.tertiary }}>run:</span>
        {["compile", "test", "package", "install"].map((p) => (
          <Btn key={p} onClick={() => setTarget(PHASES.indexOf(p))}>
            mvn {p}
          </Btn>
        ))}
        <Btn onClick={() => setTarget(-1)}>⟲ Reset</Btn>
      </Controls>
      <Note>
        {target >= 0 ? (
          <>
            <code>mvn {PHASES[target]}</code> runs <b style={{ color: theme.text.primary }}>{target + 1}</b>{" "}
            phase{target ? "s" : ""} in order: {PHASES.slice(0, target + 1).join(" → ")}.
          </>
        ) : (
          <>Click a phase (or a command) — Maven always runs every earlier phase first.</>
        )}
      </Note>
    </div>
  );
}

/* ================================================================== *
 * 8 · jlink & jpackage — toggle modules, shrink the runtime
 * ================================================================== */
const MODULES = [
  { name: "java.base", mb: 30, locked: true },
  { name: "java.desktop", mb: 12, locked: false },
  { name: "java.sql", mb: 5, locked: false },
  { name: "java.net.http", mb: 3, locked: false },
  { name: "your.app", mb: 1, locked: false },
];
function JlinkJpackage() {
  const [on, setOn] = useState<boolean[]>(MODULES.map((m) => m.locked || m.name === "your.app"));
  const size = MODULES.reduce((s, m, i) => s + (on[i] ? m.mb : 0), 0);
  const full = 300; // a full JDK for comparison
  const W = 600;
  const H = 96;
  return (
    <div>
      <Frame w={W} h={H} label="Build a custom runtime image">
        <Box x={16} y={24} w={150} h={48} title="Modules" sub={`${on.filter(Boolean).length} selected`} active />
        <Arrow x1={172} y1={48} x2={232} y2={48} label="jlink" active />
        <Box x={238} y={24} w={150} h={48} title="Runtime image" sub={`${size} MB`} active />
        <Arrow x1={394} y1={48} x2={454} y2={48} label="jpackage" active />
        <Box x={460} y={24} w={124} h={48} title="Installer" sub=".exe · .dmg" active />
      </Frame>
      <Controls>
        {MODULES.map((m, i) => (
          <Toggle
            key={m.name}
            label={`${m.name} (${m.mb}MB)`}
            on={on[i]}
            locked={m.locked}
            onChange={(v) => setOn((arr) => arr.map((x, j) => (j === i ? v : x)))}
          />
        ))}
      </Controls>
      <Note>
        Your image is <b style={{ color: theme.accent.primary }}>{size} MB</b> vs a full JDK
        (~{full} MB). <b style={{ color: theme.text.primary }}>jlink</b> bundles only the
        modules you pick; <b style={{ color: theme.text.primary }}>jpackage</b> wraps it into
        a native installer — no preinstalled Java required.
      </Note>
    </div>
  );
}

/* ================================================================== *
 * Shared helpers for Language Fundamentals widgets
 * ================================================================== */

function Tabs({ tabs }: { tabs: { label: string; body: React.ReactNode }[] }) {
  const [i, setI] = useState(0);
  return (
    <div>
      <Controls>
        {tabs.map((t, idx) => (
          <Btn key={idx} active={i === idx} onClick={() => setI(idx)}>
            {t.label}
          </Btn>
        ))}
      </Controls>
      <div style={{ marginTop: 10 }}>{tabs[i].body}</div>
    </div>
  );
}

function Mono({ children }: { children: React.ReactNode }) {
  return (
    <pre
      style={{
        background: "#0b0c0d",
        border: `1px solid ${theme.border}`,
        borderRadius: 8,
        padding: "10px 12px",
        margin: 0,
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
        fontSize: 12.5,
        color: theme.text.secondary,
        whiteSpace: "pre-wrap",
        lineHeight: 1.6,
      }}
    >
      {children}
    </pre>
  );
}

function TextField({
  value,
  onChange,
  placeholder,
  onEnter,
  wide,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  onEnter?: () => void;
  wide?: boolean;
}) {
  return (
    <input
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && onEnter) onEnter();
      }}
      style={{
        background: theme.surface2,
        border: `1px solid ${theme.border}`,
        borderRadius: 6,
        padding: "7px 10px",
        color: theme.text.primary,
        fontSize: 13,
        outline: "none",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
        minWidth: wide ? 240 : 90,
        maxWidth: wide ? "100%" : 160,
        flex: wide ? 1 : undefined,
      }}
    />
  );
}

/* ================================================================== *
 * 9 · Class, main & statements — anatomy highlighter
 * ================================================================== */
const ANATOMY = [
  { id: "package", label: "package", desc: "Declares the namespace (folder-like grouping) this class belongs to." },
  { id: "import", label: "import", desc: "Brings in types from other packages so you can use their short names." },
  { id: "class", label: "class", desc: "The top-level container. A file's public class must match its filename." },
  { id: "method", label: "main method", desc: "Execution starts at public static void main(String[] args)." },
  { id: "statement", label: "statement", desc: "Each instruction ends with a semicolon; { } groups a block." },
];
function ClassAnatomy() {
  const [sel, setSel] = useState<string | null>(null);
  const col = (p: string) => (sel === p ? theme.accent.primary : theme.text.secondary);
  const wt = (p: string) => (sel === p ? 700 : 400);
  const line = (p: string, text: string) => (
    <span style={{ color: col(p), fontWeight: wt(p) }}>{text}</span>
  );
  return (
    <div>
      <Mono>
        <div>{line("package", "package com.example;")}</div>
        <div>{line("import", "import java.util.List;")}</div>
        <div> </div>
        <div>{line("class", "public class Hello {")}</div>
        <div>{"  "}{line("method", "public static void main(String[] args) {")}</div>
        <div>{"    "}{line("statement", 'System.out.println("Hi");')}</div>
        <div>{"  }"}</div>
        <div>{"}"}</div>
      </Mono>
      <Controls>
        {ANATOMY.map((p) => (
          <Btn key={p.id} active={sel === p.id} onClick={() => setSel(p.id)}>
            {p.label}
          </Btn>
        ))}
      </Controls>
      <Note>
        {sel
          ? ANATOMY.find((p) => p.id === sel)!.desc
          : "Click a part of the program to highlight it and see what it does."}
      </Note>
    </div>
  );
}

/* ================================================================== *
 * 10 · Comments & Javadoc — tabs
 * ================================================================== */
function Comments() {
  return (
    <Tabs
      tabs={[
        {
          label: "// line",
          body: (
            <>
              <Mono>{`int x = 5; // inline note to end of line`}</Mono>
              <Note>Line comments run from // to the end of the line.</Note>
            </>
          ),
        },
        {
          label: "/* block */",
          body: (
            <>
              <Mono>{`/* this comment\n   spans multiple lines */`}</Mono>
              <Note>Block comments can span multiple lines between /* and */.</Note>
            </>
          ),
        },
        {
          label: "/** javadoc */",
          body: (
            <>
              <Mono>{`/**\n * Adds two numbers.\n * @param a first value\n * @return the sum\n */`}</Mono>
              <Note>
                Doc comments plus tags (@param, @return) generate browsable HTML API docs via
                the <code>javadoc</code> tool.
              </Note>
            </>
          ),
        },
      ]}
    />
  );
}

/* ================================================================== *
 * 11 · Identifiers, keywords & conventions — live validator
 * ================================================================== */
const RESERVED = new Set([
  "abstract","assert","boolean","break","byte","case","catch","char","class","const",
  "continue","default","do","double","else","enum","extends","final","finally","float",
  "for","goto","if","implements","import","instanceof","int","interface","long","native",
  "new","package","private","protected","public","return","short","static","strictfp",
  "super","switch","synchronized","this","throw","throws","transient","try","void",
  "volatile","while","true","false","null",
]);
function classifyIdent(s: string): { ok: boolean; msg: string } {
  if (!s) return { ok: false, msg: "Type an identifier above." };
  if (RESERVED.has(s)) return { ok: false, msg: `"${s}" is a reserved keyword — it can't be an identifier.` };
  if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(s)) {
    const why = /^[0-9]/.test(s) ? "can't start with a digit" : "contains an illegal character";
    return { ok: false, msg: `Invalid — ${why}. Allowed: letters, digits, _ and $ (not starting with a digit).` };
  }
  let conv = "valid identifier";
  if (/^[A-Z][A-Z0-9_]*$/.test(s) && s.includes("_")) conv = "UPPER_SNAKE_CASE — the convention for constants";
  else if (/^[A-Z][a-zA-Z0-9]*$/.test(s)) conv = "PascalCase — the convention for classes & types";
  else if (/^[a-z][a-zA-Z0-9]*$/.test(s)) conv = "camelCase — the convention for methods & fields";
  return { ok: true, msg: `Valid ✓ — ${conv}.` };
}
function Identifiers() {
  const [v, setV] = useState("userName");
  const r = classifyIdent(v.trim());
  return (
    <div>
      <TextField value={v} onChange={setV} placeholder="myVariable" />
      <Controls>
        <span style={{ fontSize: 11, color: theme.text.tertiary }}>try:</span>
        {["userName", "MyClass", "MAX_SIZE", "2fast", "class"].map((s) => (
          <Btn key={s} onClick={() => setV(s)}>
            {s}
          </Btn>
        ))}
      </Controls>
      <Note>
        <span style={{ color: r.ok ? theme.accent.primary : theme.warning }}>{r.msg}</span>
      </Note>
    </div>
  );
}

/* ================================================================== *
 * 12 · Primitive types — selector with bit-width bar
 * ================================================================== */
const PRIMS = [
  { n: "byte", bits: 8, range: "-128 … 127", def: "0" },
  { n: "short", bits: 16, range: "-32,768 … 32,767", def: "0" },
  { n: "int", bits: 32, range: "-2.1B … 2.1B", def: "0" },
  { n: "long", bits: 64, range: "-9.2E18 … 9.2E18", def: "0L" },
  { n: "float", bits: 32, range: "±3.4E38 (~7 digits)", def: "0.0f" },
  { n: "double", bits: 64, range: "±1.8E308 (~15 digits)", def: "0.0d" },
  { n: "char", bits: 16, range: "0 … 65,535 (UTF-16)", def: "'\\u0000'" },
  { n: "boolean", bits: 1, range: "true / false", def: "false" },
];
function Primitives() {
  const [i, setI] = useState(2);
  const p = PRIMS[i];
  const W = 600;
  const H = 40;
  return (
    <div>
      <Controls>
        {PRIMS.map((x, idx) => (
          <Btn key={x.n} active={i === idx} onClick={() => setI(idx)}>
            {x.n}
          </Btn>
        ))}
      </Controls>
      <div style={{ marginTop: 10 }}>
        <Frame w={W} h={H} label={`${p.n} is ${p.bits} bits wide`}>
          <rect x={0} y={10} width={W} height={20} rx={4} fill={theme.surface2} stroke={theme.border} />
          <rect
            x={0}
            y={10}
            width={Math.max(8, (p.bits / 64) * W)}
            height={20}
            rx={4}
            fill="rgba(74,158,255,0.25)"
            stroke={theme.accent.primary}
          />
          <text x={10} y={20} dominantBaseline="middle" fontSize={11} fontWeight={600} fill={theme.text.primary}>
            {p.bits}-bit
          </text>
        </Frame>
      </div>
      <Note>
        <b style={{ color: theme.text.primary }}>{p.n}</b> · {p.bits} bits · range {p.range} ·
        default <code>{p.def}</code>
      </Note>
    </div>
  );
}

/* ================================================================== *
 * 13 · Reference types & null — dereference toggle
 * ================================================================== */
function ReferencesNull() {
  const [nul, setNul] = useState(false);
  return (
    <div>
      <Mono>{`String s = ${nul ? "null" : '"hello"'};\nint n = s.length();`}</Mono>
      <Controls>
        <Btn active={!nul} onClick={() => setNul(false)}>
          s = &quot;hello&quot;
        </Btn>
        <Btn active={nul} onClick={() => setNul(true)}>
          s = null
        </Btn>
      </Controls>
      <Note>
        {nul ? (
          <span style={{ color: theme.warning }}>
            ✗ NullPointerException — s references nothing, so there&apos;s no object to call
            .length() on.
          </span>
        ) : (
          <span style={{ color: theme.accent.primary }}>
            ✓ n = 5 — s references a String object on the heap.
          </span>
        )}
      </Note>
    </div>
  );
}

/* ================================================================== *
 * 14 · Wrappers & autoboxing — the Integer cache == pitfall
 * ================================================================== */
function AutoboxingCache() {
  const [n, setN] = useState(127);
  const cached = n >= -128 && n <= 127;
  return (
    <div>
      <Mono>{`Integer a = ${n}, b = ${n};\na == b       // reference compare\na.equals(b)  // value compare`}</Mono>
      <Controls>
        <span style={{ fontSize: 11, color: theme.text.tertiary }}>value:</span>
        {[100, 127, 128, 1000].map((v) => (
          <Btn key={v} active={n === v} onClick={() => setN(v)}>
            {v}
          </Btn>
        ))}
      </Controls>
      <Note>
        <div>
          <code>a == b</code> →{" "}
          <span style={{ color: cached ? theme.accent.primary : theme.warning }}>{String(cached)}</span>{" "}
          {cached ? "(both reused from the Integer cache)" : "(two different objects)"}
        </div>
        <div>
          <code>a.equals(b)</code> → <span style={{ color: theme.accent.primary }}>true</span>. The
          cache only holds -128…127 — always compare values with{" "}
          <b style={{ color: theme.text.primary }}>equals()</b>, not ==.
        </div>
      </Note>
    </div>
  );
}

/* ================================================================== *
 * 15 · Type conversion & casting — overflow explorer
 * ================================================================== */
function toByte(x: number) {
  const r = ((x % 256) + 256) % 256;
  return r > 127 ? r - 256 : r;
}
function toShort(x: number) {
  const r = ((x % 65536) + 65536) % 65536;
  return r > 32767 ? r - 65536 : r;
}
function Casting() {
  const [v, setV] = useState(300);
  const byteOverflow = toByte(v) !== v;
  const shortOverflow = toShort(v) !== v;
  return (
    <div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <span style={{ fontSize: 12, color: theme.text.secondary }}>int value:</span>
        <TextField value={String(v)} onChange={(s) => setV(parseInt(s || "0", 10) || 0)} placeholder="300" />
      </div>
      <Controls>
        {[42, 300, -1, 128, 70000].map((x) => (
          <Btn key={x} active={v === x} onClick={() => setV(x)}>
            {x}
          </Btn>
        ))}
      </Controls>
      <Note>
        <div>
          widening (implicit): <code>long</code> {v}L · <code>double</code> {v}.0 — no data lost
        </div>
        <div>
          narrowing (cast): <code>(byte)</code>{" "}
          <span style={{ color: byteOverflow ? theme.warning : theme.accent.primary }}>{toByte(v)}</span> ·{" "}
          <code>(short)</code>{" "}
          <span style={{ color: shortOverflow ? theme.warning : theme.accent.primary }}>{toShort(v)}</span>{" "}
          {byteOverflow ? "— narrowing overflows and wraps around!" : ""}
        </div>
      </Note>
    </div>
  );
}

/* ================================================================== *
 * 16 · var — type inference selector
 * ================================================================== */
const VARS = [
  { code: "var n = 10;", type: "int" },
  { code: 'var s = "hi";', type: "String" },
  { code: "var d = 3.14;", type: "double" },
  { code: "var ok = true;", type: "boolean" },
  { code: "var list = new ArrayList<String>();", type: "ArrayList<String>" },
];
function VarInference() {
  const [i, setI] = useState(0);
  const v = VARS[i];
  return (
    <div>
      <Controls>
        {VARS.map((x, idx) => (
          <Btn key={idx} active={i === idx} onClick={() => setI(idx)}>
            {x.code}
          </Btn>
        ))}
      </Controls>
      <div style={{ marginTop: 10 }}>
        <Mono>{`${v.code}\n// compiler infers: ${v.type}`}</Mono>
      </div>
      <Note>
        The compiler infers <b style={{ color: theme.accent.primary }}>{v.type}</b> from the
        initializer. <code>var</code> is still <b style={{ color: theme.text.primary }}>static</b>{" "}
        typing — the type is fixed at compile time, not dynamic.
      </Note>
    </div>
  );
}

/* ================================================================== *
 * 17 · Operators — live evaluator
 * ================================================================== */
const OPS = ["+", "-", "*", "/", "%", "&", "|", "^", "<<", ">>"];
function applyOp(a: number, b: number, op: string): number {
  switch (op) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "/": return b === 0 ? NaN : Math.trunc(a / b);
    case "%": return b === 0 ? NaN : a % b;
    case "&": return a & b;
    case "|": return a | b;
    case "^": return a ^ b;
    case "<<": return a << b;
    case ">>": return a >> b;
    default: return 0;
  }
}
function bin(n: number) {
  return (n < 0 ? "-" : "") + Math.abs(n).toString(2);
}
function Operators() {
  const [a, setA] = useState(6);
  const [b, setB] = useState(3);
  const [op, setOp] = useState("+");
  const bitwise = ["&", "|", "^", "<<", ">>"].includes(op);
  const res = applyOp(a, b, op);
  return (
    <div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <TextField value={String(a)} onChange={(s) => setA(parseInt(s || "0", 10) || 0)} />
        <span style={{ color: theme.text.secondary, fontFamily: "ui-monospace, monospace" }}>{op}</span>
        <TextField value={String(b)} onChange={(s) => setB(parseInt(s || "0", 10) || 0)} />
        <span style={{ color: theme.text.secondary }}>=</span>
        <span style={{ color: theme.accent.primary, fontWeight: 600, fontFamily: "ui-monospace, monospace" }}>
          {Number.isNaN(res) ? "ArithmeticException" : res}
        </span>
      </div>
      <Controls>
        {OPS.map((o) => (
          <Btn key={o} active={op === o} onClick={() => setOp(o)}>
            {o}
          </Btn>
        ))}
      </Controls>
      <Note>
        {bitwise ? (
          <span style={{ fontFamily: "ui-monospace, monospace" }}>
            {a} = {bin(a)} · {b} = {bin(b)} → {Number.isNaN(res) ? "—" : bin(res)}
          </span>
        ) : (
          <>
            Operators obey precedence &amp; associativity. Integer <code>/</code> truncates toward
            zero; <code>%</code> is the remainder.
          </>
        )}
      </Note>
    </div>
  );
}

/* ================================================================== *
 * 18 · Literals & numeric formatting — base explorer
 * ================================================================== */
function group(n: number) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "_");
}
function Literals() {
  const [v, setV] = useState(1000000);
  return (
    <div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <span style={{ fontSize: 12, color: theme.text.secondary }}>value:</span>
        <TextField value={String(v)} onChange={(s) => setV(Math.max(0, parseInt(s || "0", 10) || 0))} />
      </div>
      <Controls>
        {[255, 1000000, 4096].map((x) => (
          <Btn key={x} active={v === x} onClick={() => setV(x)}>
            {x}
          </Btn>
        ))}
      </Controls>
      <div style={{ marginTop: 10 }}>
        <Mono>{`decimal   ${v}\ngrouped   ${group(v)}\nhex       0x${v.toString(16).toUpperCase()}\noctal     0${v.toString(8)}\nbinary    0b${v.toString(2)}`}</Mono>
      </div>
      <Note>
        Underscores (<code>_</code>) group digits for readability; <code>0x</code> / <code>0</code> /{" "}
        <code>0b</code> prefixes pick hex / octal / binary; suffixes <code>L f d</code> set the type.
      </Note>
    </div>
  );
}

/* ================================================================== *
 * Registry + public component
 * ================================================================== */
const REGISTRY: Record<string, React.ComponentType> = {
  "jdk-jre-jvm": JdkJreJvm,
  "editions-distros": EditionsDistros,
  "bytecode-class": BytecodeClass,
  "javac-java": JavacJava,
  "classpath-modulepath": ClasspathModulepath,
  "jshell-repl": JshellRepl,
  "maven-gradle": MavenGradle,
  "jlink-jpackage": JlinkJpackage,
  "class-anatomy": ClassAnatomy,
  "comments": Comments,
  "identifiers": Identifiers,
  "primitives": Primitives,
  "references-null": ReferencesNull,
  "autoboxing-cache": AutoboxingCache,
  "casting": Casting,
  "var-inference": VarInference,
  "operators": Operators,
  "literals": Literals,
};

export function hasDiagram(id?: string): boolean {
  return !!id && id in REGISTRY;
}

export function TopicDiagram({ id }: { id: string }) {
  const D = REGISTRY[id];
  if (!D) return null;
  return (
    <div
      style={{
        marginTop: 4,
        border: `1px solid ${theme.border}`,
        borderRadius: 8,
        background: theme.surface,
        padding: "12px 14px 12px 14px",
      }}
    >
      <div
        style={{
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          color: theme.text.tertiary,
          marginBottom: 10,
        }}
      >
        Interactive · try it
      </div>
      <D />
    </div>
  );
}

/* ================================================================== *
 * Config-driven factories for the rest of the catalog
 * ================================================================== */
type PickItem = { label: string; code?: string; note: React.ReactNode };

function picker(items: PickItem[]): React.ComponentType {
  return function Picker() {
    const [i, setI] = useState(0);
    const it = items[i];
    return (
      <div>
        <Controls>
          {items.map((x, idx) => (
            <Btn key={idx} active={i === idx} onClick={() => setI(idx)}>
              {x.label}
            </Btn>
          ))}
        </Controls>
        {it.code !== undefined ? (
          <div style={{ marginTop: 10 }}>
            <Mono>{it.code}</Mono>
          </div>
        ) : null}
        <Note>{it.note}</Note>
      </div>
    );
  };
}

function stepper(label: string, nodes: FlowNode[]): React.ComponentType {
  return function Stepper() {
    return <FlowStepper label={label} nodes={nodes} />;
  };
}

const BY_NAME: Record<string, string> = {};
export function diagramId(topic: { name: string; diagram?: string }): string | undefined {
  return topic.diagram ?? BY_NAME[topic.name];
}

/* ---------- Batch: categories 3–8 ---------- */
Object.assign(REGISTRY, {
  "if-else": picker([
    { label: "score = 92", code: 'if (s >= 90) grade = "A";\nelse if (s >= 60) grade = "C";\nelse grade = "F";', note: '92 ≥ 90 → the first branch runs (grade = "A"). Once a branch matches, the rest are skipped.' },
    { label: "score = 75", code: 'if (s >= 90) grade = "A";\nelse if (s >= 60) grade = "C";\nelse grade = "F";', note: '75 fails ≥ 90 but passes ≥ 60 → grade = "C".' },
    { label: "score = 40", code: 'if (s >= 90) grade = "A";\nelse if (s >= 60) grade = "C";\nelse grade = "F";', note: '40 fails both conditions → the else runs (grade = "F").' },
  ]),
  "switch-expr": picker([
    { label: "classic switch", code: "switch (day) {\n  case MON: n = 1; break;\n  case TUE: n = 2; break;\n  default: n = 0;\n}", note: "Statement form: each case needs break, or execution falls through to the next case." },
    { label: "arrow switch", code: "int n = switch (day) {\n  case MON -> 1;\n  case TUE -> 2;\n  default -> 0;\n};", note: "Expression form (14): returns a value, has no fall-through, and must be exhaustive." },
    { label: "yield block", code: "int n = switch (day) {\n  case MON -> { yield 1; }\n  default  -> 0;\n};", note: "yield returns a value out of a multi-statement case block." },
  ]),
  "switch-patterns": picker([
    { label: "type pattern", code: "switch (obj) {\n  case Integer i -> i * 2;\n  case String s  -> s.length();\n  default        -> 0;\n}", note: "Matches by type and binds the variable in a single step." },
    { label: "record pattern", code: "switch (shape) {\n  case Circle(double r) -> Math.PI*r*r;\n  case Square(double s) -> s*s;\n}", note: "Deconstructs record components directly (21)." },
    { label: "guard (when)", code: 'case Integer i when i > 0 -> "positive";', note: "when adds a boolean guard on top of a pattern." },
    { label: "null case", code: 'case null -> "none";', note: "switch can handle null explicitly instead of throwing NullPointerException." },
  ]),
  "loops": picker([
    { label: "for", code: "for (int i = 0; i < 3; i++) {\n  sum += i;\n}", note: "Counted loop: init, condition, and update live in one header." },
    { label: "while", code: "while (n > 0) {\n  n /= 2;\n}", note: "Checks the condition before each iteration — may run zero times." },
    { label: "do-while", code: "do {\n  read();\n} while (more);", note: "Runs the body once, then checks — always at least one iteration." },
  ]),
  "for-each": picker([
    { label: "for-each", code: "for (String s : list) {\n  print(s);\n}", note: "Reads each element with no index or iterator to manage." },
    { label: "desugars to", code: "for (Iterator<String> it = list.iterator();\n     it.hasNext(); ) {\n  String s = it.next();\n}", note: "The compiler rewrites for-each into an Iterator loop over any Iterable." },
    { label: "limitation", code: "// removing during for-each →\n// ConcurrentModificationException", note: "To remove while iterating, use an explicit Iterator.remove()." },
  ]),
  "break-continue": picker([
    { label: "break", code: "for (int i=0;i<10;i++) {\n  if (i == 5) break;\n}", note: "Exits the innermost loop (or switch) immediately." },
    { label: "continue", code: "for (int i=0;i<10;i++) {\n  if (i%2==0) continue;\n  sum += i;\n}", note: "Skips the rest of the body and moves to the next iteration." },
    { label: "labeled break", code: "outer:\nfor (...) for (...) {\n  if (found) break outer;\n}", note: "A label lets break/continue target an enclosing outer loop." },
  ]),
  "biginteger": picker([
    { label: "big factorial", code: "BigInteger f = BigInteger.ONE;\nfor (int i=2;i<=100;i++)\n  f = f.multiply(BigInteger.valueOf(i));", note: "Unbounded size — 100! has 158 digits, far beyond what long can hold." },
    { label: "modPow", code: "base.modPow(exp, mod)", note: "Efficient modular exponentiation, a building block of cryptography." },
    { label: "immutable", code: "a.add(b)  // returns a new value", note: "Every operation returns a new BigInteger; there is no operator overloading." },
  ]),
  "bigdecimal": picker([
    { label: "exact decimal", code: 'new BigDecimal("0.1")\n  .add(new BigDecimal("0.2"))\n// 0.3 exactly', note: "Use the String constructor for exact decimals — the correct type for money." },
    { label: "double pitfall", code: "new BigDecimal(0.1)\n// 0.1000000000000000055511...", note: "Never build a BigDecimal from a double literal — it captures the binary error." },
    { label: "scale & rounding", code: "d.setScale(2, RoundingMode.HALF_UP)", note: "Scale is the number of decimal places; the rounding mode must be explicit." },
    { label: "compareTo", code: 'new BigDecimal("1.0")\n  .equals(new BigDecimal("1.00")) // false', note: "equals considers scale; use compareTo to compare numeric value." },
  ]),
  "random": picker([
    { label: "seeded", code: "new Random(42).nextInt()", note: "Same seed → same sequence (deterministic) — great for reproducible tests." },
    { label: "nextInt(bound)", code: "rnd.nextInt(6) + 1  // dice 1..6", note: "Returns 0 ≤ n < bound." },
    { label: "ThreadLocalRandom", code: "ThreadLocalRandom.current().nextInt(100)", note: "A per-thread generator — no contention in concurrent code." },
  ]),
  "securerandom": picker([
    { label: "SecureRandom", code: "byte[] b = new byte[16];\nnew SecureRandom().nextBytes(b);", note: "Cryptographically strong — use for tokens, keys, and salts." },
    { label: "RandomGenerator", code: 'RandomGenerator g =\n  RandomGenerator.of("L64X128MixRandom");', note: "A unified interface (17) over many algorithms." },
    { label: "factory", code: "RandomGeneratorFactory.all()...", note: "Discover splittable / jumpable / streamable generators at runtime." },
  ]),
  "string-pool": picker([
    { label: "literals interned", code: '"hi" == "hi"   // true', note: "Identical literals share one pooled object, so == happens to be true." },
    { label: "new String", code: 'new String("hi") == "hi"  // false', note: "new always allocates a fresh object outside the pool." },
    { label: "intern()", code: 'new String("hi").intern() == "hi" // true', note: "intern() returns the canonical pooled instance. Always compare text with equals()." },
  ]),
  "stringbuilder": picker([
    { label: "loop concat (bad)", code: 'String s = "";\nfor (...) s += x;  // O(n^2)', note: "Each += builds a brand-new String — quadratic cost inside a loop." },
    { label: "StringBuilder", code: "var sb = new StringBuilder();\nfor (...) sb.append(x);\nsb.toString();", note: "A mutable buffer — linear time; the go-to for building strings." },
    { label: "StringBuffer", code: "new StringBuffer()", note: "Same API but synchronized (thread-safe) — rarely needed today." },
  ]),
  "text-blocks": picker([
    { label: "text block", code: 'String json = """\n    {"a": 1}\n    """;', note: "A triple-quoted multi-line literal; incidental indentation is stripped automatically." },
    { label: "vs escaped", code: 'String json = "{\\"a\\": 1}\\n";', note: "The old way — escaping quotes and newlines by hand." },
    { label: "line continuation", code: '"""\n  long \\\n  line"""', note: "A trailing backslash joins lines without inserting a newline." },
  ]),
  "array-decl": picker([
    { label: "new int[3]", code: "int[] a = new int[3];\n// {0, 0, 0}", note: "Fixed length; numbers default to 0, objects to null, boolean to false." },
    { label: "initializer", code: "int[] a = {1, 2, 3};", note: "A literal initializer sets both length and values at once." },
    { label: "length", code: "a.length   // 3  (a field, not a method)", note: "Arrays know their size; valid indices are 0 .. length-1." },
  ]),
  "array-2d": picker([
    { label: "rectangular", code: "int[][] g = new int[2][3];", note: "2 rows × 3 columns, stored as an array of row-arrays." },
    { label: "jagged", code: "int[][] j = { {1}, {1, 2, 3} };", note: "Rows may have different lengths." },
    { label: "access", code: "g[1][2] = 9;", note: "An out-of-range index throws ArrayIndexOutOfBoundsException." },
  ]),
  "array-utils": picker([
    { label: "sort", code: "Arrays.sort(a);", note: "In-place: dual-pivot quicksort for primitives, mergesort for objects." },
    { label: "binarySearch", code: "Arrays.binarySearch(a, 5)", note: "Requires a sorted array; returns the index or a negative insertion point." },
    { label: "copyOf", code: "Arrays.copyOf(a, newLen)", note: "Resize or clone; System.arraycopy does fast bulk copies." },
    { label: "asList / stream", code: "Arrays.asList(a)\nArrays.stream(a)", note: "Bridge arrays into the Collections and Streams worlds." },
  ]),
  "method-sig": picker([
    { label: "parameters", code: "int add(int a, int b) { return a + b; }", note: "The name plus parameter types form the signature the compiler uses." },
    { label: "return", code: "return a + b;", note: "return produces the result and exits the method." },
    { label: "void", code: "void log(String m) { print(m); }", note: "void means no return value; a bare return; can still exit early." },
  ]),
  "overloading": picker([
    { label: "print(1)", code: "void print(int i)\nvoid print(double d)\nvoid print(String s)", note: "Argument 1 is an int → binds to print(int)." },
    { label: "print(1.0)", code: "void print(int i)\nvoid print(double d)\nvoid print(String s)", note: "1.0 is a double → binds to print(double)." },
    { label: 'print("x")', code: "void print(int i)\nvoid print(double d)\nvoid print(String s)", note: '"x" is a String → print(String). Overloads are chosen at compile time by argument type, never by return type.' },
  ]),
  "varargs": picker([
    { label: "many args", code: "int sum(int... ns) { ... }\nsum(1, 2, 3);", note: "Accepts any number of arguments, received as an int[]." },
    { label: "no args", code: "sum();   // ns.length == 0", note: "Zero arguments is valid — it becomes an empty array." },
    { label: "must be last", code: "void f(String fmt, Object... args)", note: "A varargs parameter must be the final parameter." },
  ]),
  "pass-by-value": picker([
    { label: "primitive", code: "void inc(int x){ x++; }\nint a = 5; inc(a);  // a is still 5", note: "The value is copied — the callee's x is independent of a." },
    { label: "object mutation", code: "void add(List l){ l.add(1); }\n// caller's list sees the new element", note: "The reference is copied but points to the same object, so mutations are visible." },
    { label: "reassignment", code: "void reset(List l){ l = new ...; }\n// caller's list is unchanged", note: "Reassigning the copied reference doesn't affect the caller. Java is always pass-by-value." },
  ]),
  "recursion": stepper("factorial(3) on the call stack", [
    { title: "fact(3)", sub: "3 * fact(2)", desc: "Each call defers to a smaller subproblem and is pushed onto the call stack." },
    { title: "fact(2)", sub: "2 * fact(1)", desc: "The stack grows one frame with every recursive call." },
    { title: "fact(1)", sub: "base case → 1", desc: "The base case returns without recursing, stopping the descent." },
    { title: "unwind", sub: "1·1·2·3 = 6", desc: "Frames pop and multiply back up. Too deep and you get StackOverflowError (no tail-call optimization)." },
  ]),
  "static-instance": picker([
    { label: "static", code: "Math.max(1, 2)", note: "Called on the class itself — no object required." },
    { label: "instance", code: '"hi".length()', note: "Called on an object; this refers to that specific object." },
    { label: "main", code: "public static void main(String[] a)", note: "static so the JVM can invoke it without constructing your class." },
  ]),
});
Object.assign(BY_NAME, {
  "if / else if / else": "if-else",
  "switch statement & expression": "switch-expr",
  "Pattern matching for switch": "switch-patterns",
  "for / while / do-while": "loops",
  "Enhanced for (for-each)": "for-each",
  "break, continue & labels": "break-continue",
  "Math & StrictMath": "math",
  "Exact & floor arithmetic": "exact-math",
  "Floating-point semantics": "float-ieee",
  "BigInteger": "biginteger",
  "BigDecimal": "bigdecimal",
  "Random & ThreadLocalRandom": "random",
  "SecureRandom & RandomGenerator": "securerandom",
  "Immutability & the string pool": "string-pool",
  "Core String API": "string-api",
  "StringBuilder & StringBuffer": "stringbuilder",
  "Formatting & conversion": "string-format",
  "Text blocks": "text-blocks",
  "Pattern & Matcher": "regex",
  "Declaration & initialization": "array-decl",
  "Multidimensional & jagged arrays": "array-2d",
  "Arrays & System utilities": "array-utils",
  "Signatures, parameters & return": "method-sig",
  "Overloading": "overloading",
  "Varargs": "varargs",
  "Pass-by-value": "pass-by-value",
  "Recursion": "recursion",
  "static vs instance & main": "static-instance",
});

/* ---------- Batch: category 6 + categories 9–12 ---------- */
Object.assign(REGISTRY, {
  "locale": picker([
    { label: "number by locale", code: 'NumberFormat.getInstance(Locale.US)\n  .format(1234.5)      // "1,234.5"\n// Locale.GERMANY       → "1.234,5"', note: "Grouping and decimal separators differ by locale." },
    { label: "ResourceBundle", code: 'ResourceBundle b =\n  ResourceBundle.getBundle("msg", locale);\nb.getString("greeting");', note: "Externalizes translatable text; picks msg_fr.properties, msg.properties, etc." },
    { label: "fallback", code: "msg_fr_FR → msg_fr → msg", note: "Lookup falls back from the most specific bundle to the least specific." },
  ]),
  "numberformat": picker([
    { label: "currency", code: 'NumberFormat.getCurrencyInstance(Locale.US)\n  .format(9.5)   // "$9.50"', note: "The locale decides the currency symbol and its placement (US$ vs €)." },
    { label: "percent", code: 'NumberFormat.getPercentInstance()\n  .format(0.25)  // "25%"', note: "Scales the value by 100 and appends the percent sign." },
    { label: "DecimalFormat", code: 'new DecimalFormat("#,##0.00")\n  .format(1234.5) // "1,234.50"', note: "Pattern characters give fine-grained formatting control." },
  ]),
  "charset": picker([
    { label: "encode UTF-8", code: '"café".getBytes(StandardCharsets.UTF_8)', note: "UTF-8 encodes 'é' as two bytes; always name the charset explicitly." },
    { label: "ISO-8859-1", code: "s.getBytes(StandardCharsets.ISO_8859_1)", note: "A different charset produces different bytes — mismatches corrupt text." },
    { label: "default UTF-8", code: "// since JDK 18 the default charset is UTF-8", note: "Before 18 the default depended on the platform — a classic source of bugs." },
  ]),
  "unicode": picker([
    { label: "char vs code point", code: '"😀".length()             // 2\n"😀".codePointCount(0, 2) // 1', note: "Java strings are UTF-16; astral characters use two chars (a surrogate pair)." },
    { label: "iterate code points", code: "s.codePoints().forEach(...)", note: "Iterate code points, not chars, to handle emoji and rare scripts correctly." },
    { label: "normalization", code: "Normalizer.normalize(s, Form.NFC)", note: "Reconciles equivalent sequences (é as one char vs e + combining accent)." },
  ]),
  "class-object": picker([
    { label: "class", code: "class Point {\n  int x, y;\n  int sum(){ return x + y; }\n}", note: "A class is a blueprint: fields hold state, methods define behavior." },
    { label: "new instance", code: "Point p = new Point();", note: "new allocates an object on the heap and returns a reference to it." },
    { label: "access", code: "p.x = 3;\np.sum();", note: "Use the reference to read/write fields and invoke methods." },
  ]),
  "constructors": picker([
    { label: "default", code: "class A { }   // implicit A() { }", note: "With no declared constructor, the compiler supplies a no-arg default." },
    { label: "parameterized", code: "Point(int x, int y){ this.x = x; this.y = y; }", note: "this.field disambiguates a field from a same-named parameter." },
    { label: "chaining this()", code: "Point(){ this(0, 0); }", note: "this(...) delegates to another constructor and must be the first statement." },
  ]),
  "init-order": stepper("Object initialization order", [
    { title: "class load", sub: "static fields / blocks", desc: "Static fields and static { } blocks run once, when the class is first loaded." },
    { title: "new", sub: "allocate + super()", desc: "new allocates the object; the constructor implicitly calls super() first." },
    { title: "instance init", sub: "field inits + { }", desc: "Instance field initializers and instance { } blocks run in source order." },
    { title: "constructor", sub: "your ctor body", desc: "Finally the constructor body runs, with every field already initialized." },
  ]),
  "static-members": picker([
    { label: "static field", code: "class C {\n  static int count;\n  C(){ count++; }\n}", note: "One shared field across all instances — class-level state." },
    { label: "access via class", code: "C.count", note: "Reach static members through the class name, not an instance." },
    { label: "no this", code: "static int f(){ /* no this here */ }", note: "Static methods have no this — they belong to the class, not an object." },
  ]),
  "final-fields": picker([
    { label: "final variable", code: "final int x = 5;\nx = 6;   // compile error", note: "final forbids reassignment after initialization." },
    { label: "constant", code: "static final double PI = 3.14159;", note: "static final is a shared compile-time constant (UPPER_SNAKE by convention)." },
    { label: "blank final", code: "final int id;\nA(int id){ this.id = id; }", note: "A blank final must be assigned exactly once, in every constructor path." },
  ]),
  "equals-hashcode": picker([
    { label: "the contract", code: "a.equals(b)  ⇒  a.hashCode() == b.hashCode()", note: "Equal objects must return equal hash codes — override both together." },
    { label: "HashSet dedupe", code: "set.add(p1);\nset.add(p2);\n// size == 1 if p1.equals(p2)", note: "Hash collections rely on correct equals/hashCode to detect duplicates." },
    { label: "lifecycle", code: "// GC reclaims unreachable objects\n// finalize() is deprecated", note: "Objects die when unreachable; use Cleaner or try-with-resources, not finalize." },
  ]),
  "extends-super": picker([
    { label: "extends", code: "class Dog extends Animal { }", note: "Dog inherits Animal's accessible members (Java has single class inheritance)." },
    { label: "super()", code: "Dog(){ super(); /* runs Animal ctor */ }", note: "A subclass constructor runs its superclass constructor first." },
    { label: "super.method", code: "super.describe()", note: "super invokes the parent's version of an overridden method." },
  ]),
  "overriding": picker([
    { label: "@Override", code: "@Override\nString toString(){ ... }", note: "Redefines an inherited method; @Override makes the compiler verify the signature." },
    { label: "typo caught", code: "@Override\nString tostring(){...}  // error", note: "If it matches no inherited method, @Override won't compile — catching typos." },
    { label: "covariant return", code: "@Override\nDog reproduce(){ ... }", note: "An override may narrow the return type to a subtype." },
  ]),
  "abstract-class": picker([
    { label: "abstract method", code: "abstract class Shape {\n  abstract double area();\n}", note: "An abstract method has no body; concrete subclasses must implement it." },
    { label: "cannot instantiate", code: "new Shape();  // compile error", note: "Abstract classes are incomplete — only concrete subclasses can be created." },
    { label: "final blocks it", code: "final class Money { }  // no subclass", note: "final on a class or method forbids extension / override." },
  ]),
  "dynamic-dispatch": picker([
    { label: "Dog", code: 'Animal a = new Dog();\na.sound();  // "Woof"', note: "The method is chosen at runtime by the object's actual type, not the reference type." },
    { label: "Cat", code: 'Animal a = new Cat();\na.sound();  // "Meow"', note: "Same call site, different result — this is polymorphism (virtual invocation)." },
    { label: "static ≠ dispatch", code: "// static methods are NOT dispatched", note: "Static methods bind to the reference type at compile time (hiding, not overriding)." },
  ]),
  "instanceof-pattern": picker([
    { label: "old cast", code: "if (o instanceof String) {\n  String s = (String) o;\n}", note: "Pre-16: test the type, then perform a redundant explicit cast." },
    { label: "pattern instanceof", code: "if (o instanceof String s) {\n  use(s);\n}", note: "Tests and binds s in a single step (16)." },
    { label: "ClassCastException", code: "Object o = 42;\nString s = (String) o;  // throws", note: "A bad cast fails at runtime — pattern matching avoids it by testing first." },
  ]),
  "object-methods": picker([
    { label: "toString", code: "@Override String toString(){ ... }", note: "Human-readable form used in logging and string concatenation." },
    { label: "equals/hashCode", code: "// value equality + matching hash", note: "Override both together for correct behavior in hash-based collections." },
    { label: "getClass", code: "obj.getClass().getName()", note: "Runtime type information — the entry point to reflection." },
    { label: "Comparable/Comparator", code: "compareTo(o)              // natural\nComparator.comparing(...)  // custom", note: "Comparable = one natural order; Comparator = external, composable orders." },
  ]),
  "interface-basics": picker([
    { label: "interface", code: "interface Drawable { void draw(); }", note: "A contract of method signatures that implementers promise to provide." },
    { label: "implements", code: "class Circle implements Drawable {\n  public void draw(){ ... }\n}", note: "An implementing class must define all abstract methods." },
    { label: "multiple", code: "class C implements A, B { }", note: "A class may implement many interfaces — multiple inheritance of type." },
  ]),
  "default-methods": picker([
    { label: "default", code: "interface I {\n  default int size(){ return 0; }\n}", note: "Concrete default methods let interfaces evolve without breaking implementers (8)." },
    { label: "static", code: "interface I { static I empty(){ ... } }", note: "Static helper methods live on the interface itself." },
    { label: "diamond", code: "// implements A, B (both default m())\n// → you must override m() to resolve", note: "Conflicting inherited defaults force an explicit override." },
  ]),
  "functional-interface": picker([
    { label: "@FunctionalInterface", code: "@FunctionalInterface\ninterface Op { int apply(int a, int b); }", note: "Exactly one abstract method (SAM); the annotation enforces that shape." },
    { label: "lambda target", code: "Op add = (a, b) -> a + b;", note: "A lambda's type is inferred from the functional interface it targets." },
    { label: "java.util.function", code: "Function, Predicate, Supplier, Consumer", note: "A toolbox of ready-made functional interfaces for common shapes." },
  ]),
  "marker-interface": picker([
    { label: "constants", code: "interface Const { int MAX = 100; }", note: "Interface fields are implicitly public static final." },
    { label: "marker", code: "class C implements Serializable { }", note: "A method-less marker tags a capability the runtime checks for (Serializable, Cloneable)." },
  ]),
  "abstract-vs-interface": picker([
    { label: "abstract class", code: "abstract class Base {\n  int state;         // can hold state\n  Base(int s){ ... } // has a constructor\n}", note: "Shares state and partial implementation; single inheritance only." },
    { label: "interface", code: "interface I {\n  // no instance state\n  // many can be implemented\n}", note: "A pure contract (plus defaults); a class can implement several." },
    { label: "when to pick", code: "// 'is-a' + shared code → abstract class\n// capability / contract → interface", note: "Abstract class for shared code and state; interface for capabilities." },
  ]),
  "nested-classes": picker([
    { label: "static nested", code: "class Outer {\n  static class Node { }\n}", note: "A namespaced helper with no link to any Outer instance." },
    { label: "inner class", code: "class Outer {\n  class Inner { }  // holds Outer.this\n}", note: "A non-static inner class captures a reference to its enclosing instance." },
    { label: "Outer.this", code: "Outer.this.field", note: "Inner classes reach the enclosing object through Outer.this." },
  ]),
  "anonymous-class": picker([
    { label: "local class", code: "void m(){ class L { } new L(); }", note: "A class declared inside a method, visible only within it." },
    { label: "anonymous", code: "btn.setListener(new Listener(){\n  public void onClick(){ ... }\n});", note: "A one-off, unnamed class defined and instantiated inline." },
    { label: "lambda equivalent", code: "btn.setListener(() -> { ... });", note: "For a functional interface, a lambda is the concise modern form." },
  ]),
  "enums": picker([
    { label: "basic", code: "enum Day { MON, TUE, WED }", note: "A fixed, type-safe set of named constants." },
    { label: "with fields", code: "enum Planet {\n  EARTH(5.97e24);\n  Planet(double mass){ ... }\n}", note: "Enums can carry fields, constructors, and methods." },
    { label: "values / valueOf", code: 'Day.values();\nDay.valueOf("MON")', note: "Auto-generated helpers to list and look up constants." },
    { label: "EnumSet / EnumMap", code: "EnumSet.of(MON, TUE)", note: "Extremely efficient collections keyed by enum constants." },
  ]),
  "records": picker([
    { label: "declaration", code: "record Point(int x, int y) { }", note: "One line defines a transparent, immutable data carrier (16)." },
    { label: "auto members", code: "p.x();\np.equals(q);\np.toString();", note: "Accessors, equals, hashCode, and toString are generated for you." },
    { label: "compact ctor", code: "record Range(int lo, int hi) {\n  Range { if (lo > hi) throw ...; }\n}", note: "A compact constructor validates or normalizes the components." },
  ]),
  "sealed": picker([
    { label: "sealed", code: "sealed interface Shape\n  permits Circle, Square { }", note: "Restricts exactly which types may implement or extend it (17)." },
    { label: "exhaustive switch", code: "switch (shape) {\n  case Circle c -> ...;\n  case Square s -> ...;\n}   // no default needed", note: "A closed hierarchy lets the compiler verify exhaustiveness." },
    { label: "permitted variants", code: "final / sealed / non-sealed", note: "Each permitted subtype must itself be final, sealed, or non-sealed." },
  ]),
});
Object.assign(BY_NAME, {
  "Locale & ResourceBundle": "locale",
  "NumberFormat & DecimalFormat": "numberformat",
  "Charset & encoding": "charset",
  "Unicode & normalization": "unicode",
  "Fields, methods & objects": "class-object",
  "Constructors & this": "constructors",
  "Initialization order": "init-order",
  "static members": "static-members",
  "final fields & constants": "final-fields",
  "Object lifecycle & equals/hashCode": "equals-hashcode",
  "extends & super": "extends-super",
  "Overriding & @Override": "overriding",
  "final & abstract classes": "abstract-class",
  "Dynamic dispatch": "dynamic-dispatch",
  "Casting & instanceof patterns": "instanceof-pattern",
  "Object methods & contracts": "object-methods",
  "Interface basics": "interface-basics",
  "default & static methods": "default-methods",
  "Functional interfaces": "functional-interface",
  "constants & marker interfaces": "marker-interface",
  "Abstract class vs interface": "abstract-vs-interface",
  "Static nested & inner classes": "nested-classes",
  "Local & anonymous classes": "anonymous-class",
  "Enums": "enums",
  "Records": "records",
  "Sealed classes & interfaces": "sealed",
});

/* ---------- Batch: categories 13–19 ---------- */
Object.assign(REGISTRY, {
  "generics-basic": picker([
    { label: "generic class", code: "class Box<T> {\n  T value;\n  T get(){ return value; }\n}", note: "A type parameter T makes one class work for many types with compile-time checks." },
    { label: "generic method", code: "static <T> T first(List<T> xs){ return xs.get(0); }", note: "Methods can declare their own type parameters, inferred from arguments." },
    { label: "diamond", code: "Map<String,List<Integer>> m = new HashMap<>();", note: "The diamond <> infers the type arguments from the declaration." },
  ]),
  "bounded-generics": picker([
    { label: "upper bound", code: "<T extends Number> double sum(List<T> xs)", note: "extends restricts T to Number or a subtype, so Number's methods are callable." },
    { label: "multiple bounds", code: "<T extends Number & Comparable<T>>", note: "Combine bounds with & (a class bound, if present, comes first)." },
    { label: "recursive bound", code: "<T extends Comparable<T>> T max(List<T> xs)", note: "A self-referential bound expresses 'comparable to its own type'." },
  ]),
  "wildcards-pecs": picker([
    { label: "? extends (producer)", code: "double sum(List<? extends Number> src)", note: "Read Ts out (produces) — covariant. You can't add elements (except null)." },
    { label: "? super (consumer)", code: "void fill(List<? super Integer> dst)", note: "Write Ts in (consumes) — contravariant. Reading back yields Object." },
    { label: "PECS", code: "Producer Extends, Consumer Super", note: "The rule of thumb for which wildcard to choose." },
    { label: "unbounded", code: "List<?>", note: "Unknown element type — read as Object and check size, but can't add." },
  ]),
  "type-erasure": picker([
    { label: "erasure", code: "List<String> and List<Integer>\n// both are just List at runtime", note: "Generics exist only at compile time; the runtime sees raw types." },
    { label: "no new T[]", code: "T[] a = new T[n];  // compile error", note: "You can't create generic arrays or call new T() — the type is erased." },
    { label: "raw types", code: "List l = new ArrayList();  // unchecked", note: "Mixing raw and generic types defeats safety and triggers 'unchecked' warnings." },
  ]),
  "throwable": picker([
    { label: "Throwable", code: "Throwable\n ├─ Error\n └─ Exception\n     └─ RuntimeException", note: "Everything you can throw or catch descends from Throwable." },
    { label: "Error", code: "OutOfMemoryError, StackOverflowError", note: "Serious JVM problems you normally should not catch." },
    { label: "Exception", code: "IOException, SQLException", note: "Recoverable conditions; checked unless they are RuntimeExceptions." },
    { label: "RuntimeException", code: "NullPointerException,\nIllegalArgumentException", note: "Unchecked programming errors — no throws clause required." },
  ]),
  "checked-unchecked": picker([
    { label: "checked", code: "void read() throws IOException", note: "Must be declared or caught — the compiler enforces handling." },
    { label: "unchecked", code: "throw new IllegalArgumentException()", note: "RuntimeException subtypes need no declaration; used for programming bugs." },
    { label: "design", code: "// checked   = recoverable, caller acts\n// unchecked = a bug, fail fast", note: "Choose checked when callers can sensibly recover from the condition." },
  ]),
  "try-catch": stepper("try / catch / finally flow", [
    { title: "try", sub: "risky code", desc: "The guarded block runs until it completes normally or throws." },
    { title: "throw", sub: "exception raised", desc: "An exception aborts the rest of the try and searches for a matching catch." },
    { title: "catch", sub: "matching type", desc: "The first catch whose type matches handles it (multi-catch with A | B)." },
    { title: "finally", sub: "always runs", desc: "finally executes whether or not an exception occurred — ideal for cleanup." },
  ]),
  "twr": stepper("try-with-resources", [
    { title: "open", sub: "acquire resource", desc: "Resources declared in try(...) must implement AutoCloseable." },
    { title: "use", sub: "body runs", desc: "Work with the resource inside the try block." },
    { title: "close", sub: "auto, reverse order", desc: "close() is called automatically, in reverse order, even if the body throws." },
    { title: "suppressed", sub: "attached to primary", desc: "If close() also throws, that exception is attached as 'suppressed' to the primary one." },
  ]),
  "custom-exception": picker([
    { label: "define", code: "class OrderException extends RuntimeException {\n  OrderException(String m){ super(m); }\n}", note: "Subclass Exception (checked) or RuntimeException (unchecked) for domain errors." },
    { label: "wrap cause", code: 'throw new OrderException("failed", cause);', note: "Chain the original exception to preserve the root cause and its stack trace." },
    { label: "getCause", code: "e.getCause()", note: "Walk the cause chain to reach the underlying failure." },
  ]),
  "iterator": picker([
    { label: "for-each", code: "for (T x : coll) { ... }", note: "The idiomatic way to traverse any Iterable." },
    { label: "explicit iterator", code: "var it = coll.iterator();\nwhile (it.hasNext()) it.next();", note: "Gives you it.remove() for safe removal during iteration." },
    { label: "fail-fast", code: "// structural change mid-iteration →\n// ConcurrentModificationException", note: "Most collections detect concurrent modification and fail fast." },
  ]),
  "list-impls": picker([
    { label: "ArrayList", code: "get(i)  // O(1)\nadd()   // amortized O(1)", note: "Backed by a growable array — fast random access; the default List." },
    { label: "LinkedList", code: "addFirst/addLast // O(1)\nget(i)           // O(n)", note: "A doubly-linked list — great at the ends, poor at indexing." },
    { label: "Vector / Stack", code: "// legacy, synchronized", note: "Old synchronized classes; prefer ArrayList / ArrayDeque today." },
  ]),
  "set-impls": picker([
    { label: "HashSet", code: "// unordered, O(1) operations", note: "Backed by a hash table — fastest membership tests, no ordering." },
    { label: "LinkedHashSet", code: "// insertion order preserved", note: "HashSet plus a linked list for predictable iteration order." },
    { label: "TreeSet", code: "// sorted, O(log n)", note: "A red-black tree kept sorted by natural order or a Comparator." },
  ]),
  "map-impls": picker([
    { label: "HashMap", code: "map.get(k)  // O(1) average", note: "General-purpose key→value store with no ordering guarantee." },
    { label: "LinkedHashMap", code: "// access-order mode → LRU cache", note: "Maintains insertion (or access) order; handy for LRU caches." },
    { label: "TreeMap", code: "firstKey(), ceilingKey(k)", note: "A sorted, navigable map (red-black tree)." },
    { label: "default methods", code: "getOrDefault, computeIfAbsent, merge", note: "Rich helpers that simplify common map idioms." },
  ]),
  "queue-deque": picker([
    { label: "ArrayDeque as stack", code: "push(x); pop();", note: "Faster than the legacy Stack class for LIFO use." },
    { label: "as queue", code: "offer(x); poll();", note: "FIFO with O(1) ends — the go-to Deque implementation." },
    { label: "PriorityQueue", code: "offer(x); poll();  // smallest first", note: "A binary heap; poll() returns the minimum (or Comparator order)." },
  ]),
  "comparator": picker([
    { label: "Comparable", code: "class P implements Comparable<P> {\n  int compareTo(P o){ ... }\n}", note: "Defines the type's single natural ordering." },
    { label: "comparing", code: "Comparator.comparing(P::age)", note: "Build a Comparator from a key extractor." },
    { label: "thenComparing", code: "comparing(P::last)\n  .thenComparing(P::first)", note: "Chain tie-breakers; add .reversed() to flip the order." },
    { label: "nullsFirst", code: "Comparator.nullsFirst(naturalOrder())", note: "Decide explicitly where nulls sort." },
  ]),
  "collections-util": picker([
    { label: "sort / shuffle", code: "Collections.sort(list);", note: "Utility algorithms over Lists." },
    { label: "unmodifiable", code: "Collections.unmodifiableList(list)", note: "A read-only view that throws on any mutation." },
    { label: "immutable factories", code: 'List.of(1, 2, 3);\nMap.of("a", 1);', note: "Truly immutable collections (9); List.copyOf takes a snapshot." },
  ]),
  "lambda": picker([
    { label: "expression", code: "(a, b) -> a + b", note: "A concise anonymous implementation of a functional interface." },
    { label: "block body", code: "x -> { log(x); return x * 2; }", note: "Use braces and return for a multi-statement body." },
    { label: "capture", code: "int base = 10;\nn -> n + base;   // base effectively final", note: "Lambdas capture effectively-final locals; this refers to the enclosing instance." },
  ]),
  "method-ref": picker([
    { label: "static", code: "Integer::parseInt", note: "A static method reference — same as s -> Integer.parseInt(s)." },
    { label: "bound instance", code: "System.out::println", note: "Bound to a specific receiver object." },
    { label: "unbound instance", code: "String::toUpperCase", note: "The first argument becomes the receiver: s -> s.toUpperCase()." },
    { label: "constructor", code: "ArrayList::new", note: "A constructor reference — () -> new ArrayList()." },
  ]),
  "functional-toolkit": picker([
    { label: "Function<T,R>", code: "Function<String,Integer> len = String::length;", note: "Takes a T, returns an R; compose with andThen / compose." },
    { label: "Predicate<T>", code: "Predicate<Integer> even = n -> n%2 == 0;", note: "Takes a T, returns boolean; combine with and / or / negate." },
    { label: "Supplier<T>", code: "Supplier<Long> now = System::currentTimeMillis;", note: "Takes nothing, produces a T (a lazy value)." },
    { label: "Consumer<T>", code: "Consumer<String> p = System.out::println;", note: "Takes a T, returns nothing (a side effect)." },
  ]),
  "optional": picker([
    { label: "create", code: "Optional.of(x);\nOptional.empty();\nOptional.ofNullable(maybe);", note: "A container that may or may not hold a value." },
    { label: "transform", code: "opt.map(String::length)\n   .filter(n -> n > 0)", note: "map / flatMap / filter run only when a value is present." },
    { label: "unwrap", code: "opt.orElseGet(() -> fallback)", note: "orElse / orElseGet / orElseThrow supply a default or throw." },
    { label: "consume", code: "opt.ifPresentOrElse(this::use, this::warn)", note: "React to present/absent without manual null checks (9)." },
  ]),
  "stream-create": picker([
    { label: "from collection", code: "list.stream()", note: "The most common stream source." },
    { label: "Stream.of", code: 'Stream.of("a", "b", "c")', note: "A stream from explicit elements." },
    { label: "IntStream.range", code: "IntStream.range(0, 5)  // 0..4", note: "A primitive stream over a numeric range (no boxing)." },
    { label: "iterate / generate", code: "Stream.iterate(1, n -> n*2).limit(10)", note: "Infinite streams — must be bounded with limit()." },
  ]),
  "stream-intermediate": stepper("A lazy stream pipeline", [
    { title: "source", sub: "[1,2,3,4,5]", desc: "Nothing runs yet — intermediate ops only build up the pipeline." },
    { title: "filter n%2==0", sub: "[2,4]", desc: "filter keeps even numbers; still lazy until a terminal op arrives." },
    { title: "map n*10", sub: "[20,40]", desc: "map transforms each surviving element." },
    { title: "collect", sub: "List [20,40]", desc: "The terminal op triggers execution; elements flow through one at a time." },
  ]),
  "stream-terminal": picker([
    { label: "collect", code: ".collect(Collectors.toList())", note: "Accumulate into a collection or other structure." },
    { label: "reduce", code: ".reduce(0, Integer::sum)", note: "Fold all elements into a single value." },
    { label: "count / match", code: ".count();\n.anyMatch(p);\n.allMatch(p);", note: "Aggregate, or short-circuit on a predicate." },
    { label: "find", code: ".findFirst().orElse(...)", note: "Return an Optional of the first (or any) element." },
  ]),
  "collectors": picker([
    { label: "toList / toMap", code: ".collect(toMap(K::of, v -> v))", note: "Gather into a List, Set, or Map." },
    { label: "groupingBy", code: ".collect(groupingBy(P::dept))", note: "Build a Map<key, List<T>> — GROUP BY for streams." },
    { label: "partitioningBy", code: ".collect(partitioningBy(n -> n > 0))", note: "Split elements into true / false buckets." },
    { label: "joining", code: '.collect(joining(", ", "[", "]"))', note: "Concatenate strings with a delimiter, prefix, and suffix." },
  ]),
  "parallel-streams": picker([
    { label: "IntStream", code: "IntStream.rangeClosed(1, 100).sum()", note: "Primitive streams avoid boxing overhead entirely." },
    { label: "summaryStatistics", code: "ints.summaryStatistics()", note: "One pass yields count, sum, min, max, and average." },
    { label: "parallelStream", code: "list.parallelStream().reduce(...)", note: "Splits work across the common ForkJoinPool — best for large, stateless, associative operations." },
  ]),
  "localdate": picker([
    { label: "create", code: "LocalDate.of(2026, 7, 3)\nLocalDate.now()", note: "An immutable date with no time-of-day or zone." },
    { label: "arithmetic", code: "d.plusDays(10).minusMonths(1)", note: "Chainable; every call returns a new object (thread-safe)." },
    { label: "LocalDateTime", code: "LocalDateTime.of(date, time)", note: "Date plus time-of-day, still without a zone." },
  ]),
  "zoneddatetime": picker([
    { label: "Instant", code: "Instant.now()   // UTC timestamp", note: "A machine timestamp — nanoseconds since the epoch, in UTC." },
    { label: "apply zone", code: 'instant.atZone(ZoneId.of("Asia/Kolkata"))', note: "ZonedDateTime applies a region's rules, including its offset." },
    { label: "DST", code: "// spring-forward skips an hour", note: "ZonedDateTime handles daylight-saving transitions correctly." },
  ]),
  "duration-period": picker([
    { label: "Duration", code: "Duration.ofHours(2).plusMinutes(30)", note: "A time-based amount, measured in seconds and nanos." },
    { label: "Period", code: "Period.of(1, 2, 10)   // 1y 2m 10d", note: "A date-based amount, measured in years, months, and days." },
    { label: "between", code: "ChronoUnit.DAYS.between(a, b)", note: "Measure the gap between two temporals in a chosen unit." },
  ]),
  "datetime-format": picker([
    { label: "format", code: "d.format(DateTimeFormatter.ISO_DATE)", note: "Render a temporal as text." },
    { label: "parse", code: 'LocalDate.parse("2026-07-03")', note: "Read text back into a temporal; custom patterns via ofPattern." },
    { label: "legacy interop", code: "date.toInstant();\nDate.from(instant);", note: "Bridge to and from legacy Date / Calendar when required." },
  ]),
  "byte-streams": picker([
    { label: "raw", code: 'var in = new FileInputStream("f");', note: "InputStream / OutputStream move raw bytes." },
    { label: "buffered (decorator)", code: "new BufferedInputStream(in)", note: "Wrap a stream to add buffering — the decorator pattern in action." },
    { label: "data", code: "new DataOutputStream(out).writeInt(42)", note: "Layer typed reads/writes on top of a byte stream." },
  ]),
  "char-streams": picker([
    { label: "Reader / Writer", code: 'new FileWriter("f", UTF_8)', note: "Handle text with charset decoding / encoding." },
    { label: "BufferedReader", code: "br.lines().forEach(...)", note: "Read lines efficiently; lines() returns a Stream." },
    { label: "bridge", code: "new InputStreamReader(in, UTF_8)", note: "Adapt a byte stream into a character stream with an explicit charset." },
  ]),
  "console-io": picker([
    { label: "output", code: 'System.out.println("hi")', note: "Standard out; System.err for error output." },
    { label: "Scanner", code: "new Scanner(System.in).nextLine()", note: "Simple parsing of console input." },
    { label: "printf", code: 'System.out.printf("%d%n", n)', note: "Formatted output, like C's printf." },
  ]),
  "nio-files": picker([
    { label: "Path", code: 'Path p = Path.of("dir", "file.txt")', note: "Models a filesystem location (NIO.2, since 7)." },
    { label: "read / write", code: "Files.readString(p);\nFiles.writeString(p, s);", note: "One-call whole-file I/O (11)." },
    { label: "walk", code: "try (var s = Files.walk(dir)) { ... }", note: "Stream a directory tree; WatchService reports change events." },
  ]),
  "nio-channels": picker([
    { label: "ByteBuffer", code: "buf.flip();\nchannel.write(buf);", note: "A fixed-size buffer with position/limit; flip() switches read↔write." },
    { label: "FileChannel", code: "channel.map(READ_ONLY, 0, size)", note: "Memory-mapped and bulk I/O for high throughput." },
    { label: "non-blocking", code: "Selector + SocketChannel", note: "One thread can multiplex many connections." },
  ]),
  "serialization": stepper("Object serialization round-trip", [
    { title: "object", sub: "in-memory graph", desc: "An object (and everything it references) implementing Serializable." },
    { title: "writeObject", sub: "→ bytes", desc: "ObjectOutputStream flattens the object graph into a byte stream." },
    { title: "transport", sub: "file / network", desc: "Bytes are stored or sent; transient fields and statics are skipped." },
    { title: "readObject", sub: "→ object", desc: "ObjectInputStream rebuilds the graph. serialVersionUID must match; deserializing untrusted data is a security risk." },
  ]),
});
Object.assign(BY_NAME, {
  "Generic classes & methods": "generics-basic",
  "Bounded type parameters": "bounded-generics",
  "Wildcards & PECS": "wildcards-pecs",
  "Type erasure & limits": "type-erasure",
  "Throwable hierarchy": "throwable",
  "Checked vs unchecked": "checked-unchecked",
  "try / catch / finally": "try-catch",
  "try-with-resources": "twr",
  "Custom exceptions & chaining": "custom-exception",
  "Collection, Iterable & Iterator": "iterator",
  "List implementations": "list-impls",
  "Set implementations": "set-impls",
  "Map implementations": "map-impls",
  "Queue & Deque": "queue-deque",
  "Comparable & Comparator": "comparator",
  "Collections & immutability": "collections-util",
  "hashCode/equals & load factor": "hashmap-internals",
  "Lambda expressions": "lambda",
  "Method & constructor references": "method-ref",
  "Standard functional interfaces": "functional-toolkit",
  "Optional": "optional",
  "Stream creation": "stream-create",
  "Intermediate operations": "stream-intermediate",
  "Terminal operations": "stream-terminal",
  "Collectors": "collectors",
  "Primitive & parallel streams": "parallel-streams",
  "LocalDate / LocalTime / LocalDateTime": "localdate",
  "Instant, ZonedDateTime & zones": "zoneddatetime",
  "Duration & Period": "duration-period",
  "Formatting & legacy interop": "datetime-format",
  "Byte streams": "byte-streams",
  "Character streams": "char-streams",
  "Console & standard streams": "console-io",
  "Path & Files (NIO.2)": "nio-files",
  "Buffers & channels": "nio-channels",
  "Object serialization": "serialization",
});

/* ---------- Batch: categories 20–30 ---------- */
Object.assign(REGISTRY, {
  "thread-runnable": picker([
    { label: "Runnable", code: "Runnable r = () -> work();\nnew Thread(r).start();", note: "Prefer passing a task to a Thread over subclassing Thread." },
    { label: "start vs run", code: "t.start();  // runs on a NEW thread\nt.run();    // runs on THIS thread!", note: "start() spawns a thread; run() just calls the method inline." },
    { label: "Callable", code: "Callable<Integer> c = () -> 42;", note: "Like Runnable but returns a value and may throw — used with executors." },
  ]),
  "thread-lifecycle": stepper("Thread lifecycle", [
    { title: "NEW", sub: "created", desc: "A Thread object exists but start() has not been called yet." },
    { title: "RUNNABLE", sub: "eligible", desc: "After start(), the scheduler may run it on a CPU." },
    { title: "BLOCKED / WAITING", sub: "paused", desc: "Waiting for a lock, notify, sleep, or join to complete." },
    { title: "TERMINATED", sub: "done", desc: "run() returned or threw — the thread is finished and can't restart." },
  ]),
  "virtual-threads": picker([
    { label: "platform thread", code: "new Thread(task).start();", note: "A 1:1 wrapper over an OS thread — expensive, practically limited to thousands." },
    { label: "virtual thread", code: "Thread.ofVirtual().start(task);", note: "JVM-scheduled and cheap — millions can run (21, Project Loom)." },
    { label: "cheap blocking", code: "Executors.newVirtualThreadPerTaskExecutor()", note: "Blocking I/O parks the virtual thread and frees its carrier — no pool tuning." },
  ]),
  "synchronized": picker([
    { label: "race", code: "count++;  // not atomic across threads", note: "Without coordination, interleaved reads/writes corrupt shared state." },
    { label: "synchronized", code: "synchronized void inc(){ count++; }", note: "An intrinsic lock (monitor) provides mutual exclusion." },
    { label: "reentrant", code: "synchronized a(){ b(); }\nsynchronized b(){ }", note: "A thread already holding the lock can re-acquire it without deadlocking." },
  ]),
  "wait-notify": stepper("wait / notify coordination", [
    { title: "acquire", sub: "synchronized", desc: "A thread enters a synchronized block, holding the object's monitor." },
    { title: "wait()", sub: "release + park", desc: "wait() releases the lock and suspends the thread — always call it inside a while loop." },
    { title: "notify", sub: "another thread", desc: "Another thread changes the condition and calls notify() / notifyAll()." },
    { title: "reacquire", sub: "recheck", desc: "The waiter wakes, re-acquires the lock, and rechecks (guarding against spurious wakeups)." },
  ]),
  "volatile-jmm": picker([
    { label: "visibility bug", code: "boolean run = true;\n// another thread may never see false", note: "Without volatile, a thread can cache the field and loop forever." },
    { label: "volatile", code: "volatile boolean run = true;", note: "Guarantees writes are visible to all threads and prevents reordering." },
    { label: "happens-before", code: "// unlock→lock, volatile write→read", note: "The Java Memory Model defines edges that make one thread's writes visible to another." },
  ]),
  "executor": picker([
    { label: "create pool", code: "var ex = Executors.newFixedThreadPool(4);", note: "Reuse a bounded set of threads instead of creating one per task." },
    { label: "submit", code: "Future<Integer> f = ex.submit(task);", note: "submit returns a Future; invokeAll runs a whole batch." },
    { label: "shutdown", code: "ex.shutdown();\nex.awaitTermination(...);", note: "Always shut pools down; ThreadPoolExecutor tunes core/max/queue." },
  ]),
  "completablefuture": stepper("CompletableFuture pipeline", [
    { title: "supplyAsync", sub: "start async", desc: "Runs a supplier on a pool thread and returns a future immediately." },
    { title: "thenApply", sub: "transform", desc: "Maps the result to a new value when it arrives, without blocking." },
    { title: "thenAccept", sub: "consume", desc: "Uses the final value; exceptionally() handles any failure." },
    { title: "join", sub: "await", desc: "join()/get() blocks for the value; combine many futures with allOf / anyOf." },
  ]),
  "forkjoin": stepper("Fork/join divide-and-conquer", [
    { title: "task", sub: "big problem", desc: "A RecursiveTask represents work that can be split into subproblems." },
    { title: "fork", sub: "split", desc: "Split into halves and fork() them onto the pool." },
    { title: "steal", sub: "idle threads help", desc: "Idle workers steal queued subtasks — work stealing keeps every CPU busy." },
    { title: "join", sub: "combine", desc: "join() each half and merge the results; parallel streams run on this pool." },
  ]),
  "structured-concurrency": picker([
    { label: "scope", code: "try (var s = new StructuredTaskScope\n     .ShutdownOnFailure()) { ... }", note: "Treats related subtasks as one unit with a bounded lifetime (21, preview)." },
    { label: "fork", code: "var a = s.fork(taskA);\nvar b = s.fork(taskB);\ns.join();", note: "Fork subtasks, then join() waits for all of them." },
    { label: "cancellation", code: "// one failure cancels the siblings", note: "Errors and cancellation propagate together — no leaked threads." },
  ]),
  "locks": picker([
    { label: "ReentrantLock", code: "lock.lock();\ntry { ... } finally { lock.unlock(); }", note: "Explicit lock with tryLock, fairness, and interruptibility." },
    { label: "ReadWriteLock", code: "rw.readLock();\nrw.writeLock();", note: "Allows many concurrent readers or a single writer." },
    { label: "synchronizers", code: "Semaphore, CountDownLatch,\nCyclicBarrier", note: "Coordinate permits, one-shot gates, and repeated rendezvous points." },
  ]),
  "atomics": picker([
    { label: "AtomicInteger", code: "counter.incrementAndGet()", note: "Lock-free atomic updates via a CPU compare-and-swap (CAS)." },
    { label: "compareAndSet", code: "ref.compareAndSet(expect, update)", note: "The CAS primitive — succeeds only if the value is still the expected one." },
    { label: "LongAdder", code: "adder.add(1);\nadder.sum();", note: "Scales far better than AtomicLong under high contention (8)." },
  ]),
  "concurrent-collections": picker([
    { label: "ConcurrentHashMap", code: "map.computeIfAbsent(k, ...)", note: "Thread-safe map with fine-grained locking — no single global lock." },
    { label: "CopyOnWriteArrayList", code: "// copies the array on each write", note: "Ideal for read-heavy, rarely-written lists such as listeners." },
    { label: "BlockingQueue", code: "queue.put(x);\nqueue.take();", note: "Producer/consumer handoff that blocks when full or empty." },
  ]),
  "class-loading": stepper("Class loading & linking", [
    { title: "Loading", sub: "read .class", desc: "A ClassLoader finds the bytecode and creates a Class object (parent-delegation first)." },
    { title: "Verify", sub: "safety", desc: "The verifier ensures the bytecode is well-formed and type-safe." },
    { title: "Prepare", sub: "static defaults", desc: "Static fields are allocated and set to their default values." },
    { title: "Resolve", sub: "symbolic refs", desc: "Symbolic references to other classes are resolved to direct references." },
    { title: "Initialize", sub: "static init", desc: "Static initializers and static field assignments run, exactly once." },
  ]),
  "runtime-areas": picker([
    { label: "heap", code: "// all objects & arrays", note: "Shared across threads; where new allocates and the GC operates." },
    { label: "stacks", code: "// one per thread", note: "Each thread owns a stack of frames holding locals and partial results." },
    { label: "metaspace", code: "// class metadata (native mem)", note: "Class structures live in native memory (replaced PermGen in 8)." },
    { label: "PC + native", code: "// program counter, native stack", note: "A per-thread PC register and native method stack complete the picture." },
  ]),
  "jit": stepper("Interpreter → JIT compilation", [
    { title: "interpret", sub: "bytecode", desc: "Execution starts by interpreting bytecode — quick to start, slower to run." },
    { title: "profile", sub: "find hot code", desc: "HotSpot counts invocations and loops to identify hot methods." },
    { title: "C1", sub: "quick compile", desc: "The client compiler produces optimized native code fast (tiered compilation)." },
    { title: "C2", sub: "aggressive", desc: "The server compiler inlines and deeply optimizes the hottest paths." },
    { title: "deopt", sub: "if invalidated", desc: "If a speculative optimization no longer holds, code deoptimizes back to the interpreter." },
  ]),
  "heap-generations": picker([
    { label: "eden", code: "// new objects allocated here", note: "Most allocations land in eden; most objects die young." },
    { label: "survivor", code: "// S0 / S1, copied on minor GC", note: "Minor-GC survivors are copied between two survivor spaces, aging each cycle." },
    { label: "old gen", code: "// long-lived objects promoted", note: "Objects that survive enough collections are promoted to the old generation." },
    { label: "TLAB", code: "// thread-local allocation buffer", note: "Each thread bump-allocates in its own buffer for fast, lock-free allocation." },
  ]),
  "reference-types": picker([
    { label: "strong", code: "Object o = new Object();", note: "A normal reference — never collected while it's reachable." },
    { label: "soft", code: "new SoftReference<>(o)", note: "Cleared only under memory pressure — good for memory-sensitive caches." },
    { label: "weak", code: "new WeakReference<>(o)", note: "Cleared at the next GC once no strong refs remain (e.g. WeakHashMap keys)." },
    { label: "phantom", code: "new PhantomReference<>(o, queue)", note: "For post-mortem cleanup via a ReferenceQueue; the modern replacement for finalize." },
  ]),
  "gc-algorithms": picker([
    { label: "G1 (default)", code: "-XX:+UseG1GC", note: "Region-based; balances throughput and pause time — the default since 9." },
    { label: "Parallel", code: "-XX:+UseParallelGC", note: "Maximizes throughput with stop-the-world collection — good for batch jobs." },
    { label: "ZGC", code: "-XX:+UseZGC", note: "A concurrent collector with sub-millisecond pauses, even on huge heaps." },
    { label: "Shenandoah", code: "-XX:+UseShenandoahGC", note: "Another low-pause, mostly-concurrent collector." },
  ]),
  "gc-tuning": picker([
    { label: "heap size", code: "-Xms512m -Xmx4g", note: "Set initial and maximum heap; equal values avoid resize pauses." },
    { label: "OOM", code: "OutOfMemoryError: Java heap space", note: "Thrown when the heap can't satisfy an allocation — often an unintended-retention leak." },
    { label: "diagnose", code: "-XX:+HeapDumpOnOutOfMemoryError\n-Xlog:gc", note: "Capture heap dumps and GC logs, then analyze retention and pauses." },
  ]),
  "reflection": picker([
    { label: "get Class", code: 'Class<?> c = obj.getClass();\nClass.forName("com.X");', note: "The entry point — runtime type metadata." },
    { label: "inspect", code: "c.getDeclaredMethods();\nc.getDeclaredFields();", note: "Enumerate members, including private ones." },
    { label: "access", code: "m.setAccessible(true);\nm.invoke(obj, args);", note: "Bypass access checks and invoke dynamically — this powers DI and serialization." },
    { label: "cost", code: "// slower than direct calls", note: "Reflection has overhead and sidesteps compiler checks — use it sparingly." },
  ]),
  "methodhandles": picker([
    { label: "MethodHandle", code: 'var mh = lookup().findVirtual(\n  String.class, "length", type(int.class));', note: "A fast, type-safe alternative to reflective invocation." },
    { label: "VarHandle", code: "vh.compareAndSet(obj, exp, upd)", note: "Low-level atomic field/array access (replaces Unsafe and AtomicFieldUpdater)." },
    { label: "invokedynamic", code: "// backs lambdas & string concat", note: "The bytecode instruction that MethodHandles power under the hood." },
  ]),
  "annotations": picker([
    { label: "define", code: "@interface Loggable { String value(); }", note: "Declare metadata that attaches to code elements." },
    { label: "meta", code: "@Retention(RUNTIME)\n@Target(METHOD)", note: "Control where an annotation applies and how long it's retained." },
    { label: "read", code: "m.getAnnotation(Loggable.class)", note: "RUNTIME-retained annotations are readable via reflection." },
  ]),
  "proxies": picker([
    { label: "APT", code: "javax.annotation.processing.Processor", note: "Compile-time processors generate source code (e.g. Lombok, Dagger)." },
    { label: "dynamic proxy", code: "Proxy.newProxyInstance(cl, ifaces, h)", note: "Synthesize an interface implementation at runtime." },
    { label: "InvocationHandler", code: "invoke(proxy, method, args)", note: "Every proxy call funnels here — the basis of AOP and mocking frameworks." },
  ]),
  "module-info": picker([
    { label: "declare", code: "module com.app {\n  requires java.sql;\n  exports com.app.api;\n}", note: "Names a module with its dependencies and the packages it exports." },
    { label: "requires transitive", code: "requires transitive java.logging;", note: "Re-exports a dependency to anyone that requires this module." },
    { label: "opens", code: "opens com.app.model;", note: "Grants deep reflective access (for frameworks) without exporting the package." },
  ]),
  "module-services": picker([
    { label: "provides / uses", code: "provides Codec with JpegCodec;\nuses Codec;", note: "Declare service implementations and consumers in module-info." },
    { label: "ServiceLoader", code: "ServiceLoader.load(Codec.class)", note: "Discover implementations at runtime, fully decoupled from callers." },
    { label: "encapsulation", code: "// non-exported packages stay hidden", note: "Strong encapsulation hides internals even from reflection, unless opened." },
  ]),
  "sockets": picker([
    { label: "TCP client", code: "var s = new Socket(host, port);\ns.getOutputStream()...", note: "A reliable, ordered byte stream over TCP." },
    { label: "TCP server", code: "var ss = new ServerSocket(port);\nSocket c = ss.accept();", note: "accept() blocks until a client connects." },
    { label: "UDP", code: "new DatagramSocket();  // packets", note: "Connectionless datagrams — fast, but unreliable and unordered." },
  ]),
  "httpclient": picker([
    { label: "sync", code: "client.send(req, ofString())", note: "The modern java.net.http client (11); supports HTTP/2 and WebSocket." },
    { label: "async", code: "client.sendAsync(req, ofString())\n  .thenApply(HttpResponse::body)", note: "Returns a CompletableFuture for non-blocking requests." },
    { label: "legacy", code: "new URL(u).openConnection()", note: "URL / URLConnection is the older, clunkier API." },
  ]),
  "system-runtime": picker([
    { label: "properties", code: 'System.getProperty("java.version")', note: "Read JVM/OS properties; System.getenv for environment variables." },
    { label: "time", code: "System.nanoTime()           // elapsed\nSystem.currentTimeMillis()  // wall clock", note: "nanoTime for measuring durations; currentTimeMillis for timestamps." },
    { label: "runtime", code: "Runtime.getRuntime()\n  .availableProcessors()", note: "Query CPUs and memory — size thread pools from this." },
  ]),
  "shutdown-hooks": stepper("JVM shutdown sequence", [
    { title: "running", sub: "app works", desc: "Your application runs normally." },
    { title: "exit", sub: "System.exit(code)", desc: "System.exit (or the last thread ending) begins shutdown; the code signals success (0) or failure." },
    { title: "hooks", sub: "cleanup threads", desc: "Registered shutdown hooks run concurrently — flush logs, release resources." },
    { title: "halt", sub: "JVM stops", desc: "Once hooks finish, the JVM terminates. Runtime.halt() skips hooks entirely." },
  ]),
  "processbuilder": picker([
    { label: "build", code: 'var pb = new ProcessBuilder("git", "status");', note: "Configure the command, arguments, environment, and working directory." },
    { label: "start", code: "Process p = pb.start();", note: "Launches the external process and lets you wire up its I/O streams." },
    { label: "redirect + wait", code: "pb.inheritIO();\nint code = p.waitFor();", note: "Redirect I/O and block for the exit value." },
  ]),
  "processhandle": picker([
    { label: "current", code: "ProcessHandle.current().pid()", note: "Inspect processes by PID without holding a Process object (9)." },
    { label: "onExit", code: "handle.onExit().thenRun(...)", note: "A CompletableFuture that completes when the process terminates." },
    { label: "descendants", code: "handle.descendants().forEach(...)", note: "Walk and manage child/descendant processes; destroy() to terminate." },
  ]),
  "modern-conciseness": picker([
    { label: "var", code: "var list = new ArrayList<String>();", note: "Local type inference removes redundant boilerplate (10)." },
    { label: "record", code: "record Point(int x, int y) { }", note: "An immutable data carrier with generated members (16)." },
    { label: "text block", code: 'String s = """\n  multi-line\n  """;', note: "Readable multi-line string literals (15)." },
  ]),
  "modern-patterns": picker([
    { label: "instanceof", code: "if (o instanceof String s) use(s);", note: "Test and bind in a single step (16)." },
    { label: "switch patterns", code: "case Circle c -> area(c);", note: "Type patterns drive concise dispatch in switch (21)." },
    { label: "record patterns", code: "case Point(int x, int y) -> x + y;", note: "Deconstruct records directly (21) — data-oriented programming." },
  ]),
  "modern-sealed-loom": picker([
    { label: "sealed", code: "sealed interface Shape permits A, B { }", note: "A closed hierarchy makes switch exhaustive without a default (17)." },
    { label: "virtual threads", code: "Thread.ofVirtual().start(task);", note: "Blocking code scales to millions of lightweight threads (21)." },
  ]),
  "immutability": picker([
    { label: "immutable class", code: "final class Money {\n  private final long cents;\n}", note: "final class + final fields + no setters = thread-safe by construction." },
    { label: "defensive copy", code: "this.list = List.copyOf(input);", note: "Copy mutable inputs (and outputs) to protect your invariants." },
    { label: "builder", code: "new Pizza.Builder().add(...).build()", note: "Assemble complex immutable objects step by step." },
  ]),
  "composition": picker([
    { label: "fragile inheritance", code: "class Stack extends ArrayList { }\n// leaks the parent's API", note: "Subclassing exposes and couples you to the parent's implementation." },
    { label: "composition", code: "class Stack {\n  private List<E> data;\n}", note: "Hold a collaborator and delegate — flexible and encapsulated." },
    { label: "to interface", code: "List<X> xs = new ArrayList<>();", note: "Program to interfaces so implementations can change freely." },
  ]),
  "null-safety": picker([
    { label: "try-with-resources", code: "try (var r = open()) { ... }", note: "Guarantees cleanup with no leaks." },
    { label: "Optional", code: "return Optional.ofNullable(x);", note: "Make absence explicit in return types instead of returning null." },
    { label: "validate", code: 'Objects.requireNonNull(arg, "arg")', note: "Fail fast at boundaries with a clear message." },
  ]),
  "gof-creational": picker([
    { label: "Singleton", code: "enum Config { INSTANCE; }", note: "An enum is the simplest thread-safe singleton." },
    { label: "Factory", code: "static Shape of(String kind){ ... }", note: "Centralize object creation behind a method." },
    { label: "Builder", code: "obj.toBuilder()...build()", note: "Readable construction for objects with many options." },
    { label: "Decorator", code: "new Buffered(new FileReader(...))", note: "Wrap to add behavior — exactly how java.io is designed." },
  ]),
  "gof-behavioral": picker([
    { label: "Strategy", code: "list.sort(Comparator.comparing(...))", note: "Pass behavior as a lambda instead of subclassing." },
    { label: "Observer", code: "button.addActionListener(e -> ...)", note: "Notify subscribers when events occur." },
    { label: "Template method", code: "abstract step();\nfinal run(){ ...; step(); }", note: "Fix an algorithm's skeleton, defer specific steps to subclasses." },
    { label: "Iterator", code: "for (T t : coll) { ... }", note: "Traverse a structure without exposing its internals." },
  ]),
  "junit": picker([
    { label: "test", code: "@Test void adds(){\n  assertEquals(4, add(2, 2));\n}", note: "JUnit 5 marks tests with @Test and checks results with assertions." },
    { label: "lifecycle", code: "@BeforeEach void setup(){ ... }", note: "Setup/teardown hooks run around tests; @ParameterizedTest is data-driven." },
    { label: "Mockito", code: "when(dao.find(1)).thenReturn(x);\nverify(dao).save(x);", note: "Stub collaborators and verify the interactions with them." },
  ]),
  "logging": picker([
    { label: "assert", code: 'assert x > 0 : "must be positive";', note: "Guards an invariant; enabled with the -ea flag (off by default)." },
    { label: "SLF4J", code: 'log.info("user {} in", id);', note: "A logging facade — bind Logback or another backend behind it." },
    { label: "levels", code: "ERROR > WARN > INFO > DEBUG > TRACE", note: "Filter verbosity by level, configurable per package." },
  ]),
  "jfr": picker([
    { label: "debugger", code: "// breakpoints over JDWP", note: "Step through code with an IDE debugger using the JDWP protocol." },
    { label: "Flight Recorder", code: "java -XX:StartFlightRecording ...", note: "Low-overhead event recording built directly into the JVM." },
    { label: "Mission Control", code: "// open the .jfr recording", note: "Visualize JFR data to find CPU, allocation, and latency hotspots." },
  ]),
  "profiling": picker([
    { label: "jstack", code: "jstack <pid>", note: "Dump thread stacks to find deadlocks and busy threads." },
    { label: "jmap", code: "jmap -histo <pid>", note: "Heap histogram or full dump for memory analysis." },
    { label: "jstat / jcmd", code: "jstat -gc <pid>\njcmd <pid> ...", note: "Live GC statistics and a Swiss-army command interface for the JVM." },
  ]),
});
Object.assign(BY_NAME, {
  "Thread & Runnable": "thread-runnable",
  "Lifecycle & control": "thread-lifecycle",
  "Virtual threads": "virtual-threads",
  "synchronized & monitors": "synchronized",
  "wait / notify": "wait-notify",
  "volatile & the JMM": "volatile-jmm",
  "ExecutorService & thread pools": "executor",
  "Future & CompletableFuture": "completablefuture",
  "ForkJoinPool": "forkjoin",
  "Structured concurrency": "structured-concurrency",
  "Locks & synchronizers": "locks",
  "Atomic variables": "atomics",
  "Concurrent collections": "concurrent-collections",
  "Class loading subsystem": "class-loading",
  "Runtime data areas": "runtime-areas",
  "Interpreter & JIT compilation": "jit",
  "Heap structure & generations": "heap-generations",
  "Reference types": "reference-types",
  "GC algorithms": "gc-algorithms",
  "Leaks & tuning": "gc-tuning",
  "Reflection API": "reflection",
  "MethodHandles & VarHandles": "methodhandles",
  "Annotations": "annotations",
  "Annotation processing & proxies": "proxies",
  "module-info & dependencies": "module-info",
  "Services & runtime": "module-services",
  "Sockets": "sockets",
  "URL & HttpClient": "httpclient",
  "System & Runtime": "system-runtime",
  "Exit codes & shutdown hooks": "shutdown-hooks",
  "ProcessBuilder & Process": "processbuilder",
  "ProcessHandle": "processhandle",
  "var, records & text blocks": "modern-conciseness",
  "instanceof, switch & record patterns": "modern-patterns",
  "Sealed types & virtual threads": "modern-sealed-loom",
  "Immutability & defensive copying": "immutability",
  "Favor composition & interfaces": "composition",
  "Resource & null safety": "null-safety",
  "Creational & structural patterns": "gof-creational",
  "Behavioral patterns & functional style": "gof-behavioral",
  "JUnit & Mockito": "junit",
  "Assertions & logging": "logging",
  "Debugging & JFR": "jfr",
  "Profiling & monitoring tools": "profiling",
});

/* ================================================================== *
 * Polish: fully live-computed versions of selected widgets
 * ================================================================== */
const MONO = {
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
} as const;
const numOf = (s: string) => {
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
};
const intOf = (s: string) => {
  const n = parseInt(s, 10);
  return Number.isFinite(n) ? n : 0;
};

function LiveMath() {
  const FNS = [
    { n: "abs", ar: 1, f: (a: number, _b: number) => Math.abs(a) },
    { n: "sqrt", ar: 1, f: (a: number, _b: number) => Math.sqrt(a) },
    { n: "round", ar: 1, f: (a: number, _b: number) => Math.round(a) },
    { n: "pow", ar: 2, f: (a: number, b: number) => Math.pow(a, b) },
    { n: "max", ar: 2, f: (a: number, b: number) => Math.max(a, b) },
    { n: "min", ar: 2, f: (a: number, b: number) => Math.min(a, b) },
  ];
  const [i, setI] = useState(3);
  const [a, setA] = useState(2);
  const [b, setB] = useState(10);
  const fn = FNS[i];
  const res = fn.f(a, b);
  const call = fn.ar === 1 ? `Math.${fn.n}(${a})` : `Math.${fn.n}(${a}, ${b})`;
  return (
    <div>
      <Controls>
        {FNS.map((x, idx) => (
          <Btn key={x.n} active={i === idx} onClick={() => setI(idx)}>
            {x.n}
          </Btn>
        ))}
      </Controls>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 10, flexWrap: "wrap" }}>
        <TextField value={String(a)} onChange={(s) => setA(numOf(s))} />
        {fn.ar === 2 ? <TextField value={String(b)} onChange={(s) => setB(numOf(s))} /> : null}
      </div>
      <Note>
        <span style={MONO}>
          {call} → <b style={{ color: theme.accent.primary }}>{String(res)}</b>
        </span>{" "}
        — change the operands and the result recomputes live.
      </Note>
    </div>
  );
}

function LiveFloorMath() {
  const [a, setA] = useState(-7);
  const [b, setB] = useState(2);
  const bad = b === 0;
  const sum = a + b;
  const overflow = sum > 2147483647 || sum < -2147483648;
  const presets: [number, number][] = [[-7, 2], [7, 3], [-7, 3], [10, 0]];
  return (
    <div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <TextField value={String(a)} onChange={(s) => setA(intOf(s))} />
        <span style={{ color: theme.text.secondary }}>op</span>
        <TextField value={String(b)} onChange={(s) => setB(intOf(s))} />
      </div>
      <Controls>
        {presets.map(([x, y]) => (
          <Btn key={`${x},${y}`} active={a === x && b === y} onClick={() => { setA(x); setB(y); }}>
            {x}, {y}
          </Btn>
        ))}
      </Controls>
      <Note>
        <div style={MONO}>a / b = {bad ? "ArithmeticException" : Math.trunc(a / b)} <span style={{ color: theme.text.tertiary }}>(toward zero)</span></div>
        <div style={MONO}>Math.floorDiv = {bad ? "—" : Math.floor(a / b)} <span style={{ color: theme.text.tertiary }}>(toward -∞)</span></div>
        <div style={MONO}>a % b = {bad ? "—" : a % b} · Math.floorMod = <b style={{ color: theme.accent.primary }}>{bad ? "—" : ((a % b) + b) % b}</b> <span style={{ color: theme.text.tertiary }}>(sign of divisor)</span></div>
        <div style={{ color: overflow ? theme.warning : theme.text.tertiary }}>Math.addExact(a, b): {overflow ? "throws — int overflow" : `${sum} (ok)`}</div>
      </Note>
    </div>
  );
}

function LiveFloat() {
  const [a, setA] = useState(0.1);
  const [b, setB] = useState(0.2);
  const sum = a + b;
  const clean = Math.round(sum * 1e10) / 1e10;
  const hasError = sum !== clean;
  const presets: [number, number][] = [[0.1, 0.2], [0.1, 0.1], [0.3, 0.6], [1, 2]];
  return (
    <div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <TextField value={String(a)} onChange={(s) => setA(numOf(s))} />
        <span style={{ color: theme.text.secondary }}>+</span>
        <TextField value={String(b)} onChange={(s) => setB(numOf(s))} />
      </div>
      <Controls>
        {presets.map(([x, y]) => (
          <Btn key={`${x}+${y}`} active={a === x && b === y} onClick={() => { setA(x); setB(y); }}>
            {x} + {y}
          </Btn>
        ))}
      </Controls>
      <Note>
        <div style={MONO}>{a} + {b} = <b style={{ color: hasError ? theme.warning : theme.accent.primary }}>{String(sum)}</b></div>
        <div style={MONO}>rounded fix → {String(clean)}</div>
        <div>
          {hasError
            ? "Binary floating point can't represent these decimals exactly — note the tiny error."
            : "This sum happens to be exactly representable in binary."}
        </div>
      </Note>
    </div>
  );
}

function LiveStringApi() {
  const [s, setS] = useState("Hello, Java");
  const OPS = [
    { n: "length()", f: (x: string) => String(x.length) },
    { n: "toUpperCase()", f: (x: string) => x.toUpperCase() },
    { n: "substring(0,5)", f: (x: string) => x.substring(0, 5) },
    { n: "indexOf(\"a\")", f: (x: string) => String(x.indexOf("a")) },
    { n: "replace(\"Java\",\"World\")", f: (x: string) => x.replace("Java", "World") },
    { n: "split(\",\")", f: (x: string) => JSON.stringify(x.split(",")) },
  ];
  const [i, setI] = useState(0);
  const op = OPS[i];
  return (
    <div>
      <div style={{ display: "flex" }}>
        <TextField value={s} onChange={setS} wide placeholder="type any text" />
      </div>
      <Controls>
        {OPS.map((x, idx) => (
          <Btn key={x.n} active={i === idx} onClick={() => setI(idx)}>
            {x.n}
          </Btn>
        ))}
      </Controls>
      <Note>
        <span style={MONO}>
          "{s}".{op.n} → <b style={{ color: theme.accent.primary }}>{op.f(s)}</b>
        </span>
      </Note>
    </div>
  );
}

function LiveFormat() {
  const [v, setV] = useState(3.14159);
  const SPECS = [
    { n: "%d", f: (x: number) => String(Math.trunc(x)) },
    { n: "%.2f", f: (x: number) => x.toFixed(2) },
    { n: "%8.2f", f: (x: number) => x.toFixed(2).padStart(8) },
    { n: "%08.2f", f: (x: number) => x.toFixed(2).padStart(8, "0") },
    { n: "%x", f: (x: number) => (Math.trunc(x) >>> 0).toString(16) },
    { n: "%e", f: (x: number) => x.toExponential(2) },
  ];
  const [i, setI] = useState(1);
  const sp = SPECS[i];
  return (
    <div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <span style={{ fontSize: 12, color: theme.text.secondary }}>value:</span>
        <TextField value={String(v)} onChange={(s) => setV(numOf(s))} />
      </div>
      <Controls>
        {SPECS.map((x, idx) => (
          <Btn key={x.n} active={i === idx} onClick={() => setI(idx)}>
            {x.n}
          </Btn>
        ))}
      </Controls>
      <Note>
        <span style={MONO}>
          String.format("{sp.n}", {v}) → "<b style={{ color: theme.accent.primary }}>{sp.f(v)}</b>"
        </span>
      </Note>
    </div>
  );
}

function javaHash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
}
function LiveBucket() {
  const [key, setKey] = useState("apple");
  const [cap, setCap] = useState(16);
  const h = javaHash(key);
  const spread = (h ^ (h >>> 16)) | 0;
  const idx = (cap - 1) & spread;
  return (
    <div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <span style={{ fontSize: 12, color: theme.text.secondary }}>key:</span>
        <TextField value={key} onChange={setKey} placeholder="apple" />
      </div>
      <Controls>
        <span style={{ fontSize: 11, color: theme.text.tertiary }}>capacity:</span>
        {[16, 32, 64].map((c) => (
          <Btn key={c} active={cap === c} onClick={() => setCap(c)}>
            {c}
          </Btn>
        ))}
      </Controls>
      <Note>
        <div style={MONO}>"{key}".hashCode() = {h}</div>
        <div style={MONO}>spread = h ^ (h &gt;&gt;&gt; 16) = {spread}</div>
        <div style={MONO}>bucket = (cap-1) &amp; spread = <b style={{ color: theme.accent.primary }}>{idx}</b> <span style={{ color: theme.text.tertiary }}>of {cap}</span></div>
      </Note>
    </div>
  );
}

function LiveRegex() {
  const [text, setText] = useState("id-42-99");
  const [pat, setPat] = useState("(\\d+)");
  let full = false;
  const matches: string[] = [];
  let g1: string | undefined;
  let err = false;
  try {
    full = new RegExp("^(?:" + pat + ")$").test(text);
    for (const m of text.matchAll(new RegExp(pat, "g"))) {
      matches.push(m[0]);
      if (g1 === undefined && m[1] !== undefined) g1 = m[1];
    }
  } catch {
    err = true;
  }
  const presets: [string, string][] = [
    ["id-42-99", "(\\d+)"],
    ["a@b.com", "\\w+@\\w+\\.\\w+"],
    ["2026-07-03", "(\\d{4})-(\\d{2})"],
  ];
  return (
    <div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <TextField value={text} onChange={setText} wide placeholder="input text" />
        <TextField value={pat} onChange={setPat} wide placeholder="regex pattern" />
      </div>
      <Controls>
        {presets.map(([t, p]) => (
          <Btn key={t} active={text === t && pat === p} onClick={() => { setText(t); setPat(p); }}>
            {t}
          </Btn>
        ))}
      </Controls>
      <Note>
        {err ? (
          <span style={{ color: theme.warning }}>Invalid regex pattern.</span>
        ) : (
          <>
            <div style={MONO}>matches() whole string → <b style={{ color: full ? theme.accent.primary : theme.warning }}>{String(full)}</b></div>
            <div style={MONO}>find() all → [{matches.join(", ")}]</div>
            <div style={MONO}>group(1) → {g1 ?? "—"}</div>
            <div style={{ color: theme.text.tertiary, fontSize: 11 }}>Core syntax matches Java's Pattern; engine is the browser's for a live demo.</div>
          </>
        )}
      </Note>
    </div>
  );
}

/* Fully live-computed widgets (registered here as the single source of truth). */
Object.assign(REGISTRY, {
  "math": LiveMath,
  "exact-math": LiveFloorMath,
  "float-ieee": LiveFloat,
  "string-api": LiveStringApi,
  "string-format": LiveFormat,
  "hashmap-internals": LiveBucket,
  "regex": LiveRegex,
});
