import { extendTheme } from "@mui/material/styles";

const theme = extendTheme({
  cssVarPrefix: "template",

  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#6366F1",
          light: "#818CF8",
          dark: "#4F46E5",
          contrastText: "#fff",
        },

        secondary: {
          main: "#22D3EE",
        },

        background: {
          default: "#F8FAFC",
          paper: "#ffffff",
        },

        text: {
          primary: "#0F172A",
          secondary: "#64748B",
        },

        divider: "rgba(0,0,0,0.08)",

        action: {
          hover: "rgba(0,0,0,0.04)",
          selected: "rgba(99,102,241,0.10)",
        },
      },
    },

    dark: {
      palette: {
        primary: {
          main: "#6366F1",
          light: "#818CF8",
          dark: "#4F46E5",
          contrastText: "#fff",
        },

        secondary: {
          main: "#22D3EE",
        },

        background: {
          default: "#020617",
          paper: "rgba(15,23,42,0.7)",
        },

        text: {
          primary: "#E5E7EB",
          secondary: "#94A3B8",
        },

        divider: "rgba(255,255,255,0.08)",

        action: {
          hover: "rgba(255,255,255,0.06)",
          selected: "rgba(99,102,241,0.18)",
        },
      },
    },
  },

  typography: {
    fontFamily: "Inter, sans-serif",

    h1: {
      fontFamily: "Sora, sans-serif",
      fontSize: "3rem",
      fontWeight: 700,
    },

    h2: {
      fontFamily: "Sora, sans-serif",
      fontWeight: 600,
    },

    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },

  shape: {
    borderRadius: 14,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          textRendering: "optimizeLegibility",
          transition: "background 0.4s ease",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.06)",
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          padding: "10px 22px",
        },

        containedPrimary: {
          background: "linear-gradient(135deg,#0EA5E9,#8B5CF6)",
          boxShadow: "0 10px 30px rgba(14,165,233,.3)",
        },
      },
    },
  },
});

export default theme;
