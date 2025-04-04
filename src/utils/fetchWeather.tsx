import Papa from 'papaparse';
import { LambertConverter } from './LambertConverter';
import { getBaseTime } from './getBaseTime';
import { getFcstTime } from './getFcstTime';
import { weatherReq } from '../API/weatherReq';

export async function fetchWeather(onProgress?: () => void): Promise<any[]> {
    const converter = new LambertConverter();
    const { baseDate, baseTime } = getBaseTime();
    const { fcstDate, fcstTime } = getFcstTime();

    console.log(fcstDate, fcstTime);

    return new Promise((resolve, reject) => {
        Papa.parse('/static/resource/LOC_CODE_EUC_KR.csv', {
            download: true,
            encoding: 'euc-kr',
            header: true,
            complete: async (results: Papa.ParseResult<any>) => {
                const rawRows = results.data;
                const cleanedRows = rawRows.filter(row =>
                    row.Latitude && row.Longitude &&
                    !isNaN(Number(row.Latitude)) && !isNaN(Number(row.Longitude))
                );

                const tasks = cleanedRows.map(async (row) => {
                    try {
                        const { Longitude, Latitude } = row;
                        const { nx, ny } = converter.convert(Number(Longitude), Number(Latitude));
                        const weatherMap = await weatherReq({
                            nx,
                            ny,
                            baseDate,
                            baseTime,
                            fcstDate,
                            fcstTime,
                        });

                        if (onProgress) {
                            onProgress(); // 각 요청 완료 시 호출
                        }

                        return {
                            ...row,
                            nx,
                            ny,
                            ...weatherMap,
                        };
                    } catch (e) {
                        console.error('날씨 수집 실패:', e);
                        return null; // 실패한 항목은 제외
                    }
                });

                const weatherResults  = await Promise.all(tasks);
                const updatedRows = weatherResults.filter(Boolean); // null 제거
                resolve(updatedRows);
            },
            error: (err) => {
                console.error('CSV 파싱 오류:', err);
                reject(err);
            },
        });
    });
}
