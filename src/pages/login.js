import { useState } from "react";
import { useRouter } from "next/navigation";

const BASE_URL =
  "http://ec2-51-20-136-49.eu-north-1.compute.amazonaws.com:5000";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const res = await fetch(`${BASE_URL}/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-900">
      <h1 className="text-3xl font-bold mb-4">Logga In</h1>
      <input
        className="border p-3 mb-3 w-80 rounded-lg"
        placeholder="Användarnamn"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="border p-3 mb-3 w-80 rounded-lg"
        type="password"
        placeholder="Lösenord"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
        onClick={handleLogin}
      >
        Logga In
      </button>
    </div>
  );
}
