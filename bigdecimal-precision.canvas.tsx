import {
  H1, H3, Text, Code, Card, CardHeader, CardBody, Stack, Row, Grid,
  Table, Pill, Callout, Divider, TextInput, useCanvasState, useHostTheme
} from "cursor/canvas";

type Dec = { u: bigint; scale: number };

function pow10(n: number): bigint {
  return 10n ** BigInt(n);
}

function parseDec(s: string): Dec | null {
  const t = s.trim();
  if (!/^[+-]?(\d+\.?\d*|\.\d+)$/.test(t)) return null;
  const neg = t.startsWith("-");
  const body = t.replace(/^[+-]/, "");
  const [intPart, fracPart = ""] = body.split(".");
  const digits = (intPart + fracPart).replace(/^0+(?=\d)/, "");
  let u = BigInt(digits === "" ? "0" : digits);
  if (neg) u = -u;
  return { u, scale: fracPart.length };
}

function decToString(d: Dec): string {
  const neg = d.u < 0n;
  let s = (neg ? -d.u : d.u).toString();
  if (d.scale <= 0) {
    if (d.scale < 0) s += "0".repeat(-d.scale);
    return (neg ? "-" : "") + s;
  }
  if (s.length <= d.scale) s = "0".repeat(d.scale - s.length + 1) + s;
  const i = s.length - d.scale;
  return (neg ? "-" : "") + s.slice(0, i) + "." + s.slice(i);
}

function precision(d: Dec): number {
  if (d.u === 0n) return 1;
  return (d.u < 0n ? -d.u : d.u).toString().length;
}

type Mode = "UP" | "DOWN" | "CEILING" | "FLOOR" | "HALF_UP" | "HALF_DOWN" | "HALF_EVEN";
const MODES: Mode[] = ["UP", "DOWN", "CEILING", "FLOOR", "HALF_UP", "HALF_DOWN", "HALF_EVEN"];

function roundInc(qAbs: bigint, rAbs: bigint, divAbs: bigint, negative: boolean, mode: Mode): boolean {
  if (rAbs === 0n) return false;
  const twice = rAbs * 2n;
  const cmp = twice < divAbs ? -1 : twice > divAbs ? 1 : 0;
  switch (mode) {
    case "UP": return true;
    case "DOWN": return false;
    case "CEILING": return !negative;
    case "FLOOR": return negative;
    case "HALF_UP": return cmp >= 0;
    case "HALF_DOWN": return cmp > 0;
    case "HALF_EVEN": return cmp > 0 ? true : cmp < 0 ? false : qAbs % 2n === 1n;
  }
}

function rescale(d: Dec, newScale: number, mode: Mode): Dec {
  if (newScale >= d.scale) return { u: d.u * pow10(newScale - d.scale), scale: newScale };
  const drop = d.scale - newScale;
  const div = pow10(drop);
  const neg = d.u < 0n;
  const uAbs = neg ? -d.u : d.u;
  let q = uAbs / div;
  const r = uAbs - q * div;
  if (roundInc(q, r, div, neg, mode)) q += 1n;
  return { u: neg ? -q : q, scale: newScale };
}

function add(a: Dec, b: Dec): Dec {
  const s = Math.max(a.scale, b.scale);
  return { u: a.u * pow10(s - a.scale) + b.u * pow10(s - b.scale), scale: s };
}
function sub(a: Dec, b: Dec): Dec {
  const s = Math.max(a.scale, b.scale);
  return { u: a.u * pow10(s - a.scale) - b.u * pow10(s - b.scale), scale: s };
}
function mul(a: Dec, b: Dec): Dec {
  return { u: a.u * b.u, scale: a.scale + b.scale };
}
function div(a: Dec, b: Dec, scale: number, mode: Mode): Dec | null {
  if (b.u === 0n) return null;
  const p = scale + b.scale - a.scale;
  let num = a.u;
  let den = b.u;
  if (p >= 0) num = a.u * pow10(p);
  else den = b.u * pow10(-p);
  const negative = num < 0n !== den < 0n;
  const numA = num < 0n ? -num : num;
  const denA = den < 0n ? -den : den;
  let q = numA / denA;
  const r = numA - q * denA;
  if (roundInc(q, r, denA, negative, mode)) q += 1n;
  return { u: negative ? -q : q, scale };
}

