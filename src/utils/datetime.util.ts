export function stripTimezone(dateTime: string): string {
  return dateTime.replace(/(Z|[+-]\d{2}:\d{2})$/, '');
}

export function buildDateTime(date: Date, time: string): string {
  const [hours, minutes] = time.split(':');
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hh = String(Number(hours)).padStart(2, '0');
  const mm = String(Number(minutes)).padStart(2, '0');
  return `${year}-${month}-${day}T${hh}:${mm}:00`;
}
