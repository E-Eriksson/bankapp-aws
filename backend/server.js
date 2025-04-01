import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mysql from "mysql2/promise";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// database

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "bank",
  waitForConnections: true,
  port: 3306,
});

app.post("/users", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Användarnamn och lösenord krävs" });
  }

  try {
    const [result] = await db.execute(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, password]
    );
    const userId = result.insertId;
    await db.execute("INSERT INTO accounts (user_id, amount) VALUES (?, 0)", [
      userId,
    ]);

    res.status(201).json({ message: "Användare skapad", userId });
  } catch (error) {
    res.status(500).json({ message: "Fel vid skapande av användare", error });
  }
});

// Login - Remove old tokens before inserting a new one
app.post("/sessions", async (req, res) => {
  const { username, password } = req.body;

  const [users] = await db.execute(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password]
  );

  if (users.length === 0) {
    return res.status(401).json({ message: "Fel användarnamn eller lösenord" });
  }

  const user = users[0];

  await db.execute("DELETE FROM sessions WHERE user_id = ?", [user.id]);

  const token = Math.random().toString(36).substring(2);
  await db.execute("INSERT INTO sessions (user_id, token) VALUES (?, ?)", [
    user.id,
    token,
  ]);

  res.json({ token });
});

// Get balance
app.post("/me/accounts", async (req, res) => {
  const { token } = req.body;
  const [sessions] = await db.execute(
    "SELECT * FROM sessions WHERE token = ?",
    [token]
  );

  if (sessions.length === 0) {
    return res.status(403).json({ message: "Ogiltigt token" });
  }

  const session = sessions[0];
  const [accounts] = await db.execute(
    "SELECT amount FROM accounts WHERE user_id = ?",
    [session.user_id]
  );

  if (accounts.length === 0) {
    return res.status(404).json({ message: "Konto hittades inte" });
  }

  res.json({ balance: accounts[0].amount });
});

// Deposit money
app.post("/me/accounts/transactions", async (req, res) => {
  const { token, amount } = req.body;
  const [sessions] = await db.execute(
    "SELECT * FROM sessions WHERE token = ?",
    [token]
  );

  if (sessions.length === 0) {
    return res.status(403).json({ message: "Ogiltigt token" });
  }

  const session = sessions[0];
  await db.execute(
    "UPDATE accounts SET amount = amount + ? WHERE user_id = ?",
    [amount, session.user_id]
  );

  const [updatedAccount] = await db.execute(
    "SELECT amount FROM accounts WHERE user_id = ?",
    [session.user_id]
  );
  res.json({ balance: updatedAccount[0].amount });
});

app.listen(PORT, () => {
  console.log(`Servern kör på port ${PORT}`);
});
