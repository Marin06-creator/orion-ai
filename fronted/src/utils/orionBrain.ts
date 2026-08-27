export function getOrionResponse(message: string): string {
  const text = message.toLowerCase().trim()

  const responses = [
    {
      keywords: ["hola"],
      answer: "¡Hola Luis! 👋 Me alegra verte de nuevo."
    },
    {
      keywords: ["como estas", "cómo estás"],
      answer: "Estoy funcionando perfectamente y listo para ayudarte. 🤖"
    },
    {
      keywords: ["quien eres", "quién eres"],
      answer: "Soy ORION AI, un asistente inteligente que estamos construyendo juntos."
    },
    {
      keywords: ["gracias"],
      answer: "Siempre será un gusto ayudarte. 💙"
    },
    {
      keywords: ["adios", "adiós", "hasta luego"],
      answer: "¡Hasta luego, Luis! 👋"
    }
  ]

  for (const response of responses) {
    if (response.keywords.some(keyword => text.includes(keyword))) {
      return response.answer
    }
  }
  
    if (
      text.includes("como me llamo") ||
      text.includes("cómo me llamo") ||
      text.includes("cual es mi nombre") ||
      text.includes("cuál es mi nombre")
    ) { 
      return "Te llamas Luis."
      }

    if (
      text.includes("buenos dias") ||
      text.includes("buenos días")
) 

{
  return "¡Buenos días, Luis! Espero que tengas un excelente día. ☀️"
}
  if (text.includes("buenas tardes")) 
{
  return "¡Buenas tardes, Luis! ¿Cómo puedo ayudarte? 🌤️"
}
  if (text.includes("buenas noches")) 
{
  return "¡Buenas noches, Luis! ¿En qué puedo ayudarte? 🌙"
}
  if (text.includes("Puedes ayudarme"))
{
  return "Si Luis dime, estoy para lo que necesites!"
  }

  return "Todavía estoy aprendiendo. 🚀"

}
