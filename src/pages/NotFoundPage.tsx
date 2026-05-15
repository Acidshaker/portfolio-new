import { Box, Typography, Button, Stack, alpha, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

export default function NotFoundPage() {
  const { t } = useTranslation("notfound");
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 3,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow de fondo — consistente con el hero */}
      <Box
        sx={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: alpha(theme.palette.primary.main, isDark ? 0.06 : 0.04),
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      {/* 404 número grande decorativo */}
      <MotionTypography
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        sx={{
          fontSize: { xs: "7rem", md: "11rem" },
          fontFamily: "Sora, sans-serif",
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: "-4px",
          background: isDark
            ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.6)}, ${alpha(theme.palette.primary.main, 0.2)})`
            : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.5)}, ${alpha(theme.palette.primary.dark ?? theme.palette.primary.main, 0.15)})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          userSelect: "none",
          mb: 2,
        }}
      >
        {t("code")}
      </MotionTypography>

      <Stack spacing={2} alignItems="center" maxWidth={420}>
        <MotionTypography
          variant="h4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          sx={{ fontWeight: 700, fontSize: { xs: "1.4rem", md: "1.75rem" } }}
        >
          {t("title")}
        </MotionTypography>

        <MotionTypography
          variant="body1"
          color="text.secondary"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.22 }}
          sx={{ lineHeight: 1.7 }}
        >
          {t("description")}
        </MotionTypography>
      </Stack>

      <MotionBox
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.32 }}
        sx={{ mt: 4 }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
        >
          <Button
            variant="contained"
            component={Link}
            to="/"
            startIcon={<HomeOutlinedIcon />}
            size="large"
            sx={{ px: 3 }}
          >
            {t("btn_home")}
          </Button>
          <Button
            variant="outlined"
            component={Link}
            to="/projects"
            startIcon={<FolderOutlinedIcon />}
            size="large"
            sx={{ px: 3 }}
          >
            {t("btn_projects")}
          </Button>
        </Stack>
      </MotionBox>
    </Box>
  );
}