function compareDec(a: Dec, b: Dec): number {
  const s = Math.max(a.scale, b.scale);
  const ua = a.u * pow10(s - a.scale);
  const ub = b.u * pow10(s - b.scale);
  return ua < ub ? -1 : ua > ub ? 1 : 0;
}

function doubleToExact(d: number): string {
  if (!isFinite(d)) return String(d);
  if (d === 0) return "0";
  const buf = new ArrayBuffer(8);
  const dv = new DataView(buf);
  dv.setFloat64(0, d);
  const hi = dv.getUint32(0);
  const lo = dv.getUint32(4);
  const sign = hi >>> 31 ? "-" : "";
  const exp = (hi >>> 20) & 0x7ff;
  let mant = (BigInt(hi & 0xfffff) << 32n) | BigInt(lo >>> 0);
  let e2: number;
  if (exp === 0) e2 = -1074;
  else { mant += 1n << 52n; e2 = exp - 1075; }
  if (e2 >= 0) return sign + (mant << BigInt(e2)).toString();
  const k = -e2;
  const scaled = mant * 5n ** BigInt(k);
  let str = scaled.toString();
  if (str.length <= k) str = "0".repeat(k - str.length + 1) + str;
  return sign + str.slice(0, str.length - k) + "." + str.slice(str.length - k);
}

const TABS = [
  { id: "why", label: "Why double fails" },
  { id: "ctor", label: "Construction" },
  { id: "arith", label: "Arithmetic" },
  { id: "round", label: "Rounding modes" },
  { id: "eq", label: "compareTo vs equals" },
  { id: "cheat", label: "Cheatsheet" },
] as const;
type TabId = (typeof TABS)[number]["id"];

export default function BigDecimalPrecision() {
  const [tab, setTab] = useCanvasState<TabId>("bd.tab", "why");
  return (
    <Stack gap={24} style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
      <Stack gap={8}>
        <H1>BigDecimal & Precision Arithmetic in Java</H1>
        <Text tone="secondary">
          <Code>double</Code> stores numbers in binary, so most decimals are only approximate.{" "}
          <Code>BigDecimal</Code> stores an exact <Text as="span" weight="semibold">unscaled integer</Text> plus a{" "}
          <Text as="span" weight="semibold">scale</Text>, giving precise base-10 math — for money and anywhere
          rounding must be controlled.
        </Text>
      </Stack>

      <Row gap={8} wrap>
        {TABS.map((t) => (
          <span key={t.id}>
            <Pill active={tab === t.id} onClick={() => setTab(t.id)}>{t.label}</Pill>
          </span>
        ))}
      </Row>

      {tab === "why" && <WhyDouble />}
      {tab === "ctor" && <Construction />}
      {tab === "arith" && <Arithmetic />}
      {tab === "round" && <Rounding />}
      {tab === "eq" && <EqualsTab />}
      {tab === "cheat" && <Cheatsheet />}
    </Stack>
  );
}

type Op = "+" | "−" | "×" | "÷";

