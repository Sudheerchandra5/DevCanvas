import {
  H1, H3, Text, Code, Card, CardHeader, CardBody, Stack, Row, Grid,
  Table, Pill, Callout, Divider, Button, TextInput, useCanvasState, useHostTheme
} from "cursor/canvas";

const TABS = [
  { id: "cond", label: "Conditionals" },
  { id: "switch", label: "switch" },
  { id: "loops", label: "Loops" },
  { id: "jump", label: "break / continue" },
  { id: "cheat", label: "Cheatsheet" },
] as const;
type TabId = (typeof TABS)[number]["id"];

export default function ControlFlow() {
  const [tab, setTab] = useCanvasState<TabId>("cf.tab", "cond");
  return (
    <Stack gap={24} style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
      <Stack gap={8}>
        <H1>Control Flow in Java</H1>
        <Text tone="secondary">
          Control flow decides <Text as="span" weight="semibold">which</Text> statements run and{" "}
          <Text as="span" weight="semibold">how many times</Text>. Conditionals branch, loops repeat, and
          jump statements cut execution short. Every panel below runs live.
        </Text>
      </Stack>

      <Row gap={8} wrap>
        {TABS.map((t) => (
          <span key={t.id}><Pill active={tab === t.id} onClick={() => setTab(t.id)}>{t.label}</Pill></span>
        ))}
      </Row>

      {tab === "cond" && <Conditionals />}
      {tab === "switch" && <SwitchTab />}
      {tab === "loops" && <Loops />}
      {tab === "jump" && <Jump />}
      {tab === "cheat" && <Cheatsheet />}
    </Stack>
  );
}

