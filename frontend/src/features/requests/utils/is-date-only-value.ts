const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function isDateOnlyValue(value: string | null): value is string {
  if (value === null) {
    return false;
  }
  if (!DATE_ONLY_PATTERN.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);

  const date = new Date(year, month - 1, day);

  //JSのDateの繰り上げの性質使って暦チェック
  const isValid =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;

  return isValid;
}
