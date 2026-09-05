const Content = ({content, oneResult}) => {
    return oneResult 
        ? (
            <div>
                <h2>{content[0].name.common}</h2>
                <p>capital {content[0].capital[0]}</p>
                <p>area {content[0].area}</p>
                <h3>languages:</h3>
                <ul>
                    {Object.values(content[0].languages).map(lang => <li key={lang}>{lang}</li>)}
                </ul>
                <img src={content[0].flags.png} alt=""></img>
            </div>
        )
        : <div>{content.map(str => <p key={str}>{str}</p>)}</div>

}

export default Content