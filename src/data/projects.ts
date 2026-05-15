export type ProjectCategory = "frontend" | "backend" | "mobile" | "fullstack";

export interface Project {
  id: string;
  titleEs: string;
  titleEn: string;
  descriptionEs: string;
  descriptionEn: string;
  stack: string[];
  category: ProjectCategory;
  image?: string; // ruta a screenshot, ej: "/projects/app-name.png"
  githubUrl?: string; // undefined = proyecto privado
  demoUrl?: string;
  featured?: boolean;
  isPrivate?: boolean;
  isWip?: boolean;
}

// ─── Datos de ejemplo — reemplaza con los tuyos ───────────────────────────────
export const PROJECTS: Project[] = [
  {
    id: "obraexacta",
    titleEs: "Obra Exacta - ERP",
    titleEn: "Obra Exacta - ERP",
    descriptionEs:
      "Sistema de gestión empresarial para gestión de proyectos de obra, control de gastos, recursos materiales y personal. Arquitectura modular con microservicios y panel de analytics en tiempo real.",
    descriptionEn:
      "Enterprise resource planning system for project management, expense control, materials and personnel. Modular architecture with microservices and real-time analytics dashboard.",
    // descriptionEs:
    //   "Sistema de gestión empresarial para administración de inventarios, facturación y recursos humanos. Arquitectura modular con microservicios y panel de analytics en tiempo real.",
    // descriptionEn:
    //   "Enterprise resource planning system for inventory management, billing and HR. Modular architecture with microservices and real-time analytics dashboard.",
    stack: ["React", "TypeScript", "Node.js", "PostgreSQL", "Docker", "AWS"],
    category: "fullstack",
    featured: true,
    isPrivate: true,
    image: "/projects/obraexacta.png",
  },
  {
    id: "wpd-mobile",
    titleEs: "App Whiteplank móvil - ERP",
    titleEn: "Mobile Whiteplanlk App - ERP",
    descriptionEs:
      "Aplicación móvil para el ERP de la empresa whiteplank con plan semanal de actividades, gestion de progreso de proyectos y reporte de avances",
    descriptionEn:
      "Mobile app for the whiteplank company's ERP with weekly activity plan, project progress management and progress reports",
    stack: ["React Native", "Expo", "TypeScript"],
    category: "mobile",
    isPrivate: true,
    image: "/projects/whiteplank.png",
  },
  {
    id: "spin-dj",
    titleEs: "Spin Dj - SAAS",
    titleEn: "Spin Dj - SAAS",
    descriptionEs:
      "Sistema de suscripción a través de stripe para artistas que desean ofrecer servicios de DJ. Permite a los artistas recibir peticiones musicales desde Spotify en tiempo real con la implementación de websockets, gestionar sus horarios y generar reportes de ingresos.",
    descriptionEn:
      "A subscription system powered by Stripe for artists who want to offer DJ services. It allows artists to receive real-time music requests from Spotify through the implementation of websockets, manage their schedules, and generate revenue reports",
    stack: [
      "React",
      "TypeScript",
      "MUI",
      "Node.js",
      "Express",
      "PostgreSQL",
      "Docker",
      "AWS",
    ],
    category: "fullstack",
    image: "/projects/spindj.png",
    isPrivate: true,
  },
  {
    id: "registrasso-app",
    titleEs: "Registrasso App",
    titleEn: "Registrasso App",
    descriptionEs:
      "Aplicación híbrida para registro de eventos y control de accesos con soporte de lectura de QR, NFC y Honeywell.",
    descriptionEn:
      "Hybrid app for event registration and access control with QR, NFC and Honeywell support.",
    stack: ["Ionic", "Angular", "TypeScript"],
    category: "mobile",
    image: "/projects/registrasso.png",
    isPrivate: true,
  },
  {
    id: "api-gateway",
    titleEs: "API Gateway con autenticación",
    titleEn: "API Gateway with Auth",
    descriptionEs:
      "Gateway REST con autenticación JWT, rate limiting, logging centralizado y documentación con Swagger.",
    descriptionEn:
      "REST gateway with JWT authentication, rate limiting, centralized logging and Swagger docs.",
    stack: ["Node.js", "Express", "TypeOrm", "PostgreSQL", "Docker"],
    category: "backend",
    githubUrl: "https://github.com/Acidshaker/type-orm-api",
  },
  {
    id: "portfolio",
    titleEs: "Este portafolio",
    titleEn: "This portfolio",
    descriptionEs:
      "Portafolio personal construido con React, MUI v6 y sistema de temas dinámico con soporte dark/light mode e i18n.",
    descriptionEn:
      "Personal portfolio built with React, MUI v6 and dynamic theme system with dark/light mode and i18n support.",
    stack: ["React", "TypeScript", "MUI", "Framer Motion", "i18next"],
    category: "frontend",
    image: "/projects/portfolio.png",
    githubUrl: "https://github.com/Acidshaker/portfolio-new.git",
  },
];
