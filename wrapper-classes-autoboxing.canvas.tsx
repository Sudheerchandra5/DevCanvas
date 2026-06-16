import {
  H1, H3, Text, Code, Card, CardHeader, CardBody, Stack, Row, Grid,
  Table, Pill, Callout, Divider, TextInput, useCanvasState, useHostTheme
} from "cursor/canvas";

interface Wrapper {
  prim: string;
  wrapper: string;
  bits: number;
  bytes: number;
  min: string;
  max: string;
}

const WRAPPERS: Wrapper[] = [
  { prim: "byte", wrapper: "Byte", bits: 8, bytes: 1, min: "-128", max: "127" },
  { prim: "short", wrapper: "Short", bits: 16, bytes: 2, min: "-32768", max: "32767" },
  { prim: "int", wrapper: "Integer", bits: 32, bytes: 4, min: "-2147483648", max: "2147483647" },
  { prim: "long", wrapper: "Long", bits: 64, bytes: 8, min: "-9223372036854775808", max: "9223372036854775807" },
  { prim: "float", wrapper: "Float", bits: 32, bytes: 4, min: "1.4E-45", max: "3.4028235E38" },
  { prim: "double", wrapper: "Double", bits: 64, bytes: 8, min: "4.9E-324", max: "1.7976931348623157E308" },
  { prim: "char", wrapper: "Character", bits: 16, bytes: 2, min: "'\\u0000'", max: "'\\uffff'" },
  { prim: "boolean", wrapper: "Boolean", bits: 1, bytes: 0, min: "false", max: "true" },
];

