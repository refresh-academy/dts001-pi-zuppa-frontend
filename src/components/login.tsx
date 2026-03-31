import { useState, type FormEvent } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useNavigate } from "react-router"
import { verifyCredentials } from "../api/mock-backend"
import logo from "../assets/logo.png"
import { useAuth } from "../components/authcontext"

export function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const result = await verifyCredentials(username, password)

    if (result.status === "success") {
      login(result.user) 

      setErrorMessage("")
      setSuccessMessage(`Benvenuta/o ${result.user.nomeECognome} `)
      navigate("/home")
      setShowPassword(false)
    }

    else if (result.status === "username-error") {
      setSuccessMessage("")
      setErrorMessage("Nome utente non trovato")
      return
    }

    else if (result.status === "password-error") {
      setSuccessMessage("")
      setErrorMessage("Password non corretta")
      return
    }
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
              className="border-2 bg-sabbia  border-bordeaux rounded-md pl-2"
            />
            <div className="flex items-center gap-2">
              <input
                id="password"
                onChange={(event) => setPassword(event.target.value)}
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="inserisci password"
                className="border-2 bg-sabbia border-bordeaux rounded-md pl-2"
              />
              <button
                type="button"
                onClick={() => setShowPassword((currentValue) => !currentValue)}
                className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-bordeaux bg-sabbia text-bordeaux hover:bg-giallo"
                aria-label={
                  showPassword ? "Nascondi password" : "Mostra password"
                }
              >
                {showPassword ? <Eye size={16 } /> : <EyeOff size={16} />}
              </button>
            </div>
          </div>
        </div>
        {errorMessage ? <p className="text-red-700">{errorMessage}</p> : null}
        {successMessage ? (
          <p className="text-green-700">{successMessage}</p>
        ) : null}

        <button
          type="submit"
          className="w-32 cursor-pointer border-4  border-bordeaux text-bordeaux font-bold bg-giallo rounded-md  p-1 shadow-lg hover:scale-110"
        >
          Accedi
        </button>
      </form>
    </div>
  )
}
