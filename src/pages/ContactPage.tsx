import { useState } from "react";
import { useForm } from "react-hook-form";
import emailjs from "@emailjs/browser";
import {
  Box,
  Container,
  Typography,
  Stack,
  TextField,
  Button,
  Alert,
  alpha,
  useTheme,
  CircularProgress,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

// ─── Configura tus credenciales de EmailJS ────────────────────────────────────
// 1. Crea cuenta en https://www.emailjs.com (plan gratuito: 200 emails/mes)
// 2. En Email Services → conecta tu Gmail/Outlook
// 3. En Email Templates → crea una plantilla con variables: {{from_name}}, {{from_email}}, {{subject}}, {{message}}
// 4. Reemplaza los valores de abajo con los tuyos
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

// ─── Tus datos de contacto ────────────────────────────────────────────────────
const CONTACT_EMAIL = "jorge_barcelino@hotmail.com";
const GITHUB_URL = "https://github.com/Acidshaker";
const LINKEDIN_URL =
  "https://linkedin.com/in/jorge-alberto-ortegón-bacelis-67bb0b254";

interface FormValues {
  from_name: string;
  from_email: string;
  subject: string;
  message: string;
}

type SubmitStatus = "idle" | "loading" | "success" | "error";

// ─── Info item ────────────────────────────────────────────────────────────────
function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  const theme = useTheme();
  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
      <Box
        sx={{
          mt: 0.25,
          p: 1,
          borderRadius: 2,
          bgcolor: alpha(theme.palette.primary.main, 0.1),
          color: "primary.main",
          display: "flex",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            fontSize: "0.7rem",
          }}
        >
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.25 }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ContactPage() {
  const { t } = useTranslation("contact");
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [status, setStatus] = useState<SubmitStatus>("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    setStatus("loading");
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: data.from_name,
          from_email: data.from_email,
          subject: data.subject,
          message: data.message,
        },
        EMAILJS_PUBLIC_KEY,
      );
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      fontSize: "0.9rem",
    },
  };

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
            <Stack spacing={2} maxWidth={560}>
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

          {/* ── Two columns: info + form ── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "2fr 3fr" },
              gap: { xs: 4, md: 6 },
              alignItems: "start",
            }}
          >
            {/* ── Columna izquierda: info ── */}
            <Box
              component={motion.div}
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
            >
              <Stack spacing={4}>
                <Stack spacing={3}>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {t("info_title")}
                  </Typography>

                  <Stack spacing={2.5}>
                    <InfoItem
                      icon={<EmailOutlinedIcon sx={{ fontSize: "1.1rem" }} />}
                      label={t("info_email")}
                      value={CONTACT_EMAIL}
                    />
                    <InfoItem
                      icon={
                        <LocationOnOutlinedIcon sx={{ fontSize: "1.1rem" }} />
                      }
                      label={t("info_location")}
                      value={t("info_location_value")}
                    />
                    <InfoItem
                      icon={<WorkOutlineIcon sx={{ fontSize: "1.1rem" }} />}
                      label={t("info_availability")}
                      value={t("info_availability_value")}
                    />
                  </Stack>
                </Stack>

                <Divider />

                {/* Redes sociales */}
                <Stack spacing={1.5}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      fontSize: "0.7rem",
                    }}
                  >
                    {t("social_title")}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="GitHub">
                      <IconButton
                        component="a"
                        href={GITHUB_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 2,
                          color: "text.secondary",
                          "&:hover": {
                            borderColor: "primary.main",
                            color: "primary.main",
                          },
                        }}
                      >
                        <GitHubIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="LinkedIn">
                      <IconButton
                        component="a"
                        href={LINKEDIN_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 2,
                          color: "text.secondary",
                          "&:hover": {
                            borderColor: "primary.main",
                            color: "primary.main",
                          },
                        }}
                      >
                        <LinkedInIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>
              </Stack>
            </Box>

            {/* ── Columna derecha: formulario ── */}
            <Box
              component={motion.div}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.15 }}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
              }}
            >
              <Stack spacing={3}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {t("form_title")}
                </Typography>

                {/* Feedback success */}
                {status === "success" && (
                  <Alert
                    icon={<CheckCircleOutlineIcon fontSize="inherit" />}
                    severity="success"
                    sx={{ borderRadius: 2 }}
                  >
                    <Typography variant="body2" fontWeight={600}>
                      {t("success_title")}
                    </Typography>
                    <Typography variant="body2">
                      {t("success_message")}
                    </Typography>
                  </Alert>
                )}

                {/* Feedback error */}
                {status === "error" && (
                  <Alert severity="error" sx={{ borderRadius: 2 }}>
                    <Typography variant="body2" fontWeight={600}>
                      {t("error_title")}
                    </Typography>
                    <Typography variant="body2">
                      {t("error_message")}
                    </Typography>
                  </Alert>
                )}

                {/* Form — oculto si ya se envió con éxito */}
                {status !== "success" && (
                  <Stack
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    spacing={2.5}
                    noValidate
                  >
                    {/* Nombre + Email en fila */}
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                        gap: 2,
                      }}
                    >
                      <TextField
                        label={t("field_name")}
                        placeholder={t("field_name_placeholder")}
                        error={!!errors.from_name}
                        helperText={errors.from_name?.message}
                        sx={inputSx}
                        {...register("from_name", {
                          required: t("field_name_required"),
                        })}
                      />
                      <TextField
                        label={t("field_email")}
                        type="email"
                        placeholder={t("field_email_placeholder")}
                        error={!!errors.from_email}
                        helperText={errors.from_email?.message}
                        sx={inputSx}
                        {...register("from_email", {
                          required: t("field_email_required"),
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: t("field_email_invalid"),
                          },
                        })}
                      />
                    </Box>

                    <TextField
                      label={t("field_subject")}
                      placeholder={t("field_subject_placeholder")}
                      error={!!errors.subject}
                      helperText={errors.subject?.message}
                      sx={inputSx}
                      {...register("subject", {
                        required: t("field_subject_required"),
                      })}
                    />

                    <TextField
                      label={t("field_message")}
                      placeholder={t("field_message_placeholder")}
                      multiline
                      rows={5}
                      error={!!errors.message}
                      helperText={errors.message?.message}
                      sx={inputSx}
                      {...register("message", {
                        required: t("field_message_required"),
                        minLength: {
                          value: 20,
                          message: t("field_message_min"),
                        },
                      })}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={status === "loading"}
                      endIcon={
                        status === "loading" ? (
                          <CircularProgress size={16} color="inherit" />
                        ) : (
                          <SendIcon sx={{ fontSize: "1rem" }} />
                        )
                      }
                      sx={{
                        alignSelf: { xs: "stretch", sm: "flex-end" },
                        px: 4,
                      }}
                    >
                      {status === "loading" ? t("btn_sending") : t("btn_send")}
                    </Button>
                  </Stack>
                )}
              </Stack>
            </Box>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
