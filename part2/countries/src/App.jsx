import { useState, useEffect } from 'react'
import axios from 'axios'
import Search from './components/Search'
import Content from './components/Content'

const App = () => {
    // State hooks
    const [data, setData] = useState([])
    const [newQuery, setNewQuery] = useState('')

    // `content` and helper functions
    const queriedData = data.filter(country =>
        country.name.common
            .toLowerCase()
            .includes(newQuery.toLowerCase()))
    const n_results = queriedData.length
    // console.log(`nresults ${n_results}`)
    const overTenContent = () => [["Too many matches. Specify another filter."], false]
    const twoToTenContent = () => [queriedData.map(
      country => {
        return <>{country.name.common} <button onClick={() => {setNewQuery(country.name.common)}}>Show</button></>
      }
    ), false]
    const oneContent = () => {
        return [queriedData, true]
    }
    const [content, findsOneResult] = n_results > 10 ? overTenContent()
        : n_results > 1 ? twoToTenContent()
            : n_results === 1 ? oneContent()
                : [[], false]

    // Event handlers
    const handleNewQuery = (event) => {
        setNewQuery(event.target.value)
    }

    // Fetch
    useEffect(() => {
        axios
            .get('https://studies.cs.helsinki.fi/restcountries/api/all')
            .then(resp => {
                setData(resp.data)
            })
    }, [])

    return (
        <div>
            <Search handler={handleNewQuery} stateValues={newQuery} />
            <Content content={content} oneResult={findsOneResult} />
        </div>
    )
}

export default App