import {
  Stack,
  Row,
  Grid,
  H1,
  H3,
  Text,
  Card,
  CardHeader,
  CardBody,
  Pill,
  Stat,
  Divider,
  Callout,
  TextInput,
  useCanvasState,
} from "./ui";
import { useHostTheme, type Theme } from "./theme";
import {
  DATA,
  LEVEL_ORDER,
  type Category,
  type Level,
  type SubCategory,
  type Topic,
} from "./data";
import { TopicDiagram, hasDiagram, diagramId } from "./diagrams";
import { Glossed } from "./glossary";

function levelColor(level: Level, theme: Theme): string {
  switch (level) {
    case "Beginner":
      return theme.accent.primary;
    case "Intermediate":
      return theme.text.link;
    case "Advanced":
      return theme.text.secondary;
    case "Expert":
      return theme.text.tertiary;
  }
}

function topicMatches(t: Topic, q: string): boolean {
  if (!q) return true;
  const hay = (t.name + " " + t.summary + " " + t.details.join(" ")).toLowerCase();
  return hay.includes(q.toLowerCase());
}

function LevelDot({ level }: { level: Level }) {
  const theme = useHostTheme();
  return (
    <span
      style={{
        width: 8,
        height: 8,
        borderRadius: 8,
        background: levelColor(level, theme),
        display: "inline-block",
        flex: "0 0 auto",
      }}
    />
  );
}

function TopicEntry({ topic }: { topic: Topic }) {
  const theme = useHostTheme();
  return (
    <Stack gap={6} style={{ paddingBottom: 4 }}>
      <Row gap={8} align="center" wrap>
        <LevelDot level={topic.level} />
        <Text weight="semibold">{topic.name}</Text>
        <span
          style={{
            fontSize: 10,
            letterSpacing: 0.3,
            textTransform: "uppercase",
            color: levelColor(topic.level, theme),
          }}
        >
          {topic.level}
        </span>
        {topic.since ? <Pill size="sm">Java {topic.since}</Pill> : null}
      </Row>
      {topic.simple ? (
        <div
          style={{
            fontSize: 12.5,
            color: theme.text.primary,
            background: "rgba(74, 158, 255, 0.08)",
            border: `1px solid ${theme.border}`,
            borderLeft: `3px solid ${theme.accent.primary}`,
            borderRadius: 6,
            padding: "6px 10px",
            lineHeight: 1.5,
          }}
        >
          <span style={{ color: theme.accent.primary, fontWeight: 600 }}>
            In simple terms ·{" "}
          </span>
          {topic.simple}
        </div>
      ) : null}
      <Text tone="secondary" size="small">
        <Glossed text={topic.summary} />
      </Text>
      <Row gap={6} wrap>
        {topic.details.map((d, i) => (
          <span
            key={i}
            style={{
              background: theme.fill.tertiary,
              color: theme.text.secondary,
              borderRadius: 4,
              padding: "2px 7px",
              fontSize: 11,
              lineHeight: 1.5,
            }}
          >
            {d}
          </span>
        ))}
      </Row>
      {(() => {
        const id = diagramId(topic);
        return id && hasDiagram(id) ? <TopicDiagram id={id} /> : null;
      })()}
    </Stack>
  );
}

function SubCategorySection({ sub }: { sub: SubCategory }) {
  const theme = useHostTheme();
  return (
    <Stack gap={12}>
      <H3 style={{ color: theme.text.secondary }}>{sub.name}</H3>
      <Stack gap={14}>
        {sub.topics.map((t) => (
          <div key={t.name} style={{ display: "contents" }}>
            <TopicEntry topic={t} />
          </div>
        ))}
      </Stack>
    </Stack>
  );
}

function CategorySection({
  cat,
  count,
  expanded,
}: {
  cat: Category;
  count: number;
  expanded: boolean;
}) {
  return (
    <Card collapsible defaultOpen={false} forceOpen={expanded}>
      <CardHeader trailing={<Pill size="sm">{count} topics</Pill>}>{cat.label}</CardHeader>
      <CardBody>
        <Stack gap={18}>
          <Text tone="secondary">{cat.blurb}</Text>
          {cat.subs.map((s, i) => (
            <div key={s.name} style={{ display: "contents" }}>
              {i > 0 ? <Divider /> : null}
              <SubCategorySection sub={s} />
            </div>
          ))}
        </Stack>
      </CardBody>
    </Card>
  );
}

