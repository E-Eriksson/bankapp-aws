import { useState } from "react";

const BASE_URL =
  "http://ec2-51-20-136-49.eu-north-1.compute.amazonaws.com:5000";

const LOCAL_URL = "http://localhost:5000";

export default function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");

  const fetchBalance = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${LOCAL_URL}/me/accounts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const data = await res.json();
    if (res.ok) setBalance(data.balance);
  };

  const depositMoney = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${LOCAL_URL}/me/accounts/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, amount: parseInt(amount) }),
    });
    const data = await res.json();
    if (res.ok) setBalance(data.balance);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-900">
      <h1 className="text-3xl font-bold mb-4">Ditt Konto</h1>
      <button
        className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 mb-3"
        onClick={fetchBalance}
      >
        Visa Saldo
      </button>
      <p className="text-2xl font-semibold">Saldo: {balance} kr</p>
      <input
        className="border p-3 mt-3 w-80 rounded-lg"
        type="number"
        placeholder="Belopp"
        onChange={(e) => setAmount(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-6 py-3 mt-3 rounded-lg hover:bg-blue-600"
        onClick={depositMoney}
      >
        Sätt in pengar
      </button>
    </div>
  );
}
