import { useState } from "react"
import logo from "../assets/logo.png"

export function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    console.log("username:", username, "password:", password)
    setUsername("")
    setPassword("")
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 pt-32">
      <img src={logo} alt="Più Zuppa" />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center gap-8 pt-8"
      >
        <div className="flex flex-row items-center justify-center gap-4">
          <div className="flex flex-col justify-center gap-2">
            <label htmlFor="username">Utente</label>
            <label htmlFor="password">Password</label>
          </div>

          <div className="flex flex-col justify-center gap-2">
            <input
              id="username"
              onChange={(event) => setUsername(event.target.value)}
              type="text"
              value={username}
              placeholder="inserisci nome utente"
              className="border-2 bg-sabbia"
            />
            <input
              id="password"
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              value={password}
              placeholder="inserisci password"
              className="border-2 bg-sabbia"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-32 cursor-pointer border-2 bg-giallo shadow-lg hover:scale-110"
        >
          Accedi
        </button>
      </form>
    </div>
  )
}
