const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Invalid arguments.');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fso:${password}@cluster0.pwwazij.mongodb.net/people?retryWrites=true&w=majority`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
});

if (process.argv.length < 5) {
  Person.find({}).then((persons) => {
    console.log('Phonebook:');
    persons.forEach((person) => {
      console.log(person.name, person.numbers);
    });
    mongoose.connection.close();
    process.exit(0);
  });
} else {
  person.save().then((result) => {
    console.log(`added ${result.name} number ${result.numbers} to phonebook`);
    mongoose.connection.close();
    process.exit(0);
  });
}
