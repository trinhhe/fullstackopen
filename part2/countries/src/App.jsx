import { useState, useEffect } from 'react'
import axios from 'axios'

const Country = ({country, api_key}) => {
    return (
        <div>
            <h2>{country.name.common}</h2>
            <p>Capital {country.capital}</p>
            <p>Area {country.area}</p>
            <h3>Languages:</h3>
            <ul>
                {Object.values(country.languages).map((language) => 
                    <li key={language}>{language}</li>    
                )}
            </ul>
            <img src={country.flags.png} alt={`flag of ${country.name.common}`} />
            <h3>Weather in {country.capital}</h3>
            <Weather capital={country.capital} api_key={api_key} />
        </div>
    )
}

const Weather = ({capital, api_key}) => {
    const [weather, setWeather] = useState(null)
    
    useEffect(() => {
        if (!api_key) {
            console.error('Missing OpenWeather API key (VITE_API_KEY).')
            return
        }

        const city = Array.isArray(capital) ? capital[0] : capital
        if (!city) {
            console.error('No capital available for country, skipping weather fetch.')
            return
        }

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${api_key}&units=metric`
        axios.get(url)
            .then(response => {
                setWeather(response.data)
            })
            .catch(error => {
                console.error('Weather fetch failed:', error)
            })
    }, [capital, api_key])

    if (!weather) {
        return <div>Loading weather...</div>
    }

    return (
        <div>
            <p>Temperature: {weather.main.temp} °C</p>
            <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} alt="Weather icon" />  
        </div>
    )
}

const App = ({api_key}) => {
  const [searchCountry, setSearchCountry] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    axios
    .get('https://studies.cs.helsinki.fi/restcountries/api/all')
    .then(response => {
        setCountries(response.data)
    })
  }, [])

  const handleSearchChange = (event) => {
    setSearchCountry(event.target.value)    
}

  const filtered_countries = countries.filter(country => country.name.common.toLowerCase().includes(searchCountry.toLowerCase()))
  
  if (filtered_countries.length > 10) {
    return (
        <div>
            find countries <input value={searchCountry} onChange={handleSearchChange} />
            <p>Too many matches, specify another filter</p>
        </div>
    )
  } else if (filtered_countries.length === 1) {
    return (
        <div>
            find countries <input value={searchCountry} onChange={handleSearchChange} />
            <Country country={filtered_countries[0]} api_key={api_key}/>
        </div>
    )
  } else {
    return (
        <div>
            find countries <input value={searchCountry} onChange={handleSearchChange} />
            <ul>
                {filtered_countries.map((country) => 
                    <li key={country.cca3}>{country.name.common} <button onClick={() => setSearchCountry(country.name.common)}>show</button></li>    
                )}
            </ul>
        </div>
    )
  }
}

export default App