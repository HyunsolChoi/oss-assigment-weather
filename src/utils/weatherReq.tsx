const baseUrl = '/api/weather';

export async function weatherReq({ nx, ny, baseDate, baseTime, fcstDate, fcstTime }: any) {
    const params = new URLSearchParams({
        nx: String(nx),
        ny: String(ny),
        baseDate,
        baseTime,
    });

    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
        try {
            const res = await fetch(`${baseUrl}?${params.toString()}`);
            const json = await res.json();

            // NO_DATA 응답인지 체크
            if (json.response?.header?.resultCode === '03') {
                console.warn(`NO_DATA 응답 (재시도 ${attempt + 1}/${maxRetries}) - nx: ${nx}, ny: ${ny}`);
                attempt++;
                await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 대기
                continue;
            }

            // 정상 응답 시 데이터 파싱
            const categories = ['TMN', 'TMX', 'POP', 'WSD'];
            const items = json.response?.body?.items?.item;
            const result: Record<string, string> = {};

            if (!items || !Array.isArray(items)) return result;

            for (const category of categories) {
                const match = items.find((item: any) => {
                    if (item.category !== category) return false;
                    if (item.fcstDate !== fcstDate) return false;
                    if (category === 'TMX' || category === 'TMN') return true;
                    return item.fcstTime === fcstTime;
                });

                if (match) result[category] = match.fcstValue;
            }

            return result;

        } catch (err) {
            console.error(`weatherReq 실패 (시도 ${attempt + 1}/${maxRetries}):`, err);
            throw err;
        }
    }

    console.warn(`weatherReq 재시도 실패 - nx: ${nx}, ny: ${ny}`);
    return {};
}
