import {
  H1, H3, Text, Code, Card, CardHeader, CardBody, Stack, Row, Grid,
  Table, Pill, Callout, Divider, TextInput, useCanvasState, useHostTheme
} from "cursor/canvas";

function parseInts(s: string): number[] {
  return s.split(",").map((x) => x.trim()).filter((x) => x !== "").map((x) => Math.trunc(Number(x)) || 0);
}

const TABS = [
  { id: "basics", label: "Basics" },
  { id: "index", label: "Indexing & Access" },
  { id: "ops", label: "Operations" },
  { id: "twod", label: "2D / Jagged" },
  { id: "pitfalls", label: "Pitfalls" },
  { id: "cheat", label: "Cheatsheet" },
] as const;
type TabId = (typeof TABS)[number]["id"];

export default function ArraysInJava() {
  const [tab, setTab] = useCanvasState<TabId>("arr.tab", "basics");
  return (
    <Stack gap={24} style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
      <Stack gap={8}>
        <H1>Arrays in Java</H1>
        <Text tone="secondary">
          An array is a <Text as="span" weight="semibold">fixed-size</Text>, indexed container of one type,
          stored as an <Text as="span" weight="semibold">object on the heap</Text>. The variable holds a
          reference; the object carries the elements and a <Code>length</Code> field. Explore each layer below.
        </Text>
      </Stack>

      <Row gap={8} wrap>
        {TABS.map((t) => (
          <span key={t.id}><Pill active={tab === t.id} onClick={() => setTab(t.id)}>{t.label}</Pill></span>
        ))}
      </Row>

      {tab === "basics" && <Basics />}
      {tab === "index" && <Indexing />}
      {tab === "ops" && <Operations />}
      {tab === "twod" && <TwoD />}
      {tab === "pitfalls" && <Pitfalls />}
      {tab === "cheat" && <Cheatsheet />}
    </Stack>
  );
}

function ArrayBoxes({ values, highlight, error }: { values: (string | number)[]; highlight?: number; error?: number }) {
  const theme = useHostTheme();
  return (
    <Row gap={6} wrap>
      {values.map((v, i) => {
        const on = i === highlight;
        const bad = i === error;
        return (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{
              minWidth: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: 6, fontFamily: "var(--font-mono, monospace)", fontSize: 14,
              background: on ? theme.accent.primary : theme.fill.tertiary,
              color: on ? theme.text.onAccent : theme.text.primary,
              border: `1px solid ${bad ? theme.accent.primary : on ? theme.accent.primary : theme.stroke.tertiary}`,
              padding: "0 8px",
            }}>{String(v)}</div>
            <span style={{ fontSize: 11, color: on ? theme.accent.primary : theme.text.quaternary, fontFamily: "var(--font-mono, monospace)" }}>[{i}]</span>
          </div>
        );
      })}
    </Row>
  );
}

const DEFAULTS: Record<string, string> = {
  int: "0", long: "0", short: "0", byte: "0",
  double: "0.0", float: "0.0",
  boolean: "false",
  char: "'\\u0000'",
  String: "null",
};

