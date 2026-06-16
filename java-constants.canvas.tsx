import React from "react";
import {
  Stack,
  Row,
  H1,
  H2,
  H3,
  Text,
  Code,
  Card,
  CardHeader,
  CardBody,
  Button,
  Pill,
  Callout,
  Divider,
  useCanvasState,
  useHostTheme,
  mergeStyle
} from "cursor/canvas";

type Tab = "variables" | "methods" | "classes" | "best-practices";

export default function JavaConstantsCanvas() {
  const [activeTab, setActiveTab] = useCanvasState<Tab>("activeTab", "variables");
  const theme = useHostTheme();

  return (
    <Stack gap={24} style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <Stack gap={8}>
        <H1>Java Constants & The final Keyword</H1>
        <Text tone="secondary" size="body">
          The <Code>final</Code> keyword in Java is a non-access modifier used to define entities that cannot be changed or modified later. It can be applied to variables, methods, and classes.
        </Text>
      </Stack>

      <Row gap={8} wrap>
        <Pill active={activeTab === "variables"} onClick={() => setActiveTab("variables")}>
          Variables (Constants)
        </Pill>
        <Pill active={activeTab === "methods"} onClick={() => setActiveTab("methods")}>
          Methods
        </Pill>
        <Pill active={activeTab === "classes"} onClick={() => setActiveTab("classes")}>
          Classes
        </Pill>
        <Pill active={activeTab === "best-practices"} onClick={() => setActiveTab("best-practices")}>
          Best Practices
        </Pill>
      </Row>

      <Divider />

      {activeTab === "variables" && <VariablesSection />}
      {activeTab === "methods" && <MethodsSection />}
      {activeTab === "classes" && <ClassesSection />}
      {activeTab === "best-practices" && <BestPracticesSection />}
    </Stack>
  );
}

function VariablesSection() {
  const [attemptReassign, setAttemptReassign] = useCanvasState("attemptReassign", false);

  return (
    <Stack gap={16}>
      <H2>Final Variables</H2>
      <Text>
        When a variable is declared as <Code>final</Code>, its value cannot be modified once it has been initialized. It essentially becomes a constant.
      </Text>

      <Card>
        <CardHeader>Example: Final Variable</CardHeader>
        <CardBody style={{ padding: 0 }}>
          <pre style={{ margin: 0, padding: 16, fontSize: 13, overflowX: "auto" }}>
            <code style={{ fontFamily: "monospace" }}>
{`public class Circle {
    public static final double PI = 3.14159;
    public final int radius;

    public Circle(int radius) {
        this.radius = radius; // initialized in constructor
    }

    public void calculateArea() {
        // PI = 3.14; // Compilation Error!
        // radius = 10; // Compilation Error!
    }
}`}
            </code>
          </pre>
        </CardBody>
      </Card>

      <Card variant="borderless" style={{ background: useHostTheme().fill.tertiary, padding: 16, borderRadius: 8 }}>
        <Stack gap={12}>
          <H3>Interactive Demo</H3>
          <Text>What happens if we try to reassign a final variable?</Text>
          <Row gap={8}>
            <Button variant="primary" onClick={() => setAttemptReassign(true)}>
              Try: PI = 3.14;
            </Button>
            <Button variant="ghost" onClick={() => setAttemptReassign(false)}>
              Reset
            </Button>
          </Row>
          
          {attemptReassign && (
            <Callout tone="danger" title="Compilation Error">
              cannot assign a value to final variable PI
            </Callout>
          )}
        </Stack>
      </Card>
    </Stack>
  );
}

function MethodsSection() {
  const [attemptOverride, setAttemptOverride] = useCanvasState("attemptOverride", false);

  return (
    <Stack gap={16}>
      <H2>Final Methods</H2>
      <Text>
        When a method is declared as <Code>final</Code>, it cannot be overridden by subclasses. This is useful when you want to prevent a subclass from changing the behavior of a critical method.
      </Text>

      <Card>
        <CardHeader>Example: Final Method</CardHeader>
        <CardBody style={{ padding: 0 }}>
          <pre style={{ margin: 0, padding: 16, fontSize: 13, overflowX: "auto" }}>
            <code style={{ fontFamily: "monospace" }}>
{`class Vehicle {
    public final void startEngine() {
        System.out.println("Engine started securely.");
    }
}

class Car extends Vehicle {
    // Cannot override startEngine() here
    // public void startEngine() {
    //     System.out.println("Car engine started.");
    // }
}`}
            </code>
          </pre>
        </CardBody>
      </Card>

      <Card variant="borderless" style={{ background: useHostTheme().fill.tertiary, padding: 16, borderRadius: 8 }}>
        <Stack gap={12}>
          <H3>Interactive Demo</H3>
          <Text>What happens if we try to override a final method?</Text>
          <Row gap={8}>
            <Button variant="primary" onClick={() => setAttemptOverride(true)}>
              Try Overriding startEngine()
            </Button>
            <Button variant="ghost" onClick={() => setAttemptOverride(false)}>
              Reset
            </Button>
          </Row>
          
          {attemptOverride && (
            <Callout tone="danger" title="Compilation Error">
              startEngine() in Car cannot override startEngine() in Vehicle; overridden method is final
            </Callout>
          )}
        </Stack>
      </Card>
    </Stack>
  );
}

