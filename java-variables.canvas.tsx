import React, { useState } from "react";
import {
  Stack, Row, Grid, Card, CardHeader, CardBody,
  H1, H2, H3, Text, Code, Table, Pill, Callout, Divider, Button,
  TextInput, Select, useHostTheme
} from "cursor/canvas";

export default function JavaVariablesCanvas() {
  const [activeTab, setActiveTab] = useState("Memory Playground");
  const tabs = ["Memory Playground", "Scope Visualizer", "Type Casting", "Pass-by-Value", "Cheatsheet"];

  return (
    <Stack gap={24} style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
      <Stack gap={8}>
        <H1>Java Variables: Interactive Guide</H1>
        <Text tone="secondary">Step through code to see exactly how Java stores variables in memory, handles scope, casts types, and passes data to methods.</Text>
      </Stack>

      <Row gap={8} wrap>
        {tabs.map(tab => (
          <span key={tab}>
            <Pill 
              active={activeTab === tab} 
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </Pill>
          </span>
        ))}
      </Row>

      <Divider />

      {activeTab === "Memory Playground" && <MemoryPlayground />}
      {activeTab === "Scope Visualizer" && <ScopeVisualizer />}
      {activeTab === "Type Casting" && <TypeCasting />}
      {activeTab === "Pass-by-Value" && <PassByValue />}
      {activeTab === "Cheatsheet" && <Cheatsheet />}
    </Stack>
  );
}

