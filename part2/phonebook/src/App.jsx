import { useState, useEffect } from 'react'
import noteService from './services/notes'

const Filter = ({ personsToShow, handleFilterChange }) => {
  return (
    <div>
      filter shown with <input value={personsToShow} onChange={handleFilterChange} />
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

const Persons = ({ persons, personsToShow, setPersons }) => {
  let matchedPersons = persons.filter(person =>
    person.name.toLowerCase().includes(personsToShow.toLowerCase())
  )
  const handleDelete = (name, id) => {
    if (window.confirm(`Delete ${name}?`)) {
      noteService.deletePerson(id)
      setPersons(matchedPersons.filter(person => person.id !== id))
    }
  }
  return matchedPersons.map(person =>
    <p key={person.name}>{person.name} {person.number} <button onClick={() => handleDelete(person.name, person.id)}>delete</button></p>
  )
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
      if (window.confirm(`${newName} is already added to phonebook. Replace the old number with a new one?`)) {
        const personObject = { ...persons.find(p => p.name === newName), number: newNum }
        noteService.update(personObject.id, personObject).then(returnedObj => {
          setPersons(persons.map(p => p.id !== personObject.id ? p : returnedObj))
        })
      }
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
      <Filter personsToShow={personsToShow} handleFilterChange={handleFilterChange} />

      <h3>Add a new</h3>
      <PersonForm handleFormSubmit={handleFormSubmit} newName={newName} handleNameChange={handleNameChange} newNum={newNum} handleNumChange={handleNumChange} />

      <h3>Numbers</h3>
      <Persons persons={persons} personsToShow={personsToShow} setPersons={setPersons} />

    </div>
  )
}

export default App