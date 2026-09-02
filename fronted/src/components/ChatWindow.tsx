import { useState } from "react"
import Message from "./Message"
import InputBox from "./InputBox"
import { getOrionResponse } from "../utils/orionBrain"
import {
  createBooking,
  getBookedTimes
} from "../services/bookingService"
import {
  isValidTimeFormat,
  isWithinBusinessHours,
  isValidBookingDate
} from "../utils/bookingvalidation"
import  QuickOptions from "./QuickOptions"




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

function ChatWindow() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "orion",
      text: "¡Hola! Soy ORION, asistente de Barbería Central. ¿En qué puedo ayudarte?"
    }
  ])
  const [availableTimes, setAvailableTimes] = useState<string[]>([])

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
          text.includes("agendar") ||
          text.includes("hacer")
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
  if (!isValidBookingDate(message)) {
    response =
      "⚠️ Esa fecha no es válida. Usa formato DD/MM/AAAA y elige una fecha de hoy en adelante. Ejemplo: 05/09/2026."
  } else {
    const [day, month, year] = message.split("/")

    const formattedDate =
      `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`

    setBooking((prev) => ({
      ...prev,
      day: formattedDate
    }))

    response =
      "Muy bien. ¿A qué hora deseas la cita? Usa formato 24 horas. Ejemplo: 15:00."

    setBookingStep(3)
  }
}
      // Guardar hora
else if (bookingStep === 3) {
  if (!isValidTimeFormat(message)) {
    response =
      "⚠️ Esa hora no es válida. Escríbela en formato 24 horas. Ejemplo: 15:00."
  } else if (!isWithinBusinessHours(message)) {
    response =
      "⚠️ Ese horario está fuera del horario de atención.\n\n" +
      "Puedes reservar entre 09:00 y 18:00."
  } else {
    setBooking((prev) => ({
      ...prev,
      time: message
    }))

    response = "Perfecto. ¿A nombre de quién hacemos la reserva?"
    setBookingStep(4)
  }
}

      // Guardar nombre y confirmar
     // Guardar nombre y confirmar
else if (bookingStep === 4) {
  const completedBooking = {
    ...booking,
    customerName: message
  }

  setBooking(completedBooking)

  const { error } = await createBooking(completedBooking)

  if (error) {
  if (error.code === "23505") {
    const {
      bookedTimes,
      error: bookedError
    } = await getBookedTimes(completedBooking.day)

    if (bookedError) {
      console.error("Error consultando horarios:", bookedError)

      response =
        "No pude consultar los horarios disponibles. Inténtalo nuevamente."

      setBookingStep(3)
    } else {
      const freeTimes = allTimes.filter(
        (time) => !bookedTimes.includes(time)
)
      setAvailableTimes(freeTimes)
        
      response =
        `❌ La hora ${completedBooking.time} ya está reservada.\n\n` +
        `Horarios disponibles:\n` +
        freeTimes.map((time) => `• ${time}`).join("\n") +
        `\n\nEscribe la hora que prefieras.`

      setBookingStep(3)
      
    }
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
        {bookingStep === 1 && (
  <QuickOptions
    options={[
      "Corte clásico",
      "Corte + barba",
      "Barba"
    ]}
    onSelect={handleSend}
  />
)}
{bookingStep === 3 && availableTimes.length > 0 && (
  <QuickOptions
    options={availableTimes}
    onSelect={(time) => {
      setAvailableTimes([])
      handleSend(time)
    }}
  />
)}

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