const Search = ({ handler, newQuery}) => {
    return (
        <div>
            <p>find countries
            <input value={newQuery} onChange={handler}></input>
            </p>
        </div>
    )
}

export default Search