export default function CoreJavaCatalog() {
  const [level, setLevel] = useCanvasState<Level | "all">("level-filter", "all");
  const [query, setQuery] = useCanvasState<string>("search-query", "");
  const [showAll, setShowAll] = useCanvasState<boolean>("show-all-diagrams", false);

  const isFiltering = query.trim() !== "" || level !== "all";
  const expandAll = isFiltering || showAll;

  const filtered: { cat: Category; count: number }[] = DATA.map((cat) => {
    const subs = cat.subs
      .map((s) => ({
        ...s,
        topics: s.topics.filter(
          (t) => (level === "all" || t.level === level) && topicMatches(t, query),
        ),
      }))
      .filter((s) => s.topics.length > 0);
    const count = subs.reduce((n, s) => n + s.topics.length, 0);
    return { cat: { ...cat, subs }, count };
  }).filter((x) => x.count > 0);

  const totalTopics = DATA.reduce(
    (n, c) => n + c.subs.reduce((m, s) => m + s.topics.length, 0),
    0,
  );
  const totalSubs = DATA.reduce((n, c) => n + c.subs.length, 0);
  const levelCounts = LEVEL_ORDER.map((lv) => ({
    lv,
    n: DATA.reduce(
      (n, c) =>
        n + c.subs.reduce((m, s) => m + s.topics.filter((t) => t.level === lv).length, 0),
      0,
    ),
  }));
  const beginnerCount = levelCounts.find((x) => x.lv === "Beginner")?.n ?? 0;

  return (
    <Stack gap={20} style={{ padding: 24, maxWidth: 1080, margin: "0 auto" }}>
      <Stack gap={6}>
        <H1>Core Java — End-to-End Catalog</H1>
        <Text tone="secondary">
          Learn Java by playing. Every topic has an interactive diagram you can click,
          step through, and experiment with. Beginner topics include a plain-English “In
          simple terms” explanation, and tricky jargon has a hover definition. Use the
          level filter below to match your experience.
        </Text>
      </Stack>

      <Grid columns={4} gap={12}>
        <Stat value={totalTopics} label="Topics" />
        <Stat value={DATA.length} label="Categories" tone="info" />
        <Stat value={totalSubs} label="Subcategories" />
        <Stat value="8–21" label="Java versions" />
      </Grid>

      {level === "Beginner" ? (
        <Callout tone="info" title="Beginner mode is on">
          <Row gap={12} wrap align="center">
            <Text size="small" tone="secondary">
              Showing the {beginnerCount} beginner-friendly topics, each with an “In simple
              terms” explanation. The advanced internals are hidden for now.
            </Text>
            <Pill onClick={() => setLevel("all")}>Show all levels</Pill>
          </Row>
        </Callout>
      ) : (
        <Callout tone="info" title="New to Java? Start here">
          <Row gap={12} wrap align="center">
            <Text size="small" tone="secondary">
              This catalog is a complete reference. If you're just starting out, begin with
              the {beginnerCount} beginner topics and skip the advanced internals — you can
              always come back.
            </Text>
            <Pill active onClick={() => setLevel("Beginner")}>
              Show beginner topics
            </Pill>
          </Row>
        </Callout>
      )}

      <Callout tone="info" title="Difficulty levels">
        <Row gap={16} wrap>
          {levelCounts.map(({ lv, n }) => (
            <span key={lv} style={{ display: "inline-flex" }}>
              <Row gap={6} align="center">
                <LevelDot level={lv} />
                <Text size="small" weight="medium">
                  {lv}
                </Text>
                <Text size="small" tone="tertiary">
                  ({n})
                </Text>
              </Row>
            </span>
          ))}
        </Row>
      </Callout>

      <Stack gap={10}>
        <Row gap={8} wrap align="center">
          <Pill active={level === "all"} onClick={() => setLevel("all")}>
            All levels
          </Pill>
          {LEVEL_ORDER.map((lv) => (
            <span key={lv} style={{ display: "inline-flex" }}>
              <Pill active={level === lv} onClick={() => setLevel(lv)}>
                {lv}
              </Pill>
            </span>
          ))}
        </Row>
        <TextInput
          value={query}
          onChange={setQuery}
          type="search"
          placeholder="Search topics, keywords, APIs…"
        />
        <Row gap={8} wrap align="center">
          <Pill active={showAll} onClick={() => setShowAll(!showAll)}>
            {showAll ? "✓ Showing all diagrams" : "Show all diagrams"}
          </Pill>
          <Text size="small" tone="tertiary">
            Expand every category to browse all interactive diagrams at once.
          </Text>
        </Row>
      </Stack>

      {filtered.length === 0 ? (
        <Callout tone="warning" title="No matches">
          No topics match the current level and search filters. Try clearing the search
          or selecting “All levels”.
        </Callout>
      ) : (
        <Stack gap={12}>
          {filtered.map(({ cat, count }) => (
            <div key={cat.id} style={{ display: "contents" }}>
              <CategorySection cat={cat} count={count} expanded={expandAll} />
            </div>
          ))}
        </Stack>
      )}

      <Text size="small" tone="tertiary">
        Source: Java SE specification &amp; API · feature versions reflect first stable
        (non-preview) release · {totalTopics} topics across {DATA.length} categories.
      </Text>
    </Stack>
  );
}
