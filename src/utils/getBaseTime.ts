export function getBaseTime(): { baseDate: string; baseTime: string } {
    const now = new Date();
    let targetDate = new Date(now);

    const hh = now.getHours();
    const isAfter0600 = hh >= 6;

    if (!isAfter0600) {
        // 06:00 이전이면 어제로 돌림
        targetDate.setDate(now.getDate() - 1);
    }

    const yyyy = targetDate.getFullYear();
    const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
    const dd = String(targetDate.getDate()).padStart(2, '0');

    const dateStr = `${yyyy}${mm}${dd}`;
    const timeStr = isAfter0600 ? '0200' : '2300';

    return {
        baseDate: dateStr,
        baseTime: timeStr,
    };
}
