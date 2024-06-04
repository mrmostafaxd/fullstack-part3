const express = require("express");
const app = express();

const persons = [
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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
