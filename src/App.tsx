import React, {useEffect, useRef, useState} from 'react';
import NaverMap from "./components/NaverMap/NaverMap";
import Header from "./config/reuseable/Header";
import './App.css';
import { fetchWeather } from './utils/fetchWeather';

function App() {
    const [loading, setLoading] = useState(true);
    const [percent, setPercent] = useState(0);
    const [progress, setProgress] = useState(0);
    const [weatherData, setWeatherData] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("home");
    const prevProgressRef = useRef(0);
    const hasLoadedRef = useRef(false);

    const refreshWeather = () => {
        setLoading(true);
        setProgress(0);
        setPercent(0);
        prevProgressRef.current = 0;
        loadWeatherData();
    };

    useEffect(() => {
        if (!hasLoadedRef.current) {
            hasLoadedRef.current = true;
            loadWeatherData();
        }
    }, []);

    const loadWeatherData = async () => {
        try {
            const data = await fetchWeather(() => {
                setProgress(prev => {
                    const next = prev + 1;
                    setPercent(Math.floor((next / 242) * 100)); // 전체 데이터 242개
                    return next;
                });
            });
            setWeatherData(data);
        } catch (e) {
            console.error('날씨 로딩 실패:', e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="App" >
            <Header onCategorySelect={setSelectedCategory} onRefresh={refreshWeather}/>
            <NaverMap weatherData={weatherData}  selectedCategory={selectedCategory}/>
            {loading && (
                <div className="loading-overlay">
                    <div className="loading-text">
                        <p>데이터 불러오는 중...</p>
                        <p>{percent}%</p>
                        <div className="progress-bar-wrapper">
                            <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
