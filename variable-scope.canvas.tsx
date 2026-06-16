import {
  H1, H3, Text, Code, Card, CardHeader, CardBody, Stack, Row, Grid,
  Table, Pill, Callout, Divider, Button, TextInput, useCanvasState, useHostTheme
} from "cursor/canvas";

type Region = "Method Area" | "Heap" | "Stack (frame)" | "Stack (block)";

interface VarDef {
  name: string;
  scope: string;
  region: Region;
  born: number;
  die: number;
  value: (amount: number, step: number) => number;
}

const VARS: VarDef[] = [
  { name: "total", scope: "Class (static)", region: "Method Area", born: 0, die: 9, value: (_a, s) => (s >= 7 ? 1 : 0) },
  { name: "count", scope: "Instance", region: "Heap", born: 1, die: 9, value: (a, s) => (s >= 6 ? a + 1 : 0) },
  { name: "amount", scope: "Local (method)", region: "Stack (frame)", born: 2, die: 8, value: (a) => a },
  { name: "step", scope: "Local (method)", region: "Stack (frame)", born: 3, die: 8, value: (a) => a },
  { name: "bonus", scope: "Block", region: "Stack (block)", born: 5, die: 7, value: () => 1 },
];

const STEPS: { title: string; line: number }[] = [
  { title: "Class Counter is loaded — static fields initialize", line: 1 },
  { title: "new Counter() — instance field count is created on the heap", line: 2 },
  { title: "tick(amount) is called — parameter enters the stack frame", line: 3 },
  { title: "int step = amount; — a method-local variable is created", line: 4 },
  { title: "if (step > 0) — entering a new block scope", line: 5 },
  { title: "int bonus = 1; — a block-scoped variable is created", line: 6 },
  { title: "count += step + bonus; — instance field updated", line: 7 },
  { title: "total += 1; — static field updated", line: 8 },
  { title: "} block ends — bonus is destroyed immediately", line: 9 },
  { title: "} method returns — amount and step are destroyed", line: 10 },
];

const CODE = [
  "class Counter {",
  "    static int total = 0;",
  "    int count = 0;",
  "    void tick(int amount) {",
  "        int step = amount;",
  "        if (step > 0) {",
  "            int bonus = 1;",
  "            count += step + bonus;",
  "            total += 1;",
  "        }",
  "    }",
];

function statusOf(v: VarDef, step: number): "none" | "alive" | "dead" {
  if (step < v.born) return "none";
  if (step > v.die) return "dead";
  return "alive";
}