function WhyDouble() {
  const theme = useHostTheme();
  const [aStr, setA] = useCanvasState<string>("bd.wa", "0.1");
  const [bStr, setB] = useCanvasState<string>("bd.wb", "0.2");
  const [op, setOp] = useCanvasState<Op>("bd.wop", "+");

  const a = parseDec(aStr);
  const b = parseDec(bStr);
  const na = Number(aStr);
  const nb = Number(bStr);

  let dbl = "";
  if (op === "+") dbl = String(na + nb);
  else if (op === "−") dbl = String(na - nb);
  else if (op === "×") dbl = String(na * nb);
  else dbl = nb === 0 ? "Infinity" : String(na / nb);

  let exact = "—";
  if (a && b) {
    if (op === "+") exact = decToString(add(a, b));
    else if (op === "−") exact = decToString(sub(a, b));
    else if (op === "×") exact = decToString(mul(a, b));
    else {
      const r = div(a, b, 20, "HALF_UP");
      exact = r ? decToString(r).replace(/0+$/, "").replace(/\.$/, "") : "ArithmeticException";
    }
  }

  const differ = dbl !== exact && op !== "÷";

  return (
    <Stack gap={16}>
      <Row gap={8} align="center" wrap>
        <span style={{ width: 110 }}><TextInput value={aStr} onChange={setA} /></span>
        {(["+", "−", "×", "÷"] as Op[]).map((o) => (
          <span key={o}><Pill active={op === o} onClick={() => setOp(o)}>{o}</Pill></span>
        ))}
        <span style={{ width: 110 }}><TextInput value={bStr} onChange={setB} /></span>
        <Pill size="sm" onClick={() => { setA("0.1"); setB("0.2"); setOp("+"); }}>0.1 + 0.2</Pill>
        <Pill size="sm" onClick={() => { setA("1.03"); setB("0.42"); setOp("−"); }}>1.03 − 0.42</Pill>
      </Row>

      <Grid columns="1fr 1fr" gap={16}>
        <Card>
          <CardHeader trailing="binary approximation">double</CardHeader>
          <CardBody><span style={box(theme, differ ? theme.accent.primary : theme.text.primary)}>{dbl}</span></CardBody>
        </Card>
        <Card>
          <CardHeader trailing="exact base-10">BigDecimal</CardHeader>
          <CardBody><span style={box(theme, theme.text.primary)}>{exact}</span></CardBody>
        </Card>
      </Grid>

      {differ ? (
        <Callout tone="danger" title="The results disagree">
          <Text size="small">
            <Code>double</Code> gives <Code>{dbl}</Code> because {aStr} and {bStr} cannot be represented
            exactly in binary. <Code>BigDecimal</Code> keeps the true value <Code>{exact}</Code>.
          </Text>
        </Callout>
      ) : (
        <Callout tone="info" title="Same here — but don't trust it">
          <Text size="small">
            This operation happens to match, but binary rounding error is lurking. Use{" "}
            <Code>BigDecimal</Code> whenever exactness matters (money, billing, tax).
          </Text>
        </Callout>
      )}

      <Callout tone="neutral" title="Never compare money with ==">
        <Text size="small">
          <Code>if (0.1 + 0.2 == 0.3)</Code> is <Code>false</Code> in Java. Floating point equality is a bug
          magnet.
        </Text>
      </Callout>
    </Stack>
  );
}

function Construction() {
  const theme = useHostTheme();
  const [vStr, setV] = useCanvasState<string>("bd.cv", "0.1");
  const n = Number(vStr);
  const valid = vStr.trim() !== "" && isFinite(n);

  const fromDouble = valid ? doubleToExact(n) : "—";
  const fromValueOf = valid ? String(n) : "—";
  const fromString = vStr.trim();

  const exactDec = valid ? parseDec(fromDouble) : null;
  const strDec = parseDec(fromString);
  const noisy = !!(exactDec && strDec && compareDec(exactDec, strDec) !== 0);

  return (
    <Stack gap={16}>
      <Text tone="secondary">
        How you construct a <Code>BigDecimal</Code> decides whether you inherit the double's binary noise.
        This is the single most common <Code>BigDecimal</Code> mistake.
      </Text>

      <Row gap={8} align="center" wrap>
        <Text size="small" tone="secondary">value =</Text>
        <span style={{ width: 140 }}><TextInput value={vStr} onChange={setV} /></span>
        {["0.1", "0.3", "1.005", "2.00"].map((p) => (
          <span key={p}><Pill size="sm" active={vStr === p} onClick={() => setV(p)}>{p}</Pill></span>
        ))}
      </Row>

      <Stack gap={10}>
        <Card>
          <CardHeader trailing={noisy ? "inherits binary noise" : "exact"}>new BigDecimal({fromValueOf}){"  "}// double arg — avoid</CardHeader>
          <CardBody><span style={box(theme, noisy ? theme.accent.primary : theme.text.primary)}>{fromDouble}</span></CardBody>
        </Card>
        <Card>
          <CardHeader trailing="recommended">BigDecimal.valueOf({fromValueOf}){"  "}// uses Double.toString</CardHeader>
          <CardBody><span style={box(theme, theme.text.primary)}>{fromValueOf}</span></CardBody>
        </Card>
        <Card>
          <CardHeader trailing="recommended">new BigDecimal("{fromString}"){"  "}// String arg</CardHeader>
          <CardBody><span style={box(theme, theme.text.primary)}>{fromString}</span></CardBody>
        </Card>
      </Stack>

      {noisy ? (
        <Callout tone="danger" title="new BigDecimal(double) captured the noise">
          <Text size="small">
            The <Code>double</Code> {fromValueOf} is really {fromDouble} in binary, and{" "}
            <Code>new BigDecimal(double)</Code> records every one of those digits. Prefer the{" "}
            <Code>String</Code> constructor or <Code>valueOf</Code>.
          </Text>
        </Callout>
      ) : (
        <Callout tone="info" title="This value is exact in binary">
          <Text size="small">
            {fromValueOf} happens to be representable exactly (a sum of powers of two), so all three forms
            agree. Most decimals are not this lucky.
          </Text>
        </Callout>
      )}
    </Stack>
  );
}

