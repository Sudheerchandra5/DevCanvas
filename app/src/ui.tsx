import React, { useState } from "react";
import { theme } from "./theme";

type Div = React.CSSProperties;

export function Stack({
  children,
  gap = 8,
  style,
}: {
  children: React.ReactNode;
  gap?: number;
  style?: Div;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap, ...style }}>
      {children}
    </div>
  );
}

export function Row({
  children,
  gap = 8,
  align,
  wrap,
  style,
}: {
  children: React.ReactNode;
  gap?: number;
  align?: "center" | "start" | "end" | "baseline";
  wrap?: boolean;
  style?: Div;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap,
        alignItems: align ?? "stretch",
        flexWrap: wrap ? "wrap" : "nowrap",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Grid({
  children,
  columns = 2,
  gap = 8,
  style,
}: {
  children: React.ReactNode;
  columns?: number;
  gap?: number;
  style?: Div;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function H1({ children, style }: { children: React.ReactNode; style?: Div }) {
  return (
    <h1 style={{ fontSize: 24, fontWeight: 650, margin: 0, lineHeight: 1.25, ...style }}>
      {children}
    </h1>
  );
}

export function H3({ children, style }: { children: React.ReactNode; style?: Div }) {
  return (
    <h3
      style={{
        fontSize: 13,
        fontWeight: 600,
        margin: 0,
        textTransform: "uppercase",
        letterSpacing: 0.4,
        ...style,
      }}
    >
      {children}
    </h3>
  );
}

type Tone = "primary" | "secondary" | "tertiary";
type Size = "small" | "normal";
type Weight = "normal" | "medium" | "semibold";

export function Text({
  children,
  tone = "primary",
  size = "normal",
  weight = "normal",
  style,
}: {
  children: React.ReactNode;
  tone?: Tone;
  size?: Size;
  weight?: Weight;
  style?: Div;
}) {
  const color =
    tone === "secondary"
      ? theme.text.secondary
      : tone === "tertiary"
        ? theme.text.tertiary
        : theme.text.primary;
  const fontWeight = weight === "semibold" ? 600 : weight === "medium" ? 500 : 400;
  return (
    <span
      style={{
        color,
        fontSize: size === "small" ? 12.5 : 14,
        fontWeight,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export function Divider() {
  return (
    <div
      style={{
        height: 1,
        background: theme.border,
        border: "none",
        width: "100%",
      }}
    />
  );
}

export function Pill({
  children,
  size = "md",
  active,
  onClick,
}: {
  children: React.ReactNode;
  size?: "sm" | "md";
  active?: boolean;
  onClick?: () => void;
}) {
  const clickable = typeof onClick === "function";
  return (
    <span
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: 999,
        border: `1px solid ${active ? theme.accent.primary : theme.border}`,
        background: active ? "rgba(74, 158, 255, 0.14)" : "transparent",
        color: active ? theme.text.primary : theme.text.secondary,
        padding: size === "sm" ? "1px 8px" : "4px 12px",
        fontSize: size === "sm" ? 11 : 12.5,
        fontWeight: 500,
        cursor: clickable ? "pointer" : "default",
        userSelect: "none",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

export function Stat({
  value,
  label,
  tone,
}: {
  value: React.ReactNode;
  label: string;
  tone?: "info";
}) {
  return (
    <div
      style={{
        background: theme.surface,
        border: `1px solid ${theme.border}`,
        borderRadius: 10,
        padding: "14px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <span
        style={{
          fontSize: 26,
          fontWeight: 650,
          lineHeight: 1.1,
          color: tone === "info" ? theme.accent.primary : theme.text.primary,
        }}
      >
        {value}
      </span>
      <span style={{ fontSize: 12, color: theme.text.tertiary }}>{label}</span>
    </div>
  );
}

export function Callout({
  children,
  tone = "info",
  title,
}: {
  children: React.ReactNode;
  tone?: "info" | "warning";
  title?: string;
}) {
  const accent = tone === "warning" ? theme.warning : theme.accent.primary;
  return (
    <div
      style={{
        border: `1px solid ${theme.border}`,
        borderLeft: `3px solid ${accent}`,
        background: theme.surface,
        borderRadius: 8,
        padding: "12px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {title ? (
        <span style={{ fontWeight: 600, fontSize: 13, color: theme.text.primary }}>
          {title}
        </span>
      ) : null}
      <div style={{ color: theme.text.secondary, fontSize: 13 }}>{children}</div>
    </div>
  );
}

export function Card({
  children,
  collapsible,
  defaultOpen = true,
  forceOpen = false,
}: {
  children: React.ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
  forceOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const arr = React.Children.toArray(children);
  const header = arr[0];
  const body = arr.slice(1);
  const effectiveOpen = collapsible ? forceOpen || open : true;
  const toggleable = collapsible && !forceOpen;

  return (
    <div
      style={{
        background: theme.surface,
        border: `1px solid ${theme.border}`,
        borderRadius: 10,
        overflow: "hidden",
      }}
    >
      <div
        onClick={toggleable ? () => setOpen((o) => !o) : undefined}
        style={{ cursor: toggleable ? "pointer" : "default" }}
      >
        {React.isValidElement(header)
          ? React.cloneElement(header as React.ReactElement<CardHeaderProps>, {
              _open: collapsible ? effectiveOpen : undefined,
            })
          : header}
      </div>
      {effectiveOpen ? body : null}
    </div>
  );
}

type CardHeaderProps = {
  children: React.ReactNode;
  trailing?: React.ReactNode;
  _open?: boolean;
};

export function CardHeader({ children, trailing, _open }: CardHeaderProps) {
  const collapsible = typeof _open === "boolean";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "12px 16px",
        fontWeight: 600,
        fontSize: 15,
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {collapsible ? (
          <span
            style={{
              display: "inline-block",
              transition: "transform 0.15s ease",
              transform: _open ? "rotate(90deg)" : "rotate(0deg)",
              color: theme.text.tertiary,
              fontSize: 11,
            }}
          >
            ▶
          </span>
        ) : null}
        {children}
      </span>
      {trailing ? <span>{trailing}</span> : null}
    </div>
  );
}

export function CardBody({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: "0 16px 16px 16px",
        borderTop: `1px solid ${theme.border}`,
        paddingTop: 16,
      }}
    >
      {children}
    </div>
  );
}

export function TextInput({
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      type={type}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        background: theme.surface2,
        border: `1px solid ${theme.border}`,
        borderRadius: 8,
        padding: "9px 12px",
        color: theme.text.primary,
        fontSize: 13.5,
        outline: "none",
      }}
    />
  );
}

export function useCanvasState<T>(key: string, initial: T): [T, (v: T) => void] {
  const [val, setVal] = useState<T>(() => {
    try {
      const raw = localStorage.getItem("canvas:" + key);
      return raw != null ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  const set = (v: T) => {
    setVal(v);
    try {
      localStorage.setItem("canvas:" + key, JSON.stringify(v));
    } catch {
      /* ignore */
    }
  };
  return [val, set];
}
