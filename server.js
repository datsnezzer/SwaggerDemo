const express = require("express");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const app = express();
const port = process.env.PORT || 3333;

const swaggerDocument = YAML.load("./swagger.yaml");

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

let users = [{ id: 1, name: "user 1", email: "anson@gmail.com" }];

// Retrieve a list of users
app.get("/users", (req, res) => {
  res.json(users);
});

// Create a new user
app.post("/users", (req, res) => {
  const user = {
    id: users.length + 1,
    ...req.body,
  };
  users.push(user);
  res.status(201).json(user);
});

// Get a user by ID
app.get("/users/:id", (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).send("User not found");
  res.json(user);
});

// Update a user by ID
app.put("/users/:id", (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).send("User not found");

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  res.json(user);
});

// Delete a user by ID
app.delete("/users/:id", (req, res) => {
  users = users.filter((u) => u.id !== parseInt(req.params.id));
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
