import {
  H1, H3, Text, Code, Card, CardHeader, CardBody, Stack, Row, Grid,
  Table, Pill, Callout, Divider, Button, TextInput, useCanvasState, useHostTheme
} from "cursor/canvas";

function hex(n: number, pad: number): string {
  return n.toString(16).toUpperCase().padStart(pad, "0");
}

function bin(n: number, bits: number): string {
  return (n >>> 0).toString(2).padStart(bits, "0");
}

function utf8Bytes(cp: number): number[] {
  if (cp <= 0x7f) return [cp];
  if (cp <= 0x7ff) return [0xc0 | (cp >> 6), 0x80 | (cp & 0x3f)];
  if (cp <= 0xffff) return [0xe0 | (cp >> 12), 0x80 | ((cp >> 6) & 0x3f), 0x80 | (cp & 0x3f)];
  return [
    0xf0 | (cp >> 18),
    0x80 | ((cp >> 12) & 0x3f),
    0x80 | ((cp >> 6) & 0x3f),
    0x80 | (cp & 0x3f),
  ];
}

function utf16Units(cp: number): number[] {
  if (cp <= 0xffff) return [cp];
  const c = cp - 0x10000;
  return [0xd800 + (c >> 10), 0xdc00 + (c & 0x3ff)];
}

function classify(cp: number): { set: string; note: string } {
  if (cp <= 0x7f) return { set: "ASCII", note: "7-bit, the original 128 characters" };
  if (cp <= 0xff) return { set: "Latin-1 Supplement", note: "bytes 128–255, accented letters & symbols" };
  if (cp <= 0xffff) return { set: "BMP", note: "Basic Multilingual Plane — fits in one Java char" };
  return { set: "Supplementary", note: "above U+FFFF — needs a surrogate pair / int code point" };
}

const CONTROL_NAMES: Record<number, string> = {
  0: "NUL", 8: "BS", 9: "TAB", 10: "LF (newline)", 12: "FF", 13: "CR", 27: "ESC", 32: "SPACE", 127: "DEL",
};

function glyph(cp: number): string {
  if (CONTROL_NAMES[cp]) return CONTROL_NAMES[cp];
  if (cp < 32) return "(control)";
  return String.fromCodePoint(cp);
}

const PRESETS: { label: string; cp: number }[] = [
  { label: "A", cp: 65 },
  { label: "a", cp: 97 },
  { label: "0", cp: 48 },
  { label: "space", cp: 32 },
  { label: "newline", cp: 10 },
  { label: "é", cp: 233 },
  { label: "€", cp: 8364 },
  { label: "中", cp: 20013 },
  { label: "😀", cp: 128512 },
];

