import { useEffect, useState } from "react";
import logolineare from "../assets/piùZuppa-logolineare.svg"

export const Tendone = () => {
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

                setWeather({
                    temp: tempNum.toString(),
                    icon,
                    desc
                });

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

                <div className="absolute left-1/2 -translate-x-1/2 top-0 flex justify-between w-20 px-2 h-4 z-0">
                    <div className="w-1 h-full bg-stone-700 shadow-sm" />
                    <div className="w-1 h-full bg-stone-700 shadow-sm" />
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 top-3 flex flex-col items-center 
                bg-[#3d2b1f] p-1.5 rounded-xs border-8 border-x-amber-900 border-y-amber-800 shadow-2xl z-10">

                    <div className="bg-black px-4 py-1 border-2 border-stone-800 rounded-sm flex items-center gap-4">

                        <span className="text-4xl drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                            {weather.icon}
                        </span>

                        <div className="flex flex-col items-center">

                            <span className="text-2xl font-bold text-amber-500 font-mono tracking-tighter leading-none drop-shadow-[0_0_5px_rgba(245,158,11,0.7)]">
                                {weather.temp}°C
                            </span>

                            <span className="text-[14px] uppercase font-mono text-amber-700 font-bold tracking-widest mt-1">
                                BOLOGNA: {weather.desc}
                            </span>
                        </div>
                    </div>
                </div>
                <button className="bg-stone-800 text-white px-5 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider shadow-sm">
                    {user} - {currentSite}
                </button>
            </div>


            <div className="w-full h-8 filter drop-shadow-[0_10px_8px_rgba(0,0,0,0.5)]">
                <div
                    className="w-full h-full"
                    style={{
                        background: `repeating-linear-gradient(90deg, #fccc02, #fccc02 ${stripeWidth}px, #9b0539 ${stripeWidth}px, #9b0539 ${fullPattern}px)`,

                        WebkitMaskImage: `radial-gradient(circle at ${stripeWidth / 2}px 0px, black ${stripeWidth / 2}px, transparent 0)`,
                        WebkitMaskSize: `${stripeWidth}px 100%`,
                        WebkitMaskRepeat: 'repeat-x',

                        maskImage: `radial-gradient(circle at ${stripeWidth / 2}px 0px, black ${stripeWidth / 2}px, transparent 0)`,
                        maskSize: `${stripeWidth}px 100%`,
                        maskRepeat: 'repeat-x'
                    }}
                />
            </div>
        </header>
    );
};
