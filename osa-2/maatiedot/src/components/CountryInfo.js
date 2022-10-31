import { useState, useEffect } from "react";
import axios from "axios";

const WeatherInfo = ({ country, weather }) => {
  if (weather === undefined) {
    return <p>Loading weather...</p>;
  }

  return (
    <>
      <h1>Weather in {country.capital}</h1>
      <p>Temperature is {weather.temperature} °C</p>
      <img src={weather.icon} alt="weather" />
      <p>Wind {weather.wind} m/s</p>
    </>
  );
};

const ExpandedInfo = ({ country, weather }) => (
  <>
    <p>Capital: {country.capital}</p>
    <p>Area: {country.area}</p>
    <p>
      <strong>Languages:</strong>
    </p>
    <ul>
      {country.languages.map((lang) => (
        <li key={lang}>{lang}</li>
      ))}
    </ul>
    <img src={country.flag} alt="flag" />
    <WeatherInfo weather={weather} country={country} />
  </>
);

const CountryInfo = ({ country }) => {
  const [expanded, setExpanded] = useState(false);
  const [weather, setWeather] = useState(undefined);

  useEffect(() => {
    if (!expanded) {
      return;
    }
    const weatherApiKey = process.env.REACT_APP_API_KEY;
    const lat = country.capitalLatLng.lat;
    const lng = country.capitalLatLng.lng;

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${weatherApiKey}&units=metric`
      )
      .then(({ data }) => {
        setWeather({
          temperature: data.main.temp,
          wind: data.wind.speed,
          icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        });
      });
  }, [expanded, country]);

  return (
    <div>
      <div>
        {country.name}
        <button onClick={() => setExpanded(!expanded)}>
          {expanded ? "hide" : "show"}
        </button>
      </div>
      {expanded ? <ExpandedInfo country={country} weather={weather} /> : null}
    </div>
  );
};

export default CountryInfo;
