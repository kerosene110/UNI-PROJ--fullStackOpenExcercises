import { useState, useEffect } from 'react'
import noteService from './services/notes'

const Filter = ({personsToShow, handleFilterChange}) => {
  return (
    <div>
      filter shown with <input value={personsToShow} onChange={handleFilterChange}/>
    </div>
  )
}

const PersonForm = ({ handleFormSubmit, newName, handleNameChange, newNum, handleNumChange }) => {
  return (<form onSubmit={handleFormSubmit}>
    <div>
      name: <input value={newName} onChange={handleNameChange} />
    </div>
    <div>
      number: <input value={newNum} onChange={handleNumChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>)
}

const Persons = ({ persons, personsToShow }) => {
  const matchedPersons = persons.filter(person => person.name.toLowerCase().includes(personsToShow.toLowerCase()))
  return matchedPersons.map(person => <p key={person.name}>{person.name} {person.number}</p>)
}

const App = () => {
  const [persons, setPersons] = useState([])
  const loadPersonsHook = () => {
    noteService.getAll()
      .then(data => {
        setPersons(data)
      })
  }
  useEffect(loadPersonsHook, [])

  const [newName, setNewName] = useState('')
  const [newNum, setNewNum] = useState('')
  const [personsToShow, setPersonsToShow] = useState('')

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumChange = (event) => {
    setNewNum(event.target.value)
  }

  const handleFilterChange = (event) => {
    setPersonsToShow(event.target.value)
  }

  const handleFormSubmit = (event) => {
    event.preventDefault()
    if (persons.map(p => p.name).indexOf(newName) !== -1) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const personObject = {
      name: newName,
      number: newNum,
      id: persons.length + 1
    }
    
    noteService.create(personObject).then(returnedObj => {
      setPersons(persons.concat(returnedObj))
    })

    setNewName('')
    setNewNum('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter personsToShow={personsToShow} handleFilterChange={handleFilterChange}/>

      <h3>Add a new</h3>
      <PersonForm handleFormSubmit={handleFormSubmit} newName={newName} handleNameChange={handleNameChange} newNum={newNum} handleNumChange={handleNumChange} />

      <h3>Numbers</h3>
      <Persons persons={persons} personsToShow={personsToShow}/>

    </div>
  )
}

export default App