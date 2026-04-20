import { useState, type FormEvent } from "react";
import { RicercaTabella } from "./RicercaTabella";

type MovimentoStoccaggio = {
  id: string;
  data: string;
  fonte: string;
  prodotto: string;
  quantita: number;
  unitaMisura: "pz" | "kg" | "lt";
  lotto: string;
  scadenza: string;
  ubicazione: string;
  operatore: string;
};

const columns = [
  "Data",
  "Fonte",
  "Prodotto",
  "Qta",
  "UM",
  "Lotto",
  "Scadenza",
  "Ubicazione",
  "Operatore",
];

const movimentiIniziali: MovimentoStoccaggio[] = [
  {
    id: "1",
    data: "2026-04-18",
    fonte: "Donazione",
    prodotto: "Pasta penne",
    quantita: 30,
    unitaMisura: "kg",
    lotto: "PEN2604A",
    scadenza: "2027-11-06",
    ubicazione: "Scaffale A1",
    operatore: "Mario R.",
  },
  {
    id: "2",
    data: "2026-04-16",
    fonte: "Acquisto",
    prodotto: "Passata pomodoro",
    quantita: 24,
    unitaMisura: "pz",
    lotto: "PAS2604B",
    scadenza: "2026-11-01",
    ubicazione: "Scaffale B2",
    operatore: "Giulia F.",
  },
];

