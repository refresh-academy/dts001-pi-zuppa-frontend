import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { SquarePen, Trash2, Undo2 } from "lucide-react"
import { deleteEnte, fetchEnteToChange, modifyEnte } from "../api/backend"
import type { Ente } from "../types/piuzuppa"

export function VisualizzaEnte() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [formData, setFormData] = useState<Ente | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleted, setIsDeleted] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [saveFeedback, setSaveFeedback] = useState("")
  const [deleteFeedback, setDeleteFeedback] = useState("")

  useEffect(() => {
    const loadEnte = async () => {
      if (!id) {
        setFormData(null)
        setIsLoading(false)
        return
      }

      const loadedEnte = await fetchEnteToChange(id)
      setFormData(loadedEnte)
      setIsEditing(false)
      setIsDeleted(false)
      setSaveFeedback("")
      setDeleteFeedback("")
      setIsDeleteDialogOpen(false)
      setIsLoading(false)
    }

    void loadEnte()
  }, [id])

  const inputClassName =
    "h-11 w-full rounded-md border-2 border-bordeaux bg-sabbia px-3 text-base text-bordeaux outline-none disabled:cursor-not-allowed disabled:opacity-70"

  const isFormDisabled = !isEditing || isDeleted || isSaving || isDeleting || isDeleteDialogOpen

  const handleSave = async () => {
    if (!id || !formData || isSaving || isDeleting || isDeleted) return

    setIsSaving(true)
    setSaveFeedback("")
    setDeleteFeedback("")

    const result = await modifyEnte(
      {
        nome: formData.nome,
        email: formData.email,
        telefono: formData.telefono,
        indirizzo: formData.indirizzo,
      },
      id,
    )

    if ("error" in result) {
      setSaveFeedback("")
      setDeleteFeedback(result.error)
      setIsSaving(false)
      return
    }

    setFormData(result)
    setIsEditing(false)
    setSaveFeedback("Ente salvato con successo.")
    setDeleteFeedback("")
    setIsSaving(false)
  }

  const handleDelete = () => {
    if (!id || !formData || isDeleting || isSaving || isDeleted) return
    setDeleteFeedback("")
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!id || !formData || isDeleting || isDeleted) return
    setIsDeleting(true)
    setSaveFeedback("")
    setDeleteFeedback("")

    const result = await deleteEnte(id)
    if (result.status === "success") {
      setIsDeleted(true)
      setIsEditing(false)
      setIsDeleteDialogOpen(false)
      setDeleteFeedback("Ente eliminato con successo.")
      setIsDeleting(false)
      window.setTimeout(() => navigate("/anagrafica-enti"), 2500)
      return
    }

    if (result.status === "not-found") {
      setDeleteFeedback("Ente non trovato o gia' eliminato.")
    } else {
      setDeleteFeedback(result.message)
    }

    setIsDeleteDialogOpen(false)
    setIsDeleting(false)
  }

  if (isLoading) {
    return <p className="px-8 pt-8 text-bianco">Caricamento dati ente...</p>
  }

  if (!formData) {
    return <p className="px-8 pt-8 text-bianco">Ente non trovato.</p>
  }

  return (
    <div
      className="table-panel relative top-0 ml-4 mt-6 min-h-[60vh] w-full p-8 shadow-2xl md:p-10"
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
            disabled={isDeleted || isDeleting || isSaving}
            aria-label="Modifica"
            title="Modifica"
            className="rounded-xl border-2 border-amber-950 bg-[linear-gradient(180deg,#fff6df_0%,#f1c97b_30%,#bd7b36_100%)] p-2 text-amber-950 shadow-[0_4px_0_0_#5c3417] transition duration-150 hover:-translate-y-0.5 active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <SquarePen size={18} strokeWidth={2.4} />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleted || isDeleting || isSaving}
            aria-label="Elimina"
            title="Elimina"
            className="rounded-xl border-2 border-red-950 bg-[linear-gradient(180deg,#ffdcdc_0%,#f38585_30%,#b93535_100%)] p-2 text-red-950 shadow-[0_4px_0_0_#5c1717] transition duration-150 hover:-translate-y-0.5 active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 size={18} strokeWidth={2.4} />
          </button>
        </div>

        {isDeleted ? (
          <div className="mt-6 rounded-lg border-2 border-red-800 bg-red-950/60 p-4">
            <p className="font-bold text-red-200">{deleteFeedback || "Ente eliminato."}</p>
          </div>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault()
              void handleSave()
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
                value={formData.nome}
                onChange={(event) =>
                  setFormData((current) =>
                    current ? { ...current, nome: event.target.value } : current,
                  )
                }
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
                value={formData.telefono}
                onChange={(event) =>
                  setFormData((current) =>
                    current ? { ...current, telefono: event.target.value } : current,
                  )
                }
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
                value={formData.email}
                onChange={(event) =>
                  setFormData((current) =>
                    current ? { ...current, email: event.target.value } : current,
                  )
                }
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
                value={formData.indirizzo}
                onChange={(event) =>
                  setFormData((current) =>
                    current ? { ...current, indirizzo: event.target.value } : current,
                  )
                }
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
                {isSaving ? "Salvataggio..." : "Salva"}
              </button>
            </div>

            {saveFeedback ? (
              <p className="text-sm font-semibold text-green-300 lg:col-span-2">{saveFeedback}</p>
            ) : null}
            {deleteFeedback ? (
              <p className="text-sm font-semibold text-red-300 lg:col-span-2">{deleteFeedback}</p>
            ) : null}
          </form>
        )}
      </div>

      {isDeleteDialogOpen ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/65 px-4">
          <div className="w-full max-w-2xl rounded-xl border-2 border-red-800 bg-amber-950 p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-giallo">Conferma eliminazione</h2>
            <p className="mt-3 text-bianco">Sei sicura/o di voler cancellare questo ente?</p>
            <p className="mt-1 text-sm font-semibold text-red-300">
              Questa azione e&apos; definitiva e non puo&apos; essere annullata.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteDialogOpen(false)}
                className="rounded-md border-2 border-amber-950 bg-[linear-gradient(180deg,#fff6df_0%,#f1c97b_30%,#bd7b36_100%)] px-4 py-1.5 text-sm font-bold text-amber-950 shadow-[0_4px_0_0_#5c3417]"
              >
                Annulla
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="rounded-md border-2 border-red-950 bg-[linear-gradient(180deg,#ffdcdc_0%,#f38585_30%,#b93535_100%)] px-4 py-1.5 text-sm font-bold text-red-950 shadow-[0_4px_0_0_#5c1717] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? "Eliminazione..." : "Conferma"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
