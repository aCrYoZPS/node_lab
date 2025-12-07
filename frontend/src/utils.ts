export const formatInTimezone = (
    utcDate: string | Date,
    timezone: string): string => {
    const date = new Date(utcDate);
    return new Intl.DateTimeFormat('ru-RU', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};
