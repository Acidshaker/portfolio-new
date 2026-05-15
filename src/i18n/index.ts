import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import heroEs from "./locales/es/hero.json";
import heroEn from "./locales/en/hero.json";
import headerEs from "./locales/es/header.json";
import headerEn from "./locales/en/header.json";
import footerEs from "./locales/es/footer.json";
import footerEn from "./locales/en/footer.json";
import projectsEs from "./locales/es/projects.json";
import projectsEn from "./locales/en/projects.json";
import contactEs from "./locales/es/contact.json";
import contactEn from "./locales/en/contact.json";
import notfoundEs from "./locales/es/notFound.json";
import notfoundEn from "./locales/en/notfound.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: {
        hero: heroEs,
        header: headerEs,
        footer: footerEs,
        projects: projectsEs,
        contact: contactEs,
        notfound: notfoundEs,
      },
      en: {
        hero: heroEn,
        header: headerEn,
        footer: footerEn,
        projects: projectsEn,
        contact: contactEn,
        notfound: notfoundEn,
      },
    },
    fallbackLng: "es",
    defaultNS: "hero",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