const TABS = [
  { id: "scopes", label: "Four Scopes" },
  { id: "stepper", label: "Execution Stepper" },
  { id: "timeline", label: "Lifetime Timeline" },
  { id: "shadow", label: "Shadowing" },
  { id: "cheat", label: "Cheatsheet" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function VariableScope() {
  const [tab, setTab] = useCanvasState<TabId>("scope.tab", "scopes");

  return (
    <Stack gap={24} style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
      <Stack gap={8}>
        <H1>Scope: Where Variables Live</H1>
        <Text tone="secondary">
          A variable's <Text as="span" weight="semibold">scope</Text> is where its name can be used;
          its <Text as="span" weight="semibold">lifetime</Text> is how long it exists in memory.
          Step through a running program below to watch both unfold for class, instance, local, and
          block variables.
        </Text>
      </Stack>

      <Row gap={8} wrap>
        {TABS.map((t) => (
          <span key={t.id}>
            <Pill active={tab === t.id} onClick={() => setTab(t.id)}>{t.label}</Pill>
          </span>
        ))}
      </Row>

      {tab === "scopes" && <FourScopes />}
      {tab === "stepper" && <Stepper />}
      {tab === "timeline" && <Timeline />}
      {tab === "shadow" && <Shadowing />}
      {tab === "cheat" && <Cheatsheet />}
    </Stack>
  );
}

function FourScopes() {
  return (
    <Stack gap={20}>
      <Text tone="secondary">
        Java has four places a variable can be declared. Each has its own visibility and lifetime.
      </Text>

      <Table
        headers={["Scope", "Declared", "Visible to", "Lives in", "Lifetime"]}
        columnAlign={["left", "left", "left", "left", "left"]}
        rows={[
          ["Class (static)", "Field with static", "Every instance + static code", "Method Area", "Class load → program end"],
          ["Instance", "Field without static", "All methods of the object", "Heap", "While the object exists"],
          ["Local (method)", "Inside a method", "That method only", "Stack frame", "During the method call"],
          ["Block", "Inside { } (if/for/while)", "That block only", "Stack (block)", "Until the block exits"],
        ]}
        rowTone={["info", "info", "neutral", "neutral"]}
      />

      <Divider />

      <Grid columns="1fr 1fr" gap={16}>
        <Stack gap={6}>
          <H3>Scope vs lifetime</H3>
          <Text tone="secondary" size="small">
            They usually align for locals, but not always. A field can be <Text as="span" weight="semibold">alive</Text>
            {" "}in memory while temporarily out of <Text as="span" weight="semibold">scope</Text> (hidden by a local of
            the same name — see Shadowing).
          </Text>
        </Stack>
        <Callout tone="info" title="Narrow scope is good">
          <Text size="small">
            Declare variables in the smallest block that needs them. Smaller scope means fewer name
            clashes, shorter lifetime, and easier reasoning.
          </Text>
        </Callout>
      </Grid>
    </Stack>
  );
}

function CodePanel({ activeLine }: { activeLine: number }) {
  const theme = useHostTheme();
  return (
    <Card>
      <CardHeader>Counter.java</CardHeader>
      <CardBody style={{ padding: 0 }}>
        <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 13 }}>
          {CODE.map((ln, i) => {
            const active = i + 1 === activeLine;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 12,
                  padding: "3px 14px",
                  background: active ? theme.fill.secondary : "transparent",
                  borderLeft: `2px solid ${active ? theme.accent.primary : "transparent"}`,
                  color: active ? theme.text.primary : theme.text.secondary,
                }}
              >
                <span style={{ color: theme.text.quaternary, width: 18, textAlign: "right" }}>{i + 1}</span>
                <span style={{ whiteSpace: "pre" }}>{ln}</span>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}

function Stepper() {
  const theme = useHostTheme();
  const [step, setStep] = useCanvasState<number>("scope.step", 0);
  const [amountStr, setAmount] = useCanvasState<string>("scope.amount", "5");
  const amount = Number(amountStr) || 0;

  const clamped = Math.max(0, Math.min(STEPS.length - 1, step));
  const current = STEPS[clamped];

  return (
    <Stack gap={16}>
      <Row gap={12} align="center" wrap>
        <Button variant="secondary" disabled={clamped === 0} onClick={() => setStep(clamped - 1)}>‹ Prev</Button>
        <Button variant="primary" disabled={clamped === STEPS.length - 1} onClick={() => setStep(clamped + 1)}>Next ›</Button>
        <Button variant="ghost" onClick={() => setStep(0)}>Restart</Button>
        <Pill>Step {clamped + 1} / {STEPS.length}</Pill>
        <Row gap={6} align="center">
          <Text size="small" tone="secondary">amount =</Text>
          <span style={{ width: 70 }}><TextInput value={amountStr} onChange={setAmount} type="number" /></span>
        </Row>
      </Row>

      <Callout tone="neutral">
        <Text>{current.title}</Text>
      </Callout>

      <Grid columns="1fr 1fr" gap={16}>
        <CodePanel activeLine={current.line} />

        <Stack gap={8}>
          <H3>Variables right now</H3>
          {VARS.map((v) => {
            const st = statusOf(v, clamped);
            const alive = st === "alive";
            const label = st === "none" ? "Not created" : st === "dead" ? "Destroyed" : "In scope";
            const tone = alive ? theme.text.primary : theme.text.quaternary;
            return (
              <div
                key={v.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: `1px solid ${alive ? theme.stroke.secondary : theme.stroke.tertiary}`,
                  background: alive ? theme.fill.tertiary : "transparent",
                  opacity: alive ? 1 : 0.55,
                }}
              >
                <Code style={{ color: tone }}>{v.name}</Code>
                <span style={{ flex: 1 }} />
                <Text size="small" tone="tertiary">{v.region}</Text>
                <span
                  style={{
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: 13,
                    color: alive ? theme.accent.primary : theme.text.quaternary,
                    minWidth: 28,
                    textAlign: "right",
                  }}
                >
                  {alive ? v.value(amount, clamped) : "—"}
                </span>
                <Pill size="sm">{label}</Pill>
              </div>
            );
          })}
        </Stack>
      </Grid>
    </Stack>
  );
}

function Timeline() {
  const theme = useHostTheme();
  const [step, setStep] = useCanvasState<number>("scope.step", 0);
  const clamped = Math.max(0, Math.min(STEPS.length - 1, step));

  return (
    <Stack gap={16}>
      <Text tone="secondary">
        Each bar shows the span of program steps during which a variable exists in memory. Notice how{" "}
        <Code>total</Code> outlives everything, while <Code>bonus</Code> exists for only three steps.
      </Text>

      <Row gap={12} align="center" wrap>
        <Button variant="secondary" disabled={clamped === 0} onClick={() => setStep(clamped - 1)}>‹ Prev</Button>
        <Button variant="primary" disabled={clamped === STEPS.length - 1} onClick={() => setStep(clamped + 1)}>Next ›</Button>
        <Pill>Step {clamped + 1} / {STEPS.length}</Pill>
      </Row>

      <Card>
        <CardHeader trailing={`${STEPS[clamped].title}`}>Variable lifetime by step</CardHeader>
        <CardBody>
          <Stack gap={8}>
            {VARS.map((v) => (
              <span key={v.name} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ width: 70, fontFamily: "var(--font-mono, monospace)", fontSize: 12, color: theme.text.secondary }}>
                  {v.name}
                </span>
                <div style={{ display: "flex", gap: 3, flex: 1 }}>
                  {STEPS.map((_, i) => {
                    const inSpan = i >= v.born && i <= v.die;
                    const isNow = i === clamped;
                    return (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          height: 18,
                          borderRadius: 3,
                          background: inSpan ? (isNow ? theme.accent.primary : theme.fill.primary) : theme.fill.quaternary,
                          border: isNow ? `1px solid ${theme.accent.primary}` : "1px solid transparent",
                          opacity: inSpan ? 1 : 0.4,
                        }}
                      />
                    );
                  })}
                </div>
              </span>
            ))}
            <Row gap={10} align="center">
              <span style={{ width: 70 }} />
              <div style={{ display: "flex", gap: 3, flex: 1 }}>
                {STEPS.map((_, i) => (
                  <span key={i} style={{ flex: 1, textAlign: "center", fontSize: 10, color: i === clamped ? theme.accent.primary : theme.text.quaternary }}>
                    {i + 1}
                  </span>
                ))}
              </div>
            </Row>
          </Stack>
        </CardBody>
      </Card>

      <Text size="small" tone="tertiary">
        Bars: filled = variable is alive at that step. Highlighted column = current step. X-axis = execution step (1–{STEPS.length}).
      </Text>
    </Stack>
  );
}

