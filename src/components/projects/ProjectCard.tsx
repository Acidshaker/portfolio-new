import {
  Box,
  Typography,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  alpha,
  useTheme,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const { t, i18n } = useTranslation("projects");
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isEs = i18n.language?.startsWith("es");

  const title = isEs ? project.titleEs : project.titleEn;
  const description = isEs ? project.descriptionEs : project.descriptionEn;

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      sx={{
        position: "relative",
        height: "100%",
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        cursor: "default",
        transition:
          "border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease",
        "&:hover": {
          borderColor: alpha(theme.palette.primary.main, 0.5),
          boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, isDark ? 0.12 : 0.08)}`,
          transform: "translateY(-4px)",
        },
      }}
    >
      {/* Imagen / placeholder */}
      <Box
        sx={{
          height: 160,
          position: "relative",
          overflow: "hidden",
          bgcolor: isDark
            ? alpha(theme.palette.primary.main, 0.06)
            : alpha(theme.palette.primary.main, 0.04),
          flexShrink: 0,
        }}
      >
        {project.image ? (
          <Box
            component="img"
            src={project.image}
            alt={title}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          // Placeholder decorativo con patrón de puntos
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundImage: `radial-gradient(${alpha(theme.palette.primary.main, 0.15)} 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          >
            <Typography
              sx={{
                fontSize: "2rem",
                opacity: 0.4,
                userSelect: "none",
              }}
            >
              {getCategoryEmoji(project.category)}
            </Typography>
          </Box>
        )}

        {/* Badges sobre la imagen */}
        <Box
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            display: "flex",
            gap: 0.75,
            flexWrap: "wrap",
          }}
        >
          {project.isPrivate && (
            <Chip
              icon={<LockOutlinedIcon sx={{ fontSize: "0.7rem !important" }} />}
              label={t("badge_private")}
              size="small"
              sx={{
                fontSize: "0.68rem",
                height: 22,
                bgcolor: alpha(theme.palette.warning.main, isDark ? 0.2 : 0.12),
                color: "warning.main",
                border: "1px solid",
                borderColor: alpha(theme.palette.warning.main, 0.3),
                "& .MuiChip-label": { px: 0.75 },
              }}
            />
          )}
          {project.isWip && (
            <Chip
              label={t("badge_wip")}
              size="small"
              sx={{
                fontSize: "0.68rem",
                height: 22,
                bgcolor: alpha(theme.palette.info.main, isDark ? 0.2 : 0.12),
                color: "info.main",
                border: "1px solid",
                borderColor: alpha(theme.palette.info.main, 0.3),
                "& .MuiChip-label": { px: 0.75 },
              }}
            />
          )}
        </Box>
      </Box>

      {/* Contenido */}
      <Box
        sx={{
          p: 2.5,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, fontSize: "1rem", lineHeight: 1.3 }}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            lineHeight: 1.6,
            fontSize: "0.85rem",
            flex: 1,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {description}
        </Typography>

        {/* Stack chips */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: "auto" }}>
          {project.stack.slice(0, 4).map((tech) => (
            <Chip
              key={tech}
              label={tech}
              size="small"
              sx={{
                fontSize: "0.68rem",
                height: 20,
                bgcolor: "action.selected",
                border: "1px solid",
                borderColor: "divider",
                "& .MuiChip-label": { px: 0.75 },
              }}
            />
          ))}
          {project.stack.length > 4 && (
            <Chip
              label={`+${project.stack.length - 4}`}
              size="small"
              sx={{
                fontSize: "0.68rem",
                height: 20,
                bgcolor: "action.hover",
                "& .MuiChip-label": { px: 0.75 },
              }}
            />
          )}
        </Box>

        {/* Links */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 0.5,
            pt: 1,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          {project.isPrivate && !project.githubUrl && (
            <Typography
              variant="caption"
              color="text.disabled"
              sx={{ fontSize: "0.7rem", mr: "auto" }}
            >
              {t("private_notice")}
            </Typography>
          )}
          {project.githubUrl && (
            <Tooltip title={t("btn_github")}>
              <IconButton
                component="a"
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{ color: "text.secondary" }}
              >
                <GitHubIcon sx={{ fontSize: "1.1rem" }} />
              </IconButton>
            </Tooltip>
          )}
          {project.demoUrl && (
            <Tooltip title={t("btn_demo")}>
              <IconButton
                component="a"
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{ color: "text.secondary" }}
              >
                <OpenInNewIcon sx={{ fontSize: "1.1rem" }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
    </Box>
  );
}

function getCategoryEmoji(category: string) {
  const map: Record<string, string> = {
    frontend: "🖥️",
    backend: "⚙️",
    mobile: "📱",
    fullstack: "🚀",
  };
  return map[category] ?? "💻";
}