function CodePanel({ code, active, title }: { code: string[]; active: number; title: string }) {
  const theme = useHostTheme();
  return (
    <Card>
      <CardHeader>{title}</CardHeader>
      <CardBody style={{ padding: 0 }}>
        <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 13 }}>
          {code.map((ln, i) => {
            const on = i === active;
            return (
              <div key={i} style={{
                display: "flex", gap: 12, padding: "3px 14px",
                background: on ? theme.fill.secondary : "transparent",
                borderLeft: `2px solid ${on ? theme.accent.primary : "transparent"}`,
                color: on ? theme.text.primary : theme.text.secondary,
              }}>
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

function Conditionals() {
  const theme = useHostTheme();
  const [scoreStr, setScore] = useCanvasState<string>("cf.score", "85");
  const [nStr, setN] = useCanvasState<string>("cf.tern", "7");
  const score = Math.trunc(Number(scoreStr) || 0);
  const n = Math.trunc(Number(nStr) || 0);

  const branches = [
    { cond: `score >= 90`, test: score >= 90, grade: "A" },
    { cond: `score >= 80`, test: score >= 80, grade: "B" },
    { cond: `score >= 70`, test: score >= 70, grade: "C" },
    { cond: `score >= 60`, test: score >= 60, grade: "D" },
  ];
  const takenIdx = branches.findIndex((b) => b.test);
  const grade = takenIdx === -1 ? "F" : branches[takenIdx].grade;

  return (
    <Stack gap={18}>
      <Stack gap={10}>
        <H3>if / else-if ladder</H3>
        <Text tone="secondary" size="small">
          Conditions are tested top to bottom; the <Text as="span" weight="semibold">first</Text> true branch
          runs and the rest are skipped. Change the score to see which branch is taken.
        </Text>
        <Row gap={8} align="center" wrap>
          <Text size="small" tone="secondary">score =</Text>
          <span style={{ width: 90 }}><TextInput value={scoreStr} onChange={setScore} type="number" /></span>
          {["95", "85", "72", "50"].map((p) => (
            <span key={p}><Pill size="sm" active={scoreStr === p} onClick={() => setScore(p)}>{p}</Pill></span>
          ))}
        </Row>

        <Stack gap={6}>
          {branches.map((b, i) => {
            const skipped = takenIdx !== -1 && i > takenIdx;
            const taken = i === takenIdx;
            const status = taken ? "TAKEN" : skipped ? "skipped (already matched)" : b.test ? "true" : "false";
            const color = taken ? theme.accent.primary : skipped ? theme.text.quaternary : theme.text.secondary;
            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 6,
                border: `1px solid ${taken ? theme.stroke.secondary : theme.stroke.tertiary}`,
                background: taken ? theme.fill.tertiary : "transparent", opacity: skipped ? 0.5 : 1,
              }}>
                <Code style={{ color }}>{i === 0 ? "if" : "else if"} ({b.cond}) → "{b.grade}"</Code>
                <span style={{ flex: 1 }} />
                <Pill size="sm">{status}</Pill>
              </div>
            );
          })}
          <div style={{
            display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 6,
            border: `1px solid ${takenIdx === -1 ? theme.stroke.secondary : theme.stroke.tertiary}`,
            background: takenIdx === -1 ? theme.fill.tertiary : "transparent",
          }}>
            <Code style={{ color: takenIdx === -1 ? theme.accent.primary : theme.text.secondary }}>else → "F"</Code>
            <span style={{ flex: 1 }} />
            <Pill size="sm">{takenIdx === -1 ? "TAKEN" : "not reached"}</Pill>
          </div>
        </Stack>

        <Callout tone="info" title={`grade = "${grade}"`}>
          <Text size="small">Score {score} matched the highlighted branch.</Text>
        </Callout>
      </Stack>

      <Divider />

      <Stack gap={10}>
        <H3>Ternary operator</H3>
        <Text tone="secondary" size="small">
          A compact expression form of if/else that <Text as="span" weight="semibold">returns a value</Text>.
        </Text>
        <Row gap={8} align="center" wrap>
          <Text size="small" tone="secondary">n =</Text>
          <span style={{ width: 90 }}><TextInput value={nStr} onChange={setN} type="number" /></span>
        </Row>
        <Code>String r = (n % 2 == 0) ? "even" : "odd";</Code>
        <span style={box(theme, theme.accent.primary)}>r = "{n % 2 === 0 ? "even" : "odd"}"</span>
      </Stack>
    </Stack>
  );
}

const DAYS = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function SwitchTab() {
  const theme = useHostTheme();
  const [day, setDay] = useCanvasState<number>("cf.day", 3);
  const [withBreak, setWithBreak] = useCanvasState<boolean>("cf.break", true);

  const executed: string[] = [];
  for (let i = day; i <= 7; i++) {
    executed.push(`case ${i}: print "${DAYS[i]}"`);
    if (withBreak) break;
  }
  const exprResult = DAYS[day];

  return (
    <Stack gap={18}>
      <Row gap={8} align="center" wrap>
        <Text size="small" tone="secondary">day =</Text>
        {[1, 2, 3, 4, 5, 6, 7].map((d) => (
          <span key={d}><Pill size="sm" active={day === d} onClick={() => setDay(d)}>{d}</Pill></span>
        ))}
      </Row>

      <Row gap={8} align="center" wrap>
        <Text size="small" tone="secondary">break after each case:</Text>
        <Pill active={withBreak} onClick={() => setWithBreak(true)}>with break</Pill>
        <Pill active={!withBreak} onClick={() => setWithBreak(false)}>no break (fall-through)</Pill>
      </Row>

      <Grid columns="1fr 1fr" gap={16}>
        <Card>
          <CardHeader trailing={withBreak ? "1 case runs" : `${executed.length} cases run`}>Classic switch</CardHeader>
          <CardBody>
            <Stack gap={6}>
              {executed.map((e, i) => (
                <span key={i}><Code style={{ color: theme.accent.primary }}>{e}</Code></span>
              ))}
            </Stack>
          </CardBody>
        </Card>
        <Card>
          <CardHeader trailing="no fall-through">switch expression (Java 14+)</CardHeader>
          <CardBody>
            <Stack gap={6}>
              <Code>String s = switch (day) {"{"}</Code>
              <Code>{"    "}case {day} -&gt; "{exprResult}";</Code>
              <Code>{"}"};</Code>
              <span style={box(theme, theme.accent.primary)}>s = "{exprResult}"</span>
            </Stack>
          </CardBody>
        </Card>
      </Grid>

      {withBreak ? (
        <Callout tone="success" title="break stops the switch">
          <Text size="small">
            Only <Code>case {day}</Code> runs, then <Code>break</Code> exits. This is what you usually want.
          </Text>
        </Callout>
      ) : (
        <Callout tone="danger" title="Fall-through bug">
          <Text size="small">
            Without <Code>break</Code>, execution falls into every case below the match —{" "}
            {executed.length} statements run instead of 1. A classic source of bugs in the old{" "}
            <Code>case:</Code> syntax (the new <Code>-&gt;</Code> arrow form never falls through).
          </Text>
        </Callout>
      )}

      <Callout tone="info" title="What switch accepts">
        <Text size="small">
          <Code>byte/short/char/int</Code> and their wrappers, <Code>String</Code>, <Code>enum</Code>, and
          (Java 21) patterns. Not <Code>long</Code>, <Code>float</Code>, <Code>double</Code>, or{" "}
          <Code>boolean</Code>.
        </Text>
      </Callout>
    </Stack>
  );
}

type LoopType = "for" | "while" | "do-while" | "for-each";

interface LStep { desc: string; line: number; out: number[]; }

function buildSteps(type: LoopType, n: number): { code: string[]; steps: LStep[] } {
  const steps: LStep[] = [];
  const out: number[] = [];
  if (type === "for") {
    const code = ["for (int i = 1; i <= n; i++) {", "    System.out.println(i);", "}"];
    steps.push({ desc: "int i = 1", line: 0, out: [...out] });
    for (let i = 1; i <= n; i++) {
      steps.push({ desc: `i <= n → ${i} <= ${n} = true`, line: 0, out: [...out] });
      out.push(i);
      steps.push({ desc: `print ${i}`, line: 1, out: [...out] });
      steps.push({ desc: `i++ → i = ${i + 1}`, line: 0, out: [...out] });
    }
    steps.push({ desc: `i <= n → ${n + 1} <= ${n} = false → exit`, line: 2, out: [...out] });
    return { code, steps };
  }
  if (type === "while") {
    const code = ["int i = 1;", "while (i <= n) {", "    System.out.println(i);", "    i++;", "}"];
    steps.push({ desc: "int i = 1", line: 0, out: [...out] });
    for (let i = 1; i <= n; i++) {
      steps.push({ desc: `i <= n → ${i} <= ${n} = true`, line: 1, out: [...out] });
      out.push(i);
      steps.push({ desc: `print ${i}`, line: 2, out: [...out] });
      steps.push({ desc: `i++ → i = ${i + 1}`, line: 3, out: [...out] });
    }
    steps.push({ desc: `i <= n → ${n + 1} <= ${n} = false → exit`, line: 1, out: [...out] });
    return { code, steps };
  }
  if (type === "do-while") {
    const code = ["int i = 1;", "do {", "    System.out.println(i);", "    i++;", "} while (i <= n);"];
    steps.push({ desc: "int i = 1", line: 0, out: [...out] });
    let i = 1;
    while (true) {
      out.push(i);
      steps.push({ desc: `print ${i} (body runs first)`, line: 2, out: [...out] });
      i++;
      steps.push({ desc: `i++ → i = ${i}`, line: 3, out: [...out] });
      const cond = i <= n;
      steps.push({ desc: `i <= n → ${i} <= ${n} = ${cond}${cond ? "" : " → exit"}`, line: 4, out: [...out] });
      if (!cond) break;
    }
    return { code, steps };
  }
  const arr = [10, 20, 30];
  const code = ["int[] arr = {10, 20, 30};", "for (int x : arr) {", "    System.out.println(x);", "}"];
  steps.push({ desc: "arr = {10, 20, 30}", line: 0, out: [...out] });
  for (const x of arr) {
    steps.push({ desc: `x = ${x} (next element)`, line: 1, out: [...out] });
    out.push(x);
    steps.push({ desc: `print ${x}`, line: 2, out: [...out] });
  }
  steps.push({ desc: "no more elements → exit", line: 3, out: [...out] });
  return { code, steps };
}

function Loops() {
  const theme = useHostTheme();
  const [type, setType] = useCanvasState<LoopType>("cf.ltype", "for");
  const [nStr, setN] = useCanvasState<string>("cf.ln", "3");
  const [step, setStep] = useCanvasState<number>("cf.lstep", 0);
  const n = Math.max(0, Math.min(8, Math.trunc(Number(nStr) || 0)));

  const { code, steps } = buildSteps(type, n);
  const idx = Math.max(0, Math.min(steps.length - 1, step));
  const cur = steps[idx];

  return (
    <Stack gap={16}>
      <Row gap={8} align="center" wrap>
        {(["for", "while", "do-while", "for-each"] as LoopType[]).map((t) => (
          <span key={t}><Pill active={type === t} onClick={() => { setType(t); setStep(0); }}>{t}</Pill></span>
        ))}
        {type !== "for-each" && (
          <Row gap={6} align="center">
            <Text size="small" tone="secondary">n =</Text>
            <span style={{ width: 70 }}><TextInput value={nStr} onChange={(v) => { setN(v); setStep(0); }} type="number" /></span>
          </Row>
        )}
      </Row>

      <Row gap={10} align="center" wrap>
        <Button variant="secondary" disabled={idx === 0} onClick={() => setStep(idx - 1)}>‹ Prev</Button>
        <Button variant="primary" disabled={idx === steps.length - 1} onClick={() => setStep(idx + 1)}>Next ›</Button>
        <Button variant="ghost" onClick={() => setStep(0)}>Restart</Button>
        <Pill>Step {idx + 1} / {steps.length}</Pill>
      </Row>

      <Callout tone="neutral"><Text>{cur.desc}</Text></Callout>

      <Grid columns="1fr 1fr" gap={16}>
        <CodePanel code={code} active={cur.line} title={`${type} loop`} />
        <Stack gap={8}>
          <Text size="small" weight="semibold" tone="secondary">Console output</Text>
          <div style={{ ...box(theme, theme.accent.primary), minHeight: 80 }}>
            {cur.out.length ? cur.out.join("\n") : <Text tone="tertiary">(nothing printed yet)</Text>}
          </div>
        </Stack>
      </Grid>

      {type === "do-while" && n === 0 && (
        <Callout tone="warning" title="do-while always runs once">
          <Text size="small">
            Even with n = 0, the body printed <Code>1</Code> before the condition was checked. A plain{" "}
            <Code>while</Code> would print nothing.
          </Text>
        </Callout>
      )}
      {type === "for-each" && (
        <Callout tone="info" title="Enhanced for has no index">
          <Text size="small">
            <Code>for (int x : arr)</Code> reads each element directly. Use a classic <Code>for</Code> when you
            need the index or want to modify the array.
          </Text>
        </Callout>
      )}
    </Stack>
  );
}

type Action = "break" | "continue";

function Jump() {
  const theme = useHostTheme();
  const [action, setAction] = useCanvasState<Action>("cf.jact", "break");
  const [nStr, setN] = useCanvasState<string>("cf.jn", "6");
  const [kStr, setK] = useCanvasState<string>("cf.jk", "3");
  const [tStr, setT] = useCanvasState<string>("cf.jt", "4");

  const n = Math.max(1, Math.min(10, Math.trunc(Number(nStr) || 1)));
  const k = Math.trunc(Number(kStr) || 0);
  const t = Math.trunc(Number(tStr) || 0);

  const printed: number[] = [];
  for (let i = 1; i <= n; i++) {
    if (i === k) {
      if (action === "break") break;
      else continue;
    }
    printed.push(i);
  }

  const visited: string[] = [];
  let stop: string | null = null;
  outer: for (let i = 1; i <= 3; i++) {
    for (let j = 1; j <= 3; j++) {
      visited.push(`${i},${j}`);
      if (i * j >= t) { stop = `${i},${j}`; break outer; }
    }
  }

  return (
    <Stack gap={18}>
      <Stack gap={10}>
        <H3>break vs continue</H3>
        <Text tone="secondary" size="small">
          <Code>break</Code> exits the loop entirely; <Code>continue</Code> skips to the next iteration. Loop
          runs <Code>i = 1..{n}</Code> and acts when <Code>i == {k}</Code>.
        </Text>
        <Row gap={8} align="center" wrap>
          <Pill active={action === "break"} onClick={() => setAction("break")}>break</Pill>
          <Pill active={action === "continue"} onClick={() => setAction("continue")}>continue</Pill>
          <Text size="small" tone="secondary">n =</Text>
          <span style={{ width: 60 }}><TextInput value={nStr} onChange={setN} type="number" /></span>
          <Text size="small" tone="secondary">act at i =</Text>
          <span style={{ width: 60 }}><TextInput value={kStr} onChange={setK} type="number" /></span>
        </Row>
        <Code>
          for (int i = 1; i &lt;= {n}; i++) {"{"} if (i == {k}) {action}; print(i); {"}"}
        </Code>
        <span style={box(theme, theme.accent.primary)}>output: {printed.join(" ") || "(none)"}</span>
        <Callout tone={action === "break" ? "warning" : "info"} title={action === "break" ? "Stopped early" : "Skipped one"}>
          <Text size="small">
            {action === "break"
              ? `At i == ${k}, break ended the loop — nothing after ${k} ran.`
              : `At i == ${k}, continue skipped the print and jumped to i = ${k + 1}.`}
          </Text>
        </Callout>
      </Stack>

      <Divider />

      <Stack gap={10}>
        <H3>Labeled break (nested loops)</H3>
        <Text tone="secondary" size="small">
          A plain <Code>break</Code> exits only the inner loop. A <Code>label</Code> lets you break the{" "}
          <Text as="span" weight="semibold">outer</Text> loop. Here we stop when <Code>i * j ≥ {t}</Code>.
        </Text>
        <Row gap={8} align="center" wrap>
          <Text size="small" tone="secondary">threshold =</Text>
          <span style={{ width: 70 }}><TextInput value={tStr} onChange={setT} type="number" /></span>
        </Row>
        <Code>outer: for i 1..3 {"{"} for j 1..3 {"{"} if (i*j &gt;= {t}) break outer; {"}"} {"}"}</Code>
        <Grid columns="repeat(3, 60px)" gap={8}>
          {[1, 2, 3].flatMap((i) => [1, 2, 3].map((j) => {
            const key = `${i},${j}`;
            const isStop = stop === key;
            const wasVisited = visited.includes(key);
            return (
              <div key={key} style={{
                height: 48, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6,
                fontFamily: "var(--font-mono, monospace)", fontSize: 13,
                background: isStop ? theme.accent.primary : wasVisited ? theme.fill.secondary : theme.fill.quaternary,
                color: isStop ? theme.text.onAccent : wasVisited ? theme.text.primary : theme.text.quaternary,
                border: `1px solid ${wasVisited ? theme.stroke.secondary : theme.stroke.tertiary}`,
                opacity: wasVisited ? 1 : 0.5,
              }}>{key}</div>
            );
          }))}
        </Grid>
        <Text size="small" tone="tertiary">
          Highlighted = where <Code>break outer</Code> fired ({stop ?? "never"}). Dim cells were never reached.
        </Text>
      </Stack>
    </Stack>
  );
}

function Cheatsheet() {
  return (
    <Stack gap={20}>
      <Stack gap={10}>
        <H3>Constructs</H3>
        <Table
          headers={["Construct", "Use when", "Note"]}
          columnAlign={["left", "left", "left"]}
          rows={[
            ["if / else-if / else", "Few branches on conditions", "First true branch wins"],
            ["ternary ?:", "Pick one of two values", "It is an expression, returns a value"],
            ["switch", "Many cases on one value", "Remember break, or use -> arrows"],
            ["for", "Known count / need index", "init; condition; update"],
            ["while", "Repeat until condition false", "May run zero times"],
            ["do-while", "Run at least once", "Condition checked after body"],
            ["for-each", "Iterate a collection/array", "No index, read-only iteration"],
          ]}
        />
      </Stack>

      <Grid columns="1fr 1fr" gap={16}>
        <Callout tone="danger" title="Common bugs">
          <Text size="small">
            Missing <Code>break</Code> (fall-through); <Code>=</Code> instead of <Code>==</Code>; off-by-one in
            loop bounds; <Code>while (true)</Code> with no exit.
          </Text>
        </Callout>
        <Callout tone="info" title="Jump statements">
          <Text size="small">
            <Code>break</Code> exits a loop/switch; <Code>continue</Code> skips to the next iteration;{" "}
            <Code>return</Code> exits the method; labels target an outer loop.
          </Text>
        </Callout>
      </Grid>
    </Stack>
  );
}

function box(theme: ReturnType<typeof useHostTheme>, color: string) {
  return {
    display: "block",
    padding: "12px 14px",
    borderRadius: 6,
    fontFamily: "var(--font-mono, monospace)",
    fontSize: 14,
    whiteSpace: "pre-wrap" as const,
    background: theme.fill.tertiary,
    border: `1px solid ${theme.stroke.tertiary}`,
    color,
  } as const;
}
