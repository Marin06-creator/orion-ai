function ChatWindow() {
  return (
    <div className="w-full max-w-2xl bg-gray-900 rounded-2xl shadow-xl p-6">
      <h2 className="text-2xl font-bold text-blue-400">
        🤖 ORION AI
      </h2>

      <div className="mt-6 h-96 bg-gray-800 rounded-xl p-4">
        <p className="text-gray-300">
          Hola Luis, soy ORION.
        </p>

        <p className="text-gray-400 mt-2">
          ¿En qué puedo ayudarte?
        </p>
      </div>
    </div>
  )
}

export default ChatWindow