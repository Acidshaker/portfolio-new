import { CssVarsProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import theme from "./Theme";

export default function AppThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CssVarsProvider
      theme={theme}
      defaultMode="system"
      modeStorageKey="portfolio-mode"
    >
      <CssBaseline />
      {children}
    </CssVarsProvider>
  );
}