function MemoryPlayground() {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    { 
      code: "int num = 42;", 
      desc: "A primitive variable is created directly on the Stack. It holds the actual value.",
      stack: [{ name: "num", type: "int", value: "42" }],
      heap: []
    },
    { 
      code: "String name = \"Java\";", 
      desc: "A String is an object. The actual text goes to the Heap, and the Stack gets a reference (memory address) pointing to it.",
      stack: [
        { name: "num", type: "int", value: "42" },
        { name: "name", type: "String", value: "0x1A4" }
      ],
      heap: [{ id: "0x1A4", type: "String", data: '"Java"' }]
    },
    { 
      code: "name = \"Java 21\";", 
      desc: "Strings are IMMUTABLE! Reassigning a String doesn't change the original object. It creates a new object on the Heap and updates the Stack reference.",
      stack: [
        { name: "num", type: "int", value: "42" },
        { name: "name", type: "String", value: "0x9F2" }
      ],
      heap: [
        { id: "0x1A4", type: "String", data: '"Java"', abandoned: true },
        { id: "0x9F2", type: "String", data: '"Java 21"' }
      ]
    },
    { 
      code: "int[] arr = {1, 2};", 
      desc: "Arrays are also objects in Java. The array data lives in the Heap, and the Stack variable references it.",
      stack: [
        { name: "num", type: "int", value: "42" },
        { name: "name", type: "String", value: "0x9F2" },
        { name: "arr", type: "int[]", value: "0x2B8" }
      ],
      heap: [
        { id: "0x1A4", type: "String", data: '"Java"', abandoned: true },
        { id: "0x9F2", type: "String", data: '"Java 21"' },
        { id: "0x2B8", type: "Array", data: "[1, 2]" }
      ]
    },
    { 
      code: "int[] copy = arr;", 
      desc: "Important! Copying a reference variable only copies the memory address, NOT the actual object. Both variables now point to the exact same Heap data.",
      stack: [
        { name: "num", type: "int", value: "42" },
        { name: "name", type: "String", value: "0x9F2" },
        { name: "arr", type: "int[]", value: "0x2B8" },
        { name: "copy", type: "int[]", value: "0x2B8" }
      ],
      heap: [
        { id: "0x1A4", type: "String", data: '"Java"', abandoned: true },
        { id: "0x9F2", type: "String", data: '"Java 21"' },
        { id: "0x2B8", type: "Array", data: "[1, 2]" }
      ]
    },
    { 
      code: "copy[0] = 99;", 
      desc: "Because 'arr' and 'copy' point to the same object, modifying the array via 'copy' affects the data seen by 'arr' too! Notice the Heap updated.",
      stack: [
        { name: "num", type: "int", value: "42" },
        { name: "name", type: "String", value: "0x9F2" },
        { name: "arr", type: "int[]", value: "0x2B8" },
        { name: "copy", type: "int[]", value: "0x2B8" }
      ],
      heap: [
        { id: "0x1A4", type: "String", data: '"Java"', abandoned: true },
        { id: "0x9F2", type: "String", data: '"Java 21"' },
        { id: "0x2B8", type: "Array", data: "[99, 2]" }
      ]
    },
    { 
      code: "final int[] finalArr = arr;", 
      desc: "A 'final' reference means the Stack address can't change, but the Heap object IT POINTS TO can still be modified!",
      stack: [
        { name: "num", type: "int", value: "42" },
        { name: "name", type: "String", value: "0x9F2" },
        { name: "arr", type: "int[]", value: "0x2B8" },
        { name: "copy", type: "int[]", value: "0x2B8" },
        { name: "finalArr", type: "final int[]", value: "0x2B8" }
      ],
      heap: [
        { id: "0x1A4", type: "String", data: '"Java"', abandoned: true },
        { id: "0x9F2", type: "String", data: '"Java 21"' },
        { id: "0x2B8", type: "Array", data: "[99, 2]" }
      ]
    }
  ];

  const currentStep = steps[stepIndex];

  return (
    <Stack gap={24}>
      <Row justify="space-between" align="center" wrap>
        <H2>Stack vs Heap Simulator</H2>
        <Row gap={8} align="center">
          <Button 
            variant="ghost" 
            onClick={() => setStepIndex(Math.max(0, stepIndex - 1))}
            disabled={stepIndex === 0}
          >
            Previous
          </Button>
          <Text>{stepIndex + 1} / {steps.length}</Text>
          <Button 
            variant="primary" 
            onClick={() => setStepIndex(Math.min(steps.length - 1, stepIndex + 1))}
            disabled={stepIndex === steps.length - 1}
          >
            Step Forward
          </Button>
          <Button
            variant="secondary"
            onClick={() => setStepIndex(0)}
            disabled={stepIndex === 0}
          >
            Reset
          </Button>
        </Row>
      </Row>

      <Grid columns="1fr 1.5fr" gap={24}>
        {/* Code Execution Panel */}
        <Stack gap={16}>
          <Card>
            <CardHeader>Execution Context</CardHeader>
            <CardBody style={{ padding: 12 }}>
              <Stack gap={4}>
                {steps.map((step, i) => (
                  <div 
                    key={i} 
                    style={{ 
                      padding: "8px 12px", 
                      borderRadius: 4,
                      backgroundColor: i === stepIndex ? "rgba(0,120,255,0.15)" : "transparent",
                      borderLeft: i === stepIndex ? "3px solid #0078D4" : "3px solid transparent",
                      opacity: i > stepIndex ? 0.4 : 1,
                      transition: "all 0.2s"
                    }}
                  >
                    <Code>{step.code}</Code>
                  </div>
                ))}
              </Stack>
            </CardBody>
          </Card>
          
          <Callout tone="info" title={`Step ${stepIndex + 1}`}>
            {currentStep.desc}
          </Callout>
        </Stack>

        {/* Memory Visualizer Panel */}
        <Grid columns={2} gap={16}>
          <Card>
            <CardHeader>Stack (Fast, Fixed)</CardHeader>
            <CardBody>
              {currentStep.stack.length === 0 ? (
                <Text tone="tertiary" italic>Stack is empty</Text>
              ) : (
                <Stack gap={8}>
                  {currentStep.stack.map((item, i) => (
                    <div key={i} style={{ border: "1px solid rgba(128,128,128,0.2)", padding: 12, borderRadius: 6, transition: "all 0.2s" }}>
                      <Row justify="space-between">
                        <Text weight="semibold">{item.name}</Text>
                        <Text tone="secondary" size="small">{item.type}</Text>
                      </Row>
                      <Row justify="space-between" align="center" style={{ marginTop: 8 }}>
                        <Text size="small" tone="secondary">Value:</Text>
                        <Code>{item.value}</Code>
                      </Row>
                    </div>
                  ))}
                </Stack>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>Heap (Dynamic, Large)</CardHeader>
            <CardBody>
              {currentStep.heap.length === 0 ? (
                <Text tone="tertiary" italic>Heap is empty</Text>
              ) : (
                <Stack gap={8}>
                  {currentStep.heap.map((item, i) => (
                    <div key={i} style={{ 
                      border: "1px solid rgba(128,128,128,0.2)", 
                      padding: 12, 
                      borderRadius: 6, 
                      backgroundColor: item.abandoned ? "rgba(128,128,128,0.05)" : "rgba(255,165,0,0.05)", 
                      opacity: item.abandoned ? 0.5 : 1,
                      transition: "all 0.2s" 
                    }}>
                      <Row justify="space-between">
                        <Text tone="secondary" size="small" style={{ textDecoration: item.abandoned ? "line-through" : "none" }}>Addr: {item.id}</Text>
                        <Text tone="secondary" size="small">{item.type}</Text>
                      </Row>
                      <div style={{ marginTop: 8, padding: 8, backgroundColor: "rgba(0,0,0,0.1)", borderRadius: 4, textAlign: "center" }}>
                        <Text weight="semibold" style={{ textDecoration: item.abandoned ? "line-through" : "none" }}>{item.data}</Text>
                      </div>
                      {item.abandoned && <Text size="small" tone="tertiary" style={{ marginTop: 4, textAlign: "center" }}>Garbage collected soon</Text>}
                    </div>
                  ))}
                </Stack>
              )}
            </CardBody>
          </Card>
        </Grid>
      </Grid>

      <Divider style={{ margin: "24px 0" }} />
      <DynamicSimulator />
    </Stack>
  );
}

function DynamicSimulator() {
  const [variables, setVariables] = useState<{name: string, type: string, value: string, address?: string}[]>([]);
  const [heapObjects, setHeapObjects] = useState<{id: string, type: string, data: string}[]>([]);
  const [type, setType] = useState("int");
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [nextAddr, setNextAddr] = useState(100);
  const [error, setError] = useState("");

  const typeOptions = [
    { value: "int", label: "int" },
    { value: "double", label: "double" },
    { value: "boolean", label: "boolean" },
    { value: "String", label: "String" },
    { value: "int[]", label: "int[]" }
  ];

  const handleDeclare = () => {
    setError("");
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Name is required");
      return;
    }
    if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(trimmedName)) {
      setError("Invalid Java variable name (must start with letter, _, or $)");
      return;
    }
    if (variables.some(v => v.name === trimmedName)) {
      setError(`Variable '${trimmedName}' is already defined`);
      return;
    }

    if (!value) {
      setError("Value is required");
      return;
    }

    let finalValue = value.trim();

    // Type validation
    if (type === "int") {
      if (!/^-?\d+$/.test(finalValue)) {
        setError("int must be a whole number");
        return;
      }
    } else if (type === "double") {
      if (isNaN(Number(finalValue)) || finalValue === "") {
        setError("double must be a number");
        return;
      }
      if (!finalValue.includes(".")) finalValue += ".0";
    } else if (type === "boolean") {
      const lower = finalValue.toLowerCase();
      if (lower !== "true" && lower !== "false") {
        setError("boolean must be 'true' or 'false'");
        return;
      }
      finalValue = lower;
    } else if (type === "int[]") {
      let arrayInner = finalValue.replace(/^\[|\]$/g, "");
      const elements = arrayInner.split(",").map(s => s.trim()).filter(Boolean);
      
      if (elements.length === 0) {
         setError("int[] cannot be empty");
         return;
      }

      for (const el of elements) {
        if (!/^-?\d+$/.test(el)) {
          setError("int[] must contain only whole numbers, separated by commas (e.g. '1, 2, 3')");
          return;
        }
      }
      finalValue = elements.join(", ");
    }
    
    if (type === "int" || type === "double" || type === "boolean") {
      setVariables([...variables, { name: trimmedName, type, value: finalValue }]);
    } else {
      const addr = `0x${nextAddr.toString(16).toUpperCase()}`;
      setNextAddr(nextAddr + 16);
      
      let formattedData = finalValue;
      if (type === "String") formattedData = `"${finalValue}"`;
      else if (type === "int[]") formattedData = `[${finalValue}]`;
      
      setHeapObjects([...heapObjects, { id: addr, type, data: formattedData }]);
      setVariables([...variables, { name: trimmedName, type, value: addr, address: addr }]);
    }
    
    setName("");
    setValue("");
  };

  const handleReset = () => {
    setVariables([]);
    setHeapObjects([]);
    setNextAddr(100);
    setError("");
  };

  return (
    <Stack gap={16}>
      <H2>Live Memory Sandbox</H2>
      <Text tone="secondary">Declare your own variables dynamically and see where they land!</Text>
      
      <Grid columns="1fr 2fr" gap={24}>
        <Card>
          <CardHeader>Declare Variable</CardHeader>
          <CardBody>
            <Stack gap={12}>
              <Stack gap={4}>
                <Text size="small" tone="secondary">Select Type:</Text>
                <Row gap={8} wrap>
                  {typeOptions.map(opt => (
                    <span key={opt.value}>
                      <Pill
                        active={type === opt.value}
                        onClick={() => setType(opt.value)}
                        size="sm"
                      >
                        {opt.label}
                      </Pill>
                    </span>
                  ))}
                </Row>
              </Stack>
              <TextInput 
                placeholder="Variable name (e.g. score)" 
                value={name}
                onChange={setName}
              />
              <TextInput 
                placeholder={type === "boolean" ? "true or false" : type === "int[]" ? "1, 2, 3" : "Value"}
                value={value}
                onChange={setValue}
              />
              {error && <Text tone="secondary" style={{ color: "#d13438" }} size="small">{error}</Text>}
              <Row gap={8}>
                <Button variant="primary" onClick={handleDeclare}>Declare</Button>
                <Button variant="ghost" onClick={handleReset}>Clear</Button>
              </Row>
            </Stack>
          </CardBody>
        </Card>

        <Grid columns={2} gap={16}>
          <Card>
            <CardHeader>Live Stack</CardHeader>
            <CardBody style={{ maxHeight: 350, overflowY: "auto" }}>
              {variables.length === 0 ? <Text tone="tertiary" italic>Empty</Text> : (
                <Stack gap={8}>
                  {variables.map((v, i) => (
                    <div key={i} style={{ border: "1px solid rgba(128,128,128,0.2)", padding: 8, borderRadius: 4 }}>
                      <Row justify="space-between">
                        <Text weight="bold">{v.name}</Text>
                        <Text size="small" tone="secondary">{v.type}</Text>
                      </Row>
                      <Row justify="space-between" align="center" style={{ marginTop: 4 }}>
                        <Text size="small" tone="secondary">Value:</Text>
                        <Code>{v.value}</Code>
                      </Row>
                    </div>
                  ))}
                </Stack>
              )}
            </CardBody>
          </Card>
          
          <Card>
            <CardHeader>Live Heap</CardHeader>
            <CardBody style={{ maxHeight: 350, overflowY: "auto" }}>
              {heapObjects.length === 0 ? <Text tone="tertiary" italic>Empty</Text> : (
                <Stack gap={8}>
                  {heapObjects.map((obj, i) => (
                    <div key={i} style={{ border: "1px solid rgba(128,128,128,0.2)", padding: 8, borderRadius: 4, backgroundColor: "rgba(255,165,0,0.05)" }}>
                      <Row justify="space-between">
                        <Text size="small" tone="secondary">Addr: {obj.id}</Text>
                        <Text size="small" tone="secondary">{obj.type}</Text>
                      </Row>
                      <div style={{ marginTop: 4, textAlign: "center" }}>
                        <Text weight="bold">{obj.data}</Text>
                      </div>
                    </div>
                  ))}
                </Stack>
              )}
            </CardBody>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}

