import { useState, useEffect } from "react";
import axios from "axios";
import Filter from "./components/Filter";
import CountryInfo from "./components/CountryInfo";

function App() {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all").then((resp) => {
      if (resp.status === 200) {
        const countries = resp.data.map((country) => {
          return {
            name: country.name?.common,
            capital: (country.capital ?? ["No capital"])[0],
            area: country.area ?? 0,
            population: country.population ?? 0,
            languages: Object.values(country.languages ?? ["Unknown"]),
            flag: country.flags.png,
            capitalLatLng: {
              lat: (country.capitalInfo?.latlng ?? [50.0, 50.0])[0],
              lng: (country.capitalInfo?.latlng ?? [50.0, 50.0])[1],
            },
          };
        });
        setCountries(countries);
      }
    });
  }, []);

  const filtered = countries.filter((c) => {
    const name = c.name.toLowerCase();
    return name.includes(filter.toLowerCase());
  });

  return (
    <div>
      <Filter
        filter={filter}
        setFilter={(details) => setFilter(details.target.value)}
      />
      {filtered.length < 10 ? (
        filtered.map((c) => <CountryInfo key={c.name} country={c} />)
      ) : (
        <p>Too many matches, be more specific</p>
      )}
    </div>
  );
}

export default App;
