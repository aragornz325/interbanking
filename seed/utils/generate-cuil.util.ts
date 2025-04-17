/**
 * @description Util function to generate a random CUIL (Clave Única de Identificación Laboral) number.
 * @returns {string} A random CUIL number in the format of 11 digits.
 * @example
 * // returns '20312345678'
 * generateCuil();
 */
export function generateUniqueCuit(): string {
  const now = Date.now().toString(); // milisegundos
  const random = Math.floor(Math.random() * 100000).toString();
  const cuit = (now + random).replace(/\D/g, '').padEnd(11, '0').slice(0, 11);
  return cuit;
}
