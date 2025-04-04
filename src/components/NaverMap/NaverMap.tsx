import { useEffect, useState, useRef } from 'react';
import './NaverMap.css';

const getColorByValue = (
    category: string,
    value: number,
    min: number,
    max: number
): string => {
    const clamp = (v: number) => Math.max(min, Math.min(max, v));
    const norm = (clamp(value) - min) / (max - min);

    if (category === 'POP') {
        if (value <= 0) return `rgba(255, 255, 255, 0)`;
        const norm = value / 100;
        return `rgba(0, 120, 255, ${0.2 + norm * 0.3})`;
    } else if (category === 'TMX') {
        if (value < 15) return `rgba(255, 255, 255, 0)`;
        return `rgba(255, 60, 60, ${0.2 + norm * 0.5})`;
    } else if (category === 'TMN') {
        if (value > 10) return `rgba(255, 255, 255, 0)`;
        return `rgba(0, 160, 60, ${0.2 + norm * 0.7})`;
    } else if (category === 'WSD') {
        return `rgba(130, 80, 255, ${0.2 + norm * 0.7})`;
    }
    return 'rgba(200, 200, 200, 0.3)';
};

interface WeatherRow {
    Code: string;
    Latitude: string;
    Longitude: string;
    [key: string]: any;
}

interface NaverMapProps {
    weatherData: WeatherRow[];
    selectedCategory: string;
}

function NaverMap({ weatherData, selectedCategory }: NaverMapProps) {
    const [valueRange, setValueRange] = useState<{ min: number; max: number }>({ min: 0, max: 100 });
    const mapRef = useRef<naver.maps.Map | null>(null);
    const dataLayerRef = useRef<naver.maps.Data | null>(null);
    const geojsonLoadedRef = useRef(false);

    useEffect(() => {
        const mapDiv = document.getElementById('map');
        if (!mapDiv) return;

        if (!mapRef.current) {
            mapRef.current = new naver.maps.Map(mapDiv, {
                center: new naver.maps.LatLng(35.846008, 127.134315),
                padding: { top: 0, right: 0, bottom: 0, left: 0 },
                zoom: 11,
                minZoom: 6,
                maxZoom: 15,
                zoomControl: true,
                zoomControlOptions: {
                    position: naver.maps.Position.RIGHT_CENTER,
                    style: naver.maps.ZoomControlStyle.SMALL,
                },
                scaleControl: true,
                scaleControlOptions: {
                    position: naver.maps.Position.BOTTOM_RIGHT,
                },
                logoControlOptions: {
                    position: naver.maps.Position.BOTTOM_LEFT,
                },
                mapDataControl: false,
                mapTypeControl: true,
                mapTypeControlOptions: {
                    position: naver.maps.Position.TOP_RIGHT,
                    style: naver.maps.MapTypeControlStyle.BUTTON,
                    mapTypeIds: [
                        naver.maps.MapTypeId.NORMAL,
                        naver.maps.MapTypeId.SATELLITE,
                    ],
                },
            });
        }

        const map = mapRef.current;

        if (!geojsonLoadedRef.current) {
            fetch('/static/resource/TL_SCCO_SIG_WGS84.json')
                .then((res) => res.json())
                .then((geojson) => {
                    const dataLayer = map!.data;
                    dataLayer.addGeoJson(geojson, false);
                    dataLayerRef.current = dataLayer;
                    geojsonLoadedRef.current = true;
                    applyStyle();
                });
        } else {
            applyStyle();
        }

        function applyStyle() {
            const dataLayer = dataLayerRef.current;
            if (!dataLayer) return;

            if (selectedCategory === 'home') {
                dataLayer.setStyle(() => {
                    return {
                        visible: false,
                        fillOpacity: 0,
                        strokeOpacity: 0,
                    };
                });
                return;
            }

            const weatherMap = new Map(weatherData.map(r => [r.Code, r]));

            const values = weatherData
                .map((r) => Number(r[selectedCategory]))
                .filter((v) => !isNaN(v));

            let min = Math.min(...values);
            let max = Math.max(...values);

            if (selectedCategory === 'TMX' && min < 15) min = 15;
            else if (selectedCategory === 'TMN' && max > 10) max = 10;
            else if (selectedCategory === 'WSD') min = 0;
            else if (selectedCategory === 'POP') {
                min = 0;
                max = 100;
            }
            setValueRange({ min, max });

            dataLayer.setStyle((feature) => {
                const sigCd = feature.getProperty('SIG_CD');
                const row = weatherMap.get(sigCd);

                if (!row || row[selectedCategory] === undefined || isNaN(Number(row[selectedCategory]))) {
                    return {
                        fillColor: 'rgba(0, 0, 0, 0.5)',
                        fillOpacity: 1,
                        strokeColor: '#333',
                        strokeWeight: 0.5,
                        visible: true,
                    };
                }

                const value = Number(row[selectedCategory]);
                const color = getColorByValue(selectedCategory, value, min, max);

                return {
                    fillColor: color,
                    fillOpacity: 0.9,
                    strokeColor: '#333',
                    strokeWeight: 0.5,
                    visible: true,
                };
            });
        }
    }, [weatherData, selectedCategory]);

    return (
        <div>
            <div id="map" style={{ width: '100%', height: '100vh' }}></div>
            {selectedCategory !== 'home' && (
                <div className="legend-box">
                    <svg width="320" height="50">
                        <defs>
                            <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor={getColorByValue(selectedCategory, valueRange.min, valueRange.min, valueRange.max)} />
                                <stop offset="100%" stopColor={getColorByValue(selectedCategory, valueRange.max, valueRange.min, valueRange.max)} />
                            </linearGradient>
                        </defs>
                        <rect x="10" y="15" width="300" height="10" fill="url(#gradient)" stroke="#000" strokeWidth="1" />
                        {[0, 0.2, 0.4, 0.6, 0.8, 1].map((p, idx) => {
                            const rawVal = valueRange.min + p * (valueRange.max - valueRange.min);
                            const val = Number.isInteger(rawVal) ? rawVal : rawVal.toFixed(1);
                            return <text key={idx} x={10 + p * 300} y={40} fontSize="10" textAnchor="middle">{val}</text>;
                        })}
                    </svg>
                </div>
            )}
        </div>
    );
}

export default NaverMap;