function ClassesSection() {
  const [attemptExtend, setAttemptExtend] = useCanvasState("attemptExtend", false);

  return (
    <Stack gap={16}>
      <H2>Final Classes</H2>
      <Text>
        When a class is declared as <Code>final</Code>, it cannot be extended (subclassed). This is often used for security reasons or to create immutable classes (like <Code>java.lang.String</Code>).
      </Text>

      <Card>
        <CardHeader>Example: Final Class</CardHeader>
        <CardBody style={{ padding: 0 }}>
          <pre style={{ margin: 0, padding: 16, fontSize: 13, overflowX: "auto" }}>
            <code style={{ fontFamily: "monospace" }}>
{`public final class ImmutableConfig {
    private final String dbUrl;

    public ImmutableConfig(String dbUrl) {
        this.dbUrl = dbUrl;
    }

    public String getDbUrl() {
        return dbUrl;
    }
}

// class CustomConfig extends ImmutableConfig { } // Compilation Error!`}
            </code>
          </pre>
        </CardBody>
      </Card>

      <Card variant="borderless" style={{ background: useHostTheme().fill.tertiary, padding: 16, borderRadius: 8 }}>
        <Stack gap={12}>
          <H3>Interactive Demo</H3>
          <Text>What happens if we try to extend a final class?</Text>
          <Row gap={8}>
            <Button variant="primary" onClick={() => setAttemptExtend(true)}>
              Try: class CustomConfig extends ImmutableConfig
            </Button>
            <Button variant="ghost" onClick={() => setAttemptExtend(false)}>
              Reset
            </Button>
          </Row>
          
          {attemptExtend && (
            <Callout tone="danger" title="Compilation Error">
              cannot inherit from final ImmutableConfig
            </Callout>
          )}
        </Stack>
      </Card>
    </Stack>
  );
}

function BestPracticesSection() {
  return (
    <Stack gap={16}>
      <H2>Best Practices for Constants</H2>
      <Text>
        In Java, true constants are typically declared as <Code>static final</Code>. Here are some guidelines for using them effectively.
      </Text>

      <Card>
        <CardHeader>Naming Conventions</CardHeader>
        <CardBody>
          <Stack gap={8}>
            <Text>
              Constants should be named using uppercase letters with words separated by underscores (<Code>UPPER_SNAKE_CASE</Code>).
            </Text>
            <Callout tone="success" title="Good">
              <Code>public static final int MAX_USERS = 100;</Code>
            </Callout>
            <Callout tone="danger" title="Bad">
              <Code>public static final int maxUsers = 100;</Code>
            </Callout>
          </Stack>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Immutability</CardHeader>
        <CardBody>
          <Stack gap={8}>
            <Text>
              Remember that <Code>final</Code> only makes the <i>reference</i> immutable, not the object itself. If a final variable holds a reference to a mutable object (like an array or a List), the object's contents can still be changed!
            </Text>
            <pre style={{ margin: 0, padding: 16, fontSize: 13, background: useHostTheme().fill.tertiary, borderRadius: 4, overflowX: "auto" }}>
              <code style={{ fontFamily: "monospace" }}>
{`final List<String> names = new ArrayList<>();
names.add("Alice"); // This is perfectly legal!
// names = new ArrayList<>(); // This is illegal (reassigning reference)`}
              </code>
            </pre>
            <Text>
              To make a truly immutable list, use <Code>List.of()</Code> or <Code>Collections.unmodifiableList()</Code>.
            </Text>
          </Stack>
        </CardBody>
      </Card>
    </Stack>
  );
}
