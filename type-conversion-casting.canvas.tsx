import {
  H1, H2, H3, Text, Code, Card, CardHeader, CardBody, Stack, Row, Grid,
  Table, Pill, Callout, Divider, TextInput, Select, useCanvasState, useHostTheme
} from "cursor/canvas";

type PrimType = "byte" | "short" | "char" | "int" | "long" | "float" | "double";

const PRIM_ORDER: PrimType[] = ["byte", "short", "char", "int", "long", "float", "double"];

const WIDENING: Record<PrimType, PrimType[]> = {
  byte: ["short", "int", "long", "float", "double"],
  short: ["int", "long", "float", "double"],
  char: ["int", "long", "float", "double"],
  int: ["long", "float", "double"],
  long: ["float", "double"],
  float: ["double"],
  double: [],
};

const PRIM_BITS: Record<PrimType, string> = {
  byte: "8-bit signed",
  short: "16-bit signed",
  char: "16-bit unsigned",
  int: "32-bit signed",
  long: "64-bit signed",
  float: "32-bit IEEE-754",
  double: "64-bit IEEE-754",
};

function parseInput(raw: string, src: PrimType): number {
  const trimmed = raw.trim();
  if (src === "char" && trimmed.length > 0 && Number.isNaN(Number(trimmed))) {
    return trimmed.charCodeAt(0);
  }
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : 0;
}

function store(n: number, type: PrimType): number {
  switch (type) {
    case "byte": {
      const b = Math.trunc(n) & 0xff;
      return b > 127 ? b - 256 : b;
    }
    case "short": {
      const s = Math.trunc(n) & 0xffff;
      return s > 32767 ? s - 65536 : s;
    }
    case "char":
      return ((Math.trunc(n) % 65536) + 65536) % 65536;
    case "int":
      return n | 0;
    case "long":
      return Math.trunc(n);
    case "float":
      return Math.fround(n);
    case "double":
      return n;
  }
}

function display(val: number, type: PrimType): string {
  if (type === "char") {
    const code = val;
    const printable = code >= 32 && code <= 126;
    const ch = printable ? String.fromCharCode(code) : "\\u" + code.toString(16).padStart(4, "0");
    return `'${ch}'  (code ${code})`;
  }
  if (type === "float" || type === "double") {
    return Number.isInteger(val) ? val.toFixed(1) : String(val);
  }
  return String(val);
}

function isWidening(src: PrimType, tgt: PrimType): boolean {
  return WIDENING[src].includes(tgt);
}

