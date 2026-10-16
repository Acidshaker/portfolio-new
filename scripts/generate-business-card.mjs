import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import bwipjs from 'bwip-js';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const outputDir = path.join(rootDir, 'public', 'marketing', 'tarjeta-presentacion');

const WIDTH = 1134;
const HEIGHT = 661;
const QR_URL = 'https://acidshaker.netlify.app/';

const frontBackground = path.join(outputDir, 'fondo-anverso.png');
const backBackground = path.join(outputDir, 'fondo-reverso.png');
const whatsappIconSource = path.join(outputDir, 'whatsapp-icon-source.jpg');
const frontOutput = path.join(outputDir, 'tarjeta-anverso-9x5cm-300dpi.png');
const backOutput = path.join(outputDir, 'tarjeta-reverso-9x5cm-300dpi.png');

const frontSvg = `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#061a32" stop-opacity="0.96"/>
      <stop offset="1" stop-color="#041126" stop-opacity="0.78"/>
    </linearGradient>
    <linearGradient id="cyan" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#28e7ff"/>
      <stop offset="1" stop-color="#00a9ff"/>
    </linearGradient>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000915" flood-opacity="0.45"/>
    </filter>
  </defs>

  <rect x="0" y="0" width="650" height="661" fill="url(#glass)"/>
  <path d="M83 116 H558" stroke="url(#cyan)" stroke-width="3" stroke-linecap="round" opacity="0.8"/>

  <g filter="url(#shadow)">
    <circle cx="126" cy="82" r="32" fill="#062949" stroke="#2ce9ff" stroke-width="2"/>
    <text x="126" y="93" text-anchor="middle" fill="#ffffff" font-family="Arial, Segoe UI, sans-serif" font-size="25" font-weight="800">JO</text>
  </g>
  <text x="174" y="75" fill="#ffffff" font-family="Arial, Segoe UI, sans-serif" font-size="31" font-weight="800" letter-spacing="1.5">JORGE ORTEGÓN</text>
  <text x="174" y="103" fill="#62eaff" font-family="Arial, Segoe UI, sans-serif" font-size="15" font-weight="700" letter-spacing="2.2">DESARROLLO DE SOFTWARE</text>

  <text x="83" y="174" fill="#ffffff" font-family="Arial, Segoe UI, sans-serif" font-size="43" font-weight="800">
    <tspan x="83" dy="0">SOLUCIONES DIGITALES</tspan>
    <tspan x="83" dy="48">A TU MEDIDA</tspan>
  </text>
  <text x="83" y="285" fill="#c7d9eb" font-family="Arial, Segoe UI, sans-serif" font-size="19" font-weight="400">
    <tspan x="83" dy="0">Transformo tus ideas y necesidades en herramientas</tspan>
    <tspan x="83" dy="27">que ayudan a crecer y simplificar tu negocio.</tspan>
  </text>

  <g font-family="Arial, Segoe UI, sans-serif" font-size="15" font-weight="700" letter-spacing="0.6">
    <rect x="83" y="354" width="200" height="44" rx="22" fill="#0a2c49" stroke="#29e6ff" stroke-width="1.5"/>
    <text x="183" y="382" text-anchor="middle" fill="#ffffff">WEB &amp; E-COMMERCE</text>
    <rect x="297" y="354" width="174" height="44" rx="22" fill="#0a2c49" stroke="#29e6ff" stroke-width="1.5"/>
    <text x="384" y="382" text-anchor="middle" fill="#ffffff">APPS MÓVILES</text>
    <rect x="83" y="412" width="230" height="44" rx="22" fill="#0a2c49" stroke="#29e6ff" stroke-width="1.5"/>
    <text x="198" y="440" text-anchor="middle" fill="#ffffff">SISTEMAS PARA NEGOCIOS</text>
    <rect x="327" y="412" width="202" height="44" rx="22" fill="#0a2c49" stroke="#29e6ff" stroke-width="1.5"/>
    <text x="428" y="440" text-anchor="middle" fill="#ffffff">IA &amp; AUTOMATIZACIÓN</text>
  </g>

  <g filter="url(#shadow)">
    <rect x="83" y="503" width="470" height="78" rx="18" fill="#ffffff"/>
    <text x="164" y="531" fill="#087f9f" font-family="Arial, Segoe UI, sans-serif" font-size="13" font-weight="800" letter-spacing="1.5">COTIZACIÓN SIN COMPROMISO</text>
    <text x="164" y="560" fill="#051b35" font-family="Arial, Segoe UI, sans-serif" font-size="25" font-weight="800">+52 990 101 4444</text>
  </g>

  <text x="83" y="619" fill="#9eb7ce" font-family="Arial, Segoe UI, sans-serif" font-size="13" font-weight="600" letter-spacing="1.1">JORGE.DEV  ·  MÉXICO</text>
</svg>`;