function Arithmetic() {
  const theme = useHostTheme();
  const [aStr, setA] = useCanvasState<string>("bd.aa", "10");
  const [bStr, setB] = useCanvasState<string>("bd.ab", "3");
  const [op, setOp] = useCanvasState<Op>("bd.aop", "÷");
  const [scaleStr, setScale] = useCanvasState<string>("bd.ascale", "10");
  const [mode, setMode] = useCanvasState<Mode>("bd.amode", "HALF_UP");

  const a = parseDec(aStr);
  const b = parseDec(bStr);
  const scale = Math.max(0, Math.trunc(Number(scaleStr) || 0));

  let result: Dec | null = null;
  let err = "";
  if (a && b) {
    if (op === "+") result = add(a, b);
    else if (op === "−") result = sub(a, b);
    else if (op === "×") result = mul(a, b);
    else { result = div(a, b, scale, mode); if (!result) err = "ArithmeticException: / by zero"; }
  } else err = "Invalid number";

  return (
    <Stack gap={16}>
      <Row gap={8} align="center" wrap>
        <span style={{ width: 100 }}><TextInput value={aStr} onChange={setA} /></span>
        {(["+", "−", "×", "÷"] as Op[]).map((o) => (
          <span key={o}><Pill active={op === o} onClick={() => setOp(o)}>{o}</Pill></span>
        ))}
        <span style={{ width: 100 }}><TextInput value={bStr} onChange={setB} /></span>
      </Row>

      {op === "÷" && (
        <Row gap={8} align="center" wrap>
          <Text size="small" tone="secondary">scale</Text>
          <span style={{ width: 70 }}><TextInput value={scaleStr} onChange={setScale} type="number" /></span>
          <Text size="small" tone="secondary">rounding</Text>
          {MODES.map((m) => (
            <span key={m}><Pill size="sm" active={mode === m} onClick={() => setMode(m)}>{m}</Pill></span>
          ))}
        </Row>
      )}

      <Card>
        <CardHeader trailing={op === "÷" ? `${mode}, scale ${scale}` : "exact"}>Result</CardHeader>
        <CardBody>
          <span style={box(theme, theme.accent.primary)}>{err ? err : result ? decToString(result) : "—"}</span>
        </CardBody>
      </Card>

      {result && !err && (
        <Grid columns="1fr 1fr 1fr" gap={12}>
          <Stat theme={theme} label="scale" value={String(result.scale)} />
          <Stat theme={theme} label="precision" value={String(precision(result))} />
          <Stat theme={theme} label="unscaledValue" value={result.u.toString()} />
        </Grid>
      )}

      {op === "÷" ? (
        <Callout tone="warning" title="divide needs a scale + RoundingMode">
          <Text size="small">
            <Code>a.divide(b)</Code> with no rounding throws <Code>ArithmeticException</Code> for a
            non-terminating result like 10/3. You must supply a scale and a <Code>RoundingMode</Code>.
          </Text>
        </Callout>
      ) : (
        <Callout tone="info" title="Scale of the result">
          <Text size="small">
            {op === "×"
              ? "Multiplication adds the scales: scale(a) + scale(b)."
              : "Add/subtract keep the larger of the two scales (trailing zeros are preserved)."}
          </Text>
        </Callout>
      )}
    </Stack>
  );
}