const TABS = [
  { id: "overview", label: "Widening vs Narrowing" },
  { id: "lab", label: "Primitive Cast Lab" },
  { id: "ref", label: "Reference Casting" },
  { id: "box", label: "Autoboxing & Parsing" },
  { id: "cheat", label: "Cheatsheet" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function TypeConversionCasting() {
  const [tab, setTab] = useCanvasState<TabId>("tab", "overview");

  return (
    <Stack gap={24} style={{ padding: 24, maxWidth: 980, margin: "0 auto" }}>
      <Stack gap={8}>
        <H1>Type Conversion & Casting in Java</H1>
        <Text tone="secondary">
          How Java moves a value from one type to another — automatically when it is safe
          (widening), and only with an explicit cast when data could be lost (narrowing).
          Every panel below is live: change the inputs and watch the result.
        </Text>
      </Stack>

      <Row gap={8} wrap>
        {TABS.map((t) => (
          <span key={t.id}>
            <Pill active={tab === t.id} onClick={() => setTab(t.id)}>
              {t.label}
            </Pill>
          </span>
        ))}
      </Row>

      {tab === "overview" && <OverviewTab />}
      {tab === "lab" && <CastLab />}
      {tab === "ref" && <ReferenceCasting />}
      {tab === "box" && <AutoboxingParsing />}
      {tab === "cheat" && <Cheatsheet />}
    </Stack>
  );
}

function OverviewTab() {
  const theme = useHostTheme();
  return (
    <Stack gap={20}>
      <Grid columns="1fr 1fr" gap={16}>
        <Stack gap={8}>
          <H3>Widening (implicit)</H3>
          <Text tone="secondary">
            A smaller type flows into a larger one. The compiler does it for you — no cast,
            no data loss for the value range.
          </Text>
          <Code>double d = 100;{"   "}// int → double, automatic</Code>
        </Stack>
        <Stack gap={8}>
          <H3>Narrowing (explicit)</H3>
          <Text tone="secondary">
            A larger type forced into a smaller one. You must write the cast to acknowledge
            possible truncation or overflow.
          </Text>
          <Code>int i = (int) 9.99;{"   "}// double → int, you must cast</Code>
        </Stack>
      </Grid>

      <Divider />

      <Stack gap={10}>
        <H3>The widening ladder</H3>
        <Text tone="secondary" size="small">
          Conversions <Text as="span" weight="semibold">up</Text> the ladder are automatic.
          Going <Text as="span" weight="semibold">down</Text> requires an explicit cast.
        </Text>
        <Row gap={8} wrap align="center">
          {(["byte", "short", "int", "long", "float", "double"] as PrimType[]).map((t, i, arr) => (
            <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  padding: "6px 12px",
                  borderRadius: 6,
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: 13,
                  background: theme.fill.tertiary,
                  color: theme.text.primary,
                  border: `1px solid ${theme.stroke.tertiary}`,
                }}
              >
                {t}
              </span>
              {i < arr.length - 1 && (
                <span style={{ color: theme.accent.primary, fontSize: 14 }}>→</span>
              )}
            </span>
          ))}
        </Row>
        <Text size="small" tone="tertiary">
          <Code>char</Code> sits beside <Code>short</Code> (both 16-bit) but widens directly to{" "}
          <Code>int</Code> and above. <Code>byte → char</Code> and <Code>short → char</Code> need
          an explicit cast because <Code>char</Code> is unsigned.
        </Text>
      </Stack>

      <Callout tone="warning" title="Widening is not always loss-free">
        <Text size="small">
          <Code>int → float</Code> and <Code>long → float/double</Code> are widening, yet they can
          drop precision for very large magnitudes because the mantissa has fewer bits. The Cast
          Lab flags this when it actually happens.
        </Text>
      </Callout>

      <Stack gap={10}>
        <H3>Rules at a glance</H3>
        <Table
          headers={["Conversion", "Direction", "Cast needed?", "Risk"]}
          columnAlign={["left", "left", "center", "left"]}
          rows={[
            ["byte/short/char → int → long", "Widening", "No", "None"]
              ,
            ["int → float, long → double", "Widening", "No", "Precision loss (large values)"],
            ["double → int, long → int", "Narrowing", "Yes", "Truncates toward zero"],
            ["int → byte / short", "Narrowing", "Yes", "Overflow (bits dropped)"],
            ["int → char", "Narrowing", "Yes", "Reinterprets as code unit"],
          ]}
          rowTone={["success", "warning", "danger", "danger", "warning"]}
        />
      </Stack>
    </Stack>
  );
}

