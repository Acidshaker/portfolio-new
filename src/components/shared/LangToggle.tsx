import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function LangToggle() {
  const { i18n } = useTranslation();
  const isEs = i18n.language?.startsWith("es");

  const toggle = () => {
    i18n.changeLanguage(isEs ? "en" : "es");
  };

  return (
    <Button
      onClick={toggle}
      size="small"
      variant="outlined"
      sx={{
        minWidth: 0,
        px: 1.5,
        py: 0.5,
        fontSize: "0.75rem",
        fontWeight: 600,
        letterSpacing: "0.05em",
        borderRadius: 999,
      }}
    >
      {isEs ? "EN" : "ES"}
    </Button>
  );
}
