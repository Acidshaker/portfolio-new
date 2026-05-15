import {
  Box,
  Typography,
  Chip,
  Button,
  Stack,
  alpha,
  useTheme,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import StarIcon from "@mui/icons-material/Star";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { Project } from "@/data/projects";

interface FeaturedProjectProps {
  project: Project;
}

export default function FeaturedProject({ project }: FeaturedProjectProps) {
  const { t, i18n } = useTranslation("projects");
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isEs = i18n.language?.startsWith("es");

  const title = isEs ? project.titleEs : project.titleEn;
  const description = isEs ? project.descriptionEs : project.descriptionEn;

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      sx={{
        position: "relative",
        borderRadius: 4,
        border: "1px solid",
        borderColor: alpha(theme.palette.primary.main, 0.3),
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        minHeight: { xs: "auto", md: 340 },
        bgcolor: "background.paper",
        transition: "box-shadow 0.3s ease",
        "&:hover": {
          boxShadow: `0 16px 48px ${alpha(theme.palette.primary.main, isDark ? 0.18 : 0.1)}`,
        },
      }}
    >
      {/* Glow de fondo */}
      <Box
        sx={{
          position: "absolute",
          top: -60,
          left: -60,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: alpha(theme.palette.primary.main, isDark ? 0.07 : 0.05),
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      {/* Columna izquierda: info */}
      <Box
        sx={{
          p: { xs: 3, md: 4 },
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Label destacado */}
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.75,
            width: "fit-content",
            px: 1.5,
            py: 0.5,
            borderRadius: 999,
            bgcolor: alpha(theme.palette.primary.main, isDark ? 0.15 : 0.08),
            border: "1px solid",
            borderColor: alpha(theme.palette.primary.main, 0.25),
          }}
        >
          <StarIcon sx={{ fontSize: "0.75rem", color: "primary.main" }} />
          <Typography
            sx={{ fontSize: "0.75rem", fontWeight: 600, color: "primary.main" }}
          >
            {t("featured_label")}
          </Typography>
        </Box>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            lineHeight: 1.2,
            fontSize: { xs: "1.4rem", md: "1.75rem" },
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ lineHeight: 1.7 }}
        >
          {description}
        </Typography>

        {/* Stack */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
          {project.stack.map((tech) => (
            <Chip
              key={tech}
              label={tech}
              size="small"
              sx={{
                fontSize: "0.72rem",
                bgcolor: "action.selected",
                border: "1px solid",
                borderColor: "divider",
              }}
            />
          ))}
        </Box>

        {/* Acciones */}
        <Stack
          direction="row"
          spacing={1.5}
          flexWrap="wrap"
          sx={{ mt: "auto" }}
        >
          {project.githubUrl ? (
            <Button
              variant="outlined"
              size="small"
              startIcon={<GitHubIcon />}
              component="a"
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("btn_github")}
            </Button>
          ) : (
            <Button
              variant="outlined"
              size="small"
              startIcon={<LockOutlinedIcon />}
              disabled
            >
              {t("badge_private")}
            </Button>
          )}
          {project.demoUrl && (
            <Button
              variant="contained"
              size="small"
              endIcon={<OpenInNewIcon />}
              component="a"
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("btn_demo")}
            </Button>
          )}
        </Stack>
      </Box>

      {/* Columna derecha: imagen / placeholder */}
      <Box
        sx={{
          position: "relative",
          minHeight: { xs: 200, md: "auto" },
          bgcolor: isDark
            ? alpha(theme.palette.primary.main, 0.05)
            : alpha(theme.palette.primary.main, 0.03),
          borderLeft: { md: "1px solid" },
          borderColor: { md: "divider" },
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {project.image ? (
          <Box
            component="img"
            src={project.image}
            alt={title}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top left",
            }}
          />
        ) : (
          // Placeholder con patrón de puntos
          <Box
            sx={{
              width: "100%",
              height: "100%",
              position: "absolute",
              inset: 0,
              backgroundImage: `radial-gradient(${alpha(theme.palette.primary.main, 0.12)} 1px, transparent 1px)`,
              backgroundSize: "24px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{ fontSize: "4rem", opacity: 0.2, userSelect: "none" }}
            >
              🚀
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