function CastLab() {
  const theme = useHostTheme();
  const [src, setSrc] = useCanvasState<PrimType>("lab.src", "int");
  const [tgt, setTgt] = useCanvasState<PrimType>("lab.tgt", "byte");
  const [value, setValue] = useCanvasState<string>("lab.value", "130");

  const opts = PRIM_ORDER.map((t) => ({ label: t, value: t }));

  const parsed = parseInput(value, src);
  const srcStored = store(parsed, src);
  const tgtStored = store(srcStored, tgt);

  const same = src === tgt;
  const widening = isWidening(src, tgt);
  const lossy = tgtStored !== srcStored;

  const kind = same ? "No conversion" : widening ? "Implicit (widening)" : "Explicit cast (narrowing)";
  const castPrefix = same || widening ? "" : `(${tgt}) `;

  return (
    <Stack gap={20}>
      <Text tone="secondary">
        Pick a source type, a target type, and a value. The generated Java and the runtime result
        update instantly.
      </Text>

      <Grid columns="1fr 1fr 1fr" gap={16}>
        <Stack gap={6}>
          <Text size="small" weight="semibold" tone="secondary">Source type</Text>
          <Select value={src} options={opts} onChange={(v) => setSrc(v as PrimType)} style={selectStyle(theme)} />
          <Text size="small" tone="tertiary">{PRIM_BITS[src]}</Text>
        </Stack>
        <Stack gap={6}>
          <Text size="small" weight="semibold" tone="secondary">Value</Text>
          <TextInput value={value} onChange={setValue} placeholder="e.g. 130 or 9.99 or A" />
          <Text size="small" tone="tertiary">Letters allowed when source is char</Text>
        </Stack>
        <Stack gap={6}>
          <Text size="small" weight="semibold" tone="secondary">Target type</Text>
          <Select value={tgt} options={opts} onChange={(v) => setTgt(v as PrimType)} style={selectStyle(theme)} />
          <Text size="small" tone="tertiary">{PRIM_BITS[tgt]}</Text>
        </Stack>
      </Grid>

      <Card>
        <CardHeader trailing={kind}>Generated Java</CardHeader>
        <CardBody>
          <Stack gap={4}>
            <Code>{src} s = {display(srcStored, src)};</Code>
            <Code>{tgt} t = {castPrefix}s;</Code>
          </Stack>
        </CardBody>
      </Card>

      <Grid columns="1fr 1fr" gap={16}>
        <Stack gap={6}>
          <Text size="small" weight="semibold" tone="secondary">Stored as {src}</Text>
          <span style={resultBox(theme, theme.text.primary)}>{display(srcStored, src)}</span>
        </Stack>
        <Stack gap={6}>
          <Text size="small" weight="semibold" tone="secondary">Result as {tgt}</Text>
          <span style={resultBox(theme, lossy ? theme.accent.primary : theme.text.primary)}>
            {display(tgtStored, tgt)}
          </span>
        </Stack>
      </Grid>

      {same && (
        <Callout tone="neutral" title="Same type">
          <Text size="small">Source and target are identical — nothing is converted.</Text>
        </Callout>
      )}
      {!same && widening && !lossy && (
        <Callout tone="success" title="Safe automatic conversion">
          <Text size="small">
            Widening from <Code>{src}</Code> to <Code>{tgt}</Code> needs no cast and preserves the
            value exactly.
          </Text>
        </Callout>
      )}
      {!same && widening && lossy && (
        <Callout tone="warning" title="Widening, but precision was lost">
          <Text size="small">
            No cast is required, yet <Code>{tgt}</Code> cannot hold this magnitude precisely, so the
            stored value differs from the original.
          </Text>
        </Callout>
      )}
      {!same && !widening && !lossy && (
        <Callout tone="info" title="Cast required, no loss for this value">
          <Text size="small">
            Narrowing always needs the <Code>({tgt})</Code> cast. This particular value happens to
            fit, so nothing changed.
          </Text>
        </Callout>
      )}
      {!same && !widening && lossy && (
        <Callout tone="danger" title="Data lost during narrowing">
          <Text size="small">
            The value did not fit in <Code>{tgt}</Code>. Bits were dropped (overflow) or the
            fraction was truncated — the result is <Code>{display(tgtStored, tgt)}</Code>, not{" "}
            <Code>{display(srcStored, src)}</Code>.
          </Text>
        </Callout>
      )}
    </Stack>
  );
}

type AnimalType = "Dog" | "Cat";
type CastTarget = "Animal" | "Dog" | "Cat";

