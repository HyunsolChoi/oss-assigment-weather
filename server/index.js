const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const cors = require('cors');

const app = express();
app.use(cors());

const serviceKey = 'f2RibehMZS9OqPqnSEcRB9dc23TvnI8mwGXAKudmNl21texlPzfRlMRUklG4N5gbFPtIp98n0Ycmv0GoJs24OA==';

app.get('/api/weather', async (req, res) => {
    const { nx, ny, baseDate, baseTime } = req.query;

    const baseUrl = 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst';
    const params = new URLSearchParams({
        serviceKey: decodeURIComponent(serviceKey),
        numOfRows: '1000',
        pageNo: '1',
        dataType: 'JSON',
        base_date: baseDate,
        base_time: baseTime,
        nx,
        ny,
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5초 후 abort

    try {
        const response = await fetch(`${baseUrl}?${params.toString()}`, {
            signal: controller.signal,
        });
        clearTimeout(timeout);
        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error('fetch 실패:', err);
        res.status(500).json({ error: '기상청 API 실패', detail: err.message });
    }
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`서버 실행 중: http://localhost:${PORT}`);
});
