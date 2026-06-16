import {
  H1, H2, H3, Text, Card, CardHeader, CardBody, Stack, Row, Grid,
  TextInput, Toggle, Table, Code, useCanvasState, Callout, Select, Divider,
  useHostTheme
} from "cursor/canvas";

export default function JavaOperators() {
  const theme = useHostTheme();
  const selectStyle = { background: theme.bg.elevated, color: theme.text.primary };
  const [aStr, setA] = useCanvasState("a", "10");
  const [bStr, setB] = useCanvasState("b", "5");
  const [x, setX] = useCanvasState("x", true);
  const [y, setY] = useCanvasState("y", false);
  
  // Visual Builder State
  const [op1, setOp1] = useCanvasState("op1", "a");
  const [operator, setOperator] = useCanvasState("operator", "+");
  const [op2, setOp2] = useCanvasState("op2", "b");

  const a = parseInt(aStr, 10) || 0;
  const b = parseInt(bStr, 10) || 0;

  // Visual Builder Evaluation
  const getVal = (v: string) => {
    if (v === "a") return a;
    if (v === "b") return b;
    if (v === "x") return x;
    if (v === "y") return y;
    if (v === "true") return true;
    if (v === "false") return false;
    return Number(v);
  };

  const val1 = getVal(op1);
  const val2 = getVal(op2);

  let builderResult = "";
  let builderError = "";

  try {
    let res: any;
    
    switch (operator) {
      case "+": res = (val1 as any) + (val2 as any); break;
      case "-": res = (val1 as any) - (val2 as any); break;
      case "*": res = (val1 as any) * (val2 as any); break;
      case "/": 
        if (val2 === 0) throw new Error("ArithmeticException: / by zero");
        res = (val1 as any) / (val2 as any); 
        break;
      case "%": 
        if (val2 === 0) throw new Error("ArithmeticException: / by zero");
        res = (val1 as any) % (val2 as any); 
        break;
      case "==": res = val1 == val2; break;
      case "!=": res = val1 != val2; break;
      case ">": res = val1 > val2; break;
      case "<": res = val1 < val2; break;
      case ">=": res = val1 >= val2; break;
      case "<=": res = val1 <= val2; break;
      case "&&": res = val1 && val2; break;
      case "||": res = val1 || val2; break;
      case "&": res = (val1 as any) & (val2 as any); break;
      case "|": res = (val1 as any) | (val2 as any); break;
      case "^": res = (val1 as any) ^ (val2 as any); break;
      case "<<": res = (val1 as any) << (val2 as any); break;
      case ">>": res = (val1 as any) >> (val2 as any); break;
      case ">>>": res = (val1 as any) >>> (val2 as any); break;
      default: throw new Error("Unknown operator");
    }
    
    // Handle Java-specific integer division truncation
    if (operator === '/' && typeof val1 === 'number' && typeof val2 === 'number') {
      builderResult = val2 !== 0 ? String(Math.trunc(res)) : "ArithmeticException: / by zero";
    } else {
      builderResult = String(res);
    }
  } catch (err) {
    builderError = err instanceof Error ? err.message : String(err);
  }

  const operandOptions = [
    { value: "a", label: "Variable a" },
    { value: "b", label: "Variable b" },
    { value: "x", label: "Variable x" },
    { value: "y", label: "Variable y" },
    { value: "10", label: "Number 10" },
    { value: "5", label: "Number 5" },
    { value: "-3", label: "Number -3" },
    { value: "true", label: "Boolean true" },
    { value: "false", label: "Boolean false" },
  ];

  const operatorOptions = [
    { value: "+", label: "+ (Add)" },
    { value: "-", label: "- (Subtract)" },
    { value: "*", label: "* (Multiply)" },
    { value: "/", label: "/ (Divide)" },
    { value: "%", label: "% (Modulo)" },
    { value: "==", label: "== (Equal)" },
    { value: "!=", label: "!= (Not Equal)" },
    { value: ">", label: "> (Greater)" },
    { value: "<", label: "< (Less)" },
    { value: ">=", label: ">= (Greater/Equal)" },
    { value: "<=", label: "<= (Less/Equal)" },
    { value: "&&", label: "&& (AND)" },
    { value: "||", label: "|| (OR)" },
    { value: "&", label: "& (Bitwise AND)" },
    { value: "|", label: "| (Bitwise OR)" },
    { value: "^", label: "^ (Bitwise XOR)" },
    { value: "<<", label: "<< (Left Shift)" },
    { value: ">>", label: ">> (Right Shift)" },
    { value: ">>>", label: ">>> (Unsigned Right Shift)" },
  ];

  const arithmeticRows = [
    ["Addition (+)", <Code>a + b</Code>, String(a + b)],
    ["Subtraction (-)", <Code>a - b</Code>, String(a - b)],
    ["Multiplication (*)", <Code>a * b</Code>, String(a * b)],
    ["Division (/)", <Code>a / b</Code>, b !== 0 ? String(Math.trunc(a / b)) : "ArithmeticException"],
    ["Modulo (%)", <Code>a % b</Code>, b !== 0 ? String(a % b) : "ArithmeticException"],
  ];

  const relationalRows = [
    ["Equal (==)", <Code>a == b</Code>, String(a === b)],
    ["Not Equal (!=)", <Code>a != b</Code>, String(a !== b)],
    ["Greater (>)", <Code>{"a > b"}</Code>, String(a > b)],
    ["Less (<)", <Code>{"a < b"}</Code>, String(a < b)],
    ["Greater/Equal (>=)", <Code>{"a >= b"}</Code>, String(a >= b)],
    ["Less/Equal (<=)", <Code>{"a <= b"}</Code>, String(a <= b)],
  ];

  const logicalRows = [
    ["AND (&&)", <Code>x && y</Code>, String(x && y)],
    ["OR (||)", <Code>x || y</Code>, String(x || y)],
    ["NOT (!)", <Code>!x</Code>, String(!x)],
  ];

  const bitwiseRows = [
    ["AND (&)", <Code>a & b</Code>, String(a & b)],
    ["OR (|)", <Code>a | b</Code>, String(a | b)],
    ["XOR (^)", <Code>a ^ b</Code>, String(a ^ b)],
    ["Complement (~)", <Code>~a</Code>, String(~a)],
    ["Left Shift (<<)", <Code>{"a << 1"}</Code>, String(a << 1)],
    ["Right Shift (>>)", <Code>{"a >> 1"}</Code>, String(a >> 1)],
    ["Unsigned Right (>>>)", <Code>{"a >>> 1"}</Code>, String(a >>> 1)],
  ];

  return (
    <Stack gap={24} style={{ padding: 24 }}>
      <Stack gap={8}>
        <H1>Java Operators & Expressions</H1>
        <Text tone="secondary">
          Interactive playground to explore how Java evaluates different operators. Build combinations or view the reference tables.
        </Text>
      </Stack>

      <Card>
        <CardHeader>Interactive Variables</CardHeader>
        <CardBody>
          <Grid columns={2} gap={24}>
            <Stack gap={12}>
              <H3>Numeric Variables</H3>
              <Row gap={12} align="center">
                <Text weight="semibold">a =</Text>
                <TextInput type="number" value={aStr} onChange={setA} style={{ width: 100 }} />
              </Row>
              <Row gap={12} align="center">
                <Text weight="semibold">b =</Text>
                <TextInput type="number" value={bStr} onChange={setB} style={{ width: 100 }} />
              </Row>
            </Stack>
            <Stack gap={12}>
              <H3>Boolean Variables</H3>
              <Row gap={12} align="center">
                <Text weight="semibold">x =</Text>
                <Toggle checked={x} onChange={setX} />
                <Text>{String(x)}</Text>
              </Row>
              <Row gap={12} align="center">
                <Text weight="semibold">y =</Text>
                <Toggle checked={y} onChange={setY} />
                <Text>{String(y)}</Text>
              </Row>
            </Stack>
          </Grid>
        </CardBody>
      </Card>

      <Card size="lg">
        <CardHeader>Visual Expression Builder</CardHeader>
        <CardBody>
          <Stack gap={20}>
            <Text tone="secondary">
              Select operands and an operator to see how they combine. Try mixing types (like adding a boolean and a number) to see what happens!
            </Text>
            
            <Row gap={16} align="center" wrap>
              <Select value={op1} onChange={setOp1} options={operandOptions} style={selectStyle} />
              <Select value={operator} onChange={setOperator} options={operatorOptions} style={selectStyle} />
              <Select value={op2} onChange={setOp2} options={operandOptions} style={selectStyle} />
              <Text weight="bold" style={{ fontSize: 20 }}>=</Text>
              {builderError ? (
                <Text style={{ color: "red" }} weight="semibold">{builderError}</Text>
              ) : (
                <Text weight="bold" style={{ fontSize: 20, color: "var(--canvas-accent-primary)" }}>
                  {builderResult}
                </Text>
              )}
            </Row>

            <Divider />
            
            <Row gap={8} align="center">
              <Text tone="tertiary">Evaluates as:</Text>
              <Code>{String(val1)} {operator} {String(val2)}</Code>
            </Row>
          </Stack>
        </CardBody>
      </Card>

      <Stack gap={16}>
        <H2>Reference Tables</H2>
        <Grid columns={2} gap={24}>
          <Stack gap={12}>
            <H3>Arithmetic</H3>
            <Table headers={["Operator", "Expression", "Result"]} rows={arithmeticRows} />
          </Stack>
          
          <Stack gap={12}>
            <H3>Relational</H3>
            <Table headers={["Operator", "Expression", "Result"]} rows={relationalRows} />
          </Stack>

          <Stack gap={12}>
            <H3>Logical</H3>
            <Table headers={["Operator", "Expression", "Result"]} rows={logicalRows} />
          </Stack>

          <Stack gap={12}>
            <H3>Bitwise</H3>
            <Table headers={["Operator", "Expression", "Result"]} rows={bitwiseRows} />
          </Stack>
        </Grid>
      </Stack>
      
    </Stack>
  );
}