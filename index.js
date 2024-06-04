const express = require("express");

const app = express();
app.use(express.json());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/info", (req, res) => {
  const phoneInfo = `Phonebook has info for ${persons.length} people`;

  const date = new Date();
  const timeInfo = `${date.toDateString()} ${date.toTimeString()}`;

  res.send(`<p>${phoneInfo}</p> <p>${timeInfo}</p>`);
});

app.get("/api/persons", (req, res) => {
  console.log(`GET request sent to retrieve all persons`);
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = +req.params.id;
  const person = persons.find((p) => p.id === id);

  if (!person) {
    res.status(404).json({ error: "not found" });
    // res.status(404).end();
  } else {
    res.json(person);
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = +req.params.id;

  const oldLength = persons.length;
  persons = persons.filter((p) => p.id !== id);

  if (oldLength === persons.length) {
    res.status(404).json({ error: "not found" });
  } else {
    console.log(`Removed person with id=${id}`);
    res.status(204).end();
  }
});

// inspired from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function generateId() {
  min = 100;
  max = 10000;
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);

  // ensure that the id is unique
  let randomId = 1;
  do {
    randomId = Math.floor(
      Math.random() * (maxFloored - minCeiled + 1) + minCeiled,
    );
  } while (persons.find((p) => p.id === randomId) !== undefined);

  return randomId;
}

app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;

  if (name === undefined) {
    console.error(`cannot add person: name missing`);
    return res.status(400).json({ error: "name missing" });
  }

  if (number === undefined) {
    console.error(`cannot add person: number missing`);
    return res.status(400).json({ error: "number missing" });
  }

  const personExists = persons.find(
    (p) => p.name.trim().toLowerCase() === name.trim().toLowerCase(),
  );
  if (personExists !== undefined) {
    console.error(
      `cannot add person: person with the same name already exists`,
    );
    // from https://stackoverflow.com/questions/3290182/which-status-code-should-i-use-for-failed-validations-or-invalid-duplicates
    return res.status(409).json({ error: "person already exists" });
  }

  const newPerson = {
    id: generateId(),
    name,
    number,
  };

  persons = persons.concat(newPerson);
  console.log(`"${name}" added to the persons database`);

  res.status(201).json(newPerson);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
