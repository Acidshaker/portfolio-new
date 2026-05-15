import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Stack,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
  alpha,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ColorModeIconDropdown from "@/theme/ColorModeSelect";
import LangToggle from "@/components/shared/LangToggle";

const NAV_LINKS = [
  { labelKey: "nav_home", to: "/" },
  { labelKey: "nav_projects", to: "/projects" },
] as const;

export default function Header() {
  const { t } = useTranslation("header");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isDark = theme.palette.mode === "dark";

  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backdropFilter: "blur(16px)",
          backgroundColor: isDark
            ? alpha(theme.palette.background.default, 0.75)
            : alpha(theme.palette.background.default, 0.85),
          borderBottom: "1px solid",
          borderColor: "divider",
          color: "text.primary",
        }}
      >
        <Toolbar
          sx={{
            maxWidth: "lg",
            width: "100%",
            mx: "auto",
            px: { xs: 2, sm: 3 },
            minHeight: { xs: 56, md: 64 },
          }}
        >
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: "none",
              flexGrow: 1,
              fontWeight: 700,
              fontFamily: "Sora, sans-serif",
              fontSize: { xs: "1.1rem", md: "1.25rem" },
              color: "text.primary",
              "& span": { color: "primary.main" },
            }}
          >
            Jorge<span>.dev</span>
          </Typography>

          {!isMobile && (
            <Stack
              direction="row"
              spacing={0.5}
              alignItems="center"
              sx={{ mr: 2 }}
            >
              {NAV_LINKS.map(({ labelKey, to }) => (
                <Button
                  key={to}
                  component={Link}
                  to={to}
                  sx={{
                    color: isActive(to) ? "primary.main" : "text.secondary",
                    fontWeight: isActive(to) ? 600 : 400,
                    position: "relative",
                    "&::after": isActive(to)
                      ? {
                          content: '""',
                          position: "absolute",
                          bottom: 4,
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "20px",
                          height: "2px",
                          borderRadius: 1,
                          bgcolor: "primary.main",
                        }
                      : {},
                  }}
                >
                  {t(labelKey)}
                </Button>
              ))}
            </Stack>
          )}

          <Stack direction="row" spacing={1} alignItems="center">
            <LangToggle />
            <ColorModeIconDropdown />

            {!isMobile && (
              <Button
                variant="contained"
                component={Link}
                to="/contact"
                sx={{ ml: 1 }}
              >
                {t("nav_contact")}
              </Button>
            )}

            {isMobile && (
              <IconButton
                aria-label={t("menu_open")}
                onClick={() => setDrawerOpen(true)}
                size="small"
              >
                <MenuIcon />
              </IconButton>
            )}
          </Stack>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 260,
            px: 2,
            py: 3,
            // ✅ Fuerza fondo sólido según el modo — sin transparencia
            backgroundColor: "background.default",
            backgroundImage: "none",
            backdropFilter: "none",
            borderLeft: "1px solid",
            borderColor: "divider",
          },
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={3}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontFamily: "Sora, sans-serif",
              "& span": { color: "primary.main" },
            }}
          >
            Jorge<span>.dev</span>
          </Typography>
          <IconButton
            aria-label={t("menu_close")}
            onClick={() => setDrawerOpen(false)}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <List disablePadding>
          {NAV_LINKS.map(({ labelKey, to }) => (
            <ListItem key={to} disablePadding>
              <ListItemButton
                component={Link}
                to={to}
                onClick={() => setDrawerOpen(false)}
                selected={isActive(to)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  "&.Mui-selected": {
                    color: "primary.main",
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    "& .MuiListItemText-primary": { fontWeight: 600 },
                  },
                }}
              >
                <ListItemText primary={t(labelKey)} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box mt={2}>
          <Button
            variant="contained"
            fullWidth
            component={Link}
            to="/contact"
            onClick={() => setDrawerOpen(false)}
          >
            {t("nav_contact")}
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
