import { useEffect, useState } from "react";
import Filter from "./components/Filter";
import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";
import phonebookService from "./services/phonebook";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    phonebookService
      .getAllEntries()
      .then((data) => setPersons(data))
      .catch((e) => console.log(e));
  }, []);

  const handlePersonFormSubmit = (event) => {
    event.preventDefault();

    const existing = persons.find((p) => p.name === newName);
    if (existing != null) {
      const confirmation = `${existing.name} is already in phonebook. Do you want to replace the old number with the new one?`;
      if (!window.confirm(confirmation)) {
        return;
      }
      updatePerson(existing.id, { ...existing, number: newNumber }).catch(
        (e) => {
          showNotification(
            `Information of ${existing.name} has already been removed from server`,
            true
          );
          return console.log(e);
        }
      );
    } else {
      addPerson({
        name: newName,
        number: newNumber,
      }).catch((e) => {
        showNotification(e.response.data.error, true);
        return console.log(e);
      });
    }

    setNewName("");
    setNewNumber("");
  };

  const showNotification = (message, isError = false) => {
    setNotification({ message, isError });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const updatePerson = (id, person) =>
    phonebookService.editEntry(id, person).then((newPerson) => {
      console.log(newPerson);
      setPersons(persons.map((p) => (p.id === newPerson.id ? newPerson : p)));
      showNotification(`Updated ${newPerson.name}`);
    });

  const addPerson = (person) =>
    phonebookService.createEntry(person).then((newPerson) => {
      setPersons(persons.concat(newPerson));
      showNotification(`Added ${newPerson.name}`);
    });

  const deletePerson = (id) => {
    const person = persons.find((p) => p.id === id);
    if (window.confirm(`Delete ${person.name}?`)) {
      phonebookService
        .deleteEntry(id)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== id));
          showNotification(`Deleted ${person.name}`);
        })
        .catch((e) => {
          setPersons(persons.filter((p) => p.id !== id));
          return console.log(e);
        });
    }
  };

  const filtered = persons.filter((p) =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  );
  return (
    <div>
      <h2>Phonebook</h2>
      <Filter setFilter={setFilter} filter={filter} />
      <h2>Add new</h2>
      <PersonForm
        onSubmit={handlePersonFormSubmit}
        newName={newName}
        newNumber={newNumber}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
      />
      <h2>Numbers</h2>
      <Persons persons={filtered} onDelete={deletePerson} />
      <Notification message={notification} />
    </div>
  );
};

export default App;