function ScopeVisualizer() {
  const [activeFrame, setActiveFrame] = useState<"class" | "main" | "block">("class");

  const getVisibility = (scope: string) => {
    if (activeFrame === "class") return scope === "class" ? 1 : 0.3;
    if (activeFrame === "main") return (scope === "class" || scope === "main") ? 1 : 0.3;
    if (activeFrame === "block") return 1; // all visible
    return 0.3;
  };

  const getHighlight = (scope: string) => {
    return activeFrame === scope ? "rgba(0, 120, 255, 0.15)" : "transparent";
  };

  return (
    <Stack gap={24}>
      <Stack gap={8}>
        <H2>Variable Scope Visualizer</H2>
        <Text>Scope determines where a variable exists and can be accessed. Click the buttons below to simulate the execution cursor moving deeper into nested blocks.</Text>
      </Stack>

      <Row gap={8} wrap>
        <Button variant={activeFrame === "class" ? "primary" : "secondary"} onClick={() => setActiveFrame("class")}>Outside Method (Class Scope)</Button>
        <Button variant={activeFrame === "main" ? "primary" : "secondary"} onClick={() => setActiveFrame("main")}>Inside Method (Local Scope)</Button>
        <Button variant={activeFrame === "block" ? "primary" : "secondary"} onClick={() => setActiveFrame("block")}>Inside If-Statement (Block Scope)</Button>
      </Row>

      <Grid columns="1.5fr 1fr" gap={24}>
        <Card>
          <CardHeader>Java Code</CardHeader>
          <CardBody style={{ padding: 0 }}>
            <div style={{ fontFamily: "monospace", fontSize: 13, lineHeight: 1.6, overflowX: "auto" }}>
              <div style={{ padding: "8px 16px", backgroundColor: getHighlight("class"), transition: "background-color 0.2s" }}>
                <span style={{ color: "#c678dd" }}>public class</span> App {"{"}<br/>
                &nbsp;&nbsp;<span style={{ color: "#c678dd" }}>static int</span> globalCount = <span style={{ color: "#d19a66" }}>100</span>; <span style={{ color: "#5c6370" }}>// Class scope</span><br/>
              </div>

              <div style={{ padding: "8px 16px", backgroundColor: getHighlight("main"), transition: "background-color 0.2s" }}>
                &nbsp;&nbsp;<span style={{ color: "#c678dd" }}>public static void</span> <span style={{ color: "#61afef" }}>main</span>(String[] args) {"{"}<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#c678dd" }}>int</span> localMain = <span style={{ color: "#d19a66" }}>50</span>; <span style={{ color: "#5c6370" }}>// Method scope</span><br/>
              </div>

              <div style={{ padding: "8px 16px", backgroundColor: getHighlight("block"), transition: "background-color 0.2s" }}>
                &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#c678dd" }}>if</span> (globalCount &gt; <span style={{ color: "#d19a66" }}>0</span>) {"{"}<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#c678dd" }}>int</span> blockLevel = <span style={{ color: "#d19a66" }}>10</span>; <span style={{ color: "#5c6370" }}>// Block scope</span><br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;System.out.<span style={{ color: "#61afef" }}>println</span>(globalCount + localMain + blockLevel);<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;{"}"}<br/>
              </div>

              <div style={{ padding: "8px 16px", backgroundColor: getHighlight("main"), transition: "background-color 0.2s" }}>
                &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#5c6370" }}>// blockLevel is DESTROYED here. It cannot be accessed anymore.</span><br/>
                &nbsp;&nbsp;{"}"}<br/>
              </div>
              <div style={{ padding: "8px 16px", backgroundColor: getHighlight("class"), transition: "background-color 0.2s" }}>
                {"}"}
              </div>
            </div>
          </CardBody>
        </Card>

        <Stack gap={16}>
          <Card>
            <CardHeader>Currently Accessible Variables</CardHeader>
            <CardBody>
              <Stack gap={12}>
                <div style={{ opacity: getVisibility("class"), transition: "opacity 0.2s" }}>
                  <Row justify="space-between" align="center">
                    <Code>globalCount</Code>
                    <Pill size="sm" active>Class Scope</Pill>
                  </Row>
                  <Text size="small" tone="secondary" style={{ marginTop: 4 }}>Alive for the lifetime of the program.</Text>
                </div>
                
                <Divider />

                <div style={{ opacity: getVisibility("main"), transition: "opacity 0.2s" }}>
                  <Row justify="space-between" align="center">
                    <Code>localMain</Code>
                    <Pill size="sm" active={activeFrame === "main" || activeFrame === "block"}>Method Scope</Pill>
                  </Row>
                  <Text size="small" tone="secondary" style={{ marginTop: 4 }}>Alive while the main() method is executing.</Text>
                </div>

                <Divider />

                <div style={{ opacity: getVisibility("block"), transition: "opacity 0.2s" }}>
                  <Row justify="space-between" align="center">
                    <Code>blockLevel</Code>
                    <Pill size="sm" active={activeFrame === "block"}>Block Scope</Pill>
                  </Row>
                  <Text size="small" tone="secondary" style={{ marginTop: 4 }}>Alive ONLY inside the if-statement.</Text>
                </div>
              </Stack>
            </CardBody>
          </Card>
          
          <Callout tone="warning">
            Variables declared in an inner scope can access variables in outer scopes, but outer scopes cannot access variables declared inside inner scopes.
          </Callout>
        </Stack>
      </Grid>

      <Divider style={{ margin: "24px 0" }} />
      <DynamicScopeSimulator />
    </Stack>
  );
}

