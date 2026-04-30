import { useState, type FormEvent } from "react";
import { RicercaTabella } from "./RicercaTabella";

type MovimentoPrelievo = {
  id: string;
  data: string;
  destinazione: string;
  prodotto: string;
  quantita: number;
  operatore: string;
  motivo: string;
};

const columns = ["Data", "Destinazione", "Prodotto", "Qta", "Operatore", "Motivo"];

const scorteIniziali: Record<string, number> = {
  "Pasta penne": 80,
  "Passata pomodoro": 12,
  Riso: 6,
  Ceci: 35,
};

const movimentiIniziali: MovimentoPrelievo[] = [
  {
    id: "1",
    data: "2026-04-19",
    destinazione: "Cucina centrale",
    prodotto: "Pasta penne",
    quantita: 8,
    operatore: "Luca M.",
    motivo: "Preparazione pranzo",
  },
  {
    id: "2",
    data: "2026-04-18",
    destinazione: "Punto Savena",
    prodotto: "Passata pomodoro",
    quantita: 4,
    operatore: "Sara D.",
    motivo: "Distribuzione pacchi",
  },
];

export function GestionePrelievo() {
  const [scorte, setScorte] = useState<Record<string, number>>(scorteIniziali);
  const [movimenti, setMovimenti] = useState<MovimentoPrelievo[]>(movimentiIniziali);
  const [searchTerm, setSearchTerm] = useState("");
  const [notice, setNotice] = useState("");
  const [errorNotice, setErrorNotice] = useState("");
  const [formData, setFormData] = useState({
    data: new Date().toISOString().slice(0, 10),
    destinazione: "Cucina centrale",
    prodotto: "Pasta penne",
    quantita: "",
    operatore: "",
    motivo: "",
  });

  const searchValue = searchTerm.trim().toLowerCase();
  const disponibilitaProdotto = scorte[formData.prodotto] ?? 0;

  const filteredMovimenti = movimenti
    .filter((movimento) =>
      `${movimento.prodotto} ${movimento.destinazione} ${movimento.operatore} ${movimento.motivo}`
        .toLowerCase()
        .includes(searchValue)
    )
    .sort((a, b) => b.data.localeCompare(a.data));

  const rows = filteredMovimenti.map((movimento) => ({
    id: movimento.id,
    data: [
      movimento.data,
      movimento.destinazione,
      movimento.prodotto,
      String(movimento.quantita),
      movimento.operatore,
      movimento.motivo,
    ],
  }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice("");
    setErrorNotice("");

    const quantityNumber = Number(formData.quantita);
    if (
      !formData.prodotto.trim() ||
      !formData.destinazione.trim() ||
      !formData.operatore.trim() ||
      !formData.motivo.trim() ||
      Number.isNaN(quantityNumber) ||
      quantityNumber <= 0
    ) {
      setErrorNotice("Compila tutti i campi obbligatori con valori validi.");
      return;
    }

    if (quantityNumber > disponibilitaProdotto) {
      setErrorNotice(
        `Quantità non disponibile: richiesti ${quantityNumber}, disponibili ${disponibilitaProdotto}.`
      );
      return;
    }

    const nuovoMovimento: MovimentoPrelievo = {
      id: String(Date.now()),
      data: formData.data,
      destinazione: formData.destinazione,
      prodotto: formData.prodotto,
      quantita: quantityNumber,
      operatore: formData.operatore.trim(),
      motivo: formData.motivo.trim(),
    };

    setMovimenti((current) => [nuovoMovimento, ...current]);
    setScorte((current) => ({
      ...current,
      [formData.prodotto]: (current[formData.prodotto] ?? 0) - quantityNumber,
    }));
    setNotice("Prelievo registrato con successo.");
    setFormData((current) => ({
      ...current,
      quantita: "",
      operatore: "",
      motivo: "",
    }));
  };

  return (
    <div className="w-full">
      <div
        className="table-panel top-0 ml-4 mt-6 w-full p-6 shadow-2xl"
      >
        <h1 className="text-2xl font-bold text-giallo">Prelievo Magazzino</h1>
        <p className="pt-1 text-sm font-semibold text-bianco/85">
          Registra le uscite e verifica la disponibilità prima del prelievo.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {Object.entries(scorte).map(([prodotto, quantita]) => (
            <div key={prodotto} className="rounded-lg border border-amber-900 bg-black/35 p-3">
              <p className="text-xs font-semibold text-giallo/80">{prodotto}</p>
              <p className="mt-1 text-lg font-bold text-bianco">{quantita}</p>
            </div>
          ))}
        </div>

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
            value={formData.destinazione}
            onChange={(event) =>
              setFormData((current) => ({ ...current, destinazione: event.target.value }))
            }
            className="h-10 rounded-md border-2 border-bordeaux bg-sabbia px-2.5 text-sm text-bordeaux outline-none"
          >
            <option value="Cucina centrale">Cucina centrale</option>
            <option value="Punto Savena">Punto Savena</option>
            <option value="Punto Saffi">Punto Saffi</option>
            <option value="Punto Battiferro">Punto Battiferro</option>
          </select>
          <select
            value={formData.prodotto}
            onChange={(event) => setFormData((current) => ({ ...current, prodotto: event.target.value }))}
            className="h-10 rounded-md border-2 border-bordeaux bg-sabbia px-2.5 text-sm text-bordeaux outline-none"
          >
            {Object.keys(scorte).map((prodotto) => (
              <option key={prodotto} value={prodotto}>
                {prodotto}
              </option>
            ))}
          </select>
          <input
            type="number"
            min={1}
            value={formData.quantita}
            onChange={(event) => setFormData((current) => ({ ...current, quantita: event.target.value }))}
            placeholder={`Quantità (disp. ${disponibilitaProdotto})`}
            className="h-10 rounded-md border-2 border-bordeaux bg-sabbia px-2.5 text-sm text-bordeaux outline-none"
          />
          <input
            type="text"
            value={formData.operatore}
            onChange={(event) => setFormData((current) => ({ ...current, operatore: event.target.value }))}
            placeholder="Operatore"
            className="h-10 rounded-md border-2 border-bordeaux bg-sabbia px-2.5 text-sm text-bordeaux outline-none"
          />
          <input
            type="text"
            value={formData.motivo}
            onChange={(event) => setFormData((current) => ({ ...current, motivo: event.target.value }))}
            placeholder="Motivo prelievo"
            className="h-10 rounded-md border-2 border-bordeaux bg-sabbia px-2.5 text-sm text-bordeaux outline-none"
          />
          <div className="lg:col-span-3 flex justify-end">
            <button
              type="submit"
              className="h-10 rounded-md bg-amber-900 px-6 text-sm font-bold text-white shadow-lg transition-colors hover:bg-amber-800"
            >
              Registra Prelievo
            </button>
          </div>
        </form>
      </div>

      <RicercaTabella
        title="Storico Prelievi"
        columns={columns}
        rows={rows}
        onSearchChange={setSearchTerm}
        searchLabel="Cerca prelievo"
        searchPlaceholder="prodotto, destinazione, operatore"
        showNewButton={false}
      />
    </div>
  );
}
