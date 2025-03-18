import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Arrayer för användare, konton och sessioner
const users = [];
const accounts = [];
const sessions = [];

// Skapa användare
app.post("/users", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Användarnamn och lösenord krävs" });
  }

  const id = users.length + 101;
  users.push({ id, username, password });
  accounts.push({ id: accounts.length + 1, userId: id, amount: 0 });

  res.status(201).json({ message: "Användare skapad", userId: id });
});

// Logga in
app.post("/sessions", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Fel användarnamn eller lösenord" });
  }

  const token = Math.random().toString(36).substring(2);
  sessions.push({ userId: user.id, token });
  res.json({ token });
});

// Hämta saldo
app.post("/me/accounts", (req, res) => {
  const { token } = req.body;
  const session = sessions.find((s) => s.token === token);

  if (!session) {
    return res.status(403).json({ message: "Ogiltigt token" });
  }

  const account = accounts.find((a) => a.userId === session.userId);
  res.json({ balance: account.amount });
});

// Sätt in pengar
app.post("/me/accounts/transactions", (req, res) => {
  const { token, amount } = req.body;
  const session = sessions.find((s) => s.token === token);

  if (!session) {
    return res.status(403).json({ message: "Ogiltigt token" });
  }

  const account = accounts.find((a) => a.userId === session.userId);
  account.amount += amount;
  res.json({ balance: account.amount });
});

app.listen(PORT, () => {
  console.log(`Servern kör på port ${PORT}`);
});
