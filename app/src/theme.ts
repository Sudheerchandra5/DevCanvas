export type Theme = {
  bg: string;
  surface: string;
  surface2: string;
  border: string;
  accent: { primary: string };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    link: string;
  };
  fill: { tertiary: string };
  warning: string;
};

export const theme: Theme = {
  bg: "#0f1011",
  surface: "#17181a",
  surface2: "#1d1f21",
  border: "#2a2d30",
  accent: { primary: "#4a9eff" },
  text: {
    primary: "#e8eaed",
    secondary: "#9aa0a6",
    tertiary: "#6b7075",
    link: "#6cb6ff",
  },
  fill: { tertiary: "#24262a" },
  warning: "#e0a34a",
};

export function useHostTheme(): Theme {
  return theme;
}
