const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const app = express();
const Person = require('./models/Person');

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then((persons) => {
      console.log('Persons', persons);

      if (persons) {
        res.json(persons);
      } else {
        res.status(404).end();
      }
    })
    .catch((e) => next(e));
});

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;

  Person.findById(id)
    .then((person) => {
      console.log('person', person);
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((e) => next(e));
});

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  Person.findByIdAndRemove(id)
    .then(() => {
      res.status(204).end();
    })
    .catch((e) => next(e));
});

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;

  Person.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((person) => {
      console.log('person', person);
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((e) => next(e));
});

app.post('/api/persons', (req, res, next) => {
  const name = req.body.name;
  const number = req.body.number;
  if (!name || !number) {
    return res.status(400).json({
      error: 'name or number missing',
    });
  }

  const person = new Person({
    name: name,
    number: number,
  });
  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((e) => next(e));
});

app.get('/api/info', (req, res, next) => {
  Person.find({})
    .then((persons) => {
      console.log('Persons', persons);

      if (persons) {
        res.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>`);
      } else {
        res.status(404).end();
      }
    })
    .catch((e) => next(e));
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

// tämä tulee kaikkien muiden middlewarejen rekisteröinnin jälkeen!
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
