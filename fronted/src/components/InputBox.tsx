function InputBox() {
  return (
    <div className="mt-4 flex gap-3">
      <input
        type="text"
        placeholder="Escribe un mensaje..."
        className="flex-1 bg-gray-700 text-white rounded-xl px-4 py-3 outline-none"
      />

      <button className="bg-blue-500 px-5 rounded-xl text-white hover:bg-blue-600">
        Enviar
      </button>
    </div>
  )
}

export default InputBox