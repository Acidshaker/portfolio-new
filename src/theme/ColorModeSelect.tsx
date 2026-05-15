import * as React from "react";
import DarkModeIcon from "@mui/icons-material/DarkModeRounded";
import LightModeIcon from "@mui/icons-material/LightModeRounded";
import IconButton, { type IconButtonOwnProps } from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import { useColorScheme } from "@mui/material/styles";

export default function ColorModeToggle(props: IconButtonOwnProps) {
  const { mode, systemMode, setMode } = useColorScheme();

  // Mientras hidrata, renderiza un placeholder del mismo tamaño
  if (!mode) {
    return (
      <Box
        sx={(theme) => ({
          display: "inline-flex",
          width: 34,
          height: 34,
          borderRadius: (theme.vars || theme).shape.borderRadius,
          border: "1px solid",
          borderColor: (theme.vars || theme).palette.divider,
        })}
      />
    );
  }

  const resolvedMode = (systemMode || mode) as "light" | "dark";
  const isDark = resolvedMode === "dark";

  const handleToggle = () => {
    setMode(isDark ? "light" : "dark");
  };

  return (
    <Tooltip title={isDark ? "Modo claro" : "Modo oscuro"} arrow>
      <IconButton
        onClick={handleToggle}
        disableRipple
        aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
        {...props}
        sx={{
          position: "relative",
          overflow: "hidden",
          width: 34,
          height: 34,
          "& svg": {
            fontSize: "1.25rem",
            position: "absolute",
            transition: "opacity 0.25s ease, transform 0.3s ease",
          },
          ...props.sx,
        }}
      >
        {/* Ícono de sol — visible en modo claro */}
        <LightModeIcon
          sx={{
            opacity: isDark ? 0 : 1,
            transform: isDark
              ? "rotate(-90deg) scale(0.6)"
              : "rotate(0deg) scale(1)",
          }}
        />
        {/* Ícono de luna — visible en modo oscuro */}
        <DarkModeIcon
          sx={{
            opacity: isDark ? 1 : 0,
            transform: isDark
              ? "rotate(0deg) scale(1)"
              : "rotate(90deg) scale(0.6)",
          }}
        />
      </IconButton>
    </Tooltip>
  );
}