function Shadowing() {
  const theme = useHostTheme();
  const [useThis, setUseThis] = useCanvasState<boolean>("scope.useThis", false);
  const [paramStr, setParam] = useCanvasState<string>("scope.param", "5");
  const param = Number(paramStr) || 0;

  const fieldBefore = 10;
  const fieldAfter = useThis ? param : fieldBefore;

  return (
    <Stack gap={18}>
      <Text tone="secondary">
        When a local variable has the same name as a field, the local <Text as="span" weight="semibold">shadows</Text>
        {" "}the field inside that scope. The plain name now refers to the local; you need <Code>this.x</Code> to
        reach the field.
      </Text>

      <Row gap={12} align="center" wrap>
        <Row gap={6} align="center">
          <Text size="small" tone="secondary">parameter x =</Text>
          <span style={{ width: 70 }}><TextInput value={paramStr} onChange={setParam} type="number" /></span>
        </Row>
        <Row gap={8} align="center">
          <Text size="small" tone="secondary">Assignment:</Text>
          <Pill active={!useThis} onClick={() => setUseThis(false)}>x = x;</Pill>
          <Pill active={useThis} onClick={() => setUseThis(true)}>this.x = x;</Pill>
        </Row>
      </Row>

      <Card>
        <CardHeader trailing={useThis ? "writes the field" : "writes the local"}>Box.java</CardHeader>
        <CardBody style={{ padding: 0 }}>
          <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 13, padding: "12px 14px", lineHeight: 1.7 }}>
            <div style={{ color: theme.text.secondary }}>class Box {"{"}</div>
            <div style={{ color: theme.text.secondary }}>{"    "}int x = 10;{"          "}<span style={{ color: theme.text.quaternary }}>// instance field</span></div>
            <div style={{ color: theme.text.secondary }}>{"    "}void set(int x) {"{"}{"     "}<span style={{ color: theme.text.quaternary }}>// parameter shadows field</span></div>
            <div style={{ color: theme.accent.primary, background: theme.fill.secondary, padding: "0 4px" }}>
              {"        "}{useThis ? "this.x = x;" : "x = x;"}
            </div>
            <div style={{ color: theme.text.secondary }}>{"    "}{"}"}</div>
            <div style={{ color: theme.text.secondary }}>{"}"}</div>
          </div>
        </CardBody>
      </Card>

      <Grid columns="1fr 1fr 1fr" gap={16}>
        <Stack gap={4}>
          <Text size="small" tone="secondary">field x before</Text>
          <span style={box(theme, theme.text.primary)}>{fieldBefore}</span>
        </Stack>
        <Stack gap={4}>
          <Text size="small" tone="secondary">local x (parameter)</Text>
          <span style={box(theme, theme.text.primary)}>{param}</span>
        </Stack>
        <Stack gap={4}>
          <Text size="small" tone="secondary">field x after</Text>
          <span style={box(theme, fieldAfter !== fieldBefore ? theme.accent.primary : theme.text.primary)}>{fieldAfter}</span>
        </Stack>
      </Grid>

      {useThis ? (
        <Callout tone="success" title="this.x reaches the field">
          <Text size="small">
            <Code>this.x = x</Code> copies the local <Code>x</Code> ({param}) into the shadowed field, so the field
            becomes {fieldAfter}.
          </Text>
        </Callout>
      ) : (
        <Callout tone="warning" title="A classic no-op bug">
          <Text size="small">
            <Code>x = x</Code> just assigns the parameter to itself. The field stays {fieldBefore} — the local shadowed
            it, so the field was never touched.
          </Text>
        </Callout>
      )}
    </Stack>
  );
}

