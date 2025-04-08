import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <h1 className="text-4xl font-bold mb-6">Välkommen till Banken</h1>
      <div className="mt-4 flex gap-4">
        <button
          className="bg-white text-blue-600 px-6 py-3 rounded-lg shadow-lg hover:bg-gray-200"
          onClick={() => router.push("/register")}
        >
          Skapa Användare
        </button>
        <button
          className="bg-white text-green-600 px-6 py-3 rounded-lg shadow-lg hover:bg-gray-200"
          onClick={() => router.push("/login")}
        >
          Logga In
        </button>
      </div>
    </div>
  );
}