function Rounding() {
  const theme = useHostTheme();
  const [vStr, setV] = useCanvasState<string>("bd.rv", "2.5");
  const [scaleStr, setScale] = useCanvasState<string>("bd.rscale", "0");

  const d = parseDec(vStr);
  const scale = Math.max(0, Math.trunc(Number(scaleStr) || 0));

  return (
    <Stack gap={16}>
      <Text tone="secondary">
        A <Code>RoundingMode</Code> decides which way the last kept digit goes. <Code>HALF_UP</Code> is the
        everyday "round half up"; <Code>HALF_EVEN</Code> (banker's rounding) is the default for{" "}
        <Code>MathContext</Code> and avoids bias over many values.
      </Text>

      <Row gap={8} align="center" wrap>
        <Text size="small" tone="secondary">value =</Text>
        <span style={{ width: 120 }}><TextInput value={vStr} onChange={setV} /></span>
        <Text size="small" tone="secondary">scale</Text>
        <span style={{ width: 70 }}><TextInput value={scaleStr} onChange={setScale} type="number" /></span>
        {["2.5", "2.45", "-2.5", "1.005", "0.125"].map((p) => (
          <span key={p}><Pill size="sm" active={vStr === p} onClick={() => setV(p)}>{p}</Pill></span>
        ))}
      </Row>

      {d ? (
        <Table
          headers={["RoundingMode", `${vStr} → scale ${scale}`, "Behaviour"]}
          columnAlign={["left", "right", "left"]}
          rows={MODES.map((m) => [m, decToString(rescale(d, scale, m)), MODE_DESC[m]])}
          rowTone={MODES.map((m) => (m === "HALF_EVEN" ? "info" : m === "HALF_UP" ? "success" : undefined))}
        />
      ) : (
        <Callout tone="danger" title="Invalid number"><Text size="small">Enter a valid decimal.</Text></Callout>
      )}

      <Callout tone="warning" title="Why 1.005 famously rounds 'wrong'">
        <Text size="small">
          As a <Code>double</Code>, 1.005 is actually 1.00499999…, so it rounds down to 1.00. Built from the{" "}
          <Code>String</Code> "1.005" it is exact and <Code>HALF_UP</Code> gives 1.01. Construction matters.
        </Text>
      </Callout>
    </Stack>
  );
}

const MODE_DESC: Record<Mode, string> = {
  UP: "away from zero",
  DOWN: "toward zero (truncate)",
  CEILING: "toward +∞",
  FLOOR: "toward −∞",
  HALF_UP: "nearest, ties away from zero",
  HALF_DOWN: "nearest, ties toward zero",
  HALF_EVEN: "nearest, ties to even (banker's)",
};

function EqualsTab() {
  const theme = useHostTheme();
  const [aStr, setA] = useCanvasState<string>("bd.ea", "2.0");
  const [bStr, setB] = useCanvasState<string>("bd.eb", "2.00");

  const a = parseDec(aStr);
  const b = parseDec(bStr);

  let cmp = "—";
  let eq = "—";
  if (a && b) {
    cmp = String(compareDec(a, b));
    eq = String(a.scale === b.scale && a.u === b.u);
  }

  return (
    <Stack gap={16}>
      <Text tone="secondary">
        <Code>equals()</Code> compares value <Text as="span" weight="semibold">and</Text> scale, so{" "}
        <Code>2.0</Code> and <Code>2.00</Code> are not equal. <Code>compareTo()</Code> compares only the
        numeric value. This trips up sets, maps, and assertions.
      </Text>

      <Row gap={8} align="center" wrap>
        <span style={{ width: 120 }}><TextInput value={aStr} onChange={setA} /></span>
        <Text tone="secondary">vs</Text>
        <span style={{ width: 120 }}><TextInput value={bStr} onChange={setB} /></span>
        <Pill size="sm" onClick={() => { setA("2.0"); setB("2.00"); }}>2.0 vs 2.00</Pill>
        <Pill size="sm" onClick={() => { setA("1.10"); setB("1.1"); }}>1.10 vs 1.1</Pill>
      </Row>

      <Grid columns="1fr 1fr" gap={16}>
        <Stack gap={4}>
          <Text size="small" tone="secondary">a.compareTo(b)</Text>
          <span style={box(theme, theme.text.primary)}>{cmp}</span>
          <Text size="small" tone="tertiary">0 means numerically equal</Text>
        </Stack>
        <Stack gap={4}>
          <Text size="small" tone="secondary">a.equals(b)</Text>
          <span style={box(theme, eq === "false" ? theme.accent.primary : theme.text.primary)}>{eq}</span>
          <Text size="small" tone="tertiary">also requires identical scale</Text>
        </Stack>
      </Grid>

      {a && b && cmp === "0" && eq === "false" && (
        <Callout tone="danger" title="Numerically equal, but not equals()">
          <Text size="small">
            <Code>{aStr}</Code> (scale {a.scale}) and <Code>{bStr}</Code> (scale {b.scale}) have the same value,
            yet <Code>equals</Code> is <Code>false</Code>. Use <Code>compareTo() == 0</Code> for value checks, or
            normalize with <Code>stripTrailingZeros()</Code>.
          </Text>
        </Callout>
      )}

      {a && b && eq === "true" && (
        <Callout tone="success" title="Equal in both senses">
          <Text size="small">Same value and same scale — <Code>equals</Code> and <Code>compareTo</Code> agree.</Text>
        </Callout>
      )}
    </Stack>
  );
}

function Cheatsheet() {
  return (
    <Stack gap={20}>
      <Stack gap={10}>
        <H3>Core model</H3>
        <Table
          headers={["Term", "Meaning"]}
          columnAlign={["left", "left"]}
          rows={[
            ["unscaledValue", "the integer digits, ignoring the point (e.g. 12340 for 12.340)"],
            ["scale", "number of digits after the point (3 for 12.340)"],
            ["precision", "total count of significant digits"],
            ["value", "unscaledValue × 10^(-scale)"],
            ["immutable", "every operation returns a new BigDecimal"],
          ]}
        />
      </Stack>

      <Grid columns="1fr 1fr" gap={16}>
        <Callout tone="success" title="Do">
          <Text size="small">
            Use <Code>new BigDecimal("0.1")</Code> or <Code>valueOf</Code>; always pass a{" "}
            <Code>RoundingMode</Code> to <Code>divide</Code>; compare with <Code>compareTo</Code>.
          </Text>
        </Callout>
        <Callout tone="danger" title="Avoid">
          <Text size="small">
            <Code>new BigDecimal(0.1)</Code> (double); <Code>divide</Code> without rounding;{" "}
            <Code>equals</Code> for value checks; <Code>==</Code> on any decimals.
          </Text>
        </Callout>
      </Grid>

      <Card>
        <CardHeader>Money pattern</CardHeader>
        <CardBody>
          <Stack gap={4}>
            <Code>BigDecimal price = new BigDecimal("19.99");</Code>
            <Code>BigDecimal tax = price.multiply(new BigDecimal("0.08"));</Code>
            <Code>BigDecimal total = price.add(tax).setScale(2, RoundingMode.HALF_UP);</Code>
          </Stack>
        </CardBody>
      </Card>
    </Stack>
  );
}

function Stat({ theme, label, value }: { theme: ReturnType<typeof useHostTheme>; label: string; value: string }) {
  return (
    <div style={{ padding: "10px 12px", borderRadius: 6, background: theme.fill.tertiary, border: `1px solid ${theme.stroke.tertiary}` }}>
      <div style={{ fontSize: 16, fontFamily: "var(--font-mono, monospace)", color: theme.text.primary, wordBreak: "break-all" }}>{value}</div>
      <div style={{ fontSize: 12, color: theme.text.secondary, marginTop: 2 }}>{label}</div>
    </div>
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