function Cheatsheet() {
  return (
    <Stack gap={20}>
      <Stack gap={10}>
        <H3>Quick rules</H3>
        <Table
          headers={["Rule", "Why it matters"]}
          columnAlign={["left", "left"]}
          rows={[
            ["A variable is visible only inside the { } where it is declared", "Block and method locals vanish at the closing brace"],
            ["Locals must be initialized before use", "Unlike fields, they get no default value"],
            ["Fields get defaults (0, false, null)", "Instance/static fields are auto-initialized"],
            ["Inner scope can shadow an outer name", "Use this.field or ClassName.field to reach the original"],
            ["static is shared; instance is per-object", "One total for the class, one count per Counter"],
          ]}
          rowTone={["info", "warning", "info", "warning", "neutral"]}
        />
      </Stack>

      <Grid columns="1fr 1fr" gap={16}>
        <Callout tone="danger" title="Out of scope = won't compile">
          <Text size="small">
            Using <Code>bonus</Code> after its <Code>if</Code> block ends is a compile error: <Code>cannot find symbol</Code>.
          </Text>
        </Callout>
        <Callout tone="info" title="Lifetime ≠ scope">
          <Text size="small">
            An object on the heap can outlive the local reference that created it, as long as something still points to it.
          </Text>
        </Callout>
      </Grid>
    </Stack>
  );
}

function box(theme: ReturnType<typeof useHostTheme>, color: string) {
  return {
    padding: "12px 14px",
    borderRadius: 6,
    fontFamily: "var(--font-mono, monospace)",
    fontSize: 16,
    background: theme.fill.tertiary,
    border: `1px solid ${theme.stroke.tertiary}`,
    color,
  } as const;
}
