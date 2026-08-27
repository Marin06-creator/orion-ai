import { useState } from "react"
import Message from "./Message"
import InputBox from "./InputBox"
import { getOrionResponse } from "../utils/orionBrain"

interface ChatMessage {
  sender: "user" | "orion"
  text: string
}

function ChatWindow() {
  const [messages, setMessages] = useState<ChatMessage[]>([
  
    {
      sender: "orion",
      text: "Hola Luis, soy ORION. ¿En qué puedo ayudarte?"
    }
  ])
 const [isThinking, setIsThinking] = useState(false)

function handleSend(message: string) {
  const userMessage: ChatMessage = {
    sender: "user",
    text: message
  }

  setMessages((prev) => [...prev, userMessage])
  setIsThinking(true)
  setTimeout(() => {
    const orionMessage: ChatMessage = {
      sender: "orion",
      text: getOrionResponse(message)
}

    setMessages((prev) => [...prev, orionMessage])
    setIsThinking(false)
  }, 800)
}
  return (
    <div className="w-full max-w-2xl bg-gray-900 rounded-2xl shadow-xl p-6">
      <h2 className="text-2xl font-bold text-blue-400">
        🤖 ORION AI
      </h2>

      <div className="mt-6 h-96 bg-gray-800 rounded-xl p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <Message
            key={index}
            sender={message.sender}
            text={message.text}
          />
        ))}

         {isThinking && (
    <div className="text-gray-400 mt-2">
      ORION está pensando...
    </div>
  )}
      </div>

      <InputBox onSend={handleSend} />
    </div>
  )
}

export default ChatWindow