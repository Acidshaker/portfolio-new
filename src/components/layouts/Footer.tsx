import {
  Box,
  Typography,
  Stack,
  IconButton,
  Divider,
  useTheme,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { useTranslation } from "react-i18next";

const SOCIAL_LINKS = [
  {
    icon: <GitHubIcon fontSize="small" />,
    href: "https://github.com/Acidshaker",
    label: "GitHub",
  },
  {
    icon: <LinkedInIcon fontSize="small" />,
    href: "https://linkedin.com/in/jorge-alberto-ortegón-bacelis-67bb0b254",
    label: "LinkedIn",
  },
] as const;

export default function Footer() {
  const { t } = useTranslation("footer");
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        borderTop: "1px solid",
        borderColor: "divider",
        py: { xs: 3, md: 4 },
        px: { xs: 2, sm: 3 },
      }}
    >
      <Box
        sx={{
          maxWidth: "lg",
          mx: "auto",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Stack spacing={0.25}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              fontFamily: "Sora, sans-serif",
              "& span": { color: "primary.main" },
            }}
          >
            Jorge<span>.dev</span>
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t("tagline")}
          </Typography>
        </Stack>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ textAlign: "center", order: { xs: 1, sm: 0 } }}
        >
          {t("copyright", { year: new Date().getFullYear() })}
        </Typography>

        <Stack direction="row" spacing={0.5}>
          {SOCIAL_LINKS.map(({ icon, href, label }) => (
            <IconButton
              key={label}
              component="a"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              size="small"
              sx={{ color: "text.secondary" }}
            >
              {icon}
            </IconButton>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
