export type Level = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export type Topic = {
  name: string;
  level: Level;
  since?: string;
  summary: string;
  details: string[];
  diagram?: string;
  simple?: string;
};

export type SubCategory = {
  name: string;
  topics: Topic[];
};

export type Category = {
  id: string;
  label: string;
  blurb: string;
  subs: SubCategory[];
};

export const LEVEL_ORDER: Level[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
];

export const DATA: Category[] = [
  {
    id: "platform",
    label: "1 · Platform & Tooling",
    blurb:
      "What Java actually is: the language, the runtime, and the toolchain that turns source into running programs.",
    subs: [
      {
        name: "Runtime architecture",
        topics: [
          {
            name: "JDK vs JRE vs JVM",
            level: "Beginner",
            simple:
              "In plain terms: the JVM runs your program, the JRE is what you need to run Java apps, and the JDK is what you need to build them.",
            diagram: "jdk-jre-jvm",
            summary:
              "The JVM executes bytecode, the JRE bundles the JVM plus core libraries, and the JDK adds compilers and dev tools.",
            details: ["JVM", "JRE", "JDK", "platform independence", "Write Once Run Anywhere"],
          },
          {
            name: "Editions & distributions",
            level: "Beginner",
            simple:
              "In plain terms: Java has one standard, and several companies ship their own free copies of it — pick any and you're fine.",
            diagram: "editions-distros",
            summary:
              "Java SE is the core platform; distributions (Oracle JDK, OpenJDK, Temurin, Corretto, Azul) ship the same spec with different support.",
            details: ["Java SE", "OpenJDK", "Temurin", "Corretto", "LTS releases"],
          },
          {
            name: "Bytecode & .class files",
            level: "Intermediate",
            diagram: "bytecode-class",
            summary:
              "javac compiles .java to portable .class bytecode that any conforming JVM can run; the verifier checks safety at load time.",
            details: [".class", "constant pool", "bytecode verifier", "magic 0xCAFEBABE"],
          },
        ],
      },
      {
        name: "Compiling & running",
        topics: [
          {
            name: "javac & java commands",
            level: "Beginner",
            simple:
              "In plain terms: one command turns your code into a runnable file, the other actually runs it.",
            diagram: "javac-java",
            summary:
              "javac compiles sources; java launches the main class. Since 11, java can run a single source file directly.",
            details: ["javac", "java", "main(String[])", "single-file launch (11)"],
          },
          {
            name: "Classpath & module path",
            level: "Intermediate",
            diagram: "classpath-modulepath",
            summary:
              "The classpath tells the JVM where to find classes/JARs; the module path is its modular counterpart.",
            details: ["-cp / -classpath", "CLASSPATH", "JAR", "--module-path"],
          },
          {
            name: "JShell (REPL)",
            level: "Beginner",
            simple:
              "In plain terms: a scratchpad where you type one line of Java and instantly see the result — no full program needed.",
            since: "9",
            diagram: "jshell-repl",
            summary:
              "An interactive read-eval-print loop for experimenting with expressions and snippets without a full class.",
            details: ["jshell", "snippets", "/vars", "instant feedback"],
          },
        ],
      },
      {
        name: "Build & packaging tools",
        topics: [
          {
            name: "Maven & Gradle",
            level: "Intermediate",
            diagram: "maven-gradle",
            summary:
              "Declarative build tools managing dependencies, lifecycle phases, and plugins. Maven uses XML POMs; Gradle uses a Groovy/Kotlin DSL.",
            details: ["pom.xml", "build.gradle", "dependency mgmt", "central repo"],
          },
          {
            name: "jlink & jpackage",
            level: "Advanced",
            since: "11/14",
            diagram: "jlink-jpackage",
            summary:
              "Create minimal custom runtime images (jlink) and native OS installers/app bundles (jpackage).",
            details: ["jlink runtime image", "jpackage", "jdeps", "self-contained app"],
          },
        ],
      },
    ],
  },
  {
    id: "basics",
    label: "2 · Language Fundamentals",
    blurb:
      "The atoms of every Java program: declarations, data types, operators, and the rules that govern them.",
    subs: [
      {
        name: "Program structure",
        topics: [
          {
            name: "Class, main & statements",
            level: "Beginner",
            simple:
              "In plain terms: every Java program lives inside a class and starts running at a special method called main.",
            diagram: "class-anatomy",
            summary:
              "Code lives in classes; execution starts at public static void main(String[]). Statements end with semicolons; blocks use braces.",
            details: ["public static void main", "package", "import", "statements & blocks"],
          },
          {
            name: "Comments & Javadoc",
            level: "Beginner",
            simple:
              "In plain terms: notes you write for humans that the computer simply ignores.",
            diagram: "comments",
            summary:
              "Line (//), block (/* */), and documentation (/** */) comments. Javadoc generates API docs from doc comments and tags.",
            details: ["//", "/* */", "/** */", "@param/@return", "javadoc tool"],
          },
          {
            name: "Identifiers, keywords & conventions",
            level: "Beginner",
            simple:
              "In plain terms: the rules for naming your things, plus a few words Java keeps for itself.",
            diagram: "identifiers",
            summary:
              "Naming rules plus reserved words. Convention: camelCase methods/fields, PascalCase types, UPPER_SNAKE constants.",
            details: ["reserved words", "camelCase", "PascalCase", "UPPER_SNAKE", "contextual keywords"],
          },
        ],
      },
      {
        name: "Data types",
        topics: [
          {
            name: "Primitive types",
            level: "Beginner",
            simple:
              "In plain terms: the most basic kinds of values — whole numbers, decimals, single characters, and true/false.",
            diagram: "primitives",
            summary:
              "Eight built-ins with fixed sizes: byte, short, int, long, float, double, char, boolean. Stored by value.",
            details: ["int 32-bit", "long 64-bit", "double", "char (UTF-16)", "boolean"],
          },
          {
            name: "Reference types & null",
            level: "Beginner",
            simple:
              "In plain terms: most values are really links to objects; a link that points at nothing is null.",
            diagram: "references-null",
            summary:
              "Objects, arrays, and interfaces are accessed via references; an unassigned reference is null and dereferencing it throws NPE.",
            details: ["references", "null", "NullPointerException", "heap allocation"],
          },
          {
            name: "Wrappers & autoboxing",
            level: "Intermediate",
            since: "5",
            diagram: "autoboxing-cache",
            summary:
              "Wrapper classes box primitives into objects; autoboxing/unboxing convert automatically. Beware cache and == pitfalls.",
            details: ["Integer/Double", "autoboxing", "Integer cache -128..127", "unboxing NPE"],
          },
          {
            name: "Type conversion & casting",
            level: "Beginner",
            simple:
              "In plain terms: changing a value from one type to another — sometimes automatic, sometimes you have to ask.",
            diagram: "casting",
            summary:
              "Widening conversions are implicit; narrowing requires an explicit cast and may lose data or overflow.",
            details: ["widening", "narrowing cast", "overflow", "instanceof"],
          },
          {
            name: "var (local type inference)",
            level: "Intermediate",
            since: "10",
            diagram: "var-inference",
            summary:
              "Infers the static type of a local variable from its initializer; the variable is still strongly, statically typed.",
            details: ["var", "local-only", "initializer required", "not dynamic"],
          },
        ],
      },
      {
        name: "Operators & literals",
        topics: [
          {
            name: "Operators",
            level: "Beginner",
            simple:
              "In plain terms: the symbols that do math and comparisons, like +, -, and >.",
            diagram: "operators",
            summary:
              "Arithmetic, relational, logical, bitwise, shift, assignment, ternary, and instanceof — governed by precedence and associativity.",
            details: ["+ - * / %", "&& || !", "& | ^ ~ << >> >>>", "?:", "precedence"],
          },
          {
            name: "Literals & numeric formatting",
            level: "Beginner",
            simple:
              'In plain terms: how you write fixed values straight into code, like 42 or "hello".',
            diagram: "literals",
            summary:
              "Integer/float/char/string/boolean literals, with hex/octal/binary forms and underscores as digit separators.",
            details: ["0x / 0b / 0_", "1_000_000", "1.5e3", "'\\u0041'", "L/f/d suffixes"],
          },
        ],
      },
    ],
  },
  {
    id: "flow",
    label: "3 · Control Flow",
    blurb: "Directing execution: branching, looping, and the modern expression forms.",
    subs: [
      {
        name: "Branching",
        topics: [
          {
            name: "if / else if / else",
            level: "Beginner",
            simple:
              "In plain terms: do something only when a condition is true, otherwise do something else.",
            summary: "Conditional execution based on boolean expressions, optionally chained.",
            details: ["if", "else if", "else", "boolean condition"],
          },
          {
            name: "switch statement & expression",
            level: "Intermediate",
            since: "14",
            summary:
              "Multi-way branch on a value. The arrow-form switch expression returns a value, has no fall-through, and supports yield.",
            details: ["case ->", "yield", "no fall-through", "exhaustiveness", "default"],
          },
          {
            name: "Pattern matching for switch",
            level: "Advanced",
            since: "21",
            summary:
              "Switch on types and record patterns with guards, enabling concise type-driven dispatch.",
            details: ["type patterns", "record patterns", "when guards", "null case"],
          },
        ],
      },
      {
        name: "Iteration",
        topics: [
          {
            name: "for / while / do-while",
            level: "Beginner",
            simple:
              "In plain terms: repeat a block of code over and over until you're done.",
            summary: "Classic counted and conditional loops; do-while always runs the body once.",
            details: ["for(init;cond;upd)", "while", "do-while"],
          },
          {
            name: "Enhanced for (for-each)",
            level: "Beginner",
            simple:
              "In plain terms: go through every item in a list without counting positions yourself.",
            since: "5",
            summary: "Iterates arrays and Iterables without an explicit index or iterator.",
            details: ["for(T x : coll)", "Iterable", "no index"],
          },
          {
            name: "break, continue & labels",
            level: "Intermediate",
            summary:
              "break exits a loop/switch; continue skips to the next iteration; labels target outer loops.",
            details: ["break", "continue", "labeled break", "nested loops"],
          },
        ],
      },
    ],
  },
  {
    id: "numbers",
    label: "4 · Numbers, Math & Precision",
    blurb:
      "Numeric computation beyond primitives: math utilities, floating-point reality, arbitrary precision, and randomness.",
    subs: [
      {
        name: "Math & floating point",
        topics: [
          {
            name: "Math & StrictMath",
            level: "Beginner",
            simple:
              "In plain terms: a toolbox of ready-made math functions like square root, powers, and rounding.",
            summary:
              "Static math functions (abs, pow, sqrt, min/max, rounding, trig). StrictMath guarantees bit-for-bit reproducible results across platforms.",
            details: ["Math.abs/pow/sqrt", "round/ceil/floor", "min/max", "StrictMath", "Math.PI/E"],
          },
          {
            name: "Exact & floor arithmetic",
            level: "Intermediate",
            since: "8",
            summary:
              "Overflow-checked operations throw on wraparound; floor division/modulo give mathematically correct results for negatives.",
            details: ["addExact/multiplyExact", "toIntExact", "floorDiv", "floorMod", "ArithmeticException"],
          },
          {
            name: "Floating-point semantics",
            level: "Advanced",
            summary:
              "float/double follow IEEE 754: special values (NaN, ±Infinity, -0.0), rounding error, and non-associativity. NaN is unequal to itself.",
            details: ["IEEE 754", "NaN != NaN", "±Infinity", "-0.0", "Double.compare", "strictfp"],
          },
        ],
      },
      {
        name: "Arbitrary precision",
        topics: [
          {
            name: "BigInteger",
            level: "Advanced",
            summary:
              "Immutable integers of unbounded size for cryptography, factorials, and exact math where long overflows.",
            details: ["BigInteger", "immutable", "add/multiply/mod", "modPow", "no operators"],
          },
          {
            name: "BigDecimal",
            level: "Advanced",
            summary:
              "Immutable, exact decimal arithmetic with explicit scale and rounding — the correct type for money. Never build one from a double literal.",
            details: ["BigDecimal", "scale/precision", "RoundingMode", "MathContext", "compareTo not equals"],
          },
        ],
      },
      {
        name: "Randomness",
        topics: [
          {
            name: "Random & ThreadLocalRandom",
            level: "Intermediate",
            summary:
              "Pseudorandom generation from a seed; ThreadLocalRandom avoids contention in concurrent code. Deterministic given the same seed.",
            details: ["Random", "nextInt/nextDouble", "seed", "ThreadLocalRandom", "ints/doubles streams"],
          },
          {
            name: "SecureRandom & RandomGenerator",
            level: "Advanced",
            since: "17",
            summary:
              "SecureRandom is a cryptographically strong PRNG; the RandomGenerator interface unifies and offers pluggable algorithms.",
            details: ["SecureRandom", "CSPRNG", "RandomGenerator", "RandomGeneratorFactory", "splittable/jumpable"],
          },
        ],
      },
    ],
  },
  {
    id: "strings",
    label: "5 · Strings & Text",
    blurb: "Working with text: immutability, building, formatting, and pattern matching.",
    subs: [
      {
        name: "String fundamentals",
        topics: [
          {
            name: "Immutability & the string pool",
            level: "Beginner",
            simple:
              "In plain terms: text values never change once created, and Java quietly reuses identical ones.",
            summary:
              "Strings never change after creation; literals are interned in a shared pool, so == compares identity, not content.",
            details: ["immutable", "intern()", "== vs equals()", "string pool"],
          },
          {
            name: "Core String API",
            level: "Beginner",
            simple:
              "In plain terms: the built-in tools for working with text — length, search, upper/lowercase, splitting, and more.",
            summary:
              "Length, indexing, slicing, search, case, trim/strip, split/join, and replace operations.",
            details: ["length()", "substring", "indexOf", "split/join", "strip() (11)"],
          },
          {
            name: "StringBuilder & StringBuffer",
            level: "Intermediate",
            summary:
              "Mutable sequences for efficient concatenation in loops; StringBuffer is the synchronized variant.",
            details: ["StringBuilder", "append/insert", "StringBuffer (sync)", "capacity"],
          },
        ],
      },
      {
        name: "Formatting & blocks",
        topics: [
          {
            name: "Formatting & conversion",
            level: "Intermediate",
            summary:
              "String.format / formatted and printf-style conversions; parse with valueOf / parseXxx.",
            details: ["String.format", "%s %d %.2f", "valueOf", "parseInt"],
          },
          {
            name: "Text blocks",
            level: "Intermediate",
            since: "15",
            summary:
              "Multi-line string literals delimited by triple quotes with smart incidental-whitespace stripping.",
            details: ['"""', "multi-line", "incidental whitespace", "\\ line continuation"],
          },
        ],
      },
      {
        name: "Regular expressions",
        topics: [
          {
            name: "Pattern & Matcher",
            level: "Advanced",
            summary:
              "Compile regexes into Pattern, match with Matcher; supports groups, lookarounds, quantifiers, and flags.",
            details: ["Pattern.compile", "Matcher", "groups", "find/matches", "named groups"],
          },
        ],
      },
    ],
  },
  {
    id: "i18n",
    label: "6 · Internationalization & Encoding",
    blurb:
      "Writing software for the whole world: locale-aware formatting, externalized text, and correct character encoding.",
    subs: [
      {
        name: "Locale & resources",
        topics: [
          {
            name: "Locale & ResourceBundle",
            level: "Advanced",
            summary:
              "Locale identifies a language/region; ResourceBundle externalizes translatable text and resources selected by locale.",
            details: ["Locale", "ResourceBundle", "properties bundles", "fallback lookup", "MessageFormat"],
          },
          {
            name: "NumberFormat & DecimalFormat",
            level: "Intermediate",
            summary:
              "Locale-sensitive parsing and formatting of numbers, currency, and percentages with pattern-based control.",
            details: ["NumberFormat", "getCurrencyInstance", "DecimalFormat", "patterns", "grouping/decimal separators"],
          },
        ],
      },
      {
        name: "Character encoding",
        topics: [
          {
            name: "Charset & encoding",
            level: "Advanced",
            summary:
              "Charsets map bytes to characters; always specify one explicitly. UTF-8 is the default since 18. StandardCharsets avoids typos.",
            details: ["Charset", "StandardCharsets.UTF_8", "encode/decode", "getBytes(charset)", "default UTF-8 (18)"],
          },
          {
            name: "Unicode & normalization",
            level: "Expert",
            summary:
              "Java text is UTF-16, so code points beyond the BMP use surrogate pairs; Normalizer reconciles equivalent character sequences.",
            details: ["UTF-16", "code point vs char", "surrogate pairs", "Normalizer NFC/NFD", "codePointAt"],
          },
        ],
      },
    ],
  },
  {
    id: "arrays",
    label: "7 · Arrays",
    blurb: "Fixed-size, contiguous collections of a single type — the lowest-level aggregate.",
    subs: [
      {
        name: "Array essentials",
        topics: [
          {
            name: "Declaration & initialization",
            level: "Beginner",
            simple:
              "In plain terms: an array is a fixed-size row of boxes that all hold the same type of value.",
            summary:
              "Fixed-length objects with a length field; created with new or array initializers, default-zeroed.",
            details: ["int[] a = new int[n]", "{1,2,3}", "length", "0/null/false defaults"],
          },
          {
            name: "Multidimensional & jagged arrays",
            level: "Intermediate",
            summary:
              "Arrays of arrays; rows can have different lengths (jagged). Indexed with multiple subscripts.",
            details: ["int[][]", "jagged", "row-major", "ArrayIndexOutOfBounds"],
          },
          {
            name: "Arrays & System utilities",
            level: "Intermediate",
            summary:
              "Helpers for sort, search, fill, copy, compare, and conversion to List/stream.",
            details: ["Arrays.sort", "binarySearch", "copyOf", "System.arraycopy", "Arrays.asList"],
          },
        ],
      },
    ],
  },
  {
    id: "methods",
    label: "8 · Methods",
    blurb: "Reusable units of behavior: parameters, overloading, recursion, and the value-passing model.",
    subs: [
      {
        name: "Defining & calling",
        topics: [
          {
            name: "Signatures, parameters & return",
            level: "Beginner",
            simple:
              "In plain terms: a method is a reusable action — it takes inputs and can hand back a result.",
            summary:
              "A method has a name, parameter list, return type, and body; void means no return value.",
            details: ["return type", "parameters", "void", "return"],
          },
          {
            name: "Overloading",
            level: "Intermediate",
            summary:
              "Multiple methods sharing a name but differing in parameter lists; resolved at compile time by argument types.",
            details: ["same name", "different params", "compile-time resolution", "not by return type"],
          },
          {
            name: "Varargs",
            level: "Intermediate",
            since: "5",
            summary:
              "A trailing T... parameter accepts a variable number of arguments, received as an array.",
            details: ["T... args", "must be last", "treated as array", "ambiguity rules"],
          },
        ],
      },
      {
        name: "Semantics",
        topics: [
          {
            name: "Pass-by-value",
            level: "Intermediate",
            summary:
              "Java always copies arguments: primitives copy the value; references copy the pointer (so mutations are visible, reassignment is not).",
            details: ["always by value", "reference copy", "no output params", "mutation vs reassign"],
          },
          {
            name: "Recursion",
            level: "Intermediate",
            summary:
              "A method calling itself toward a base case; deep recursion risks StackOverflowError (no TCO in the JVM).",
            details: ["base case", "call stack", "StackOverflowError", "no tail-call opt"],
          },
          {
            name: "static vs instance & main",
            level: "Beginner",
            simple:
              "In plain terms: some methods belong to the class itself, others belong to one specific object.",
            summary:
              "Static methods belong to the class and need no instance; instance methods operate on an object via this.",
            details: ["static", "instance", "this", "method dispatch"],
          },
        ],
      },
    ],
  },
  {
    id: "oop-core",
    label: "9 · OOP — Classes & Objects",
    blurb: "Modeling state and behavior: the building blocks of object-oriented Java.",
    subs: [
      {
        name: "Class anatomy",
        topics: [
          {
            name: "Fields, methods & objects",
            level: "Beginner",
            simple:
              "In plain terms: a class is a blueprint; objects are the real things you build from it.",
            summary:
              "A class is a blueprint; objects are instances created with new. Fields hold state, methods define behavior.",
            details: ["class", "new", "fields", "methods", "instance"],
          },
          {
            name: "Constructors & this",
            level: "Beginner",
            simple:
              "In plain terms: a constructor is the special setup code that runs when a new object is created.",
            summary:
              "Special initializers run on creation; can be overloaded and chained with this(...); this refers to the current object.",
            details: ["constructor", "this()", "this.field", "default ctor", "overloaded ctors"],
          },
          {
            name: "Initialization order",
            level: "Advanced",
            summary:
              "Static initializers/fields run once at class load; instance initializers and field inits run before the constructor body.",
            details: ["static blocks", "instance blocks", "field init order", "super() first"],
          },
        ],
      },
      {
        name: "Members & lifecycle",
        topics: [
          {
            name: "static members",
            level: "Intermediate",
            summary:
              "Class-level fields and methods shared across all instances; accessed via the class name.",
            details: ["static field", "static method", "class-level", "no this"],
          },
          {
            name: "final fields & constants",
            level: "Intermediate",
            summary:
              "final prevents reassignment; static final defines compile-time constants. Aids immutability.",
            details: ["final", "static final", "blank final", "immutability"],
          },
          {
            name: "Object lifecycle & equals/hashCode",
            level: "Advanced",
            summary:
              "Override equals/hashCode together for value semantics; objects are reclaimed by GC (finalize is deprecated).",
            details: ["equals/hashCode contract", "toString", "Cleaner", "finalize() deprecated"],
          },
        ],
      },
    ],
  },
  {
    id: "oop-inherit",
    label: "10 · OOP — Inheritance & Polymorphism",
    blurb: "Reusing and specializing behavior through type hierarchies and dynamic dispatch.",
    subs: [
      {
        name: "Inheritance",
        topics: [
          {
            name: "extends & super",
            level: "Intermediate",
            summary:
              "A subclass inherits and extends a superclass; super accesses the parent's members and constructor.",
            details: ["extends", "super()", "single inheritance", "Object root"],
          },
          {
            name: "Overriding & @Override",
            level: "Intermediate",
            summary:
              "Subclasses redefine inherited methods; @Override catches signature mistakes at compile time.",
            details: ["@Override", "covariant returns", "no weaker access", "no broader checked ex"],
          },
          {
            name: "final & abstract classes",
            level: "Advanced",
            summary:
              "final classes/methods cannot be extended/overridden; abstract classes declare incomplete behavior.",
            details: ["final class", "final method", "abstract class", "abstract method"],
          },
        ],
      },
      {
        name: "Polymorphism",
        topics: [
          {
            name: "Dynamic dispatch",
            level: "Advanced",
            summary:
              "Overridden instance methods are resolved at runtime by the object's actual type (virtual invocation).",
            details: ["runtime binding", "virtual methods", "upcasting", "vtable concept"],
          },
          {
            name: "Casting & instanceof patterns",
            level: "Intermediate",
            since: "16",
            summary:
              "Downcast references explicitly; pattern instanceof binds and tests in one step, avoiding redundant casts.",
            details: ["(Type) cast", "ClassCastException", "instanceof x", "pattern binding"],
          },
          {
            name: "Object methods & contracts",
            level: "Advanced",
            summary:
              "equals, hashCode, toString, clone, and getClass form the universal contract every object inherits.",
            details: ["Object", "clone()/Cloneable", "getClass()", "Comparable vs Comparator"],
          },
        ],
      },
    ],
  },
  {
    id: "oop-abstraction",
    label: "11 · OOP — Abstraction & Interfaces",
    blurb: "Programming to contracts: decoupling what code does from how it does it.",
    subs: [
      {
        name: "Interfaces",
        topics: [
          {
            name: "Interface basics",
            level: "Intermediate",
            summary:
              "A type defining method contracts a class promises to implement; supports multiple inheritance of type.",
            details: ["interface", "implements", "multiple interfaces", "public abstract"],
          },
          {
            name: "default & static methods",
            level: "Advanced",
            since: "8",
            summary:
              "Interfaces can ship concrete default methods (evolvable APIs) and static helpers; private methods share logic.",
            details: ["default", "static", "private (9)", "diamond resolution"],
          },
          {
            name: "Functional interfaces",
            level: "Advanced",
            since: "8",
            summary:
              "A single-abstract-method interface usable as a lambda target; @FunctionalInterface enforces the shape.",
            details: ["@FunctionalInterface", "SAM", "lambda target", "java.util.function"],
          },
          {
            name: "constants & marker interfaces",
            level: "Intermediate",
            summary:
              "Interface fields are implicitly public static final; marker interfaces (Serializable) tag capabilities.",
            details: ["public static final", "Serializable", "Cloneable", "marker"],
          },
        ],
      },
      {
        name: "Abstraction strategy",
        topics: [
          {
            name: "Abstract class vs interface",
            level: "Advanced",
            summary:
              "Abstract classes share state and partial implementation (single inheritance); interfaces define multiple contracts.",
            details: ["state vs contract", "single vs multiple", "constructor vs none", "when to pick"],
          },
        ],
      },
    ],
  },
  {
    id: "oop-special",
    label: "12 · OOP — Nested & Special Types",
    blurb: "Specialized class forms: nested classes, enums, records, and sealed hierarchies.",
    subs: [
      {
        name: "Nested classes",
        topics: [
          {
            name: "Static nested & inner classes",
            level: "Advanced",
            summary:
              "Static nested classes are namespaced helpers; inner (non-static) classes hold a reference to the enclosing instance.",
            details: ["static nested", "inner class", "Outer.this", "enclosing instance"],
          },
          {
            name: "Local & anonymous classes",
            level: "Advanced",
            summary:
              "Classes defined inside a method or inline; capture effectively-final local variables.",
            details: ["local class", "anonymous class", "effectively final capture"],
          },
        ],
      },
      {
        name: "Modern data types",
        topics: [
          {
            name: "Enums",
            level: "Intermediate",
            since: "5",
            summary:
              "Type-safe constant sets that can carry fields, constructors, methods, and abstract per-constant behavior.",
            details: ["enum", "values()/valueOf", "EnumSet/EnumMap", "constant-specific methods"],
          },
          {
            name: "Records",
            level: "Advanced",
            since: "16",
            summary:
              "Transparent immutable data carriers with auto-generated constructor, accessors, equals, hashCode, and toString.",
            details: ["record", "components", "compact constructor", "implicit accessors"],
          },
          {
            name: "Sealed classes & interfaces",
            level: "Expert",
            since: "17",
            summary:
              "Restrict which types may extend/implement a type, enabling exhaustive pattern matching over a closed set.",
            details: ["sealed", "permits", "non-sealed", "exhaustiveness"],
          },
        ],
      },
    ],
  },
  {
    id: "generics",
    label: "13 · Generics",
    blurb: "Compile-time type safety and reuse via parameterized types and methods.",
    subs: [
      {
        name: "Parameterized types",
        topics: [
          {
            name: "Generic classes & methods",
            level: "Intermediate",
            since: "5",
            summary:
              "Type parameters let a single definition work over many types with compile-time checking and the diamond operator.",
            details: ["<T>", "<K,V>", "diamond <>", "type inference"],
          },
          {
            name: "Bounded type parameters",
            level: "Advanced",
            summary:
              "Constrain type arguments with extends to a supertype (or multiple bounds) so member methods are usable.",
            details: ["<T extends Number>", "multiple bounds", "recursive bound <T extends Comparable<T>>"],
          },
        ],
      },
      {
        name: "Variance & internals",
        topics: [
          {
            name: "Wildcards & PECS",
            level: "Expert",
            summary:
              "? extends T for covariant producers, ? super T for contravariant consumers — Producer Extends, Consumer Super.",
            details: ["? extends", "? super", "unbounded ?", "PECS"],
          },
          {
            name: "Type erasure & limits",
            level: "Expert",
            summary:
              "Generics exist only at compile time; runtime erases them, forbidding new T[], generic exceptions, and reifiable checks.",
            details: ["erasure", "no new T()", "bridge methods", "@SafeVarargs", "raw types"],
          },
        ],
      },
    ],
  },
  {
    id: "exceptions",
    label: "14 · Exceptions & Errors",
    blurb: "Signaling, propagating, and recovering from abnormal conditions.",
    subs: [
      {
        name: "Hierarchy",
        topics: [
          {
            name: "Throwable hierarchy",
            level: "Intermediate",
            summary:
              "Throwable splits into Error (unrecoverable JVM issues) and Exception, which includes RuntimeException.",
            details: ["Throwable", "Error", "Exception", "RuntimeException"],
          },
          {
            name: "Checked vs unchecked",
            level: "Intermediate",
            summary:
              "Checked exceptions must be declared/handled; unchecked (runtime) ones need not be. Drives API design.",
            details: ["checked", "unchecked", "throws clause", "fail-fast"],
          },
        ],
      },
      {
        name: "Handling",
        topics: [
          {
            name: "try / catch / finally",
            level: "Beginner",
            simple:
              "In plain terms: attempt risky code, deal with any error if it happens, and always clean up afterward.",
            summary:
              "Guard risky code, handle specific exception types, and run cleanup in finally regardless of outcome.",
            details: ["try", "catch", "finally", "multi-catch |", "rethrow"],
          },
          {
            name: "try-with-resources",
            level: "Advanced",
            since: "7",
            summary:
              "Auto-closes AutoCloseable resources in reverse order; suppressed exceptions are attached to the primary.",
            details: ["AutoCloseable", "close()", "suppressed exceptions", "effectively final (9)"],
          },
          {
            name: "Custom exceptions & chaining",
            level: "Advanced",
            summary:
              "Subclass Exception/RuntimeException for domain errors; wrap causes to preserve the original stack trace.",
            details: ["extends Exception", "cause chaining", "getCause()", "stack traces"],
          },
        ],
      },
    ],
  },
  {
    id: "collections",
    label: "15 · Collections Framework",
    blurb: "The unified library of data structures: lists, sets, maps, queues, and their algorithms.",
    subs: [
      {
        name: "Core interfaces",
        topics: [
          {
            name: "Collection, Iterable & Iterator",
            level: "Intermediate",
            summary:
              "Iterable enables for-each; Iterator walks elements with safe removal; the hierarchy roots at Collection.",
            details: ["Iterable", "Iterator", "hasNext/next", "ListIterator", "fail-fast"],
          },
        ],
      },
      {
        name: "Lists, Sets, Maps, Queues",
        topics: [
          {
            name: "List implementations",
            level: "Intermediate",
            summary:
              "Ordered, indexed sequences: ArrayList (random access), LinkedList (ends), Vector/Stack (legacy, synchronized).",
            details: ["ArrayList O(1) get", "LinkedList", "Vector/Stack legacy", "List.of (9)"],
          },
          {
            name: "Set implementations",
            level: "Intermediate",
            summary:
              "Unique elements: HashSet (unordered), LinkedHashSet (insertion order), TreeSet (sorted via comparator).",
            details: ["HashSet", "LinkedHashSet", "TreeSet/NavigableSet"],
          },
          {
            name: "Map implementations",
            level: "Intermediate",
            summary:
              "Key→value: HashMap (general), LinkedHashMap (order/LRU), TreeMap (sorted), with rich default methods.",
            details: ["HashMap", "TreeMap", "LinkedHashMap", "getOrDefault/computeIfAbsent/merge"],
          },
          {
            name: "Queue & Deque",
            level: "Advanced",
            summary:
              "FIFO and double-ended structures: ArrayDeque (stack/queue), PriorityQueue (heap-ordered).",
            details: ["ArrayDeque", "PriorityQueue", "offer/poll/peek", "Deque as stack"],
          },
        ],
      },
      {
        name: "Ordering & utilities",
        topics: [
          {
            name: "Comparable & Comparator",
            level: "Advanced",
            summary:
              "Comparable gives a natural order; Comparator defines custom orders, composable with thenComparing/reversed.",
            details: ["compareTo", "comparing", "thenComparing", "reversed", "nullsFirst"],
          },
          {
            name: "Collections & immutability",
            level: "Intermediate",
            summary:
              "Collections utility (sort, shuffle, unmodifiable, synchronized) plus immutable factory methods.",
            details: ["Collections.sort", "unmodifiableList", "List.copyOf", "EMPTY views"],
          },
          {
            name: "hashCode/equals & load factor",
            level: "Expert",
            summary:
              "Hash-based collections depend on a correct equals/hashCode; capacity, load factor, and treeification affect performance.",
            details: ["bucket", "load factor 0.75", "rehash", "treeify (8)", "collision"],
          },
        ],
      },
    ],
  },
  {
    id: "functional",
    label: "16 · Functional Programming",
    blurb: "Treating behavior as data: lambdas, method references, and value-oriented APIs.",
    subs: [
      {
        name: "Lambdas & references",
        topics: [
          {
            name: "Lambda expressions",
            level: "Intermediate",
            since: "8",
            summary:
              "Concise anonymous functions implementing a functional interface; capture effectively-final variables.",
            details: ["(a,b) -> a+b", "target typing", "capture", "this semantics"],
          },
          {
            name: "Method & constructor references",
            level: "Advanced",
            since: "8",
            summary:
              "Shorthand for lambdas that just call an existing method or constructor.",
            details: ["Class::static", "obj::instance", "Class::new", "Type::instanceMethod"],
          },
        ],
      },
      {
        name: "Functional toolkit",
        topics: [
          {
            name: "Standard functional interfaces",
            level: "Advanced",
            since: "8",
            summary:
              "java.util.function provides Function, Consumer, Supplier, Predicate, and arity/primitive specializations.",
            details: ["Function/BiFunction", "Predicate", "Supplier", "Consumer", "UnaryOperator"],
          },
          {
            name: "Optional",
            level: "Advanced",
            since: "8",
            summary:
              "A container that may hold a value; encourages explicit absence handling over returning null.",
            details: ["Optional.of/empty", "map/flatMap", "orElseGet", "ifPresentOrElse (9)"],
          },
        ],
      },
    ],
  },
  {
    id: "streams",
    label: "17 · Streams API",
    blurb: "Declarative, composable data processing pipelines over collections and sources.",
    subs: [
      {
        name: "Pipelines",
        topics: [
          {
            name: "Stream creation",
            level: "Intermediate",
            since: "8",
            summary:
              "Build streams from collections, arrays, generators, ranges, or I/O lines.",
            details: ["stream()", "Stream.of", "IntStream.range", "Stream.iterate/generate"],
          },
          {
            name: "Intermediate operations",
            level: "Advanced",
            since: "8",
            summary:
              "Lazy transformations returning a new stream: map, filter, sorted, distinct, limit, peek, flatMap.",
            details: ["map/filter", "flatMap", "sorted/distinct", "limit/skip", "lazy"],
          },
          {
            name: "Terminal operations",
            level: "Advanced",
            since: "8",
            summary:
              "Eagerly produce a result or side effect: collect, reduce, forEach, count, match, find.",
            details: ["collect", "reduce", "forEach", "anyMatch/allMatch", "findFirst"],
          },
        ],
      },
      {
        name: "Collecting & parallelism",
        topics: [
          {
            name: "Collectors",
            level: "Expert",
            since: "8",
            summary:
              "Reduce streams into collections, maps, strings, statistics, and grouped/partitioned results.",
            details: ["toList/toMap", "groupingBy", "partitioningBy", "joining", "teeing (12)"],
          },
          {
            name: "Primitive & parallel streams",
            level: "Expert",
            summary:
              "IntStream/LongStream/DoubleStream avoid boxing; parallelStream splits work via the common ForkJoinPool.",
            details: ["IntStream", "summaryStatistics", "parallelStream", "spliterator", "ordering"],
          },
        ],
      },
    ],
  },
  {
    id: "datetime",
    label: "18 · Date & Time",
    blurb: "The modern, immutable java.time API for dates, times, durations, and zones.",
    subs: [
      {
        name: "java.time core",
        topics: [
          {
            name: "LocalDate / LocalTime / LocalDateTime",
            level: "Intermediate",
            since: "8",
            summary:
              "Immutable, human date/time types without a time zone; thread-safe and chainable.",
            details: ["LocalDate", "LocalDateTime", "immutable", "plus/minus", "of/now"],
          },
          {
            name: "Instant, ZonedDateTime & zones",
            level: "Advanced",
            since: "8",
            summary:
              "Instant is a machine timestamp (UTC); ZonedDateTime/OffsetDateTime apply ZoneId/ZoneOffset rules.",
            details: ["Instant", "ZoneId", "ZonedDateTime", "ZoneOffset", "DST handling"],
          },
        ],
      },
      {
        name: "Amounts & formatting",
        topics: [
          {
            name: "Duration & Period",
            level: "Advanced",
            since: "8",
            summary:
              "Duration measures time-based amounts (seconds/nanos); Period measures date-based amounts (years/months/days).",
            details: ["Duration", "Period", "ChronoUnit.between", "temporal arithmetic"],
          },
          {
            name: "Formatting & legacy interop",
            level: "Advanced",
            summary:
              "DateTimeFormatter parses/formats; bridge to legacy Date/Calendar/SimpleDateFormat when required.",
            details: ["DateTimeFormatter", "ISO_LOCAL_DATE", "legacy Date/Calendar", "toInstant()"],
          },
        ],
      },
    ],
  },
  {
    id: "io",
    label: "19 · I/O, NIO & Serialization",
    blurb: "Reading and writing data: streams, readers, the modern file API, and object persistence.",
    subs: [
      {
        name: "Classic I/O",
        topics: [
          {
            name: "Byte streams",
            level: "Intermediate",
            summary:
              "InputStream/OutputStream move raw bytes; decorators add buffering, data typing, and more.",
            details: ["InputStream/OutputStream", "BufferedInputStream", "FileInputStream", "decorator pattern"],
          },
          {
            name: "Character streams",
            level: "Intermediate",
            summary:
              "Reader/Writer handle text with charset decoding; buffered variants read lines efficiently.",
            details: ["Reader/Writer", "BufferedReader", "InputStreamReader", "charset"],
          },
          {
            name: "Console & standard streams",
            level: "Beginner",
            simple:
              "In plain terms: how your program prints text out to the screen and reads text you type in.",
            summary:
              "System.in/out/err and Scanner provide simple console interaction.",
            details: ["System.out", "System.in", "Scanner", "printf"],
          },
        ],
      },
      {
        name: "NIO & files",
        topics: [
          {
            name: "Path & Files (NIO.2)",
            level: "Advanced",
            since: "7",
            summary:
              "Path models filesystem locations; Files offers atomic read/write, copy, walk, and attribute operations.",
            details: ["Path/Paths", "Files.readString (11)", "Files.walk", "WatchService", "attributes"],
          },
          {
            name: "Buffers & channels",
            level: "Expert",
            summary:
              "ByteBuffer plus channels enable non-blocking, memory-mapped, and scatter/gather I/O for high throughput.",
            details: ["ByteBuffer", "FileChannel", "Selector", "non-blocking", "mmap"],
          },
        ],
      },
      {
        name: "Serialization",
        topics: [
          {
            name: "Object serialization",
            level: "Expert",
            summary:
              "Serializable enables object graph persistence; control with serialVersionUID, transient, and custom read/writeObject. Prefer safer formats.",
            details: ["Serializable", "serialVersionUID", "transient", "Externalizable", "security risks"],
          },
        ],
      },
    ],
  },
  {
    id: "concurrency-basic",
    label: "20 · Concurrency Fundamentals",
    blurb: "Running code in parallel: threads, their lifecycle, and low-level coordination.",
    subs: [
      {
        name: "Threads",
        topics: [
          {
            name: "Thread & Runnable",
            level: "Advanced",
            summary:
              "A Thread runs a Runnable/Callable task; prefer composing tasks over subclassing Thread.",
            details: ["Thread", "Runnable", "Callable", "start() vs run()", "daemon"],
          },
          {
            name: "Lifecycle & control",
            level: "Advanced",
            summary:
              "Threads move through NEW→RUNNABLE→BLOCKED/WAITING→TERMINATED; controlled via join, sleep, and interruption.",
            details: ["Thread.State", "join", "sleep", "interrupt()", "InterruptedException"],
          },
          {
            name: "Virtual threads",
            level: "Expert",
            since: "21",
            summary:
              "Lightweight JVM-scheduled threads that scale to millions, ideal for blocking I/O without thread-pool tuning.",
            details: ["Thread.ofVirtual", "Project Loom", "carrier threads", "cheap blocking"],
          },
        ],
      },
      {
        name: "Coordination & the memory model",
        topics: [
          {
            name: "synchronized & monitors",
            level: "Advanced",
            summary:
              "Intrinsic locks guard critical sections; every object has a monitor enabling mutual exclusion.",
            details: ["synchronized", "monitor", "reentrant", "intrinsic lock"],
          },
          {
            name: "wait / notify",
            level: "Expert",
            summary:
              "Low-level guarded-block coordination on an object's monitor; always wait in a loop checking the condition.",
            details: ["wait()", "notify/notifyAll", "guarded blocks", "spurious wakeups"],
          },
          {
            name: "volatile & the JMM",
            level: "Expert",
            summary:
              "volatile guarantees visibility and ordering; the Java Memory Model defines happens-before edges across threads.",
            details: ["volatile", "happens-before", "visibility", "reordering", "data races"],
          },
        ],
      },
    ],
  },
  {
    id: "concurrency-adv",
    label: "21 · Concurrent Utilities",
    blurb: "The high-level java.util.concurrent toolkit for safe, scalable parallelism.",
    subs: [
      {
        name: "Executors & futures",
        topics: [
          {
            name: "ExecutorService & thread pools",
            level: "Expert",
            since: "5",
            summary:
              "Decouple task submission from execution with managed pools; tune via ThreadPoolExecutor.",
            details: ["Executors", "ThreadPoolExecutor", "submit/invokeAll", "shutdown", "ScheduledExecutor"],
          },
          {
            name: "Future & CompletableFuture",
            level: "Expert",
            since: "8",
            summary:
              "Future holds a pending result; CompletableFuture composes async pipelines with combinators and callbacks.",
            details: ["Future", "thenApply/thenCompose", "allOf/anyOf", "exceptionally", "async"],
          },
          {
            name: "ForkJoinPool",
            level: "Expert",
            since: "7",
            summary:
              "Work-stealing pool for recursive divide-and-conquer tasks; backs parallel streams.",
            details: ["ForkJoinPool", "RecursiveTask", "work stealing", "commonPool"],
          },
          {
            name: "Structured concurrency",
            level: "Expert",
            since: "21",
            summary:
              "Treats a group of related subtasks as a single unit with bounded lifetime and coordinated cancellation (preview).",
            details: ["StructuredTaskScope", "fork/join", "scoped cancellation", "preview"],
          },
        ],
      },
      {
        name: "Locks, atomics & collections",
        topics: [
          {
            name: "Locks & synchronizers",
            level: "Expert",
            since: "5",
            summary:
              "Explicit locks and coordination primitives offering features intrinsic locks lack.",
            details: ["ReentrantLock", "ReadWriteLock", "Condition", "Semaphore", "CountDownLatch", "CyclicBarrier"],
          },
          {
            name: "Atomic variables",
            level: "Expert",
            since: "5",
            summary:
              "Lock-free, CAS-based mutation of single values and fields; scalable counters via LongAdder.",
            details: ["AtomicInteger", "compareAndSet", "AtomicReference", "LongAdder (8)"],
          },
          {
            name: "Concurrent collections",
            level: "Expert",
            since: "5",
            summary:
              "Thread-safe, scalable data structures avoiding global locks.",
            details: ["ConcurrentHashMap", "CopyOnWriteArrayList", "BlockingQueue", "ConcurrentLinkedQueue"],
          },
        ],
      },
    ],
  },
  {
    id: "jvm",
    label: "22 · JVM Internals",
    blurb: "How the virtual machine loads, verifies, and executes your code at runtime.",
    subs: [
      {
        name: "Class loading & execution",
        topics: [
          {
            name: "Class loading subsystem",
            level: "Expert",
            summary:
              "Loading→linking (verify/prepare/resolve)→initialization, driven by a delegating ClassLoader hierarchy.",
            details: ["loading/linking/init", "verify/prepare/resolve", "parent delegation", "custom ClassLoader"],
          },
          {
            name: "Runtime data areas",
            level: "Expert",
            summary:
              "The JVM organizes memory into the heap, per-thread stacks, PC registers, method area/metaspace, and native stacks.",
            details: ["heap", "JVM stack", "PC register", "metaspace", "native stack"],
          },
          {
            name: "Interpreter & JIT compilation",
            level: "Expert",
            summary:
              "Bytecode is interpreted then hot paths are JIT-compiled (C1/C2) with tiered compilation, inlining, and deopt.",
            details: ["interpreter", "C1/C2 JIT", "tiered compilation", "inlining", "HotSpot"],
          },
        ],
      },
    ],
  },
  {
    id: "memory",
    label: "23 · Memory & Garbage Collection",
    blurb: "Automatic memory management: how objects live, die, and get reclaimed.",
    subs: [
      {
        name: "Heap & lifecycle",
        topics: [
          {
            name: "Heap structure & generations",
            level: "Expert",
            summary:
              "The generational heap splits young (eden + survivors) from old; most objects die young (weak generational hypothesis).",
            details: ["eden", "survivor spaces", "old gen", "promotion", "TLAB"],
          },
          {
            name: "Reference types",
            level: "Expert",
            summary:
              "Strong, soft, weak, and phantom references control reachability and interaction with the collector.",
            details: ["StrongRef", "SoftReference", "WeakReference", "PhantomReference", "ReferenceQueue"],
          },
        ],
      },
      {
        name: "Collectors & tuning",
        topics: [
          {
            name: "GC algorithms",
            level: "Expert",
            summary:
              "Mark-sweep-compact collectors trade throughput vs latency: G1 (default), Parallel, ZGC, and Shenandoah.",
            details: ["G1 (default)", "Parallel GC", "ZGC low-pause", "Shenandoah", "stop-the-world"],
          },
          {
            name: "Leaks & tuning",
            level: "Expert",
            summary:
              "Memory leaks come from unintended retention; tune heap sizes and diagnose with heap dumps and GC logs.",
            details: ["-Xms/-Xmx", "OutOfMemoryError", "heap dump", "GC logs", "escape analysis"],
          },
        ],
      },
    ],
  },
  {
    id: "reflection",
    label: "24 · Reflection, Annotations & Proxies",
    blurb: "Inspecting and manipulating program structure at runtime — the basis of many frameworks.",
    subs: [
      {
        name: "Reflection",
        topics: [
          {
            name: "Reflection API",
            level: "Expert",
            summary:
              "Inspect and invoke classes, fields, methods, and constructors at runtime; powers DI and serialization frameworks.",
            details: ["Class<?>", "getDeclaredMethods", "setAccessible", "newInstance", "performance cost"],
          },
          {
            name: "MethodHandles & VarHandles",
            level: "Expert",
            since: "7/9",
            summary:
              "A faster, type-safe, lower-level alternative to reflection for method/field access and atomic operations.",
            details: ["MethodHandle", "MethodHandles.Lookup", "VarHandle", "invokedynamic"],
          },
        ],
      },
      {
        name: "Annotations & proxies",
        topics: [
          {
            name: "Annotations",
            level: "Advanced",
            since: "5",
            summary:
              "Metadata attached to declarations; retention policy controls visibility at source, class, or runtime.",
            details: ["@interface", "@Retention", "@Target", "meta-annotations", "repeatable (8)"],
          },
          {
            name: "Annotation processing & proxies",
            level: "Expert",
            summary:
              "Compile-time processors generate code; dynamic proxies synthesize interface implementations at runtime.",
            details: ["Processor (APT)", "Proxy.newProxyInstance", "InvocationHandler", "code gen"],
          },
        ],
      },
    ],
  },
  {
    id: "modules",
    label: "25 · Modules (JPMS)",
    blurb: "Strong encapsulation and reliable configuration above the package level.",
    subs: [
      {
        name: "Java Platform Module System",
        topics: [
          {
            name: "module-info & dependencies",
            level: "Expert",
            since: "9",
            summary:
              "Declare a named module with its required modules and exported packages for reliable, encapsulated dependencies.",
            details: ["module-info.java", "requires", "exports", "transitive", "opens"],
          },
          {
            name: "Services & runtime",
            level: "Expert",
            since: "9",
            summary:
              "Modules provide/consume services via ServiceLoader; strong encapsulation hides non-exported internals.",
            details: ["provides/uses", "ServiceLoader", "strong encapsulation", "jlink"],
          },
        ],
      },
    ],
  },
  {
    id: "networking",
    label: "26 · Networking",
    blurb: "Talking to other machines: sockets, URLs, and modern HTTP.",
    subs: [
      {
        name: "Sockets & HTTP",
        topics: [
          {
            name: "Sockets",
            level: "Expert",
            summary:
              "TCP via Socket/ServerSocket and UDP via DatagramSocket provide low-level network communication.",
            details: ["Socket", "ServerSocket", "DatagramSocket", "InetAddress", "TCP/UDP"],
          },
          {
            name: "URL & HttpClient",
            level: "Advanced",
            since: "11",
            summary:
              "The modern java.net.http HttpClient supports sync/async, HTTP/2, and WebSocket; URL/URLConnection are the legacy path.",
            details: ["HttpClient", "HttpRequest/Response", "async sendAsync", "HTTP/2", "URLConnection (legacy)"],
          },
        ],
      },
    ],
  },
  {
    id: "system",
    label: "27 · System, Runtime & Processes",
    blurb:
      "Talking to the platform the JVM runs on: system properties, the runtime environment, and launching external processes.",
    subs: [
      {
        name: "System & runtime",
        topics: [
          {
            name: "System & Runtime",
            level: "Intermediate",
            summary:
              "Access properties, environment variables, standard streams, timers, and JVM controls like available processors and exit.",
            details: ["System.getProperty", "getenv", "nanoTime/currentTimeMillis", "arraycopy", "Runtime.availableProcessors"],
          },
          {
            name: "Exit codes & shutdown hooks",
            level: "Advanced",
            summary:
              "System.exit ends the JVM with a status code; shutdown hooks run cleanup threads on normal or signalled termination.",
            details: ["System.exit", "addShutdownHook", "Runtime.halt", "cleanup ordering"],
          },
        ],
      },
      {
        name: "External processes",
        topics: [
          {
            name: "ProcessBuilder & Process",
            level: "Advanced",
            summary:
              "Launch and control OS commands, wiring up arguments, environment, working directory, and I/O redirection.",
            details: ["ProcessBuilder", "start()", "redirectOutput", "waitFor", "exitValue", "InputStream pipes"],
          },
          {
            name: "ProcessHandle",
            level: "Advanced",
            since: "9",
            summary:
              "Inspect and manage native processes — PID, liveness, descendants, and asynchronous termination — without holding a Process object.",
            details: ["ProcessHandle", "pid()", "onExit()", "children/descendants", "destroy()"],
          },
        ],
      },
    ],
  },
  {
    id: "modern",
    label: "28 · Modern Language Features",
    blurb: "Recent syntax that makes Java more expressive — grouped by capability.",
    subs: [
      {
        name: "Conciseness & data",
        topics: [
          {
            name: "var, records & text blocks",
            level: "Intermediate",
            since: "10/16/15",
            summary:
              "Less ceremony: local type inference, immutable data carriers, and multi-line string literals.",
            details: ["var (10)", "record (16)", "text block (15)", "less boilerplate"],
          },
        ],
      },
      {
        name: "Pattern matching",
        topics: [
          {
            name: "instanceof, switch & record patterns",
            level: "Advanced",
            since: "16/21",
            summary:
              "Test-and-bind in instanceof, type/record patterns in switch with guards, enabling data-oriented programming.",
            details: ["pattern instanceof (16)", "switch patterns (21)", "record patterns (21)", "deconstruction"],
          },
        ],
      },
      {
        name: "Sealing & scale",
        topics: [
          {
            name: "Sealed types & virtual threads",
            level: "Expert",
            since: "17/21",
            summary:
              "Sealed hierarchies make pattern matching exhaustive; virtual threads make blocking code scale.",
            details: ["sealed (17)", "virtual threads (21)", "exhaustive switch", "Loom"],
          },
        ],
      },
    ],
  },
  {
    id: "best-practices",
    label: "29 · Idioms, Patterns & Best Practices",
    blurb: "Writing Java that is correct, maintainable, and idiomatic — the expert mindset.",
    subs: [
      {
        name: "Effective Java idioms",
        topics: [
          {
            name: "Immutability & defensive copying",
            level: "Expert",
            summary:
              "Prefer immutable objects; copy mutable inputs/outputs to preserve invariants and thread safety.",
            details: ["immutable classes", "defensive copy", "builder pattern", "minimize mutability"],
          },
          {
            name: "Favor composition & interfaces",
            level: "Advanced",
            summary:
              "Compose objects and program to interfaces rather than relying on deep inheritance hierarchies.",
            details: ["composition over inheritance", "program to interface", "dependency inversion"],
          },
          {
            name: "Resource & null safety",
            level: "Advanced",
            summary:
              "Use try-with-resources, Optional, and validation to avoid leaks and NullPointerExceptions.",
            details: ["try-with-resources", "Optional over null", "Objects.requireNonNull", "fail fast"],
          },
        ],
      },
      {
        name: "Design patterns in Java",
        topics: [
          {
            name: "Creational & structural patterns",
            level: "Advanced",
            summary:
              "Classic GoF patterns expressed idiomatically: singleton (enum), factory, builder, adapter, decorator, proxy.",
            details: ["Singleton (enum)", "Factory", "Builder", "Decorator", "Adapter"],
          },
          {
            name: "Behavioral patterns & functional style",
            level: "Advanced",
            summary:
              "Strategy, observer, template-method, and iterator often collapse into lambdas and streams in modern Java.",
            details: ["Strategy (lambda)", "Observer", "Template Method", "Iterator"],
          },
        ],
      },
    ],
  },
  {
    id: "tooling",
    label: "30 · Testing, Debugging & Profiling",
    blurb: "Verifying correctness and diagnosing behavior in real programs.",
    subs: [
      {
        name: "Testing",
        topics: [
          {
            name: "JUnit & Mockito",
            level: "Intermediate",
            summary:
              "JUnit 5 structures unit tests with annotations and assertions; Mockito stubs and verifies collaborators.",
            details: ["@Test", "assertEquals", "@BeforeEach", "Mockito mock/verify", "parameterized tests"],
          },
          {
            name: "Assertions & logging",
            level: "Intermediate",
            summary:
              "The assert keyword guards invariants; SLF4J/Logback/java.util.logging record diagnostic output.",
            details: ["assert", "-ea flag", "SLF4J", "Logback", "log levels"],
          },
        ],
      },
      {
        name: "Diagnostics",
        topics: [
          {
            name: "Debugging & JFR",
            level: "Expert",
            summary:
              "Step through with a JDWP debugger; Java Flight Recorder captures low-overhead runtime events for analysis.",
            details: ["JDWP debugger", "breakpoints", "Java Flight Recorder", "JDK Mission Control"],
          },
          {
            name: "Profiling & monitoring tools",
            level: "Expert",
            summary:
              "Inspect live JVMs and dumps with the JDK toolset to find CPU, memory, and thread issues.",
            details: ["jstack", "jmap", "jstat", "jcmd", "async-profiler"],
          },
        ],
      },
    ],
  },
];
