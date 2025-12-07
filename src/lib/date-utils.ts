export const formatDate = (isoString: string) => {
  const date = new Date(isoString);

  return Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/Lima'
  }).format(date);
};

export const formattedDate = (date: string | Date) => {
  return Intl.DateTimeFormat('es-PE', {
    dateStyle: 'long'
  }).format(new Date(date));
};