function ReferenceCasting() {
  const theme = useHostTheme();
  const [actual, setActual] = useCanvasState<AnimalType>("ref.actual", "Dog");
  const [target, setTarget] = useCanvasState<CastTarget>("ref.target", "Cat");

  const targetOpts = [
    { label: "Animal", value: "Animal" },
    { label: "Dog", value: "Dog" },
    { label: "Cat", value: "Cat" },
  ];

  const upcast = target === "Animal";
  const ok = upcast || target === actual;

  return (
    <Stack gap={20}>
      <Text tone="secondary">
        Reference casting changes the <Text as="span" weight="semibold">view</Text> of an object,
        never the object itself. Upcasting to a parent is always safe; downcasting to a child is
        checked at runtime and throws <Code>ClassCastException</Code> when the object is not really
        that type.
      </Text>

      <Card>
        <CardHeader>Class hierarchy</CardHeader>
        <CardBody>
          <Code>class Animal {"{}"}{"  "}class Dog extends Animal {"{}"}{"  "}class Cat extends Animal {"{}"}</Code>
        </CardBody>
      </Card>

      <Grid columns="1fr 1fr" gap={16}>
        <Stack gap={6}>
          <Text size="small" weight="semibold" tone="secondary">Actual object created</Text>
          <Select
            value={actual}
            options={[{ label: "new Dog()", value: "Dog" }, { label: "new Cat()", value: "Cat" }]}
            onChange={(v) => setActual(v as AnimalType)}
            style={selectStyle(theme)}
          />
        </Stack>
        <Stack gap={6}>
          <Text size="small" weight="semibold" tone="secondary">Cast it to</Text>
          <Select value={target} options={targetOpts} onChange={(v) => setTarget(v as CastTarget)} style={selectStyle(theme)} />
        </Stack>
      </Grid>

      <Card>
        <CardHeader trailing={upcast ? "Upcast" : "Downcast"}>Generated Java</CardHeader>
        <CardBody>
          <Stack gap={4}>
            <Code>Animal a = new {actual}();</Code>
            <Code>{target} x = {upcast ? "a" : `(${target}) a`};</Code>
          </Stack>
        </CardBody>
      </Card>

      <Stack gap={8}>
        <H3>instanceof checks</H3>
        <Table
          headers={["Expression", "Result"]}
          columnAlign={["left", "center"]}
          rows={[
            ["a instanceof Animal", "true"],
            ["a instanceof Dog", String(actual === "Dog")],
            ["a instanceof Cat", String(actual === "Cat")],
          ]}
          rowTone={[
            "success",
            actual === "Dog" ? "success" : "neutral",
            actual === "Cat" ? "success" : "neutral",
          ]}
        />
      </Stack>

      {ok ? (
        <Callout tone="success" title="Cast succeeds">
          <Text size="small">
            {upcast
              ? "Every Dog and Cat is an Animal, so upcasting always works (and needs no cast operator)."
              : `The object really is a ${actual}, so the downcast is valid at runtime.`}
          </Text>
        </Callout>
      ) : (
        <Callout tone="danger" title="ClassCastException at runtime">
          <Text size="small">
            This compiles (both are Animals), but the object is a <Code>{actual}</Code>, not a{" "}
            <Code>{target}</Code>. Guard with <Code>if (a instanceof {target})</Code> before casting.
          </Text>
        </Callout>
      )}
    </Stack>
  );
}

