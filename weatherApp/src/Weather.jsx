import { useState } from "react";

const API_KEY = "7cc23a3166283782842c2d16aafdb40e";

function Weather() {
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [erro, setErro] = useState(false);

    const getThemeClass = () => {
        if (!result) return "default-theme";
        const condition = result.weather[0].main.toLowerCase();
        if (condition.includes("clear")) return "sunny-theme";
        if (condition.includes("cloud")) return "cloudy-theme";
        if (condition.includes("rain") || condition.includes("drizzle")) return "rainy-theme";
        return "default-theme";
    };

    const handlersearch = async (e) => {
        e.preventDefault();
        if (!search) return;
        setErro(false);
        try {
            setLoading(true);
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${API_KEY}&units=metric`);
            if (!response.ok) throw new Error("City not found");
            const data = await response.json();
            setResult(data);
        } catch (error) {
            setErro(true);
            setResult(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`app-wrapper ${getThemeClass()}`}>
            <div className="weather-container">
                <h1 className="brand-title">WeatherView</h1>

                <form onSubmit={handlersearch} className="search-form">
                    <input
                        type="text"
                        placeholder="Search city..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit">{loading ? "..." : "Search"}</button>
                </form>

                {erro && <div className="error-msg">Location not found. Please try again.</div>}

                {result && (
                    <div className="result-card">
                        <div className="weather-icon-box">
                            <img
                                src={`https://openweathermap.org/img/wn/${result.weather[0].icon}@2x.png`}
                                alt="weather icon"
                            />
                        </div>
                        <p className="description">{result.weather[0].description}</p>
                        <h2 className="city-name">{result.name}, {result.sys.country}</h2>
                        <div className="temp-display">{Math.round(result.main.temp)}°</div>
                        <div className="stats-row">
                            <span>Humidity: {result.main.humidity}%</span>
                            <span>Wind: {Math.round(result.wind.speed)} m/s</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Weather;