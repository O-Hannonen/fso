const Person = ({ name, number, onDelete }) => (
  <div>
    {name} {number}
    <button onClick={onDelete}>Delete</button>
  </div>
);

const Persons = ({ persons, onDelete }) => (
  <>
    {persons.map((person) => (
      <Person
        key={person.name}
        name={person.name}
        number={person.number}
        onDelete={() => onDelete(person.id)}
      />
    ))}
  </>
);

export default Persons;
