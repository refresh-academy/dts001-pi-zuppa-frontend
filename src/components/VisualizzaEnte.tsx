import { useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { SquarePen, Trash2, Undo2 } from "lucide-react"
import type { Ente } from "../types/piuzuppa"

const mockEnti: Ente[] = [
  {
    id: "1",
    nome: "Caritas",
    email: "caritas@email.it",
    telefono: "051 5815663",
    indirizzo: "Via Avesella 15",
  },
  {
    id: "2",
    nome: "CSM",
    email: "mazzacorati@email.it",
    telefono: "051783456",
    indirizzo: "Via Toscana 18",
  },
  {
    id: "3",
    nome: "Comune di Bologna",
    email: "comunebologna@email.it",
    telefono: "051891273",
    indirizzo: "Piazza Maggiore 1",
  },
]

export function VisualizzaEnte() {
  const navigate = useNavigate()
  const { id } = useParams()
  const initialEnte = useMemo(
    () =>
      mockEnti.find((ente) => ente.id === id) ?? {
        id: "",
        nome: "",
        email: "",
        telefono: "",
        indirizzo: "",
      },
    [id],
  )

  const [nome, setNome] = useState(initialEnte.nome)
  const [email, setEmail] = useState(initialEnte.email)
  const [telefono, setTelefono] = useState(initialEnte.telefono)
  const [indirizzo, setIndirizzo] = useState(initialEnte.indirizzo)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleted, setIsDeleted] = useState(false)
  const [feedback, setFeedback] = useState("")

  const inputClassName =
    "h-11 w-full rounded-md border-2 border-bordeaux bg-sabbia px-3 text-base text-bordeaux outline-none disabled:cursor-not-allowed disabled:opacity-70"

  const isFormDisabled = !isEditing || isDeleted

  const handleSave = () => {
    setIsEditing(false)
    setFeedback("Dati ente salvati.")
  }

  const handleDelete = () => {
    setIsDeleted(true)
    setIsEditing(false)
    setFeedback("Ente eliminato.")
  }

  return (
    <div
      className="relative top-0 ml-4 mt-6 min-h-[60vh] w-full rounded-2xs border-12 border-t-amber-900 border-b-amber-900 border-l-amber-800 border-r-amber-800 p-8 shadow-2xl md:p-10"
      style={{
        backgroundColor: "#0a0a0a",
        backgroundImage:
          "radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.03) 0%, transparent 40%)",
      }}
    >
      <button
        type="button"
        onClick={() => navigate("/anagrafica-enti")}
        aria-label="Indietro"
        title="Indietro"
        className="absolute right-8 top-8 rounded-xl border-2 border-amber-950 bg-[linear-gradient(180deg,#fff6df_0%,#f1c97b_30%,#bd7b36_100%)] p-2 text-amber-950 shadow-[0_4px_0_0_#5c3417] transition duration-150 hover:-translate-y-0.5 active:translate-y-0.5"
      >
        <Undo2 size={18} strokeWidth={2.4} />
      </button>
      <div className="mx-auto w-full max-w-5xl">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-giallo">Visualizza Ente</h1>
          <button
            type="button"
            onClick={() => setIsEditing((currentValue) => !currentValue)}
            disabled={isDeleted}
            aria-label="Modifica"
            title="Modifica"
            className="rounded-xl border-2 border-amber-950 bg-[linear-gradient(180deg,#fff6df_0%,#f1c97b_30%,#bd7b36_100%)] p-2 text-amber-950 shadow-[0_4px_0_0_#5c3417] transition duration-150 hover:-translate-y-0.5 active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <SquarePen size={18} strokeWidth={2.4} />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleted}
            aria-label="Elimina"
            title="Elimina"
            className="rounded-xl border-2 border-red-950 bg-[linear-gradient(180deg,#ffdcdc_0%,#f38585_30%,#b93535_100%)] p-2 text-red-950 shadow-[0_4px_0_0_#5c1717] transition duration-150 hover:-translate-y-0.5 active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 size={18} strokeWidth={2.4} />
          </button>
        </div>

        {feedback ? <p className="pt-3 text-sm font-semibold text-bianco">{feedback}</p> : null}

        <form
          onSubmit={(event) => {
            event.preventDefault()
            if (!isFormDisabled) handleSave()
          }}
          className="mt-8 grid grid-cols-1 gap-x-10 gap-y-6 lg:grid-cols-2"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="ente-nome" className="text-sm font-semibold text-bianco">
              Nome
            </label>
            <input
              id="ente-nome"
              type="text"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              disabled={isFormDisabled}
              className={inputClassName}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="ente-telefono" className="text-sm font-semibold text-bianco">
              Telefono
            </label>
            <input
              id="ente-telefono"
              type="tel"
              value={telefono}
              onChange={(event) => setTelefono(event.target.value)}
              disabled={isFormDisabled}
              className={inputClassName}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="ente-email" className="text-sm font-semibold text-bianco">
              Email
            </label>
            <input
              id="ente-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isFormDisabled}
              className={inputClassName}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="ente-indirizzo" className="text-sm font-semibold text-bianco">
              Indirizzo
            </label>
            <input
              id="ente-indirizzo"
              type="text"
              value={indirizzo}
              onChange={(event) => setIndirizzo(event.target.value)}
              disabled={isFormDisabled}
              className={inputClassName}
            />
          </div>

          <div className="flex justify-center pt-2 lg:col-span-2">
            <button
              type="submit"
              disabled={isFormDisabled}
              className="h-10 min-w-36 rounded-md bg-amber-900 px-7 font-bold text-white shadow-lg transition-colors hover:bg-amber-800 disabled:cursor-not-allowed disabled:bg-amber-950 disabled:text-white/50"
            >
              Salva
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
