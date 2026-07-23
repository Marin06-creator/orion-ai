interface MessageProps {
  sender: "user" | "orion"
  text: string
}

function Message({ sender, text }: MessageProps) {
  return (
    <div
      className={`p-3 rounded-xl mb-3 ${
        sender === "user"
          ? "bg-blue-500 text-white ml-auto"
          : "bg-gray-700 text-gray-200"
      }`}
    >
      <p className="text-sm">
        {sender === "user" ? "👤 Tú" : "🤖 ORION"}
      </p>

      <p>{text}</p>
    </div>
  )
}

export default Message