function Basics() {
  const theme = useHostTheme();
  const [type, setType] = useCanvasState<string>("arr.deftype", "int");
  const def = DEFAULTS[type];

  return (
    <Stack gap={18}>
      <Stack gap={10}>
        <H3>Ways to create an array</H3>
        <Card>
          <CardHeader>Declaration & initialization</CardHeader>
          <CardBody>
            <Stack gap={4}>
              <Code>int[] a;{"                 "}// declares a reference (null), no array yet</Code>
              <Code>a = new int[5];{"          "}// allocates 5 slots, all default 0</Code>
              <Code>int[] b = {"{"}10, 20, 30{"}"};{"     "}// array literal — size inferred (3)</Code>
              <Code>int[] c = new int[]{"{"}1, 2{"}"};{"   "}// explicit form (needed in returns/args)</Code>
              <Code>int[][] grid = new int[3][4];{" "}// 2D: 3 rows, 4 columns</Code>
            </Stack>
          </CardBody>
        </Card>
        <Callout tone="warning" title="int[] a vs int a[]">
          <Text size="small">
            Both compile, but <Code>int[] a</Code> is preferred — the <Code>[]</Code> belongs to the type, not the
            name. Note <Code>int[] a, b;</Code> makes <Text as="span" weight="semibold">both</Text> arrays;{" "}
            <Code>int a[], b;</Code> makes only <Code>a</Code> an array.
          </Text>
        </Callout>
      </Stack>

      <Divider />

      <Stack gap={10}>
        <H3>Default values</H3>
        <Text tone="secondary" size="small">
          <Code>new T[n]</Code> never leaves elements uninitialized — every slot gets the type's default.
        </Text>
        <Row gap={6} wrap>
          {Object.keys(DEFAULTS).map((t) => (
            <span key={t}><Pill size="sm" active={type === t} onClick={() => setType(t)}>{t}</Pill></span>
          ))}
        </Row>
        <Code>{type}[] arr = new {type}[3];</Code>
        <ArrayBoxes values={[def, def, def]} />
        <Text size="small" tone="tertiary">
          Reference types (like <Code>String</Code>, arrays, objects) default to <Code>null</Code> — a common
          source of <Code>NullPointerException</Code> when you forget to fill them.
        </Text>
      </Stack>

      <Divider />

      <Stack gap={8}>
        <H3>Memory model</H3>
        <Grid columns="1fr 1fr" gap={16}>
          <Callout tone="info" title="Arrays are objects">
            <Text size="small">
              <Code>a.length</Code> is a field (no parentheses). The array lives on the heap; the variable on the
              stack holds only a reference to it.
            </Text>
          </Callout>
          <Callout tone="neutral" title="Fixed size">
            <Text size="small">
              Length is set at creation and can never change. Need growth? Use <Code>ArrayList</Code> or create a
              bigger array and copy.
            </Text>
          </Callout>
        </Grid>
      </Stack>
    </Stack>
  );
}

function Indexing() {
  const theme = useHostTheme();
  const [arrStr, setArr] = useCanvasState<string>("arr.idxarr", "10, 20, 30, 40, 50");
  const [idxStr, setIdx] = useCanvasState<string>("arr.idx", "2");
  const arr = parseInts(arrStr);
  const idx = Math.trunc(Number(idxStr));
  const valid = Number.isFinite(idx) && idx >= 0 && idx < arr.length;

  return (
    <Stack gap={16}>
      <Text tone="secondary">
        Indices are <Text as="span" weight="semibold">0-based</Text>: the first element is <Code>a[0]</Code>, the
        last is <Code>a[length - 1]</Code>. Going outside that range throws at runtime.
      </Text>

      <Row gap={8} align="center" wrap>
        <Text size="small" tone="secondary">array =</Text>
        <span style={{ width: 240 }}><TextInput value={arrStr} onChange={setArr} /></span>
        <Pill size="sm">length = {arr.length}</Pill>
      </Row>

      <ArrayBoxes values={arr} highlight={valid ? idx : undefined} error={!valid ? idx : undefined} />

      <Row gap={8} align="center" wrap>
        <Text size="small" tone="secondary">access a[</Text>
        <span style={{ width: 70 }}><TextInput value={idxStr} onChange={setIdx} type="number" /></span>
        <Text size="small" tone="secondary">]</Text>
      </Row>

      {valid ? (
        <Callout tone="success" title={`a[${idx}] = ${arr[idx]}`}>
          <Text size="small">Valid index — returns the highlighted element in O(1) constant time.</Text>
        </Callout>
      ) : (
        <Callout tone="danger" title="ArrayIndexOutOfBoundsException">
          <Text size="small">
            Index {Number.isFinite(idx) ? idx : "?"} is outside <Code>0 .. {arr.length - 1}</Code>. Java checks
            every access and throws <Code>ArrayIndexOutOfBoundsException: Index {Number.isFinite(idx) ? idx : "?"}
            {" "}out of bounds for length {arr.length}</Code>.
          </Text>
        </Callout>
      )}

      <Callout tone="info" title="Iterating safely">
        <Text size="small">
          <Code>for (int i = 0; i &lt; a.length; i++)</Code> when you need the index;{" "}
          <Code>for (int x : a)</Code> when you only need values.
        </Text>
      </Callout>
    </Stack>
  );
}

type Op = "sort" | "fill" | "copyOf" | "toString" | "binarySearch";

