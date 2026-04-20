import { ChefHat, Flame, Salad, TimerReset } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import {
  getGuestMealRecords,
  getMealTypes,
  getRecipeRequirements,
  type RecipeRequirement,
} from "../api/backend"

type TipoConsegnaFiltro = "tutte" | "mensa" | "asporto"

type MealDemandRow = {
  mealType: string
  mensa: number
  asporto: number
  totale: number
}

const mealTypeFallback = ["Standard", "Vegetariano", "Vegano", "Halal", "No latticini"]

export function GestioneCucina() {
  const [searchTerm, setSearchTerm] = useState("")
  const [tipoPastoCalcolo, setTipoPastoCalcolo] = useState<"tutte" | string>("tutte")
  const [tipoConsegnaCalcolo, setTipoConsegnaCalcolo] = useState<TipoConsegnaFiltro>("tutte")

  const [mealTypeOptions, setMealTypeOptions] = useState<string[]>(mealTypeFallback)
  const [isMealTypesLoading, setIsMealTypesLoading] = useState(false)
  const [mealTypesError, setMealTypesError] = useState("")

  const [guestMealRecords, setGuestMealRecords] = useState<
    { guestId: string; mealType: string; deliveryType: "mensa" | "asporto" }[]
  >([])
  const [isGuestMealsLoading, setIsGuestMealsLoading] = useState(false)
  const [guestMealsError, setGuestMealsError] = useState("")
  const [recipeRequirements, setRecipeRequirements] = useState<RecipeRequirement[]>([])
  const [isRecipesLoading, setIsRecipesLoading] = useState(false)
  const [recipesError, setRecipesError] = useState("")

  useEffect(() => {
    let isMounted = true

    const loadMealTypes = async () => {
      setIsMealTypesLoading(true)
      setMealTypesError("")

      try {
        const mealTypes = await getMealTypes()
        if (!isMounted) return

        const normalizedMealTypes = Array.from(
          new Set(mealTypes.map((mealType) => mealType.trim()).filter((mealType) => mealType !== "")),
        )

        if (normalizedMealTypes.length > 0) {
          setMealTypeOptions(normalizedMealTypes)
          return
        }

        setMealTypeOptions(mealTypeFallback)
        setMealTypesError("Nessun tipo pasto disponibile dal backend: uso lista di default.")
      } catch {
        if (!isMounted) return
        setMealTypeOptions(mealTypeFallback)
        setMealTypesError("Impossibile caricare meal_types dal backend: uso lista di default.")
      } finally {
        if (isMounted) setIsMealTypesLoading(false)
      }
    }

    void loadMealTypes()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    const loadGuestMealRecords = async () => {
      setIsGuestMealsLoading(true)
      setGuestMealsError("")

      try {
        const rows = await getGuestMealRecords()

        if (!isMounted) return

        setGuestMealRecords(rows)
      } catch {
        if (!isMounted) return

        setGuestMealRecords([])
        setGuestMealsError("Impossibile leggere i dati guest_meal dal backend.")
      } finally {
        if (isMounted) setIsGuestMealsLoading(false)
      }
    }

    void loadGuestMealRecords()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    const loadRecipeRequirements = async () => {
      setIsRecipesLoading(true)
      setRecipesError("")

      try {
        const rows = await getRecipeRequirements()
        if (!isMounted) return
        setRecipeRequirements(rows)
      } catch {
        if (!isMounted) return
        setRecipeRequirements([])
        setRecipesError("Impossibile leggere recipes/recipe_product dal backend.")
      } finally {
        if (isMounted) setIsRecipesLoading(false)
      }
    }

    void loadRecipeRequirements()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (tipoPastoCalcolo === "tutte") return
    if (mealTypeOptions.includes(tipoPastoCalcolo)) return

    setTipoPastoCalcolo("tutte")
  }, [mealTypeOptions, tipoPastoCalcolo])

  const mealDemandRows = useMemo<MealDemandRow[]>(() => {
    const counts = new Map<string, { mensa: number; asporto: number }>()

    mealTypeOptions.forEach((mealType) => {
      if (!counts.has(mealType)) {
        counts.set(mealType, { mensa: 0, asporto: 0 })
      }
    })

    guestMealRecords.forEach((record) => {
      const mealType = record.mealType.trim()
      if (!mealType) return

      const current = counts.get(mealType) ?? { mensa: 0, asporto: 0 }
      const next = {
        mensa: current.mensa,
        asporto: current.asporto,
      }

      if (record.deliveryType === "mensa") next.mensa += 1
      if (record.deliveryType === "asporto") next.asporto += 1

      counts.set(mealType, next)
    })

    const orderFromOptions = mealTypeOptions.filter((mealType) => counts.has(mealType))
    const extraMealTypes = Array.from(counts.keys())
      .filter((mealType) => !orderFromOptions.includes(mealType))
      .sort((a, b) => a.localeCompare(b, "it", { sensitivity: "base" }))

    return [...orderFromOptions, ...extraMealTypes].map((mealType) => {
      const count = counts.get(mealType) ?? { mensa: 0, asporto: 0 }

      return {
        mealType,
        mensa: count.mensa,
        asporto: count.asporto,
        totale: count.mensa + count.asporto,
      }
    })
  }, [guestMealRecords, mealTypeOptions])

  const totalMensa = useMemo(
    () => mealDemandRows.reduce((acc, row) => acc + row.mensa, 0),
    [mealDemandRows],
  )

  const totalAsporto = useMemo(
    () => mealDemandRows.reduce((acc, row) => acc + row.asporto, 0),
    [mealDemandRows],
  )

  const totalPastiDaPreparare = totalMensa + totalAsporto

  const numeroFiltrato = useMemo(() => {
    if (tipoPastoCalcolo === "tutte") {
      if (tipoConsegnaCalcolo === "mensa") return totalMensa
      if (tipoConsegnaCalcolo === "asporto") return totalAsporto
      return totalPastiDaPreparare
    }

    const row = mealDemandRows.find((item) => item.mealType === tipoPastoCalcolo)
    if (!row) return 0

    if (tipoConsegnaCalcolo === "mensa") return row.mensa
    if (tipoConsegnaCalcolo === "asporto") return row.asporto
    return row.totale
  }, [mealDemandRows, tipoConsegnaCalcolo, tipoPastoCalcolo, totalAsporto, totalMensa, totalPastiDaPreparare])

  const ricetteFiltrate = useMemo(() => {
    const searchValue = searchTerm.trim().toLowerCase()

    const rows = searchValue
      ? recipeRequirements.filter((row) =>
          `${row.recipeName} ${row.productName} ${row.recipeDescription}`
            .toLowerCase()
            .includes(searchValue),
        )
      : recipeRequirements

    return [...rows].sort((a, b) => {
      const byRecipe = a.recipeName.localeCompare(b.recipeName, "it", { sensitivity: "base" })
      if (byRecipe !== 0) return byRecipe
      return a.productName.localeCompare(b.productName, "it", { sensitivity: "base" })
    })
  }, [recipeRequirements, searchTerm])

  const promemoriaTurno = useMemo(() => {
    if (isGuestMealsLoading) {
      return ["Caricamento dati pasti dal backend in corso..."]
    }

    const reminders: string[] = []

    if (guestMealsError) {
      reminders.push("Verifica sincronizzazione con backend guest_meal.")
    }

    if (totalPastiDaPreparare === 0) {
      reminders.push("Nessun pasto registrato in guest_meal per il turno corrente.")
      reminders.push("Controllare inserimento pasti in anagrafica ospiti.")
      return reminders
    }

    reminders.push(
      `Preparare ${totalPastiDaPreparare} pasti: ${totalMensa} mensa e ${totalAsporto} asporto.`,
    )

    const tipiPrioritari = mealDemandRows
      .filter((row) => row.totale > 0)
      .sort((a, b) => b.totale - a.totale)
      .slice(0, 2)

    if (tipiPrioritari.length > 0) {
      reminders.push(
        `Priorità produzione: ${tipiPrioritari
          .map((row) => `${row.mealType} (${row.totale})`)
          .join(" • ")}`,
      )
    }

    const pastiSpeciali = mealDemandRows.filter((row) => {
      const normalized = row.mealType.toLowerCase()
      return /veget|vegan|halal|gluten|lattic/.test(normalized) && row.totale > 0
    })

    if (pastiSpeciali.length > 0) {
      const totaleSpeciali = pastiSpeciali.reduce((acc, row) => acc + row.totale, 0)
      reminders.push(
        `Diete speciali da presidiare: ${totaleSpeciali} (${pastiSpeciali
          .map((row) => `${row.mealType}: ${row.totale}`)
          .join(", ")})`,
      )
    }

    if (totalAsporto > 0) {
      reminders.push(`Preparare packaging per ${totalAsporto} pasti da asporto.`)
    }

    if (reminders.length < 3) {
      reminders.push("Aggiornare pasti consegnati a fine servizio.")
    }

    return reminders.slice(0, 4)
  }, [guestMealsError, isGuestMealsLoading, mealDemandRows, totalAsporto, totalMensa, totalPastiDaPreparare])

  return (
    <section
      className="top-0 ml-4 mt-6 min-h-[60vh] w-full rounded-2xs border-12 border-t-amber-900 border-b-amber-900 border-l-amber-800 border-r-amber-800 px-8 py-8 shadow-2xl"
      style={{
        backgroundColor: "#0a0a0a",
        backgroundImage:
          "radial-gradient(circle at 18% 20%, rgba(255, 255, 255, 0.06) 0%, transparent 48%), radial-gradient(circle at 85% 70%, rgba(255, 255, 255, 0.03) 0%, transparent 42%)",
      }}
    >
      <div className="flex flex-wrap items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-giallo">Cucina Popolare</h1>
          <p className="mt-1 text-bianco/80">Pasti sociali, gestione porzioni e supporto alle persone fragili.</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border-2 border-amber-900 bg-black/35 p-5 shadow-[0_10px_24px_rgba(0,0,0,0.24)]">
        <h2 className="text-lg font-bold text-giallo">Pasti da preparare</h2>

        <div className="mt-3 flex flex-wrap items-end gap-3">
          <div>
            <label htmlFor="tipo-pasto" className="mb-1 block text-sm font-bold text-bianco">
              Tipo pasto
            </label>
            <select
              id="tipo-pasto"
              value={tipoPastoCalcolo}
              onChange={(event) => setTipoPastoCalcolo(event.target.value)}
              className="h-11 min-w-44 rounded-xl border-2 border-bordeaux bg-sabbia px-3 font-semibold text-bordeaux outline-none focus:border-amber-800"
            >
              <option value="tutte">Tutti i tipi</option>
              {mealTypeOptions.map((mealType) => (
                <option key={mealType} value={mealType}>
                  {mealType}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="tipo-consegna" className="mb-1 block text-sm font-bold text-bianco">
              Tipo consegna
            </label>
            <select
              id="tipo-consegna"
              value={tipoConsegnaCalcolo}
              onChange={(event) => setTipoConsegnaCalcolo(event.target.value as TipoConsegnaFiltro)}
              className="h-11 min-w-44 rounded-xl border-2 border-bordeaux bg-sabbia px-3 font-semibold text-bordeaux outline-none focus:border-amber-800"
            >
              <option value="tutte">Tutte</option>
              <option value="mensa">Mensa</option>
              <option value="asporto">Asporto</option>
            </select>
          </div>
        </div>

        {isMealTypesLoading ? (
          <p className="mt-2 text-sm text-giallo/85">Caricamento tipi pasto da backend...</p>
        ) : null}
        {isGuestMealsLoading ? (
          <p className="mt-2 text-sm text-giallo/85">Caricamento numeri da guest_meal...</p>
        ) : null}
        {mealTypesError ? (
          <p className="mt-2 text-sm text-amber-200">{mealTypesError}</p>
        ) : null}
        {guestMealsError ? (
          <p className="mt-2 text-sm text-red-300">{guestMealsError}</p>
        ) : null}

        <div className="mt-4 grid gap-4 xl:grid-cols-[220px_1fr]">
          <div className="rounded-xl border-2 border-amber-900 bg-black/45 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-giallo/80">Totale selezionato</p>
            <p className="mt-2 text-6xl leading-none font-bold text-bianco">{numeroFiltrato}</p>
            <p className="mt-2 text-xs text-bianco/70">Numero pasti da preparare (N)</p>
          </div>

          <div className="overflow-hidden rounded-xl border-2 border-amber-900">
            <table className="w-full border-collapse text-left">
              <thead className="bg-bordeaux text-giallo">
                <tr>
                  <th className="px-3 py-2 text-sm font-bold uppercase">Tipo pasto</th>
                  <th className="px-3 py-2 text-sm font-bold uppercase">Mensa</th>
                  <th className="px-3 py-2 text-sm font-bold uppercase">Asporto</th>
                  <th className="px-3 py-2 text-sm font-bold uppercase">Totale</th>
                </tr>
              </thead>
              <tbody className="bg-sabbia text-bordeaux">
                {mealDemandRows.length === 0 ? (
                  <tr className="border-t-2 border-amber-900/35">
                    <td colSpan={4} className="px-4 py-4 text-center text-bordeaux/75">
                      Nessun dato disponibile dalla tabella guest_meal.
                    </td>
                  </tr>
                ) : (
                  mealDemandRows.map((row) => (
                    <tr key={row.mealType} className="border-t-2 border-amber-900/35">
                      <td className="px-3 py-2 font-semibold">{row.mealType}</td>
                      <td className="px-3 py-2">{row.mensa}</td>
                      <td className="px-3 py-2">{row.asporto}</td>
                      <td className="px-3 py-2 font-bold">{row.totale}</td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot className="bg-bordeaux/15 text-bordeaux">
                <tr className="border-t-2 border-amber-900/40">
                  <td className="px-3 py-2 font-bold uppercase">Totale</td>
                  <td className="px-3 py-2 font-bold">{totalMensa}</td>
                  <td className="px-3 py-2 font-bold">{totalAsporto}</td>
                  <td className="px-3 py-2 font-bold">{totalPastiDaPreparare}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[2.2fr_1fr]">
        <div className="rounded-2xl border-2 border-amber-900 bg-black/35 p-5 shadow-[0_10px_24px_rgba(0,0,0,0.24)]">
          <div className="mb-4 flex flex-wrap items-end gap-3">
            <div className="min-w-64 flex-1">
              <label htmlFor="ricerca-menu" className="mb-1 block text-sm font-bold text-bianco">
                Cerca ricetta o prodotto
              </label>
              <input
                id="ricerca-menu"
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="es. zuppa, riso, pomodoro..."
                className="h-11 w-full rounded-xl border-2 border-bordeaux bg-sabbia px-4 text-bordeaux shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)] outline-none placeholder:text-bordeaux/70 focus:border-amber-800"
              />
            </div>
          </div>

          {isRecipesLoading ? (
            <p className="mb-3 text-sm text-giallo/85">Caricamento ricette e prodotti dal backend...</p>
          ) : null}
          {recipesError ? (
            <p className="mb-3 text-sm text-red-300">{recipesError}</p>
          ) : null}

          <div className="overflow-hidden rounded-xl border-2 border-amber-900">
            <table className="w-full border-collapse text-left">
              <thead className="bg-bordeaux text-giallo">
                <tr>
                  <th className="px-3 py-2 text-sm font-bold uppercase">Ricetta</th>
                  <th className="px-3 py-2 text-sm font-bold uppercase">Prodotto</th>
                  <th className="px-3 py-2 text-sm font-bold uppercase">Qta per pasto</th>
                  <th className="px-3 py-2 text-sm font-bold uppercase">Qta totale</th>
                </tr>
              </thead>
              <tbody className="bg-sabbia text-bordeaux">
                {ricetteFiltrate.length === 0 ? (
                  <tr className="border-t-2 border-amber-900/40">
                    <td colSpan={4} className="px-4 py-5 text-center text-bordeaux/75">
                      Nessuna ricetta trovata con i filtri selezionati.
                    </td>
                  </tr>
                ) : (
                  ricetteFiltrate.map((row) => (
                    <tr
                      key={`${row.recipeName}-${row.productName}`}
                      className="border-t-2 border-amber-900/35"
                    >
                      <td className="px-3 py-2">
                        <span className="font-semibold">{row.recipeName}</span>
                        {row.recipeDescription ? (
                          <span className="mt-0.5 block text-xs text-bordeaux/80">
                            {row.recipeDescription}
                          </span>
                        ) : null}
                      </td>
                      <td className="px-3 py-2">{row.productName}</td>
                      <td className="px-3 py-2">{row.quantityPerMeal.toFixed(3)}</td>
                      <td className="px-3 py-2 font-bold">
                        {(row.quantityPerMeal * numeroFiltrato).toFixed(3)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border-2 border-amber-900 bg-black/35 p-5 shadow-[0_8px_20px_rgba(0,0,0,0.2)]">
            <h2 className="text-lg font-bold text-giallo">Azioni rapide</h2>
            <div className="mt-4 space-y-3">
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-lg border border-amber-800 bg-amber-950/40 px-3 py-2 text-left text-bianco transition hover:bg-amber-900/55"
              >
                <ChefHat size={18} className="text-giallo" />
                Segna distribuzione pranzo
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-lg border border-amber-800 bg-amber-950/40 px-3 py-2 text-left text-bianco transition hover:bg-amber-900/55"
              >
                <Flame size={18} className="text-giallo" />
                Prepara porzioni da asporto
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-lg border border-amber-800 bg-amber-950/40 px-3 py-2 text-left text-bianco transition hover:bg-amber-900/55"
              >
                <Salad size={18} className="text-giallo" />
                Controlla diete speciali
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-lg border border-amber-800 bg-amber-950/40 px-3 py-2 text-left text-bianco transition hover:bg-amber-900/55"
              >
                <TimerReset size={18} className="text-giallo" />
                Aggiorna fabbisogno magazzino
              </button>
            </div>
          </div>

          <div className="rounded-2xl border-2 border-amber-900 bg-black/35 p-5 shadow-[0_8px_20px_rgba(0,0,0,0.2)]">
            <h2 className="text-lg font-bold text-giallo">Promemoria turno</h2>
            <ul className="mt-3 space-y-2 text-sm text-bianco/90">
              {promemoriaTurno.map((promemoria) => (
                <li key={promemoria}>- {promemoria}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  )
}
