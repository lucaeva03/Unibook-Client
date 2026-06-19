// Funzione di utilità per formattare le date ISO restituite dal backend
// in un formato leggibile, es. "16 giu 2026, 08:30"
export function formatPostDate(isoDate: string): string {
  const date = new Date(isoDate);

  // Se la data non è valida si ritorna la stringa originale come fallback
  if (isNaN(date.getTime())) {
    return isoDate;
  }

  return new Intl.DateTimeFormat('it-IT', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}