function Operations() {
  const theme = useHostTheme();
  const [arrStr, setArr] = useCanvasState<string>("arr.opsarr", "5, 2, 8, 1, 9, 3");
  const [op, setOp] = useCanvasState<Op>("arr.op", "sort");
  const [fillVal, setFill] = useCanvasState<string>("arr.fill", "7");
  const [copyLen, setCopyLen] = useCanvasState<string>("arr.copylen", "8");
  const [key, setKey] = useCanvasState<string>("arr.key", "8");

  const base = parseInts(arrStr);
  let resultArr: number[] | null = null;
  let resultText = "";
  let call = "";

  if (op === "sort") {
    resultArr = [...base].sort((a, b) => a - b);
    call = "Arrays.sort(a);";
  } else if (op === "fill") {
    const v = Math.trunc(Number(fillVal) || 0);
    resultArr = base.map(() => v);
    call = `Arrays.fill(a, ${v});`;
  } else if (op === "copyOf") {
    const L = Math.max(0, Math.trunc(Number(copyLen) || 0));
    resultArr = Array.from({ length: L }, (_, i) => (i < base.length ? base[i] : 0));
    call = `int[] b = Arrays.copyOf(a, ${L});`;
  } else if (op === "toString") {
    resultText = "[" + base.join(", ") + "]";
    call = "Arrays.toString(a)";
  } else {
    const sorted = [...base].sort((a, b) => a - b);
    const k = Math.trunc(Number(key) || 0);
    const found = sorted.indexOf(k);
    const ins = sorted.findIndex((x) => x > k);
    const insertion = ins === -1 ? sorted.length : ins;
    resultText = found !== -1 ? `index ${found}` : `${-insertion - 1} (not found)`;
    call = `Arrays.binarySearch(a, ${k})  // array must be sorted`;
  }

  return (
    <Stack gap={16}>
      <Row gap={8} align="center" wrap>
        <Text size="small" tone="secondary">array =</Text>
        <span style={{ width: 240 }}><TextInput value={arrStr} onChange={setArr} /></span>
      </Row>

      <Row gap={8} wrap>
        {(["sort", "fill", "copyOf", "toString", "binarySearch"] as Op[]).map((o) => (
          <span key={o}><Pill active={op === o} onClick={() => setOp(o)}>{o}</Pill></span>
        ))}
      </Row>

      {op === "fill" && (
        <Row gap={8} align="center"><Text size="small" tone="secondary">value =</Text>
          <span style={{ width: 80 }}><TextInput value={fillVal} onChange={setFill} type="number" /></span></Row>
      )}
      {op === "copyOf" && (
        <Row gap={8} align="center"><Text size="small" tone="secondary">new length =</Text>
          <span style={{ width: 80 }}><TextInput value={copyLen} onChange={setCopyLen} type="number" /></span></Row>
      )}
      {op === "binarySearch" && (
        <Row gap={8} align="center"><Text size="small" tone="secondary">key =</Text>
          <span style={{ width: 80 }}><TextInput value={key} onChange={setKey} type="number" /></span></Row>
      )}

      <Card>
        <CardHeader trailing="java.util.Arrays">{call}</CardHeader>
        <CardBody>
          {resultArr ? <ArrayBoxes values={resultArr} /> : <span style={box(theme, theme.accent.primary)}>{resultText}</span>}
        </CardBody>
      </Card>

      {op === "binarySearch" && (
        <Callout tone="warning" title="Sort first">
          <Text size="small">
            <Code>Arrays.binarySearch</Code> requires a sorted array. If the key is missing it returns{" "}
            <Code>-(insertionPoint) - 1</Code>, a negative number you can convert back to where it would go.
          </Text>
        </Callout>
      )}
      {op === "copyOf" && (
        <Callout tone="info" title="Resize by copying">
          <Text size="small">
            A longer copy is padded with defaults (0); a shorter copy truncates. The original <Code>a</Code> is
            unchanged — <Code>copyOf</Code> returns a new array.
          </Text>
        </Callout>
      )}
      {op === "sort" && (
        <Callout tone="info" title="In place & dual-pivot">
          <Text size="small">
            <Code>Arrays.sort</Code> mutates the array. For primitives it uses a fast dual-pivot quicksort; for
            objects, a stable TimSort.
          </Text>
        </Callout>
      )}
    </Stack>
  );
}

