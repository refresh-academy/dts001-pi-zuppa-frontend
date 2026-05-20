import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Check, Loader2, Undo2 } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import {
  fetchMealLogToChange,
  updateMealLog,
  type MealLogMealDetail,
  type MealLogSummary,
} from "../api/backend";
import { useAuth } from "./AuthContext";

type DeliveryType = "mensa" | "asporto";

function getDatemark(daysToAdd: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function mergeMealRows(rows: MealLogMealDetail[]): MealLogMealDetail[] {
  const mergedRows = new Map<string, MealLogMealDetail>();

  rows.forEach((row) => {
    const key = `${row.mealType}::${row.deliveryType}`;
    const currentRow = mergedRows.get(key);

    if (!currentRow) {
      mergedRows.set(key, { ...row });
      return;
    }

    mergedRows.set(key, {
      ...currentRow,
      quantity: currentRow.quantity + row.quantity,
    });
  });

  return Array.from(mergedRows.values());
}

export function ConsegnaPasto() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentSite } = useAuth();
  const [mealLog, setMealLog] = useState<MealLogSummary | null>(null);
  const [ordinaryMealRows, setOrdinaryMealRows] = useState<MealLogMealDetail[]>([]);
  const [mealRows, setMealRows] = useState<MealLogMealDetail[]>([]);
  const [anticipoMealRows, setAnticipoMealRows] = useState<MealLogMealDetail[]>([]);
  const [takesAnticipo, setTakesAnticipo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [submitNotice, setSubmitNotice] = useState("");
  const [errorNotice, setErrorNotice] = useState("");

  const todayDatemark = useMemo(() => getDatemark(0), []);
  const tomorrowDatemark = useMemo(() => getDatemark(1), []);
  const totalMeals = useMemo(
    () => mealRows.reduce((total, meal) => total + meal.quantity, 0),
    [mealRows],
  );
  const totalAnticipoMeals = useMemo(
    () => anticipoMealRows.reduce((total, meal) => total + meal.quantity, 0),
    [anticipoMealRows],
  );

  useEffect(() => {
    const loadMealLog = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      const loadedMealLog = await fetchMealLogToChange(id);
      if (!loadedMealLog) {
        setIsLoading(false);
        return;
      }

      setMealLog(loadedMealLog);
      setOrdinaryMealRows(loadedMealLog.meals);
      setMealRows(loadedMealLog.meals);
      setIsLoading(false);
    };

    void loadMealLog();
  }, [id]);

  const updateMealQuantity = (index: number, quantity: number) => {
    setMealRows((currentRows) =>
      currentRows.map((meal, mealIndex) =>
        mealIndex === index
          ? { ...meal, quantity: Number.isFinite(quantity) && quantity >= 0 ? quantity : 0 }
          : meal,
      ),
    );
  };

  const updateMealDeliveryType = (index: number, deliveryType: DeliveryType) => {
    setMealRows((currentRows) =>
      currentRows.map((meal, mealIndex) =>
        mealIndex === index ? { ...meal, deliveryType } : meal,
      ),
    );
  };

  const updateAnticipoMealQuantity = (index: number, quantity: number) => {
    setAnticipoMealRows((currentRows) =>
      currentRows.map((meal, mealIndex) =>
        mealIndex === index
          ? { ...meal, quantity: Number.isFinite(quantity) && quantity >= 0 ? quantity : 0 }
          : meal,
      ),
    );
  };

  const handleAnticipoChange = (checked: boolean) => {
    setTakesAnticipo(checked);
    setAnticipoMealRows(
      checked
        ? mergeMealRows(ordinaryMealRows.map((meal) => ({ ...meal, deliveryType: "asporto" })))
        : [],
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!id) {
      setErrorNotice("ID consegna non valido.");
      return;
    }

    if (mealRows.length === 0) {
      setErrorNotice("Nessun dettaglio pasto disponibile per questo ospite.");
      return;
    }

    if (totalMeals <= 0) {
      setErrorNotice("Inserisci almeno un pasto da consegnare.");
      return;
    }

    if (takesAnticipo && totalAnticipoMeals <= 0) {
      setErrorNotice("Inserisci almeno un pasto di anticipo da consegnare.");
      return;
    }

    setIsSaving(true);
    setSubmitNotice("");
    setErrorNotice("");

    const requests = [
      updateMealLog(id, {
        meals: mealRows,
        datemark: todayDatemark,
        siteName: currentSite,
      }),
    ];

    if (takesAnticipo) {
      requests.push(
        updateMealLog(id, {
          meals: anticipoMealRows,
          datemark: tomorrowDatemark,
          siteName: currentSite,
        }),
      );
    }

    const [todayResult, tomorrowResult] = await Promise.all(requests);

    if ("error" in todayResult) {
      setErrorNotice(todayResult.error);
      setIsSaving(false);
      return;
    }

    if (tomorrowResult && "error" in tomorrowResult) {
      setErrorNotice(tomorrowResult.error);
      setIsSaving(false);
      return;
    }

    setMealLog((current) =>
      current
        ? {
            ...current,
            mealsCount: totalMeals,
            receivingMode: mealRows[0]?.deliveryType ?? "",
            delivered: true,
            meals: mealRows,
          }
        : todayResult,
    );
    setSubmitNotice(
      takesAnticipo
        ? `Consegna confermata per il ${todayDatemark} e anticipo per il ${tomorrowDatemark}.`
        : `Consegna pasto confermata per il ${todayDatemark}.`,
    );
    setIsSaving(false);
  };

  if (isLoading) {
    return <p className="px-8 pt-8 text-bianco">Caricamento consegna pasto...</p>;
  }

  if (!mealLog) {
    return <p className="px-8 pt-8 text-bianco">Consegna pasto non trovata.</p>;
  }

  return (
    <div className="table-panel relative top-0 ml-4 mt-6 min-h-[60vh] w-full py-6 pr-6 shadow-2xl">
      <div className="mt-1 flex flex-wrap items-center gap-2 px-6">
        <h1 className="mr-2 text-lg font-bold text-giallo">Consegna Pasto</h1>
        <button
          type="button"
          onClick={() => navigate("/accoglienza")}
          disabled={isSaving}
          aria-label="Torna indietro"
          title="Torna indietro"
          className="ml-auto rounded-xl border-2 border-amber-950 bg-[linear-gradient(180deg,#fff6df_0%,#f1c97b_30%,#bd7b36_100%)] p-1.5 font-bold text-amber-950 shadow-[0_4px_0_0_#5c3417] transition duration-150 hover:-translate-y-0.5 active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Undo2 size={18} strokeWidth={2.4} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-2 lg:gap-x-8">
        <div className="flex flex-col gap-1 lg:col-span-2">
          <label htmlFor="guest-name" className="text-sm font-semibold text-bianco">
            Ospite
          </label>
          <input
            id="guest-name"
            type="text"
            value={mealLog.guestName}
            disabled
            className="h-10 w-full rounded-md border-2 border-bordeaux bg-sabbia px-2.5 text-sm text-bordeaux outline-none disabled:opacity-80"
          />
        </div>

        <div className="flex flex-col gap-3 lg:col-span-2">
          <label className="text-sm font-semibold text-bianco">Anticipo</label>
          <label className="group flex cursor-pointer items-center gap-3">
            <div className="relative flex items-center justify-center">
              <input
                checked={takesAnticipo}
                onChange={(event) => handleAnticipoChange(event.target.checked)}
                type="checkbox"
                disabled={isSaving}
                className="peer h-6 w-6 appearance-none rounded-md border-2 border-bordeaux bg-sabbia transition-all checked:border-amber-500 checked:bg-amber-900 disabled:cursor-not-allowed disabled:opacity-70"
              />
              <div className="pointer-events-none absolute text-sm font-bold text-white opacity-0 transition-opacity peer-checked:opacity-100">
                ✓
              </div>
            </div>
            <span className="text-bianco transition-colors group-hover:text-giallo">
              Aggiungi pasti per il giorno seguente ({tomorrowDatemark})
            </span>
          </label>
        </div>

        <div className="lg:col-span-2">
          <div className="mb-2 flex items-center justify-between gap-4">
            <h2 className="text-sm font-semibold text-bianco">Dettaglio pasti di oggi ({todayDatemark})</h2>
            <p className="text-sm font-bold text-giallo">Totale: {totalMeals}</p>
          </div>

          <div className="overflow-hidden rounded-2xl border-2 border-amber-900 shadow-[0_10px_24px_rgba(0,0,0,0.22)]">
            <table className="w-full border-collapse text-left">
              <thead className="bg-bordeaux text-giallo">
                <tr>
                  <th className="px-4 py-3 text-sm font-bold uppercase tracking-wide">Tipo pasto</th>
                  <th className="px-4 py-3 text-sm font-bold uppercase tracking-wide">Modalità di ricevimento</th>
                  <th className="w-48 px-4 py-3 text-sm font-bold uppercase tracking-wide">Numero</th>
                </tr>
              </thead>
              <tbody className="bg-sabbia text-bordeaux">
                {mealRows.length === 0 ? (
                  <tr className="border-t-2 border-amber-900/40">
                    <td colSpan={3} className="px-4 py-6 text-center text-bordeaux/75">
                      Nessun dettaglio pasto disponibile.
                    </td>
                  </tr>
                ) : (
                  mealRows.map((meal, index) => (
                    <tr key={`${meal.mealType}-${meal.deliveryType}-${index}`} className="border-t-2 border-amber-900/40 odd:bg-sabbia even:bg-[#f4dd88]">
                      <td className="px-4 py-3 font-semibold">{meal.mealType}</td>
                      <td className="px-4 py-3">
                        <select
                          value={meal.deliveryType || "mensa"}
                          onChange={(event) =>
                            updateMealDeliveryType(index, event.target.value as DeliveryType)
                          }
                          disabled={isSaving}
                          className="h-9 w-36 rounded-md border-2 border-bordeaux bg-[#fff6df] px-2 text-sm text-bordeaux outline-none disabled:opacity-70"
                        >
                          <option value="mensa">Mensa</option>
                          <option value="asporto">Asporto</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min={0}
                          value={meal.quantity}
                          onChange={(event) =>
                            updateMealQuantity(index, Number(event.target.value))
                          }
                          disabled={isSaving}
                          className="h-9 w-28 rounded-md border-2 border-bordeaux bg-[#fff6df] px-2 text-sm text-bordeaux outline-none disabled:opacity-70"
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {takesAnticipo ? (
          <div className="lg:col-span-2">
            <div className="mb-2 flex items-center justify-between gap-4">
              <h2 className="text-sm font-semibold text-bianco">Anticipo per domani ({tomorrowDatemark})</h2>
              <p className="text-sm font-bold text-giallo">Totale: {totalAnticipoMeals}</p>
            </div>

            <div className="overflow-hidden rounded-2xl border-2 border-amber-900 shadow-[0_10px_24px_rgba(0,0,0,0.22)]">
              <table className="w-full border-collapse text-left">
                <thead className="bg-bordeaux text-giallo">
                  <tr>
                    <th className="px-4 py-3 text-sm font-bold uppercase tracking-wide">Tipo pasto</th>
                    <th className="px-4 py-3 text-sm font-bold uppercase tracking-wide">Modalità di ricevimento</th>
                    <th className="w-48 px-4 py-3 text-sm font-bold uppercase tracking-wide">Numero</th>
                  </tr>
                </thead>
                <tbody className="bg-sabbia text-bordeaux">
                  {anticipoMealRows.length === 0 ? (
                    <tr className="border-t-2 border-amber-900/40">
                      <td colSpan={3} className="px-4 py-6 text-center text-bordeaux/75">
                        Nessun dettaglio pasto disponibile.
                      </td>
                    </tr>
                  ) : (
                    anticipoMealRows.map((meal, index) => (
                      <tr key={`${meal.mealType}-${meal.deliveryType}-${index}`} className="border-t-2 border-amber-900/40 odd:bg-sabbia even:bg-[#f4dd88]">
                        <td className="px-4 py-3 font-semibold">{meal.mealType}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex h-9 items-center rounded-md border-2 border-bordeaux bg-[#fff6df] px-3 text-sm font-semibold text-bordeaux">
                            Asporto
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min={0}
                            value={meal.quantity}
                            onChange={(event) =>
                              updateAnticipoMealQuantity(index, Number(event.target.value))
                            }
                            disabled={isSaving}
                            className="h-9 w-28 rounded-md border-2 border-bordeaux bg-[#fff6df] px-2 text-sm text-bordeaux outline-none disabled:opacity-70"
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {submitNotice ? (
          <p className="rounded-lg border border-green-800 bg-green-950/60 px-4 py-2 text-sm font-bold text-green-200 lg:col-span-2">
            {submitNotice}
          </p>
        ) : null}

        {errorNotice ? (
          <p className="rounded-lg border border-red-800 bg-red-950/60 px-4 py-2 text-sm font-bold text-red-200 lg:col-span-2">
            {errorNotice}
          </p>
        ) : null}

        <div className="flex justify-end lg:col-span-2">
          <button
            type="submit"
            disabled={isSaving || mealRows.length === 0}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-amber-950 bg-[linear-gradient(180deg,#fff6df_0%,#f1c97b_30%,#bd7b36_100%)] px-5 py-2 font-bold text-amber-950 shadow-[0_6px_0_0_#5c3417,0_10px_18px_rgba(92,52,23,0.28)] transition duration-150 hover:-translate-y-1 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? (
              <Loader2 size={18} strokeWidth={2.4} className="animate-spin" />
            ) : (
              <Check size={18} strokeWidth={2.4} />
            )}
            Conferma
          </button>
        </div>
      </form>
    </div>
  );
}
