export function getFcstTime(): { fcstDate: string; fcstTime: string } {
    const now = new Date();
    const target = new Date(now);

    // 1시간 후로 올림
    target.setHours(target.getHours() + 1);
    target.setMinutes(0);
    target.setSeconds(0);
    target.setMilliseconds(0);

    const yyyy = target.getFullYear();
    const mm = String(target.getMonth() + 1).padStart(2, '0');
    const dd = String(target.getDate()).padStart(2, '0');
    const hh = String(target.getHours()).padStart(2, '0');

    return {
        fcstDate: `${yyyy}${mm}${dd}`,
        fcstTime: `${hh}00`,
    };
}
