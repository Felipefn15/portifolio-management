export const dynamic = "force-dynamic"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">CareMinds Portfolio Manager</h1>
      <p className="text-lg mb-8">Please log in to manage your investment portfolios</p>
      <div className="flex gap-4">
        <a href="/login" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Login
        </a>
        <a href="/signup" className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
          Sign Up
        </a>
      </div>
    </div>
  )
}
