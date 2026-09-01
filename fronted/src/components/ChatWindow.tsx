import { useState } from "react"
import Message from "./Message"
import InputBox from "./InputBox"
import { getOrionResponse } from "../utils/orionBrain"
import { supabase } from "../lib/supabase"

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
const allTimes: string[] = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00"
]

function getAvailableTimes(bookedTimes: string[]): string[] {
  return allTimes.filter(
    (time: string) => !bookedTimes.includes(time)
  )
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

    setTimeout(async () => {
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
  const parts = message.split("/")

  if (parts.length !== 3) {
    response = "Por favor escribe la fecha en formato DD/MM/AAAA. Ejemplo: 03/09/2026."
  } else {
    const [day, month, year] = parts

    const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`

    setBooking((prev) => ({
      ...prev,
      day: formattedDate
    }))

    response = "Muy bien. ¿A qué hora deseas la cita? Usa formato 24 horas. Ejemplo: 15:00."

    setBookingStep(3)
  }
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
     // Guardar nombre y confirmar
else if (bookingStep === 4) {
  const completedBooking = {
    ...booking,
    customerName: message
  }

  setBooking(completedBooking)

  const { error } = await supabase
    .from("bookings")
    .insert([
      {
        customer_name: completedBooking.customerName,
        service: completedBooking.service,
        booking_date: completedBooking.day,
        booking_time: completedBooking.time,
        status: "pending"
      }
    ])

  if (error) {
    if (error.code === "23505") {
      const bookedTimes: string[] = ["15:00", "17:00"]

      const availableTimes = getAvailableTimes(bookedTimes)

      response =
        `❌ La hora ${completedBooking.time} ya está reservada.\n\n` +
        `Horarios disponibles:\n` +
        availableTimes.map((time) => `• ${time}`).join("\n") +
        `\n\nEscribe la hora que prefieras.`

      setBookingStep(3)
    } else {
      console.error("Error guardando reserva:", error)

      response =
        "Hubo un problema al guardar la cita. Inténtalo nuevamente."

      setBookingStep(0)
    }
  } else {
    response =
      `✅ Cita registrada:\n\n` +
      `Cliente: ${completedBooking.customerName}\n` +
      `Servicio: ${completedBooking.service}\n` +
      `Fecha: ${completedBooking.day}\n` +
      `Hora: ${completedBooking.time}`

    setBookingStep(0)
  }
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