function DynamicScopeSimulator() {
  const [level, setLevel] = useState<"class" | "method" | "block">("class");
  const [classVar, setClassVar] = useState("10");
  const [methodVar, setMethodVar] = useState("");
  const [blockVar, setBlockVar] = useState("");

  const accessibleVars = [];
  if (level === "class" || level === "method" || level === "block") {
    if (classVar) accessibleVars.push({ name: "classVar", value: classVar, source: "Class Scope" });
  }
  if (level === "method" || level === "block") {
    if (methodVar) accessibleVars.push({ name: "methodVar", value: methodVar, source: "Method Scope" });
  }
  if (level === "block") {
    if (blockVar) accessibleVars.push({ name: "blockVar", value: blockVar, source: "Block Scope" });
  }

  return (
    <Stack gap={16}>
      <H2>Live Scope Sandbox</H2>
      <Text tone="secondary">Test which variables are accessible at different levels. Type values and shift execution context!</Text>
      
      <Grid columns="1fr 1fr" gap={24}>
        <Card>
          <CardHeader>Execution Level</CardHeader>
          <CardBody>
            <Stack gap={16}>
              <Stack gap={8}>
                <Text size="small" tone="secondary">Where is the execution cursor right now?</Text>
                <Row gap={8} wrap>
                  <Button variant={level === "class" ? "primary" : "secondary"} onClick={() => setLevel("class")}>Class Level</Button>
                  <Button variant={level === "method" ? "primary" : "secondary"} onClick={() => setLevel("method")}>Inside Method</Button>
                  <Button variant={level === "block" ? "primary" : "secondary"} onClick={() => setLevel("block")}>Inside Block (if)</Button>
                </Row>
              </Stack>
              <Divider />
              <Stack gap={8}>
                <TextInput placeholder="Set Class Var (global)" value={classVar} onChange={setClassVar} />
                <TextInput placeholder="Set Method Var (local)" value={methodVar} onChange={setMethodVar} />
                <TextInput placeholder="Set Block Var (inner)" value={blockVar} onChange={setBlockVar} />
              </Stack>
            </Stack>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>Currently Accessible</CardHeader>
          <CardBody style={{ minHeight: 150 }}>
            {accessibleVars.length === 0 ? <Text tone="tertiary" italic>No variables visible in this scope</Text> : (
              <Stack gap={8}>
                {accessibleVars.map((v, i) => (
                  <div key={i} style={{ border: "1px solid rgba(128,128,128,0.2)", padding: 8, borderRadius: 4 }}>
                    <Row justify="space-between" align="center">
                      <Text weight="bold">{v.name} = {v.value}</Text>
                      <Pill size="sm" active>{v.source}</Pill>
                    </Row>
                  </div>
                ))}
              </Stack>
            )}
          </CardBody>
        </Card>
      </Grid>
    </Stack>
  );
}

