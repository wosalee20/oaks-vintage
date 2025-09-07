export const theme = {
  colors: {
    primary: "#2563EB",
    primaryDark: "#1D4ED8",
    headerBg: "#FFFFFF",
    text: "#111827",
    textMuted: "rgba(17,24,39,.62)", // << added
    muted: "rgba(17,24,39,.62)",
    border: "rgba(0,0,0,.08)",
    topStripBg: "#1E3A8A",

    // legacy/compat
    brand: "#2563EB",
    brandDark: "#1D4ED8",
    bgElev: "#fff",
    bg: "#fff",
  },
  layout: { max: 1180 },
  radius: { md: "14px", xl: "20px" },
  shadow: { lg: "0 20px 50px rgba(37,99,235,.10)" },
  container: "1120px",
};
export type AppTheme = typeof theme;
