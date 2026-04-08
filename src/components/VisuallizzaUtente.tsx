import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { ShieldCheck, ShieldX, SquarePen, Trash2, Undo2 } from "lucide-react"
import { fetchUserToChange } from "../api/backend"
import type { PuntoDiDistribuzione, Ruolo, User } from "../types/piuzuppa"

const puntiDistribuzioneOptions: PuntoDiDistribuzione[] = [
  "Saffi",
  "Battiferro",
  "Savena",
  "San Donato",
]

const ruoliOptions: Ruolo[] = ["cucina", "magazzino", "accoglienza"]

type EditableUserForm = {
  nome: string
  cognome: string
  username: string
  telefono: string
  email: string
  livelloAccesso: User["livelloAccesso"]
  puntiDistribuzione: PuntoDiDistribuzione[]
  ruoli: Ruolo[]
}

function toEditableUserForm(user: User): EditableUserForm {
  return {
    nome: user.nome,
    cognome: user.cognome,
    username: user.username,
    telefono: user.telefono,
    email: user.email,
    livelloAccesso: user.livelloAccesso,
    puntiDistribuzione: [...user.puntiDistribuzione],
    ruoli: [...user.ruoli],
  }
}

export function VisualizzaUtente() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [user, setUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<EditableUserForm | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isUserEnabled, setIsUserEnabled] = useState(true)
  const [isDeleted, setIsDeleted] = useState(false)
  const [isPasswordEditorOpen, setIsPasswordEditorOpen] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordFeedback, setPasswordFeedback] = useState("")

  useEffect(() => {
    const loadUser = async () => {
      if (!id) {
        setIsLoading(false)
        return
      }

      const loadedUser = await fetchUserToChange(id)
      setUser(loadedUser)
      if (loadedUser) {
        setFormData(toEditableUserForm(loadedUser))
      }
      setIsEditing(false)
      setIsUserEnabled(true)
      setIsDeleted(false)
      setIsPasswordEditorOpen(false)
      setNewPassword("")
      setConfirmPassword("")
      setPasswordFeedback("")
      setIsLoading(false)
    }

    loadUser()
  }, [id])

  const isFormDisabled = !isEditing || isDeleted

  const toggleSite = (site: PuntoDiDistribuzione) => {
    setFormData((current) => {
      if (!current) return current
      const isSelected = current.puntiDistribuzione.includes(site)
      return {
        ...current,
        puntiDistribuzione: isSelected
          ? current.puntiDistribuzione.filter((item) => item !== site)
          : [...current.puntiDistribuzione, site],
      }
    })
  }

  const toggleRuolo = (ruolo: Ruolo) => {
    setFormData((current) => {
      if (!current) return current
      const isSelected = current.ruoli.includes(ruolo)
      return {
        ...current,
        ruoli: isSelected
          ? current.ruoli.filter((item) => item !== ruolo)
          : [...current.ruoli, ruolo],
      }
    })
  }

  const handleDeleteUser = () => {
    const confirmed = window.confirm(
      "Questa azione e' solo statica per ora. Vuoi simulare l'eliminazione dell'utente?",
    )
    if (confirmed) {
      setIsDeleted(true)
      setIsEditing(false)
    }
  }

  const handleSavePassword = () => {
    if (!newPassword || !confirmPassword) {
      setPasswordFeedback("Compila entrambi i campi password.")
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordFeedback("Le password non coincidono.")
      return
    }

    setPasswordFeedback("Password aggiornata (simulazione statica).")
    setNewPassword("")
    setConfirmPassword("")
    setIsPasswordEditorOpen(false)
  }

  return (
    <div
      className="relative top-0 ml-4 mt-6 min-h-[60vh] w-full rounded-2xl border-12 border-y-amber-900 border-x-amber-800 py-8 pr-8 shadow-2xl bg-amber-950"
      style={{
        backgroundImage:
          "radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.03) 0%, transparent 40%)",
      }}
    >
      <div className="absolute right-8 top-8 flex items-center gap-2">
        <button
          type="button"
          onClick={() => navigate("/utenti")}
          aria-label="Torna indietro"
          title="Torna indietro"
          className="rounded-xl border-2 border-amber-950 bg-[linear-gradient(180deg,#fff6df_0%,#f1c97b_30%,#bd7b36_100%)] p-2 font-bold text-amber-950 shadow-[0_4px_0_0_#5c3417] transition duration-150 hover:-translate-y-0.5 active:translate-y-0.5"
        >
          <Undo2 size={18} strokeWidth={2.4} />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 pl-8">
        <h1 className="text-2xl font-bold text-giallo">Visualizza Utente</h1>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${isUserEnabled ? "bg-green-900 text-green-200" : "bg-red-900 text-red-200"}`}
        >
          {isUserEnabled ? "Attivo" : "Disabilitato"}
        </span>
        <button
          type="button"
          onClick={() => setIsUserEnabled((currentValue) => !currentValue)}
          disabled={isDeleted || !formData}
          aria-label={isUserEnabled ? "Disabilita" : "Abilita"}
          title={isUserEnabled ? "Disabilita utente" : "Abilita utente"}
          className="rounded-xl border-2 border-amber-950 bg-[linear-gradient(180deg,#fff6df_0%,#f1c97b_30%,#bd7b36_100%)] p-2 font-bold text-amber-950 shadow-[0_4px_0_0_#5c3417] transition duration-150 hover:-translate-y-0.5 active:translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isUserEnabled ? (
            <ShieldX size={18} strokeWidth={2.4} />
          ) : (
            <ShieldCheck size={18} strokeWidth={2.4} />
          )}
        </button>
        <button
          type="button"
          onClick={() => setIsEditing((currentValue) => !currentValue)}
          disabled={isDeleted || !formData}
          aria-label={isEditing ? "Blocca Modifica" : "Modifica"}
          title={isEditing ? "Blocca Modifica" : "Modifica"}
          className="rounded-xl border-2 border-amber-950 bg-[linear-gradient(180deg,#fff6df_0%,#f1c97b_30%,#bd7b36_100%)] p-2 font-bold text-amber-950 shadow-[0_4px_0_0_#5c3417] transition duration-150 hover:-translate-y-0.5 active:translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <SquarePen size={18} strokeWidth={2.4} />
        </button>
        <button
          type="button"
          onClick={() => setIsPasswordEditorOpen((currentValue) => !currentValue)}
          disabled={isDeleted || !formData}
          className="rounded-xl border-2 border-amber-950 bg-[linear-gradient(180deg,#fff6df_0%,#f1c97b_30%,#bd7b36_100%)] px-4 py-1.5 font-bold text-amber-950 shadow-[0_4px_0_0_#5c3417] transition duration-150 hover:-translate-y-0.5 active:translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPasswordEditorOpen ? "Chiudi Password" : "Cambia Password"}
        </button>
        <button
          type="button"
          onClick={handleDeleteUser}
          disabled={isDeleted || !formData}
          aria-label="Elimina Utente"
          title="Elimina Utente"
          className="rounded-xl border-2 border-red-950 bg-[linear-gradient(180deg,#ffdcdc_0%,#f38585_30%,#b93535_100%)] px-4 py-1.5 font-bold text-red-950 shadow-[0_4px_0_0_#5c1717] transition duration-150 hover:-translate-y-0.5 active:translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Trash2 size={18} strokeWidth={2.4} />
        </button>
      </div>

      {isLoading ? (
        <p className="px-8 pt-8 text-bianco">Caricamento dati utente...</p>
      ) : !user ? (
        <p className="px-8 pt-8 text-bianco">Utente non trovato.</p>
      ) : isDeleted ? (
        <div className="mx-8 mt-8 rounded-lg border-2 border-red-800 bg-red-950/60 p-4">
          <p className="font-bold text-red-200">Utente eliminato (simulazione statica).</p>
          <p className="mt-1 text-sm text-red-100">
            Nessuna modifica e' stata inviata al database.
          </p>
        </div>
      ) : !formData ? (
        <p className="px-8 pt-8 text-bianco">Dati utente non disponibili.</p>
      ) : (
        <div className="grid grid-cols-2 gap-x-12 gap-y-6 p-8 items-end">
          {isPasswordEditorOpen ? (
            <div className="col-span-2 grid grid-cols-2 gap-6 rounded-md border-2 border-amber-800/70 bg-black/20 p-4">
              <div className="flex flex-col gap-1">
                <label className="text-bianco text-sm">Nuova password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  className="border-2 bg-sabbia border-bordeaux rounded-md pl-2 h-10 outline-none text-bordeaux"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-bianco text-sm">Conferma password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="border-2 bg-sabbia border-bordeaux rounded-md pl-2 h-10 outline-none text-bordeaux"
                />
              </div>
              <div className="col-span-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSavePassword}
                  className="rounded-xl border-2 border-amber-950 bg-[linear-gradient(180deg,#fff6df_0%,#f1c97b_30%,#bd7b36_100%)] px-4 py-1.5 font-bold text-amber-950 shadow-[0_4px_0_0_#5c3417] transition duration-150 hover:-translate-y-0.5 active:translate-y-0.5"
                >
                  Salva Password
                </button>
                <p className="text-xs text-bianco/80"></p>
              </div>
            </div>
          ) : null}

          <div className="col-span-2 grid grid-cols-3 gap-6">
            <div className="flex flex-col gap-1">
              <label className="text-bianco text-sm">Nome</label>
              <input
                type="text"
                value={formData.nome}
                onChange={(event) =>
                  setFormData((current) =>
                    current ? { ...current, nome: event.target.value } : current
                  )
                }
                disabled={isFormDisabled}
                className="border-2 bg-sabbia border-bordeaux rounded-md pl-2 h-10 outline-none text-bordeaux disabled:opacity-80"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-bianco text-sm">Cognome</label>
              <input
                type="text"
                value={formData.cognome}
                onChange={(event) =>
                  setFormData((current) =>
                    current ? { ...current, cognome: event.target.value } : current
                  )
                }
                disabled={isFormDisabled}
                className="border-2 bg-sabbia border-bordeaux rounded-md pl-2 h-10 outline-none text-bordeaux disabled:opacity-80"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-bianco text-sm">Nome utente</label>
              <input
                type="text"
                value={formData.username}
                onChange={(event) =>
                  setFormData((current) =>
                    current ? { ...current, username: event.target.value } : current
                  )
                }
                disabled={isFormDisabled}
                className="border-2 bg-sabbia border-bordeaux rounded-md pl-2 h-10 outline-none text-bordeaux disabled:opacity-80"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-bianco text-sm">Telefono</label>
            <input
              type="text"
              value={formData.telefono}
              onChange={(event) =>
                setFormData((current) =>
                  current ? { ...current, telefono: event.target.value } : current
                )
              }
              disabled={isFormDisabled}
              className="border-2 bg-sabbia border-bordeaux rounded-md pl-2 h-10 outline-none text-bordeaux disabled:opacity-80"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-bianco text-sm">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(event) =>
                setFormData((current) =>
                  current ? { ...current, email: event.target.value } : current
                )
              }
              disabled={isFormDisabled}
              className="border-2 bg-sabbia border-bordeaux rounded-md pl-2 h-10 outline-none text-bordeaux disabled:opacity-80"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-bianco text-sm font-semibold">Livello di accesso</label>
            <div className="flex gap-6">
              {(["volontario", "coordinatore"] as User["livelloAccesso"][]).map((option) => (
                <label key={option} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="accessLevelView"
                    checked={formData.livelloAccesso === option}
                    onChange={() =>
                      setFormData((current) =>
                        current ? { ...current, livelloAccesso: option } : current
                      )
                    }
                    disabled={isFormDisabled}
                    className="appearance-none w-6 h-6 rounded-full border-2 border-bordeaux bg-sabbia checked:border-amber-500 checked:bg-amber-900"
                  />
                  <span className="text-bianco capitalize">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-bianco text-sm font-semibold">Punto di distribuzione</label>
            <div className="flex gap-6">
              {puntiDistribuzioneOptions.map((option) => (
                <label key={option} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.puntiDistribuzione.includes(option)}
                    onChange={() => toggleSite(option)}
                    disabled={isFormDisabled}
                    className="h-6 w-6 rounded-md border-2 border-bordeaux bg-sabbia accent-amber-900"
                  />
                  <span className="text-bianco">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-bianco text-sm font-semibold">Ruolo</label>
            <div className="flex gap-6">
              {ruoliOptions.map((option) => (
                <label key={option} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.ruoli.includes(option)}
                    onChange={() => toggleRuolo(option)}
                    disabled={isFormDisabled}
                    className="h-6 w-6 rounded-md border-2 border-bordeaux bg-sabbia accent-amber-900"
                  />
                  <span className="text-bianco capitalize">{option}</span>
                </label>
              ))}
            </div>
          </div>
          <p className="col-span-2 text-xs text-bianco/70">
            {passwordFeedback || "Modalita' statica: modifica, abilita/disabilita, password ed eliminazione non vengono salvate su DB."}
          </p>
        </div>
      )}
    </div>
  )
}