function TwoD() {
  const theme = useHostTheme();
  const [rowsStr, setRows] = useCanvasState<string>("arr.rows", "3");
  const [colsStr, setCols] = useCanvasState<string>("arr.cols", "4");
  const [jagged, setJagged] = useCanvasState<boolean>("arr.jagged", false);
  const rows = Math.max(1, Math.min(6, Math.trunc(Number(rowsStr) || 1)));
  const cols = Math.max(1, Math.min(8, Math.trunc(Number(colsStr) || 1)));

  const matrix = Array.from({ length: rows }, (_, i) => {
    const len = jagged ? i + 1 : cols;
    return Array.from({ length: len }, (_, j) => i * cols + j);
  });

  return (
    <Stack gap={16}>
      <Text tone="secondary">
        A 2D array is really an <Text as="span" weight="semibold">array of arrays</Text>. Each row is a separate
        object, so rows can even have different lengths (a <Text as="span" weight="semibold">jagged</Text> array).
      </Text>

      <Row gap={8} align="center" wrap>
        <Text size="small" tone="secondary">rows =</Text>
        <span style={{ width: 60 }}><TextInput value={rowsStr} onChange={setRows} type="number" /></span>
        <Text size="small" tone="secondary">cols =</Text>
        <span style={{ width: 60 }}><TextInput value={colsStr} onChange={setCols} type="number" /></span>
        <Pill active={!jagged} onClick={() => setJagged(false)}>rectangular</Pill>
        <Pill active={jagged} onClick={() => setJagged(true)}>jagged</Pill>
      </Row>

      <Code>
        int[][] m = {jagged ? "new int[" + rows + "][];  // fill rows yourself" : "new int[" + rows + "][" + cols + "];"}
      </Code>

      <Stack gap={6}>
        {matrix.map((row, i) => (
          <span key={i} style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ width: 54, fontFamily: "var(--font-mono, monospace)", fontSize: 12, color: theme.text.secondary }}>m[{i}]</span>
            {row.map((val, j) => (
              <div key={j} style={{
                minWidth: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: 6, fontFamily: "var(--font-mono, monospace)", fontSize: 13,
                background: theme.fill.tertiary, color: theme.text.primary, border: `1px solid ${theme.stroke.tertiary}`,
              }}>{val}</div>
            ))}
            <span style={{ fontSize: 11, color: theme.text.quaternary, marginLeft: 4 }}>length {row.length}</span>
          </span>
        ))}
      </Stack>

      <Grid columns="1fr 1fr" gap={16}>
        <Callout tone="info" title="Dimensions">
          <Text size="small">
            <Code>m.length</Code> = number of rows ({rows}); <Code>m[i].length</Code> = that row's column count.
            Iterate with nested loops.
          </Text>
        </Callout>
        <Callout tone="neutral" title="Access">
          <Text size="small">
            <Code>m[i][j]</Code> reads row <Code>i</Code>, column <Code>j</Code>. With a jagged array, valid{" "}
            <Code>j</Code> depends on the specific row.
          </Text>
        </Callout>
      </Grid>
    </Stack>
  );
}