const backBaseSvg = `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="panel" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#04172d" stop-opacity="0.95"/>
      <stop offset="1" stop-color="#06294a" stop-opacity="0.84"/>
    </linearGradient>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="9" stdDeviation="14" flood-color="#000611" flood-opacity="0.5"/>
    </filter>
  </defs>
  <rect x="0" y="0" width="633" height="661" fill="url(#panel)"/>
  <circle cx="126" cy="98" r="36" fill="#062949" stroke="#2ce9ff" stroke-width="2"/>
  <text x="126" y="110" text-anchor="middle" fill="#ffffff" font-family="Arial, Segoe UI, sans-serif" font-size="29" font-weight="800">JO</text>

  <text x="83" y="187" fill="#ffffff" font-family="Arial, Segoe UI, sans-serif" font-size="48" font-weight="800">
    <tspan x="83" dy="0">¿TIENES</tspan>
    <tspan x="83" dy="52">UNA IDEA?</tspan>
  </text>
  <text x="83" y="304" fill="#2ce9ff" font-family="Arial, Segoe UI, sans-serif" font-size="30" font-weight="800" letter-spacing="1">HAGÁMOSLA REALIDAD.</text>
  <text x="83" y="359" fill="#c7d9eb" font-family="Arial, Segoe UI, sans-serif" font-size="19">
    <tspan x="83" dy="0">Conoce proyectos reales y descubre</tspan>
    <tspan x="83" dy="28">cómo podemos trabajar juntos.</tspan>
  </text>
  <path d="M83 433 H507" stroke="#28e7ff" stroke-width="2" opacity="0.7"/>
  <text x="83" y="485" fill="#ffffff" font-family="Arial, Segoe UI, sans-serif" font-size="20" font-weight="700">+52 990 101 4444</text>
  <text x="83" y="521" fill="#7feeff" font-family="Arial, Segoe UI, sans-serif" font-size="17" font-weight="700">acidshaker.netlify.app</text>
  <text x="83" y="605" fill="#9eb7ce" font-family="Arial, Segoe UI, sans-serif" font-size="13" font-weight="600" letter-spacing="1.1">DESARROLLO WEB · MÓVIL · ESCRITORIO · IA</text>

  <g filter="url(#shadow)">
    <rect x="711" y="101" width="348" height="390" rx="28" fill="#ffffff"/>
  </g>
  <text x="885" y="540" text-anchor="middle" fill="#ffffff" font-family="Arial, Segoe UI, sans-serif" font-size="16" font-weight="800" letter-spacing="1.3">ESCANEA MI PORTAFOLIO</text>
  <text x="885" y="572" text-anchor="middle" fill="#85eefe" font-family="Arial, Segoe UI, sans-serif" font-size="13" font-weight="600">PROYECTOS · SERVICIOS · CONTACTO</text>
</svg>`;

const qrBadgeSvg = `
<svg width="320" height="320" viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">
  <circle cx="160" cy="160" r="43" fill="#ffffff"/>
  <circle cx="160" cy="160" r="34" fill="#062949" stroke="#2ce9ff" stroke-width="3"/>
  <text x="160" y="170" text-anchor="middle" fill="#ffffff" font-family="Arial, Segoe UI, sans-serif" font-size="27" font-weight="800">JO</text>
</svg>`;

const qrBuffer = await bwipjs.toBuffer({
  bcid: 'qrcode',
  text: QR_URL,
  scale: 10,
  eclevel: 'H',
  paddingwidth: 3,
  paddingheight: 3,
  backgroundcolor: 'FFFFFF',
  barcolor: '051B35',
});

const brandedQr = await sharp(qrBuffer)
  .resize(320, 320, { fit: 'contain', background: '#ffffff' })
  .composite([{ input: Buffer.from(qrBadgeSvg), left: 0, top: 0 }])
  .png()
  .toBuffer();

const whatsappIcon = await sharp(whatsappIconSource)
  .extract({ left: 223, top: 207, width: 644, height: 644 })
  .resize(48, 48, { fit: 'cover' })
  .png()
  .toBuffer();

await sharp(frontBackground)
  .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'centre' })
  .composite([
    { input: Buffer.from(frontSvg), left: 0, top: 0 },
    { input: whatsappIcon, left: 101, top: 518 },
  ])
  .withMetadata({ density: 300 })
  .png({ compressionLevel: 9 })
  .toFile(frontOutput);

await sharp(backBackground)
  .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'centre' })
  .composite([
    { input: Buffer.from(backBaseSvg), left: 0, top: 0 },
    { input: brandedQr, left: 725, top: 124 },
  ])
  .withMetadata({ density: 300 })
  .png({ compressionLevel: 9 })
  .toFile(backOutput);

console.log(JSON.stringify({ frontOutput, backOutput, qrUrl: QR_URL }, null, 2));
