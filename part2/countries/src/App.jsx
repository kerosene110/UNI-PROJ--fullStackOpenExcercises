import { useState, useEffect } from 'react'
import axios from 'axios'
import Search from './components/Search'
import Content from './components/Content'

const api_key = import.meta.env.VITE_WEATHER_API_KEY

const App = () => {
    // State hooks
    const [data, setData] = useState([])
    const [newQuery, setNewQuery] = useState('')
    const [weather, setWeather] = useState(null)

    // `content` and helper functions
    const queriedData = data.filter(country =>
        country.name.common
            .toLowerCase()
            .includes(newQuery.toLowerCase()))
    const n_results = queriedData.length

    const overTenContent = () => [[["info", "Too many matches. Specify another filter."]], false]
    const twoToTenContent = () => [
        queriedData.map(
            country => {
                return [
                    country.name.official,
                    <>{country.name.common} <button onClick={() => { setNewQuery(country.name.common) }}>Show</button></>
                ]
            }
        ), false]
    const oneContent = () => {
        return [queriedData, true]
    }
    const [content, findsOneResult] = newQuery.trim() === '' ? [[], false]
        : n_results > 10 ? overTenContent()
        : n_results > 1 ? twoToTenContent()
            : n_results === 1 ? oneContent()
                : [[], false]
    const capital = findsOneResult ? queriedData[0].capital[0] : null

    // Event handlers
    const handleNewQuery = (event) => {
        setNewQuery(event.target.value)
    }

    // Fetch country info
    useEffect(() => {
        axios
            .get('https://studies.cs.helsinki.fi/restcountries/api/all')
            .then(resp => {
                setData(resp.data)
            })
    }, [])

    // Fetch weather
    useEffect(() => {
        if (!capital) {
            return
        }

        axios
            .get('https://api.openweathermap.org/data/2.5/weather', {
                params: { q: capital, appid: api_key, units: 'metric' }
            })
            .then(resp => setWeather(resp.data))
    }, [capital])

    return (
        <div>
            <Search handler={handleNewQuery} newQuery={newQuery} />
            <Content content={content} weather={weather} oneResult={findsOneResult} />
        </div>
    )
}

export default App