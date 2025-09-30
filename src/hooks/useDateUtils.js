export function useDateUtils() {
    const formatDateTime = (isoString) => {
        if (!isoString) return 'N/A';
        const date = new Date(isoString);
        return date.toLocaleString('uk-UA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const ensureSeconds = (datetimeLocalValue) => {
        if (!datetimeLocalValue) return datetimeLocalValue;
        return datetimeLocalValue.endsWith(':00') ? datetimeLocalValue : `${datetimeLocalValue}:00`;
    };

    return { formatDateTime, ensureSeconds };
}


