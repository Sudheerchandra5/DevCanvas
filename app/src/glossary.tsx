import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { theme } from "./theme";

/**
 * Plain-English definitions for jargon a beginner is likely to hit.
 * Keys are lowercase; plural forms map to the same definition so they
 * get highlighted too.
 */
const GLOSSARY: Record<string, string> = {
  jvm: "Java Virtual Machine — the program that actually runs your compiled Java code.",
  jre: "Java Runtime Environment — the JVM plus the core libraries needed to run Java apps.",
  jdk: "Java Development Kit — the JRE plus tools (like the compiler) needed to write Java.",
  bytecode:
    "The portable, half-compiled instructions the JVM runs — not human code, not raw CPU code.",
  compiler: "A tool that translates your source code into another form (Java's javac makes bytecode).",
  compile: "To translate source code into a form the machine can run.",
  compiled: "Turned from source code into a runnable form.",
  runtime: "While the program is actually running (versus when it's written or compiled).",
  library: "Ready-made code you can reuse instead of writing it yourself.",
  libraries: "Ready-made code you can reuse instead of writing it yourself.",
  heap: "The area of memory where Java objects live.",
  reference: "A handle that points to an object, rather than the object itself.",
  references: "Handles that point to objects, rather than the objects themselves.",
  immutable: "Can't be changed after it's created.",
  instance: "A concrete object built from a class blueprint.",
  instantiate: "To create an object from a class.",
  object: "A specific thing in memory built from a class, with its own data.",
  objects: "Specific things in memory built from a class, each with its own data.",
  class: "A blueprint that defines what objects of that type have and can do.",
  classes: "Blueprints that define what objects of that type have and can do.",
  method: "A named block of code you can call — a function that belongs to a class.",
  methods: "Named blocks of code you can call — functions that belong to a class.",
  variable: "A named box that stores a value.",
  variables: "Named boxes that store values.",
  parameter: "A named input a method declares it needs.",
  parameters: "The named inputs a method declares it needs.",
  argument: "The actual value you pass to a method when calling it.",
  arguments: "The actual values you pass to a method when calling it.",
  interface: "A contract listing methods a class promises to provide.",
  package: "A folder-like namespace that groups related classes.",
  exception: "An error object thrown when something goes wrong, which you can catch.",
  exceptions: "Error objects thrown when something goes wrong, which you can catch.",
  thread: "An independent path of execution, letting code run in parallel.",
  threads: "Independent paths of execution, letting code run in parallel.",
  primitive: "A basic built-in value type like int or boolean (not an object).",
  primitives: "Basic built-in value types like int or boolean (not objects).",
  null: "A reference that points to nothing.",
  cast: "To convert a value from one type to another.",
  casting: "Converting a value from one type to another.",
  repl: "Read-Eval-Print Loop — type an expression and instantly see its result.",
  lts: "Long-Term Support — a Java version that gets updates for years (e.g. 8, 11, 17, 21).",
  polymorphism: "One call behaving differently depending on the object's real type.",
  generic: "A type placeholder (like <T>) that lets one class or method work with many types.",
  generics: "Type placeholders (like <T>) that let one class or method work with many types.",
  overloading: "Multiple methods with the same name but different parameters.",
};

const TERMS = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length);
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const RE = new RegExp("\\b(" + TERMS.map(escape).join("|") + ")\\b", "gi");

function Term({ word, def }: { word: string; def: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const open = () => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const maxW = 280;
    const x = Math.min(r.left, window.innerWidth - maxW - 12);
    setPos({ x: Math.max(12, x), y: r.bottom + 6 });
    setShow(true);
  };
  const close = () => setShow(false);

  return (
    <>
      <span
        ref={ref}
        tabIndex={0}
        onMouseEnter={open}
        onMouseLeave={close}
        onFocus={open}
        onBlur={close}
        style={{
          borderBottom: `1px dotted ${theme.accent.primary}`,
          cursor: "help",
          outline: "none",
        }}
      >
        {word}
      </span>
      {show
        ? createPortal(
            <div
              role="tooltip"
              style={{
                position: "fixed",
                left: pos.x,
                top: pos.y,
                maxWidth: 280,
                background: theme.surface2 ?? theme.surface,
                color: theme.text.secondary,
                border: `1px solid ${theme.border}`,
                borderLeft: `3px solid ${theme.accent.primary}`,
                borderRadius: 8,
                padding: "8px 11px",
                fontSize: 12.5,
                lineHeight: 1.45,
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.45)",
                zIndex: 9999,
                pointerEvents: "none",
              }}
            >
              <span
                style={{
                  color: theme.accent.primary,
                  fontWeight: 600,
                  marginRight: 6,
                }}
              >
                {word}
              </span>
              {def}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

/**
 * Renders text with the first occurrence of each known jargon term
 * wrapped in a hover-tooltip. Later repeats are left plain to avoid clutter.
 */
export function Glossed({ text }: { text: string }) {
  const used = new Set<string>();
  const out: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  RE.lastIndex = 0;
  while ((m = RE.exec(text)) !== null) {
    const word = m[0];
    const key = word.toLowerCase();
    const def = GLOSSARY[key];
    if (!def || used.has(key)) continue;
    used.add(key);
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(<Term key={m.index} word={word} def={def} />);
    last = m.index + word.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}