export function GestioneStoccaggio() {
  const [movimenti, setMovimenti] = useState<MovimentoStoccaggio[]>(movimentiIniziali);
  const [searchTerm, setSearchTerm] = useState("");
  const [notice, setNotice] = useState("");
  const [errorNotice, setErrorNotice] = useState("");
  const [formData, setFormData] = useState({
    data: new Date().toISOString().slice(0, 10),
    fonte: "Donazione",
    prodotto: "",
    quantita: "",
    unitaMisura: "pz" as MovimentoStoccaggio["unitaMisura"],
    lotto: "",
    scadenza: "",
    ubicazione: "",
    operatore: "",
  });

  const searchValue = searchTerm.trim().toLowerCase();

  const filteredMovimenti = movimenti
    .filter((movimento) =>
      `${movimento.prodotto} ${movimento.fonte} ${movimento.ubicazione} ${movimento.operatore}`
        .toLowerCase()
        .includes(searchValue)
    )
    .sort((a, b) => b.data.localeCompare(a.data));

  const rows = filteredMovimenti.map((movimento) => ({
    id: movimento.id,
    data: [
      movimento.data,
      movimento.fonte,
      movimento.prodotto,
      String(movimento.quantita),
      movimento.unitaMisura,
      movimento.lotto,
      movimento.scadenza || "-",
      movimento.ubicazione,
      movimento.operatore,
    ],
  }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice("");
    setErrorNotice("");

    const quantityNumber = Number(formData.quantita);
    if (
      !formData.prodotto.trim() ||
      !formData.lotto.trim() ||
      !formData.ubicazione.trim() ||
      !formData.operatore.trim() ||
      Number.isNaN(quantityNumber) ||
      quantityNumber <= 0
    ) {
      setErrorNotice("Compila tutti i campi obbligatori con valori validi.");
      return;
    }

    const nuovoMovimento: MovimentoStoccaggio = {
      id: String(Date.now()),
      data: formData.data,
      fonte: formData.fonte,
      prodotto: formData.prodotto.trim(),
      quantita: quantityNumber,
      unitaMisura: formData.unitaMisura,
      lotto: formData.lotto.trim(),
      scadenza: formData.scadenza,
      ubicazione: formData.ubicazione.trim(),
      operatore: formData.operatore.trim(),
    };

    setMovimenti((current) => [nuovoMovimento, ...current]);
    setNotice("Movimento di stoccaggio registrato con successo.");
    setFormData((current) => ({
      ...current,
      prodotto: "",
      quantita: "",
      lotto: "",
      scadenza: "",
      ubicazione: "",
      operatore: "",
    }));
  };

  return (
    <div className="w-full">
      <div
        className="top-0 ml-4 mt-6 w-full rounded-2xs border-12 border-t-amber-900 border-b-amber-900 border-l-amber-800 border-r-amber-800 p-6 shadow-2xl"
        style={{
          backgroundColor: "#0a0a0a",
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.03) 0%, transparent 40%)",
        }}
      >
        <h1 className="text-2xl font-bold text-giallo">Stoccaggio Magazzino</h1>
        <p className="pt-1 text-sm font-semibold text-bianco/85">
          Registra entrate di merce (donazioni o acquisti).
        </p>
        {errorNotice ? <p className="pt-3 text-sm font-semibold text-red-400">{errorNotice}</p> : null}
        {notice ? <p className="pt-3 text-sm font-semibold text-green-400">{notice}</p> : null}

        <form onSubmit={handleSubmit} className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <input
            type="date"
            value={formData.data}
            onChange={(event) => setFormData((current) => ({ ...current, data: event.target.value }))}
            className="h-10 rounded-md border-2 border-bordeaux bg-sabbia px-2.5 text-sm text-bordeaux outline-none"
          />
          <select
            value={formData.fonte}
            onChange={(event) => setFormData((current) => ({ ...current, fonte: event.target.value }))}
            className="h-10 rounded-md border-2 border-bordeaux bg-sabbia px-2.5 text-sm text-bordeaux outline-none"
          >
            <option value="Donazione">Donazione</option>
            <option value="Acquisto">Acquisto</option>
            <option value="Recupero">Recupero</option>
          </select>
          <input
            type="text"
            value={formData.prodotto}
            onChange={(event) => setFormData((current) => ({ ...current, prodotto: event.target.value }))}
            placeholder="Prodotto"
            className="h-10 rounded-md border-2 border-bordeaux bg-sabbia px-2.5 text-sm text-bordeaux outline-none"
          />
          <input
            type="number"
            min={1}
            value={formData.quantita}
            onChange={(event) => setFormData((current) => ({ ...current, quantita: event.target.value }))}
            placeholder="Quantità"
            className="h-10 rounded-md border-2 border-bordeaux bg-sabbia px-2.5 text-sm text-bordeaux outline-none"
          />
          <select
            value={formData.unitaMisura}
            onChange={(event) =>
              setFormData((current) => ({
                ...current,
                unitaMisura: event.target.value as MovimentoStoccaggio["unitaMisura"],
              }))
            }
            className="h-10 rounded-md border-2 border-bordeaux bg-sabbia px-2.5 text-sm text-bordeaux outline-none"
          >
            <option value="pz">pz</option>
            <option value="kg">kg</option>
            <option value="lt">lt</option>
          </select>
          <input
            type="text"
            value={formData.lotto}
            onChange={(event) => setFormData((current) => ({ ...current, lotto: event.target.value }))}
            placeholder="Lotto"
            className="h-10 rounded-md border-2 border-bordeaux bg-sabbia px-2.5 text-sm text-bordeaux outline-none"
          />
          <input
            type="date"
            value={formData.scadenza}
            onChange={(event) => setFormData((current) => ({ ...current, scadenza: event.target.value }))}
            className="h-10 rounded-md border-2 border-bordeaux bg-sabbia px-2.5 text-sm text-bordeaux outline-none"
          />
          <input
            type="text"
            value={formData.ubicazione}
            onChange={(event) => setFormData((current) => ({ ...current, ubicazione: event.target.value }))}
            placeholder="Ubicazione"
            className="h-10 rounded-md border-2 border-bordeaux bg-sabbia px-2.5 text-sm text-bordeaux outline-none"
          />
          <input
            type="text"
            value={formData.operatore}
            onChange={(event) => setFormData((current) => ({ ...current, operatore: event.target.value }))}
            placeholder="Operatore"
            className="h-10 rounded-md border-2 border-bordeaux bg-sabbia px-2.5 text-sm text-bordeaux outline-none"
          />
          <div className="lg:col-span-3 flex justify-end">
            <button
              type="submit"
              className="h-10 rounded-md bg-amber-900 px-6 text-sm font-bold text-white shadow-lg transition-colors hover:bg-amber-800"
            >
              Registra Carico
            </button>
          </div>
        </form>
      </div>

      <RicercaTabella
        title="Storico Stoccaggi"
        columns={columns}
        rows={rows}
        onSearchChange={setSearchTerm}
        searchLabel="Cerca movimento"
        searchPlaceholder="prodotto, fonte, operatore"
        showNewButton={false}
      />
    </div>
  );
}
