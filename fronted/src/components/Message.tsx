interface MessageProps {
  sender: "user" | "orion"
  text: string
}

function Message({ sender, text }: MessageProps) {
  return (
    <div
     className={`p-4 rounded-2xl mb-3 max-w-[85%] shadow-md ${
  sender === "user"
    ? "bg-blue-500 text-white ml-auto"
    : "bg-gray-700 text-gray-200 mr-auto"
}`}
    >
      <p className="text-xs font-semibold mb-1 opacity-80">
        {sender === "user" ? "👤 Tú" : "🤖 ORION"}
      </p>

      <p className="whitespace-pre-line leading-relaxed">
  {text}
</p>
    </div>
  )
}

export default Message