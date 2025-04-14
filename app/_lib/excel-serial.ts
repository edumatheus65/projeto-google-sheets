/**
 * Converte um serial numérico do Excel para um objeto Date.
 * @param serial - Número serial (por exemplo, 45736.24201388889)
 * @returns Data equivalente como objeto Date
 */

export function excelSerialToDate(serial: number) {
  const daysSinceEpoch = Math.floor(serial) - 25569;
  const secondsInDay = 86400;
  const fractionalDay = serial - Math.floor(serial);

  const date = new Date(daysSinceEpoch * secondsInDay * 1000);
  date.setSeconds(date.getSeconds() + Math.round(fractionalDay * secondsInDay));
}
