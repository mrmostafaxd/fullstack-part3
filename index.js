const express = require("express");
const app = express();

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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
