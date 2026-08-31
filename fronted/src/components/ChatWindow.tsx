import { useState } from "react"
import Message from "./Message"
import InputBox from "./InputBox"
import { getOrionResponse } from "../utils/orionBrain"

interface ChatMessage {
  sender: "user" | "orion"
  text: string
}

interface Booking {
  service: string
  day: string
  time: string
  customerName: string
}

function ChatWindow() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "orion",
      text: "¡Hola! Soy ORION, asistente de Barbería Central. ¿En qué puedo ayudarte?"
    }
  ])

  const [isThinking, setIsThinking] = useState(false)

  const [bookingStep, setBookingStep] = useState(0)

  const [booking, setBooking] = useState<Booking>({
    service: "",
    day: "",
    time: "",
    customerName: ""
  })

  function handleSend(message: string) {
    const userMessage: ChatMessage = {
      sender: "user",
      text: message
    }

    setMessages((prev) => [...prev, userMessage])
    setIsThinking(true)

    setTimeout(() => {
      let response = ""

      const text = message.toLowerCase().trim()

      // Iniciar una reserva
      if (
        bookingStep === 0 &&
        (
          text.includes("reservar") ||
          text.includes("cita") ||
          text.includes("agendar")
        )
      ) {
        response =
          "¡Claro! ¿Qué servicio deseas reservar? Tenemos Corte clásico, Corte + barba y Barba."

        setBookingStep(1)
      }

      // Guardar servicio
      else if (bookingStep === 1) {
        setBooking((prev) => ({
          ...prev,
          service: message
        }))

        response = "Perfecto. ¿Para qué día deseas reservar?"

        setBookingStep(2)
      }

      // Guardar día
      else if (bookingStep === 2) {
        setBooking((prev) => ({
          ...prev,
          day: message
        }))

        response = "Muy bien. ¿A qué hora deseas la cita?"

        setBookingStep(3)
      }

      // Guardar hora
      else if (bookingStep === 3) {
        setBooking((prev) => ({
          ...prev,
          time: message
        }))

        response = "Perfecto. ¿A nombre de quién hacemos la reserva?"

        setBookingStep(4)
      }

      // Guardar nombre y confirmar
      else if (bookingStep === 4) {
        const completedBooking = {
          ...booking,
          customerName: message
        }

        setBooking(completedBooking)

        response =
          `✅ Cita registrada:\n\n` +
          `Cliente: ${completedBooking.customerName}\n` +
          `Servicio: ${completedBooking.service}\n` +
          `Día: ${completedBooking.day}\n` +
          `Hora: ${completedBooking.time}`

        setBookingStep(0)
      }

      // Conversación normal
      else {
        response = getOrionResponse(message)
      }

      const orionMessage: ChatMessage = {
        sender: "orion",
        text: response
      }

      setMessages((prev) => [...prev, orionMessage])
      setIsThinking(false)
    }, 800)
  }

  return (
    <div className="w-full max-w-2xl bg-gray-900 rounded-2xl shadow-xl p-6">
      <h2 className="text-2xl font-bold text-blue-400">
        🤖 ORION Business
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