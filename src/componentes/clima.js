import React, { useState, useEffect } from 'react';
import './../css/WeatherComponent.css';

const WeatherComponent = () => {
  const apiKey = "a97ec74027c33b3e9ede1606d4b22300";
  const apiCountryURL = "https://countryflagsapi.com/png/";
  const defaultCity = "Palmas";
  const defaultCountry = "BR";

  const [city, setCity] = useState(defaultCity);
  const [weatherData, setWeatherData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getWeatherData = async (city) => {
    setIsLoading(true);
    try {
      const apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`;
      const res = await fetch(apiWeatherURL);
      const data = await res.json();
      setIsLoading(false);
      return data;
    } catch (error) {
      setIsLoading(false);
      setErrorMessage('Erro ao buscar dados climáticos.');
      return null;
    }
  };

  const showWeatherData = async (city) => {
    const data = await getWeatherData(city);
    if (data && data.cod !== "404") {
      setWeatherData(data);
      setErrorMessage('');
    } else {
      setWeatherData(null);
      setErrorMessage('Cidade não encontrada.');
    }
  };

  useEffect(() => {
    showWeatherData(city);
  }, [city]);


  const handleSearch = () => {
    showWeatherData(city);
  };

  return (
    <div className="weather-component-container">
      {isLoading && <div id="loader">Loading...</div>}

      {errorMessage && <div id="error-message">{errorMessage}</div>}

      {weatherData && (
        <div id="weather-data">
          <h2 id="city">{weatherData.name}</h2>
          <p id="temperature"><span>{parseInt(weatherData.main.temp)}</span></p>
          <p id="description">{weatherData.weather[0].description}</p>
          <img
            id="weather-icon"
            src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
            alt="Weather Icon"
          />

          <p id="umidity"><span>{`${weatherData.main.humidity}%`}</span></p>
          <p id="wind"><span>{`${weatherData.wind.speed}km/h`}</span></p>
        </div>
      )}
    </div>
  );
};

export default WeatherComponent;