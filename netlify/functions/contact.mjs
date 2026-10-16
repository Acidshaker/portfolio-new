const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";
const MAX_BODY_BYTES = 16_000;

const projectLabels = {
  web: "Sitio web o landing page",
  ecommerce: "Tienda en línea / e-commerce",
  mobile: "Aplicación móvil",
  desktop: "Aplicación de escritorio",
  automation: "IA, chatbot o automatización",
  other: "Otra solución",
};

const jsonHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: jsonHeaders });
}

function clean(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export default async (request) => {
  if (request.method !== "POST") {
    return json({ ok: false, message: "Method not allowed" }, 405);
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return json({ ok: false, message: "Unsupported content type" }, 415);
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return json({ ok: false, message: "Request too large" }, 413);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, message: "Invalid request" }, 400);
  }

  // Honeypot: bots suelen completar este campo invisible.
  if (clean(body.website, 200)) {
    return json({ ok: true });
  }

  const name = clean(body.from_name, 100);
  const email = clean(body.from_email, 160).toLowerCase();
  const projectType = clean(body.project_type, 40);
  const subject = clean(body.subject, 120).replace(/[\r\n]+/g, " ");
  const message = clean(body.message, 4_000);

  if (
    name.length < 2 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !Object.hasOwn(projectLabels, projectType) ||
    subject.length < 3 ||
    message.length < 20
  ) {
    return json({ ok: false, message: "Please review the form fields" }, 400);
  }

  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME || "Jorge Ortegón";
  const recipientEmail = process.env.CONTACT_TO_EMAIL;

  if (!apiKey || !senderEmail || !recipientEmail) {
    console.error("Missing Brevo contact form configuration");
    return json({ ok: false, message: "Contact service is not configured" }, 503);
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeProject = escapeHtml(projectLabels[projectType]);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");

  const payload = {
    sender: { name: senderName, email: senderEmail },
    to: [{ name: "Jorge Ortegón", email: recipientEmail }],
    replyTo: { name, email },
    subject: `[Portafolio] ${projectLabels[projectType]}: ${subject}`,
    htmlContent: `
      <!doctype html>
      <html lang="es">
        <body style="margin:0;background:#f4f7fb;font-family:Arial,sans-serif;color:#071b32">
          <div style="max-width:640px;margin:0 auto;padding:32px 20px">
            <div style="background:#061a32;color:#fff;padding:24px 28px;border-radius:16px 16px 0 0">
              <div style="color:#32dff5;font-size:12px;font-weight:700;letter-spacing:1.5px">NUEVO CONTACTO DESDE TU PORTAFOLIO</div>
              <h1 style="font-size:24px;margin:10px 0 0">${safeProject}</h1>
            </div>
            <div style="background:#fff;padding:28px;border-radius:0 0 16px 16px;border:1px solid #dce5ee;border-top:0">
              <p style="margin:0 0 8px"><strong>Nombre:</strong> ${safeName}</p>
              <p style="margin:0 0 8px"><strong>Correo:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
              <p style="margin:0 0 24px"><strong>Asunto:</strong> ${safeSubject}</p>
              <div style="border-left:4px solid #19cce6;padding:4px 0 4px 18px;line-height:1.65">${safeMessage}</div>
              <p style="margin:26px 0 0;color:#60758a;font-size:13px">Responde directamente a este correo para contactar al prospecto.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    tags: ["portfolio-contact"],
  };

  try {
    const response = await fetch(BREVO_ENDPOINT, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      const details = await response.text();
      console.error("Brevo rejected contact message", response.status, details);
      return json({ ok: false, message: "Email provider rejected the message" }, 502);
    }

    return json({ ok: true }, 201);
  } catch (error) {
    console.error("Unable to send contact message", error);
    return json({ ok: false, message: "Unable to send message" }, 502);
  }
};
