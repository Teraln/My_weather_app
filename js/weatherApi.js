class WeatherApi {
    constructor() {
        this.client_id = '4470b08fc62339f4d5b2b8c5fa5e8386';
    }

    async getWeather(location) {
        const liveWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=${this.client_id}`);

        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&APPID=${this.client_id}`);

        if (!liveWeatherResponse.ok && !forecastResponse.ok) {
            return {
                status: 404
            }
        }

        const liveWeather = await liveWeatherResponse.json();
        const forecastWeather = await forecastResponse.json();
        // const forecastWeather = console.log(await forecastResponse.json());

        return {
            liveWeather,
            forecastWeather
        }
    }
}