function TypeCasting() {
  const [castType, setCastType] = useState<"widening" | "narrowing">("widening");

  return (
    <Stack gap={24}>
      <H2>Type Casting</H2>
      <Text>Type casting is when you assign a value of one primitive data type to another type.</Text>

      <Row gap={8} wrap>
        <Button variant={castType === "widening" ? "primary" : "secondary"} onClick={() => setCastType("widening")}>Widening Casting (Implicit)</Button>
        <Button variant={castType === "narrowing" ? "primary" : "secondary"} onClick={() => setCastType("narrowing")}>Narrowing Casting (Explicit)</Button>
      </Row>

      {castType === "widening" && (
        <Grid columns={2} gap={24}>
          <Stack gap={16}>
            <Text tone="secondary">Converting a smaller type to a larger type size. This is done automatically by Java because there is no risk of losing data.</Text>
            <Card>
              <CardHeader>Code Example</CardHeader>
              <CardBody>
                <div style={{ padding: 12, backgroundColor: "rgba(0,0,0,0.1)", borderRadius: 6 }}>
                  <pre style={{ margin: 0, fontFamily: "monospace", fontSize: 13, color: "inherit" }}>
                    {`int myInt = 9;
// Automatic casting: int to double
double myDouble = myInt; 

System.out.println(myInt);    // Outputs 9
System.out.println(myDouble); // Outputs 9.0`}
                  </pre>
                </div>
              </CardBody>
            </Card>
            <Callout tone="success" title="Safe">
              Data size grows (4 bytes → 8 bytes). No precision is lost.
            </Callout>
          </Stack>
          
          <Card>
            <CardHeader>Visualizing Widening</CardHeader>
            <CardBody>
              <Stack gap={16} style={{ paddingTop: 24, alignItems: "center" }}>
                <Row align="center" gap={16}>
                  <div style={{ width: 80, height: 80, border: "2px solid #0078D4", borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,120,255,0.1)" }}>
                    <Text weight="bold">int</Text>
                    <Text size="small">9</Text>
                  </div>
                  <Text>➔</Text>
                  <div style={{ width: 140, height: 140, border: "2px dashed #107C10", borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(16,124,16,0.1)" }}>
                    <Text weight="bold">double</Text>
                    <Text size="small">9.0</Text>
                    <Text size="small" tone="secondary" style={{ marginTop: 8 }}>(Extra space added)</Text>
                  </div>
                </Row>
                <Text tone="secondary" size="small">byte → short → char → int → long → float → double</Text>
              </Stack>
            </CardBody>
          </Card>
        </Grid>
      )}

      {castType === "narrowing" && (
        <Grid columns={2} gap={24}>
          <Stack gap={16}>
            <Text tone="secondary">Converting a larger type to a smaller size type. This must be done manually by placing the type in parentheses in front of the value.</Text>
            <Card>
              <CardHeader>Code Example</CardHeader>
              <CardBody>
                <div style={{ padding: 12, backgroundColor: "rgba(0,0,0,0.1)", borderRadius: 6 }}>
                  <pre style={{ margin: 0, fontFamily: "monospace", fontSize: 13, color: "inherit" }}>
                    {`double myDouble = 9.78d;
// Manual casting: double to int
int myInt = (int) myDouble; 

System.out.println(myDouble); // Outputs 9.78
System.out.println(myInt);    // Outputs 9`}
                  </pre>
                </div>
              </CardBody>
            </Card>
            <Callout tone="warning" title="Data Loss Risk">
              Because an int cannot hold decimal values, the .78 is truncated and lost forever.
            </Callout>
          </Stack>

          <Card>
            <CardHeader>Visualizing Narrowing</CardHeader>
            <CardBody>
              <Stack gap={16} style={{ paddingTop: 24, alignItems: "center" }}>
                <Row align="center" gap={16}>
                  <div style={{ width: 140, height: 140, border: "2px dashed #0078D4", borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,120,255,0.1)" }}>
                    <Text weight="bold">double</Text>
                    <Text size="small">9.78</Text>
                  </div>
                  <Text>➔</Text>
                  <div style={{ width: 80, height: 80, border: "2px solid #D13438", borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(209,52,56,0.1)" }}>
                    <Text weight="bold">int</Text>
                    <Text size="small">9</Text>
                  </div>
                </Row>
                <Text tone="secondary" size="small">double → float → long → int → char → short → byte</Text>
              </Stack>
            </CardBody>
          </Card>
        </Grid>
      )}

      <Divider style={{ margin: "24px 0" }} />
      <DynamicCastingSimulator />
    </Stack>
  );
}

function DynamicCastingSimulator() {
  const theme = useHostTheme();
  const selectStyle = { background: theme.bg.elevated, color: theme.text.primary };
  const [value, setValue] = useState("9.78");
  const [fromType, setFromType] = useState("double");
  const [toType, setToType] = useState("int");

  const types = ["byte", "short", "int", "long", "float", "double"];
  const typeRank = { byte: 1, short: 2, int: 3, long: 4, float: 5, double: 6 };

  const getCastedValue = () => {
    let num = Number(value);
    if (isNaN(num)) return "Error: Not a number";

    if (toType === "byte") return String((num | 0) % 256);
    if (toType === "short") return String((num | 0) % 65536);
    if (toType === "int") return String(num | 0);
    if (toType === "long") return String(Math.trunc(num));
    if (toType === "float" || toType === "double") return String(num);
    return "Error";
  };

  const fromRank = typeRank[fromType as keyof typeof typeRank] ?? 0;
  const toRank = typeRank[toType as keyof typeof typeRank] ?? 0;
  const isWidening = toRank >= fromRank;

  return (
    <Stack gap={16}>
      <H2>Live Casting Sandbox</H2>
      <Text tone="secondary">Test how data changes when casting between numeric types.</Text>
      
      <Grid columns="1fr 1fr" gap={24}>
        <Card>
          <CardHeader>Configure Cast</CardHeader>
          <CardBody>
            <Stack gap={16}>
              <TextInput placeholder="Enter a number" value={value} onChange={setValue} />
              <Row gap={8} align="center">
                <Text size="small" tone="secondary" style={{ width: 40 }}>From:</Text>
                <Select value={fromType} onChange={setFromType} options={types.map(t => ({value: t, label: t}))} style={selectStyle} />
              </Row>
              <Row gap={8} align="center">
                <Text size="small" tone="secondary" style={{ width: 40 }}>To:</Text>
                <Select value={toType} onChange={setToType} options={types.map(t => ({value: t, label: t}))} style={selectStyle} />
              </Row>
            </Stack>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>Result</CardHeader>
          <CardBody>
            <Stack gap={16} style={{ paddingTop: 8, alignItems: "center" }}>
              <Callout tone={isWidening ? "success" : "warning"} title={isWidening ? "Implicit Widening (Safe)" : "Explicit Narrowing (Data Loss Risk)"} />
              <Row align="center" gap={16}>
                <div style={{ width: 100, padding: 16, border: "2px solid #ccc", borderRadius: 8, textAlign: "center" }}>
                  <Text weight="bold">{fromType}</Text>
                  <Text>{value || "0"}</Text>
                </div>
                <Text>➔</Text>
                <div style={{ width: 100, padding: 16, border: isWidening ? "2px solid #107C10" : "2px solid #D13438", borderRadius: 8, textAlign: "center", backgroundColor: isWidening ? "rgba(16,124,16,0.05)" : "rgba(209,52,56,0.05)" }}>
                  <Text weight="bold">{toType}</Text>
                  <Text>{getCastedValue()}</Text>
                </div>
              </Row>
              {!isWidening && <Text tone="secondary" size="small">Note: Java requires <Code>({toType})</Code> syntax here.</Text>}
            </Stack>
          </CardBody>
        </Card>
      </Grid>
    </Stack>
  );
}

function PassByValue() {
  const [step, setStep] = useState(0);

  const primitiveSteps = [
    {
      code: "int a = 10;\nmodify(a);\nSystem.out.println(a); // 10!",
      method: "void modify(int x) {\n  x = 20;\n}",
      desc: "Java passes primitives by value. The method gets a COPY of the value, not the original variable. Modifying 'x' inside the method does nothing to 'a' outside.",
      vars: [
        { name: "main: a", val: "10" },
        { name: "modify: x", val: "10 (then 20)", highlight: true }
      ]
    },
    {
      code: "int[] arr = {1};\nmodify(arr);\nSystem.out.println(arr[0]); // 20!",
      method: "void modify(int[] ref) {\n  ref[0] = 20;\n}",
      desc: "Java passes object references by value. The method gets a COPY of the MEMORY ADDRESS. Since both 'arr' and 'ref' point to the same array in the Heap, modifying the array contents affects the original!",
      vars: [
        { name: "main: arr", val: "Addr: 0x55" },
        { name: "modify: ref", val: "Addr: 0x55" }
      ],
      heap: "{1} becomes {20}"
    },
    {
      code: "int[] arr = {1};\nreassign(arr);\nSystem.out.println(arr[0]); // 1!",
      method: "void reassign(int[] ref) {\n  ref = new int[]{99};\n}",
      desc: "However, if you reassign the reference variable inside the method to a NEW object, it only affects the local copy of the address. The original 'arr' still points to the old array.",
      vars: [
        { name: "main: arr", val: "Addr: 0x55" },
        { name: "reassign: ref", val: "Addr: 0x55 -> 0x99", highlight: true }
      ],
      heap: "Addr 0x55: {1}\nAddr 0x99: {99}"
    }
  ];

  const current = primitiveSteps[step];

  return (
    <Stack gap={24}>
      <H2>Pass-by-Value in Java</H2>
      <Text>Java is strictly "pass-by-value". But what is being passed depends on if it's a primitive or an object reference.</Text>

      <Row gap={8}>
        <Button variant={step === 0 ? "primary" : "secondary"} onClick={() => setStep(0)}>Passing Primitives</Button>
        <Button variant={step === 1 ? "primary" : "secondary"} onClick={() => setStep(1)}>Passing References (Modifying)</Button>
        <Button variant={step === 2 ? "primary" : "secondary"} onClick={() => setStep(2)}>Passing References (Reassigning)</Button>
      </Row>

      <Grid columns="1.5fr 1fr" gap={24}>
        <Card>
          <CardHeader>Code</CardHeader>
          <CardBody>
            <Stack gap={16}>
              <div style={{ padding: 12, backgroundColor: "rgba(0,0,0,0.1)", borderRadius: 6 }}>
                <pre style={{ margin: 0, fontFamily: "monospace", fontSize: 13, color: "inherit" }}>
                  {current.code}
                </pre>
              </div>
              <Divider />
              <Text weight="semibold">Method Definition:</Text>
              <div style={{ padding: 12, backgroundColor: "rgba(0,0,0,0.1)", borderRadius: 6 }}>
                <pre style={{ margin: 0, fontFamily: "monospace", fontSize: 13, color: "inherit" }}>
                  {current.method}
                </pre>
              </div>
            </Stack>
          </CardBody>
        </Card>

        <Stack gap={16}>
          <Callout tone={step === 0 ? "success" : step === 1 ? "warning" : "info"}>
            {current.desc}
          </Callout>
          
          <Card>
            <CardHeader>Stack State during method call</CardHeader>
            <CardBody>
              <Stack gap={8}>
                {current.vars.map((v, i) => (
                  <div key={i}>
                    <Row justify="space-between" align="center" style={{ padding: 8, backgroundColor: v.highlight ? "rgba(0,120,255,0.1)" : "transparent", borderRadius: 4 }}>
                      <Code>{v.name}</Code>
                      <Text weight="bold">{v.val}</Text>
                    </Row>
                  </div>
                ))}
              </Stack>
            </CardBody>
          </Card>

          {current.heap && (
            <Card>
              <CardHeader>Heap State</CardHeader>
              <CardBody>
                <pre style={{ margin: 0, fontFamily: "monospace", fontSize: 13, color: "inherit" }}>
                  {current.heap}
                </pre>
              </CardBody>
            </Card>
          )}
        </Stack>
      </Grid>

      <Divider style={{ margin: "24px 0" }} />
      <DynamicPassByValueSimulator />
    </Stack>
  );
}

function DynamicPassByValueSimulator() {
  const [startVal, setStartVal] = useState("10");
  const [methodVal, setMethodVal] = useState("20");
  const [isReference, setIsReference] = useState(false);
  const [reassign, setReassign] = useState(false);

  const originalMemory = isReference ? "Heap Addr: 0x99" : startVal;
  const paramMemory = isReference ? (reassign ? "Heap Addr: 0x88" : "Heap Addr: 0x99") : methodVal;

  const originalFinal = isReference ? (reassign ? "Heap Object [0] = " + startVal : "Heap Object [0] = " + methodVal) : startVal;

  return (
    <Stack gap={16}>
      <H2>Live Pass-by-Value Sandbox</H2>
      <Text tone="secondary">Test how methods affect your original variables.</Text>
      
      <Grid columns="1fr 1fr" gap={24}>
        <Card>
          <CardHeader>Method Simulator</CardHeader>
          <CardBody>
            <Stack gap={16}>
              <Stack gap={8}>
                <Text size="small" tone="secondary">Data Type:</Text>
                <Row gap={8} wrap>
                  <Button variant={!isReference ? "primary" : "secondary"} onClick={() => {setIsReference(false); setReassign(false);}}>Primitive (int)</Button>
                  <Button variant={isReference ? "primary" : "secondary"} onClick={() => setIsReference(true)}>Reference (int[])</Button>
                </Row>
              </Stack>
              <TextInput placeholder="Initial Value" value={startVal} onChange={setStartVal} />
              
              <Divider />
              
              <Stack gap={8}>
                <Text weight="bold">Inside Method Action:</Text>
                {isReference && (
                  <Row gap={8} wrap>
                    <Button variant={!reassign ? "primary" : "secondary"} onClick={() => setReassign(false)}>Modify Object</Button>
                    <Button variant={reassign ? "primary" : "secondary"} onClick={() => setReassign(true)}>Reassign variable entirely</Button>
                  </Row>
                )}
                <TextInput placeholder="New Value / Modification" value={methodVal} onChange={setMethodVal} />
              </Stack>
            </Stack>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>Execution Results</CardHeader>
          <CardBody>
            <Stack gap={16}>
              <div style={{ padding: 12, border: "1px solid rgba(128,128,128,0.2)", borderRadius: 6 }}>
                <Text size="small" tone="secondary">Original Variable passes to method:</Text>
                <Text weight="bold" style={{ color: "#0078D4" }}>Copied: {originalMemory}</Text>
              </div>

              <div style={{ padding: 12, border: "1px solid rgba(128,128,128,0.2)", borderRadius: 6 }}>
                <Text size="small" tone="secondary">Inside Method changes value to:</Text>
                <Text weight="bold" style={{ color: "#107C10" }}>{paramMemory} (val: {methodVal})</Text>
              </div>

              <Divider />

              <div style={{ padding: 12, backgroundColor: "rgba(0,0,0,0.1)", borderRadius: 6 }}>
                <Text size="small" tone="secondary">Original Variable After Method Completes:</Text>
                <Text weight="bold" style={{ fontSize: 18 }}>{originalFinal}</Text>
              </div>
            </Stack>
          </CardBody>
        </Card>
      </Grid>
    </Stack>
  );
}

function Cheatsheet() {
  const primitiveRows = [
    [<Code>byte</Code>, "1 byte", "Integer: -128 to 127"],
    [<Code>short</Code>, "2 bytes", "Integer: -32,768 to 32,767"],
    [<Code>int</Code>, "4 bytes", "Integer: -2^31 to 2^31-1"],
    [<Code>long</Code>, "8 bytes", "Integer: -2^63 to 2^63-1"],
    [<Code>float</Code>, "4 bytes", "Decimal (Single-precision)"],
    [<Code>double</Code>, "8 bytes", "Decimal (Double-precision)"],
    [<Code>boolean</Code>, "1 bit", "true or false"],
    [<Code>char</Code>, "2 bytes", "Single Unicode character"]
  ];

  return (
    <Stack gap={16}>
      <H2>Primitives Cheatsheet</H2>
      <Text>Quick reference for basic Java types.</Text>
      <Table 
        headers={["Type", "Size", "Description"]}
        rows={primitiveRows}
      />
      <Callout tone="neutral">
        Remember: In Java, reference types start with an uppercase letter (String, Scanner, Integer) or are arrays (int[]), while primitives start with lowercase (int, boolean, char).
      </Callout>
    </Stack>
  );
}
