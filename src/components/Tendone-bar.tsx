import { useEffect, useState } from "react";
import logolineare from "../assets/piùZuppa-logolineare.svg";
import { useAuth } from "./AuthContext"; // 1. Import the hook

export const Tendone = () => {
    const { user, currentSite, logout } = useAuth(); // 2. Destructure what you need
    
    const stripeWidth = 60;
    const fullPattern = stripeWidth * 2;
    const [weather, setWeather] = useState({
        temp: '--',
        icon: '☁️',
        desc: 'Caricamento...'
    });

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const url = "https://api.open-meteo.com/v1/forecast?latitude=44.49&longitude=11.34&current=temperature_2m,weather_code&timezone=Europe%2FBerlin";
                const res = await fetch(url);
                const data = await res.json();
                const tempNum = Math.round(data.current.temperature_2m);
                const code = data.current.weather_code;

                let icon = '☀️';
                let desc = 'Sereno';
                if (code > 0 && code < 4) { icon = '⛅'; desc = 'Nuvoloso'; }
                if (code >= 45 && code <= 48) { icon = '🌫️'; desc = 'Nebbia'; }
                if (code >= 51) { icon = '🌧️'; desc = 'Pioggia'; }

                setWeather({ temp: tempNum.toString(), icon, desc });
            } catch (e) {
                console.error("Weather error", e);
                setWeather(prev => ({ ...prev, desc: 'Errore' }));
            }
        };
        fetchWeather();
    }, []);

    return (
        <header className="relative w-full z-50">
            <div
                className="w-full h-16 flex items-center justify-between px-10 shadow-md"
                style={{
                    background: `repeating-linear-gradient(90deg, #fccc02, #fccc02 ${stripeWidth}px, #9b0539 ${stripeWidth}px, #9b0539 ${fullPattern}px)`
                }}
            >
                <img
                    src={logolineare}
                    className="h-12 w-auto brightness-0 invert drop-shadow-[0_2px_1px_rgba(0,0,0,0.8)] -skew-x-6"
                />

                {/* Weather Widget */}
                <div className="absolute left-1/2 -translate-x-1/2 top-3 flex flex-col items-center 
                bg-[#3d2b1f] p-1.5 rounded-xs border-8 border-x-amber-900 border-y-amber-800 shadow-2xl z-10">
                    <div className="bg-black px-4 py-1 border-2 border-stone-800 rounded-sm flex items-center gap-4">
                        <span className="text-4xl">{weather.icon}</span>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold text-amber-500 font-mono leading-none">
                                {weather.temp}°C
                            </span>
                            <span className="text-[14px] uppercase font-mono text-amber-700 font-bold mt-1">
                                {currentSite || "BOLOGNA"}: {weather.desc}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 3. Render User and Site info */}
                <button 
                    onClick={logout}
                    className="bg-stone-800 text-white px-5 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider shadow-sm hover:bg-stone-700 transition-colors"
                >
                    {user?.nomeECognome || 'Guest'} - {currentSite || 'No Site'}
                </button>
            </div>

            {/* Decorative bottom edge */}
            <div className="w-full h-8 filter drop-shadow-[0_10px_8px_rgba(0,0,0,0.5)]">
                <div
                    className="w-full h-full"
                    style={{
                        background: `repeating-linear-gradient(90deg, #fccc02, #fccc02 ${stripeWidth}px, #9b0539 ${stripeWidth}px, #9b0539 ${fullPattern}px)`,
                        WebkitMaskImage: `radial-gradient(circle at ${stripeWidth / 2}px 0px, black ${stripeWidth / 2}px, transparent 0)`,
                        WebkitMaskSize: `${stripeWidth}px 100%`,
                        maskImage: `radial-gradient(circle at ${stripeWidth / 2}px 0px, black ${stripeWidth / 2}px, transparent 0)`,
                        maskSize: `${stripeWidth}px 100%`,
                    }}
                />
            </div>
        </header>
    );
};