function AutoboxingParsing() {
  const [raw, setRaw] = useCanvasState<string>("box.raw", "42");

  const trimmed = raw.trim();
  const asInt = /^[+-]?\d+$/.test(trimmed) ? parseInt(trimmed, 10) : null;
  const asDouble = trimmed !== "" && Number.isFinite(Number(trimmed)) ? Number(trimmed) : null;

  return (
    <Stack gap={20}>
      <Stack gap={8}>
        <H3>Autoboxing & unboxing</H3>
        <Text tone="secondary">
          Java auto-converts between primitives and their wrapper objects. This is a different kind
          of conversion from casting — it boxes a value into an object or unboxes it back.
        </Text>
        <Table
          headers={["Code", "What happens"]}
          columnAlign={["left", "left"]}
          rows={[
            ["Integer boxed = 5;", "Autoboxing: int → Integer"],
            ["int prim = boxed;", "Unboxing: Integer → int"],
            ["list.add(10);", "Autoboxes 10 into Integer for List<Integer>"],
            ["Integer n = null; int x = n;", "Unboxing null → NullPointerException"],
          ]}
          rowTone={["info", "info", "neutral", "danger"]}
        />
      </Stack>

      <Divider />

      <Stack gap={10}>
        <H3>String → number parsing</H3>
        <Stack gap={6}>
          <Text size="small" weight="semibold" tone="secondary">Input string</Text>
          <TextInput value={raw} onChange={setRaw} placeholder='e.g. 42  or  3.14  or  abc' />
        </Stack>

        <Table
          headers={["Call", "Result"]}
          columnAlign={["left", "left"]}
          rows={[
            [
              `Integer.parseInt("${trimmed}")`,
              asInt !== null ? String(asInt) : "NumberFormatException",
            ],
            [
              `Double.parseDouble("${trimmed}")`,
              asDouble !== null ? String(asDouble) : "NumberFormatException",
            ],
            [
              `String.valueOf(${asInt !== null ? asInt : asDouble !== null ? asDouble : "x"})`,
              asInt !== null || asDouble !== null ? `"${trimmed}"` : "—",
            ],
          ]}
          rowTone={[
            asInt !== null ? "success" : "danger",
            asDouble !== null ? "success" : "danger",
            "neutral",
          ]}
        />

        {asInt === null && asDouble === null && (
          <Callout tone="danger" title="Not a valid number">
            <Text size="small">
              <Code>"{trimmed}"</Code> cannot be parsed — both parse calls throw{" "}
              <Code>NumberFormatException</Code>.
            </Text>
          </Callout>
        )}
        {asInt === null && asDouble !== null && (
          <Callout tone="warning" title="Decimal, not an integer">
            <Text size="small">
              <Code>parseInt</Code> rejects the decimal point; use <Code>parseDouble</Code> for{" "}
              <Code>{trimmed}</Code>.
            </Text>
          </Callout>
        )}
      </Stack>
    </Stack>
  );
}

function Cheatsheet() {
  return (
    <Stack gap={20}>
      <Stack gap={10}>
        <H3>Primitive conversion summary</H3>
        <Table
          headers={["From", "To", "How", "Note"]}
          columnAlign={["left", "left", "left", "left"]}
          rows={[
            ["byte", "int / long / double", "Automatic", "Always safe"],
            ["int", "long", "Automatic", "Always safe"],
            ["int", "double", "Automatic", "Safe"],
            ["int", "float", "Automatic", "May lose precision"],
            ["long", "float / double", "Automatic", "May lose precision"],
            ["double", "int", "(int) cast", "Truncates fraction"],
            ["int", "byte", "(byte) cast", "Overflow wraps"],
            ["int", "char", "(char) cast", "Code-unit reinterpret"],
          ]}
        />
      </Stack>

      <Stack gap={10}>
        <H3>Key gotchas</H3>
        <Grid columns="1fr 1fr" gap={16}>
          <Callout tone="warning" title="Integer division before cast">
            <Text size="small">
              <Code>double r = 5 / 2;</Code> gives <Code>2.0</Code>, not <Code>2.5</Code> — the
              division happens in <Code>int</Code> first. Cast an operand:{" "}
              <Code>(double) 5 / 2</Code>.
            </Text>
          </Callout>
          <Callout tone="danger" title="Overflow is silent">
            <Text size="small">
              <Code>(byte) 130</Code> is <Code>-126</Code>. No error, no warning — the high bits are
              simply dropped.
            </Text>
          </Callout>
          <Callout tone="info" title="char is a number">
            <Text size="small">
              <Code>int code = 'A';</Code> yields <Code>65</Code>. Arithmetic on{" "}
              <Code>char</Code> promotes it to <Code>int</Code>.
            </Text>
          </Callout>
          <Callout tone="neutral" title="Downcast needs a check">
            <Text size="small">
              Always pair a reference downcast with <Code>instanceof</Code> to avoid{" "}
              <Code>ClassCastException</Code>.
            </Text>
          </Callout>
        </Grid>
      </Stack>
    </Stack>
  );
}

function selectStyle(theme: ReturnType<typeof useHostTheme>) {
  return { background: theme.bg.elevated, color: theme.text.primary } as const;
}

function resultBox(theme: ReturnType<typeof useHostTheme>, color: string) {
  return {
    padding: "12px 14px",
    borderRadius: 6,
    fontFamily: "var(--font-mono, monospace)",
    fontSize: 15,
    background: theme.fill.tertiary,
    border: `1px solid ${theme.stroke.tertiary}`,
    color,
  } as const;
}
