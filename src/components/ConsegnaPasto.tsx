import { useEffect, useState, type FormEvent } from "react";
import { Check, Loader2, Undo2 } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import {
  fetchMealLogToChange,
  updateMealLog,
  type MealLogSummary,
} from "../api/backend";

type DeliveryType = "mensa" | "asporto";

function getTodayDatemark(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function ConsegnaPasto() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [mealLog, setMealLog] = useState<MealLogSummary | null>(null);
  const [mealsCount, setMealsCount] = useState<number | "">("");
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("mensa");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [submitNotice, setSubmitNotice] = useState("");
  const [errorNotice, setErrorNotice] = useState("");

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
      setMealsCount(loadedMealLog.mealsCount);
      setDeliveryType(loadedMealLog.receivingMode || "mensa");
      setIsLoading(false);
    };

    void loadMealLog();
  }, [id]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!id) {
      setErrorNotice("ID consegna non valido.");
      return;
    }

    if (mealsCount === "" || mealsCount < 0) {
      setErrorNotice("Inserisci un numero pasti valido.");
      return;
    }

    setIsSaving(true);
    setSubmitNotice("");
    setErrorNotice("");

    const result = await updateMealLog(id, {
      deliveryType,
      numberOfMeals: Number(mealsCount),
      datemark: getTodayDatemark(),
    });

    if ("error" in result) {
      setErrorNotice(result.error);
      setIsSaving(false);
      return;
    }

    setMealLog((current) =>
      current
        ? {
            ...current,
            mealsCount: Number(mealsCount),
            receivingMode: deliveryType,
            delivered: true,
          }
        : result,
    );
    setSubmitNotice("Consegna pasto confermata.");
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

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 p-6 lg:grid-cols-2 lg:gap-x-8">
        <div className="flex items-center gap-3 lg:col-span-2">
          <label htmlFor="guest-name" className="min-w-44 text-sm font-semibold text-bianco">
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

        <div className="flex items-center gap-3">
          <label htmlFor="delivery-type" className="min-w-44 text-sm font-semibold text-bianco">
            Modalità di ricevimento
          </label>
          <select
            id="delivery-type"
            value={deliveryType}
            onChange={(event) => setDeliveryType(event.target.value as DeliveryType)}
            disabled={isSaving}
            className="h-10 w-full rounded-md border-2 border-bordeaux bg-sabbia px-2.5 text-sm text-bordeaux outline-none disabled:opacity-70"
          >
            <option value="mensa">Mensa</option>
            <option value="asporto">Asporto</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="meals-count" className="min-w-44 text-sm font-semibold text-bianco">
            Numero pasti
          </label>
          <input
            id="meals-count"
            type="number"
            min={0}
            value={mealsCount}
            onChange={(event) =>
              setMealsCount(event.target.value === "" ? "" : Number(event.target.value))
            }
            disabled={isSaving}
            className="h-10 w-full rounded-md border-2 border-bordeaux bg-sabbia px-2.5 text-sm text-bordeaux outline-none disabled:opacity-70"
          />
        </div>

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
            disabled={isSaving}
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
