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
    id: "kosti",
    titleEs: "Kosti App",
    titleEn: "Kosti App",
    descriptionEs:
      "Mi primer SaaS: una plataforma propia para pequeños negocios que integra inventario, cálculo inteligente de precios, ventas, cotizaciones, abonos, clientes, compras, gastos y reportes. Como cofundador y CTO lideré y construí el producto completo end-to-end: estrategia y UX, frontend web y móvil, API y base de datos, IA, pagos, correo transaccional, infraestructura AWS, CI/CD y operación en producción.",
    descriptionEn:
      "My first SaaS: a proprietary platform for small businesses that brings together inventory, intelligent pricing, sales, quotes, installments, customers, purchases, expenses, and reporting. As co-founder and CTO, I led and built the complete product end-to-end: strategy and UX, web and mobile frontends, API and database, AI, payments, transactional email, AWS infrastructure, CI/CD, and production operations.",
    stack: [
      "React",
      "TypeScript",
      "React Native",
      "Node.js",
      "PostgreSQL",
      "OpenAI",
      "Stripe",
      "Docker",
      "AWS",
      "GitHub Actions",
    ],
    category: "fullstack",
    featured: true,
    isPrivate: true,
    image: "/projects/kosti.png",
    demoUrl: "https://kosti.app",
  },
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
    id: "ovatio-vibe",
    titleEs: "Ovatio Vibe - SaaS",
    titleEn: "Ovatio Vibe - SaaS",
    descriptionEs:
      "Plataforma para DJs y recintos que permite recibir solicitudes musicales de Spotify en tiempo real mediante WebSockets, administrar eventos y horarios, procesar pagos y propinas con Stripe y consultar reportes de ingresos.",
    descriptionEn:
      "A platform for DJs and venues to receive Spotify song requests in real time through WebSockets, manage events and schedules, process payments and tips with Stripe, and review revenue reports.",
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
    image: "/projects/ovatiovibe.png",
    demoUrl: "https://admin.ovatiovibe.com",
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
