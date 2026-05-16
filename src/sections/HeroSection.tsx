import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Button,
  Chip,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import CircleIcon from "@mui/icons-material/Circle";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { HEADER_HEIGHT } from "@/layouts/MainLayout";
import PROFILE_IMAGE from "@/assets/profile-img.png";
import { Link } from "react-router-dom";

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

const ROTATING_STACK = [
  "React",
  "Vue",
  "Angular",
  "Node.js",
  "TypeScript",
  "Python",
  "Docker",
  "AWS",
  "React Native",
  "Ionic",
  "FastAPI",
  "CI/CD",
];

const SECONDARY_STACK = [
  "TypeScript",
  "Docker",
  "AWS",
  "Python",
  "React Native",
  "CI/CD",
];

function RotatingStack() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % ROTATING_STACK.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        position: "relative",
        height: "1.2em",
        overflow: "hidden",
        verticalAlign: "bottom",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={ROTATING_STACK[index]}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -30, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          style={{ display: "inline-block", whiteSpace: "nowrap" }}
        >
          {ROTATING_STACK[index]}
        </motion.span>
      </AnimatePresence>
    </Box>
  );
}

export default function HeroSection() {
  const { t, i18n } = useTranslation("hero");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      component="section"
      display="flex"
      alignItems="center"
      sx={{
        minHeight: {
          xs: `calc(100vh - ${HEADER_HEIGHT.xs})`,
          md: `calc(100vh - ${HEADER_HEIGHT.md})`,
        },
        py: { xs: 6, md: 0 },
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr auto" },
          gap: { xs: 6, md: 8 },
          alignItems: "center",
          width: "100%",
        }}
      >
        <Stack spacing={{ xs: 3, md: 4 }}>
          <MotionBox
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 0.75,
                borderRadius: 999,
                border: "1px solid",
                borderColor: "success.main",
                bgcolor: alpha(
                  theme.palette.success.main,
                  isDark ? 0.12 : 0.08,
                ),
              }}
            >
              <CircleIcon
                sx={{
                  fontSize: "0.55rem",
                  color: "success.main",
                  animation: "pulse 2s infinite",
                  "@keyframes pulse": {
                    "0%, 100%": { opacity: 1 },
                    "50%": { opacity: 0.3 },
                  },
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: "success.main",
                  fontWeight: 500,
                  fontSize: "0.8rem",
                  letterSpacing: "0.02em",
                }}
              >
                {t("badge")}
              </Typography>
            </Box>
          </MotionBox>

          <MotionTypography
            variant="body1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            sx={{
              color: "text.secondary",
              fontWeight: 500,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              fontSize: "0.85rem",
            }}
          >
            {t("greeting")} —{" "}
            <Box component="span" sx={{ color: "primary.main" }}>
              {t("name")}
            </Box>
          </MotionTypography>

          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <Typography
              variant="h1"
              sx={{
                lineHeight: 1.1,
                fontSize: { xs: "2.2rem", sm: "2.8rem", md: "3.4rem" },
              }}
            >
              {t("tagline")}{" "}
              <Box
                component="span"
                sx={{
                  color: "primary.main",
                  display: "inline-block",
                }}
              >
                <RotatingStack />
              </Box>
              {"."}
            </Typography>
          </MotionBox>

          <MotionTypography
            variant="body1"
            color="text.secondary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            sx={{
              maxWidth: 520,
              lineHeight: 1.7,
              fontSize: { xs: "0.95rem", md: "1rem" },
            }}
          >
            {t("description")}
          </MotionTypography>

          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ xs: "stretch", sm: "center" }}
            >
              <Button
                variant="contained"
                component={Link}
                to="/projects"
                endIcon={<ArrowForwardIcon />}
                size="large"
                sx={{ px: 3 }}
              >
                {t("cta_projects")}
              </Button>

              <Button
                variant="outlined"
                component="a"
                href={
                  i18n.language === "en"
                    ? "/docs/CV-Jorge-Ortegon-en.pdf"
                    : "/docs/CV-Jorge-Ortegon-es.pdf"
                }
                target="_blank"
                rel="noopener noreferrer"
                endIcon={<FileDownloadOutlinedIcon />}
                size="large"
                sx={{ px: 3 }}
              >
                {t("cta_cv")}
              </Button>
            </Stack>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.55 }}
          >
            <Stack spacing={1.5}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: "0.75rem",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                {t("stack_label")}
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {SECONDARY_STACK.map((tech, i) => (
                  <Chip
                    key={tech}
                    label={tech}
                    size="small"
                    component={motion.div}
                    // @ts-ignore
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.06 }}
                    sx={{
                      fontSize: "0.72rem",
                      fontWeight: 500,
                      bgcolor: "action.selected",
                      border: "1px solid",
                      borderColor: "divider",
                      "& .MuiChip-label": { px: 1.25 },
                    }}
                  />
                ))}
              </Box>
            </Stack>
          </MotionBox>
        </Stack>

        {!isMobile && (
          <MotionBox
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            sx={{
              position: "relative",
              width: { md: 300, lg: 360 },
              height: { md: 380, lg: 440 },
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                borderRadius: "40% 60% 60% 40% / 40% 40% 60% 60%",
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.3)}, ${alpha(theme.palette.secondary?.main || theme.palette.primary.light, 0.15)})`,
                filter: "blur(40px)",
                transform: "scale(1.1)",
              }}
            />
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: "100%",
                borderRadius: "40% 60% 60% 40% / 40% 40% 60% 60%",
                overflow: "hidden",
                border: "2px solid",
                borderColor: alpha(theme.palette.primary.main, 0.25),
                bgcolor: isDark
                  ? alpha(theme.palette.primary.main, 0.08)
                  : alpha(theme.palette.primary.main, 0.05),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={PROFILE_IMAGE}
                alt="Jorge Alberto Ortegón Bacelis"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>

            <Box
              component={motion.div}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              sx={{
                position: "absolute",
                top: "10%",
                right: "-8%",
                px: 1.5,
                py: 0.75,
                borderRadius: 2,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                boxShadow: theme.shadows[2],
              }}
            >
              <Typography sx={{ fontSize: "0.75rem", fontWeight: 600 }}>
                ⚡ Fullstack
              </Typography>
            </Box>

            <Box
              component={motion.div}
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              sx={{
                position: "absolute",
                bottom: "12%",
                left: "-10%",
                px: 1.5,
                py: 0.75,
                borderRadius: 2,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                boxShadow: theme.shadows[2],
              }}
            >
              <Typography sx={{ fontSize: "0.75rem", fontWeight: 600 }}>
                🚀 +5 {t("years")}
              </Typography>
            </Box>
          </MotionBox>
        )}
      </Box>
    </Box>
  );
}
