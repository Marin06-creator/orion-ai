import Message from "./Message"
import InputBox from "./InputBox"

function ChatWindow() {
  return (
    <div className="w-full max-w-2xl bg-gray-900 rounded-2xl shadow-xl p-6">
      <h2 className="text-2xl font-bold text-blue-400">
        🤖 ORION AI
      </h2>

      <div className="mt-6 h-96 bg-gray-800 rounded-xl p-4">
        <Message
          sender="orion"
          text="Hola Luis, soy ORION. ¿En qué puedo ayudarte?"
        />

        <Message
          sender="user"
          text="Quiero construir una inteligencia artificial."
        />
      </div>

      <InputBox />
    </div>
  )
}

export default ChatWindow