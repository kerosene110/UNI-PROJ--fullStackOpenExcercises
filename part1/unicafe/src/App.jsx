import { useState } from 'react'

const Header = (props) => <h1>{props.text}</h1>
const Button = (props) => <button onClick={props.onClick}>{props.text}</button>
const StatisticLine = (props) => <p>{props.text} {props.value}</p>
const Statistics = (props) => {
  const sum = props.good + props.neutral + props.bad
  if (sum === 0) {
    return <p>No feedback given</p>
  }

  return (
    <div>
      <StatisticLine text="good" value={props.good} />
      <StatisticLine text="neutral" value={props.neutral} />
      <StatisticLine text="bad" value={props.bad} />
      <p>all {sum}</p>
      <p>average {sum/3}</p>
      <p>positive {props.good/sum*100} %</p>
    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <Header text="give feedback" />
      <div>
        <Button onClick={() => setGood(good + 1)} text="good"></Button>
        <Button onClick={() => setNeutral(neutral + 1)} text="neutral"></Button>
        <Button onClick={() => setBad(bad + 1)} text="bad"></Button>
      </div>
      <Header text="statistics" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App