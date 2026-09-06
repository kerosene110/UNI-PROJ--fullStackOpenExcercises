const Content = ({content, weather, oneResult}) => {
    return oneResult 
        ? (
            <div>
                <h2>{content[0].name.common}</h2>
                <p>Capital {content[0].capital[0]}</p>
                <p>Area {content[0].area}</p>
                <h3>Languages:</h3>
                <ul>
                    {Object.values(content[0].languages).map(lang => <li key={lang}>{lang}</li>)}
                </ul>
                <img src={content[0].flags.png} alt=""></img>

                <h3>Weather in {content[0].capital[0]}</h3>
                {weather && (
                    <>
                        <p>Temperature {weather.main.temp} Celsius</p>
                        <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description}></img>
                        <p>Wind {weather.wind.speed} m/s</p>
                    </>
                )}
            </div>
        )
        : content.length === 0 ? null
        : <div>{content.map(array => <p key={array[0]}>{array[1]}</p>)}</div> 
}

export default Content