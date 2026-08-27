import { useState } from "react"

interface InputBoxProps {
  onSend: (message: string) => void
}

function InputBox({ onSend }: InputBoxProps) {
  const [message, setMessage] = useState("")

  function handleSend() {
    if (message.trim() === "") return

    onSend(message)
    setMessage("")
  }

  return (
    <div className="mt-4 flex gap-3">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
           handleSend()
        } 
      }}
        placeholder="Escribe un mensaje..."
        className="flex-1 bg-gray-700 text-white rounded-xl px-4 py-3 outline-none"
      />

      <button
        onClick={handleSend}
        className="bg-blue-500 px-5 rounded-xl text-white hover:bg-blue-600"
      >
        Enviar
      </button>
    </div>
  )
}

export default InputBox