const Header = ({ course }) => <h2>{course}</h2>

const Part = ({ part, _ }) => <p> {part.name} {part.exercises} </p>
const Content = ({ parts }) => {
    return (
        <div>
            {parts.map(part => <Part part={part} key={part.id} />)}
        </div>
    )
}

const Total = ({ parts }) =>
    <p>
        <b>
            total of {parts.reduce((prevSum, part) => prevSum + part.exercises, 0)} exercises
        </b>
    </p>

const Course = ({ course }) => {


    return (
        <div>
            <Header course={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </div>
    )
}

export default Course