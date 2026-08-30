const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  const Header = (props) => <h1>{props.course}</h1>
  const Content = (obj) => {
    return (
      <div>
        <p>{obj.parts[0].name} {obj.parts[0].exercises}</p>
        <p>{obj.parts[1].name} {obj.parts[1].exercises}</p>
        <p>{obj.parts[2].name} {obj.parts[2].exercises}</p>
      </div>
    )
  }

  const Total = (obj) => {
    const parts = obj.parts
    return (
      <p>Number of exercises {parts[0].exercises + parts[1].exercises + parts[2].exercises}</p>
    )
  }

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default App