function Pitfalls() {
  const theme = useHostTheme();
  const [mode, setMode] = useCanvasState<"alias" | "copy">("arr.aliasmode", "alias");
  const [valStr, setVal] = useCanvasState<string>("arr.aliasval", "99");
  const v = Math.trunc(Number(valStr) || 0);

  const original = [1, 2, 3];
  const aShown = mode === "alias" ? [v, 2, 3] : [1, 2, 3];
  const bShown = [v, 2, 3];

  return (
    <Stack gap={18}>
      <Stack gap={10}>
        <H3>Aliasing vs copying</H3>
        <Text tone="secondary" size="small">
          Assigning one array to another copies the <Text as="span" weight="semibold">reference</Text>, not the
          elements. Both names point to the same object until you make a real copy.
        </Text>
        <Row gap={8} align="center" wrap>
          <Pill active={mode === "alias"} onClick={() => setMode("alias")}>int[] b = a;</Pill>
          <Pill active={mode === "copy"} onClick={() => setMode("copy")}>int[] b = a.clone();</Pill>
          <Text size="small" tone="secondary">then b[0] =</Text>
          <span style={{ width: 70 }}><TextInput value={valStr} onChange={setVal} type="number" /></span>
        </Row>

        <Grid columns="1fr 1fr" gap={16}>
          <Stack gap={6}>
            <Text size="small" tone="secondary">a</Text>
            <ArrayBoxes values={aShown} highlight={mode === "alias" ? 0 : undefined} />
          </Stack>
          <Stack gap={6}>
            <Text size="small" tone="secondary">b</Text>
            <ArrayBoxes values={bShown} highlight={0} />
          </Stack>
        </Grid>

        {mode === "alias" ? (
          <Callout tone="danger" title="a changed too">
            <Text size="small">
              <Code>b = a</Code> made both variables reference the same array, so <Code>b[0] = {v}</Code> also
              changed <Code>a[0]</Code>. Use <Code>clone()</Code>, <Code>Arrays.copyOf</Code>, or{" "}
              <Code>System.arraycopy</Code> for an independent copy.
            </Text>
          </Callout>
        ) : (
          <Callout tone="success" title="a is safe">
            <Text size="small">
              <Code>clone()</Code> created a separate array, so modifying <Code>b</Code> leaves <Code>a</Code>{" "}
              untouched. (Note: for arrays of objects, <Code>clone</Code> is still a shallow copy.)
            </Text>
          </Callout>
        )}
      </Stack>

      <Divider />

      <Grid columns="1fr 1fr" gap={16}>
        <Callout tone="warning" title="== compares references">
          <Text size="small">
            <Code>a == b</Code> is <Code>true</Code> only if they are the same object. For contents use{" "}
            <Code>Arrays.equals(a, b)</Code> (or <Code>Arrays.deepEquals</Code> for nested arrays).
          </Text>
        </Callout>
        <Callout tone="info" title="length vs length()">
          <Text size="small">
            Arrays use the field <Code>a.length</Code> (no parentheses). <Code>String</Code> and collections use
            the method <Code>.length()</Code> / <Code>.size()</Code>.
          </Text>
        </Callout>
      </Grid>

      <Callout tone="danger" title="Shallow copy of 2D arrays">
        <Text size="small">
          <Code>Arrays.copyOf(grid, n)</Code> copies the row <Text as="span" weight="semibold">references</Text>,
          not the rows themselves. Editing <Code>copy[0][0]</Code> still affects the original row. Copy each row
          for a deep copy.
        </Text>
      </Callout>
    </Stack>
  );
}

function Cheatsheet() {
  return (
    <Stack gap={20}>
      <Stack gap={10}>
        <H3>Essentials</H3>
        <Table
          headers={["Topic", "Detail"]}
          columnAlign={["left", "left"]}
          rows={[
            ["Create", "new int[5] (defaults) or {1,2,3} (literal)"],
            ["Size", "fixed at creation; a.length is a field"],
            ["Index", "0-based; last is length - 1"],
            ["Bounds", "out-of-range throws ArrayIndexOutOfBoundsException"],
            ["Defaults", "0 / 0.0 / false / '\\u0000' / null"],
            ["Iterate", "indexed for, or for-each for values"],
            ["Copy", "clone(), Arrays.copyOf, System.arraycopy"],
            ["Compare", "Arrays.equals / Arrays.deepEquals, not =="],
            ["Print", "Arrays.toString / Arrays.deepToString"],
            ["2D", "array of arrays; rows can be jagged"],
          ]}
        />
      </Stack>

      <Grid columns="1fr 1fr" gap={16}>
        <Callout tone="info" title="Array vs ArrayList">
          <Text size="small">
            Use an array for fixed size and primitives (no boxing). Use <Code>ArrayList</Code> when the size grows
            or you want rich methods like <Code>add</Code>/<Code>remove</Code>.
          </Text>
        </Callout>
        <Callout tone="warning" title="Useful one-liners">
          <Text size="small">
            <Code>Arrays.stream(a).sum()</Code>, <Code>Arrays.fill(a, x)</Code>,{" "}
            <Code>Arrays.sort(a)</Code>, <Code>List.of(1,2,3)</Code>.
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
    fontSize: 15,
    background: theme.fill.tertiary,
    border: `1px solid ${theme.stroke.tertiary}`,
    color,
    wordBreak: "break-all" as const,
  } as const;
}
