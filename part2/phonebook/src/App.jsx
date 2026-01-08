import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'
import Notification  from './components/notification'

const Person = ({person, onDelete}) => {
  return <li>{person.name} {person.number} <button onClick={onDelete}>delete</button></li>
}

const Filter = ({searchName, handleSearchChange}) => {
    return (
        <div>
            filter shown with <input value={searchName} onChange={handleSearchChange}/>
        </div>
    )
}

const PersonForm = ({addPerson, newName, handleNameChange, newNumber, handleNumberChange}) => {
    return (
        <form onSubmit={addPerson}>
            <div>name: <input value={newName} onChange={handleNameChange}/></div>
            <div>number: <input value={newNumber} onChange={handleNumberChange}/></div>
            <div><button type="submit">add</button></div>
        </form>
    )
}

const Persons = ({persons, searchName, handleDelete}) => {
    return (
        <>
            {persons
                .filter(person => person.name.toLowerCase().includes(searchName.toLowerCase()))
                .map((person) => 
          <Person key={person.id} person={person} onDelete={() => handleDelete(person.id)} />
                )
            }
        </>
    )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchName, setSearchName] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    personService.getAll().then(initialPersons => {
        setPersons(initialPersons)
    })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name === newName)) {
      if (!window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        return
      } else {
        const person = persons.find(p => p.name === newName)
        const updatedPerson = {...person, number: newNumber}
        personService.update(person.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson))
            setNewName('')
            setNewNumber('')
            setIsError(false)
            setNotificationMessage(`${returnedPerson.name}'s number changed`)
            setTimeout(() => {setNotificationMessage(null)}, 4000)
          })
          .catch(() => {
            setIsError(true)
            setNotificationMessage(`Information of ${newName} has already been removed from server`)
            // alert(`Information of ${newName} has already been removed from server`)
            setPersons(persons.filter(p => p.id !== person.id))
          })
      }
    } else {
        const personObject = {
            name: newName,
            number: newNumber
        }
        personService.create(personObject).then(returnedPerson => { 
            setPersons(persons.concat(returnedPerson))
            setNewName('')
            setNewNumber('')
            setIsError(false)
            setNotificationMessage(`Added ${returnedPerson.name}`)
            setTimeout(() => {setNotificationMessage(null)}, 4000)
        })
    }
  }

  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id)
    if (!person) return
    if (!window.confirm(`Delete ${person.name} ?`)) return

    personService.deleteID(id)
      .then(() => {
        setPersons(persons.filter(p => p.id !== id))
      })
      .catch(() => {
        setIsError(true)
        setNotificationMessage(`Information of ${person.name} has already been removed from server`)
        // alert(`Information of ${person.name} has already been removed from server`)
        setPersons(persons.filter(p => p.id !== id))
      })
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setSearchName(event.target.value)
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={notificationMessage} isError={isError} />
      <Filter searchName={searchName} handleSearchChange={handleSearchChange} />
      <h3>Add a new</h3>
      <PersonForm 
        addPerson={addPerson} 
        newName={newName} 
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons persons={persons} searchName={searchName} handleDelete={deletePerson} />
      {/* <div>debug: {newName}</div> */}
    </div>
  )
}

export default App