import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Loader2,
  Minus,
  Plus,
  ShieldCheck,
  ShieldX,
  SquarePen,
  Trash2,
  Undo2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { fetchGuestToChange, getEntityNames, getMealTypes } from "../api/backend";

type MealType = string;
type DeliveryType = "" | "mensa" | "asporto";

type MealRow = {
  id: number;
  tipo: MealType;
  consegna: DeliveryType;
};

type GuestFormState = {
  nome: string;
  cognome: string;
  dataNascita: string;
  residente: boolean;
  professione: string;
  telefono: string;
  enteSegnalazione: string;
};

const initialFormData: GuestFormState = {
  nome: "",
  cognome: "",
  dataNascita: "",
  residente: true,
  professione: "",
  telefono: "",
  enteSegnalazione: "",
};

export function VisualizzaOspite() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const [formData, setFormData] = useState<GuestFormState>(initialFormData);
  const [entityOptions, setEntityOptions] = useState<string[]>([]);
  const [mealTypeOptions, setMealTypeOptions] = useState<MealType[]>([]);
  const [familyCount, setFamilyCount] = useState<number | "">("");
  const [mealRows, setMealRows] = useState<MealRow[]>([]);
  const [isMealWarningOpen, setIsMealWarningOpen] = useState(false);
  const [isOspiteEnabled, setIsOspiteEnabled] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [submitNotice, setSubmitNotice] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [guestFound, setGuestFound] = useState(true);

  const normalizedFamilyCount = familyCount === "" ? 0 : familyCount;
  const hasMealCountError =
    normalizedFamilyCount > 0 && mealRows.length < normalizedFamilyCount;
  const isFormDisabled = !isEditing;

  useEffect(() => {
    getEntityNames().then((data) => setEntityOptions(data));
    getMealTypes().then((data) => setMealTypeOptions(data));
  }, []);

  useEffect(() => {
    const loadGuest = async () => {
      if (!id) {
        setGuestFound(false);
        setIsLoading(false);
        return;
      }

      const guest = await fetchGuestToChange(id);
      if (!guest) {
        setGuestFound(false);
        setIsLoading(false);
        return;
      }

      setFormData({
        nome: guest.nome,
        cognome: guest.cognome,
        dataNascita: guest.dataNascita,
        residente: guest.residente,
        professione: guest.professione,
        telefono: guest.telefono,
        enteSegnalazione: guest.enteSegnalazione,
      });
      setFamilyCount(guest.numeroFamiliari);
      setMealRows(
        guest.pasti.map((meal, index) => ({
          id: meal.id || index + 1,
          tipo: meal.mealType,
          consegna: meal.deliveryType,
        })),
      );
      setGuestFound(true);
      setIsLoading(false);
    };

    void loadGuest();
  }, [id]);

  useEffect(() => {
    const targetRows = familyCount === "" ? 0 : Math.max(0, familyCount);

    setMealRows((currentRows) => {
      if (currentRows.length === targetRows) return currentRows;

      if (currentRows.length < targetRows) {
        const nextRows = [...currentRows];
        let nextId = nextRows.length > 0 ? nextRows[nextRows.length - 1].id + 1 : 1;

        while (nextRows.length < targetRows) {
          nextRows.push({ id: nextId, tipo: mealTypeOptions[0] ?? "", consegna: "" });
          nextId += 1;
        }

        return nextRows;
      }

      return currentRows.slice(0, targetRows);
    });
  }, [familyCount, mealTypeOptions]);

  const addMealRow = () => {
    setMealRows((currentRows) => {
      const nextId =
        currentRows.length > 0 ? currentRows[currentRows.length - 1].id + 1 : 1;

      return [...currentRows, { id: nextId, tipo: mealTypeOptions[0] ?? "", consegna: "" }];
    });
  };

  const removeMealRow = () => {
    setMealRows((currentRows) => {
      if (currentRows.length <= 0) return currentRows;
      return currentRows.slice(0, -1);
    });
  };

  const updateMealType = (id: number, tipo: MealType) => {
    setMealRows((currentRows) =>
      currentRows.map((row) => (row.id === id ? { ...row, tipo } : row)),
    );
  };

  const updateMealDelivery = (id: number, consegna: Exclude<DeliveryType, "">) => {
    setMealRows((currentRows) =>
      currentRows.map((row) => (row.id === id ? { ...row, consegna } : row)),
    );
  };

  const finalizeSubmit = () => {
    setSubmitNotice("Registrazione confermata.");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitNotice("");

    if (hasMealCountError) {
      setIsMealWarningOpen(true);
      return;
    }

    finalizeSubmit();
  };

  const handleConfirmContinue = () => {
    setIsMealWarningOpen(false);
    finalizeSubmit();
  };

  const handleOpenDatePicker = () => {
    const inputElement = dateInputRef.current;
    if (!inputElement) return;

    const inputWithPicker = inputElement as HTMLInputElement & {
      showPicker?: () => void;
    };

    if (typeof inputWithPicker.showPicker === "function") {
      inputWithPicker.showPicker();
      return;
    }

    inputElement.focus();
    inputElement.click();
  };

  const handleDeleteClick = () => {
    setIsDeleting(true);
    window.setTimeout(() => setIsDeleting(false), 700);
  };

  if (isLoading) {
    return <p className="px-8 pt-8 text-bianco">Caricamento dati ospite...</p>;
  }

  if (!guestFound) {
    return <p className="px-8 pt-8 text-bianco">Ospite non trovato.</p>;
  }

  return (
    <div
      className="relative top-0 ml-4 mt-6 min-h-[60vh] w-full rounded-2xs border-12 border-t-amber-900 border-b-amber-900 border-l-amber-800 border-r-amber-800 py-6 pr-6 shadow-2xl"
      style={{
        backgroundColor: "#0a0a0a",
        backgroundImage:
          "radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.03) 0%, transparent 40%)",
      }}
    >
      <div className="mt-1 flex flex-wrap items-center gap-2 px-6">
        <h1 className="mr-2 text-lg font-bold text-giallo">Visualizza Ospite</h1>
        <span
          className={`rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wide ${isOspiteEnabled ? "bg-green-900 text-green-200" : "bg-red-900 text-red-200"}`}
        >
          {isOspiteEnabled ? "Attivo" : "Disabilitato"}
        </span>

        <button
          type="button"
          onClick={() => setIsOspiteEnabled((currentValue) => !currentValue)}
          aria-label={isOspiteEnabled ? "Disabilita ospite" : "Abilita ospite"}
          title={isOspiteEnabled ? "Disabilita ospite" : "Abilita ospite"}
          className="rounded-xl border-2 border-amber-950 bg-[linear-gradient(180deg,#fff6df_0%,#f1c97b_30%,#bd7b36_100%)] p-1.5 font-bold text-amber-950 shadow-[0_4px_0_0_#5c3417] transition duration-150 hover:-translate-y-0.5 active:translate-y-0.5"
        >
          {isOspiteEnabled ? (
            <ShieldX size={18} strokeWidth={2.4} />
          ) : (
            <ShieldCheck size={18} strokeWidth={2.4} />
          )}
        </button>

        <button
          type="button"
          onClick={() => setIsEditing((currentValue) => !currentValue)}
          aria-label={isEditing ? "Blocca modifica" : "Modifica"}
          title={isEditing ? "Blocca modifica" : "Modifica"}
          className="rounded-xl border-2 border-amber-950 bg-[linear-gradient(180deg,#fff6df_0%,#f1c97b_30%,#bd7b36_100%)] p-1.5 font-bold text-amber-950 shadow-[0_4px_0_0_#5c3417] transition duration-150 hover:-translate-y-0.5 active:translate-y-0.5"
        >
          <SquarePen size={18} strokeWidth={2.4} />
        </button>

        <button
          type="button"
          onClick={handleDeleteClick}
          aria-label="Elimina ospite"
          title="Elimina ospite"
          className="rounded-xl border-2 border-red-950 bg-[linear-gradient(180deg,#ffdcdc_0%,#f38585_30%,#b93535_100%)] px-3 py-1.5 font-bold text-red-950 shadow-[0_4px_0_0_#5c1717] transition duration-150 hover:-translate-y-0.5 active:translate-y-0.5"
        >
          {isDeleting ? (
            <Loader2 size={18} strokeWidth={2.4} className="animate-spin" />
          ) : (
            <Trash2 size={18} strokeWidth={2.4} />
          )}
        </button>

        <button
          type="button"
          onClick={() => navigate("/anagrafica-ospiti")}
          aria-label="Torna indietro"
          title="Torna indietro"
          className="ml-auto rounded-xl border-2 border-amber-950 bg-[linear-gradient(180deg,#fff6df_0%,#f1c97b_30%,#bd7b36_100%)] p-1.5 font-bold text-amber-950 shadow-[0_4px_0_0_#5c3417] transition duration-150 hover:-translate-y-0.5 active:translate-y-0.5"
        >
          <Undo2 size={18} strokeWidth={2.4} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 p-6 lg:grid-cols-2 lg:gap-x-8">
        <div className="flex items-center gap-3">
          <label htmlFor="name" className="min-w-28 text-sm font-semibold text-bianco">Nome</label>
          <input
            id="name"
            type="text"
            value={formData.nome}
            onChange={(event) =>
              setFormData((current) => ({ ...current, nome: event.target.value }))
            }
            disabled={isFormDisabled}
            className="h-10 w-full rounded-md border-2 border-bordeaux bg-sabbia px-2.5 text-sm text-bordeaux outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="surname" className="min-w-28 text-sm font-semibold text-bianco">Cognome</label>
          <input
            id="surname"
            type="text"
            value={formData.cognome}
            onChange={(event) =>
              setFormData((current) => ({ ...current, cognome: event.target.value }))
            }
            disabled={isFormDisabled}
            className="h-10 w-full rounded-md border-2 border-bordeaux bg-sabbia px-2.5 text-sm text-bordeaux outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="dob" className="min-w-28 text-sm font-semibold text-bianco">Data di nascita</label>
          <div className="relative w-full">
            <input
              ref={dateInputRef}
              id="dob"
              type="date"
              value={formData.dataNascita}
              onChange={(event) =>
                setFormData((current) => ({ ...current, dataNascita: event.target.value }))
              }
              disabled={isFormDisabled}
              className="h-10 w-full appearance-none rounded-md border-2 border-bordeaux bg-sabbia pr-10 pl-2.5 text-sm text-bordeaux outline-none [&::-webkit-calendar-picker-indicator]:opacity-0"
            />
            <button
              type="button"
              onClick={handleOpenDatePicker}
              aria-label="Apri calendario"
              title="Apri calendario"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border-2 border-bordeaux bg-giallo p-1 text-bordeaux shadow-sm"
            >
              <CalendarDays size={14} strokeWidth={2.7} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="min-w-28 text-sm font-semibold text-bianco">Residenza</span>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-bianco">
              <span className="text-sm font-semibold">Si</span>
              <input
                type="radio"
                name="residenza"
                value="si"
                checked={formData.residente}
                onChange={() =>
                  setFormData((current) => ({ ...current, residente: true }))
                }
                disabled={isFormDisabled}
                className="h-5 w-5 accent-bordeaux"
              />
            </label>
            <label className="flex items-center gap-2 text-bianco">
              <span className="text-sm font-semibold">No</span>
              <input
                type="radio"
                name="residenza"
                value="no"
                checked={!formData.residente}
                onChange={() =>
                  setFormData((current) => ({ ...current, residente: false }))
                }
                disabled={isFormDisabled}
                className="h-5 w-5 accent-bordeaux"
              />
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="profession" className="min-w-28 text-sm font-semibold text-bianco">Professione</label>
          <input
            id="profession"
            type="text"
            value={formData.professione}
            onChange={(event) =>
              setFormData((current) => ({ ...current, professione: event.target.value }))
            }
            disabled={isFormDisabled}
            className="h-10 w-full rounded-md border-2 border-bordeaux bg-sabbia px-2.5 text-sm text-bordeaux outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="phone" className="min-w-28 text-sm font-semibold text-bianco">Telefono</label>
          <input
            id="phone"
            type="tel"
            value={formData.telefono}
            onChange={(event) =>
              setFormData((current) => ({ ...current, telefono: event.target.value }))
            }
            disabled={isFormDisabled}
            className="h-10 w-full rounded-md border-2 border-bordeaux bg-sabbia px-2.5 text-sm text-bordeaux outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="familyCount" className="min-w-28 text-sm font-semibold text-bianco">N° familiari</label>
          <div className="relative w-24">
            <input
              id="familyCount"
              type="number"
              min={0}
              value={familyCount}
              onChange={(event) => {
                const rawValue = event.target.value;
                if (rawValue === "") {
                  setFamilyCount("");
                  return;
                }
                const numericValue = Number(rawValue);
                if (!Number.isNaN(numericValue) && numericValue >= 0) {
                  setFamilyCount(numericValue);
                }
              }}
              disabled={isFormDisabled}
              className="h-10 w-full rounded-md border-2 border-bordeaux bg-sabbia pl-2.5 pr-8 text-sm text-bordeaux outline-none [appearance:textfield] [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <div className="absolute right-1 top-1/2 flex -translate-y-1/2 flex-col gap-0.5">
              <button
                type="button"
                onClick={() =>
                  setFamilyCount((currentValue) =>
                    currentValue === "" ? 1 : currentValue + 1,
                  )
                }
                disabled={isFormDisabled}
                className="h-[15px] w-5 rounded-[3px] border border-bordeaux bg-giallo text-[9px] font-bold leading-none text-bordeaux"
              >
                <ChevronUp size={10} strokeWidth={2.8} className="mx-auto" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setFamilyCount((currentValue) => {
                    if (currentValue === "" || currentValue <= 0) return 0;
                    return currentValue - 1;
                  })
                }
                disabled={isFormDisabled}
                className="h-[15px] w-5 rounded-[3px] border border-bordeaux bg-giallo text-[9px] font-bold leading-none text-bordeaux"
              >
                <ChevronDown size={10} strokeWidth={2.8} className="mx-auto" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="agency" className="min-w-28 text-sm font-semibold text-bianco">Ente segnalazione</label>
          <div className="relative w-full">
            <select
              id="agency"
              value={formData.enteSegnalazione}
              onChange={(event) =>
                setFormData((current) => ({ ...current, enteSegnalazione: event.target.value }))
              }
              disabled={isFormDisabled}
              className="h-10 w-full appearance-none rounded-md border-2 border-bordeaux bg-sabbia pl-2.5 pr-10 text-sm text-bordeaux outline-none"
            >
              <option value="" disabled>Seleziona ente</option>
              {entityOptions.map((entityName) => (
                <option key={entityName} value={entityName}>
                  {entityName}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md border-2 border-bordeaux bg-giallo px-1.5 py-0.5 text-xs leading-none text-bordeaux shadow-sm">
              <ChevronDown size={12} strokeWidth={2.8} />
            </span>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-2">
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <h2 className="text-sm font-bold text-giallo">Pasti</h2>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={removeMealRow}
                disabled={mealRows.length <= 0 || isFormDisabled}
                className="h-7 w-7 rounded-md border-2 border-bordeaux bg-giallo text-lg font-bold leading-none text-bordeaux shadow-sm transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Rimuovi riga pasto"
                title="Rimuovi riga pasto"
              >
                <Minus size={16} strokeWidth={2.8} className="mx-auto" />
              </button>
              <button
                type="button"
                onClick={addMealRow}
                disabled={isFormDisabled}
                className="h-7 w-7 rounded-md border-2 border-bordeaux bg-giallo text-lg font-bold leading-none text-bordeaux shadow-sm transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Aggiungi riga pasto"
                title="Aggiungi riga pasto"
              >
                <Plus size={16} strokeWidth={2.8} className="mx-auto" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-md border-2 border-bordeaux">
            <table className="min-w-full border-collapse">
              <thead className="text-xs">
                <tr className="bg-bordeaux text-giallo">
                  <th className="w-12 border border-amber-900 px-2 py-1.5 text-left font-bold">#</th>
                  <th className="w-56 border border-amber-900 px-2 py-1.5 text-left font-bold">Tipo</th>
                  <th colSpan={2} className="border border-amber-900 px-2 py-1.5 text-center font-bold">
                    Consegna
                  </th>
                </tr>
                <tr className="bg-amber-100/90 text-bordeaux">
                  <th className="border border-amber-900 px-2 py-1.5"></th>
                  <th className="border border-amber-900 px-2 py-1.5"></th>
                  <th className="w-28 border border-amber-900 px-2 py-1.5 text-center font-semibold">Mensa</th>
                  <th className="w-28 border border-amber-900 px-2 py-1.5 text-center font-semibold">Asporto</th>
                </tr>
              </thead>
              <tbody className="bg-sabbia text-xs text-bordeaux">
                {mealRows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="border border-amber-900 px-2 py-2 text-center text-[11px] text-bordeaux/80">
                      Inserisci il numero familiari per generare le righe dei pasti.
                    </td>
                  </tr>
                ) : (
                  mealRows.map((row, index) => (
                    <tr key={row.id}>
                      <td className="border border-amber-900 px-2 py-1.5 font-semibold">{index + 1}</td>
                      <td className="border border-amber-900 px-2 py-1.5">
                        <div className="relative">
                          <select
                            value={row.tipo}
                            onChange={(event) => updateMealType(row.id, event.target.value)}
                            disabled={isFormDisabled || mealTypeOptions.length === 0}
                            className="h-8 w-full appearance-none rounded-md border-2 border-bordeaux bg-sabbia pl-2 pr-8 text-xs font-semibold text-bordeaux outline-none"
                          >
                            {mealTypeOptions.map((mealType) => (
                              <option key={mealType} value={mealType}>
                                {mealType}
                              </option>
                            ))}
                          </select>
                          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-bordeaux">
                            <ChevronDown size={12} strokeWidth={2.8} />
                          </span>
                        </div>
                      </td>
                      <td className="border border-amber-900 px-2 py-1.5 text-center">
                        <input
                          type="radio"
                          name={`consegna-${row.id}`}
                          checked={row.consegna === "mensa"}
                          onChange={() => updateMealDelivery(row.id, "mensa")}
                          disabled={isFormDisabled}
                          className="h-4 w-4 accent-bordeaux"
                        />
                      </td>
                      <td className="border border-amber-900 px-2 py-1.5 text-center">
                        <input
                          type="radio"
                          name={`consegna-${row.id}`}
                          checked={row.consegna === "asporto"}
                          onChange={() => updateMealDelivery(row.id, "asporto")}
                          disabled={isFormDisabled}
                          className="h-4 w-4 accent-bordeaux"
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-span-1 flex justify-end pt-2 lg:col-span-2">
          <button
            type="submit"
            className="h-10 rounded-md bg-amber-900 px-5 text-sm font-bold text-white shadow-lg transition-all hover:bg-amber-800 active:scale-95"
          >
            Salva
          </button>
        </div>

        {submitNotice ? (
          <p className="col-span-1 text-right text-xs font-semibold text-green-300 lg:col-span-2">
            {submitNotice}
          </p>
        ) : null}
      </form>

      {isMealWarningOpen ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/65">
          <div className="mx-4 w-full max-w-xl rounded-xl border-2 border-red-800 bg-amber-950 p-5 shadow-2xl">
            <h2 className="text-lg font-bold text-giallo">Attenzione</h2>
            <p className="mt-3 text-bianco">
              Hai selezionato meno pasti del numero dei famigliari.
            </p>
            <p className="mt-1 text-sm font-semibold text-red-300">
              Sei sicura/o di voler continuare?
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsMealWarningOpen(false)}
                className="rounded-md border-2 border-amber-950 bg-[linear-gradient(180deg,#fff6df_0%,#f1c97b_30%,#bd7b36_100%)] px-4 py-1.5 text-sm font-bold text-amber-950 shadow-[0_4px_0_0_#5c3417]"
              >
                Annulla
              </button>
              <button
                type="button"
                onClick={handleConfirmContinue}
                className="rounded-md border-2 border-red-950 bg-[linear-gradient(180deg,#ffdcdc_0%,#f38585_30%,#b93535_100%)] px-4 py-1.5 text-sm font-bold text-red-950 shadow-[0_4px_0_0_#5c1717]"
              >
                Continua
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