const TABS = [
  { id: "sets", label: "ASCII vs Unicode" },
  { id: "inspector", label: "Char Inspector" },
  { id: "escapes", label: "Escape Sequences" },
  { id: "utf8", label: "UTF-8 Encoding" },
  { id: "cheat", label: "Cheatsheet" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AsciiUnicodeUtf8() {
  const [tab, setTab] = useCanvasState<TabId>("cu.tab", "sets");
  return (
    <Stack gap={24} style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
      <Stack gap={8}>
        <H1>ASCII, Unicode & UTF-8 in Java</H1>
        <Text tone="secondary">
          A character is just a number. ASCII and Unicode decide <Text as="span" weight="semibold">which</Text> number;
          UTF-8 and UTF-16 decide <Text as="span" weight="semibold">how</Text> that number is stored as bytes. Java's{" "}
          <Code>char</Code> is a 16-bit UTF-16 unit. Explore every layer below.
        </Text>
      </Stack>

      <Row gap={8} wrap>
        {TABS.map((t) => (
          <span key={t.id}>
            <Pill active={tab === t.id} onClick={() => setTab(t.id)}>{t.label}</Pill>
          </span>
        ))}
      </Row>

      {tab === "sets" && <Sets />}
      {tab === "inspector" && <Inspector />}
      {tab === "escapes" && <Escapes />}
      {tab === "utf8" && <Utf8 />}
      {tab === "cheat" && <Cheatsheet />}
    </Stack>
  );
}

function Sets() {
  return (
    <Stack gap={20}>
      <Grid columns="1fr 1fr" gap={16}>
        <Stack gap={8}>
          <H3>ASCII</H3>
          <Text tone="secondary" size="small">
            A 7-bit code (0–127) from 1963. Covers English letters, digits, punctuation, and control
            codes. Every ASCII character is also the first 128 Unicode code points — Unicode is a
            superset.
          </Text>
          <Code>'A' == 65{"   "}'a' == 97{"   "}'0' == 48</Code>
        </Stack>
        <Stack gap={8}>
          <H3>Unicode</H3>
          <Text tone="secondary" size="small">
            A universal catalog assigning a <Text as="span" weight="semibold">code point</Text> (written{" "}
            <Code>U+XXXX</Code>) to every character in every language — over 1.1 million slots. A code
            point is an identity, not yet bytes.
          </Text>
          <Code>'中' == U+4E2D{"   "}'😀' == U+1F600</Code>
        </Stack>
      </Grid>

      <Divider />

      <Stack gap={10}>
        <H3>The ranges that matter in Java</H3>
        <Table
          headers={["Range", "Name", "Bytes in UTF-8", "Java char?"]}
          columnAlign={["left", "left", "center", "left"]}
          rows={[
            ["U+0000 – U+007F", "ASCII", "1", "Yes"],
            ["U+0080 – U+07FF", "Latin, Greek, Cyrillic, Arabic…", "2", "Yes"],
            ["U+0800 – U+FFFF", "BMP (CJK, symbols)", "3", "Yes (one char)"],
            ["U+10000 – U+10FFFF", "Supplementary (emoji, rare CJK)", "4", "No — needs 2 chars"],
          ]}
          rowTone={["success", "info", "info", "warning"]}
        />
      </Stack>

      <Callout tone="info" title="Encoding ≠ character set">
        <Text size="small">
          Unicode says <Code>😀</Code> is <Code>U+1F600</Code>. UTF-8 stores that as 4 bytes,
          UTF-16 as 2 chars, UTF-32 as one 4-byte int. Same character, different storage.
        </Text>
      </Callout>
    </Stack>
  );
}

function Inspector() {
  const theme = useHostTheme();
  const [mode, setMode] = useCanvasState<"char" | "hex" | "dec">("cu.mode", "char");
  const [raw, setRaw] = useCanvasState<string>("cu.raw", "A");

  let cp = 65;
  if (mode === "char") cp = raw.length > 0 ? raw.codePointAt(0) ?? 65 : 65;
  else if (mode === "hex") cp = parseInt(raw, 16);
  else cp = parseInt(raw, 10);
  const valid = Number.isFinite(cp) && cp >= 0 && cp <= 0x10ffff;
  if (!valid) cp = 65;

  const cls = classify(cp);
  const bytes = utf8Bytes(cp);
  const units = utf16Units(cp);
  const isBmp = cp <= 0xffff;

  const cell = (label: string, value: string, accent = false) => (
    <Stack gap={4}>
      <Text size="small" tone="secondary">{label}</Text>
      <span style={{
        padding: "10px 12px", borderRadius: 6, fontFamily: "var(--font-mono, monospace)",
        fontSize: 14, background: theme.fill.tertiary, border: `1px solid ${theme.stroke.tertiary}`,
        color: accent ? theme.accent.primary : theme.text.primary, wordBreak: "break-all",
      }}>{value}</span>
    </Stack>
  );

  return (
    <Stack gap={16}>
      <Row gap={10} align="center" wrap>
        <Text size="small" tone="secondary">Input as:</Text>
        <Pill active={mode === "char"} onClick={() => setMode("char")}>Character</Pill>
        <Pill active={mode === "hex"} onClick={() => setMode("hex")}>Hex code point</Pill>
        <Pill active={mode === "dec"} onClick={() => setMode("dec")}>Decimal</Pill>
        <span style={{ width: 160 }}>
          <TextInput value={raw} onChange={setRaw} placeholder={mode === "hex" ? "e.g. 1F600" : mode === "dec" ? "e.g. 65" : "type a character"} />
        </span>
      </Row>

      <Row gap={6} wrap align="center">
        <Text size="small" tone="tertiary">Presets:</Text>
        {PRESETS.map((p) => (
          <span key={p.label}>
            <Pill size="sm" onClick={() => { setMode("hex"); setRaw(p.cp.toString(16).toUpperCase()); }}>{p.label}</Pill>
          </span>
        ))}
      </Row>

      <Grid columns="auto 1fr" gap={16} align="center">
        <div style={{
          width: 96, height: 96, display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: 8, background: theme.fill.secondary, border: `1px solid ${theme.stroke.secondary}`,
          fontSize: cp < 32 ? 16 : 44, color: theme.text.primary,
        }}>
          {glyph(cp)}
        </div>
        <Grid columns="1fr 1fr 1fr" gap={12}>
          {cell("Code point", "U+" + hex(cp, 4), true)}
          {cell("Decimal", String(cp))}
          {cell("Set", cls.set)}
        </Grid>
      </Grid>

      <Text size="small" tone="tertiary">{cls.note}</Text>

      <Divider />

      <Grid columns="1fr 1fr" gap={16}>
        {cell("Binary", bin(cp, isBmp ? 16 : 21))}
        {cell("UTF-16 code unit(s)", units.map((u) => "0x" + hex(u, 4)).join("  "))}
      </Grid>

      <Card>
        <CardHeader trailing={`${bytes.length} byte${bytes.length > 1 ? "s" : ""}`}>UTF-8 encoding</CardHeader>
        <CardBody>
          <Stack gap={6}>
            <Code>{bytes.map((b) => "0x" + hex(b, 2)).join("  ")}</Code>
            <Code>{bytes.map((b) => bin(b, 8)).join("  ")}</Code>
          </Stack>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Java char literal</CardHeader>
        <CardBody>
          {isBmp ? (
            <Stack gap={4}>
              <Code>char c = {cp >= 32 && cp !== 127 ? `'${String.fromCodePoint(cp)}'` : "/* control char */"};</Code>
              <Code>char c = '\\u{hex(cp, 4)}';{"   "}// always valid for BMP</Code>
              <Code>int code = c;{"   "}// {cp}</Code>
            </Stack>
          ) : (
            <Stack gap={4}>
              <Callout tone="warning" title="Too big for one char">
                <Text size="small">
                  U+{hex(cp, 4)} is above U+FFFF, so it cannot fit in a single 16-bit <Code>char</Code>.
                </Text>
              </Callout>
              <Code>int cp = 0x{hex(cp, 4)};{"          "}// code point as int</Code>
              <Code>String s = "{String.fromCodePoint(cp)}";{"   "}// 2 chars internally</Code>
              <Code>char hi = '\\u{hex(units[0], 4)}', lo = '\\u{hex(units[1], 4)}'; // surrogate pair</Code>
            </Stack>
          )}
        </CardBody>
      </Card>
    </Stack>
  );
}

function Escapes() {
  const theme = useHostTheme();
  const [raw, setRaw] = useCanvasState<string>("cu.escraw", "Tab\\tEnd\\nLine2 \\u2764");

  const resolved = resolveEscapes(raw);

  return (
    <Stack gap={18}>
      <Text tone="secondary">
        An escape sequence is a backslash followed by a code, letting you put characters in a string
        that you could not type directly. Java resolves them when it reads the source.
      </Text>

      <Table
        headers={["Escape", "Meaning", "Code point"]}
        columnAlign={["left", "left", "left"]}
        rows={[
          ["\\n", "Line feed (newline)", "U+000A"],
          ["\\t", "Horizontal tab", "U+0009"],
          ["\\r", "Carriage return", "U+000D"],
          ["\\b", "Backspace", "U+0008"],
          ["\\f", "Form feed", "U+000C"],
          ["\\0", "Null character", "U+0000"],
          ["\\'", "Single quote", "U+0027"],
          ["\\\"", "Double quote", "U+0022"],
          ["\\\\", "Backslash itself", "U+005C"],
          ["\\uXXXX", "Any BMP code point (4 hex)", "U+XXXX"],
          ["\\DDD", "Octal escape (0–377)", "varies"],
        ]}
      />

      <Divider />

      <Stack gap={8}>
        <H3>Live resolver</H3>
        <Text size="small" tone="secondary">
          Type Java-style text with escapes. The resolved characters appear below with whitespace made visible.
        </Text>
        <TextInput value={raw} onChange={setRaw} placeholder="e.g. Hi\\tthere\\n\\u2764" />

        <Card>
          <CardHeader trailing={`${[...resolved.text].length} chars`}>Resolved output</CardHeader>
          <CardBody>
            <div style={{
              fontFamily: "var(--font-mono, monospace)", fontSize: 14, whiteSpace: "pre-wrap",
              color: theme.text.primary, lineHeight: 1.6,
            }}>
              {visualizeWhitespace(resolved.text) || <Text tone="tertiary">(empty)</Text>}
            </div>
          </CardBody>
        </Card>

        {resolved.error && (
          <Callout tone="danger" title="Invalid escape">
            <Text size="small">{resolved.error}</Text>
          </Callout>
        )}
      </Stack>

      <Callout tone="warning" title="Micro detail: \u is processed first">
        <Text size="small">
          Java translates <Code>\uXXXX</Code> in a very early phase — before parsing tokens — so it works
          even inside comments. A stray <Code>// path C:\users</Code> can break compilation if{" "}
          <Code>\u</Code> is followed by non-hex. Use <Code>\\u</Code> for a literal backslash-u.
        </Text>
      </Callout>
    </Stack>
  );
}

function resolveEscapes(input: string): { text: string; error?: string } {
  let out = "";
  let error: string | undefined;
  for (let i = 0; i < input.length; i++) {
    if (input[i] !== "\\") { out += input[i]; continue; }
    const next = input[i + 1];
    switch (next) {
      case "n": out += "\n"; i++; break;
      case "t": out += "\t"; i++; break;
      case "r": out += "\r"; i++; break;
      case "b": out += "\b"; i++; break;
      case "f": out += "\f"; i++; break;
      case "0": out += "\0"; i++; break;
      case "'": out += "'"; i++; break;
      case '"': out += '"'; i++; break;
      case "\\": out += "\\"; i++; break;
      case "u": {
        const h = input.slice(i + 2, i + 6);
        if (/^[0-9a-fA-F]{4}$/.test(h)) { out += String.fromCharCode(parseInt(h, 16)); i += 5; }
        else { error = `\\u must be followed by 4 hex digits (saw "${h}")`; out += "\\u"; i++; }
        break;
      }
      default: out += "\\" + (next ?? ""); i++; break;
    }
  }
  return { text: out, error };
}

function visualizeWhitespace(s: string): string {
  return s
    .replace(/\n/g, "\u00b6\n")
    .replace(/\t/g, "\u2192\t")
    .replace(/\0/g, "\u2400")
    .replace(/\r/g, "\u240d");
}

function Utf8() {
  const theme = useHostTheme();
  const [str, setStr] = useCanvasState<string>("cu.str", "Hé中😀");

  const codePoints = [...str];
  const charCount = str.length;
  const cpCount = codePoints.length;
  let totalBytes = 0;
  for (const ch of codePoints) totalBytes += utf8Bytes(ch.codePointAt(0)!).length;

  return (
    <Stack gap={16}>
      <Text tone="secondary">
        UTF-8 is the default on the web and Java's preferred file/stream charset. It is
        variable-width: 1 byte for ASCII, up to 4 for emoji. Type a string to see it broken down.
      </Text>

      <TextInput value={str} onChange={setStr} placeholder="Type any text, including emoji" />

      <Grid columns="1fr 1fr 1fr" gap={12}>
        <Stat3 theme={theme} label="char count — length()" value={String(charCount)} />
        <Stat3 theme={theme} label="code points" value={String(cpCount)} accent />
        <Stat3 theme={theme} label="UTF-8 bytes" value={String(totalBytes)} />
      </Grid>

      {charCount !== cpCount && (
        <Callout tone="warning" title="length() lies about emoji">
          <Text size="small">
            <Code>"{str}".length()</Code> returns {charCount} (UTF-16 units), but there are only {cpCount}{" "}
            actual characters. Use <Code>codePointCount(0, length())</Code> for the true count.
          </Text>
        </Callout>
      )}

      <Stack gap={8}>
        <H3>Per-character breakdown</H3>
        <Table
          headers={["Char", "Code point", "UTF-16 units", "UTF-8 bytes (hex)"]}
          columnAlign={["center", "left", "left", "left"]}
          rows={codePoints.map((ch) => {
            const c = ch.codePointAt(0)!;
            return [
              c < 32 ? glyph(c) : ch,
              "U+" + hex(c, 4),
              utf16Units(c).map((u) => hex(u, 4)).join(" "),
              utf8Bytes(c).map((b) => hex(b, 2)).join(" "),
            ];
          })}
        />
      </Stack>

      <Card>
        <CardHeader>How UTF-8 packs bits</CardHeader>
        <CardBody>
          <Table
            headers={["Code point range", "Byte pattern", "Free bits"]}
            columnAlign={["left", "left", "center"]}
            rows={[
              ["U+0000–U+007F", "0xxxxxxx", "7"],
              ["U+0080–U+07FF", "110xxxxx 10xxxxxx", "11"],
              ["U+0800–U+FFFF", "1110xxxx 10xxxxxx 10xxxxxx", "16"],
              ["U+10000–U+10FFFF", "11110xxx 10xxxxxx 10xxxxxx 10xxxxxx", "21"],
            ]}
          />
        </CardBody>
      </Card>

      <Callout tone="info" title="In Java code">
        <Text size="small">
          <Code>byte[] b = s.getBytes(StandardCharsets.UTF_8);</Code> then{" "}
          <Code>new String(b, StandardCharsets.UTF_8)</Code> round-trips. Always pass the charset
          explicitly — the platform default is not guaranteed to be UTF-8.
        </Text>
      </Callout>
    </Stack>
  );
}

function Stat3({ theme, label, value, accent }: { theme: ReturnType<typeof useHostTheme>; label: string; value: string; accent?: boolean }) {
  return (
    <div style={{ padding: "12px 14px", borderRadius: 6, background: theme.fill.tertiary, border: `1px solid ${theme.stroke.tertiary}` }}>
      <div style={{ fontSize: 22, fontFamily: "var(--font-mono, monospace)", color: accent ? theme.accent.primary : theme.text.primary }}>{value}</div>
      <div style={{ fontSize: 12, color: theme.text.secondary, marginTop: 2 }}>{label}</div>
    </div>
  );
}

function Cheatsheet() {
  return (
    <Stack gap={20}>
      <Stack gap={10}>
        <H3>Facts to remember</H3>
        <Table
          headers={["Concept", "Detail"]}
          columnAlign={["left", "left"]}
          rows={[
            ["char size", "16-bit unsigned, 0 to 65535 — a single UTF-16 code unit"],
            ["char is a number", "'A' + 1 == 66, (char)('A' + 1) == 'B'"],
            ["ASCII", "0–127, subset of Unicode"],
            ["Unicode code point", "U+0000 to U+10FFFF, written as U+XXXX"],
            ["String.length()", "counts UTF-16 units, not characters"],
            ["codePointCount()", "counts real characters (handles surrogate pairs)"],
            ["UTF-8 width", "1–4 bytes; ASCII stays 1 byte"],
            ["Supplementary chars", "emoji etc. need a surrogate pair or int code point"],
          ]}
        />
      </Stack>

      <Grid columns="1fr 1fr" gap={16}>
        <Callout tone="danger" title="Never rely on default charset">
          <Text size="small">
            <Code>s.getBytes()</Code> uses the platform default. Always write{" "}
            <Code>s.getBytes(StandardCharsets.UTF_8)</Code>.
          </Text>
        </Callout>
        <Callout tone="info" title="Iterate code points, not chars">
          <Text size="small">
            <Code>s.codePoints().forEach(...)</Code> or <Code>for (int i...; i += Character.charCount(cp))</Code>{" "}
            to handle emoji correctly.
          </Text>
        </Callout>
      </Grid>
    </Stack>
  );
}
