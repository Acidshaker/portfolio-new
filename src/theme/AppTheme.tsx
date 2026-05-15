import { GlobalStyles } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { JSX, useMemo } from "react";

// Importa tus primitivas de tema
import { colorSchemes, typography, shape, shadows } from "./themePrimitives"; // ajusta la ruta según tu proyecto

interface AppThemeProps {
  children: JSX.Element;
  disableCustomTheme?: boolean;
  themeComponents?: any;
}

export default function AppTheme(props: AppThemeProps) {
  const { children, disableCustomTheme, themeComponents } = props;

  const theme = useMemo(() => {
    if (disableCustomTheme) return createTheme();

    return createTheme({
      // 🔑 CLAVE: Esto habilita el sistema CSS Variables de MUI
      // y hace que useColorScheme() funcione correctamente
      cssVariables: {
        colorSchemeSelector: "data-mui-color-scheme",
        cssVarPrefix: "template",
      },

      // El modo por defecto al cargar la app
      defaultColorScheme: "light",

      // Esquemas de color (light/dark) desde themePrimitives
      colorSchemes,

      // Tipografía, forma y sombras compartidas
      typography,
      shape,
      shadows,

      components: {
        MuiCssBaseline: {
          styleOverrides: (theme) => ({
            body: {
              fontFamily: "Inter, sans-serif",
              WebkitFontSmoothing: "antialiased",
              MozOsxFontSmoothing: "grayscale",
              textRendering: "optimizeLegibility",
              margin: 0,
              padding: 0,
              minHeight: "100vh",
              // Usa vars CSS en lugar de theme.palette.mode para que
              // el cambio reactivo funcione sin re-render del provider
              background: "var(--template-palette-background-default)",
              transition: "background 0.3s ease",
            },
          }),
        },

        MuiPaper: {
          styleOverrides: {
            root: ({ theme }) => ({
              backdropFilter: "blur(12px)",
              border: "1px solid",
              borderColor: theme.palette.divider,
              backgroundImage: "none",
              boxShadow: theme.shadows[1],
            }),
          },
        },

        MuiOutlinedInput: {
          styleOverrides: {
            root: ({ theme }) => ({
              backgroundColor: theme.palette.background.paper,
              borderRadius: 8,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.divider,
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.text.secondary,
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.primary.main,
              },
            }),
          },
        },

        MuiIconButton: {
          styleOverrides: {
            root: ({ theme, ownerState }) => {
              const colorKey =
                ownerState.color && ownerState.color !== "inherit"
                  ? ownerState.color
                  : "primary";
              const paletteColor = (theme.palette as any)[colorKey];
              const hasDarkVariant = paletteColor?.dark;

              return {
                transition: "all 0.3s ease",
                borderRadius: 8,
                padding: 8,
                "&:hover": {
                  backgroundColor: hasDarkVariant
                    ? paletteColor.dark
                    : theme.palette.action.hover,
                  color: hasDarkVariant
                    ? theme.palette.getContrastText(paletteColor.dark)
                    : theme.palette.text.primary,
                },
                "&:focus": {
                  outline: "none",
                  boxShadow: "none",
                },
              };
            },
          },
        },

        MuiTab: {
          styleOverrides: {
            root: () => ({
              transition: "all 0.3s ease",
              borderRadius: 8,
              padding: 8,
              "&:hover": { backgroundColor: "transparent" },
              "&:focus": { outline: "none", boxShadow: "none" },
            }),
          },
        },

        MuiDrawer: {
          styleOverrides: {
            paper: ({ theme }) => ({
              backgroundColor: "var(--template-palette-background-paper)",
              backgroundImage: "none",
              borderLeft: `1px solid var(--template-palette-divider)`,
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            }),
          },
        },

        MuiListItemButton: {
          styleOverrides: {
            root: ({ theme }) => ({
              borderRadius: 8,
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
                transform: "scale(1.02)",
              },
            }),
          },
        },

        MuiButton: {
          styleOverrides: {
            root: ({ theme, ownerState }) => {
              const colorKey =
                ownerState.color && ownerState.color !== "inherit"
                  ? ownerState.color
                  : "primary";
              const paletteColor =
                theme.palette[colorKey as "primary" | "secondary"];
              const mainColor =
                paletteColor?.main || theme.palette.primary.main;
              const darkColor =
                paletteColor?.dark || theme.palette.primary.dark;

              return {
                borderColor: mainColor,
                transition: "all 0.3s ease",
                outline: "none",
                boxShadow: "none",
                "&:focus": { outline: "none", boxShadow: "none" },
                "&:hover": {
                  borderColor: mainColor,
                  backgroundColor: darkColor,
                  color: theme.palette.getContrastText(darkColor),
                },
                borderRadius: 999,
                padding: "10px 22px",
                fontWeight: 600,
              };
            },
          },
        },

        MuiListItemText: {
          styleOverrides: {
            primary: {
              fontWeight: 500,
              fontSize: "0.95rem",
            },
          },
        },

        // Overrides externos
        ...themeComponents,
      },
    });
  }, [disableCustomTheme, themeComponents]);

  if (disableCustomTheme) {
    return <>{children}</>;
  }

  return (
    // disableTransitionOnChange evita el flash al cambiar de modo
    <ThemeProvider theme={theme} disableTransitionOnChange>
      <GlobalStyles
        styles={{
          "*": {
            transition: "background-color 0.3s ease, color 0.3s ease",
          },
        }}
      />
      {children}
    </ThemeProvider>
  );
}
