import * as yup from "yup";

/** 🔐 Campo obligatorio */
export const required = yup.string().required("Este campo es obligatorio");

/** 📧 Validación de correo electrónico */
export const isEmail = yup.string().email("Correo inválido");

/** 🔠 Longitud mínima dinámica */
export const minLength = (length: number) => (value: string) =>
  value?.length >= length || `Debe tener al menos ${length} caracteres`;

/** 🔡 Longitud máxima dinámica */
export const maxLength = (length: number) => (value: string) =>
  value?.length <= length || `No puede tener más de ${length} caracteres`;

/** 🔢 Solo números */
export const onlyNumbers = (value: string) =>
  /^\d+$/.test(value) || "Solo se permiten números";

/** 🚫 No permite números negativos */
export const noNegative = (value: number | string) => {
  const num = Number(value);
  return (!isNaN(num) && num >= 0) || "No se permiten números negativos";
};

/** 🔢 Solo números enteros (sin decimales) */
export const onlyIntegers = (value: number | string) => {
  const num = Number(value);
  return Number.isInteger(num) || "No se permiten decimales";
};

/** 💰 Permite decimales pero máximo 2 */
export const maxTwoDecimals = (value: number) => {
  if (value === undefined || value === null) return true;
  const isValid = /^\d+(\.\d{1,2})?$/.test(value.toString());
  return isValid || "Solo se permiten hasta 2 decimales";
};

/** 🆎 Solo letras */
export const onlyLetters = yup
  .string()
  .matches(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/, "Solo letras y espacios");

/** 🧹 Sin espacios al inicio o al final */
export const noTrimSpaces = yup
  .string()
  .test(
    "no-trim-spaces",
    "No debe tener espacios al inicio o al final",
    (value) => value === value?.trim()
  );

/** 🔑 Contraseña segura */
export const strongPassword = yup
  .string()
  .min(8, "Debe tener al menos 8 caracteres")
  .matches(/[a-z]/, "Debe incluir minúsculas")
  .matches(/[A-Z]/, "Debe incluir mayúsculas")
  .matches(/\d/, "Debe incluir números")
  .matches(/[@$!%*?&#]/, "Debe incluir caracteres especiales");

/** 🔁 Validación para confirmar contraseña */
export const samePassword = (password: string) =>
  yup.string().oneOf([password], "Las contraseñas no coinciden");
