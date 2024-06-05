const express = require("express");
const morgan = require("morgan");

morgan.token("data", (req) =>
  req.method === "POST" ? JSON.stringify(req.body) : " ",
);

const app = express();

app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data"),
);

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
    return res.status(400).json({ error: "name missing" });
  }

  if (number === undefined) {
    return res.status(400).json({ error: "number missing" });
  }

  const personExists = persons.find(
    (p) => p.name.trim().toLowerCase() === name.trim().toLowerCase(),
  );
  if (personExists !== undefined) {
    // from https://stackoverflow.com/questions/3290182/which-status-code-should-i-use-for-failed-validations-or-invalid-duplicates
    return res.status(409).json({ error: "person already exists" });
  }

  const newPerson = {
    id: generateId(),
    name,
    number,
  };

  persons = persons.concat(newPerson);

  res.status(201).json(newPerson);
});

const PORT = 3001;
app.listen(PORT, () => {});
