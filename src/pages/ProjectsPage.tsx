import { useState, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  alpha,
  useTheme,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { PROJECTS, type ProjectCategory } from "@/data/projects";
import ProjectCard from "@/components/projects/ProjectCard";
import FeaturedProject from "@/components/projects/FeaturedProject";

type Filter = "all" | ProjectCategory;

const FILTERS: { key: Filter; labelKey: string }[] = [
  { key: "all", labelKey: "filter_all" },
  { key: "fullstack", labelKey: "filter_fullstack" },
  { key: "frontend", labelKey: "filter_frontend" },
  { key: "backend", labelKey: "filter_backend" },
  { key: "mobile", labelKey: "filter_mobile" },
];

export default function ProjectsPage() {
  const { t } = useTranslation("projects");
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [activeFilter, setActiveFilter] = useState<Filter>("all");

  const featured = useMemo(() => PROJECTS.find((p) => p.featured), []);

  const filtered = useMemo(() => {
    const rest = PROJECTS.filter((p) => !p.featured);
    if (activeFilter === "all") return rest;
    return rest.filter((p) => p.category === activeFilter);
  }, [activeFilter]);

  return (
    <Box component="section">
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Stack spacing={{ xs: 6, md: 8 }}>
          {/* ── Page header ── */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <Stack spacing={2} maxWidth={600}>
              {/* Eyebrow */}
              <Typography
                variant="body2"
                sx={{
                  color: "primary.main",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontSize: "0.78rem",
                }}
              >
                // {t("page_title")}
              </Typography>

              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "1.9rem", md: "2.5rem" },
                  lineHeight: 1.15,
                }}
              >
                {t("page_title")}
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ lineHeight: 1.7 }}
              >
                {t("page_subtitle")}
              </Typography>
            </Stack>
          </Box>

          {/* ── Featured project ── */}
          {featured && <FeaturedProject project={featured} />}

          {/* ── Filtros ── */}
          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <ToggleButtonGroup
              value={activeFilter}
              exclusive
              onChange={(_, val) => val && setActiveFilter(val)}
              size="small"
              sx={{
                flexWrap: "wrap",
                gap: 0.5,
                "& .MuiToggleButtonGroup-grouped": {
                  border: "1px solid !important",
                  borderColor: `${theme.palette.divider} !important`,
                  borderRadius: "999px !important",
                  px: 2,
                  py: 0.5,
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  color: "text.secondary",
                  transition: "all 0.2s ease",
                  "&.Mui-selected": {
                    bgcolor: alpha(
                      theme.palette.primary.main,
                      isDark ? 0.18 : 0.1,
                    ),
                    borderColor: `${alpha(theme.palette.primary.main, 0.4)} !important`,
                    color: "primary.main",
                    fontWeight: 600,
                  },
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                },
              }}
            >
              {FILTERS.map(({ key, labelKey }) => (
                <ToggleButton key={key} value={key} disableRipple>
                  {t(labelKey)}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>

            <Typography variant="caption" color="text.secondary">
              {t("projects_count", { count: filtered.length })}
            </Typography>
          </Box>

          {/* ── Grid de proyectos ── */}
          <AnimatePresence mode="wait">
            <Box
              key={activeFilter}
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                },
                gap: 3,
              }}
            >
              {filtered.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}

              {filtered.length === 0 && (
                <Box
                  sx={{
                    gridColumn: "1 / -1",
                    py: 8,
                    textAlign: "center",
                  }}
                >
                  <Typography color="text.secondary">
                    No hay proyectos en esta categoría aún.
                  </Typography>
                </Box>
              )}
            </Box>
          </AnimatePresence>
        </Stack>
      </Container>
    </Box>
  );
}