const TABS = [
  { id: "pairs", label: "Primitives & Wrappers" },
  { id: "box", label: "Autoboxing" },
  { id: "cache", label: "== vs equals (cache)" },
  { id: "pitfalls", label: "Pitfalls" },
  { id: "cheat", label: "Cheatsheet" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function WrapperClassesAutoboxing() {
  const [tab, setTab] = useCanvasState<TabId>("wrap.tab", "pairs");
  return (
    <Stack gap={24} style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
      <Stack gap={8}>
        <H1>Wrapper Classes & Autoboxing in Java</H1>
        <Text tone="secondary">
          Every primitive has an object <Text as="span" weight="semibold">wrapper</Text> class so values
          can live where only objects are allowed (collections, generics, <Code>null</Code>). Java
          converts between them automatically — usually invisibly, occasionally dangerously.
        </Text>
      </Stack>

      <Row gap={8} wrap>
        {TABS.map((t) => (
          <span key={t.id}>
            <Pill active={tab === t.id} onClick={() => setTab(t.id)}>{t.label}</Pill>
          </span>
        ))}
      </Row>

      {tab === "pairs" && <Pairs />}
      {tab === "box" && <Autoboxing />}
      {tab === "cache" && <CacheDemo />}
      {tab === "pitfalls" && <Pitfalls />}
      {tab === "cheat" && <Cheatsheet />}
    </Stack>
  );
}

function Pairs() {
  const theme = useHostTheme();
  const [selected, setSelected] = useCanvasState<string>("wrap.sel", "int");
  const w = WRAPPERS.find((x) => x.prim === selected) ?? WRAPPERS[2];

  return (
    <Stack gap={18}>
      <Text tone="secondary">
        Eight primitives, eight wrappers. The wrapper is an immutable object holding a single value,
        plus useful constants and static helper methods.
      </Text>

      <Table
        headers={["Primitive", "Wrapper class", "Bits", "Bytes"]}
        columnAlign={["left", "left", "right", "right"]}
        rows={WRAPPERS.map((x) => [x.prim, x.wrapper, String(x.bits), x.bytes === 0 ? "—" : String(x.bytes)])}
      />

      <Divider />

      <Stack gap={10}>
        <H3>Constants explorer</H3>
        <Row gap={6} wrap>
          {WRAPPERS.map((x) => (
            <span key={x.prim}>
              <Pill size="sm" active={selected === x.prim} onClick={() => setSelected(x.prim)}>{x.wrapper}</Pill>
            </span>
          ))}
        </Row>

        <Grid columns="1fr 1fr" gap={12}>
          <Stack gap={4}>
            <Text size="small" tone="secondary">{w.wrapper}.MIN_VALUE</Text>
            <span style={box(theme, theme.text.primary)}>{w.min}</span>
          </Stack>
          <Stack gap={4}>
            <Text size="small" tone="secondary">{w.wrapper}.MAX_VALUE</Text>
            <span style={box(theme, theme.accent.primary)}>{w.max}</span>
          </Stack>
        </Grid>

        <Grid columns="1fr 1fr" gap={12}>
          <Stack gap={4}>
            <Text size="small" tone="secondary">{w.wrapper}.SIZE (bits)</Text>
            <span style={box(theme, theme.text.primary)}>{w.bits}</span>
          </Stack>
          <Stack gap={4}>
            <Text size="small" tone="secondary">{w.wrapper}.BYTES</Text>
            <span style={box(theme, theme.text.primary)}>{w.bytes === 0 ? "n/a" : w.bytes}</span>
          </Stack>
        </Grid>

        <Card>
          <CardHeader>Common static helpers on {w.wrapper}</CardHeader>
          <CardBody>
            <Stack gap={4}>
              <Code>{w.wrapper}.valueOf({sampleLiteral(w)}){"   "}// boxed value (preferred over new)</Code>
              {w.prim !== "boolean" && w.prim !== "char" && (
                <Code>{w.wrapper}.parse{w.wrapper.replace("Integer", "Int")}("{sampleParse(w)}"){"   "}// String → {w.prim}</Code>
              )}
              <Code>{w.wrapper}.compare(a, b){"   "}// -1 / 0 / 1</Code>
              <Code>String.valueOf(x){"   "}// {w.prim} → String</Code>
            </Stack>
          </CardBody>
        </Card>
      </Stack>
    </Stack>
  );
}

function sampleLiteral(w: Wrapper): string {
  if (w.prim === "boolean") return "true";
  if (w.prim === "char") return "'A'";
  if (w.prim === "double" || w.prim === "float") return "3.14";
  return "42";
}
function sampleParse(w: Wrapper): string {
  if (w.prim === "double" || w.prim === "float") return "3.14";
  return "42";
}

function Autoboxing() {
  const [vStr, setV] = useCanvasState<string>("wrap.boxv", "42");
  const v = vStr.trim() === "" ? 0 : Number(vStr);

  return (
    <Stack gap={18}>
      <Grid columns="1fr 1fr" gap={16}>
        <Stack gap={6}>
          <H3>Autoboxing</H3>
          <Text tone="secondary" size="small">
            Primitive → wrapper, automatically. The compiler inserts a call to{" "}
            <Code>Wrapper.valueOf(...)</Code>.
          </Text>
          <Code>Integer a = {Number.isFinite(v) ? v : 0};{"   "}// Integer.valueOf({Number.isFinite(v) ? v : 0})</Code>
        </Stack>
        <Stack gap={6}>
          <H3>Unboxing</H3>
          <Text tone="secondary" size="small">
            Wrapper → primitive, automatically. The compiler inserts a call to{" "}
            <Code>wrapper.intValue()</Code> (or <Code>doubleValue()</Code>, …).
          </Text>
          <Code>int b = a;{"   "}// a.intValue() == {Number.isFinite(v) ? v : 0}</Code>
        </Stack>
      </Grid>

      <Stack gap={6}>
        <Text size="small" weight="semibold" tone="secondary">Try a value</Text>
        <span style={{ width: 120 }}><TextInput value={vStr} onChange={setV} type="number" /></span>
      </Stack>

      <Stack gap={8}>
        <H3>Where conversions happen</H3>
        <Table
          headers={["Code", "What the compiler does", "Kind"]}
          columnAlign={["left", "left", "left"]}
          rows={[
            ["Integer a = 5;", "Integer.valueOf(5)", "Autobox"],
            ["int b = a;", "a.intValue()", "Unbox"],
            ["list.add(10);", "list.add(Integer.valueOf(10))", "Autobox"],
            ["int x = list.get(0);", "list.get(0).intValue()", "Unbox"],
            ["Integer s = a + 1;", "unbox a, add, Integer.valueOf(sum)", "Both"],
            ["if (boolObj) { }", "boolObj.booleanValue()", "Unbox"],
          ]}
          rowTone={["info", "neutral", "info", "neutral", "warning", "neutral"]}
        />
      </Stack>

      <Callout tone="warning" title="Hidden cost in loops">
        <Text size="small">
          <Code>Long sum = 0L; for (long i...) sum += i;</Code> boxes/unboxes on every iteration —
          allocating millions of objects. Use the primitive <Code>long sum</Code> in hot loops.
        </Text>
      </Callout>
    </Stack>
  );
}

function CacheDemo() {
  const theme = useHostTheme();
  const [vStr, setV] = useCanvasState<string>("wrap.cachev", "100");
  const v = Math.trunc(Number(vStr));
  const valid = Number.isFinite(v);
  const cached = valid && v >= -128 && v <= 127;

  return (
    <Stack gap={18}>
      <Text tone="secondary">
        The most famous autoboxing trap. <Code>Integer.valueOf</Code> caches small values
        (<Code>-128</Code> to <Code>127</Code>), so two boxed ints in that range are the{" "}
        <Text as="span" weight="semibold">same object</Text> — and <Code>==</Code> accidentally works.
        Outside the range it breaks.
      </Text>

      <Row gap={10} align="center" wrap>
        <Text size="small" tone="secondary">value =</Text>
        <span style={{ width: 110 }}><TextInput value={vStr} onChange={setV} type="number" /></span>
        {[100, 127, 128, 200, -128, -129].map((n) => (
          <span key={n}>
            <Pill size="sm" active={v === n} onClick={() => setV(String(n))}>{n}</Pill>
          </span>
        ))}
      </Row>

      <Card>
        <CardHeader trailing={cached ? "in cache" : "not cached"}>Generated Java</CardHeader>
        <CardBody>
          <Stack gap={4}>
            <Code>Integer a = {valid ? v : 0};{"   "}// Integer.valueOf({valid ? v : 0})</Code>
            <Code>Integer b = {valid ? v : 0};</Code>
            <Code>a == b{"        "}// reference identity</Code>
            <Code>a.equals(b){"   "}// value equality</Code>
          </Stack>
        </CardBody>
      </Card>

      <Grid columns="1fr 1fr" gap={16}>
        <Stack gap={4}>
          <Text size="small" tone="secondary">a == b</Text>
          <span style={box(theme, cached ? theme.accent.primary : theme.text.primary)}>
            {valid ? String(cached) : "—"}
          </span>
          <Text size="small" tone="tertiary">{cached ? "same cached object" : "two different objects"}</Text>
        </Stack>
        <Stack gap={4}>
          <Text size="small" tone="secondary">a.equals(b)</Text>
          <span style={box(theme, theme.text.primary)}>{valid ? "true" : "—"}</span>
          <Text size="small" tone="tertiary">always compares the value</Text>
        </Stack>
      </Grid>

      {valid && (cached ? (
        <Callout tone="warning" title="Works — but for the wrong reason">
          <Text size="small">
            {v} is in the cache (-128…127), so <Code>a</Code> and <Code>b</Code> point to the same
            object and <Code>==</Code> is <Code>true</Code>. This is luck, not correctness.
          </Text>
        </Callout>
      ) : (
        <Callout tone="danger" title="== is false here">
          <Text size="small">
            {v} is outside the cache, so each box is a new object. <Code>a == b</Code> is{" "}
            <Code>false</Code> even though the values are equal. Always use <Code>.equals()</Code> for
            wrappers.
          </Text>
        </Callout>
      ))}

      <Callout tone="info" title="new always allocates">
        <Text size="small">
          <Code>new Integer(100) == new Integer(100)</Code> is always <Code>false</Code> — the cache only
          applies to <Code>valueOf</Code>/autoboxing. (<Code>new Integer</Code> is deprecated since Java 9.)
        </Text>
      </Callout>
    </Stack>
  );
}

function Pitfalls() {
  const theme = useHostTheme();
  const [isNull, setIsNull] = useCanvasState<boolean>("wrap.null", true);

  return (
    <Stack gap={18}>
      <Stack gap={10}>
        <H3>Unboxing null → NullPointerException</H3>
        <Text tone="secondary" size="small">
          A wrapper can be <Code>null</Code>; a primitive cannot. Unboxing a <Code>null</Code> wrapper
          throws at runtime — one of the most common surprise NPEs.
        </Text>
        <Row gap={8} align="center">
          <Text size="small" tone="secondary">Integer value:</Text>
          <Pill active={isNull} onClick={() => setIsNull(true)}>null</Pill>
          <Pill active={!isNull} onClick={() => setIsNull(false)}>42</Pill>
        </Row>

        <Card>
          <CardHeader trailing={isNull ? "throws" : "ok"}>Generated Java</CardHeader>
          <CardBody>
            <Stack gap={4}>
              <Code>Integer boxed = {isNull ? "null" : "42"};</Code>
              <Code>int prim = boxed;{"   "}// boxed.intValue()</Code>
            </Stack>
          </CardBody>
        </Card>

        {isNull ? (
          <Callout tone="danger" title="NullPointerException">
            <Text size="small">
              <Code>boxed.intValue()</Code> is called on <Code>null</Code>. Guard with a null check or
              use <Code>Optional</Code> / a default before unboxing.
            </Text>
          </Callout>
        ) : (
          <Callout tone="success" title="Safe">
            <Text size="small"><Code>prim</Code> becomes 42 — the wrapper held a real value.</Text>
          </Callout>
        )}
      </Stack>

      <Divider />

      <Grid columns="1fr 1fr" gap={16}>
        <Callout tone="warning" title="Ternary forces a common type">
          <Text size="small">
            <Code>true ? 1 : 2.0</Code> unboxes both branches to <Code>double</Code>, yielding{" "}
            <Code>1.0</Code>, not <Code>1</Code>. Mixed wrapper types in <Code>?:</Code> can NPE too.
          </Text>
        </Callout>
        <Callout tone="info" title="== compares references">
          <Text size="small">
            For wrappers, <Code>==</Code> tests object identity. Use <Code>.equals()</Code> or unbox to
            a primitive first.
          </Text>
        </Callout>
      </Grid>

      <Card>
        <CardHeader>Safe patterns</CardHeader>
        <CardBody>
          <Stack gap={4}>
            <Code>if (boxed != null) {"{"} int x = boxed; {"}"}</Code>
            <Code>int x = (boxed != null) ? boxed : 0;</Code>
            <Code>int x = Objects.requireNonNullElse(boxed, 0);</Code>
          </Stack>
        </CardBody>
      </Card>
    </Stack>
  );
}

function Cheatsheet() {
  return (
    <Stack gap={20}>
      <Stack gap={10}>
        <H3>Rules to remember</H3>
        <Table
          headers={["Topic", "Detail"]}
          columnAlign={["left", "left"]}
          rows={[
            ["8 pairs", "int↔Integer, char↔Character, boolean↔Boolean, etc."],
            ["Autobox", "primitive → wrapper via Wrapper.valueOf(...)"],
            ["Unbox", "wrapper → primitive via wrapper.xxxValue()"],
            ["Integer cache", "valueOf caches -128…127 (same object)"],
            ["== on wrappers", "compares references — use .equals()"],
            ["null unboxing", "throws NullPointerException"],
            ["new Wrapper(...)", "deprecated — always use valueOf / literals"],
            ["Immutability", "all wrapper objects are immutable"],
            ["Hot loops", "use primitives to avoid boxing churn"],
          ]}
          rowTone={["neutral", "info", "info", "warning", "warning", "danger", "neutral", "neutral", "warning"]}
        />
      </Stack>

      <Grid columns="1fr 1fr" gap={16}>
        <Callout tone="success" title="Why wrappers exist">
          <Text size="small">
            Collections and generics only hold objects: <Code>List&lt;Integer&gt;</Code>, never{" "}
            <Code>List&lt;int&gt;</Code>. Wrappers also allow <Code>null</Code> and carry handy
            constants/methods.
          </Text>
        </Callout>
        <Callout tone="info" title="Useful constants">
          <Text size="small">
            <Code>Integer.MAX_VALUE</Code>, <Code>Long.BYTES</Code>, <Code>Double.SIZE</Code>,{" "}
            <Code>Character.isDigit(c)</Code>, <Code>Integer.toBinaryString(n)</Code>.
          </Text>
        </Callout>
      </Grid>
    </Stack>
  );
}

function box(theme: ReturnType<typeof useHostTheme>, color: string) {
  return {
    padding: "10px 14px",
    borderRadius: 6,
    fontFamily: "var(--font-mono, monospace)",
    fontSize: 15,
    background: theme.fill.tertiary,
    border: `1px solid ${theme.stroke.tertiary}`,
    color,
    wordBreak: "break-all" as const,
  } as const;
}
